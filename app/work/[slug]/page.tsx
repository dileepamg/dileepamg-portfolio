import MediaFrame from "@/components/CaseStudy/MediaFrame";
import ProcessStepItem, {
  stepColor,
  stepId,
} from "@/components/CaseStudy/ProcessStep";
import RichText from "@/components/CaseStudy/RichText";
import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";
import Nav from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  caseStudies,
  getCaseStudy,
} from "@/components/WorkSection/caseStudies";
import { cn } from "@/lib/utils";
import { IconBrandBehance, IconBrandFigma } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LuArrowLeft, LuArrowRight, LuExternalLink } from "react-icons/lu";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) return {};

  const heading = study.pageTitle ?? study.title;

  return {
    title: heading,
    description: study.summary,
    openGraph: {
      title: heading,
      description: study.summary,
      url: `/work/${study.slug}`,
      type: "article",
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) notFound();

  const currentIndex = caseStudies.findIndex((item) => item.slug === slug);
  const nextStudy = caseStudies[(currentIndex + 1) % caseStudies.length];
  const hasNext = caseStudies.length > 1;

  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="mx-auto w-[90%] flex-1 sm:max-w-[70%] md:max-w-[60%] 2xl:max-w-[40%]">
        <Nav />

        <div className="relative z-10 space-y-8 pt-35 pb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold hover:underline"
          >
            <LuArrowLeft /> Back to home
          </Link>

          {/* ---------- Hero ---------- */}
          <header className="space-y-4">
            <h1 className="text-3xl md:text-4xl">
              {study.pageTitle ?? study.title}
            </h1>
            <p className="text-lg font-bold text-[#ff4d50] md:text-xl">
              {study.summary}
            </p>

            {study.tags && study.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {study.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          <MediaFrame media={study.heroMedia ?? study.media} priority />

          {/* ---------- Facts ---------- */}
          {study.overview && study.overview.length > 0 && (
            <dl className="shadow-shadow grid grid-cols-2 gap-5 rounded-lg border-3 bg-white p-5 sm:grid-cols-4 md:p-6 dark:bg-black">
              {study.overview.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-xs font-bold tracking-wide text-gray-500 uppercase">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 text-sm font-bold text-pretty">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {/* ---------- The gist, for skimmers ---------- */}
          {(study.challenge || study.outcome) && (
            <div className="grid gap-6 md:grid-cols-2">
              {study.challenge && (
                <section className="shadow-shadow rounded-lg border-3 bg-white p-5 md:p-6 dark:bg-black">
                  <h2 className="text-xl font-bold">The challenge</h2>
                  <p className="mt-2 text-sm text-pretty lg:text-base">
                    {study.challenge}
                  </p>
                </section>
              )}

              {study.outcome && (
                <section className="shadow-shadow rounded-lg border-3 bg-white p-5 md:p-6 dark:bg-black">
                  <h2 className="text-xl font-bold">The outcome</h2>
                  <p className="mt-2 text-sm text-pretty lg:text-base">
                    {study.outcome}
                  </p>
                </section>
              )}
            </div>
          )}

          {/* ---------- Who it is for ---------- */}
          {study.personas && study.personas.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl">
                Who it is for{" "}
                <span className="text-base font-normal text-gray-500 md:text-lg">
                  (Personas, if you will..)
                </span>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {study.personas.map((persona) => (
                  <div
                    key={persona.title}
                    className="shadow-shadow rounded-lg border-2 bg-white p-4 dark:bg-black"
                  >
                    <p className="text-xs font-bold tracking-wide text-gray-500 uppercase">
                      {persona.label}
                    </p>
                    <h3 className="mt-1 text-lg font-bold">{persona.title}</h3>
                    <p className="mt-2 text-sm text-pretty">
                      {persona.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ---------- Process ---------- */}
          {study.process && study.process.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl md:text-3xl">How it came together</h2>

              {/* Jump links, so a long page stays navigable. */}
              <nav aria-label="Process steps">
                <ol className="flex flex-wrap gap-2">
                  {study.process.map((step, index) => (
                    <li key={step.title}>
                      <a
                        href={`#${stepId(index, step.title)}`}
                        className={cn(
                          "border-border shadow-shadow rounded-base hover:translate-x-boxShadowX hover:translate-y-boxShadowY flex items-center gap-2 border-2 px-3 py-1.5 text-xs font-bold text-black transition-transform hover:shadow-none",
                          stepColor,
                        )}
                      >
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <span>{step.phase}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>

              <ol className="space-y-8">
                {study.process.map((step, index) => (
                  <ProcessStepItem
                    key={step.title}
                    step={step}
                    index={index}
                    isLast={index === study.process!.length - 1}
                  />
                ))}
              </ol>
            </section>
          )}

          {/* ---------- Gallery ---------- */}
          {study.gallery && study.gallery.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl md:text-3xl">More from the project</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {study.gallery.map((item) => (
                  <MediaFrame
                    key={item.kind === "image" ? item.alt : item.src}
                    media={item}
                    expandable
                    sizes="(min-width: 768px) 30vw, 90vw"
                  />
                ))}
              </div>
            </section>
          )}

          {/* ---------- Reflection ---------- */}
          {study.reflection && (
            <section className="shadow-shadow rounded-lg border-3 bg-white p-5 md:p-6 dark:bg-black">
              <h2 className="text-xl font-bold">Looking back</h2>
              <p className="mt-2 text-sm text-pretty lg:text-base">
                <RichText>{study.reflection}</RichText>
              </p>
            </section>
          )}

          {/* ---------- Links ---------- */}
          {study.links &&
            (study.links.figma || study.links.behance || study.links.live) && (
              <div className="flex flex-wrap gap-3">
                {study.links.figma && (
                  <Button asChild>
                    <a
                      href={study.links.figma}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${study.title} on Figma (opens in new tab)`}
                    >
                      <IconBrandFigma />
                      Open in Figma
                    </a>
                  </Button>
                )}
                {study.links.behance && (
                  <Button asChild variant="neutral">
                    <a
                      href={study.links.behance}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${study.title} on Behance (opens in new tab)`}
                    >
                      <IconBrandBehance />
                      View on Behance
                    </a>
                  </Button>
                )}
                {study.links.live && (
                  <Button asChild variant="neutral">
                    <a
                      href={study.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${study.title} live site (opens in new tab)`}
                    >
                      <LuExternalLink />
                      Live site
                    </a>
                  </Button>
                )}
              </div>
            )}

          {/* ---------- Next project ---------- */}
          {hasNext && nextStudy && (
            <Link
              href={`/work/${nextStudy.slug}`}
              className="shadow-shadow group flex items-center justify-between gap-4 rounded-lg border-3 bg-white p-5 md:p-6 dark:bg-black"
            >
              <span>
                <span className="text-xs font-bold tracking-wide text-gray-500 uppercase">
                  Next project
                </span>
                <span className="mt-1 block text-xl font-bold">
                  {nextStudy.title}
                </span>
              </span>
              <LuArrowRight
                size={24}
                className="shrink-0 transition-transform group-hover:translate-x-1"
              />
            </Link>
          )}

          {/* ---------- Attribution ---------- */}
          {study.disclaimer && (
            <p className="border-border border-t-2 pt-6 text-xs text-pretty text-gray-500 dark:text-gray-400">
              <RichText>{study.disclaimer}</RichText>
            </p>
          )}
        </div>
      </main>

      <BackToTop />

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}
