import { StoryItem } from "@/types";

const storiesStore: Map<string, StoryItem> = new Map();
const storyLikesStore: Set<string> = new Set(); // userId:storyId

const initialStories: StoryItem[] = [
  {
    id: "story_1",
    authorId: "usr_creator_01",
    author: {
      id: "usr_creator_01",
      username: "alex_rivers",
      displayName: "Alex Rivers 🎬",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      isCreator: true,
      hasActiveStory: true,
    },
    mediaUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=900&auto=format&fit=crop&q=80",
    mediaType: "IMAGE",
    caption: "Late night in Shinjuku testing anamorphic flare rolloff 🌆",
    likesCount: 142,
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 21).toISOString(),
  },
  {
    id: "story_2",
    authorId: "usr_coder_02",
    author: {
      id: "usr_coder_02",
      username: "maya_dev",
      displayName: "Maya Patel",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      isCreator: true,
      hasActiveStory: true,
    },
    mediaUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=80",
    mediaType: "IMAGE",
    caption: "Turbopack benchmark running 10x faster with React 19 server actions 🚀",
    likesCount: 88,
    createdAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 22).toISOString(),
  },
  {
    id: "story_3",
    authorId: "usr_photog_03",
    author: {
      id: "usr_photog_03",
      username: "kenji_shoots",
      displayName: "Kenji Sato",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      isCreator: true,
      hasActiveStory: true,
    },
    mediaUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=900&auto=format&fit=crop&q=80",
    mediaType: "IMAGE",
    caption: "Rain soaked Tokyo backstreets. Leica M11 Monochrom magic 📸",
    likesCount: 215,
    createdAt: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    id: "story_4",
    authorId: "usr_audio_04",
    author: {
      id: "usr_audio_04",
      username: "elena_sound",
      displayName: "Elena Rostova 🎵",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      isCreator: true,
      hasActiveStory: true,
    },
    mediaUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=900&auto=format&fit=crop&q=80",
    mediaType: "IMAGE",
    caption: "Synthesizing lush analog pads on the Prophet 6 for the new reel soundtrack 🎹",
    likesCount: 94,
    createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 23).toISOString(),
  },
];

initialStories.forEach((s) => storiesStore.set(s.id, s));

export const dbStories = {
  getStories: async (currentUserId?: string): Promise<StoryItem[]> => {
    const now = new Date().getTime();
    // Only return unexpired stories
    const active = Array.from(storiesStore.values()).filter(
      (s) => new Date(s.expiresAt).getTime() > now
    );

    active.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return active.map((story) => ({
      ...story,
      isLiked: currentUserId ? storyLikesStore.has(`${currentUserId}:${story.id}`) : false,
    }));
  },

  createStory: async (
    author: StoryItem["author"],
    mediaUrl: string,
    caption?: string,
    mediaType: "IMAGE" | "VIDEO" = "IMAGE"
  ): Promise<StoryItem> => {
    const id = `story_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newStory: StoryItem = {
      id,
      authorId: author.id,
      author: {
        ...author,
        hasActiveStory: true,
      },
      mediaUrl,
      mediaType,
      caption,
      likesCount: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    storiesStore.set(id, newStory);
    return newStory;
  },

  toggleLikeStory: async (userId: string, storyId: string): Promise<{ isLiked: boolean; likesCount: number }> => {
    const story = storiesStore.get(storyId);
    if (!story) throw new Error("Story not found");

    const key = `${userId}:${storyId}`;
    const alreadyLiked = storyLikesStore.has(key);

    if (alreadyLiked) {
      storyLikesStore.delete(key);
      story.likesCount = Math.max(0, story.likesCount - 1);
    } else {
      storyLikesStore.add(key);
      story.likesCount += 1;
    }

    storiesStore.set(storyId, story);
    return { isLiked: !alreadyLiked, likesCount: story.likesCount };
  },
};
