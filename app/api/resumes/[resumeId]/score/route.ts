import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { resumeSchema } from "@/lib/resume/schema";
import { scoreResume } from "@/lib/resume/scoring";
import type { Resume } from "@/lib/resume/schema";

/**
 * POST /api/resumes/[resumeId]/score
 * Scores the resume and persists score + scoredAt.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ resumeId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { resumeId } = await params;
  const row = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
  });

  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const parsed = resumeSchema.safeParse(row.data);
  const resume = (parsed.success ? parsed.data : row.data) as Resume;
  const { overall } = scoreResume(resume);
  const now = new Date();

  await prisma.resume.update({
    where: { id: resumeId },
    data: { score: overall, scoredAt: now },
  });

  return NextResponse.json({
    score: overall,
    scoredAt: now.toISOString(),
  });
}
