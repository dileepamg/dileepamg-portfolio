"use client";
import { useEffect, useState } from "react";

export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer id="footer" className="mt-20 w-full bg-neutral-800 text-white">
      <div className="mx-auto flex w-[90%] flex-col-reverse items-center justify-center gap-4 py-10 sm:max-w-[70%] md:max-w-[60%] md:flex-row md:justify-between lg:max-w-[50%] 2xl:max-w-[40%]">
        <span className="space-y-1 text-center text-xs font-light sm:text-left">
          <p>
            Built with{" "}
            <a
              href="https://nextjs.org/"
              target="_blank"
              className="text-main hover:underline"
            >
              Next.js
            </a>
            {", "}
            <a
              href="https://tailwindcss.com/"
              target="_blank"
              className="text-main hover:underline"
            >
              Tailwind
            </a>
            {", "}
            <a
              href="https://www.neobrutalism.dev/"
              target="_blank"
              className="text-main hover:underline"
            >
              Neobrutalism Components
            </a>
          </p>
          <p>
            Devs pls don't roast me{" 🥺 "}
            <a
              href="#"
              target="_blank"
              className="text-main after:content-['_↗'] hover:underline"
            >
              GitHub
            </a>
          </p>
        </span>
        <span className="space-y-1 text-center text-xs font-light sm:text-right">
          <p>{year} &copy; Dileepa Galmangoda</p>
          <p className="text-neutral-400">
            Thanks for the inspo{" 💙 "}
            <a
              href="https://akhilaariyachandra.com/"
              target="_blank"
              className="underline"
            >
              Akhila
            </a>
            ,{" "}
            <a
              href="https://rcortiz.dev/"
              target="_blank"
              className="underline"
            >
              Ralph
            </a>
            {" & "}
            <a href="https://ronit.io/" target="_blank" className="underline">
              Ronit
            </a>
          </p>
        </span>
      </div>
    </footer>
  );
}
