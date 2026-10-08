import { ChallengeItem, ChallengeEntry } from "@/types";

const challengesStore: Map<string, ChallengeItem> = new Map();
const challengeVotesStore: Set<string> = new Set(); // userId:entryId

const initialChallenges: ChallengeItem[] = [
  {
    id: "ch_night_photo",
    title: "30-Day Night Photography",
    tagline: "Capture city streetlights, light trails, and night portraits",
    description: "Embrace the dark. Shoot in natural urban illumination, neon reflections, and low-light environments without artificial flash.",
    communityName: "📸 Photography",
    coverImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80",
    rewardBadge: "🏆 Night Owl Creator",
    participantsCount: 1240,
    entriesCount: 382,
    startDate: "2026-10-01",
    endDate: "2026-10-31",
    daysRemaining: 27,
    rules: [
      "All photos must be captured after astronomical twilight.",
      "Include equipment and EXIF settings in description.",
      "Community voting determines the final top 3 showcase.",
    ],
    entries: [
      {
        id: "entry_1",
        challengeId: "ch_night_photo",
        author: {
          id: "usr_creator_01",
          username: "alex_rivers",
          displayName: "Alex Rivers 🎬",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          isCreator: true,
        },
        title: "Neon Reflections on wet Shinjuku asphalt",
        imageUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80",
        votesCount: 384,
        rank: 1,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      },
      {
        id: "entry_2",
        challengeId: "ch_night_photo",
        author: {
          id: "usr_photog_03",
          username: "kenji_shoots",
          displayName: "Kenji Sato",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          isCreator: true,
        },
        title: "Lonely ramen bar at 3 AM in Akihabara",
        imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80",
        votesCount: 295,
        rank: 2,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
      },
      {
        id: "entry_3",
        challengeId: "ch_night_photo",
        author: {
          id: "usr_coder_02",
          username: "maya_dev",
          displayName: "Maya Patel",
          avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
          isCreator: true,
        },
        title: "Cyberpunk bridge crossing long exposure",
        imageUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=80",
        votesCount: 210,
        rank: 3,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 45).toISOString(),
      },
    ],
  },
  {
    id: "ch_gen_ui",
    title: "Generative UI Sprint",
    tagline: "Build dynamic AI interfaces with Next.js 16 & Tailwind 4",
    description: "Design and implement autonomous generative components that adapt to user interaction in realtime.",
    communityName: "💻 Coding & AI",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
    rewardBadge: "⚡ AI Vanguard",
    participantsCount: 890,
    entriesCount: 140,
    startDate: "2026-10-05",
    endDate: "2026-10-25",
    daysRemaining: 21,
    rules: [
      "Must be built using React 19 and modern CSS container queries.",
      "Include interactive live preview link or code snippet.",
    ],
    entries: [],
  },
  {
    id: "ch_color_grade",
    title: "Cinematic Color Grade Showdown",
    tagline: "Grade flat log footage into high-budget cinematic aesthetic",
    description: "Download the sample raw footage package, apply your custom node tree, and export your before/after split screen.",
    communityName: "🎬 Video Editing",
    coverImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&auto=format&fit=crop&q=80",
    rewardBadge: "🎬 Colorist Master",
    participantsCount: 950,
    entriesCount: 215,
    startDate: "2026-10-01",
    endDate: "2026-10-20",
    daysRemaining: 16,
    rules: [
      "Share both LOG and final graded still frames.",
      "Detail your primary and secondary corrections in the caption.",
    ],
    entries: [],
  },
];

initialChallenges.forEach((ch) => challengesStore.set(ch.id, ch));

export const dbChallenges = {
  getChallenges: async (currentUserId?: string): Promise<ChallengeItem[]> => {
    const list = Array.from(challengesStore.values());
    return list.map((ch) => {
      const decoratedEntries = (ch.entries || []).map((entry) => ({
        ...entry,
        hasVoted: currentUserId ? challengeVotesStore.has(`${currentUserId}:${entry.id}`) : false,
      }));

      // Sort entries by votes descending
      decoratedEntries.sort((a, b) => b.votesCount - a.votesCount);
      decoratedEntries.forEach((e, idx) => (e.rank = idx + 1));

      return {
        ...ch,
        entries: decoratedEntries,
      };
    });
  },

  getChallengeById: async (id: string, currentUserId?: string): Promise<ChallengeItem | null> => {
    const ch = challengesStore.get(id);
    if (!ch) return null;

    const decoratedEntries = (ch.entries || []).map((entry) => ({
      ...entry,
      hasVoted: currentUserId ? challengeVotesStore.has(`${currentUserId}:${entry.id}`) : false,
    }));

    decoratedEntries.sort((a, b) => b.votesCount - a.votesCount);
    decoratedEntries.forEach((e, idx) => (e.rank = idx + 1));

    return {
      ...ch,
      entries: decoratedEntries,
    };
  },

  submitChallengeEntry: async (
    challengeId: string,
    author: ChallengeEntry["author"],
    title: string,
    imageUrl: string
  ): Promise<ChallengeEntry> => {
    const ch = challengesStore.get(challengeId);
    if (!ch) throw new Error("Challenge not found");

    const id = `entry_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newEntry: ChallengeEntry = {
      id,
      challengeId,
      author,
      title,
      imageUrl,
      votesCount: 1, // Author's automatic self vote
      rank: (ch.entries?.length || 0) + 1,
      hasVoted: true,
      createdAt: new Date().toISOString(),
    };

    challengeVotesStore.add(`${author.id}:${id}`);
    ch.entries = [newEntry, ...(ch.entries || [])];
    ch.entriesCount += 1;
    challengesStore.set(challengeId, ch);

    return newEntry;
  },

  voteChallengeEntry: async (userId: string, challengeId: string, entryId: string): Promise<{ hasVoted: boolean; votesCount: number }> => {
    const ch = challengesStore.get(challengeId);
    if (!ch || !ch.entries) throw new Error("Entry not found");

    const entry = ch.entries.find((e) => e.id === entryId);
    if (!entry) throw new Error("Entry not found");

    const key = `${userId}:${entryId}`;
    const alreadyVoted = challengeVotesStore.has(key);

    if (alreadyVoted) {
      challengeVotesStore.delete(key);
      entry.votesCount = Math.max(0, entry.votesCount - 1);
    } else {
      challengeVotesStore.add(key);
      entry.votesCount += 1;
    }

    challengesStore.set(challengeId, ch);
    return { hasVoted: !alreadyVoted, votesCount: entry.votesCount };
  },
};
