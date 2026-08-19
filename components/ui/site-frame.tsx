import { columnClass } from "@/lib/layout";
import { cn } from "@/lib/utils";

/**
 * The page frame.
 *
 * Across the viewport: quiet surface, a fixed-width hatched margin, the paper
 * reading column, then the same in reverse. Keeping the hatch to a band rather
 * than letting it fill everything outside the column is what stops the texture
 * from reading as wallpaper. It marks the edge of the page and nothing else.
 *
 * Every vertical rule belongs to a margin, never to the column. Giving both
 * the margin and the column a border would stack two 1px lines at the same
 * position and render as one heavy 2px rule, and a rule drawn on the column
 * would sit behind the bands' opaque backgrounds and disappear.
 *
 * Below `sm` there is not enough room either side for a 40px margin, so the
 * margins collapse to zero width and contribute a single rule each, so the
 * column stays ruled without the hatch crowding it.
 *
 * Drawn as a fixed layer behind the content rather than as a wrapper around
 * it, so the column runs the full height of the viewport whatever the page is
 * doing and the sheet stays continuous down to the footer.
 */
export function SiteFrame() {
  const gutter = "bg-hatch border-rule w-0 shrink-0 sm:w-gutter sm:border-x";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 flex justify-center"
    >
      <div className="flex-1" />
      <div className={cn(gutter, "border-r")} />
      <div className={cn(columnClass, "bg-paper shrink-0")} />
      <div className={cn(gutter, "border-l")} />
      <div className="flex-1" />
    </div>
  );
}
