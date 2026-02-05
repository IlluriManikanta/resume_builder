import type { Resume } from "@/lib/resume/schema";

interface AtsTemplateV1Props {
  resume: Resume;
}

const SECTION_HEADING =
  "text-xs font-semibold uppercase tracking-wide text-gray-800 border-b border-gray-300 pb-0.5 mb-2 mt-5 first:mt-0";

function formatDateRange(
  start: string | undefined,
  end: string | undefined
): string {
  if (!start && !end) return "";
  return `${start ?? "?"} – ${end ?? "Present"}`;
}

export function AtsTemplateV1({ resume }: AtsTemplateV1Props) {
  return (
    <div className="font-sans text-[11pt] leading-snug text-gray-900 antialiased max-w-full break-words">
      {/* Header */}
      <header className="mb-4">
        <h1 className="text-lg font-bold leading-tight">{resume.name}</h1>
        <p className="text-[10pt] text-gray-700 mt-0.5">
          {[resume.email, resume.phone, resume.linkedin, resume.github]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </header>

      {/* Summary */}
      {resume.summary && (
        <section>
          <h2 className={SECTION_HEADING}>Summary</h2>
          <p className="mt-1.5 text-[11pt] leading-snug">{resume.summary}</p>
        </section>
      )}

      {/* Experience */}
      {resume.experience.length > 0 && (
        <section>
          <h2 className={SECTION_HEADING}>Experience</h2>
          <div className="space-y-3">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline gap-4 flex-wrap">
                  <p className="font-semibold text-[11pt]">
                    {exp.role}
                    {exp.company && `, ${exp.company}`}
                  </p>
                  <span className="text-[10pt] text-gray-600 shrink-0 whitespace-nowrap">
                    {formatDateRange(exp.startDate, exp.endDate)}
                  </span>
                </div>
                {exp.location && (
                  <p className="text-[10pt] text-gray-600 mt-0.5">
                    {exp.location}
                  </p>
                )}
                {exp.bullets.length > 0 && (
                  <ul className="mt-1.5 pl-4 list-disc list-outside space-y-0.5 text-[11pt]">
                    {exp.bullets.map((b, i) => (
                      <li key={i} className="pl-0.5">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {resume.projects.length > 0 && (
        <section>
          <h2 className={SECTION_HEADING}>Projects</h2>
          <div className="space-y-3">
            {resume.projects.map((proj) => (
              <div key={proj.id}>
                <p className="font-semibold text-[11pt]">{proj.name}</p>
                {proj.bullets.length > 0 && (
                  <ul className="mt-1.5 pl-4 list-disc list-outside space-y-0.5 text-[11pt]">
                    {proj.bullets.map((b, i) => (
                      <li key={i} className="pl-0.5">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <section>
          <h2 className={SECTION_HEADING}>Education</h2>
          <div className="space-y-3">
            {resume.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline gap-4 flex-wrap">
                  <p className="font-semibold text-[11pt]">
                    {edu.institution}
                    {(edu.degree || edu.field) &&
                      ` — ${[edu.degree, edu.field].filter(Boolean).join(" ")}`}
                  </p>
                  <span className="text-[10pt] text-gray-600 shrink-0 whitespace-nowrap">
                    {formatDateRange(edu.startDate, edu.endDate)}
                  </span>
                </div>
                {edu.location && (
                  <p className="text-[10pt] text-gray-600 mt-0.5">
                    {edu.location}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <section>
          <h2 className={SECTION_HEADING}>Skills</h2>
          <p className="mt-1.5 text-[11pt] leading-snug">
            {resume.skills.join(", ")}
          </p>
        </section>
      )}
    </div>
  );
}
