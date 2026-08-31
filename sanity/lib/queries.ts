import { defineQuery } from "next-sanity";

const imageProjection = `{
  alt,
  caption,
  crop,
  hotspot,
  asset->{
    _id,
    url,
    metadata {
      dimensions,
      lqip
    }
  }
}`;

const mediaProjection = `{
  _key,
  kind,
  image ${imageProjection},
  orientation,
  embedUrl,
  embedTitle,
  poster ${imageProjection},
  aspect,
  caption
}`;

export const SITE_SETTINGS_QUERY = defineQuery(`*[
  _type == "siteSettings" && _id == "siteSettings"
][0]{
  ...,
  author {
    ...,
    profileImage ${imageProjection},
    lanyardFront ${imageProjection},
    lanyardBack ${imageProjection}
  },
  resume {
    ...,
    asset->{url, originalFilename, mimeType}
  },
  defaultSeo {
    ...,
    image ${imageProjection}
  }
}`);

export const HOME_PAGE_QUERY = defineQuery(`*[
  _type == "homePage" && _id == "homePage"
][0]{
  ...,
  seo {
    ...,
    image ${imageProjection}
  }
}`);

export const RESUME_QUERY = defineQuery(`*[
  _type == "siteSettings" && _id == "siteSettings"
][0]{
  resume {
    downloadName,
    asset->{url, mimeType, originalFilename}
  }
}`);

export const CASE_STUDY_SLUGS_QUERY = defineQuery(`*[
  _type == "caseStudy" &&
  hidden != true &&
  defined(slug.current)
] | order(order asc) {
  "slug": slug.current
}`);

export const CASE_STUDIES_QUERY = defineQuery(`*[
  _type == "caseStudy" &&
  hidden != true &&
  defined(slug.current)
] | order(order asc) {
  _id,
  title,
  pageTitle,
  "slug": slug.current,
  previousSlugs,
  summary,
  description,
  tags,
  role,
  year,
  order,
  cardMedia ${mediaProjection}
}`);

export const CASE_STUDY_QUERY = defineQuery(`*[
  _type == "caseStudy" &&
  hidden != true
] | order(order asc) {
  ...,
  "slug": slug.current,
  cardMedia ${mediaProjection},
  heroMedia ${mediaProjection},
  process[]{
    ...,
    media[] ${mediaProjection}
  },
  gallery[] ${mediaProjection},
  seo {
    ...,
    image ${imageProjection}
  }
}`);

export const EXTERNAL_PROJECTS_QUERY = defineQuery(`*[
  _type == "externalProject" &&
  hidden != true
] | order(order asc) {
  _id,
  title,
  description,
  url,
  order,
  image ${imageProjection}
}`);

export const EXPERIENCES_QUERY = defineQuery(`*[
  _type == "experience"
] | order(order asc) {
  _id,
  role,
  company,
  companyUrl,
  dateLabel,
  responsibilities,
  skills,
  order,
  logoLight ${imageProjection},
  logoDark ${imageProjection}
}`);

export const MOTION_ITEMS_QUERY = defineQuery(`*[
  _type == "motionItem" &&
  hidden != true
] | order(order asc) {
  _id,
  title,
  muxPlaybackId,
  order,
  poster ${imageProjection}
}`);

export const BLOG_POST_SLUGS_QUERY = defineQuery(`*[
  _type == "post" &&
  defined(slug.current) &&
  publishedAt <= now()
] | order(publishedAt desc) {
  "slug": slug.current
}`);

export const BLOG_POSTS_QUERY = defineQuery(`*[
  _type == "post" &&
  defined(slug.current) &&
  publishedAt <= now()
] | order(publishedAt desc) {
  _id,
  _updatedAt,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  featured,
  tags,
  featuredImage ${imageProjection},
  categories[]->{_id, title, "slug": slug.current},
  body[]{
    _type,
    children[]{text},
    title,
    body,
    code,
    items[]{date, title, body}
  }
}`);

export const BLOG_POST_QUERY = defineQuery(`*[
  _type == "post" &&
  slug.current == $slug &&
  publishedAt <= now()
][0]{
  ...,
  "slug": slug.current,
  body[]{
    ...,
    _type == "imageWithAlt" => {
      ...,
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    }
  },
  featuredImage ${imageProjection},
  categories[]->{_id, title, "slug": slug.current},
  relatedPosts[]->{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    featuredImage ${imageProjection}
  },
  seo {
    ...,
    image ${imageProjection}
  }
}`);
