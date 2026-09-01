"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/theme-provider";

export function ThemeToggle() {
  const { toggleTheme } = useTheme();

  // Static label: the effective theme isn't known pre-hydration (default
  // is dark now), so a state-derived label would mismatch.
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
    >
      {/* Icon visibility follows the .dark class (set pre-hydration), so
          the correct icon shows even before React state catches up. */}
      <Sun className="size-4 dark:hidden" aria-hidden />
      <Moon className="hidden size-4 dark:block" aria-hidden />
    </Button>
  );
}
