"use client";

import type { Resume } from "@/lib/resume/schema";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface SectionEditorsProps {
  resume: Resume;
  onChange: (resume: Resume) => void;
}

function updateResume(
  resume: Resume,
  updates: Partial<Resume>
): Resume {
  return { ...resume, ...updates };
}

export function SectionEditors({ resume, onChange }: SectionEditorsProps) {
  return (
    <div className="space-y-4">
      <Card>
        <h3 className="font-semibold mb-3">Contact</h3>
        <div className="space-y-2">
          <Input
            placeholder="Name"
            value={resume.name}
            onChange={(e) =>
              onChange(updateResume(resume, { name: e.target.value }))
            }
          />
          <Input
            placeholder="Email"
            type="email"
            value={resume.email}
            onChange={(e) =>
              onChange(updateResume(resume, { email: e.target.value }))
            }
          />
          <Input
            placeholder="Phone"
            value={resume.phone}
            onChange={(e) =>
              onChange(updateResume(resume, { phone: e.target.value }))
            }
          />
        </div>
      </Card>
      <Card>
        <h3 className="font-semibold mb-3">Summary</h3>
        <Textarea
          placeholder="Professional summary"
          value={resume.summary}
          onChange={(e) =>
            onChange(updateResume(resume, { summary: e.target.value }))
          }
        />
      </Card>
      <Card>
        <h3 className="font-semibold mb-3">Skills (comma-separated)</h3>
        <Input
          placeholder="e.g. JavaScript, React, Node.js"
          value={resume.skills.join(", ")}
          onChange={(e) =>
            onChange(
              updateResume(resume, {
                skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              })
            )
          }
        />
      </Card>
    </div>
  );
}
