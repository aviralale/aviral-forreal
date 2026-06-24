import Image from "next/image";
import Link from "next/link";
import { CategoryPill } from "@/components/ui/CategoryPill";
import { PixelSprite, spriteFor } from "@/components/ui/PixelSprite";
import { formatDate } from "@/lib/utils";
import type { PostListItem as PostListItemType } from "@/types";

/** The lead entry — a large torn-paper plate above an oversized title. */
export function FeaturedPost({ post }: { post: PostListItemType }) {
  return (
    <article className="mb-4">
      <Link href={`/posts/${post.slug}`} className="group block">
        {post.cover_image ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src={post.cover_image}
              alt={post.category ? `${post.title} — ${post.category.name} by Aviral Ale` : `${post.title} — essay by Aviral Ale, Nepal tech blog`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="torn-photo object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        ) : (
          <div className="paper flex aspect-[16/9] w-full items-center justify-center">
            <PixelSprite
              name={spriteFor(post.id)}
              size={96}
              className="opacity-85 transition-transform duration-300 group-hover:-translate-y-1"
            />
          </div>
        )}

        <div className="mt-6">
          {post.category && (
            <div className="mb-2">
              <CategoryPill name={post.category.name} />
            </div>
          )}

          <h2 className="font-display text-3xl font-medium leading-[1.1] text-text transition-colors duration-150 group-hover:text-accent sm:text-4xl">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="mt-3 max-w-2xl hyphens-auto text-justify text-lg leading-relaxed text-muted">
              {post.excerpt}
            </p>
          )}

          <p className="smallcaps mt-3 text-xs text-muted">
            {formatDate(post.published_at)} · {post.reading_time} min ·{" "}
            {new Intl.NumberFormat("en-US").format(post.views)} read
          </p>
        </div>
      </Link>
    </article>
  );
}
