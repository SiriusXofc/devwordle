import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export function getPrisma() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === "production" ? ["error"] : ["warn", "error"],
      errorFormat: "minimal",
    });
  }

  return globalForPrisma.prisma;
}
