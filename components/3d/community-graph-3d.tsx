"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { isWebGLAvailable, prefersReducedMotion, isMobileDevice, cleanUpScene } from "./webgl-utils";
import { Users2, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface CommunityNode {
  id: string;
  name: string;
  emoji: string;
  members: string;
  trend: string;
  pos: [number, number, number];
  color: number;
  connections: string[]; // connected community IDs
}

const COMMUNITIES: CommunityNode[] = [
  {
    id: "ai",
    name: "AI & Neural Art",
    emoji: "🤖",
    members: "28.4k",
    trend: "+32%",
    pos: [0, 0.4, 0.2],
    color: 0xa855f7, // violet
    connections: ["coding", "design", "video-editing", "photography"],
  },
  {
    id: "coding",
    name: "Modern Web & Systems",
    emoji: "💻",
    members: "34.1k",
    trend: "+24%",
    pos: [-1.8, 2.2, -0.4],
    color: 0x38bdf8, // cyan
    connections: ["ai", "gaming", "design"],
  },
  {
    id: "video-editing",
    name: "Video Editing & VFX",
    emoji: "🎬",
    members: "42.8k",
    trend: "+19%",
    pos: [-2.6, -1.0, 0.5],
    color: 0xf43f5e, // rose
    connections: ["ai", "photography", "music"],
  },
  {
    id: "photography",
    name: "Cinematic Photography",
    emoji: "📸",
    members: "39.5k",
    trend: "+15%",
    pos: [-3.2, 0.8, -0.6],
    color: 0x06b6d4, // teal
    connections: ["video-editing", "travel", "ai"],
  },
  {
    id: "gaming",
    name: "Indie Dev & Gaming",
    emoji: "🎮",
    members: "51.2k",
    trend: "+28%",
    pos: [2.2, 2.0, -0.2],
    color: 0x10b981, // emerald
    connections: ["coding", "music", "design"],
  },
  {
    id: "music",
    name: "Music Production",
    emoji: "🎵",
    members: "23.6k",
    trend: "+12%",
    pos: [2.8, -1.2, 0.4],
    color: 0xf59e0b, // amber
    connections: ["video-editing", "gaming"],
  },
  {
    id: "cars",
    name: "Motorsport & Builds",
    emoji: "🏎️",
    members: "17.9k",
    trend: "+8%",
    pos: [3.4, 0.5, -0.8],
    color: 0xef4444, // red
    connections: ["photography", "travel"],
  },
  {
    id: "travel",
    name: "Nomad & Travel",
    emoji: "✈️",
    members: "31.0k",
    trend: "+21%",
    pos: [-0.8, -2.4, -0.2],
    color: 0x14b8a6, // cyan-green
    connections: ["photography", "cars"],
  },
  {
    id: "design",
    name: "3D Motion & Design",
    emoji: "🎨",
    members: "26.7k",
    trend: "+17%",
    pos: [1.2, -2.2, 0.2],
    color: 0xd946ef, // fuchsia
    connections: ["ai", "coding", "gaming"],
  },
];

export function CommunityGraph3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeCommunity, setActiveCommunity] = useState<CommunityNode>(COMMUNITIES[0]);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  // Quick lookup for connected node set
  const connectedIds = useMemo(() => {
    const currentId = hoveredNodeId || activeCommunity.id;
    const current = COMMUNITIES.find((c) => c.id === currentId);
    return new Set(current ? [current.id, ...current.connections] : []);
  }, [hoveredNodeId, activeCommunity]);

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setWebglSupported(false);
      return;
    }

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const isMobile = isMobileDevice();
    const reducedMotion = prefersReducedMotion();

    const scene = new THREE.Scene();
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0, 8.5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: !isMobile,
        alpha: true,
      });
    } catch {
      setWebglSupported(false);
      return;
    }

    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height);

    // Ambient and directional lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dirLight = new THREE.DirectionalLight(0xa855f7, 2.0);
    dirLight.position.set(4, 6, 6);
    scene.add(dirLight);

    // Root group for subtle rotation
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Build community spheres
    const meshMap = new Map<string, THREE.Mesh>();
    COMMUNITIES.forEach((comm) => {
      const isCore = comm.id === "ai";
      const radius = isCore ? 0.44 : 0.35;
      const sphereGeo = new THREE.SphereGeometry(radius, 24, 24);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: comm.color,
        emissive: comm.color,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.3,
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.position.set(...comm.pos);
      sphereMesh.userData = { id: comm.id };
      rootGroup.add(sphereMesh);
      meshMap.set(comm.id, sphereMesh);

      // Glow halo ring around sphere
      const haloGeo = new THREE.RingGeometry(radius + 0.08, radius + 0.14, 28);
      const haloMat = new THREE.MeshBasicMaterial({
        color: comm.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.set(...comm.pos);
      rootGroup.add(halo);
    });

    // 2. Build connection lines between connected communities
    const lineMeshes: { line: THREE.Line; fromId: string; toId: string }[] = [];
    const addedPairs = new Set<string>();

    COMMUNITIES.forEach((fromNode) => {
      fromNode.connections.forEach((toId) => {
        const pairKey = [fromNode.id, toId].sort().join("---");
        if (addedPairs.has(pairKey)) return;
        addedPairs.add(pairKey);

        const toNode = COMMUNITIES.find((c) => c.id === toId);
        if (!toNode) return;

        const points = [new THREE.Vector3(...fromNode.pos), new THREE.Vector3(...toNode.pos)];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const lineMat = new THREE.LineBasicMaterial({
          color: 0x52525b,
          transparent: true,
          opacity: 0.35,
        });
        const line = new THREE.Line(lineGeo, lineMat);
        rootGroup.add(line);
        lineMeshes.push({ line, fromId: fromNode.id, toId });
      });
    });

    // 3. Ambient network dust particles
    const dustCount = isMobile ? 60 : 160;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 10;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xa855f7,
      transparent: true,
      opacity: 0.6,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    rootGroup.add(dustPoints);

    // Raycaster for cursor hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = Array.from(meshMap.values());
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hitId = intersects[0].object.userData.id as string;
        setHoveredNodeId(hitId);
        const comm = COMMUNITIES.find((c) => c.id === hitId);
        if (comm) setActiveCommunity(comm);
      } else {
        setHoveredNodeId(null);
      }
    };

    canvas.addEventListener("mousemove", handlePointerMove);

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (document.hidden) return;

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (!reducedMotion) {
        // Slow sway of constellation
        rootGroup.rotation.y = Math.sin(elapsed * 0.3) * 0.2;
        rootGroup.rotation.x = Math.cos(elapsed * 0.2) * 0.1;
      }

      // Update sphere scale & emission based on active selection
      const currentActiveId = hoveredNodeId || activeCommunity.id;
      meshMap.forEach((mesh, id) => {
        const isFocused = id === currentActiveId;
        const isNeighbor = COMMUNITIES.find((c) => c.id === currentActiveId)?.connections.includes(id);

        const targetScale = isFocused ? 1.3 : isNeighbor ? 1.1 : 1.0;
        mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);

        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = isFocused ? 1.4 : isNeighbor ? 0.9 : 0.45;
      });

      // Update line brightness
      lineMeshes.forEach(({ line, fromId, toId }) => {
        const mat = line.material as THREE.LineBasicMaterial;
        const isConnectedToFocus =
          fromId === currentActiveId || toId === currentActiveId;
        mat.opacity = isConnectedToFocus ? 0.95 : 0.2;
        if (isConnectedToFocus) {
          mat.color.setHex(0xa855f7);
        } else {
          mat.color.setHex(0x52525b);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      cleanUpScene(scene, renderer);
    };
  }, [hoveredNodeId, activeCommunity]);

  return (
    <div className="relative w-full rounded-3xl bg-neutral-950/80 border border-neutral-800/80 overflow-hidden shadow-2xl p-4 sm:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <Badge variant="accent" size="md" className="mb-2">
            <Users2 className="w-3.5 h-3.5 text-fuchsia-400" /> 3D Ecosystem Graph
          </Badge>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            VYBES Constellation
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-lg">
            Interact with interconnected passion streams. Hover any node to trace shared creator connections.
          </p>
        </div>

        {/* Selected Community HUD Pill */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-900/90 border border-violet-500/40 shadow-xl backdrop-blur-xl">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-xl">
            {activeCommunity.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{activeCommunity.name}</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                {activeCommunity.trend}
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              {activeCommunity.members} creators active
            </p>
          </div>
          <Link href="/vybes">
            <button className="ml-2 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer">
              <span>Join</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </Link>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div
        ref={containerRef}
        className="relative w-full h-[360px] sm:h-[460px] rounded-2xl bg-neutral-900/40 border border-neutral-800/60 overflow-hidden flex items-center justify-center"
      >
        {webglSupported ? (
          <>
            <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />
            <div className="absolute bottom-3 left-4 text-[11px] font-mono text-neutral-400 bg-neutral-900/80 px-2.5 py-1 rounded-full border border-neutral-800 pointer-events-none">
              Hover nodes to inspect community filaments
            </div>
          </>
        ) : (
          <div className="text-center p-6">
            <Sparkles className="w-10 h-10 text-violet-400 mx-auto mb-2 animate-pulse" />
            <p className="text-sm font-semibold text-white">VYBE Community Constellation</p>
            <p className="text-xs text-neutral-400 mt-1">Explore 15+ connected creator niches.</p>
          </div>
        )}
      </div>

      {/* Interactive Quick Filter Chips */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-neutral-800/80">
        {COMMUNITIES.map((c) => {
          const isSelected = activeCommunity.id === c.id;
          const isConnected = connectedIds.has(c.id);
          return (
            <button
              key={c.id}
              onClick={() => setActiveCommunity(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
                isSelected
                  ? "bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-600/30 scale-105"
                  : isConnected
                  ? "bg-violet-950/40 text-violet-300 border-violet-800/50"
                  : "bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:text-white"
              }`}
            >
              <span>{c.emoji}</span>
              <span>{c.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
