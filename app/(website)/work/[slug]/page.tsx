import MediaFrame, {
  mediaGridClass,
  mediaSizes,
} from "@/components/CaseStudy/MediaFrame";
import ChapterItem from "@/components/CaseStudy/Chapter";
import RichText from "@/components/CaseStudy/RichText";
import { ExternalLink } from "@/components/ExternalLink";
import { CaseStudyPageSkeleton } from "@/components/loading/PageSkeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Band } from "@/components/ui/band";
import { JsonLd } from "@/components/structured-data/JsonLd";
import { getCaseStudyStructuredData } from "@/components/structured-data/caseStudy";
import { columnClass, columnPadding, splitGrid } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { metadataClient } from "@/sanity/lib/client";
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
} from "@/sanity/lib/live";
import {
  cleanSanityString,
  mapCaseStudy,
  mapCaseStudyCard,
} from "@/sanity/lib/mappers";
import {
  CASE_STUDIES_QUERY,
  CASE_STUDY_QUERY,
  CASE_STUDY_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import { IconBrandBehance, IconBrandFigma } from "@tabler/icons-react";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LuArrowLeft, LuArrowRight, LuExternalLink } from "react-icons/lu";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const studies = await metadataClient.fetch(CASE_STUDY_SLUGS_QUERY);
  return studies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: documents } = await sanityFetchMetadata({
    query: CASE_STUDY_QUERY,
    perspective: "published",
  });
  const document = documents.find(
    (item) => cleanSanityString(item.slug) === slug,
  );

  if (!document) return {};
  const study = mapCaseStudy(document);

  const heading = study.pageTitle ?? study.title;

  /**
   * Declaring `openGraph` here replaces the parent's block outright rather
   * than merging into it, so the site-wide image has to be restated or the
   * page ships `og:image` with no value and every share of a case study
   * renders without a preview. The study's own thumbnail is the better
   * picture anyway.
   */
  const image = study.media.kind === "image" ? study.media.src : undefined;

  return {
    title: heading,
    description: study.summary,
    alternates: { canonical: `/work/${study.slug}` },
    openGraph: {
      title: heading,
      description: study.summary,
      url: `/work/${study.slug}`,
      type: "article",
      images: image
        ? [
            {
              url: image.src,
              width: image.width,
              height: image.height,
              alt: heading,
            },
          ]
        : ["/opengraph-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: heading,
      description: study.summary,
      images: image ? [image.src] : ["/opengraph-image.png"],
    },
  };
}

/** Section headings across the page, so the type scale stays in step. */
const sectionHeadingClass = "text-brand-text text-2xl md:text-3xl";

/** A framed panel. Square, hairline, sitting on the paper column. */
const panelClass = "border-rule bg-paper border p-6 md:p-8";

export default async function CaseStudyPage({ params }: PageProps) {
  const { isEnabled } = await draftMode();
  if (isEnabled) {
    return (
      <Suspense fallback={<CaseStudyPageSkeleton />}>
        <DynamicCaseStudyPage params={params} />
      </Suspense>
    );
  }

  const { slug } = await params;
  return (
    <CachedCaseStudyPage
      slug={slug}
      perspective="published"
      stega={false}
    />
  );
}

async function DynamicCaseStudyPage({ params }: PageProps) {
  const [{ slug }, options] = await Promise.all([
    params,
    getDynamicFetchOptions(),
  ]);
  return <CachedCaseStudyPage slug={slug} {...options} />;
}

