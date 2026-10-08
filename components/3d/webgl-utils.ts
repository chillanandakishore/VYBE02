import * as THREE from "three";

/**
 * Checks if WebGL / WebGL2 context is available and functional in the browser.
 */
export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return Boolean(gl && gl instanceof WebGLRenderingContext ? true : gl && (gl as WebGL2RenderingContext).COLOR ? true : false);
  } catch {
    return false;
  }
}

/**
 * Checks if the user prefers reduced motion for accessibility.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/**
 * Returns whether the client is a mobile or low-power screen device.
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  const userAgent = navigator.userAgent || "";
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent
  );
  const isSmallScreen = window.innerWidth < 768;
  return isMobileUA || isSmallScreen;
}

/**
 * Safely disposes all geometries, materials, and textures in a Three.js scene
 * to avoid memory leaks across Next.js navigation.
 */
export function cleanUpScene(
  scene: THREE.Scene,
  renderer?: THREE.WebGLRenderer
) {
  scene.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;

    if (object.geometry) {
      object.geometry.dispose();
    }

    if (object.material) {
      if (Array.isArray(object.material)) {
        for (const mat of object.material) {
          disposeMaterial(mat);
        }
      } else {
        disposeMaterial(object.material);
      }
    }
  });

  if (renderer) {
    renderer.dispose();
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
  }
}

function disposeMaterial(mat: THREE.Material) {
  mat.dispose();
  for (const key of Object.keys(mat)) {
    const val = (mat as unknown as Record<string, unknown>)[key];
    if (val && typeof val === "object" && "isTexture" in val && (val as THREE.Texture).dispose) {
      (val as THREE.Texture).dispose();
    }
  }
}
