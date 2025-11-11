import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import tracifiedConsumerAppImage from "@/media/tracified-consumer-app.jpg";
import { IconBrandBehance } from "@tabler/icons-react";
import Image from "next/image";

const projects = [
  {
    title: "Tracified Consumer App",
    description:
      "Tracified Consumer App was designed to provide users with a seamless way to explore a product's journey. By scanning a QR code or barcode, users can intuitively access transparent, traceable information about the product's lifecycle.",
    tools: ["Figma"],
    figma: "#",
    behance: "#",
    live: "#",
    image: tracifiedConsumerAppImage,
  },
  // {
  //   title: "QGIS Hub Plugin",
  //   description:
  //     "Developed at Camptocamp with hedesignedlp from Ismail Sunni, this plugin allows QGIS users to easily browse and add resources from the QGIS Hub directly into their projects. It supports grid and list views, search, and filtering by resource type.",
  //   tools: ["Figma", "Adobe Photoshop"],
  //   figma: "#",
  //   behance: "#",
  //   live: "#",
  //   image: tracifiedConsumerAppImage,
  // },
];

export default function WorkSection() {
  return (
    <section id="work" className="scroll-mt-16">
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <h1 className="mb-2 text-2xl md:text-3xl">My Work</h1>
          </AccordionTrigger>
          <AccordionContent>
            <div className="my-2 ml-2 grid grid-cols-1 gap-8 pr-2 md:grid-cols-1 lg:grid-cols-2">
              {projects.map((project) => (
                <div
                  key={project.title}
                  className="group dark:bg-darkBg shadow-shadow transform rounded-lg border-3 bg-white p-6 transition-transform hover:scale-102 dark:bg-black"
                >
                  <div className="relative mb-4 w-full overflow-hidden rounded-lg">
                    <Image
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      width={600}
                      height={469}
                    />
                  </div>

                  <h3 className="mb-2 transform text-2xl font-bold">
                    {project.title}
                  </h3>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.tools.map((tools) => (
                      <span
                        key={tools}
                        className="bg-white px-2 py-1 text-xs font-semibold dark:text-black"
                        style={{
                          border: "1px solid black",
                        }}
                      >
                        {tools}
                      </span>
                    ))}
                  </div>
                  <p className="dark:text-darkText sm:text-md mb-4 text-sm">
                    {project.description}
                  </p>

                  <div className="flex flex-col gap-4">
                    <div className="flex w-full gap-4">
                      {/* <a
                        href={project.figma}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shadow-shadow flex w-full transform items-center gap-2 border-2 bg-[#ff7237] px-2 py-2 text-black transition-transform hover:-translate-y-1 dark:text-black"
                      >
                        <IconBrandFigma />
                        Figma
                      </a> */}
                      <a
                        href={project.behance}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shadow-shadow flex w-full transform items-center gap-2 border-2 bg-blue-400 px-2 py-2 text-black transition-transform hover:-translate-y-1 dark:text-black"
                      >
                        <IconBrandBehance />
                        View on Behance <span className="ml-auto">↗</span>
                      </a>
                    </div>
                    {/* <div className="flex w-full gap-4">
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shadow-shadow flex w-full transform items-center gap-2 border-2 px-2 py-2 text-black transition-transform hover:-translate-y-1 dark:text-black"
                      >
                        <LuExternalLink size={20} />
                        Live Demo
                      </a>
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
