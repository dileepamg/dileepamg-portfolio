import { ExternalLink } from "@/components/ExternalLink";
import {
  accentLinkClass,
  SectionHeading,
} from "@/components/ui/section-heading";
import {
  RowChip,
  rowClass,
  rowDescriptionClass,
  rowTitleClass,
} from "@/components/ui/row";
import { imageSizes, ratioOf } from "@/lib/layout";
import { cn } from "@/lib/utils";
import Image, { type StaticImageData } from "next/image";
import { LuArrowUpRight } from "react-icons/lu";
import type { CaseStudy } from "./caseStudies";
import CaseStudyCard from "./CaseStudyCard";

type WorkSectionProps = {
  caseStudies: readonly CaseStudy[];
  projects: readonly {
    title: string;
    description: string;
    behance: string;
    image: StaticImageData;
  }[];
  heading?: string;
};

const BEHANCE_PROFILE = "https://www.behance.net/dileepamg";

/**
 * Two tiers of work, weighted by what they prove.
 *
 * The case studies are the argument for hiring: they lead, image first, and
 * sit side by side so the pair reads as one body of work. The Behance pieces are supporting
 * evidence, so they drop to compact rows: still one click away, but no
 * longer competing with the studies for the same amount of attention.
 */
export default function WorkSection({
  caseStudies,
  projects,
  heading = "Featured Work",
}: WorkSectionProps) {
  return (
    <section id="work" aria-labelledby="work-heading">
      <SectionHeading id="work-heading" title={heading} />

      {/* Side by side from `md`, so both studies are seen in one look. */}
      <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
        {caseStudies.map((study, index) => (
          <CaseStudyCard
            key={study.slug}
            study={study}
            priority={index === 0}
          />
        ))}
      </div>

      {projects.length > 0 && (
        <ul className="border-rule mt-12 border-t pt-4">
          {projects.map((project) => (
            <li
              key={project.title}
              className={cn(
                rowClass,
                "grid-cols-[6rem_minmax(0,1fr)] sm:grid-cols-[8rem_minmax(0,1fr)_auto]",
              )}
            >
              <div
                className="border-rule bg-surface-2 relative overflow-hidden rounded-md border"
                style={{ aspectRatio: ratioOf(project.image) }}
              >
                <Image
                  src={project.image}
                  alt=""
                  fill
                  placeholder="blur"
                  sizes={imageSizes.rowThumb}
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className={rowTitleClass}>
                  <ExternalLink
                    href={project.behance}
                    aria-label={`${project.title}, on Behance (opens in new tab)`}
                    className="stretched-link"
                  >
                    {project.title}
                  </ExternalLink>
                </h3>
                <p className={cn(rowDescriptionClass, "line-clamp-2")}>
                  {project.description}
                </p>
              </div>
              <RowChip className="hidden sm:inline-flex">
                Behance
                <LuArrowUpRight className="size-3" />
              </RowChip>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4">
        <ExternalLink
          href={BEHANCE_PROFILE}
          className={cn(accentLinkClass, "text-sm")}
        >
          View more on Behance
          <LuArrowUpRight className="size-3.5" aria-hidden="true" />
          <span className="sr-only">(opens in new tab)</span>
        </ExternalLink>
      </p>
    </section>
  );
}
