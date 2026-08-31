import { absoluteUrl } from "@/lib/site";
import type { MetadataRoute } from "next";

/**
 * Open to everything, including the assistant crawlers. GPTBot, ClaudeBot,
 * PerplexityBot and the rest all read the same `User-agent: *` rule. A portfolio
 * wants to be quotable by them, so there is nothing to disallow; the value of
 * this file is the sitemap pointer, which is how a crawler finds the case
 * study pages without depending on following links from the home page.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio/", "/api/draft-mode/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
