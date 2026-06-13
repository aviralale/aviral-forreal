"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  // Both icons render identically on server and client; CSS (keyed off the
  // <html> theme class) shows the right one, so there is no hydration flash and
  // no mount effect. `onClick` only runs post-hydration, where the theme is
  // known.
  const toggle = () =>
    setTheme((resolvedTheme ?? "dark") === "dark" ? "light" : "dark");

  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      onClick={toggle}
      className="text-muted transition-colors duration-150 hover:text-accent"
    >
      <Moon size={18} className="theme-icon-moon" />
      <Sun size={18} className="theme-icon-sun" />
    </button>
  );
}
