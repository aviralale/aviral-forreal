import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cache } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { MorePosts } from "@/components/post/MorePosts";
import { PostBody } from "@/components/post/PostBody";
import { CategoryPill } from "@/components/ui/CategoryPill";
import { PixelSprite, spriteFor } from "@/components/ui/PixelSprite";
import { PostMeta } from "@/components/ui/PostMeta";
import { ReadingProgress } from "@/components/ui/ReadingProgress";
import { TagPill } from "@/components/ui/TagPill";
import { getPost, getPosts } from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

// Deduped per request so generateMetadata and the page share one fetch.
const loadPost = cache(getPost);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await loadPost(slug);
    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: post.cover_image ? [post.cover_image] : [],
      },
    };
  } catch {
    return { title: "Not found" };
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  let post;
  try {
    post = await loadPost(slug);
  } catch {
    notFound();
  }

  // Recent posts for the "More writing" section, excluding the current one.
  let more: Awaited<ReturnType<typeof getPosts>>["results"] = [];
  try {
    const recent = await getPosts();
    more = recent.results.filter((p) => p.slug !== post.slug).slice(0, 3);
  } catch {
    // Non-essential; skip if unavailable.
  }

  return (
    <>
      <ReadingProgress />
      <PageWrapper>
        <article className="mx-auto max-w-[700px] px-6 py-16">
          {/* Title page */}
          <header className="text-center">
            {post.category && (
              <div className="mb-5">
                <CategoryPill name={post.category.name} />
              </div>
            )}

            <h1 className="font-display text-4xl font-medium leading-[1.12] text-text [text-wrap:balance] sm:text-5xl">
              {post.title}
            </h1>

            <div className="mt-6">
              <PostMeta
                publishedAt={post.published_at}
                readingTime={post.reading_time}
                views={post.views}
              />
            </div>

            <hr className="mx-auto mt-8 w-24 border-0 border-t border-border" />
          </header>

          {post.cover_image && (
            <Image
              src={post.cover_image}
              alt={post.title}
              width={720}
              height={400}
              sizes="(max-width: 768px) 100vw, 700px"
              className="torn-photo my-10 max-h-[440px] w-full object-cover"
              priority
            />
          )}

          <PostBody content={post.body} />

          {/* End mark */}
          <div className="mt-12 flex justify-center">
            <PixelSprite name={spriteFor(post.id)} size={40} className="opacity-70" />
          </div>

          {post.tags.length > 0 && (
            <>
              <hr className="my-10 border-0 border-t border-border" />
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {post.tags.map((tag) => (
                  <TagPill key={tag.id} name={tag.name} slug={tag.slug} />
                ))}
              </div>
            </>
          )}

          {more.length > 0 && (
            <>
              <hr className="my-10 border-0 border-t border-border" />
              <MorePosts posts={more} />
            </>
          )}
        </article>
      </PageWrapper>
    </>
  );
}
