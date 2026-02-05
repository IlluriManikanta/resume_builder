"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Resume } from "@/lib/resume/schema";

interface ExportButtonProps {
  resume: Resume;
}

export function ExportButton({ resume }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch("/api/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resume),
      });

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
    <Button
      type="button"
      onClick={handleExport}
      disabled={exporting}
    >
      {exporting ? "Exporting…" : "Export PDF"}
    </Button>
  );
}
