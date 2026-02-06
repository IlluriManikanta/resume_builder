import { Sparkles, ShieldCheck, Target } from "lucide-react";

const cards = [
  {
    icon: Sparkles,
    title: "AI Resume Revival",
    description:
      "Turn raw experience into clean, impact-driven bullet points.",
  },
  {
    icon: ShieldCheck,
    title: "ATS-Optimized Structure",
    description: "Designed to pass automated resume screeners.",
  },
  {
    icon: Target,
    title: "Stronger Job Alignment",
    description: "Match resumes to real job descriptions instantly.",
  },
];

export function ValueProps() {
  return (
    <section className="bg-secondary px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="group rounded-xl border border-border bg-card p-8 shadow-sm transition-all hover:border-primary/30 hover:shadow-[0_0_30px_rgba(37,99,235,0.12)]"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <card.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground">
              {card.title}
            </h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
