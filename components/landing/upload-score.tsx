"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const categoryLabels = [
  "Content Quality",
  "ATS Compatibility",
  "Job Match",
  "Writing Clarity",
];

const scoreSets = [
  [92, 85, 78, 90],
  [76, 91, 84, 68],
  [88, 73, 95, 82],
  [65, 88, 71, 94],
  [94, 79, 86, 75],
];

export function UploadScore() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const [setIndex, setSetIndex] = useState(0);
  const scores = scoreSets[setIndex];

  async function handleForceSignIn() {
    if (isSignedIn) await signOut();
    router.push("/sign-in");
  }
  const overall = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  useEffect(() => {
    const interval = setInterval(() => {
      setSetIndex((prev) => (prev + 1) % scoreSets.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-secondary px-6 py-20 md:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-balance font-display text-3xl font-bold text-foreground md:text-4xl">
            Upload Your Resume. Get Instant Insight.
          </h2>
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-card p-8 shadow-lg md:p-10">
          <div className="mb-8 text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Overall ResVamp Score
            </p>
            <p className="mt-2 font-display text-5xl font-bold text-primary">
              <span className="inline-block transition-all duration-700" key={overall}>
                {overall}
              </span>
              <span className="text-2xl text-muted-foreground">/100</span>
            </p>
          </div>

          <div className="space-y-5">
            {categoryLabels.map((label, i) => (
              <div key={label}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {label}
                  </span>
                  <span className="text-sm font-semibold text-primary transition-all duration-500">
                    {scores[i]}%
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted-foreground/20">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${scores[i]}%`,
                      transition:
                        "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button
              type="button"
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-accent"
              onClick={handleForceSignIn}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Resume
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
