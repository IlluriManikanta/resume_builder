import { NextResponse } from "next/server";
import { resumeStore } from "@/lib/store";

export async function POST() {
  const resumeId = `res-${Date.now()}`;
  resumeStore.set(resumeId, { id: resumeId });
  return NextResponse.json({ resumeId });
}
