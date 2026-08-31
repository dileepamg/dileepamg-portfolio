"use client";

import { cn } from "@/lib/utils";
import CardFront from "@/public/lanyard/card-front.jpg";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

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
 * three.js payload. It also keeps the badge visible while the WebGL scene
 * loads, preventing the empty/jumping first frame.
 */
function StillBadge({
  cardHeight,
  cardOffsetTop,
  frontImage,
}: (typeof BADGE)[keyof typeof BADGE] & {
  frontImage: string | typeof CardFront;
}) {
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
          src={frontImage}
          alt=""
          fill
          sizes="(min-width: 1280px) 230px, 190px"
          placeholder={typeof frontImage === "string" ? "empty" : "blur"}
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
type ProfileLanyardProps = {
  className?: string;
  frontImage?: string;
  backImage?: string;
};

function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (notify: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", notify);
      return () => media.removeEventListener("change", notify);
    },
    [query],
  );
  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
}

export default function ProfileLanyard({
  className,
  frontImage = "/lanyard/card-front.jpg",
  backImage = "/lanyard/card-back.jpg",
}: ProfileLanyardProps) {
  const anchor = useRef<HTMLDivElement>(null);
  const reducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );
  const beside = useMediaQuery(BREAKPOINT.split);
  const navBar = useMediaQuery(BREAKPOINT.navBar);
  const [sceneReady, setSceneReady] = useState(false);
  // Soft navigations back to home can leave a disposed WebGL/Rapier world.
  // Mount the canvas only after commit, and remount it if readiness stalls.
  const [canvasMount, setCanvasMount] = useState<{
    enabled: boolean;
    key: number;
  }>({ enabled: false, key: 0 });
  const retryCount = useRef(0);

  const handleSceneReady = useCallback(() => {
    retryCount.current = 0;
    setSceneReady(true);
  }, []);
  const handleSceneUnavailable = useCallback(() => {
    setSceneReady(false);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setCanvasMount({ enabled: false, key: 0 });
      setSceneReady(false);
      retryCount.current = 0;
      return;
    }

    setSceneReady(false);
    retryCount.current = 0;
    setCanvasMount({ enabled: false, key: 0 });

    const enableTimer = window.setTimeout(() => {
      setCanvasMount((current) => ({
        enabled: true,
        key: current.key + 1,
      }));
    }, 0);

    return () => {
      window.clearTimeout(enableTimer);
      setCanvasMount((current) => ({ ...current, enabled: false }));
      setSceneReady(false);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !canvasMount.enabled || sceneReady) return;
    if (retryCount.current >= 2) return;

    const retryTimer = window.setTimeout(() => {
      retryCount.current += 1;
      setSceneReady(false);
      setCanvasMount((current) => ({
        enabled: true,
        key: current.key + 1,
      }));
    }, 2500);

    return () => window.clearTimeout(retryTimer);
  }, [canvasMount.enabled, canvasMount.key, reducedMotion, sceneReady]);

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
      <div
        className={cn(
          "transition-opacity duration-300",
          reducedMotion || !sceneReady
            ? "opacity-100"
            : "pointer-events-none opacity-0",
        )}
      >
        <StillBadge {...badge} frontImage={frontImage} />
      </div>
      {!reducedMotion && canvasMount.enabled && (
        <Lanyard
          key={canvasMount.key}
          className={cn(
            "transition-opacity duration-300",
            sceneReady ? "opacity-100" : "opacity-0",
          )}
          anchorRef={anchor}
          {...badge}
          frontImage={frontImage}
          backImage={backImage}
          bandColor={BAND_COLOR}
          lanyardWidth={0.85}
          onReady={handleSceneReady}
          onUnavailable={handleSceneUnavailable}
        />
      )}
    </div>
  );
}
