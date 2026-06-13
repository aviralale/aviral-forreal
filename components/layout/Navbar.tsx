"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const links = [
  { href: "/", label: "Writing" },
  { href: "/about", label: "About" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/" || pathname.startsWith("/posts");
  return pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  // Close on Escape and lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 px-4 pb-2 pt-4">
      <nav
        className="mx-auto flex w-fit max-w-[calc(100%-0.5rem)] items-center gap-1.5 rounded-full border border-border px-2 py-1.5 shadow-[0_6px_24px_rgba(20,14,6,0.12)] backdrop-blur-md sm:gap-3"
        style={{
          background:
            "color-mix(in srgb, var(--color-bg) 80%, transparent)",
        }}
      >
        <Link
          href="/"
          className="rounded-full px-3 py-1 font-display text-lg italic text-text transition-colors duration-150 hover:text-accent"
        >
          Aviral, for real
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "smallcaps rounded-full px-3 py-1 text-sm transition-colors duration-150",
                isActive(pathname, link.href)
                  ? "bg-surface-2 text-accent"
                  : "text-text hover:bg-surface-2 hover:text-accent",
              )}
            >
              {link.label}
            </Link>
          ))}
          <span className="mx-1 h-4 w-px bg-border" />
          <div className="px-1">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-1 sm:hidden">
          <span className="mx-0.5 h-4 w-px bg-border" />
          <div className="px-1">
            <ThemeToggle />
          </div>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="rounded-full px-2 py-1 text-text transition-colors duration-150 hover:text-accent"
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="drawer"
            initial={reduce ? false : { x: "100%" }}
            animate={{ x: "0%" }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex flex-col bg-bg sm:hidden"
          >
            <div className="flex h-20 items-center justify-between px-8">
              <span className="font-display text-lg italic text-text">
                Aviral, for real
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="text-text transition-colors duration-150 hover:text-accent"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center gap-10">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "font-display text-3xl italic transition-colors duration-150",
                    isActive(pathname, link.href)
                      ? "text-accent"
                      : "text-text hover:text-accent",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
