"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { TopBar } from "@/components/dashboard/top-bar"
import { ArrowLeft, Upload, FileUp, Info } from "lucide-react"
import {
  SavedResumeList,
  type ResumeItem,
} from "@/components/resumes/SavedResumeList"

export default function ImportResumePage() {
  const [resumes, setResumes] = useState<ResumeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

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
    const files = e.dataTransfer.files
    if (files.length > 0) {
      setSelectedFile(files[0])
    }
  }, [])

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        setSelectedFile(files[0])
      }
    },
    []
  )

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
        <div className="mx-auto w-full max-w-2xl">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Edit an Existing Resume
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              Upload your resume to import and edit it in ResVamp.
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
                Resume import functionality is under development. Upload UI is
                available for preview.
              </p>
            </div>
          </div>

          {/* Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all duration-200 ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border/60 bg-card/50 hover:border-primary/50"
            }`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <p className="mt-4 text-base font-medium text-foreground">
              Drag and drop your resume here
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              or click to browse files
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Supports PDF, DOC, DOCX (max 10MB)
            </p>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </div>

          {/* Selected File Display */}
          {selectedFile && (
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-border/60 bg-card/80 p-4">
              <FileUp className="h-5 w-5 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Remove
              </button>
            </div>
          )}

          {/* Upload Button */}
          <button
            disabled
            className="mt-6 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground opacity-50 cursor-not-allowed"
          >
            Import Resume (Coming Soon)
          </button>

          {/* Saved Resumes Section */}
          <div className="mt-10">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Or pick a saved resume
            </h2>
            <SavedResumeList
              resumes={resumes}
              loading={loading}
              onDelete={handleDelete}
              variant="compact"
              maxHeight="400px"
              emptyMessage="No saved resumes yet"
              showEditArrow={false}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
