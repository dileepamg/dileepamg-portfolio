import ReelplayTheme from "@/components/ReelplayTheme";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
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
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1" className="border-b-0">
          {/* `items-center` because this trigger has a two-line heading beside
              a button, and the inherited `items-start` pinned the button to the
              first line instead of the block it sits against. The other
              sections keep `items-start`: their headings are one line, paired
              with a chevron that shadcn already nudges to match it. */}
          <AccordionTrigger className="group items-center pt-0 [&>svg]:hidden">
            <SectionHeading
              title={heading}
              description={description}
            />
            <span className={buttonVariants({ variant: "outline" })}>
              <span className="group-data-[state=open]:hidden">View</span>
              <span className="hidden group-data-[state=open]:inline">
                Hide
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pb-4">
              <div className={cn(splitGrid, "my-2 gap-8")}>
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
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
