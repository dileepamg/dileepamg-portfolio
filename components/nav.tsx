"use client";

import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import siteIcon from "@/app/icon.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ThemeSwitcher } from "./theme-switcher";

const defaultLinks = [
  { path: "/#work", text: "Work" },
  { path: "/#experience", text: "Experience" },
  { path: "/blog", text: "Blog" },
  { path: "/#fun", text: "Fun" },
];

type NavLink = { path: string; text: string };

type NavProps = {
  brandLabel?: string;
  links?: readonly NavLink[];
};

/** The section id a home-page anchor points at, or null for a route. */
function anchorOf(path: string) {
  const match = /^\/?#(.+)$/.exec(path);
  return match ? match[1] : null;
}

/**
 * The home-page section a link stands for while you are on the home page.
 * The blog link is a route, but the home page has a blog section of its own,
 * so it is tracked like the anchors and highlights the same way they do.
 */
function sectionOf(path: string) {
  return anchorOf(path) ?? (path === "/blog" ? "blog" : null);
}

/**
 * Links that are not shown in the bar. The masthead is the top of the page,
 * and the brand already takes you there.
 */
const HIDDEN_SECTIONS = new Set(["about"]);

/**
 * Which section of the home page is being read, worked out from the scroll
 * position rather than from intersection events.
 *
 * The current section is the last one whose top has passed a line a third of
 * the way down the window; above the first section (the masthead) nothing is
 * current. At the very bottom of the page the last section wins, because a
 * short final section may never reach that line, but only once the reader
 * has scrolled: while a page is still loading it can be briefly short enough
 * to count as "at the bottom", and arriving at the top must never light up
 * the last link. Reading the
 * geometry directly on every (throttled) scroll means the answer is always
 * the same for the same position, however fast or in whichever direction the
 * page got there.
 */
function useActiveSection(ids: readonly string[], enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    if (!enabled) return;
    const order = key.split(",");

    let frame = 0;
    const measure = () => {
      frame = 0;
      const elements = order
        .map((id) => document.getElementById(id))
        .filter((element): element is HTMLElement => element !== null);
      if (elements.length === 0) return;

      const root = document.documentElement;
      const atBottom =
        window.scrollY > 0 &&
        window.scrollY + window.innerHeight >= root.scrollHeight - 4;
      if (atBottom) {
        setActive(elements[elements.length - 1].id);
        return;
      }

      const line = window.innerHeight / 3;
      let current: string | null = null;
      for (const element of elements) {
        if (element.getBoundingClientRect().top <= line) current = element.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [key, enabled]);

  return enabled ? active : null;
}

/** Whether the page has scrolled at all, for the bar's lift. */
function useScrolled() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return scrolled;
}

/**
 * The bar: a compact pill, centred and floating at the top of the window.
 *
 * Solid paper, never see-through, so nothing scrolling under it can muddy
 * the links. The current link is a filled ink pill, a segmented control
 * rather than an underline, so where you are reads at a glance. It simply
 * fades in and out: nothing moves between links or across pages, so the
 * highlight can never fly in from somewhere it no longer is. Once the page
 * moves the whole bar lifts on a soft shadow.
 */
