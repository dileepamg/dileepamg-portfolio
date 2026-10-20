import MediaFrame, {
  mediaGridClass,
  mediaSizes,
} from "@/components/CaseStudy/MediaFrame";
import ChapterItem, { chapterId } from "@/components/CaseStudy/Chapter";
import { ChapterNav } from "@/components/CaseStudy/ChapterNav";
import RichText from "@/components/CaseStudy/RichText";
import { ExternalLink } from "@/components/ExternalLink";
import { CaseStudyPageSkeleton } from "@/components/loading/PageSkeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/structured-data/JsonLd";
import { getCaseStudyStructuredData } from "@/components/structured-data/caseStudy";
import { caseStudyMediaName } from "@/components/WorkSection/CaseStudyCard";
import { imageSizes, ratioOf, splitGrid } from "@/lib/layout";
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
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense, ViewTransition } from "react";
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

/** The headings that open each part of the story. */
const sectionHeadingClass =
  "text-[1.375rem] tracking-[-0.015em] sm:text-2xl";

/** The smaller headings inside the summary block. */
const summaryHeadingClass = "text-ink text-base font-semibold";

/** Small labels: fact names, the "Next project" caption. Sentence case. */
const labelClass = "text-ink-faint text-xs";

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
    <CachedCaseStudyPage slug={slug} perspective="published" stega={false} />
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
    mapCaseStudyCard(card as unknown as Parameters<typeof mapCaseStudyCard>[0]),
  );
  const jsonLd = getCaseStudyStructuredData(study);
  const currentIndex = caseStudies.findIndex((item) => item.slug === slug);
  const nextStudy = caseStudies[(currentIndex + 1) % caseStudies.length];
  const hasNext = caseStudies.length > 1;
  const heroMedia = study.heroMedia ?? study.media;
  const nextImage =
    nextStudy &&
    (nextStudy.media.kind === "image"
      ? nextStudy.media.src
      : nextStudy.media.poster);

  return (
    <>
      {/* Describes this specific project. The site-wide Person and WebSite
          nodes come from the root layout, and this block references them by
          `@id` rather than restating them. */}
      <JsonLd data={jsonLd} />

      <main id="main" className="page-grid flex-1">
        <nav aria-label="Breadcrumb" className="pt-8 sm:pt-12">
          <Link
            href="/#work"
            className="text-brand-text inline-flex items-center gap-1.5 text-xs underline-offset-4 hover:underline"
          >
            <LuArrowLeft className="size-3.5" aria-hidden="true" />
            Back to Home
          </Link>
        </nav>

        {/* ---------- Hero ---------- */}
        <header className="mt-8 sm:mt-10">
          <h1 className="text-[1.875rem] leading-tight tracking-[-0.02em] sm:text-[2.25rem]">
            {study.pageTitle ?? study.title}
          </h1>
          <p className="text-ink-soft mt-4 text-lg text-pretty sm:text-xl sm:leading-relaxed">
            {study.summary}
          </p>

          {study.tags && study.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {study.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          )}
        </header>

        {/* The same view-transition name as the home page card, so the
            picture morphs from there to here. */}
        <div className="bleed-wide mt-10 sm:mt-12">
          <ViewTransition
            name={caseStudyMediaName(study.slug)}
            share="morph"
            default="none"
          >
            <MediaFrame media={heroMedia} priority sizes={imageSizes.wide} />
          </ViewTransition>
        </div>

        {/* ---------- Facts ---------- */}
        {study.overview && study.overview.length > 0 && (
          <dl className="border-rule mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-y py-6 sm:grid-cols-4">
            {study.overview.map((fact) => (
              <div key={fact.label}>
                <dt className={labelClass}>{fact.label}</dt>
                <dd className="text-ink mt-1.5 text-sm font-medium text-pretty">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {/* ---------- The gist, for skimmers ---------- */}
        {(study.challenge || study.outcome) && (
          <div className={cn(splitGrid, "mt-12 gap-x-10 gap-y-8")}>
            {study.challenge && (
              <section>
                <h2 className={summaryHeadingClass}>The challenge</h2>
                <p className="text-ink-soft mt-2 text-pretty">
                  {study.challenge}
                </p>
              </section>
            )}

            {study.outcome && (
              <section>
                <h2 className={summaryHeadingClass}>The outcome</h2>
                <p className="text-ink-soft mt-2 text-pretty">
                  {study.outcome}
                </p>
              </section>
            )}
          </div>
        )}

        {/* ---------- What I did ---------- */}
        {study.scope && (
          <section className="bg-surface-2 rounded-frame mt-10 p-6 sm:p-8">
            <h2 className={summaryHeadingClass}>My role</h2>
            <p className="text-ink-soft mt-2 text-pretty">
              {study.scope.summary}
            </p>

            {study.scope.responsibilities &&
              study.scope.responsibilities.length > 0 && (
                <>
                  {/* Named, so the list reads as the part I owned rather than
                      as work the team did, or as features. */}
                  <p className="text-ink mt-6 text-sm font-medium">
                    What I was responsible for
                  </p>

                  {/* Columns, not a two-column grid: a grid couples the two
                      sides into shared rows, so one item that wrapped would
                      leave a blank line beside it. */}
                  <ul className="text-ink-soft marker:text-ink-faint mt-3 list-disc gap-x-10 pl-4 text-[0.9375rem] sm:columns-2">
                    {study.scope.responsibilities.map((item) => (
                      <li
                        key={item}
                        className="mb-1.5 break-inside-avoid text-pretty"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}
          </section>
        )}

        {/* ---------- Who it is for ---------- */}
        {study.personas && study.personas.length > 0 && (
          <section className="mt-20 sm:mt-24">
            <h2 className={sectionHeadingClass}>
              Who it is for{" "}
              <span className="text-ink-faint text-base font-normal tracking-normal">
                (Personas, if you will..)
              </span>
            </h2>
            <div className={cn(splitGrid, "mt-6 gap-4")}>
              {study.personas.map((persona) => (
                <div
                  key={persona.title}
                  className="bg-surface-2 rounded-frame p-5 sm:p-6"
                >
                  <h3 className="text-lg">{persona.title}</h3>
                  <p className="text-ink-soft mt-2 text-[0.9375rem] text-pretty">
                    {persona.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ---------- Chapters ----------
            A subgrid across the wide track, so the chapters stay in the
            reading column while the margin beside them holds the contents,
            pinned as you read. The margin only has room at `xl`; below that
            the chapter headings are the navigation. */}
        {study.chapters && study.chapters.length > 0 && (
          <section className="bleed-wide mt-20 grid grid-cols-subgrid sm:mt-24">
            <aside className="col-start-1 row-start-1 hidden pr-10 xl:block">
              <ChapterNav
                items={study.chapters.map((chapter) => ({
                  id: chapterId(chapter),
                  title: chapter.title,
                }))}
              />
            </aside>

            <div className="col-start-2 row-start-1 min-w-0">
              <h2 className={sectionHeadingClass}>
                How I approached the product
              </h2>

              <ol className="mt-10 space-y-20">
                {study.chapters.map((chapter) => (
                  <ChapterItem key={chapter.title} chapter={chapter} />
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* ---------- Gallery ---------- */}
        {study.gallery && study.gallery.length > 0 && (
          <section className="bleed-wide mt-20 sm:mt-24">
            {/* The heading stays on the reading column's edge while the
                pictures under it take the wide track. */}
            <div className="mx-auto max-w-(--reading-max)">
              <h2 className={sectionHeadingClass}>More from the project</h2>
            </div>
            <div className={cn("mt-8", mediaGridClass(study.gallery))}>
              {study.gallery.map((item) => (
                <MediaFrame
                  key={item.kind === "image" ? item.alt : item.src}
                  media={item}
                  expandable
                  sizes={mediaSizes(study.gallery!, { wide: true })}
                />
              ))}
            </div>
          </section>
        )}

        {/* ---------- Reflection ---------- */}
        {study.reflection && (
          <section className="mt-20 sm:mt-24">
            <h2 className={sectionHeadingClass}>Looking back</h2>
            <p className="text-ink-soft mt-4 text-lg text-pretty sm:leading-relaxed">
              <RichText>{study.reflection}</RichText>
            </p>
          </section>
        )}

        {study.disclaimer && (
          <p className="text-ink-faint mt-8 text-xs text-pretty">
            <RichText>{study.disclaimer}</RichText>
          </p>
        )}

        {/* ---------- Links ---------- */}
        {study.links && Object.values(study.links).some(Boolean) && (
          <div className="mt-10 flex flex-wrap gap-2">
            {study.links.figma && (
              <Button asChild>
                <ExternalLink
                  href={study.links.figma}
                  aria-label={`${study.title} on Figma (opens in new tab)`}
                >
                  <IconBrandFigma data-icon="inline-start" aria-hidden="true" />
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
                  <IconBrandBehance
                    data-icon="inline-start"
                    aria-hidden="true"
                  />
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
                  <LuExternalLink data-icon="inline-start" aria-hidden="true" />
                  Live site
                </ExternalLink>
              </Button>
            )}
          </div>
        )}

        {/* ---------- Next project ---------- */}
        {hasNext && nextStudy && (
          <Link
            href={`/work/${nextStudy.slug}`}
            className="group border-rule hover:bg-tint rounded-frame mt-20 flex items-center gap-4 border p-3 pr-5 transition-colors sm:mt-24 sm:gap-6"
          >
            {nextImage && (
              <ViewTransition
                name={caseStudyMediaName(nextStudy.slug)}
                share="morph"
                default="none"
              >
                <span
                  className="border-rule bg-surface-2 relative w-28 shrink-0 overflow-hidden rounded-md border sm:w-40"
                  style={{ aspectRatio: ratioOf(nextImage) }}
                >
                  <Image
                    src={nextImage}
                    alt=""
                    fill
                    placeholder="blur"
                    sizes="160px"
                    className="object-cover object-top"
                  />
                </span>
              </ViewTransition>
            )}
            <span className="min-w-0 flex-1">
              <span className={cn(labelClass, "block")}>Next project</span>
              <span className="text-ink mt-1 block text-lg font-semibold text-pretty">
                {nextStudy.title}
              </span>
            </span>
            <LuArrowRight
              aria-hidden="true"
              className="text-ink-faint group-hover:text-ink size-5 shrink-0 transition-[translate,color] group-hover:translate-x-1"
            />
          </Link>
        )}
      </main>
    </>
  );
}
