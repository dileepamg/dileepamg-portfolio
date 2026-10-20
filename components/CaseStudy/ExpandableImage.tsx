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
            "border-rule border group bg-surface-2 rounded-frame relative w-full cursor-zoom-in overflow-hidden",
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
            className="ease-out-soft object-cover object-top transition-transform duration-500 group-hover:scale-[1.01] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          <span
            aria-hidden="true"
            className="bg-paper/90 text-ink-soft text-xs absolute right-2.5 bottom-2.5 flex items-center gap-1.5 rounded-md px-2 py-1 opacity-0 shadow-sm backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            <LuMaximize2 />
            View full
          </span>
        </button>
      </DialogTrigger>

      <DialogContent
        className={cn(
          "rounded-frame max-h-[90vh] w-full overflow-y-auto p-3",
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
