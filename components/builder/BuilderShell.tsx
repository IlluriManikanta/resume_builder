"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface BuilderShellProps {
  resumeId: string;
  onSave: () => void | Promise<void>;
  left: React.ReactNode;
  right: React.ReactNode;
}

export function BuilderShell({
  resumeId,
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
        <Button onClick={() => onSave()}>Save</Button>
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
