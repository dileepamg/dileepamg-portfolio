"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import { LuPlay } from "react-icons/lu";

type PrototypeEmbedProps = {
  src: string;
  title: string;
  /** Still frame shown in place of the embed until it is asked for. */
  poster?: StaticImageData;
  sizes?: string;
};

/**
 * Third-party prototype embeds are heavy and slow to start. Nothing is
 * requested from Figma until the viewer clicks, which keeps that cost off the
 * initial page load, and a loading state covers the gap after they do.
 */
export default function PrototypeEmbed({
  src,
  title,
  poster,
  sizes,
}: PrototypeEmbedProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [isCovered, setIsCovered] = useState(true);

  // The cover only needs to hide the blank frame before Figma paints. Once it
  // starts, Figma shows its own progress, which reports more than a fixed
  // label can, so step aside even if the iframe load event has not fired yet.
  useEffect(() => {
    if (!isStarted) return;

    const timer = window.setTimeout(() => setIsCovered(false), 1200);
    return () => window.clearTimeout(timer);
  }, [isStarted]);

  if (!isStarted) {
    return (
      <button
        type="button"
        onClick={() => setIsStarted(true)}
        aria-label={`Load ${title}`}
        className="group absolute inset-0 h-full w-full cursor-pointer"
      >
        {poster && (
          <Image
            src={poster}
            alt=""
            fill
            sizes={sizes}
            className="object-cover object-top"
          />
        )}

        <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/45 p-4">
          {/* The parent <button> owns the hover, so the morph is driven from
              the group rather than from this element's own :hover. */}
          <span
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "group-hover:rounded-(--btn-radius)",
            )}
          >
            <LuPlay />
            Load interactive prototype
          </span>
          <span className="text-center text-xs font-medium text-white">
            Runs in Figma, so give it a few seconds to start
          </span>
        </span>
      </button>
    );
  }

  return (
    <>
      <iframe
        src={src}
        title={title}
        allowFullScreen
        onLoad={() => setIsCovered(false)}
        className="h-full w-full"
      />

      {isCovered && (
        <span
          role="status"
          className="bg-paper text-ink-soft pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-medium"
        >
          Loading prototype…
        </span>
      )}
    </>
  );
}
