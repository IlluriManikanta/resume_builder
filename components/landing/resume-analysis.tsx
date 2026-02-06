"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

function AnimatedScoreRing() {
  const circumference = 2 * Math.PI * 54;
  const scores = [88, 72, 95, 64, 81, 91, 77];
  const [index, setIndex] = useState(0);
  const score = scores[index];
  const offset = circumference - (score / 100) * circumference;

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % scores.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [scores.length]);

  return (
    <div className="relative flex h-36 w-36 items-center justify-center">
      <svg className="h-36 w-36 -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="#CCC5B9"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="#2563EB"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span
          className="font-display text-3xl font-bold text-foreground transition-all duration-500"
          key={score}
        >
          {score}
        </span>
        <span className="text-xs text-muted-foreground">/100</span>
      </div>
    </div>
  );
}

export function ResumeAnalysis() {
  return (
    <section id="analysis" className="bg-background px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-display text-3xl font-bold text-foreground md:text-4xl">
            See Your Resume Through a Recruiter&apos;s Lens
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            ResVamp analyzes your resume the same way modern hiring systems do.
          </p>
        </div>

        <div className="mt-16 flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center lg:gap-16">
          {/* Resume mockup */}
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg">
            <div className="space-y-3">
              <div className="h-5 w-3/4 rounded bg-muted-foreground/20" />
              <div className="h-3 w-full rounded bg-muted-foreground/10" />
              <div className="h-3 w-5/6 rounded bg-muted-foreground/10" />
              <div className="mt-4 h-px w-full bg-border" />
              <div className="h-4 w-1/2 rounded bg-muted-foreground/20" />
              <div className="h-3 w-full rounded bg-muted-foreground/10" />
              <div className="h-3 w-4/5 rounded bg-muted-foreground/10" />
              <div className="h-3 w-3/4 rounded bg-muted-foreground/10" />
              <div className="mt-4 h-px w-full bg-border" />
              <div className="h-4 w-1/3 rounded bg-muted-foreground/20" />
              <div className="h-3 w-full rounded bg-muted-foreground/10" />
              <div className="h-3 w-5/6 rounded bg-muted-foreground/10" />
            </div>
          </div>

          {/* Analysis cards + score */}
          <div className="flex flex-col items-center gap-6">
            <AnimatedScoreRing />

            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-sm">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Strengths Detected
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Strong action verbs and quantified achievements found.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-sm">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#403D39]" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Improvement Areas
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Skills section could better match target job descriptions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-accent">
            <Link href="/dashboard">Analyze My Resume</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
