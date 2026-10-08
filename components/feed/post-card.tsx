/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { Post, Comment } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReportModal } from "./report-modal";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Check,
  Send,
  Flag,
  Copy,
  UserPlus,
  BarChart2,
  HelpCircle,
  CornerDownRight,
  CheckCircle2,
  Repeat2,
  X,
} from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

interface PostCardProps {
  post: Post;
  onPostUpdated?: (updated: Post) => void;
  onPostDeleted?: (postId: string) => void;
}

export function PostCard({ post, onPostUpdated, onPostDeleted }: PostCardProps) {
  const { user } = useAuth();

  // Local state
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isLiked, setIsLiked] = useState(!!post.isLiked);
  const [isSaved, setIsSaved] = useState(!!post.isSaved);
  const [pollData, setPollData] = useState(post.poll);
  const [isVotingPoll, setIsVotingPoll] = useState(false);

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Comments state
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);

  // Dropdown & Modal state
  const [showMenu, setShowMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharesCount, setSharesCount] = useState(post.sharesCount);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(!!post.author.isFollowing);

  // Like Toggle
  const handleToggleLike = async () => {
    if (!user) {
      toast({
        type: "warning",
        title: "Sign in required",
        message: "Please sign in to like posts.",
      });
      return;
    }

    const nextLiked = !isLiked;
    const nextCount = nextLiked ? likesCount + 1 : Math.max(0, likesCount - 1);

    // Optimistic UI
    setIsLiked(nextLiked);
    setLikesCount(nextCount);

    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        // Rollback
        setIsLiked(!nextLiked);
        setLikesCount(likesCount);
      } else {
        setLikesCount(data.likesCount);
      }
    } catch {
      setIsLiked(!nextLiked);
      setLikesCount(likesCount);
    }
  };

  // Save Toggle
  const handleToggleSave = async () => {
    if (!user) {
      toast({
        type: "warning",
        title: "Sign in required",
        message: "Please sign in to save posts.",
      });
      return;
    }

    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    toast({
      type: "info",
      title: nextSaved ? "Saved to Bookmarks" : "Removed from Bookmarks",
      message: nextSaved ? "View this in your Profile > Saved Posts." : undefined,
    });

    try {
      await fetch(`/api/posts/${post.id}/save`, { method: "POST" });
    } catch {
      setIsSaved(!nextSaved);
    }
  };

  // Poll Voting
  const handleVotePoll = async (optionId: string) => {
    if (!user) {
      toast({
        type: "warning",
        title: "Sign in required",
        message: "Please sign in to vote in community polls.",
      });
      return;
    }

    setIsVotingPoll(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/poll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.poll) {
        setPollData(data.poll);
        toast({
          type: "success",
          title: "Vote Recorded!",
          message: "Thank you for participating in the VYBE poll.",
        });
      }
    } catch {
      toast({
        type: "error",
        title: "Voting Failed",
      });
    } finally {
      setIsVotingPoll(false);
    }
  };

  // Fetch Comments on Drawer Open
  const handleToggleComments = async () => {
    const nextState = !showComments;
    setShowComments(nextState);

    if (nextState && comments.length === 0) {
      setIsLoadingComments(true);
      try {
        const res = await fetch(`/api/posts/${post.id}/comments`);
        const data = await res.json();
        if (res.ok && data.success) {
          setComments(data.comments);
        }
      } catch (err) {
        console.error("Failed to load comments", err);
      } finally {
        setIsLoadingComments(false);
      }
    }
  };

  // Add Comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    if (!user) {
      toast({
        type: "warning",
        title: "Sign in required",
        message: "Please sign in to comment on posts.",
      });
      return;
    }

    setIsSubmittingComment(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: commentInput.trim(),
          parentId: replyingToId,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.comment) {
        if (replyingToId) {
          // Add to parent replies
          setComments((prev) =>
            prev.map((c) => {
              if (c.id === replyingToId) {
                return {
                  ...c,
                  replies: [...(c.replies || []), data.comment],
                };
              }
              return c;
            })
          );
        } else {
          setComments((prev) => [data.comment, ...prev]);
        }

        setCommentInput("");
        setReplyingToId(null);
        setCommentsCount((prev) => prev + 1);

        toast({
          type: "success",
          title: "Comment Added!",
        });
      }
    } catch {
      toast({
        type: "error",
        title: "Comment Failed",
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Like a Comment
  const handleToggleLikeComment = async (commentId: string) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/comments/${commentId}/like`, { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setComments((prev) =>
          prev.map((c) => {
            if (c.id === commentId) {
              return { ...c, isLiked: data.isLiked, likesCount: data.likesCount };
            }
            if (c.replies) {
              return {
                ...c,
                replies: c.replies.map((r) =>
                  r.id === commentId
                    ? { ...r, isLiked: data.isLiked, likesCount: data.likesCount }
                    : r
                ),
              };
            }
            return c;
          })
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Follow Creator Toggle
  const handleToggleFollow = async () => {
    if (!user) {
      toast({
        type: "warning",
        title: "Sign in required",
        message: "Please sign in to follow creators.",
      });
      return;
    }

    const nextState = !isFollowing;
    setIsFollowing(nextState);
    toast({
      type: "success",
      title: nextState ? `Following @${post.author.username}` : `Unfollowed @${post.author.username}`,
      message: nextState ? "Their updates will appear in your Following tab." : undefined,
    });

    try {
      const res = await fetch(`/api/users/${post.author.id}/follow`, { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setIsFollowing(!nextState);
      }
    } catch {
      setIsFollowing(!nextState);
    }
  };

  // Copy Link
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(`${window.location.origin}/feed#${post.id}`);
    }
    toast({
      type: "success",
      title: "Link Copied!",
      message: "Link copied to clipboard!",
    });
    setShowShareModal(false);
    setShowMenu(false);
  };

  // Share to VYBE
  const handleShareToTimeline = () => {
    setSharesCount((prev) => prev + 1);
    toast({
      type: "success",
      title: "Shared to VYBE!",
      message: "Post shared to your VYBE timeline.",
    });
    setShowShareModal(false);
    setShowMenu(false);
  };

  // Delete Post (if author)
  const handleDeletePost = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
      if (res.ok) {
        toast({
          type: "info",
          title: "Post Deleted",
        });
        if (onPostDeleted) onPostDeleted(post.id);
      }
    } catch {
      toast({
        type: "error",
        title: "Delete Failed",
      });
    }
  };

  const isAuthor = user?.id === post.author.id;
  const authorProfileHref = isAuthor ? "/profile" : `/profile/${post.author.username}`;

  return (
    <>
      <Card className="bg-neutral-900/65 border-neutral-800/80 hover:border-neutral-700/80 transition-all overflow-hidden shadow-lg backdrop-blur-md">
        {/* Post Author Header */}
        <div className="p-4 sm:p-5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={authorProfileHref}>
              <Avatar
                src={post.author.avatarUrl}
                name={post.author.displayName}
                size="md"
                isCreator={post.author.isCreator}
                isOnline
              />
            </Link>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link href={authorProfileHref} className="text-sm font-bold text-white hover:text-violet-300 transition-colors">
                  {post.author.displayName}
                </Link>
                {(post.author.isOwner || post.author.role === "owner" || post.author.creatorStatus === "owner") ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow-sm">
                    👑 Owner
                  </span>
                ) : post.author.creatorStatus && post.author.creatorStatus !== "none" ? (
                  <Badge variant="primary" size="sm">
                    {post.author.creatorStatus.toUpperCase()}
                  </Badge>
                ) : null}
                {post.author.verified && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
              </div>

              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span>@{post.author.username}</span>
                <span>•</span>
                <span>{formatTimeAgo(post.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 relative">
            {!isAuthor && (
              <button
                type="button"
                onClick={handleToggleFollow}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  isFollowing
                    ? "bg-neutral-800 text-neutral-300 border border-neutral-700"
                    : "bg-violet-600 hover:bg-violet-500 text-white shadow-sm"
                }`}
              >
                {isFollowing ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3 h-3" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            )}

            {/* 3-dots Menu button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-8 z-30 w-48 rounded-xl bg-neutral-900 border border-neutral-800 p-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => {
                      setShowShareModal(true);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 text-left cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Post</span>
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 text-left cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Post Link</span>
                  </button>

                  <button
                    onClick={() => {
                      handleToggleSave();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 text-left cursor-pointer"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{isSaved ? "Remove Bookmark" : "Save Post"}</span>
                  </button>

                  {!isAuthor ? (
                    <button
                      onClick={() => {
                        setShowReportModal(true);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 text-left cursor-pointer"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>Report Content</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleDeletePost}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 text-left cursor-pointer"
                    >
                      <span>Delete Post</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Community Channel Tag */}
        {post.communityName && (
          <div className="px-5 pb-2">
            <span className="inline-block text-[11px] font-semibold text-cyan-400 bg-cyan-950/30 border border-cyan-800/40 px-2.5 py-0.5 rounded-full">
              {post.communityName}
            </span>
          </div>
        )}

        {/* Post Text Content */}
        {post.content && (
          <div className="px-5 pb-3">
            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-normal whitespace-pre-line">
              {post.content}
            </p>

            {/* Highlighted Hashtags */}
            {post.hashtags && post.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {post.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-semibold text-violet-400 hover:underline cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Media Renderer: CAROUSEL or SINGLE IMAGE */}
        {post.mediaUrls && post.mediaUrls.length > 0 && post.mediaType !== "VIDEO" && (
          <div className="relative w-full aspect-video bg-neutral-950 overflow-hidden border-y border-neutral-800/80 group">
            <img
              src={post.mediaUrls[currentSlide] || post.mediaUrls[0]}
              alt={`Slide ${currentSlide + 1}`}
              className="w-full h-full object-cover transition-opacity duration-300 select-none"
            />

            {/* Carousel navigation arrows */}
            {post.mediaUrls.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentSlide((prev) => (prev === 0 ? post.mediaUrls.length - 1 : prev - 1))
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentSlide((prev) => (prev === post.mediaUrls.length - 1 ? 0 : prev + 1))
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Bottom slide dots */}
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded-full backdrop-blur-md">
                  {post.mediaUrls.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setCurrentSlide(dotIdx)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        currentSlide === dotIdx ? "w-3 bg-violet-400" : "bg-neutral-400"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Media Renderer: VIDEO REEL */}
        {post.mediaUrls && post.mediaUrls.length > 0 && post.mediaType === "VIDEO" && (
          <div className="relative w-full aspect-video bg-neutral-950 overflow-hidden border-y border-neutral-800/80">
            <video
              src={post.mediaUrls[0]}
              controls
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Interactive Poll Component */}
        {post.mediaType === "POLL" && pollData && (
          <div className="px-5 pb-4">
            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800/90 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
                  {pollData.question}
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">
                  {pollData.totalVotes} total votes
                </span>
              </div>

              <div className="space-y-2">
                {pollData.options.map((option) => {
                  const pct = pollData.totalVotes > 0
                    ? Math.round((option.votesCount / pollData.totalVotes) * 100)
                    : 0;
                  const isVoted = pollData.userVotedOptionId === option.id;

                  return (
                    <button
                      type="button"
                      key={option.id}
                      disabled={isVotingPoll}
                      onClick={() => handleVotePoll(option.id)}
                      className={`relative w-full overflow-hidden p-3 rounded-xl border text-left text-xs transition-all ${
                        isVoted
                          ? "border-cyan-500/80 bg-cyan-950/30 text-white font-semibold"
                          : "border-neutral-800 hover:border-neutral-700 bg-neutral-900/50 text-neutral-300"
                      }`}
                    >
                      {/* Live progress fill */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 transition-all duration-500 ${
                          isVoted ? "bg-cyan-500/25" : "bg-neutral-800/50"
                        }`}
                        style={{ width: `${pct}%` }}
                      />

                      <div className="relative z-10 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          {isVoted && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                          <span>{option.text}</span>
                        </span>
                        <span className="font-mono text-[11px] text-neutral-400">{pct}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Community Question Component */}
        {post.mediaType === "QUESTION" && post.questionPrompt && (
          <div className="px-5 pb-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/40 to-cyan-950/30 border border-violet-800/40 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-400 shrink-0 mt-0.5">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider block">
                  Ask VYBE Community
                </span>
                <p className="text-xs sm:text-sm font-semibold text-white mt-0.5 leading-snug">
                  {post.questionPrompt}
                </p>
                <button
                  type="button"
                  onClick={handleToggleComments}
                  className="mt-2 text-[11px] font-bold text-cyan-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>Answer this question</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Engagement Actions Bar */}
        <div className="p-4 sm:px-5 flex items-center justify-between border-t border-neutral-800/60 bg-neutral-950/30 text-xs select-none">
          <div className="flex items-center gap-5">
            {/* Like */}
            <button
              type="button"
              onClick={handleToggleLike}
              className="flex items-center gap-1.5 transition-colors cursor-pointer group"
            >
              <Heart
                className={`w-4 h-4 transition-transform group-active:scale-125 ${
                  isLiked ? "text-rose-500 fill-rose-500" : "text-neutral-400 group-hover:text-rose-400"
                }`}
              />
              <span className={`font-semibold ${isLiked ? "text-rose-400" : "text-neutral-300"}`}>
                {likesCount}
              </span>
            </button>

            {/* Comment */}
            <button
              type="button"
              onClick={handleToggleComments}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                showComments ? "text-cyan-400 font-semibold" : "text-neutral-400 hover:text-cyan-400"
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>{commentsCount}</span>
            </button>

            {/* Share */}
            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{sharesCount}</span>
            </button>
          </div>

          {/* Save */}
          <button
            type="button"
            onClick={handleToggleSave}
            className="p-1 rounded-lg text-neutral-400 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? "text-amber-400 fill-amber-400" : ""}`} />
          </button>
        </div>

        {/* Expandable Comments & Discussion Drawer */}
        {showComments && (
          <div className="border-t border-neutral-800/80 bg-neutral-950/50 p-4 sm:p-5 flex flex-col gap-4 animate-in fade-in duration-200">
            {/* Add Comment Input */}
            <form onSubmit={handleAddComment} className="flex flex-col gap-2">
              {replyingToId && (
                <div className="flex items-center justify-between text-[11px] text-violet-400 bg-violet-950/30 px-3 py-1 rounded-lg border border-violet-800/30">
                  <span>Replying to thread</span>
                  <button
                    type="button"
                    onClick={() => setReplyingToId(null)}
                    className="text-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Avatar
                  src={user?.avatarUrl}
                  name={user?.displayName || "You"}
                  size="sm"
                />
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder={replyingToId ? "Write your reply..." : "Write a constructive comment or answer..."}
                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-violet-500"
                />
                <Button
                  type="submit"
                  variant="gradient"
                  size="sm"
                  disabled={!commentInput.trim() || isSubmittingComment}
                  isLoading={isSubmittingComment}
                  rightIcon={<Send className="w-3 h-3" />}
                >
                  Reply
                </Button>
              </div>
            </form>

            {/* Comments List */}
            {isLoadingComments ? (
              <p className="text-center text-xs text-neutral-500 py-3">Loading discussion...</p>
            ) : comments.length === 0 ? (
              <p className="text-center text-xs text-neutral-500 py-3">
                No comments yet. Start the conversation!
              </p>
            ) : (
              <div className="space-y-3 pt-2">
                {comments.map((comm) => (
                  <div key={comm.id} className="flex flex-col gap-2">
                    {/* Parent Comment */}
                    <div className="flex items-start gap-2.5">
                      <Avatar
                        src={comm.author.avatarUrl}
                        name={comm.author.displayName}
                        size="sm"
                        isCreator={comm.author.isCreator}
                      />
                      <div className="flex-1 min-w-0 bg-neutral-900/80 border border-neutral-800/70 p-3 rounded-2xl">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-white">
                            {comm.author.displayName}
                          </span>
                          <span className="text-[10px] text-neutral-500">
                            {formatTimeAgo(comm.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-200 leading-relaxed font-normal">
                          {comm.content}
                        </p>

                        <div className="flex items-center gap-4 mt-2 text-[10px] text-neutral-400">
                          <button
                            type="button"
                            onClick={() => handleToggleLikeComment(comm.id)}
                            className="flex items-center gap-1 hover:text-rose-400 transition-colors"
                          >
                            <Heart className={`w-3 h-3 ${comm.isLiked ? "text-rose-500 fill-rose-500" : ""}`} />
                            <span>{comm.likesCount}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setReplyingToId(comm.id)}
                            className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
                          >
                            <CornerDownRight className="w-3 h-3" />
                            <span>Reply</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Nested Replies */}
                    {comm.replies && comm.replies.length > 0 && (
                      <div className="pl-8 space-y-2 border-l-2 border-neutral-800 ml-4">
                        {comm.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start gap-2.5">
                            <Avatar
                              src={reply.author.avatarUrl}
                              name={reply.author.displayName}
                              size="xs"
                            />
                            <div className="flex-1 min-w-0 bg-neutral-900/60 border border-neutral-800/60 p-2.5 rounded-xl">
                              <div className="flex items-center justify-between mb-0.5">
                                <span className="text-[11px] font-bold text-white">
                                  {reply.author.displayName}
                                </span>
                                <span className="text-[9px] text-neutral-500">
                                  {formatTimeAgo(reply.createdAt)}
                                </span>
                              </div>
                              <p className="text-[11px] text-neutral-200 leading-relaxed">
                                {reply.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Safety & Moderation Report Dialog */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        postId={post.id}
      />

      {/* Share Post Dialog */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <Card className="w-full max-w-sm p-6 bg-neutral-900 border-neutral-800 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-violet-400" /> Share Post
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Share this post by @{post.author.username} with friends or across the VYBE network.
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-neutral-950/80 hover:bg-neutral-800/80 border border-neutral-800 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <Copy className="w-4 h-4 text-cyan-400" /> Copy Link
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">vybe.social</span>
              </button>

              <button
                type="button"
                onClick={handleShareToTimeline}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-violet-950/40 hover:bg-violet-900/50 border border-violet-800/50 text-xs font-semibold text-violet-200 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <Repeat2 className="w-4 h-4 text-violet-400" /> Share to VYBE
                </span>
                <span className="text-[10px] text-violet-400">Timeline</span>
              </button>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowShareModal(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
