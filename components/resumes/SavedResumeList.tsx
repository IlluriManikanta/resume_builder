"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { FileText, Loader2, Trash2, CheckCircle2, Search } from "lucide-react"
import { Input } from "@/components/ui/Input"

export interface ResumeItem {
  id: string
  title: string
  updatedAt: string
  score: number | null
  scoredAt: string | null
}

interface SavedResumeListProps {
  resumes: ResumeItem[]
  loading: boolean
  onDelete: (resumeId: string) => Promise<void>
  /** If provided, renders as selectable buttons; otherwise renders as links to builder */
  onSelect?: (resumeId: string) => void
  /** Currently selected resume ID (only used when onSelect is provided) */
  selectedId?: string | null
  /** Empty state message */
  emptyMessage?: string
  /** Whether to show the "Edit →" text on link items */
  showEditArrow?: boolean
  /** Max height for scrollable list */
  maxHeight?: string
  /** Variant: "card" for full card style, "compact" for smaller list items */
  variant?: "card" | "compact"
}

export function SavedResumeList({
  resumes,
  loading,
  onDelete,
  onSelect,
  selectedId,
  emptyMessage = "No saved resumes yet",
  showEditArrow = true,
  maxHeight = "400px",
  variant = "card",
}: SavedResumeListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredResumes = useMemo(() => {
    if (!searchQuery.trim()) return resumes
    const q = searchQuery.trim().toLowerCase()
    return resumes.filter((r) =>
      (r.title || "Untitled Resume").toLowerCase().includes(q)
    )
  }, [resumes, searchQuery])

  const hasResumes = resumes.length > 0
  const hasNoMatches = hasResumes && filteredResumes.length === 0

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  async function handleDelete(e: React.MouseEvent, resumeId: string) {
    e.preventDefault()
    e.stopPropagation()

    const confirmed = window.confirm(
      "Delete this resume? This cannot be undone."
    )
    if (!confirmed) return

    setDeletingId(resumeId)
    try {
      await onDelete(resumeId)
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (resumes.length === 0) {
    return (
      <div className="rounded-xl border border-border/60 bg-card/50 p-6 text-center">
        <FileText className="mx-auto h-8 w-8 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  const searchInput = (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search resumes by title…"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-9 border-border/60 bg-card/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
        aria-label="Search resumes by title"
      />
    </div>
  )

  if (hasNoMatches) {
    return (
      <div>
        {searchInput}
        <div className="rounded-xl border border-border/60 bg-card/50 p-6 text-center">
          <FileText className="mx-auto h-8 w-8 text-muted-foreground/50" />
          <p className="mt-2 text-sm text-muted-foreground">
            No resumes match your search.
          </p>
        </div>
      </div>
    )
  }

  // Compact variant (for /review page style)
  if (variant === "compact") {
    return (
      <div>
        {searchInput}
        <div
          className="space-y-2 overflow-y-auto"
          style={{ maxHeight }}
        >
          {filteredResumes.map((resume) => {
          const isSelected = selectedId === resume.id
          const isDeleting = deletingId === resume.id

          if (onSelect) {
            // Selectable button mode
            return (
              <div
                key={resume.id}
                className={`flex items-center gap-3 rounded-lg border p-3 transition-all duration-200 ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border/60 bg-card/80 hover:border-primary/50"
                }`}
              >
                <button
                  onClick={() => onSelect(resume.id)}
                  className="flex flex-1 items-center gap-3 text-left min-w-0"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary flex-shrink-0">
                    {isSelected ? (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    ) : (
                      <FileText className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {resume.title || "Untitled Resume"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Updated {formatDate(resume.updatedAt)}
                    </p>
                  </div>
                  {resume.score !== null && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary flex-shrink-0">
                      {resume.score}
                    </span>
                  )}
                </button>
                <button
                  onClick={(e) => handleDelete(e, resume.id)}
                  disabled={isDeleting}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50 flex-shrink-0"
                  aria-label="Delete resume"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            )
          }

          // Link mode (navigate to builder)
          return (
            <div
              key={resume.id}
              className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/80 p-3 transition-all duration-200 hover:border-primary/50"
            >
              <Link
                href={`/resume/${resume.id}/builder`}
                className="flex flex-1 items-center gap-3 min-w-0"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary flex-shrink-0">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {resume.title || "Untitled Resume"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Updated {formatDate(resume.updatedAt)}
                  </p>
                </div>
                {resume.score !== null && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary flex-shrink-0">
                    {resume.score}
                  </span>
                )}
              </Link>
              <button
                onClick={(e) => handleDelete(e, resume.id)}
                disabled={isDeleting}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50 flex-shrink-0"
                aria-label="Delete resume"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>
          )
          })}
        </div>
      </div>
    )
  }

  // Card variant (for /resumes page style)
  return (
    <div>
      {searchInput}
      <div className="space-y-3 overflow-y-auto" style={{ maxHeight }}>
        {filteredResumes.map((resume) => {
          const isDeleting = deletingId === resume.id

          return (
          <div
            key={resume.id}
            className="flex items-center justify-between rounded-xl border border-border/60 bg-card/80 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_0_20px_-4px] hover:shadow-primary/20"
          >
            <Link
              href={`/resume/${resume.id}/builder`}
              className="flex flex-1 items-center gap-4 min-w-0"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary flex-shrink-0">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate">
                  {resume.title || "Untitled Resume"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Updated {formatDate(resume.updatedAt)}
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-3 flex-shrink-0">
              {resume.score !== null && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Score: {resume.score}
                </span>
              )}
              {showEditArrow && (
                <Link
                  href={`/resume/${resume.id}/builder`}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Edit &rarr;
                </Link>
              )}
              <button
                onClick={(e) => handleDelete(e, resume.id)}
                disabled={isDeleting}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50"
                aria-label="Delete resume"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          )
        })}
      </div>
    </div>
  )
}
