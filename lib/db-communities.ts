import { CommunityItem, CommunityDiscussion } from "@/types";

const communitiesStore: Map<string, CommunityItem> = new Map();
const communityMembersStore: Set<string> = new Set(); // userId:communityId

const initialCommunities: CommunityItem[] = [
  {
    id: "vybe_video_editing",
    slug: "video-editing",
    name: "Video Editing",
    tagline: "Cut, grade, and direct cinematic stories",
    description: "The premier home for DaVinci Resolve colorists, Premiere editors, After Effects motion designers, and cinematic filmmakers.",
    coverImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&auto=format&fit=crop&q=80",
    icon: "Film",
    gradient: "from-purple-500 to-indigo-600",
    membersCount: 28400,
    postsCount: 1420,
    rules: [
      "Share project files and presets with clear attribution.",
      "Constructive feedback only on WIP color grades and edits.",
      "No direct client advertising without moderator approval.",
    ],
    tags: ["Color Grading", "DaVinci", "Premiere", "After Effects", "Sound Design"],
    discussions: [
      {
        id: "disc_1",
        communityId: "vybe_video_editing",
        author: {
          id: "usr_creator_01",
          username: "alex_rivers",
          displayName: "Alex Rivers 🎬",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        },
        title: "CST vs ACES in DaVinci Resolve 19: Which provides cleaner highlight rolloff?",
        content: "After testing 100+ footage samples from ARRI Alexa 35 and Sony FX3, Color Space Transform with DaVinci Wide Gamut consistently produces smoother skin tones.",
        repliesCount: 42,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      },
      {
        id: "disc_2",
        communityId: "vybe_video_editing",
        author: {
          id: "usr_photog_03",
          username: "kenji_shoots",
          displayName: "Kenji Sato",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        },
        title: "Best shutter angle for handheld anamorphic night scenes?",
        content: "We experimented with 172.8 deg vs 180 deg in Tokyo rain streets to eliminate LED frequency flicker.",
        repliesCount: 19,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
      },
    ],
    resources: [
      {
        id: "res_1",
        communityId: "vybe_video_editing",
        title: "Neo-Tokyo Cyberpunk LUT PowerGrade",
        description: "Official DaVinci .drx node tree with halation, glow, and custom split-toning curve.",
        url: "#download-lut",
        type: "PRESET",
        downloadsCount: 3840,
      },
      {
        id: "res_2",
        communityId: "vybe_video_editing",
        title: "Cinematic Aspect Ratio Crop Templates (2.39:1 & 2.76:1)",
        description: "Pixel-perfect PNG and Premiere guides for anamorphic widescreen framing.",
        url: "#download-crops",
        type: "GUIDE",
        downloadsCount: 1920,
      },
    ],
  },
  {
    id: "vybe_photography",
    slug: "photography",
    name: "Photography",
    tagline: "Light, shadows, lenses, and human moments",
    description: "Connect with street photographers, portrait artists, landscape explorers, and analog film enthusiasts around the globe.",
    coverImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80",
    icon: "Camera",
    gradient: "from-amber-500 to-rose-500",
    membersCount: 41200,
    postsCount: 3890,
    rules: [
      "Include EXIF metadata (camera, lens, shutter, ISO) when possible.",
      "Respect street subjects and international photography laws.",
      "Keep self-promotion confined to community showcase threads.",
    ],
    tags: ["Street Photography", "Leica", "Night Shoots", "35mm Film", "Portraiture"],
    discussions: [
      {
        id: "disc_3",
        communityId: "vybe_photography",
        author: {
          id: "usr_photog_03",
          username: "kenji_shoots",
          displayName: "Kenji Sato",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        },
        title: "Zone focusing at night: 28mm vs 35mm street perspectives",
        content: "At f/4 with ISO 3200 in neon streets, zone focusing at 2.5 meters guarantees crisp snapshots of fleeting human moments.",
        repliesCount: 34,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      },
    ],
    resources: [
      {
        id: "res_3",
        communityId: "vybe_photography",
        title: "Kodak Portra 400 Lightroom Emulation Profile",
        description: "Warm skin tones and creamy cyan skies for Sony, Canon, and Fuji RAW files.",
        url: "#download-presets",
        type: "PRESET",
        downloadsCount: 5210,
      },
    ],
  },
  {
    id: "vybe_coding",
    slug: "coding",
    name: "Coding & AI Systems",
    tagline: "Architect scalable software, AI agents, and reactive interfaces",
    description: "Next.js 16, React 19, TypeScript, Rust, autonomous LLM agents, and distributed backend systems.",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80",
    icon: "Code",
    gradient: "from-emerald-500 to-teal-600",
    membersCount: 36800,
    postsCount: 2940,
    rules: [
      "Share reproducible snippets and code sandboxes.",
      "No crypto scams, low-effort AI spam, or unauthorized scraping.",
      "Encourage respectful code reviews and architecture discussions.",
    ],
    tags: ["Next.js 16", "TypeScript", "React 19", "AI Agents", "Tailwind 4"],
    discussions: [
      {
        id: "disc_4",
        communityId: "vybe_coding",
        author: {
          id: "usr_coder_02",
          username: "maya_dev",
          displayName: "Maya Patel",
          avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        },
        title: "Turbopack optimization patterns for large Next.js 16 codebases",
        content: "By modularizing in-memory DB instances and dynamic imports, page compilation stays under 500ms even with 50+ routes.",
        repliesCount: 58,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      },
    ],
    resources: [
      {
        id: "res_4",
        communityId: "vybe_coding",
        title: "Autonomous Agent Orchestrator Boilerplate",
        description: "Multi-agent coordination harness with typed JSON schema function calling.",
        url: "#download-code",
        type: "CODE",
        downloadsCount: 2980,
      },
    ],
  },
  {
    id: "vybe_music",
    slug: "music",
    name: "Music & Audio Production",
    tagline: "Analog synthesizers, mixing, beatmaking, and spatial sound",
    description: "Connect with electronic producers, sound designers, audio engineers, and indie beatmakers crafting the future sonic landscape.",
    coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80",
    icon: "Music",
    gradient: "from-pink-500 to-rose-600",
    membersCount: 19800,
    postsCount: 1210,
    rules: [
      "Original compositions and royalty-free samples only.",
      "Provide timestamp feedback for track submissions.",
    ],
    tags: ["Synthwave", "Sound Design", "Ableton", "Analog Gear", "Mixing"],
    discussions: [],
    resources: [],
  },
];

