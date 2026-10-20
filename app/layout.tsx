import { READING_MAX_REM, WIDE_MAX_REM } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";
import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import {
  DM_Sans,
  Noto_Sans_Sinhala,
} from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

/** Browser chrome in the page's default, light, paper colour. */
export const viewport: Viewport = {
  themeColor: "#fbfaf7",
};

/**
 * The site's primary face, for body and headings alike. Loaded as the
 * variable font, with its optical-size axis, so headings set at display sizes
 * get the tighter cut and body copy can sit between the named weights.
 */
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  axes: ["opsz"],
});

/** Needed for the Sinhala greeting, a script requirement, not a style. */
const notoSansSinhala = Noto_Sans_Sinhala({
  variable: "--font-notoSansSinhala",
  subsets: ["sinhala"],
  weight: ["500"],
});

/**
 * The font variables have to land on <html>, not <body>. `--font-body` is
 * declared in `:root` and resolves `var(--font-dm-sans)` at that element. If
 * the variable is only defined further down the tree, that declaration
 * computes to nothing and every `font-sans` silently falls back to the system
 * stack.
 */
const fontVariables = [
  dmSans.variable,
  notoSansSinhala.variable,
].join(" ");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The column widths are published here rather than declared in
    // globals.css so they have one home: `lib/layout.ts` owns the numbers,
    // because the image `sizes` hints have to compute from them and a CSS
    // custom property cannot be read from TypeScript.
    <html
      lang="en"
      className={cn("scroll-smooth", fontVariables)}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      style={
        {
          "--reading-max": `${READING_MAX_REM}rem`,
          "--wide-max": `${WIDE_MAX_REM}rem`,
        } as CSSProperties
      }
    >
      {/* `suppressHydrationWarning` because extensions write their own
          attributes onto body before React hydrates (Grammarly, ColorZilla),
          and React counts those as a mismatch it refuses to patch. It only
          covers this element's own attributes, so a real mismatch anywhere in
          the page still reports. */}
      <body
        className="bg-paper relative min-h-screen antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
