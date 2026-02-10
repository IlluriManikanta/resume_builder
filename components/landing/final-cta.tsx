import { Star } from "lucide-react";

const reviews = [
  {
    name: "Sarah K.",
    role: "Software Engineer",
    rating: 5,
    quote: "ResVamp helped me land interviews at three FAANG companies. The ATS score feedback was a game-changer.",
  },
  {
    name: "Marcus T.",
    role: "Product Manager",
    rating: 5,
    quote: "Finally, a resume tool that understands what recruiters look for. My callback rate doubled.",
  },
  {
    name: "Jen L.",
    role: "Data Scientist",
    rating: 4,
    quote: "Clean templates and smart bullet suggestions. Worth every minute spent polishing my resume.",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i <= count ? "fill-primary text-primary" : "text-[#403D39]"}`}
          aria-hidden
        />
      ))}
    </div>
  );
}

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#252422] px-6 py-24 md:py-32">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"
        aria-hidden="true"
      >
        <div className="h-[400px] w-[600px] rounded-full bg-[#2563EB] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <h2 className="text-center font-display text-3xl font-bold text-[#FFFCF2] md:text-4xl">
          Customer Reviews
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="rounded-xl border border-[#403D39]/60 bg-[#252422]/80 p-6 shadow-[0_0_40px_rgba(37,99,235,0.06)] backdrop-blur-sm"
            >
              <StarRating count={review.rating} />
              <p className="mt-4 text-sm leading-relaxed text-[#CCC5B9]">
                &quot;{review.quote}&quot;
              </p>
              <p className="mt-4 text-sm font-medium text-[#FFFCF2]">{review.name}</p>
              <p className="text-xs text-[#CCC5B9]">{review.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
