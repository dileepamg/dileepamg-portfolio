"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-secondary-foreground/70 hover:bg-secondary-foreground/10 hover:text-secondary-foreground dark:hover:bg-secondary-foreground/10 dark:hover:text-secondary-foreground shrink-0"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="hidden size-5 dark:inline" />
      <Moon className="inline size-5 dark:hidden" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
