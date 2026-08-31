import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";
import type { Metadata } from "next";
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
    <html
      lang="en"
      className={cn("scroll-smooth", fontVariables)}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="bg-surface relative min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
