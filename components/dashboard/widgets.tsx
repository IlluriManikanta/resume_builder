"use client";

import { RefreshCw, Pencil } from "lucide-react";
import Link from "next/link";

interface WidgetsProps {
  resumeId: string | null;
}

export function Widgets({ resumeId }: WidgetsProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Weekly Goals */}
      <div className="rounded-xl border border-[#403D39] bg-[#403D39]/40 p-6 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-[#FFFCF2]">Weekly Goals</h3>
        <p className="mt-1 text-xs text-[#CCC5B9]">1 of 3 complete</p>

        <div className="mt-4 flex flex-col gap-3">
          {[
            { label: "Update resume keywords", progress: 100 },
            { label: "Apply to 5 jobs", progress: 40 },
            { label: "Write a new cover letter", progress: 0 },
          ].map((goal) => (
            <div key={goal.label}>
              <div className="flex items-center justify-between text-sm">
                <span
                  className={
                    goal.progress === 100
                      ? "text-[#CCC5B9] line-through"
                      : "text-[#FFFCF2]"
                  }
                >
                  {goal.label}
                </span>
                <span className="text-xs text-[#CCC5B9]">{goal.progress}%</span>
              </div>
              <div className="mt-1 h-1 rounded-full bg-[#252422]">
                <div
                  className="h-1 rounded-full bg-[#2563EB] transition-all"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Tip */}
      <div className="flex flex-col justify-between rounded-xl border border-[#403D39] bg-[#403D39]/40 p-6 backdrop-blur-sm">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#FFFCF2]">
              Quick Tip
            </h3>
            <button
              type="button"
              className="text-[#CCC5B9] transition-colors hover:text-[#FFFCF2]"
              aria-label="Refresh tip"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[#CCC5B9]">
            &quot;Avoid first-person pronouns to keep bullets impact-focused.
            Start each line with a strong action verb.&quot;
          </p>
        </div>
        {resumeId ? (
          <Link
            href={`/resume/${resumeId}/builder`}
            className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8]"
          >
            <Pencil className="h-4 w-4" />
            Edit Resume
          </Link>
        ) : (
          <div className="mt-5 h-10" />
        )}
      </div>
    </div>
  );
}
