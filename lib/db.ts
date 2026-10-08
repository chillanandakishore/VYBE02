import {
  User,
  UserRole,
  InterestItem,
  Post,
  Comment,
  CreatePostPayload,
  NotificationItem,
  StoryItem,
  ReelItem,
  CommunityItem,
  ChallengeItem,
  ChallengeEntry,
  EventItem,
  ConversationItem,
  ChatMessage,
  ProductItem,
  ReportItem,
} from "@/types";
import bcrypt from "bcryptjs";
import { dbNotifications } from "./db-notifications";
import { dbStories } from "./db-stories";
import { dbReels } from "./db-reels";
import { dbCommunities } from "./db-communities";
import { dbChallenges } from "./db-challenges";
import { dbEvents } from "./db-events";
import { dbMessages } from "./db-messages";
import { dbMarketplace } from "./db-marketplace";
import { dbAdmin } from "./db-admin";

export const AVAILABLE_INTERESTS: InterestItem[] = [
  {
    id: "Photography",
    name: "Photography",
    icon: "Camera",
    gradient: "from-amber-500 to-rose-500",
    description: "Portraits, landscapes, street photography & gear",
  },
  {
    id: "Video Editing",
    name: "Video Editing",
    icon: "Film",
    gradient: "from-purple-500 to-indigo-600",
    description: "Premiere, DaVinci, effects, transitions & cinematic storytelling",
  },
  {
    id: "Music",
    name: "Music",
    icon: "Music",
    gradient: "from-pink-500 to-rose-600",
    description: "Beats, instruments, production & audio engineering",
  },
  {
    id: "Technology",
    name: "Technology",
    icon: "Cpu",
    gradient: "from-cyan-500 to-blue-600",
    description: "Hardware, gadgets, future tech & robotics",
  },
  {
    id: "AI",
    name: "AI & ML",
    icon: "Sparkles",
    gradient: "from-violet-500 to-fuchsia-600",
    description: "Generative AI, LLMs, neural networks & prompts",
  },
  {
    id: "Coding",
    name: "Coding",
    icon: "Code",
    gradient: "from-emerald-500 to-teal-600",
    description: "Web dev, mobile apps, open source & architecture",
  },
  {
    id: "Gaming",
    name: "Gaming",
    icon: "Gamepad2",
    gradient: "from-red-500 to-orange-500",
    description: "Esports, clips, game dev, mods & reviews",
  },
  {
    id: "Cars",
    name: "Cars & Automotive",
    icon: "Car",
    gradient: "from-blue-600 to-indigo-700",
    description: "Supercars, custom builds, track days & design",
  },
  {
    id: "Travel",
    name: "Travel & Outdoors",
    icon: "Compass",
    gradient: "from-teal-500 to-emerald-600",
    description: "Hidden gems, itineraries, backpacking & nature",
  },
  {
    id: "Fitness",
    name: "Fitness",
    icon: "Dumbbell",
    gradient: "from-orange-500 to-amber-600",
    description: "Workouts, nutrition, calisthenics & wellness",
  },
  {
    id: "Art",
    name: "Art & Design",
    icon: "Palette",
    gradient: "from-fuchsia-500 to-purple-600",
    description: "Digital art, 3D blender, illustration & UX/UI",
  },
  {
    id: "Fashion",
    name: "Fashion & Style",
    icon: "Sparkle",
    gradient: "from-rose-400 to-pink-600",
    description: "Streetwear, aesthetics, runway & thrift finds",
  },
  {
    id: "Study",
    name: "Study & Productivity",
    icon: "BookOpen",
    gradient: "from-sky-500 to-indigo-500",
    description: "Deep work, Notion systems, university life & habits",
  },
  {
    id: "Movies",
    name: "Movies & Cinema",
    icon: "Clapperboard",
    gradient: "from-amber-600 to-red-600",
    description: "Film reviews, directing, cinematography & scripts",
  },
  {
    id: "Food",
    name: "Food & Culinary",
    icon: "Utensils",
    gradient: "from-yellow-500 to-orange-500",
    description: "Recipes, restaurant reviews, coffee & culinary art",
  },
];

