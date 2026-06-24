export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://aviral.me"
).replace(/\/$/, "");

export const SITE_NAME = "Aviral, for real";
export const AUTHOR_NAME = "Aviral Ale";
export const AUTHOR_HANDLE = "aviralale";
export const AUTHOR_URL = `${SITE_URL}/about`;
export const AUTHOR_EMAIL = "abiral@ctrlbits.com";
export const AUTHOR_LOCATION = "Kathmandu, Nepal";
export const CTRLBITS_NAME = "Ctrlbits Pvt. Ltd.";
export const CTRLBITS_URL = "https://ctrlbits.com";

export const SITE_DESCRIPTION =
  "Personal writing by Aviral Ale — a software developer and builder from Kathmandu, Nepal. Honest essays on software, building products, and life.";

export const SITE_KEYWORDS = [
  "Aviral Ale",
  "Aviral Ale blog",
  "Aviral Ale Nepal",
  "Aviral Ale writer",
  "Aviral Ale developer",
  "Aviral Ale Ctrlbits",
  "Ctrlbits Nepal",
  "Ctrlbits Pvt Ltd",
  "Nepal tech blog",
  "Kathmandu developer",
  "Nepal software developer",
  "software development blog Nepal",
  "tech writing Nepal",
  "building software Nepal",
  "personal blog Nepal",
  "indie developer Nepal",
  "Nepal technology",
  "Kathmandu tech",
  "Nepal builder",
  "developer essays",
  "software engineer blog",
  "Nepal programming blog",
  "tech blog Kathmandu",
  "Nepal startup founder",
  "software company Nepal",
];

// Stable entity IDs used across all schemas for cross-referencing.
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const BLOG_ID = `${SITE_URL}/#blog`;

/**
 * Sitewide graph — injected once in <head> via RootLayout.
 * Establishes WebSite, Person, and Blog as named entities so all per-page
 * schemas can reference them by @id rather than repeating the data.
 */
export const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en-US",
      author: { "@id": PERSON_ID },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: AUTHOR_NAME,
      url: AUTHOR_URL,
      email: AUTHOR_EMAIL,
      jobTitle: "Founder & CEO at Ctrlbits, Software Developer & Writer",
      description:
        "Founder & CEO of Ctrlbits Pvt. Ltd. and software developer based in Kathmandu, Nepal. Writes about building software, product development, and life.",
      worksFor: {
        "@type": "Organization",
        name: CTRLBITS_NAME,
        url: CTRLBITS_URL,
      },
      image: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
        width: 512,
        height: 512,
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kathmandu",
        addressRegion: "Bagmati Province",
        addressCountry: "NP",
      },
      sameAs: [
        `https://github.com/${AUTHOR_HANDLE}`,
        `https://instagram.com/${AUTHOR_HANDLE}`,
        `https://twitter.com/${AUTHOR_HANDLE}`,
        `https://x.com/${AUTHOR_HANDLE}`,
        CTRLBITS_URL,
        SITE_URL,
      ],
    },
    {
      "@type": "Blog",
      "@id": BLOG_ID,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en-US",
      author: { "@id": PERSON_ID },
      publisher: { "@id": PERSON_ID },
    },
  ],
};

/**
 * Per-post Article schema.
 * References sitewide Person/@id so crawlers merge into one entity graph.
 */
export function blogPostingJsonLd(post: {
  title: string;
  excerpt: string;
  slug: string;
  cover_image: string | null;
  published_at: string;
  reading_time: number;
  tags: { name: string }[];
  category: { name: string } | null;
}) {
  const url = `${SITE_URL}/posts/${post.slug}`;
  const keywords = [
    ...post.tags.map((t) => t.name),
    ...(post.category ? [post.category.name] : []),
    "Aviral Ale",
    "Nepal",
  ].join(", ");

  // Estimate word count from reading time (avg 225 wpm).
  const wordCount = post.reading_time * 225;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.excerpt,
        url,
        image: post.cover_image
          ? { "@type": "ImageObject", url: post.cover_image }
          : { "@type": "ImageObject", url: `${SITE_URL}/logo.png`, width: 512, height: 512 },
        datePublished: post.published_at,
        dateModified: post.published_at,
        author: { "@id": PERSON_ID },
        publisher: { "@id": PERSON_ID },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        isPartOf: { "@id": BLOG_ID },
        keywords,
        wordCount,
        timeRequired: `PT${post.reading_time}M`,
        inLanguage: "en-US",
        copyrightHolder: { "@id": PERSON_ID },
        copyrightYear: new Date(post.published_at).getFullYear(),
        ...(post.category && { articleSection: post.category.name }),
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".post-body p:first-of-type"],
        },
        potentialAction: {
          "@type": "ReadAction",
          target: [url],
        },
      },
    ],
  };
}

/** BreadcrumbList schema — used on post pages and the about page. */
export function breadcrumbJsonLd(crumbs: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/** ProfilePage + embedded Person schema for the /about page. */
export function profilePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${AUTHOR_URL}#profilepage`,
    url: AUTHOR_URL,
    name: `About ${AUTHOR_NAME}`,
    inLanguage: "en-US",
    mainEntity: {
      "@type": "Person",
      "@id": PERSON_ID,
      name: AUTHOR_NAME,
      jobTitle: "Founder & CEO at Ctrlbits, Software Developer & Writer",
      description:
        "Founder & CEO of Ctrlbits Pvt. Ltd. and software developer based in Kathmandu, Nepal. Writes about building software, product development, and life.",
      worksFor: {
        "@type": "Organization",
        name: CTRLBITS_NAME,
        url: CTRLBITS_URL,
      },
      image: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
        width: 512,
        height: 512,
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kathmandu",
        addressRegion: "Bagmati Province",
        addressCountry: "NP",
      },
      url: AUTHOR_URL,
      sameAs: [
        `https://github.com/${AUTHOR_HANDLE}`,
        `https://instagram.com/${AUTHOR_HANDLE}`,
        `https://twitter.com/${AUTHOR_HANDLE}`,
        `https://x.com/${AUTHOR_HANDLE}`,
        CTRLBITS_URL,
      ],
    },
  };
}
