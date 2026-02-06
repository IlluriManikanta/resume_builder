const companies = [
  "Google",
  "Meta",
  "Apple",
  "Microsoft",
  "Amazon",
  "Netflix",
  "NVIDIA",
  "Stripe",
];

export function SocialProof() {
  return (
    <section className="bg-secondary px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-balance font-display text-3xl font-bold text-foreground md:text-4xl">
          Built for Candidates Targeting Top Companies
        </h2>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-16">
          {companies.map((company) => (
            <span
              key={company}
              className="font-display text-lg font-semibold tracking-wide text-muted-foreground/50 transition-colors hover:text-muted-foreground"
            >
              {company}
            </span>
          ))}
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Optimized for modern hiring pipelines
        </p>
      </div>
    </section>
  );
}
