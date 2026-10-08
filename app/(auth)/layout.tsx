import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-neutral-950 text-neutral-100 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-violet-600/20 via-fuchsia-600/10 to-transparent blur-[120px] -z-10 pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-cyan-600/10 blur-[100px] -z-10 pointer-events-none rounded-full" />

      {/* Top minimal header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-cyan-500 flex items-center justify-center">
            <span className="text-white font-black text-sm">V</span>
          </div>
          <span className="font-black text-lg text-white tracking-tight">VYBE</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Auth page content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        {children}
      </main>

      {/* Minimal footer */}
      <footer className="py-4 text-center text-xs text-neutral-500 border-t border-neutral-900">
        <p>&copy; {new Date().getFullYear()} VYBE. Find your people. Share your world.</p>
      </footer>
    </div>
  );
}
