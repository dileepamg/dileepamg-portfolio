import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: string;
  /** Optional second line, for sections that need a word of explanation. */
  description?: string;
  /** A trailing link, such as "View all articles". */
  action?: React.ReactNode;
  id?: string;
  className?: string;
};

/**
 * The header that opens every section.
 *
 * A real title, sized and weighted to be unmistakable while scanning, one
 * step below the name in the masthead.
 */
export function SectionHeading({
  title,
  description,
  action,
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn("mb-7 flex items-end justify-between gap-6", className)}
    >
      <div className="min-w-0">
        <h2
          id={id}
          className="text-ink text-[1.25rem] leading-tight font-semibold tracking-[-0.015em] sm:text-[1.375rem]"
        >
          {title}
        </h2>
        {description && (
          <p className="text-ink-soft mt-1.5 text-[0.9375rem] text-pretty">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 pb-1 text-sm">{action}</div>}
    </div>
  );
}

/**
 * A standalone link in the accent colour: "View all", "View more on
 * Behance", the way back. Inline links in prose use `inlineLink` instead.
 */
export const accentLinkClass =
  "text-brand-text decoration-brand-text/40 hover:decoration-brand-text inline-flex items-center gap-1 font-medium underline-offset-4 transition-colors hover:underline";
