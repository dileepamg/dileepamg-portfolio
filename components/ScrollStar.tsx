"use client";
import Star34 from "@/components/stars/s34";
import { useEffect, useState } from "react";

export default function ScrollStar() {
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
    <div
      className="fixed -bottom-20 -left-20 z-0 hidden md:-bottom-30 md:-left-30 md:block md:opacity-100"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <Star34 color="#f2b973" size={300} stroke="black" strokeWidth={2} />
    </div>
  );
}
