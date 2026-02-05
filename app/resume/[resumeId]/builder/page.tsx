"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { defaultResume } from "@/lib/resume/defaults";
import type { Resume } from "@/lib/resume/schema";
import { ResumePreview } from "@/components/templates/ResumePreview";
import { BuilderShell } from "@/components/builder/BuilderShell";
import { SectionEditors } from "@/components/builder/SectionEditors";

export default function BuilderPage() {
  const params = useParams();
  const resumeId = String(params.resumeId);
  const [resume, setResume] = useState<Resume | null>(null);

  useEffect(() => {
    setResume({ ...defaultResume, id: resumeId });
  }, [resumeId]);

  async function handleSave() {
    if (!resume) return;
    await fetch(`/api/resumes/${resumeId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resume),
    });
  }

  if (!resume) {
    return <div className="p-8">Loading…</div>;
  }

  return (
    <BuilderShell
      resumeId={resumeId}
      onSave={handleSave}
      left={
        <SectionEditors resume={resume} onChange={setResume} />
      }
      right={<ResumePreview resume={resume} />}
    />
  );
}
