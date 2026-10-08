"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { prefersReducedMotion } from "./webgl-utils";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;      // Maximum rotation in degrees (default 6)
  hoverScale?: number;   // Target hover scale 1.02 - 1.05 (default 1.03)
  glareEffect?: boolean; // Dynamic light sheen
}

export function TiltCard({
  children,
  className = "",
  maxTilt = 6,
  hoverScale = 1.03,
  glareEffect = true,
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>("");
  const [glarePosition, setGlarePosition] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchOrReduced, setIsTouchOrReduced] = useState(false);

  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const reduced = prefersReducedMotion();
    setIsTouchOrReduced(isTouch || reduced);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isTouchOrReduced || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const normX = (x / rect.width) * 2 - 1; // -1 to +1
      const normY = (y / rect.height) * 2 - 1; // -1 to +1

      const rotX = -normY * maxTilt;
      const rotY = normX * maxTilt;

      setTransform(
        `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(${hoverScale}, ${hoverScale}, 1.02)`
      );

      if (glareEffect) {
        setGlarePosition({
          x: (x / rect.width) * 100,
          y: (y / rect.height) * 100,
          opacity: 0.25,
        });
      }
    },
    [isTouchOrReduced, maxTilt, hoverScale, glareEffect]
  );

  const handleMouseEnter = useCallback(() => {
    if (isTouchOrReduced) return;
    setIsHovered(true);
  }, [isTouchOrReduced]);

  const handleMouseLeave = useCallback(() => {
    if (isTouchOrReduced) return;
    setIsHovered(false);
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  }, [isTouchOrReduced]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transform || undefined,
        transformStyle: "preserve-3d",
        transition: isHovered
          ? "transform 0.08s ease-out"
          : "transform 0.45s cubic-bezier(0.23, 1, 0.32, 1)",
      }}
      className={`relative will-change-transform ${className}`}
      {...props}
    >
      {children}

      {/* Dynamic Specular Glare/Sheen Overlay */}
      {glareEffect && !isTouchOrReduced && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden transition-opacity duration-300"
          style={{ opacity: glarePosition.opacity }}
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle 320px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.22), transparent 70%)`,
            }}
          />
        </div>
      )}
    </div>
  );
}
