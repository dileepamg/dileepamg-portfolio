"use client";

import clsx from "clsx";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Nav() {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Watch scroll direction to show/hide nav
  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    {
      path: "/",
      text: "About",
    },
    {
      path: "/#career",
      text: "Career",
    },
    {
      path: "/#work",
      text: "Work",
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
        "fixed top-10 z-50 w-[80%] transition-transform duration-300 ease-in-out sm:max-w-[70%] md:max-w-[60%] xl:max-w-[50%]",
        {
          "-translate-y-[calc(100%+3rem)]": !isVisible,
          "translate-y-0": isVisible,
        },
      )}
    >
      {/* Desktop Navigation */}
      <nav className="text-main-foreground border-border bg-secondary-background font-base shadow-shadow mx-auto hidden gap-5 rounded-lg border-2 p-2.5 px-5 text-sm sm:flex sm:text-base">
        <p className="w-full [font-family:var(--font-sedgewickAve)] text-3xl">
          Dileepa·G
        </p>
        {links.map((link) => {
          return (
            <Link
              key={link.path}
              className={clsx(
                "px-2 py-1 transition-transform duration-300 hover:rotate-5",
                path === link.path,
              )}
              href={link.path}
            >
              {link.text}
            </Link>
          );
        })}
      </nav>

      {/* Mobile Navigation */}
      <div className="sm:hidden">
        {/* Hamburger Button */}
        <button
          onClick={toggleMenu}
          className="text-main-foreground border-border shadow-shadow rounded-base bg-secondary-background flex items-center justify-center border-2 p-2.5"
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
            <div className="text-main-foreground border-border shadow-shadow rounded-base bg-secondary-background absolute top-16 w-full border-2 p-4">
              <div className="flex flex-col gap-2">
                <p className="w-full pb-4 text-center [font-family:var(--font-sedgewickAve)] text-3xl">
                  Dileepa·G
                </p>
                {links.map((link) => {
                  return (
                    <Link
                      key={link.path}
                      className={clsx(
                        "hover:border-border rounded-base border-2 px-3 py-2 text-center transition-colors",
                        path === link.path
                          ? "border-border"
                          : "border-transparent",
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
