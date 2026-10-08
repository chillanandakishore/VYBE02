"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { isWebGLAvailable, prefersReducedMotion, isMobileDevice, cleanUpScene } from "./webgl-utils";
import { Sparkles, Brain, Cpu, ArrowRight, Lightbulb, Hash, FileText, UserCheck } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface NodeData {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  pos: [number, number, number];
  color: number;
  icon: React.ElementType;
}

const NODES: NodeData[] = [
  {
    id: "ideas",
    name: "Content Ideas",
    subtitle: "Viral Hooks & Angles",
    description: "Deep semantic analysis generates 10+ high-retention concepts tailored to your niche.",
    pos: [-2.8, 1.3, 0],
    color: 0x38bdf8, // cyan
    icon: Lightbulb,
  },
  {
    id: "captions",
    name: "Smart Captions",
    subtitle: "Multi-Tone Copy",
    description: "Generates witty, storytelling, technical, or minimal captions with high-converting CTAs.",
    pos: [0, 2.5, 0.4],
    color: 0xa855f7, // violet
    icon: FileText,
  },
  {
    id: "hashtags",
    name: "Semantic Hashtags",
    subtitle: "High-Reach Tags",
    description: "Clusters high, medium, and low competition discovery tags without spam flags.",
    pos: [2.8, 1.3, 0],
    color: 0xf43f5e, // rose
    icon: Hash,
  },
  {
    id: "creator",
    name: "Creator Core",
    subtitle: "Audience Convergence",
    description: "Synthesizes generated assets directly into your personalized style and voice profile.",
    pos: [0, -2.2, 0],
    color: 0x10b981, // emerald
    icon: UserCheck,
  },
];

