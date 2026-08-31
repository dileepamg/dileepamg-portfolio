import { metadataClient } from "@/sanity/lib/client";
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

  const downloadName =
    settings?.resume?.downloadName ??
    asset.originalFilename ??
    "Dileepa-Galmangoda-Resume.pdf";

  return new Response(file.body, {
    headers: {
      "Content-Type": asset.mimeType || "application/pdf",
      "Content-Disposition": `attachment; filename="${downloadName.replaceAll(
        '"',
        "",
      )}"`,
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
