"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      size="icon"
      className="relative h-10 w-20"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="stroke-text w500:h-4 w500:w-4 hidden h-6 w-6 dark:inline" />
      <Moon className="stroke-text w500:h-4 w500:w-4 inline h-6 w-6 dark:hidden" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
