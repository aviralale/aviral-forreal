import { PixelSprite } from "@/components/ui/PixelSprite";

// A full-span string of prayer flags. Colours cycle through accent / near / far
// (the sky sits behind, so each reads); the count fills the width.
const FLAG_COLORS = Array.from({ length: 19 }, (_, i) =>
  ["var(--color-accent)", "var(--color-text)", "var(--color-text-muted)"][i % 3],
);

/**
 * A static-by-default 8-bit Nepal horizon that grounds the hero: a tall
 * panoramic Himalayan range spanning the full text column, a skyline of
 * heritage structures standing on it (pagoda, stupa, Dharahara tower, shikhara
 * temple), a full-span string of prayer flags, and a sun rising behind the
 * peaks.
 *
 * `hero-scene` scopes a controlled palette (see globals.css) so the landscape
 * looks right in light *and* dark instead of inverting. `isolate` keeps the
 * rising sun's negative z-index local so it tucks behind the range. Two touches
 * of gentle ambient motion — each flag flutters on its own and the sun's rays
 * turn — both slow + small, and both stilled by prefers-reduced-motion. Sizes
 * are percentages of the column width so proportions hold across breakpoints.
 * Decorative, so it's hidden from a11y.
 */
export function HeroScene() {
  return (
    <div
      aria-hidden
      className="hero-scene relative isolate mt-6 w-full select-none"
    >
      {/* Sun rising behind the range (right), rays turning around a still disc. */}
      <span className="absolute bottom-[52%] right-[14%] -z-10 flex aspect-square w-[12%] items-center justify-center">
        <PixelSprite
          name="sun-rays"
          className="sun-spin absolute inset-0 h-full w-full"
        />
        <PixelSprite name="sun-core" className="h-auto w-[46%]" />
      </span>

      {/* Himalaya — the horizon; drives the scene's height. */}
      <PixelSprite name="mountains" className="block h-auto w-full" />

      {/* Full-span prayer flags: the string holds still while each flag flutters,
          staggered so a ripple runs along the line. */}
      <div
        className="absolute inset-x-[3%] top-[7%] flex justify-between"
        style={{ borderTop: "1.5px solid var(--color-text-muted)" }}
      >
        {FLAG_COLORS.map((color, i) => (
          <span
            key={i}
            className="flag-flutter block w-[1.6%]"
            style={{
              aspectRatio: "3 / 4",
              background: color,
              animationDelay: `${(i * 0.12).toFixed(2)}s`,
            }}
          />
        ))}
      </div>

      {/* Heritage skyline standing on the range, spread across the horizon.
          `hero-heritage` gives them a darker palette + rim + shadow to lift
          them clear of the mountains behind. */}
      <div className="hero-heritage absolute inset-x-0 bottom-0 flex items-end justify-between gap-[2%] px-[6%]">
        <PixelSprite name="pagoda" className="h-auto w-[11%]" />
        <PixelSprite name="stupa" className="h-auto w-[10%]" />
        <PixelSprite name="dharahara" className="h-auto w-[6.5%]" />
        <PixelSprite name="shikhara" className="h-auto w-[10%]" />
      </div>
    </div>
  );
}
