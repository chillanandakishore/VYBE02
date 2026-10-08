"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "@/components/ui/modal";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import {
  Users,
  Search,
  UserPlus,
  Check,
  CheckCircle2,
  Sparkles,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface FollowListModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  username: string;
  initialTab?: "followers" | "following";
  onFollowCountChanged?: (diff: number) => void;
}

export function FollowListModal({
  isOpen,
  onClose,
  userId,
  username,
  initialTab = "followers",
  onFollowCountChanged,
}: FollowListModalProps) {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"followers" | "following">(initialTab);
  const [usersList, setUsersList] = useState<Array<User & { isFollowing?: boolean }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (!isOpen || !userId) return;

    let isCancelled = false;
    async function fetchList() {
      setIsLoading(true);
      try {
        const endpoint =
          activeTab === "followers"
            ? `/api/users/${userId}/followers`
            : `/api/users/${userId}/following`;

        const res = await fetch(endpoint);
        const data = await res.json();

        if (!isCancelled && res.ok && data.success) {
          const fetched: Array<User & { isFollowing?: boolean }> =
            activeTab === "followers" ? data.followers : data.following;
          setUsersList(fetched || []);

          // Sync initial following states map
          const stateMap: Record<string, boolean> = {};
          fetched.forEach((u) => {
            stateMap[u.id] = !!u.isFollowing;
          });
          setFollowingStates(stateMap);
        }
      } catch (err) {
        console.error("Failed to fetch follow list", err);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    fetchList();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, userId, activeTab]);

  // Filter by search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return usersList;
    const q = searchQuery.toLowerCase().trim();
    return usersList.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.displayName.toLowerCase().includes(q)
    );
  }, [usersList, searchQuery]);

  // Toggle follow user from list
  const handleToggleFollow = async (targetUser: User) => {
    if (!currentUser) {
      toast({
        type: "warning",
        title: "Sign in required",
        message: "Please sign in to follow users.",
      });
      return;
    }

    const currentStatus = !!followingStates[targetUser.id];
    const nextStatus = !currentStatus;

    // Optimistic state
    setFollowingStates((prev) => ({
      ...prev,
      [targetUser.id]: nextStatus,
    }));

    toast({
      type: "success",
      title: nextStatus ? `Following @${targetUser.username}` : `Unfollowed @${targetUser.username}`,
    });

    if (onFollowCountChanged && targetUser.id === userId && activeTab === "followers") {
      onFollowCountChanged(nextStatus ? 1 : -1);
    }

    try {
      const res = await fetch(`/api/users/${targetUser.id}/follow`, { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        // Rollback
        setFollowingStates((prev) => ({
          ...prev,
          [targetUser.id]: currentStatus,
        }));
      }
    } catch {
      // Rollback
      setFollowingStates((prev) => ({
        ...prev,
        [targetUser.id]: currentStatus,
      }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`@${username}`}
      maxWidth="md"
    >
      <div className="flex flex-col gap-4">
        {/* Tab Switcher */}
        <div className="flex border-b border-neutral-800">
          <button
            onClick={() => setActiveTab("followers")}
            className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === "followers"
                ? "border-violet-500 text-white"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Followers
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === "following"
                ? "border-violet-500 text-white"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Following
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        {/* Users List Container */}
        <div className="max-h-80 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-neutral-500">
              <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
              <span className="text-xs">Loading {activeTab}...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-10 text-center text-neutral-400">
              <Users className="w-8 h-8 text-neutral-600 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold text-neutral-300">
                {searchQuery
                  ? "No matching users found"
                  : activeTab === "followers"
                  ? "No followers yet"
                  : "Not following anyone yet"}
              </p>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                {activeTab === "followers"
                  ? "When people follow this profile, they will appear here."
                  : "Follow other creators to discover their stories and reels."}
              </p>
            </div>
          ) : (
            filteredUsers.map((item) => {
              const isSelf = currentUser?.id === item.id;
              const isTargetFollowing = !!followingStates[item.id];

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-900/60 border border-transparent hover:border-neutral-800/80 transition-all"
                >
                  <Link
                    href={isSelf ? "/profile" : `/profile/${item.username}`}
                    onClick={onClose}
                    className="flex items-center gap-3 min-w-0 flex-1 mr-3 group"
                  >
                    <Avatar
                      src={item.avatarUrl}
                      name={item.displayName}
                      size="sm"
                      isCreator={item.isCreator}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                          {item.displayName}
                        </span>
                        {item.verified && (
                          <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                        )}
                        {item.isCreator && (
                          <Badge variant="primary" size="sm" className="text-[9px] px-1 py-0">
                            <Sparkles className="w-2.5 h-2.5 mr-0.5 text-violet-400" />
                            PRO
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 truncate">@{item.username}</p>
                    </div>
                  </Link>

                  {!isSelf && (
                    <Button
                      variant={isTargetFollowing ? "secondary" : "gradient"}
                      size="sm"
                      onClick={() => handleToggleFollow(item)}
                      className="text-xs py-1 px-3 h-7 shrink-0"
                      leftIcon={
                        isTargetFollowing ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <UserPlus className="w-3 h-3" />
                        )
                      }
                    >
                      {isTargetFollowing ? "Following" : "Follow"}
                    </Button>
                  )}
                  {isSelf && (
                    <span className="text-[11px] font-semibold text-neutral-500 px-2 py-0.5 rounded-lg bg-neutral-900 border border-neutral-800">
                      You
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
}
