import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { resumeSchema } from "@/lib/resume/schema";
import { scoreResume } from "@/lib/resume/scoring";

export async function GET(
  _request: NextRequest,
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
  return NextResponse.json({ data: row.data, title: row.title ?? "Untitled Resume" });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ resumeId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { resumeId } = await params;
  const body = await request.json();
  const parsed = resumeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid resume data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const row = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
  });
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { overall } = scoreResume(parsed.data);
  const now = new Date();

  await prisma.resume.update({
    where: { id: resumeId },
    data: {
      data: parsed.data as object,
      score: overall,
      scoredAt: now,
    },
  });
  return NextResponse.json({ ok: true });
}

export async function PATCH(
  request: NextRequest,
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

  const body = await request.json();
  const title =
    typeof body?.title === "string" ? body.title.trim() : undefined;
  if (title === undefined) {
    return NextResponse.json(
      { error: "Missing or invalid title" },
      { status: 400 }
    );
  }

  await prisma.resume.update({
    where: { id: resumeId },
    data: { title: title || "Untitled Resume" },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ resumeId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { resumeId } = await params;

  // Verify the resume belongs to the current user before deleting
  const row = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
  });
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.resume.delete({
    where: { id: resumeId },
  });

  return NextResponse.json({ ok: true });
}
