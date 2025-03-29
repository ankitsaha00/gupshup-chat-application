import { PrismaClient } from "@prisma/client";

// Use a global variable for Prisma to avoid multiple instances in dev
const globalForPrisma = globalThis as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = db;
}
