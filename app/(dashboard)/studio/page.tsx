"use client";

import React, { useState } from "react";
import {
  aiService,
  CaptionGenerationResult,
  ReelIdeaResult,
  ThumbnailIdeaResult,
  ContentImprovementResult,
} from "@/services/ai-service";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import {
  Sparkles,
  Copy,
  Check,
  Wand2,
  Film,
  Hash,
  MessageSquare,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Flame,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState("captions");
  const [prompt, setPrompt] = useState("Sunset photo at Hyderabad");
  const [isGenerating, setIsGenerating] = useState(false);
  const [captions, setCaptions] = useState<CaptionGenerationResult[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [reelIdea, setReelIdea] = useState<ReelIdeaResult | null>(null);
  const [thumbnailIdeas, setThumbnailIdeas] = useState<ThumbnailIdeaResult[]>([]);
  const [improvedContent, setImprovedContent] = useState<ContentImprovementResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    try {
      if (activeTab === "captions") {
        const results = await aiService.generateCaptions(prompt);
        setCaptions(results);
      } else if (activeTab === "hashtags") {
        const results = await aiService.generateHashtags(prompt);
        setHashtags(results);
      } else if (activeTab === "reels") {
        const results = await aiService.generateReelIdea("Cinematography", prompt);
        setReelIdea(results);
      } else if (activeTab === "thumbnails") {
        const results = await aiService.generateThumbnailIdeas(prompt);
        setThumbnailIdeas(results);
      } else if (activeTab === "improve") {
        const results = await aiService.improveContent(prompt);
        setImprovedContent(results);
      }

      toast({
        type: "success",
        title: "AI Studio Complete!",
        message: "Generated suggestions ready. Click copy or use them directly.",
      });
    } catch {
      toast({
        type: "error",
        title: "Generation error",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, index?: number) => {
    navigator.clipboard?.writeText(text);
    if (index !== undefined) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
    toast({
      type: "success",
      title: "Copied to Clipboard!",
      message: text.substring(0, 50) + "...",
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="primary" size="sm">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" /> Modular AI Service
          </Badge>
          <span className="text-[11px] text-neutral-400 font-medium">Gemini 2.5 Ready</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          VYBE AI Creator Studio
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl leading-relaxed">
          Supercharge your creator output. Generate multi-style captions, high-converting hooks,
          video scripts, clickable thumbnails, and real-time content feedback.
        </p>
      </div>

      {/* Studio Tool Tabs */}
      <Tabs
        tabs={[
          { id: "captions", label: "Captions", icon: <MessageSquare className="w-3.5 h-3.5" /> },
          { id: "reels", label: "Reel Script & Hooks", icon: <Film className="w-3.5 h-3.5" /> },
          { id: "hashtags", label: "Hashtags", icon: <Hash className="w-3.5 h-3.5" /> },
          { id: "thumbnails", label: "Thumbnail Concepts", icon: <ImageIcon className="w-3.5 h-3.5" /> },
          { id: "improve", label: "Content Improver", icon: <TrendingUp className="w-3.5 h-3.5" /> },
        ]}
        activeTab={activeTab}
        onChange={(tab) => {
          setActiveTab(tab);
          setCaptions([]);
          setHashtags([]);
          setReelIdea(null);
          setThumbnailIdeas([]);
          setImprovedContent(null);
          if (tab === "thumbnails" && prompt.includes("Hyderabad")) {
            setPrompt("Sony A7IV vs Blackmagic Pocket 6K color test");
          } else if (tab === "improve" && prompt.includes("Hyderabad")) {
            setPrompt("Just bought a 35mm lens. It is really cool and took some pictures outside.");
          }
        }}
      />

      {/* Input Prompt Card */}
      <Card className="p-5 bg-neutral-900/60 border-neutral-800/80">
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <Input
              label={
                activeTab === "captions"
                  ? "Describe your photo or video scene"
                  : activeTab === "reels"
                  ? "What topic should the reel cover?"
                  : activeTab === "thumbnails"
                  ? "What is the video or reel about?"
                  : activeTab === "improve"
                  ? "Paste your draft caption or post to improve"
                  : "Target keyword or theme"
              }
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Sunset photo at Hyderabad or DaVinci grading tips"
              leftIcon={<Wand2 className="w-4 h-4 text-violet-400" />}
            />
          </div>

          <Button
            variant="gradient"
            size="md"
            isLoading={isGenerating}
            onClick={handleGenerate}
            leftIcon={<Sparkles className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            {activeTab === "improve" ? "Analyze & Improve" : "Generate Ideas"}
          </Button>
        </div>

        {/* Quick prompt suggestions */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-neutral-800/60 text-xs text-neutral-400">
          <span className="text-[11px] text-neutral-500 font-semibold">Try examples:</span>
          {[
            "Sunset photo at Hyderabad",
            "Tokyo neon street at 2 AM",
            "Desk setup with dual monitors",
            "Color grading cinematic teal & orange",
          ].map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => setPrompt(sample)}
              className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
            >
              {sample}
            </button>
          ))}
        </div>
      </Card>

      {/* Results View - 1. Captions */}
      {captions.length > 0 && activeTab === "captions" && (
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" /> Generated Caption Styles
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {captions.map((cap, i) => (
              <Card
                key={i}
                className="p-4 bg-neutral-900/50 border-neutral-800/80 hover:border-violet-500/40 transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="primary" size="sm">
                    {cap.style}
                  </Badge>
                  <button
                    onClick={() => copyToClipboard(cap.caption, i)}
                    className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white p-1 rounded-md hover:bg-neutral-800"
                  >
                    {copiedIndex === i ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedIndex === i ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans">
                  {cap.caption}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Results View - 2. Reels Blueprint */}
      {reelIdea && activeTab === "reels" && (
        <Card className="p-6 bg-neutral-900/60 border-neutral-800/80 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div>
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                Viral Reel Blueprint
              </span>
              <h3 className="text-base font-bold text-white">Full Concept & Script</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(JSON.stringify(reelIdea, null, 2))}
              leftIcon={<Copy className="w-3.5 h-3.5" />}
            >
              Copy Script
            </Button>
          </div>

          <div className="space-y-3 text-xs leading-relaxed">
            <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-800/30">
              <span className="font-bold text-violet-300 block mb-1">01. The Hook (0-3s):</span>
              <p className="text-neutral-200 font-semibold">{reelIdea.hook}</p>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950/40 border border-neutral-800/60">
              <span className="font-bold text-cyan-300 block mb-1">02. Concept Outline:</span>
              <p className="text-neutral-300">{reelIdea.concept}</p>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950/40 border border-neutral-800/60">
              <span className="font-bold text-amber-300 block mb-1">03. Script Progression:</span>
              <ul className="list-disc pl-4 space-y-1 text-neutral-300">
                {reelIdea.scriptOutline.map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950/40 border border-neutral-800/60">
              <span className="font-bold text-emerald-300 block mb-1">04. Camera Shot List:</span>
              <ul className="list-disc pl-4 space-y-1 text-neutral-300">
                {reelIdea.shotList.map((shot, idx) => (
                  <li key={idx}>{shot}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Results View - 3. Smart Hashtags */}
      {hashtags.length > 0 && activeTab === "hashtags" && (
        <Card className="p-5 bg-neutral-900/60 border-neutral-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-white">Hashtag Cloud ({hashtags.length})</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(hashtags.join(" "))}
              leftIcon={<Copy className="w-3.5 h-3.5" />}
            >
              Copy All
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {hashtags.map((h, i) => (
              <span
                key={i}
                onClick={() => copyToClipboard(h)}
                className="px-2.5 py-1 rounded-lg bg-neutral-800/80 hover:bg-violet-600/30 border border-neutral-700/60 hover:border-violet-500/40 text-xs font-medium text-neutral-200 cursor-pointer transition-colors"
              >
                {h}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Results View - 4. Thumbnail Concepts */}
      {thumbnailIdeas.length > 0 && activeTab === "thumbnails" && (
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" /> High Click-Through Thumbnail Blueprints
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {thumbnailIdeas.map((thumb, idx) => (
              <Card
                key={idx}
                className="p-5 bg-neutral-900/60 border-neutral-800 hover:border-amber-500/50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-black text-center text-sm tracking-wider uppercase mb-3">
                    &ldquo;{thumb.headlineText}&rdquo;
                  </div>
                  <div className="space-y-2.5 text-xs text-neutral-300">
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase font-bold block">
                        Composition
                      </span>
                      <p className="leading-relaxed">{thumb.visualComposition}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase font-bold block">
                        Color Science
                      </span>
                      <p className="text-neutral-400">{thumb.colorPalette}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase font-bold block">
                        Psychological Trigger
                      </span>
                      <span className="inline-block px-2 py-0.5 rounded bg-neutral-800 text-[11px] font-semibold text-cyan-300">
                        {thumb.emotionalTrigger}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase font-bold block">
                        Pose & Framing
                      </span>
                      <p className="text-neutral-400">{thumb.expressionPose}</p>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full"
                  onClick={() =>
                    copyToClipboard(
                      `Headline: ${thumb.headlineText}\nComposition: ${thumb.visualComposition}\nPalette: ${thumb.colorPalette}`
                    )
                  }
                  leftIcon={<Copy className="w-3.5 h-3.5" />}
                >
                  Copy Prompt
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Results View - 5. Content Improver */}
      {improvedContent && activeTab === "improve" && (
        <Card className="p-6 bg-neutral-900/60 border-neutral-800 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-800 gap-2">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                AI Optimization Audit
              </span>
              <h3 className="text-base font-bold text-white">Virality & Engagement Score</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-black border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4" /> {improvedContent.overallScore}/100
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-neutral-950/40 border border-neutral-800">
              <span className="text-[10px] text-neutral-500 font-bold uppercase block mb-1">
                Hook Punch Assessment
              </span>
              <p className="font-semibold text-neutral-200">{improvedContent.hookRating}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-neutral-950/40 border border-neutral-800">
              <span className="text-[10px] text-neutral-500 font-bold uppercase block mb-1">
                Readability Rating
              </span>
              <p className="font-semibold text-neutral-200">{improvedContent.readability}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-800/30 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-violet-300">Optimized High-Retention Version:</span>
              <button
                onClick={() => copyToClipboard(improvedContent.improvedVersion)}
                className="text-xs text-violet-400 hover:text-white flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
            </div>
            <p className="text-xs text-neutral-200 whitespace-pre-line leading-relaxed">
              {improvedContent.improvedVersion}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Actionable Recommendations
            </h4>
            <ul className="space-y-1.5 text-xs text-neutral-300 list-disc pl-4">
              {improvedContent.actionableFeedback.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        </Card>
      )}
    </div>
  );
}
