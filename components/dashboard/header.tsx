"use client";

import { Bell, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";

interface DashboardHeaderProps {
  onCreateResume: () => Promise<void>;
  creating: boolean;
}

export function DashboardHeader({ onCreateResume, creating }: DashboardHeaderProps) {
  const router = useRouter();

  async function handleCreateNew() {
    await onCreateResume();
  }

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#FFFCF2] md:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-[#CCC5B9]">
          Track your progress and strengthen your applications.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleCreateNew}
          disabled={creating}
          className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {creating ? "Creating…" : "Create New"}
        </button>
        <button
          type="button"
          className="relative rounded-lg bg-[#403D39] p-2.5 text-[#CCC5B9] transition-colors hover:text-[#FFFCF2]"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#2563EB]" />
        </button>
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
      </div>
    </header>
  );
}
