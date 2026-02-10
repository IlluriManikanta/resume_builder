import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { resumeSchema } from "@/lib/resume/schema";
import { scoreResume } from "@/lib/resume/scoring";
import type { Resume } from "@/lib/resume/schema";

/**
 * Backfill score + scoredAt for resumes that have none.
 * POST /api/resumes/backfill-scores
 * Auth required. Updates only the current user's resumes with score = null.
 */
export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await prisma.resume.findMany({
    where: { userId, score: null },
  });

  const now = new Date();
  let updated = 0;

  for (const row of rows) {
    const parsed = resumeSchema.safeParse(row.data);
    const resume = (parsed.success ? parsed.data : row.data) as Resume;
    const { overall } = scoreResume(resume);
    await prisma.resume.update({
      where: { id: row.id },
      data: { score: overall, scoredAt: now },
    });
    updated++;
  }

  return NextResponse.json({ updated, total: rows.length });
}
