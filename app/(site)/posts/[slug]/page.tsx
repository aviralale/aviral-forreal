import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cache } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { MorePosts } from "@/components/post/MorePosts";
import { PostBody } from "@/components/post/PostBody";
import { JsonLd } from "@/components/seo/JsonLd";
import { CategoryPill } from "@/components/ui/CategoryPill";
import { PixelSprite, spriteFor } from "@/components/ui/PixelSprite";
import { PostMeta } from "@/components/ui/PostMeta";
import { ReadingProgress } from "@/components/ui/ReadingProgress";
import { TagPill } from "@/components/ui/TagPill";
import { getPost, getPosts } from "@/lib/api";
import {
  AUTHOR_HANDLE,
  AUTHOR_NAME,
  SITE_NAME,
  SITE_URL,
  blogPostingJsonLd,
  breadcrumbJsonLd,
} from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

// Deduped per request so generateMetadata and the page share one fetch.
const loadPost = cache(getPost);

/**
 * Pre-build the first page of posts at deploy time so crawlers always hit a
 * cached HTML response. Additional slugs fall back to on-demand ISR (60 s TTL
 * inherited from the fetch cache in lib/api.ts).
 */
export async function generateStaticParams() {
  try {
    const { results } = await getPosts();
    return results.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await loadPost(slug);
    const url = `${SITE_URL}/posts/${post.slug}`;
    const tags = post.tags.map((t) => t.name);
    const keywords = [
      ...tags,
      ...(post.category ? [post.category.name] : []),
      "Aviral Ale",
      "Nepal",
      "blog",
    ];
    // Clamp to 155 chars so Google doesn't truncate the snippet mid-sentence.
    const description =
      post.excerpt.length > 155
        ? `${post.excerpt.slice(0, 153)}…`
        : post.excerpt;

    return {
      title: post.title,
      description,
      keywords,
      authors: [{ name: AUTHOR_NAME, url: `${SITE_URL}/about` }],
      alternates: { canonical: url },
      openGraph: {
        type: "article",
        url,
        title: post.title,
        description,
        siteName: SITE_NAME,
        locale: "en_US",
        images: post.cover_image
          ? [{ url: post.cover_image, alt: `${post.title} — by ${AUTHOR_NAME}` }]
          : [{ url: `${SITE_URL}/logo.png`, alt: SITE_NAME, width: 512, height: 512 }],
        publishedTime: post.published_at,
        modifiedTime: post.published_at,
        authors: [`${SITE_URL}/about`],
        tags,
        ...(post.category && { section: post.category.name }),
      },
      twitter: {
        card: "summary_large_image",
        site: `@${AUTHOR_HANDLE}`,
        creator: `@${AUTHOR_HANDLE}`,
        title: post.title,
        description,
        images: post.cover_image
          ? [post.cover_image]
          : [`${SITE_URL}/logo.png`],
      },
    };
  } catch {
    return {
      title: "Not found",
      robots: { index: false, follow: false },
    };
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

  const articleSchema = blogPostingJsonLd(post);
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Writing", url: SITE_URL },
    { name: post.title, url: `${SITE_URL}/posts/${post.slug}` },
  ]);

  return (
    <>
      <ReadingProgress />
      <PageWrapper>
        <JsonLd data={articleSchema} />
        <JsonLd data={breadcrumbs} />

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
              alt={post.category ? `${post.title} — ${post.category.name} essay by Aviral Ale` : `${post.title} — essay by Aviral Ale`}
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
              <nav aria-label="Post tags">
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {post.tags.map((tag) => (
                    <TagPill key={tag.id} name={tag.name} slug={tag.slug} />
                  ))}
                </div>
              </nav>
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
