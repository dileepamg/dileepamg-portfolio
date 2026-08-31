import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/site";
import type {
  BlogPosting,
  BreadcrumbList,
  WithContext,
} from "schema-dts";

const PERSON_ID = `${SITE_URL}#person`;
const WEBSITE_ID = `${SITE_URL}#website`;

type BlogPostStructuredDataInput = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  imageUrl: string;
};

export function getBlogPostStructuredData(
  post: BlogPostStructuredDataInput,
) {
  const pageUrl = absoluteUrl(`/blog/${post.slug}`);

  const article: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${pageUrl}#article`,
    headline: post.title,
    description: post.description,
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    image: post.imageUrl,
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
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
        name: "Blog",
        item: absoluteUrl("/blog"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: pageUrl,
      },
    ],
  };

  return [article, breadcrumbs];
}
