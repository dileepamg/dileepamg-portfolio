import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ExternalLink } from "@/components/ExternalLink";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { splitGrid } from "@/lib/layout";
import { cn } from "@/lib/utils";
import type { StaticImageData } from "next/image";
import type { CaseStudy } from "./caseStudies";
import CaseStudyCard from "./CaseStudyCard";
import { cardDescriptionClass, cardTitleClass } from "./cardStyles";

import { IconBrandBehance } from "@tabler/icons-react";
import { LuExternalLink } from "react-icons/lu";

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
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="pt-0 transition-opacity hover:opacity-70 [&>svg]:size-6">
            <SectionHeading title={heading} />
          </AccordionTrigger>
          <AccordionContent>
            <div className="my-2 space-y-8 pb-2">
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
                      className="group border-rule bg-paper hover:border-brand/50 flex flex-col border transition-colors"
                    >
                      <ExternalLink
                        href={behanceHref}
                        aria-label={`View ${project.title} on Behance (opens in new tab)`}
                        className="border-rule relative block aspect-[4/3] w-full overflow-hidden border-b"
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
                          sizes="(min-width: 1463px) 480px, (min-width: 1024px) 31vw, (min-width: 640px) 65vw, 90vw"
                        />
                      </ExternalLink>

                      <div className="flex flex-1 flex-col gap-4 p-6">
                        <div className="flex-1">
                          <h3 id={headingId} className={cardTitleClass}>
                            <ExternalLink
                              href={behanceHref}
                              className="hover:text-brand-text transition-colors"
                            >
                              {project.title}
                            </ExternalLink>
                          </h3>
                          <p
                            className={cn(
                              cardDescriptionClass,
                              "hidden sm:block",
                            )}
                          >
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
