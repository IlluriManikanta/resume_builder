"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

const scoreBreakdown = [
  { label: "Content Quality", score: 34, max: 40 },
  { label: "ATS & Structure", score: 18, max: 20 },
  { label: "Job Match", score: 12, max: 20 },
  { label: "Writing Quality", score: 14, max: 15 },
  { label: "Application Readiness", score: 7, max: 5 },
];

export function Insights() {
  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {/* Benchmark - Narrow */}
      <div className="rounded-xl border border-[#403D39] bg-[#403D39]/40 p-6 backdrop-blur-sm lg:col-span-2">
        <h3 className="text-sm font-semibold text-[#FFFCF2]">
          Benchmark Comparison
        </h3>

        {/* Mini chart area */}
        <div className="relative mt-6 h-32">
          <svg
            viewBox="0 0 200 80"
            className="h-full w-full"
            aria-label="Score benchmark chart"
          >
            <title>Benchmark chart showing your score vs target</title>
            {/* Area fill */}
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,60 Q25,50 50,45 T100,30 T150,25 T200,20 V80 H0 Z"
              fill="url(#areaGrad)"
            />
            <path
              d="M0,60 Q25,50 50,45 T100,30 T150,25 T200,20"
              fill="none"
              stroke="#2563EB"
              strokeWidth="2"
            />
            {/* Your score marker */}
            <circle cx="140" cy="24" r="4" fill="#2563EB" />
            <text
              x="140"
              y="16"
              textAnchor="middle"
              fill="#FFFCF2"
              fontSize="7"
              fontWeight="600"
            >
              85
            </text>
            {/* Target line */}
            <line
              x1="0"
              y1="18"
              x2="200"
              y2="18"
              stroke="#403D39"
              strokeDasharray="4"
            />
            <text
              x="196"
              y="14"
              textAnchor="end"
              fill="#CCC5B9"
              fontSize="6"
            >
              Target: 90+
            </text>
          </svg>
        </div>

        <p className="mt-3 text-xs text-[#CCC5B9]">
          Target 90+ to increase callback rates
        </p>
        <Link
          href="/dashboard"
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#2563EB] transition-colors hover:text-[#1D4ED8]"
        >
          How to improve <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Score Breakdown - Wide */}
      <div className="rounded-xl border border-[#403D39] bg-[#403D39]/40 p-6 backdrop-blur-sm lg:col-span-3">
        <h3 className="text-sm font-semibold text-[#FFFCF2]">
          Score Breakdown
        </h3>

        <div className="mt-5 flex flex-col gap-4">
          {scoreBreakdown.map((item) => {
            const pct = Math.round((item.score / item.max) * 100);
            return (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#CCC5B9]">{item.label}</span>
                  <span className="font-medium text-[#FFFCF2]">
                    {item.score} / {item.max}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-[#252422]">
                  <div
                    className="h-1.5 rounded-full bg-[#2563EB] transition-all"
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-5 text-xs text-[#CCC5B9]">
          Strong overall — keyword alignment is your biggest opportunity.
        </p>
        <Link
          href="/dashboard"
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#2563EB] transition-colors hover:text-[#1D4ED8]"
        >
          View full breakdown <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
