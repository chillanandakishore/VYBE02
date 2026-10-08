import { EventItem } from "@/types";

const eventsStore: Map<string, EventItem> = new Map();
const eventAttendeesStore: Set<string> = new Set(); // userId:eventId

const initialEvents: EventItem[] = [
  {
    id: "evt_1",
    title: "Live Masterclass: DaVinci Resolve 19 Color Workflow",
    description: "Deep dive into ACES, Color Space Transforms, custom tone mapping, halation emulation, and matching Alexa 35 footage with pro colorist Alex Rivers.",
    category: "Video Editing",
    coverImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&auto=format&fit=crop&q=80",
    host: {
      id: "usr_creator_01",
      username: "alex_rivers",
      displayName: "Alex Rivers 🎬",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    date: "Saturday, Oct 18, 2026",
    time: "6:00 PM GMT",
    location: "Online Interactive Stream (Discord & YouTube Live)",
    isVirtual: true,
    meetingUrl: "https://vybe.social/live/color-masterclass",
    attendeesCount: 480,
    price: "Free for Community Members",
  },
  {
    id: "evt_2",
    title: "Tokyo Rainy Night Photowalk & Meetup",
    description: "Meet outside Shinjuku Station East Exit for a 3-hour night photowalk capturing neon reflections, umbrellas, and cybernetic urban moods with Kenji Sato.",
    category: "Photography",
    coverImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80",
    host: {
      id: "usr_photog_03",
      username: "kenji_shoots",
      displayName: "Kenji Sato",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    date: "Friday, Oct 24, 2026",
    time: "8:00 PM JST",
    location: "Shinjuku Station (East Gate), Tokyo, Japan",
    isVirtual: false,
    attendeesCount: 92,
    price: "Free",
  },
  {
    id: "evt_3",
    title: "Autonomous Agents in Production Workshop",
    description: "Hands-on build session configuring multi-turn LLM reasoning, sandboxed tools execution, and live streaming UI in Next.js 16.",
    category: "Coding & AI",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
    host: {
      id: "usr_coder_02",
      username: "maya_dev",
      displayName: "Maya Patel",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    date: "Wednesday, Oct 28, 2026",
    time: "5:00 PM EST",
    location: "Virtual Code Sandbox",
    isVirtual: true,
    meetingUrl: "https://vybe.social/live/agents-workshop",
    attendeesCount: 640,
    price: "Free",
  },
];

initialEvents.forEach((e) => eventsStore.set(e.id, e));
// Pre-seed RSVP
eventAttendeesStore.add("usr_creator_01:evt_1");
eventAttendeesStore.add("usr_coder_02:evt_3");

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
