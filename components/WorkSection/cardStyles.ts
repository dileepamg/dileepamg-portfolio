/**
 * Type styling shared by every card in the Work section.
 *
 * Case studies and Behance projects are different components with different
 * layouts, but they sit in one list and have to read as one set, so the
 * title and description styling lives here rather than being written out
 * twice and drifting apart.
 *
 * `text-pretty` on the title overrides the `text-balance` that globals.css
 * puts on every heading. Balancing is right for a display heading of a few
 * words, where it stops a lone word dropping to a second line. On a card
 * title that runs to three it equalises them instead, leaving the first line
 * short of the edge while the words that would fit sit on the line below.
 */
export const cardTitleClass = "text-lg font-medium text-pretty";

export const cardDescriptionClass = "text-ink-soft mt-2 text-sm text-pretty";
