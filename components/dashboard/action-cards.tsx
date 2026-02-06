"use client";

import { FileText, Mail, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ActionCardsProps {
  onCreateResume: () => Promise<void>;
  resumeId: string | null;
  creating: boolean;
}

const actions = [
  {
    title: "Resume Builder",
    description: "Create or edit resumes using templates",
    button: "Open Builder",
    icon: FileText,
    type: "resume" as const,
  },
  {
    title: "Cover Letter Studio",
    description: "Generate tailored cover letters",
    button: "Generate",
    icon: Mail,
    type: "cover" as const,
  },
  {
    title: "AI Review",
    description: "Analyze and score your resume",
    button: "Run Review",
    icon: Sparkles,
    type: "review" as const,
  },
];

export function ActionCards({
  onCreateResume,
  resumeId,
  creating,
}: ActionCardsProps) {
  const router = useRouter();

  async function handleAction(type: "resume" | "cover" | "review") {
    if (type === "resume") {
      if (resumeId) {
        router.push(`/resume/${resumeId}/builder`);
      } else {
        await onCreateResume();
      }
    } else if (type === "review" && resumeId) {
      router.push(`/resume/${resumeId}/review`);
    } else if (type === "review" && !resumeId) {
      await onCreateResume();
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {actions.map((action) => (
        <div
          key={action.title}
          className="group flex flex-col justify-between rounded-xl border border-[#403D39] bg-[#403D39]/40 p-6 backdrop-blur-sm transition-colors hover:border-[#2563EB]/30"
        >
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#252422]">
              <action.icon className="h-5 w-5 text-[#2563EB]" />
            </div>
            <h3 className="mt-4 font-display text-base font-semibold text-[#FFFCF2]">
              {action.title}
            </h3>
            <p className="mt-1 text-sm text-[#CCC5B9]">
              {action.description}
            </p>
          </div>
          {action.type === "resume" && resumeId ? (
            <Link
              href={`/resume/${resumeId}/builder`}
              className="mt-5 block w-full rounded-lg border border-[#403D39] bg-transparent px-4 py-2 text-center text-sm font-medium text-[#FFFCF2] transition-colors hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB]"
            >
              {action.button}
            </Link>
          ) : action.type === "review" && resumeId ? (
            <Link
              href={`/resume/${resumeId}/review`}
              className="mt-5 block w-full rounded-lg border border-[#403D39] bg-transparent px-4 py-2 text-center text-sm font-medium text-[#FFFCF2] transition-colors hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB]"
            >
              {action.button}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => handleAction(action.type)}
              disabled={creating}
              className="mt-5 w-full rounded-lg border border-[#403D39] bg-transparent px-4 py-2 text-sm font-medium text-[#FFFCF2] transition-colors hover:bg-[#2563EB] hover:text-white disabled:opacity-50"
            >
              {creating ? "Creating…" : action.button}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
