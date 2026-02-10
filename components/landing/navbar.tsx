"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Resume Analysis", href: "#analysis" },
  { label: "Templates", href: "#templates" },
  { label: "Pricing", href: "#pricing" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();

  async function handleGetStartedFree() {
    setMobileOpen(false);
    if (isSignedIn) {
      await signOut();
    }
    router.push("/sign-in");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#403D39]/50 bg-[#252422]/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-display text-2xl font-bold tracking-tight text-[#FFFCF2]"
        >
          Res<span className="text-primary">Vamp</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-[#CCC5B9] transition-colors hover:text-[#FFFCF2]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex md:items-center md:gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-[#403D39] bg-transparent text-[#CCC5B9] hover:bg-[#403D39] hover:text-[#FFFCF2]"
          >
            <Link href={isSignedIn ? "/dashboard" : "/sign-in"}>Log in</Link>
          </Button>
          <Button
            className="bg-primary text-primary-foreground hover:bg-accent"
            onClick={handleGetStartedFree}
          >
            Get Started Free
          </Button>
        </div>

        <button
          type="button"
          className="text-[#FFFCF2] md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-[#403D39]/50 bg-[#252422] px-6 pb-6 md:hidden">
          <ul className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-[#CCC5B9] transition-colors hover:text-[#FFFCF2]"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full border-[#403D39] bg-transparent text-[#CCC5B9] hover:bg-[#403D39] hover:text-[#FFFCF2]"
            >
              <Link href={isSignedIn ? "/dashboard" : "/sign-in"} onClick={() => setMobileOpen(false)}>
                Log in
              </Link>
            </Button>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-accent"
              onClick={handleGetStartedFree}
            >
              Get Started Free
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
