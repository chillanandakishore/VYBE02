import { StoryItem } from "@/types";

const storiesStore: Map<string, StoryItem> = new Map();
const storyLikesStore: Set<string> = new Set(); // userId:storyId

const initialStories: StoryItem[] = [];

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
