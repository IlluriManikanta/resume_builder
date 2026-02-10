import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { defaultResume } from "@/lib/resume/defaults";
import { resumeSchema } from "@/lib/resume/schema";
import { scoreResume } from "@/lib/resume/scoring";
import type { Resume } from "@/lib/resume/schema";

/**
 * Creates a saved resume. Called only when the user explicitly saves a draft.
 * Body: { data: Resume, title?: string }
 */
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const resumeData = body?.data ?? body;
  const title =
    typeof body?.title === "string" ? body.title.trim() || "Untitled Resume" : "Untitled Resume";

  const parsed = resumeSchema.safeParse(resumeData);
  const data = parsed.success
    ? (parsed.data as object)
    : (resumeData && typeof resumeData === "object" ? resumeData : { ...defaultResume });

  const { overall } = scoreResume((parsed.success ? parsed.data : data) as Resume);
  const now = new Date();

  const row = await prisma.resume.create({
    data: {
      userId,
      title,
      data,
      score: overall,
      scoredAt: now,
    },
  });
  return NextResponse.json({ resumeId: row.id });
}
