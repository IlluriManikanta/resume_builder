import type { Resume } from "@/lib/resume/schema";

interface AtsTemplateV1Props {
  resume: Resume;
}

export function AtsTemplateV1({ resume }: AtsTemplateV1Props) {
  return (
    <div className="font-sans text-sm text-gray-800">
      <h1 className="text-xl font-bold">{resume.name}</h1>
      <p className="text-gray-600">
        {[resume.email, resume.phone].filter(Boolean).join(" · ")}
      </p>
      {resume.summary && (
        <section className="mt-4">
          <h2 className="font-semibold text-gray-700">Summary</h2>
          <p className="mt-1">{resume.summary}</p>
        </section>
      )}
      {resume.experience.length > 0 && (
        <section className="mt-4">
          <h2 className="font-semibold text-gray-700">Experience</h2>
          {resume.experience.map((exp) => (
            <div key={exp.id} className="mt-2">
              <p className="font-medium">{exp.role} at {exp.company}</p>
              <p className="text-gray-600 text-xs">
                {exp.location}
                {exp.startDate || exp.endDate
                  ? ` · ${exp.startDate ?? "?"} – ${exp.endDate ?? "Present"}`
                  : ""}
              </p>
              <ul className="list-disc list-inside mt-1 ml-2">
                {exp.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}
      {resume.education.length > 0 && (
        <section className="mt-4">
          <h2 className="font-semibold text-gray-700">Education</h2>
          {resume.education.map((edu) => (
            <div key={edu.id} className="mt-2">
              <p className="font-medium">{edu.institution}</p>
              <p className="text-gray-600 text-xs">
                {edu.degree} {edu.field} {edu.endDate && `· ${edu.endDate}`}
              </p>
            </div>
          ))}
        </section>
      )}
      {resume.skills.length > 0 && (
        <section className="mt-4">
          <h2 className="font-semibold text-gray-700">Skills</h2>
          <p className="mt-1">{resume.skills.join(", ")}</p>
        </section>
      )}
    </div>
  );
}
