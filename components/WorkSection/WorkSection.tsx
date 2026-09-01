import { Button } from "@/components/ui/button";
import { IconBrandBehance } from "@tabler/icons-react";
import { LuExternalLink } from "react-icons/lu";
import { ExternalLink } from "@/components/ExternalLink";
import { SectionHeading } from "@/components/ui/section-heading";
import { splitGrid } from "@/lib/layout";
import { cn } from "@/lib/utils";
import type { StaticImageData } from "next/image";
import type { CaseStudy } from "./caseStudies";
import CaseStudyCard from "./CaseStudyCard";
import { cardDescriptionClass, cardTitleClass } from "./cardStyles";


import Image from "next/image";

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

export default function WorkSection({
  caseStudies,
  projects,
  heading = "Featured Work",
}: WorkSectionProps) {
  return (
    <section id="work" className="scroll-mt-28">
      <SectionHeading title={heading} />

      <div className="mt-6 space-y-8">
        {caseStudies.map((study) => (
          <CaseStudyCard key={study.title} study={study} />
        ))}

        <div className={cn(splitGrid, "gap-8")}>
          {projects.map((project) => {
            const headingId = `project-${project.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")}`;

            const behanceHref = project.behance;

            return (
              <article
                key={project.title}
                aria-labelledby={headingId}
                className="group border-rule bg-paper hover:border-brand/50 flex flex-col border p-6 transition-colors md:p-8"
              >
                {/* Inset by the card's own padding and framed in its own
                    border, the way the case study cards hold their media. The
                    padding steps at `md` with theirs, so the two shapes of
                    card in this one list keep the same inner margin at every
                    width rather than diverging by 8px past the breakpoint. */}
                <ExternalLink
                  href={behanceHref}
                  aria-label={`View ${project.title} on Behance (opens in new tab)`}
                  className="border-rule relative block aspect-[4/3] w-full overflow-hidden border"
                >
                  {/* `fill` + `sizes`, not `width`/`height`. The card is
                            fluid, so a declared intrinsic width is a fiction:
                            it made Next build a srcset around 200px and serve
                            a 256px file into a box that is 454px wide on
                            desktop and 650px at the widest single-column
                            width. */}
                  <Image
                    src={project.image}
                    alt={project.title}
                    className="object-cover object-center"
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1281px) 336px, (min-width: 1024px) 26vw, (min-width: 640px) 58vw, 82vw"
                  />
                </ExternalLink>

                <div className="mt-6 flex flex-1 flex-col gap-4 md:mt-8">
                  <div className="flex-1">
                    <h3 id={headingId} className={cardTitleClass}>
                      <ExternalLink
                        href={behanceHref}
                        className="hover:text-brand-text transition-colors"
                      >
                        {project.title}
                      </ExternalLink>
                    </h3>
                    <p className={cn(cardDescriptionClass, "hidden sm:block")}>
                      {project.description}
                    </p>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <ExternalLink href={behanceHref}>
                      <IconBrandBehance data-icon="inline-start" />
                      View on Behance
                      <LuExternalLink className="ml-auto transition-transform group-hover:translate-x-1" />
                    </ExternalLink>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Button asChild variant="outline">
            <ExternalLink href="https://www.behance.net/dileepamg">
              <IconBrandBehance data-icon="inline-start" />
              View more on Behance
              <LuExternalLink data-icon="inline-end" />
            </ExternalLink>
          </Button>
        </div>
      </div>
    </section>
  );
}
