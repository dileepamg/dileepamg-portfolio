"use client";

import { columnClass, columnPadding } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeSwitcher } from "./theme-switcher";

/**
 * Inner rails. A hatched band, the same diagonal as the page gutters,
 * sits on each edge, bounded by a hairline on the content side so the
 * copy stays on solid fill. Width matches on all four sides (`2.5`).
 */
function NavEdgeRail({ edge }: { edge: "top" | "bottom" | "left" | "right" }) {
  const vertical = edge === "left" || edge === "right";

  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute",
        vertical ? "inset-y-0 w-2.5" : "inset-x-0 h-2.5",
        edge === "top" && "top-0",
        edge === "bottom" && "bottom-0",
        edge === "left" && "left-0",
        edge === "right" && "right-0",
      )}
    >
      <span className="bg-hatch absolute inset-0 [--pattern-fg:color-mix(in_oklab,var(--secondary-foreground)_12%,transparent)]" />
      <span
        className={cn(
          "bg-secondary-foreground/25 absolute",
          vertical ? "inset-y-0 w-px" : "inset-x-0 h-px",
          edge === "top" && "bottom-0",
          edge === "bottom" && "top-0",
          edge === "left" && "right-0",
          edge === "right" && "left-0",
        )}
      />
    </span>
  );
}

export default function Nav() {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const isNavigating = useRef(false);

  // Show the nav on every route change. Adjusting state during render is what
  // React prescribes for reacting to a changed input, and it lands in the same
  // commit as the new route rather than a frame later, which an effect would.
  const [renderedPath, setRenderedPath] = useState(path);
  if (path !== renderedPath) {
    setRenderedPath(path);
    setIsVisible(true);
  }

  // Arriving on a page restores the previous scroll position or jumps to a
  // hash, and that fires a scroll event that looks exactly like scrolling
  // down, so those events are ignored briefly and the nav can't hide itself
  // the moment a page loads.
  useEffect(() => {
    isNavigating.current = true;

    const timer = window.setTimeout(() => {
      isNavigating.current = false;
      lastScrollY.current = window.scrollY;
    }, 500);

    return () => window.clearTimeout(timer);
  }, [path]);

  // Watch scroll direction to show/hide nav
  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (isNavigating.current) {
        lastScrollY.current = currentScrollY;
        return;
      }

      // Near the top the nav always shows, however the reader got there.
      setIsVisible(currentScrollY < 80 || currentScrollY < lastScrollY.current);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    {
      path: "/#about",
      text: "About",
    },
    {
      path: "/#work",
      text: "Work",
    },
    {
      path: "/#experience",
      text: "Experience",
    },
    {
      path: "/#fun",
      text: "Fun",
    },
  ];
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const linkClass =
    "text-secondary-foreground/70 hover:text-secondary-foreground px-2 py-2 transition-colors";

  return (
    <div
      className={cn(
        // The bar sits exactly over the reading column, using the same
        // width constant as the column and the frame rails.
        "fixed top-10 z-50 transition-transform duration-300 ease-in-out",
        columnClass,
        {
          "-translate-y-[calc(100%+3rem)]": !isVisible,
          "translate-y-0": isVisible,
        },
      )}
    >
      {/* Desktop Navigation */}
      {/* Full-size type and padding do not fit the bar until the column is
          wide enough to hold them, so both stay small through the tablet
          range and step up at `lg`. */}
      <nav
        className={cn(
          "bg-secondary text-secondary-foreground relative hidden items-center gap-1 py-2.5 text-sm sm:flex lg:gap-4 lg:text-base",
          columnPadding,
        )}
      >
        <NavEdgeRail edge="top" />
        <NavEdgeRail edge="bottom" />
        <NavEdgeRail edge="left" />
        <NavEdgeRail edge="right" />
        <Link href="/" className="font-logo w-full text-2xl lg:text-3xl">
          Dileepa·G
        </Link>

        {links.map((link) => {
          return (
            <Link key={link.path} className={linkClass} href={link.path}>
              {link.text}
            </Link>
          );
        })}
        <ThemeSwitcher />
      </nav>

      {/* Mobile Navigation */}
      {/* `relative` so the panel below resolves against this element. Without
          it the nearest positioned ancestor is the outer column, so the panel
          took its `w-full` from the full column width while still starting at
          this element's inset left edge, hanging the whole margin off the
          right. */}
      <div className="relative mx-5 sm:hidden">
        {/* Hamburger Button */}
        <button
          onClick={toggleMenu}
          className="bg-secondary text-secondary-foreground/70 hover:text-secondary-foreground flex items-center justify-center p-2.5 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0" onClick={closeMenu} />

            {/* Menu Content */}
            <div className="bg-secondary text-secondary-foreground absolute top-16 w-full p-4">
              <div className="flex flex-col gap-2">
                <div className="border-secondary-foreground/15 flex w-full flex-row items-center justify-between border-b pb-4">
                  <p className="font-logo text-center text-3xl">Dileepa·G</p>
                  <ThemeSwitcher />
                </div>
                {links.map((link) => {
                  return (
                    <Link
                      key={link.path}
                      className="text-secondary-foreground/70 hover:text-secondary-foreground px-3 py-2 text-center transition-colors"
                      href={link.path}
                      onClick={closeMenu}
                    >
                      {link.text}
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
