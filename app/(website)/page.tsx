import AboutSection from "@/components/AboutSection";
import { BlogSection } from "@/components/Blog/BlogSection";
import ExperienceSection from "@/components/ExperienceSection";
import FunStuffSection from "@/components/FunStuffSection";
import { HomePageSkeleton } from "@/components/loading/PageSkeletons";
import { Band } from "@/components/ui/band";
import WorkSection from "@/components/WorkSection";
import { columnClass, columnPadding } from "@/lib/layout";
import { cn } from "@/lib/utils";
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
} from "@/sanity/lib/live";
import {
  cleanSanityString,
  mapBlogPostCard,
  mapCaseStudyCard,
  mapExperience,
  mapExternalProject,
  mapMotionItem,
} from "@/sanity/lib/mappers";
import {
  BLOG_POSTS_QUERY,
  CASE_STUDIES_QUERY,
  EXPERIENCES_QUERY,
  EXTERNAL_PROJECTS_QUERY,
  HOME_PAGE_QUERY,
  MOTION_ITEMS_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";
import { draftMode } from "next/headers";
import { Suspense } from "react";

export default async function Home() {
  const { isEnabled } = await draftMode();
  if (isEnabled) {
    return (
      <Suspense fallback={<HomePageSkeleton />}>
        <DynamicHome />
      </Suspense>
    );
  }

  return <CachedHome perspective="published" stega={false} />;
}

async function DynamicHome() {
  const options = await getDynamicFetchOptions();
  return <CachedHome {...options} />;
}

async function CachedHome({
  perspective,
  stega,
}: DynamicFetchOptions) {
  "use cache";

  const [
    { data: siteSettings },
    { data: homePage },
    { data: caseStudyDocuments },
    { data: externalProjectDocuments },
    { data: experienceDocuments },
    { data: blogDocuments },
    { data: motionDocuments },
  ] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY, perspective, stega }),
    sanityFetch({ query: HOME_PAGE_QUERY, perspective, stega }),
    sanityFetch({ query: CASE_STUDIES_QUERY, perspective, stega }),
    sanityFetch({ query: EXTERNAL_PROJECTS_QUERY, perspective, stega }),
    sanityFetch({ query: EXPERIENCES_QUERY, perspective, stega }),
    sanityFetch({ query: BLOG_POSTS_QUERY, perspective, stega }),
    sanityFetch({ query: MOTION_ITEMS_QUERY, perspective, stega }),
  ]);

  if (!siteSettings?.author || !homePage) {
    throw new Error(
      "Required Sanity singleton documents are missing. Run the content migration.",
    );
  }

  const caseStudies = caseStudyDocuments.map((study) =>
    mapCaseStudyCard(
      study as unknown as Parameters<typeof mapCaseStudyCard>[0],
    ),
  );
  const projects = externalProjectDocuments.map(mapExternalProject);
  const experiences = experienceDocuments.map(mapExperience);
  const posts = blogDocuments.slice(0, 2).map(mapBlogPostCard);
  const videos = motionDocuments.map(mapMotionItem);
  return (
    <div className="relative flex min-h-screen flex-col">
      <main className={cn(columnClass, "relative mx-auto flex-1")}>
        {/* The hatch shows through the gaps between bands, turning each gap
            into a channel with a rule on both sides rather than one shared
            divider. */}
        <div className="bg-hatch relative z-10 space-y-8">
          {/* Extra top padding clears the fixed nav. */}
          <Band
            topCrosses={false}
            className={cn(columnPadding, "pt-32 md:pt-40")}
          >
            <AboutSection
              name={siteSettings.author.displayName}
              jobTitle={siteSettings.author.jobTitle}
              bio={siteSettings.author.bio}
              scheduleUrl={
                siteSettings.scheduleUrl
                  ? cleanSanityString(siteSettings.scheduleUrl)
                  : "#"
              }
              resumeDownloadName={
                siteSettings.resume?.downloadName ??
                "Dileepa-Galmangoda-Resume.pdf"
              }
              greetingLatin={cleanSanityString(homePage.greetingLatin)}
              greetingSinhala={cleanSanityString(
                homePage.greetingSinhala,
              )}
              lanyardFrontUrl={
                siteSettings.author.lanyardFront?.asset?.url
              }
              lanyardBackUrl={
                siteSettings.author.lanyardBack?.asset?.url
              }
              socials={(siteSettings.socialLinks ?? []).map((link) => ({
                label: link.label,
                href: cleanSanityString(link.href),
                external: link.external ?? false,
              }))}
            />
          </Band>
          <Band className={columnPadding}>
            <WorkSection
              caseStudies={caseStudies}
              projects={projects}
              heading={homePage.workHeading}
            />
          </Band>
          <Band className={columnPadding}>
            <ExperienceSection
              experiences={experiences}
              heading={homePage.experienceHeading}
            />
          </Band>
          <Band className={columnPadding}>
            <BlogSection
              posts={posts}
              heading={homePage.blogHeading}
              description={homePage.blogDescription}
            />
          </Band>
          {/* Last band before the footer, so its bottom rule is the end of the
              page rather than a division between two sections, and nothing meets
              it there for a registration mark to mark. */}
          <Band bottomCrosses={false} className={columnPadding}>
            <FunStuffSection
              videos={videos}
              heading={homePage.motionHeading}
              description={homePage.motionDescription}
            />
          </Band>
        </div>
      </main>
    </div>
  );
}
