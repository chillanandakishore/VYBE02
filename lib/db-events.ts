import { EventItem } from "@/types";

const eventsStore: Map<string, EventItem> = new Map();
const eventAttendeesStore: Set<string> = new Set(); // userId:eventId

const initialEvents: EventItem[] = [];

initialEvents.forEach((e) => eventsStore.set(e.id, e));

export const dbEvents = {
  getEvents: async (currentUserId?: string): Promise<EventItem[]> => {
    const list = Array.from(eventsStore.values());
    return list.map((evt) => ({
      ...evt,
      isAttending: currentUserId ? eventAttendeesStore.has(`${currentUserId}:${evt.id}`) : false,
    }));
  },

  toggleRsvpEvent: async (userId: string, eventId: string): Promise<{ isAttending: boolean; attendeesCount: number }> => {
    const evt = eventsStore.get(eventId);
    if (!evt) throw new Error("Event not found");

    const key = `${userId}:${eventId}`;
    const alreadyAttending = eventAttendeesStore.has(key);

    if (alreadyAttending) {
      eventAttendeesStore.delete(key);
      evt.attendeesCount = Math.max(0, evt.attendeesCount - 1);
    } else {
      eventAttendeesStore.add(key);
      evt.attendeesCount += 1;
    }

    eventsStore.set(eventId, evt);
    return { isAttending: !alreadyAttending, attendeesCount: evt.attendeesCount };
  },

  createEvent: async (
    host: EventItem["host"],
    title: string,
    description: string,
    category: string,
    coverImage: string,
    date: string,
    time: string,
    location: string,
    isVirtual: boolean,
    meetingUrl?: string
  ): Promise<EventItem> => {
    const id = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newEvent: EventItem = {
      id,
      title,
      description,
      category,
      coverImage: coverImage || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80",
      host,
      date,
      time,
      location,
      isVirtual,
      meetingUrl,
      attendeesCount: 1,
      isAttending: true,
      price: "Free",
    };

    eventAttendeesStore.add(`${host.id}:${id}`);
    eventsStore.set(id, newEvent);
    return newEvent;
  },
};
