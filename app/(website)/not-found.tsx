import { NotFoundEyes } from "@/components/NotFoundEyes";
import { Band } from "@/components/ui/band";
import { Button } from "@/components/ui/button";
import { columnClass, columnPadding } from "@/lib/layout";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="relative">
      <main className={cn(columnClass, "relative mx-auto")}>
        <div className="bg-hatch relative z-10 pb-12">
          <Band
            topCrosses={false}
            className={cn(columnPadding, "pt-32 md:pt-40")}
          >
            <div className="mx-auto flex max-w-md flex-col items-center text-center">
              <NotFoundEyes />

              <p className="text-ink-faint text-sm font-medium">404</p>
              <h1 className="mt-3 text-3xl md:text-4xl">Page not found</h1>
              <p className="text-ink-soft mt-3 text-pretty">
                We looked, but there&apos;s nothing here. The page may have
                moved or never existed.
              </p>
              <Button asChild variant="outline" className="mt-8">
                <Link href="/">Back to home</Link>
              </Button>
            </div>
          </Band>
        </div>
      </main>
    </div>
  );
}
