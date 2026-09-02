import { CopyEmail } from "@/components/CopyEmail";
import { ExternalLink } from "@/components/ExternalLink";
import WelcomeText from "@/components/WelcomeText";
import { Button } from "@/components/ui/button";
import { imageSizes } from "@/lib/layout";
import { inlineLink } from "@/lib/link-styles";
import { cn } from "@/lib/utils";
import Image, { type StaticImageData } from "next/image";
import { LuDownload } from "react-icons/lu";

type Social = {
  href: string;
  label: string;
  external: boolean;
};

type AboutSectionProps = {
  name: string;
  bio: string;
  resumeDownloadName: string;
  greetingLatin: string;
  greetingSinhala: string;
  socials: readonly Social[];
  profileImage?: StaticImageData;
  profileImageAlt?: string;
};

/**
 * Finds one social by its label.
 *
 * The copy around these links names them individually, so they are looked up
 * rather than mapped over: naming LinkedIn in a sentence and then rendering
 * whatever happens to sit first in the array would drift apart the moment the
 * list is reordered in Studio.
 */
function findSocial(socials: readonly Social[], label: string) {
  return socials.find(
    (social) => social.label.toLowerCase() === label.toLowerCase(),
  );
}

/**
 * A hairline at the top of a band, drawn all the way across the viewport.
 *
 * A 200vw bar pulled back by 100vw rather than a border, the same way `Band`
 * draws the section dividers: a border would stop at the reading column and
 * the rules would read as five separate boxes instead of one ruled grid.
 * `overflow-x-clip` on html and body keeps the overhang off the scrollbar.
 *
 * Every band carries one. Cells sharing a grid row put their bars at the same
 * y, so the duplicates land exactly on top of each other and read as the one
 * line running the width of the page.
 */
const bandRule =
  "relative before:bg-rule before:absolute before:top-0 before:left-[-100vw] before:h-px before:w-[200vw]";

/**
 * The gap between one row of the grid and the next.
 *
 * It lives at the top of a band rather than in a `gap-y` on the grid, because
 * a row gap would open daylight between an element and the rule drawn under
 * it. Put above the annotation instead, the space reads as air before the
 * next row starts, and every rule still lands flush on the thing it bounds.
 */
const rowGap = "pt-6";

/**
 * The class list above an element, sitting in a band of its own.
 *
 * Set and drawn as the real class names, lower case and unaltered, so what is
 * on screen is what is in the file. Responsive variants are left out: they
 * describe a width the reader is probably not at, and the point is to name
 * the treatment, not to reprint the source.
 *
 * It rests on the rule beneath it: no bottom padding, and leading tight
 * enough that the half-leading under the last line is a pixel or so rather
 * than a visible gap.
 *
 * `justify-end` is what makes "rests on the rule" true in every case. A label
 * that fits on one line while something else in its row runs to two would
 * otherwise stretch and leave a line of slack under itself. Pushed to the
 * bottom of the band, it lands on the rule either way.
 *
 * `aria-hidden`, because read aloud it is a string of class names in front of
 * every heading and sentence. Nothing here is content a reader needs, and the
 * elements underneath already carry the semantics.
 */
function Label({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        bandRule,
        rowGap,
        "flex flex-col justify-end pb-0",
        className,
      )}
    >
      <p
        aria-hidden="true"
        className="text-ink/25 dark:text-ink/30 font-mono text-xs leading-[1.3] break-words"
      >
        {children}
      </p>
    </div>
  );
}

/**
 * The band an annotated element sits in.
 *
 * No padding at all, in any direction. The rules are meant to close onto the
 * element the way they do on the reference: the only space between a line and
 * the type under it is that type's own half-leading. Every bit of air in the
 * grid belongs to `rowGap`, above the annotation that opens the next row.
 */
function Cell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(bandRule, className)}>{children}</div>;
}

