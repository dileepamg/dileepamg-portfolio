import { CopyEmail } from "@/components/CopyEmail";
import { DitherScene } from "@/components/Scene/DitherScene";
import { ExternalLink } from "@/components/ExternalLink";
import WelcomeText from "@/components/WelcomeText";
import { Button } from "@/components/ui/button";
import { imageSizes } from "@/lib/layout";
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
  /** The first name the greeting introduces. Falls back to the first word of `name`. */
  givenName?: string;
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
 * The masthead: the beach, a face, a name and one sentence.
 *
 * The order is the order a visitor needs it in. The scene sets the tone
 * without asking to be read; the photo sits on its edge like a profile
 * picture on a cover; the name is set quietly, at the size of the text around
 * it, so the bio and the work carry the page. The contact line and the résumé
 * are the two things anyone hiring will want next, so they sit directly under
 * it rather than at the foot of the page.
 */
export default function AboutSection({
  name,
  givenName,
  bio,
  resumeDownloadName,
  greetingLatin,
  greetingSinhala,
  socials,
  profileImage,
  profileImageAlt,
}: AboutSectionProps) {
  const firstName = givenName?.trim() || name.split(" ")[0];
  const linkedin = findSocial(socials, "LinkedIn");
  const behance = findSocial(socials, "Behance");
  const email = findSocial(socials, "Email");

  // A display picture: overlapping the scene's lower edge the way a profile
  // picture sits on a cover, ringed in the paper colour so it reads as cut
  // out of the page rather than pasted over the picture.
  const portrait = profileImage ? (
    <div className="ring-paper bg-surface-2 relative z-10 -mt-10 ml-4 size-20 shrink-0 overflow-hidden rounded-2xl shadow-sm ring-4 sm:-mt-12 sm:ml-6 sm:size-24">
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
  ) : null;

  return (
    <section id="about" aria-labelledby="about-name" className="pt-4 sm:pt-6">
      <DitherScene leading={portrait} />

      <div className="mt-5 sm:mt-6">
        {/* The full name stays the page's heading for screen readers and
            search, but on the page the introduction is part of the sentence:
            a greeting, a first name, then the bio. */}
        <h1 id="about-name" className="sr-only">
          {name}
        </h1>

        <p className="text-ink-soft max-w-[38rem] text-[1.0625rem] text-pretty break-words sm:leading-relaxed">
          <span className="text-ink font-medium">
            <WelcomeText latin={greetingLatin} sinhala={greetingSinhala} />!
          </span>{" "}
          I&apos;m {firstName}. {bio}
        </p>

        {(linkedin || email || behance) && (
          <p className="text-ink-soft mt-4 max-w-[38rem] text-[0.9375rem] text-pretty">
            {(linkedin || email) && (
              <>
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
              </>
            )}
            {/* Its own line at every width, rather than running on from the
                sentence before it. */}
            {behance && (
              <span className="mt-1 block">
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
        )}

        {/* A plain anchor, not `Link`: this points at a file rather than a
            route. The explicit `download` filename matters because the href
            is the tidy /resume alias, which would otherwise be saved as a
            file called "resume" with no extension. */}
        <div className="mt-6">
          <Button asChild>
            <a href="/resume" download={resumeDownloadName}>
              <LuDownload data-icon="inline-start" aria-hidden="true" />
              Download Resume
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
