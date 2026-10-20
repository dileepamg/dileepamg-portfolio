import { SectionHeading } from "@/components/ui/section-heading";
import type { CareerPosition } from "./data";
import ExperienceCard from "./ExperienceCard";

type ExperienceSectionProps = {
  experiences: readonly CareerPosition[];
  heading?: string;
};

/**
 * The career, as a list a recruiter can read in five seconds.
 *
 * Every role is visible at once as a single line. Only the current one opens
 * by default, so the page shows what is happening now in full and the history
 * as a timeline, with each earlier role a click away.
 */
export default function ExperienceSection({
  experiences,
  heading = "Professional Experience",
}: ExperienceSectionProps) {
  return (
    <section id="experience" aria-labelledby="experience-heading">
      <SectionHeading id="experience-heading" title={heading} />
      <div>
        {experiences.map((exp, index) => (
          <ExperienceCard
            key={`${exp.company}-${exp.role}`}
            position={exp}
            defaultOpen={index === 0}
          />
        ))}
      </div>
    </section>
  );
}
