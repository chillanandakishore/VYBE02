"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Image as ImageIcon,
  Smile,
  Phone,
  Video,
  Search,
  Mic,
  Check,
  CheckCheck,
  ArrowLeft,
  X,
  Play,
  Pause,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ConversationItem, ChatMessage } from "@/types";

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [callModal, setCallModal] = useState<{ open: boolean; type: "audio" | "video"; partnerName: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch conversations
  const loadConversations = async () => {
    try {
      const res = await fetch("/api/messages/conversations");
      const data = await res.json();
      if (res.ok && data.success && data.conversations) {
        setConversations(data.conversations);
        if (data.conversations.length > 0 && !selectedConvId) {
          setSelectedConvId(data.conversations[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // 2. Fetch messages when selected conversation changes
  useEffect(() => {
    if (!selectedConvId) return;

    async function loadMessages() {
      try {
        const res = await fetch(`/api/messages/${selectedConvId}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setMessages(data.messages || []);
          // Simulate partner typing briefly when opening chat
          setIsTyping(true);
          setTimeout(() => setIsTyping(false), 2000);
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    }

    loadMessages();
  }, [selectedConvId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const getPartner = (c?: ConversationItem) => {
    if (!c) return { id: "none", displayName: "Creator", username: "user", avatarUrl: "", isOnline: false };
    if (c.participants && Array.isArray(c.participants)) {
      const other = c.participants.find((p: any) => p.id !== user?.id);
      if (other) return other;
    }
    if (c.participant) return c.participant;
    return c.participants?.[0] || { id: "none", displayName: "Creator", username: "user", avatarUrl: "", isOnline: false };
  };

  const getLastMessageText = (c: ConversationItem) => {
    if (typeof c.lastMessage === "string") return c.lastMessage;
    return c.lastMessage?.content || "";
  };

  const getLastMessageTime = (c: ConversationItem) => {
    if (typeof c.lastMessage === "object" && c.lastMessage?.createdAt) {
      return c.lastMessage.createdAt;
    }
    return c.lastMessageTime || "";
  };

  const activeConv = conversations.find((c) => c.id === selectedConvId) || conversations[0];
  const partner = getPartner(activeConv);

  // Send text message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedConvId) return;

    const text = inputText.trim();
    setInputText("");
    setIsSending(true);

    try {
      const res = await fetch(`/api/messages/${selectedConvId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.chatMessage) {
        setMessages((prev) => [...prev, data.chatMessage]);
        // Update last message in conversation list
        setConversations((prev) =>
          prev.map((c) =>
            c.id === selectedConvId
              ? {
                  ...c,
                  lastMessage: text,
                  lastMessageTime: new Date().toISOString(),
                }
              : c
          )
        );
      }
    } catch (err) {
      console.error(err);
      toast({ type: "error", title: "Message failed to send" });
    } finally {
      setIsSending(false);
    }
  };

  // Send photo attachment
  const handleSendImage = async () => {
    if (!imageUrlInput.trim() || !selectedConvId) return;

    try {
      const res = await fetch(`/api/messages/${selectedConvId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: "Shared an image asset",
          mediaUrl: imageUrlInput.trim(),
          mediaType: "IMAGE",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.chatMessage) {
        setMessages((prev) => [...prev, data.chatMessage]);
        setShowImageModal(false);
        setImageUrlInput("");
        toast({ type: "success", title: "Image sent" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Send simulated voice note
  const handleSendVoiceNote = async () => {
    if (!selectedConvId) return;

    try {
      const res = await fetch(`/api/messages/${selectedConvId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: "Voice message (0:14)",
          mediaType: "VOICE",
          voiceDurationSeconds: 14,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.chatMessage) {
        setMessages((prev) => [...prev, data.chatMessage]);
        toast({ type: "success", title: "Voice note recorded and sent" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add emoji reaction
  const handleReact = (msgId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== msgId) return m;
        const reactions: Record<string, any> = { ...(m.reactions || {}) };
        const val = reactions[emoji];
        const currentCount = typeof val === "number" ? val : Array.isArray(val) ? val.length : 0;
        reactions[emoji] = currentCount + 1;
        return {
          ...m,
          reactions,
        };
      })
    );
  };

  const filteredConversations = conversations.filter((c) => {
    const other = getPartner(c);
    const lastMsg = getLastMessageText(c);
    return (
      (other?.displayName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (other?.username || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      lastMsg.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="h-[calc(100vh-125px)] flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Direct Messages
            <Badge variant="primary" size="sm">
              Realtime
            </Badge>
          </h1>
          <p className="text-xs text-neutral-400">
            Encrypted creator channels, high-fidelity media sharing, and collaborative audio.
          </p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 rounded-2xl border border-neutral-800 bg-neutral-900/40 overflow-hidden min-h-0">
        {/* Left Conversations Sidebar */}
        <div
          className={`md:col-span-4 border-r border-neutral-800 flex flex-col bg-neutral-950/60 ${
            selectedConvId ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Search box */}
          <div className="p-3 border-b border-neutral-800/80">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-800/40">
            {isLoading ? (
              <div className="p-6 text-center text-xs text-neutral-500">Loading chats...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-neutral-400">
                <p className="text-sm font-semibold text-white mb-1">No conversations yet.</p>
                <p className="text-xs text-neutral-400">Start a conversation with a creator.</p>
              </div>
            ) : (
              filteredConversations.map((c) => {
                const partnerUser = getPartner(c);
                const isSelected = selectedConvId === c.id;
                const timeStr = getLastMessageTime(c);
                const lastMsg = getLastMessageText(c);

                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedConvId(c.id)}
                    className={`w-full p-3.5 flex items-start gap-3 text-left transition-colors ${
                      isSelected ? "bg-violet-950/30 border-l-2 border-violet-500" : "hover:bg-neutral-800/30"
                    }`}
                  >
                    <Avatar
                      src={partnerUser?.avatarUrl}
                      name={partnerUser?.displayName || "User"}
                      size="md"
                      isOnline={partnerUser?.isOnline}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate">
                          {partnerUser?.displayName}
                        </span>
                        <span className="text-[10px] text-neutral-500">
                          {timeStr
                            ? new Date(timeStr).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "New"}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                        {lastMsg || "Started conversation"}
                      </p>
                    </div>
                    {c.unreadCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-violet-600 text-[10px] font-bold text-white flex items-center justify-center shrink-0">
                        {c.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Active Chat View */}
        <div
          className={`md:col-span-8 flex flex-col justify-between h-full bg-neutral-950/40 ${
            !selectedConvId ? "hidden md:flex" : "flex"
          }`}
        >
          {activeConv && partner ? (
            <>
              {/* Chat Header */}
              <div className="p-3.5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/50">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setSelectedConvId(null)}
                    className="md:hidden p-1.5 text-neutral-400 hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <Avatar
                    src={partner.avatarUrl}
                    name={partner.displayName}
                    size="sm"
                    isOnline={partner.isOnline}
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      {partner.displayName}
                      <span className="text-[10px] text-neutral-400 font-normal">
                        @{partner.username}
                      </span>
                    </h4>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active now
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setCallModal({
                        open: true,
                        type: "audio",
                        partnerName: partner.displayName,
                      })
                    }
                    className="text-neutral-300 hover:text-white"
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setCallModal({
                        open: true,
                        type: "video",
                        partnerName: partner.displayName,
                      })
                    }
                    className="text-neutral-300 hover:text-white"
                  >
                    <Video className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Message History Stream */}
              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 min-h-0">
                <div className="text-center my-2">
                  <span className="text-[10px] font-medium text-neutral-500 bg-neutral-900/80 px-3 py-1 rounded-full border border-neutral-800">
                    End-to-end encrypted creator channel
                  </span>
                </div>

                {messages.map((m) => {
                  const isMe = m.senderId === user?.id || m.senderId === "me" || m.senderId === "usr_creator_01";

                  return (
                    <div
                      key={m.id}
                      className={`group flex flex-col max-w-[80%] ${
                        isMe ? "self-end items-end" : "self-start items-start"
                      }`}
                    >
                      {/* Image Message */}
                      {m.mediaType === "IMAGE" && m.mediaUrl && (
                        <div className="mb-1 rounded-2xl overflow-hidden border border-neutral-800 max-w-xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={m.mediaUrl}
                            alt="Attached asset"
                            className="w-full h-auto object-cover max-h-60"
                          />
                        </div>
                      )}

                      {/* Voice Note Message */}
                      {m.mediaType === "VOICE" && (
                        <div
                          className={`p-3 rounded-2xl flex items-center gap-3 w-64 ${
                            isMe ? "bg-violet-600 text-white" : "bg-neutral-800 text-neutral-200"
                          }`}
                        >
                          <button
                            onClick={() =>
                              setPlayingVoiceId(playingVoiceId === m.id ? null : m.id)
                            }
                            className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center shrink-0 hover:bg-black/30"
                          >
                            {playingVoiceId === m.id ? (
                              <Pause className="w-4 h-4 fill-white" />
                            ) : (
                              <Play className="w-4 h-4 fill-white ml-0.5" />
                            )}
                          </button>
                          <div className="flex-1">
                            {/* Audio Waveform visualization */}
                            <div className="flex items-center gap-0.5 h-6">
                              {[6, 12, 18, 14, 8, 20, 16, 10, 14, 22, 12, 8, 16, 10, 6].map(
                                (h, i) => (
                                  <div
                                    key={i}
                                    style={{ height: `${h}px` }}
                                    className={`w-1 rounded-full ${
                                      playingVoiceId === m.id
                                        ? "bg-white animate-pulse"
                                        : "bg-white/40"
                                    }`}
                                  />
                                )
                              )}
                            </div>
                            <span className="text-[10px] opacity-80">
                              0:{m.voiceDurationSeconds || 14}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Text Bubble */}
                      {(m.content || m.text) && m.mediaType !== "VOICE" && (
                        <div
                          className={`p-3 rounded-2xl text-xs leading-relaxed relative ${
                            isMe
                              ? "bg-violet-600 text-white rounded-br-xs"
                              : "bg-neutral-800 text-neutral-200 rounded-bl-xs"
                          }`}
                        >
                          {m.content || m.text}
                        </div>
                      )}

                      {/* Reactions bar */}
                      <div className="flex items-center gap-1 mt-1">
                        {m.reactions &&
                          Object.entries(m.reactions).map(([emoji, count]) => (
                            <span
                              key={emoji}
                              className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300"
                            >
                              {emoji} {Array.isArray(count) ? count.length : count}
                            </span>
                          ))}

                        {/* Reaction trigger */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 ml-1">
                          {["❤️", "🔥", "🚀", "👏"].map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => handleReact(m.id, emoji)}
                              className="text-xs hover:scale-125 transition-transform"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>

                        {/* Timestamp & read receipts */}
                        <span className="text-[10px] text-neutral-500 ml-1.5 flex items-center gap-1">
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {isMe && <CheckCheck className="w-3 h-3 text-cyan-400" />}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Partner typing indicator */}
                {isTyping && (
                  <div className="self-start flex items-center gap-1.5 p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.4s]" />
                    <span className="ml-1 text-[10px]">{partner.displayName} is typing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Form */}
              <div className="p-3 border-t border-neutral-800 bg-neutral-900/60 relative">
                {/* Emoji quick bar */}
                {showEmojiPicker && (
                  <div className="absolute bottom-16 left-4 bg-neutral-900 border border-neutral-800 rounded-xl p-2 shadow-2xl flex gap-2 z-20">
                    {["🔥", "❤️", "🚀", "👏", "✨", "🎬", "⚡", "🙌", "😂"].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setInputText((prev) => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="text-lg hover:scale-125 transition-transform p-1"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowImageModal(true)}
                    className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                    title="Send image asset"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleSendVoiceNote}
                    className="p-2 text-neutral-400 hover:text-violet-400 hover:bg-neutral-800 rounded-lg transition-colors"
                    title="Send 14s voice note"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 rounded-lg transition-colors"
                  >
                    <Smile className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Message ${partner.displayName}...`}
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-violet-500"
                  />

                  <Button
                    type="submit"
                    variant="gradient"
                    size="sm"
                    disabled={!inputText.trim() || isSending}
                    rightIcon={<Send className="w-3.5 h-3.5" />}
                  >
                    Send
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-neutral-400">
              <MessageSquare className="w-10 h-10 text-neutral-600 mb-2 opacity-50" />
              <p className="text-sm font-semibold text-white mb-1">No conversations yet.</p>
              <p className="text-xs text-neutral-400">Start a conversation with a creator.</p>
            </div>
          )}
        </div>
      </div>

      {/* Image Attachment Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <Card className="w-full max-w-md p-6 bg-neutral-900 border-neutral-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-violet-400" /> Share Creative Asset
              </h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Image URL</label>
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-600 outline-none focus:border-violet-500"
                />
              </div>

              {/* Sample assets */}
              <div>
                <span className="text-[11px] text-neutral-500 block mb-2 font-semibold">
                  Or pick a preset asset:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&q=80",
                    "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80",
                    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
                  ].map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImageUrlInput(url)}
                      className="aspect-video rounded-lg overflow-hidden border border-neutral-800 hover:border-violet-500 transition-colors"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="Preset sample" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setShowImageModal(false)}>
                Cancel
              </Button>
              <Button
                variant="gradient"
                size="sm"
                onClick={handleSendImage}
                disabled={!imageUrlInput.trim()}
              >
                Send Image
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* WebRTC Audio/Video Call Simulation Modal */}
      {callModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <Card className="w-full max-w-sm p-6 bg-neutral-900 border-neutral-800 text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-violet-600/20 border-2 border-violet-500 flex items-center justify-center animate-pulse">
              {callModal.type === "video" ? (
                <Video className="w-8 h-8 text-violet-400" />
              ) : (
                <Phone className="w-8 h-8 text-violet-400" />
              )}
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{callModal.partnerName}</h3>
              <p className="text-xs text-neutral-400 mt-1">
                {callModal.type === "video" ? "VYBE HD Video Call" : "VYBE Studio Audio Call"}
              </p>
              <span className="text-[11px] text-emerald-400 font-semibold block mt-1">
                Connecting WebRTC peer...
              </span>
            </div>

            <div className="flex justify-center gap-3 pt-3">
              <Button
                variant="outline"
                size="sm"
                className="bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500 hover:text-white"
                onClick={() => setCallModal(null)}
              >
                End Call
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
