import { cn } from "@/lib/utils";

/**
 * Tiny 8-bit critters drawn from ASCII grids. Each character maps to a fill;
 * we use CSS custom properties so the pets read as ink on paper and as
 * parchment on the dark page. Decorative by default (aria-hidden).
 *
 * Legend: '.' transparent · 'k' ink (body) · 'm' muted (shading) ·
 *         'a' accent (eyes/nose/beak) · 'b' background (eye-white / cut-outs) ·
 *         's' snow (hero scene only — its own token so it can be a cool white
 *         independent of 'b'; falls back to bg where --color-snow is unset)
 */
const PALETTE: Record<string, string> = {
  k: "var(--color-text)",
  m: "var(--color-text-muted)",
  a: "var(--color-accent)",
  b: "var(--color-bg)",
  s: "var(--color-snow, var(--color-bg))",
};

export type SpriteName =
  | "cat"
  | "bird"
  | "ghost"
  | "rabbit"
  // Nepal hero scene — Himalayan peaks, a Boudhanath-style stupa, a Nyatapola-
  // style pagoda, strung prayer flags, and a sun. Drawn in the same ink/accent
  // palette so they read as woodcut on paper in both themes.
  | "mountains"
  | "stupa"
  | "pagoda"
  | "dharahara"
  | "shikhara"
  | "sun-core"
  | "sun-rays";

