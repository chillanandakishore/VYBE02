/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  Sparkles,
  ArrowRight,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Play,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { TiltCard } from "@/components/3d/tilt-card";

// Dynamic import with SSR disabled for optimal Three.js WebGL performance & zero hydration mismatch
const HeroScene3D = dynamic(
  () => import("@/components/3d/hero-scene-3d").then((m) => m.HeroScene3D),
  { ssr: false }
);

export function Hero() {

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 min-h-[850px]">
      {/* 3D Cinematic Canvas & Environment */}
      <HeroScene3D />

      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-violet-600/20 via-fuchsia-600/15 to-cyan-500/20 blur-[130px] -z-10 pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-violet-600/10 blur-[90px] -z-10 pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 blur-[100px] -z-10 pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-14">
          {/* Badge Tagline */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-6 shadow-sm shadow-violet-500/10 animate-in fade-in slide-in-from-top-3 duration-500">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span className="font-bold tracking-wide uppercase text-[11px]">&ldquo;Connect. Create. Share.&rdquo;</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] mb-6">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
              VYBE Social
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-neutral-300 max-w-2xl leading-relaxed mb-8">
            The modern social platform for creators, thinkers, and communities. Connect with passionate people,
            create high-fidelity posts and reels, and share your world with real-time engagement and AI tools.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full justify-center">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button
                variant="gradient"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto font-bold text-base shadow-xl shadow-violet-600/25"
              >
                Get Started
              </Button>
            </Link>

            <Link href="/login" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto font-semibold text-base border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-100"
              >
                Login
              </Button>
            </Link>

            <Link href="/explore" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto font-semibold text-base border-violet-800/50 bg-violet-950/40 hover:bg-violet-900/60 text-violet-300"
              >
                <Sparkles className="w-4 h-4 text-amber-400 mr-2" />
                <span>Explore Communities</span>
              </Button>
            </Link>
          </div>

          {/* Trust points */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 15+ Interest Niches
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Modular AI Studio
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero Data Selling
            </span>
          </div>
        </div>

        {/* Hero Interactive UI Preview Showcase with 3D Tilt */}
        <TiltCard
          hoverScale={1.02}
          maxTilt={4}
          className="relative max-w-4xl mx-auto rounded-3xl p-2 sm:p-3 bg-gradient-to-b from-white/10 to-white/5 border border-white/10 shadow-2xl backdrop-blur-2xl"
        >
          <div className="rounded-2xl bg-neutral-950/90 border border-neutral-800/80 overflow-hidden shadow-2xl">
            {/* Mock Top bar */}
            <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-neutral-500">vybe.social/feed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20 font-semibold">
                  LIVE COMMUNITY FEED
                </span>
              </div>
            </div>

            {/* Mock Content Card */}
            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left post showcase */}
              <div className="md:col-span-7 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                      name="Alex Rivers"
                      size="md"
                      isOnline
                      isCreator
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white">Alex Rivers</span>
                        <Badge variant="primary" size="sm">
                          PRO CREATOR
                        </Badge>
                      </div>
                      <p className="text-xs text-neutral-400">@alex_rivers • 2 hours ago</p>
                    </div>
                  </div>
                  <Badge variant="secondary" size="sm">
                    🎬 Video Editing
                  </Badge>
                </div>

                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                  Color grading breakdown from our latest cyberpunk short shot in Shinjuku.
                  Rec709 vs Kodak 2383 LUT emulation. Which mood fits the scene best? 👇
                </p>

                {/* Media preview */}
                <div className="relative rounded-xl overflow-hidden aspect-video border border-neutral-800 group cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80"
                    alt="Cyberpunk color grade"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Link
                    href="/reels"
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-3"
                  >
                    <span className="text-[11px] font-mono text-cyan-300 bg-neutral-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                      4K ProRes • Sony FX3
                    </span>
                    <div className="w-8 h-8 rounded-full bg-violet-600/90 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <Play className="w-3.5 h-3.5 ml-0.5" />
                    </div>
                  </Link>
                </div>

                {/* Engagement bar */}
                <div className="flex items-center justify-between pt-1 border-t border-neutral-800/80 text-neutral-400 text-xs">
                  <div className="flex items-center gap-4">
                    <Link href="/feed" className="flex items-center gap-1.5 hover:text-rose-400 transition-colors">
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                      <span className="font-semibold text-white">2.4k</span>
                    </Link>
                    <Link href="/feed" className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>318</span>
                    </Link>
                    <Link href="/feed" className="flex items-center gap-1.5 hover:text-white transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span>84</span>
                    </Link>
                  </div>
                  <Link href="/feed" className="hover:text-amber-400 transition-colors">
                    <Bookmark className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Right side trending highlights */}
              <div className="md:col-span-5 flex flex-col gap-3.5 bg-neutral-900/40 p-4 rounded-xl border border-neutral-800/60">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-rose-500" /> Active VYBES
                  </span>
                  <Link href="/vybes" className="text-[10px] text-violet-400 hover:underline">
                    View All
                  </Link>
                </div>

                <div className="space-y-2.5">
                  <Link href="/vybes" className="flex items-center justify-between p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/80 hover:border-violet-500/50 transition-colors">
                    <div>
                      <p className="text-xs font-semibold text-white">🤖 AI & Generative Art</p>
                      <p className="text-[10px] text-neutral-400">18.4k members • 420 online</p>
                    </div>
                    <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded">
                      +14%
                    </span>
                  </Link>

                  <Link href="/vybes" className="flex items-center justify-between p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/80 hover:border-cyan-500/50 transition-colors">
                    <div>
                      <p className="text-xs font-semibold text-white">💻 Modern Web & Systems</p>
                      <p className="text-[10px] text-neutral-400">24.1k members • 610 online</p>
                    </div>
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                      +28%
                    </span>
                  </Link>

                  <Link href="/vybes" className="flex items-center justify-between p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/80 hover:border-amber-500/50 transition-colors">
                    <div>
                      <p className="text-xs font-semibold text-white">📸 Night Street Photography</p>
                      <p className="text-[10px] text-neutral-400">12.9k members • 185 online</p>
                    </div>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      +9%
                    </span>
                  </Link>
                </div>

                <Link href="/challenges" className="p-3 rounded-lg bg-gradient-to-r from-violet-950/40 to-cyan-950/40 border border-violet-800/30 text-center hover:border-violet-500/50 transition-all block">
                  <p className="text-xs font-semibold text-violet-300">
                    Active Challenge: &ldquo;30-Day Cinematic Reel&rdquo;
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    1,420 entries • $5,000 Creator Grant
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </TiltCard>
      </div>
    </section>
  );
}
