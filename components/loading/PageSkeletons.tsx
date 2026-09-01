import { Band } from "@/components/ui/band";
import { Skeleton } from "@/components/ui/skeleton";
import { columnClass, columnPadding, splitGrid } from "@/lib/layout";
import { cn } from "@/lib/utils";

function LoadingLabel() {
  return <span className="sr-only">Loading page content</span>;
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="relative flex min-h-screen flex-col"
    >
      <LoadingLabel />
      <main className={cn(columnClass, "relative mx-auto flex-1")}>
        {children}
      </main>
    </div>
  );
}

function HeadingSkeleton({ description = false }: { description?: boolean }) {
  return (
    <div aria-hidden className="flex flex-col gap-3">
      <Skeleton className="h-8 w-56 md:h-10 md:w-72" />
      {description && <Skeleton className="h-5 w-full max-w-xl" />}
    </div>
  );
}

function WorkCardSkeleton() {
  return (
    <div
      aria-hidden
      className="border-rule bg-paper border p-6 md:p-8"
    >
      <div className="flex flex-col gap-6 lg:flex-row-reverse lg:gap-8">
        <Skeleton className="aspect-video w-full lg:w-1/2 lg:shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-4">
          <Skeleton className="h-7 w-4/5" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Skeleton className="h-10 w-52" />
        </div>
      </div>
    </div>
  );
}

