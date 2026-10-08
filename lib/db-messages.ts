import { ConversationItem, ChatMessage } from "@/types";

const conversationsStore: Map<string, ConversationItem> = new Map();

const initialConversations: ConversationItem[] = [];

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
