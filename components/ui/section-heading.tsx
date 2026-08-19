import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: string;
  /** Optional second line, for sections that need a word of explanation. */
  description?: string;
  className?: string;
};

/**
 * The header that opens every section.
 *
 * Rendered inside an `AccordionTrigger`, which itself sits inside the
 * accordion's heading element, so this contributes no heading and nothing
 * focusable of its own. The trigger owns both the semantics and the
 * interaction.
 */
export function SectionHeading({
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <span className={cn("flex w-full flex-col gap-1", className)}>
      {/* Weight is set here rather than inherited from the trigger's
          `font-medium`, so the title reads the same wherever it is used and
          matches the card titles it sits above. */}
      <span className="text-brand-text text-xl font-semibold md:text-2xl">
        {title}
      </span>

      {description && (
        <span className="text-ink-soft text-sm font-normal">{description}</span>
      )}
    </span>
  );
}
