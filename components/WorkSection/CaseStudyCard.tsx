import MediaFrame from "@/components/CaseStudy/MediaFrame";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cardDescriptionClass, cardTitleClass } from "./cardStyles";
import { LuArrowRight } from "react-icons/lu";
import { type CaseStudy } from "./caseStudies";

type CaseStudyCardProps = {
  study: CaseStudy;
};

export default function CaseStudyCard({ study }: CaseStudyCardProps) {
  const { slug, title, description, media } = study;
  const headingId = `case-study-${slug}`;
  const href = `/work/${slug}`;

  return (
    <article
      aria-labelledby={headingId}
      className="group border-rule bg-paper hover:border-brand/50 relative border p-6 transition-colors md:p-8"
    >
      {/* Stacked until `lg`. The split used to start at `sm`, where each half
          was about 190px, and because the image half was `shrink-0` while the
          text half asked for a full 100%, the row summed to 150% of the card
          and the excess was pushed off the reversed row's left edge, clipping
          the title and every line of the description. */}
      <div className="flex flex-col gap-6 lg:flex-row-reverse lg:gap-8">
        <Link
          href={href}
          aria-label={`View the ${title} case study`}
          className="w-full lg:w-1/2 lg:shrink-0"
        >
          <MediaFrame
            media={media}
            sizes="(min-width: 1281px) 416px, (min-width: 1024px) 33vw, 90vw"
          />
        </Link>

        {/* `flex-1` sizes this from what is left rather than from a fixed
            100%, and `min-w-0` lets it fall below its intrinsic width. */}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-4">
          <h3 id={headingId} className={cardTitleClass}>
            <Link
              href={href}
              className="hover:text-brand-text transition-colors"
            >
              {title}
            </Link>
          </h3>

          <p className={cardDescriptionClass}>{description}</p>

          <Button asChild variant="outline" className="w-fit">
            <Link href={href}>
              See how it came together
              <LuArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
