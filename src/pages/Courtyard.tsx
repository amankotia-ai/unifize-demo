import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";

const LF_STYLES = `
html:has(.lf-root) { scroll-behavior: smooth; }
.lf-root [id] { scroll-margin-top: 72px; }
.lf-root {
  --lf-fg: 255, 255, 255;
  --lf-bg: #08090A;
  --lf-bg-rgb: 8, 9, 10;
  --lf-bg-subtle: #0E0F12;
  --lf-bg-card: #14151B;
  --lf-border: rgba(var(--lf-fg), 0.08);
  --lf-border-strong: rgba(var(--lf-fg), 0.14);
  --lf-text: #FFFFFF;
  --lf-text-muted: rgba(var(--lf-fg), 0.56);
  --lf-text-faint: rgba(var(--lf-fg), 0.38);

  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  background: var(--lf-bg);
  color: var(--lf-text);
  -webkit-font-smoothing: antialiased;
  letter-spacing: -0.011em;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
  transition: background 0.25s ease, color 0.25s ease;
}
.lf-root[data-theme="light"] {
  --lf-fg: 11, 13, 17;
  --lf-bg: #FAFAFB;
  --lf-bg-rgb: 250, 250, 251;
  --lf-bg-subtle: #F3F4F6;
  --lf-bg-card: #FFFFFF;
  --lf-text: #0B0D11;
  --lf-text-muted: rgba(var(--lf-fg), 0.62);
  --lf-text-faint: rgba(var(--lf-fg), 0.42);
}
.lf-root * { box-sizing: border-box; }
.lf-root .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
.lf-root a { color: inherit; text-decoration: none; }

.lf-nav {
  position: sticky; top: 0; z-index: 50;
  backdrop-filter: saturate(160%) blur(18px);
  background: rgba(var(--lf-bg-rgb), 0.72);
  border-bottom: 1px solid var(--lf-border);
  transition: background 0.25s ease, border-color 0.25s ease;
}
.lf-nav-inner {
  max-width: 1320px; margin: 0 auto;
  padding: 10px 24px;
  display: flex; align-items: center; gap: 40px;
}
.lf-nav-logo { display: inline-flex; align-items: center; }
.lf-nav-logo-img {
  height: 22px; width: auto; display: block;
  filter: brightness(0) invert(1);
}
.lf-root[data-theme="light"] .lf-nav-logo-img { filter: brightness(0); }
.lf-nav-items {
  display: flex; gap: 26px;
  font-size: 13.5px; color: var(--lf-text-muted);
}
.lf-nav-items a:hover { color: var(--lf-text); }
.lf-nav-actions { margin-left: auto; display: flex; gap: 18px; align-items: center; }
.lf-nav-link { font-size: 13.5px; color: var(--lf-text-muted); }
.lf-nav-link:hover { color: var(--lf-text); }
.lf-nav-btn {
  font-size: 13px; font-weight: 500;
  background: var(--lf-text); color: var(--lf-bg);
  padding: 7px 14px; border-radius: 999px;
  border: 1px solid var(--lf-text);
  cursor: pointer;
  transition: opacity .15s ease, background .25s ease, color .25s ease, border-color .25s ease;
}
.lf-nav-btn:hover { opacity: 0.88; }
.lf-theme-toggle {
  width: 30px; height: 30px;
  display: inline-flex; align-items: center; justify-content: center;
  background: transparent;
  border: 1px solid var(--lf-border);
  border-radius: 999px;
  color: var(--lf-text-muted);
  cursor: pointer;
  padding: 0;
  transition: color .15s ease, background .15s ease, border-color .15s ease;
}
.lf-theme-toggle:hover {
  color: var(--lf-text);
  border-color: var(--lf-border-strong);
  background: rgba(var(--lf-fg), 0.04);
}
.lf-theme-toggle svg { display: block; }
@media (max-width: 860px) { .lf-nav-items { display: none; } }
`;

type Theme = "dark" | "light";

// ── Camera ──────────────────────────────────────────────
// The story: at INITIAL the camera is almost at horizon level, looking
// between the two buildings. The courtyard floor compresses to a thin band
// at the bottom of frame — the gap is invisible. Over 2.4s we tilt down
// (elevation rising) and zoom slightly while the lookAt drops to floor
// level. The tilt IS the reveal.
const INITIAL_ELEVATION = 5;
const DEFAULT_ELEVATION = 30;
const INITIAL_AZIMUTH = 0;
const DEFAULT_AZIMUTH = 8;
const INITIAL_FRUSTUM = 12;
const DEFAULT_FRUSTUM = 14;
const CAM_DIST = 40;
const ENTRANCE_DURATION = 2400;
const LOOKAT_INITIAL = new THREE.Vector3(0, 2.5, 0);
const LOOKAT_DEFAULT = new THREE.Vector3(0, 0.6, 0);

// ── Scene dimensions ────────────────────────────────────
const BASEPLATE_W = 22;
const BASEPLATE_H = 0.2;
const BASEPLATE_D = 12;

const PROCESS_W = 4.5;
const PROCESS_H = 6;
const PROCESS_D = 4.5;
const PROCESS_X = -5.5;

const QUALITY_W = 5.5;
const QUALITY_H = 4.5;
const QUALITY_D = 5;
const QUALITY_X = 5.5;

