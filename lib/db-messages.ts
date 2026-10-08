import { ConversationItem, ChatMessage } from "@/types";

const conversationsStore: Map<string, ConversationItem> = new Map();

const initialConversations: ConversationItem[] = [
  {
    id: "conv_alex_maya",
    participant: {
      id: "usr_creator_01",
      username: "alex_rivers",
      displayName: "Alex Rivers 🎬",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      isOnline: true,
      isCreator: true,
    },
    lastMessage: "Awesome, testing it on the nighttime Shinjuku footage right now.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    unreadCount: 1,
    messages: [
      {
        id: "msg_1",
        conversationId: "conv_alex_maya",
        senderId: "usr_creator_01",
        text: "Hey! Saw your test post on the new color grade. Did you export the LUT as .cube or .drx?",
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      },
      {
        id: "msg_2",
        conversationId: "conv_alex_maya",
        senderId: "usr_coder_02",
        text: "Exported both! Uploading the .cube file to the video editing resources tab shortly.",
        createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      },
      {
        id: "msg_3",
        conversationId: "conv_alex_maya",
        senderId: "usr_creator_01",
        text: "Awesome, testing it on the nighttime Shinjuku footage right now.",
        createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      },
    ],
  },
  {
    id: "conv_maya_kenji",
    participant: {
      id: "usr_photog_03",
      username: "kenji_shoots",
      displayName: "Kenji Sato",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      isOnline: false,
      isCreator: true,
    },
    lastMessage: "Let's meet up at Shinjuku East Gate around 7:45 PM.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    unreadCount: 0,
    messages: [
      {
        id: "msg_4",
        conversationId: "conv_maya_kenji",
        senderId: "usr_photog_03",
        text: "Hey, are you bringing the Leica M11 or the Sony for Friday's photowalk?",
        createdAt: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
      },
      {
        id: "msg_5",
        conversationId: "conv_maya_kenji",
        senderId: "usr_coder_02",
        text: "Bringing the Leica with the 35mm Summicron! Perfect for wet pavement reflections.",
        createdAt: new Date(Date.now() - 1000 * 60 * 160).toISOString(),
      },
      {
        id: "msg_6",
        conversationId: "conv_maya_kenji",
        senderId: "usr_photog_03",
        text: "Let's meet up at Shinjuku East Gate around 7:45 PM.",
        createdAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
      },
    ],
  },
  {
    id: "conv_elena",
    participant: {
      id: "usr_audio_04",
      username: "elena_sound",
      displayName: "Elena Rostova 🎵",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      isOnline: true,
      isCreator: true,
    },
    lastMessage: "Sent you the WAV stems for the reel audio!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    unreadCount: 0,
    messages: [
      {
        id: "msg_7",
        conversationId: "conv_elena",
        senderId: "usr_audio_04",
        text: "Sent you the WAV stems for the reel audio!",
        createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      },
    ],
  },
];

initialConversations.forEach((c) => conversationsStore.set(c.id, c));

export const dbMessages = {
  getConversations: async (_currentUserId?: string): Promise<ConversationItem[]> => {
    const list = Array.from(conversationsStore.values());
    list.sort((a, b) => {
      const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
      const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
      return timeB - timeA;
    });
    return list;
  },

  getConversationById: async (convId: string): Promise<ConversationItem | null> => {
    return conversationsStore.get(convId) || null;
  },

  sendMessage: async (
    conversationId: string,
    senderId: string,
    text: string,
    mediaUrl?: string,
    mediaType?: "IMAGE" | "VOICE",
    voiceDurationSeconds?: number
  ): Promise<ChatMessage> => {
    let conv = conversationsStore.get(conversationId);
    if (!conv) {
      throw new Error("Conversation not found");
    }

    const msgId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newMsg: ChatMessage = {
      id: msgId,
      conversationId,
      senderId,
      text,
      mediaUrl,
      mediaType,
      voiceDurationSeconds,
      createdAt: new Date().toISOString(),
    };

    conv.messages.push(newMsg);
    conv.lastMessage = text || (mediaType === "IMAGE" ? "📷 Image attached" : "🎤 Voice note");
    conv.lastMessageTime = newMsg.createdAt;

    conversationsStore.set(conversationId, conv);
    return newMsg;
  },
};
