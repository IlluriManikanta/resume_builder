"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 23 23" aria-hidden="true">
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
      <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}

const buttonClass =
  "flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#403D39] bg-[#403D39]/40 text-sm font-medium text-[#FFFCF2] transition-all hover:border-[#CCC5B9]/30 hover:bg-[#403D39]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50";

export function SignInCard() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { signIn, isLoaded } = useSignIn();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  async function handleOAuth(strategy: "oauth_google" | "oauth_microsoft") {
    if (!signIn || !isLoaded) return;
    if (isSignedIn) {
      router.replace("/dashboard");
      return;
    }
    await signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: "/sign-in/sso-callback",
      redirectUrlComplete: "/dashboard",
    });
  }

  return (
    <div className="w-full rounded-2xl border border-[#403D39]/60 bg-[#252422]/80 p-8 shadow-[0_0_60px_rgba(37,99,235,0.08)] backdrop-blur-xl sm:p-10">
      {/* Brand */}
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight text-[#FFFCF2]">
          Res<span className="text-primary">Vamp</span>
        </h1>
        <div className="mx-auto mt-3 h-px w-12 bg-primary/40" />
      </div>

      {/* Title */}
      <div className="mt-8 text-center">
        <h2 className="font-display text-xl font-semibold text-[#FFFCF2]">
          Access Your Account
        </h2>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-[#CCC5B9]">
          Continue building a job-ready resume with AI-powered tools designed
          for modern hiring.
        </p>
      </div>

      {/* Trust line */}
      <div className="mt-6 flex items-center justify-center gap-2 text-[#CCC5B9]">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs">Always free to get started</span>
      </div>

      {/* Auth buttons */}
      <div className="mt-8 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => handleOAuth("oauth_google")}
          disabled={!isLoaded}
          className={buttonClass}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <button
          type="button"
          onClick={() => handleOAuth("oauth_microsoft")}
          disabled={!isLoaded}
          className={buttonClass}
        >
          <MicrosoftIcon />
          Continue with Microsoft
        </button>
      </div>

      {/* Legal text */}
      <p className="mt-6 text-center text-xs leading-relaxed text-[#CCC5B9]/60">
        By continuing, you agree to our{" "}
        <Link
          href="/privacy"
          className="text-[#CCC5B9] underline underline-offset-2 transition-colors hover:text-primary"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="text-[#CCC5B9] underline underline-offset-2 transition-colors hover:text-primary"
        >
          Privacy Policy
        </Link>
      </p>

      {/* Back link */}
      <div className="mt-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[#CCC5B9] transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
