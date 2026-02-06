import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { resumeSchema } from "@/lib/resume/schema";
import { renderResumeToHtml } from "@/lib/export/renderHtml";
import { generatePdfFromHtml } from "@/lib/export/pdf";
import { checkAndIncrement } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Sign in to export PDF." }, { status: 401 });
    }

    const result = await checkAndIncrement(userId, "pdf_export");
    if (!result.allowed) {
      return NextResponse.json(
        {
          error: "Daily limit reached for PDF export.",
          limit: result.limit,
          current: result.current,
          retryAfter: "tomorrow",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = resumeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid resume data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const resume = parsed.data;
    const html = renderResumeToHtml(resume);

    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await generatePdfFromHtml(html);
    } catch (pdfErr) {
      const msg = pdfErr instanceof Error ? pdfErr.message : String(pdfErr);
      const isChromiumUnavailable =
        /executable doesn't exist|could not find browser|chromium|browserType\.launch|ENOENT/i.test(
          msg
        ) || msg.includes("Playwright");
      if (isChromiumUnavailable) {
        return NextResponse.json(
          {
            error:
              "PDF export is not available in this environment. Chromium is not installed (common on serverless). Try again locally or contact support.",
            code: "PDF_UNAVAILABLE",
          },
          { status: 503 }
        );
      }
      throw pdfErr;
    }

    const filename = "resume.pdf";
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (err) {
    console.error("PDF export error:", err);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
