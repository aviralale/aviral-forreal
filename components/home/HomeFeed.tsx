"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { FeaturedPost } from "@/components/home/FeaturedPost";
import { PostListItem } from "@/components/post/PostListItem";
import { CategoryPill } from "@/components/ui/CategoryPill";
import { getPosts } from "@/lib/api";
import type {
  Category,
  PaginatedResponse,
  PostListItem as PostListItemType,
} from "@/types";

interface HomeFeedProps {
  initial: PaginatedResponse<PostListItemType>;
  categories: Category[];
  initialCategory?: string;
  initialTag?: string;
}

export function HomeFeed({
  initial,
  categories,
  initialCategory,
  initialTag,
}: HomeFeedProps) {
  const reduce = useReducedMotion();

  const [posts, setPosts] = useState(initial.results);
  const [next, setNext] = useState(initial.next);
  const [page, setPage] = useState(1);
  const [activeCat, setActiveCat] = useState<string | null>(
    initialCategory ?? null,
  );
  const [tag, setTag] = useState<string | undefined>(initialTag);
  const [loading, setLoading] = useState(false);

  async function selectCategory(slug: string | null) {
    if (slug === activeCat && !tag) return;
    setLoading(true);
    setActiveCat(slug);
    setTag(undefined);
    try {
      const res = await getPosts({ category: slug ?? undefined });
      setPosts(res.results);
      setNext(res.next);
      setPage(1);
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    setLoading(true);
    try {
      const res = await getPosts({
        category: activeCat ?? undefined,
        tag,
        page: page + 1,
      });
      setPosts((prev) => [...prev, ...res.results]);
      setNext(res.next);
      setPage((p) => p + 1);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Index rubrics */}
      <div className="no-scrollbar -mx-6 mb-10 flex items-center gap-x-6 gap-y-2 overflow-x-auto border-y border-border px-6 py-3">
        <CategoryPill
          name="All"
          active={activeCat === null}
          onClick={() => selectCategory(null)}
        />
        {categories.map((cat) => (
          <CategoryPill
            key={cat.id}
            name={cat.name}
            slug={cat.slug}
            active={activeCat === cat.slug}
            onClick={() => selectCategory(cat.slug)}
          />
        ))}
      </div>

      {tag && (
        <p className="mb-6 smallcaps text-sm text-muted">
          Tagged “{tag}” ·{" "}
          <Link href="/" className="text-accent">
            clear
          </Link>
        </p>
      )}

      {/* Post list — lead entry featured, the rest as rows. */}
      {posts.length === 0 ? (
        <p className="py-8 text-base text-muted">Nothing here yet.</p>
      ) : (
        <div>
          {!activeCat && !tag && (
            <>
              <FeaturedPost post={posts[0]} />
              <hr className="border-0 border-t border-border" />
            </>
          )}

          {(!activeCat && !tag ? posts.slice(1) : posts).map((post, i, arr) =>
            reduce ? (
              <PostListItem
                key={post.id}
                post={post}
                divider={i < arr.length - 1}
              />
            ) : (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: (i % 10) * 0.04 }}
              >
                <PostListItem post={post} divider={i < arr.length - 1} />
              </motion.div>
            ),
          )}
        </div>
      )}

      {/* Load more */}
      {next && (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="smallcaps text-sm text-muted underline decoration-border underline-offset-[6px] transition-colors duration-150 hover:text-accent hover:decoration-accent disabled:opacity-50"
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
