"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { useState } from "react";
import { experiences } from "./data";
import ExperienceCard from "./ExperienceCard";

export default function ExperienceSection() {
  const [showAll, setShowAll] = useState(false);
  return (
    <section id="experience" className="scroll-mt-28">
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="pt-0 transition-opacity hover:opacity-70 [&>svg]:size-6">
            <SectionHeading title="Professional Experience" />
          </AccordionTrigger>
          <AccordionContent>
            <div className="pb-4">
              <div className="border-rule bg-paper relative border">
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
                  <div className="from-paper via-paper pointer-events-none absolute inset-x-0 bottom-0 z-10 mx-1 flex justify-center bg-gradient-to-t to-transparent pt-20 pb-5">
                    <Button
                      type="button"
                      variant="outline"
                      className="pointer-events-auto px-4"
                      onClick={() => setShowAll(true)}
                    >
                      Show All
                    </Button>
                  </div>
                )}

                {showAll && (
                  <div className="border-rule flex justify-center border-t py-4">
                    <Button
                      type="button"
                      variant="outline"
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
