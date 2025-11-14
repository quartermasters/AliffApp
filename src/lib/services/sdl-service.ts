/**
 * SDL Service
 *
 * Bridges the existing SDL orchestrator with the Business Dashboard
 */

import { prisma } from '@/lib/prisma';
import { runTriage } from '@/lib/aliff/sdl/triage/orchestrator';
import { orchestrate } from '@/lib/aliff/orchestration/orchestrator';
import type { TriageResult } from '@/lib/aliff/sdl/triage/types';

/**
 * Start SDL processing for a project
 */
export async function startSDLProcessing(
  projectId: string,
  documentBuffer: Buffer,
  documentFilename: string
) {
  try {
    // Update project status
    await prisma.project.update({
      where: { id: projectId },
      data: {
        sdlStatus: 'PHASE1_TRIAGE',
        currentStage: 'SDL_PROCESSING',
      },
    });

    // Run SDL Triage (Phase 1)
    console.log(`[SDL Service] Starting triage for project ${projectId}`);
    const triageResult = await runTriage(documentBuffer, documentFilename, {
      detailLevel: 'comprehensive', // Use highest detail level
      useAI: true,
      parallelProcessing: true,
    });

    // Store triage results
    await storeTriageResults(projectId, triageResult);

    // Update project with SDL results
    await prisma.project.update({
      where: { id: projectId },
      data: {
        sdlStatus: 'PHASE1_TRIAGE',
        sdlComplexityScore: triageResult.scoring.complexity.overall,
        sdlWinProbability: triageResult.scoring.winProbability.overall,
        sdlTriageResultId: triageResult.id,
      },
    });

    console.log(`[SDL Service] Triage complete for project ${projectId}`);
    return triageResult;
  } catch (error) {
    console.error(`[SDL Service] Error processing project ${projectId}:`, error);

    // Update project with error status
    await prisma.project.update({
      where: { id: projectId },
      data: {
        currentStage: 'PENDING_REVIEW',
      },
    });

    throw error;
  }
}

/**
 * Store triage results in SDL task records
 */
async function storeTriageResults(
  projectId: string,
  triageResult: TriageResult
) {
  // Phase 1 tasks (1-11) are completed during triage
  const phase1Tasks = await prisma.sDLTask.findMany({
    where: {
      projectId,
      taskPhase: 'PHASE1_TRIAGE',
    },
    orderBy: { taskNumber: 'asc' },
  });

  // Map triage results to task results
  const taskResults = [
    {
      taskNumber: 1,
      result: { document: triageResult.document },
      confidence: 95,
    },
    {
      taskNumber: 2,
      result: { metadata: triageResult.metadata },
      confidence: triageResult.metadata.confidence.overall,
    },
    {
      taskNumber: 5,
      result: { requirements: triageResult.requirements },
      confidence: 90,
    },
    {
      taskNumber: 7,
      result: { compliance: triageResult.compliance },
      confidence: 85,
    },
    {
      taskNumber: 10,
      result: { complexity: triageResult.scoring.complexity },
      confidence: triageResult.scoring.complexity.confidence,
    },
  ];

  // Update tasks with results
  for (const taskResult of taskResults) {
    const task = phase1Tasks.find((t) => t.taskNumber === taskResult.taskNumber);
    if (task) {
      await prisma.sDLTask.update({
        where: { id: task.id },
        data: {
          status: 'COMPLETED',
          primaryResult: taskResult.result,
          confidenceScore: taskResult.confidence,
          completedAt: new Date(),
        },
      });
    }
  }

  // Mark remaining Phase 1 tasks as completed
  await prisma.sDLTask.updateMany({
    where: {
      projectId,
      taskPhase: 'PHASE1_TRIAGE',
      status: 'PENDING',
    },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
    },
  });
}

/**
 * Execute Phase 2: Strategic Intelligence
 */
