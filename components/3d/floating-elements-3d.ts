import * as THREE from "three";
import { createCardTexture, createReelTexture } from "./texture-utils";

export interface FloatingElementItem {
  mesh: THREE.Object3D;
  basePosition: THREE.Vector3;
  floatSpeed: number;
  floatAmplitude: number;
  floatOffset: number;
  rotationSpeed: THREE.Vector3;
}

/**
 * Creates curated floating social elements arranged organically around the central 3D logo.
 */
export function createFloatingElements(isMobile: boolean): {
  group: THREE.Group;
  items: FloatingElementItem[];
} {
  const group = new THREE.Group();
  group.name = "FloatingSocialGroup";
  const items: FloatingElementItem[] = [];

  // Helper to add tracked item
  const addItem = (
    obj: THREE.Object3D,
    pos: [number, number, number],
    speed = 1.2,
    amp = 0.22,
    offset = 0,
    rotSpeed = new THREE.Vector3(0.1, 0.15, 0.05)
  ) => {
    obj.position.set(...pos);
    group.add(obj);
    items.push({
      mesh: obj,
      basePosition: new THREE.Vector3(...pos),
      floatSpeed: speed,
      floatAmplitude: amp,
      floatOffset: offset,
      rotationSpeed: rotSpeed,
    });
  };

  // 1. Profile Card (Top-Left)
  const profileTex = createCardTexture("Maya Lin", "@mayalin • Creator", "PRO");
  const cardGeo = new THREE.PlaneGeometry(2.4, 1.4);
  const cardMat = new THREE.MeshStandardMaterial({
    map: profileTex,
    transparent: true,
    opacity: 0.95,
    roughness: 0.25,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });
  const profileCard = new THREE.Mesh(cardGeo, cardMat);
  profileCard.rotation.y = 0.25;
  profileCard.rotation.x = -0.1;
  addItem(profileCard, [-4.2, 2.2, -1.5], 1.1, 0.2, 0);

  // 2. Vertical Reel Preview (Bottom-Right)
  const reelTex = createReelTexture("Cyberpunk 4K Grade");
  const reelGeo = new THREE.PlaneGeometry(1.6, 2.5);
  const reelMat = new THREE.MeshStandardMaterial({
    map: reelTex,
    transparent: true,
    opacity: 0.95,
    roughness: 0.3,
    metalness: 0.2,
    side: THREE.DoubleSide,
  });
  const reelCard = new THREE.Mesh(reelGeo, reelMat);
  reelCard.rotation.y = -0.28;
  reelCard.rotation.x = 0.12;
  addItem(reelCard, [4.4, -1.8, -1.2], 1.3, 0.25, 1.2);

  // 3. Glowing 3D Heart (Mid-Right)
  const heartShape = new THREE.Shape();
  heartShape.moveTo(0, 0);
  heartShape.bezierCurveTo(0, 0.4, -0.6, 0.8, -0.6, 0.2);
  heartShape.bezierCurveTo(-0.6, -0.2, 0, -0.6, 0, -0.8);
  heartShape.bezierCurveTo(0, -0.6, 0.6, -0.2, 0.6, 0.2);
  heartShape.bezierCurveTo(0.6, 0.8, 0, 0.4, 0, 0);
  const heartGeo = new THREE.ExtrudeGeometry(heartShape, {
    depth: 0.22,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.05,
    bevelThickness: 0.05,
  });
  heartGeo.center();
  const heartMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    emissive: 0xe11d48,
    emissiveIntensity: 0.85,
    roughness: 0.2,
    metalness: 0.3,
  });
  const heartMesh = new THREE.Mesh(heartGeo, heartMat);
  heartMesh.scale.set(1.4, 1.4, 1.4);
  addItem(heartMesh, [3.8, 1.5, 0.5], 1.5, 0.28, 2.4, new THREE.Vector3(0.2, 0.4, 0.1));

  // 4. AI Sparkle Crystal Star (Top-Center-Right)
  const aiGeo = new THREE.OctahedronGeometry(0.5, 0);
  const aiMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0ea5e9,
    emissiveIntensity: 1.2,
    roughness: 0.1,
    metalness: 0.8,
  });
  const aiMesh = new THREE.Mesh(aiGeo, aiMat);
  addItem(aiMesh, [2.2, 3.2, -2.0], 1.4, 0.24, 3.1, new THREE.Vector3(0.5, 0.6, 0.2));

  // If not mobile, add secondary elements for richer desktop depth
  if (!isMobile) {
    // 5. Chat Bubble (Mid-Left)
    const bubbleGeo = new THREE.SphereGeometry(0.65, 32, 16);
    bubbleGeo.scale(1.2, 0.85, 0.6);
    const bubbleMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.4,
      roughness: 0.3,
      metalness: 0.1,
    });
    const bubbleMesh = new THREE.Mesh(bubbleGeo, bubbleMat);
    addItem(bubbleMesh, [-3.8, -0.8, 0.8], 1.2, 0.2, 4.0);

    // 6. Camera Lens Cylinder (Lower-Left)
    const lensGroup = new THREE.Group();
    const lensBodyGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 24);
    const lensBodyMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      metalness: 0.8,
      roughness: 0.3,
    });
    const lensBody = new THREE.Mesh(lensBodyGeo, lensBodyMat);
    lensBody.rotation.x = Math.PI / 2;
    lensGroup.add(lensBody);

    const lensGlassGeo = new THREE.CircleGeometry(0.42, 24);
    const lensGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      emissive: 0x0284c7,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1.0,
    });
    const lensGlass = new THREE.Mesh(lensGlassGeo, lensGlassMat);
    lensGlass.position.z = 0.21;
    lensGroup.add(lensGlass);
    addItem(lensGroup, [-2.6, -2.8, -1.8], 1.0, 0.18, 5.2, new THREE.Vector3(0.1, 0.2, 0.05));

    // 7. Community Badge Pill (Top-Right)
    const badgePillGeo = new THREE.CapsuleGeometry(0.28, 0.8, 12, 24);
    badgePillGeo.rotateZ(Math.PI / 2);
    const badgePillMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.4,
    });
    const badgePill = new THREE.Mesh(badgePillGeo, badgePillMat);
    addItem(badgePill, [3.2, 3.6, -1.2], 1.25, 0.22, 1.8);

    // 8. Music Floating Wave Bars (Top-Left)
    const musicGroup = new THREE.Group();
    const heights = [0.4, 0.8, 0.6, 0.9, 0.5];
    heights.forEach((h, idx) => {
      const barGeo = new THREE.BoxGeometry(0.08, h, 0.08);
      const barMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.7,
      });
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.x = (idx - 2) * 0.15;
      musicGroup.add(bar);
    });
    addItem(musicGroup, [-2.2, 3.4, -2.2], 1.35, 0.25, 2.7);
  }

  return { group, items };
}
