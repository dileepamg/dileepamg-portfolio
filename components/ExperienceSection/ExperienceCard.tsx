"use client";

import { ExternalLink } from "@/components/ExternalLink";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { LuArrowUpRight } from "react-icons/lu";
import { type CareerPosition } from "./data";

type ExperienceCardProps = {
  position: CareerPosition;
};

export default function ExperienceCard({ position }: ExperienceCardProps) {
  return (
    <div className="border-rule border-b p-6 last:border-b-0 md:p-8">
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="w-full">
          <div className="flex flex-col items-start gap-1 pb-2 align-top md:justify-between xl:flex-row">
            <div className="flex flex-col gap-3 md:flex-row">
              {/* The box is a fixed 50px at every breakpoint, so `sizes` can
                  say exactly that. Without it a `fill` image is assumed to be
                  100vw wide and the browser fetches the largest candidate in
                  the srcset, which for a logo this size is roughly twenty
                  times the pixels it can show. */}
              <div className="relative m-1 size-[50px] shrink-0">
                <Image
                  src={position.companylogoLight}
                  fill
                  sizes="50px"
                  alt="Company Logo"
                  placeholder="blur"
                  className="object-contain dark:hidden"
                />

                <Image
                  src={position.companyLogoDark}
                  fill
                  sizes="50px"
                  alt="Company Logo"
                  placeholder="blur"
                  className="hidden object-contain dark:block"
                />
              </div>
              <div className="flex flex-col">
                <p className="text-ink text-xl font-semibold">
                  {position.role}
                </p>
                <ExternalLink
                  href={position.link}
                  aria-label={`${position.company} (opens in new tab)`}
                  className="text-ink-soft hover:text-ink w-fit transition-colors"
                >
                  <p className="flex items-center text-base hover:underline">
                    {position.company}
                    <span className="ml-1" aria-hidden="true">
                      <LuArrowUpRight />
                    </span>
                  </p>
                </ExternalLink>
              </div>
            </div>
            <div className="text-ink-faint flex justify-between text-sm font-medium tabular-nums md:justify-end md:gap-4">
              <span>{position.year}</span>
            </div>
          </div>

          <div className="text-ink-soft space-y-1 pt-2">
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
                className="text-ink-faint mb-1 flex justify-center text-center whitespace-nowrap"
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
