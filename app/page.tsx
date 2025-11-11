import Nav from "@/components/nav";
import ScrollStar from "@/components/ScrollStar";
import AboutSection from "@/components/sections/AboutSection";
import AiDisclaimer from "@/components/sections/AiDisclaimer";
import ExperienceSection from "@/components/sections/ExperienceSection";
import Footer from "@/components/sections/Footer";
import WorkSection from "@/components/sections/WorkSection";
import ProfileStructuredData from "@/components/structured-data/profile";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <ProfileStructuredData />
      <ScrollStar />
      <main className="mx-auto w-[90%] flex-1 space-y-8 sm:max-w-[70%] md:max-w-[60%] lg:max-w-[50%] 2xl:max-w-[40%]">
        <Nav />
        <div className="relative z-10 space-y-8">
          <AboutSection />
          <div>
            <ExperienceSection />
            <WorkSection />
            <AiDisclaimer />
          </div>
        </div>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}
