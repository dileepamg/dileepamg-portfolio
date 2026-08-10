import type { CaseStudyMedia } from "@/components/WorkSection/caseStudies";
import { cn } from "@/lib/utils";
import Image from "next/image";
import ExpandableImage from "./ExpandableImage";
import PrototypeEmbed from "./PrototypeEmbed";

type MediaFrameProps = {
  media: CaseStudyMedia;
  /**
   * Adds a "View full" affordance that opens the uncropped image in a dialog.
   * Leave it off inside a card, where the whole card is already a link.
   */
  expandable?: boolean;
  /** Set false inside a card that already has its own border. */
  bordered?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export default function MediaFrame({
  media,
  expandable = false,
  bordered = true,
  sizes = "(min-width: 1536px) 40vw, (min-width: 768px) 60vw, 90vw",
  priority = false,
  className,
}: MediaFrameProps) {
  // Embeds may override the ratio; everything else stays 16:9 so rows line up.
  const aspect = media.kind === "embed" ? media.aspect : undefined;

  return (
    <figure className={cn("w-full", className)}>
      {media.kind === "image" && expandable ? (
        <ExpandableImage
          src={media.src}
          alt={media.alt}
          sizes={sizes}
          priority={priority}
        />
      ) : (
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-lg",
            bordered && "border-border border-2",
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
        <figcaption className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {media.caption}
        </figcaption>
      )}
    </figure>
  );
}
