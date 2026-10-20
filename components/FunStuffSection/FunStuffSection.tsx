import { PlayerLabel } from "@/components/PlayerLabel";
import ReelplayTheme from "@/components/ReelplayTheme";
import { SectionHeading } from "@/components/ui/section-heading";
import Video from "next-video";
import type { Asset } from "next-video/dist/assets.js";

/**
 * A Mux stream as a ready asset.
 *
 * Given a plain URL, next-video asks its own API route to describe the video
 * before it will show a poster, and this site has no such route, so every tile
 * logged a failed request and stayed blank until pressed. Handing it a
 * finished asset skips the lookup, and Mux serves the poster frame itself.
 */
function muxAsset(src: string): Asset | string {
  const playbackId = /stream\.mux\.com\/([^./?]+)/.exec(src)?.[1];
  if (!playbackId) return src;
  return {
    status: "ready",
    originalFilePath: src,
    provider: "mux",
    providerMetadata: { mux: { playbackId } },
    sources: [{ src, type: "application/x-mpegURL" }],
    poster: `https://image.mux.com/${playbackId}/thumbnail.webp?width=640`,
    createdAt: 0,
    updatedAt: 0,
  };
}

type FunStuffSectionProps = {
  videos: readonly {
    id: string;
    title: string;
    src: string;
  }[];
  heading?: string;
  description?: string;
};

/**
 * The motion work, out in the open.
 *
 * It used to sit behind a "View" button, which hid one of the more distinctive
 * things on the page. Now it is a contact sheet: four square tiles, two
 * across. The players only fetch metadata until pressed, so showing them up
 * front costs a few kilobytes rather than four videos.
 */
export default function FunStuffSection({
  videos,
  heading = "Some Fun Motion Stuff",
  description = "A few playful motion experiments I made along the way.",
}: FunStuffSectionProps) {
  if (videos.length === 0) return null;

  return (
    <section id="fun" aria-labelledby="fun-heading">
      <SectionHeading
        id="fun-heading"
        title={heading}
        description={description}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {videos.map((video) => (
          <div
            key={video.id}
            className="border-rule border bg-surface-2 rounded-frame aspect-square overflow-hidden"
          >
            <PlayerLabel label={video.title}>
              <Video
                src={muxAsset(video.src)}
                aria-label={video.title}
                slot="media"
                theme={ReelplayTheme}
                className="h-full w-full object-cover"
                preload="metadata"
              />
            </PlayerLabel>
          </div>
        ))}
      </div>
    </section>
  );
}
