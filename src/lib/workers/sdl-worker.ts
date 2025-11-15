/**
 * SDL Task Execution Worker
 *
 * Background worker that processes SDL tasks in queue
 * Can be triggered via cron job, webhook, or manual execution
 */

import { prisma } from '@/lib/prisma';
import { executePhase2StrategicIntel, getSDLProgress } from '@/lib/services/sdl-service';

/**
 * Main worker function
 * Processes pending SDL tasks across all active projects
 */
export async function processSDLTasks() {
  console.log('[SDL Worker] Starting SDL task processing...');

  try {
    // Find all projects with active SDL processing
    const activeProjects = await prisma.project.findMany({
      where: {
        sdlStatus: {
          in: ['PHASE1_TRIAGE', 'PHASE2_STRATEGIC_INTEL', 'PHASE3_WIN_STRATEGY'],
        },
        currentStage: 'SDL_PROCESSING',
      },
      include: {
        sdlTasks: {
          where: {
            status: {
              in: ['PENDING', 'PROCESSING'],
            },
          },
          orderBy: {
            taskNumber: 'asc',
          },
        },
      },
    });

    console.log(`[SDL Worker] Found ${activeProjects.length} active projects`);

    for (const project of activeProjects) {
      await processProjectTasks(project.id);
    }

    console.log('[SDL Worker] Processing complete');
  } catch (error) {
    console.error('[SDL Worker] Error processing SDL tasks:', error);
    throw error;
  }
}

/**
 * Process SDL tasks for a specific project
 */
async function processProjectTasks(projectId: string) {
  console.log(`[SDL Worker] Processing project ${projectId}`);

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        sdlTasks: {
          where: {
            status: 'PENDING',
          },
          orderBy: {
            taskNumber: 'asc',
          },
          take: 5, // Process 5 tasks at a time
        },
      },
    });

    if (!project) {
      console.log(`[SDL Worker] Project ${projectId} not found`);
      return;
    }

    // Phase 1 tasks are handled by triage orchestrator
    // Here we handle Phase 2 and Phase 3

    if (project.sdlStatus === 'PHASE2_STRATEGIC_INTEL') {
      console.log(`[SDL Worker] Executing Phase 2 for project ${projectId}`);
      await executePhase2StrategicIntel(projectId);

      // Check if Phase 2 is complete
      const phase2Progress = await getPhase2Progress(projectId);
      if (phase2Progress.completed === phase2Progress.total) {
        console.log(`[SDL Worker] Phase 2 complete, moving to Phase 3`);
        await prisma.project.update({
          where: { id: projectId },
          data: { sdlStatus: 'PHASE3_WIN_STRATEGY' },
        });
      }
    }

    if (project.sdlStatus === 'PHASE3_WIN_STRATEGY') {
      console.log(`[SDL Worker] Executing Phase 3 for project ${projectId}`);
      await executePhase3WinStrategy(projectId);

      // Check if Phase 3 is complete
      const phase3Progress = await getPhase3Progress(projectId);
      if (phase3Progress.completed === phase3Progress.total) {
        console.log(`[SDL Worker] Phase 3 complete, SDL processing finished`);
        await prisma.project.update({
          where: { id: projectId },
          data: {
            sdlStatus: 'PHASE3_WIN_STRATEGY',
            currentStage: 'RECRUITER_HIRING',
          },
        });

        // Trigger ALIFF-RECRUITER integration
        await triggerALIFFRecruiter(projectId);
      }
    }

    console.log(`[SDL Worker] Finished processing project ${projectId}`);
  } catch (error) {
    console.error(`[SDL Worker] Error processing project ${projectId}:`, error);

    // Update project with error
    await prisma.project.update({
      where: { id: projectId },
      data: {
        currentStage: 'PENDING_REVIEW',
      },
    });
  }
}

/**
 * Execute Phase 3: Win Strategy
 */