interface UserRecord extends User {
  passwordHash: string;
}

interface PostRecord extends Post {
  isDeleted?: boolean;
}

interface CommentRecord {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  parentId: string | null;
  likesCount: number;
  createdAt: string;
}

interface ReportRecord {
  id: string;
  postId: string;
  reporterId: string;
  reason: string;
  createdAt: string;
}

// Stores
const usersStore: Map<string, UserRecord> = new Map();
const postsStore: Map<string, PostRecord> = new Map();
const commentsStore: Map<string, CommentRecord> = new Map();
const likesStore: Set<string> = new Set(); // userId:postId
const commentLikesStore: Set<string> = new Set(); // userId:commentId
const savesStore: Set<string> = new Set(); // userId:postId
const followsStore: Set<string> = new Set(); // followerId:followingId
const reportsStore: ReportRecord[] = [];

// Helper to pre-hash demo passwords
const DEMO_PASSWORD_HASH = bcrypt.hashSync("vybe123", 10);

const defaultUsers: UserRecord[] = [];

// Initialize users (starts empty for fresh deployment)
defaultUsers.forEach((u) => usersStore.set(u.id, u));

// Initial posts and comments (starts completely empty for fresh deployment)
const defaultPosts: PostRecord[] = [];
defaultPosts.forEach((p) => postsStore.set(p.id, p));

const defaultComments: CommentRecord[] = [];
defaultComments.forEach((c) => commentsStore.set(c.id, c));

