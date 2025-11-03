"use client";

import Script from "next/script";
import type { Person, ProfilePage, WebSite, WithContext } from "schema-dts";

const SITE_URL = "https://dileepa.design";
const PAGE_URL = `${SITE_URL}/`;
const PERSON_ID = `${SITE_URL}#person`;
const WEBSITE_ID = `${SITE_URL}#website`;
const WEBPAGE_ID = `${PAGE_URL}#webpage`;

export default function ProfileStructuredData() {
  const person: WithContext<Person> = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Dileepa Mahanama Galmangoda",
    givenName: "Dileepa",
    familyName: "Galmangoda",
    url: SITE_URL,
    image: `${SITE_URL}/dileepa-g.png`,
    sameAs: [
      "https://www.linkedin.com/in/dileepa-galmangoda",
      "https://github.com/dileepamg",
      "https://www.behance.net/dileepamg",
    ],
  };

  const website: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: "Dileepa Galmangoda | Portfolio",
  };

  const profilePage: WithContext<ProfilePage> = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": WEBPAGE_ID,
    url: PAGE_URL,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: { "@id": PERSON_ID },
  };

  return (
    <>
      <Script
        id="ld-person"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      <Script
        id="ld-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <Script
        id="ld-profilepage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePage) }}
      />
    </>
  );
}
