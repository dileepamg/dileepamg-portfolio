"use client";

import clsx from "clsx";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Nav() {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const links = [
    {
      path: "/",
      text: "Home",
    },
    {
      path: "/about",
      text: "About",
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
    <div className="fixed top-5 left-5 z-50 w-full">
      {/* Desktop Navigation */}
      <nav className="text-main-foreground border-border shadow-shadow rounded-base bg-secondary-background font-base mx-auto hidden w-max gap-5 border-2 p-2.5 px-5 text-sm sm:flex sm:text-base">
        {links.map((link) => {
          return (
            <Link
              key={link.path}
              className={clsx(
                "hover:border-border rounded-base border-2 px-2 py-1 transition-colors",
                path === link.path ? "border-border" : "border-transparent",
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
          className="text-main-foreground border-border shadow-shadow rounded-base bg-main ml-5 flex items-center justify-center border-2 p-2.5"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm"
              onClick={closeMenu}
            />

            {/* Menu Content */}
            <div className="text-main-foreground border-border shadow-shadow rounded-base bg-main absolute top-16 right-5 left-5 border-2 p-4">
              <div className="flex flex-col gap-2">
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
