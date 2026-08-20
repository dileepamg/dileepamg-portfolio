"use client";

import { cn } from "@/lib/utils";
import CardFront from "@/public/lanyard/card-front.jpg";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * The 3D scene pulls in three, rapier and a 2.4MB model. Loading it eagerly
 * would put all of that in front of the page's first paint for a decoration,
 * so it is split out and only requested once this component mounts in the
 * browser. `ssr: false` because the canvas needs a real WebGL context.
 */
const Lanyard = dynamic(() => import("@/components/ui/lanyard"), {
  ssr: false,
});

/** `--secondary`: the nav bar's fill, fixed across both themes. */
const BAND_COLOR = "#262626";

/**
 * How big the badge draws, and where it settles measured down from the top of
 * this element.
 *
 * These track two Tailwind breakpoints, which is a duplication to keep an eye
 * on — but the camera works in pixels and CSS cannot reach it. `AboutSection`
 * crops the column to match each case; the two files have to be read together
 * or a gap opens under the card.
 *
 * The card's proportions are the model's, so height is the only handle on its
 * size — making it wider means raising `cardHeight`, and the columns follow.
 */
const BREAKPOINT = {
  /** `xl`, where the column splits and the badge moves beside the copy. */
  split: "(min-width: 80rem)",
  /** `sm`, where the nav stops being a hamburger and becomes a full bar. */
  navBar: "(min-width: 40rem)",
};

const BADGE = {
  // Below `sm` the nav is a small button off to the left, so the strap has
  // nothing to clear and the badge can hang near the top of the page. Once the
  // nav is a bar across the column it does have something to clear, and the
  // badge drops far enough to leave the clip clear of it.
  phone: { cardHeight: 280, cardOffsetTop: 137 },
  tablet: { cardHeight: 280, cardOffsetTop: 185 },
  beside: { cardHeight: 345, cardOffsetTop: 185 },
};

/**
 * The still badge, for readers who have asked for reduced motion. A lanyard
 * that drops, swings and then follows the pointer is exactly the unsolicited
 * movement the setting exists to stop, so they get the card and none of the
 * three.js payload. It is not used as a loading placeholder: swapping a flat
 * image for the canvas a moment later read as a flicker.
 */
function StillBadge({
  cardHeight,
  cardOffsetTop,
}: (typeof BADGE)[keyof typeof BADGE]) {
  return (
    <div className="absolute inset-0 flex flex-col items-center">
      {/* Same pixel measurements the camera works from, so the still card
          lands where the hanging one would have. */}
      <div
        style={{
          height: cardOffsetTop - cardHeight / 2,
          width: 5,
          backgroundColor: BAND_COLOR,
        }}
      />
      <div className="relative aspect-[0.716]" style={{ height: cardHeight }}>
        <Image
          src={CardFront}
          alt=""
          fill
          sizes="(min-width: 1280px) 230px, 190px"
          placeholder="blur"
          className="rounded-[3%] object-contain"
        />
      </div>
    </div>
  );
}

/**
 * The badge's place in the layout, and nothing else.
 *
 * This element never draws the badge — it only marks where the badge belongs.
 * The canvas is fixed over the whole viewport and reads this box every frame,
 * which is what leaves the strap free to swing anywhere on screen without an
 * edge to be cut off against.
 */
export default function ProfileLanyard({ className }: { className?: string }) {
  const anchor = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [beside, setBeside] = useState(false);
  const [navBar, setNavBar] = useState(false);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const queries = [
      ["(prefers-reduced-motion: reduce)", setReducedMotion] as const,
      [BREAKPOINT.split, setBeside] as const,
      [BREAKPOINT.navBar, setNavBar] as const,
    ];

    const teardown = queries.map(([query, set]) => {
      const media = window.matchMedia(query);
      const sync = () => set(media.matches);

      sync();
      media.addEventListener("change", sync);
      return () => media.removeEventListener("change", sync);
    });

    return () => teardown.forEach((off) => off());
  }, []);

  // A canvas the size of the viewport is not free to redraw, and it stays
  // mounted for the whole page, so it is stood down once this element is well
  // clear of the screen. The margin is generous enough that it is running
  // again — and has moved the camera — before any of it could be seen.
  useEffect(() => {
    const element = anchor.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "400px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const badge = beside
    ? BADGE.beside
    : navBar
      ? BADGE.tablet
      : BADGE.phone;

  return (
    <div
      ref={anchor}
      role="img"
      aria-label="Dileepa Galmangoda's ID badge, hanging from a lanyard"
      className={cn("absolute inset-0", className)}
    >
      {reducedMotion ? (
        <StillBadge {...badge} />
      ) : (
        <Lanyard
          anchorRef={anchor}
          active={inView}
          {...badge}
          frontImage="/lanyard/card-front.jpg"
          backImage="/lanyard/card-back.jpg"
          bandColor={BAND_COLOR}
          lanyardWidth={0.85}
        />
      )}
    </div>
  );
}