// Courtyard scatter zone (between the buildings)
const COURTYARD_X_MIN = -2.6;
const COURTYARD_X_MAX = 2.6;
const COURTYARD_Z_MIN = -3.4;
const COURTYARD_Z_MAX = 3.4;
const COURTYARD_FLOOR_Y = BASEPLATE_H; // 0.2

// SoC palette (matches Blank.tsx layer colors)
const SOC_COLORS = [
  0xfdba74, 0xa5b4fc, 0x7dd3fc, 0xfcd34d,
  0x6ee7b7, 0x5eead4, 0xc4b5fd, 0xf9a8d4,
];

// ── Easing ──────────────────────────────────────────────
function easeInOutCubic(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

// ── Seeded RNG (stable scatter) ─────────────────────────
function seededRng(s0: number): () => number {
  let s = s0 >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── Building face texture ───────────────────────────────
// One texture is reused on all four sides of a building. Vertical slits or
// horizontal louvers + an optional severity stripe distinguish the two.
function createBuildingFaceTexture(opts: {
  baseHex: number;
  accent: "vertical-slits" | "horizontal-louvers";
  severityStripe?: boolean;
}): THREE.CanvasTexture {
  const W = 512;
  const H = 768;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  const base = new THREE.Color(opts.baseHex);
  const baseRgb = `rgb(${Math.round(base.r * 255)},${Math.round(base.g * 255)},${Math.round(base.b * 255)})`;
  const darker = base.clone().multiplyScalar(0.84);
  const darkRgb = `rgb(${Math.round(darker.r * 255)},${Math.round(darker.g * 255)},${Math.round(darker.b * 255)})`;

  // Background gradient (slightly darker at the bottom — ground shadow cue)
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, baseRgb);
  grad.addColorStop(1, darkRgb);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Subtle grain
  const grain = ctx.getImageData(0, 0, W, H);
  for (let i = 0; i < grain.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 6;
    grain.data[i] = Math.max(0, Math.min(255, grain.data[i] + n));
    grain.data[i + 1] = Math.max(0, Math.min(255, grain.data[i + 1] + n));
    grain.data[i + 2] = Math.max(0, Math.min(255, grain.data[i + 2] + n));
  }
  ctx.putImageData(grain, 0, 0);

  // Architectural accent lines
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  if (opts.accent === "vertical-slits") {
    // Recessed window slits running floor-to-cornice
    const slits = 7;
    const slitW = 8;
    const usableW = W * 0.78;
    const startX = (W - usableW) / 2;
    const gap = (usableW - slits * slitW) / (slits - 1);
    const topY = H * 0.10;
    const botY = H * 0.92;
    for (let i = 0; i < slits; i++) {
      const x = startX + i * (gap + slitW);
      ctx.fillRect(x, topY, slitW, botY - topY);
    }
    // Cornice band at top
    ctx.fillStyle = "rgba(0,0,0,0.10)";
    ctx.fillRect(0, H * 0.04, W, 4);
    ctx.fillRect(0, H * 0.08, W, 2);
  } else {
    // Horizontal louver bands (inspection-block aesthetic)
    const louvers = 11;
    const louverH = 4;
    const usableH = H * 0.84;
    const startY = H * 0.08;
    const gap = (usableH - louvers * louverH) / (louvers - 1);
    for (let i = 0; i < louvers; i++) {
      const y = startY + i * (gap + louverH);
      ctx.fillRect(W * 0.08, y, W * 0.84, louverH);
    }
  }

  // Severity stripe — narrow vertical red band on the right edge
  if (opts.severityStripe) {
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(W * 0.92, 0, W * 0.04, H);
    ctx.fillStyle = "rgba(180,30,30,0.4)";
    ctx.fillRect(W * 0.91, 0, W * 0.005, H);
    ctx.fillRect(W * 0.965, 0, W * 0.005, H);
  }

  // Plinth shadow at the very bottom — darker band suggesting baseplate contact
  ctx.fillStyle = "rgba(0,0,0,0.24)";
  ctx.fillRect(0, H - 6, W, 6);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 16;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}

// ── Building roof texture ──────────────────────────────
function createBuildingRoofTexture(baseHex: number): THREE.CanvasTexture {
  const W = 512;
  const H = 512;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  const base = new THREE.Color(baseHex).multiplyScalar(1.05);
  const rgb = `rgb(${Math.round(base.r * 255)},${Math.round(base.g * 255)},${Math.round(base.b * 255)})`;
  ctx.fillStyle = rgb;
  ctx.fillRect(0, 0, W, H);

  // Grain
  const grain = ctx.getImageData(0, 0, W, H);
  for (let i = 0; i < grain.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 5;
    grain.data[i] = Math.max(0, Math.min(255, grain.data[i] + n));
    grain.data[i + 1] = Math.max(0, Math.min(255, grain.data[i + 1] + n));
    grain.data[i + 2] = Math.max(0, Math.min(255, grain.data[i + 2] + n));
  }
  ctx.putImageData(grain, 0, 0);

  // Roof equipment outlines — small dark rectangles, like HVAC units
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.fillRect(W * 0.18, H * 0.20, W * 0.18, H * 0.10);
  ctx.fillRect(W * 0.42, H * 0.62, W * 0.22, H * 0.13);
  ctx.fillRect(W * 0.70, H * 0.30, W * 0.12, H * 0.08);
  // Inset border
  ctx.strokeStyle = "rgba(0,0,0,0.12)";
  ctx.lineWidth = 4;
  ctx.strokeRect(8, 8, W - 16, H - 16);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 16;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}

// ── Baseplate texture ──────────────────────────────────
function createBaseplateTexture(): THREE.CanvasTexture {
  const W = 1024;
  const H = 512;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  ctx.fillStyle = "#1c1f24";
  ctx.fillRect(0, 0, W, H);

  // Grain
  const grain = ctx.getImageData(0, 0, W, H);
  for (let i = 0; i < grain.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 5;
    grain.data[i] = Math.max(0, Math.min(255, grain.data[i] + n));
    grain.data[i + 1] = Math.max(0, Math.min(255, grain.data[i + 1] + n));
    grain.data[i + 2] = Math.max(0, Math.min(255, grain.data[i + 2] + n));
  }
  ctx.putImageData(grain, 0, 0);

  // Faint grid lines suggesting paving slabs — gives the courtyard a sense
  // of scale without competing with the strewn items.
  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  ctx.lineWidth = 1;
  const cell = 64;
  for (let x = 0; x <= W; x += cell) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += cell) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 16;
  tex.generateMipmaps = true;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2.4, 1.4);
  tex.needsUpdate = true;
  return tex;
}

