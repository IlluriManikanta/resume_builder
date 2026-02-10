"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { TopBar } from "@/components/dashboard/top-bar"
import { FileText, ArrowLeft } from "lucide-react"
import {
  SavedResumeList,
  type ResumeItem,
} from "@/components/resumes/SavedResumeList"

export default function SavedResumesPage() {
  const [resumes, setResumes] = useState<ResumeItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/resumes")
      .then((res) => (res.ok ? res.json() : { resumes: [] }))
      .then((data) => {
        setResumes(data.resumes ?? [])
      })
      .catch(() => setResumes([]))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = useCallback(async (resumeId: string) => {
    const res = await fetch(`/api/resumes/${resumeId}`, { method: "DELETE" })
    if (res.ok) {
      setResumes((prev) => prev.filter((r) => r.id !== resumeId))
    } else {
      alert("Failed to delete resume. Please try again.")
    }
  }, [])

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <TopBar />

      <main className="flex flex-1 flex-col px-4 pb-12 pt-24">
        <div className="mx-auto w-full max-w-3xl">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Saved Resumes
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              View and edit your previously created resumes.
            </p>
          </div>

          {!loading && resumes.length === 0 ? (
            <div className="rounded-xl border border-border/60 bg-card/80 p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                No resumes yet
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Create your first resume to get started.
              </p>
              <Link
                href="/dashboard"
                className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <SavedResumeList
              resumes={resumes}
              loading={loading}
              onDelete={handleDelete}
              variant="card"
              showEditArrow={true}
              maxHeight="none"
            />
          )}
        </div>
      </main>
    </div>
  )
}
