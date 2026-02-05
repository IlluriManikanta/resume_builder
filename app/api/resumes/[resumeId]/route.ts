import { NextRequest, NextResponse } from "next/server";
import { resumeStore } from "@/lib/store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ resumeId: string }> }
) {
  const { resumeId } = await params;
  const data = resumeStore.get(resumeId);
  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(data);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ resumeId: string }> }
) {
  const { resumeId } = await params;
  const body = await request.json();
  resumeStore.set(resumeId, body);
  return NextResponse.json({ ok: true });
}
