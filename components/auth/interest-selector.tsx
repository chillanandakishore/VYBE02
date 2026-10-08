"use client";

import React from "react";
import { AVAILABLE_INTERESTS } from "@/lib/db";
import { InterestCategory } from "@/types";
import {
  Camera,
  Film,
  Music,
  Cpu,
  Sparkles,
  Code,
  Gamepad2,
  Car,
  Compass,
  Dumbbell,
  Palette,
  Sparkle,
  BookOpen,
  Clapperboard,
  Utensils,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface InterestSelectorProps {
  selectedInterests: InterestCategory[];
  onChange: (interests: InterestCategory[]) => void;
  minSelection?: number;
}

const iconComponentMap: Record<string, React.ElementType> = {
  Camera,
  Film,
  Music,
  Cpu,
  Sparkles,
  Code,
  Gamepad2,
  Car,
  Compass,
  Dumbbell,
  Palette,
  Sparkle,
  BookOpen,
  Clapperboard,
  Utensils,
};

export function InterestSelector({
  selectedInterests,
  onChange,
  minSelection = 2,
}: InterestSelectorProps) {
  const toggleInterest = (category: InterestCategory) => {
    if (selectedInterests.includes(category)) {
      onChange(selectedInterests.filter((c) => c !== category));
    } else {
      onChange([...selectedInterests, category]);
    }
  };

  const isSelected = (cat: InterestCategory) => selectedInterests.includes(cat);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-white">Select Your Interests</h4>
          <p className="text-xs text-neutral-400">
            Pick at least {minSelection} categories to personalize your feed and discover your VYBES
          </p>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-semibold">
          {selectedInterests.length} selected
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto p-1 pr-2">
        {AVAILABLE_INTERESTS.map((item) => {
          const Icon = iconComponentMap[item.icon] || Sparkles;
          const active = isSelected(item.id);

          return (
            <button
              type="button"
              key={item.id}
              onClick={() => toggleInterest(item.id)}
              className={cn(
                "group relative flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer select-none",
                active
                  ? "bg-gradient-to-r from-violet-900/40 to-cyan-900/40 border-violet-500/80 shadow-md shadow-violet-900/20"
                  : "bg-neutral-900/40 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/80"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                  active
                    ? "bg-violet-600 text-white shadow-sm"
                    : "bg-neutral-800 text-neutral-400 group-hover:text-neutral-200"
                )}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-white block truncate">
                  {item.name}
                </span>
                <span className="text-[10px] text-neutral-400 line-clamp-1 block">
                  {item.description}
                </span>
              </div>

              {active && (
                <div className="w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
