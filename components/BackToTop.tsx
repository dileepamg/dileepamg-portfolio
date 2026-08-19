"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { LuArrowUp } from "react-icons/lu";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 400);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <Button
      type="button"
      size="icon"
      aria-label="Back to top"
      className="fixed right-5 bottom-5 z-50"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <LuArrowUp />
    </Button>
  );
}
