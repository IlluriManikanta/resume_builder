import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { buildImproveBulletPrompt } from "@/lib/ai/prompts";
import { checkAndIncrement } from "@/lib/rateLimit";

const requestSchema = z.object({
  role: z.string(),
  company: z.string(),
  bullet: z.string(),
  skills: z.array(z.string()),
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Sign in to use AI improvement." }, { status: 401 });
    }

    const result = await checkAndIncrement(userId, "ai_improve");
    if (!result.allowed) {
      return NextResponse.json(
        {
          error: "Daily limit reached for AI improvement.",
          limit: result.limit,
          current: result.current,
          retryAfter: "tomorrow",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { role, company, bullet, skills } = parsed.data;
    const apiKey = process.env.OPENAI_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY not set" },
        { status: 400 }
      );
    }

    const prompt = buildImproveBulletPrompt({ role, company, bullet, skills });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData?.error?.message ?? "AI service error";
      console.error("OpenAI API error:", message);
      return NextResponse.json(
        { error: "AI service error. Please try again." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const improvedBullet =
      data.choices?.[0]?.message?.content?.trim() || bullet;

    // Clean up: remove quotes if the AI wrapped it
    const cleaned = improvedBullet.replace(/^["']|["']$/g, "").trim();

    return NextResponse.json({ improvedBullet: cleaned });
  } catch (err) {
    console.error("Improve bullet error:", err);
    return NextResponse.json(
      { error: "Failed to improve bullet" },
      { status: 500 }
    );
  }
}
