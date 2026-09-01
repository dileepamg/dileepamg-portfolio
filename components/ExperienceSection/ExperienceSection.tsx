"use client";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { useState } from "react";
import type { CareerPosition } from "./data";
import ExperienceCard from "./ExperienceCard";

type ExperienceSectionProps = {
  experiences: readonly CareerPosition[];
  heading?: string;
};

export default function ExperienceSection({
  experiences,
  heading = "Professional Experience",
}: ExperienceSectionProps) {
  const [showAll, setShowAll] = useState(false);
  return (
    <section id="experience" className="scroll-mt-28">
      <SectionHeading title={heading} />

      <div className="mt-6">
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
                Show all
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
    </section>
  );
}
