import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-neutral-950 text-neutral-100">
      <div className="w-16 h-16 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-violet-400 mb-4 shadow-xl">
        <span className="text-2xl font-black font-mono">404</span>
      </div>

      <h1 className="text-3xl font-black text-white tracking-tight mb-2">
        Lost in the VYBE universe
      </h1>
      <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mb-6 leading-relaxed">
        This link or creator profile might have moved or is taking a break.
      </p>

      <div className="flex items-center gap-3">
        <Link href="/feed">
          <Button variant="gradient" size="sm" leftIcon={<Home className="w-3.5 h-3.5" />}>
            Back to Feed
          </Button>
        </Link>
        <Link href="/explore">
          <Button variant="outline" size="sm" leftIcon={<Compass className="w-3.5 h-3.5" />}>
            Explore VYBES
          </Button>
        </Link>
      </div>
    </div>
  );
}