export default function Nav({
  brandLabel = "Dileepa·G",
  links = defaultLinks,
}: NavProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const scrolled = useScrolled();
  const barRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  // Arriving on another page closes the menu.
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  // While open, Escape or a tap anywhere outside the bar folds it away.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (!barRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen]);

  const isHome = pathname === "/";
  const shown = links.filter(
    (link) => !HIDDEN_SECTIONS.has(anchorOf(link.path) ?? ""),
  );
  const sections = shown
    .map((link) => sectionOf(link.path))
    .filter((id): id is string => id !== null);
  const activeSection = useActiveSection(sections, isHome);

  /** `page` for the route you are on, `location` for the section in view. */
  function currentFor(link: NavLink): "page" | "location" | undefined {
    if (isHome) {
      return activeSection !== null && sectionOf(link.path) === activeSection
        ? "location"
        : undefined;
    }
    // A case study belongs to the work section.
    if (anchorOf(link.path) === "work" && pathname.startsWith("/work/")) {
      return "page";
    }
    return pathname === link.path || pathname.startsWith(`${link.path}/`)
      ? "page"
      : undefined;
  }

  return (
      <header className="sticky top-3 z-40 mt-3 flex justify-center px-4 sm:top-4 sm:mt-4">
        {/* One surface for both layouts. On a wide screen it is a pill; on a
            phone it is the same bar, and opening the menu grows it downward
            into a card holding the links, rather than covering the page with
            a separate sheet. */}
        <div
          ref={barRef}
          className={cn(
            "border-rule bg-paper w-full max-w-[calc(var(--reading-max)+2rem)] border p-1 transition-[border-radius,box-shadow] duration-300 sm:w-auto sm:rounded-full",
            menuOpen ? "rounded-3xl" : "rounded-[1.375rem]",
            scrolled || menuOpen
              ? "shadow-[0_1px_2px_rgb(0_0_0/0.05),0_10px_24px_-12px_rgb(0_0_0/0.25)]"
              : "shadow-[0_1px_2px_rgb(0_0_0/0.03)]",
          )}
        >
          <div className="flex h-9 items-center gap-1 pl-3">
            <Link
              href="/"
              aria-label={brandLabel}
              className="text-ink -ml-2 mr-auto flex items-center gap-2 rounded-full py-0.5 pr-2 text-sm font-semibold tracking-tight sm:mr-1"
            >
              {/* The lettermark is the site's own icon, imported from the
                  favicon file so the two can never drift apart. Decorative:
                  the link's label carries the brand. */}
              <Image
                src={siteIcon}
                alt=""
                width={28}
                height={28}
                priority
                className="size-7 rounded-full"
              />
              <span aria-hidden="true">{brandLabel}</span>
            </Link>

            <span
              aria-hidden="true"
              className="bg-rule mx-1 hidden h-4 w-px sm:block"
            />

            <nav aria-label="Primary" className="hidden sm:block">
              <ul className="flex items-center">
                {shown.map((link) => {
                  const current = currentFor(link);
                  return (
                    <li key={link.path}>
                      <Link
                        href={link.path}
                        aria-current={current}
                        className={cn(
                          "block rounded-full px-3 py-1.5 text-sm transition-colors duration-200",
                          current
                            ? "bg-ink text-paper"
                            : "text-ink-soft hover:text-ink hover:bg-tint",
                        )}
                      >
                        {link.text}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <ThemeSwitcher />

            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
              className="text-ink-soft hover:bg-tint hover:text-ink inline-flex size-9 items-center justify-center rounded-full transition-colors sm:hidden"
            >
              {menuOpen ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* The links, folded into the bar. A grid row animating from 0fr
              to 1fr gives the panel its natural height without measuring it.
              Closed, it is inert, so its links are out of the tab order and
              hidden from assistive tech. */}
          <div
            id={menuId}
            inert={!menuOpen}
            className={cn(
              "ease-out-soft grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none sm:hidden",
              menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <nav aria-label="Primary" className="min-h-0 overflow-hidden">
              <ul className="flex flex-col gap-0.5 px-1 pt-2 pb-1">
                {shown.map((link) => {
                  const current = currentFor(link);
                  return (
                    <li key={link.path}>
                      <Link
                        href={link.path}
                        aria-current={current}
                        onClick={() => setMenuOpen(false)}
                        className={cn(
                          "block rounded-2xl px-3 py-2.5 text-base transition-colors",
                          current
                            ? "bg-ink text-paper"
                            : "text-ink-soft hover:bg-tint hover:text-ink",
                        )}
                      >
                        {link.text}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </header>
  );
}
