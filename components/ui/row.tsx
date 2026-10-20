import { cn } from "@/lib/utils";

/**
 * A list row: the unit most of the home page is built from.
 *
 * Pulled out into the gutter by its own padding, so the tint that appears on
 * hover and focus reaches past the text edge while the text itself stays
 * aligned with everything else in the column. The row is one target: give the
 * primary link inside it `stretched-link` and the whole row responds.
 */
export const rowClass =
  "group/row relative -mx-3 grid items-center gap-x-4 rounded-lg px-3 py-3 transition-colors duration-150 hover:bg-tint has-[:focus-visible]:bg-tint sm:gap-x-5";

/** The title inside a row. */
export const rowTitleClass =
  "text-ink text-[0.9375rem] font-medium text-pretty";

/** The line under a row's title. */
export const rowDescriptionClass = "text-ink-soft mt-0.5 text-sm text-pretty";

/** Mono metadata at the end of a row: a date, a year, a reading time. */
export const rowMetaClass =
  "text-ink-faint text-xs whitespace-nowrap tabular-nums";

/**
 * The small action chip at the end of a row ("Behance ↗"). Drawn, not a
 * second link: the row's stretched link already covers it, so it stays out
 * of the tab order and the accessibility tree.
 */
export function RowChip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "bg-surface-2 text-ink-soft group-hover/row:text-ink text-xs inline-flex items-center gap-1 rounded-md px-2 py-1 transition-colors",
        className,
      )}
    >
      {children}
    </span>
  );
}
