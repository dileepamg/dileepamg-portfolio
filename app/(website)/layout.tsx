import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";
import Nav from "@/components/nav";
import { JsonLd } from "@/components/structured-data/JsonLd";
import { getProfileStructuredData } from "@/components/structured-data/profile";
import { StudioVisualEditing } from "@/components/StudioVisualEditing";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteFrame } from "@/components/ui/site-frame";
import { SITE_URL } from "@/lib/site";
import {
  SanityLive,
  sanityFetchMetadata,
} from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { cleanSanityString, mapSanityLink } from "@/sanity/lib/mappers";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { draftMode } from "next/headers";

export const PRODUCTION_URL = SITE_URL;

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await sanityFetchMetadata({
    query: SITE_SETTINGS_QUERY,
    perspective: "published",
  });
  const title =
    settings?.defaultSeo.title ?? "Dileepa Mahanama Galmangoda";
  const description =
    settings?.defaultSeo.description ??
    "Senior UI/UX Designer & Creative Generalist from Sri Lanka. Specializing in product design, visual design, and motion to build engaging digital experiences.";
  const image = settings?.defaultSeo.image?.asset?.url;

  return {
    title: {
      default: title,
      template: `%s | ${settings?.author?.displayName ?? "Dileepa Galmangoda"}`,
    },
    description,
    keywords: settings?.defaultSeo.keywords,
    metadataBase: new URL(PRODUCTION_URL),
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      url: "/",
      type: "website",
      siteName: settings?.siteName,
      images: image ? [image] : ["/opengraph-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: settings?.twitterCreator,
      images: image ? [image] : ["/opengraph-image.png"],
    },
  };
}

export default async function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: settings } = await sanityFetchMetadata({
    query: SITE_SETTINGS_QUERY,
    perspective: "published",
  });
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const { isEnabled: isDraftMode } = await draftMode();
  const profileImage = settings?.author?.profileImage;
  const dimensions = profileImage?.asset?.metadata?.dimensions;
  const jsonLd =
    settings?.author &&
    getProfileStructuredData({
      fullName: settings.author.fullName,
      givenName: settings.author.givenName,
      familyName: settings.author.familyName,
      jobTitle: cleanSanityString(settings.author.jobTitle),
      description: cleanSanityString(settings.author.bio),
      ...(settings.email ? { email: cleanSanityString(settings.email) } : {}),
      imageUrl:
        profileImage?.asset?.url ?? `${SITE_URL}/dileepa-g.png`,
      imageWidth: dimensions?.width,
      imageHeight: dimensions?.height,
      sameAs: (settings.socialLinks ?? [])
        .map((link) => cleanSanityString(link.href))
        .filter((href) => href.startsWith("https://")),
      siteName: settings.siteName,
    });
  const navLinks = settings?.navigation.map((link) => ({
    path: cleanSanityString(link.href),
    text: cleanSanityString(link.label),
  }));

  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        <div className="flex min-h-screen flex-col">
          <SiteFrame />
          <Nav
            brandLabel={
              settings?.brandLabel
                ? cleanSanityString(settings.brandLabel)
                : undefined
            }
            links={navLinks}
          />
          <div className="flex flex-1 flex-col">{children}</div>
          <BackToTop />
          <Footer
            copyrightName={
              settings?.footer?.copyrightName
                ? cleanSanityString(settings.footer.copyrightName)
                : undefined
            }
            sourceLabel={
              settings?.footer?.sourceLabel
                ? cleanSanityString(settings.footer.sourceLabel)
                : undefined
            }
            sourceUrl={
              settings?.footer?.sourceUrl
                ? cleanSanityString(settings.footer.sourceUrl)
                : undefined
            }
            inspirationLinks={settings?.footer?.inspirationLinks?.map(
              mapSanityLink,
            )}
          />
          <SanityLive includeDrafts={isDraftMode} />
          {isDraftMode && <StudioVisualEditing />}
          <Analytics />
        </div>
      </ThemeProvider>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </>
  );
}
