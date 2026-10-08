"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { Sparkles, Menu, X, ArrowRight } from "lucide-react";

export function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/75 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href={isAuthenticated && user ? "/feed" : "/"} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-cyan-500 flex items-center justify-center shadow-md shadow-violet-600/30 group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-lg tracking-wider">V</span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tight text-white flex items-center gap-1.5">
              <span>VYBE <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Social</span></span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-400 border border-violet-500/30">
                PRO
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
          <Link href="#features" className="hover:text-white transition-colors">
            Features
          </Link>
          <Link href="#vybes" className="hover:text-white transition-colors">
            VYBES
          </Link>
          <Link href="#creators" className="hover:text-white transition-colors">
            Creators
          </Link>
          <Link href="#ai" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            AI Studio
          </Link>
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated && user ? (
            <Link href="/feed">
              <Button variant="gradient" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Go to Feed
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="gradient" size="sm" rightIcon={<Sparkles className="w-3.5 h-3.5" />}>
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-2xl p-4 flex flex-col gap-3 animate-in slide-in-from-top-4 duration-200">
          <Link
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-lg text-sm text-neutral-300 hover:bg-neutral-900"
          >
            Features
          </Link>
          <Link
            href="#vybes"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-lg text-sm text-neutral-300 hover:bg-neutral-900"
          >
            VYBES
          </Link>
          <Link
            href="#creators"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-lg text-sm text-neutral-300 hover:bg-neutral-900"
          >
            Creators
          </Link>
          <div className="pt-2 border-t border-neutral-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link href="/feed" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="gradient" size="md" className="w-full">
                  Open Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" size="md" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="gradient" size="md" className="w-full">
                    Join VYBE
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
