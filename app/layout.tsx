import { getProfileStructuredData } from "@/components/structured-data/profile";
import { ThemeProvider } from "@/components/theme-provider";
import { GridPattern } from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import {
  Handjet,
  Noto_Sans_Sinhala,
  Pixelify_Sans,
  Sedgwick_Ave_Display,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";

export const PRODUCTION_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "https://localhost:3000";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelifysans",
  subsets: ["latin"],
  weight: ["400"],
});

const handjet = Handjet({
  variable: "--font-handjet",
  subsets: ["latin"],
  weight: ["500"],
});

const sedgewickAve = Sedgwick_Ave_Display({
  variable: "--font-sedgewickAve",
  subsets: ["latin"],
  weight: ["400"],
});

const notoSansSinhala = Noto_Sans_Sinhala({
  variable: "--font-notoSansSinhala",
  subsets: ["sinhala"],
  weight: ["500"],
});

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
  return (
    <html
      lang="en"
      className="scroll-smooth"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      {/* <body
        className={cn(
          `${spaceGrotesk.variable} ${pixelifySans.variable} ${sedgewickAve.variable} ${notoSansSinhala.variable} ${handjet.variable} antialiased`,
          "relative min-h-screen bg-white dark:bg-black",
          "[background-size:10px_10px]",
          "[background-image:linear-gradient(to_right,#F7F7FA_1px,transparent_1px),linear-gradient(to_bottom,#F7F7FA_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#121212_1px,transparent_1px),linear-gradient(to_bottom,#121212_1px,transparent_1px)]",
        )}
      > */}
      <body
        className={cn(
          `${spaceGrotesk.variable} ${pixelifySans.variable} ${sedgewickAve.variable} ${notoSansSinhala.variable} ${handjet.variable} antialiased`,
          "relative min-h-screen bg-white dark:bg-black",
        )}
      >
        <GridPattern
          width={25}
          height={25}
          x={-1}
          y={-1}
          strokeDasharray={"4 2"}
          className={cn("opacity-60")}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
