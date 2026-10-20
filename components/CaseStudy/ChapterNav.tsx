"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type ChapterNavProps = {
  items: readonly { id: string; title: string }[];
};

/**
 * The chapter list in the margin of a case study, pinned while you read.
 *
 * Highlights the chapter whose top has most recently crossed the upper third
 * of the viewport, so the marker moves as each chapter heading passes the
 * eye rather than when a chapter is finally mostly on screen. Plain anchor
 * links underneath, so it works without this script and with it.
 */
export function ChapterNav({ items }: ChapterNavProps) {
  const [active, setActive] = useState<string | null>(null);
  const key = items.map((item) => item.id).join(",");

  useEffect(() => {
    const elements = key
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-30% 0px -65% 0px" },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [key]);

  return (
    <nav aria-label="Chapters" className="sticky top-24">
      <p className="text-ink-faint text-xs">Contents</p>
      {/* A rule down the left, with each link sitting on it: the current
          chapter's stretch of the rule is drawn in the brand colour. */}
      <ol className="border-rule mt-3 border-l">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "-ml-px block border-l py-1.5 pr-2 pl-3.5 text-[0.8125rem] leading-snug text-pretty transition-colors duration-200",
                  isActive
                    ? "border-brand text-ink font-medium"
                    : "text-ink-faint hover:text-ink hover:border-ink-faint border-transparent",
                )}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
