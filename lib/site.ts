/**
 * Site-wide identity.
 *
 * Every absolute URL the site emits (canonical tags, OpenGraph, the sitemap,
 * JSON-LD `@id`s) has to name the same origin, or search engines treat the
 * variants as competing copies of one page and split the ranking between them.
 * That is why this is a fixed constant rather than something derived from the
 * deployment: a preview build must still declare the production URL as
 * canonical, otherwise every preview competes with the real site.
 */
export const SITE_URL = "https://dileepa.design";

export const SITE_NAME = "Dileepa Galmangoda | Portfolio";

export const AUTHOR_NAME = "Dileepa Mahanama Galmangoda";

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}
