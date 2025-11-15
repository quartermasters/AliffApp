/**
 * SDL Orchestrator - Core Service
 *
 * Manages the 34-task SDL pipeline across 3 phases:
 * - Phase 1: Triage (Tasks 1-11)
 * - Phase 2: Strategic Intelligence (Tasks 12-25)
 * - Phase 3: Win Strategy (Tasks 26-34)
 */

import { prisma } from '@/lib/prisma';
import { AIProvider, SDLTaskPhase, SDLTaskStatus } from '@prisma/client';

// ============================================================================
// SDL TASK DEFINITIONS (34 TASKS)
// ============================================================================

interface SDLTaskDefinition {
  taskNumber: number;
  taskName: string;
  taskPhase: SDLTaskPhase;
  primaryAI: AIProvider;
  secondaryAI?: AIProvider;
  requiresMultiAI: boolean;
  requiresHumanValidation: boolean;
  priority: string;
  estimatedDurationMinutes: number;
}

export const SDL_TASK_DEFINITIONS: SDLTaskDefinition[] = [
  // ============================================================================
  // PHASE 1: TRIAGE (AI-Led, Human-Supervised) - Tasks 1-11
  // ============================================================================
  {
    taskNumber: 1,
    taskName: 'Document ingestion and parsing',
    taskPhase: SDLTaskPhase.PHASE1_TRIAGE,
    primaryAI: AIProvider.CLAUDE,
    requiresMultiAI: false,
    requiresHumanValidation: false,
    priority: 'high',
    estimatedDurationMinutes: 5,
  },
  {
    taskNumber: 2,
    taskName: 'Metadata extraction',
    taskPhase: SDLTaskPhase.PHASE1_TRIAGE,
    primaryAI: AIProvider.GEMINI,
    requiresMultiAI: false,
    requiresHumanValidation: false,
    priority: 'high',
    estimatedDurationMinutes: 3,
  },
  {
    taskNumber: 3,
    taskName: 'Section identification and structure mapping',
    taskPhase: SDLTaskPhase.PHASE1_TRIAGE,
    primaryAI: AIProvider.CLAUDE,
    requiresMultiAI: false,
    requiresHumanValidation: false,
    priority: 'medium',
    estimatedDurationMinutes: 5,
  },
  {
    taskNumber: 4,
    taskName: 'Generate table of contents',
    taskPhase: SDLTaskPhase.PHASE1_TRIAGE,
    primaryAI: AIProvider.CLAUDE,
    requiresMultiAI: false,
    requiresHumanValidation: false,
    priority: 'low',
    estimatedDurationMinutes: 3,
  },
  {
    taskNumber: 5,
    taskName: 'Extract all stated requirements',
    taskPhase: SDLTaskPhase.PHASE1_TRIAGE,
    primaryAI: AIProvider.GEMINI,
    requiresMultiAI: false,
    requiresHumanValidation: false,
    priority: 'critical',
    estimatedDurationMinutes: 10,
  },
  {
    taskNumber: 6,
    taskName: 'Extract evaluation criteria with point values',
    taskPhase: SDLTaskPhase.PHASE1_TRIAGE,
    primaryAI: AIProvider.GEMINI,
    requiresMultiAI: false,
    requiresHumanValidation: false,
    priority: 'critical',
    estimatedDurationMinutes: 8,
  },
  {
    taskNumber: 7,
    taskName: 'Extract compliance requirements',
    taskPhase: SDLTaskPhase.PHASE1_TRIAGE,
    primaryAI: AIProvider.CLAUDE,
    requiresMultiAI: false,
    requiresHumanValidation: false,
    priority: 'critical',
    estimatedDurationMinutes: 8,
  },
  {
    taskNumber: 8,
    taskName: 'Timeline/deadline mapping',
    taskPhase: SDLTaskPhase.PHASE1_TRIAGE,
    primaryAI: AIProvider.GEMINI,
    requiresMultiAI: false,
    requiresHumanValidation: false,
    priority: 'high',
    estimatedDurationMinutes: 5,
  },
  {
    taskNumber: 9,
    taskName: 'Generate initial compliance checklist',
    taskPhase: SDLTaskPhase.PHASE1_TRIAGE,
    primaryAI: AIProvider.GEMINI,
    requiresMultiAI: false,
    requiresHumanValidation: false,
    priority: 'medium',
    estimatedDurationMinutes: 5,
  },
  {
    taskNumber: 10,
    taskName: 'Complexity scoring (1-10 scale)',
    taskPhase: SDLTaskPhase.PHASE1_TRIAGE,
    primaryAI: AIProvider.OPENAI,
    requiresMultiAI: false,
    requiresHumanValidation: false,
    priority: 'critical',
    estimatedDurationMinutes: 5,
  },
  {
    taskNumber: 11,
    taskName: 'Risk flag detection',
    taskPhase: SDLTaskPhase.PHASE1_TRIAGE,
    primaryAI: AIProvider.OPENAI,
    requiresMultiAI: false,
    requiresHumanValidation: false,
    priority: 'high',
    estimatedDurationMinutes: 8,
  },

  // ============================================================================
  // PHASE 2: STRATEGIC INTELLIGENCE (Human-Led, AI-Assisted) - Tasks 12-25
  // ============================================================================

  // Research Tasks (12-16) - Parallel Execution
  {
    taskNumber: 12,
    taskName: 'Incumbent research',
    taskPhase: SDLTaskPhase.PHASE2_STRATEGIC_INTEL,
    primaryAI: AIProvider.GEMINI,
    requiresMultiAI: false,
    requiresHumanValidation: false,
    priority: 'medium',
    estimatedDurationMinutes: 15,
  },
  {
    taskNumber: 13,
    taskName: 'Agency spending patterns and preferences',
    taskPhase: SDLTaskPhase.PHASE2_STRATEGIC_INTEL,
    primaryAI: AIProvider.GEMINI,
    requiresMultiAI: false,
    requiresHumanValidation: false,
    priority: 'medium',
    estimatedDurationMinutes: 15,
  },
  {
    taskNumber: 14,
    taskName: 'Contracting officer background and history',
    taskPhase: SDLTaskPhase.PHASE2_STRATEGIC_INTEL,
    primaryAI: AIProvider.GROK,
    requiresMultiAI: false,
    requiresHumanValidation: false,
    priority: 'medium',
    estimatedDurationMinutes: 10,
  },
  {
    taskNumber: 15,
    taskName: 'Recent similar awards and outcomes',
    taskPhase: SDLTaskPhase.PHASE2_STRATEGIC_INTEL,
    primaryAI: AIProvider.GEMINI,
    requiresMultiAI: false,
    requiresHumanValidation: false,
    priority: 'medium',
    estimatedDurationMinutes: 15,
  },
  {
    taskNumber: 16,
    taskName: 'Competitor analysis',
    taskPhase: SDLTaskPhase.PHASE2_STRATEGIC_INTEL,
    primaryAI: AIProvider.GEMINI,
    secondaryAI: AIProvider.GROK,
    requiresMultiAI: false,
    requiresHumanValidation: false,
    priority: 'high',
    estimatedDurationMinutes: 20,
  },

  // Critical Analysis Tasks (17-22) - Multi-AI Cross-Validation
  {
    taskNumber: 17,
    taskName: 'Why is this being re-competed NOW?',
    taskPhase: SDLTaskPhase.PHASE2_STRATEGIC_INTEL,
    primaryAI: AIProvider.OPENAI,
    secondaryAI: AIProvider.CLAUDE,
    requiresMultiAI: true,
    requiresHumanValidation: true,
    priority: 'critical',
    estimatedDurationMinutes: 20,
  },
  {
    taskNumber: 18,
    taskName: 'Unstated requirement detection',
    taskPhase: SDLTaskPhase.PHASE2_STRATEGIC_INTEL,
    primaryAI: AIProvider.OPENAI,
    secondaryAI: AIProvider.CLAUDE,
    requiresMultiAI: true,
    requiresHumanValidation: true,
    priority: 'critical',
    estimatedDurationMinutes: 25,
  },
  {
    taskNumber: 19,
    taskName: 'Real pain point identification',
    taskPhase: SDLTaskPhase.PHASE2_STRATEGIC_INTEL,
    primaryAI: AIProvider.OPENAI,
    secondaryAI: AIProvider.CLAUDE,
    requiresMultiAI: true,
    requiresHumanValidation: true,
    priority: 'critical',
    estimatedDurationMinutes: 20,
  },
  {
    taskNumber: 20,
    taskName: 'Budget reality assessment',
    taskPhase: SDLTaskPhase.PHASE2_STRATEGIC_INTEL,
    primaryAI: AIProvider.OPENAI,
    secondaryAI: AIProvider.GEMINI,
    requiresMultiAI: true,
    requiresHumanValidation: true,
    priority: 'high',
    estimatedDurationMinutes: 15,
  },
  {
    taskNumber: 21,
    taskName: 'Timeline constraint analysis',
    taskPhase: SDLTaskPhase.PHASE2_STRATEGIC_INTEL,
    primaryAI: AIProvider.OPENAI,
    secondaryAI: AIProvider.CLAUDE,
    requiresMultiAI: true,
    requiresHumanValidation: true,
    priority: 'high',
    estimatedDurationMinutes: 15,
  },
  {
    taskNumber: 22,
    taskName: 'Agency culture assessment',
    taskPhase: SDLTaskPhase.PHASE2_STRATEGIC_INTEL,
    primaryAI: AIProvider.OPENAI,
    requiresMultiAI: false,
    requiresHumanValidation: false,
    priority: 'medium',
    estimatedDurationMinutes: 15,
  },

  // Pattern Recognition Tasks (23-25)
  {
    taskNumber: 23,
    taskName: 'Match against known patterns library',
    taskPhase: SDLTaskPhase.PHASE2_STRATEGIC_INTEL,
    primaryAI: AIProvider.OPENAI,
    requiresMultiAI: false,
    requiresHumanValidation: false,
    priority: 'medium',
    estimatedDurationMinutes: 10,
  },
  {
    taskNumber: 24,
    taskName: 'Red flag identification',
    taskPhase: SDLTaskPhase.PHASE2_STRATEGIC_INTEL,
    primaryAI: AIProvider.OPENAI,
    requiresMultiAI: false,
    requiresHumanValidation: false,
    priority: 'high',
    estimatedDurationMinutes: 10,
  },
  {
    taskNumber: 25,
    taskName: 'Green flag identification',
    taskPhase: SDLTaskPhase.PHASE2_STRATEGIC_INTEL,
    primaryAI: AIProvider.OPENAI,
    requiresMultiAI: false,
    requiresHumanValidation: false,
    priority: 'high',
    estimatedDurationMinutes: 10,
  },

  // ============================================================================
  // PHASE 3: WIN STRATEGY (Collaborative - Multi-AI + Human) - Tasks 26-34
  // ============================================================================

  // Strategic Recommendations (26-29) - Multi-AI Cross-Validation
  {
    taskNumber: 26,
    taskName: 'Win probability assessment',
    taskPhase: SDLTaskPhase.PHASE3_WIN_STRATEGY,
    primaryAI: AIProvider.OPENAI,
    secondaryAI: AIProvider.CLAUDE,
    requiresMultiAI: true,
    requiresHumanValidation: true,
    priority: 'critical',
    estimatedDurationMinutes: 15,
  },
  {
    taskNumber: 27,
    taskName: 'Win theme generation',
    taskPhase: SDLTaskPhase.PHASE3_WIN_STRATEGY,
    primaryAI: AIProvider.OPENAI,
    secondaryAI: AIProvider.CLAUDE,
    requiresMultiAI: true,
    requiresHumanValidation: true,
    priority: 'critical',
    estimatedDurationMinutes: 25,
  },
  {
    taskNumber: 28,
    taskName: 'Differentiator identification',
    taskPhase: SDLTaskPhase.PHASE3_WIN_STRATEGY,
    primaryAI: AIProvider.OPENAI,
    secondaryAI: AIProvider.CLAUDE,
    requiresMultiAI: true,
    requiresHumanValidation: true,
    priority: 'critical',
    estimatedDurationMinutes: 20,
  },
  {
    taskNumber: 29,
    taskName: 'No-bid recommendation',
    taskPhase: SDLTaskPhase.PHASE3_WIN_STRATEGY,
    primaryAI: AIProvider.OPENAI,
    secondaryAI: AIProvider.CLAUDE,
    requiresMultiAI: true,
    requiresHumanValidation: true,
    priority: 'critical',
    estimatedDurationMinutes: 15,
  },

  // Solution Design Support (30-34) - Single AI
  {
    taskNumber: 30,
    taskName: 'Solution approach recommendations',
    taskPhase: SDLTaskPhase.PHASE3_WIN_STRATEGY,
    primaryAI: AIProvider.OPENAI,
    requiresMultiAI: false,
    requiresHumanValidation: false,
    priority: 'high',
    estimatedDurationMinutes: 20,
  },
  {
    taskNumber: 31,
    taskName: 'Risk mitigation strategies',
    taskPhase: SDLTaskPhase.PHASE3_WIN_STRATEGY,
    primaryAI: AIProvider.OPENAI,
    requiresMultiAI: false,
    requiresHumanValidation: false,
    priority: 'high',
    estimatedDurationMinutes: 15,
  },
  {
    taskNumber: 32,
    taskName: 'Teaming recommendations',
    taskPhase: SDLTaskPhase.PHASE3_WIN_STRATEGY,
    primaryAI: AIProvider.GEMINI,
    requiresMultiAI: false,
    requiresHumanValidation: false,
    priority: 'medium',
    estimatedDurationMinutes: 15,
  },
  {
    taskNumber: 33,
    taskName: 'Pricing strategy guidance',
    taskPhase: SDLTaskPhase.PHASE3_WIN_STRATEGY,
    primaryAI: AIProvider.OPENAI,
    requiresMultiAI: false,
    requiresHumanValidation: false,
    priority: 'high',
    estimatedDurationMinutes: 15,
  },
  {
    taskNumber: 34,
    taskName: 'Capture plan outline',
    taskPhase: SDLTaskPhase.PHASE3_WIN_STRATEGY,
    primaryAI: AIProvider.OPENAI,
    requiresMultiAI: false,
    requiresHumanValidation: false,
    priority: 'medium',
    estimatedDurationMinutes: 20,
  },
];

