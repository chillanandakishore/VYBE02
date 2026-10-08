"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  isOnline?: boolean;
  isCreator?: boolean;
}

export function Avatar({
  src,
  alt = "User avatar",
  name,
  size = "md",
  isOnline,
  isCreator,
  className,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const sizeStyles = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
    xl: "w-20 h-20 text-xl font-bold",
  };

  const getInitials = (n?: string) => {
    if (!n) return "V";
    const parts = n.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.substring(0, 2).toUpperCase();
  };

  return (
    <div className={cn("relative inline-block shrink-0 select-none", className)} {...props}>
      <div
        className={cn(
          "rounded-full overflow-hidden flex items-center justify-center font-semibold bg-gradient-to-tr from-violet-600/30 to-cyan-500/20 border border-neutral-700 text-white shadow-inner",
          sizeStyles[size],
          isCreator && "ring-2 ring-violet-500 ring-offset-2 ring-offset-neutral-950"
        )}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitials(name || alt)}</span>
        )}
      </div>

      {isOnline && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full bg-emerald-500 ring-2 ring-neutral-950",
            size === "xs" && "w-1.5 h-1.5",
            size === "sm" && "w-2 h-2",
            size === "md" && "w-2.5 h-2.5",
            (size === "lg" || size === "xl") && "w-3.5 h-3.5"
          )}
        />
      )}
    </div>
  );
}
