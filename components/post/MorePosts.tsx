import { PostListItem } from "@/components/post/PostListItem";
import type { PostListItem as PostListItemType } from "@/types";

export function MorePosts({ posts }: { posts: PostListItemType[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-4">
      <h2 className="mb-2 font-display text-2xl font-medium text-text">
        More writing
      </h2>
      <div>
        {posts.map((post, i) => (
          <PostListItem
            key={post.id}
            post={post}
            divider={i < posts.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
