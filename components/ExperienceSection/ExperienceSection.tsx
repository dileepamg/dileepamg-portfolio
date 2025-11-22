"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { experiences } from "./data";
import ExperienceCard from "./ExperienceCard";

export default function ExperienceSection() {
  const [showAll, setShowAll] = useState(false);
  return (
    <section id="experience" className="scroll-mt-16">
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <h1 className="mb-2 text-2xl md:text-3xl">
              Professional Experience
            </h1>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pr-2 pb-4">
              <div className="shadow-shadow relative rounded-lg border-2 bg-white dark:bg-black">
                <div
                  className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                    showAll ? "max-h-[2000px]" : "max-h-[500px]"
                  }`}
                >
                  {experiences.map((exp) => (
                    <ExperienceCard key={exp.company} position={exp} />
                  ))}
                </div>
                {!showAll && experiences.length > 2 && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 mx-1 flex justify-center bg-gradient-to-t from-white via-white/100 to-transparent pt-20 pb-5 dark:from-black dark:via-black/100">
                    <Button
                      type="button"
                      size="sm"
                      className="pointer-events-auto px-4"
                      onClick={() => setShowAll(true)}
                    >
                      Show All
                    </Button>
                  </div>
                )}

                {showAll && (
                  <div className="flex justify-center py-4">
                    <Button
                      type="button"
                      size="sm"
                      variant="neutral"
                      onClick={() => setShowAll(false)}
                    >
                      Show less
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
