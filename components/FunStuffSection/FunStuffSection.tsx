import ReelplayTheme from "@/components/ReelplayTheme";
import { Disclosure } from "@/components/ui/disclosure";
import { SectionHeading } from "@/components/ui/section-heading";
import { splitGrid } from "@/lib/layout";
import { cn } from "@/lib/utils";
import Video from "next-video";

type FunStuffSectionProps = {
  videos: readonly {
    id: string;
    title: string;
    src: string;
  }[];
  heading?: string;
  description?: string;
};

export default function FunStuffSection({
  videos,
  heading = "Some Fun Motion Stuff",
  description = "A few playful motion experiments I made along the way.",
}: FunStuffSectionProps) {
  return (
    <section id="fun" className="scroll-mt-28">
      {/* Closed by default, as it was under the accordion. The heading and the
          videos are passed in as props so they stay server rendered; only the
          toggle itself runs on the client. */}
      <Disclosure
        heading={<SectionHeading title={heading} description={description} />}
      >
        <div className={cn(splitGrid, "gap-8")}>
          {videos.map((video) => (
            <div
              key={video.id}
              className="border-rule bg-surface-2 aspect-square overflow-hidden border"
            >
              <Video
                src={video.src}
                aria-label={video.title}
                slot="media"
                theme={ReelplayTheme}
                className="h-full w-full object-cover"
                preload="metadata"
              />
            </div>
          ))}
        </div>
      </Disclosure>
    </section>
  );
}
