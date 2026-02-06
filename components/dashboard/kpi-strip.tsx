import { FileText, Mail, Sparkles, Target } from "lucide-react";

interface KpiStripProps {
  resumeCount?: number;
  reviewCount?: number;
  avgScore?: number | null;
}

export function KpiStrip({
  resumeCount = 0,
  reviewCount = 0,
  avgScore = null,
}: KpiStripProps) {
  const stats = [
    { label: "Resumes", value: String(resumeCount), icon: FileText },
    { label: "Cover Letters", value: "0", icon: Mail },
    { label: "Reviews", value: String(reviewCount), icon: Sparkles },
    {
      label: "Avg Score",
      value: avgScore !== null ? String(avgScore) : "--",
      suffix: avgScore !== null ? "/ 100" : "",
      icon: Target,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="relative overflow-hidden rounded-xl border border-[#403D39] bg-[#403D39]/40 p-5 backdrop-blur-sm"
        >
          <div className="absolute left-0 top-0 h-full w-0.5 bg-[#2563EB]" />
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#252422]">
              <stat.icon className="h-4 w-4 text-[#2563EB]" />
            </div>
            <div>
              <p className="text-xs text-[#CCC5B9]">{stat.label}</p>
              <p className="font-display text-xl font-bold text-[#FFFCF2]">
                {stat.value}
                {stat.suffix && (
                  <span className="ml-1 text-sm font-normal text-[#CCC5B9]">
                    {stat.suffix}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
