import { absoluteUrl } from "@/lib/site";
import { metadataClient } from "@/sanity/lib/client";
import {
  BLOG_POSTS_QUERY,
  CASE_STUDY_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import type { MetadataRoute } from "next";

/**
 * The sitemap is generated from the case study data rather than written out by
 * hand, so a new entry in `caseStudies` is discoverable the moment it ships and
 * a renamed slug can never leave a stale URL behind here.
 *
 * `lastModified` is deliberately omitted: an accurate value would have to come
 * from the content itself, and a build timestamp would tell crawlers every page
 * changed on every deploy, which is worse than saying nothing.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [caseStudies, posts] = await Promise.all([
    metadataClient.fetch(CASE_STUDY_SLUGS_QUERY),
    metadataClient.fetch(BLOG_POSTS_QUERY),
  ]);

  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...caseStudies.map((study) => ({
      url: absoluteUrl(`/work/${study.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
    {
      url: absoluteUrl("/blog"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post._updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
