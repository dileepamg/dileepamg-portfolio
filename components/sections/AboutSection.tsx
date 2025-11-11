import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import WelcomeText from "@/components/WelcomeText";
import Image from "next/image";
import { FaBehance, FaGithub, FaLinkedin } from "react-icons/fa6";

import { LuArrowRight, LuDownload } from "react-icons/lu";
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
            <WelcomeText /> 🙏 I make complex journeys feel straightforward by
            shaping content, prototyping ideas, and keeping accessibility and
            consistency in view. In practice, that means clear language,
            predictable patterns, and flows that help people finish what they
            start without friction. Currently, I’m a Senior UI/UX Designer at
            Villvay.
          </p>
          <Dialog>
            <div className="flex flex-row gap-4 py-4">
              <Button variant="neutral">
                Download CV <LuDownload />
              </Button>
              <DialogTrigger asChild>
                <Button>
                  Contact Me <LuArrowRight />
                </Button>
              </DialogTrigger>
            </div>

            <form>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Contact Dileepa</DialogTitle>
                  <DialogDescription>
                    Fill this form to get in touch.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="name-1">Name</Label>
                    <Input id="name-1" name="name" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="email-1">Email</Label>
                    <Input id="email-1" name="email" type="email" />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="neutral">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Send</Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
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
        <div className="shadow-shadow-2xl relative order-1 h-[200px] w-[200px] overflow-hidden rounded-4xl md:order-2 md:h-[300px] md:w-[300px]">
          <Image
            src="/dileepa-g.png"
            fill
            className="object-cover"
            alt="Portrait"
          />
        </div>
      </div>
    </section>
  );
}