const SPRITES: Record<SpriteName, string[]> = {
  // Sitting cat, front view, tail curling at its side.
  cat: [
    "..k.......k..",
    ".kk.......kk.",
    ".kkk.....kkk.",
    ".kkkkkkkkkkk.",
    ".kkkkkkkkkkk.",
    ".kbakkkkkbak.",
    ".kkkkkakkkkk.",
    ".kkkkkkkkkkk.",
    ".kkkkkkkkkkkk",
    "..kkkkkkkkkmk",
    "..kk.kkk.kkmk",
    "..kk.....kk..",
  ],
  // Little fat bird, beak to the right.
  bird: [
    "...kkk....",
    "..kkkkk...",
    "..kbakk...",
    "..kkkkkkaa",
    ".kkkkkkk..",
    ".kkkkkkk..",
    ".kmkkkmk..",
    "..a...a...",
  ],
  // Friendly ghost.
  ghost: [
    "..kkkk..",
    ".kkkkkk.",
    "kbakkbak",
    "kkkkkkkk",
    "kkkakkkk",
    "kkkkkkkk",
    "kkkkkkkk",
    "k.kk.kk.",
  ],
  // Long-eared rabbit.
  rabbit: [
    ".k....k.",
    ".k....k.",
    ".km..mk.",
    ".kkkkkk.",
    "kkakkakk",
    "kkkkmkkk",
    "kkkkkkkk",
    ".kk..kk.",
  ],

  // Himalayan range — a tall panoramic horizon: ink foothills in front, with
  // far peaks rising behind under dithered snow caps. Wide aspect so it reads
  // as the ground the full-width hero stands on.
  mountains: [
    "..........................s.............................................",
    ".........................ss.............................................",
    ".........................sss................s...........................",
    "........................sssss..............sss..............s...........",
    "..........s............ssssss.............sssss............sss..........",
    ".........sss...........sssssss...........sssssss..........sssss.........",
    ".........ssss.........sssssssss.........sssssssss.......ssssssss........",
    "........ssssss.......sssssmssss........sssssssssss.....ssssssssss.......",
    ".......ssssssss......ssssmssssss.......ssssssssssss...ssssssssssss......",
    "......ssssssssss....ssssmsmsmsss......ssssssmsssssss.sssssssmsssss......",
    ".....ssssssssssss..ssssmsmmmsssss....ssssssmsmsssssssssssssmsmsssss.....",
    ".....sssssmsmsssss.sssmsmmmsmsmsss..ssssmsmsmsmsmsssssssmsmsmsmsssss....",
    "....sssssmsmsmsssssssmsmkmmmmmssss.ssssmsmsmmmsmsmsssssmsmsmmmsmsssss...",
    "...sssmsksmsmsmsssssmskkkkkmmsmsssssssmsmsmmmmmsmsmsssmskkmmmmmsmsssss..",
    "..sssmskkkkmmmsmsssmskkkkkkkmmmmsssssmskkkmmmmmmmmsmsmkkkkkkmmmmsmsssss.",
    "..ssmskkkkkkmmmsmsmkkkkkkkkkkmmsmssskkkkkkkkmmmmmmmskkkkkkkkkkmmmsmsmssm",
    ".msmkkkkkkkkkmmmsmkkkkkkkkkkkkkmskkkkkkkkkkkkkmmmmmkkkkkkkkkkkkkmmsmsmsm",
    "mmmkkkkkkkkkkkkmkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkmkkkkkkkkkkkkkkkkkmsmsmm",
    "mmkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkksm",
    "mkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
    "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
    "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
  ],
  // Boudhanath-style stupa — stepped base, dome, the watching eyes, 13-step spire.
  stupa: [
    "..........a..........",
    ".........kkk.........",
    "..........k..........",
    ".........kkm.........",
    ".........kkm.........",
    "........kkkkm........",
    "........kkkkm........",
    ".......kkkkkkm.......",
    ".......kkkkkkm.......",
    "......kkkkkkkkm......",
    ".....kkkkkkkkkkk.....",
    ".....kkaakkkaakk.....",
    ".....kkkkkakkkkk.....",
    "....kkkkkkkkkkkkk....",
    "...kkkkkkkkkkkkkkk...",
    "..kkkkkkkkkkkkkkkkk..",
    "..kkkkkkkkkkkkkkmkk..",
    "..kkkkkkkkkkkkkkkkk..",
    ".kkkkkkkkkkkkkkkkkkk.",
    "kkkkkkkkkkkkkkkkkkkkk",
    "kkkkkkkkkkkkkkkkkkkkk",
  ],
  // Nyatapola-style pagoda — finial, three flared roofs, the five-step plinth.
  pagoda: [
    "...........a...........",
    "...........k...........",
    "..........kkk..........",
    ".........kkkkk.........",
    "........kkkkkkk........",
    ".......mkkkkkkkm.......",
    "..........kkk..........",
    ".......kkkkkkkkk.......",
    "......kkkkkkkkkkk......",
    ".....mkkkkkkkkkkkm.....",
    ".........kkbkk.........",
    ".........kkbkk.........",
    ".....kkkkkkkkkkkkk.....",
    "....kkkkkkkkkkkkkkk....",
    "...mkkkkkkkkkkkkkkkm...",
    "........kkkbkkk........",
    "........kkkbkkk........",
    ".....mkkkkkkkkkkkm.....",
    "....mkkkkkkkkkkkkkm....",
    "...mkkkkkkkkkkkkkkkm...",
    "..mkkkkkkkkkkkkkkkkkm..",
    ".mkkkkkkkkkkkkkkkkkkkm.",
  ],
  // Dharahara (Bhimsen Tower) — a tall slender tower: domed cap, windowed
  // shaft, plinth.
  dharahara: [
    "...a...",
    "...k...",
    "..kkk..",
    ".kkkkk.",
    ".kkkkk.",
    ".kkkkk.",
    ".kbkbk.",
    ".kkkkk.",
    ".kbkbk.",
    ".kkkkk.",
    ".kbkbk.",
    ".kkkkk.",
    ".kbkbk.",
    ".kkkkk.",
    ".kbkbk.",
    ".kkkkk.",
    ".kbkbk.",
    ".kkkkk.",
    "kkkkkkk",
    "kkkkkkk",
  ],
  // Shikhara temple (Krishna-Mandir style) — a tapering stone tower with a
  // finial and a niche, on a tiered plinth with a doorway.
  shikhara: [
    ".......a.......",
    ".......k.......",
    "......kkm......",
    "......kkm......",
    ".....kkkkm.....",
    ".....kkkkm.....",
    "....kkkkkkm....",
    "....kkkkkkm....",
    "...kkkkbkkkm...",
    "...kkkkkkkkm...",
    "..kkkkkkkkkkm..",
    "..kkkkkkkkkkm..",
    ".kkkkkkkkkkkkk.",
    "kkkkkkkbkkkkkkk",
    "kkkkkkkbkkkkkkk",
  ],
  // Sun, split so the rays can spin around a still disc. Core is a round disc;
  // rays sit on a square grid (no trim) so they rotate about their centre.
  "sun-core": [
    "..aaa..",
    ".aaaaa.",
    "aaaaaaa",
    "aaaaaaa",
    "aaaaaaa",
    ".aaaaa.",
    "..aaa..",
  ],
  "sun-rays": [
    "...............",
    ".......a.......",
    "..a....a....a..",
    "...a.......a...",
    "...............",
    "...............",
    "...............",
    ".aa.........aa.",
    "...............",
    "...............",
    "...............",
    "...a.......a...",
    "..a....a....a..",
    ".......a.......",
    "...............",
  ],
};

interface PixelSpriteProps {
  name: SpriteName;
  /** Rendered width in px; height follows the grid's aspect ratio. */
  size?: number;
  className?: string;
  label?: string;
}

export function PixelSprite({
  name,
  size = 56,
  className,
  label,
}: PixelSpriteProps) {
  const grid = SPRITES[name];
  const rows = grid.length;
  const cols = grid.reduce((m, r) => Math.max(m, r.length), 0);

  const cells: React.ReactElement[] = [];
  grid.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const fill = PALETTE[row[x]];
      if (fill) {
        cells.push(
          <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={fill} />,
        );
      }
    }
  });

  return (
    <svg
      viewBox={`0 0 ${cols} ${rows}`}
      width={size}
      height={(size * rows) / cols}
      className={cn("pixelated", className)}
      shapeRendering="crispEdges"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {cells}
    </svg>
  );
}

/** Stable per-key sprite pick, so a given post always gets the same critter. */
const ORDER: SpriteName[] = ["cat", "bird", "rabbit", "ghost"];
export function spriteFor(seed: number | string): SpriteName {
  const n =
    typeof seed === "number"
      ? seed
      : [...seed].reduce((a, c) => a + c.charCodeAt(0), 0);
  return ORDER[Math.abs(n) % ORDER.length];
}
