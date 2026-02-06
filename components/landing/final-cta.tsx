import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#252422] px-6 py-24 md:py-32">
      {/* Glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"
        aria-hidden="true"
      >
        <div className="h-[400px] w-[600px] rounded-full bg-[#2563EB] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-balance font-display text-3xl font-bold text-[#FFFCF2] md:text-4xl lg:text-5xl">
          Your resume decides if you get noticed. ResVamp makes sure it does.
        </h2>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="h-14 bg-primary px-8 text-base font-semibold text-primary-foreground shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:bg-accent"
          >
            <Link href="/sign-in">
              Create My Resume
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-14 border-[#403D39] bg-transparent px-8 text-base font-semibold text-[#FFFCF2] hover:bg-[#403D39]"
          >
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
