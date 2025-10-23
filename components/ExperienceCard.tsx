"use client";

import { Badge } from "@/components/ui/badge";
import { LuArrowUpRight } from "react-icons/lu";

type ExperienceCardProps = {
  role: string;
  link: string;
  company: string;
  year: string;
  responsibility: readonly string[];
  techStacks: readonly string[];
};

export default function ExperienceCard({
  role,
  link,
  company,
  year,
  responsibility,
  techStacks,
}: ExperienceCardProps) {
  return (
    <div className="p-5">
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="w-full">
          <div className="flex flex-col gap-1 pb-2 align-top md:flex-row md:justify-between">
            <div className="flex flex-col">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${company} (opens in new tab)`}
              >
                <h2 className="flex items-center text-base font-bold hover:underline">
                  {company}
                  <span className="ml-1" aria-hidden="true">
                    <LuArrowUpRight />
                  </span>
                </h2>
              </a>
              <p className="text-[#ff4d50]">{role}</p>
            </div>
            <div className="flex justify-between text-xs font-semibold text-gray-500 md:justify-end md:gap-4">
              <code>{year}</code>
            </div>
          </div>

          <div className="space-y-1 pt-2">
            {responsibility.map((item) => (
              <p key={item} className="text-sm md:text-sm">
                • {item}
              </p>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {techStacks.map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="mb-1 flex justify-center text-center whitespace-nowrap"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
