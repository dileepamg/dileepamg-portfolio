import { cn } from "@/lib/utils";

type CrossPosition = "tl" | "tr" | "bl" | "br";

const crossAt: Record<CrossPosition, string> = {
  tl: "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
  tr: "top-0 right-0 translate-x-1/2 -translate-y-1/2",
  bl: "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
  br: "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
};

/**
 * An accent cross marking a corner of a section, where its divider meets the
 * edge of the reading column. Centred on the corner, so the two strokes sit
 * directly over the two rules they join.
 *
 * These are the only accent marks in the page frame, and the cards inside stay
 * unmarked, so the crosses read as the section registration marks rather than
 * as decoration applied to everything.
 */
function RuleCross({ at }: { at: CrossPosition }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute z-20 size-3",
        // Forced margin reset. A caller that puts `space-y-*` on a band is
        // spacing that band's content, but these marks are children of the
        // band too, so they collect the same margin. On a `top-0` mark that
        // is harmless; on a `bottom-0` one the used offset is measured from
        // the margin edge, so it lifts the mark clear off the rule it is
        // meant to sit on. `!` because `space-y-*` would otherwise win on
        // source order at equal specificity.
        "mt-0! mb-0!",
        "before:bg-brand before:absolute before:top-1/2 before:left-0 before:h-px before:w-full",
        "after:bg-brand after:absolute after:top-0 after:left-1/2 after:h-full after:w-px",
        crossAt[at],
      )}
    />
  );
}

type BandProps = {
  children: React.ReactNode;
  /** Off for a band with nothing above it for a divider to separate. */
  topRule?: boolean;
  bottomRule?: boolean;
  /**
   * Corner marks, controllable per edge. Each edge defaults to whether that
   * edge has a rule: a mark records where a divider meets the column, so an
   * edge with no divider has nothing to record. Pass `false` explicitly to
   * drop the marks from an edge that does still carry its rule.
   */
  topCrosses?: boolean;
  bottomCrosses?: boolean;
  className?: string;
};

/**
 * One block of the page.
 *
 * A band is ruled on both edges and carries its own paper background, so the
 * space between two of them is a channel bounded by a line on either side
 * rather than a single shared divider. The parent supplies the hatch that
 * shows through that channel.
 *
 * The rules are 200vw bars pulled back by 100vw rather than borders, so they
 * run out through the hatched margins and off both edges of the viewport, so
 * the page reads as ruled all the way across instead of as a stack of cards
 * that stop at the column. `overflow-x-clip` on the html and body keeps that
 * off the scrollbar.
 */
export function Band({
  children,
  topRule = true,
  bottomRule = true,
  topCrosses = topRule,
  bottomCrosses = bottomRule,
  className,
}: BandProps) {
  return (
    <div
      className={cn(
        "bg-paper relative py-12 md:py-14",
        topRule &&
          "before:bg-rule before:absolute before:top-0 before:left-[-100vw] before:h-px before:w-[200vw]",
        bottomRule &&
          "after:bg-rule after:absolute after:bottom-0 after:left-[-100vw] after:h-px after:w-[200vw]",
        className,
      )}
    >
      {topCrosses && (
        <>
          <RuleCross at="tl" />
          <RuleCross at="tr" />
        </>
      )}
      {bottomCrosses && (
        <>
          <RuleCross at="bl" />
          <RuleCross at="br" />
        </>
      )}
      {children}
    </div>
  );
}
