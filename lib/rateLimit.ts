import { prisma } from "@/lib/db/prisma";

export type RateLimitType = "ai_improve" | "pdf_export";

const DEFAULT_AI_IMPROVE_PER_DAY = 20;
const DEFAULT_PDF_EXPORT_PER_DAY = 30;

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getLimit(type: RateLimitType): number {
  if (type === "ai_improve") {
    const v = process.env.RATE_LIMIT_AI_IMPROVE_PER_DAY;
    return v ? Math.max(0, parseInt(v, 10)) || DEFAULT_AI_IMPROVE_PER_DAY : DEFAULT_AI_IMPROVE_PER_DAY;
  }
  const v = process.env.RATE_LIMIT_PDF_EXPORT_PER_DAY;
  return v ? Math.max(0, parseInt(v, 10)) || DEFAULT_PDF_EXPORT_PER_DAY : DEFAULT_PDF_EXPORT_PER_DAY;
}

/**
 * Check if the user is under the daily limit; if so, increment and return allowed.
 * Otherwise return 429 payload without incrementing.
 */
export async function checkAndIncrement(
  userId: string,
  type: RateLimitType
): Promise<{ allowed: true } | { allowed: false; limit: number; current: number }> {
  const date = getTodayKey();
  const limit = getLimit(type);

  let row = await prisma.dailyUsage.findUnique({
    where: { userId_date: { userId, date } },
  });

  if (!row) {
    await prisma.dailyUsage.create({
      data: {
        userId,
        date,
        aiImproveCount: type === "ai_improve" ? 1 : 0,
        pdfExportCount: type === "pdf_export" ? 1 : 0,
      },
    });
    return { allowed: true };
  }

  const current = type === "ai_improve" ? row.aiImproveCount : row.pdfExportCount;
  if (current >= limit) {
    return { allowed: false, limit, current };
  }

  if (type === "ai_improve") {
    await prisma.dailyUsage.update({
      where: { userId_date: { userId, date } },
      data: { aiImproveCount: { increment: 1 } },
    });
  } else {
    await prisma.dailyUsage.update({
      where: { userId_date: { userId, date } },
      data: { pdfExportCount: { increment: 1 } },
    });
  }
  return { allowed: true };
}
