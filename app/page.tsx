import Nav from "@/components/nav";
import Star34 from "@/components/stars/s34";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IconBrandBehance, IconBrandLinkedinFilled } from "@tabler/icons-react";
import { FileUser, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div>
      <div className="relative top-0">
        <div className="fixed -bottom-20 -left-20 z-0 hidden md:-bottom-30 md:-left-30 md:block md:opacity-100">
          <Star34 color="#ff9a76" size={300} stroke="black" strokeWidth={2} />
        </div>
        <div className="relative z-10">
          <Avatar className="mb-8 h-32 w-32">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>DG</AvatarFallback>
          </Avatar>
          <h1 className="text-3xl md:text-4xl">Dileepa Galmangoda</h1>
          <p className="font-per mt-1 [font-family:var(--font-pixelifysans)] text-xl md:text-2xl">
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
              <Sparkles />
              Fancy Version
            </Button>
            <Button>
              <FileUser />
              Boring Version (ATS)
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
        <Nav />
      </div>
    </div>
  );
}
