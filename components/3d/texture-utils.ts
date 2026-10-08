import * as THREE from "three";

/**
 * Creates a soft glowing radial particle texture via HTML5 canvas.
 */
export function createParticleTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.2, "rgba(168, 85, 247, 0.8)"); // violet
    gradient.addColorStop(0.5, "rgba(59, 130, 246, 0.4)"); // cyan-blue
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates a stylish dark-glass UI card texture with simulated text and avatar.
 */
export function createCardTexture(
  title: string,
  subtitle: string,
  badgeText?: string,
  badgeColor = "#8b5cf6"
): THREE.Texture {
  const width = 512;
  const height = 300;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // Card background
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, "#18181b");
    bgGradient.addColorStop(1, "#09090b");
    ctx.fillStyle = bgGradient;
    roundRect(ctx, 4, 4, width - 8, height - 8, 24);
    ctx.fill();

    // Border glow
    ctx.strokeStyle = "rgba(168, 85, 247, 0.4)";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Top subtle highlight line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(28, 6);
    ctx.lineTo(width - 28, 6);
    ctx.stroke();

    // Mock avatar circle
    const avatarGrad = ctx.createLinearGradient(40, 40, 100, 100);
    avatarGrad.addColorStop(0, "#c084fc");
    avatarGrad.addColorStop(1, "#3b82f6");
    ctx.fillStyle = avatarGrad;
    ctx.beginPath();
    ctx.arc(68, 70, 28, 0, Math.PI * 2);
    ctx.fill();

    // Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(title, 114, 66);

    // Subtitle
    ctx.fillStyle = "#a1a1aa";
    ctx.font = "18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(subtitle, 114, 94);

    // Badge
    if (badgeText) {
      ctx.fillStyle = badgeColor;
      roundRect(ctx, 360, 48, 120, 32, 10);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px monospace";
      ctx.textAlign = "center";
      ctx.fillText(badgeText, 420, 69);
      ctx.textAlign = "left";
    }

    // Mock content lines
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    roundRect(ctx, 40, 130, width - 80, 16, 6);
    ctx.fill();
    roundRect(ctx, 40, 160, width - 140, 16, 6);
    ctx.fill();

    // Bottom engagement preview pills
    ctx.fillStyle = "rgba(236, 72, 153, 0.2)";
    roundRect(ctx, 40, 210, 80, 36, 12);
    ctx.fill();
    ctx.fillStyle = "#f472b6";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("♥ 2.4k", 56, 234);

    ctx.fillStyle = "rgba(59, 130, 246, 0.2)";
    roundRect(ctx, 135, 210, 80, 36, 12);
    ctx.fill();
    ctx.fillStyle = "#60a5fa";
    ctx.fillText("💬 380", 152, 234);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates a vertical reel video card texture.
 */
export function createReelTexture(label: string): THREE.Texture {
  const width = 300;
  const height = 480;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, "#3b0764"); // deep violet
    bgGradient.addColorStop(0.5, "#1e1b4b"); // deep indigo
    bgGradient.addColorStop(1, "#0369a1"); // deep cyan
    ctx.fillStyle = bgGradient;
    roundRect(ctx, 4, 4, width - 8, height - 8, 20);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center play glyph
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.beginPath();
    ctx.arc(width / 2, height / 2 - 20, 36, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(width / 2 - 10, height / 2 - 35);
    ctx.lineTo(width / 2 + 16, height / 2 - 20);
    ctx.lineTo(width / 2 - 10, height / 2 - 5);
    ctx.closePath();
    ctx.fill();

    // Title label
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(label, 24, height - 70);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "14px monospace";
    ctx.fillText("4K • 60fps • HDR", 24, height - 40);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
