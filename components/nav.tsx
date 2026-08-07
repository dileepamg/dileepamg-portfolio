"use client";

import clsx from "clsx";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeSwitcher } from "./theme-switcher";

export default function Nav() {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const isNavigating = useRef(false);

  // Arriving on a page restores the previous scroll position or jumps to a
  // hash, and that fires a scroll event that looks exactly like scrolling
  // down. Show the nav on every route change and ignore those events briefly,
  // so it can't hide itself the moment a page loads.
  useEffect(() => {
    setIsVisible(true);
    isNavigating.current = true;

    const timer = window.setTimeout(() => {
      isNavigating.current = false;
      lastScrollY.current = window.scrollY;
    }, 500);

    return () => window.clearTimeout(timer);
  }, [path]);

  // Watch scroll direction to show/hide nav
  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (isNavigating.current) {
        lastScrollY.current = currentScrollY;
        return;
      }

      // Near the top the nav always shows, however the reader got there.
      setIsVisible(currentScrollY < 80 || currentScrollY < lastScrollY.current);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    {
      path: "/#about",
      text: "About",
    },
    {
      path: "/#work",
      text: "Work",
    },
    {
      path: "/#experience",
      text: "Experience",
    },
    {
      path: "/#fun",
      text: "Fun",
    },
  ];
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };
  return (
    <div
      className={clsx(
        "fixed top-10 z-50 w-[80%] transition-transform duration-300 ease-in-out sm:max-w-[70%] lg:max-w-[60%] 2xl:max-w-[40%]",
        {
          "-translate-y-[calc(100%+3rem)]": !isVisible,
          "translate-y-0": isVisible,
        },
      )}
    >
      {/* Desktop Navigation */}
      <nav className="border-border bg-secondary-background font-base shadow-shadow mx-auto hidden items-center gap-2 rounded-lg border-2 p-2.5 px-5 text-sm sm:flex sm:text-base lg:gap-4">
        <a
          href="/"
          className="w-full [font-family:var(--font-sedgewickAve)] text-3xl sm:text-2xl"
        >
          Dileepa·G
        </a>

        {links.map((link) => {
          return (
            <Link
              key={link.path}
              className={clsx(
                "px-2 py-2 transition-transform duration-300 hover:rotate-5",
                path === link.path,
              )}
              href={link.path}
            >
              {link.text}
            </Link>
          );
        })}
        <ThemeSwitcher />
      </nav>

      {/* Mobile Navigation */}
      <div className="mx-5 sm:hidden">
        {/* Hamburger Button */}
        <button
          onClick={toggleMenu}
          className="border-border shadow-shadow rounded-base bg-secondary-background flex items-center justify-center border-2 p-2.5"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0" onClick={closeMenu} />

            {/* Menu Content */}
            <div className="border-border shadow-shadow rounded-base bg-secondary-background absolute top-16 w-full border-2 p-4">
              <div className="flex flex-col gap-2">
                <div className="flex w-full flex-row justify-between pb-4">
                  <p className="text-center [font-family:var(--font-sedgewickAve)] text-3xl">
                    Dileepa·G
                  </p>
                  <ThemeSwitcher />
                </div>
                {links.map((link) => {
                  return (
                    <Link
                      key={link.path}
                      className={clsx(
                        "rounded-base border-2 px-3 py-2 text-center",
                        path === link.path,
                      )}
                      href={link.path}
                      onClick={closeMenu}
                    >
                      {link.text}
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
