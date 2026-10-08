"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { isWebGLAvailable, prefersReducedMotion, isMobileDevice, cleanUpScene } from "./webgl-utils";
import { create3DVybeLogo } from "./logo-3d";
import { createFloatingElements, FloatingElementItem } from "./floating-elements-3d";
import { createParticleEnvironment } from "./particle-system-3d";
import { FastForward } from "lucide-react";

interface HeroScene3DProps {
  onIntroComplete?: () => void;
  className?: string;
}

export function HeroScene3D({ onIntroComplete, className = "" }: HeroScene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isIntroActive, setIsIntroActive] = useState(true);
  const [introProgress, setIntroProgress] = useState(0);
  const [webglSupported, setWebglSupported] = useState(true);

  // References for animation state
  const isIntroActiveRef = useRef(true);
  const introStartTimeRef = useRef(0);
  const targetCamZ = useRef(8.5);
  const currentCamZ = useRef(20.0);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollYRef = useRef(0);
  const animFrameIdRef = useRef<number | null>(null);

  // Skip Intro handler
  const handleSkipIntro = useCallback(() => {
    isIntroActiveRef.current = false;
    setIsIntroActive(false);
    setIntroProgress(1);
    currentCamZ.current = targetCamZ.current;
    if (onIntroComplete) {
      onIntroComplete();
    }
  }, [onIntroComplete]);

  // Keyboard shortcut listener (Esc to skip intro)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isIntroActiveRef.current) {
        handleSkipIntro();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSkipIntro]);

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setWebglSupported(false);
      setIsIntroActive(false);
      if (onIntroComplete) onIntroComplete();
      return;
    }

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const reducedMotion = prefersReducedMotion();
    const isMobile = isMobileDevice();

    if (reducedMotion) {
      isIntroActiveRef.current = false;
      setIsIntroActive(false);
      setIntroProgress(1);
      currentCamZ.current = targetCamZ.current;
      if (onIntroComplete) onIntroComplete();
    }

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09090b, 0.025);

    // 2. Camera setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 750;
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 0, reducedMotion ? targetCamZ.current : 22.0);

    // 3. Renderer setup
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: !isMobile,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setWebglSupported(false);
      setIsIntroActive(false);
      if (onIntroComplete) onIntroComplete();
      return;
    }

    const dpr = isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // 4. Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xa855f7, 2.2); // violet key
    dirLight1.position.set(5, 8, 8);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 1.8); // cyan rim
    dirLight2.position.set(-6, -4, 6);
    scene.add(dirLight2);

    const backLight = new THREE.DirectionalLight(0xf43f5e, 1.2); // subtle pink fill
    backLight.position.set(0, -6, -5);
    scene.add(backLight);

    // 5. Logo centerpiece
    const logoGroup = create3DVybeLogo();
    if (isMobile) {
      logoGroup.scale.set(0.72, 0.72, 0.72);
      logoGroup.position.set(0, 0.6, 0);
    } else {
      logoGroup.scale.set(0.95, 0.95, 0.95);
      logoGroup.position.set(0, 0.4, 0);
    }
    scene.add(logoGroup);

    // 6. Floating social elements
    const { group: floatingGroup, items: floatingItems } = createFloatingElements(isMobile);
    scene.add(floatingGroup);

    // 7. Particle starfield
    const particleCount = isMobile ? 220 : 750;
    const { points: particlePoints, positions: particlePositions, initialPositions } =
      createParticleEnvironment(particleCount, reducedMotion);
    scene.add(particlePoints);

    // Mouse move parallax listener
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = normX * 0.8;
      mouseRef.current.targetY = normY * 0.5;
    };

    // Scroll listener for 3D depth shift
    const handleScroll = () => {
      scrollYRef.current = window.scrollY || window.pageYOffset;
    };

    // Resize listener
    const handleResize = () => {
      if (!container || !renderer) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || 750;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    // Intro timeline parameters
    const INTRO_DURATION_MS = 3200; // 3.2 seconds cinematic intro
    introStartTimeRef.current = performance.now();

    let clock = new THREE.Clock();
    let isVisible = true;

    // Pause rendering when canvas is off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Animation frame loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      if (!isVisible || document.hidden) return;

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // 1. Cinematic Intro Sequence
      if (isIntroActiveRef.current && !reducedMotion) {
        const now = performance.now();
        const introElapsed = now - introStartTimeRef.current;
        const progress = Math.min(introElapsed / INTRO_DURATION_MS, 1.0);
        setIntroProgress(progress);

        // Smooth cubic ease-out for camera dolly
        const easeOut = 1 - Math.pow(1 - progress, 3);
        currentCamZ.current = 22.0 - easeOut * (22.0 - targetCamZ.current);
        camera.position.z = currentCamZ.current;

        // Logo entrance rotation: spins 180 degrees then settles
        const logoSpin = (1 - easeOut) * Math.PI;
        logoGroup.rotation.y = logoSpin;
        logoGroup.rotation.x = (1 - easeOut) * 0.3;

        // Intro fade in for floating elements
        floatingGroup.position.z = -10 + easeOut * 10;
        floatingGroup.scale.setScalar(0.2 + easeOut * 0.8);

        if (progress >= 1.0) {
          isIntroActiveRef.current = false;
          setIsIntroActive(false);
          if (onIntroComplete) onIntroComplete();
        }
      } else {
        // Settled camera state with scroll depth
        const scrollOffset = scrollYRef.current * 0.006;
        currentCamZ.current = targetCamZ.current + scrollOffset;
        camera.position.z = currentCamZ.current;
        camera.position.y = -scrollYRef.current * 0.003;
      }

      // 2. Mouse Parallax (smooth interpolation)
      if (!isMobile && !reducedMotion) {
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
        camera.position.x = mouseRef.current.x * 1.2;
        camera.lookAt(0, 0, 0);

        logoGroup.rotation.y = mouseRef.current.x * 0.4 + Math.sin(elapsed * 0.5) * 0.12;
        logoGroup.rotation.x = -mouseRef.current.y * 0.3 + Math.cos(elapsed * 0.4) * 0.08;
      } else if (!reducedMotion) {
        // Gentle automated float for mobile
        logoGroup.rotation.y = Math.sin(elapsed * 0.6) * 0.15;
        logoGroup.rotation.x = Math.cos(elapsed * 0.4) * 0.08;
      }

      // 3. 3D Logo Sub-components (Core gem pulse & rings rotation)
      const core = logoGroup.getObjectByName("LogoCore");
      if (core) {
        core.rotation.y += delta * 1.2;
        core.rotation.x += delta * 0.8;
        const scale = 1 + Math.sin(elapsed * 2.5) * 0.08;
        core.scale.set(scale, scale, scale);
      }

      const ring1 = logoGroup.getObjectByName("OrbitRing1");
      if (ring1) ring1.rotation.z += delta * 0.6;
      const ring2 = logoGroup.getObjectByName("OrbitRing2");
      if (ring2) ring2.rotation.y += delta * 0.8;

      // 4. Floating Social Elements (Organic bobbing)
      if (!reducedMotion) {
        for (let i = 0; i < floatingItems.length; i++) {
          const item = floatingItems[i];
          const yOff = Math.sin(elapsed * item.floatSpeed + item.floatOffset) * item.floatAmplitude;
          item.mesh.position.y = item.basePosition.y + yOff;
          item.mesh.rotation.y += item.rotationSpeed.y * delta;
          item.mesh.rotation.x += item.rotationSpeed.x * delta * 0.5;
        }
      }

      // 5. Particles slow drift
      if (!reducedMotion) {
        const pArray = particlePoints.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particlePositions.length / 3; i++) {
          const i3 = i * 3;
          pArray[i3 + 1] += Math.sin(elapsed * 0.5 + i) * 0.003;
          pArray[i3] += Math.cos(elapsed * 0.3 + i) * 0.002;
        }
        particlePoints.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      cleanUpScene(scene, renderer);
    };
  }, [onIntroComplete]);

  if (!webglSupported) {
    return null; // Graceful fallback handled by hero CSS/static UI
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Cinematic Skip Intro Button */}
      {isIntroActive && (
        <div className="absolute top-6 right-6 z-20 pointer-events-auto animate-in fade-in duration-300">
          <button
            onClick={handleSkipIntro}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/80 hover:border-violet-500/60 text-xs font-medium backdrop-blur-md transition-all shadow-lg cursor-pointer"
            aria-label="Skip 3D cinematic intro animation"
            tabIndex={0}
          >
            <span>Skip Intro</span>
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-[10px] text-neutral-400 font-mono">
              ESC
            </kbd>
            <FastForward className="w-3.5 h-3.5 text-violet-400 ml-0.5" />
          </button>

          {/* Intro timeline progress indicator bar */}
          <div className="w-full h-1 bg-neutral-800/80 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-75"
              style={{ width: `${Math.round(introProgress * 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
