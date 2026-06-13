import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout/PageWrapper";

export const metadata: Metadata = {
  title: "About",
  description: "Aviral Ale — builder and writer based in Kathmandu, Nepal.",
};

const socials = [
  { href: "https://twitter.com/aviralale", label: "Twitter" },
  { href: "https://github.com/aviralale", label: "GitHub" },
  { href: "https://instagram.com/aviralale", label: "Instagram" },
];

export default function AboutPage() {
  return (
    <PageWrapper>
      <div className="mx-auto max-w-[640px] px-6 py-16 md:py-20">
        <h1 className="font-display text-4xl italic text-text">Aviral Ale</h1>
        <p className="smallcaps mt-2 text-sm text-muted">Kathmandu, Nepal</p>

        <div className="post-body mt-8">
          {/* TODO: fill in about content */}
          <p>
            I build things, write about them, and occasionally say something
            worth reading.
          </p>
        </div>

        <div className="mt-12 flex gap-8">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer noopener"
              className="smallcaps text-sm text-text underline decoration-accent underline-offset-[5px] transition-colors duration-150 hover:text-accent"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
