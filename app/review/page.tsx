"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { TopBar } from "@/components/dashboard/top-bar"
import { ArrowLeft, Upload, FileText, Info } from "lucide-react"
import {
  SavedResumeList,
  type ResumeItem,
} from "@/components/resumes/SavedResumeList"

export default function ReviewPage() {
  const [resumes, setResumes] = useState<ResumeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/resumes")
      .then((res) => (res.ok ? res.json() : { resumes: [] }))
      .then((data) => {
        setResumes(data.resumes ?? [])
      })
      .catch(() => setResumes([]))
      .finally(() => setLoading(false))
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    // UI only - no actual processing
  }, [])

  const handleDelete = useCallback(async (resumeId: string) => {
    const res = await fetch(`/api/resumes/${resumeId}`, { method: "DELETE" })
    if (res.ok) {
      setResumes((prev) => prev.filter((r) => r.id !== resumeId))
      // Clear selection if the deleted resume was selected
      if (selectedResumeId === resumeId) {
        setSelectedResumeId(null)
      }
    } else {
      alert("Failed to delete resume. Please try again.")
    }
  }, [selectedResumeId])

  const selectedResume = resumes.find((r) => r.id === selectedResumeId)

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <TopBar />

      <main className="flex flex-1 flex-col px-4 pb-12 pt-24">
        <div className="mx-auto w-full max-w-4xl">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Score Your Resume
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              Upload a resume or select one from your saved documents to get a
              score.
            </p>
          </div>

          {/* Coming Soon Notice */}
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
            <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Coming Soon
              </p>
              <p className="text-sm text-muted-foreground">
                Scoring functionality is under development. You can preview the
                UI and select a resume.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column: Upload + List */}
            <div className="space-y-6">
              {/* Upload Zone */}
              <div>
                <h2 className="mb-3 text-sm font-semibold text-foreground">
                  Upload a Resume
                </h2>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all duration-200 ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border/60 bg-card/50 hover:border-primary/50"
                  }`}
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="mt-3 text-sm font-medium text-foreground">
                    Drag and drop your resume
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    PDF, DOC, DOCX (max 10MB)
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    onChange={() => {
                      /* UI only */
                    }}
                  />
                </div>
              </div>

              {/* Saved Resumes List */}
              <div>
                <h2 className="mb-3 text-sm font-semibold text-foreground">
                  Or Select a Saved Resume
                </h2>
                <SavedResumeList
                  resumes={resumes}
                  loading={loading}
                  onDelete={handleDelete}
                  onSelect={setSelectedResumeId}
                  selectedId={selectedResumeId}
                  variant="compact"
                  maxHeight="400px"
                  emptyMessage="No saved resumes yet"
                />
              </div>
            </div>

            {/* Right Column: Selection Panel */}
            <div>
              <h2 className="mb-3 text-sm font-semibold text-foreground">
                Scoring Preview
              </h2>
              <div className="rounded-xl border border-border/60 bg-card/80 p-6 min-h-[300px] flex flex-col">
                {selectedResume ? (
                  <>
                    <div className="flex items-center gap-3 pb-4 border-b border-border/60">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {selectedResume.title || "Untitled Resume"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Selected for scoring
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center py-8">
                      <div className="h-16 w-16 rounded-full border-4 border-dashed border-border/60 flex items-center justify-center">
                        <span className="text-2xl font-bold text-muted-foreground/50">
                          ?
                        </span>
                      </div>
                      <p className="mt-4 text-sm font-medium text-foreground">
                        Scoring coming soon
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground text-center max-w-[200px]">
                        We&apos;ll analyze your resume and provide actionable
                        feedback.
                      </p>
                    </div>
                    <button
                      disabled
                      className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground opacity-50 cursor-not-allowed"
                    >
                      Score Resume (Coming Soon)
                    </button>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
                      <FileText className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-muted-foreground">
                      No resume selected
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground text-center">
                      Upload or select a resume from the list to score it.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
