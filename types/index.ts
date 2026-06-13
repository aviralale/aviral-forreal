export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface PostListItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string | null;
  category: Category | null;
  tags: Tag[];
  published_at: string;
  reading_time: number;
  views: number;
}

export interface Post extends PostListItem {
  body: string;
  status: "draft" | "published";
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/** Dashboard representation — includes drafts; category/tags are ids. */
export interface AdminPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_image: string | null;
  category: number | null;
  tags: number[];
  status: "draft" | "published";
  published_at: string | null;
  reading_time: number;
  views: number;
  created_at: string;
  updated_at: string;
}
