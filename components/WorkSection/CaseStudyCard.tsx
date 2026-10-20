import { imageSizes } from "@/lib/layout";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { LuArrowRight } from "react-icons/lu";
import { type CaseStudy } from "./caseStudies";

type CaseStudyCardProps = {
  study: CaseStudy;
  /** The first card is above the fold on most screens, so it loads eagerly. */
  priority?: boolean;
};

/**
 * The frame every featured card shares, so the pair lines up.
 *
 * 2:1 sits between the covers in use (16:9 and a wide banner), so neither
 * loses anything that matters: a 16:9 cover gives up a sliver of background
 * top and bottom, and a wider one is anchored to its left edge, where a
 * banner's headline sits, and gives up only background on the right.
 */
const CARD_RATIO = 2;

/** The view-transition name a study's picture carries on both pages. */
export function caseStudyMediaName(slug: string) {
  return `case-media-${slug}`;
}

/**
 * A case study on the home page: the most important thing on it.
 *
 * Image first, because a designer's work is judged by looking before reading.
 * The pair sits side by side, so both studies are seen together in one look. The whole card is one target through the
 * title's stretched link, so there is a single, obvious way in instead of a
 * picture, a title and a button all pointing at the same page.
 *
 * The picture carries a view-transition name, and the case study page puts
 * the same name on its hero, so following the link morphs one into the other.
 */
export default function CaseStudyCard({
  study,
  priority = false,
}: CaseStudyCardProps) {
  const { slug, title, description, media } = study;
  const headingId = `case-study-${slug}`;
  const href = `/work/${slug}`;
  // Cards are meant to carry a still. An embed falls back to its poster.
  const image = media.kind === "image" ? media.src : media.poster;
  const alt = media.kind === "image" ? media.alt : media.title;

  return (
    <article
      aria-labelledby={headingId}
      className="group relative flex flex-col"
    >
      <ViewTransition
        name={caseStudyMediaName(slug)}
        share="morph"
        default="none"
      >
        <div
          className="border-rule bg-surface-2 rounded-frame relative overflow-hidden border"
          style={{ aspectRatio: `${CARD_RATIO} / 1` }}
        >
          {image && (
            <Image
              src={image}
              alt={alt}
              fill
              sizes={imageSizes.contentHalf}
              priority={priority}
              placeholder="blur"
              style={{
                objectPosition:
                  image.width / image.height > CARD_RATIO
                    ? "left center"
                    : "center",
              }}
              className="ease-out-soft object-cover transition-transform duration-700 group-hover:scale-[1.015] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          )}
        </div>
      </ViewTransition>

      <h3
        id={headingId}
        className="text-ink mt-4 text-base font-semibold text-pretty"
      >
        <Link href={href} className="stretched-link">
          {title}
        </Link>
      </h3>

      <p className="text-ink-soft mt-1.5 text-sm text-pretty">{description}</p>

      {/* The call to action. Drawn, not a second link: the title's stretched
          link already makes the whole card the target, so this is the visible
          cue that it goes somewhere, and it answers the hover with the card.
          Pushed to the card's foot, so the pair's links share a line however
          long each description runs. */}
      <p
        aria-hidden="true"
        className="text-brand-text mt-auto inline-flex items-center gap-1 pt-3 text-sm font-medium"
      >
        <span className="decoration-brand-text/40 underline-offset-4 group-hover:underline">
          See how it came together
        </span>
        <LuArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
      </p>
    </article>
  );
}
