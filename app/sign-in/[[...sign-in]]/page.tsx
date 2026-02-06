import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { SignInCard } from "@/components/auth/sign-in-card";

export const metadata: Metadata = {
  title: "Sign In — ResVamp.ai",
  description:
    "Sign in to ResVamp and continue building your AI-powered, ATS-ready resume.",
};

export default async function SignInPage() {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (key) {
    const { userId } = await auth();
    if (userId) redirect("/dashboard");
  }
  if (!key) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="text-center text-[#CCC5B9]">
          <p>Sign-in is disabled until Clerk is configured.</p>
          <p className="mt-2 text-sm">
            Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY in
            .env.local.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-primary underline underline-offset-2 hover:text-primary/80"
          >
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12"
      style={{
        background:
          "radial-gradient(ellipse at 50% 30%, #1a2d5a 0%, #252422 70%)",
      }}
    >
      {/* Subtle blue glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 opacity-25"
        aria-hidden="true"
      >
        <div className="h-[500px] w-[700px] rounded-full bg-[#2563EB] blur-[180px]" />
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-8">
        <SignInCard />

        {/* Feature bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-[#CCC5B9]">
          <span className="rounded-full border border-[#403D39] px-3 py-1.5">
            ATS-Optimized
          </span>
          <span className="text-[#403D39]" aria-hidden="true">
            {"//"}
          </span>
          <span className="rounded-full border border-[#403D39] px-3 py-1.5">
            AI-Powered
          </span>
          <span className="text-[#403D39]" aria-hidden="true">
            {"//"}
          </span>
          <span className="rounded-full border border-[#403D39] px-3 py-1.5">
            Professional Templates
          </span>
        </div>
      </div>
    </div>
  );
}
