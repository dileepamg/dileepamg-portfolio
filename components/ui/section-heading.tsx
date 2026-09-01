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
 * A real `h2`, so the page has one heading level per level of structure: the
 * name is the `h1`, each section is an `h2`, and the cards inside them are
 * `h3`. It used to render spans because it sat inside an `AccordionTrigger`
 * that owned the heading semantics; with the accordions gone it owns them
 * itself.
 */
export function SectionHeading({
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <h2 className="text-brand-text text-2xl font-semibold md:text-3xl">
        {title}
      </h2>

      {description && (
        <p className="text-ink-soft mt-1 text-sm font-normal text-pretty">
          {description}
        </p>
      )}
    </div>
  );
}
