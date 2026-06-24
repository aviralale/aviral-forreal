import type { MetadataRoute } from "next";
import type { PaginatedResponse, PostListItem } from "@/types";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

async function fetchAllPosts(): Promise<PostListItem[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return [];

  const all: PostListItem[] = [];
  let page = 1;

  try {
    while (true) {
      const url = new URL(`${apiUrl.replace(/\/$/, "")}/api/posts/`);
      url.searchParams.set("page", String(page));
      const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
      if (!res.ok) break;
      const data: PaginatedResponse<PostListItem> = await res.json();
      all.push(...data.results);
      if (!data.next) break;
      page++;
    }
  } catch {
    // Return whatever we have so far if the API is unreachable.
  }

  return all;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetchAllPosts();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/posts/${post.slug}`,
    lastModified: new Date(post.published_at),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...postRoutes];
}
