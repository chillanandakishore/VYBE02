/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { User, Post } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { PostCard } from "@/components/feed/post-card";
import {
  MapPin,
  Globe,
  Calendar,
  Share2,
  Bookmark,
  Grid,
  Film,
  Users2,
  Trophy,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  UserPlus,
  Check,
  List,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { FollowListModal } from "@/components/profile/follow-list-modal";

export default function CreatorPublicProfilePage() {
  const params = useParams();
  const username = params?.username as string;

  const [creator, setCreator] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [viewMode, setViewMode] = useState<"grid" | "feed">("grid");
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [followModalTab, setFollowModalTab] = useState<"followers" | "following">("followers");

  useEffect(() => {
    if (!username) return;
    async function loadCreator() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/profile/${username}`);
        const data = await res.json();
        if (res.ok && data.success && data.user) {
          setCreator(data.user);
          setPosts(data.posts || []);
          setIsFollowing(!!data.user.isFollowing);
        }
      } catch (err) {
        console.error("Failed to load creator profile", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCreator();
  }, [username]);

  const handleToggleFollow = async () => {
    if (!creator) return;
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    setCreator((prev) =>
      prev
        ? {
            ...prev,
            followersCount: Math.max(0, prev.followersCount + (nextState ? 1 : -1)),
          }
        : null
    );

    toast({
      type: "success",
      title: nextState ? `Following @${creator.username}` : `Unfollowed @${creator.username}`,
    });

    try {
      const res = await fetch(`/api/users/${creator.id}/follow`, { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setIsFollowing(!nextState);
        setCreator((prev) =>
          prev
            ? {
                ...prev,
                followersCount: Math.max(0, prev.followersCount + (!nextState ? 1 : -1)),
              }
            : null
        );
      }
    } catch {
      setIsFollowing(!nextState);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast({
      type: "success",
      title: "Profile Link Copied!",
      message: "Creator URL copied to clipboard.",
    });
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center text-xs text-neutral-400 font-mono animate-pulse">
        Loading creator profile...
      </div>
    );
  }

  if (!creator) {
    return (
      <Card className="p-12 text-center max-w-md mx-auto my-12 bg-neutral-900 border-neutral-800">
        <h3 className="text-lg font-bold text-white mb-2">Creator Not Found</h3>
        <p className="text-xs text-neutral-400 mb-6">
          The creator profile @{username} does not exist or may have changed their handle.
        </p>
        <Link href="/feed">
          <Button variant="gradient" size="sm">
            Back to Community Feed
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Cover & Main Card */}
      <div className="relative rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900/60 shadow-2xl backdrop-blur-md">
        <div className="h-48 sm:h-72 w-full relative overflow-hidden bg-neutral-950">
          <img
            src={
              creator.coverImageUrl ||
              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80"
            }
            alt="Cover background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
        </div>

        <div className="px-6 pb-6 pt-0 relative -mt-16 sm:-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
            <div className="flex items-end gap-4">
              <Avatar
                src={creator.avatarUrl}
                name={creator.displayName}
                size="xl"
                isOnline
                isCreator={creator.isCreator}
                className="ring-4 ring-neutral-950 shadow-2xl"
              />

              <div className="mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-3xl font-black text-white">
                    {creator.displayName}
                  </h1>
                  {(creator.isOwner || creator.role === "owner" || creator.creatorStatus === "owner") ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/50 flex items-center gap-1 shadow-sm shadow-amber-500/20">
                      👑 Platform Owner
                    </span>
                  ) : creator.isCreator ? (
                    <Badge variant="primary" size="sm">
                      <Sparkles className="w-3 h-3 mr-1 text-violet-400" />
                      {creator.creatorStatus?.toUpperCase() || "CREATOR"}
                    </Badge>
                  ) : null}
                  {creator.verified && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </div>
                <p className="text-xs text-neutral-400">@{creator.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <Button
                variant={isFollowing ? "secondary" : "gradient"}
                size="sm"
                onClick={handleToggleFollow}
                leftIcon={isFollowing ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <UserPlus className="w-3.5 h-3.5" />}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>

              <Link href="/messages">
                <Button variant="secondary" size="sm" leftIcon={<MessageSquare className="w-3.5 h-3.5 text-cyan-400" />}>
                  Message
                </Button>
              </Link>

              <Button variant="outline" size="sm" onClick={handleShare} leftIcon={<Share2 className="w-3.5 h-3.5" />}>
                Share
              </Button>
            </div>
          </div>

          <div className="max-w-2xl text-xs sm:text-sm text-neutral-200 leading-relaxed mb-4 whitespace-pre-line">
            {creator.bio || "Member of the VYBE community."}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 mb-5">
            {creator.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" /> {creator.location}
              </span>
            )}
            {creator.website && (
              <a
                href={creator.website.startsWith("http") ? creator.website : `https://${creator.website}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-violet-400 hover:underline"
              >
                <Globe className="w-3.5 h-3.5" /> {creator.website.replace(/^https?:\/\//, "")}
              </a>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-neutral-500" /> Member since {new Date(creator.createdAt).getFullYear()}
            </span>
          </div>

          {/* Interests */}
          <div className="flex flex-wrap items-center gap-1.5 mb-6">
            <span className="text-[11px] font-semibold text-neutral-500 mr-1">Interests:</span>
            {creator.interests?.map((item) => (
              <span
                key={item}
                className="px-2.5 py-0.5 rounded-lg bg-neutral-800/80 border border-neutral-700/60 text-xs font-medium text-neutral-300"
              >
                {item}
              </span>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 py-3 border-t border-neutral-800/80 text-center">
            <div>
              <span className="text-base sm:text-lg font-black text-white block">
                {posts.length || creator.postsCount}
              </span>
              <span className="text-[11px] text-neutral-400">Posts</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setFollowModalTab("followers");
                setShowFollowModal(true);
              }}
              className="text-center group hover:opacity-80 transition-opacity cursor-pointer"
            >
              <span className="text-base sm:text-lg font-black text-white block group-hover:text-violet-300">
                {creator.followersCount.toLocaleString()}
              </span>
              <span className="text-[11px] text-neutral-400 group-hover:text-neutral-200">Followers</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setFollowModalTab("following");
                setShowFollowModal(true);
              }}
              className="text-center group hover:opacity-80 transition-opacity cursor-pointer"
            >
              <span className="text-base sm:text-lg font-black text-white block group-hover:text-violet-300">
                {creator.followingCount}
              </span>
              <span className="text-[11px] text-neutral-400 group-hover:text-neutral-200">Following</span>
            </button>
            <div className="hidden sm:block">
              <span className="text-base sm:text-lg font-black text-white block">
                {creator.isCreator ? "Verified Creator" : "Member"}
              </span>
              <span className="text-[11px] text-neutral-400">Status</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs
          tabs={[
            { id: "posts", label: "Posts", icon: <Grid className="w-3.5 h-3.5" />, badge: posts.length },
            { id: "reels", label: "Reels", icon: <Film className="w-3.5 h-3.5" /> },
            { id: "communities", label: "Communities", icon: <Users2 className="w-3.5 h-3.5" /> },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {activeTab === "posts" && (
          <div className="flex items-center gap-1 bg-neutral-900/60 border border-neutral-800 p-1 rounded-xl self-end">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === "grid" ? "bg-violet-600 text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("feed")}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === "feed" ? "bg-violet-600 text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {activeTab === "posts" && (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="group aspect-square overflow-hidden relative border-neutral-800 bg-neutral-950 cursor-pointer"
              >
                {post.mediaUrls && post.mediaUrls.length > 0 ? (
                  <img
                    src={post.mediaUrls[0]}
                    alt="Post thumbnail"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full p-5 flex flex-col justify-between bg-neutral-900/80">
                    <span className="text-[10px] text-cyan-400 font-semibold">{post.communityName}</span>
                    <p className="text-xs text-neutral-200 line-clamp-4 leading-relaxed">
                      {post.content}
                    </p>
                    <span className="text-[10px] text-neutral-500">{post.mediaType}</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white text-xs font-bold backdrop-blur-xs">
                  <span>❤️ {post.likesCount}</span>
                  <span>💬 {post.commentsCount}</span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-6 max-w-2xl mx-auto">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )
      )}

      {/* Followers & Following Modal */}
      {creator && (
        <FollowListModal
          isOpen={showFollowModal}
          onClose={() => setShowFollowModal(false)}
          userId={creator.id}
          username={creator.username}
          initialTab={followModalTab}
          onFollowCountChanged={(diff) => {
            setCreator((prev) =>
              prev
                ? {
                    ...prev,
                    followersCount: Math.max(0, prev.followersCount + diff),
                  }
                : null
            );
          }}
        />
      )}
    </div>
  );
}
