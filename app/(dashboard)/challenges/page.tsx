/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Tabs } from "@/components/ui/tabs";
import {
  Trophy,
  Calendar,
  Users,
  Award,
  ArrowRight,
  Flame,
  Plus,
  Heart,
  Sparkles,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ChallengeItem, ChallengeEntry } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

export default function ChallengesPage() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<ChallengeItem[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeItem | null>(null);
  const [activeTab, setActiveTab] = useState("challenges");
  const [isLoading, setIsLoading] = useState(true);

  // Submit Entry modal state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [entryTitle, setEntryTitle] = useState("");
  const [entryImageUrl, setEntryImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchChallenges = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/challenges");
      const data = await res.json();
      if (res.ok && data.success) {
        setChallenges(data.challenges || []);
        if (data.challenges?.length > 0 && !selectedChallenge) {
          setSelectedChallenge(data.challenges[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load challenges", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleVoteEntry = async (challengeId: string, entryId: string) => {
    if (!user) {
      toast({
        type: "warning",
        title: "Sign in required",
        message: "Please sign in to vote on challenge submissions.",
      });
      return;
    }

    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === challengeId && ch.entries) {
          return {
            ...ch,
            entries: ch.entries.map((e) => {
              if (e.id === entryId) {
                const nextVoted = !e.hasVoted;
                return {
                  ...e,
                  hasVoted: nextVoted,
                  votesCount: nextVoted ? e.votesCount + 1 : Math.max(0, e.votesCount - 1),
                };
              }
              return e;
            }),
          };
        }
        return ch;
      })
    );

    if (selectedChallenge && selectedChallenge.id === challengeId && selectedChallenge.entries) {
      setSelectedChallenge((prev) =>
        prev
          ? {
              ...prev,
              entries: prev.entries?.map((e) => {
                if (e.id === entryId) {
                  const nextVoted = !e.hasVoted;
                  return {
                    ...e,
                    hasVoted: nextVoted,
                    votesCount: nextVoted ? e.votesCount + 1 : Math.max(0, e.votesCount - 1),
                  };
                }
                return e;
              }),
            }
          : null
      );
    }

    try {
      const res = await fetch(`/api/challenges/${challengeId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast({
          type: "success",
          title: data.hasVoted ? "Vote Cast!" : "Vote Removed",
        });
      }
    } catch {
      fetchChallenges();
    }
  };

  const handleSubmitEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallenge || !entryTitle.trim() || !entryImageUrl.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/challenges/${selectedChallenge.id}/enter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: entryTitle.trim(),
          imageUrl: entryImageUrl.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast({
          type: "success",
          title: "Entry Submitted!",
          message: "Your submission is now on the live leaderboard.",
        });

        setSelectedChallenge((prev) =>
          prev
            ? {
                ...prev,
                entriesCount: prev.entriesCount + 1,
                entries: [data.entry, ...(prev.entries || [])],
              }
            : null
        );

        setEntryTitle("");
        setEntryImageUrl("");
        setIsSubmitModalOpen(false);
      } else {
        toast({
          type: "error",
          title: "Submission failed",
          message: data.message,
        });
      }
    } catch {
      toast({
        type: "error",
        title: "Network error",
        message: "Failed to submit entry.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="warning" size="sm">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Community Competitions
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Creator Challenges
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Push your creative craft. Submit entries to interest-based sprints, climb the community
            leaderboard, and earn recognized creator badges.
          </p>
        </div>

        {selectedChallenge && (
          <Button
            variant="gradient"
            size="sm"
            onClick={() => setIsSubmitModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Submit Entry
          </Button>
        )}
      </div>

      {/* Main Tabs */}
      <Tabs
        tabs={[
          { id: "challenges", label: "Active Challenges", icon: <Flame className="w-3.5 h-3.5" /> },
          { id: "leaderboard", label: "Live Leaderboard", icon: <Trophy className="w-3.5 h-3.5" /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {isLoading ? (
        <div className="py-24 text-center text-xs text-neutral-500 font-mono flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
          <span>Loading challenges & leaderboards...</span>
        </div>
      ) : activeTab === "challenges" ? (
        /* CHALLENGES CARDS */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((ch) => (
            <Card
              key={ch.id}
              className="group overflow-hidden bg-neutral-900/60 border-neutral-800/80 hover:border-amber-500/50 transition-all flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="h-40 w-full relative overflow-hidden bg-neutral-950">
                  <img
                    src={ch.coverImage}
                    alt={ch.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="primary" size="sm">
                      {ch.communityName}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-neutral-300">
                    <span className="font-mono text-amber-300">{ch.daysRemaining} days left</span>
                    <span className="font-mono">{ch.participantsCount} joined</span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    {ch.title}
                  </h3>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed line-clamp-2">
                    {ch.description}
                  </p>

                  <div className="mt-4 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-semibold">Reward</span>
                      <span className="text-xs font-bold text-white">{ch.rewardBadge}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedChallenge(ch);
                    setActiveTab("leaderboard");
                  }}
                  className="flex-1 text-xs"
                >
                  View Leaderboard
                </Button>

                <Button
                  variant="gradient"
                  size="sm"
                  onClick={() => {
                    setSelectedChallenge(ch);
                    setIsSubmitModalOpen(true);
                  }}
                  className="text-xs"
                >
                  Enter
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* LEADERBOARD VIEW */
        <div className="space-y-6">
          {/* Challenge Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {challenges.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setSelectedChallenge(ch)}
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold shrink-0 transition-colors ${
                  selectedChallenge?.id === ch.id
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm"
                    : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
                }`}
              >
                {ch.title}
              </button>
            ))}
          </div>

          {selectedChallenge && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white">{selectedChallenge.title} Leaderboard</h3>
                  <p className="text-xs text-neutral-400">
                    Community entries ranked by member votes. Voting closes in {selectedChallenge.daysRemaining} days.
                  </p>
                </div>

                <Button
                  variant="gradient"
                  size="sm"
                  onClick={() => setIsSubmitModalOpen(true)}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Submit My Entry
                </Button>
              </div>

              {(!selectedChallenge.entries || selectedChallenge.entries.length === 0) ? (
                <Card className="p-12 text-center bg-neutral-900/40 border-neutral-800">
                  <Trophy className="w-10 h-10 text-neutral-600 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-semibold text-white mb-1">No submissions yet</p>
                  <p className="text-xs text-neutral-400 mb-4">
                    Be the very first creator to enter this challenge and take #1 on the leaderboard!
                  </p>
                  <Button variant="gradient" size="sm" onClick={() => setIsSubmitModalOpen(true)}>
                    Submit Entry
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedChallenge.entries.map((entry, idx) => (
                    <Card
                      key={entry.id}
                      className="overflow-hidden bg-neutral-900/70 border-neutral-800 hover:border-amber-500/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Image */}
                        <div className="aspect-square w-full relative overflow-hidden bg-neutral-950">
                          <img
                            src={entry.imageUrl}
                            alt={entry.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
                          <div className="absolute top-3 left-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-black shadow-md ${
                                idx === 0
                                  ? "bg-amber-500 text-black ring-2 ring-amber-300"
                                  : idx === 1
                                  ? "bg-slate-300 text-black"
                                  : idx === 2
                                  ? "bg-amber-700 text-white"
                                  : "bg-black/60 text-white border border-white/20"
                              }`}
                            >
                              #{idx + 1}
                            </span>
                          </div>
                        </div>

                        {/* Title & Author */}
                        <div className="p-4">
                          <h4 className="text-xs font-bold text-white line-clamp-1 mb-2">
                            {entry.title}
                          </h4>
                          <Link
                            href={`/profile/${entry.author.username}`}
                            className="flex items-center gap-2 group"
                          >
                            <Avatar src={entry.author.avatarUrl} name={entry.author.displayName} size="xs" />
                            <span className="text-xs text-neutral-300 group-hover:text-amber-300 transition-colors">
                              @{entry.author.username}
                            </span>
                          </Link>
                        </div>
                      </div>

                      {/* Vote action */}
                      <div className="p-4 pt-0 flex items-center justify-between border-t border-neutral-800/60 pt-3">
                        <span className="text-xs font-mono font-bold text-amber-400">
                          {entry.votesCount} {entry.votesCount === 1 ? "vote" : "votes"}
                        </span>

                        <Button
                          variant={entry.hasVoted ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => handleVoteEntry(selectedChallenge.id, entry.id)}
                          className="text-xs h-7 px-3"
                          leftIcon={
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                entry.hasVoted ? "text-rose-500 fill-rose-500" : ""
                              }`}
                            />
                          }
                        >
                          {entry.hasVoted ? "Voted" : "Vote"}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SUBMIT CHALLENGE ENTRY MODAL */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title={`Enter ${selectedChallenge?.title}`}
        description="Submit your image or creation for community leaderboard scoring."
        maxWidth="md"
      >
        <form onSubmit={handleSubmitEntry} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">
              Submission Title
            </label>
            <Input
              type="text"
              value={entryTitle}
              onChange={(e) => setEntryTitle(e.target.value)}
              placeholder="e.g. Neon Reflections on Wet Shinjuku Asphalt"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">
              Image URL
            </label>
            <Input
              type="url"
              value={entryImageUrl}
              onChange={(e) => setEntryImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              required
            />
          </div>

          {/* Quick presets */}
          <div>
            <span className="text-[11px] text-neutral-500 font-medium block mb-1.5">
              Or pick ready photo:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Tokyo Alleyway", url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=900&auto=format&fit=crop&q=80" },
                { label: "Neon Crosswalk", url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=900&auto=format&fit=crop&q=80" },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setEntryImageUrl(p.url)}
                  className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-[11px] text-neutral-300 hover:text-white hover:border-amber-500 text-left"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsSubmitModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              size="sm"
              isLoading={isSubmitting}
            >
              Submit to Leaderboard
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
