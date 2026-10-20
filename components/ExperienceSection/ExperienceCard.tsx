import { ExternalLink } from "@/components/ExternalLink";
import { Badge } from "@/components/ui/badge";
import { rowMetaClass } from "@/components/ui/row";
import Image from "next/image";
import { LuArrowUpRight, LuChevronDown } from "react-icons/lu";
import { type CareerPosition } from "./data";

type ExperienceCardProps = {
  position: CareerPosition;
  /** The current role opens by default; the rest stay folded. */
  defaultOpen?: boolean;
};

/**
 * One role, as a row that unfolds.
 *
 * A native `<details>`, so it works before any script has loaded, is keyboard
 * and screen-reader operable for free, and still finds text inside it with
 * the browser's find-in-page. The summary is the scannable part a recruiter
 * reads down: who, where, when. The detail is one click away instead of being
 * clipped behind a fade.
 *
 * The company link lives in the panel rather than in the summary, because a
 * link inside a summary is a control inside a control.
 */
export default function ExperienceCard({
  position,
  defaultOpen = false,
}: ExperienceCardProps) {
  return (
    <details
      open={defaultOpen}
      className="group/exp border-rule border-b last:border-b-0"
    >
      <summary className="hover:bg-tint focus-visible:bg-tint -mx-3 grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-x-4 rounded-lg px-3 py-3.5 transition-colors outline-none sm:grid-cols-[2.25rem_minmax(0,1fr)_auto_auto]">
        <span className="border-hairline relative size-9 shrink-0 overflow-hidden rounded-md border bg-white">
          <Image
            src={position.companylogoLight}
            fill
            sizes="36px"
            alt=""
            placeholder="blur"
            className="object-contain p-1 dark:hidden"
          />
          <Image
            src={position.companyLogoDark}
            fill
            sizes="36px"
            alt=""
            placeholder="blur"
            className="hidden object-contain p-1 dark:block"
          />
        </span>

        <span className="min-w-0">
          <span className="text-ink block text-[0.9375rem] font-medium text-pretty">
            {position.role}
          </span>
          <span className="text-ink-soft block text-sm text-pretty">
            {position.company}
          </span>
          {/* On a phone the dates drop under the company rather than
              squeezing the role into a narrow column. */}
          <span className={`${rowMetaClass} mt-0.5 block sm:hidden`}>
            {position.year}
          </span>
        </span>

        <span className={`${rowMetaClass} hidden sm:block`}>
          {position.year}
        </span>

        <LuChevronDown
          aria-hidden="true"
          className="text-ink-faint size-4 transition-transform duration-300 group-open/exp:rotate-180 motion-reduce:transition-none"
        />
      </summary>

      <div className="pt-1 pb-5 sm:pl-[3.25rem]">
        <ul className="text-ink-soft marker:text-ink-faint list-disc space-y-1.5 pl-4 text-sm text-pretty">
          {position.responsibility.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {position.techStacks.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
          <ExternalLink
            href={position.link}
            className="text-ink-soft hover:text-ink text-xs ml-auto inline-flex items-center gap-0.5 underline-offset-4 transition-colors hover:underline"
          >
            {position.link
              .replace(/^https?:\/\/(www\.)?/, "")
              .replace(/\/$/, "")}
            <LuArrowUpRight className="size-3" aria-hidden="true" />
            <span className="sr-only">(opens in new tab)</span>
          </ExternalLink>
        </div>
      </div>
    </details>
  );
}
