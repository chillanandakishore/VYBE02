"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("VYBE runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 shadow-lg shadow-rose-500/10">
        <AlertCircle className="w-7 h-7" />
      </div>

      <h1 className="text-2xl font-black text-white tracking-tight mb-2">
        Something unexpected occurred
      </h1>
      <p className="text-xs text-neutral-400 max-w-md mb-6 leading-relaxed">
        We encountered a temporary hiccup loading this screen. Your account data is safe.
      </p>

      <div className="flex items-center gap-3">
        <Button
          variant="gradient"
          size="sm"
          onClick={() => reset()}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Try Again
        </Button>
        <Link href="/feed">
          <Button variant="outline" size="sm" leftIcon={<Home className="w-3.5 h-3.5" />}>
            Return to Feed
          </Button>
        </Link>
      </div>
    </div>
  );
}
