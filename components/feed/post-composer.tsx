/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AVAILABLE_INTERESTS } from "@/lib/db";
import { aiService } from "@/services/ai-service";
import { Post, PostMediaType } from "@/types";
import {
  Image as ImageIcon,
  Video,
  BarChart2,
  HelpCircle,
  Sparkles,
  Send,
  X,
  Plus,
  Flame,
  MapPin,
  Tag,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PostComposerProps {
  onPostCreated?: (post: Post) => void;
}

const SAMPLE_MEDIA_PRESETS = [
  {
    name: "Sony FX3 Color Grade",
    url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1000&auto=format&fit=crop&q=80",
  },
  {
    name: "Tokyo Night Cyberpunk",
    url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1000&auto=format&fit=crop&q=80",
  },
  {
    name: "Clean Desk Setup",
    url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1000&auto=format&fit=crop&q=80",
  },
  {
    name: "AI Agents Architecture",
    url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80",
  },
];

export function PostComposer({ onPostCreated }: PostComposerProps) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [community, setCommunity] = useState<string>(
    user?.interests?.[0] ? `✨ ${user.interests[0]}` : "✨ Technology"
  );
  const [mediaType, setMediaType] = useState<PostMediaType>("TEXT");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [newMediaInput, setNewMediaInput] = useState("");

  // Poll state
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);

  // Question state
  const [questionPrompt, setQuestionPrompt] = useState("");

  // Location & Tags state
  const [tags, setTags] = useState("");
  const [location, setLocation] = useState("");
  const [showTagsInput, setShowTagsInput] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const handleClearForm = () => {
    setContent("");
    setMediaUrls([]);
    setMediaType("TEXT");
    setPollQuestion("");
    setPollOptions(["", ""]);
    setQuestionPrompt("");
    setTags("");
    setLocation("");
    setShowTagsInput(false);
    setShowLocationInput(false);
  };

  const handleAddMediaUrl = (url: string) => {
    if (!url.trim()) return;
    if (mediaUrls.includes(url)) return;
    const updated = [...mediaUrls, url.trim()];
    setMediaUrls(updated);
    setNewMediaInput("");
    setMediaType(updated.length > 1 ? "CAROUSEL" : "IMAGE");
  };

  const handleRemoveMediaUrl = (index: number) => {
    const updated = mediaUrls.filter((_, i) => i !== index);
    setMediaUrls(updated);
    if (updated.length === 0) {
      setMediaType("TEXT");
    } else {
      setMediaType(updated.length > 1 ? "CAROUSEL" : "IMAGE");
    }
  };

  const handleAddPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const handleUpdatePollOption = (index: number, val: string) => {
    const next = [...pollOptions];
    next[index] = val;
    setPollOptions(next);
  };

  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handleGenerateAiCaption = async () => {
    setIsGeneratingAi(true);
    try {
      const topic = content.trim() || community.replace("✨", "").trim() || "Creative showcase";
      const results = await aiService.generateCaptions(topic);
      setAiSuggestions(results.map((r) => r.caption));
      setShowAiModal(true);
    } catch {
      toast({
        type: "error",
        title: "AI Studio Unavailable",
      });
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        type: "warning",
        title: "Sign in required",
        message: "Please sign in to publish posts to the VYBE community.",
      });
      return;
    }

    if (!content.trim() && mediaUrls.length === 0 && !pollQuestion && !questionPrompt) {
      toast({
        type: "warning",
        title: "Empty Post",
        message: "Please write a caption or attach media/poll.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let finalContent = content.trim();
      if (tags.trim()) {
        const formattedTags = tags
          .split(/[\s,]+/)
          .filter(Boolean)
          .map((t) => (t.startsWith("#") ? t : `#${t}`))
          .join(" ");
        finalContent = finalContent ? `${finalContent}\n\n${formattedTags}` : formattedTags;
      }
      if (location.trim()) {
        finalContent = finalContent ? `${finalContent}\n📍 ${location.trim()}` : `📍 ${location.trim()}`;
      }

      const payload: {
        content: string;
        communityName: string;
        mediaUrls: string[];
        mediaType: PostMediaType;
        poll?: { question: string; options: string[] };
        questionPrompt?: string;
      } = {
        content: finalContent,
        communityName: community,
        mediaUrls,
        mediaType,
      };

      if (mediaType === "POLL" && pollQuestion.trim()) {
        const validOptions = pollOptions.map((o) => o.trim()).filter(Boolean);
        if (validOptions.length < 2) {
          toast({
            type: "warning",
            title: "Incomplete Poll",
            message: "Polls must contain at least 2 options.",
          });
          setIsSubmitting(false);
          return;
        }
        payload.poll = {
          question: pollQuestion.trim(),
          options: validOptions,
        };
      }

      if (mediaType === "QUESTION" && questionPrompt.trim()) {
        payload.questionPrompt = questionPrompt.trim();
      }

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast({
          type: "success",
          title: "Post Published!",
          message: `Your post is now live in ${community}!`,
        });

        // Reset fields
        handleClearForm();

        if (onPostCreated && data.post) {
          onPostCreated(data.post);
        }
      } else {
        toast({
          type: "error",
          title: "Posting Failed",
          message: data.message || "Failed to create post.",
        });
      }
    } catch {
      toast({
        type: "error",
        title: "Network Error",
        message: "Unable to create post right now. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-5 bg-neutral-900/70 border-neutral-800/80 shadow-xl backdrop-blur-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Top User Bar + Community Target Selector */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <Avatar
              src={user?.avatarUrl}
              name={user?.displayName || "You"}
              size="sm"
              isOnline
              isCreator={user?.isCreator}
            />
            <div>
              <p className="text-xs font-bold text-white leading-tight">
                {user?.displayName || "Creator"}
              </p>
              <p className="text-[11px] text-neutral-400">@{user?.username || "guest"}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-neutral-950/80 px-2.5 py-1 rounded-xl border border-neutral-800">
            <Flame className="w-3.5 h-3.5 text-violet-400" />
            <select
              value={community}
              onChange={(e) => setCommunity(e.target.value)}
              className="bg-transparent text-xs font-medium text-white outline-none cursor-pointer pr-1"
            >
              {AVAILABLE_INTERESTS.map((interest) => (
                <option key={interest.id} value={`✨ ${interest.name}`} className="bg-neutral-900 text-white">
                  {interest.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts, camera settings, code architecture, or questions with your VYBE..."
            rows={3}
            className="w-full bg-neutral-950/70 border border-neutral-800/90 rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder:text-neutral-500 outline-none focus:border-violet-500 transition-colors resize-none leading-relaxed"
          />
        </div>

        {/* Optional Location Input */}
        {showLocationInput && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-950/70 border border-neutral-800 animate-in fade-in duration-150">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add location (e.g. San Francisco, CA or Studio A)..."
              className="w-full bg-transparent text-xs text-white placeholder:text-neutral-500 outline-none"
            />
            {location && (
              <button
                type="button"
                onClick={() => setLocation("")}
                className="text-neutral-500 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Optional Tags Input */}
        {showTagsInput && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-950/70 border border-neutral-800 animate-in fade-in duration-150">
            <Tag className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Add tags separated by space or commas (e.g. photography, nextjs, cinematic)..."
              className="w-full bg-transparent text-xs text-white placeholder:text-neutral-500 outline-none"
            />
            {tags && (
              <button
                type="button"
                onClick={() => setTags("")}
                className="text-neutral-500 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Media Attachments Preview Tray */}
        {mediaUrls.length > 0 && (
          <div className="flex flex-col gap-2 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="font-semibold text-white">
                {mediaUrls.length > 1 ? "Carousel Images" : "Single Image"} ({mediaUrls.length})
              </span>
              <span className="text-[10px] text-violet-400">Drag or click to re-order in Phase 3</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {mediaUrls.map((url, idx) => (
                <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-neutral-800 group">
                  <img src={url} alt={`Media ${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveMediaUrl(idx)}
                    className="absolute top-1 right-1 p-1 rounded-md bg-black/70 text-white hover:bg-rose-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded bg-black/60 text-[9px] font-mono text-neutral-300">
                    #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Interactive Poll Creator */}
        {mediaType === "POLL" && (
          <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-cyan-400" /> Interactive Poll
              </span>
              <button
                type="button"
                onClick={() => setMediaType("TEXT")}
                className="text-xs text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              placeholder="Ask a question for your community poll..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-cyan-500"
            />

            <div className="space-y-2">
              {pollOptions.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleUpdatePollOption(i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-violet-500"
                  />
                  {pollOptions.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePollOption(i)}
                      className="p-1.5 text-neutral-500 hover:text-rose-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {pollOptions.length < 4 && (
              <button
                type="button"
                onClick={handleAddPollOption}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 self-start"
              >
                <Plus className="w-3.5 h-3.5" /> Add option
              </button>
            )}
          </div>
        )}

        {/* Community Question Prompt Creator */}
        {mediaType === "QUESTION" && (
          <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-800/40 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-violet-300 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-violet-400" /> Ask VYBE Question
              </span>
              <button
                type="button"
                onClick={() => setMediaType("TEXT")}
                className="text-xs text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              value={questionPrompt}
              onChange={(e) => setQuestionPrompt(e.target.value)}
              placeholder="e.g. What is the best DaVinci export setting for YouTube 4K HDR?"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-violet-500"
            />
          </div>
        )}

        {/* Attachment Buttons Bar & AI Integration */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-neutral-800/60">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {/* Image / Carousel button */}
            <button
              type="button"
              onClick={() => {
                const url = prompt("Enter Image URL (or pick from sample presets):");
                if (url) handleAddMediaUrl(url);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-800/70 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Photo / Carousel</span>
            </button>

            {/* Video button */}
            <button
              type="button"
              onClick={() => {
                const url = prompt("Enter Video or Reel URL:");
                if (url) {
                  setMediaUrls([url]);
                  setMediaType("VIDEO");
                }
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-800/70 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
            >
              <Video className="w-3.5 h-3.5 text-rose-400" />
              <span>Video</span>
            </button>

            {/* Poll button */}
            <button
              type="button"
              onClick={() => setMediaType("POLL")}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-colors ${
                mediaType === "POLL"
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                  : "bg-neutral-800/70 hover:bg-neutral-800 text-neutral-300 border-transparent"
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Poll</span>
            </button>

            {/* Question button */}
            <button
              type="button"
              onClick={() => setMediaType("QUESTION")}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-colors ${
                mediaType === "QUESTION"
                  ? "bg-violet-500/20 text-violet-300 border-violet-500/40"
                  : "bg-neutral-800/70 hover:bg-neutral-800 text-neutral-300 border-transparent"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Question</span>
            </button>

            {/* Location button */}
            <button
              type="button"
              onClick={() => setShowLocationInput(!showLocationInput)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                showLocationInput || location
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-neutral-800/70 hover:bg-neutral-800 text-neutral-300 border-transparent"
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Location</span>
            </button>

            {/* Tags button */}
            <button
              type="button"
              onClick={() => setShowTagsInput(!showTagsInput)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                showTagsInput || tags
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                  : "bg-neutral-800/70 hover:bg-neutral-800 text-neutral-300 border-transparent"
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tags</span>
            </button>

            {/* AI Generator button */}
            <button
              type="button"
              disabled={isGeneratingAi}
              onClick={handleGenerateAiCaption}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-violet-950/40 hover:bg-violet-900/60 border border-violet-800/40 text-violet-300 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>{isGeneratingAi ? "Generating..." : "VYBE AI"}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {(content || mediaUrls.length > 0 || location || tags || pollQuestion || questionPrompt) && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearForm}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                Cancel
              </Button>
            )}

            <Button
              type="submit"
              variant="gradient"
              size="sm"
              isLoading={isSubmitting}
              rightIcon={<Send className="w-3.5 h-3.5" />}
              className="w-full sm:w-auto"
            >
              Publish Post
            </Button>
          </div>
        </div>

        {/* Quick Sample Media Presets Picker */}
        {mediaUrls.length === 0 && (
          <div className="flex items-center gap-1.5 pt-1 text-[11px] text-neutral-500 overflow-x-auto no-scrollbar">
            <span className="font-semibold text-neutral-400 shrink-0">Sample Media:</span>
            {SAMPLE_MEDIA_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleAddMediaUrl(preset.url)}
                className="px-2 py-0.5 rounded bg-neutral-800/50 hover:bg-neutral-800 text-neutral-300 shrink-0 transition-colors"
              >
                + {preset.name}
              </button>
            ))}
          </div>
        )}
      </form>

      {/* AI Suggestions Inline Modal */}
      {showAiModal && (
        <div className="mt-4 p-4 rounded-xl bg-violet-950/30 border border-violet-800/40 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-violet-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-violet-400" /> Generated by VYBE AI
            </span>
            <button
              type="button"
              onClick={() => setShowAiModal(false)}
              className="text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            {aiSuggestions.map((suggestion, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setContent(suggestion);
                  setShowAiModal(false);
                  toast({
                    type: "success",
                    title: "Applied AI Caption!",
                  });
                }}
                className="p-3 rounded-lg bg-neutral-900/80 hover:bg-violet-900/30 border border-neutral-800 hover:border-violet-600/50 text-xs text-neutral-200 cursor-pointer transition-colors leading-relaxed"
              >
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
