import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../trpc";
import { JobStatus, JobType, JobLocation } from "@/types/prisma";

// Validation schemas
const createJobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.nativeEnum(JobType),
  location: z.nativeEnum(JobLocation),
  department: z.string().optional(),
  salary: z.string().optional(),
  requirements: z.string().min(10, "Requirements must be at least 10 characters"),
  responsibilities: z.string().min(10, "Responsibilities must be at least 10 characters"),
  benefits: z.string().optional(),
});

const updateJobSchema = createJobSchema.partial().extend({
  id: z.string(),
});

const publishJobSchema = z.object({
  id: z.string(),
  publish: z.boolean(),
});

export const jobsRouter = router({
  // Get all jobs (with filters)
  list: protectedProcedure
    .input(
      z.object({
        status: z.nativeEnum(JobStatus).optional(),
        type: z.nativeEnum(JobType).optional(),
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      // Mock implementation
      const mockJobs = [
        {
          id: "1",
          title: "Senior Proposal Writer",
          slug: "senior-proposal-writer",
          description: "We are looking for an experienced proposal writer...",
          type: JobType.FULL_TIME,
          location: JobLocation.REMOTE,
          department: "Proposals",
          salary: "$80,000 - $120,000",
          requirements: "5+ years experience in government contracting",
          responsibilities: "Write and manage federal proposals",
          benefits: "Health insurance, 401k, remote work",
          status: JobStatus.PUBLISHED,
          publishedAt: new Date("2025-01-01"),
          closedAt: null,
          views: 145,
          createdBy: ctx.session.user.id,
          createdAt: new Date("2024-12-15"),
          updatedAt: new Date("2025-01-01"),
        },
        {
          id: "2",
          title: "Junior Compliance Analyst",
          slug: "junior-compliance-analyst",
          description: "Entry-level position for compliance review...",
          type: JobType.FULL_TIME,
          location: JobLocation.HYBRID,
          department: "Compliance",
          salary: "$55,000 - $75,000",
          requirements: "Bachelor's degree, attention to detail",
          responsibilities: "Review proposals for compliance",
          benefits: "Health insurance, PTO, training budget",
          status: JobStatus.PUBLISHED,
          publishedAt: new Date("2025-01-05"),
          closedAt: null,
          views: 89,
          createdBy: ctx.session.user.id,
          createdAt: new Date("2024-12-20"),
          updatedAt: new Date("2025-01-05"),
        },
        {
          id: "3",
          title: "AI/ML Engineer",
          slug: "ai-ml-engineer",
          description: "Build AI tools for proposal automation...",
          type: JobType.FULL_TIME,
          location: JobLocation.REMOTE,
          department: "Engineering",
          salary: "$120,000 - $180,000",
          requirements: "3+ years ML experience, Python, TensorFlow",
          responsibilities: "Develop AI screening and automation tools",
          benefits: "Equity, health insurance, unlimited PTO",
          status: JobStatus.DRAFT,
          publishedAt: null,
          closedAt: null,
          views: 0,
          createdBy: ctx.session.user.id,
          createdAt: new Date("2025-01-07"),
          updatedAt: new Date("2025-01-07"),
        },
      ];

      return {
        jobs: mockJobs,
        nextCursor: undefined,
      };
    }),

  // Get single job by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // Mock implementation
      return {
        id: input.id,
        title: "Senior Proposal Writer",
        slug: "senior-proposal-writer",
        description: "We are looking for an experienced proposal writer to join our team and help win federal contracts.",
        type: JobType.FULL_TIME,
        location: JobLocation.REMOTE,
        department: "Proposals",
        salary: "$80,000 - $120,000",
        requirements: "5+ years experience in government contracting, excellent writing skills",
        responsibilities: "Write and manage federal proposals, coordinate with SMEs, ensure compliance",
        benefits: "Health insurance, 401k, remote work, professional development",
        status: JobStatus.PUBLISHED,
        publishedAt: new Date("2025-01-01"),
        closedAt: null,
        views: 145,
        createdBy: ctx.session.user.id,
        createdAt: new Date("2024-12-15"),
        updatedAt: new Date("2025-01-01"),
      };
    }),

  // Create new job (admin only)
  create: adminProcedure
    .input(createJobSchema)
    .mutation(async ({ ctx, input }) => {
      const slug = input.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Mock implementation
      const newJob = {
        id: Date.now().toString(),
        slug,
        ...input,
        status: JobStatus.DRAFT,
        publishedAt: null,
        closedAt: null,
        views: 0,
        createdBy: ctx.session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return newJob;
    }),

  // Update job (admin only)
  update: adminProcedure
    .input(updateJobSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Mock implementation
      return {
        id,
        ...data,
        updatedAt: new Date(),
      };
    }),

  // Delete job (admin only)
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Mock implementation
      return { success: true, id: input.id };
    }),

  // Publish/unpublish job (admin only)
  publish: adminProcedure
    .input(publishJobSchema)
    .mutation(async ({ ctx, input }) => {
      // Mock implementation
      return {
        id: input.id,
        status: input.publish ? JobStatus.PUBLISHED : JobStatus.DRAFT,
        publishedAt: input.publish ? new Date() : null,
      };
    }),

  // Get job statistics
  stats: adminProcedure.query(async ({ ctx }) => {
    // Mock implementation
    return {
      total: 12,
      published: 8,
      draft: 3,
      closed: 1,
      totalViews: 1247,
      totalApplications: 148,
    };
  }),
});
