/**
 * The page's two widths.
 *
 * The reading column holds every line of text; the wide track is what media
 * is allowed to break out to on a case study or an article. Both are published
 * onto the document by `app/layout.tsx` as `--reading-max` and `--wide-max`,
 * which is what the `page-grid` utility in globals.css reads, and the image
 * `sizes` hints below are derived from the same numbers. Change one here and
 * the layout and the hints move together.
 *
 * 46rem is 736px: body copy at 16px lands near 80 characters a line, and the
 * work thumbnails still get a generous 16:9 frame.
 */
export const READING_MAX_REM = 46;

/** 68rem is 1088px: room for a hero or a gallery without a full bleed. */
export const WIDE_MAX_REM = 68;

const READING_MAX_PX = READING_MAX_REM * 16;
const WIDE_MAX_PX = WIDE_MAX_REM * 16;

/**
 * The reading column, for pages and blocks that do not use `page-grid`: the
 * nav, the footer, the skeletons.
 *
 * `box-content` so the cap applies to the content box and the gutter is
 * extra, which keeps the text edge identical to the `page-grid` content track
 * at every width.
 */
export const columnClass =
  "mx-auto box-content w-auto max-w-(--reading-max) px-5 sm:px-8";

/** The same, at the wide track's width. */
export const wideClass =
  "mx-auto box-content w-auto max-w-(--wide-max) px-5 sm:px-8";

/**
 * Where a two-up layout is allowed to start. At `md` the column is already
 * ~700px, so each half clears 330px.
 */
export const splitGrid = "grid grid-cols-1 md:grid-cols-2";

/**
 * The viewport width at which each cap starts binding: the cap plus the
 * 2rem gutter on both sides.
 */
const READING_BINDS_AT_PX = READING_MAX_PX + 64;
const WIDE_BINDS_AT_PX = WIDE_MAX_PX + 64;

/**
 * `sizes` hints, derived rather than measured by hand.
 *
 * `sizes` is read by the preload scanner before any stylesheet applies, so it
 * cannot see a custom property. It accepts lengths and viewport units, which
 * is why real numbers have to appear in the markup at all. Too small and the
 * image is soft; too large and the reader pays for pixels the box never shows.
 */
function cappedSizes(capPx: number, bindsAtPx: number) {
  return `(min-width: ${bindsAtPx}px) ${capPx}px, calc(100vw - 2.5rem)`;
}

export const imageSizes = {
  /** A block spanning the reading column: cards, article figures. */
  content: cappedSizes(READING_MAX_PX, READING_BINDS_AT_PX),

  /** A block breaking out to the wide track: heroes, galleries. */
  wide: cappedSizes(WIDE_MAX_PX, WIDE_BINDS_AT_PX),

  /** Half of the wide track, for two-up media rows. */
  wideHalf: `(min-width: ${WIDE_BINDS_AT_PX}px) ${Math.round(WIDE_MAX_PX / 2)}px, (min-width: 768px) 48vw, calc(100vw - 2.5rem)`,

  /** Half of the reading column. */
  contentHalf: `(min-width: ${READING_BINDS_AT_PX}px) ${Math.round(READING_MAX_PX / 2)}px, (min-width: 768px) 48vw, calc(100vw - 2.5rem)`,

  /** The thumbnail in a list row: a fixed 8rem (6rem on a phone). */
  rowThumb: "(min-width: 640px) 128px, 96px",

  /** The portrait in the masthead: a fixed 6rem (5rem on a phone). */
  profilePhoto: "(min-width: 640px) 96px, 80px",
} as const;

/**
 * An image's own aspect ratio, as a CSS value.
 *
 * Thumbnails take the shape of the picture they hold instead of a fixed
 * frame, so nothing is ever cropped out of a cover: a 16:9 shot stays 16:9,
 * a wide banner stays wide.
 */
export function ratioOf(image: { width: number; height: number }) {
  return `${image.width} / ${image.height}`;
}
