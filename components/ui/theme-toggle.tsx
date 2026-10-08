"use client";

import React from "react";
import { useTheme } from "@/hooks/use-theme";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div
        className={cn(
          "w-9 h-9 rounded-xl bg-neutral-800/60 border border-neutral-700/60 flex items-center justify-center animate-pulse",
          className
        )}
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={`Switch to ${isDark ? "Light" : "Dark"} mode`}
      aria-label="Toggle visual theme"
      className={cn(
        "relative w-9 h-9 rounded-xl bg-neutral-800/80 hover:bg-neutral-700/90 border border-neutral-700/60 text-neutral-300 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm active:scale-95",
        className
      )}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-violet-400 transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
}
