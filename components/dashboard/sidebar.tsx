"use client";

import { useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  FileText,
  Mail,
  Sparkles,
  LayoutTemplate,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard", active: true },
  { label: "Resumes", icon: FileText, href: "/dashboard" },
  { label: "Cover Letters", icon: Mail, href: "#" },
  { label: "AI Review", icon: Sparkles, href: "#" },
  { label: "Templates", icon: LayoutTemplate, href: "#" },
  { label: "Settings", icon: Settings, href: "#" },
];

export function DashboardSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useUser();

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-[#403D39] p-2 text-[#FFFCF2] lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-[#403D39] bg-[#252422] transition-transform lg:sticky lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo + close */}
        <div className="flex items-center justify-between px-6 py-6">
          <Link
            href="/"
            className="font-display text-xl font-bold text-[#FFFCF2]"
          >
            Res<span className="text-[#2563EB]">Vamp</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="text-[#CCC5B9] lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    item.active
                      ? "bg-[#2563EB]/10 text-[#2563EB]"
                      : "text-[#CCC5B9] hover:bg-[#403D39] hover:text-[#FFFCF2]"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User section */}
        <div className="border-t border-[#403D39] px-4 py-4">
          <div className="flex items-center gap-3">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                },
                variables: {
                  colorBackground: "#252422",
                  colorText: "#FFFCF2",
                  colorInputBackground: "#403D39",
                },
              }}
            />
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-[#FFFCF2]">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.emailAddresses[0]?.emailAddress ?? "User"}
              </p>
              <p className="truncate text-xs text-[#CCC5B9]">
                {user?.emailAddresses[0]?.emailAddress ?? ""}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
