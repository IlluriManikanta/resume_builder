import { NextResponse } from "next/server";

/**
 * Returns whether AI improvement is available (OPENAI_API_KEY is set).
 * No auth required - only reveals if the key exists, not the key itself.
 * The Improve button and improve-bullet API still require auth.
 */
export async function GET() {
  const enabled = Boolean(process.env.OPENAI_API_KEY?.trim());
  return NextResponse.json({ enabled });
}
