/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import {
  Calendar,
  MapPin,
  Users,
  Video,
  Clock,
  Plus,
  Check,
  CalendarPlus,
  ExternalLink,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { EventItem } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Host Event Modal state
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Workshop");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [isVirtual, setIsVirtual] = useState(true);
  const [meetingUrl, setMeetingUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (res.ok && data.success) {
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error("Failed to load events", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleToggleRSVP = async (eventId: string) => {
    if (!user) {
      toast({
        type: "warning",
        title: "Sign in required",
        message: "Please sign in to RSVP for events.",
      });
      return;
    }

    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          const nextAttending = !e.isAttending;
          return {
            ...e,
            isAttending: nextAttending,
            attendeesCount: nextAttending ? e.attendeesCount + 1 : Math.max(0, e.attendeesCount - 1),
          };
        }
        return e;
      })
    );

    try {
      const res = await fetch(`/api/events/${eventId}/rsvp`, { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        toast({
          type: "success",
          title: data.message,
        });
      }
    } catch {
      fetchEvents();
    }
  };

  const handleDownloadCalendar = (evt: EventItem) => {
    // Generate .ics calendar invite
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//VYBE Social//Events//EN
BEGIN:VEVENT
SUMMARY:${evt.title}
DESCRIPTION:${evt.description}
LOCATION:${evt.location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `${evt.title.replace(/[^a-zA-Z0-9]/g, "_")}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      type: "success",
      title: "Calendar Event Downloaded",
      message: "Import this file into Google Calendar or Apple Calendar.",
    });
  };

  const handleHostEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date.trim() || !location.trim()) return;

    setIsCreating(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          date,
          time: time || "6:00 PM",
          location: location.trim(),
          isVirtual,
          meetingUrl: meetingUrl.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast({
          type: "success",
          title: "Event Published!",
          message: "Community members can now register.",
        });
        setEvents((prev) => [data.event, ...prev]);
        setIsHostModalOpen(false);
        setTitle("");
        setDescription("");
      } else {
        toast({
          type: "error",
          title: "Failed to create event",
          message: data.message,
        });
      }
    } catch {
      toast({
        type: "error",
        title: "Network Error",
        message: "Failed to publish event.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const filteredEvents = events.filter((e) => {
    if (activeTab === "all") return true;
    if (activeTab === "virtual") return e.isVirtual;
    if (activeTab === "in-person") return !e.isVirtual;
    return true;
  });

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" size="sm">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Community Events
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Creator Meetups & Sessions
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Attend live interactive masterclasses, local street photowalks, hackathons, and creative
            reviews hosted by verified community leaders.
          </p>
        </div>

        <Button
          variant="gradient"
          size="sm"
          onClick={() => setIsHostModalOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Host an Event
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: "all", label: "All Events", badge: events.length },
          { id: "virtual", label: "Online Workshops", icon: <Video className="w-3.5 h-3.5" /> },
          { id: "in-person", label: "In-Person Meetups", icon: <MapPin className="w-3.5 h-3.5" /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Events Grid */}
      {isLoading ? (
        <div className="py-24 text-center text-xs text-neutral-500 font-mono flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
          <span>Loading community events...</span>
        </div>
      ) : filteredEvents.length === 0 ? (
        <Card className="p-12 text-center bg-neutral-900/40 border-neutral-800">
          <Calendar className="w-10 h-10 text-neutral-600 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-semibold text-white mb-1">No events in this category</p>
          <p className="text-xs text-neutral-400 mb-4">
            Be the first creator to organize an event in your city or host a virtual workshop!
          </p>
          <Button variant="gradient" size="sm" onClick={() => setIsHostModalOpen(true)}>
            Host Event
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <Card
              key={evt.id}
              className="group overflow-hidden bg-neutral-900/60 border-neutral-800/80 hover:border-cyan-500/50 transition-all flex flex-col justify-between shadow-lg"
            >
              <div>
                {/* Cover Image */}
                <div className="h-36 w-full relative overflow-hidden bg-neutral-950">
                  <img
                    src={evt.coverImage}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge variant={evt.isVirtual ? "secondary" : "primary"} size="sm">
                      {evt.isVirtual ? "ONLINE" : "IN-PERSON"}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-neutral-300">
                    <span className="font-mono text-cyan-300 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {evt.attendeesCount} RSVP&apos;d
                    </span>
                    <span className="font-medium">{evt.price || "Free"}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
                    {evt.category}
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {evt.title}
                  </h3>

                  <div className="space-y-1.5 mt-3 text-xs text-neutral-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span>{evt.date} • {evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {evt.isVirtual ? (
                        <Video className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                      <span className="truncate">{evt.location}</span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-300 mt-3 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 flex items-center gap-2">
                <Button
                  variant={evt.isAttending ? "secondary" : "gradient"}
                  size="sm"
                  onClick={() => handleToggleRSVP(evt.id)}
                  className="flex-1 text-xs"
                  leftIcon={evt.isAttending ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : undefined}
                >
                  {evt.isAttending ? "Going" : "RSVP"}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadCalendar(evt)}
                  className="text-xs px-2.5"
                  title="Add to Calendar (.ics)"
                >
                  <CalendarPlus className="w-3.5 h-3.5" />
                </Button>

                {evt.meetingUrl && evt.isAttending && (
                  <a
                    href={evt.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-cyan-500 transition-colors"
                    title="Open Live Stream"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* HOST EVENT MODAL */}
      <Modal
        isOpen={isHostModalOpen}
        onClose={() => setIsHostModalOpen(false)}
        title="Host a Community Event"
        description="Organize a virtual workshop, local meetup, or live creator stream."
        maxWidth="md"
      >
        <form onSubmit={handleHostEvent} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">
              Event Title
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. DaVinci Resolve 19 Live Color Science Workshop"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Event Format
              </label>
              <select
                value={isVirtual ? "true" : "false"}
                onChange={(e) => setIsVirtual(e.target.value === "true")}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
              >
                <option value="true">Online Virtual Session</option>
                <option value="false">In-Person Meetup</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Category
              </label>
              <Input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Photography, Coding, Film"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Date
              </label>
              <Input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. Saturday, Oct 24, 2026"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Time
              </label>
              <Input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 6:00 PM JST"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">
              Location or Virtual Platform
            </label>
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={isVirtual ? "e.g. Discord Stage / YouTube Live" : "e.g. Shinjuku Station East Exit, Tokyo"}
              required
            />
          </div>

          {isVirtual && (
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Meeting / Stream Link (Optional)
              </label>
              <Input
                type="url"
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will attendees learn or experience?"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsHostModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              size="sm"
              isLoading={isCreating}
            >
              Publish Event
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
