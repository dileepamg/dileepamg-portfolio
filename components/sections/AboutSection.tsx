import { Button } from "@/components/ui/button";
import WelcomeText from "@/components/WelcomeText";
import ProfilePic from "@/public/dileepa-g.png";
import Image from "next/image";
import Link from "next/link";
import { FaBehance, FaGithub, FaLinkedin } from "react-icons/fa6";

import { LuDownload, LuSend } from "react-icons/lu";
export default function AboutSection() {
  return (
    <section id="about" className="scroll-mt-16 pt-35 align-top">
      <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
        <div className="order-2 md:order-1 md:w-[60%]">
          <h1 className="text-3xl md:text-4xl">Dileepa Galmangoda</h1>
          <p className="mt-1 [font-family:var(--font-pixelifysans)] text-xl md:text-2xl">
            UI/UX Designer
          </p>
          <p className="text-md mt-4 text-pretty break-words sm:text-lg md:mt-8">
            <WelcomeText /> 🙏 I design digital experiences that feel natural
            and engaging by refining interfaces, content and prototypes.
            Alongside my UI/UX work, I also create visuals and digital content
            across different formats. Currently, I’m a Senior UI/UX Designer at
            Villvay.
          </p>

          <div className="flex flex-row gap-4 py-4">
            <Button asChild variant="neutral">
              <Link href="/DileepaG-CV-2025.pdf" download>
                Download CV <LuDownload />
              </Link>
            </Button>

            <Button asChild>
              <a href="mailto:dileepagalmangoda@gmail.com">
                Contact Me <LuSend />
              </a>
            </Button>
          </div>

          <div className="mt-6 flex justify-start space-x-5">
            {/* <a href="#" target="_blank">
              <IconBrandFigma
                size="32px"
                className="bg-white opacity-60 hover:opacity-100 dark:bg-black"
              />
            </a> */}
            <a href="https://www.behance.net/dileepamg" target="_blank">
              <FaBehance
                size="32px"
                className="bg-white opacity-60 hover:opacity-100 dark:bg-black"
              />
            </a>
            <a
              href="https://www.linkedin.com/in/dileepa-galmangoda/"
              target="_blank"
            >
              <FaLinkedin
                size="32px"
                className="bg-white opacity-60 hover:opacity-100 dark:bg-black"
              />
            </a>
            <a href="https://github.com/dileepamg" target="_blank">
              <FaGithub
                size="32px"
                className="bg-white opacity-60 hover:opacity-100 dark:bg-black"
              />
            </a>
          </div>
        </div>
        <div className="shadow-shadow-2xl relative order-1 min-h-[200px] min-w-[200px] overflow-hidden rounded-4xl md:order-2 md:h-[300px] md:w-[300px]">
          <Image
            src={ProfilePic}
            fill
            placeholder="blur"
            className="object-cover"
            alt="Portrait"
          />
        </div>
      </div>
    </section>
  );
}
