import WelcomeText from "@/components/WelcomeText";
import Image from "next/image";
import { FaBehance, FaGithub, FaLinkedin } from "react-icons/fa6";
export default function AboutSection() {
  return (
    <section id="about" className="scroll-mt-16 pt-35 align-top">
      <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
        <div className="order-2 md:order-1 md:w-[60%]">
          <h1 className="text-3xl md:text-4xl">Dileepa Galmangoda</h1>
          <p className="mt-1 [font-family:var(--font-pixelifysans)] text-xl md:text-2xl">
            UI/UX Designer
          </p>
          <p className="text-md mt-4 break-words sm:text-lg md:mt-8">
            <WelcomeText /> 🙏 I design experiences around real people and clear
            goals. My work starts with user behaviour and ends with outcomes the
            business can feel. Currently working as a Senior UI/UX Designer at
            Villvay, focused on turning complex ideas into interfaces that are
            simple, dependable, and a little more thoughtful every day.
          </p>

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
        <div className="shadow-shadow-2xl relative order-1 h-[300px] w-[300px] overflow-hidden rounded-4xl md:order-2 md:h-[320px] md:w-[320px]">
          <Image
            src="/dileepa-g.png"
            fill
            className="object-contain"
            alt="Portrait"
          />
        </div>
      </div>
    </section>
  );
}
