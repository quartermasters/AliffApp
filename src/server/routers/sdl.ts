/**
 * Business Dashboard - SDL (Solicitation Diagnosis Lab) Router
 *
 * tRPC procedures for SDL orchestration and task management
 */

import { z } from 'zod';
import {
  createTRPCRouter,
  protectedProcedure,
  superAdminProcedure,
  adminProcedure,
} from '../trpc';
import { TRPCError } from '@trpc/server';
import { createPhase1TriageExecutor } from '@/lib/services/sdl/phase1-triage';
import { createPhase2StrategicIntelExecutor } from '@/lib/services/sdl/phase2-strategic-intel';
import { createPhase3WinStrategyExecutor } from '@/lib/services/sdl/phase3-win-strategy';
import { getQualityTracker } from '@/lib/services/quality-tracker';

/**
 * SDL Task definitions (34 tasks across 3 phases)
 */
const SDL_TASKS = [
  // PHASE 1: TRIAGE (Tasks 1-11)
  { taskNumber: 1, taskName: 'Document ingestion and parsing', taskPhase: 'PHASE1_TRIAGE' as const, primaryAI: 'CLAUDE' as const, requiresMultiAI: false, requiresHumanValidation: false },
  { taskNumber: 2, taskName: 'Metadata extraction', taskPhase: 'PHASE1_TRIAGE' as const, primaryAI: 'GEMINI' as const, requiresMultiAI: false, requiresHumanValidation: false },
  { taskNumber: 3, taskName: 'Section identification and structure mapping', taskPhase: 'PHASE1_TRIAGE' as const, primaryAI: 'CLAUDE' as const, requiresMultiAI: false, requiresHumanValidation: false },
  { taskNumber: 4, taskName: 'Generate table of contents', taskPhase: 'PHASE1_TRIAGE' as const, primaryAI: 'CLAUDE' as const, requiresMultiAI: false, requiresHumanValidation: false },
  { taskNumber: 5, taskName: 'Extract all stated requirements', taskPhase: 'PHASE1_TRIAGE' as const, primaryAI: 'GEMINI' as const, requiresMultiAI: false, requiresHumanValidation: false },
  { taskNumber: 6, taskName: 'Extract evaluation criteria with point values', taskPhase: 'PHASE1_TRIAGE' as const, primaryAI: 'GEMINI' as const, requiresMultiAI: false, requiresHumanValidation: false },
  { taskNumber: 7, taskName: 'Extract compliance requirements', taskPhase: 'PHASE1_TRIAGE' as const, primaryAI: 'CLAUDE' as const, requiresMultiAI: false, requiresHumanValidation: false },
  { taskNumber: 8, taskName: 'Timeline/deadline mapping', taskPhase: 'PHASE1_TRIAGE' as const, primaryAI: 'GEMINI' as const, requiresMultiAI: false, requiresHumanValidation: false },
  { taskNumber: 9, taskName: 'Generate initial compliance checklist', taskPhase: 'PHASE1_TRIAGE' as const, primaryAI: 'GEMINI' as const, requiresMultiAI: false, requiresHumanValidation: false },
  { taskNumber: 10, taskName: 'Complexity scoring (1-10 scale)', taskPhase: 'PHASE1_TRIAGE' as const, primaryAI: 'OPENAI' as const, requiresMultiAI: false, requiresHumanValidation: false },
  { taskNumber: 11, taskName: 'Risk flag detection', taskPhase: 'PHASE1_TRIAGE' as const, primaryAI: 'OPENAI' as const, requiresMultiAI: false, requiresHumanValidation: false },

  // PHASE 2: STRATEGIC INTELLIGENCE (Tasks 12-25)
  { taskNumber: 12, taskName: 'Incumbent research', taskPhase: 'PHASE2_STRATEGIC_INTEL' as const, primaryAI: 'GEMINI' as const, requiresMultiAI: false, requiresHumanValidation: false },
  { taskNumber: 13, taskName: 'Agency spending patterns and preferences', taskPhase: 'PHASE2_STRATEGIC_INTEL' as const, primaryAI: 'GEMINI' as const, requiresMultiAI: false, requiresHumanValidation: false },
  { taskNumber: 14, taskName: 'Contracting officer background and history', taskPhase: 'PHASE2_STRATEGIC_INTEL' as const, primaryAI: 'GROK' as const, requiresMultiAI: false, requiresHumanValidation: false },
  { taskNumber: 15, taskName: 'Recent similar awards and outcomes', taskPhase: 'PHASE2_STRATEGIC_INTEL' as const, primaryAI: 'GEMINI' as const, requiresMultiAI: false, requiresHumanValidation: false },
  { taskNumber: 16, taskName: 'Competitor analysis', taskPhase: 'PHASE2_STRATEGIC_INTEL' as const, primaryAI: 'GEMINI' as const, secondaryAI: 'GROK' as const, requiresMultiAI: false, requiresHumanValidation: false },

  // CRITICAL ANALYSIS - Multi-AI Required
  { taskNumber: 17, taskName: 'Why is this being re-competed NOW?', taskPhase: 'PHASE2_STRATEGIC_INTEL' as const, primaryAI: 'OPENAI' as const, secondaryAI: 'CLAUDE' as const, requiresMultiAI: true, requiresHumanValidation: true },
  { taskNumber: 18, taskName: 'Unstated requirement detection', taskPhase: 'PHASE2_STRATEGIC_INTEL' as const, primaryAI: 'OPENAI' as const, secondaryAI: 'CLAUDE' as const, requiresMultiAI: true, requiresHumanValidation: true },
  { taskNumber: 19, taskName: 'Real pain point identification', taskPhase: 'PHASE2_STRATEGIC_INTEL' as const, primaryAI: 'OPENAI' as const, secondaryAI: 'CLAUDE' as const, requiresMultiAI: true, requiresHumanValidation: true },
  { taskNumber: 20, taskName: 'Budget reality assessment', taskPhase: 'PHASE2_STRATEGIC_INTEL' as const, primaryAI: 'OPENAI' as const, secondaryAI: 'GEMINI' as const, requiresMultiAI: true, requiresHumanValidation: true },
  { taskNumber: 21, taskName: 'Timeline constraint analysis', taskPhase: 'PHASE2_STRATEGIC_INTEL' as const, primaryAI: 'OPENAI' as const, secondaryAI: 'CLAUDE' as const, requiresMultiAI: true, requiresHumanValidation: true },
  { taskNumber: 22, taskName: 'Agency culture assessment', taskPhase: 'PHASE2_STRATEGIC_INTEL' as const, primaryAI: 'OPENAI' as const, requiresMultiAI: false, requiresHumanValidation: false },
  { taskNumber: 23, taskName: 'Match against known patterns library', taskPhase: 'PHASE2_STRATEGIC_INTEL' as const, primaryAI: 'OPENAI' as const, requiresMultiAI: false, requiresHumanValidation: false },
  { taskNumber: 24, taskName: 'Red flag identification', taskPhase: 'PHASE2_STRATEGIC_INTEL' as const, primaryAI: 'OPENAI' as const, requiresMultiAI: false, requiresHumanValidation: false },
  { taskNumber: 25, taskName: 'Green flag identification', taskPhase: 'PHASE2_STRATEGIC_INTEL' as const, primaryAI: 'OPENAI' as const, requiresMultiAI: false, requiresHumanValidation: false },

  // PHASE 3: WIN STRATEGY (Tasks 26-34)
  { taskNumber: 26, taskName: 'Win probability assessment', taskPhase: 'PHASE3_WIN_STRATEGY' as const, primaryAI: 'OPENAI' as const, secondaryAI: 'CLAUDE' as const, requiresMultiAI: true, requiresHumanValidation: true },
  { taskNumber: 27, taskName: 'Win theme generation', taskPhase: 'PHASE3_WIN_STRATEGY' as const, primaryAI: 'OPENAI' as const, secondaryAI: 'CLAUDE' as const, requiresMultiAI: true, requiresHumanValidation: true },
  { taskNumber: 28, taskName: 'Differentiator identification', taskPhase: 'PHASE3_WIN_STRATEGY' as const, primaryAI: 'OPENAI' as const, secondaryAI: 'CLAUDE' as const, requiresMultiAI: true, requiresHumanValidation: true },
  { taskNumber: 29, taskName: 'No-bid recommendation', taskPhase: 'PHASE3_WIN_STRATEGY' as const, primaryAI: 'OPENAI' as const, secondaryAI: 'CLAUDE' as const, requiresMultiAI: true, requiresHumanValidation: true },
  { taskNumber: 30, taskName: 'Solution approach recommendations', taskPhase: 'PHASE3_WIN_STRATEGY' as const, primaryAI: 'OPENAI' as const, requiresMultiAI: false, requiresHumanValidation: false },
  { taskNumber: 31, taskName: 'Risk mitigation strategies', taskPhase: 'PHASE3_WIN_STRATEGY' as const, primaryAI: 'OPENAI' as const, requiresMultiAI: false, requiresHumanValidation: false },
  { taskNumber: 32, taskName: 'Teaming recommendations', taskPhase: 'PHASE3_WIN_STRATEGY' as const, primaryAI: 'GEMINI' as const, requiresMultiAI: false, requiresHumanValidation: false },
  { taskNumber: 33, taskName: 'Pricing strategy guidance', taskPhase: 'PHASE3_WIN_STRATEGY' as const, primaryAI: 'OPENAI' as const, requiresMultiAI: false, requiresHumanValidation: false },
  { taskNumber: 34, taskName: 'Capture plan outline', taskPhase: 'PHASE3_WIN_STRATEGY' as const, primaryAI: 'OPENAI' as const, requiresMultiAI: false, requiresHumanValidation: false },
];