// ── Paper sheet top-face texture ────────────────────────
function createPaperSheetTexture(tintHex: number): THREE.CanvasTexture {
  const W = 256;
  const H = 192;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  const base = new THREE.Color(tintHex).lerp(new THREE.Color(0xf6efd9), 0.35);
  const rgb = `rgb(${Math.round(base.r * 255)},${Math.round(base.g * 255)},${Math.round(base.b * 255)})`;
  ctx.fillStyle = rgb;
  ctx.fillRect(0, 0, W, H);

  // Subtle inset
  ctx.strokeStyle = "rgba(0,0,0,0.20)";
  ctx.lineWidth = 2;
  ctx.strokeRect(6, 6, W - 12, H - 12);

  // Page lines
  ctx.fillStyle = "rgba(0,0,0,0.30)";
  for (let i = 0; i < 6; i++) {
    const y = 28 + i * 24;
    const w = 70 + ((i * 53) % 130);
    ctx.fillRect(20, y, w, 3);
  }

  // Tint accent corner
  ctx.fillStyle = `rgba(${Math.round(base.r * 255)},${Math.round(base.g * 255)},${Math.round(base.b * 255)},0.6)`;
  ctx.fillRect(W - 60, 0, 60, 24);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 16;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}

// ── Envelope front-face texture ─────────────────────────
function createEnvelopeFaceTexture(tintHex: number): THREE.CanvasTexture {
  const W = 256;
  const H = 192;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  const base = new THREE.Color(tintHex);
  const rgb = `rgb(${Math.round(base.r * 255)},${Math.round(base.g * 255)},${Math.round(base.b * 255)})`;
  ctx.fillStyle = rgb;
  ctx.fillRect(0, 0, W, H);

  // Envelope flap V
  ctx.strokeStyle = "rgba(0,0,0,0.55)";
  ctx.lineWidth = 4;
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(20, 30);
  ctx.lineTo(W / 2, 110);
  ctx.lineTo(W - 20, 30);
  ctx.stroke();

  // Body outline
  ctx.strokeStyle = "rgba(0,0,0,0.42)";
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 30, W - 40, H - 60);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 16;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}

