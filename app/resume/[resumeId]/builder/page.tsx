"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { defaultResume } from "@/lib/resume/defaults";
import { resumeSchema } from "@/lib/resume/schema";
import type { Resume } from "@/lib/resume/schema";
import { ResumePreview } from "@/components/templates/ResumePreview";
import { BuilderShell } from "@/components/builder/BuilderShell";
import { SectionEditors } from "@/components/builder/SectionEditors";

export default function BuilderPage() {
  const params = useParams();
  const resumeId = String(params.resumeId);
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    fetch(`/api/resumes/${resumeId}`)
      .then(async (res) => {
        if (cancelled) return null;
        if (res.status === 401) {
          setLoadError("Please sign in to view this resume.");
          return null;
        }
        if (res.status === 404) {
          setLoadError("Resume not found.");
          return null;
        }
        if (!res.ok) {
          setLoadError("Failed to load resume.");
          return null;
        }
        const data = await res.json();
        const parsed = resumeSchema.safeParse(data);
        if (parsed.success) {
          setResume({ ...defaultResume, ...parsed.data, id: resumeId });
        } else {
          setResume({ ...defaultResume, ...data, id: resumeId });
        }
        return null;
      })
      .catch(() => {
        if (!cancelled) setLoadError("Failed to load resume. Check your connection.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [resumeId]);

  async function handleSave() {
    if (!resume || loading || loadError) return;
    await fetch(`/api/resumes/${resumeId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resume),
    });
  }

  const loaded = Boolean(!loading && !loadError && resume);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
        <p className="text-gray-700">{loadError}</p>
        <Link
          href="/dashboard"
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!resume) {
    return null;
  }

  return (
    <BuilderShell
      resumeId={resumeId}
      resume={resume}
      onSave={handleSave}
      loaded={loaded}
      left={
        <fieldset disabled={!loaded} className="border-0 p-0 m-0 min-w-0">
          <SectionEditors resume={resume} onChange={setResume} />
        </fieldset>
      }
      right={<ResumePreview resume={resume} />}
    />
  );
}
