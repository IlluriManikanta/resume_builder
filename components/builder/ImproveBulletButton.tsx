"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ImproveBulletButtonProps {
  role: string;
  company: string;
  bullet: string;
  skills: string[];
  onImproved: (improvedBullet: string) => void;
}

const AI_DISABLED_TITLE =
  "AI improvement disabled until OPENAI_API_KEY is configured.";

export function ImproveBulletButton({
  role,
  company,
  bullet,
  skills,
  onImproved,
}: ImproveBulletButtonProps) {
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiStatusLoading, setAiStatusLoading] = useState(true);
  const [improving, setImproving] = useState(false);
  const [previousBullet, setPreviousBullet] = useState<string | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/ai/status")
      .then((res) => (res.ok ? res.json() : { enabled: false }))
      .then((data) => setAiEnabled(Boolean(data?.enabled)))
      .catch(() => setAiEnabled(false))
      .finally(() => setAiStatusLoading(false));
  }, []);

  async function handleImprove() {
    if (!aiEnabled || !bullet.trim()) {
      if (!bullet.trim()) alert("Please enter a bullet point first");
      return;
    }

    setImproving(true);
    setPreviousBullet(bullet);
    setCanUndo(false);
    setRateLimitMessage(null);

    try {
      const res = await fetch("/api/ai/improve-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          company,
          bullet,
          skills,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 429) {
        const msg =
          data.error ??
          "Daily limit reached for AI improvement.";
        const detail =
          data.retryAfter === "tomorrow"
            ? " You can try again tomorrow."
            : data.limit != null
              ? ` Limit: ${data.limit} per day.`
              : "";
        setRateLimitMessage(msg + detail);
        setCanUndo(false);
        return;
      }

      if (!res.ok) {
        const msg = data.error ?? "Failed to improve bullet";
        if (data.error !== "OPENAI_API_KEY not set") {
          console.error("Improve bullet error:", msg);
        }
        alert(msg);
        setCanUndo(false);
        return;
      }

      const improved = data.improvedBullet || bullet;
      onImproved(improved);
      setCanUndo(true);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to improve bullet");
      setCanUndo(false);
    } finally {
      setImproving(false);
    }
  }

  function handleUndo() {
    if (previousBullet !== null) {
      onImproved(previousBullet);
      setCanUndo(false);
      setPreviousBullet(null);
    }
  }

  return (
    <div className="flex flex-col gap-1 shrink-0">
      <div className="flex gap-1 items-center">
        {canUndo && (
          <Button
            variant="secondary"
            type="button"
            onClick={handleUndo}
            className="text-xs py-1 px-2"
            title="Undo improvement"
          >
            Undo
          </Button>
        )}
        <Button
          variant="secondary"
          type="button"
          onClick={handleImprove}
          disabled={aiStatusLoading || !aiEnabled || improving || !bullet.trim()}
          className="text-xs py-1 px-2"
          title={aiEnabled ? "Improve this bullet with AI" : AI_DISABLED_TITLE}
        >
          {improving ? "..." : "Improve"}
        </Button>
        {!aiStatusLoading && !aiEnabled && (
          <span
            className="text-xs text-gray-500 whitespace-nowrap"
            title={AI_DISABLED_TITLE}
          >
            AI improvement disabled until OPENAI_API_KEY is configured.
          </span>
        )}
      </div>
      {rateLimitMessage && (
        <p className="text-xs text-amber-700" role="alert">
          {rateLimitMessage}
        </p>
      )}
    </div>
  );
}
