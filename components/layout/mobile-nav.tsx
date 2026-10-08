"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Plus, Film, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  const links = [
    { title: "Home", href: "/feed", icon: Home },
    { title: "Explore", href: "/explore", icon: Compass },
    { title: "Create", href: "/studio", icon: Plus, isAction: true },
    { title: "Reels", href: "/reels", icon: Film },
    { title: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/90 backdrop-blur-2xl border-t border-neutral-800/80 px-4 py-2 flex items-center justify-around select-none">
      {links.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        if (item.isAction) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-center -mt-5"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-violet-600/40 active:scale-95 transition-transform border border-white/20">
                <Icon className="w-6 h-6" />
              </div>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors",
              isActive ? "text-violet-400 font-bold" : "text-neutral-400 hover:text-white"
            )}
          >
            <Icon className="w-5 h-5" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