initialCommunities.forEach((c) => communitiesStore.set(c.id, c));
// Pre-seed membership
communityMembersStore.add("usr_creator_01:vybe_video_editing");
communityMembersStore.add("usr_creator_01:vybe_photography");
communityMembersStore.add("usr_coder_02:vybe_coding");

export const dbCommunities = {
  getCommunities: async (currentUserId?: string): Promise<CommunityItem[]> => {
    const list = Array.from(communitiesStore.values());
    return list.map((c) => ({
      ...c,
      isJoined: currentUserId ? communityMembersStore.has(`${currentUserId}:${c.id}`) : false,
    }));
  },

  getCommunityBySlug: async (slug: string, currentUserId?: string): Promise<CommunityItem | null> => {
    const community = Array.from(communitiesStore.values()).find(
      (c) => c.slug.toLowerCase() === slug.toLowerCase()
    );
    if (!community) return null;

    return {
      ...community,
      isJoined: currentUserId ? communityMembersStore.has(`${currentUserId}:${community.id}`) : false,
    };
  },

  toggleJoinCommunity: async (userId: string, communityId: string): Promise<{ isJoined: boolean; membersCount: number }> => {
    const community = communitiesStore.get(communityId);
    if (!community) throw new Error("Community not found");

    const key = `${userId}:${communityId}`;
    const alreadyJoined = communityMembersStore.has(key);

    if (alreadyJoined) {
      communityMembersStore.delete(key);
      community.membersCount = Math.max(0, community.membersCount - 1);
    } else {
      communityMembersStore.add(key);
      community.membersCount += 1;
    }

    communitiesStore.set(communityId, community);
    return { isJoined: !alreadyJoined, membersCount: community.membersCount };
  },

  createDiscussion: async (
    communityId: string,
    author: CommunityDiscussion["author"],
    title: string,
    content: string
  ) => {
    const community = communitiesStore.get(communityId);
    if (!community) throw new Error("Community not found");

    const newDisc = {
      id: `disc_${Date.now()}`,
      communityId,
      author,
      title,
      content,
      repliesCount: 0,
      createdAt: new Date().toISOString(),
    };

    community.discussions = [newDisc, ...(community.discussions || [])];
    communitiesStore.set(communityId, community);
    return newDisc;
  },
};
