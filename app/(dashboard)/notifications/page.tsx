"use client";

import React, { useState, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  Trophy,
  CheckCheck,
  Calendar,
  Sparkles,
  Loader2,
  Check,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { NotificationItem } from "@/types";
import { formatTimeAgo } from "@/lib/utils";
import Link from "next/link";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [notifs, setNotifs] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (res.ok && data.success) {
        setNotifs(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    toast({
      type: "success",
      title: "All Caught Up!",
      message: "Marked all notifications as read.",
    });

    try {
      await fetch("/api/notifications/read-all", { method: "POST" });
    } catch {
      fetchNotifications();
    }
  };

  const handleMarkSingleRead = async (id: string) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await fetch(`/api/notifications/${id}/read`, { method: "POST" });
    } catch {
      // Ignore
    }
  };

  const handleToggleFollow = async (userId: string, username: string) => {
    const nextStatus = !followingStates[userId];
    setFollowingStates((prev) => ({ ...prev, [userId]: nextStatus }));

    toast({
      type: "success",
      title: nextStatus ? `Following @${username}` : `Unfollowed @${username}`,
    });

    try {
      await fetch(`/api/users/${userId}/follow`, { method: "POST" });
    } catch {
      setFollowingStates((prev) => ({ ...prev, [userId]: !nextStatus }));
    }
  };

  // Filter based on active tab
  const filteredNotifs = notifs.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !n.isRead;
    if (activeTab === "likes") return n.type === "LIKE";
    if (activeTab === "comments") return n.type === "COMMENT";
    if (activeTab === "follows") return n.type === "FOLLOW";
    if (activeTab === "challenges") return n.type === "CHALLENGE" || n.type === "EVENT";
    return true;
  });

  const getNotificationIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "LIKE":
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />;
      case "COMMENT":
        return <MessageCircle className="w-4 h-4 text-cyan-400" />;
      case "FOLLOW":
        return <UserPlus className="w-4 h-4 text-violet-400" />;
      case "CHALLENGE":
        return <Trophy className="w-4 h-4 text-amber-400" />;
      case "EVENT":
        return <Calendar className="w-4 h-4 text-emerald-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-violet-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-neutral-800/80">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-violet-400" /> Notifications
            {unreadCount > 0 && (
              <Badge variant="primary" size="sm">
                {unreadCount} new
              </Badge>
            )}
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Stay updated with your likes, comments, follows, challenge mentions, and events.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: "all", label: "All Activity", badge: notifs.length },
          { id: "unread", label: "Unread", badge: unreadCount },
          { id: "likes", label: "Likes" },
          { id: "comments", label: "Comments" },
          { id: "follows", label: "Followers" },
          { id: "challenges", label: "Challenges & Events" },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Notifications List */}
      <div className="flex flex-col gap-2.5">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-neutral-500 font-mono flex flex-col items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
            <span>Syncing notifications...</span>
          </div>
        ) : filteredNotifs.length === 0 ? (
          <Card className="p-12 text-center bg-neutral-900/40 border-neutral-800">
            <Bell className="w-10 h-10 text-neutral-600 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-semibold text-white mb-1">You&apos;re all caught up.</p>
            <p className="text-xs text-neutral-400">
              New interactions will show up here.
            </p>
          </Card>
        ) : (
          filteredNotifs.map((item) => (
            <Card
              key={item.id}
              onClick={() => handleMarkSingleRead(item.id)}
              className={`p-4 transition-all flex items-center justify-between gap-4 cursor-pointer ${
                item.isRead
                  ? "bg-neutral-900/40 border-neutral-800/80 hover:bg-neutral-900/70"
                  : "bg-neutral-900/80 border-violet-800/50 shadow-sm hover:border-violet-700"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                {/* Type Icon Badge */}
                <div className="w-9 h-9 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center shrink-0">
                  {getNotificationIcon(item.type)}
                </div>

                <Link
                  href={`/profile/${item.sender.username}`}
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0"
                >
                  <Avatar
                    src={item.sender.avatarUrl}
                    name={item.sender.displayName}
                    size="sm"
                    isCreator={item.sender.isCreator}
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <p className="text-xs text-neutral-200 leading-snug">
                    <Link
                      href={`/profile/${item.sender.username}`}
                      onClick={(e) => e.stopPropagation()}
                      className="font-bold text-white hover:text-violet-300 transition-colors mr-1"
                    >
                      {item.sender.displayName}
                    </Link>
                    <span>{item.body}</span>
                  </p>
                  <span className="text-[10px] text-neutral-500 font-mono mt-0.5 block">
                    {formatTimeAgo(item.createdAt)}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                {item.type === "FOLLOW" && (
                  <Button
                    variant={followingStates[item.sender.id] ? "secondary" : "gradient"}
                    size="sm"
                    onClick={() => handleToggleFollow(item.sender.id, item.sender.username)}
                    className="text-xs py-1 px-3 h-7"
                    leftIcon={
                      followingStates[item.sender.id] ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <UserPlus className="w-3 h-3" />
                      )
                    }
                  >
                    {followingStates[item.sender.id] ? "Following" : "Follow Back"}
                  </Button>
                )}

                {item.targetUrl && (
                  <Link href={item.targetUrl}>
                    <Button variant="outline" size="sm" className="text-xs py-1 px-2.5 h-7">
                      View
                    </Button>
                  </Link>
                )}

                {!item.isRead && (
                  <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
