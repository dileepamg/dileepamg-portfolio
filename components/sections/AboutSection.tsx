import { IconBrandFigma } from "@tabler/icons-react";
import { FaBehance, FaGithub, FaLinkedin } from "react-icons/fa6";

export default function AboutSection() {
  return (
    <section id="about" className="scroll-mt-16">
      <div className="flex flex-row md:flex-col items-start justify-between gap-8">
        <div className="order-2 md:order-1">
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
          <div className="mt-10 flex justify-center space-x-5 md:justify-start">
            <a href="https://github.com/rcortiz" target="_blank">
              <IconBrandFigma
                size="32px"
                className="bg-white opacity-60 hover:opacity-100 dark:bg-black"
              />
            </a>
            <a href="https://github.com/rcortiz" target="_blank">
              <FaBehance
                size="32px"
                className="bg-white opacity-60 hover:opacity-100 dark:bg-black"
              />
            </a>
            <a href="https://github.com/rcortiz" target="_blank">
              <FaLinkedin
                size="32px"
                className="bg-white opacity-60 hover:opacity-100 dark:bg-black"
              />
            </a>
            <a href="https://github.com/rcortiz" target="_blank">
              <FaGithub
                size="32px"
                className="bg-white opacity-60 hover:opacity-100 dark:bg-black"
              />
            </a>
          </div>
          {/* <div className="mt-6 flex flex-wrap gap-4">
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
            </div> */}
        </div>
        <div className="order-1 md:order-2">
        <div className=""></div>
        
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
    </section>
  );
}
