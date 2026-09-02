import { READING_MAX_REM } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import {
  DM_Sans,
  Noto_Sans_Sinhala,
  Sedgwick_Ave_Display,
} from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

/** The site's primary face, used for body and headings alike. */
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/** The wordmark only. Deliberately left as it was through the redesign. */
const sedgewickAve = Sedgwick_Ave_Display({
  variable: "--font-sedgewickAve",
  subsets: ["latin"],
  weight: ["400"],
});

/** Needed for the Sinhala greeting, a script requirement, not a style. */
const notoSansSinhala = Noto_Sans_Sinhala({
  variable: "--font-notoSansSinhala",
  subsets: ["sinhala"],
  weight: ["500"],
});

/**
 * The font variables have to land on <html>, not <body>. `--font-body` is
 * declared in `:root` and resolves `var(--font-dm-sans)` at that
 * element. If the variable is only defined further down the tree, that
 * declaration computes to nothing and every `font-sans` silently falls back
 * to the system stack.
 */
const fontVariables = [
  dmSans.variable,
  sedgewickAve.variable,
  notoSansSinhala.variable,
].join(" ");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `--reading-max` is published here rather than declared in globals.css so
    // the column width has one home. `lib/layout.ts` owns the number, because
    // the image `sizes` hints have to compute from it and a CSS custom
    // property cannot be read from TypeScript.
    <html
      lang="en"
      className={cn("scroll-smooth", fontVariables)}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      style={{ "--reading-max": `${READING_MAX_REM}rem` } as CSSProperties}
    >
      {/* `suppressHydrationWarning` because extensions write their own
          attributes onto body before React hydrates — Grammarly adds
          `data-gr-ext-installed`, ColorZilla adds `cz-shortcut-listen` — and
          React counts those as a server/client mismatch it refuses to patch.
          Nothing here renders differently on the two sides; the markup is
          simply not ours alone by the time hydration runs.

          It only covers this element's own attributes and text, not the tree
          under it, so a real mismatch anywhere in the page still reports. */}
      <body
        className="bg-surface relative min-h-screen antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