function ProjectCardSkeleton() {
  return (
    <div aria-hidden className="border-rule bg-paper border p-6 md:p-8">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="mt-6 flex flex-col gap-4 md:mt-8">
        <Skeleton className="h-7 w-4/5" />
        <div className="hidden flex-col gap-2 sm:flex">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

function ExperienceRowSkeleton() {
  return (
    <div aria-hidden className="border-rule border-b p-6 md:p-8">
      <div className="flex gap-4">
        <Skeleton className="size-[50px] shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Skeleton className="h-6 w-3/5" />
          <Skeleton className="h-4 w-2/5" />
          <div className="mt-2 flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <PageShell>
      <div className="bg-hatch relative z-10 flex flex-col gap-8">
        <Band
          topCrosses={false}
          className={cn(columnPadding, "pt-32 md:pt-40")}
        >
          {/* Three rails: identity, the sentence, and the tilted photo. */}
          <div className="grid gap-8 lg:grid-cols-[minmax(0,12rem)_minmax(0,1fr)_auto]">
            {/* Name over two lines, at the section headings' size. */}
            <div className="flex flex-col">
              <Skeleton className="h-8 w-28 md:h-9" />
              <Skeleton className="mt-1 h-8 w-40 max-w-full md:h-9" />
              <Skeleton className="mt-3 h-4 w-44 max-w-full" />
              <div className="mt-5 flex flex-col gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/5" />
              <Skeleton className="mt-4 h-4 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>

            <div className="order-first lg:order-none lg:pt-1">
              <Skeleton className="aspect-square w-28 rotate-3 rounded-none sm:w-32" />
            </div>
          </div>
        </Band>

        <Band className={columnPadding}>
          <div className="flex flex-col gap-8">
            <HeadingSkeleton />
            <WorkCardSkeleton />
            <WorkCardSkeleton />
            <div className={cn(splitGrid, "gap-8")}>
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
            </div>
          </div>
        </Band>

        <Band className={columnPadding}>
          <div className="flex flex-col gap-6">
            <HeadingSkeleton />
            <div className="border-rule bg-paper max-h-[500px] overflow-hidden border">
              <ExperienceRowSkeleton />
              <ExperienceRowSkeleton />
              <ExperienceRowSkeleton />
            </div>
          </div>
        </Band>

        <Band className={columnPadding}>
          <div className="flex flex-col gap-8">
            <HeadingSkeleton description />
            <div className={cn(splitGrid, "gap-8")}>
              <BlogCardSkeleton />
              <BlogCardSkeleton />
            </div>
            <Skeleton className="h-10 w-36" />
          </div>
        </Band>

        <Band bottomCrosses={false} className={columnPadding}>
          <div className="flex items-center justify-between gap-6">
            <HeadingSkeleton description />
            <Skeleton className="h-10 w-20 shrink-0" />
          </div>
        </Band>
      </div>
    </PageShell>
  );
}

function BlogCardSkeleton() {
  return (
    <div aria-hidden className="border-rule bg-paper border">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="flex flex-col gap-4 p-6">
        <div className="flex gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-7 w-4/5" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

export function BlogIndexSkeleton() {
  return (
    <PageShell>
      <div className="bg-hatch relative z-10 flex flex-col gap-8 pb-12">
        <Band
          topCrosses={false}
          className={cn(columnPadding, "pt-32 md:pt-40")}
        >
          <HeadingSkeleton description />
        </Band>
        <Band bottomCrosses={false} className={columnPadding}>
          <div className={cn(splitGrid, "gap-8")}>
            <BlogCardSkeleton />
            <BlogCardSkeleton />
          </div>
        </Band>
      </div>
    </PageShell>
  );
}

function BackLinkSkeleton() {
  return <Skeleton aria-hidden className="h-5 w-28" />;
}

function HeroSkeleton({ article = false }: { article?: boolean }) {
  return (
    <div aria-hidden className="flex flex-col gap-4">
      {article && <Skeleton className="h-4 w-48" />}
      <Skeleton className="h-10 w-4/5 md:h-12" />
      <Skeleton className="h-6 w-full max-w-3xl" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-16" />
      </div>
      <Skeleton className="mt-4 aspect-video w-full rounded-none" />
    </div>
  );
}

function PanelSkeleton() {
  return (
    <div aria-hidden className="border-rule bg-paper border p-6 md:p-8">
      <Skeleton className="h-7 w-2/5" />
      <div className="mt-4 flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

export function CaseStudyPageSkeleton() {
  return (
    <PageShell>
      <div className="bg-hatch relative z-10 flex flex-col gap-8 pb-12">
        <Band
          topRule={false}
          className={cn(
            columnPadding,
            "flex flex-col gap-8 pt-32 md:pt-40",
          )}
        >
          <BackLinkSkeleton />
          <HeroSkeleton />
        </Band>

        <Band className={columnPadding}>
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {Array.from({ length: 4 }, (_, index) => (
                <Skeleton key={index} className="h-28 w-full" />
              ))}
            </div>
            <div className={cn(splitGrid, "gap-6")}>
              <PanelSkeleton />
              <PanelSkeleton />
            </div>
            {/* The role panel, full width under the pair. */}
            <PanelSkeleton />
          </div>
        </Band>

        <Band className={columnPadding}>
          <div className="flex flex-col gap-6">
            <Skeleton className="h-9 w-64" />
            {/* Chapters run straight under the heading: they carry their own
                numbers, so there is no jump-link row above them. */}
            <PanelSkeleton />
            <PanelSkeleton />
          </div>
        </Band>
      </div>
    </PageShell>
  );
}

function ArticleBodySkeleton() {
  return (
    <div
      aria-hidden
      className="mx-auto flex max-w-3xl flex-col gap-5"
    >
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-5/6" />
      <Skeleton className="mt-6 h-9 w-3/5" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-11/12" />
      <Skeleton className="h-5 w-4/5" />
      <Skeleton className="my-4 aspect-video w-full rounded-none" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-3/4" />
    </div>
  );
}

export function BlogPostPageSkeleton() {
  return (
    <PageShell>
      <div className="bg-hatch relative z-10 flex flex-col gap-8 pb-12">
        <Band
          topCrosses={false}
          className={cn(
            columnPadding,
            "flex flex-col gap-8 pt-32 md:pt-40",
          )}
        >
          <BackLinkSkeleton />
          <HeroSkeleton article />
        </Band>
        <Band bottomCrosses={false} className={columnPadding}>
          <ArticleBodySkeleton />
        </Band>
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
