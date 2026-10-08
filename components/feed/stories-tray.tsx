/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StoryItem } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import {
  Plus,
  Heart,
  Send,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Camera,
  Play,
  Pause,
} from "lucide-react";
import Link from "next/link";

export function StoriesTray() {
  const { user } = useAuth();
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState("");

  // Create Story Form state
  const [mediaUrl, setMediaUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const fetchStories = async () => {
    try {
      const res = await fetch("/api/stories");
      const data = await res.json();
      if (res.ok && data.success) {
        setStories(data.stories || []);
      }
    } catch (err) {
      console.error("Failed to load stories", err);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // Story playback timer (5 seconds per slide)
  useEffect(() => {
    if (!isViewerOpen || activeStoryIndex === null || isPaused) return;

    const interval = 50; // update every 50ms
    const step = (interval / 5000) * 100; // 5000ms total

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Advance to next story
          if (activeStoryIndex < stories.length - 1) {
            setActiveStoryIndex((curr) => (curr !== null ? curr + 1 : 0));
            return 0;
          } else {
            // Close viewer at end
            setIsViewerOpen(false);
            setActiveStoryIndex(null);
            return 0;
          }
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isViewerOpen, activeStoryIndex, isPaused, stories.length]);

  const openStoryViewer = (index: number) => {
    setActiveStoryIndex(index);
    setProgress(0);
    setIsPaused(false);
    setIsViewerOpen(true);
  };

  const handleNextStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
      setProgress(0);
    } else {
      setIsViewerOpen(false);
    }
  };

  const handlePrevStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
      setProgress(0);
    }
  };

  const handleLikeStory = async () => {
    if (activeStoryIndex === null) return;
    const current = stories[activeStoryIndex];
    if (!current) return;

    const nextLiked = !current.isLiked;
    const nextCount = nextLiked ? current.likesCount + 1 : Math.max(0, current.likesCount - 1);

    setStories((prev) =>
      prev.map((s, idx) =>
        idx === activeStoryIndex ? { ...s, isLiked: nextLiked, likesCount: nextCount } : s
      )
    );

    try {
      await fetch(`/api/stories/${current.id}/like`, { method: "POST" });
    } catch {
      // Ignore
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || activeStoryIndex === null) return;
    const current = stories[activeStoryIndex];

    toast({
      type: "success",
      title: "Reply Sent!",
      message: `Sent to @${current.author.username}`,
    });

    setReplyText("");
  };

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl.trim()) return;

    setIsPosting(true);
    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaUrl: mediaUrl.trim(),
          caption: caption.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast({
          type: "success",
          title: "Story Published!",
          message: "Your story is live for 24 hours.",
        });
        setStories((prev) => [data.story, ...prev]);
        setMediaUrl("");
        setCaption("");
        setIsCreateOpen(false);
      } else {
        toast({
          type: "error",
          title: "Failed to post story",
          message: data.message,
        });
      }
    } catch {
      toast({
        type: "error",
        title: "Network error",
        message: "Unable to publish story.",
      });
    } finally {
      setIsPosting(false);
    }
  };

  const activeStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;

  return (
    <>
      {/* Stories Tray Carousel */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2 pt-1 no-scrollbar select-none">
        {/* User's "Add Story" Button */}
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="relative group p-0.5 rounded-full transition-transform active:scale-95 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-neutral-900 border-2 border-dashed border-neutral-700 hover:border-violet-500 flex items-center justify-center transition-colors">
              <Avatar
                src={user?.avatarUrl}
                name={user?.displayName || "You"}
                size="md"
                className="opacity-70 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-violet-600 border-2 border-neutral-950 flex items-center justify-center text-white shadow-md">
                <Plus className="w-3 h-3" />
              </div>
            </div>
          </button>
          <span className="text-[11px] font-medium text-neutral-300">Your Story</span>
        </div>

        {/* Active Creator Stories */}
        {stories.map((story, idx) => (
          <div key={story.id} className="flex flex-col items-center gap-1.5 shrink-0">
            <button
              onClick={() => openStoryViewer(idx)}
              className="relative p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-violet-600 hover:scale-105 transition-transform active:scale-95 cursor-pointer shadow-md"
            >
              <div className="p-0.5 bg-neutral-950 rounded-full">
                <Avatar
                  src={story.author.avatarUrl}
                  name={story.author.displayName}
                  size="md"
                  isCreator={story.author.isCreator}
                />
              </div>
            </button>
            <span className="text-[11px] font-medium text-neutral-300 max-w-[68px] truncate">
              {story.author.displayName.split(" ")[0]}
            </span>
          </div>
        ))}
      </div>

      {/* FULLSCREEN STORY VIEWER MODAL */}
      {isViewerOpen && activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
          {/* Close button */}
          <button
            onClick={() => setIsViewerOpen(false)}
            className="absolute top-6 right-6 z-50 p-2 rounded-full bg-neutral-900/80 border border-neutral-700 text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Navigation Chevron */}
          {activeStoryIndex! > 0 && (
            <button
              onClick={handlePrevStory}
              className="hidden sm:flex absolute left-8 z-40 p-3 rounded-full bg-neutral-900/60 border border-neutral-800 text-white hover:bg-neutral-800 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Right Navigation Chevron */}
          {activeStoryIndex! < stories.length - 1 && (
            <button
              onClick={handleNextStory}
              className="hidden sm:flex absolute right-8 z-40 p-3 rounded-full bg-neutral-900/60 border border-neutral-800 text-white hover:bg-neutral-800 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Story Card Container (9:16 Aspect Ratio) */}
          <div
            className="relative w-full max-w-sm h-[88vh] max-h-[780px] rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-2xl flex flex-col justify-between"
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {/* Story Media Background */}
            <img
              src={activeStory.mediaUrl}
              alt="Story content"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

            {/* Top Bar with Progress Indicators */}
            <div className="relative z-20 p-4 space-y-3">
              {/* Progress Bar Segments */}
              <div className="flex items-center gap-1.5 w-full">
                {stories.map((s, idx) => (
                  <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-75"
                      style={{
                        width:
                          idx < activeStoryIndex!
                            ? "100%"
                            : idx === activeStoryIndex
                            ? `${progress}%`
                            : "0%",
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Creator Info */}
              <div className="flex items-center justify-between">
                <Link
                  href={`/profile/${activeStory.author.username}`}
                  onClick={() => setIsViewerOpen(false)}
                  className="flex items-center gap-2.5 group"
                >
                  <Avatar
                    src={activeStory.author.avatarUrl}
                    name={activeStory.author.displayName}
                    size="sm"
                    isCreator={activeStory.author.isCreator}
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors">
                        {activeStory.author.displayName}
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-300">
                      @{activeStory.author.username}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-1 rounded-lg bg-black/40 text-white/80 hover:text-white"
                >
                  {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Tap zones for Mobile (Left 30% back, Right 70% next) */}
            <div className="absolute inset-0 z-10 flex">
              <div className="w-1/3 h-full cursor-pointer" onClick={handlePrevStory} />
              <div className="w-2/3 h-full cursor-pointer" onClick={handleNextStory} />
            </div>

            {/* Bottom Caption & Interactive Reply Bar */}
            <div className="relative z-20 p-4 space-y-3">
              {activeStory.caption && (
                <p className="text-xs text-white/95 bg-black/50 backdrop-blur-md p-2.5 rounded-xl border border-white/10 leading-relaxed">
                  {activeStory.caption}
                </p>
              )}

              <div className="flex items-center gap-2">
                <form onSubmit={handleSendReply} className="flex-1 relative">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${activeStory.author.displayName}...`}
                    className="w-full bg-black/60 border border-white/20 rounded-full pl-4 pr-10 py-2 text-xs text-white placeholder:text-neutral-400 focus:outline-none focus:border-violet-400 backdrop-blur-md"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

                <button
                  onClick={handleLikeStory}
                  className="p-2 rounded-full bg-black/60 border border-white/20 text-white hover:scale-110 active:scale-95 transition-transform backdrop-blur-md"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      activeStory.isLiked ? "text-rose-500 fill-rose-500" : "text-white"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE STORY MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add to Your Story"
        description="Share a moment, behind the scenes, or preview. Disappears after 24 hours."
        maxWidth="md"
      >
        <form onSubmit={handleCreateStory} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">
              Media Image URL
            </label>
            <Input
              type="url"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              required
            />
          </div>

          {/* Quick presets */}
          <div>
            <span className="text-[11px] text-neutral-500 font-medium block mb-1.5">
              Or pick sample media:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Night Studio", url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=900&auto=format&fit=crop&q=80" },
                { label: "Code Screen", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=80" },
                { label: "Tokyo Neon", url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=900&auto=format&fit=crop&q=80" },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setMediaUrl(p.url)}
                  className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-[11px] text-neutral-300 hover:text-white hover:border-violet-500 text-center"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">
              Story Caption (Optional)
            </label>
            <Input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's happening right now?"
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
              isLoading={isPosting}
              leftIcon={<Camera className="w-3.5 h-3.5" />}
            >
              Share Story
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
