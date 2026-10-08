import * as THREE from "three";

/**
 * Constructs the premium 3D extruded VYBE logo with beveled edges,
 * central glowing core, and kinetic orbital rings.
 */
export function create3DVybeLogo(): THREE.Group {
  const group = new THREE.Group();
  group.name = "Vybe3DLogo";

  // 1. Extruded 'V' Monogram Geometry
  const shape = new THREE.Shape();
  // Outer apex and wings
  shape.moveTo(0, -1.8);       // bottom apex
  shape.lineTo(1.8, 1.8);      // top right outer
  shape.lineTo(1.1, 1.8);      // top right inner
  shape.lineTo(0, -0.4);       // inner apex
  shape.lineTo(-1.1, 1.8);     // top left inner
  shape.lineTo(-1.8, 1.8);     // top left outer
  shape.closePath();

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.5,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 2,
    bevelSize: 0.08,
    bevelThickness: 0.08,
  };

  const vGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  vGeometry.center();

  // Premium metallic glass-like material with subtle violet emissive edges
  const vMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x1a1528),
    emissive: new THREE.Color(0x7c3aed),
    emissiveIntensity: 0.45,
    metalness: 0.85,
    roughness: 0.22,
    clearcoat: 0.9,
    clearcoatRoughness: 0.15,
    reflectivity: 0.9,
  });

  const vMesh = new THREE.Mesh(vGeometry, vMaterial);
  vMesh.castShadow = true;
  vMesh.receiveShadow = true;
  group.add(vMesh);

  // 2. Central Luminescent Core Gem
  const coreGeometry = new THREE.OctahedronGeometry(0.42, 0);
  const coreMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x38bdf8),
    emissive: new THREE.Color(0x06b6d4),
    emissiveIntensity: 1.5,
    roughness: 0.1,
    metalness: 0.1,
  });
  const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
  coreMesh.position.set(0, 0.4, 0);
  coreMesh.name = "LogoCore";
  group.add(coreMesh);

  // 3. Kinetic Orbit Rings
  const ringGeo1 = new THREE.TorusGeometry(2.3, 0.025, 16, 64);
  const ringMat1 = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xa855f7),
    transparent: true,
    opacity: 0.65,
  });
  const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
  ringMesh1.rotation.x = Math.PI / 3;
  ringMesh1.rotation.y = Math.PI / 6;
  ringMesh1.name = "OrbitRing1";
  group.add(ringMesh1);

  const ringGeo2 = new THREE.TorusGeometry(2.6, 0.02, 16, 64);
  const ringMat2 = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0x38bdf8),
    transparent: true,
    opacity: 0.45,
  });
  const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
  ringMesh2.rotation.x = -Math.PI / 4;
  ringMesh2.rotation.z = Math.PI / 5;
  ringMesh2.name = "OrbitRing2";
  group.add(ringMesh2);

  // 4. Subtle inner light point to illuminate bevels from within
  const innerLight = new THREE.PointLight(0xa855f7, 2.5, 6);
  innerLight.position.set(0, 0.4, 0.3);
  group.add(innerLight);

  return group;
}
