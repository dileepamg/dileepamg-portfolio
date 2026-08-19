/**
 * The reading column.
 *
 * The frame rails are drawn by a separate fixed layer that has to line up with
 * the content exactly, so both sides read the width from here rather than
 * repeating the breakpoints and drifting apart the first time one is edited.
 *
 * One percentage and a fixed cap, never a ladder of shrinking percentages. A
 * ladder that steps down (70% at `sm`, 60% at `md`, 40% at `2xl`) makes the
 * column narrower as the screen gets wider at every step: at 767px it was 70%
 * of 767 (537px), and at 768px it became 60% of 768 (461px). The layout
 * switches that fire at those same breakpoints all ask for more room at the
 * exact moment there is less of it, which is what broke the tablet range. No
 * decreasing percentage ladder can avoid this; a cap is the only monotonic
 * way to stop the column from growing without bound.
 *
 * `--reading-max` is the one number to change to make the column wider or
 * narrower on large screens.
 */
export const columnClass = "w-[90%] max-w-(--reading-max) sm:w-[70%]";

/**
 * Inset from the column's vertical rules.
 *
 * Applied inside each band rather than to the column itself, so a band's
 * divider and its corner crosses still reach the rules while the text keeps
 * clear of them.
 */
export const columnPadding = "px-5 md:px-8";

/**
 * Where a two-column layout is allowed to start.
 *
 * Tailwind's breakpoints measure the viewport, but content sits in a column
 * that is a fraction of it. At the `md` breakpoint the column holds about
 * 470px, so `md:grid-cols-2` gives each half ~220px and the text is unreadable
 * long before the viewport looks small. Splitting is held back to `lg`, the
 * first breakpoint where each half clears ~300px.
 */
export const splitGrid = "grid grid-cols-1 lg:grid-cols-2";
