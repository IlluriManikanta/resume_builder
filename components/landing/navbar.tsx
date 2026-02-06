"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Resume Analysis", href: "#analysis" },
  { label: "Templates", href: "#templates" },
  { label: "Pricing", href: "#pricing" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

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

        <div className="hidden md:block">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-accent">
            <Link href="/sign-in">Get Started Free</Link>
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
          <Button
            asChild
            className="mt-4 w-full bg-primary text-primary-foreground hover:bg-accent"
          >
            <Link href="/sign-in">Get Started Free</Link>
          </Button>
        </div>
      )}
    </header>
  );
}
