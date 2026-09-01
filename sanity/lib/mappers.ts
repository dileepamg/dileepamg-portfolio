import type {
  CaseStudy,
  CaseStudyMedia,
} from "@/components/WorkSection/caseStudies";
import { estimateReadingMinutes } from "@/lib/reading-time";
import type {
  CASE_STUDIES_QUERY_RESULT,
  CASE_STUDY_QUERY_RESULT,
  BLOG_POSTS_QUERY_RESULT,
  EXPERIENCES_QUERY_RESULT,
  EXTERNAL_PROJECTS_QUERY_RESULT,
  MOTION_ITEMS_QUERY_RESULT,
} from "@/sanity.types";
import { stegaClean } from "@sanity/client/stega";
import type { StaticImageData } from "next/image";

type ProjectedImage = NonNullable<
  CASE_STUDIES_QUERY_RESULT[number]["cardMedia"]["image"]
>;

type SanityMedia = {
  _key?: string | null;
  kind: "embed" | "image";
  image: ProjectedImage | null;
  orientation: "landscape" | "portrait" | null;
  embedUrl: string | null;
  embedTitle: string | null;
  poster: ProjectedImage | null;
  aspect: string | null;
  caption: string | null;
};

const required = <Value>(
  value: Value | null | undefined,
  field: string,
): Value => {
  if (value === null || value === undefined) {
    throw new Error(`Sanity content is missing required field: ${field}`);
  }

  return value;
};

export const cleanSanityString = <Value extends string>(value: Value) =>
  stegaClean(value);

export function mapSanityLink(link: {
  label: string;
  href: string;
  external?: boolean | null;
}) {
  return {
    label: cleanSanityString(link.label),
    href: cleanSanityString(link.href),
    external: link.external ?? false,
  };
}

function cleanOptionalUrl(value: string | null | undefined) {
  return value ? cleanSanityString(value) : undefined;
}

export function toStaticImageData(
  image: ProjectedImage,
  field: string,
): StaticImageData {
  const asset = required(image.asset, `${field}.asset`);
  const dimensions = required(
    asset.metadata?.dimensions,
    `${field}.asset.metadata.dimensions`,
  );

  return {
    src: asset.url,
    width: dimensions.width,
    height: dimensions.height,
    ...(asset.metadata?.lqip
      ? {
          blurDataURL: asset.metadata.lqip,
          blurWidth: 20,
          blurHeight: Math.max(
            1,
            Math.round(20 / dimensions.aspectRatio),
          ),
        }
      : {}),
  };
}

export function mapCaseStudyMedia(
  media: SanityMedia,
  field: string,
): CaseStudyMedia {
  const kind = stegaClean(media.kind);

  if (kind === "image") {
    const image = required(media.image, `${field}.image`);
    const orientation = media.orientation
      ? stegaClean(media.orientation)
      : "landscape";
    return {
      kind: "image",
      src: toStaticImageData(image, `${field}.image`),
      alt: cleanSanityString(image.alt),
      ...(media.caption
        ? { caption: cleanSanityString(media.caption) }
        : {}),
      orientation,
    };
  }

  const poster = media.poster
    ? toStaticImageData(media.poster, `${field}.poster`)
    : undefined;

  return {
    kind: "embed",
    src: stegaClean(required(media.embedUrl, `${field}.embedUrl`)),
    title: cleanSanityString(
      required(media.embedTitle, `${field}.embedTitle`),
    ),
    ...(media.caption
      ? { caption: cleanSanityString(media.caption) }
      : {}),
    ...(media.aspect ? { aspect: stegaClean(media.aspect) } : {}),
    ...(poster ? { poster } : {}),
  };
}

export function mapCaseStudyCard(
  study: CASE_STUDIES_QUERY_RESULT[number],
): CaseStudy {
  return {
    slug: cleanSanityString(study.slug),
    title: study.title,
    ...(study.pageTitle ? { pageTitle: study.pageTitle } : {}),
    summary: study.summary,
    description: study.description,
    ...(study.tags ? { tags: study.tags } : {}),
    ...(study.role ? { role: study.role } : {}),
    ...(study.year ? { year: study.year } : {}),
    media: mapCaseStudyMedia(study.cardMedia, `${study.slug}.cardMedia`),
  };
}

