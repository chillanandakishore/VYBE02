import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-14 overflow-hidden border border-violet-500/30 bg-gradient-to-tr from-violet-950/70 via-neutral-900/90 to-cyan-950/60 shadow-2xl backdrop-blur-2xl text-center">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-violet-600/30 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/40 text-violet-300 text-xs font-semibold mb-5">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Free Early Access Active</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
              Your World Is Waiting. <br />
              <span className="text-vybe-gradient">Find Your VYBE Today.</span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 mb-8 leading-relaxed">
              Step into an intentional creative network. Build authentic relationships, explore
              passions without algorithmic fatigue, and share your journey.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button
                  variant="gradient"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto font-bold px-8 shadow-xl shadow-violet-600/30"
                >
                  Create Your Account
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Sign In With Existing Handle
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
