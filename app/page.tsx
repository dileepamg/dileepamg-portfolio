import Nav from "@/components/nav";
import ScrollStar from "@/components/ScrollStar";
import AboutSection from "@/components/sections/AboutSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import Footer from "@/components/sections/Footer";
import WorkSection from "@/components/sections/WorkSection";

export default function Home() {
  return (
    <div>
      <div className="relative top-0">
        <ScrollStar />
        <div className="relative z-10 space-y-20 pt-35 pb-20 align-top">
          <div className="gap-2 space-y-8">
            <AboutSection />
            <div className="gap-4">
              <ExperienceSection />
              <WorkSection />
            </div>
            <Footer />
          </div>
        </div>
        <Nav />
      </div>
    </div>
  );
}
