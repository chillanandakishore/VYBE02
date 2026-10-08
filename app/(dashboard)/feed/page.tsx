"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { PostComposer } from "@/components/feed/post-composer";
import { PostCard } from "@/components/feed/post-card";
import { StoriesTray } from "@/components/feed/stories-tray";
import { AVAILABLE_INTERESTS } from "@/lib/db";
import { Post, User } from "@/types";
import {
  Sparkles,
  Flame,
  TrendingUp,
  Trophy,
  RefreshCw,
  Users2,
  UserPlus,
  Check,
  CheckCircle2,
  Compass,
  Loader2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

const PAGE_SIZE = 10;

export default function FeedPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"for-you" | "following" | "top-vybes">("for-you");
  const [selectedCommunity, setSelectedCommunity] = useState<string>("All");

  // Posts & Pagination state
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Suggested Creators state
  const [suggestedCreators, setSuggestedCreators] = useState<Array<User & { isFollowing?: boolean }>>([]);
  const [isLoadingSuggested, setIsLoadingSuggested] = useState(false);

  // Fetch initial feed posts
  const fetchFeedPosts = useCallback(async () => {
    setIsLoading(true);
    setOffset(0);
    try {
      let queryUrl = `/api/posts?limit=${PAGE_SIZE}&offset=0&stream=${activeTab}`;
      if (selectedCommunity !== "All") {
        queryUrl += `&community=${encodeURIComponent(selectedCommunity)}`;
      }

      const res = await fetch(queryUrl);
      const data = await res.json();
      if (res.ok && data.success) {
        setPosts(data.posts || []);
        setTotalPosts(data.total || 0);
        setHasMore(!!data.hasMore);
      }
    } catch (err) {
      console.error("Failed to load feed posts", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCommunity, activeTab]);

  // Load more posts
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextOffset = offset + PAGE_SIZE;

    try {
      let queryUrl = `/api/posts?limit=${PAGE_SIZE}&offset=${nextOffset}&stream=${activeTab}`;
      if (selectedCommunity !== "All") {
        queryUrl += `&community=${encodeURIComponent(selectedCommunity)}`;
      }

      const res = await fetch(queryUrl);
      const data = await res.json();
      if (res.ok && data.success) {
        setPosts((prev) => [...prev, ...(data.posts || [])]);
        setOffset(nextOffset);
        setHasMore(!!data.hasMore);
      }
    } catch (err) {
      console.error("Failed to load more posts", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Fetch suggested creators
  const fetchSuggestedCreators = useCallback(async () => {
    setIsLoadingSuggested(true);
    try {
      const res = await fetch("/api/users/suggested");
      const data = await res.json();
      if (res.ok && data.success) {
        setSuggestedCreators(data.users || []);
      }
    } catch (err) {
      console.error("Failed to load suggested creators", err);
    } finally {
      setIsLoadingSuggested(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedPosts();
  }, [fetchFeedPosts]);

  useEffect(() => {
    fetchSuggestedCreators();
  }, [fetchSuggestedCreators]);

  // Toggle follow on suggested creator
  const handleToggleFollowSuggested = async (creatorId: string, creatorUsername: string) => {
    if (!user) {
      toast({
        type: "warning",
        title: "Sign in required",
        message: "Please sign in to follow creators.",
      });
      return;
    }

    setSuggestedCreators((prev) =>
      prev.map((c) =>
        c.id === creatorId
          ? {
              ...c,
              isFollowing: !c.isFollowing,
              followersCount: Math.max(0, (c.followersCount || 0) + (c.isFollowing ? -1 : 1)),
            }
          : c
      )
    );

    try {
      const res = await fetch(`/api/users/${creatorId}/follow`, { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        toast({
          type: "success",
          title: data.isFollowing ? `Following @${creatorUsername}` : `Unfollowed @${creatorUsername}`,
          message: data.isFollowing ? "Their stories and updates will appear in your Following tab." : undefined,
        });

        // If currently on following tab and just followed someone, refresh feed!
        if (activeTab === "following" && data.isFollowing) {
          fetchFeedPosts();
        }
      }
    } catch {
      fetchSuggestedCreators();
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
    setTotalPosts((prev) => prev + 1);
  };

  const handlePostDeleted = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setTotalPosts((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Center Feed Column */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {/* Feed Header & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800/80">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Community Feed
              <span className="text-xs font-semibold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/30">
                Live
              </span>
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Filtered for your interests:{" "}
              <span className="text-neutral-300 font-medium">
                {user?.interests?.join(", ") || "Photography, Technology, AI, Coding"}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchFeedPosts}
              title="Refresh feed"
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-violet-400" : ""}`} />
            </button>

            <Tabs
              tabs={[
                { id: "for-you", label: "For You", icon: <Sparkles className="w-3.5 h-3.5" /> },
                { id: "following", label: "Following" },
                { id: "top-vybes", label: "Top VYBES", icon: <Flame className="w-3.5 h-3.5" /> },
              ]}
              activeTab={activeTab}
              onChange={(tabId) => setActiveTab(tabId as "for-you" | "following" | "top-vybes")}
            />
          </div>
        </div>

        {/* Niche Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setSelectedCommunity("All")}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold shrink-0 transition-colors ${
              selectedCommunity === "All"
                ? "bg-violet-600 text-white border-violet-500 shadow-sm"
                : "bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800"
            }`}
          >
            All Niches
          </button>
          {AVAILABLE_INTERESTS.map((interest) => (
            <button
              key={interest.id}
              onClick={() => setSelectedCommunity(interest.name)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium shrink-0 transition-colors ${
                selectedCommunity === interest.name
                  ? "bg-violet-600 text-white border-violet-500 shadow-sm font-semibold"
                  : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/80"
              }`}
            >
              {interest.name}
            </button>
          ))}
        </div>

        {/* 24-Hour Stories Carousel */}
        <StoriesTray />

        {/* Rich Post Composer */}
        <PostComposer onPostCreated={handlePostCreated} />

        {/* Posts Stream */}
        <div className="flex flex-col gap-6">
          {isLoading && posts.length === 0 ? (
            <div className="p-12 text-center text-xs text-neutral-400 font-mono flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
              <span>Syncing personalized {activeTab} stream...</span>
            </div>
          ) : posts.length === 0 ? (
            activeTab === "following" ? (
              /* Dedicated Empty State for Following Stream */
              <Card className="p-8 text-center bg-gradient-to-b from-neutral-900/80 to-neutral-900/40 border-neutral-800 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-3">
                  <Compass className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  Your Following Feed is Empty
                </h3>
                <p className="text-xs text-neutral-400 max-w-md mx-auto mb-6">
                  You haven&apos;t followed creators with recent posts in this niche. Follow active creators below to customize your stream!
                </p>

                {/* Suggested Creators in Empty State */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto text-left mb-6">
                  {suggestedCreators.slice(0, 4).map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between gap-3"
                    >
                      <Link
                        href={`/profile/${c.username}`}
                        className="flex items-center gap-2.5 min-w-0 flex-1 group"
                      >
                        <Avatar
                          src={c.avatarUrl}
                          name={c.displayName}
                          size="sm"
                          isCreator={c.isCreator}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                            {c.displayName}
                          </p>
                          <p className="text-[10px] text-neutral-400 truncate">@{c.username}</p>
                        </div>
                      </Link>

                      <Button
                        variant={c.isFollowing ? "secondary" : "gradient"}
                        size="sm"
                        onClick={() => handleToggleFollowSuggested(c.id, c.username)}
                        className="text-xs py-1 px-2.5 h-7 shrink-0"
                      >
                        {c.isFollowing ? "Following" : "Follow"}
                      </Button>
                    </div>
                  ))}
                </div>

                <Button variant="outline" size="sm" onClick={() => setActiveTab("for-you")}>
                  Discover in &ldquo;For You&rdquo;
                </Button>
              </Card>
            ) : (
              <Card className="p-8 text-center bg-neutral-900/40 border-neutral-800">
                <p className="text-sm font-semibold text-white mb-1">Your feed is quiet.</p>
                <p className="text-xs text-neutral-400 mb-4">
                  Follow creators or join communities to see posts.
                </p>
                <Button variant="gradient" size="sm" onClick={() => setSelectedCommunity("All")}>
                  Reset to All Niches
                </Button>
              </Card>
            )
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onPostDeleted={handlePostDeleted}
              />
            ))
          )}

          {/* Load More Pagination Button */}
          {hasMore && (
            <div className="pt-2 pb-6 flex justify-center">
              <Button
                variant="outline"
                size="md"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                isLoading={isLoadingMore}
                className="px-6 py-2.5 rounded-2xl bg-neutral-900/80 border-neutral-800 hover:bg-neutral-800 text-xs font-semibold text-neutral-200 shadow-md"
              >
                {isLoadingMore
                  ? "Loading more posts..."
                  : `Load More Posts (${totalPosts - posts.length} remaining)`}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar Column */}
      <div className="lg:col-span-4 flex flex-col gap-6 sticky top-20">
        {/* Creator Onboarding / Status Card */}
        <Card className="p-5 bg-gradient-to-tr from-violet-950/40 via-neutral-900/60 to-cyan-950/30 border-violet-800/40">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Creator Studio
            </span>
          </div>
          <h4 className="text-sm font-bold text-white">Generate High-Impact Captions</h4>
          <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
            Use the integrated AI Studio to create hooks, 4K reel scripts, and niche hashtag clouds.
          </p>
          <Link href="/studio" className="mt-3 block">
            <Button variant="gradient" size="sm" className="w-full">
              Open AI Studio
            </Button>
          </Link>
        </Card>

        {/* Live Suggested Creators Card */}
        <Card className="p-5 bg-neutral-900/60 border-neutral-800/80 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Users2 className="w-3.5 h-3.5 text-violet-400" /> Creators to Follow
            </span>
            <button
              onClick={fetchSuggestedCreators}
              title="Refresh suggestions"
              className="text-neutral-500 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingSuggested ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="space-y-3 mt-3">
            {isLoadingSuggested && suggestedCreators.length === 0 ? (
              <div className="py-6 text-center text-xs text-neutral-500 font-mono animate-pulse">
                Finding creators...
              </div>
            ) : suggestedCreators.length === 0 ? (
              <div className="py-4 text-center text-xs text-neutral-500">
                All suggested creators followed!
              </div>
            ) : (
              suggestedCreators.slice(0, 4).map((creator) => {
                return (
                  <div key={creator.id} className="flex items-center justify-between gap-2">
                    <Link
                      href={`/profile/${creator.username}`}
                      className="flex items-center gap-2.5 min-w-0 flex-1 group"
                    >
                      <Avatar
                        src={creator.avatarUrl}
                        name={creator.displayName}
                        size="sm"
                        isCreator={creator.isCreator}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                            {creator.displayName}
                          </p>
                          {creator.verified && (
                            <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                          )}
                        </div>
                        <p className="text-[10px] text-neutral-400 truncate">
                          @{creator.username} • {(creator.followersCount || 0).toLocaleString()}
                        </p>
                      </div>
                    </Link>

                    <Button
                      variant={creator.isFollowing ? "secondary" : "gradient"}
                      size="sm"
                      onClick={() => handleToggleFollowSuggested(creator.id, creator.username)}
                      className="text-xs py-1 px-2.5 h-7 shrink-0"
                      leftIcon={
                        creator.isFollowing ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <UserPlus className="w-3 h-3" />
                        )
                      }
                    >
                      {creator.isFollowing ? "Following" : "Follow"}
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Trending in VYBES */}
        <Card className="p-5 bg-neutral-900/60 border-neutral-800/80">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Trending Topics
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">Realtime</span>
          </div>

          <div className="space-y-3 mt-3">
            <Link
              href="/explore?q=DaVinciResolve19"
              className="flex items-center justify-between text-xs group hover:opacity-80 transition-opacity"
            >
              <div>
                <p className="font-semibold text-white group-hover:text-violet-300">#DaVinciResolve19</p>
                <p className="text-[10px] text-neutral-400">14.2k posts in Video Editing</p>
              </div>
              <Badge variant="primary" size="sm">
                +45%
              </Badge>
            </Link>

            <Link
              href="/explore?q=SonyFX3Rig"
              className="flex items-center justify-between text-xs group hover:opacity-80 transition-opacity"
            >
              <div>
                <p className="font-semibold text-white group-hover:text-cyan-300">#SonyFX3Rig</p>
                <p className="text-[10px] text-neutral-400">8.9k posts in Photography</p>
              </div>
              <Badge variant="secondary" size="sm">
                +22%
              </Badge>
            </Link>

            <Link
              href="/explore?q=AutonomousAgents"
              className="flex items-center justify-between text-xs group hover:opacity-80 transition-opacity"
            >
              <div>
                <p className="font-semibold text-white group-hover:text-pink-300">#AutonomousAgents</p>
                <p className="text-[10px] text-neutral-400">31.4k posts in AI & Coding</p>
              </div>
              <Badge variant="accent" size="sm">
                +88%
              </Badge>
            </Link>
          </div>
        </Card>

        {/* Active 30-Day Challenge Banner */}
        <Card className="p-5 bg-neutral-900/60 border-neutral-800/80">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white">30-Day Challenge</span>
          </div>
          <h5 className="text-xs font-bold text-violet-300">
            &ldquo;30-Day Night Photography&rdquo;
          </h5>
          <p className="text-[11px] text-neutral-400 mt-1">
            Capture city streetlights, light trails, and night portraits. Over 1,200 creators
            participating.
          </p>
          <Link href="/challenges" className="mt-3 block">
            <Button variant="outline" size="sm" className="w-full text-xs">
              Join Challenge
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
