"use client"

import Link from "next/link"
import { UserButton } from "@clerk/nextjs"

export function TopBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <Link href="/" className="flex items-center gap-3">
        <span className="text-lg font-semibold tracking-tight text-foreground">
          ResVamp
        </span>
      </Link>

      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: "h-8 w-8",
          },
        }}
      />
    </header>
  )
}