export const sdlRouter = createTRPCRouter({
  /**
   * Start SDL Processing - Creates 34 tasks and initiates Phase 1
   * Access: Admin and above
   */
  startProcessing: adminProcedure
    .input(
      z.object({
        projectId: z.string(),
        documentId: z.string(), // The uploaded RFP document
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify project exists
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.projectId },
        include: {
          documents: {
            where: { id: input.documentId },
          },
        },
      });

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      const document = project.documents[0];
      if (!document) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Document not found',
        });
      }

      // Create all 34 SDL tasks
      await ctx.prisma.sDLTask.createMany({
        data: SDL_TASKS.map((task) => ({
          projectId: input.projectId,
          ...task,
        })),
      });

      // Update project status
      await ctx.prisma.project.update({
        where: { id: input.projectId },
        data: {
          sdlStatus: 'PHASE1_TRIAGE',
          currentStage: 'SDL_PROCESSING',
        },
      });

      return {
        success: true,
        tasksCreated: 34,
        message: 'SDL processing initiated. Phase 1 Triage starting...',
      };
    }),

  /**
   * Execute Phase 1 Triage (Tasks 1-11)
   * Access: Admin and above
   */
  executePhase1: adminProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ input }) => {
      const executor = createPhase1TriageExecutor(input.projectId);

      // Execute Phase 1 in background (don't await)
      executor.executeAll().catch((error) => {
        console.error('[SDL Router] Phase 1 execution error:', error);
      });

      return {
        success: true,
        message: 'Phase 1 Triage execution started. Tasks will complete asynchronously.',
      };
    }),

  /**
   * Get Phase 1 summary
   * Access: Protected
   */
  getPhase1Summary: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input }) => {
      const executor = createPhase1TriageExecutor(input.projectId);
      return await executor.getSummary();
    }),

  /**
   * Execute Phase 2 Strategic Intelligence (Tasks 12-25)
   * Access: Admin and above
   */
  executePhase2: adminProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ input }) => {
      const executor = createPhase2StrategicIntelExecutor(input.projectId);

      // Execute Phase 2 in background (don't await)
      executor.executeAll().catch((error) => {
        console.error('[SDL Router] Phase 2 execution error:', error);
      });

      return {
        success: true,
        message: 'Phase 2 Strategic Intelligence execution started. Tasks will complete asynchronously.',
      };
    }),

  /**
   * Get Phase 2 summary
   * Access: Protected
   */
  getPhase2Summary: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input }) => {
      const executor = createPhase2StrategicIntelExecutor(input.projectId);
      return await executor.getSummary();
    }),

  /**
   * Execute Phase 3 Win Strategy (Tasks 26-34)
   * Access: Admin and above
   */
  executePhase3: adminProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ input }) => {
      const executor = createPhase3WinStrategyExecutor(input.projectId);

      // Execute Phase 3 in background (don't await)
      executor.executeAll().catch((error) => {
        console.error('[SDL Router] Phase 3 execution error:', error);
      });

      return {
        success: true,
        message: 'Phase 3 Win Strategy execution started. Tasks will complete asynchronously.',
      };
    }),

  /**
   * Get Phase 3 summary
   * Access: Protected
   */
  getPhase3Summary: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input }) => {
      const executor = createPhase3WinStrategyExecutor(input.projectId);
      return await executor.getSummary();
    }),

  /**
   * Get SDL tasks for a project
   * Access: Protected (must have project access)
   */
  getTasks: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const tasks = await ctx.prisma.sDLTask.findMany({
        where: { projectId: input.projectId },
        orderBy: { taskNumber: 'asc' },
        include: {
          consensusLogs: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });

      return tasks;
    }),

  /**
   * Execute single SDL task
   * Access: System (will be called by background worker)
   */
  executeTask: adminProcedure
    .input(z.object({ taskId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.sDLTask.findUnique({
        where: { id: input.taskId },
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

      if (!task) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Task not found',
        });
      }

      // Update task status to PROCESSING
      await ctx.prisma.sDLTask.update({
        where: { id: task.id },
        data: {
          status: 'PROCESSING',
          startedAt: new Date(),
        },
      });

      // TODO: Execute actual AI task based on task.taskNumber
      // For now, we'll just mark as completed
      // In production, this would call the orchestrator

      await ctx.prisma.sDLTask.update({
        where: { id: task.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          confidenceScore: 85,
        },
      });

      return { success: true };
    }),

  /**
   * Update task result (after AI execution)
   * Access: System
   */
  updateTaskResult: adminProcedure
    .input(
      z.object({
        taskId: z.string(),
        primaryResult: z.any(),
        secondaryResult: z.any().optional(),
        consensusResult: z.any().optional(),
        confidenceScore: z.number().min(0).max(100),
        status: z.enum(['COMPLETED', 'FAILED', 'ESCALATED_TO_HUMAN']),
        errorMessage: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.sDLTask.update({
        where: { id: input.taskId },
        data: {
          primaryResult: input.primaryResult,
          secondaryResult: input.secondaryResult,
          consensusResult: input.consensusResult,
          confidenceScore: input.confidenceScore,
          status: input.status,
          errorMessage: input.errorMessage,
          completedAt: input.status === 'COMPLETED' ? new Date() : null,
        },
      });

      return task;
    }),

  /**
   * Get SDL summary for project
   * Access: Protected
   */
  getSummary: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.projectId },
        include: {
          sdlTasks: {
            orderBy: { taskNumber: 'asc' },
          },
        },
      });

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      const totalTasks = project.sdlTasks.length;
      const completedTasks = project.sdlTasks.filter((t) => t.status === 'COMPLETED').length;
      const failedTasks = project.sdlTasks.filter((t) => t.status === 'FAILED').length;
      const escalatedTasks = project.sdlTasks.filter((t) => t.status === 'ESCALATED_TO_HUMAN').length;
      const processingTasks = project.sdlTasks.filter((t) => t.status === 'PROCESSING').length;

      const phase1Tasks = project.sdlTasks.filter((t) => t.taskPhase === 'PHASE1_TRIAGE');
      const phase2Tasks = project.sdlTasks.filter((t) => t.taskPhase === 'PHASE2_STRATEGIC_INTEL');
      const phase3Tasks = project.sdlTasks.filter((t) => t.taskPhase === 'PHASE3_WIN_STRATEGY');

      return {
        sdlStatus: project.sdlStatus,
        complexityScore: project.sdlComplexityScore,
        winProbability: project.sdlWinProbability,
        totalTasks,
        completedTasks,
        failedTasks,
        escalatedTasks,
        processingTasks,
        progressPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        phases: {
          phase1: {
            total: phase1Tasks.length,
            completed: phase1Tasks.filter((t) => t.status === 'COMPLETED').length,
          },
          phase2: {
            total: phase2Tasks.length,
            completed: phase2Tasks.filter((t) => t.status === 'COMPLETED').length,
          },
          phase3: {
            total: phase3Tasks.length,
            completed: phase3Tasks.filter((t) => t.status === 'COMPLETED').length,
          },
        },
      };
    }),

  /**
   * Get consensus logs requiring human review
   * Access: Protected
   */
  getLogsRequiringReview: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.consensusLog.findMany({
        where: {
          projectId: input.projectId,
          escalatedToHuman: true,
          humanReviewerId: null, // Not yet reviewed
        },
        include: {
          sdlTask: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }),

  /**
   * Submit human adjudication for consensus conflict
   * Access: Admin and above
   */
  submitAdjudication: adminProcedure
    .input(
      z.object({
        consensusLogId: z.string(),
        decision: z.any(),
        notes: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Update consensus log with human decision
      await ctx.prisma.consensusLog.update({
        where: { id: input.consensusLogId },
        data: {
          humanReviewerId: ctx.session.user.id,
          humanDecision: input.decision,
          humanNotes: input.notes,
        },
      });

      // Get the consensus log to update the associated SDL task
      const consensusLog = await ctx.prisma.consensusLog.findUnique({
        where: { id: input.consensusLogId },
      });

      if (consensusLog) {
        // Update SDL task with human-adjudicated result
        await ctx.prisma.sDLTask.update({
          where: { id: consensusLog.sdlTaskId },
          data: {
            status: 'COMPLETED',
            consensusResult: input.decision,
            completedAt: new Date(),
          },
        });
      }

      return {
        success: true,
        message: 'Human adjudication submitted successfully',
      };
    }),

  /**
   * Get consensus statistics for project
   * Access: Protected
   */
  getConsensusStatistics: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const logs = await ctx.prisma.consensusLog.findMany({
        where: { projectId: input.projectId },
      });

      const total = logs.length;
      const fullConsensus = logs.filter((l) => l.consensusType === 'FULL_CONSENSUS').length;
      const majorityConsensus = logs.filter((l) => l.consensusType === 'MAJORITY_CONSENSUS')
        .length;
      const splitDecisions = logs.filter((l) => l.consensusType === 'SPLIT_DECISION').length;
      const lowConfidence = logs.filter((l) => l.consensusType === 'LOW_CONFIDENCE').length;
      const escalated = logs.filter((l) => l.escalatedToHuman).length;
      const reviewed = logs.filter((l) => l.humanReviewerId !== null).length;

      const avgConfidence =
        total > 0 ? logs.reduce((sum, l) => sum + (l.consensusConfidence || 0), 0) / total : 0;

      return {
        total,
        fullConsensus,
        majorityConsensus,
        splitDecisions,
        lowConfidence,
        escalated,
        reviewed,
        pendingReview: escalated - reviewed,
        avgConfidence: Math.round(avgConfidence),
        consensusRate: total > 0 ? Math.round((fullConsensus / total) * 100) : 0,
      };
    }),

  /**
   * Get quality dashboard
   * Access: Admin and above
   */
  getQualityDashboard: adminProcedure
    .input(z.object({ projectId: z.string().optional() }))
    .query(async ({ input }) => {
      const qualityTracker = getQualityTracker();
      return await qualityTracker.getQualityDashboard(input.projectId);
    }),

  /**
   * Get provider performance metrics
   * Access: Admin and above
   */
  getProviderMetrics: adminProcedure
    .input(z.object({ projectId: z.string().optional() }))
    .query(async ({ input }) => {
      const qualityTracker = getQualityTracker();
      return await qualityTracker.getProviderMetrics(input.projectId);
    }),

  /**
   * Get task type performance
   * Access: Admin and above
   */
  getTaskTypePerformance: adminProcedure
    .input(z.object({ projectId: z.string().optional() }))
    .query(async ({ input }) => {
      const qualityTracker = getQualityTracker();
      return await qualityTracker.getTaskTypePerformance(input.projectId);
    }),

  /**
   * Get quality trends
   * Access: Admin and above
   */
  getQualityTrends: adminProcedure
    .input(
      z.object({
        provider: z.enum(['OPENAI', 'CLAUDE', 'GEMINI', 'GROK']),
        days: z.number().optional().default(30),
        projectId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const qualityTracker = getQualityTracker();
      return await qualityTracker.getQualityTrends(input.provider as any, input.days, input.projectId);
    }),

  /**
   * Get routing recommendations
   * Access: Admin and above
   */
  getRoutingRecommendations: adminProcedure
    .input(z.object({ projectId: z.string().optional() }))
    .query(async ({ input }) => {
      const qualityTracker = getQualityTracker();
      return await qualityTracker.getRoutingRecommendations(input.projectId);
    }),
});
