import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { defaultResume } from "@/lib/resume/defaults";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const row = await prisma.resume.create({
    data: {
      userId: userId,
      title: "Untitled Resume",
      data: { ...defaultResume } as object,
    },
  });
  return NextResponse.json({ resumeId: row.id });
}
