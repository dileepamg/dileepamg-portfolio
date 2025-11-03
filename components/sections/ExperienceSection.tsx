import ExperienceCard from "@/components/ExperienceCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { experiences } from "@/data/experiences";

export default function ExperienceSection() {
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
              <div className="shadow-shadow rounded-lg border-2 bg-white dark:bg-black">
                {experiences.map((exp) => (
                  <ExperienceCard key={exp.company} {...exp} />
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
