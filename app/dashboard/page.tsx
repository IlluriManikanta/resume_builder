"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  async function handleCreateResume() {
    setCreating(true);
    try {
      const res = await fetch("/api/resumes/create", { method: "POST" });
      const data = await res.json();
      if (data.resumeId) {
        router.push(`/resume/${data.resumeId}/builder`);
      }
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-6 text-gray-600">Manage your resumes.</p>
      <div className="flex gap-4">
        <button
          onClick={handleCreateResume}
          disabled={creating}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {creating ? "Creating…" : "New Resume"}
        </button>
        <Link href="/" className="px-4 py-2 text-gray-600 hover:underline">
          Back home
        </Link>
      </div>
    </main>
  );
}