export function mapCaseStudy(
  study: CASE_STUDY_QUERY_RESULT[number],
): CaseStudy {
  return {
    slug: cleanSanityString(study.slug),
    title: study.title,
    ...(study.pageTitle ? { pageTitle: study.pageTitle } : {}),
    summary: study.summary,
    description: study.description,
    ...(study.tags ? { tags: study.tags } : {}),
    ...(study.role ? { role: study.role } : {}),
    ...(study.year ? { year: study.year } : {}),
    media: mapCaseStudyMedia(study.cardMedia, `${study.slug}.cardMedia`),
    ...(study.heroMedia
      ? {
          heroMedia: mapCaseStudyMedia(
            study.heroMedia,
            `${study.slug}.heroMedia`,
          ),
        }
      : {}),
    ...(study.links
      ? {
          links: {
            figma: cleanOptionalUrl(study.links.figma),
            behance: cleanOptionalUrl(study.links.behance),
            live: cleanOptionalUrl(study.links.live),
          },
        }
      : {}),
    ...(study.overview
      ? {
          overview: study.overview.map(({ label, value }) => ({
            label,
            value,
          })),
        }
      : {}),
    ...(study.challenge ? { challenge: study.challenge } : {}),
    ...(study.outcome ? { outcome: study.outcome } : {}),
    ...(study.scope
      ? {
          scope: {
            summary: study.scope.summary,
            ...(study.scope.responsibilities
              ? { responsibilities: study.scope.responsibilities }
              : {}),
          },
        }
      : {}),
    ...(study.personas
      ? {
          personas: study.personas.map(
            ({ label, title, description }) => ({
              label,
              title,
              description,
            }),
          ),
        }
      : {}),
    ...(study.chapters
      ? {
          chapters: study.chapters.map((chapter, chapterIndex) => ({
            // Cleaned: the anchor is written into an `id` attribute, where the
            // invisible characters stega adds for click to edit would leave it
            // no longer matching the link that points at it.
            ...(chapter.id ? { id: stegaClean(chapter.id) } : {}),
            title: chapter.title,
            ...(chapter.lede ? { lede: chapter.lede } : {}),
            ...(chapter.list
              ? {
                  list: {
                    ...(chapter.list.ordered ? { ordered: true } : {}),
                    items: chapter.list.items,
                  },
                }
              : {}),
            body: chapter.body,
            ...(chapter.decisions ? { decisions: chapter.decisions } : {}),
            ...(chapter.media
              ? {
                  media: chapter.media.map((media, mediaIndex) =>
                    mapCaseStudyMedia(
                      media,
                      `${study.slug}.chapters.${chapterIndex}.media.${mediaIndex}`,
                    ),
                  ),
                }
              : {}),
          })),
        }
      : {}),
    ...(study.gallery
      ? {
          gallery: study.gallery.map((media, index) =>
            mapCaseStudyMedia(media, `${study.slug}.gallery.${index}`),
          ),
        }
      : {}),
    ...(study.reflection
      ? { reflection: cleanSanityString(study.reflection) }
      : {}),
    ...(study.disclaimer
      ? { disclaimer: cleanSanityString(study.disclaimer) }
      : {}),
  };
}

export type ExternalProjectView = {
  title: string;
  description: string;
  behance: string;
  image: StaticImageData;
};

export const mapExternalProject = (
  project: EXTERNAL_PROJECTS_QUERY_RESULT[number],
): ExternalProjectView => ({
  title: project.title,
  description: project.description,
  behance: stegaClean(project.url),
  image: toStaticImageData(project.image, `${project._id}.image`),
});

export type ExperienceView = {
  role: string;
  companylogoLight: StaticImageData;
  companyLogoDark: StaticImageData;
  company: string;
  link: string;
  year: string;
  responsibility: readonly string[];
  techStacks: readonly string[];
};

export const mapExperience = (
  experience: EXPERIENCES_QUERY_RESULT[number],
): ExperienceView => ({
  role: experience.role,
  company: experience.company,
  link: stegaClean(experience.companyUrl),
  year: experience.dateLabel,
  responsibility: experience.responsibilities,
  techStacks: experience.skills,
  companylogoLight: toStaticImageData(
    experience.logoLight,
    `${experience._id}.logoLight`,
  ),
  companyLogoDark: toStaticImageData(
    experience.logoDark,
    `${experience._id}.logoDark`,
  ),
});

export type MotionItemView = {
  id: string;
  title: string;
  src: string;
};

export const mapMotionItem = (
  item: MOTION_ITEMS_QUERY_RESULT[number],
): MotionItemView => ({
  id: item._id,
  title: item.title,
  src: `https://stream.mux.com/${stegaClean(item.muxPlaybackId)}.m3u8`,
});

export type BlogPostCardView = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  readingMinutes: number;
  tags: readonly string[];
  categories: readonly {
    title: string;
    slug: string;
  }[];
  image: StaticImageData;
  imageAlt: string;
};

export const mapBlogPostCard = (
  post: BLOG_POSTS_QUERY_RESULT[number],
): BlogPostCardView => ({
  id: post._id,
  title: post.title,
  slug: cleanSanityString(post.slug),
  excerpt: post.excerpt,
  publishedAt: post.publishedAt,
  readingMinutes: estimateReadingMinutes(post.body),
  tags: post.tags ?? [],
  categories: (post.categories ?? []).map((category) => ({
    title: category.title,
    slug: cleanSanityString(category.slug),
  })),
  image: toStaticImageData(post.featuredImage, `${post._id}.featuredImage`),
  imageAlt: cleanSanityString(post.featuredImage.alt),
});
