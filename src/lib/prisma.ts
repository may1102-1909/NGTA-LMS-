import { PrismaClient } from "@prisma/client";

function getCleanDatabaseUrl(): string | undefined {
  const rawUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;
  if (!rawUrl) return undefined;

  let url = rawUrl.trim();

  // If the variable accidentally contains the key name (e.g. DATABASE_URL=...)
  if (url.startsWith("DATABASE_URL=")) {
    url = url.substring("DATABASE_URL=".length).trim();
  } else if (url.startsWith("DIRECT_URL=")) {
    url = url.substring("DIRECT_URL=".length).trim();
  }

  // Remove comment lines if pasted from a snippet
  if (url.startsWith("#")) {
    const lines = url
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#"));
    url =
      lines.find((l) => l.includes("postgresql://") || l.includes("postgres://")) ||
      url;
    if (url.startsWith("DATABASE_URL=")) {
      url = url.substring("DATABASE_URL=".length).trim();
    }
  }

  // Strip leading and trailing quotes (", ', `)
  url = url.replace(/^["'`]+/, "").replace(/["'`]+$/, "").trim();

  // Ensure SSL is required when connecting to Supabase cloud
  if (url.includes("supabase.co") || url.includes("supabase.com")) {
    if (!url.includes("sslmode=")) {
      url += (url.includes("?") ? "&" : "?") + "sslmode=require";
    }
  }

  return url;
}

const cleanedUrl = getCleanDatabaseUrl();
if (cleanedUrl) {
  // Normalize process.env.DATABASE_URL so Prisma engine reads the clean protocol
  process.env.DATABASE_URL = cleanedUrl;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(cleanedUrl ? { datasourceUrl: cleanedUrl } : {}),
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
