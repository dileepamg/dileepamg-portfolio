"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";

const subscribeToNothing = () => () => {};

/**
 * Fired synchronously the moment the theme class changes, inside the view
 * transition. Anything painted from script listens for it: the masthead
 * starts its sunset (or sunrise) there, and the 404 eyes repaint in the new
 * colours before the reveal's snapshot.
 */
export const THEME_SWAP_EVENT = "themeswap";

/**
 * How long the switch takes. The reveal runs for this long, and the
 * masthead's sunset (or sunrise) runs alongside it for the same time.
 */
export const THEME_SWAP_MS = 650;

/**
 * Light or dark, and a way to swap them with a reveal.
 *
 * The page starts light and the toggle is a plain two-way switch, which is
 * what a sun and a moon can honestly offer.
 *
 * The swap runs inside a view transition, and the new theme is uncovered as
 * a circle growing from wherever the toggle was pressed: from the sun in the
 * masthead, night spreads out across the page. Where view transitions are
 * missing, or the reader prefers less motion, the theme simply changes.
 */
export function useThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
  const isDark = mounted && resolvedTheme === "dark";

  function toggle(origin?: { x: number; y: number }) {
    const next = isDark ? "light" : "dark";
    const root = document.documentElement;

    // Applied by hand as well as through next-themes, because the view
    // transition snapshots the page as soon as this callback returns and
    // next-themes only writes the class from an effect.
    const apply = () => {
      root.classList.remove("light", "dark");
      root.classList.add(next);
      root.style.colorScheme = next;
      window.dispatchEvent(new Event(THEME_SWAP_EVENT));
      flushSync(() => setTheme(next));
    };

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!document.startViewTransition || reduce) {
      apply();
      return;
    }

    root.classList.add("theme-transition");
    const transition = document.startViewTransition(apply);

    transition.ready
      .then(() => {
        const x = origin?.x ?? window.innerWidth - 40;
        const y = origin?.y ?? 32;
        const radius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y),
        );
        root.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: THEME_SWAP_MS,
            easing: "cubic-bezier(0.3, 0.7, 0.2, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {});

    transition.finished.finally(() => {
      root.classList.remove("theme-transition");
    });
  }

  return { isDark, mounted, toggle };
}

/** The centre of an element on screen, for the reveal's origin. */
export function centreOf(element: Element) {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}
