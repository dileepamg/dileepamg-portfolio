import AboutSection from "@/components/AboutSection";
import AiDisclaimer from "@/components/AiDisclaimer";
import ExperienceSection from "@/components/ExperienceSection";
import Footer from "@/components/Footer";
import FunStuffSection from "@/components/FunStuffSection";
import Nav from "@/components/nav";
import ScrollStar from "@/components/ScrollStar";
import ProfileStructuredData from "@/components/structured-data/profile";
import WorkSection from "@/components/WorkSection";

import { Suspense } from "react";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <ProfileStructuredData />
      <ScrollStar />
      <main className="mx-auto w-[90%] flex-1 space-y-8 sm:max-w-[70%] md:max-w-[60%] 2xl:max-w-[40%]">
        <Nav />
        <div className="relative z-10 space-y-8">
          <AboutSection />
          <div className="space-y-5">
            <WorkSection />

            <ExperienceSection />
            <FunStuffSection />
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
