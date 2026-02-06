import Link from "next/link";

const footerLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "#" },
  { label: "Contact", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-[#403D39]/50 bg-[#252422] px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 md:flex-row md:justify-between">
        <p className="text-center text-sm text-[#CCC5B9]">
          ResVamp.ai — Built by an engineer who understands the job search.
        </p>

        <nav aria-label="Footer navigation">
          <ul className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <li key={link.label}>
                {link.href.startsWith("/") ? (
                  <Link
                    href={link.href}
                    className="text-sm text-[#CCC5B9] transition-colors hover:text-[#FFFCF2]"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className="text-sm text-[#CCC5B9] transition-colors hover:text-[#FFFCF2]"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
