"use client";

import type {
  Resume,
  ExperienceEntry,
  EducationEntry,
  ProjectEntry,
} from "@/lib/resume/schema";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/button";
import { ImproveBulletButton } from "@/components/builder/ImproveBulletButton";

interface SectionEditorsProps {
  resume: Resume;
  onChange: (resume: Resume) => void;
}

function updateResume(resume: Resume, updates: Partial<Resume>): Resume {
  return { ...resume, ...updates };
}

function genId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// --- Contact ---
function ContactEditor({
  resume,
  onChange,
}: {
  resume: Resume;
  onChange: (r: Resume) => void;
}) {
  return (
    <Card>
      <h3 className="font-semibold mb-3">Contact</h3>
      <div className="space-y-2">
        <Input
          placeholder="Name"
          value={resume.name}
          onChange={(e) => onChange(updateResume(resume, { name: e.target.value }))}
        />
        <Input
          placeholder="Email"
          type="email"
          value={resume.email}
          onChange={(e) => onChange(updateResume(resume, { email: e.target.value }))}
        />
        <Input
          placeholder="Phone"
          value={resume.phone}
          onChange={(e) => onChange(updateResume(resume, { phone: e.target.value }))}
        />
        <Input
          placeholder="LinkedIn URL"
          value={resume.linkedin}
          onChange={(e) =>
            onChange(updateResume(resume, { linkedin: e.target.value }))
          }
        />
        <Input
          placeholder="GitHub URL"
          value={resume.github}
          onChange={(e) =>
            onChange(updateResume(resume, { github: e.target.value }))
          }
        />
      </div>
    </Card>
  );
}

