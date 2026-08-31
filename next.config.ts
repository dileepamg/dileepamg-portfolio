import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";
import { sanity } from "next-sanity/live/cache-life";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  cacheLife: { default: sanity },
  reactCompiler: true,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },

  /**
   * Response headers applied to everything the app serves.
   *
   * Deliberately not a Content-Security-Policy. A useful one here has to name
   * the analytics, Mux and Figma origins the page actually pulls from, and a
   * policy written without checking it against a production build fails
   * closed, taking the video player and the prototype embeds with it. These
   * four are the part that carries no such risk.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Stop the browser second-guessing a declared Content-Type, which is
          // what turns an uploaded or mistyped asset into a script.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Send the full URL only to this origin. Other sites get the origin
          // alone, so a case study slug never rides along to a third party.
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Nothing here is meant to be embedded elsewhere, and refusing that
          // removes clickjacking as a possibility.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // The page has no use for any of these, so it declines them up front
          // rather than relying on the reader to say no to a prompt. Fullscreen
          // is left alone, because the prototype embeds need it.
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ];
  },

};

export default withNextVideo(nextConfig);