// ============================================================================
// SDL ORCHESTRATOR CLASS
// ============================================================================

export class SDLOrchestrator {
  private projectId: string;

  constructor(projectId: string) {
    this.projectId = projectId;
  }

  /**
   * Initialize SDL for a project (create all 34 tasks)
   */
  async initializeSDL(): Promise<void> {
    console.log(`[SDL Orchestrator] Initializing SDL for project ${this.projectId}`);

    // Create all 34 tasks
    const tasks = SDL_TASK_DEFINITIONS.map((def) => ({
      projectId: this.projectId,
      taskNumber: def.taskNumber,
      taskName: def.taskName,
      taskPhase: def.taskPhase,
      primaryAI: def.primaryAI,
      secondaryAI: def.secondaryAI || null,
      requiresMultiAI: def.requiresMultiAI,
      requiresHumanValidation: def.requiresHumanValidation,
      priority: def.priority,
      estimatedDurationMinutes: def.estimatedDurationMinutes,
      status: SDLTaskStatus.PENDING,
    }));

    await prisma.sDLTask.createMany({
      data: tasks,
    });

    // Update project SDL status
    await prisma.project.update({
      where: { id: this.projectId },
      data: {
        sdlStatus: 'NOT_STARTED',
        currentStage: 'SDL_PROCESSING',
      },
    });

    console.log(`[SDL Orchestrator] Created ${tasks.length} SDL tasks`);
  }