export const db = {
  // User methods
  findUserByEmail: async (email: string): Promise<UserRecord | null> => {
    const normalized = email.toLowerCase().trim();
    for (const user of usersStore.values()) {
      if (user.email.toLowerCase() === normalized) {
        return user;
      }
    }
    return null;
  },

  findUserByUsername: async (username: string): Promise<UserRecord | null> => {
    const normalized = username.toLowerCase().trim();
    for (const user of usersStore.values()) {
      if (user.username.toLowerCase() === normalized) {
        return user;
      }
    }
    return null;
  },

  findUserByIdentifier: async (identifier: string): Promise<UserRecord | null> => {
    const clean = identifier.toLowerCase().trim();
    for (const user of usersStore.values()) {
      if (user.email.toLowerCase() === clean || user.username.toLowerCase() === clean) {
        return user;
      }
    }
    return null;
  },

  findUserById: async (id: string): Promise<UserRecord | null> => {
    return usersStore.get(id) || null;
  },

  createUser: async (
    data: Omit<UserRecord, "id" | "createdAt" | "followersCount" | "followingCount" | "postsCount" | "verified"> & {
      role?: UserRole;
      isOwner?: boolean;
      verified?: boolean;
    }
  ): Promise<User> => {
    const isFirstUser = usersStore.size === 0;
    const isOwner = Boolean(data.isOwner || data.role === "owner" || isFirstUser);
    const role: UserRole = isOwner ? "owner" : (data.role || (data.isCreator ? "creator" : "user"));
    const verified = Boolean(data.verified ?? (isOwner || data.isCreator));
    const creatorStatus = isOwner
      ? "owner"
      : (data.creatorStatus || (role === "creator" ? "rising" : "none"));

    const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newUser: UserRecord = {
      ...data,
      id,
      role,
      isOwner,
      isCreator: isOwner || role === "creator" || Boolean(data.isCreator),
      creatorStatus,
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      verified,
      createdAt: new Date().toISOString(),
    };

    usersStore.set(id, newUser);
    return newUser;
  },

  updateUserProfile: async (
    userId: string,
    updates: Partial<Pick<User, "displayName" | "bio" | "location" | "website" | "interests" | "avatarUrl" | "coverImageUrl">>
  ): Promise<User | null> => {
    const user = usersStore.get(userId);
    if (!user) return null;

    const updatedUser: UserRecord = {
      ...user,
      ...updates,
    };

    usersStore.set(userId, updatedUser);
    const { passwordHash: _, ...safeUser } = updatedUser;
    return safeUser;
  },

  listUsers: async (): Promise<User[]> => {
    return Array.from(usersStore.values()).map(({ passwordHash: _, ...rest }) => rest);
  },

  // Follow methods
  toggleFollowUser: async (
    followerId: string,
    targetUserId: string
  ): Promise<{ isFollowing: boolean; followersCount: number }> => {
    if (followerId === targetUserId) throw new Error("Cannot follow yourself");
    const target = usersStore.get(targetUserId);
    const follower = usersStore.get(followerId);
    if (!target || !follower) throw new Error("User not found");

    const key = `${followerId}:${targetUserId}`;
    const alreadyFollowing = followsStore.has(key);

    if (alreadyFollowing) {
      followsStore.delete(key);
      target.followersCount = Math.max(0, target.followersCount - 1);
      follower.followingCount = Math.max(0, follower.followingCount - 1);
    } else {
      followsStore.add(key);
      target.followersCount += 1;
      follower.followingCount += 1;
    }

    usersStore.set(targetUserId, target);
    usersStore.set(followerId, follower);

    return { isFollowing: !alreadyFollowing, followersCount: target.followersCount };
  },

  isFollowingUser: async (followerId: string, targetUserId: string): Promise<boolean> => {
    return followsStore.has(`${followerId}:${targetUserId}`);
  },

  getUserFollowers: async (
    targetUserId: string,
    currentUserId?: string
  ): Promise<Array<User & { isFollowing?: boolean }>> => {
    const followerUsers: Array<User & { isFollowing?: boolean }> = [];
    for (const key of followsStore) {
      const [fId, tId] = key.split(":");
      if (tId === targetUserId) {
        const u = usersStore.get(fId);
        if (u) {
          const { passwordHash: _, ...safeUser } = u;
          followerUsers.push({
            ...safeUser,
            isFollowing: currentUserId ? followsStore.has(`${currentUserId}:${safeUser.id}`) : false,
          });
        }
      }
    }
    return followerUsers;
  },

  getUserFollowing: async (
    targetUserId: string,
    currentUserId?: string
  ): Promise<Array<User & { isFollowing?: boolean }>> => {
    const followingUsers: Array<User & { isFollowing?: boolean }> = [];
    for (const key of followsStore) {
      const [fId, tId] = key.split(":");
      if (fId === targetUserId) {
        const u = usersStore.get(tId);
        if (u) {
          const { passwordHash: _, ...safeUser } = u;
          followingUsers.push({
            ...safeUser,
            isFollowing: currentUserId ? followsStore.has(`${currentUserId}:${safeUser.id}`) : false,
          });
        }
      }
    }
    return followingUsers;
  },

  // Post methods
  getPosts: async ({
    limit = 10,
    offset = 0,
    community,
    authorId,
    savedByUserId,
    currentUserId,
    stream = "for-you",
  }: {
    limit?: number;
    offset?: number;
    community?: string;
    authorId?: string;
    savedByUserId?: string;
    currentUserId?: string;
    stream?: "for-you" | "following" | "top-vybes";
  } = {}): Promise<{ posts: Post[]; total: number; hasMore: boolean }> => {
    let list = Array.from(postsStore.values()).filter((p) => !p.isDeleted);

    if (authorId) {
      list = list.filter((p) => p.authorId === authorId);
    }

    if (community && community !== "All") {
      list = list.filter((p) => p.communityName?.toLowerCase().includes(community.toLowerCase()));
    }

    if (savedByUserId) {
      list = list.filter((p) => savesStore.has(`${savedByUserId}:${p.id}`));
    }

    // Stream filtering & personalized ranking algorithm
    if (stream === "following") {
      if (currentUserId) {
        list = list.filter(
          (p) => followsStore.has(`${currentUserId}:${p.authorId}`) || p.authorId === currentUserId
        );
      } else {
        list = [];
      }
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (stream === "top-vybes") {
      // Engagement scoring
      list.sort((a, b) => {
        const scoreA = a.likesCount * 2 + a.commentsCount * 3 + a.sharesCount * 4;
        const scoreB = b.likesCount * 2 + b.commentsCount * 3 + b.sharesCount * 4;
        return scoreB - scoreA;
      });
    } else {
      // "for-you" stream: Personalized Interest Affinity & Recency algorithm
      const currentUser = currentUserId ? usersStore.get(currentUserId) : null;
      const userInterests = currentUser?.interests || ["Technology", "Photography", "Video Editing", "Coding"];

      list.sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;

        userInterests.forEach((interest) => {
          if (a.communityName?.toLowerCase().includes(interest.toLowerCase())) scoreA += 50;
          if (b.communityName?.toLowerCase().includes(interest.toLowerCase())) scoreB += 50;

          if (a.hashtags.some((h) => h.toLowerCase().includes(interest.toLowerCase()))) scoreA += 25;
          if (b.hashtags.some((h) => h.toLowerCase().includes(interest.toLowerCase()))) scoreB += 25;
        });

        if (currentUserId) {
          if (followsStore.has(`${currentUserId}:${a.authorId}`)) scoreA += 35;
          if (followsStore.has(`${currentUserId}:${b.authorId}`)) scoreB += 35;
        }

        scoreA += a.likesCount * 0.2 + a.commentsCount * 0.8;
        scoreB += b.likesCount * 0.2 + b.commentsCount * 0.8;

        const hoursAgoA = Math.max(0, (Date.now() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60));
        const hoursAgoB = Math.max(0, (Date.now() - new Date(b.createdAt).getTime()) / (1000 * 60 * 60));
        scoreA += Math.max(0, 100 - hoursAgoA * 2);
        scoreB += Math.max(0, 100 - hoursAgoB * 2);

        return scoreB - scoreA;
      });
    }

    const total = list.length;
    const paginated = list.slice(offset, offset + limit);

    // Decorate with live isLiked, isSaved, userVotedOptionId, and isFollowing
    const decoratedPosts: Post[] = paginated.map((post) => {
      const isLiked = currentUserId ? likesStore.has(`${currentUserId}:${post.id}`) : false;
      const isSaved = currentUserId ? savesStore.has(`${currentUserId}:${post.id}`) : false;
      const isFollowingAuthor = currentUserId ? followsStore.has(`${currentUserId}:${post.authorId}`) : false;

      let decoratedPoll = post.poll;
      if (post.poll && currentUserId) {
        const votedOpt = post.poll.options.find((o) => o.voterIds.includes(currentUserId));
        decoratedPoll = {
          ...post.poll,
          userVotedOptionId: votedOpt?.id,
        };
      }

      return {
        ...post,
        isLiked,
        isSaved,
        poll: decoratedPoll,
        author: {
          ...post.author,
          isFollowing: isFollowingAuthor,
        },
      };
    });

    return {
      posts: decoratedPosts,
      total,
      hasMore: offset + limit < total,
    };
  },

  getPostById: async (postId: string, currentUserId?: string): Promise<Post | null> => {
    const post = postsStore.get(postId);
    if (!post || post.isDeleted) return null;

    const isLiked = currentUserId ? likesStore.has(`${currentUserId}:${post.id}`) : false;
    const isSaved = currentUserId ? savesStore.has(`${currentUserId}:${post.id}`) : false;

    let decoratedPoll = post.poll;
    if (post.poll && currentUserId) {
      const votedOpt = post.poll.options.find((o) => o.voterIds.includes(currentUserId));
      decoratedPoll = {
        ...post.poll,
        userVotedOptionId: votedOpt?.id,
      };
    }

    return {
      ...post,
      isLiked,
      isSaved,
      poll: decoratedPoll,
    };
  },

  createPost: async (authorId: string, payload: CreatePostPayload): Promise<Post> => {
    const author = usersStore.get(authorId);
    if (!author) throw new Error("Author not found");

    const id = `post_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // Build poll if provided
    let pollData = undefined;
    if (payload.poll && payload.poll.question && payload.poll.options.length >= 2) {
      pollData = {
        question: payload.poll.question,
        options: payload.poll.options.map((optText, index) => ({
          id: `opt_${id}_${index}`,
          text: optText,
          votesCount: 0,
          voterIds: [],
        })),
        totalVotes: 0,
      };
    }

    const newPost: PostRecord = {
      id,
      authorId: author.id,
      author: {
        id: author.id,
        username: author.username,
        displayName: author.displayName,
        avatarUrl: author.avatarUrl,
        role: author.role,
        isOwner: author.isOwner,
        isCreator: author.isCreator,
        creatorStatus: author.creatorStatus,
        verified: author.verified,
      },
      communityName: payload.communityName || (author.interests[0] ? `✨ ${author.interests[0]}` : "✨ Technology"),
      content: payload.content,
      mediaUrls: payload.mediaUrls || [],
      mediaType: payload.mediaType || (payload.mediaUrls && payload.mediaUrls.length > 1 ? "CAROUSEL" : payload.mediaUrls && payload.mediaUrls.length === 1 ? "IMAGE" : payload.poll ? "POLL" : payload.questionPrompt ? "QUESTION" : "TEXT"),
      poll: pollData,
      questionPrompt: payload.questionPrompt,
      hashtags: payload.hashtags || [],
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      createdAt: new Date().toISOString(),
    };

    postsStore.set(id, newPost);

    // Update user posts count
    author.postsCount = (author.postsCount || 0) + 1;
    usersStore.set(author.id, author);

    return newPost;
  },

  deletePost: async (postId: string, userId: string): Promise<boolean> => {
    const post = postsStore.get(postId);
    if (!post || post.authorId !== userId) return false;

    postsStore.delete(postId);

    const author = usersStore.get(userId);
    if (author && author.postsCount > 0) {
      author.postsCount -= 1;
      usersStore.set(userId, author);
    }
    return true;
  },

  toggleLikePost: async (userId: string, postId: string): Promise<{ isLiked: boolean; likesCount: number }> => {
    const post = postsStore.get(postId);
    if (!post) throw new Error("Post not found");

    const key = `${userId}:${postId}`;
    const alreadyLiked = likesStore.has(key);

    if (alreadyLiked) {
      likesStore.delete(key);
      post.likesCount = Math.max(0, post.likesCount - 1);
    } else {
      likesStore.add(key);
      post.likesCount += 1;
    }

    postsStore.set(postId, post);
    return { isLiked: !alreadyLiked, likesCount: post.likesCount };
  },

  toggleSavePost: async (userId: string, postId: string): Promise<{ isSaved: boolean }> => {
    const post = postsStore.get(postId);
    if (!post) throw new Error("Post not found");

    const key = `${userId}:${postId}`;
    const alreadySaved = savesStore.has(key);

    if (alreadySaved) {
      savesStore.delete(key);
    } else {
      savesStore.add(key);
    }

    return { isSaved: !alreadySaved };
  },

  votePoll: async (
    userId: string,
    postId: string,
    optionId: string
  ): Promise<{ poll: NonNullable<Post["poll"]> }> => {
    const post = postsStore.get(postId);
    if (!post || !post.poll) throw new Error("Poll not found on post");

    // Remove any previous vote by this user on this poll
    let previousOptionId: string | undefined;
    post.poll.options.forEach((opt) => {
      if (opt.voterIds.includes(userId)) {
        previousOptionId = opt.id;
        opt.voterIds = opt.voterIds.filter((id) => id !== userId);
        opt.votesCount = Math.max(0, opt.votesCount - 1);
      }
    });

    if (previousOptionId) {
      post.poll.totalVotes = Math.max(0, post.poll.totalVotes - 1);
    }

    // Add new vote
    const targetOption = post.poll.options.find((opt) => opt.id === optionId);
    if (!targetOption) throw new Error("Invalid option ID");

    targetOption.voterIds.push(userId);
    targetOption.votesCount += 1;
    post.poll.totalVotes += 1;

    postsStore.set(postId, post);

    return {
      poll: {
        ...post.poll,
        userVotedOptionId: optionId,
      },
    };
  },

  // Comment methods
  getComments: async (postId: string, currentUserId?: string): Promise<Comment[]> => {
    const commentsList = Array.from(commentsStore.values()).filter((c) => c.postId === postId);

    // Sort chronologically
    commentsList.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    // Map author data
    const decoratedComments = commentsList.map((comm) => {
      const author = usersStore.get(comm.authorId);
      const isLiked = currentUserId ? commentLikesStore.has(`${currentUserId}:${comm.id}`) : false;

      return {
        id: comm.id,
        postId: comm.postId,
        author: {
          id: comm.authorId,
          username: author?.username || "creator",
          displayName: author?.displayName || "Creator",
          avatarUrl: author?.avatarUrl,
          isCreator: author?.isCreator,
        },
        content: comm.content,
        parentId: comm.parentId,
        likesCount: comm.likesCount,
        isLiked,
        createdAt: comm.createdAt,
      };
    });

    // Build threaded tree (parent -> replies)
    const rootComments: Comment[] = [];
    const repliesMap: Map<string, Comment[]> = new Map();

    decoratedComments.forEach((c) => {
      if (c.parentId) {
        const existing = repliesMap.get(c.parentId) || [];
        existing.push(c);
        repliesMap.set(c.parentId, existing);
      } else {
        rootComments.push(c);
      }
    });

    return rootComments.map((root) => ({
      ...root,
      replies: repliesMap.get(root.id) || [],
    }));
  },

  createComment: async (
    userId: string,
    postId: string,
    content: string,
    parentId?: string | null
  ): Promise<Comment> => {
    const post = postsStore.get(postId);
    if (!post) throw new Error("Post not found");

    const author = usersStore.get(userId);
    if (!author) throw new Error("Author not found");

    const id = `comm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const commentRecord: CommentRecord = {
      id,
      postId,
      authorId: userId,
      content: content.trim(),
      parentId: parentId || null,
      likesCount: 0,
      createdAt: new Date().toISOString(),
    };

    commentsStore.set(id, commentRecord);

    // Update post comments count
    post.commentsCount += 1;
    postsStore.set(postId, post);

    return {
      id,
      postId,
      author: {
        id: author.id,
        username: author.username,
        displayName: author.displayName,
        avatarUrl: author.avatarUrl,
        isCreator: author.isCreator,
      },
      content: commentRecord.content,
      parentId: commentRecord.parentId,
      replies: [],
      likesCount: 0,
      isLiked: false,
      createdAt: commentRecord.createdAt,
    };
  },

  toggleLikeComment: async (userId: string, commentId: string): Promise<{ isLiked: boolean; likesCount: number }> => {
    const comment = commentsStore.get(commentId);
    if (!comment) throw new Error("Comment not found");

    const key = `${userId}:${commentId}`;
    const alreadyLiked = commentLikesStore.has(key);

    if (alreadyLiked) {
      commentLikesStore.delete(key);
      comment.likesCount = Math.max(0, comment.likesCount - 1);
    } else {
      commentLikesStore.add(key);
      comment.likesCount += 1;
    }

    commentsStore.set(commentId, comment);
    return { isLiked: !alreadyLiked, likesCount: comment.likesCount };
  },

  // Attached phase 4-12 domain methods
  ...dbNotifications,
  ...dbStories,
  ...dbReels,
  ...dbCommunities,
  ...dbChallenges,
  ...dbEvents,
  ...dbMessages,
  ...dbMarketplace,
  ...dbAdmin,
};

export {
  dbNotifications,
  dbStories,
  dbReels,
  dbCommunities,
  dbChallenges,
  dbEvents,
  dbMessages,
  dbMarketplace,
  dbAdmin,
};
