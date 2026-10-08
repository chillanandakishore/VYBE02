import React from "react";
import {
  Compass,
  Film,
  Sparkles,
  MessageSquare,
  Trophy,
  ShoppingBag,
  Zap,
  Users2,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TiltCard } from "@/components/3d/tilt-card";

const FEATURES = [
  {
    icon: Compass,
    title: "Interest-Based VYBES",
    description:
      "Join curated communities mapped around your passions. From DaVinci colorists to AI researchers, find conversations that actually matter.",
    gradient: "from-violet-500 to-indigo-500",
    badge: "Core Architecture",
  },
  {
    icon: Film,
    title: "Cinematic Short-Form Reels",
    description:
      "Full 4K vertical video feed with audio attribution, smart lazy-loading, and zero compression destruction.",
    gradient: "from-rose-500 to-pink-600",
    badge: "Visual First",
  },
  {
    icon: Sparkles,
    title: "VYBE AI Creator Studio",
    description:
      "Generate magnetic hooks, script structures, thumbnail concepts, caption tone variations, and intelligent hashtags tailored to your niche.",
    gradient: "from-cyan-500 to-blue-600",
    badge: "AI Powered",
  },
  {
    icon: MessageSquare,
    title: "Realtime Messaging & Hubs",
    description:
      "One-on-one creator DMs, community channels, voice notes, media file sharing, and interactive emoji reactions with live typing indicators.",
    gradient: "from-emerald-500 to-teal-600",
    badge: "Low Latency",
  },
  {
    icon: Trophy,
    title: "Community Challenges & Events",
    description:
      "Compete in 30-day challenges, submit entries, climb the live leaderboards, and join virtual or local creator meetups and workshops.",
    gradient: "from-amber-500 to-orange-600",
    badge: "Engagement",
  },
  {
    icon: ShoppingBag,
    title: "Creator Marketplace & Monetization",
    description:
      "Directly sell LUT packs, presets, source code, 3D assets, wallpapers, and templates. Support creators via subscriptions and tips.",
    gradient: "from-purple-500 to-fuchsia-600",
    badge: "Monetization",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" size="md" className="mb-3">
            <Zap className="w-3.5 h-3.5 text-violet-400" /> Platform Architecture
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Engineered for Creators. Designed for Discovery.
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
            Not another endless doom-scrolling clone. VYBE combines community cohesion,
            creative expression, AI acceleration, and creator monetization in one unified ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <TiltCard
                key={idx}
                hoverScale={1.03}
                maxTilt={5}
                className="group relative p-6 rounded-2xl bg-neutral-900/40 hover:bg-neutral-900/80 border border-neutral-800/80 hover:border-violet-500/40 transition-all duration-300 backdrop-blur-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feature.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 bg-neutral-800/80 px-2 py-1 rounded border border-neutral-700/60">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-800/60 flex items-center gap-2 text-xs font-semibold text-violet-400">
                  <span>Explore system</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </TiltCard>
            );
          })}
        </div>

        {/* Stats highlight bar */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-neutral-900/30 border border-neutral-800/80">
          <div className="text-center">
            <span className="text-2xl sm:text-3xl font-black text-white block">15+</span>
            <span className="text-xs text-neutral-400 mt-1 flex items-center justify-center gap-1">
              <Users2 className="w-3.5 h-3.5 text-violet-400" /> Curated Niches
            </span>
          </div>
          <div className="text-center">
            <span className="text-2xl sm:text-3xl font-black text-white block">&lt; 100ms</span>
            <span className="text-xs text-neutral-400 mt-1 flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> Realtime Latency
            </span>
          </div>
          <div className="text-center">
            <span className="text-2xl sm:text-3xl font-black text-white block">100%</span>
            <span className="text-xs text-neutral-400 mt-1 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" /> Modular AI Service
            </span>
          </div>
          <div className="text-center">
            <span className="text-2xl sm:text-3xl font-black text-white block">0%</span>
            <span className="text-xs text-neutral-400 mt-1 flex items-center justify-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Algorithmic Bias
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
