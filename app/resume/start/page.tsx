import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { TopBar } from "@/components/dashboard/top-bar"
import { ResumeStartOptions } from "@/components/resume-start/ResumeStartOptions"

export default function ResumeStartPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <TopBar />

      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-12 pt-24">
        <div className="mx-auto w-full max-w-xl">
          <Link
            href="/dashboard"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
              Start a new resume
            </h1>
            <p className="mt-2 text-base text-muted-foreground text-pretty">
              Choose how you want to begin.
            </p>
          </div>

          <ResumeStartOptions />
        </div>
      </main>
    </div>
  )
}
