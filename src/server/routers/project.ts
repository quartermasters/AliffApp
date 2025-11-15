/**
 * Business Dashboard - Project Router
 *
 * tRPC procedures for managing RFP/Proposal projects
 */

import { z } from 'zod';
import {
  createTRPCRouter,
  protectedProcedure,
  superAdminProcedure,
  adminProcedure,
} from '../trpc';
import { TRPCError } from '@trpc/server';
import { nanoid } from 'nanoid';

/**
 * Generate unique project code (e.g., PROJ-2025-047)
 */
function generateProjectCode(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 999)
    .toString()
    .padStart(3, '0');
  return `PROJ-${year}-${random}`;
}

/**
 * Generate codename for team anonymization
 */
const CODENAMES = [
  'Operation Phoenix',
  'Project Titan',
  'Mission Falcon',
  'Initiative Thunder',
  'Campaign Sentinel',
  'Operation Catalyst',
  'Project Nexus',
  'Mission Horizon',
];

function generateCodename(): string {
  return CODENAMES[Math.floor(Math.random() * CODENAMES.length)];
}

export const projectRouter = createTRPCRouter({
  /**
   * Create new project
   * Access: Super Admin, Admin
   */
  create: adminProcedure
    .input(
      z.object({
        clientName: z.string().min(1),
        clientEmail: z.string().email().optional(),
        clientPhone: z.string().optional(),
        title: z.string().min(1),
        solicitationNumber: z.string().optional(),
        contractValue: z.number().optional(),
        deadline: z.date().optional(),
        industryCategory: z.string().optional(),
        anonymizeForTeam: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const projectCode = generateProjectCode();
      const projectCodename = input.anonymizeForTeam
        ? generateCodename()
        : null;

      const project = await ctx.prisma.project.create({
        data: {
          projectCode,
          projectCodename,
          clientName: input.clientName,
          clientEmail: input.clientEmail,
          clientPhone: input.clientPhone,
          title: input.title,
          solicitationNumber: input.solicitationNumber,
          contractValue: input.contractValue,
          deadline: input.deadline,
          industryCategory: input.industryCategory,
          anonymizeForTeam: input.anonymizeForTeam,
          createdBy: ctx.session.user.id,
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

      return project;
    }),

  /**
   * Get all projects
   * Access: Admin and above
   */
  list: adminProcedure
    .input(
      z.object({
        status: z.enum(['ACTIVE', 'COMPLETED', 'ARCHIVED', 'CANCELLED']).optional(),
        stage: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, status, stage } = input;

      const projects = await ctx.prisma.project.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          ...(status && { status }),
          ...(stage && { currentStage: stage as any }),
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          assignments: {
            select: {
              id: true,
              teamMemberId: true,
              status: true,
            },
          },
          _count: {
            select: {
              documents: true,
              assignments: true,
              sdlTasks: true,
              deliverables: true,
              updates: true,
            },
          },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (projects.length > limit) {
        const nextItem = projects.pop();
        nextCursor = nextItem!.id;
      }

      return {
        projects,
        nextCursor,
      };
    }),

  /**
   * Get single project by ID
   * Access: Protected (user must be creator or admin)
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.id },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          documents: {
            orderBy: { uploadedAt: 'desc' },
          },
          assignments: {
            include: {
              teamMember: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              jobPosting: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
          sdlTasks: {
            orderBy: { taskNumber: 'asc' },
          },
          deliverables: {
            orderBy: { createdAt: 'desc' },
          },
          updates: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
          _count: {
            select: {
              documents: true,
              assignments: true,
              deliverables: true,
              updates: true,
            },
          },
        },
      });

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      // Check access: must be creator, team member, or admin
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

      return project;
    }),

  /**
   * Update project
   * Access: Super Admin, Admin, or Creator
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          title: z.string().optional(),
          clientName: z.string().optional(),
          clientEmail: z.string().email().optional(),
          clientPhone: z.string().optional(),
          solicitationNumber: z.string().optional(),
          contractValue: z.number().optional(),
          deadline: z.date().optional(),
          industryCategory: z.string().optional(),
          currentStage: z.string().optional(),
          progressPercentage: z.number().min(0).max(100).optional(),
          status: z.enum(['ACTIVE', 'COMPLETED', 'ARCHIVED', 'CANCELLED']).optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user has permission
      const existingProject = await ctx.prisma.project.findUnique({
        where: { id: input.id },
      });

      if (!existingProject) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      const isCreator = existingProject.createdBy === ctx.session.user.id;
      const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(ctx.session.user.role);

      if (!isCreator && !isAdmin) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Access denied',
        });
      }

      const project = await ctx.prisma.project.update({
        where: { id: input.id },
        data: input.data as any,
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

      return project;
    }),

  /**
   * Delete project
   * Access: Super Admin only
   */
  delete: superAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.project.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  /**
   * Get project stats for dashboard
   * Access: Admin and above
   */
  stats: adminProcedure.query(async ({ ctx }) => {
    const [
      totalProjects,
      activeProjects,
      completedProjects,
      wonProjects,
      lostProjects,
      avgWinProbability,
    ] = await Promise.all([
      ctx.prisma.project.count(),
      ctx.prisma.project.count({ where: { status: 'ACTIVE' } }),
      ctx.prisma.project.count({ where: { status: 'COMPLETED' } }),
      ctx.prisma.project.count({ where: { currentStage: 'WON' } }),
      ctx.prisma.project.count({ where: { currentStage: 'LOST' } }),
      ctx.prisma.project.aggregate({
        _avg: { sdlWinProbability: true },
        where: { sdlWinProbability: { not: null } },
      }),
    ]);

    const winRate =
      wonProjects + lostProjects > 0
        ? (wonProjects / (wonProjects + lostProjects)) * 100
        : 0;

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      wonProjects,
      lostProjects,
      winRate: Math.round(winRate),
      avgWinProbability: Math.round(avgWinProbability._avg.sdlWinProbability || 0),
    };
  }),
});
