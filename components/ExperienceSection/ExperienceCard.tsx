"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { LuArrowUpRight } from "react-icons/lu";
import { type CareerPosition } from "./data";

type ExperienceCardProps = {
  position: CareerPosition;
};

export default function ExperienceCard({ position }: ExperienceCardProps) {
  return (
    <div className="border-b-2 border-b-gray-300 p-5 last:border-b-0">
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="w-full">
          <div className="flex flex-col items-start gap-1 pb-2 align-top md:justify-between xl:flex-row">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative m-1 h-[50px] w-[50px]">
                <Image
                  src={position.companylogoLight}
                  fill
                  alt="Company Logo"
                  className="object-contain dark:hidden"
                />

                <Image
                  src={position.companyLogoDark}
                  fill
                  alt="Company Logo"
                  className="hidden object-contain dark:block"
                />
              </div>
              <div className="flex flex-col">
                <p className="text-xl font-bold text-[#ff4d50]">
                  {position.role}
                </p>
                <a
                  href={position.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${position.company} (opens in new tab)`}
                >
                  <p className="flex items-center text-base hover:underline">
                    {position.company}
                    <span className="ml-1" aria-hidden="true">
                      <LuArrowUpRight />
                    </span>
                  </p>
                </a>
              </div>
            </div>
            <div className="flex justify-between text-sm font-semibold text-gray-500 md:justify-end md:gap-4">
              <code>{position.year}</code>
            </div>
          </div>

          <div className="space-y-1 pt-2">
            {position.responsibility.map((item) => (
              <p key={item} className="text-sm md:text-sm lg:text-base">
                • {item}
              </p>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {position.techStacks.map((tech) => (
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
