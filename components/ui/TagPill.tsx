import Link from "next/link";

interface TagPillProps {
  name: string;
  slug: string;
}

/** A quiet small-caps tag linking to the index filtered by this subject. */
export function TagPill({ name, slug }: TagPillProps) {
  return (
    <Link
      href={`/?tag=${slug}`}
      className="smallcaps text-sm text-muted underline-offset-[5px] transition-colors duration-150 hover:text-accent hover:underline hover:decoration-accent"
    >
      {name}
    </Link>
  );
}
