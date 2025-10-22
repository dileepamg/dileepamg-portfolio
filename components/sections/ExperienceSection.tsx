import ExperienceCard from "@/components/ExperienceCard";
import { experiences } from "@/data/experiences";

export default function ExperienceSection() {
  return (
    <section className="shadow-shadow mx-auto my-4 rounded-lg border-2 bg-white">
      {experiences.map((exp) => (
        <ExperienceCard key={exp.company} {...exp} />
      ))}
    </section>
  );
}
