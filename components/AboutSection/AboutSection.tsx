import { Button } from "@/components/ui/button";
import WelcomeText from "@/components/WelcomeText";
import ProfilePic from "@/public/dileepa-g.png";
import Image from "next/image";
import type { IconType } from "react-icons";
import { FaBehance, FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { LuCalendarDays, LuDownload, LuMail } from "react-icons/lu";

type Social = {
  href: string;
  label: string;
  Icon: IconType;
  /** Off for a link that hands off to an app rather than loading a page. */
  external?: boolean;
};

const socials: Social[] = [
  {
    href: "mailto:dileepagalmangoda@gmail.com",
    label: "Email",
    Icon: LuMail,
    external: false,
  },
  {
    href: "https://www.behance.net/dileepamg",
    label: "Behance",
    Icon: FaBehance,
  },
  {
    href: "https://www.linkedin.com/in/dileepa-galmangoda/",
    label: "LinkedIn",
    Icon: FaLinkedin,
  },
  { href: "https://x.com/xaradiyel/", label: "X", Icon: FaXTwitter },
  { href: "https://github.com/dileepamg", label: "GitHub", Icon: FaGithub },
];

export default function AboutSection() {
  return (
    <section id="about" className="scroll-mt-28 align-top">
      {/* Portrait above the text until the column can hold both side by side,
          which is `lg`, the same point every other split on the site waits
          for. The split used to start at `sm`, where the column is ~408px
          wide: the portrait took 200 of it and the text, floored by the width
          of its own button row, could not shrink into what was left. */}
      <div className="flex flex-col items-start justify-between gap-8 lg:flex-row">
        {/* `min-w-0` is what lets this actually shrink: a flex item defaults
            to `min-width: auto`, which refuses to go below its content's
            intrinsic width and pushes the overflow onto the page instead. */}
        <div className="order-2 min-w-0 flex-1 lg:order-1">
          <h1 className="text-3xl md:text-4xl">Dileepa Galmangoda</h1>
          <p className="text-brand-text mt-1 text-xl font-medium md:text-2xl">
            UI/UX Designer & Creative Generalist
          </p>
          <p className="text-ink-soft mt-4 text-base text-pretty break-words md:mt-8">
            <WelcomeText /> 🙏 I design digital experiences that make every
            interface feel like it already understands what the user is trying
            to do. My work moves between shaping flows, refining designs,
            building prototypes and using AI-assisted workflows to explore and
            improve ideas. I’m currently a Senior UI/UX Designer at Villvay.
          </p>

          <div className="flex flex-row flex-wrap gap-4 py-4">
            <Button asChild variant="outline">
              {/* A plain anchor, not `Link`: this points at a file rather than
                  a route, and the client router has no page to navigate to.
                  The explicit `download` filename matters because the href is
                  the tidy /resume alias, which would otherwise be saved as a
                  file called "resume" with no extension. */}
              <a href="/resume" download="Dileepa-Galmangoda-Resume.pdf">
                <LuDownload data-icon="inline-start" /> Download Resume
              </a>
            </Button>

            <Button asChild>
              <a
                href="https://calendar.app.google/3QVZ8AywYnCyzrpLA"
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
            {socials.map(({ href, label, Icon, external = true }) => (
              <Button
                key={href}
                asChild
                variant="outline"
                size="icon"
                shape="pill"
              >
                <a
                  href={href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  aria-label={external ? `${label} (opens in new tab)` : label}
                >
                  <Icon className="size-5" />
                </a>
              </Button>
            ))}
          </div>
        </div>

        {/* Sized so it never takes more than about a third of the row: at
            `lg` the column holds ~650px, and a 300px portrait there would
            leave the text too narrow for its own button row. */}
        <div className="border-rule relative order-1 size-50 shrink-0 border lg:order-2 lg:size-56 xl:size-[300px]">
          {/* Mirrors the `size-*` ladder on the wrapper: 200px, then 224px
              at `lg`, then 300px at `xl`. Widths first, because the browser
              takes the first matching clause. */}
          <Image
            src={ProfilePic}
            fill
            sizes="(min-width: 1280px) 300px, (min-width: 1024px) 224px, 200px"
            placeholder="blur"
            className="object-cover"
            alt="Portrait"
          />
        </div>
      </div>
    </section>
  );
}
