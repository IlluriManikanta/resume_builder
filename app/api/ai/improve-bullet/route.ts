import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildImproveBulletPrompt } from "@/lib/ai/prompts";

const requestSchema = z.object({
  role: z.string(),
  company: z.string(),
  bullet: z.string(),
  skills: z.array(z.string()),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { role, company, bullet, skills } = parsed.data;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
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
      console.error("OpenAI API error:", errorData);
      return NextResponse.json(
        { error: "AI service error", details: errorData },
        { status: response.status }
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
