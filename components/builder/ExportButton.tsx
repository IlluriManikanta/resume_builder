"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Resume } from "@/lib/resume/schema";

interface ExportButtonProps {
  resume: Resume;
}

export function ExportButton({ resume }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null);

  async function handleExport() {
    setExporting(true);
    setRateLimitMessage(null);
    try {
      const res = await fetch("/api/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resume),
      });

      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        const msg =
          data.error ?? "Daily limit reached for PDF export.";
        const detail =
          data.retryAfter === "tomorrow"
            ? " You can try again tomorrow."
            : data.limit != null
              ? ` Limit: ${data.limit} per day.`
              : "";
        setRateLimitMessage(msg + detail);
        return;
      }

      if (res.status === 503) {
        const data = await res.json().catch(() => ({}));
        setRateLimitMessage(
          data.error ?? "PDF export is not available in this environment."
        );
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Export failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to export PDF");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex flex-col gap-1 items-end">
      <Button
        type="button"
        onClick={handleExport}
        disabled={exporting}
      >
        {exporting ? "Exporting…" : "Export PDF"}
      </Button>
      {rateLimitMessage && (
        <p className="text-xs text-amber-700 max-w-xs text-right" role="alert">
          {rateLimitMessage}
        </p>
      )}
    </div>
  );
}
