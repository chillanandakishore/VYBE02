import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "accent" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-neutral-800 text-neutral-300 border-neutral-700/60",
    primary: "bg-violet-500/10 text-violet-400 border-violet-500/30",
    secondary: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    accent: "bg-pink-500/10 text-pink-400 border-pink-500/30",
    outline: "bg-transparent text-neutral-400 border-neutral-700",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 rounded-md font-medium",
    md: "text-xs px-2.5 py-1 rounded-lg font-medium",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 border shrink-0 transition-colors",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
