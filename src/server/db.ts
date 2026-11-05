import { PrismaClient } from "@prisma/client";

import { env } from "@/env.mjs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// App traffic uses the pooled Neon URL. Prisma must disable prepared
// statements on that PgBouncer endpoint. Migrations use DATABASE_URL_UNPOOLED.
const databaseUrl = (() => {
  const url = new URL(env.DATABASE_URL);
  if (url.hostname.includes("-pooler")) {
    url.searchParams.set("pgbouncer", "true");
    url.searchParams.set("connect_timeout", "15");
  }
  return url.toString();
})();

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: databaseUrl } },
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
