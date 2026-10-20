"use client";

import { ExternalLink } from "@/components/ExternalLink";
import { columnClass } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { useSyncExternalStore } from "react";

/**
 * The server and the browser can disagree about the date here: the server
 * renders on its own clock, and its output can be cached from well before the
 * reader arrives. Reading through a store renders one value on the server and
 * a freshly read one in the browser, without a second render from an effect.
 */
const getYear = () => new Date().getFullYear();
const getServerYear = () => 2026;

/** There is no external source to subscribe to, so the callback is a no-op. */
const subscribeToNothing = () => () => {};

type FooterProps = {
  copyrightName?: string;
  sourceLabel?: string;
  sourceUrl?: string;
  inspirationLinks?: readonly {
    label: string;
    href: string;
  }[];
};

const defaultInspirationLinks = [
  { label: "Akhila", href: "https://akhilaariyachandra.com/" },
  { label: "Ralph", href: "https://rcortiz.dev/" },
];

const builtWith = [
  { label: "Next.js", href: "https://nextjs.org/" },
  { label: "Tailwind", href: "https://tailwindcss.com/" },
  { label: "shadcn/ui", href: "https://ui.shadcn.com/" },
  { label: "Sanity", href: "https://www.sanity.io/" },
];

const footerLink =
  "text-ink-soft hover:text-brand-text underline decoration-rule underline-offset-4 transition-colors hover:decoration-current";

export default function Footer({
  copyrightName = "Dileepa Mahanama Galmangoda",
  sourceLabel = "GitHub",
  sourceUrl = "https://github.com/dileepamg/dileepamg-portfolio",
  inspirationLinks = defaultInspirationLinks,
}: FooterProps) {
  const year = useSyncExternalStore(subscribeToNothing, getYear, getServerYear);

  return (
    <footer id="footer" className="mt-24 pb-10 md:mt-32">
      <div className={cn(columnClass)}>
        <div className="border-rule text-ink-faint grid gap-2 border-t pt-8 text-center text-xs sm:grid-cols-2 sm:gap-x-8 sm:text-left">
          <p className="order-1 sm:order-none">
            Built with{" "}
            {builtWith.map((item, index) => (
              <span key={item.href}>
                {index > 0 && ", "}
                <ExternalLink href={item.href} className={footerLink}>
                  {item.label}
                </ExternalLink>
              </span>
            ))}
          </p>
          <p className="order-5 sm:order-none sm:text-right">
            {year} &copy; {copyrightName}
          </p>
          <p className="order-2 sm:order-none">
            Devs pls don&apos;t roast me.{" "}
            <ExternalLink href={sourceUrl} className={footerLink}>
              {sourceLabel} ↗
            </ExternalLink>
          </p>
          {/* On a phone the lines stack: a rule splits what the site is
              built with from who it thanks and whose it is. */}
          <span
            aria-hidden="true"
            className="bg-rule order-3 my-2 h-px w-full sm:hidden"
          />
          <p className="order-4 sm:order-none sm:text-right">
            Thanks for the inspo:{" "}
            {inspirationLinks.map((link, index) => (
              <span key={link.href}>
                {index > 0 && " & "}
                <ExternalLink href={link.href} className={footerLink}>
                  {link.label}
                </ExternalLink>
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
