import React from "react";

export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-cyan-500 animate-pulse flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/30">
        V
      </div>
      <p className="text-xs text-neutral-400 font-mono tracking-wider animate-pulse">
        Loading VYBE...
      </p>
    </div>
  );
}
