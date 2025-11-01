import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import {
  Noto_Sans_Sinhala,
  Pixelify_Sans,
  Sedgwick_Ave_Display,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";
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

const sedgewickAve = Sedgwick_Ave_Display({
  variable: "--font-sedgewickAve",
  subsets: ["latin"],
  weight: ["400"],
});

const notoSansSinhala = Noto_Sans_Sinhala({
  variable: "--font-notoSansSinhala",
  weight: ["500"],
});

export const metadata: Metadata = {
  title: "DileepaMG Portfolio",
  description: "Portfolio of Dileepa Mahanama Galmangoda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="scroll-smooth"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body
        className={cn(
          `${spaceGrotesk.variable} ${pixelifySans.variable} ${sedgewickAve.variable} ${notoSansSinhala.variable} antialiased`,
          "relative min-h-screen bg-white dark:bg-black",
          "[background-size:10px_10px]",
          "[background-image:linear-gradient(to_right,#F7F7FA_1px,transparent_1px),linear-gradient(to_bottom,#F7F7FA_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#121212_1px,transparent_1px),linear-gradient(to_bottom,#121212_1px,transparent_1px)]",
        )}
      >
        {/* <div
          className={cn(
            "absolute inset-0",
            "[background-size:20px_20px]",
            "[background-image:linear-gradient(to_right,#efeff2_1px,transparent_1px),linear-gradient(to_bottom,#efeff2_1px,transparent_1px)]",
            "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
          )}
        /> */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="mx-auto flex min-h-screen w-[90%] items-center justify-center sm:max-w-[70%] md:max-w-[60%] lg:max-w-[50%] 2xl:max-w-[40%]">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
