"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { defaultResume } from "@/lib/resume/defaults";
import { resumeSchema } from "@/lib/resume/schema";
import type { Resume } from "@/lib/resume/schema";
import { ResumePreview } from "@/components/templates/ResumePreview";
import { BuilderShell } from "@/components/builder/BuilderShell";
import { SectionEditors } from "@/components/builder/SectionEditors";

export default function BuilderPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = String(params.resumeId);
  const isDraft = resumeId === "new";

  const [resume, setResume] = useState<Resume | null>(isDraft ? { ...defaultResume } : null);
  const [documentTitle, setDocumentTitle] = useState<string>("Untitled Resume");
  const [loading, setLoading] = useState(!isDraft);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (isDraft) return;
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
        const json = await res.json();
        const data = json.data !== undefined ? json.data : json;
        const title = json.title ?? "Untitled Resume";
        setDocumentTitle(typeof title === "string" ? title : "Untitled Resume");
        const parsed = resumeSchema.safeParse(data);
        if (parsed.success) {
          setResume({ ...defaultResume, ...parsed.data, id: resumeId });
        } else {
          setResume({ ...defaultResume, ...data, id: resumeId });
        }
        return null;
      })
      .catch(() => {
        if (!cancelled)
          setLoadError("Failed to load resume. Check your connection.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [resumeId, isDraft]);

  const handleTitleChange = useCallback(
    async (newTitle: string) => {
      const value = newTitle.trim() || "Untitled Resume";
      setDocumentTitle(value);
      if (isDraft) return;
      const previousTitle = documentTitle;
      const res = await fetch(`/api/resumes/${resumeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: value }),
      });
      if (!res.ok) {
        setDocumentTitle(previousTitle);
      }
    },
    [resumeId, documentTitle, isDraft],
  );

  async function handleSave(): Promise<boolean> {
    if (!resume || loading || loadError) return false;
    if (isDraft) {
      const res = await fetch("/api/resumes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: resume, title: documentTitle }),
      });
      const result = await res.json();
      if (result.resumeId) {
        router.replace(`/resume/${result.resumeId}/builder`);
        return true;
      }
      return false;
    }
    const res = await fetch(`/api/resumes/${resumeId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resume),
    });
    return res.ok;
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
      documentTitle={documentTitle}
      onTitleChange={handleTitleChange}
      onSave={handleSave}
      loaded={loaded}
      isDraft={isDraft}
      left={
        <fieldset disabled={!loaded} className="border-0 p-0 m-0 min-w-0">
          <SectionEditors resume={resume} onChange={setResume} />
        </fieldset>
      }
      right={<ResumePreview resume={resume} />}
    />
  );
}
