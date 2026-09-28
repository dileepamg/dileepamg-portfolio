import { metadataClient } from "@/sanity/lib/client";
import { cleanSanityString } from "@/sanity/lib/mappers";
import { RESUME_QUERY } from "@/sanity/lib/queries";

export async function GET(request: Request) {
  const settings = await metadataClient.fetch(RESUME_QUERY);
  const asset = settings?.resume?.asset;

  if (!asset?.url) {
    return new Response("Resume not found", { status: 404 });
  }

  // /resume never changes while the file behind it does, so every request is
  // checked against the current upload rather than served from a cache. A
  // Sanity asset ID is derived from the file's contents, which makes it the
  // ETag: while it holds, the answer is a 304 and the PDF is not sent again.
  const etag = `"${asset._id}"`;
  const cacheControl = "public, no-cache";

  if (request.headers.get("if-none-match") === etag) {
    return new Response(null, {
      status: 304,
      headers: { ETag: etag, "Cache-Control": cacheControl },
    });
  }

  const file = await fetch(asset.url);

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
      "Cache-Control": cacheControl,
      ETag: etag,
    },
  });
}
