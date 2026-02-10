import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

/**
 * Returns whether AI improvement is available.
 * Auth required. Used by the Improve button to enable/disable without exposing env vars.
 */
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ enabled: false }, { status: 401 });
  }

  const enabled = Boolean(process.env.OPENAI_API_KEY?.trim());
  return NextResponse.json({ enabled });
}
