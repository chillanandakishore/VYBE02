/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Input, Textarea } from "@/components/ui/input";
import { PostCard } from "@/components/feed/post-card";
import { Post, InterestCategory } from "@/types";
import { AVAILABLE_INTERESTS } from "@/lib/db";
import {
  MapPin,
  Globe,
  Calendar,
  Share2,
  Edit3,
  Bookmark,
  Grid,
  Film,
  Users2,
  Trophy,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  UserPlus,
  Check,
  List,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { FollowListModal } from "@/components/profile/follow-list-modal";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");
  const [viewMode, setViewMode] = useState<"grid" | "feed">("grid");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [followModalTab, setFollowModalTab] = useState<"followers" | "following">("followers");

  // Profile data
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  // Edit form state
  const [editDisplayName, setEditDisplayName] = useState(user?.displayName || "");
  const [editBio, setEditBio] = useState(user?.bio || "");
  const [editLocation, setEditLocation] = useState(user?.location || "");
  const [editWebsite, setEditWebsite] = useState(user?.website || "");
  const [editAvatarUrl, setEditAvatarUrl] = useState(user?.avatarUrl || "");
  const [editCoverUrl, setEditCoverUrl] = useState(user?.coverImageUrl || "");
  const [editInterests, setEditInterests] = useState<InterestCategory[]>(user?.interests || []);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Fetch posts by user
  useEffect(() => {
    if (!user?.id) return;
    const userId = user.id;
    async function loadData() {
      setIsLoadingPosts(true);
      try {
        const res = await fetch(`/api/posts?authorId=${userId}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setUserPosts(data.posts);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingPosts(false);
      }
    }
    loadData();
  }, [user]);

  // Fetch saved posts when tab is clicked
  useEffect(() => {
    if (activeTab === "saved" && user) {
      async function loadSaved() {
        try {
          const res = await fetch(`/api/posts?saved=true`);
          const data = await res.json();
          if (res.ok && data.success) {
            setSavedPosts(data.posts);
          }
        } catch (err) {
          console.error(err);
        }
      }
      loadSaved();
    }
  }, [activeTab, user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSavingProfile(true);

    try {
      const updates = {
        displayName: editDisplayName.trim(),
        bio: editBio.trim(),
        location: editLocation.trim(),
        website: editWebsite.trim(),
        avatarUrl: editAvatarUrl.trim(),
        coverImageUrl: editCoverUrl.trim(),
        interests: editInterests,
      };

      const res = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setUser(data.user);
        setEditModalOpen(false);
        toast({
          type: "success",
          title: "Profile Updated",
          message: "Your changes have been saved to your public profile.",
        });
      } else {
        toast({
          type: "error",
          title: "Update Failed",
          message: data.message || "Failed to update profile.",
        });
      }
    } catch {
      toast({
        type: "error",
        title: "Network Error",
        message: "Failed to connect to server.",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleShareProfile = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast({
      type: "success",
      title: "Profile Link Copied!",
      message: "Share this link with your community.",
    });
  };

  const toggleInterest = (category: InterestCategory) => {
    if (editInterests.includes(category)) {
      setEditInterests(editInterests.filter((c) => c !== category));
    } else {
      setEditInterests([...editInterests, category]);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Cover and Profile Header */}
      <div className="relative rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900/60 shadow-2xl backdrop-blur-md">
        {/* Cover Photo */}
        <div className="h-48 sm:h-72 w-full relative overflow-hidden bg-neutral-950">
          <img
            src={
              user?.coverImageUrl ||
              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80"
            }
            alt="Cover background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
        </div>

        {/* Profile Card Main Info */}
        <div className="px-6 pb-6 pt-0 relative -mt-16 sm:-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
            <div className="flex items-end gap-4">
              <Avatar
                src={user?.avatarUrl}
                name={user?.displayName || "You"}
                size="xl"
                isOnline
                isCreator={user?.isCreator}
                className="ring-4 ring-neutral-950 shadow-2xl"
              />

              <div className="mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-3xl font-black text-white">
                    {user?.displayName || "Creator"}
                  </h1>
                  {user?.isCreator && (
                    <Badge variant="primary" size="sm">
                      <Sparkles className="w-3 h-3 mr-1 text-violet-400" />
                      {user?.creatorStatus?.toUpperCase() || "PRO CREATOR"}
                    </Badge>
                  )}
                  {user?.verified && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </div>
                <p className="text-xs text-neutral-400">@{user?.username || "handle"}</p>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditDisplayName(user?.displayName || "");
                  setEditBio(user?.bio || "");
                  setEditLocation(user?.location || "");
                  setEditWebsite(user?.website || "");
                  setEditAvatarUrl(user?.avatarUrl || "");
                  setEditCoverUrl(user?.coverImageUrl || "");
                  setEditInterests(user?.interests || []);
                  setEditModalOpen(true);
                }}
                leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              >
                Edit Profile
              </Button>

              <Link href="/messages">
                <Button variant="secondary" size="sm" leftIcon={<MessageSquare className="w-3.5 h-3.5 text-cyan-400" />}>
                  Message
                </Button>
              </Link>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleShareProfile}
                leftIcon={<Share2 className="w-3.5 h-3.5" />}
              >
                Share
              </Button>
            </div>
          </div>

          {/* Bio & Details */}
          <div className="max-w-2xl text-xs sm:text-sm text-neutral-200 leading-relaxed mb-4 whitespace-pre-line">
            {user?.bio ||
              "Filmmaker & Storyteller. Exploring visual aesthetics and interest-based communities on VYBE."}
          </div>

          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 mb-5">
            {user?.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" /> {user.location}
              </span>
            )}
            {user?.website && (
              <a
                href={user.website.startsWith("http") ? user.website : `https://${user.website}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-violet-400 hover:underline"
              >
                <Globe className="w-3.5 h-3.5" /> {user.website.replace(/^https?:\/\//, "")}
              </a>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-neutral-500" /> Joined VYBE Oct 2026
            </span>
          </div>

          {/* Interests Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mb-6">
            <span className="text-[11px] font-semibold text-neutral-500 mr-1">Interests:</span>
            {user?.interests && user.interests.length > 0 ? (
              user.interests.map((item) => (
                <span
                  key={item}
                  className="px-2.5 py-0.5 rounded-lg bg-neutral-800/80 border border-neutral-700/60 text-xs font-medium text-neutral-300"
                >
                  {item}
                </span>
              ))
            ) : (
              <span className="text-xs text-neutral-500">None selected</span>
            )}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 py-3 border-t border-neutral-800/80 text-center">
            <div>
              <span className="text-base sm:text-lg font-black text-white block">
                {userPosts.length || user?.postsCount || 0}
              </span>
              <span className="text-[11px] text-neutral-400">Posts</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setFollowModalTab("followers");
                setShowFollowModal(true);
              }}
              className="text-center group hover:opacity-80 transition-opacity cursor-pointer"
            >
              <span className="text-base sm:text-lg font-black text-white block group-hover:text-violet-300">
                {user?.followersCount ? user.followersCount.toLocaleString() : "0"}
              </span>
              <span className="text-[11px] text-neutral-400 group-hover:text-neutral-200">Followers</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setFollowModalTab("following");
                setShowFollowModal(true);
              }}
              className="text-center group hover:opacity-80 transition-opacity cursor-pointer"
            >
              <span className="text-base sm:text-lg font-black text-white block group-hover:text-violet-300">
                {user?.followingCount || 0}
              </span>
              <span className="text-[11px] text-neutral-400 group-hover:text-neutral-200">Following</span>
            </button>
            <div className="hidden sm:block">
              <span className="text-base sm:text-lg font-black text-white block">
                {user?.isCreator ? "Verified Creator" : "Member"}
              </span>
              <span className="text-[11px] text-neutral-400">Status</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content Tabs & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs
          tabs={[
            { id: "posts", label: "Posts", icon: <Grid className="w-3.5 h-3.5" />, badge: userPosts.length },
            { id: "reels", label: "Reels", icon: <Film className="w-3.5 h-3.5" />, badge: 2 },
            { id: "saved", label: "Saved Posts", icon: <Bookmark className="w-3.5 h-3.5" />, badge: savedPosts.length || 2 },
            { id: "communities", label: "Communities", icon: <Users2 className="w-3.5 h-3.5" />, badge: user?.interests?.length || 4 },
            { id: "achievements", label: "Achievements", icon: <Trophy className="w-3.5 h-3.5" /> },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {activeTab === "posts" && (
          <div className="flex items-center gap-1 bg-neutral-900/60 border border-neutral-800 p-1 rounded-xl self-end">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === "grid" ? "bg-violet-600 text-white" : "text-neutral-400 hover:text-white"
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("feed")}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === "feed" ? "bg-violet-600 text-white" : "text-neutral-400 hover:text-white"
              }`}
              title="Feed View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Tab Panels */}
      {/* 1. Posts Tab */}
      {activeTab === "posts" && (
        <div>
          {isLoadingPosts ? (
            <p className="text-center text-xs text-neutral-500 py-12">Loading posts...</p>
          ) : userPosts.length === 0 ? (
            <Card className="p-8 text-center bg-neutral-900/40 border-neutral-800">
              <p className="text-sm font-semibold text-white mb-1">No posts published yet</p>
              <p className="text-xs text-neutral-400 mb-4">
                Share your first video breakdown, photo, or question on the Community Feed.
              </p>
              <Link href="/feed">
                <Button variant="gradient" size="sm">
                  Go to Feed
                </Button>
              </Link>
            </Card>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {userPosts.map((post) => (
                <Card
                  key={post.id}
                  className="group aspect-square overflow-hidden relative border-neutral-800 bg-neutral-950 cursor-pointer"
                >
                  {post.mediaUrls && post.mediaUrls.length > 0 ? (
                    <img
                      src={post.mediaUrls[0]}
                      alt="Post thumbnail"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full p-5 flex flex-col justify-between bg-neutral-900/80">
                      <span className="text-[10px] text-cyan-400 font-semibold">{post.communityName}</span>
                      <p className="text-xs text-neutral-200 line-clamp-4 leading-relaxed">
                        {post.content}
                      </p>
                      <span className="text-[10px] text-neutral-500">{post.mediaType}</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white text-xs font-bold backdrop-blur-xs">
                    <span className="flex items-center gap-1">
                      ❤️ {post.likesCount}
                    </span>
                    <span className="flex items-center gap-1">
                      💬 {post.commentsCount}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-6 max-w-2xl mx-auto">
              {userPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onPostDeleted={(id) => setUserPosts((prev) => prev.filter((p) => p.id !== id))}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Reels Tab */}
      {activeTab === "reels" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[
            {
              title: "Shinjuku at midnight FX3",
              views: "42.8k",
              image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80",
            },
            {
              title: "DaVinci Split-Toning Node 4",
              views: "18.2k",
              image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=500&auto=format&fit=crop&q=80",
            },
          ].map((reel, idx) => (
            <Link key={idx} href="/reels">
              <Card className="group aspect-[9/16] overflow-hidden relative border-neutral-800 bg-neutral-950 cursor-pointer">
                <img
                  src={reel.image}
                  alt={reel.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-3">
                  <span className="text-[10px] font-mono text-cyan-400">▶ {reel.views}</span>
                  <p className="text-xs font-semibold text-white truncate mt-0.5">{reel.title}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* 3. Saved Posts Tab */}
      {activeTab === "saved" && (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
          {savedPosts.length === 0 ? (
            <Card className="p-8 text-center bg-neutral-900/40 border-neutral-800">
              <p className="text-sm font-semibold text-white mb-1">No saved posts yet</p>
              <p className="text-xs text-neutral-400">
                Click the bookmark icon on any post in the feed to save it for easy reference.
              </p>
            </Card>
          ) : (
            savedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      )}

      {/* 4. Communities Tab */}
      {activeTab === "communities" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {(user?.interests || ["Video Editing", "Photography", "Coding", "AI"]).map((interestName) => (
            <Link key={interestName} href="/vybes">
              <Card className="p-4 bg-neutral-900/60 border-neutral-800 hover:border-violet-500/40 transition-colors flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{interestName}</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Active Member</p>
                </div>
                <Badge variant="primary" size="sm">
                  Joined
                </Badge>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* 5. Achievements Tab */}
      {activeTab === "achievements" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 bg-neutral-900/60 border-neutral-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white">First Challenge Completed</h5>
              <p className="text-[10px] text-neutral-400">30-Day Night Photography</p>
            </div>
          </Card>

          <Card className="p-4 bg-neutral-900/60 border-neutral-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white">Verified Creator</h5>
              <p className="text-[10px] text-neutral-400">High-fidelity production</p>
            </div>
          </Card>

          <Card className="p-4 bg-neutral-900/60 border-neutral-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Users2 className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white">Community Pillar</h5>
              <p className="text-[10px] text-neutral-400">100+ constructive answers</p>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Profile"
        description="Update your public creator card, bio, links, and interest tags."
        maxWidth="lg"
      >
        <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Display Name"
              value={editDisplayName}
              onChange={(e) => setEditDisplayName(e.target.value)}
              placeholder="e.g. Alex Rivers 🎬"
            />
            <Input
              label="Location"
              placeholder="e.g. Tokyo / Los Angeles"
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
            />
          </div>

          <Textarea
            label="Bio"
            value={editBio}
            onChange={(e) => setEditBio(e.target.value)}
            rows={3}
            placeholder="Tell your story, gear setups, or passions..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Website URL"
              placeholder="https://..."
              value={editWebsite}
              onChange={(e) => setEditWebsite(e.target.value)}
            />
            <Input
              label="Avatar Image URL"
              placeholder="https://images.unsplash.com/..."
              value={editAvatarUrl}
              onChange={(e) => setEditAvatarUrl(e.target.value)}
            />
          </div>

          <Input
            label="Cover Photo URL"
            placeholder="https://images.unsplash.com/..."
            value={editCoverUrl}
            onChange={(e) => setEditCoverUrl(e.target.value)}
          />

          {/* Interests Selector in Modal */}
          <div className="flex flex-col gap-2 pt-2 border-t border-neutral-800">
            <label className="text-xs font-semibold text-neutral-300">
              Your VYBES & Niches ({editInterests.length} selected)
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {AVAILABLE_INTERESTS.map((interest) => {
                const isSelected = editInterests.includes(interest.id);
                return (
                  <button
                    type="button"
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      isSelected
                        ? "bg-violet-600/30 border-violet-500 text-white font-semibold"
                        : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 inline mr-1 text-violet-400" />}
                    {interest.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditModalOpen(false)}
              disabled={isSavingProfile}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              size="sm"
              isLoading={isSavingProfile}
            >
              Save Profile
            </Button>
          </div>
        </form>
      </Modal>

      {/* Followers & Following List Modal */}
      {user && (
        <FollowListModal
          isOpen={showFollowModal}
          onClose={() => setShowFollowModal(false)}
          userId={user.id}
          username={user.username}
          initialTab={followModalTab}
          onFollowCountChanged={(diff) => {
            setUser({
              ...user,
              followingCount: Math.max(0, (user.followingCount || 0) + diff),
            });
          }}
        />
      )}
    </div>
  );
}
