"use client";

import DecryptedText from "@/components/ui/shadcn-io/decrypted-text";
import { useState } from "react";

type WelcomeTextProps = {
  latin?: string;
  sinhala?: string;
};

export default function WelcomeText({
  latin = "Ayubowan",
  sinhala = "ආයුබෝවන්",
}: WelcomeTextProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <DecryptedText
        text={hovered ? sinhala : latin}
        speed={70}
        maxIterations={15}
        sequential={true}
        animateOn="hover"
        lang={hovered ? "si" : "en"}
        className={hovered ? "font-sinhala" : "font-sans"}
      />
    </span>
  );
}
