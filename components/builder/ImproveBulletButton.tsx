"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AI_ENABLED } from "@/lib/config";

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
  const [improving, setImproving] = useState(false);
  const [previousBullet, setPreviousBullet] = useState<string | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null);

  async function handleImprove() {
    if (!AI_ENABLED || !bullet.trim()) {
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
          disabled={!AI_ENABLED || improving || !bullet.trim()}
          className="text-xs py-1 px-2"
          title={AI_ENABLED ? "Improve this bullet with AI" : AI_DISABLED_TITLE}
        >
          {improving ? "..." : "Improve"}
        </Button>
        {!AI_ENABLED && (
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
