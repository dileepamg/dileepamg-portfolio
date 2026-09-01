import { metadataClient } from "@/sanity/lib/client";
import { cleanSanityString } from "@/sanity/lib/mappers";
import { RESUME_QUERY } from "@/sanity/lib/queries";

export async function GET() {
  const settings = await metadataClient.fetch(RESUME_QUERY);
  const asset = settings?.resume?.asset;

  if (!asset?.url) {
    return new Response("Resume not found", { status: 404 });
  }

  const file = await fetch(asset.url, {
    next: { revalidate: 3600 },
  });

  if (!file.ok || !file.body) {
    return new Response("Resume is temporarily unavailable", { status: 502 });
  }

  const downloadName = settings?.resume?.downloadName
    ? cleanSanityString(settings.resume.downloadName)
    : asset.originalFilename ?? "Dileepa-Galmangoda-Resume.pdf";

  // The filename reaches a response header, so it is reduced to characters
  // that are safe in one: quotes would end the parameter early, and a CR or
  // LF would be an attempt at a second header. Anything outside plain ASCII
  // goes too, since a header is latin-1 and Response rejects the rest.
  const safeName =
    downloadName
      .replace(/[^\x20-\x7e]/g, "")
      .replace(/["\\]/g, "")
      .trim() || "resume.pdf";

  return new Response(file.body, {
    headers: {
      "Content-Type": asset.mimeType || "application/pdf",
      "Content-Disposition": `attachment; filename="${safeName}"`,
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
