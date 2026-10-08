import { ReelItem } from "@/types";

const reelsStore: Map<string, ReelItem> = new Map();
const reelLikesStore: Set<string> = new Set(); // userId:reelId
const reelSavesStore: Set<string> = new Set(); // userId:reelId

const initialReels: ReelItem[] = [];

initialReels.forEach((r) => reelsStore.set(r.id, r));

export const dbReels = {
  getReels: async (currentUserId?: string): Promise<ReelItem[]> => {
    const list = Array.from(reelsStore.values());
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return list.map((reel) => ({
      ...reel,
      isLiked: currentUserId ? reelLikesStore.has(`${currentUserId}:${reel.id}`) : false,
      isSaved: currentUserId ? reelSavesStore.has(`${currentUserId}:${reel.id}`) : false,
    }));
  },

  toggleLikeReel: async (userId: string, reelId: string): Promise<{ isLiked: boolean; likesCount: number }> => {
    const reel = reelsStore.get(reelId);
    if (!reel) throw new Error("Reel not found");

    const key = `${userId}:${reelId}`;
    const alreadyLiked = reelLikesStore.has(key);

    if (alreadyLiked) {
      reelLikesStore.delete(key);
      reel.likesCount = Math.max(0, reel.likesCount - 1);
    } else {
      reelLikesStore.add(key);
      reel.likesCount += 1;
    }

    reelsStore.set(reelId, reel);
    return { isLiked: !alreadyLiked, likesCount: reel.likesCount };
  },

  toggleSaveReel: async (userId: string, reelId: string): Promise<{ isSaved: boolean }> => {
    const reel = reelsStore.get(reelId);
    if (!reel) throw new Error("Reel not found");

    const key = `${userId}:${reelId}`;
    const alreadySaved = reelSavesStore.has(key);

    if (alreadySaved) {
      reelSavesStore.delete(key);
    } else {
      reelSavesStore.add(key);
    }

    return { isSaved: !alreadySaved };
  },

  createReel: async (
    author: ReelItem["author"],
    videoUrl: string,
    thumbnailUrl: string,
    caption: string,
    musicTitle: string,
    hashtags: string[] = []
  ): Promise<ReelItem> => {
    const id = `reel_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newReel: ReelItem = {
      id,
      authorId: author.id,
      author,
      videoUrl,
      thumbnailUrl,
      caption,
      musicTitle: musicTitle || "Original Audio - " + author.username,
      hashtags,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: false,
      isSaved: false,
      createdAt: new Date().toISOString(),
    };

    reelsStore.set(id, newReel);
    return newReel;
  },
};
