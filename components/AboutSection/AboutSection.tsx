import { Button } from "@/components/ui/button";
import { Highlighter } from "@/components/ui/highlighter";
import WelcomeText from "@/components/WelcomeText";
import ProfilePic from "@/public/dileepa-g.png";
import Image from "next/image";
import Link from "next/link";
import { FaBehance, FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { LuCalendarDays, LuDownload } from "react-icons/lu";

export default function AboutSection() {
  return (
    <section id="about" className="scroll-mt-16 pt-35 align-top">
      <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
        <div className="order-2 md:order-1 md:w-[60%]">
          <h1 className="text-3xl md:text-4xl">Dileepa Galmangoda</h1>
          <p className="mt-1 [font-family:var(--font-handjet)] text-xl md:text-2xl">
            UI/UX Designer & Creative Generalist
          </p>
          <p className="text-md mt-4 leading-8 text-pretty break-words sm:text-lg md:mt-8">
            <WelcomeText /> 🙏 I design{" "}
            <Highlighter
              action="underline"
              color="#4ed3c7"
              strokeWidth={2}
              padding={0.2}
              iterations={2}
            >
              digital experiences
            </Highlighter>{" "}
            that make every interface feel like it already understands what the
            user is trying to do. My work moves between shaping flows, refining
            designs, building prototypes and using AI-assisted workflows to
            explore and improve ideas. I’m currently a Senior UI/UX Designer at
            Villvay.
          </p>

          <div className="flex flex-row gap-4 py-4">
            <Button asChild variant="neutral">
              <Link href="/DileepaG-CV-2026.pdf" download>
                <LuDownload /> Download CV
              </Link>
            </Button>

            <Button asChild>
              <a
                href="https://calendar.app.google/3QVZ8AywYnCyzrpLA"
                target="_blank"
              >
                <LuCalendarDays /> Schedule a Call
              </a>
            </Button>
          </div>

          <div className="mt-6 flex justify-start space-x-5">
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
            <a href="https://x.com/xaradiyel/" target="_blank">
              <FaXTwitter
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
        <div className="shadow-shadow-2xl relative order-1 mr-2 min-h-[200px] min-w-[200px] overflow-hidden rounded-4xl md:order-2 md:h-[300px] md:w-[300px]">
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
