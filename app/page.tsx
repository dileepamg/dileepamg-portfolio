import AboutSection from "@/components/AboutSection";
import BackToTop from "@/components/BackToTop";
import ExperienceSection from "@/components/ExperienceSection";
import Footer from "@/components/Footer";
import FunStuffSection from "@/components/FunStuffSection";
import Nav from "@/components/nav";
import { Band } from "@/components/ui/band";
import WorkSection from "@/components/WorkSection";
import { columnClass, columnPadding } from "@/lib/layout";
import { cn } from "@/lib/utils";

import { Suspense } from "react";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <main className={cn(columnClass, "relative mx-auto flex-1")}>
        <Nav />

        {/* The hatch shows through the gaps between bands, turning each gap
            into a channel with a rule on both sides rather than one shared
            divider. */}
        <div className="bg-hatch relative z-10 space-y-8">
          {/* Extra top padding clears the fixed nav. */}
          <Band
            topCrosses={false}
            className={cn(columnPadding, "pt-32 md:pt-40")}
          >
            <AboutSection />
          </Band>
          <Band className={columnPadding}>
            <WorkSection />
          </Band>
          <Band className={columnPadding}>
            <ExperienceSection />
          </Band>
          {/* Last band before the footer, so its bottom rule is the end of the
              page rather than a division between two sections, and nothing meets
              it there for a registration mark to mark. */}
          <Band bottomCrosses={false} className={columnPadding}>
            <FunStuffSection />
          </Band>
        </div>
      </main>
      <BackToTop />

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}
