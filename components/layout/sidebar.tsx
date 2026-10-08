"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Avatar } from "@/components/ui/avatar";
import {
  Home,
  Compass,
  Flame,
  Film,
  MessageSquare,
  Bell,
  Trophy,
  Calendar,
  Sparkles,
  User as UserIcon,
  LogOut,
  ChevronRight,
  BarChart3,
  ShoppingBag,
  ShieldAlert,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLink {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
  highlight?: boolean;
}

const NAV_LINKS: NavLink[] = [
  { title: "Home Feed", href: "/feed", icon: Home },
  { title: "Explore", href: "/explore", icon: Compass },
  { title: "VYBES", href: "/vybes", icon: Flame, badge: "15+" },
  { title: "Reels", href: "/reels", icon: Film },
  { title: "Messages", href: "/messages", icon: MessageSquare, badge: 3 },
  { title: "Notifications", href: "/notifications", icon: Bell, badge: 5 },
  { title: "Challenges", href: "/challenges", icon: Trophy, badge: "New" },
  { title: "Events", href: "/events", icon: Calendar },
  { title: "Creator Studio", href: "/studio", icon: Sparkles, highlight: true },
  { title: "Creator Mode", href: "/creator", icon: BarChart3 },
  { title: "Marketplace", href: "/marketplace", icon: ShoppingBag, badge: "Store" },
  { title: "Admin Portal", href: "/admin", icon: ShieldAlert },
  { title: "My Profile", href: "/profile", icon: UserIcon },
  { title: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-neutral-800/80 bg-neutral-950/80 backdrop-blur-2xl h-screen sticky top-0 shrink-0 z-30 select-none">
      {/* Brand logo */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-neutral-800/80">
        <Link href="/feed" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-cyan-500 flex items-center justify-center shadow-md shadow-violet-600/30 group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-sm tracking-widest">V</span>
          </div>
          <span className="font-black text-lg tracking-tight text-white">
            VYBE <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Social</span>
          </span>
        </Link>
        <span className="text-[10px] font-semibold tracking-wider text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/30">
          PRO
        </span>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
          Discover & Create
        </div>

        {NAV_LINKS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/feed" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200",
                isActive
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20 font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900/80",
                item.highlight && !isActive && "text-violet-300 bg-violet-950/20 border border-violet-800/30"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-white" : "text-neutral-400 group-hover:text-white",
                    item.highlight && !isActive && "text-violet-400"
                  )}
                />
                <span>{item.title}</span>
              </div>

              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold",
                    isActive
                      ? "bg-white/20 text-white"
                      : typeof item.badge === "number"
                      ? "bg-rose-500 text-white"
                      : "bg-neutral-800 text-neutral-300"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom user profile card & signout */}
      <div className="p-3 border-t border-neutral-800/80 bg-neutral-950/90">
        {user ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-900/70 border border-neutral-800/80">
            <Link href="/profile" className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-85 transition-opacity">
              <Avatar
                src={user.avatarUrl}
                name={user.displayName}
                size="sm"
                isOnline
                isCreator={user.isCreator}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {user.displayName}
                </p>
                <p className="text-[11px] text-neutral-400 truncate">@{user.username}</p>
              </div>
            </Link>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors ml-1"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-300 hover:text-white"
          >
            <span>Sign In to Your Account</span>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </Link>
        )}
      </div>
    </aside>
  );
}
