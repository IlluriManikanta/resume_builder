"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ExportButton } from "@/components/builder/ExportButton";
import type { Resume } from "@/lib/resume/schema";

interface BuilderShellProps {
  resumeId: string;
  resume: Resume | null;
  onSave: () => void | Promise<void>;
  left: React.ReactNode;
  right: React.ReactNode;
}

export function BuilderShell({
  resumeId,
  resume,
  onSave,
  left,
  right,
}: BuilderShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-white">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            ← Dashboard
          </Link>
          <span className="text-sm text-gray-500">Editing: {resumeId}</span>
        </div>
        <div className="flex items-center gap-2">
          {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && (
            <UserButton afterSignOutUrl="/" />
          )}
          <Link
            href={`/resume/${resumeId}/review`}
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded font-medium hover:bg-gray-50"
          >
            Review score
          </Link>
          {resume && <ExportButton resume={resume} />}
          <Button onClick={() => onSave()}>Save</Button>
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
