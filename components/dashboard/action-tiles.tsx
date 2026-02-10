"use client"

import Link from "next/link"
import {
  FilePlus2,
  FileEdit,
  Star,
  FileText,
  FolderOpen,
} from "lucide-react"

export function ActionTiles() {
  const tileBaseClasses =
    "group relative flex flex-col gap-3 rounded-xl border border-border/60 bg-card/80 p-6 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_0_20px_-4px] hover:shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

  const disabledTileClasses =
    "group relative flex flex-col gap-3 rounded-xl border border-border/60 bg-card/80 p-6 backdrop-blur-sm opacity-60 cursor-not-allowed"

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Button A: Build resume from scratch */}
      <Link href="/resume/start" className={tileBaseClasses}>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
          <FilePlus2 className="h-5 w-5 text-primary transition-colors" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-foreground">
            Build resume from scratch
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Start a new resume with guided sections.
          </p>
        </div>
      </Link>

      {/* Button B: Edit an existing resume (upload) */}
      <Link href="/resume/import" className={tileBaseClasses}>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
          <FileEdit className="h-5 w-5 text-primary transition-colors" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-foreground">
            Edit an existing resume
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Upload a resume from your laptop to edit.
          </p>
        </div>
      </Link>

      {/* Button C: Score your resume */}
      <Link href="/review" className={tileBaseClasses}>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
          <Star className="h-5 w-5 text-primary transition-colors" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-foreground">
            Score your resume
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Upload a resume or select one you created in ResVamp.
          </p>
        </div>
      </Link>

      {/* Button D: Make a cover letter (Coming soon) */}
      <div className={disabledTileClasses}>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
          <FileText className="h-5 w-5 text-muted-foreground transition-colors" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-foreground">
            Make a cover letter
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Coming soon — generate from a job description + your resume.
          </p>
        </div>
      </div>

      {/* Button E: Access saved resumes */}
      <Link href="/resumes" className={tileBaseClasses}>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
          <FolderOpen className="h-5 w-5 text-primary transition-colors" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-foreground">
            Access saved resumes
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            View resumes and cover letters made in ResVamp.
          </p>
        </div>
      </Link>
    </div>
  )
}
