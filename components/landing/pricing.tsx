"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Plan = {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted: boolean;
  cta: string;
  badge?: string;
};

const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["Manual resume builder", "Limited templates", "Basic export"],
    highlighted: false,
    cta: "Get Started",
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    features: [
      "AI bullet generation",
      "Resume analysis & scoring",
      "Unlimited exports",
      "All templates",
    ],
    highlighted: false,
    cta: "Start Pro",
  },
];

function getModalCtaLabel(planName: string): string {
  if (planName === "Free") return "Sign up";
  if (planName === "Pro") return "Upgrade";
  return "Get Started";
}

export function Pricing() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalPlan, setModalPlan] = useState<Plan | null>(null);

  async function handleForceSignIn() {
    if (isSignedIn) await signOut();
    closeModal();
    router.push("/sign-in");
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % plans.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const closeModal = useCallback(() => setModalPlan(null), []);

  useEffect(() => {
    if (modalPlan === null) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [modalPlan, closeModal]);

  return (
    <section id="pricing" className="bg-secondary px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-balance font-display text-3xl font-bold text-foreground md:text-4xl">
            Simple Pricing for Every Stage of Your Job Search
          </h2>
        </div>

        <div className="mt-14 grid max-w-2xl mx-auto gap-6 md:grid-cols-2">
          {plans.map((plan, i) => {
            const isPopped = i === activeIndex;

            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-8 ${
                  plan.highlighted
                    ? "border-primary bg-card shadow-[0_0_40px_rgba(37,99,235,0.15)]"
                    : "border-border bg-card shadow-sm"
                }`}
                style={{
                  transform: isPopped
                    ? "scale(1.04) translateY(-6px)"
                    : "scale(1) translateY(0)",
                  boxShadow: isPopped
                    ? "0 8px 30px rgba(37,99,235,0.18), 0 2px 8px rgba(0,0,0,0.06)"
                    : undefined,
                  transition:
                    "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.5s ease",
                }}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {plan.name}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="font-display text-4xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {plan.period}
                    </span>
                  </div>
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  type="button"
                  className={
                    plan.highlighted
                      ? "w-full bg-primary text-primary-foreground hover:bg-accent"
                      : "w-full border-border bg-transparent text-foreground hover:bg-secondary"
                  }
                  variant={plan.highlighted ? "default" : "outline"}
                  onClick={() => setModalPlan(plan)}
                >
                  {plan.cta}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Plan details modal */}
      {modalPlan && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
            aria-hidden
          />
          <div
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#403D39] bg-[#252422]/95 p-6 shadow-[0_0_60px_rgba(37,99,235,0.12)] backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="plan-modal-title"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id="plan-modal-title" className="font-display text-xl font-semibold text-[#FFFCF2]">
                {modalPlan.name}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-1 text-[#CCC5B9] transition-colors hover:bg-[#403D39] hover:text-[#FFFCF2] focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-2 text-sm text-[#CCC5B9]">
              {modalPlan.price}
              {modalPlan.period}
            </p>
            <ul className="mt-6 space-y-3">
              {modalPlan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-[#CCC5B9]">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-[#CCC5B9]/80">
              More details coming soon. Contact us for enterprise pricing.
            </p>
            <Button
              type="button"
              className="mt-6 w-full bg-primary text-primary-foreground hover:bg-accent"
              onClick={handleForceSignIn}
            >
              {getModalCtaLabel(modalPlan.name)}
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
