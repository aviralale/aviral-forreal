import Image from "next/image";
import Link from "next/link";
import { CategoryPill } from "@/components/ui/CategoryPill";
import { PixelSprite, spriteFor } from "@/components/ui/PixelSprite";
import { formatDate } from "@/lib/utils";
import type { PostListItem as PostListItemType } from "@/types";

/**
 * One entry in the index: a torn-paper cover thumbnail (or a pixel pet when a
 * post has none) beside the title, excerpt and folio line. The whole row is one
 * link; a hairline rule closes each entry except the last.
 */
export function PostListItem({
  post,
  divider = true,
}: {
  post: PostListItemType;
  divider?: boolean;
}) {
  return (
    <article>
      <Link
        href={`/posts/${post.slug}`}
        className="group flex gap-5 py-7 sm:gap-7"
      >
        {/* Cover, torn at the edges — or a pet for coverless entries. */}
        <div className="w-24 shrink-0 sm:w-36">
          {post.cover_image ? (
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                sizes="(max-width: 640px) 96px, 144px"
                className="torn-photo object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              />
            </div>
          ) : (
            <div className="paper flex aspect-[4/3] w-full items-center justify-center">
              <PixelSprite
                name={spriteFor(post.id)}
                size={48}
                className="opacity-80 transition-transform duration-300 group-hover:-translate-y-0.5"
              />
            </div>
          )}
        </div>

        {/* Entry text */}
        <div className="min-w-0 flex-1">
          {post.category && (
            <div className="mb-1.5">
              <CategoryPill name={post.category.name} />
            </div>
          )}

          <h2 className="font-display text-2xl font-medium leading-snug text-text transition-colors duration-150 group-hover:text-accent sm:text-[1.7rem]">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="mt-1.5 line-clamp-2 text-base leading-relaxed text-muted">
              {post.excerpt}
            </p>
          )}

          <p className="smallcaps mt-2.5 text-xs text-muted">
            {formatDate(post.published_at)} · {post.reading_time} min
          </p>
        </div>
      </Link>

      {divider && <hr className="border-0 border-t border-border" />}
    </article>
  );
}
