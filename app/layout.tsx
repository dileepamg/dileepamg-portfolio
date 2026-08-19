import { JsonLd } from "@/components/structured-data/JsonLd";
import { getProfileStructuredData } from "@/components/structured-data/profile";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteFrame } from "@/components/ui/site-frame";
import { SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import {
  DM_Sans,
  Noto_Sans_Sinhala,
  Sedgwick_Ave_Display,
} from "next/font/google";
import "./globals.css";

/**
 * Kept as a named export because it was one before; the origin itself now
 * lives in `lib/site` so the metadata, the structured data and the sitemap
 * cannot drift onto different hosts.
 */
export const PRODUCTION_URL = SITE_URL;

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

export const metadata: Metadata = {
  title: "Dileepa Mahanama Galmangoda",
  description:
    "Senior UI/UX Designer & Creative Generalist from Sri Lanka. Specializing in product design, visual design, and motion to build engaging digital experiences.",
  keywords: [
    "UI/UX Designer",
    "Product Designer",
    "Visual Designer",
    "Sri Lanka",
    "Motion Graphics",
    "Dileepa Galmangoda",
  ],
  metadataBase: new URL(PRODUCTION_URL),
  // Without this every page is its own canonical by default, so a URL reached
  // with a tracking query or a trailing variant reads as a separate page.
  alternates: { canonical: "/" },
  openGraph: {
    title: {
      default: "Dileepa Mahanama Galmangoda",
      template: "%s | Dileepa Galmangoda",
    },
    description: "UI/UX & Visual Designer",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dileepa Mahanama Galmangoda",
    description: "UI/UX & Visual Designer",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = getProfileStructuredData();
  // Inlined at build time, so it has to be read as a whole expression rather
  // than through a variable key.
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html
      lang="en"
      className={cn("scroll-smooth", fontVariables)}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="bg-surface relative min-h-screen antialiased">
        <JsonLd data={jsonLd} />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SiteFrame />
          {children}
          <Analytics />
        </ThemeProvider>
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
