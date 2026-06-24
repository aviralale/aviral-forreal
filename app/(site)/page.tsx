import type { Metadata } from "next";
import { HeroScene } from "@/components/home/HeroScene";
import { HomeFeed } from "@/components/home/HomeFeed";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCategories, getPosts } from "@/lib/api";
import {
  BLOG_ID,
  PERSON_ID,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";
import type { Category, PaginatedResponse, PostListItem } from "@/types";

// `absolute` bypasses the layout's title template; the homepage title should
// be exactly the site name, not "Aviral, for real — Aviral, for real".
export const metadata: Metadata = {
  title: { absolute: SITE_NAME },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
  },
};

const EMPTY: PaginatedResponse<PostListItem> = {
  count: 0,
  next: null,
  previous: null,
  results: [],
};

// References the sitewide Blog entity by @id — no repeated data.
const BLOG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": BLOG_ID,
  url: SITE_URL,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  inLanguage: "en-US",
  author: { "@id": PERSON_ID },
  publisher: { "@id": PERSON_ID },
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string }>;
}) {
  const { category, tag } = await searchParams;

  let posts = EMPTY;
  let categories: Category[] = [];
  try {
    [posts, categories] = await Promise.all([
      getPosts({ category, tag }),
      getCategories(),
    ]);
  } catch {
    // Leave defaults; the feed shows an empty state.
  }

  return (
    <PageWrapper>
      <JsonLd data={BLOG_JSONLD} />

      <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        {/* Hero */}
        <section className="mb-16 pt-4 md:pt-10">
          <h1 className="font-display text-hero font-semibold leading-[0.98] tracking-[-0.02em] text-text [text-wrap:balance]">
            Everything I think about,
            <br />
            <em className="font-medium text-accent">
              with nothing held back.
            </em>
          </h1>

          <HeroScene />
        </section>

        {/* Key by the URL filter so the client feed remounts (and re-seeds its
            state from these fresh server props) when the tag/category changes
            via navigation — e.g. the "clear" link. Without it React reuses the
            instance and the useState initializers keep the stale filter. */}
        <HomeFeed
          key={`${category ?? ""}|${tag ?? ""}`}
          initial={posts}
          categories={categories}
          initialCategory={category}
          initialTag={tag}
        />
      </div>
    </PageWrapper>
  );
}
