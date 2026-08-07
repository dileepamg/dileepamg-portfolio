"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image, { type StaticImageData } from "next/image";
import { LuMaximize2 } from "react-icons/lu";

type ExpandableImageProps = {
  src: StaticImageData;
  alt: string;
  sizes: string;
  priority?: boolean;
};

/**
 * Shows a 16:9 crop so every screenshot lines up, and opens the uncropped
 * image in a dialog on click. Long page screenshots scroll inside it.
 */
export default function ExpandableImage({
  src,
  alt,
  sizes,
  priority = false,
}: ExpandableImageProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={`View the full image: ${alt}`}
          className="group border-border relative aspect-video w-full cursor-pointer overflow-hidden rounded-lg border-2"
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover object-top"
          />
          <span className="border-border rounded-base absolute right-2 bottom-2 flex items-center gap-1.5 border-2 bg-white px-2 py-1 text-xs font-bold text-black opacity-0 transition-opacity group-hover:opacity-100">
            <LuMaximize2 />
            View full
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] w-full overflow-y-auto p-4 sm:max-w-4xl">
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <Image
          src={src}
          alt={alt}
          sizes="(min-width: 640px) 56rem, 100vw"
          className="h-auto w-full"
        />
      </DialogContent>
    </Dialog>
  );
}
