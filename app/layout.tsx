import type { Metadata } from "next";
import { Pixelify_Sans, Space_Grotesk } from "next/font/google";
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
    <html lang="en" className="scroll-smooth">
      <body
        className={`${spaceGrotesk.variable} ${pixelifySans.variable} antialiased`}
      >
        <div className="bg-[--background]] mx-auto flex min-h-screen w-[80%] items-center justify-center sm:max-w-[70%] md:max-w-[60%] xl:max-w-[50%]">
          {children}
        </div>
      </body>
    </html>
  );
}
