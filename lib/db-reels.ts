import { ReelItem } from "@/types";

const reelsStore: Map<string, ReelItem> = new Map();
const reelLikesStore: Set<string> = new Set(); // userId:reelId
const reelSavesStore: Set<string> = new Set(); // userId:reelId

const initialReels: ReelItem[] = [
  {
    id: "reel_1",
    authorId: "usr_creator_01",
    author: {
      id: "usr_creator_01",
      username: "alex_rivers",
      displayName: "Alex Rivers 🎬",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      creatorStatus: "pro",
      isCreator: true,
      verified: true,
    },
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-tokyo-traffic-at-night-4228-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
    caption: "Shinjuku at midnight. Anamorphic 50mm on Sony FX3 with custom teal-orange LUT. #filmmaking #cinematic #nightdrive",
    musicTitle: "Kavinsky - Nightcall (Synthwave Rework)",
    hashtags: ["#filmmaking", "#cinematic", "#colorgrading", "#sonyfx3"],
    likesCount: 4820,
    commentsCount: 294,
    sharesCount: 142,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "reel_2",
    authorId: "usr_coder_02",
    author: {
      id: "usr_coder_02",
      username: "maya_dev",
      displayName: "Maya Patel",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      creatorStatus: "pro",
      isCreator: true,
      verified: true,
    },
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-smartphone-scrolling-social-media-41131-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    caption: "How I built an autonomous agent swarm in Next.js 16 in 48 hours. Breakdown in comments! 💻🔥 #coding #ai #webdev",
    musicTitle: "Lofi Fruits Music - Coding Session Vibes",
    hashtags: ["#coding", "#nextjs", "#aiagents", "#typescript"],
    likesCount: 3190,
    commentsCount: 185,
    sharesCount: 88,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: "reel_3",
    authorId: "usr_photog_03",
    author: {
      id: "usr_photog_03",
      username: "kenji_shoots",
      displayName: "Kenji Sato",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      creatorStatus: "rising",
      isCreator: true,
      verified: true,
    },
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80",
    caption: "POV: Walking through Shibuya crossing during a torrential rain storm with a Leica. #streetphotography #tokyo #rainyday",
    musicTitle: "Tycho - Awake (Ambient Soundscape)",
    hashtags: ["#streetphotography", "#leica", "#tokyo", "#moodygrams"],
    likesCount: 6540,
    commentsCount: 412,
    sharesCount: 320,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "reel_4",
    authorId: "usr_audio_04",
    author: {
      id: "usr_audio_04",
      username: "elena_sound",
      displayName: "Elena Rostova 🎵",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      creatorStatus: "partner",
      isCreator: true,
      verified: true,
    },
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-playing-piano-keys-close-up-42240-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
    caption: "Creating a cinematic trailer drop with analog filters and 808 sub-bass. Headphones recommended! 🎧 #musicproducer #sounddesign",
    musicTitle: "Elena Rostova - Neon Horizons (Original Mix)",
    hashtags: ["#musicproducer", "#sounddesign", "#synthwave", "#logicpro"],
    likesCount: 2410,
    commentsCount: 160,
    sharesCount: 95,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
];

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
