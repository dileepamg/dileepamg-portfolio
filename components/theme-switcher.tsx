"use client";

import { centreOf, useThemeToggle } from "@/lib/theme-toggle";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";

/**
 * Light ↔ dark. Shows what the page is now, the sun or the moon; the label
 * says what pressing it will do. Both icons are drawn and the theme class
 * picks one, so the right icon is there from the first paint.
 */
export function ThemeSwitcher({ className }: { className?: string }) {
  const { isDark, toggle } = useThemeToggle();

  return (
    <button
      type="button"
      onClick={(event) => toggle(centreOf(event.currentTarget))}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light theme" : "Dark theme"}
      className={cn(
        "text-ink-soft hover:text-ink hover:bg-tint inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-colors",
        className,
      )}
    >
      <Sun className="size-[18px] dark:hidden" aria-hidden="true" />
      <Moon className="hidden size-[18px] dark:block" aria-hidden="true" />
    </button>
  );
}
