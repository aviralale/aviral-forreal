"use client";

import { useEffect, useRef, useState } from "react";
import { PixelSprite, type SpriteName } from "@/components/ui/PixelSprite";

interface Pet {
  id: number;
  name: SpriteName;
  size: number;
  right: number; // px offset from the right edge — pets stay put here
  face: 1 | -1; // which way the sprite faces
}

// The pets rest together in the bottom-right corner instead of wandering.
const PETS: Pet[] = [
  { id: 1, name: "cat", size: 46, right: 16, face: -1 },
  { id: 2, name: "rabbit", size: 40, right: 70, face: 1 },
  { id: 3, name: "bird", size: 32, right: 118, face: -1 },
];

const POP_CHARS = ["♥", "!", "✦", "♪", "✿"];

/**
 * A few pixel pets that rest in the bottom-right corner of the page. They bob
 * gently in place, and — when clicked — hop and puff out a little symbol. The
 * container ignores pointer events so only the pets themselves are interactive;
 * the rest of the page stays clickable.
 */
export function DeskPets() {
  const [reduce, setReduce] = useState(false);
  const [pops, setPops] = useState<
    { key: number; right: number; ch: string }[]
  >([]);

  const els = useRef<Record<number, HTMLButtonElement | null>>({});

  useEffect(() => {
    setReduce(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  const poke = (p: Pet) => {
    // Replay the hop on the inner sprite wrapper (separate element from the
    // bob wrapper so the two transforms compose instead of fighting).
    const inner = els.current[p.id]?.querySelector(
      ".pet-hop-target",
    ) as HTMLElement | null;
    if (inner) {
      inner.classList.remove("pet-hop");
      void inner.offsetWidth; // force reflow so the animation restarts
      inner.classList.add("pet-hop");
    }

    const ch = POP_CHARS[Math.floor(Math.random() * POP_CHARS.length)];
    const key = Date.now() + p.id;
    setPops((s) => [...s, { key, right: p.right + p.size / 2, ch }]);
    setTimeout(() => setPops((s) => s.filter((q) => q.key !== key)), 900);
  };

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-0 select-none"
    >
      {PETS.map((p) => (
        <button
          key={p.id}
          ref={(el) => {
            els.current[p.id] = el;
          }}
          type="button"
          aria-label="Pet me"
          onClick={() => poke(p)}
          className="pointer-events-auto absolute bottom-1.5 origin-bottom cursor-pointer border-0 bg-transparent p-0"
          style={{ right: p.right, transform: `scaleX(${p.face})` }}
        >
          <span className={reduce ? "block" : "block pet-bob"}>
            <span className="pet-hop-target block">
              <PixelSprite name={p.name} size={p.size} />
            </span>
          </span>
        </button>
      ))}

      {pops.map((q) => (
        <span
          key={q.key}
          className="pet-pop absolute bottom-12 font-display text-lg text-accent"
          style={{ right: q.right }}
        >
          {q.ch}
        </span>
      ))}
    </div>
  );
}
