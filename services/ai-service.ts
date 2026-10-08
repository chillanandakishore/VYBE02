/**
 * Modular AI Service Layer for VYBE AI Creator Studio
 *
 * Implements clean interfaces allowing seamless swapping between
 * Google Gemini API, OpenAI, Claude, or local Ollama endpoints.
 */

export interface CaptionGenerationResult {
  style: "cinematic" | "casual" | "thought-provoking" | "short-punchy" | "storyteller";
  caption: string;
}

export interface ReelIdeaResult {
  hook: string;
  concept: string;
  scriptOutline: string[];
  shotList: string[];
  suggestedAudio: string;
  hashtags: string[];
}

export interface ThumbnailIdeaResult {
  headlineText: string;
  visualComposition: string;
  colorPalette: string;
  emotionalTrigger: string;
  expressionPose: string;
}

export interface ContentImprovementResult {
  overallScore: number;
  hookRating: string;
  readability: string;
  improvedVersion: string;
  actionableFeedback: string[];
}

export interface AiServiceAdapter {
  generateCaptions(prompt: string, context?: string): Promise<CaptionGenerationResult[]>;
  generateHashtags(topic: string, count?: number): Promise<string[]>;
  generateReelIdea(niche: string, topic: string): Promise<ReelIdeaResult>;
  generateThumbnailIdeas(videoTopic: string): Promise<ThumbnailIdeaResult[]>;
  improveContent(originalContent: string): Promise<ContentImprovementResult>;
}

// Built-in intelligent template adapter (works offline/instant with zero API key requirement)
class DefaultAiService implements AiServiceAdapter {
  async generateCaptions(prompt: string, _context?: string): Promise<CaptionGenerationResult[]> {
    const cleanPrompt = prompt.trim();

    return [
      {
        style: "cinematic",
        caption: `Chasing the lingering glow across ${cleanPrompt}. When light refracts through atmospheric haze, the whole city pauses for a single frame. 🌆✨`,
      },
      {
        style: "thought-provoking",
        caption: `Moments like this in ${cleanPrompt} remind me that creativity isn't about capturing what is there—it's about highlighting what is felt. What speaks to you first in this shot?`,
      },
      {
        style: "short-punchy",
        caption: `Golden hour in ${cleanPrompt}. No words needed. ⚡`,
      },
      {
        style: "storyteller",
        caption: `Waited two hours for the ambient haze to clear at ${cleanPrompt}. Sometimes the shot you envision takes patience, but when the shadows fall right into the 35mm frame, every second was worth it.`,
      },
      {
        style: "casual",
        caption: `Just casual wanderings through ${cleanPrompt}. Still obsessed with these reflections. Who's shooting this weekend? 📸`,
      },
    ];
  }

  async generateHashtags(topic: string, count = 8): Promise<string[]> {
    const baseTags = [
      `#${topic.replace(/\s+/g, "")}`,
      "#VYBECreators",
      "#VisualStorytelling",
      "#Cinematography",
      "#CreatorsOfToday",
      "#ShotOnFX3",
      "#ColorGrading",
      "#ModernVisuals",
      "#ArtDirection",
      "#GoldenHourShots",
    ];
    return baseTags.slice(0, count);
  }

  async generateReelIdea(niche: string, topic: string): Promise<ReelIdeaResult> {
    return {
      hook: `"Stop scrolling if you're still making this huge mistake in ${topic}..." (Quick whip-pan zoom in)`,
      concept: `A high-tempo 30-second breakdown exposing common misconceptions in ${niche} with side-by-side visual comparisons.`,
      scriptOutline: [
        "0-3s: Immediate pattern interrupt with bold on-screen typography.",
        "4-12s: Show the flawed standard method that everyone uses.",
        "13-22s: The insider trick that 90% of pro creators use instead.",
        "23-30s: Side by side comparison + prompt to save for reference.",
      ],
      shotList: [
        "Wide shot: You looking at the monitor / camera setup",
        "Macro close-up: Fast knob dial or keyboard keypress",
        "Split-screen: Before vs After color grade or code execution",
        "Direct to lens: Confident concluding advice + call to action",
      ],
      suggestedAudio: "Trending high-tempo lo-fi or phonk audio with bass drop on hook resolution",
      hashtags: [
        `#${niche.replace(/\s+/g, "")}`,
        `#${topic.replace(/\s+/g, "")}Tips`,
        "#CreatorTips",
        "#ReelsViral",
        "#LearnOnVYBE",
      ],
    };
  }

  async generateThumbnailIdeas(videoTopic: string): Promise<ThumbnailIdeaResult[]> {
    const topic = videoTopic.trim() || "Creative Workflow";
    return [
      {
        headlineText: "STOP DOING THIS!",
        visualComposition: "Extreme close-up on expression of disbelief on left 40%; glowing red cross over default setup on right 60%.",
        colorPalette: "Electric Red (#FF2E63) + Midnight Black with Neon Cyan accent",
        emotionalTrigger: "FOMO / Urgency / Mistake Prevention",
        expressionPose: "Hands on head or index finger pointing aggressively at screen text.",
      },
      {
        headlineText: "THE 10X SECRET",
        visualComposition: "Split frame: Dull grayscale 'Before' vs Hyper-saturated cinematic 'After' with glowing vertical laser divider.",
        colorPalette: "Vibrant Violet (#7C3AED) + Sunset Gold (#F59E0B)",
        emotionalTrigger: "Transformation / Aspiration / Fast Results",
        expressionPose: "Confident subtle smirk holding the finished product or camera lens.",
      },
      {
        headlineText: "NEVER USE THIS...",
        visualComposition: "Minimalist dark backdrop with floating 3D neon holographic text and creator silhouette with rim lighting.",
        colorPalette: "Deep Slate (#0F172A) + Toxic Lime (#10B981)",
        emotionalTrigger: "Curiosity gap / Insider Revelation",
        expressionPose: "Eye contact directly into lens with one eyebrow raised.",
      },
    ];
  }

  async improveContent(originalContent: string): Promise<ContentImprovementResult> {
    const text = originalContent.trim();
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    
    return {
      overallScore: Math.min(94, Math.max(68, Math.floor(75 + wordCount * 0.5))),
      hookRating: wordCount < 5 ? "Needs a stronger opening punch" : "Solid engaging hook",
      readability: "Grade 6 conversational level (optimal for social engagement)",
      improvedVersion: `🔥 Quick reality check: ${text}\n\nHere's what changed my perspective: when you prioritize visual resonance over perfection, engagement naturally compounds.\n\n👇 Drop your thoughts below — which approach do you use?`,
      actionableFeedback: [
        "Include a clear micro call-to-action (CTA) at the bottom to drive comment velocity.",
        "Break dense sentences into 1-2 sentence paragraphs to reduce visual friction.",
        "Add 3-5 high-relevance hashtags targeted to your specific VYBE community.",
      ],
    };
  }
}

// Export singleton instance
export const aiService: AiServiceAdapter = new DefaultAiService();
