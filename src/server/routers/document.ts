/**
 * Business Dashboard - Document Router
 *
 * tRPC procedures for document upload and management
 */

import { z } from 'zod';
import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
} from '../trpc';
import { TRPCError } from '@trpc/server';
import { startSDLProcessing } from '@/lib/services/sdl-service';

export const documentRouter = createTRPCRouter({
  /**
   * Upload document (will be handled via separate upload endpoint)
   * This just creates the database record
   */
  create: adminProcedure
    .input(
      z.object({
        projectId: z.string(),
        documentType: z.enum([
          'RFP_MAIN',
          'AMENDMENT',
          'ATTACHMENT',
          'PAST_PERFORMANCE',
          'CAPABILITY_STATEMENT',
          'DELIVERABLE',
          'SDL_OUTPUT',
          'OTHER',
        ]),
        fileName: z.string(),
        filePath: z.string(),
        fileSize: z.number().optional(),
        visibleToClient: z.boolean().default(false),
        visibleToTeam: z.boolean().default(false),
        watermarked: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify project exists and user has access
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.projectId },
      });

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      const isCreator = project.createdBy === ctx.session.user.id;
      const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(ctx.session.user.role);

      if (!isCreator && !isAdmin) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Access denied',
        });
      }

      // Create document record
      const document = await ctx.prisma.projectDocument.create({
        data: {
          projectId: input.projectId,
          documentType: input.documentType,
          fileName: input.fileName,
          filePath: input.filePath,
          fileSize: input.fileSize,
          uploadedByType: 'admin',
          uploadedById: ctx.session.user.id,
          visibleToClient: input.visibleToClient,
          visibleToTeam: input.visibleToTeam,
          watermarked: input.watermarked,
        },
      });

      return document;
    }),

  /**
   * Start SDL processing on uploaded document
   * Access: Admin and above
   */
  startSDLProcessing: adminProcedure
    .input(
      z.object({
        projectId: z.string(),
        documentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get document
      const document = await ctx.prisma.projectDocument.findUnique({
        where: { id: input.documentId },
        include: {
          project: true,
        },
      });

      if (!document) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Document not found',
        });
      }

      if (document.projectId !== input.projectId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Document does not belong to this project',
        });
      }

      // TODO: Read file from storage (S3, local, etc.)
      // For now, we'll just trigger SDL with a placeholder
      // In production, you'd read the actual file buffer

      return {
        success: true,
        message: 'SDL processing will begin shortly',
      };
    }),

  /**
   * List documents for a project
   * Access: Protected (must have project access)
   */
  list: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Verify access
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.projectId },
        include: {
          assignments: true,
        },
      });

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      const isCreator = project.createdBy === ctx.session.user.id;
      const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(ctx.session.user.role);
      const isTeamMember = project.assignments.some(
        (a) => a.teamMemberId === ctx.session.user.id
      );

      if (!isCreator && !isAdmin && !isTeamMember) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Access denied',
        });
      }

      // Get documents
      const documents = await ctx.prisma.projectDocument.findMany({
        where: { projectId: input.projectId },
        orderBy: { uploadedAt: 'desc' },
      });

      // Filter based on user role
      if (isTeamMember && !isAdmin && !isCreator) {
        // Team members only see documents marked as visible to team
        return documents.filter((d) => d.visibleToTeam);
      }

      return documents;
    }),

  /**
   * Delete document
   * Access: Admin and above
   */
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Also delete file from storage
      await ctx.prisma.projectDocument.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  /**
   * Update document visibility
   * Access: Admin and above
   */
  updateVisibility: adminProcedure
    .input(
      z.object({
        id: z.string(),
        visibleToClient: z.boolean().optional(),
        visibleToTeam: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const document = await ctx.prisma.projectDocument.update({
        where: { id: input.id },
        data: {
          visibleToClient: input.visibleToClient,
          visibleToTeam: input.visibleToTeam,
        },
      });

      return document;
    }),
});
