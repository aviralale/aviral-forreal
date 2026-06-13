import { cn, formatDate } from "@/lib/utils";

interface PostMetaProps {
  publishedAt: string;
  readingTime: number;
  views: number;
  className?: string;
}

const formatViews = (n: number) =>
  new Intl.NumberFormat("en-US").format(n);

export function PostMeta({
  publishedAt,
  readingTime,
  views,
  className,
}: PostMetaProps) {
  const parts = [
    formatDate(publishedAt),
    `${readingTime} min read`,
    `${formatViews(views)} views`,
  ].filter(Boolean);

  return (
    <span className={cn("smallcaps text-sm text-muted", className)}>
      {parts.join("  ·  ")}
    </span>
  );
}
