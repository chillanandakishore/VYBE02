import { db } from "@/lib/db";
import { dbCommunities } from "@/lib/db-communities";
import { dbReels } from "@/lib/db-reels";
import { dbEvents } from "@/lib/db-events";
import { dbChallenges } from "@/lib/db-challenges";

export const dbSearch = {
  searchAll: async (query: string, currentUserId?: string) => {
    const q = (query || "").toLowerCase().trim();
    if (!q) {
      return {
        users: [],
        posts: [],
        communities: [],
        reels: [],
        events: [],
        challenges: [],
        total: 0,
      };
    }

    // Search Users
    const allUsers = await db.listUsers();
    const matchedUsers = allUsers.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.displayName.toLowerCase().includes(q) ||
        (u.bio && u.bio.toLowerCase().includes(q)) ||
        u.interests.some((i) => i.toLowerCase().includes(q))
    );

    // Search Posts
    const allPostsResult = await db.getPosts({ limit: 100, currentUserId });
    const matchedPosts = allPostsResult.posts.filter(
      (p) =>
        p.content.toLowerCase().includes(q) ||
        (p.communityName && p.communityName.toLowerCase().includes(q)) ||
        p.hashtags.some((h) => h.toLowerCase().includes(q)) ||
        p.author.username.toLowerCase().includes(q)
    );

    // Search Communities
    const allCommunities = await dbCommunities.getCommunities(currentUserId);
    const matchedCommunities = allCommunities.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );

    // Search Reels
    const allReels = await dbReels.getReels(currentUserId);
    const matchedReels = allReels.filter(
      (r) =>
        r.caption.toLowerCase().includes(q) ||
        r.musicTitle.toLowerCase().includes(q) ||
        r.hashtags.some((h) => h.toLowerCase().includes(q)) ||
        r.author.username.toLowerCase().includes(q)
    );

    // Search Events
    const allEvents = await dbEvents.getEvents(currentUserId);
    const matchedEvents = allEvents.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q)
    );

    // Search Challenges
    const allChallenges = await dbChallenges.getChallenges(currentUserId);
    const matchedChallenges = allChallenges.filter(
      (ch) =>
        ch.title.toLowerCase().includes(q) ||
        ch.tagline.toLowerCase().includes(q) ||
        ch.description.toLowerCase().includes(q)
    );

    const total =
      matchedUsers.length +
      matchedPosts.length +
      matchedCommunities.length +
      matchedReels.length +
      matchedEvents.length +
      matchedChallenges.length;

    return {
      users: matchedUsers.slice(0, 10),
      posts: matchedPosts.slice(0, 10),
      communities: matchedCommunities.slice(0, 6),
      reels: matchedReels.slice(0, 6),
      events: matchedEvents.slice(0, 6),
      challenges: matchedChallenges.slice(0, 6),
      total,
    };
  },
};
