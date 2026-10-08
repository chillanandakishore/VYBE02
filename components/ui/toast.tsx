"use client";

import { useToast, ToastType } from "@/hooks/use-toast";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  const iconMap: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
  };

  const borderMap: Record<ToastType, string> = {
    success: "border-emerald-500/30",
    error: "border-rose-500/30",
    warning: "border-amber-500/30",
    info: "border-cyan-500/30",
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl glass-panel shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${borderMap[t.type]}`}
        >
          {iconMap[t.type]}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white">{t.title}</h4>
            {t.message && (
              <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">{t.message}</p>
            )}
          </div>
          <button
            onClick={() => dismiss(t.id)}
            className="text-neutral-400 hover:text-white transition-colors p-0.5"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
