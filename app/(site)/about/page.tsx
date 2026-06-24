import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  AUTHOR_EMAIL,
  AUTHOR_HANDLE,
  AUTHOR_LOCATION,
  AUTHOR_NAME,
  AUTHOR_URL,
  CTRLBITS_NAME,
  SITE_NAME,
  SITE_URL,
  breadcrumbJsonLd,
  profilePageJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: `About ${AUTHOR_NAME}`,
  description: `${AUTHOR_NAME} is Founder & CEO of ${CTRLBITS_NAME} and a software developer from ${AUTHOR_LOCATION}. Building software and writing honestly about what it takes.`,
  keywords: [
    `${AUTHOR_NAME}`,
    `${AUTHOR_NAME} developer`,
    `${AUTHOR_NAME} writer`,
    `${AUTHOR_NAME} Nepal`,
    `${AUTHOR_NAME} Ctrlbits`,
    `${AUTHOR_NAME} founder`,
    "Ctrlbits Nepal",
    "Ctrlbits Pvt Ltd founder",
    "software developer Kathmandu",
    "Nepal developer",
    "Kathmandu builder",
    "Nepal software engineer",
    "tech writer Nepal",
    "indie developer Nepal",
    "Nepal startup founder",
  ],
  alternates: { canonical: AUTHOR_URL },
  openGraph: {
    type: "profile",
    url: AUTHOR_URL,
    title: `About ${AUTHOR_NAME}`,
    description: `${AUTHOR_NAME} is a software developer, writer, and Founder & CEO of ${CTRLBITS_NAME}, based in ${AUTHOR_LOCATION}.`,
    siteName: SITE_NAME,
    locale: "en_US",
    images: [{ url: `${SITE_URL}/logo.png`, alt: `${AUTHOR_NAME} — Founder & CEO of ${CTRLBITS_NAME}, software developer from ${AUTHOR_LOCATION}` }],
    firstName: "Aviral",
    lastName: "Ale",
    username: AUTHOR_HANDLE,
  },
  twitter: {
    card: "summary",
    site: `@${AUTHOR_HANDLE}`,
    creator: `@${AUTHOR_HANDLE}`,
    title: `About ${AUTHOR_NAME}`,
    description: `${AUTHOR_NAME} — Founder & CEO of ${CTRLBITS_NAME}, software developer and writer from ${AUTHOR_LOCATION}.`,
  },
};

const socials = [
  { href: `mailto:${AUTHOR_EMAIL}`, label: "Email" },
  { href: `https://github.com/${AUTHOR_HANDLE}`, label: "GitHub" },
  { href: `https://instagram.com/${AUTHOR_HANDLE}`, label: "Instagram" },
];

const breadcrumbs = breadcrumbJsonLd([
  { name: "Home", url: SITE_URL },
  { name: "About", url: AUTHOR_URL },
]);

export default function AboutPage() {
  return (
    <PageWrapper>
      <JsonLd data={profilePageJsonLd()} />
      <JsonLd data={breadcrumbs} />

      <div className="mx-auto max-w-[640px] px-6 py-16 md:py-20">
        <h1 className="font-display text-4xl italic text-text">{AUTHOR_NAME}</h1>
        <p className="smallcaps mt-2 text-sm text-muted">{AUTHOR_LOCATION}</p>

        <div className="post-body mt-8">
          {/* TODO: fill in about content */}
          <p>
            I build things, write about them, and occasionally say something
            worth reading.
          </p>
        </div>

        <div className="mt-12 flex gap-8">
          {socials.map((s) => {
            const external = s.href.startsWith("http");
            return (
              <a
                key={s.label}
                href={s.href}
                {...(external && {
                  target: "_blank",
                  rel: "noreferrer noopener",
                })}
                className="smallcaps text-sm text-text underline decoration-accent underline-offset-[5px] transition-colors duration-150 hover:text-accent"
              >
                {s.label}
              </a>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}
