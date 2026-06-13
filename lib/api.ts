import type {
  Category,
  PaginatedResponse,
  Post,
  PostListItem,
  Tag,
} from "@/types";

function base(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    // Fail loudly when a request is actually made, rather than producing
    // confusing `undefined/api/...` URLs. Lazy so it never breaks the build.
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }
  return url.replace(/\/$/, "");
}

export async function getPosts(params?: {
  category?: string;
  tag?: string;
  search?: string;
  page?: number;
}): Promise<PaginatedResponse<PostListItem>> {
  const url = new URL(`${base()}/api/posts/`);
  if (params?.category) url.searchParams.set("category", params.category);
  if (params?.tag) url.searchParams.set("tag", params.tag);
  if (params?.search) url.searchParams.set("search", params.search);
  if (params?.page) url.searchParams.set("page", String(params.page));
  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function getPost(slug: string): Promise<Post> {
  const res = await fetch(`${base()}/api/posts/${slug}/`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Post not found");
  return res.json();
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${base()}/api/categories/`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function getTags(): Promise<Tag[]> {
  const res = await fetch(`${base()}/api/tags/`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch tags");
  return res.json();
}
