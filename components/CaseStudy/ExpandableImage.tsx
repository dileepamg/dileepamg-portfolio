"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Image, { type StaticImageData } from "next/image";
import { LuMaximize2 } from "react-icons/lu";

type ExpandableImageProps = {
  src: StaticImageData;
  alt: string;
  sizes: string;
  priority?: boolean;
  /** CSS aspect-ratio for the framed crop. Defaults to 16:9. */
  aspect?: string;
  /** Keeps the dialog narrow, so a handset capture is not upscaled. */
  portrait?: boolean;
};

/**
 * Shows a cropped frame so every screenshot lines up, and opens the uncropped
 * image in a dialog on click. Long page screenshots scroll inside it.
 */
export default function ExpandableImage({
  src,
  alt,
  sizes,
  priority = false,
  aspect,
  portrait = false,
}: ExpandableImageProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={`View the full image: ${alt}`}
          className={cn(
            "group border-rule hover:border-brand/50 relative w-full cursor-pointer overflow-hidden border transition-colors",
            !aspect && "aspect-video",
          )}
          style={aspect ? { aspectRatio: aspect } : undefined}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            placeholder="blur"
            className="object-cover object-top"
          />
          <span className="border-rule bg-paper text-ink-soft absolute right-2 bottom-2 flex items-center gap-1.5 border px-2 py-1 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100">
            <LuMaximize2 />
            View full
          </span>
        </button>
      </DialogTrigger>

      <DialogContent
        className={cn(
          "rounded-frame max-h-[90vh] w-full overflow-y-auto p-4",
          portrait ? "sm:max-w-[26rem]" : "sm:max-w-4xl",
        )}
      >
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <Image
          src={src}
          alt={alt}
          sizes={
            portrait
              ? "(min-width: 640px) 24rem, 100vw"
              : "(min-width: 640px) 56rem, 100vw"
          }
          placeholder="blur"
          className="h-auto w-full"
        />
      </DialogContent>
    </Dialog>
  );
}
