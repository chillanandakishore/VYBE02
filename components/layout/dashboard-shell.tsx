"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { MobileNav } from "./mobile-nav";
import { Loader2 } from "lucide-react";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname || "/feed")}`);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  // Loading state while verifying session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center gap-3 text-neutral-400">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-cyan-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-violet-600/30 animate-pulse">
          V
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" />
          <span>Connecting to VYBE Social...</span>
        </div>
      </div>
    );
  }

  // Not authenticated redirecting state
  if (!isAuthenticated && !user) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center gap-3 text-neutral-400">
        <p className="text-xs font-mono text-neutral-500">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-neutral-950 text-neutral-100 antialiased">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
