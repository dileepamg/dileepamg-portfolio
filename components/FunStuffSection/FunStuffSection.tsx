import ReelplayTheme from "@/components/ReelplayTheme";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Video from "next-video";
import { videos } from "./videos";

export default function FunStuffSection() {
  return (
    <section id="fun" className="scroll-mt-16">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <span className="mb-2 block text-left">
              <h1 className="text-2xl md:text-3xl">Some Fun Motion Stuff</h1>
              <span className="text-sm font-normal text-gray-500">
                Tucked away in here. Have a look if you fancy it.
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pr-2 pb-4">
              <div className="my-2 grid grid-cols-1 gap-8 md:grid-cols-2">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="shadow-shadow aspect-square overflow-hidden rounded-lg border-2 bg-gray-100 dark:bg-gray-800"
                  >
                    <Video
                      src={video.src}
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
