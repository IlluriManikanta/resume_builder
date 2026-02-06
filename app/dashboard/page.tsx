"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { ProgressCard } from "@/components/dashboard/progress-card";
import { KpiStrip } from "@/components/dashboard/kpi-strip";
import { Insights } from "@/components/dashboard/insights";
import { ActionCards } from "@/components/dashboard/action-cards";
import { Widgets } from "@/components/dashboard/widgets";
import { RecentDocuments } from "@/components/dashboard/recent-documents";

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

  async function handleCreateResume() {
    setCreating(true);
    try {
      const res = await fetch("/api/resumes/create", { method: "POST" });
      const data = await res.json();
      if (data.resumeId) {
        setResumes((prev) => [
          { id: data.resumeId, title: "Untitled Resume", updatedAt: new Date().toISOString() },
          ...prev,
        ]);
        router.push(`/resume/${data.resumeId}/builder`);
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error ?? "Failed to create resume");
      }
    } finally {
      setCreating(false);
    }
  }

  const resumeId = resumes[0]?.id ?? null;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#252422]">
        <p className="text-[#CCC5B9]">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#252422]">
      <DashboardSidebar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-6 py-8 lg:px-10">
          <DashboardHeader
            onCreateResume={handleCreateResume}
            creating={creating}
          />

          <div className="mt-8 flex flex-col gap-6">
            <ProgressCard />
            <KpiStrip
              resumeCount={resumes.length}
              reviewCount={resumes.length}
              avgScore={resumes.length > 0 ? 85 : null}
            />
            <Insights />
            <ActionCards
              onCreateResume={handleCreateResume}
              resumeId={resumeId}
              creating={creating}
            />
            <Widgets resumeId={resumeId} />
            <RecentDocuments resumes={resumes} />
          </div>
        </div>
      </main>
    </div>
  );
}
