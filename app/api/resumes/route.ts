import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await prisma.resume.findMany({
    where: { userId },
    select: { id: true, title: true, updatedAt: true, score: true, scoredAt: true },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ resumes: rows });
}
