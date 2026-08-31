import { createClient } from "@sanity/client";

process.loadEnvFile?.(".env.local");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_READ_TOKEN,
  apiVersion: "2026-08-24",
  useCdn: false,
});

const result = await client.fetch(`{
  "siteSettings": count(*[_type == "siteSettings"]),
  "homePages": count(*[_type == "homePage"]),
  "caseStudies": *[_type == "caseStudy"]{
    _id,
    "slug": slug.current,
    hidden
  },
  "wurthDetail": *[
    _type == "caseStudy" &&
    hidden != true &&
    slug.current == "designing-wurth-baer-supply-company-app"
  ][0]{_id, title},
  "externalProjects": count(*[_type == "externalProject"]),
  "experiences": count(*[_type == "experience"]),
  "motionItems": count(*[_type == "motionItem"]),
  "posts": count(*[_type == "post"])
}`);

console.log(JSON.stringify(result, null, 2));
