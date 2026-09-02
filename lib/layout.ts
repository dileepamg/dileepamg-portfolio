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
 */
export const columnClass = "w-[90%] max-w-(--reading-max) sm:w-[70%]";

/**
 * How wide the column is allowed to get, in rem.
 *
 * The one number. `app/layout.tsx` publishes it as `--reading-max` on the
 * document, which is what `columnClass` above and the frame rails read, and
 * the `imageSizes` helpers below derive every `sizes` hint from it. Change it
 * here and the whole page follows.
 *
 * At 56rem the content box is 832px, which keeps body copy near 90 characters
 * a line rather than 105, and still leaves the two-up panels ~404px a side
 * against the ~300px floor `splitGrid` sets below.
 */
export const READING_MAX_REM = 56;

/** The column at its widest, in CSS pixels. */
const READING_MAX_PX = READING_MAX_REM * 16;

/**
 * Inset from the column's vertical rules.
 *
 * Applied inside each band rather than to the column itself, so a band's
 * divider and its corner crosses still reach the rules while the text keeps
 * clear of them.
 */
export const columnPadding = "px-5 md:px-8";

/** What `columnPadding` costs at `md` and up: px-8 on both sides. */
const COLUMN_INSET_PX = 64;

/** The widest a full-bleed block inside a band ever gets. */
const CONTENT_PX = READING_MAX_PX - COLUMN_INSET_PX;

/**
 * The viewport width at which the cap starts binding.
 *
 * Below it the column is 70vw and grows with the window; above it the column
 * is stuck at `READING_MAX_PX`, so this is where a `sizes` hint has to stop
 * quoting a percentage and start quoting a fixed width.
 */
const CAP_BINDS_AT_PX = Math.round(READING_MAX_PX / 0.7);

/**
 * The portrait frame in the About block: `w-28`, then `sm:w-32`.
 *
 * Tailwind's spacing scale is 0.25rem a step, so the class number times four
 * is the pixel width. Written that way rather than as 112 and 128 so the
 * classes and these numbers are visibly the same statement.
 */
const TAILWIND_SPACING_PX = 4;
const PHOTO_PX = 28 * TAILWIND_SPACING_PX;
const PHOTO_SM_PX = 32 * TAILWIND_SPACING_PX;

/**
 * How wide the portrait is *drawn* at `lg`.
 *
 * There the frame stops being a stated width: it takes its height from the
 * three grid rows it spans and its ratio gives the width back. Its rail caps
 * that at 160px, so at the reading column's own cap it is a 160px square.
 *
 * The number here is larger than 160 because `object-cover` paints at the
 * box's *larger* side and crops the other. Below the column's cap the rows
 * run taller — the same copy needs more lines in a narrower measure — and the
 * frame gives up its square and grows to about 190px tall while staying 160
 * wide. The picture is then painted 190px across and cropped back, so that,
 * and not the rail, is what has to be asked for.
 *
 * The one number here that cannot be derived, because the rows are sized by
 * the type in them. Rounded up on purpose: over-quoting costs a few kilobytes,
 * under-quoting costs sharpness, and the rows grow if the bio gains a line.
 */
const PHOTO_DRAWN_AT_LG_PX = 224;

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

/**
 * `sizes` hints, derived rather than measured by hand.
 *
 * `sizes` is read by the browser's preload scanner before any stylesheet has
 * been applied, so it cannot see `var(--reading-max)` or the width of the box
 * the image will land in. It accepts lengths and viewport units and nothing
 * else, which is why real pixel numbers have to appear in the markup at all.
 *
 * What that does not justify is arithmetic copied into five files. Each entry
 * below states its own geometry once, in terms of the constants above, so a
 * change to `READING_MAX_REM` moves every hint with it. Getting these wrong
 * costs bandwidth rather than layout: too small and the image is upscaled and
 * soft, too large and the reader pays for pixels the box never shows.
 */
function cappedSizes(widthPx: number, belowCapVw: number, mobileVw: number) {
  return (
    `(min-width: ${CAP_BINDS_AT_PX}px) ${Math.round(widthPx)}px, ` +
    `(min-width: 640px) ${belowCapVw}vw, ${mobileVw}vw`
  );
}

export const imageSizes = {
  /** A block spanning the whole content box: case study media, blog figures. */
  content: cappedSizes(CONTENT_PX, 66, 90),

  /**
   * The media half of a case study card. The card fills the content box and
   * carries `md:p-8`, and the media is `lg:w-1/2` of what is left.
   *
   * The `lg:gap-8` between the halves is deliberately not subtracted here.
   * `w-1/2` is half the flex container's content box, gap included, so the
   * gap comes out of the flexible half beside it rather than out of this one.
   */
  caseStudyCard:
    `(min-width: ${CAP_BINDS_AT_PX}px) ` +
    `${Math.round((CONTENT_PX - COLUMN_INSET_PX) / 2)}px, ` +
    `(min-width: 1024px) 33vw, 90vw`,

  /**
   * The thumbnail in a project card: one column of the two-up `splitGrid`
   * (separated by a `gap-8`), then inside the card's own `md:p-8`.
   */
  projectCard:
    `(min-width: ${CAP_BINDS_AT_PX}px) ` +
    `${Math.round((CONTENT_PX - 32) / 2 - COLUMN_INSET_PX)}px, ` +
    `(min-width: 1024px) 28vw, (min-width: 640px) 58vw, 82vw`,

  /**
   * The portrait in the About block, one entry per width the frame has.
   *
   * The only hint here quoted in real pixels at every breakpoint rather than
   * falling back to `vw`. The others describe a box that is a fraction of the
   * viewport until the column caps; this frame is a stated width at every
   * size, so a percentage would be a guess that happens to be right at one
   * window and wrong either side of it.
   */
  profilePhoto:
    `(min-width: 1024px) ${PHOTO_DRAWN_AT_LG_PX}px, ` +
    `(min-width: 640px) ${PHOTO_SM_PX}px, ${PHOTO_PX}px`,
} as const;
