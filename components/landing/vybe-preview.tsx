"use client";

import React from "react";
import { AVAILABLE_INTERESTS } from "@/lib/db";
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
  ArrowRight,
  Flame,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { TiltCard } from "@/components/3d/tilt-card";
import { CommunityGraph3D } from "@/components/3d/community-graph-3d";

const iconMap: Record<string, React.ElementType> = {
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

export function VybePreview() {
  return (
    <section id="vybes" className="py-20 bg-neutral-950/60 border-y border-neutral-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <Badge variant="accent" size="md" className="mb-3">
              <Flame className="w-3.5 h-3.5 text-pink-400" /> Community Graph
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Explore Active VYBES
            </h2>
            <p className="text-sm text-neutral-400 mt-2 max-w-xl">
              Every passion has a home. Switch between interest streams or combine them to craft
              your custom personal dashboard.
            </p>
          </div>

          <Link
            href="/vybes"
            className="inline-flex items-center gap-2 text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors"
          >
            <span>Browse all communities</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3D Community Constellation Graph */}
        <div className="mb-14">
          <CommunityGraph3D />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {AVAILABLE_INTERESTS.map((interest) => {
            const Icon = iconMap[interest.icon] || Sparkles;

            return (
              <TiltCard key={interest.id} hoverScale={1.04} maxTilt={5}>
                <Link
                  href="/vybes"
                  className="group relative p-4 rounded-xl bg-neutral-900/40 hover:bg-neutral-900/90 border border-neutral-800/80 hover:border-violet-500/50 transition-all duration-200 flex flex-col justify-between h-full"
                >
                  <div>
                    <div
                      className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${interest.gradient} flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                      {interest.name}
                    </h4>
                    <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {interest.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[10px] text-neutral-500">
                    <span>Active Hub</span>
                    <span className="text-violet-400 group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </div>
                </Link>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