async function executePhase3WinStrategy(projectId: string) {
  const phase3Tasks = await prisma.sDLTask.findMany({
    where: {
      projectId,
      taskPhase: 'PHASE3_WIN_STRATEGY',
      status: 'PENDING',
    },
    orderBy: { taskNumber: 'asc' },
    take: 3, // Process 3 tasks at a time
  });

  console.log(`[SDL Worker] Found ${phase3Tasks.length} Phase 3 tasks to process`);

  for (const task of phase3Tasks) {
    try {
      // Note: executeMultiAITask and executeSingleAITask are private functions
      // in sdl-service.ts. For now, we'll mark tasks as processing and they'll
      // be picked up by the service layer.
      // TODO: Refactor sdl-service to expose these functions or move them here

      await prisma.sDLTask.update({
        where: { id: task.id },
        data: {
          status: 'PROCESSING',
          startedAt: new Date(),
        },
      });

      console.log(`[SDL Worker] Marked task ${task.id} as processing`);
    } catch (error) {
      console.error(`[SDL Worker] Error executing task ${task.id}:`, error);

      await prisma.sDLTask.update({
        where: { id: task.id },
        data: {
          status: 'FAILED',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  }
}

/**
 * Get Phase 2 progress
 */
async function getPhase2Progress(projectId: string) {
  const tasks = await prisma.sDLTask.findMany({
    where: {
      projectId,
      taskPhase: 'PHASE2_STRATEGIC_INTEL',
    },
  });

  return {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'COMPLETED').length,
    failed: tasks.filter((t) => t.status === 'FAILED').length,
    escalated: tasks.filter((t) => t.status === 'ESCALATED_TO_HUMAN').length,
  };
}

/**
 * Get Phase 3 progress
 */
async function getPhase3Progress(projectId: string) {
  const tasks = await prisma.sDLTask.findMany({
    where: {
      projectId,
      taskPhase: 'PHASE3_WIN_STRATEGY',
    },
  });

  return {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'COMPLETED').length,
    failed: tasks.filter((t) => t.status === 'FAILED').length,
    escalated: tasks.filter((t) => t.status === 'ESCALATED_TO_HUMAN').length,
  };
}

/**
 * Trigger ALIFF-RECRUITER integration
 * When SDL completes, automatically create job postings for required specialists
 */
async function triggerALIFFRecruiter(projectId: string) {
  console.log(`[SDL Worker] Triggering ALIFF-RECRUITER for project ${projectId}`);

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        sdlTasks: {
          where: {
            taskName: {
              contains: 'specialist',
            },
          },
        },
      },
    });

    if (!project) return;

    // Extract specialist requirements from SDL tasks
    const specialistRequirements = extractSpecialistRequirements(project.sdlTasks);

    // Create job postings for each required specialist
    for (const requirement of specialistRequirements) {
      await createJobPosting(projectId, requirement);
    }

    console.log(`[SDL Worker] Created ${specialistRequirements.length} job postings`);
  } catch (error) {
    console.error(`[SDL Worker] Error triggering ALIFF-RECRUITER:`, error);
  }
}

/**
 * Extract specialist requirements from SDL task results
 */
function extractSpecialistRequirements(tasks: any[]): Array<{
  role: string;
  skills: string[];
  experience: string;
}> {
  const requirements: Array<{
    role: string;
    skills: string[];
    experience: string;
  }> = [];

  // Default specialists for GOVCON/SLED proposals
  requirements.push({
    role: 'Proposal Manager',
    skills: ['Proposal Writing', 'Government Contracting', 'Project Management'],
    experience: '5+ years in federal proposal management',
  });

  requirements.push({
    role: 'Technical Writer',
    skills: ['Technical Writing', 'Compliance', 'Editing'],
    experience: '3+ years in technical documentation',
  });

  requirements.push({
    role: 'Past Performance Analyst',
    skills: ['Research', 'Analysis', 'Government Contracts'],
    experience: '2+ years in contract analysis',
  });

  // TODO: Parse SDL task results to extract additional specialist requirements
  // based on complexity, industry, etc.

  return requirements;
}

/**
 * Create job posting for ALIFF-RECRUITER
 */
async function createJobPosting(
  projectId: string,
  requirement: { role: string; skills: string[]; experience: string }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) return;

    // Create job posting
    const slug = `${requirement.role.toLowerCase().replace(/\s+/g, '-')}-${project.projectCode.toLowerCase()}`;

    const jobPosting = await prisma.jobPosting.create({
      data: {
        title: `${requirement.role} - ${project.projectCodename || project.title}`,
        slug,
        description: `We are seeking a ${requirement.role} for a ${project.industryCategory || 'government'} contract proposal.`,
        requirements: requirement.experience,
        responsibilities: `- ${requirement.skills.join('\n- ')}\n- Collaborate with project team\n- Meet project deadlines`,
        type: 'CONTRACT',
        status: 'PUBLISHED',
        location: 'REMOTE',
        department: 'Proposal Development',
        createdBy: project.createdBy,
      },
    });

    console.log(`[SDL Worker] Created job posting: ${jobPosting.id} for ${requirement.role}`);

    // TODO: Trigger ALIFF-RECRUITER AI to start sourcing candidates
    // This would integrate with the CV Bank and start matching

  } catch (error) {
    console.error(`[SDL Worker] Error creating job posting:`, error);
  }
}

/**
 * Manual trigger for specific project
 */
export async function processProjectSDL(projectId: string) {
  console.log(`[SDL Worker] Manual trigger for project ${projectId}`);
  await processProjectTasks(projectId);
}

/**
 * Health check - returns worker status
 */
export async function getWorkerStatus() {
  const activeProjects = await prisma.project.count({
    where: {
      sdlStatus: {
        in: ['PHASE1_TRIAGE', 'PHASE2_STRATEGIC_INTEL', 'PHASE3_WIN_STRATEGY'],
      },
    },
  });

  const pendingTasks = await prisma.sDLTask.count({
    where: {
      status: 'PENDING',
    },
  });

  const processingTasks = await prisma.sDLTask.count({
    where: {
      status: 'PROCESSING',
    },
  });

  return {
    activeProjects,
    pendingTasks,
    processingTasks,
    status: 'healthy',
  };
}
