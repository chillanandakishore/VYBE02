/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ReelItem } from "@/types";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  UserPlus,
  Check,
  Plus,
  Send,
  Loader2,
  CheckCircle2,
  Sparkles,
  Film,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

interface LocalComment {
  id: string;
  author: string;
  text: string;
  time: string;
}

export default function ReelsPage() {
  const { user } = useAuth();
  const [reels, setReels] = useState<ReelItem[]>([]);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});

  // Comment Drawer state
  const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [reelComments, setReelComments] = useState<Record<string, LocalComment[]>>({
    reel_1: [
      { id: "c1", author: "maya_dev", text: "The highlight rolloff in that second frame is buttery smooth!", time: "1h ago" },
      { id: "c2", author: "kenji_shoots", text: "The contrast against the neon signs is spot on.", time: "30m ago" },
    ],
  });

  // Create Reel Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [musicTitle, setMusicTitle] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const fetchReels = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/reels");
      const data = await res.json();
      if (res.ok && data.success) {
        setReels(data.reels || []);
      }
    } catch (err) {
      console.error("Failed to load reels", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const reel = reels[currentReelIndex];

  // Video auto-playback when reel changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  }, [currentReelIndex]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleToggleLike = async (reelId: string) => {
    if (!user) {
      toast({
        type: "warning",
        title: "Sign in required",
        message: "Please sign in to like reels.",
      });
      return;
    }

    setReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const nextLiked = !r.isLiked;
          return {
            ...r,
            isLiked: nextLiked,
            likesCount: nextLiked ? r.likesCount + 1 : Math.max(0, r.likesCount - 1),
          };
        }
        return r;
      })
    );

    try {
      await fetch(`/api/reels/${reelId}/like`, { method: "POST" });
    } catch {
      // Ignore
    }
  };

  const handleToggleSave = async (reelId: string) => {
    if (!user) {
      toast({
        type: "warning",
        title: "Sign in required",
        message: "Please sign in to bookmark reels.",
      });
      return;
    }

    setReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const nextSaved = !r.isSaved;
          toast({
            type: "info",
            title: nextSaved ? "Saved Reel" : "Removed from Saved",
          });
          return { ...r, isSaved: nextSaved };
        }
        return r;
      })
    );

    try {
      await fetch(`/api/reels/${reelId}/save`, { method: "POST" });
    } catch {
      // Ignore
    }
  };

  const handleToggleFollow = async (authorId: string, username: string) => {
    const nextStatus = !followingStates[authorId];
    setFollowingStates((prev) => ({ ...prev, [authorId]: nextStatus }));

    toast({
      type: "success",
      title: nextStatus ? `Following @${username}` : `Unfollowed @${username}`,
    });

    try {
      await fetch(`/api/users/${authorId}/follow`, { method: "POST" });
    } catch {
      setFollowingStates((prev) => ({ ...prev, [authorId]: !nextStatus }));
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !reel) return;

    const newComm: LocalComment = {
      id: `comm_${Date.now()}`,
      author: user?.username || "you",
      text: commentInput.trim(),
      time: "Just now",
    };

    setReelComments((prev) => ({
      ...prev,
      [reel.id]: [newComm, ...(prev[reel.id] || [])],
    }));

    setReels((prev) =>
      prev.map((r) => (r.id === reel.id ? { ...r, commentsCount: r.commentsCount + 1 } : r))
    );

    setCommentInput("");
    toast({
      type: "success",
      title: "Comment Added!",
    });
  };

  const handlePublishReel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim() || !caption.trim()) return;

    setIsPublishing(true);
    try {
      const res = await fetch("/api/reels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl: videoUrl.trim(),
          thumbnailUrl: thumbnailUrl.trim() || undefined,
          caption: caption.trim(),
          musicTitle: musicTitle.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast({
          type: "success",
          title: "Reel Published!",
          message: "Your 4K vertical video is live in the Reels feed.",
        });
        setReels((prev) => [data.reel, ...prev]);
        setCurrentReelIndex(0);
        setIsCreateOpen(false);
        setVideoUrl("");
        setCaption("");
      } else {
        toast({
          type: "error",
          title: "Publish failed",
          message: data.message,
        });
      }
    } catch {
      toast({
        type: "error",
        title: "Network Error",
        message: "Failed to publish reel.",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center text-xs text-neutral-500 font-mono flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
        <span>Loading vertical video feed...</span>
      </div>
    );
  }

  if (!reel) {
    return (
      <div className="py-24 text-center text-neutral-400">
        <p className="text-sm font-semibold text-white mb-2">No reels found</p>
        <Button variant="gradient" size="sm" onClick={() => setIsCreateOpen(true)}>
          Create First Reel
        </Button>
      </div>
    );
  }

  const isAuthorFollowing = !!followingStates[reel.author.id] || !!reel.author.isFollowing;
  const currentComments = reelComments[reel.id] || [];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] py-2 select-none">
      {/* Top Header / Upload Trigger */}
      <div className="w-full max-w-[400px] flex items-center justify-between pb-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Film className="w-4 h-4 text-violet-400" /> Vertical Reels
        </h2>
        <Button
          variant="gradient"
          size="sm"
          onClick={() => setIsCreateOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          className="text-xs py-1 px-3"
        >
          Post Reel
        </Button>
      </div>

      {/* Vertical Reel Container (9:16 Aspect Ratio) */}
      <div className="relative w-full max-w-[400px] h-[690px] rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-2xl flex flex-col justify-between">
        {/* Background Video Player */}
        <video
          ref={videoRef}
          src={reel.videoUrl}
          poster={reel.thumbnailUrl}
          playsInline
          loop
          muted={isMuted}
          onClick={togglePlay}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-neutral-950/60 pointer-events-none" />

        {/* Top bar controls */}
        <div className="relative z-10 p-4 flex items-center justify-between pointer-events-auto">
          <Badge variant="primary" size="sm" className="backdrop-blur-md bg-black/40 border-white/20">
            <Sparkles className="w-3 h-3 mr-1 text-violet-400" />
            4K VYBE REEL
          </Badge>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-8 h-8 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/80 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Play/Pause state center overlay icon */}
        {!isPlaying && (
          <div
            onClick={togglePlay}
            className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center border border-white/20 text-white shadow-xl animate-in zoom-in-95">
              <Play className="w-8 h-8 ml-1" />
            </div>
          </div>
        )}

        {/* Bottom Details & Vertical Action Bar */}
        <div className="relative z-10 p-5 flex items-end justify-between gap-4 pointer-events-auto">
          {/* Creator & Caption info */}
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <Link href={`/profile/${reel.author.username}`}>
                <Avatar
                  src={reel.author.avatarUrl}
                  name={reel.author.displayName}
                  size="md"
                  isCreator={reel.author.isCreator}
                />
              </Link>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Link
                    href={`/profile/${reel.author.username}`}
                    className="text-sm font-bold text-white hover:text-violet-300 transition-colors"
                  >
                    {reel.author.displayName}
                  </Link>
                  {reel.author.verified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  )}
                  {user?.id !== reel.author.id && (
                    <button
                      onClick={() => handleToggleFollow(reel.author.id, reel.author.username)}
                      className={`ml-1 text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 transition-all ${
                        isAuthorFollowing
                          ? "bg-neutral-800 text-neutral-300 border-neutral-700"
                          : "bg-violet-600/60 hover:bg-violet-600 text-white border-violet-500/40"
                      }`}
                    >
                      {isAuthorFollowing ? (
                        <>
                          <Check className="w-2.5 h-2.5 text-emerald-400" />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-2.5 h-2.5" />
                          <span>Follow</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                <p className="text-xs text-neutral-400">@{reel.author.username}</p>
              </div>
            </div>

            <p className="text-xs text-neutral-100 line-clamp-2 leading-relaxed">
              {reel.caption}
            </p>

            {/* Audio tag */}
            <div className="flex items-center gap-2 text-xs text-cyan-300 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-cyan-500/30 w-fit">
              <Music className="w-3 h-3 text-cyan-400 animate-spin" />
              <span className="truncate max-w-[200px] text-[11px] font-mono">{reel.musicTitle}</span>
            </div>
          </div>

          {/* Vertical right Action Buttons */}
          <div className="flex flex-col items-center gap-3.5 text-white">
            {/* Like */}
            <button
              onClick={() => handleToggleLike(reel.id)}
              className="flex flex-col items-center gap-1 group cursor-pointer"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all active:scale-90 ${
                  reel.isLiked
                    ? "bg-rose-600/90 border-rose-500 text-white shadow-lg shadow-rose-900/40"
                    : "bg-black/60 border-neutral-700/60 text-neutral-200 group-hover:text-rose-400"
                }`}
              >
                <Heart className={`w-5 h-5 ${reel.isLiked ? "fill-white" : ""}`} />
              </div>
              <span className="text-[11px] font-semibold">
                {reel.likesCount.toLocaleString()}
              </span>
            </button>

            {/* Comments Drawer Trigger */}
            <button
              onClick={() => setIsCommentDrawerOpen(true)}
              className="flex flex-col items-center gap-1 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-black/60 border border-neutral-700/60 flex items-center justify-center backdrop-blur-md text-neutral-200 group-hover:text-cyan-400 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold">{reel.commentsCount + currentComments.length}</span>
            </button>

            {/* Save */}
            <button
              onClick={() => handleToggleSave(reel.id)}
              className="flex flex-col items-center gap-1 group cursor-pointer"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
                  reel.isSaved
                    ? "bg-amber-600/90 border-amber-500 text-white shadow-lg"
                    : "bg-black/60 border-neutral-700/60 text-neutral-200 group-hover:text-amber-400"
                }`}
              >
                <Bookmark className={`w-5 h-5 ${reel.isSaved ? "fill-white" : ""}`} />
              </div>
            </button>

            {/* Share */}
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                toast({
                  type: "success",
                  title: "Reel Link Copied!",
                  message: "Link copied to clipboard.",
                });
              }}
              className="flex flex-col items-center gap-1 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-black/60 border border-neutral-700/60 flex items-center justify-center backdrop-blur-md text-neutral-200 group-hover:text-white transition-colors">
                <Share2 className="w-5 h-5" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Reel Switcher controls */}
      <div className="flex items-center gap-3 mt-4 text-xs">
        <button
          onClick={() => setCurrentReelIndex((prev) => (prev === 0 ? reels.length - 1 : prev - 1))}
          className="px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          Previous Reel
        </button>
        <span className="text-neutral-500 font-mono text-[11px]">
          {currentReelIndex + 1} of {reels.length}
        </span>
        <button
          onClick={() => setCurrentReelIndex((prev) => (prev === reels.length - 1 ? 0 : prev + 1))}
          className="px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          Next Reel
        </button>
      </div>

      {/* REEL COMMENTS MODAL / DRAWER */}
      <Modal
        isOpen={isCommentDrawerOpen}
        onClose={() => setIsCommentDrawerOpen(false)}
        title="Reel Comments"
        maxWidth="sm"
      >
        <div className="flex flex-col gap-4">
          <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
            {currentComments.length === 0 ? (
              <p className="py-6 text-center text-xs text-neutral-500">
                No comments yet. Be the first to start the discussion!
              </p>
            ) : (
              currentComments.map((c) => (
                <div key={c.id} className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white">@{c.author}</span>
                    <span className="text-[10px] text-neutral-500">{c.time}</span>
                  </div>
                  <p className="text-neutral-300">{c.text}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleAddComment} className="flex gap-2 pt-2 border-t border-neutral-800">
            <Input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Add a comment on this reel..."
              className="flex-1 text-xs"
              required
            />
            <Button type="submit" variant="gradient" size="sm" className="px-3">
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      </Modal>

      {/* CREATE REEL MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Publish Vertical Reel"
        description="Share a short-form vertical video (9:16) with audio attribution and hashtags."
        maxWidth="md"
      >
        <form onSubmit={handlePublishReel} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">
              Video Stream URL (.mp4 / webm)
            </label>
            <Input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://assets.mixkit.co/...mp4"
              required
            />
          </div>

          {/* Video Sample Presets */}
          <div>
            <span className="text-[11px] text-neutral-500 font-medium block mb-1.5">
              Or pick ready sample footage:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Night Highway Drive", url: "https://assets.mixkit.co/videos/preview/mixkit-tokyo-traffic-at-night-4228-large.mp4" },
                { label: "App UI Prototype", url: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-smartphone-scrolling-social-media-41131-large.mp4" },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setVideoUrl(p.url)}
                  className="p-2 rounded-xl border border-neutral-800 bg-neutral-900 text-xs text-neutral-300 hover:text-white hover:border-violet-500 text-left"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">
              Thumbnail Poster URL (Optional)
            </label>
            <Input
              type="url"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">
              Caption & Hashtags
            </label>
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Hook your audience... #filmmaking #cinematic"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">
              Music Track Title (Optional)
            </label>
            <Input
              type="text"
              value={musicTitle}
              onChange={(e) => setMusicTitle(e.target.value)}
              placeholder="Artist - Track Name"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              size="sm"
              isLoading={isPublishing}
              leftIcon={<Film className="w-3.5 h-3.5" />}
            >
              Publish Reel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
