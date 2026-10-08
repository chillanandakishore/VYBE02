/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Users, Award, ExternalLink } from "lucide-react";
import Link from "next/link";
import { TiltCard } from "@/components/3d/tilt-card";

const FEATURED_CREATORS = [
  {
    name: "Alex Rivers",
    handle: "alex_rivers",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    role: "Cinematographer & Colorist",
    followers: "14.2k",
    posts: 148,
    tags: ["Video Editing", "Photography", "Movies"],
    badge: "PRO CREATOR",
  },
  {
    name: "Maya Patel",
    handle: "maya_dev",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
    cover: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    role: "Fullstack & Autonomous AI Builder",
    followers: "8.9k",
    posts: 92,
    tags: ["Coding", "AI", "Technology"],
    badge: "RISING STAR",
  },
  {
    name: "Kenji Sato",
    handle: "kenji_shoots",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    cover: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
    role: "Tokyo Street & Neon Photographer",
    followers: "22.4k",
    posts: 310,
    tags: ["Photography", "Travel", "Art"],
    badge: "PARTNER",
  },
];

export function CreatorSpotlight() {
  return (
    <section id="creators" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="secondary" size="md" className="mb-3">
            <Award className="w-3.5 h-3.5 text-cyan-400" /> Featured Innovators
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">
            Built for World-Class Creators
          </h2>
          <p className="text-sm text-neutral-400">
            Meet the pioneers growing authentic followings, hosting community challenges, and
            sharing high-fidelity craft on VYBE.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_CREATORS.map((creator, i) => (
            <TiltCard
              key={i}
              hoverScale={1.03}
              maxTilt={5}
              className="group relative rounded-2xl glass-card overflow-hidden border border-neutral-800/80 flex flex-col justify-between"
            >
              <div>
                {/* Cover Image banner */}
                <div className="h-28 w-full relative overflow-hidden bg-neutral-900">
                  <img
                    src={creator.cover}
                    alt={creator.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3">
                    <Badge variant="primary" size="sm">
                      {creator.badge}
                    </Badge>
                  </div>
                </div>

                {/* Profile info */}
                <div className="px-5 pt-0 pb-4 relative -mt-8">
                  <Avatar
                    src={creator.avatar}
                    name={creator.name}
                    size="lg"
                    isOnline
                    isCreator
                    className="border-2 border-neutral-950 mb-3"
                  />

                  <div className="flex items-center justify-between">
                    <div>
                      <Link href={`/profile/${creator.handle}`}>
                        <h4 className="text-base font-bold text-white hover:text-violet-300 transition-colors">
                          {creator.name}
                        </h4>
                      </Link>
                      <Link href={`/profile/${creator.handle}`} className="text-xs text-neutral-400 hover:underline">
                        @{creator.handle}
                      </Link>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-300 mt-2 font-medium">{creator.role}</p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {creator.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/explore?q=${encodeURIComponent(tag)}`}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800/80 text-neutral-300 border border-neutral-700/60 hover:border-violet-500 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer stats & follow button */}
              <div className="px-5 py-3.5 border-t border-neutral-800/60 bg-neutral-950/40 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-neutral-400">
                  <span className="flex items-center gap-1 font-semibold text-white">
                    <Users className="w-3.5 h-3.5 text-violet-400" /> {creator.followers}
                  </span>
                  <span>{creator.posts} posts</span>
                </div>

                <Link
                  href={`/profile/${creator.handle}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
                >
                  <span>View Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
