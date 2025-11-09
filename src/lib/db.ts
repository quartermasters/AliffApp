// import { PrismaClient } from "@prisma/client";
// NOTE: Prisma client generation is disabled for build demo
// Run "npx prisma generate" after setting up PostgreSQL to use the real client

// Mock Prisma client until "prisma generate" is run
const mockPrisma = {
  user: {
    findUnique: async () => null,
    create: async () => ({ id: "mock", email: "", password: "", name: "", role: "USER" as const }),
    update: async () => ({ id: "mock", email: "", password: "", name: "", role: "USER" as const }),
  },
  // Add other models as needed
} as any;

const globalForPrisma = globalThis as unknown as {
  prisma: typeof mockPrisma | undefined;
};

export const db =
  globalForPrisma.prisma ?? mockPrisma;

// To use real Prisma client, uncomment below and comment out mockPrisma:
// export const db =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
//   });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
