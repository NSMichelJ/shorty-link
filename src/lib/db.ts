import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const tursoUrl = import.meta.env.TURSO_DATABASE_URL;
const tursoAuthToken = import.meta.env.TURSO_AUTH_TOKEN;

const createPrismaClient = () => {
  let adapter = null;
  if (tursoUrl && tursoAuthToken) {
    adapter = new PrismaLibSQL({
      url: `${tursoUrl}`,
      authToken: `${tursoAuthToken}`,
    });
  }

  return new PrismaClient({
    adapter,
    log:
      import.meta.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (import.meta.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
