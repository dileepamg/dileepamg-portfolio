"use client";

import DecryptedText from "@/components/ui/shadcn-io/decrypted-text";
import { useState } from "react";

export default function WelcomeText() {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <DecryptedText
        text={hovered ? "ආයුබෝවන්" : "Ayubowan"}
        speed={70}
        maxIterations={15}
        sequential={true}
        animateOn="hover"
        className={
          hovered ? "[font-family:var(--font-notoSansSinhala)]" : "font-base"
        }
      />
    </span>
  );
}
