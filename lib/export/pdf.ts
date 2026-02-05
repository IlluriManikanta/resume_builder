/**
 * Generates a PDF buffer from HTML using Playwright.
 * Letter size (8.5 x 11 in) with 0.5 in margins.
 */
export async function generatePdfFromHtml(html: string): Promise<Buffer> {
  const { chromium } = await import("playwright");

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, {
      waitUntil: "networkidle",
    });

    const buffer = await page.pdf({
      format: "Letter",
      margin: {
        top: "0.5in",
        right: "0.5in",
        bottom: "0.5in",
        left: "0.5in",
      },
      printBackground: true,
    });

    return Buffer.from(buffer);
  } finally {
    await browser.close();
  }
}
