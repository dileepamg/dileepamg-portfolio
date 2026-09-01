import { CopyEmail } from "@/components/CopyEmail";
import { ExternalLink } from "@/components/ExternalLink";
import WelcomeText from "@/components/WelcomeText";
import { Button } from "@/components/ui/button";
import { inlineLink } from "@/lib/link-styles";
import Image, { type StaticImageData } from "next/image";
import { LuDownload } from "react-icons/lu";

type Social = {
  href: string;
  label: string;
  external: boolean;
};

type AboutSectionProps = {
  name: string;
  jobTitle: string;
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

export default function AboutSection({
  name,
  jobTitle,
  bio,
  resumeDownloadName,
  greetingLatin,
  greetingSinhala,
  socials,
  profileImage,
  profileImageAlt,
}: AboutSectionProps) {
  // First word on one line, whatever is left on the next.
  const [firstName, ...restOfName] = name.split(" ");
  const nameLines = [firstName, restOfName.join(" ")].filter(Boolean);

  const linkedin = findSocial(socials, "LinkedIn");
  const behance = findSocial(socials, "Behance");
  const email = findSocial(socials, "Email");

  return (
    <section id="about" className="scroll-mt-28">
      {/* Three rails: who, what, and a face.

          The resume button is its own cell rather than part of the identity
          rail, because the two widths want it in different places: under the
          name on a wide screen, and after everything else once the rails
          stack, so a phone reads the whole introduction before it is offered
          a button. Explicit row and column placement at `lg` puts it back
          under the name; `order` handles the stacked case. */}
      {/* Stacked, the gap is the only thing between one block and the next,
          and 2rem of it four times over put the button most of a screen below
          the photo. 1.25rem reads as the same rhythm the two columns get at
          `lg` without the phone paying for a layout it is not using. */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,12rem)_minmax(0,1fr)_auto] lg:grid-rows-[auto_1fr] lg:gap-x-8 lg:gap-y-5">
        {/* The name is set at the section headings' size so the page has one
            display scale rather than a separate one for the person, and broken
            after the first word so it stacks in the rail instead of stretching
            it. */}
        <div className="order-2 lg:order-none lg:col-start-1 lg:row-start-1">
          <h1 className="text-brand-text text-2xl font-semibold md:text-3xl">
            {nameLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="text-ink-soft mt-2 text-sm text-pretty">{jobTitle}</p>
        </div>

        <div className="order-5 lg:order-none lg:col-start-1 lg:row-start-2 lg:self-center">
          {/* A plain anchor, not `Link`: this points at a file rather than a
              route, and the client router has no page to navigate to. The
              explicit `download` filename matters because the href is the
              tidy /resume alias, which would otherwise be saved as a file
              called "resume" with no extension. */}
          <Button asChild variant="outline" className="w-fit">
            <a href="/resume" download={resumeDownloadName}>
              <LuDownload data-icon="inline-start" />
              Download resume
            </a>
          </Button>
        </div>

        {/* The sentence, on row one beside the name. It does not span both
            rows: keeping it to row one is what lets the row boundary fall in
            the same place in both columns, so the resume button and the "find
            me" lines start on the same level rather than the button riding up
            under the job title. */}
        <p className="text-ink order-3 min-w-0 text-lg text-pretty break-words md:text-xl lg:order-none lg:col-start-2 lg:row-start-1">
          <WelcomeText latin={greetingLatin} sinhala={greetingSinhala} /> 🙏{" "}
          {bio}
        </p>

        {/* Centred on the same axis as the button rather than sharing its top
            edge. The two cells are different heights (a 40px control against
            two lines of 14px text), so aligning their boxes leaves the text
            sitting low against the outline. `self-center` on both takes each
            out of the row's stretch and centres it, which puts one midline
            through the pair. */}
        <div className="text-ink-soft order-4 min-w-0 text-sm text-pretty lg:order-none lg:col-start-2 lg:row-start-2 lg:self-center">
          {/* One paragraph that breaks into two lines at `lg`. On a phone the
              column is narrow enough that the first sentence wraps, and a
              second paragraph under it left "email." stranded on a line of its
              own; running the sentences together fills that line instead. The
              spans become blocks once there is room for a line each. */}
          <p>
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

            The tilt and the guides overhang the frame by ~36px on each side,
            which is why the photo read as tighter to the page edge than the
            text does: the box lined up, the visible mark did not. The inset
            below moves the frame in by exactly that overhang, on whichever
            side faces the page edge at that width. */}
        {profileImage && (
          <div className="group order-1 pb-3 pl-9 lg:order-none lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:pt-1 lg:pr-9 lg:pb-0 lg:pl-0">
            <div className="relative w-28 rotate-3 transition-transform duration-500 ease-out group-hover:rotate-0 motion-reduce:rotate-0 motion-reduce:transition-none sm:w-32">
              <span
                aria-hidden="true"
                className="guide-x pointer-events-none absolute -inset-x-8 -top-2 h-px"
              />
              <span
                aria-hidden="true"
                className="guide-x pointer-events-none absolute -inset-x-8 -bottom-2 h-px"
              />
              <span
                aria-hidden="true"
                className="guide-y pointer-events-none absolute -inset-y-8 -left-2 w-px"
              />
              <span
                aria-hidden="true"
                className="guide-y pointer-events-none absolute -inset-y-8 -right-2 w-px"
              />

              <div className="border-rule bg-paper relative aspect-square overflow-hidden border shadow-sm">
                <Image
                  src={profileImage}
                  alt={profileImageAlt ?? name}
                  fill
                  sizes="128px"
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
