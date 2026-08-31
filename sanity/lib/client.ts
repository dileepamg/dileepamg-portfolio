import { createClient } from "next-sanity";
import {
  apiVersion,
  dataset,
  projectId,
  studioUrl,
} from "@/sanity/env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  stega: {
    studioUrl,
  },
});

/** SEO output must never contain stega's invisible source-map characters. */
export const metadataClient = client.withConfig({
  stega: false,
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
});
