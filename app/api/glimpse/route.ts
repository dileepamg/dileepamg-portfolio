import { glimpse } from "@/components/kibo-ui/glimpse/server";
import { isAllowedPreviewUrl } from "@/lib/external-link";

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url");

  if (!url || !isAllowedPreviewUrl(url)) {
    return Response.json(
      { title: null, description: null, image: null },
      { status: 400 },
    );
  }

  const preview = await glimpse(url);
  return Response.json(preview);
}
