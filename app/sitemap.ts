import { caseStudies } from "@/components/WorkSection/caseStudies";
import { absoluteUrl } from "@/lib/site";
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
export default function sitemap(): MetadataRoute.Sitemap {
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
  ];
}