// ── Chat-bubble front-face texture ──────────────────────
function createChatBubbleFaceTexture(tintHex: number): THREE.CanvasTexture {
  const W = 256;
  const H = 192;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  const base = new THREE.Color(tintHex);
  const rgb = `rgb(${Math.round(base.r * 255)},${Math.round(base.g * 255)},${Math.round(base.b * 255)})`;
  ctx.fillStyle = rgb;
  ctx.fillRect(0, 0, W, H);

  // Bubble outline
  ctx.strokeStyle = "rgba(0,0,0,0.50)";
  ctx.lineWidth = 4;
  ctx.lineJoin = "round";
  const r = 28;
  const x0 = 22;
  const y0 = 30;
  const x1 = W - 22;
  const y1 = H - 60;
  ctx.beginPath();
  ctx.moveTo(x0 + r, y0);
  ctx.lineTo(x1 - r, y0);
  ctx.quadraticCurveTo(x1, y0, x1, y0 + r);
  ctx.lineTo(x1, y1 - r);
  ctx.quadraticCurveTo(x1, y1, x1 - r, y1);
  ctx.lineTo(x0 + r, y1);
  ctx.quadraticCurveTo(x0, y1, x0, y1 - r);
  ctx.lineTo(x0, y0 + r);
  ctx.quadraticCurveTo(x0, y0, x0 + r, y0);
  ctx.stroke();
  // Tail
  ctx.beginPath();
  ctx.moveTo(W * 0.30, y1);
  ctx.lineTo(W * 0.22, H - 24);
  ctx.lineTo(W * 0.42, y1);
  ctx.stroke();

  // Three little dots inside the bubble
  ctx.fillStyle = "rgba(0,0,0,0.50)";
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(W * 0.30 + i * 30, H * 0.40, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 16;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}

// ── Architectural label sprite ──────────────────────────
function createArchLabelSprite(text: string): {
  sprite: THREE.Sprite;
  material: THREE.SpriteMaterial;
  texture: THREE.CanvasTexture;
} {
  const W = 1024;
  const H = 192;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  ctx.clearRect(0, 0, W, H);

  const bgPad = 30;
  const bgX = bgPad;
  const bgY = 30;
  const bgW = W - bgPad * 2;
  const bgH = H - 60;
  const bgR = bgH / 2;
  ctx.beginPath();
  ctx.moveTo(bgX + bgR, bgY);
  ctx.lineTo(bgX + bgW - bgR, bgY);
  ctx.quadraticCurveTo(bgX + bgW, bgY, bgX + bgW, bgY + bgR);
  ctx.lineTo(bgX + bgW, bgY + bgH - bgR);
  ctx.quadraticCurveTo(bgX + bgW, bgY + bgH, bgX + bgW - bgR, bgY + bgH);
  ctx.lineTo(bgX + bgR, bgY + bgH);
  ctx.quadraticCurveTo(bgX, bgY + bgH, bgX, bgY + bgH - bgR);
  ctx.lineTo(bgX, bgY + bgR);
  ctx.quadraticCurveTo(bgX, bgY, bgX + bgR, bgY);
  ctx.closePath();
  ctx.fillStyle = "rgba(12,12,16,0.78)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.beginPath();
  ctx.arc(bgX + 28, H / 2, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(bgX + bgW - 28, H / 2, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.96)";
  ctx.font =
    "600 56px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(text, W / 2, H / 2 + 2);

  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    depthTest: false,
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(2.8, 0.53, 1);
  sprite.renderOrder = 5;
  return { sprite, material, texture };
}

// ── Textured slab (one box, 6 face materials) ──────────
interface SlabHandle {
  group: THREE.Group;
  mesh: THREE.Mesh;
  materials: THREE.MeshBasicMaterial[];
  edgeMaterial: THREE.LineBasicMaterial;
  edgeGeometry: THREE.EdgesGeometry;
  meshGeometry: THREE.BoxGeometry;
}

function createTexturedSlab(opts: {
  w: number;
  h: number;
  d: number;
  baseColor: number;
  topTexture?: THREE.Texture;
  sideTexture?: THREE.Texture;
  frontTexture?: THREE.Texture;
  edgeOpacity?: number;
  edgeColor?: number;
}): SlabHandle {
  const {
    w,
    h,
    d,
    baseColor,
    topTexture,
    sideTexture,
    frontTexture,
    edgeOpacity = 0.32,
    edgeColor,
  } = opts;
  const geo = new THREE.BoxGeometry(w, h, d);
  geo.translate(0, h / 2, 0);

  const c = new THREE.Color(baseColor);
  const sideBright = c.clone().multiplyScalar(0.94).getHex();
  const sideDark = c.clone().multiplyScalar(0.78).getHex();
  const resolvedEdge =
    edgeColor !== undefined ? edgeColor : c.clone().multiplyScalar(0.30).getHex();

  const sideMat = (fallback: number) =>
    sideTexture
      ? new THREE.MeshBasicMaterial({ map: sideTexture })
      : new THREE.MeshBasicMaterial({ color: fallback });

  const mPlusX = sideMat(sideBright);
  const mMinusX = sideMat(sideBright);
  const mPlusY = topTexture
    ? new THREE.MeshBasicMaterial({ map: topTexture })
    : new THREE.MeshBasicMaterial({ color: c.clone().multiplyScalar(1.05).getHex() });
  const mMinusY = new THREE.MeshBasicMaterial({ color: sideDark });
  const mPlusZ = frontTexture
    ? new THREE.MeshBasicMaterial({ map: frontTexture })
    : sideMat(sideDark);
  const mMinusZ = sideMat(sideDark);

  const materials = [mPlusX, mMinusX, mPlusY, mMinusY, mPlusZ, mMinusZ];
  const mesh = new THREE.Mesh(geo, materials);

  const edges = new THREE.EdgesGeometry(geo);
  const edgeMaterial = new THREE.LineBasicMaterial({
    color: resolvedEdge,
    transparent: true,
    opacity: edgeOpacity,
  });
  const lines = new THREE.LineSegments(edges, edgeMaterial);

  const group = new THREE.Group();
  group.add(mesh);
  group.add(lines);

  return {
    group,
    mesh,
    materials,
    edgeMaterial,
    edgeGeometry: edges,
    meshGeometry: geo,
  };
}

// ── Component ──────────────────────────────────────────
export default function Courtyard() {
  const mountRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const lookAtRef = useRef<THREE.Vector3>(LOOKAT_INITIAL.clone());
  const startTimeRef = useRef(performance.now());

  const [elevation, setElevation] = useState(INITIAL_ELEVATION);
  const [azimuth, setAzimuth] = useState(INITIAL_AZIMUTH);
  const [frustum, setFrustum] = useState(INITIAL_FRUSTUM);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    const stored = window.localStorage.getItem("lf-theme");
    return stored === "light" || stored === "dark" ? stored : "dark";
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("lf-theme", theme);
  }, [theme]);

  const entranceFrameRef = useRef<number | null>(null);
  const userInteractedRef = useRef(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    const scene = new THREE.Scene();

    let aspect = width / height;
    const camera = new THREE.OrthographicCamera(
      (-INITIAL_FRUSTUM * aspect) / 2,
      (INITIAL_FRUSTUM * aspect) / 2,
      INITIAL_FRUSTUM / 2,
      -INITIAL_FRUSTUM / 2,
      0.1,
      1000,
    );
    {
      const e = (INITIAL_ELEVATION * Math.PI) / 180;
      const a = (INITIAL_AZIMUTH * Math.PI) / 180;
      camera.position.set(
        CAM_DIST * Math.cos(e) * Math.sin(a),
        CAM_DIST * Math.sin(e),
        CAM_DIST * Math.cos(e) * Math.cos(a),
      );
      camera.lookAt(LOOKAT_INITIAL);
    }
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const disposables: Array<{ dispose: () => void }> = [];

    // ── Baseplate ──
    const baseplateTex = createBaseplateTexture();
    disposables.push(baseplateTex);
    const baseplate = createTexturedSlab({
      w: BASEPLATE_W,
      h: BASEPLATE_H,
      d: BASEPLATE_D,
      baseColor: 0x1c1f24,
      topTexture: baseplateTex,
      edgeOpacity: 0.18,
      edgeColor: 0x000000,
    });
    baseplate.group.position.set(0, 0, 0);
    scene.add(baseplate.group);
    disposables.push(
      baseplate.meshGeometry,
      baseplate.edgeGeometry,
      baseplate.edgeMaterial,
    );
    for (const m of baseplate.materials) disposables.push(m);

    // ── Process Record building (left) ──
    const processFaceTex = createBuildingFaceTexture({
      baseHex: 0xd8c9a8,
      accent: "vertical-slits",
    });
    const processRoofTex = createBuildingRoofTexture(0xd8c9a8);
    disposables.push(processFaceTex, processRoofTex);
    const processBuilding = createTexturedSlab({
      w: PROCESS_W,
      h: PROCESS_H,
      d: PROCESS_D,
      baseColor: 0xd8c9a8,
      sideTexture: processFaceTex,
      frontTexture: processFaceTex,
      topTexture: processRoofTex,
      edgeOpacity: 0.42,
      edgeColor: 0x4a3f28,
    });
    processBuilding.group.position.set(PROCESS_X, BASEPLATE_H, 0);
    scene.add(processBuilding.group);
    disposables.push(
      processBuilding.meshGeometry,
      processBuilding.edgeGeometry,
      processBuilding.edgeMaterial,
    );
    for (const m of processBuilding.materials) disposables.push(m);

    // ── Quality Record building (right) ──
    const qualityFaceTex = createBuildingFaceTexture({
      baseHex: 0xa8b4c5,
      accent: "horizontal-louvers",
      severityStripe: true,
    });
    const qualityRoofTex = createBuildingRoofTexture(0xa8b4c5);
    disposables.push(qualityFaceTex, qualityRoofTex);
    const qualityBuilding = createTexturedSlab({
      w: QUALITY_W,
      h: QUALITY_H,
      d: QUALITY_D,
      baseColor: 0xa8b4c5,
      sideTexture: qualityFaceTex,
      frontTexture: qualityFaceTex,
      topTexture: qualityRoofTex,
      edgeOpacity: 0.42,
      edgeColor: 0x2a3340,
    });
    qualityBuilding.group.position.set(QUALITY_X, BASEPLATE_H, 0);
    scene.add(qualityBuilding.group);
    disposables.push(
      qualityBuilding.meshGeometry,
      qualityBuilding.edgeGeometry,
      qualityBuilding.edgeMaterial,
    );
    for (const m of qualityBuilding.materials) disposables.push(m);

    // ── Courtyard scatter ──
    // The strewn coordination items between the two buildings. Density is
    // the message: this is the tax. Items use the SoC palette (matching the
    // layer colors in Blank.tsx) so the visual vocabulary stays consistent.
    const rng = seededRng(914);
    const pickColor = () => SOC_COLORS[Math.floor(rng() * SOC_COLORS.length)];

    type ItemKind = "paper" | "envelope" | "bubble" | "thread";
    interface ItemSpec {
      kind: ItemKind;
      x: number;
      z: number;
      yOffset: number;       // float height above baseplate top
      rotY: number;
      tint: number;
      scale: number;
    }

    const items: ItemSpec[] = [];
    // Paper sheets — lots, low to the floor, slight float at varying heights
    for (let i = 0; i < 14; i++) {
      items.push({
        kind: "paper",
        x: COURTYARD_X_MIN + rng() * (COURTYARD_X_MAX - COURTYARD_X_MIN),
        z: COURTYARD_Z_MIN + rng() * (COURTYARD_Z_MAX - COURTYARD_Z_MIN),
        yOffset: 0.02 + rng() * 0.4,
        rotY: rng() * Math.PI * 2,
        tint: pickColor(),
        scale: 0.85 + rng() * 0.4,
      });
    }
    // Envelopes
    for (let i = 0; i < 8; i++) {
      items.push({
        kind: "envelope",
        x: COURTYARD_X_MIN + rng() * (COURTYARD_X_MAX - COURTYARD_X_MIN),
        z: COURTYARD_Z_MIN + rng() * (COURTYARD_Z_MAX - COURTYARD_Z_MIN),
        yOffset: 0.05 + rng() * 0.6,
        rotY: rng() * Math.PI * 2,
        tint: pickColor(),
        scale: 0.9 + rng() * 0.35,
      });
    }
    // Chat bubbles
    for (let i = 0; i < 6; i++) {
      items.push({
        kind: "bubble",
        x: COURTYARD_X_MIN + rng() * (COURTYARD_X_MAX - COURTYARD_X_MIN),
        z: COURTYARD_Z_MIN + rng() * (COURTYARD_Z_MAX - COURTYARD_Z_MIN),
        yOffset: 0.3 + rng() * 1.0, // bubbles float higher (in conversation)
        rotY: rng() * Math.PI * 2,
        tint: pickColor(),
        scale: 0.85 + rng() * 0.3,
      });
    }
    // Thread piles (vertical stacks of thin tiles)
    for (let i = 0; i < 4; i++) {
      items.push({
        kind: "thread",
        x: COURTYARD_X_MIN + rng() * (COURTYARD_X_MAX - COURTYARD_X_MIN),
        z: COURTYARD_Z_MIN + rng() * (COURTYARD_Z_MAX - COURTYARD_Z_MIN),
        yOffset: 0,
        rotY: (rng() - 0.5) * 0.6,
        tint: pickColor(),
        scale: 0.9 + rng() * 0.3,
      });
    }

    // Build geometry for each item
    for (const it of items) {
      let group: THREE.Group;
      let geomDisposables: { dispose: () => void }[] = [];

      if (it.kind === "paper") {
        const tex = createPaperSheetTexture(it.tint);
        disposables.push(tex);
        const slab = createTexturedSlab({
          w: 0.85 * it.scale,
          h: 0.04,
          d: 0.62 * it.scale,
          baseColor: 0xf0e8c6,
          topTexture: tex,
          edgeOpacity: 0.30,
          edgeColor: 0x4a3f28,
        });
        slab.group.rotation.y = it.rotY;
        // slight tilt so it doesn't look perfectly aligned
        slab.group.rotation.x = (rng() - 0.5) * 0.06;
        slab.group.rotation.z = (rng() - 0.5) * 0.06;
        slab.group.position.set(it.x, COURTYARD_FLOOR_Y + it.yOffset, it.z);
        group = slab.group;
        geomDisposables = [
          slab.meshGeometry,
          slab.edgeGeometry,
          slab.edgeMaterial,
          ...slab.materials,
        ];
      } else if (it.kind === "envelope") {
        const tex = createEnvelopeFaceTexture(it.tint);
        disposables.push(tex);
        const slab = createTexturedSlab({
          w: 0.42 * it.scale,
          h: 0.30 * it.scale,
          d: 0.30 * it.scale,
          baseColor: it.tint,
          frontTexture: tex,
          edgeOpacity: 0.40,
        });
        slab.group.rotation.y = it.rotY;
        slab.group.position.set(it.x, COURTYARD_FLOOR_Y + it.yOffset, it.z);
        group = slab.group;
        geomDisposables = [
          slab.meshGeometry,
          slab.edgeGeometry,
          slab.edgeMaterial,
          ...slab.materials,
        ];
      } else if (it.kind === "bubble") {
        const tex = createChatBubbleFaceTexture(it.tint);
        disposables.push(tex);
        const slab = createTexturedSlab({
          w: 0.55 * it.scale,
          h: 0.40 * it.scale,
          d: 0.20 * it.scale,
          baseColor: it.tint,
          frontTexture: tex,
          edgeOpacity: 0.40,
        });
        slab.group.rotation.y = it.rotY;
        slab.group.position.set(it.x, COURTYARD_FLOOR_Y + it.yOffset, it.z);
        group = slab.group;
        geomDisposables = [
          slab.meshGeometry,
          slab.edgeGeometry,
          slab.edgeMaterial,
          ...slab.materials,
        ];
      } else {
        // Thread pile — a few stacked tiles
        const pile = new THREE.Group();
        const tileCount = 3 + Math.floor(rng() * 3);
        let yCursor = 0;
        for (let i = 0; i < tileCount; i++) {
          const tileH = 0.07 + rng() * 0.05;
          const slab = createTexturedSlab({
            w: 0.50 * it.scale,
            h: tileH,
            d: 0.34 * it.scale,
            baseColor: SOC_COLORS[Math.floor(rng() * SOC_COLORS.length)],
            edgeOpacity: 0.36,
          });
          slab.group.position.set(
            (rng() - 0.5) * 0.04,
            yCursor,
            (rng() - 0.5) * 0.04,
          );
          pile.add(slab.group);
          geomDisposables.push(
            slab.meshGeometry,
            slab.edgeGeometry,
            slab.edgeMaterial,
            ...slab.materials,
          );
          yCursor += tileH + 0.005;
        }
        pile.rotation.y = it.rotY;
        pile.position.set(it.x, COURTYARD_FLOOR_Y, it.z);
        group = pile;
      }

      scene.add(group);
      for (const d of geomDisposables) disposables.push(d);
    }

    // ── Architectural labels: PROCESS RECORD / QUALITY RECORD ──
    // Floating sprite labels above each building, fade in after the camera
    // tilt completes.
    const processLabel = createArchLabelSprite("PROCESS RECORD");
    processLabel.sprite.position.set(PROCESS_X, BASEPLATE_H + PROCESS_H + 0.7, 0);
    scene.add(processLabel.sprite);
    disposables.push(processLabel.material, processLabel.texture);

    const qualityLabel = createArchLabelSprite("QUALITY RECORD");
    qualityLabel.sprite.position.set(QUALITY_X, BASEPLATE_H + QUALITY_H + 0.7, 0);
    scene.add(qualityLabel.sprite);
    disposables.push(qualityLabel.material, qualityLabel.texture);

    // ── Animation loop ──
    startTimeRef.current = performance.now();
    let frameId = 0;
    const animate = () => {
      const t = (performance.now() - startTimeRef.current) / 1000;

      // Labels fade in after the tilt-down lands.
      const LABEL_START = 2.6;
      const LABEL_DURATION = 0.8;
      const labelT = Math.max(
        0,
        Math.min((t - LABEL_START) / LABEL_DURATION, 1),
      );
      const labelEased = 1 - Math.pow(1 - labelT, 3);
      processLabel.material.opacity = 1.0 * labelEased;
      qualityLabel.material.opacity = 1.0 * labelEased;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!mountRef.current) return;
      width = mountRef.current.clientWidth;
      height = mountRef.current.clientHeight;
      aspect = width / height;
      const f =
        (cameraRef.current && cameraRef.current.top * 2) || INITIAL_FRUSTUM;
      camera.left = (-f * aspect) / 2;
      camera.right = (f * aspect) / 2;
      camera.top = f / 2;
      camera.bottom = -f / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      for (const d of disposables) {
        try {
          d.dispose();
        } catch {
          /* noop */
        }
      }
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      cameraRef.current = null;
    };
  }, []);

  // Camera position from elevation/azimuth, lookAt from ref
  useEffect(() => {
    const cam = cameraRef.current;
    if (!cam) return;
    const e = (elevation * Math.PI) / 180;
    const a = (azimuth * Math.PI) / 180;
    cam.position.set(
      CAM_DIST * Math.cos(e) * Math.sin(a),
      CAM_DIST * Math.sin(e),
      CAM_DIST * Math.cos(e) * Math.cos(a),
    );
    cam.lookAt(lookAtRef.current);
  }, [elevation, azimuth]);

  // Frustum
  useEffect(() => {
    const cam = cameraRef.current;
    const m = mountRef.current;
    if (!cam || !m) return;
    const aspect = m.clientWidth / m.clientHeight;
    cam.left = (-frustum * aspect) / 2;
    cam.right = (frustum * aspect) / 2;
    cam.top = frustum / 2;
    cam.bottom = -frustum / 2;
    cam.updateProjectionMatrix();
  }, [frustum]);

  // Entrance: tween elevation/azimuth/frustum/lookAt over 2.4s
  const startEntranceAnimation = useCallback(() => {
    if (entranceFrameRef.current !== null) {
      cancelAnimationFrame(entranceFrameRef.current);
    }
    userInteractedRef.current = false;
    setElevation(INITIAL_ELEVATION);
    setAzimuth(INITIAL_AZIMUTH);
    setFrustum(INITIAL_FRUSTUM);
    lookAtRef.current.copy(LOOKAT_INITIAL);
    const start = performance.now();
    const tick = () => {
      if (userInteractedRef.current) {
        entranceFrameRef.current = null;
        return;
      }
      const t = Math.min(
        (performance.now() - start) / ENTRANCE_DURATION,
        1,
      );
      const eased = easeInOutCubic(t);
      setElevation(
        INITIAL_ELEVATION +
          (DEFAULT_ELEVATION - INITIAL_ELEVATION) * eased,
      );
      setAzimuth(
        INITIAL_AZIMUTH + (DEFAULT_AZIMUTH - INITIAL_AZIMUTH) * eased,
      );
      setFrustum(
        INITIAL_FRUSTUM + (DEFAULT_FRUSTUM - INITIAL_FRUSTUM) * eased,
      );
      lookAtRef.current.lerpVectors(LOOKAT_INITIAL, LOOKAT_DEFAULT, eased);
      const cam = cameraRef.current;
      if (cam) cam.lookAt(lookAtRef.current);
      if (t < 1) {
        entranceFrameRef.current = requestAnimationFrame(tick);
      } else {
        entranceFrameRef.current = null;
      }
    };
    entranceFrameRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    startEntranceAnimation();
    return () => {
      if (entranceFrameRef.current !== null) {
        cancelAnimationFrame(entranceFrameRef.current);
        entranceFrameRef.current = null;
      }
    };
  }, [startEntranceAnimation]);

  const cancelEntrance = useCallback(() => {
    userInteractedRef.current = true;
    if (entranceFrameRef.current !== null) {
      cancelAnimationFrame(entranceFrameRef.current);
      entranceFrameRef.current = null;
    }
  }, []);

  const handleZoomChange = useCallback(
    (v: number) => {
      cancelEntrance();
      setFrustum(v);
    },
    [cancelEntrance],
  );

  const handleAzimuthChange = useCallback(
    (v: number) => {
      cancelEntrance();
      setAzimuth(v);
    },
    [cancelEntrance],
  );

  const handleElevationChange = useCallback(
    (v: number) => {
      cancelEntrance();
      setElevation(v);
    },
    [cancelEntrance],
  );

  const replay = useCallback(() => {
    startTimeRef.current = performance.now();
    startEntranceAnimation();
  }, [startEntranceAnimation]);

  const resetCamera = useCallback(() => {
    cancelEntrance();
    setElevation(DEFAULT_ELEVATION);
    setAzimuth(DEFAULT_AZIMUTH);
    setFrustum(DEFAULT_FRUSTUM);
    lookAtRef.current.copy(LOOKAT_DEFAULT);
    const cam = cameraRef.current;
    if (cam) cam.lookAt(lookAtRef.current);
  }, [cancelEntrance]);

  return (
    <div className="lf-root" data-theme={theme}>
      <style>{LF_STYLES}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;550;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <nav className="lf-nav">
        <div className="lf-nav-inner">
          <Link to="/linear-flow" className="lf-nav-logo" aria-label="Unifize">
            <img src="/Link - home.svg" alt="Unifize" className="lf-nav-logo-img" />
          </Link>
          <div className="lf-nav-items">
            <a href="#problem">The Problem</a>
            <a href="#world">Your World</a>
            <a href="#industry">By Industry</a>
            <a href="#how">How It Works</a>
            <a href="#proof">Proof</a>
          </div>
          <div className="lf-nav-actions">
            <a href="#login" className="lf-nav-link">Log in</a>
            <button
              type="button"
              className="lf-theme-toggle"
              onClick={() => setTheme((tt) => (tt === "dark" ? "light" : "dark"))}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={theme === "light"}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
            <button className="lf-nav-btn">Book a demo</button>
          </div>
        </div>
      </nav>

      {/* Visual */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          height: "100vh",
          background:
            "radial-gradient(ellipse at center, #1c1c1d 0%, #131313 60%, #0a0a0b 100%)",
        }}
      >
        <style>{`
          @keyframes courtyardSectionFade {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes courtyardCaptionFade {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <div ref={mountRef} className="absolute inset-0 h-full w-full" />

        {/* Section identifier — top-left of the visual */}
        <div
          className="pointer-events-none absolute top-6 left-8 z-10 md:top-8 md:left-12"
          style={{ animation: "courtyardSectionFade 0.9s ease-out 0.2s both" }}
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
            Courtyard
          </div>
          <div className="mt-1 font-serif text-base font-medium text-white/85 md:text-lg">
            Two buildings. One gap.
          </div>
        </div>

        {/* Bottom caption — fades in after the tilt and labels land */}
        <div
          className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center md:bottom-10"
          style={{ animation: "courtyardCaptionFade 1s ease-out 3.6s both" }}
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 md:text-[11px]">
            <span className="text-white/65">two records</span>
            <span className="mx-3 text-white/25">·</span>
            <span className="text-white/65">one courtyard</span>
            <span className="mx-3 text-white/25">·</span>
            <span className="text-white/65">the gap is the tax</span>
          </div>
          <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.22em] text-white/25 md:text-[10px]">
            tilt the camera. the cost was always there.
          </div>
        </div>

        {/* Controls panel */}
        <div className="absolute top-4 right-4 z-10 group">
          <button
            type="button"
            className="bg-black/70 backdrop-blur border border-white/15 text-white/90 px-3 py-2 rounded font-mono text-[11px] tracking-wide hover:bg-black/90"
          >
            CONTROLS
          </button>
          <div className="hidden group-hover:block absolute top-full right-0 mt-2 w-72 bg-black/90 backdrop-blur border border-white/15 rounded p-4 font-mono text-[11px] text-white/90">
            <ControlSlider
              label="Elevation"
              unit="°"
              min={1}
              max={90}
              step={0.1}
              value={elevation}
              onChange={handleElevationChange}
            />
            <ControlSlider
              label="Azimuth"
              unit="°"
              min={-30}
              max={60}
              step={0.1}
              value={azimuth}
              onChange={handleAzimuthChange}
            />
            <ControlSlider
              label="Zoom"
              unit=""
              min={6}
              max={28}
              step={0.1}
              value={frustum}
              onChange={handleZoomChange}
              invert
            />
            <div className="flex gap-2 pt-2 border-t border-white/10 mt-2">
              <button
                type="button"
                onClick={resetCamera}
                className="flex-1 border border-white/15 hover:bg-white/10 py-1.5 px-2 rounded uppercase tracking-wide"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={replay}
                className="flex-1 border border-white/15 hover:bg-white/10 py-1.5 px-2 rounded uppercase tracking-wide"
              >
                Replay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SunIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function ControlSlider({
  label,
  unit,
  min,
  max,
  step,
  value,
  onChange,
  invert,
}: {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  invert?: boolean;
}) {
  return (
    <div className="py-1.5">
      <div className="flex justify-between mb-1">
        <span>{label}</span>
        <span className="text-white/60">
          {value.toFixed(1)}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={invert ? min + max - value : value}
        onChange={(e) =>
          onChange(invert ? min + max - +e.target.value : +e.target.value)
        }
        className="w-full accent-blue-500"
      />
    </div>
  );
}