export function AIVisualization3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeNode, setActiveNode] = useState<NodeData>(NODES[0]);
  const [webglSupported, setWebglSupported] = useState(true);

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
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0, 7.8);

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

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);

    const pointLight = new THREE.PointLight(0x38bdf8, 3, 10);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);

    // 1. Central AI Core
    const coreGroup = new THREE.Group();
    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(0.65, 24, 24);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 1.4,
      roughness: 0.1,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // Outer crystalline wireframe icosahedron
    const outerGeo = new THREE.IcosahedronGeometry(0.95, 1);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      wireframe: true,
      emissive: 0x9333ea,
      emissiveIntensity: 0.8,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerMesh);

    // Orbiting rings
    const ringGeo = new THREE.TorusGeometry(1.3, 0.015, 16, 48);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    coreGroup.add(ringMesh);

    scene.add(coreGroup);

    // 2. Satellite Nodes and Connections
    const nodeMeshes: THREE.Mesh[] = [];
    const lineGroup = new THREE.Group();

    NODES.forEach((node) => {
      // Node sphere
      const nGeo = new THREE.SphereGeometry(0.32, 20, 20);
      const nMat = new THREE.MeshStandardMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: 0.85,
        roughness: 0.2,
      });
      const nMesh = new THREE.Mesh(nGeo, nMat);
      nMesh.position.set(...node.pos);
      nMesh.userData = { id: node.id };
      scene.add(nMesh);
      nodeMeshes.push(nMesh);

      // Node halo ring
      const haloGeo = new THREE.RingGeometry(0.4, 0.44, 24);
      const haloMat = new THREE.MeshBasicMaterial({
        color: node.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.position.set(...node.pos);
      scene.add(haloMesh);

      // Line connection to AI core
      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(...node.pos)];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: node.color,
        transparent: true,
        opacity: 0.45,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      lineGroup.add(line);

      // Cross connections between top nodes and creator
      if (node.id !== "creator") {
        const creatorPos = NODES.find((n) => n.id === "creator")!.pos;
        const crossPoints = [new THREE.Vector3(...node.pos), new THREE.Vector3(...creatorPos)];
        const crossLineGeo = new THREE.BufferGeometry().setFromPoints(crossPoints);
        const crossLineMat = new THREE.LineBasicMaterial({
          color: 0x71717a,
          transparent: true,
          opacity: 0.2,
        });
        lineGroup.add(new THREE.Line(crossLineGeo, crossLineMat));
      }
    });

    scene.add(lineGroup);

    // 3. Neural particles around the core
    const pCount = isMobile ? 80 : 180;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.2 + Math.random() * 2.5;
      pPos[i * 3] = Math.cos(angle) * radius;
      pPos[i * 3 + 1] = Math.sin(angle) * radius * 0.7;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.06,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
    });
    const particlePoints = new THREE.Points(pGeo, pMat);
    scene.add(particlePoints);

    // Raycaster for node interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);
      if (intersects.length > 0) {
        const hitId = intersects[0].object.userData.id;
        const matched = NODES.find((n) => n.id === hitId);
        if (matched) setActiveNode(matched);
      }
    };

    canvas.addEventListener("mousemove", handlePointerMove);

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 450;
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
        // Spin core
        coreGroup.rotation.y += delta * 0.45;
        coreGroup.rotation.x = Math.sin(elapsed * 0.6) * 0.15;
        outerMesh.rotation.y -= delta * 0.3;
        outerMesh.rotation.z += delta * 0.2;
        ringMesh.rotation.z += delta * 0.5;

        // Pulse core scale
        const s = 1 + Math.sin(elapsed * 2.0) * 0.05;
        innerMesh.scale.set(s, s, s);

        // Particle spin
        particlePoints.rotation.z += delta * 0.15;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      cleanUpScene(scene, renderer);
    };
  }, []);

  const ActiveIcon = activeNode.icon;

  return (
    <section id="ai-studio" className="py-24 relative overflow-hidden bg-neutral-950/80 border-t border-neutral-800/80">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-violet-600/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text & Interactive Node HUD */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div>
              <Badge variant="primary" size="md" className="mb-3">
                <Brain className="w-3.5 h-3.5 text-cyan-400" /> VYBE AI Architecture
              </Badge>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
                Neural Content Studio <br />
                <span className="text-vybe-gradient">In 3D Space</span>
              </h2>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                Connect your creative workflow to modular AI intelligence. VYBE AI bridges idea ideation,
                magnetic caption copy, script arcs, and discovery tags directly into your creator profile.
              </p>
            </div>

            {/* Interactive Node Selector Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {NODES.map((node) => {
                const isSelected = activeNode.id === node.id;
                const Icon = node.icon;
                return (
                  <button
                    key={node.id}
                    onClick={() => setActiveNode(node)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? "bg-violet-600/20 border-violet-500 text-white shadow-lg shadow-violet-600/20"
                        : "bg-neutral-900/40 border-neutral-800/80 text-neutral-400 hover:text-white hover:border-neutral-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-semibold">{node.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Node Live Card */}
            <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800/90 shadow-xl backdrop-blur-xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-300">
                  <ActiveIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{activeNode.name}</h3>
                  <p className="text-xs text-cyan-400 font-mono">{activeNode.subtitle}</p>
                </div>
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed mt-2">
                {activeNode.description}
              </p>
            </div>

            {/* CTA to AI Creator Studio */}
            <div className="flex items-center gap-4 pt-2">
              <Link href="/studio">
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-violet-600/20 transition-all cursor-pointer">
                  <Sparkles className="w-4 h-4" />
                  <span>Launch VYBE AI Studio</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </Link>
            </div>
          </div>

          {/* Right 3D Neural Scene */}
          <div className="lg:col-span-6 relative">
            <div
              ref={containerRef}
              className="relative w-full h-[420px] sm:h-[480px] rounded-3xl bg-neutral-950/90 border border-neutral-800/80 overflow-hidden shadow-2xl flex items-center justify-center"
            >
              {webglSupported ? (
                <>
                  <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />
                  <div className="absolute bottom-3 left-4 text-[11px] font-mono text-neutral-400 bg-neutral-900/80 px-2.5 py-1 rounded-full border border-neutral-800 pointer-events-none">
                    Hover nodes to explore neural connections
                  </div>
                </>
              ) : (
                /* Fallback if WebGL unavailable */
                <div className="p-8 text-center flex flex-col items-center justify-center">
                  <Cpu className="w-12 h-12 text-violet-400 mb-4 animate-pulse" />
                  <h4 className="text-lg font-bold text-white mb-2">VYBE AI Neural Graph</h4>
                  <p className="text-xs text-neutral-400 max-w-sm">
                    Interactive neural visualization connecting Ideas, Captions, Hashtags, and Creators.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
