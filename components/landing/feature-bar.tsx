import { LayoutTemplate, Wand2, FileDown } from "lucide-react";

const features = [
  { icon: LayoutTemplate, text: "Industry-tested layouts" },
  { icon: Wand2, text: "AI-generated bullet points" },
  { icon: FileDown, text: "One-click PDF export" },
];

export function FeatureBar() {
  return (
    <section id="features" className="bg-secondary px-6 py-16">
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
        {features.map((feat) => (
          <div
            key={feat.text}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <feat.icon className="h-5 w-5 text-primary" />
            </div>
            <span className="font-medium text-foreground">{feat.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
