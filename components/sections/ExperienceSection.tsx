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
    <section id="career" className="scroll-mt-16">
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <h1 className="mb-2 text-3xl md:text-4xl">
              Professional Experience
            </h1>
          </AccordionTrigger>
          <AccordionContent>
            <div className="shadow-shadow bg-whit mx-1 rounded-lg border-2 dark:bg-black">
              {experiences.map((exp) => (
                <ExperienceCard key={exp.company} {...exp} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
