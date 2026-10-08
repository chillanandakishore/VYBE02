import { NotificationItem, NotificationType } from "@/types";

const notificationsStore: Map<string, NotificationItem> = new Map();

// Seed initial realistic notifications
const initialNotifications: NotificationItem[] = [
  {
    id: "notif_1",
    recipientId: "usr_creator_01",
    sender: {
      id: "usr_coder_02",
      username: "maya_dev",
      displayName: "Maya Patel",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      isCreator: true,
    },
    type: "COMMENT",
    title: "New Comment",
    body: "commented: \"The highlight rolloff in that second frame is buttery smooth...\"",
    targetUrl: "/feed",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: "notif_2",
    recipientId: "usr_creator_01",
    sender: {
      id: "usr_photog_03",
      username: "kenji_shoots",
      displayName: "Kenji Sato",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      isCreator: true,
    },
    type: "FOLLOW",
    title: "New Follower",
    body: "started following your visual creations and stories.",
    targetUrl: "/profile/kenji_shoots",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "notif_3",
    recipientId: "usr_creator_01",
    sender: {
      id: "usr_coder_02",
      username: "maya_dev",
      displayName: "Maya Patel",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      isCreator: true,
    },
    type: "LIKE",
    title: "Post Liked",
    body: "liked your post \"Shinjuku Anamorphic Night Grading test...\"",
    targetUrl: "/feed",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: "notif_4",
    recipientId: "usr_creator_01",
    sender: {
      id: "usr_system",
      username: "vybe_official",
      displayName: "VYBE Challenges",
      avatarUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
      isCreator: true,
    },
    type: "CHALLENGE",
    title: "Challenge Live",
    body: "\"30-Day Night Photography Challenge\" is now open for submissions with 1,200+ creators.",
    targetUrl: "/challenges",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
  },
  {
    id: "notif_5",
    recipientId: "usr_coder_02",
    sender: {
      id: "usr_creator_01",
      username: "alex_rivers",
      displayName: "Alex Rivers 🎬",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      isCreator: true,
    },
    type: "FOLLOW",
    title: "New Follower",
    body: "started following your projects and code walkthroughs.",
    targetUrl: "/profile/alex_rivers",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
];

initialNotifications.forEach((n) => notificationsStore.set(n.id, n));

export const dbNotifications = {
  getNotifications: async (userId: string): Promise<{ notifications: NotificationItem[]; unreadCount: number }> => {
    // Return notifications for this user, plus broadcast system notifications
    const userNotifs = Array.from(notificationsStore.values()).filter(
      (n) => n.recipientId === userId || n.recipientId === "all"
    );

    userNotifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const unreadCount = userNotifs.filter((n) => !n.isRead).length;

    return { notifications: userNotifs, unreadCount };
  },

  markNotificationRead: async (userId: string, notificationId: string): Promise<boolean> => {
    const notif = notificationsStore.get(notificationId);
    if (!notif) return false;
    notif.isRead = true;
    notificationsStore.set(notificationId, notif);
    return true;
  },

  markAllNotificationsRead: async (userId: string): Promise<boolean> => {
    for (const [id, notif] of notificationsStore.entries()) {
      if (notif.recipientId === userId || notif.recipientId === "all") {
        notificationsStore.set(id, { ...notif, isRead: true });
      }
    }
    return true;
  },

  createNotification: async (
    recipientId: string,
    sender: NotificationItem["sender"],
    type: NotificationType,
    title: string,
    body: string,
    targetUrl?: string
  ): Promise<NotificationItem> => {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newNotif: NotificationItem = {
      id,
      recipientId,
      sender,
      type,
      title,
      body,
      targetUrl,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    notificationsStore.set(id, newNotif);
    return newNotif;
  },
};
