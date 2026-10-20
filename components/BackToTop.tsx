"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { LuArrowUp } from "react-icons/lu";

/**
 * A quiet way back up once the page is long enough to need one. Hidden with
 * opacity rather than unmounted, so it fades instead of popping, and taken
 * out of the tab order while it is invisible.
 */
export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 300);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      tabIndex={isVisible ? 0 : -1}
      aria-hidden={!isVisible}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "bg-paper border-hairline text-ink-soft hover:text-ink fixed right-5 bottom-5 z-30 inline-flex size-10 items-center justify-center rounded-full border shadow-sm transition-[opacity,translate,color] duration-200",
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0",
      )}
    >
      <LuArrowUp className="size-4" aria-hidden="true" />
    </button>
  );
}
