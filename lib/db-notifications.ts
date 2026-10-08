import { NotificationItem, NotificationType } from "@/types";

const notificationsStore: Map<string, NotificationItem> = new Map();

// Initial notifications (starts completely empty for fresh deployment)
const initialNotifications: NotificationItem[] = [];

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
