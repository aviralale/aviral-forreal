import { cn } from "@/lib/utils";

interface CategoryPillProps {
  name: string;
  slug?: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

const base =
  "smallcaps inline-block whitespace-nowrap text-sm transition-colors duration-150";

/**
 * Interactive (with `onClick`) it renders a button — used by the homepage index
 * filter, where the active rubric is underlined in red ink. Static (no
 * `onClick`) it renders a span — a quiet small-caps label inside post rows and
 * the post header, where it sits within a parent <Link>.
 */
export function CategoryPill({
  name,
  active,
  onClick,
  className,
}: CategoryPillProps) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          base,
          "cursor-pointer underline-offset-[6px]",
          active
            ? "text-accent underline decoration-accent"
            : "text-muted hover:text-accent",
          className,
        )}
      >
        {name}
      </button>
    );
  }

  return (
    <span className={cn(base, "text-accent", className)}>{name}</span>
  );
}
