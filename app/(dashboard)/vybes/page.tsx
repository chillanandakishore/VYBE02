/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import {
  Flame,
  Users,
  Check,
  Plus,
  MessageSquare,
  Trophy,
  Calendar,
  Sparkles,
  Download,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CommunityItem } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

export default function VybesPage() {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<CommunityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityItem | null>(null);
  const [activeModalTab, setActiveModalTab] = useState("overview");

  // New discussion state
  const [isDiscussionModalOpen, setIsDiscussionModalOpen] = useState(false);
  const [discussionTitle, setDiscussionTitle] = useState("");
  const [discussionContent, setDiscussionContent] = useState("");
  const [isPostingDiscussion, setIsPostingDiscussion] = useState(false);

  const fetchCommunities = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/vybes");
      const data = await res.json();
      if (res.ok && data.success) {
        setCommunities(data.communities || []);
      }
    } catch (err) {
      console.error("Failed to load communities", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const handleToggleJoin = async (slug: string, name: string) => {
    if (!user) {
      toast({
        type: "warning",
        title: "Sign in required",
        message: "Please sign in to join communities.",
      });
      return;
    }

    setCommunities((prev) =>
      prev.map((c) => {
        if (c.slug === slug) {
          const nextJoined = !c.isJoined;
          return {
            ...c,
            isJoined: nextJoined,
            membersCount: nextJoined ? c.membersCount + 1 : Math.max(0, c.membersCount - 1),
          };
        }
        return c;
      })
    );

    try {
      const res = await fetch(`/api/vybes/${slug}/join`, { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        toast({
          type: "success",
          title: data.message,
        });
      }
    } catch {
      fetchCommunities();
    }
  };

  const handleCreateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCommunity || !discussionTitle.trim() || !discussionContent.trim()) return;

    setIsPostingDiscussion(true);
    try {
      const res = await fetch(`/api/vybes/${selectedCommunity.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: discussionTitle.trim(),
          content: discussionContent.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast({
          type: "success",
          title: "Discussion Started!",
          message: "Community members can now reply.",
        });

        setSelectedCommunity((prev) =>
          prev ? { ...prev, discussions: [data.discussion, ...(prev.discussions || [])] } : null
        );

        setDiscussionTitle("");
        setDiscussionContent("");
        setIsDiscussionModalOpen(false);
      }
    } catch {
      toast({
        type: "error",
        title: "Error",
        message: "Failed to post discussion.",
      });
    } finally {
      setIsPostingDiscussion(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent" size="sm">
              <Flame className="w-3.5 h-3.5 text-pink-400" /> The VYBE System
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Interest-Based Communities
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            A VYBE is a specialized interest hub where creators, students, and practitioners share
            resources, participate in challenges, join live events, and discuss techniques.
          </p>
        </div>

        <Link href="/challenges">
          <Button variant="outline" size="sm" leftIcon={<Trophy className="w-3.5 h-3.5 text-amber-400" />}>
            Active Challenges
          </Button>
        </Link>
      </div>

      {/* VYBE Hubs Grid */}
      {isLoading ? (
        <div className="py-24 text-center text-xs text-neutral-500 font-mono flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
          <span>Loading VYBE communities...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((comm) => (
            <Card
              key={comm.id}
              className="group overflow-hidden bg-neutral-900/60 border-neutral-800/80 hover:border-violet-500/50 transition-all flex flex-col justify-between shadow-lg"
            >
              <div>
                {/* Cover Image Banner */}
                <div className="h-32 w-full relative overflow-hidden bg-neutral-950">
                  <img
                    src={comm.coverImage}
                    alt={comm.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-cyan-300">
                      {comm.membersCount.toLocaleString()} members
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                      {comm.name}
                    </h3>
                  </div>

                  <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed mb-4">
                    {comm.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {comm.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-neutral-800/80 border border-neutral-700/60 text-[10px] text-neutral-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCommunity(comm);
                    setActiveModalTab("overview");
                  }}
                  className="flex-1 text-xs"
                >
                  Explore Hub
                </Button>

                <Button
                  variant={comm.isJoined ? "secondary" : "gradient"}
                  size="sm"
                  onClick={() => handleToggleJoin(comm.slug, comm.name)}
                  className="text-xs shrink-0"
                  leftIcon={
                    comm.isJoined ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )
                  }
                >
                  {comm.isJoined ? "Joined" : "Join"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* COMMUNITY DETAIL MODAL */}
      {selectedCommunity && (
        <Modal
          isOpen={!!selectedCommunity}
          onClose={() => setSelectedCommunity(null)}
          title={selectedCommunity.name}
          description={selectedCommunity.tagline}
          maxWidth="lg"
        >
          <div className="flex flex-col gap-4">
            {/* Modal Tabs */}
            <Tabs
              tabs={[
                { id: "overview", label: "Overview & Rules" },
                {
                  id: "discussions",
                  label: "Discussions",
                  badge: selectedCommunity.discussions?.length || 0,
                },
                {
                  id: "resources",
                  label: "Resources",
                  badge: selectedCommunity.resources?.length || 0,
                },
              ]}
              activeTab={activeModalTab}
              onChange={setActiveModalTab}
            />

            {/* TAB 1: OVERVIEW */}
            {activeModalTab === "overview" && (
              <div className="space-y-4 text-xs">
                <p className="text-neutral-200 leading-relaxed">
                  {selectedCommunity.description}
                </p>

                <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Community Rules
                  </h4>
                  <ul className="space-y-1.5 text-neutral-300 list-disc list-inside">
                    {selectedCommunity.rules.map((rule, idx) => (
                      <li key={idx}>{rule}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-neutral-400 font-mono">
                    Total members: {selectedCommunity.membersCount.toLocaleString()}
                  </span>
                  <Button
                    variant={selectedCommunity.isJoined ? "secondary" : "gradient"}
                    size="sm"
                    onClick={() => handleToggleJoin(selectedCommunity.slug, selectedCommunity.name)}
                  >
                    {selectedCommunity.isJoined ? "Leave Community" : "Join Community"}
                  </Button>
                </div>
              </div>
            )}

            {/* TAB 2: DISCUSSIONS */}
            {activeModalTab === "discussions" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    Recent Topics
                  </span>
                  <Button
                    variant="gradient"
                    size="sm"
                    onClick={() => setIsDiscussionModalOpen(true)}
                    className="text-xs py-1 px-2.5 h-7"
                    leftIcon={<Plus className="w-3 h-3" />}
                  >
                    Start Topic
                  </Button>
                </div>

                {(!selectedCommunity.discussions || selectedCommunity.discussions.length === 0) ? (
                  <p className="py-8 text-center text-xs text-neutral-500">
                    No discussions started yet. Be the first to start a conversation!
                  </p>
                ) : (
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {selectedCommunity.discussions.map((d) => (
                      <div
                        key={d.id}
                        className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar src={d.author.avatarUrl} name={d.author.displayName} size="xs" />
                          <span className="text-xs font-bold text-white">{d.author.displayName}</span>
                          <span className="text-[10px] text-neutral-500 font-mono ml-auto">
                            {d.repliesCount} replies
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-violet-300 mt-1">{d.title}</h4>
                        <p className="text-xs text-neutral-300 mt-0.5 leading-relaxed">{d.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: RESOURCES */}
            {activeModalTab === "resources" && (
              <div className="space-y-3">
                {(!selectedCommunity.resources || selectedCommunity.resources.length === 0) ? (
                  <p className="py-8 text-center text-xs text-neutral-500">
                    No resources uploaded yet. Check back soon for community presets and templates!
                  </p>
                ) : (
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {selectedCommunity.resources.map((res) => (
                      <div
                        key={res.id}
                        className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="primary" size="sm" className="text-[9px]">
                              {res.type}
                            </Badge>
                            <h4 className="text-xs font-bold text-white">{res.title}</h4>
                          </div>
                          <p className="text-xs text-neutral-400 mt-1">{res.description}</p>
                          <span className="text-[10px] text-cyan-400 font-mono mt-1 block">
                            {res.downloadsCount.toLocaleString()} downloads
                          </span>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast({
                              type: "success",
                              title: "Downloading Resource",
                              message: `Saved ${res.title} to downloads.`,
                            });
                          }}
                          leftIcon={<Download className="w-3.5 h-3.5" />}
                          className="shrink-0 text-xs"
                        >
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* NEW DISCUSSION MODAL */}
      <Modal
        isOpen={isDiscussionModalOpen}
        onClose={() => setIsDiscussionModalOpen(false)}
        title="Start Community Discussion"
        description={`Post a topic in ${selectedCommunity?.name}`}
        maxWidth="md"
      >
        <form onSubmit={handleCreateDiscussion} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">
              Discussion Title
            </label>
            <Input
              type="text"
              value={discussionTitle}
              onChange={(e) => setDiscussionTitle(e.target.value)}
              placeholder="e.g. CST vs ACES highlight rolloff comparison"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">
              Detailed Question or Findings
            </label>
            <Textarea
              value={discussionContent}
              onChange={(e) => setDiscussionContent(e.target.value)}
              placeholder="Share your experiments, workflow, or question..."
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDiscussionModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              size="sm"
              isLoading={isPostingDiscussion}
            >
              Publish Topic
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
