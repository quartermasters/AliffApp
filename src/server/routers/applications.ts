import { z } from "zod";
import { router, publicProcedure, protectedProcedure, adminProcedure } from "../trpc";
import { ApplicationStatus } from "@/types/prisma";

// Input validation schemas
const createApplicationSchema = z.object({
  jobId: z.string(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  resumeUrl: z.string().url("Invalid resume URL").optional(),
  coverLetter: z.string().optional(),
  linkedinUrl: z.string().url("Invalid LinkedIn URL").optional(),
  portfolioUrl: z.string().url("Invalid portfolio URL").optional(),
  yearsExperience: z.number().min(0).optional(),
  currentCompany: z.string().optional(),
  currentTitle: z.string().optional(),
  location: z.string().optional(),
  willingToRelocate: z.boolean().optional(),
  expectedSalary: z.string().optional(),
  availableFrom: z.date().optional(),
});

const updateApplicationSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(ApplicationStatus).optional(),
  notes: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  rejectionReason: z.string().optional(),
});

const updateStatusSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(ApplicationStatus),
  notes: z.string().optional(),
});

// Mock data for development
const mockApplications: any[] = [
  {
    id: "app-1",
    jobId: "job-1",
    userId: null,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1-555-0123",
    resumeUrl: "https://example.com/resumes/john-doe.pdf",
    coverLetter: "I am very interested in this position...",
    linkedinUrl: "https://linkedin.com/in/johndoe",
    portfolioUrl: "https://johndoe.com",
    status: ApplicationStatus.SUBMITTED,
    yearsExperience: 5,
    currentCompany: "Tech Corp",
    currentTitle: "Senior Developer",
    location: "San Francisco, CA",
    willingToRelocate: true,
    expectedSalary: "$120,000 - $150,000",
    availableFrom: new Date("2025-12-01"),
    rating: null,
    notes: null,
    rejectionReason: null,
    screeningScore: null,
    createdAt: new Date("2025-11-01"),
    updatedAt: new Date("2025-11-01"),
    job: {
      id: "job-1",
      title: "Senior Proposal Writer",
      department: "Proposals",
    },
  },
  {
    id: "app-2",
    jobId: "job-2",
    userId: null,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "+1-555-0456",
    resumeUrl: "https://example.com/resumes/jane-smith.pdf",
    coverLetter: "With 8 years of experience in federal contracting...",
    linkedinUrl: "https://linkedin.com/in/janesmith",
    portfolioUrl: null,
    status: ApplicationStatus.SHORTLISTED,
    yearsExperience: 8,
    currentCompany: "Defense Contractors Inc",
    currentTitle: "Lead Proposal Manager",
    location: "Washington, DC",
    willingToRelocate: false,
    expectedSalary: "$140,000 - $170,000",
    availableFrom: new Date("2025-11-15"),
    rating: 4,
    notes: "Strong background in DoD proposals. Excellent writing samples.",
    rejectionReason: null,
    screeningScore: 85,
    createdAt: new Date("2025-10-28"),
    updatedAt: new Date("2025-11-05"),
    job: {
      id: "job-2",
      title: "Federal Contracts Specialist",
      department: "Contracts",
    },
  },
];

export const applicationsRouter = router({
  // List all applications (admin only)
  list: adminProcedure
    .input(
      z.object({
        jobId: z.string().optional(),
        status: z.nativeEnum(ApplicationStatus).optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      // TODO: Replace with real database query
      let filtered = mockApplications;

      if (input.jobId) {
        filtered = filtered.filter((app) => app.jobId === input.jobId);
      }

      if (input.status) {
        filtered = filtered.filter((app) => app.status === input.status);
      }

      const paginated = filtered.slice(
        input.offset,
        input.offset + input.limit
      );

      return {
        applications: paginated,
        total: filtered.length,
      };
    }),

  // Get application by ID (admin or applicant)
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      // TODO: Replace with real database query
      const application = mockApplications.find((app) => app.id === input.id);

      if (!application) {
        throw new Error("Application not found");
      }

      // Check if user has permission to view (admin or application owner)
      const isAdmin =
        ctx.session.user.role === "ADMIN" ||
        ctx.session.user.role === "SUPER_ADMIN";
      const isOwner = application.userId === ctx.session.user.id;

      if (!isAdmin && !isOwner) {
        throw new Error("Unauthorized to view this application");
      }

      return application;
    }),

  // Create new application (public - no auth required)
  create: publicProcedure
    .input(createApplicationSchema)
    .mutation(async ({ input, ctx }) => {
      // TODO: Replace with real database mutation
      const newApplication = {
        id: `app-${Date.now()}`,
        userId: ctx.session?.user?.id || null,
        ...input,
        status: ApplicationStatus.SUBMITTED,
        rating: null,
        notes: null,
        rejectionReason: null,
        screeningScore: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        job: {
          id: input.jobId,
          title: "Mock Job Title",
          department: "Mock Department",
        },
      };

      mockApplications.push(newApplication);

      return newApplication;
    }),

  // Update application (admin only)
  update: adminProcedure
    .input(updateApplicationSchema)
    .mutation(async ({ input, ctx }) => {
      // TODO: Replace with real database mutation
      const index = mockApplications.findIndex((app) => app.id === input.id);

      if (index === -1) {
        throw new Error("Application not found");
      }

      const updated = {
        ...mockApplications[index],
        ...input,
        updatedAt: new Date(),
      };

      mockApplications[index] = updated;

      return updated;
    }),

  // Update application status (admin only)
  updateStatus: adminProcedure
    .input(updateStatusSchema)
    .mutation(async ({ input, ctx }) => {
      // TODO: Replace with real database mutation
      const index = mockApplications.findIndex((app) => app.id === input.id);

      if (index === -1) {
        throw new Error("Application not found");
      }

      mockApplications[index] = {
        ...mockApplications[index],
        status: input.status,
        notes: input.notes || mockApplications[index].notes,
        updatedAt: new Date(),
      };

      return mockApplications[index];
    }),

  // Delete application (admin only)
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // TODO: Replace with real database mutation
      const index = mockApplications.findIndex((app) => app.id === input.id);

      if (index === -1) {
        throw new Error("Application not found");
      }

      mockApplications.splice(index, 1);

      return { success: true };
    }),

  // Get application statistics (admin only)
  stats: adminProcedure.query(async ({ ctx }) => {
    // TODO: Replace with real database aggregation
    const total = mockApplications.length;
    const byStatus = mockApplications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgRating =
      mockApplications.filter((app) => app.rating).length > 0
        ? mockApplications.reduce((sum, app) => sum + (app.rating || 0), 0) /
          mockApplications.filter((app) => app.rating).length
        : 0;

    return {
      total,
      submitted: byStatus[ApplicationStatus.SUBMITTED] || 0,
      screening: byStatus[ApplicationStatus.SCREENING] || 0,
      shortlisted: byStatus[ApplicationStatus.SHORTLISTED] || 0,
      interviewing: byStatus[ApplicationStatus.INTERVIEWING] || 0,
      offered: byStatus[ApplicationStatus.OFFER_EXTENDED] || 0,
      accepted: byStatus[ApplicationStatus.ACCEPTED] || 0,
      rejected: byStatus[ApplicationStatus.REJECTED] || 0,
      withdrawn: byStatus[ApplicationStatus.WITHDRAWN] || 0,
      averageRating: avgRating,
    };
  }),
});
