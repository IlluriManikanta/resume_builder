import type { Resume } from "@/lib/resume/schema";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDateRange(
  start: string | undefined,
  end: string | undefined
): string {
  if (!start && !end) return "";
  return `${start ?? "?"} – ${end ?? "Present"}`;
}

/**
 * Renders resume as a self-contained HTML document matching the ATS template.
 * Uses embedded CSS only (no external fonts/icons) for stable PDF output.
 */
export function renderResumeToHtml(resume: Resume): string {
  const contactLine = [resume.email, resume.phone, resume.linkedin, resume.github]
    .filter(Boolean)
    .map(escapeHtml)
    .join(" · ");

  const sections: string[] = [];

  if (resume.summary) {
    sections.push(`
      <section>
        <h2 class="section-heading">Summary</h2>
        <p class="section-p">${escapeHtml(resume.summary)}</p>
      </section>`);
  }

  if (resume.experience.length > 0) {
    const entries = resume.experience
      .map(
        (exp) => `
        <div class="entry">
          <div class="entry-header">
            <p class="entry-title">${escapeHtml(exp.role)}${exp.company ? `, ${escapeHtml(exp.company)}` : ""}</p>
            <span class="entry-dates">${escapeHtml(formatDateRange(exp.startDate, exp.endDate))}</span>
          </div>
          ${exp.location ? `<p class="entry-meta">${escapeHtml(exp.location)}</p>` : ""}
          ${exp.bullets.length > 0 ? `<ul class="bullet-list">${exp.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
        </div>`
      )
      .join("");
    sections.push(`
      <section>
        <h2 class="section-heading">Experience</h2>
        <div class="entry-group">${entries}</div>
      </section>`);
  }

  if (resume.projects.length > 0) {
    const entries = resume.projects
      .map(
        (proj) => `
        <div class="entry">
          <p class="entry-title">${escapeHtml(proj.name)}</p>
          ${proj.bullets.length > 0 ? `<ul class="bullet-list">${proj.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
        </div>`
      )
      .join("");
    sections.push(`
      <section>
        <h2 class="section-heading">Projects</h2>
        <div class="entry-group">${entries}</div>
      </section>`);
  }

  if (resume.education.length > 0) {
    const entries = resume.education
      .map(
        (edu) => {
          const degreeField = [edu.degree, edu.field].filter(Boolean).join(" ");
          return `
        <div class="entry">
          <div class="entry-header">
            <p class="entry-title">${escapeHtml(edu.institution)}${degreeField ? ` — ${escapeHtml(degreeField)}` : ""}</p>
            <span class="entry-dates">${escapeHtml(formatDateRange(edu.startDate, edu.endDate))}</span>
          </div>
          ${edu.location ? `<p class="entry-meta">${escapeHtml(edu.location)}</p>` : ""}
        </div>`;
        }
      )
      .join("");
    sections.push(`
      <section>
        <h2 class="section-heading">Education</h2>
        <div class="entry-group">${entries}</div>
      </section>`);
  }

  if (resume.skills.length > 0) {
    sections.push(`
      <section>
        <h2 class="section-heading">Skills</h2>
        <p class="section-p">${escapeHtml(resume.skills.join(", "))}</p>
      </section>`);
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Resume - ${escapeHtml(resume.name)}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: 11pt;
      line-height: 1.35;
      color: #111;
      margin: 0;
      padding: 0;
      max-width: 100%;
      word-wrap: break-word;
    }
    .resume { padding: 0; }
    header { margin-bottom: 1rem; }
    .resume h1 { font-size: 1.125rem; font-weight: 700; margin: 0; line-height: 1.25; }
    .contact { font-size: 10pt; color: #374151; margin-top: 0.125rem; }
    .section-heading {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #1f2937;
      border-bottom: 1px solid #d1d5db;
      padding-bottom: 0.25rem;
      margin-bottom: 0.5rem;
      margin-top: 1.25rem;
    }
    .section-heading:first-of-type { margin-top: 0; }
    .section-p { margin-top: 0.375rem; margin-bottom: 0; }
    .entry-group > .entry + .entry { margin-top: 0.75rem; }
    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .entry-title { font-weight: 600; font-size: 11pt; margin: 0; }
    .entry-dates { font-size: 10pt; color: #4b5563; flex-shrink: 0; white-space: nowrap; }
    .entry-meta { font-size: 10pt; color: #4b5563; margin: 0.125rem 0 0 0; }
    .bullet-list {
      margin: 0.375rem 0 0 0;
      padding-left: 1rem;
      list-style: disc outside;
    }
    .bullet-list li { margin-top: 0.125rem; padding-left: 0.125rem; }
  </style>
</head>
<body>
  <div class="resume">
    <header>
      <h1>${escapeHtml(resume.name)}</h1>
      ${contactLine ? `<p class="contact">${contactLine}</p>` : ""}
    </header>
    ${sections.join("")}
  </div>
</body>
</html>`;
}
