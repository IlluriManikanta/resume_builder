import { Check, Circle, Sparkles, Mail } from "lucide-react";
import Link from "next/link";

const steps = [
  { label: "Create your first resume", done: true, href: "/dashboard" },
  { label: "Run an AI review", done: false, href: "#" },
  { label: "Generate a cover letter", done: false, href: "#" },
];

export function ProgressCard() {
  const completed = steps.filter((s) => s.done).length;
  const percent = Math.round((completed / steps.length) * 100);

  return (
    <div className="rounded-xl border border-[#403D39] bg-[#403D39]/40 p-6 backdrop-blur-sm md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* Left side */}
        <div className="flex-1">
          <h2 className="font-display text-lg font-semibold text-[#FFFCF2]">
            Your Progress
          </h2>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#CCC5B9]">Completion</span>
              <span className="font-semibold text-[#FFFCF2]">{percent}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-[#252422]">
              <div
                className="h-2 rounded-full bg-[#2563EB] transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {/* Checklist */}
          <ul className="mt-5 flex flex-col gap-3">
            {steps.map((step) => (
              <li key={step.label} className="flex items-center gap-3 text-sm">
                {step.done ? (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2563EB]">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                ) : (
                  <Circle className="h-5 w-5 text-[#403D39]" />
                )}
                <span
                  className={
                    step.done
                      ? "text-[#CCC5B9] line-through"
                      : "text-[#FFFCF2]"
                  }
                >
                  {step.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right side CTAs */}
        <div className="flex flex-col gap-3 lg:w-52">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8]"
          >
            <Sparkles className="h-4 w-4" />
            Start AI Review
          </Link>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-lg border border-[#403D39] bg-transparent px-4 py-2.5 text-sm font-semibold text-[#FFFCF2] transition-colors hover:bg-[#403D39]"
          >
            <Mail className="h-4 w-4" />
            Create Cover Letter
          </button>
        </div>
      </div>
    </div>
  );
}
