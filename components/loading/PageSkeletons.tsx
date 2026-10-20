import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/*
 * Loading states that hold the shape of the page they stand in for, so the
 * real content lands in the same places and nothing jumps. Each mirrors the
 * layout of its page at the level of blocks, not of every line.
 */

function LoadingLabel() {
  return <span className="sr-only">Loading page content</span>;
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main
      id="main"
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="page-grid flex-1"
    >
      <LoadingLabel />
      {children}
    </main>
  );
}

function SectionLabelSkeleton() {
  return <Skeleton aria-hidden className="mb-6 h-4 w-28" />;
}

function WorkCardSkeleton() {
  return (
    <div aria-hidden>
      <Skeleton className="rounded-frame aspect-[2/1] w-full" />
      <div className="mt-4 flex items-center justify-between gap-4">
        <Skeleton className="h-5 w-3/5" />
        <Skeleton className="h-3.5 w-20" />
      </div>
      <div className="mt-3 flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <PageShell>
      <div aria-hidden className="pt-6 sm:pt-10">
        <Skeleton className="rounded-frame h-[176px] w-full sm:h-[208px]" />
        <Skeleton className="ring-paper -mt-10 ml-4 size-20 rounded-frame ring-4 sm:-mt-12 sm:ml-6 sm:size-24" />
        <Skeleton className="mt-5 h-6 w-2/5 sm:mt-6" />
        <div className="mt-5 flex max-w-[38rem] flex-col gap-2.5">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-11/12" />
          <Skeleton className="h-5 w-2/3" />
        </div>
        <Skeleton className="mt-6 h-9 w-44 rounded-frame" />
      </div>

      <div className="mt-20 sm:mt-24">
        <SectionLabelSkeleton />
        <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
          <WorkCardSkeleton />
          <WorkCardSkeleton />
        </div>
      </div>

      <div className="mt-20 sm:mt-24">
        <SectionLabelSkeleton />
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            aria-hidden
            className="flex items-center gap-4 py-3.5"
          >
            <Skeleton className="size-9 shrink-0 rounded-frame" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-2/5" />
              <Skeleton className="h-3.5 w-1/3" />
            </div>
            <Skeleton className="hidden h-3.5 w-36 sm:block" />
          </div>
        ))}
      </div>
    </PageShell>
  );
}

function BackLinkSkeleton() {
  return <Skeleton aria-hidden className="mt-8 h-4 w-28 sm:mt-12" />;
}

function HeroSkeleton({ meta = true }: { meta?: boolean }) {
  return (
    <div aria-hidden className="mt-8 flex flex-col sm:mt-10">
      {meta && <Skeleton className="h-3.5 w-48" />}
      <Skeleton className="mt-4 h-10 w-4/5 sm:h-12" />
      <Skeleton className="mt-4 h-6 w-full" />
      <Skeleton className="mt-2 h-6 w-3/4" />
    </div>
  );
}

function ParagraphsSkeleton({ lines = 6 }: { lines?: number }) {
  return (
    <div aria-hidden className="flex flex-col gap-3">
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          className={cn("h-4", index % 3 === 2 ? "w-4/5" : "w-full")}
        />
      ))}
    </div>
  );
}

export function BlogIndexSkeleton() {
  return (
    <PageShell>
      <Skeleton aria-hidden className="mt-6 h-4 w-28 sm:mt-8" />
      <div aria-hidden className="mt-4">
        <Skeleton className="h-10 w-32 sm:h-12" />
        <Skeleton className="mt-3 h-5 w-full max-w-md" />
      </div>
      <div className="mt-8 grid gap-x-6 gap-y-10 md:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} aria-hidden>
            <Skeleton className="rounded-frame aspect-[1200/630] w-full" />
            <Skeleton className="mt-4 h-3.5 w-40" />
            <Skeleton className="mt-2.5 h-5 w-4/5" />
            <Skeleton className="mt-2 h-4 w-full" />
          </div>
        ))}
      </div>
    </PageShell>
  );
}

export function CaseStudyPageSkeleton() {
  return (
    <PageShell>
      <BackLinkSkeleton />
      <HeroSkeleton />
      <Skeleton
        aria-hidden
        className="bleed-wide rounded-frame mt-10 aspect-video w-full sm:mt-12"
      />
      <div
        aria-hidden
        className="mt-10 grid grid-cols-2 gap-5 py-6 sm:grid-cols-4"
      >
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
      <div className="mt-12">
        <ParagraphsSkeleton lines={5} />
      </div>
      <Skeleton aria-hidden className="rounded-frame mt-10 h-48 w-full" />
    </PageShell>
  );
}

export function BlogPostPageSkeleton() {
  return (
    <PageShell>
      <BackLinkSkeleton />
      <HeroSkeleton />
      <Skeleton
        aria-hidden
        className="bleed-wide rounded-frame mt-10 aspect-video w-full sm:mt-12"
      />
      <div className="mt-12 sm:mt-14">
        <ParagraphsSkeleton lines={9} />
      </div>
    </PageShell>
  );
}

export function StudioPageSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="bg-background flex min-h-screen gap-4 p-4"
    >
      <LoadingLabel />
      <aside
        aria-hidden
        className="border-border hidden w-72 shrink-0 flex-col gap-4 border-r pr-4 md:flex"
      >
        <Skeleton className="h-10 w-44" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-5/6" />
        <Skeleton className="h-9 w-11/12" />
        <Skeleton className="h-9 w-4/5" />
      </aside>
      <main aria-hidden className="flex min-w-0 flex-1 flex-col gap-4">
        <Skeleton className="h-12 w-full" />
        <div className="grid flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <Skeleton className="min-h-[36rem] w-full" />
          <Skeleton className="hidden min-h-[36rem] w-full lg:block" />
        </div>
      </main>
    </div>
  );
}
