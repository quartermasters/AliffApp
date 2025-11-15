/**
 * ALIFF-RECRUITER tRPC Router
 *
 * SDL-driven provider hiring endpoints
 */

import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, adminProcedure } from '../trpc';
import { createSDLJobGenerator } from '@/lib/services/recruiter/sdl-job-generator';
import { createSDLRecruiterPipeline, autoTriggerRecruiterPipeline } from '@/lib/services/recruiter/sdl-recruiter-pipeline';

export const recruiterRouter = createTRPCRouter({
  /**
   * Generate job descriptions from SDL Win Strategy Brief
   * Access: Admin and above
   */
  generateJobsFromSDL: adminProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ input }) => {
      const jobGenerator = createSDLJobGenerator(input.projectId);
      const jobPackage = await jobGenerator.generateJobDescriptions();
      return jobPackage;
    }),

  /**
   * Check if recruiter pipeline should be triggered
   * Access: Admin and above
   */
  shouldTriggerPipeline: adminProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input }) => {
      const pipeline = createSDLRecruiterPipeline(input.projectId);
      const shouldTrigger = await pipeline.shouldTrigger();
      return { shouldTrigger };
    }),

  /**
   * Execute recruiter pipeline (manual trigger)
   * Access: Admin and above
   */
  executePipeline: adminProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ input }) => {
      const pipeline = createSDLRecruiterPipeline(input.projectId);
      const status = await pipeline.execute();
      return status;
    }),

  /**
   * Auto-trigger pipeline (called after SDL Phase 3 completion)
   * Access: Admin and above
   */
  autoTriggerPipeline: adminProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ input }) => {
      const triggered = await autoTriggerRecruiterPipeline(input.projectId);
      return { triggered };
    }),

  /**
   * Get pipeline status
   * Access: Protected
   */
  getPipelineStatus: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input }) => {
      const pipeline = createSDLRecruiterPipeline(input.projectId);
      const status = await pipeline.getStatus();
      return status;
    }),

  /**
   * Update hiring progress
   * Access: Admin and above
   */
  updateHiringProgress: adminProcedure
    .input(
      z.object({
        projectId: z.string(),
        providersHired: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const pipeline = createSDLRecruiterPipeline(input.projectId);
      await pipeline.updateHiringProgress(input.providersHired);
      return { success: true };
    }),

  /**
   * Get job package for project
   * Access: Protected
   */
  getJobPackage: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.projectId },
        select: {
          recruiterJobPackage: true,
        },
      });
      return project?.recruiterJobPackage;
    }),
});
