import ReelplayTheme from "@/components/ReelplayTheme";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { videos } from "@/data/videos";
import Video from "next-video";

export default function FunStuffSection() {
  return (
    <section id="fun" className="scroll-mt-16">
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <h1 className="mb-2 text-2xl md:text-3xl">Some Fun Motion Stuff</h1>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pr-2 pb-4">
              <div className="my-2 grid grid-cols-1 gap-8 md:grid-cols-2">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="shadow-shadow overflow-hidden rounded-lg border-2"
                  >
                    <Video src={video.src} slot="media" theme={ReelplayTheme} />
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
