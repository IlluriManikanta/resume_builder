import { NextRequest, NextResponse } from "next/server";
import { resumeSchema } from "@/lib/resume/schema";
import { renderResumeToHtml } from "@/lib/export/renderHtml";
import { generatePdfFromHtml } from "@/lib/export/pdf";

export async function POST(request: NextRequest) {
  try {
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
    const pdfBuffer = await generatePdfFromHtml(html);

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
