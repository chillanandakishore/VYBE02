"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Modal } from "@/components/ui/modal";
import { Search, Bell, Plus, Sparkles, MessageSquare, Flame, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function Topbar() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(2);

  useEffect(() => {
    async function checkNotifs() {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        if (res.ok && data.success) {
          setUnreadNotifsCount(data.unreadCount || 0);
        }
      } catch {
        // Fallback
      }
    }
    checkNotifs();
  }, []);

  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    setIsSubmittingPost(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: postContent.trim(),
          communityName: user?.interests?.[0] ? `✨ ${user.interests[0]}` : "✨ Technology",
          mediaType: "TEXT",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast({
          type: "success",
          title: "Post Published! 🎉",
          message: "Your post is now visible to the VYBE community.",
        });
        setPostContent("");
        setCreateModalOpen(false);
        if (window.location.pathname === "/feed") {
          window.location.reload();
        } else {
          router.push("/feed");
        }
      } else {
        toast({
          type: "error",
          title: data.message || "Failed to publish post",
        });
      }
    } catch {
      toast({ type: "error", title: "Network error publishing post" });
    } finally {
      setIsSubmittingPost(false);
    }
  };

  return (
    <header className="sticky top-0 z-20 w-full h-16 border-b border-neutral-800/80 bg-neutral-950/75 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md hidden sm:flex items-center">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchQuery.trim()) {
              router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
            }
          }}
          placeholder="Search creators, #hashtags, VYBES, or challenges... (Press Enter)"
          className="w-full bg-neutral-900/70 border border-neutral-800/90 rounded-xl pl-10 pr-12 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
        />
        <span className="absolute right-3 text-[10px] text-neutral-500 bg-neutral-800/80 px-1.5 py-0.5 rounded border border-neutral-700/60 font-mono">
          Enter
        </span>
      </div>

      {/* Mobile brand header (when sidebar is hidden) */}
      <div className="flex sm:hidden items-center gap-2">
        <Link href="/feed" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center">
            <span className="text-white font-black text-xs">V</span>
          </div>
          <span className="font-black text-base text-white tracking-tight">VYBE</span>
        </Link>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Create button */}
        <Button
          variant="gradient"
          size="sm"
          onClick={() => setCreateModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="hidden xs:inline-flex"
        >
          Create
        </Button>

        {/* Quick VYBES shortcut */}
        <Link href="/vybes" className="hidden md:inline-flex">
          <button className="p-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-white transition-colors">
            <Flame className="w-4 h-4 text-rose-400" />
          </button>
        </Link>

        {/* Messages */}
        <Link href="/messages" className="hidden sm:inline-flex">
          <button className="relative p-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-white transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-500" />
          </button>
        </Link>

        {/* Notifications */}
        <Link href="/notifications">
          <button
            title="Notifications"
            className="relative p-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-violet-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-neutral-950">
                {unreadNotifsCount}
              </span>
            )}
          </button>
        </Link>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Settings */}
        <Link href="/settings">
          <button
            title="Settings"
            className="p-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </Link>

        {/* User avatar */}
        {user ? (
          <Link href="/profile" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Avatar
              src={user.avatarUrl}
              name={user.displayName}
              size="sm"
              isOnline
              isCreator={user.isCreator}
            />
          </Link>
        ) : (
          <Link href="/login">
            <Button variant="secondary" size="sm">
              Sign In
            </Button>
          </Link>
        )}
      </div>

      {/* Fast Create Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Share on VYBE"
        description="Broadcast your ideas, media, questions, or showcase creative work."
      >
        <form onSubmit={handleCreatePost} className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar
              src={user?.avatarUrl}
              name={user?.displayName || "Guest"}
              size="sm"
            />
            <div>
              <p className="text-xs font-bold text-white">{user?.displayName || "Creator"}</p>
              <span className="text-[11px] text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
                Public VYBE
              </span>
            </div>
          </div>

          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="What are you creating or exploring today? Share code, camera setups, or questions..."
            rows={4}
            className="w-full bg-neutral-950/60 border border-neutral-800 rounded-xl p-3 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-violet-500"
          />

          <div className="flex items-center justify-between pt-2">
            <Link
              href="/studio"
              onClick={() => setCreateModalOpen(false)}
              className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 hover:underline"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Use AI Creator Studio</span>
            </Link>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient"
                size="sm"
                isLoading={isSubmittingPost}
                disabled={!postContent.trim()}
              >
                Publish Post
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </header>
  );
}
