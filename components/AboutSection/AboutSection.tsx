import ProfileLanyard from "@/components/AboutSection/ProfileLanyard";
import { ExternalLink } from "@/components/ExternalLink";
import { Button } from "@/components/ui/button";
import WelcomeText from "@/components/WelcomeText";
import { resolveSocialIcon } from "@/lib/social-icons";
import type { StaticImageData } from "next/image";
import {
  LuCalendarDays,
  LuDownload,
} from "react-icons/lu";

type Social = {
  href: string;
  label: string;
  external: boolean;
};

type AboutSectionProps = {
  name: string;
  jobTitle: string;
  bio: string;
  scheduleUrl: string;
  resumeDownloadName: string;
  greetingLatin: string;
  greetingSinhala: string;
  socials: readonly Social[];
  lanyardFront?: StaticImageData;
  lanyardBack?: StaticImageData;
};

export default function AboutSection({
  name,
  jobTitle,
  bio,
  scheduleUrl,
  resumeDownloadName,
  greetingLatin,
  greetingSinhala,
  socials,
  lanyardFront,
  lanyardBack,
}: AboutSectionProps) {
  const [bioBeforeAi, bioAfterAi] = bio.split("AI-assisted");

  return (
    <section id="about" className="scroll-mt-28 align-top">
      {/* The badge hangs above the text until the column can hold both side by
          side, which is `xl` rather than the `lg` every other split on the
          site waits for. At `lg` the column is ~642px: the badge needs ~380 of
          that to have room to swing, and 260px is not a text column. The badge
          is wider than the portrait it replaces because its size is set by the
          canvas height, and the canvas has to be tall enough for a strap. */}
      <div className="flex flex-col items-start justify-between gap-8 xl:flex-row">
        {/* `min-w-0` is what lets this actually shrink: a flex item defaults
            to `min-width: auto`, which refuses to go below its content's
            intrinsic width and pushes the overflow onto the page instead. */}
        <div className="order-2 min-w-0 flex-1 xl:order-1">
          <h1 className="text-3xl md:text-4xl">{name}</h1>
          <p className="text-brand-text mt-1 text-xl font-medium md:text-2xl">
            {jobTitle}
          </p>
          <p className="text-ink-soft mt-4 text-base text-pretty break-words md:mt-8">
            <WelcomeText
              latin={greetingLatin}
              sinhala={greetingSinhala}
            />{" "}
            🙏 {bioBeforeAi}
            {bioAfterAi !== undefined && (
              <>
                <span className="whitespace-nowrap">AI-assisted</span>
                {bioAfterAi}
              </>
            )}
          </p>

          <div className="flex flex-row flex-wrap gap-4 py-4">
            <Button asChild variant="outline">
              {/* A plain anchor, not `Link`: this points at a file rather than
                  a route, and the client router has no page to navigate to.
                  The explicit `download` filename matters because the href is
                  the tidy /resume alias, which would otherwise be saved as a
                  file called "resume" with no extension. */}
              <a href="/resume" download={resumeDownloadName}>
                <LuDownload data-icon="inline-start" /> Download Resume
              </a>
            </Button>

            <Button asChild>
              <a
                href={scheduleUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LuCalendarDays data-icon="inline-start" /> Schedule a Call
              </a>
            </Button>
          </div>

          {/* Rounded by default and squaring off on hover, the inverse of
              every other button, so the row reads as a set apart from the
              page's actions rather than as more of them. */}
          <div className="mt-6 flex w-fit justify-start gap-3">
            {socials.map(({ href, label, external }) => {
              const Icon = resolveSocialIcon(href, label);

              return (
                <Button
                  key={href}
                  asChild
                  variant="outline"
                  size="icon"
                  shape="pill"
                >
                  {external ? (
                    <ExternalLink
                      href={href}
                      aria-label={`${label} (opens in new tab)`}
                    >
                      <Icon className="size-5" />
                    </ExternalLink>
                  ) : (
                    <a href={href} aria-label={label}>
                      <Icon className="size-5" />
                    </a>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Reserves the badge's space in the row, and marks where it hangs.
            Nothing is drawn in here: a badge on a string swings, and any box
            it was rendered inside would shear the strap off at the edge the
            moment it did — a bigger box only moves the edge. So the canvas is
            pinned to the viewport instead and reads this element's position
            every frame, leaving the strap free to travel anywhere on screen.

            That layer sits at `z-40`: above the paper, the rules and every
            section it passes over, under only the nav at `z-50`. It is inert
            until the pointer is actually over the card, so covering the page
            with it costs the page nothing. */}
        <div className="relative order-1 h-[300px] w-full shrink-0 sm:h-[350px] xl:order-2 xl:h-auto xl:min-h-[375px] xl:w-[380px] xl:self-stretch">
          <ProfileLanyard
            frontImage={lanyardFront}
            backImage={lanyardBack}
          />
        </div>
      </div>
    </section>
  );
}
