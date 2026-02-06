"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ResumeDoc {
  id: string;
  title: string;
  updatedAt: string;
}

interface RecentDocumentsProps {
  resumes: ResumeDoc[];
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}

export function RecentDocuments({ resumes }: RecentDocumentsProps) {
  const documents = resumes.slice(0, 5).map((r) => ({
    id: r.id,
    name: r.title,
    type: "Resume" as const,
    edited: formatRelativeTime(r.updatedAt),
    score: null as number | null,
  }));

  return (
    <div className="rounded-xl border border-[#403D39] bg-[#403D39]/40 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-5">
        <h3 className="text-sm font-semibold text-[#FFFCF2]">
          Recent Documents
        </h3>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-xs font-medium text-[#2563EB] transition-colors hover:text-[#1D4ED8]"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        {documents.length === 0 ? (
          <p className="px-6 pb-6 text-sm text-[#CCC5B9]">
            No documents yet. Create your first resume to get started.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-[#403D39]">
                <th className="px-6 py-3 text-left text-xs font-medium text-[#CCC5B9]">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#CCC5B9]">
                  Type
                </th>
                <th className="hidden px-6 py-3 text-left text-xs font-medium text-[#CCC5B9] sm:table-cell">
                  Last Edited
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#CCC5B9]">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-t border-[#403D39]/50 transition-colors hover:bg-[#403D39]/30"
                >
                  <td className="px-6 py-3.5 font-medium text-[#FFFCF2]">
                    <Link
                      href={`/resume/${doc.id}/builder`}
                      className="hover:text-[#2563EB]"
                    >
                      {doc.name}
                    </Link>
                  </td>
                  <td className="px-6 py-3.5 text-[#CCC5B9]">{doc.type}</td>
                  <td className="hidden px-6 py-3.5 text-[#CCC5B9] sm:table-cell">
                    {doc.edited}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    {doc.score !== null ? (
                      <Link
                        href={`/resume/${doc.id}/review`}
                        className="inline-flex rounded-full border border-[#2563EB]/30 px-2.5 py-0.5 text-xs font-medium text-[#2563EB]"
                      >
                        {doc.score}
                      </Link>
                    ) : (
                      <span className="text-xs text-[#CCC5B9]">--</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