  /**
   * Start Phase 1: Triage (Tasks 1-11)
   */
  async startPhase1Triage(): Promise<void> {
    console.log(`[SDL Orchestrator] Starting Phase 1: Triage for project ${this.projectId}`);

    // Update project status
    await prisma.project.update({
      where: { id: this.projectId },
      data: {
        sdlStatus: 'PHASE1_TRIAGE',
        currentStage: 'SDL_PROCESSING',
      },
    });

    // Get all Phase 1 tasks
    const phase1Tasks = await prisma.sDLTask.findMany({
      where: {
        projectId: this.projectId,
        taskPhase: SDLTaskPhase.PHASE1_TRIAGE,
      },
      orderBy: { taskNumber: 'asc' },
    });

    console.log(`[SDL Orchestrator] Found ${phase1Tasks.length} Phase 1 tasks to execute`);

    // NOTE: Actual task execution will be handled by AI Router
    // For now, just mark tasks as ready for processing
    for (const task of phase1Tasks) {
      await prisma.sDLTask.update({
        where: { id: task.id },
        data: {
          status: SDLTaskStatus.PENDING,
        },
      });
    }

    console.log(`[SDL Orchestrator] Phase 1 tasks queued for AI Router`);
  }

  /**
   * Start Phase 2: Strategic Intelligence (Tasks 12-25)
   */
  async startPhase2StrategicIntel(): Promise<void> {
    console.log(`[SDL Orchestrator] Starting Phase 2: Strategic Intelligence for project ${this.projectId}`);

    // Update project status
    await prisma.project.update({
      where: { id: this.projectId },
      data: {
        sdlStatus: 'PHASE2_STRATEGIC_INTEL',
      },
    });

    // Get all Phase 2 tasks
    const phase2Tasks = await prisma.sDLTask.findMany({
      where: {
        projectId: this.projectId,
        taskPhase: SDLTaskPhase.PHASE2_STRATEGIC_INTEL,
      },
      orderBy: { taskNumber: 'asc' },
    });

    console.log(`[SDL Orchestrator] Found ${phase2Tasks.length} Phase 2 tasks to execute`);

    // Mark tasks as ready
    for (const task of phase2Tasks) {
      await prisma.sDLTask.update({
        where: { id: task.id },
        data: {
          status: SDLTaskStatus.PENDING,
        },
      });
    }

    console.log(`[SDL Orchestrator] Phase 2 tasks queued for AI Router`);
  }

