"use client";
import Nav from "@/components/nav";
import AboutSection from "@/components/sections/AboutSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import WorkSection from "@/components/sections/WorkSection";
import Star34 from "@/components/stars/s34";

import { useEffect, useState } from "react";

export default function Home() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setRotation(scrollY * 0.1);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div>
      <div className="relative top-0">
        <div
          className="fixed -bottom-20 -left-20 z-0 hidden md:-bottom-30 md:-left-30 md:block md:opacity-100"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <Star34 color="#ff9a76" size={300} stroke="black" strokeWidth={2} />
        </div>

        {/* <div className="absolute -top-50 -left-20 z-0 hidden md:top-30 md:right-30 md:block md:opacity-100">
          <Star28 color="#90D1CA" size={100} stroke="black" strokeWidth={3} />
        </div> */}

        <div className="relative z-10 space-y-20 pt-35 pb-20 align-top">
          <div className="gap-2 space-y-8">
            <AboutSection />
            <ExperienceSection />
            <WorkSection />
          </div>
        </div>
        <Nav />
      </div>
    </div>
  );
}
