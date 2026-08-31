import { isAllowedPreviewUrl } from "@/lib/external-link";

const TITLE_REGEX = /<title[^>]*>([^<]+)<\/title>/i;
const OG_TITLE_REGEX =
  /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i;
const DESCRIPTION_REGEX =
  /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i;
const OG_DESCRIPTION_REGEX =
  /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i;
const OG_IMAGE_REGEX =
  /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i;

export type GlimpsePreview = {
  title: string | null;
  description: string | null;
  image: string | null;
};

const emptyPreview: GlimpsePreview = {
  title: null,
  description: null,
  image: null,
};

const NAMED_HTML_ENTITIES: Record<string, string> = {
  amp: "&",
  apos: "'",
  quot: '"',
  lt: "<",
  gt: ">",
  nbsp: "\u00a0",
};

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&#(\d+);/g, (_, code) => {
      const point = Number(code);
      return Number.isFinite(point) ? String.fromCodePoint(point) : _;
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => {
      const point = Number.parseInt(code, 16);
      return Number.isFinite(point) ? String.fromCodePoint(point) : _;
    })
    .replace(/&([a-z]+);/gi, (entity, name) => {
      return NAMED_HTML_ENTITIES[name.toLowerCase()] ?? entity;
    });
}

function decodePreviewField(value: string | undefined) {
  if (!value) {
    return null;
  }

  const decoded = decodeHtmlEntities(value.trim());
  return decoded || null;
}

export async function glimpse(url: string): Promise<GlimpsePreview> {
  if (!isAllowedPreviewUrl(url)) {
    return emptyPreview;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PortfolioGlimpse/1.0)",
        Accept: "text/html",
      },
      next: { revalidate: 86_400 },
    });

    if (!response.ok) {
      return emptyPreview;
    }

    const data = await response.text();
    const titleMatch = data.match(TITLE_REGEX) ?? data.match(OG_TITLE_REGEX);
    const descriptionMatch =
      data.match(DESCRIPTION_REGEX) ?? data.match(OG_DESCRIPTION_REGEX);
    const imageMatch = data.match(OG_IMAGE_REGEX);

    return {
      title: decodePreviewField(titleMatch?.[1]),
      description: decodePreviewField(descriptionMatch?.[1]),
      image: decodePreviewField(imageMatch?.[1]),
    };
  } catch {
    return emptyPreview;
  } finally {
    clearTimeout(timeout);
  }
}
