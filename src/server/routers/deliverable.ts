/**
 * Deliverable Router
 *
 * tRPC procedures for deliverable submission, review, and approval
 */

import { z } from 'zod';
import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
} from '../trpc';
import { TRPCError } from '@trpc/server';

export const deliverableRouter = createTRPCRouter({
  /**
   * Create/Submit deliverable
   * Access: Team members assigned to project
   */
  submit: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        assignmentId: z.string(),
        title: z.string().min(1),
        description: z.string().optional(),
        deliverableType: z.enum([
          'PROPOSAL_SECTION',
          'TECHNICAL_VOLUME',
          'MANAGEMENT_VOLUME',
          'PAST_PERFORMANCE',
          'PRICING',
          'EXECUTIVE_SUMMARY',
          'COMPLIANCE_MATRIX',
          'OTHER',
        ]),
        filePath: z.string(),
        fileName: z.string(),
        fileSize: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify assignment exists and user is the assigned team member
      const assignment = await ctx.prisma.projectAssignment.findUnique({
        where: { id: input.assignmentId },
        include: {
          project: true,
        },
      });

      if (!assignment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Assignment not found',
        });
      }

      if (assignment.teamMemberId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not assigned to this project',
        });
      }

      if (assignment.project.id !== input.projectId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Assignment does not belong to this project',
        });
      }

      // Create deliverable
      const deliverable = await ctx.prisma.deliverable.create({
        data: {
          projectId: input.projectId,
          assignmentId: input.assignmentId,
          title: input.title,
          description: input.description,
          deliverableType: input.deliverableType,
          filePath: input.filePath,
          fileName: input.fileName,
          fileSize: input.fileSize,
          status: 'SUBMITTED',
          submittedAt: new Date(),
          submittedById: ctx.session.user.id,
        },
      });

      // TODO: Trigger AI quality scoring
      // await scoreDeliverableQuality(deliverable.id);

      return deliverable;
    }),

  /**
   * List deliverables for a project
   * Access: Protected (admins, team members, clients based on visibility)
   */
  list: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        assignmentId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Verify access to project
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
      const isClient = project.clientEmail === ctx.session.user.email;
      const isTeamMember = project.assignments.some(
        (a) => a.teamMemberId === ctx.session.user.id
      );

      if (!isCreator && !isAdmin && !isTeamMember && !isClient) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Access denied',
        });
      }

      // Build filter
      const where: any = { projectId: input.projectId };
      if (input.assignmentId) {
        where.assignmentId = input.assignmentId;
      }

      // Get deliverables
      const deliverables = await ctx.prisma.deliverable.findMany({
        where,
        include: {
          assignment: {
            include: {
              teamMember: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          submittedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          reviewedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          approvedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { submittedAt: 'desc' },
      });

      // Filter based on user role
      if (isClient && !isAdmin && !isCreator) {
        // Clients only see approved deliverables or those visible to client
        return deliverables.filter(
          (d) => d.status === 'APPROVED' || d.visibleToClient
        );
      }

      if (isTeamMember && !isAdmin && !isCreator) {
        // Team members only see their own deliverables
        return deliverables.filter(
          (d) => d.assignment.teamMemberId === ctx.session.user.id
        );
      }

      return deliverables;
    }),

  /**
   * Get deliverable by ID
   * Access: Protected (based on role and visibility)
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const deliverable = await ctx.prisma.deliverable.findUnique({
        where: { id: input.id },
        include: {
          project: {
            include: {
              assignments: true,
            },
          },
          assignment: {
            include: {
              teamMember: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          submittedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          reviewedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          approvedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!deliverable) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Deliverable not found',
        });
      }

      // Verify access
      const isCreator = deliverable.project.createdBy === ctx.session.user.id;
      const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(ctx.session.user.role);
      const isClient = deliverable.project.clientEmail === ctx.session.user.email;
      const isTeamMember = deliverable.project.assignments.some(
        (a) => a.teamMemberId === ctx.session.user.id
      );
      const isSubmitter = deliverable.submittedById === ctx.session.user.id;

      if (!isCreator && !isAdmin && !isTeamMember && !isClient) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Access denied',
        });
      }

      // Clients can only see approved deliverables
      if (isClient && !isAdmin && !isCreator && deliverable.status !== 'APPROVED' && !deliverable.visibleToClient) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'This deliverable is not yet available',
        });
      }

      return deliverable;
    }),

  /**
   * Review deliverable (admin/reviewer)
   * Access: Admin and above
   */
  review: adminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(['APPROVED', 'NEEDS_REVISION', 'REJECTED']),
        reviewerFeedback: z.string().optional(),
        qualityScore: z.number().min(0).max(100).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deliverable = await ctx.prisma.deliverable.findUnique({
        where: { id: input.id },
      });

      if (!deliverable) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Deliverable not found',
        });
      }

      // Update deliverable
      const updated = await ctx.prisma.deliverable.update({
        where: { id: input.id },
        data: {
          status: input.status,
          reviewerFeedback: input.reviewerFeedback,
          qualityScore: input.qualityScore,
          reviewedAt: new Date(),
          reviewedById: ctx.session.user.id,
        },
      });

      // Update assignment progress if approved
      if (input.status === 'APPROVED') {
        const assignment = await ctx.prisma.projectAssignment.findUnique({
          where: { id: deliverable.assignmentId },
          include: {
            deliverables: true,
          },
        });

        if (assignment) {
          const totalDeliverables = assignment.deliverables.length;
          const approvedDeliverables = assignment.deliverables.filter(
            (d) => d.status === 'APPROVED'
          ).length;
          const progressPercentage = Math.round(
            (approvedDeliverables / totalDeliverables) * 100
          );

          await ctx.prisma.projectAssignment.update({
            where: { id: assignment.id },
            data: {
              progressPercentage,
              status:
                progressPercentage === 100 ? 'COMPLETED' : 'IN_PROGRESS',
            },
          });
        }
      }

      return updated;
    }),

  /**
   * Approve for client (final approval)
   * Access: Admin and above
   */
  approveForClient: adminProcedure
    .input(
      z.object({
        id: z.string(),
        visibleToClient: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deliverable = await ctx.prisma.deliverable.update({
        where: { id: input.id },
        data: {
          status: 'APPROVED',
          visibleToClient: input.visibleToClient,
          approvedAt: new Date(),
          approvedById: ctx.session.user.id,
        },
      });

      return deliverable;
    }),

  /**
   * Client feedback on deliverable
   * Access: Project client
   */
  clientFeedback: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        feedback: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deliverable = await ctx.prisma.deliverable.findUnique({
        where: { id: input.id },
        include: {
          project: true,
        },
      });

      if (!deliverable) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Deliverable not found',
        });
      }

      // Verify user is the client
      if (deliverable.project.clientEmail !== ctx.session.user.email) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only the client can provide feedback',
        });
      }

      const updated = await ctx.prisma.deliverable.update({
        where: { id: input.id },
        data: {
          clientFeedback: input.feedback,
        },
      });

      return updated;
    }),

  /**
   * Delete deliverable
   * Access: Admin and above, or submitter if not yet reviewed
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deliverable = await ctx.prisma.deliverable.findUnique({
        where: { id: input.id },
      });

      if (!deliverable) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Deliverable not found',
        });
      }

      const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(ctx.session.user.role);
      const isSubmitter = deliverable.submittedById === ctx.session.user.id;
      const isNotReviewed = deliverable.status === 'SUBMITTED';

      if (!isAdmin && !(isSubmitter && isNotReviewed)) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Cannot delete this deliverable',
        });
      }

      // TODO: Also delete file from storage
      await ctx.prisma.deliverable.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  /**
   * Get deliverables pending review
   * Access: Admin and above
   */
  pendingReview: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const deliverables = await ctx.prisma.deliverable.findMany({
        where: {
          status: 'SUBMITTED',
        },
        include: {
          project: {
            select: {
              id: true,
              title: true,
              projectCode: true,
              projectCodename: true,
            },
          },
          assignment: {
            include: {
              teamMember: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          submittedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { submittedAt: 'asc' },
        take: input.limit,
      });

      return deliverables;
    }),
});
