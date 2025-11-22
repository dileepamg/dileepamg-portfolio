import type { Person, ProfilePage, WebSite, WithContext } from "schema-dts";

const SITE_URL = "https://dileepa.design";
const PAGE_URL = `${SITE_URL}/`;
const PERSON_ID = `${SITE_URL}#person`;
const WEBSITE_ID = `${SITE_URL}#website`;
const WEBPAGE_ID = `${PAGE_URL}#webpage`;

export function getProfileStructuredData() {
  const person: WithContext<Person> = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Dileepa Mahanama Galmangoda",
    givenName: "Dileepa",
    familyName: "Galmangoda",
    url: SITE_URL,
    image: {
      "@type": "ImageObject",
      url: `${SITE_URL}/dileepa-g.png`,
      width: "550",
      height: "550",
      caption: "Dileepa Mahanama Galmangoda",
    },
    sameAs: [
      "https://www.linkedin.com/in/dileepa-galmangoda",
      "https://github.com/dileepamg",
      "https://www.behance.net/dileepamg",
    ],
    mainEntityOfPage: { "@id": WEBPAGE_ID },
  };

  const website: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: "Dileepa Galmangoda | Portfolio",
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