async function CachedCaseStudyPage({
  slug,
  perspective,
  stega,
}: { slug: string } & DynamicFetchOptions) {
  "use cache";

  const [{ data: documents }, { data: cardDocuments }] = await Promise.all([
    sanityFetch({
      query: CASE_STUDY_QUERY,
      perspective,
      stega,
    }),
    sanityFetch({
      query: CASE_STUDIES_QUERY,
      perspective,
      stega,
    }),
  ]);

  const document = documents.find(
    (item) => cleanSanityString(item.slug) === slug,
  );
  if (!document) notFound();

  const study = mapCaseStudy(
    document as unknown as Parameters<typeof mapCaseStudy>[0],
  );
  const caseStudies = cardDocuments.map((card) =>
    mapCaseStudyCard(
      card as unknown as Parameters<typeof mapCaseStudyCard>[0],
    ),
  );
  const jsonLd = getCaseStudyStructuredData(study);
  const currentIndex = caseStudies.findIndex((item) => item.slug === slug);
  const nextStudy = caseStudies[(currentIndex + 1) % caseStudies.length];
  const hasNext = caseStudies.length > 1;
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Describes this specific project. The site-wide Person and WebSite
          nodes come from the root layout, and this block references them by
          `@id` rather than restating them. */}
      <JsonLd data={jsonLd} />
      <main className={cn(columnClass, "relative mx-auto flex-1")}>
        <div className="bg-hatch relative z-10 space-y-8 pb-12">
          <Band
            topRule={false}
            className={cn(columnPadding, "space-y-8 pt-32 md:pt-40")}
          >
            <Link
              href="/"
              className="text-ink-soft hover:text-brand-text inline-flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <LuArrowLeft /> Back to Home
            </Link>

            {/* ---------- Hero ---------- */}
            <header className="space-y-4">
              <h1 className="text-3xl md:text-4xl">
                {study.pageTitle ?? study.title}
              </h1>
              <p className="text-brand-text text-lg font-medium md:text-xl">
                {study.summary}
              </p>

              {study.tags && study.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {study.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-ink-faint"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </header>

            <MediaFrame media={study.heroMedia ?? study.media} priority />
          </Band>

          <Band className={cn(columnPadding, "space-y-8")}>
            {/* ---------- Facts ----------
              Ruled cells rather than a padded box: the gap is the rule, so the
              block reads as a table cut out of the page grid. */}
            {study.overview && study.overview.length > 0 && (
              <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {study.overview.map((fact) => (
                  <div
                    key={fact.label}
                    className="border-rule bg-brand/5 border p-6"
                  >
                    <dt className="text-ink-faint text-xs font-medium tracking-wide">
                      {fact.label}
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-pretty lg:text-base">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {/* ---------- The gist, for skimmers ---------- */}
            {(study.challenge || study.outcome) && (
              <div className={cn(splitGrid, "gap-6")}>
                {study.challenge && (
                  <section className={panelClass}>
                    <h2 className="text-xl font-semibold">The challenge</h2>
                    <p className="text-ink-soft mt-2 text-sm text-pretty lg:text-base">
                      {study.challenge}
                    </p>
                  </section>
                )}

                {study.outcome && (
                  <section className={panelClass}>
                    <h2 className="text-xl font-semibold">The outcome</h2>
                    <p className="text-ink-soft mt-2 text-sm text-pretty lg:text-base">
                      {study.outcome}
                    </p>
                  </section>
                )}
              </div>
            )}

            {/* ---------- What I did ----------
              Full width under the pair above rather than a third column, so
              the responsibilities can run two abreast instead of stacking
              into a strip too narrow to read. */}
            {study.scope && (
              <section className={panelClass}>
                <h2 className="text-xl font-semibold">My role</h2>
                <p className="text-ink-soft mt-2 text-sm text-pretty lg:text-base">
                  {study.scope.summary}
                </p>

                {study.scope.responsibilities &&
                  study.scope.responsibilities.length > 0 && (
                    <>
                      {/* The list needs saying what it is. On its own under a
                          paragraph it could be read as work the team did, or
                          as features; naming it settles that it is the part I
                          owned. A label rather than a heading, since it names
                          the list under it and adds nothing to the outline
                          that "My role" has not already said. */}
                      <p className="text-brand-text mt-4 text-sm font-semibold tracking-wide">
                        What I was responsible for
                      </p>

                      {/* Columns, not a two-column grid. A grid couples the
                          two sides into shared rows, so one item that wrapped
                          to a second line stretched its whole row and left a
                          blank line beside it. Columns are independent: each
                          packs its own items and the browser balances them. */}
                      <ul className="text-ink-soft mt-2 gap-x-8 sm:columns-2">
                        {study.scope.responsibilities.map((item) => (
                          <li
                            key={item}
                            className="mb-1 text-sm break-inside-avoid text-pretty"
                          >
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
              </section>
            )}
          </Band>

          <Band className={cn(columnPadding, "space-y-8")}>
            {/* ---------- Who it is for ---------- */}
            {study.personas && study.personas.length > 0 && (
              <section className="space-y-4">
                <h2 className={sectionHeadingClass}>
                  Who it is for{" "}
                  <span className="text-ink-soft text-base font-normal md:text-lg">
                    (Personas, if you will..)
                  </span>
                </h2>
                <div className={cn(splitGrid, "gap-4")}>
                  {study.personas.map((persona) => (
                    <div
                      key={persona.title}
                      className="border-rule bg-paper border p-6"
                    >
                      {/* Tracks the description's size, including its step up
                          at `lg`, so the two never drift apart. */}
                      <p className="text-ink-faint text-sm font-medium tracking-wide lg:text-base">
                        {persona.label}
                      </p>
                      <h3 className="mt-1 text-xl font-semibold">
                        {persona.title}
                      </h3>
                      <p className="text-ink-soft mt-2 text-sm text-pretty lg:text-base">
                        {persona.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </Band>

          <Band className={cn(columnPadding, "space-y-8")}>
            {/* ---------- Chapters ----------
              Numbered by position and named by the project, so a study runs
              for as many chapters as its story needs rather than filling a
              fixed set of stages. */}
            {study.chapters && study.chapters.length > 0 && (
              <section className="space-y-6">
                <h2 className={sectionHeadingClass}>
                  How I approached the product
                </h2>

                <ol className="space-y-8">
                  {study.chapters.map((chapter, index) => (
                    <ChapterItem
                      key={chapter.title}
                      chapter={chapter}
                      index={index}
                      isLast={index === study.chapters!.length - 1}
                    />
                  ))}
                </ol>
              </section>
            )}
          </Band>

          <Band className={cn(columnPadding, "space-y-8")}>
            {/* ---------- Gallery ---------- */}
            {study.gallery && study.gallery.length > 0 && (
              <section className="space-y-6">
                <h2 className={sectionHeadingClass}>More from the project</h2>
                <div className={mediaGridClass(study.gallery)}>
                  {study.gallery.map((item) => (
                    <MediaFrame
                      key={item.kind === "image" ? item.alt : item.src}
                      media={item}
                      expandable
                      sizes={mediaSizes(study.gallery!)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ---------- Reflection ---------- */}
            {study.reflection && (
              <div className="space-y-3">
                <section className={panelClass}>
                  <h2 className="text-xl font-semibold">Looking back</h2>
                  <p className="text-ink-soft mt-2 text-sm text-pretty lg:text-base">
                    <RichText>{study.reflection}</RichText>
                  </p>
                </section>

                {study.disclaimer && (
                  <p className="text-ink-soft text-sm text-pretty">
                    <RichText>{study.disclaimer}</RichText>
                  </p>
                )}
              </div>
            )}

            {study.disclaimer && !study.reflection && (
              <p className="text-ink-soft text-sm text-pretty">
                <RichText>{study.disclaimer}</RichText>
              </p>
            )}

            {/* ---------- Links ---------- */}
            {study.links && Object.values(study.links).some(Boolean) && (
              <div className="flex flex-wrap gap-3">
                {study.links.figma && (
                  <Button asChild>
                    <ExternalLink
                      href={study.links.figma}
                      aria-label={`${study.title} on Figma (opens in new tab)`}
                    >
                      <IconBrandFigma data-icon="inline-start" />
                      Open in Figma
                    </ExternalLink>
                  </Button>
                )}
                {study.links.behance && (
                  <Button asChild variant="outline">
                    <ExternalLink
                      href={study.links.behance}
                      aria-label={`${study.title} on Behance (opens in new tab)`}
                    >
                      <IconBrandBehance data-icon="inline-start" />
                      View on Behance
                    </ExternalLink>
                  </Button>
                )}
                {study.links.live && (
                  <Button asChild variant="outline">
                    <ExternalLink
                      href={study.links.live}
                      aria-label={`${study.title} live site (opens in new tab)`}
                    >
                      <LuExternalLink data-icon="inline-start" />
                      Live site
                    </ExternalLink>
                  </Button>
                )}
              </div>
            )}
          </Band>

          <Band className={cn(columnPadding, "space-y-8")}>
            {/* ---------- Next project ---------- */}
            {hasNext && nextStudy && (
              <Link
                href={`/work/${nextStudy.slug}`}
                className="border-rule bg-paper hover:border-brand/50 group relative flex items-center justify-between gap-4 border p-6 transition-colors md:p-8"
              >
                <span>
                  <span className="text-ink-faint text-xs font-medium tracking-wide">
                    Next project
                  </span>
                  <span className="group-hover:text-brand-text mt-1 block text-xl font-semibold transition-colors">
                    {nextStudy.title}
                  </span>
                </span>
                <LuArrowRight
                  size={24}
                  className="shrink-0 transition-transform group-hover:translate-x-1"
                />
              </Link>
            )}
          </Band>
        </div>
      </main>
    </div>
  );
}
