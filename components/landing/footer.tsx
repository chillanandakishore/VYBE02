import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-800/80 bg-neutral-950 py-12 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand info */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-cyan-500 flex items-center justify-center text-white font-black text-sm">
                V
              </div>
              <span className="font-black text-lg text-white tracking-tight">
                VYBE <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Social</span>
              </span>
            </Link>
            <p className="text-neutral-400 max-w-sm leading-relaxed mb-4">
              &ldquo;Connect. Create. Share.&rdquo; The modern social platform built for
              creators, students, developers, and passionate communities.
            </p>
            <p className="text-[11px] text-neutral-500 font-mono">
              Designed with dark-first aesthetics & modular service architecture.
            </p>
          </div>

          {/* Column 1: Ecosystem */}
          <div>
            <h5 className="font-bold text-white mb-3 text-sm">Ecosystem</h5>
            <ul className="space-y-2">
              <li>
                <Link href="/feed" className="hover:text-white transition-colors">
                  Community Feed
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-white transition-colors">
                  Explore Hub
                </Link>
              </li>
              <li>
                <Link href="/vybes" className="hover:text-white transition-colors">
                  Active VYBES
                </Link>
              </li>
              <li>
                <Link href="/reels" className="hover:text-white transition-colors">
                  Vertical Reels
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Creator Tools */}
          <div>
            <h5 className="font-bold text-white mb-3 text-sm">Creator Tools</h5>
            <ul className="space-y-2">
              <li>
                <Link href="/studio" className="hover:text-white transition-colors">
                  AI Creator Studio
                </Link>
              </li>
              <li>
                <Link href="/challenges" className="hover:text-white transition-colors">
                  30-Day Challenges
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white transition-colors">
                  Creator Events
                </Link>
              </li>
              <li>
                <span className="text-neutral-500">Marketplace (Phase 10)</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & Docs */}
          <div>
            <h5 className="font-bold text-white mb-3 text-sm">Platform</h5>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Creator Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <span className="text-neutral-500">Privacy & Terms</span>
              </li>
              <li>
                <span className="text-neutral-500">Security & Auditing</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} VYBE Social Platform Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Built with Next.js 16, TypeScript & Tailwind CSS</span>
            <span>•</span>
            <span className="text-violet-400 font-mono">Phase 1 Complete</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
