"use client";

import { formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { listPosts } from "@/lib/admin";
import type { AdminPost } from "@/types";

export function PostsList() {
  const [posts, setPosts] = useState<AdminPost[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listPosts()
      .then(setPosts)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load."));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-normal text-text">Posts</h1>
        <Link
          href="/dashboard/posts/new"
          className="flex items-center gap-2 rounded-md bg-text px-4 py-2 font-body text-sm font-medium text-bg transition-opacity hover:opacity-90"
        >
          <Plus size={16} />
          New post
        </Link>
      </div>

      {error && <p className="mt-8 font-body text-sm text-red-400">{error}</p>}

      {!posts && !error && (
        <p className="mt-8 font-mono text-xs text-muted">Loading…</p>
      )}

      {posts && posts.length === 0 && (
        <p className="mt-8 font-body text-base text-muted">
          No posts yet. Write your first one.
        </p>
      )}

      {posts && posts.length > 0 && (
        <ul className="mt-8">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/dashboard/posts/${post.id}/edit`}
                className="group flex items-center justify-between gap-4 border-t border-border py-4 transition-colors last:border-b hover:bg-surface"
              >
                <div className="min-w-0">
                  <p className="truncate font-display text-lg text-text group-hover:text-accent">
                    {post.title}
                  </p>
                  <p className="mt-1 font-mono text-xs text-muted">
                    {post.published_at
                      ? formatDate(post.published_at)
                      : `created ${formatDate(post.created_at)}`}
                    {"  ·  "}
                    {post.reading_time} min{"  ·  "}
                    {post.views} views
                  </p>
                </div>
                <span
                  className={
                    post.status === "published"
                      ? "shrink-0 rounded-full border border-accent px-2.5 py-0.5 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-accent"
                      : "shrink-0 rounded-full border border-border px-2.5 py-0.5 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-muted"
                  }
                >
                  {post.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
