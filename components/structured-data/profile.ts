import { SITE_URL } from "@/lib/site";
import type { Person, ProfilePage, WebSite, WithContext } from "schema-dts";

const PAGE_URL = `${SITE_URL}/`;
const PERSON_ID = `${SITE_URL}#person`;
const WEBSITE_ID = `${SITE_URL}#website`;
const WEBPAGE_ID = `${PAGE_URL}#webpage`;
const PORTRAIT_ID = `${SITE_URL}#portrait`;

type ProfileStructuredDataInput = {
  fullName: string;
  givenName: string;
  familyName: string;
  /** The role, as the site states it. */
  jobTitle?: string;
  /** The About section's opening line, which is the page's own summary. */
  description?: string;
  email?: string;
  imageUrl: string;
  imageWidth?: number;
  imageHeight?: number;
  sameAs: readonly string[];
  siteName: string;
};

export function getProfileStructuredData(
  profile: ProfileStructuredDataInput,
) {
  const person: WithContext<Person> = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: profile.fullName,
    givenName: profile.givenName,
    familyName: profile.familyName,
    // Optional in the type because they are optional in the CMS, and a
    // property present with an empty value is worse markup than one absent.
    ...(profile.jobTitle ? { jobTitle: profile.jobTitle } : {}),
    ...(profile.description ? { description: profile.description } : {}),
    ...(profile.email ? { email: profile.email } : {}),
    url: SITE_URL,
    image: {
      "@type": "ImageObject",
      "@id": PORTRAIT_ID,
      url: profile.imageUrl,
      ...(profile.imageWidth
        ? { width: String(profile.imageWidth) }
        : {}),
      ...(profile.imageHeight
        ? { height: String(profile.imageHeight) }
        : {}),
      caption: profile.fullName,
    },
    sameAs: [...profile.sameAs],
    mainEntityOfPage: { "@id": WEBPAGE_ID },
  };

  const website: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: profile.siteName,
    publisher: { "@id": PERSON_ID },
  };

  const profilePage: WithContext<ProfilePage> = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": WEBPAGE_ID,
    url: PAGE_URL,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: { "@id": PERSON_ID },
    // The portrait is the page's own picture. Search engines choosing a
    // thumbnail weigh this alongside og:image, which on this page is the
    // branded share card; naming the portrait here is what tells them the
    // photo, not the card, is what the page is about.
    primaryImageOfPage: { "@id": PORTRAIT_ID },
    image: { "@id": PORTRAIT_ID },
  };

  return [person, website, profilePage];
}
