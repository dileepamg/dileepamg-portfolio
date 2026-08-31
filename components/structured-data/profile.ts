import { SITE_URL } from "@/lib/site";
import type { Person, ProfilePage, WebSite, WithContext } from "schema-dts";

const PAGE_URL = `${SITE_URL}/`;
const PERSON_ID = `${SITE_URL}#person`;
const WEBSITE_ID = `${SITE_URL}#website`;
const WEBPAGE_ID = `${PAGE_URL}#webpage`;

type ProfileStructuredDataInput = {
  fullName: string;
  givenName: string;
  familyName: string;
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
    url: SITE_URL,
    image: {
      "@type": "ImageObject",
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
  };

  return [person, website, profilePage];
}
