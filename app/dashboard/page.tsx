"use client"

import { TopBar } from "@/components/dashboard/top-bar"
import { ActionTiles } from "@/components/dashboard/action-tiles"

export default function DashboardPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <TopBar />

      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-12 pt-24">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              Dashboard
            </h1>
            <p className="mt-2 text-base text-muted-foreground text-pretty">
              Choose what you want to create or improve.
            </p>
          </div>

          <ActionTiles />
        </div>
      </main>
    </div>
  )
}
