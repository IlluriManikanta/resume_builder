"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["Manual resume builder", "Limited templates", "Basic export"],
    highlighted: false,
    cta: "Get Started",
    href: "/sign-in",
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
    href: "/sign-in",
  },
  {
    name: "Job Search Plan",
    price: "$29",
    period: "/3 months",
    badge: "Best Value",
    features: [
      "Everything in Pro",
      "Priority AI generation",
      "Cover letter builder",
      "LinkedIn optimization",
      "Unlimited revisions",
    ],
    highlighted: true,
    cta: "Start Job Search Plan",
    href: "/sign-in",
  },
];

export function Pricing() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % plans.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="pricing" className="bg-secondary px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-balance font-display text-3xl font-bold text-foreground md:text-4xl">
            Simple Pricing for Every Stage of Your Job Search
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
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
                  asChild
                  className={
                    plan.highlighted
                      ? "w-full bg-primary text-primary-foreground hover:bg-accent"
                      : "w-full border-border bg-transparent text-foreground hover:bg-secondary"
                  }
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
