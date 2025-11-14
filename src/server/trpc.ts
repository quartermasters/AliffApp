/**
 * tRPC Server Configuration
 *
 * This initializes the tRPC instance and creates the main router.
 */

import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * Create context for tRPC requests
 * This runs for every request and provides session/user data
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth();

  return {
    session,
    prisma,
    headers: opts.headers,
  };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

/**
 * Initialize tRPC with SuperJSON transformer
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Export reusable router and procedure helpers
 */
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

/**
 * Protected procedure - requires authentication
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Super Admin procedure - requires SUPER_ADMIN role
 */
export const superAdminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.role !== 'SUPER_ADMIN') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Super Admin access required'
    });
  }
  return next({ ctx });
});

/**
 * Admin procedure - requires ADMIN or SUPER_ADMIN role
 */
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!['ADMIN', 'SUPER_ADMIN'].includes(ctx.session.user.role)) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Admin access required'
    });
  }
  return next({ ctx });
});
