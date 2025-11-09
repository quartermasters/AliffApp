import { router } from "../trpc";
import { jobsRouter } from "./jobs";
import { applicationsRouter } from "./applications";

/**
 * Main tRPC router
 * Add new routers here as they're created
 */
export const appRouter = router({
  jobs: jobsRouter,
  applications: applicationsRouter,
  // Future routers:
  // interviews: interviewsRouter,
  // leads: leadsRouter,
  // etc.
});

export type AppRouter = typeof appRouter;
