"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const templateStyles = [
  { name: "Executive", accent: "#2563EB" },
  { name: "Modern", accent: "#CCC5B9" },
  { name: "Classic", accent: "#403D39" },
  { name: "Minimal", accent: "#64748B" },
  { name: "Creative", accent: "#0D9488" },
];

function TemplateMockup({ tpl }: { tpl: { name: string; accent: string } }) {
  return (
    <div
      className="rounded-lg border border-border bg-[#FFFCF2] shadow-2xl"
      style={{ width: 180, height: 240 }}
    >
      <div className="p-4">
        <div
          className="mb-3 h-3 w-3/4 rounded"
          style={{ backgroundColor: tpl.accent }}
        />
        <div className="space-y-1.5">
          <div className="h-1.5 w-full rounded bg-[#CCC5B9]/40" />
          <div className="h-1.5 w-5/6 rounded bg-[#CCC5B9]/40" />
          <div className="h-1.5 w-4/5 rounded bg-[#CCC5B9]/40" />
        </div>
        <div
          className="my-3 h-px w-full"
          style={{ backgroundColor: tpl.accent, opacity: 0.3 }}
        />
        <div className="space-y-1.5">
          <div className="h-1.5 w-full rounded bg-[#CCC5B9]/40" />
          <div className="h-1.5 w-3/4 rounded bg-[#CCC5B9]/40" />
          <div className="h-1.5 w-5/6 rounded bg-[#CCC5B9]/40" />
          <div className="h-1.5 w-2/3 rounded bg-[#CCC5B9]/40" />
        </div>
        <div
          className="my-3 h-px w-full"
          style={{ backgroundColor: tpl.accent, opacity: 0.3 }}
        />
        <div className="space-y-1.5">
          <div className="h-1.5 w-full rounded bg-[#CCC5B9]/40" />
          <div className="h-1.5 w-4/5 rounded bg-[#CCC5B9]/40" />
        </div>
      </div>
      <div className="px-4 pb-3">
        <span className="text-[10px] font-medium text-[#403D39]/60">
          {tpl.name}
        </span>
      </div>
    </div>
  );
}

export function Templates() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => prev + 72);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const count = templateStyles.length;
  const radiusX = 200;
  const radiusY = 40;
  const angleStep = (2 * Math.PI) / count;

  return (
    <section id="templates" className="bg-secondary px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-balance font-display text-3xl font-bold text-foreground md:text-4xl">
            Clean, Professional Resume Templates
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Readable, recruiter-friendly, and ATS-safe
          </p>
        </div>

        <div className="mt-14 flex items-center justify-center">
          <div
            className="relative"
            style={{ width: radiusX * 2 + 200, height: 340 }}
          >
            {templateStyles.map((tpl, i) => {
              const baseAngle = (rotation * Math.PI) / 180;
              const angle = baseAngle + i * angleStep;
              const x = Math.cos(angle) * radiusX;
              const y = Math.sin(angle) * radiusY;
              const depth = Math.sin(angle);
              const scale = 0.75 + (depth + 1) * 0.175;
              const zIndex = Math.round((depth + 1) * 50);
              const opacity = 0.5 + (depth + 1) * 0.25;

              return (
                <div
                  key={tpl.name}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: `translate(-50%, -50%) translateX(${x}px) translateY(${y}px) scale(${scale})`,
                    zIndex,
                    opacity,
                    transition:
                      "all 1.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <TemplateMockup tpl={tpl} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="border-primary/50 bg-transparent text-primary hover:bg-primary/10 hover:text-primary"
            disabled
          >
            View Templates
          </Button>
        </div>
      </div>
    </section>
  );
}
