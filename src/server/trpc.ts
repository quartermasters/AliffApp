import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Role } from "@/types/prisma";

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<typeof createTRPCContext>().create();

/**
 * Create context for tRPC requests
 */
export async function createTRPCContext() {
  const session = await auth();

  return {
    session,
    db,
  };
}

/**
 * Export reusable router and procedure helpers
 */
export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Protected procedure - requires authentication
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Admin procedure - requires admin role
 */
export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (
    ctx.session.user.role !== Role.ADMIN &&
    ctx.session.user.role !== Role.SUPER_ADMIN
  ) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return next({ ctx });
});
