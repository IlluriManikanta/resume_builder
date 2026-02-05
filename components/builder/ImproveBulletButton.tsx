"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface ImproveBulletButtonProps {
  role: string;
  company: string;
  bullet: string;
  skills: string[];
  onImproved: (improvedBullet: string) => void;
}

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

  async function handleImprove() {
    if (!bullet.trim()) {
      alert("Please enter a bullet point first");
      return;
    }

    setImproving(true);
    setPreviousBullet(bullet);
    setCanUndo(false);

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

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to improve bullet");
      }

      const data = await res.json();
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
    <div className="flex gap-1 shrink-0">
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
        disabled={improving || !bullet.trim()}
        className="text-xs py-1 px-2"
        title="Improve this bullet with AI"
      >
        {improving ? "..." : "Improve"}
      </Button>
    </div>
  );
}
