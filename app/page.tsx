"use client";
import Nav from "@/components/nav";
import Star34 from "@/components/stars/s34";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  IconBrandBehance,
  IconBrandFigma,
  IconBrandLinkedinFilled,
} from "@tabler/icons-react";
import { ExternalLink, FileUser } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import tracifiedConsumerAppImage from "../media/tracified-consumer-app.jpg";

const projects = [
  {
    title: "Tracified Consumer App",
    description:
      "Tracified Consumer App was designed to provide users with a seamless way to explore a product's journey. By scanning a QR code or barcode, users can intuitively access transparent, traceable information about the product's lifecycle.",
    tools: ["Figma", "Adobe Photoshop"],
    figma: "#",
    behance: "https://github.com/ronitjadhav/digipin-openlayers",
    live: "https://digipin.maplabs.tech",
    image: tracifiedConsumerAppImage, // Ensure this path is correct
  },
  {
    title: "QGIS Hub Plugin",
    description:
      "Developed at Camptocamp with help from Ismail Sunni, this plugin allows QGIS users to easily browse and add resources from the QGIS Hub directly into their projects. It supports grid and list views, search, and filtering by resource type.",
    tools: ["Figma", "Adobe Photoshop"],
    figma: "#",
    behance: "https://github.com/qgis/QGIS-Hub-Plugin",
    live: "https://plugins.qgis.org/plugins/qgis_hub_plugin/",
    image: tracifiedConsumerAppImage,
  },
];

export default function Home() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setRotation(scrollY * 0.1);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div>
      <div className="relative top-0">
        <div
          className="fixed -bottom-20 -left-20 z-0 hidden md:-bottom-30 md:-left-30 md:block md:opacity-100"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <Star34 color="#ff9a76" size={300} stroke="black" strokeWidth={2} />
        </div>

        {/* <div className="absolute -top-50 -left-20 z-0 hidden md:top-30 md:right-30 md:block md:opacity-100">
          <Star28 color="#90D1CA" size={100} stroke="black" strokeWidth={3} />
        </div> */}

        <div className="relative z-10 space-y-20 pt-35 pb-20 align-top">
          <div>
            <Avatar className="mb-8 h-32 w-32">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>DG</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl md:text-4xl">Dileepa Galmangoda</h1>
            <p className="mt-1 [font-family:var(--font-pixelifysans)] text-xl md:text-2xl">
              UI/UX Designer
            </p>
            <p className="mt-4 text-sm break-words sm:text-lg md:mt-8">
              I design things driven by user behaviours and business needs.
              <br />
              Currently designing at Villvay as a Senior UI/UX Designer.
            </p>
            <p className="mt-4 text-sm break-words sm:text-lg md:mt-8">
              I started my career as a creative designer doing freelance work in
              the digital marketing space. Since then I was engaged in digital
              marketing, graphic design, video and VFX for 3+ years working for
              companies such as zMessenger and Kimp. I transitioned into UI/UX
              design working at Tracified where I designed experiences for both
              web and mobile platforms.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <Button>
                <FileUser />
                Download CV
              </Button>
              <Button>
                <IconBrandBehance />
                Behance
              </Button>
              <Button>
                <IconBrandLinkedinFilled />
                LinkedIn
              </Button>
            </div>
          </div>
          {/* <div>
            
            <div id="work" className="flex flex-wrap gap-4">
              <iframe
                src="https://www.behance.net/embed/project/191408751?ilo0=1"
                width={320}
                height={300}
                allow="clipboard-write"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                scrolling="no"
                frameBorder={0}
              ></iframe>
              <iframe
                src="https://www.behance.net/embed/project/191566199?ilo0=1"
                width={320}
                height={300}
                allow="clipboard-write"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                scrolling="no"
                frameBorder={0}
              ></iframe>
            </div>
          </div> */}
          <div
            id="work"
            className="grid scroll-mt-16 grid-cols-1 gap-8 md:grid-cols-2"
          >
            {projects.map((project) => (
              <div
                key={project.title}
                className="group bg-bg dark:bg-darkBg shadow-shadow transform rounded-lg border-3 p-6 transition-transform hover:scale-102"
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
                    <a
                      href={project.figma}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full transform items-center gap-2 bg-[#ff7237] px-4 py-2 font-bold text-black transition-transform hover:-translate-y-1 hover:shadow-lg dark:text-black"
                      style={{
                        border: "2px solid black",
                        boxShadow: "4px 4px 0px 0px #000000",
                      }}
                    >
                      <IconBrandFigma />
                      Figma
                    </a>
                    <a
                      href={project.behance}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full transform items-center gap-2 bg-blue-400 px-4 py-2 font-bold text-black transition-transform hover:-translate-y-1 hover:shadow-lg dark:text-black"
                      style={{
                        border: "2px solid black",
                        boxShadow: "4px 4px 0px 0px #000000",
                      }}
                    >
                      <IconBrandBehance />
                      Behance
                    </a>
                  </div>
                  <div className="flex w-full gap-4">
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full transform items-center gap-2 px-4 py-2 font-bold text-black transition-transform hover:-translate-y-1 hover:shadow-lg dark:text-black"
                      style={{
                        border: "2px solid black",
                        boxShadow: "4px 4px 0px 0px #000000",
                      }}
                    >
                      <ExternalLink size={20} />
                      Live Demo
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Nav />
      </div>
    </div>
  );
}
