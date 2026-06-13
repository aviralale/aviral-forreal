import { HeroScene } from "@/components/home/HeroScene";
import { HomeFeed } from "@/components/home/HomeFeed";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { getCategories, getPosts } from "@/lib/api";
import type {
  Category,
  PaginatedResponse,
  PostListItem,
} from "@/types";

const EMPTY: PaginatedResponse<PostListItem> = {
  count: 0,
  next: null,
  previous: null,
  results: [],
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string }>;
}) {
  const { category, tag } = await searchParams;

  // Render gracefully even if the API is unreachable.
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

        <HomeFeed
          initial={posts}
          categories={categories}
          initialCategory={category}
          initialTag={tag}
        />
      </div>
    </PageWrapper>
  );
}
