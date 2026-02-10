"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportButton } from "@/components/builder/ExportButton";
import type { Resume } from "@/lib/resume/schema";

interface BuilderShellProps {
  resumeId: string;
  resume: Resume | null;
  documentTitle: string;
  onTitleChange: (title: string) => void | Promise<void>;
  onSave: () => void | Promise<boolean>;
  loaded?: boolean;
  isDraft?: boolean;
  left: React.ReactNode;
  right: React.ReactNode;
}

export function BuilderShell({
  resumeId,
  resume,
  documentTitle,
  onTitleChange,
  onSave,
  loaded = true,
  isDraft = false,
  left,
  right,
}: BuilderShellProps) {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSaveClick() {
    if (!loaded || saving) return;
    setSaving(true);
    setSaved(false);
    try {
      const success = await onSave();
      if (success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 600);
      }
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (
      titleInputRef.current &&
      documentTitle !== titleInputRef.current.value
    ) {
      titleInputRef.current.value = documentTitle;
    }
  }, [documentTitle]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-white">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <Link
            href="/dashboard"
            className="text-gray-600 hover:text-gray-900 shrink-0"
          >
            ← Dashboard
          </Link>
          <input
            ref={titleInputRef}
            type="text"
            defaultValue={documentTitle}
            onBlur={(e) => {
              const v = e.target.value.trim() || "Untitled Resume";
              if (v !== documentTitle) onTitleChange(v);
              e.target.value = v;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
            className="text-sm font-medium text-gray-900 bg-transparent border-0 border-b border-transparent hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-0 px-1 py-0.5 max-w-[240px] truncate"
            placeholder="Untitled Resume"
            disabled={!loaded}
            aria-label="Document title"
          />
        </div>
        <div className="flex items-center gap-2">
          {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && (
            <UserButton afterSignOutUrl="/" />
          )}
          {!isDraft && (
            <Link
              href={`/resume/${resumeId}/review`}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded font-medium hover:bg-gray-50"
            >
              Review score
            </Link>
          )}
          {resume && <ExportButton resume={resume} />}
          <Button
            onClick={handleSaveClick}
            disabled={!loaded || saving}
            className="min-w-[4.5rem] relative overflow-hidden"
          >
            {saved ? (
              <span className="inline-flex items-center justify-center animate-check-pop">
                <Check className="h-4 w-4" strokeWidth={3} />
              </span>
            ) : saving ? (
              "Saving…"
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </header>
      <div className="flex-1 flex min-h-0">
        <aside className="w-1/2 border-r border-gray-200 overflow-auto p-4 bg-gray-50">
          {left}
        </aside>
        <main className="w-1/2 overflow-auto p-4 bg-white">{right}</main>
      </div>
    </div>
  );
}
