/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Compass,
  Flame,
  Film,
  Sparkles,
  Trophy,
  Users2,
  Calendar,
  X,
  UserPlus,
  Check,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Tabs } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { AVAILABLE_INTERESTS } from "@/lib/db";
import { User, Post, CommunityItem, ReelItem, EventItem, ChallengeItem } from "@/types";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

interface SearchResults {
  users: User[];
  posts: Post[];
  communities: CommunityItem[];
  reels: ReelItem[];
  events: EventItem[];
  challenges: ChallengeItem[];
  total: number;
}

export default function ExplorePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("trending");
  const [search, setSearch] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});

  // Debounced search query
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setSearchResults(data);
      }
    } catch (err) {
      console.error("Search error", err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(search);
    }, 250);
    return () => clearTimeout(timer);
  }, [search, performSearch]);

  const handleToggleFollow = async (targetUser: User) => {
    if (!user) {
      toast({
        type: "warning",
        title: "Sign in required",
        message: "Please sign in to follow creators.",
      });
      return;
    }

    const currentStatus = !!followingStates[targetUser.id];
    const nextStatus = !currentStatus;

    setFollowingStates((prev) => ({
      ...prev,
      [targetUser.id]: nextStatus,
    }));

    toast({
      type: "success",
      title: nextStatus ? `Following @${targetUser.username}` : `Unfollowed @${targetUser.username}`,
    });

    try {
      await fetch(`/api/users/${targetUser.id}/follow`, { method: "POST" });
    } catch {
      setFollowingStates((prev) => ({
        ...prev,
        [targetUser.id]: currentStatus,
      }));
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Header & Global Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-neutral-800/80">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Compass className="w-6 h-6 text-violet-400" /> Explore & Discover
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Discover trending creators, viral reels, community projects, and new VYBES.
          </p>
        </div>

        {/* Global Search Input */}
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search creators, hashtags, posts, or VYBES..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-violet-500 transition-colors shadow-inner"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* SEARCH RESULTS VIEW */}
      {search.trim().length > 0 ? (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Results for &ldquo;{search}&rdquo;</span>
              {searchResults && (
                <Badge variant="secondary" size="sm">
                  {searchResults.total} matches
                </Badge>
              )}
            </div>

            {/* Category filter tabs */}
            <div className="flex items-center gap-1 text-xs">
              {["all", "creators", "posts", "communities", "reels", "events"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSearchCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                    searchCategory === cat
                      ? "bg-violet-600 text-white"
                      : "text-neutral-400 hover:text-white bg-neutral-900/60"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {isSearching ? (
            <div className="p-16 text-center text-xs text-neutral-400 font-mono animate-pulse">
              Searching across VYBE network...
            </div>
          ) : !searchResults || searchResults.total === 0 ? (
            <Card className="p-12 text-center bg-neutral-900/40 border-neutral-800">
              <p className="text-sm font-semibold text-white mb-1">No results found.</p>
              <p className="text-xs text-neutral-400 mb-4">
                Try searching for creators, tags, or topics.
              </p>
              <Button variant="outline" size="sm" onClick={() => setSearch("")}>
                Clear Search
              </Button>
            </Card>
          ) : (
            <div className="flex flex-col gap-8">
              {/* Creators Results */}
              {(searchCategory === "all" || searchCategory === "creators") && searchResults.users.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Users2 className="w-3.5 h-3.5 text-violet-400" /> Creators ({searchResults.users.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {searchResults.users.map((c) => {
                      const isFollowing = !!followingStates[c.id];
                      return (
                        <Card key={c.id} className="p-3 bg-neutral-900/70 border-neutral-800 flex items-center justify-between gap-3">
                          <Link href={`/profile/${c.username}`} className="flex items-center gap-2.5 min-w-0 flex-1 group">
                            <Avatar src={c.avatarUrl} name={c.displayName} size="sm" isCreator={c.isCreator} />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                                {c.displayName}
                              </p>
                              <p className="text-[10px] text-neutral-400 truncate">@{c.username}</p>
                            </div>
                          </Link>

                          {user?.id !== c.id && (
                            <Button
                              variant={isFollowing ? "secondary" : "gradient"}
                              size="sm"
                              onClick={() => handleToggleFollow(c)}
                              className="text-xs py-1 px-2.5 h-7 shrink-0"
                            >
                              {isFollowing ? "Following" : "Follow"}
                            </Button>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Communities Results */}
              {(searchCategory === "all" || searchCategory === "communities") && searchResults.communities.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-cyan-400" /> Communities & VYBES ({searchResults.communities.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {searchResults.communities.map((comm) => (
                      <Link key={comm.id} href={`/vybes`}>
                        <Card className="p-4 bg-neutral-900/70 border-neutral-800 hover:border-violet-500/40 transition-all flex items-start justify-between gap-4 group">
                          <div>
                            <h4 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                              {comm.name}
                            </h4>
                            <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{comm.description}</p>
                            <span className="text-[11px] font-mono text-cyan-400 mt-2 block">
                              {comm.membersCount.toLocaleString()} members
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-violet-400 transition-colors shrink-0" />
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Posts Results */}
              {(searchCategory === "all" || searchCategory === "posts") && searchResults.posts.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Posts ({searchResults.posts.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {searchResults.posts.map((post) => (
                      <Card key={post.id} className="p-4 bg-neutral-900/70 border-neutral-800">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar src={post.author.avatarUrl} name={post.author.displayName} size="xs" />
                          <span className="text-xs font-bold text-white">@{post.author.username}</span>
                          <span className="text-[10px] text-neutral-500 ml-auto">{post.communityName}</span>
                        </div>
                        <p className="text-xs text-neutral-200 line-clamp-3 mb-2">{post.content}</p>
                        <div className="flex items-center gap-4 text-[11px] text-neutral-400 border-t border-neutral-800/60 pt-2">
                          <span>❤️ {post.likesCount}</span>
                          <span>💬 {post.commentsCount}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* DEFAULT EXPLORE VIEW */
        <div className="flex flex-col gap-6">
          {/* Main Discovery Tabs */}
          <Tabs
            tabs={[
              { id: "trending", label: "Trending", icon: <Flame className="w-3.5 h-3.5" /> },
              { id: "for-you", label: "For You", icon: <Sparkles className="w-3.5 h-3.5" /> },
              { id: "reels", label: "Popular Reels", icon: <Film className="w-3.5 h-3.5" /> },
              { id: "challenges", label: "Challenges", icon: <Trophy className="w-3.5 h-3.5" /> },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          {/* Quick Niche Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {AVAILABLE_INTERESTS.map((interest) => (
              <button
                key={interest.id}
                onClick={() => setSearch(interest.name)}
                className="px-3 py-1.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white shrink-0 transition-colors"
              >
                {interest.name}
              </button>
            ))}
          </div>

          {/* Featured Creator Spotlight */}
          <Card className="p-6 bg-gradient-to-r from-violet-950/60 via-neutral-900/80 to-neutral-900/60 border-violet-800/40 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4">
                <Avatar
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  name="Alex Rivers"
                  size="lg"
                  isCreator
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">Alex Rivers 🎬</h3>
                    <Badge variant="primary" size="sm">
                      CREATOR OF THE WEEK
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-300 mt-1 max-w-lg">
                    Filmmaker & Colorist based in Tokyo. Exploring anamorphic night photography, Sony FX3 workflows, and DaVinci Resolve node trees.
                  </p>
                  <p className="text-[11px] text-violet-300 font-mono mt-1">14,280 followers • 84 posts</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/profile/alex_rivers">
                  <Button variant="gradient" size="sm">
                    View Profile
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Trending Media Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Viral on VYBE
              </h2>
              <span className="text-xs text-neutral-400 font-mono">Updated every 15m</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Cinematic Neo-Tokyo Night Drive",
                  creator: "alex_rivers",
                  category: "Video Editing",
                  views: "42.8k",
                  image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
                  badge: "Trending Reel",
                },
                {
                  title: "NextJS 16 Autonomous Agents Architecture",
                  creator: "maya_dev",
                  category: "Coding",
                  views: "19.5k",
                  image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
                  badge: "Top Discussion",
                },
                {
                  title: "Rain reflections in Shinjuku alley",
                  creator: "kenji_shoots",
                  category: "Photography",
                  views: "89.2k",
                  image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80",
                  badge: "Staff Pick",
                },
                {
                  title: "Cyberpunk Lo-Fi beats session live from Shibuya",
                  creator: "elena_sound",
                  category: "Music",
                  views: "15.1k",
                  image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
                  badge: "Audio Hub",
                },
                {
                  title: "Minimalist desk setup with Herman Miller & custom Mac Studio",
                  creator: "design_minimal",
                  category: "Technology",
                  views: "33.7k",
                  image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
                  badge: "Hardware",
                },
                {
                  title: "Generative UI patterns with React 19 & Tailwind 4",
                  creator: "maya_dev",
                  category: "AI",
                  views: "27.4k",
                  image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
                  badge: "Design System",
                },
              ].map((item, idx) => (
                <Card
                  key={idx}
                  className="group overflow-hidden bg-neutral-900/60 border-neutral-800/80 hover:border-violet-500/40 transition-all cursor-pointer"
                >
                  <div className="relative aspect-video overflow-hidden bg-neutral-950">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <Badge variant="primary" size="sm">
                        {item.badge}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-neutral-300">
                      <span className="font-semibold text-white">@{item.creator}</span>
                      <span className="text-[11px] font-mono text-cyan-300">{item.views} views</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <span className="text-[10px] font-semibold text-violet-400 uppercase tracking-wider block mb-1">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
