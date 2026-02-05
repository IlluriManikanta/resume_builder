"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

interface ResumeItem {
  id: string;
  title: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/resumes")
      .then((res) => (res.ok ? res.json() : { resumes: [] }))
      .then((data) => {
        setResumes(data.resumes ?? []);
      })
      .catch(() => setResumes([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleNewResume() {
    setCreating(true);
    try {
      if (resumes.length >= 1) {
        router.push(`/resume/${resumes[0].id}/builder`);
        return;
      }
      const res = await fetch("/api/resumes/create", { method: "POST" });
      const data = await res.json();
      if (data.resumeId) {
        router.push(`/resume/${data.resumeId}/builder`);
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error ?? "Failed to create resume");
      }
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && (
          <UserButton afterSignOutUrl="/" />
        )}
      </div>
      <p className="mb-6 text-gray-600">Manage your resume.</p>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <div className="flex flex-col gap-4">
          <button
            onClick={handleNewResume}
            disabled={creating}
            className="w-fit px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {creating ? "Opening…" : resumes.length >= 1 ? "Open my resume" : "New Resume"}
          </button>
          {resumes.length >= 1 && (
            <p className="text-sm text-gray-500">
              MVP: one resume per account. Click above to edit.
            </p>
          )}
          <Link href="/" className="w-fit text-gray-600 hover:underline">
            Back home
          </Link>
        </div>
      )}
    </main>
  );
}
