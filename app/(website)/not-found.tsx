import { NotFoundEyes } from "@/components/NotFoundEyes";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main id="main" className="page-grid flex-1">
      <div className="mx-auto flex max-w-md flex-col items-center pt-16 text-center sm:pt-24">
        <NotFoundEyes />

        <p
          aria-hidden="true"
          className="text-ink-faint text-6xl leading-none font-semibold tracking-tight"
        >
          404
        </p>
        <h1 className="mt-5 text-2xl sm:text-3xl">Page not found</h1>
        <p className="text-ink-soft mt-3 text-pretty">
          We looked, but there&apos;s nothing here. The page may have moved or
          never existed.
        </p>
        <Button asChild variant="outline" className="mt-8">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </main>
  );
}