  /**
   * Start Phase 3: Win Strategy (Tasks 26-34)
   */
  async startPhase3WinStrategy(): Promise<void> {
    console.log(`[SDL Orchestrator] Starting Phase 3: Win Strategy for project ${this.projectId}`);

    // Update project status
    await prisma.project.update({
      where: { id: this.projectId },
      data: {
        sdlStatus: 'PHASE3_WIN_STRATEGY',
      },
    });

    // Get all Phase 3 tasks
    const phase3Tasks = await prisma.sDLTask.findMany({
      where: {
        projectId: this.projectId,
        taskPhase: SDLTaskPhase.PHASE3_WIN_STRATEGY,
      },
      orderBy: { taskNumber: 'asc' },
    });

    console.log(`[SDL Orchestrator] Found ${phase3Tasks.length} Phase 3 tasks to execute`);

    // Mark tasks as ready
    for (const task of phase3Tasks) {
      await prisma.sDLTask.update({
        where: { id: task.id },
        data: {
          status: SDLTaskStatus.PENDING,
        },
      });
    }

    console.log(`[SDL Orchestrator] Phase 3 tasks queued for AI Router`);
  }

  /**
   * Get SDL progress summary
   */
  async getProgressSummary() {
    const tasks = await prisma.sDLTask.findMany({
      where: { projectId: this.projectId },
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === SDLTaskStatus.COMPLETED).length;
    const processingTasks = tasks.filter((t) => t.status === SDLTaskStatus.PROCESSING).length;
    const failedTasks = tasks.filter((t) => t.status === SDLTaskStatus.FAILED).length;
    const escalatedTasks = tasks.filter((t) => t.status === SDLTaskStatus.ESCALATED_TO_HUMAN).length;

    const phase1Complete = tasks.filter(
      (t) => t.taskPhase === SDLTaskPhase.PHASE1_TRIAGE && t.status === SDLTaskStatus.COMPLETED
    ).length;
    const phase2Complete = tasks.filter(
      (t) => t.taskPhase === SDLTaskPhase.PHASE2_STRATEGIC_INTEL && t.status === SDLTaskStatus.COMPLETED
    ).length;
    const phase3Complete = tasks.filter(
      (t) => t.taskPhase === SDLTaskPhase.PHASE3_WIN_STRATEGY && t.status === SDLTaskStatus.COMPLETED
    ).length;

    return {
      totalTasks,
      completedTasks,
      processingTasks,
      failedTasks,
      escalatedTasks,
      progressPercentage: Math.round((completedTasks / totalTasks) * 100),
      phases: {
        phase1: {
          total: 11,
          completed: phase1Complete,
          percentage: Math.round((phase1Complete / 11) * 100),
        },
        phase2: {
          total: 14,
          completed: phase2Complete,
          percentage: Math.round((phase2Complete / 14) * 100),
        },
        phase3: {
          total: 9,
          completed: phase3Complete,
          percentage: Math.round((phase3Complete / 9) * 100),
        },
      },
    };
  }

  /**
   * Complete SDL processing
   */
  async completeSDL(): Promise<void> {
    await prisma.project.update({
      where: { id: this.projectId },
      data: {
        sdlStatus: 'COMPLETED',
        currentStage: 'HUMAN_VALIDATION',
      },
    });

    console.log(`[SDL Orchestrator] SDL processing complete for project ${this.projectId}`);
  }

  /**
   * Get all tasks requiring human validation
   */
  async getTasksRequiringHumanValidation() {
    return await prisma.sDLTask.findMany({
      where: {
        projectId: this.projectId,
        OR: [
          { status: SDLTaskStatus.ESCALATED_TO_HUMAN },
          { requiresHumanValidation: true, status: SDLTaskStatus.COMPLETED },
        ],
      },
      include: {
        consensusLogs: true,
      },
      orderBy: { taskNumber: 'asc' },
    });
  }
}

/**
 * Create SDL Orchestrator for a project
 */
export async function createSDLOrchestrator(projectId: string): Promise<SDLOrchestrator> {
  const orchestrator = new SDLOrchestrator(projectId);
  await orchestrator.initializeSDL();
  return orchestrator;
}

/**
 * Get existing SDL Orchestrator for a project
 */
export function getSDLOrchestrator(projectId: string): SDLOrchestrator {
  return new SDLOrchestrator(projectId);
}
