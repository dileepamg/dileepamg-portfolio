import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    <html lang="en">
      <body className={`${spaceGrotesk.variable} antialiased`}>
        <div className="mx-auto w-[80%] sm:max-w-[70%] md:max-w-[60%] xl:max-w-[50%] min-h-screen flex items-center justify-center">
          {children}
        </div>
      </body>
    </html>
  );
}
