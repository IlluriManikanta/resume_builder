"use client";

import { Shield, CreditCard, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const trustItems = [
  { icon: CreditCard, text: "No credit card required" },
  { icon: Shield, text: "Free plan available" },
  { icon: Clock, text: "Setup in under 2 minutes" },
];

export function Hero() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();

  async function handleForceSignIn() {
    if (isSignedIn) await signOut();
    router.push("/sign-in");
  }

  return (
    <section
      className="relative overflow-hidden px-6 pb-24 pt-20 md:pb-32 md:pt-28"
      style={{
        background:
          "linear-gradient(to bottom, #252422 0%, #1a2340 25%, #1a3a7a 45%, #4a7ad4 65%, #FFFCF2 100%)",
      }}
    >
      {/* Soft radial glow for warmth */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 opacity-40"
        aria-hidden="true"
      >
        <div className="h-[600px] w-[900px] rounded-full bg-[#2563EB] blur-[200px]" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <h1 className="text-balance font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
          <span className="text-primary">Revive Your Resume.</span>{" "}
          <span className="text-[#FFFCF2]">Reclaim Interviews.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-[#CCC5B9] md:text-xl">
          ResVamp uses AI to transform your experience into sharp, ATS-ready
          resumes built for today&apos;s hiring systems.
        </p>

        <div className="mt-10">
          <Button
            type="button"
            size="lg"
            className="h-14 rounded-xl bg-primary px-10 text-base font-semibold text-primary-foreground shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all hover:bg-accent hover:shadow-[0_0_60px_rgba(37,99,235,0.6)]"
            onClick={handleForceSignIn}
          >
            Start Free with ResVamp
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 md:gap-8">
          {trustItems.map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-[#CCC5B9]">
              <item.icon className="h-4 w-4 text-primary" />
              <span className="text-sm">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
