import type { CaseStudy } from "@/components/WorkSection/caseStudies";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/site";
import type { BreadcrumbList, CreativeWork, WithContext } from "schema-dts";

const PERSON_ID = `${SITE_URL}#person`;
const WEBSITE_ID = `${SITE_URL}#website`;

/**
 * Structured data for one case study.
 *
 * The `@id`s deliberately match the ones the profile block already publishes,
 * so a crawler reading a case study page resolves `author` to the same Person
 * node it built from the home page rather than inventing a second one.
 *
 * A `CreativeWork` rather than an `Article`: these pages describe a designed
 * artefact, and the fields that make an Article useful, such as a publication
 * date or a headline distinct from the work, are not things this content has.
 * Claiming them would mean inventing dates.
 */
export function getCaseStudyStructuredData(study: CaseStudy) {
  const pageUrl = absoluteUrl(`/work/${study.slug}`);
  const image =
    study.media.kind === "image" ? absoluteUrl(study.media.src.src) : undefined;

  const work: WithContext<CreativeWork> = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${pageUrl}#work`,
    url: pageUrl,
    name: study.pageTitle ?? study.title,
    alternateName: study.title,
    abstract: study.summary,
    description: study.description,
    author: { "@id": PERSON_ID },
    creator: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
    mainEntityOfPage: pageUrl,
    ...(image ? { image } : {}),
    ...(study.role ? { creditText: study.role } : {}),
    ...(study.tags?.length ? { keywords: [...study.tags] } : {}),
  };

  const breadcrumbs: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: SITE_NAME,
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: study.title,
        item: pageUrl,
      },
    ],
  };

  return [work, breadcrumbs];
}
