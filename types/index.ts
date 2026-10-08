export type InterestCategory =
  | "Photography"
  | "Video Editing"
  | "Music"
  | "Technology"
  | "AI"
  | "Coding"
  | "Gaming"
  | "Cars"
  | "Travel"
  | "Fitness"
  | "Art"
  | "Fashion"
  | "Study"
  | "Movies"
  | "Food";

export type UserRole = "owner" | "creator" | "user";

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role?: UserRole;
  isOwner?: boolean;
  avatarUrl?: string;
  coverImageUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  interests: InterestCategory[];
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isCreator: boolean;
  creatorStatus?: "none" | "rising" | "pro" | "partner" | "owner";
  verified: boolean;
  isFollowing?: boolean;
  createdAt: string;
}

export interface InterestItem {
  id: InterestCategory;
  name: string;
  icon: string;
  gradient: string;
  description: string;
}

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string | number;
  isNew?: boolean;
}

export type PostMediaType = "IMAGE" | "VIDEO" | "CAROUSEL" | "POLL" | "QUESTION" | "TEXT";

export interface PollOption {
  id: string;
  text: string;
  votesCount: number;
  voterIds: string[];
}

export interface PollData {
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVotedOptionId?: string;
}

export interface Post {
  id: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
    role?: UserRole;
    isOwner?: boolean;
    isCreator: boolean;
    creatorStatus?: "none" | "rising" | "pro" | "partner" | "owner";
    verified?: boolean;
    isFollowing?: boolean;
  };
  communityId?: string;
  communityName?: string;
  content: string;
  mediaUrls: string[];
  mediaType: PostMediaType;
  poll?: PollData;
  questionPrompt?: string;
  hashtags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isPinned?: boolean;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
    isCreator?: boolean;
  };
  content: string;
  parentId?: string | null;
  replies?: Comment[];
  likesCount: number;
  isLiked?: boolean;
  createdAt: string;
}

export interface CreatePostPayload {
  content: string;
  communityName?: string;
  mediaUrls?: string[];
  mediaType?: PostMediaType;
  hashtags?: string[];
  poll?: {
    question: string;
    options: string[];
  };
  questionPrompt?: string;
}

export type NotificationType = "LIKE" | "COMMENT" | "FOLLOW" | "MENTION" | "CHALLENGE" | "EVENT" | "COMMUNITY";

export interface NotificationItem {
  id: string;
  recipientId: string;
  sender: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
    isCreator?: boolean;
  };
  type: NotificationType;
  title: string;
  body: string;
  targetUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface StoryItem {
  id: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
    isCreator?: boolean;
    hasActiveStory?: boolean;
  };
  mediaUrl: string;
  mediaType: "IMAGE" | "VIDEO";
  caption?: string;
  likesCount: number;
  isLiked?: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface ReelItem {
  id: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
    isCreator?: boolean;
    creatorStatus?: string;
    verified?: boolean;
    isFollowing?: boolean;
  };
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  musicTitle: string;
  hashtags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
}

export interface CommunityDiscussion {
  id: string;
  communityId: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
  title: string;
  content: string;
  repliesCount: number;
  createdAt: string;
}

export interface CommunityResource {
  id: string;
  communityId: string;
  title: string;
  description: string;
  url: string;
  type: "PRESET" | "DOCUMENT" | "GUIDE" | "CODE" | "VIDEO";
  downloadsCount: number;
}

export interface CommunityItem {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  coverImage: string;
  icon: string;
  gradient: string;
  membersCount: number;
  postsCount: number;
  isJoined?: boolean;
  rules: string[];
  tags: string[];
  discussions?: CommunityDiscussion[];
  resources?: CommunityResource[];
}

export interface ChallengeEntry {
  id: string;
  challengeId: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
    isCreator?: boolean;
  };
  title: string;
  imageUrl: string;
  votesCount: number;
  rank: number;
  hasVoted?: boolean;
  createdAt: string;
}

export interface ChallengeItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  communityName: string;
  coverImage: string;
  rewardBadge: string;
  participantsCount: number;
  entriesCount: number;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  rules: string[];
  entries?: ChallengeEntry[];
  hasJoined?: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: string;
  coverImage: string;
  host: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
  date: string;
  time: string;
  location: string;
  isVirtual: boolean;
  meetingUrl?: string;
  attendeesCount: number;
  isAttending?: boolean;
  price?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text?: string;
  content?: string;
  mediaUrl?: string;
  mediaType?: "IMAGE" | "VOICE" | string;
  voiceDurationSeconds?: number;
  reactions?: Record<string, any>;
  read?: boolean;
  createdAt: string;
}

export interface ConversationItem {
  id: string;
  participant?: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
    isOnline?: boolean;
    isCreator?: boolean;
  };
  participants?: Array<{
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
    isOnline?: boolean;
    isCreator?: boolean;
  }>;
  lastMessage?: any;
  lastMessageTime?: string;
  unreadCount: number;
  messages: ChatMessage[];
  updatedAt?: string;
}

export interface ProductItem {
  id: string;
  title: string;
  description: string;
  creator: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
    isCreator?: boolean;
  };
  price: number; // 0 for free
  category: "PRESETS" | "LUTS" | "TEMPLATES" | "WALLPAPERS" | "SHADERS" | "GUIDES" | string;
  thumbnailUrl: string;
  rating: number;
  reviewsCount: number;
  downloadsCount: number;
  features: string[];
}

export interface ReportItem {
  id: string;
  postId?: string;
  targetId?: string;
  targetType?: "POST" | "USER" | "COMMENT" | string;
  reporterId: string;
  reporterName?: string;
  reason: string;
  details?: string;
  postContent?: string;
  authorUsername?: string;
  status: "PENDING" | "DISMISSED" | "RESOLVED" | "POST_REMOVED";
  resolutionNotes?: string;
  createdAt: string;
}

