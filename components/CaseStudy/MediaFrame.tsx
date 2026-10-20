import type { CaseStudyMedia } from "@/components/WorkSection/caseStudies";
import { cn } from "@/lib/utils";
import Image from "next/image";
import ExpandableImage from "./ExpandableImage";
import PrototypeEmbed from "./PrototypeEmbed";
import { imageSizes } from "@/lib/layout";

/** The handset the mobile screens were drawn at. */
export const PHONE_ASPECT = "430 / 960";

function isPortrait(media: CaseStudyMedia) {
  return media.kind === "image" && media.orientation === "portrait";
}

/**
 * Phone screens are too narrow to sit two to a row at full width, so a set of
 * them runs three across instead. A lone one is capped rather than stretched,
 * since a full width handset would be taller than the viewport.
 */
export function mediaGridClass(items: readonly CaseStudyMedia[]) {
  if (items.every(isPortrait)) {
    if (items.length === 1) return "mx-auto w-full max-w-[280px]";
    // A pair gets a column each so it fills the section. Falling through to
    // the three-across rule would lay two screens into a three-column grid
    // and leave the last third of the row empty.
    if (items.length === 2) return "grid grid-cols-2 gap-x-4 gap-y-8";
    return "grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3";
  }

  return "grid gap-x-4 gap-y-8 md:grid-cols-2";
}

/**
 * Matches the widths `mediaGridClass` lays out, inside the reading column.
 * Pass `wide` for a grid that has broken out to the wide track.
 */
export function mediaSizes(
  items: readonly CaseStudyMedia[],
  { wide = false }: { wide?: boolean } = {},
) {
  if (items.every(isPortrait)) {
    if (items.length === 1) return "280px";
    if (items.length === 2) return "(min-width: 800px) 360px, 48vw";
    return wide
      ? "(min-width: 1152px) 350px, (min-width: 768px) 31vw, 48vw"
      : "(min-width: 800px) 240px, (min-width: 768px) 31vw, 48vw";
  }

  return wide ? imageSizes.wideHalf : imageSizes.contentHalf;
}

type MediaFrameProps = {
  media: CaseStudyMedia;
  /**
   * Adds a "View full" affordance that opens the uncropped image in a dialog.
   * Leave it off inside a card, where the whole card is already a link.
   */
  expandable?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export default function MediaFrame({
  media,
  expandable = false,
  // Full content width, derived from the column rather than measured against
  // it. See `imageSizes` in lib/layout.ts.
  sizes = imageSizes.content,
  priority = false,
  className,
}: MediaFrameProps) {
  // Embeds may override the ratio and phone screens keep their own. Everything
  // else stays 16:9 so rows line up.
  const aspect =
    media.kind === "embed"
      ? media.aspect
      : isPortrait(media)
        ? PHONE_ASPECT
        : undefined;

  return (
    <figure className={cn("w-full", className)}>
      {media.kind === "image" && expandable ? (
        <ExpandableImage
          src={media.src}
          alt={media.alt}
          sizes={sizes}
          priority={priority}
          aspect={aspect}
          portrait={isPortrait(media)}
        />
      ) : (
        <div
          className={cn(
            "border-rule border bg-surface-2 rounded-frame relative w-full overflow-hidden",
            !aspect && "aspect-video",
          )}
          style={aspect ? { aspectRatio: aspect } : undefined}
        >
          {media.kind === "image" ? (
            <Image
              src={media.src}
              alt={media.alt}
              fill
              sizes={sizes}
              priority={priority}
              placeholder="blur"
              className="object-cover object-top"
            />
          ) : (
            <PrototypeEmbed
              src={media.src}
              title={media.title}
              poster={media.poster}
              sizes={sizes}
            />
          )}
        </div>
      )}

      {media.caption && (
        <figcaption className="text-ink-faint mt-2.5 text-xs text-pretty">
          {media.caption}
        </figcaption>
      )}
    </figure>
  );
}
