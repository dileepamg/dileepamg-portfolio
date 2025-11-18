import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { projects } from "@/data/projects";

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
            <div className="my-2 ml-2 grid grid-cols-1 gap-8 pr-2 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <div
                  key={project.title}
                  className="group dark:bg-darkBg shadow-shadow transform rounded-lg border-3 bg-white p-6 transition-transform hover:scale-102 dark:bg-black"
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
                  {/* <div className="mb-4 hidden gap-2 sm:flex sm:flex-wrap">
                    {project.tools.map((tools) => (
                      <span
                        key={tools}
                        className="bg-white px-2 py-1 text-xs font-semibold dark:text-black"
                        style={{
                          border: "1px solid black",
                        }}
                      >
                        {tools}
                      </span>
                    ))}
                  </div> */}
                  <p className="dark:text-darkText sm:text-md mb-4 hidden text-sm text-pretty sm:block">
                    {project.description}
                  </p>

                  <div className="flex flex-col gap-4">
                    <div className="flex w-full gap-4">
                      {/* <a
                        href={project.figma}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shadow-shadow flex w-full transform items-center gap-2 border-2 bg-[#ff7237] px-2 py-2 text-black transition-transform hover:-translate-y-1 dark:text-black"
                      >
                        <IconBrandFigma />
                        Figma
                      </a> */}
                      <a
                        href={project.behance}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shadow-shadow flex w-full transform items-center gap-2 border-2 bg-blue-400 px-2 py-2 text-black transition-transform hover:-translate-y-1 dark:text-black"
                      >
                        <IconBrandBehance />
                        View on Behance <span className="ml-auto">↗</span>
                      </a>
                    </div>
                    {/* <div className="flex w-full gap-4">
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shadow-shadow flex w-full transform items-center gap-2 border-2 px-2 py-2 text-black transition-transform hover:-translate-y-1 dark:text-black"
                      >
                        <LuExternalLink size={20} />
                        Live Demo
                      </a>
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