export default function AboutSection({
  name,
  bio,
  resumeDownloadName,
  greetingLatin,
  greetingSinhala,
  socials,
  profileImage,
  profileImageAlt,
}: AboutSectionProps) {
  const linkedin = findSocial(socials, "LinkedIn");
  const behance = findSocial(socials, "Behance");
  const email = findSocial(socials, "Email");

  return (
    <section id="about" className="scroll-mt-28">
      {/* One rail of type, ruled like a spec sheet, with a face beside it.
          Everything that reads is a single column now: name, role, lead,
          contact and the one control, each in a band of its own so each can
          carry its own annotation. Only the photo sits out of that stack.

          The bands are grid rows rather than boxes inside a cell. That is
          what lets the rules run continuously: a row is one track shared by
          both columns, so a bar drawn at its top edge is at the same height
          on either side of the gutter instead of breaking at it.

          `gap-y-0`, and no padding inside a band. The space between rows is
          the annotation's `rowGap` and nothing else, so every element closes
          right onto the lines above and below it.

          The two tracks are tuned against each other, because at this column
          width they are genuinely competing.

          The photo needs a rail of a stated width rather than the leftover.
          It has to be square while still meeting the rules above and below
          it, so its width follows its height — and its height comes from rows
          the type column sizes. Sharing a flexible track, the two would bid
          against each other without settling: a wider photo squeezes the
          text, which needs another line, which makes the photo taller, which
          makes it wider again. A stated rail ends that in one pass.

          Which leaves one sum, and it comes out exact: 37.5rem of type, a
          4rem gutter and a 10.5rem rail is 832px — `CONTENT_PX` in layout.ts,
          the content box at the column's cap. Exact matters for more than
          tidiness: the tracks fill the box with nothing left over, so the
          rail ends where the content box ends, the same `px-8` in from the
          paper as the first character of every line on the left.

          The rail is half a rem wider than the 10rem square it holds, and
          the cell spends that on `pr-1`. The frame is tilted, and a rotated
          box paints outside the box it occupies: at 3° a 160px square throws
          its corner about 4px past its own edge. Without the inset the flat
          edges would measure 32px from the paper and the corner 28px, which
          is what reads as the photo sitting closer to the edge than the text
          does. With it, the corner is what lands on 32px.

          Only two of the three numbers are really free. Three lines of the
          lead stand about 160px tall, and a square is as wide as it is tall,
          so the rail is set by the type rather than chosen; the gutter is
          then whatever is left, which is why it is 4rem rather than a figure
          picked for its own sake. And the measure has a floor as well as a
          ceiling: at 36rem this sentence took a fourth line and at 38rem it
          did not, so the wrap is somewhere in between and 37.5rem sits just
          above it. That is the end of the road for narrowing — anything
          shorter wants a shorter bio, not a narrower column.

          The photo gives way rather than the page, if it ever comes to that.
          A longer bio means a fourth line, taller rows, and a frame that
          stays inside the rail and simply gets taller — a rectangle again,
          but never an overflow.

          That last part needs `min-w-0` on the frame and does not come for
          free. A flex item's `min-width: auto` resolves to a content-based
          minimum, and for a box with an aspect ratio and a definite height
          that minimum is the *transferred size suggestion*: the height put
          through the ratio. Which is exactly the square's width. So the
          frame is pinned at whatever width its height implies, cannot be
          shrunk by the rail, and overflows it instead. */}
      <div className="grid gap-x-16 gap-y-0 lg:grid-cols-[minmax(0,37.5rem)_10.5rem]">
        {/* ---- The name ------------------------------------------------- */}
        {/* No rule above this one: the section opens on the label, and a bar
            across the top would read as a divider from whatever happens to
            sit above rather than as part of this grid.

            No `font-semibold` or `text-balance` in the annotation, even though
            both are in force: globals.css applies them to every h1-h6 in the
            base layer, so naming them here would be announcing classes the
            markup does not carry. */}
        <Label className="order-2 before:hidden lg:order-none lg:col-start-1 lg:row-start-1">
          text-2xl text-brand-text
        </Label>
        <Cell className="order-3 lg:order-none lg:col-start-1 lg:row-start-2">
          <h1 className="text-brand-text text-2xl md:text-3xl">{name}</h1>
        </Cell>

        {/* ---- The lead sentence ---------------------------------------- */}
        {/* The job title used to sit in a band here, between the name and
            this. It still reaches the Person markup from `layout.tsx`, so
            search results keep it; the page just does not repeat in a label
            what the sentence below says in its own words. */}
        <Label className="order-4 lg:order-none lg:col-start-1 lg:row-start-3">
          text-lg text-ink text-pretty
        </Label>
        <Cell className="order-5 min-w-0 lg:order-none lg:col-start-1 lg:row-start-4">
          <p className="text-ink text-lg text-pretty break-words md:text-xl">
            <WelcomeText latin={greetingLatin} sinhala={greetingSinhala} /> 🙏{" "}
            {bio}
          </p>
        </Cell>

        {/* ---- The contact lines ---------------------------------------- */}
        <Label className="order-6 lg:order-none lg:col-start-1 lg:row-start-5">
          text-sm text-ink
        </Label>
        <Cell className="order-7 min-w-0 lg:order-none lg:col-start-1 lg:row-start-6">
          {/* One paragraph that breaks into two lines at `lg`. On a phone the
              column is narrow enough that the first sentence wraps, and a
              second paragraph under it left "email." stranded on a line of
              its own; running the sentences together fills that line instead.
              The spans become blocks once there is room for a line each. */}
          <p className="text-ink text-sm text-pretty">
            {(linkedin || email) && (
              <span className="lg:block">
                You can find me on{" "}
                {linkedin && (
                  <ExternalLink
                    href={linkedin.href}
                    aria-label={`${linkedin.label} (opens in new tab)`}
                    className={inlineLink}
                  >
                    {linkedin.label}
                  </ExternalLink>
                )}
                {linkedin && email && " or reach me via "}
                {email && (
                  <CopyEmail
                    email={email.href.replace(/^mailto:/i, "")}
                    className={inlineLink}
                  >
                    email
                  </CopyEmail>
                )}
                .
              </span>
            )}{" "}
            {behance && (
              <span className="lg:mt-1 lg:block">
                Check out more of my work on{" "}
                <ExternalLink
                  href={behance.href}
                  aria-label={`${behance.label} (opens in new tab)`}
                  className={inlineLink}
                >
                  {behance.label}
                </ExternalLink>
                .
              </span>
            )}
          </p>
        </Cell>

        {/* ---- The one thing to click ----------------------------------- */}
        {/* A band of nothing but air, and the reason the button has a rule of
            its own directly above it.

            Every other row gets its space from `rowGap` at the top of an
            annotation, where a rule sitting above the padding still reads as
            the line closing the row before it. The button has no annotation,
            so padding at the top of its band would leave its rule 24px up,
            hard against the contact lines and nowhere near the button. Giving
            the space a band of its own puts a rule at each end of it: one
            closing the contact lines, one opening the button. */}
        <div
          aria-hidden="true"
          className={cn(
            bandRule,
            // Same height as `rowGap`, since it is the same gap.
            "order-8 h-6 lg:order-none lg:col-start-1 lg:row-start-7",
          )}
        />

        {/* A plain anchor, not `Link`: this points at a file rather than a
            route, and the client router has no page to navigate to. The
            explicit `download` filename matters because the href is the tidy
            /resume alias, which would otherwise be saved as a file called
            "resume" with no extension.

            The default variant, so the one action on the page is the accent
            rather than another outline in a column of hairlines.

            Unlabelled: annotating a control would mean naming a variant
            instead of a treatment. No padding either, so the rules close onto
            it top and bottom exactly the way they close onto the type.

            `after:` closes the grid the way every `bandRule` opens a band, so
            the last row is ruled underneath like the rest. `items-end` is
            what keeps the button on that rule if anything ever stretches the
            row taller than the control. */}
        <div
          className={cn(
            bandRule,
            "order-9 flex items-end lg:order-none lg:col-start-1 lg:row-start-8",
            "after:bg-rule after:absolute after:bottom-0 after:left-[-100vw] after:h-px after:w-[200vw]",
          )}
        >
          <Button asChild className="w-fit">
            <a href="/resume" download={resumeDownloadName}>
              <LuDownload data-icon="inline-start" />
              Download resume
            </a>
          </Button>
        </div>

        {/* Tilted a few degrees, like a photo dropped on the page rather than
            placed in a slot, and straightening when you point at it.

            The guides are children of the box that turns, so they travel with
            it rather than having to be kept in sync by a second transform.
            They sit a little outside each edge and run past the corners,
            fading at both ends, so they read as registration marks against
            the page grid instead of as a second border.

            Under `prefers-reduced-motion` the frame is simply straight: the
            tilt is the whole effect, so removing only the transition would
            leave it snapping between two angles on hover.

            Unruled and unlabelled: a rule of its own would cut across the
            lines the rows already draw, and it carries its own registration
            guides in the same language.

            At `lg` it runs between two rules — the one opening the name and
            the one closing the lead sentence — and fills that range exactly,
            so both lines land on an edge instead of crossing near it. It sits
            out the annotation band above the name, which is why it starts on
            a line rather than at the top of the section.

            That makes it a portrait rectangle rather than a square, taller or
            shorter as the bio gains or loses a line: the alignment is the
            point, and `object-cover` crops to whatever height the rules hand
            it. Only the width is fixed — a box taking its height from the row
            would have to get its width back from that height, in a column the
            row is itself waiting on.

            Stacked above the type below `lg`, it starts on the same left edge
            the type does. The guides reach about 24px past the frame and so
            overhang into the column's own padding, but they are gradients that
            have faded out well before their ends, so what actually overhangs
            is invisible — and buying that clearance with an indent would
            misalign the one thing in the stack with a hard edge. At `lg` the
            column's own `px-8` provides it instead.

            `justify-end` on the flex box, never `justify-self-end` on the
            grid item. The two look interchangeable and are not: aligning the
            item shrinks it to fit-content, and fit-content is measured from
            intrinsic contributions, where `h-full` is indefinite and
            `aspect-square` therefore yields no width at all. The cell
            collapses to nothing and the frame paints out of its right side by
            a full rail's width. Left to stretch, the cell is the rail, the
            frame's height resolves against a real box, and the flex alignment
            moves it inside that box rather than sizing it. */}
        {profileImage && (
          <div className="group relative order-1 flex pb-6 lg:order-none lg:col-start-2 lg:row-start-2 lg:row-end-5 lg:justify-end lg:pr-1 lg:pb-0">
            <div className="relative w-28 rotate-3 transition-transform duration-500 ease-out group-hover:rotate-0 motion-reduce:rotate-0 motion-reduce:transition-none sm:w-32 lg:h-full lg:w-auto lg:min-w-0">
              <span
                aria-hidden="true"
                className="guide-x pointer-events-none absolute -inset-x-6 -top-2 h-px"
              />
              <span
                aria-hidden="true"
                className="guide-x pointer-events-none absolute -inset-x-6 -bottom-2 h-px"
              />
              <span
                aria-hidden="true"
                className="guide-y pointer-events-none absolute -inset-y-6 -left-2 w-px"
              />
              <span
                aria-hidden="true"
                className="guide-y pointer-events-none absolute -inset-y-6 -right-2 w-px"
              />

              {/* Square everywhere. Below `lg` the width is stated and the
                  ratio gives the height; at `lg` that reverses — `h-full`
                  takes the height from the rules the row is drawn between and
                  the ratio gives the width back. If the rail is ever too
                  narrow for the square it wants, the frame is a flex item, so
                  it shrinks to a rectangle rather than overflowing. */}
              <div className="border-rule bg-paper relative aspect-square overflow-hidden border shadow-sm lg:h-full lg:w-auto">
                <Image
                  src={profileImage}
                  alt={profileImageAlt ?? name}
                  fill
                  sizes={imageSizes.profilePhoto}
                  priority
                  placeholder="blur"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
