/**
 * Main tRPC Router
 *
 * Combines all sub-routers into the main app router
 */

import { createTRPCRouter } from '../trpc';
import { projectRouter } from './project';
import { sdlRouter } from './sdl';
import { documentRouter } from './document';
import { deliverableRouter } from './deliverable';
import { recruiterRouter } from './recruiter';

export const appRouter = createTRPCRouter({
  project: projectRouter,
  sdl: sdlRouter,
  document: documentRouter,
  deliverable: deliverableRouter,
  recruiter: recruiterRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;
