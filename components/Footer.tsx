"use client";
import { columnClass, columnPadding } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { useSyncExternalStore } from "react";

/**
 * The server and the browser can disagree about the date here: the server
 * renders on its own clock, and its output can be cached from well before the
 * reader arrives. Reading through a store is the sanctioned way to render one
 * value on the server and a freshly read one in the browser; correcting it
 * from an effect does the same job but commits a second render to get there.
 */
const getYear = () => new Date().getFullYear();

/** There is no external source to subscribe to, so the callback is a no-op. */
const subscribeToNothing = () => () => {};

export default function Footer() {
  const year = useSyncExternalStore(subscribeToNothing, getYear, getYear);

  // The background runs the full width of the viewport so the page closes on a
  // solid band, while the content stays inside the reading column with the
  // rest of the site.
  return (
    <footer
      id="footer"
      className="border-rule bg-surface-2 dark:bg-secondary relative z-10 w-full border-t"
    >
      <div
        className={cn(
          columnClass,
          columnPadding,
          "text-ink-faint mx-auto flex flex-col-reverse items-center justify-center gap-4 py-10 md:flex-row md:justify-between",
        )}
      >
        <span className="order-2 space-y-1 text-center text-xs sm:order-1 sm:text-left">
          <p>
            Built with{" "}
            <a
              href="https://nextjs.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-text hover:underline"
            >
              Next.js
            </a>
            {", "}
            <a
              href="https://tailwindcss.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-text hover:underline"
            >
              Tailwind
            </a>
            {", "}
            <a
              href="https://ui.shadcn.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-text hover:underline"
            >
              shadcn/ui
            </a>
          </p>
          <p>
            Devs pls don&apos;t roast me{" 🥺 "}
            <a
              href="https://github.com/dileepamg/dileepamg-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-text after:content-['_↗'] hover:underline"
            >
              GitHub
            </a>
          </p>
        </span>
        <span className="order-1 space-y-1 text-center text-xs sm:order-2 sm:text-right">
          <p className="text-ink-soft">
            {year} &copy; Dileepa Mahanama Galmangoda
          </p>
          <p>
            Thanks for the inspo{" 💙 "}
            <a
              href="https://akhilaariyachandra.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink underline transition-colors"
            >
              Akhila
            </a>
            {" & "}
            <a
              href="https://rcortiz.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink underline transition-colors"
            >
              Ralph
            </a>
          </p>
        </span>
      </div>
    </footer>
  );
}
