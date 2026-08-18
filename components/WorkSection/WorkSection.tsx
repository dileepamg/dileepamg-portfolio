import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { caseStudies } from "./caseStudies";
import CaseStudyCard from "./CaseStudyCard";
import { projects } from "./data";

import { IconBrandBehance } from "@tabler/icons-react";

import Image from "next/image";
export default function WorkSection() {
  return (
    <section id="work" className="scroll-mt-16">
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <h1 className="mb-2 text-2xl md:text-3xl">Featured Work</h1>
          </AccordionTrigger>
          <AccordionContent>
            <div className="my-2 ml-2 space-y-8 pr-2">
              {caseStudies.map((study) => (
                <CaseStudyCard key={study.title} study={study} />
              ))}

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {projects.map((project) => (
                  <div
                    key={project.title}
                    className="group dark:bg-darkBg shadow-shadow transform rounded-lg border-3 bg-[#fef8ee] p-6 transition-transform hover:scale-102 dark:bg-black"
                  >
                    <div className="relative mb-4 w-full overflow-hidden rounded-lg">
                      <Image
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        width={200}
                        height={150}
                      />
                    </div>

                    <h3 className="mb-3 transform text-2xl font-bold">
                      {project.title}
                    </h3>
                    <p className="dark:text-darkText sm:text-md mb-4 hidden text-sm text-pretty sm:block">
                      {project.description}
                    </p>

                    <div className="flex flex-col gap-4">
                      <div className="flex w-full gap-4">
                        <a
                          href={project.behance}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shadow-shadow bg-main flex w-full transform items-center gap-2 border-2 px-2 py-2 text-black transition-transform hover:-translate-y-1 dark:text-black"
                        >
                          <IconBrandBehance />
                          View on Behance <span className="ml-auto">↗</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
