import * as THREE from "three";
import { createParticleTexture } from "./texture-utils";

/**
 * Creates an adaptive particle starfield/dust environment.
 */
export function createParticleEnvironment(
  count: number,
  reducedMotion: boolean
): {
  points: THREE.Points;
  positions: Float32Array;
  initialPositions: Float32Array;
  velocities: Float32Array;
} {
  const particleCount = reducedMotion ? Math.min(count, 80) : count;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const initialPositions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorPalette = [
    new THREE.Color(0xa855f7), // violet
    new THREE.Color(0x38bdf8), // cyan
    new THREE.Color(0xf43f5e), // pink
    new THREE.Color(0xffffff), // white star
  ];

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    // Spread in 3D box
    const x = (Math.random() - 0.5) * 36;
    const y = (Math.random() - 0.5) * 24;
    const z = (Math.random() - 0.5) * 30 - 5;

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;

    initialPositions[i3] = x;
    initialPositions[i3 + 1] = y;
    initialPositions[i3 + 2] = z;

    velocities[i3] = (Math.random() - 0.5) * 0.008;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.008;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.004;

    const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i3] = col.r;
    colors[i3 + 1] = col.g;
    colors[i3 + 2] = col.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const particleTexture = createParticleTexture();

  const material = new THREE.PointsMaterial({
    size: reducedMotion ? 0.22 : 0.38,
    map: particleTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  points.name = "ParticleEnvironment";

  return { points, positions, initialPositions, velocities };
}