// --- Experience ---
function ExperienceEditor({
  resume,
  onChange,
}: {
  resume: Resume;
  onChange: (r: Resume) => void;
}) {
  const setExperience = (experience: ExperienceEntry[]) =>
    onChange(updateResume(resume, { experience }));

  const addEntry = () => {
    setExperience([
      ...resume.experience,
      {
        id: genId("exp"),
        company: "",
        role: "",
        location: "",
        startDate: "",
        endDate: "",
        bullets: [],
      },
    ]);
  };

  const removeEntry = (index: number) => {
    setExperience(resume.experience.filter((_, i) => i !== index));
  };

  const updateEntry = (index: number, updates: Partial<ExperienceEntry>) => {
    const next = [...resume.experience];
    next[index] = { ...next[index], ...updates };
    setExperience(next);
  };

  const addBullet = (entryIndex: number) => {
    const entry = resume.experience[entryIndex];
    updateEntry(entryIndex, { bullets: [...entry.bullets, ""] });
  };

  const removeBullet = (entryIndex: number, bulletIndex: number) => {
    const entry = resume.experience[entryIndex];
    updateEntry(entryIndex, {
      bullets: entry.bullets.filter((_, i) => i !== bulletIndex),
    });
  };

  const setBullet = (entryIndex: number, bulletIndex: number, value: string) => {
    const entry = resume.experience[entryIndex];
    const next = [...entry.bullets];
    next[bulletIndex] = value;
    updateEntry(entryIndex, { bullets: next });
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Experience</h3>
        <Button variant="secondary" onClick={addEntry} type="button">
          Add entry
        </Button>
      </div>
      <div className="space-y-4">
        {resume.experience.map((entry, i) => (
          <div
            key={entry.id}
            className="border border-gray-200 rounded p-3 bg-white space-y-2"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs text-gray-500 font-medium">
                Experience {i + 1}
              </span>
              <Button
                variant="secondary"
                type="button"
                onClick={() => removeEntry(i)}
                className="text-red-600 hover:text-red-700 text-sm py-1 px-2"
              >
                Remove
              </Button>
            </div>
            <Input
              placeholder="Company"
              value={entry.company}
              onChange={(e) => updateEntry(i, { company: e.target.value })}
            />
            <Input
              placeholder="Role / Job title"
              value={entry.role}
              onChange={(e) => updateEntry(i, { role: e.target.value })}
            />
            <Input
              placeholder="Location"
              value={entry.location}
              onChange={(e) => updateEntry(i, { location: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Start date"
                value={entry.startDate}
                onChange={(e) => updateEntry(i, { startDate: e.target.value })}
              />
              <Input
                placeholder="End date"
                value={entry.endDate}
                onChange={(e) => updateEntry(i, { endDate: e.target.value })}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Bullets</span>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => addBullet(i)}
                  className="text-sm py-1 px-2"
                >
                  Add bullet
                </Button>
              </div>
              <ul className="space-y-2">
                {entry.bullets.map((b, bi) => (
                  <li key={bi} className="flex gap-2 items-start">
                    <Input
                      placeholder="Bullet point"
                      value={b}
                      onChange={(e) => setBullet(i, bi, e.target.value)}
                      className="flex-1"
                    />
                    <ImproveBulletButton
                      role={entry.role}
                      company={entry.company}
                      bullet={b}
                      skills={resume.skills}
                      onImproved={(improved) => setBullet(i, bi, improved)}
                    />
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() => removeBullet(i, bi)}
                      className="text-red-600 hover:text-red-700 shrink-0 py-1 px-2"
                    >
                      ×
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// --- Projects ---
function ProjectsEditor({
  resume,
  onChange,
}: {
  resume: Resume;
  onChange: (r: Resume) => void;
}) {
  const setProjects = (projects: ProjectEntry[]) =>
    onChange(updateResume(resume, { projects }));

  const addProject = () => {
    setProjects([
      ...resume.projects,
      { id: genId("proj"), name: "", bullets: [] },
    ]);
  };

  const removeProject = (index: number) => {
    setProjects(resume.projects.filter((_, i) => i !== index));
  };

  const updateProject = (index: number, updates: Partial<ProjectEntry>) => {
    const next = [...resume.projects];
    next[index] = { ...next[index], ...updates };
    setProjects(next);
  };

  const addBullet = (projIndex: number) => {
    const proj = resume.projects[projIndex];
    updateProject(projIndex, { bullets: [...proj.bullets, ""] });
  };

  const removeBullet = (projIndex: number, bulletIndex: number) => {
    const proj = resume.projects[projIndex];
    updateProject(projIndex, {
      bullets: proj.bullets.filter((_, i) => i !== bulletIndex),
    });
  };

  const setBullet = (
    projIndex: number,
    bulletIndex: number,
    value: string
  ) => {
    const proj = resume.projects[projIndex];
    const next = [...proj.bullets];
    next[bulletIndex] = value;
    updateProject(projIndex, { bullets: next });
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Projects</h3>
        <Button variant="secondary" onClick={addProject} type="button">
          Add project
        </Button>
      </div>
      <div className="space-y-4">
        {resume.projects.map((proj, i) => (
          <div
            key={proj.id}
            className="border border-gray-200 rounded p-3 bg-white space-y-2"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs text-gray-500 font-medium">
                Project {i + 1}
              </span>
              <Button
                variant="secondary"
                type="button"
                onClick={() => removeProject(i)}
                className="text-red-600 hover:text-red-700 text-sm py-1 px-2"
              >
                Remove
              </Button>
            </div>
            <Input
              placeholder="Project name"
              value={proj.name}
              onChange={(e) => updateProject(i, { name: e.target.value })}
            />
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Bullets</span>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => addBullet(i)}
                  className="text-sm py-1 px-2"
                >
                  Add bullet
                </Button>
              </div>
              <ul className="space-y-2">
                {proj.bullets.map((b, bi) => (
                  <li key={bi} className="flex gap-2 items-start">
                    <Input
                      placeholder="Bullet point"
                      value={b}
                      onChange={(e) => setBullet(i, bi, e.target.value)}
                      className="flex-1"
                    />
                    <ImproveBulletButton
                      role=""
                      company={proj.name}
                      bullet={b}
                      skills={resume.skills}
                      onImproved={(improved) => setBullet(i, bi, improved)}
                    />
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() => removeBullet(i, bi)}
                      className="text-red-600 hover:text-red-700 shrink-0 py-1 px-2"
                    >
                      ×
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// --- Education ---
function EducationEditor({
  resume,
  onChange,
}: {
  resume: Resume;
  onChange: (r: Resume) => void;
}) {
  const setEducation = (education: EducationEntry[]) =>
    onChange(updateResume(resume, { education }));

  const addEntry = () => {
    setEducation([
      ...resume.education,
      {
        id: genId("edu"),
        institution: "",
        degree: "",
        startDate: "",
        endDate: "",
      },
    ]);
  };

  const removeEntry = (index: number) => {
    setEducation(resume.education.filter((_, i) => i !== index));
  };

  const updateEntry = (index: number, updates: Partial<EducationEntry>) => {
    const next = [...resume.education];
    next[index] = { ...next[index], ...updates };
    setEducation(next);
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Education</h3>
        <Button variant="secondary" onClick={addEntry} type="button">
          Add entry
        </Button>
      </div>
      <div className="space-y-4">
        {resume.education.map((edu, i) => (
          <div
            key={edu.id}
            className="border border-gray-200 rounded p-3 bg-white space-y-2"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs text-gray-500 font-medium">
                Education {i + 1}
              </span>
              <Button
                variant="secondary"
                type="button"
                onClick={() => removeEntry(i)}
                className="text-red-600 hover:text-red-700 text-sm py-1 px-2"
              >
                Remove
              </Button>
            </div>
            <Input
              placeholder="School / Institution"
              value={edu.institution}
              onChange={(e) =>
                updateEntry(i, { institution: e.target.value })
              }
            />
            <Input
              placeholder="Degree (e.g. B.S., M.A.)"
              value={edu.degree}
              onChange={(e) => updateEntry(i, { degree: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Start date"
                value={edu.startDate}
                onChange={(e) => updateEntry(i, { startDate: e.target.value })}
              />
              <Input
                placeholder="End date"
                value={edu.endDate}
                onChange={(e) => updateEntry(i, { endDate: e.target.value })}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// --- Skills ---
function skillsFromText(text: string): string[] {
  return text
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function skillsToText(skills: string[]): string {
  return skills.join(", ");
}

function SkillsEditor({
  resume,
  onChange,
}: {
  resume: Resume;
  onChange: (r: Resume) => void;
}) {
  const value = skillsToText(resume.skills);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(
      updateResume(resume, { skills: skillsFromText(e.target.value) })
    );
  };
  return (
    <Card>
      <h3 className="font-semibold mb-3">Skills</h3>
      <Textarea
        placeholder="One per line or comma-separated (e.g. JavaScript, React, Node.js)"
        value={value}
        onChange={handleChange}
        rows={4}
      />
    </Card>
  );
}

// --- Summary ---
function SummaryEditor({
  resume,
  onChange,
}: {
  resume: Resume;
  onChange: (r: Resume) => void;
}) {
  const hasSummary = resume.summary !== undefined;

  const addSummary = () => {
    onChange(updateResume(resume, { summary: "" }));
  };

  const removeSummary = () => {
    onChange(updateResume(resume, { summary: undefined }));
  };

  if (!hasSummary) {
    return (
      <Card>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Summary</h3>
          <Button variant="secondary" onClick={addSummary} type="button">
            Add summary
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Summary</h3>
        <Button
          variant="secondary"
          type="button"
          onClick={removeSummary}
          className="text-red-600 hover:text-red-700 text-sm py-1 px-2"
        >
          Remove
        </Button>
      </div>
      <Textarea
        placeholder="Professional summary"
        value={resume.summary}
        onChange={(e) =>
          onChange(updateResume(resume, { summary: e.target.value }))
        }
      />
    </Card>
  );
}

export function SectionEditors({ resume, onChange }: SectionEditorsProps) {
  return (
    <div className="space-y-4">
      <ContactEditor resume={resume} onChange={onChange} />
      <SummaryEditor resume={resume} onChange={onChange} />
      <ExperienceEditor resume={resume} onChange={onChange} />
      <ProjectsEditor resume={resume} onChange={onChange} />
      <EducationEditor resume={resume} onChange={onChange} />
      <SkillsEditor resume={resume} onChange={onChange} />
    </div>
  );
}