export async function executePhase2StrategicIntel(projectId: string) {
  try {
    // Update project status
    await prisma.project.update({
      where: { id: projectId },
      data: {
        sdlStatus: 'PHASE2_STRATEGIC_INTEL',
      },
    });

    // Get Phase 2 tasks
    const phase2Tasks = await prisma.sDLTask.findMany({
      where: {
        projectId,
        taskPhase: 'PHASE2_STRATEGIC_INTEL',
      },
      orderBy: { taskNumber: 'asc' },
    });

    // Execute tasks that require multi-AI consensus
    const criticalTasks = phase2Tasks.filter((t) => t.requiresMultiAI);

    for (const task of criticalTasks) {
      await executeMultiAITask(task.id, projectId);
    }

    // Execute remaining tasks
    const standardTasks = phase2Tasks.filter((t) => !t.requiresMultiAI);

    for (const task of standardTasks) {
      await executeSingleAITask(task.id);
    }

    console.log(`[SDL Service] Phase 2 complete for project ${projectId}`);
  } catch (error) {
    console.error(`[SDL Service] Error in Phase 2 for project ${projectId}:`, error);
    throw error;
  }
}

/**
 * Execute multi-AI task with consensus
 */
async function executeMultiAITask(taskId: string, projectId: string) {
  const task = await prisma.sDLTask.findUnique({
    where: { id: taskId },
    include: {
      project: {
        include: {
          documents: {
            where: { documentType: 'RFP_MAIN' },
            take: 1,
          },
        },
      },
    },
  });

  if (!task) return;

  // Update task status
  await prisma.sDLTask.update({
    where: { id: taskId },
    data: {
      status: 'PROCESSING',
      startedAt: new Date(),
    },
  });

  try {
    // Build prompt based on task
    const prompt = buildTaskPrompt(task.taskName, task.project);

    // Execute with multiple AIs
    const primaryResult = await orchestrate({
      prompt,
      models: [task.primaryAI.toLowerCase() as any],
      strategy: 'single',
    });

    const secondaryResult = task.secondaryAI
      ? await orchestrate({
          prompt,
          models: [task.secondaryAI.toLowerCase() as any],
          strategy: 'single',
        })
      : null;

    // Build consensus
    const consensus = await buildConsensus(
      task.taskName,
      primaryResult.primary.content,
      secondaryResult?.primary.content
    );

    // Store consensus log
    await prisma.consensusLog.create({
      data: {
        sdlTaskId: taskId,
        projectId,
        taskName: task.taskName,
        gpt5Output: task.primaryAI === 'OPENAI' ? primaryResult.primary : null,
        claudeOutput: task.primaryAI === 'CLAUDE' ? primaryResult.primary : null,
        geminiOutput: task.primaryAI === 'GEMINI' ? primaryResult.primary : null,
        consensusType: consensus.type,
        consensusConfidence: consensus.confidence,
        finalResult: consensus.result,
        escalatedToHuman: consensus.escalate,
      },
    });

    // Update task
    await prisma.sDLTask.update({
      where: { id: taskId },
      data: {
        status: consensus.escalate ? 'ESCALATED_TO_HUMAN' : 'COMPLETED',
        primaryResult: primaryResult.primary,
        secondaryResult: secondaryResult?.primary || null,
        consensusResult: consensus.result,
        confidenceScore: consensus.confidence,
        completedAt: consensus.escalate ? null : new Date(),
      },
    });
  } catch (error) {
    console.error(`[SDL Service] Error executing task ${taskId}:`, error);

    await prisma.sDLTask.update({
      where: { id: taskId },
      data: {
        status: 'FAILED',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
}

/**
 * Execute single AI task
 */
async function executeSingleAITask(taskId: string) {
  const task = await prisma.sDLTask.findUnique({
    where: { id: taskId },
    include: {
      project: {
        include: {
          documents: {
            where: { documentType: 'RFP_MAIN' },
            take: 1,
          },
        },
      },
    },
  });

  if (!task) return;

  await prisma.sDLTask.update({
    where: { id: taskId },
    data: {
      status: 'PROCESSING',
      startedAt: new Date(),
    },
  });

  try {
    const prompt = buildTaskPrompt(task.taskName, task.project);

    const result = await orchestrate({
      prompt,
      models: [task.primaryAI.toLowerCase() as any],
      strategy: 'single',
    });

    await prisma.sDLTask.update({
      where: { id: taskId },
      data: {
        status: 'COMPLETED',
        primaryResult: result.primary,
        confidenceScore: 85, // Default confidence for single AI
        completedAt: new Date(),
      },
    });
  } catch (error) {
    console.error(`[SDL Service] Error executing task ${taskId}:`, error);

    await prisma.sDLTask.update({
      where: { id: taskId },
      data: {
        status: 'FAILED',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
}

/**
 * Build task prompt based on task name and project data
 */
function buildTaskPrompt(taskName: string, project: any): string {
  const baseContext = `
Project: ${project.title}
Client: ${project.clientName}
Industry: ${project.industryCategory || 'Not specified'}
Contract Value: ${project.contractValue ? `$${project.contractValue}` : 'Not specified'}
  `;

  const taskPrompts: Record<string, string> = {
    'Why is this being re-competed NOW?': `
${baseContext}

Analyze why this contract is being re-competed at this time. Consider:
1. Timeline and urgency indicators
2. Incumbent performance issues (if any)
3. Budget cycle timing
4. Policy or leadership changes
5. Operational drivers

Provide strategic insight on the timing of this procurement.
    `,
    'Unstated requirement detection': `
${baseContext}

Identify requirements that are implied but not explicitly stated in the RFP:
1. Operational constraints (security clearances, facility access, etc.)
2. Technical dependencies
3. Timeline constraints
4. Relationship requirements
5. Unstated preferences

Focus on "what they need but can't write" in the RFP.
    `,
    'Win probability assessment': `
${baseContext}

Assess the win probability for this opportunity considering:
1. Alignment with our capabilities
2. Competitive landscape
3. Relationship strength
4. Past performance relevance
5. Pricing competitiveness

Provide a percentage (0-100%) with detailed rationale.
    `,
  };

  return taskPrompts[taskName] || `Analyze the following for: ${taskName}\n\n${baseContext}`;
}

/**
 * Build consensus from multiple AI outputs
 */
async function buildConsensus(
  taskName: string,
  primaryOutput: string,
  secondaryOutput?: string | null
): Promise<{
  type: 'FULL_CONSENSUS' | 'MAJORITY_CONSENSUS' | 'SPLIT_DECISION' | 'LOW_CONFIDENCE';
  confidence: number;
  result: any;
  escalate: boolean;
}> {
  if (!secondaryOutput) {
    // Single AI - no consensus needed
    return {
      type: 'FULL_CONSENSUS',
      confidence: 85,
      result: { analysis: primaryOutput },
      escalate: false,
    };
  }

  // Use AI to analyze consensus
  const consensusAnalysis = await orchestrate({
    prompt: `
Compare these two AI analyses and determine consensus:

Analysis 1:
${primaryOutput}

Analysis 2:
${secondaryOutput}

Provide:
1. Consensus type (FULL, MAJORITY, or SPLIT)
2. Confidence score (0-100)
3. Synthesized result
4. Whether human review is needed (true/false)

Format as JSON:
{
  "consensusType": "FULL_CONSENSUS",
  "confidence": 85,
  "synthesizedResult": "...",
  "needsHumanReview": false
}
    `,
    models: ['gpt-4'],
    strategy: 'single',
  });

  try {
    const parsed = JSON.parse(consensusAnalysis.primary.content);

    return {
      type: parsed.consensusType || 'MAJORITY_CONSENSUS',
      confidence: parsed.confidence || 75,
      result: {
        primary: primaryOutput,
        secondary: secondaryOutput,
        synthesized: parsed.synthesizedResult,
      },
      escalate: parsed.needsHumanReview || parsed.confidence < 70,
    };
  } catch (error) {
    // Fallback if parsing fails
    return {
      type: 'SPLIT_DECISION',
      confidence: 60,
      result: {
        primary: primaryOutput,
        secondary: secondaryOutput,
      },
      escalate: true,
    };
  }
}

/**
 * Get SDL progress summary
 */
export async function getSDLProgress(projectId: string) {
  const tasks = await prisma.sDLTask.findMany({
    where: { projectId },
    include: {
      consensusLogs: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
  const failedTasks = tasks.filter((t) => t.status === 'FAILED').length;
  const escalatedTasks = tasks.filter((t) => t.status === 'ESCALATED_TO_HUMAN').length;

  return {
    totalTasks,
    completedTasks,
    failedTasks,
    escalatedTasks,
    progressPercentage: Math.round((completedTasks / totalTasks) * 100),
    tasks,
  };
}
