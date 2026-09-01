import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ── Visuals ─────────────────────────────────────────────
const EDGE = 0x000000;
const PAPER_TOP_HEX = 0xf4eed8;
const PAPER_SIDE_HEX = 0xd8d2bc;

// ── Camera ──────────────────────────────────────────────
const INITIAL_ELEVATION = 90;
const DEFAULT_ELEVATION = 30;
const INITIAL_AZIMUTH = 0; // pure top-down so document text reads upright
const DEFAULT_AZIMUTH = 20;
const INITIAL_FRUSTUM = 6;
const DEFAULT_FRUSTUM = 7.5;
const CAM_DIST = 35;
const ENTRANCE_DURATION = 2200; // ms
const LOOKAT_INITIAL = new THREE.Vector3(0, 2.5, 0); // top of tower in top-down
const LOOKAT_DEFAULT = new THREE.Vector3(0, 1.4, 0); // tower midpoint in iso

// ── Animation ───────────────────────────────────────────
const GRID_TARGET_OPACITY = 0.22;
const GRID_FADE_DURATION = 0.6;

// ── Record dimensions ───────────────────────────────────
const RECORD_W = 4;
const RECORD_H = 0.5;
const RECORD_D = 5;

// ── Layers (same footprint as record so they hide directly under it from top-down) ──
const LAYER_W = RECORD_W;
const LAYER_D = RECORD_D;

type IconType =
  | "envelope"
  | "meeting"
  | "chat"
  | "draft"
  | "decision"
  | "call"
  | "revision"
  | "mention";

interface LayerSpec {
  type: string;
  h: number;
  color: number;
  icon: IconType;
}

// Order: bottom of stack → top. The record sits on top of the last layer.
// Palette is a desaturated, harmonious cream-blue-sage range — papers in subtly
// different shades, like an aged stack pulled from different folders.
const LAYERS: LayerSpec[] = [
  { type: "EMAIL THREAD", h: 0.30, color: 0xd6cba0, icon: "envelope" },
  { type: "MEETING", h: 0.26, color: 0xb4bcc8, icon: "meeting" },
  { type: "CHAT THREAD", h: 0.32, color: 0xc8d4e4, icon: "chat" },
  { type: "DRAFT", h: 0.28, color: 0xdccfa6, icon: "draft" },
  { type: "DECISION", h: 0.24, color: 0xc0b298, icon: "decision" },
  { type: "CALL", h: 0.30, color: 0xb4bea8, icon: "call" },
  { type: "REVISION", h: 0.28, color: 0xccc0a8, icon: "revision" },
  { type: "MENTION", h: 0.26, color: 0xdcccaa, icon: "mention" },
];

// ── Easing ──────────────────────────────────────────────
function easeInOutCubic(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

// ── Document texture (top face of record) ───────────────
function createDocumentTexture(): THREE.CanvasTexture {
  const W = 1536;
  const H = 2048;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  // Subtle paper gradient (warmer at center, cooler at edges)
  const bgGrad = ctx.createRadialGradient(
    W / 2,
    H / 2,
    Math.min(W, H) / 4,
    W / 2,
    H / 2,
    Math.max(W, H),
  );
  bgGrad.addColorStop(0, "#f6efd9");
  bgGrad.addColorStop(1, "#ede6cd");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Paper grain — very subtle noise
  const grain = ctx.getImageData(0, 0, W, H);
  for (let i = 0; i < grain.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 8;
    grain.data[i] = Math.max(0, Math.min(255, grain.data[i] + n));
    grain.data[i + 1] = Math.max(0, Math.min(255, grain.data[i + 1] + n));
    grain.data[i + 2] = Math.max(0, Math.min(255, grain.data[i + 2] + n));
  }
  ctx.putImageData(grain, 0, 0);

  // Refined inner border — thin, double-line
  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 40, W - 80, H - 80);
  ctx.strokeStyle = "rgba(26,26,26,0.35)";
  ctx.lineWidth = 1;
  ctx.strokeRect(54, 54, W - 108, H - 108);

  ctx.fillStyle = "#1a1a1a";
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";

  // Header — large, refined
  ctx.font =
    "700 64px ui-sans-serif, system-ui, -apple-system, 'Inter', sans-serif";
  ctx.fillText("DOCUMENT NUMBER", 110, 192);

  ctx.font =
    "500 88px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillStyle = "#1a1a1a";
  ctx.fillText("SOP-2024-072", 110, 290);

  // Subhead with elegant separator
  ctx.font =
    "400 38px ui-sans-serif, system-ui, -apple-system, 'Inter', sans-serif";
  ctx.fillStyle = "#5a5340";
  ctx.fillText("Procedure", 110, 352);
  ctx.fillStyle = "#9a9078";
  ctx.fillText("·", 308, 352);
  ctx.fillStyle = "#5a5340";
  ctx.fillText("Effective 2024-03-01", 332, 352);

  // Section divider — refined
  ctx.strokeStyle = "#a89e80";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(110, 412);
  ctx.lineTo(W - 110, 412);
  ctx.stroke();

  // Section heading
  ctx.font =
    "600 44px ui-sans-serif, system-ui, -apple-system, 'Inter', sans-serif";
  ctx.fillStyle = "#3a3528";
  ctx.fillText("REVISION HISTORY", 110, 504);

  // Table headers
  const cols = [
    { x: 110, label: "REV" },
    { x: 358, label: "DATE" },
    { x: 668, label: "DESCRIPTION" },
    { x: 1200, label: "AUTHOR" },
  ];
  ctx.font = "600 28px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillStyle = "#7a7058";
  ctx.letterSpacing = "1.2px";
  for (const col of cols) ctx.fillText(col.label, col.x, 600);

  // Table top border (heavier)
  ctx.strokeStyle = "#3a3528";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(110, 624);
  ctx.lineTo(W - 110, 624);
  ctx.stroke();

  // Rows
  ctx.font = "400 36px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillStyle = "#1a1a1a";
  const rows = [
    { rev: "Rev 01", date: "2023-01-15", desc: "Initial", author: "J. Cho", y: 716 },
    { rev: "Rev 02", date: "2023-08-22", desc: "Cleanup edits", author: "J. Cho", y: 824 },
    { rev: "Rev 03", date: "2023-11-10", desc: "Tolerance update", author: "K. Lee", y: 932 },
    { rev: "Rev 04", date: "2024-03-01", desc: "Step 4 added", author: "K. Lee", y: 1040 },
  ];
  for (const r of rows) {
    ctx.fillText(r.rev, cols[0].x, r.y);
    ctx.fillText(r.date, cols[1].x, r.y);
    ctx.fillText(r.desc, cols[2].x, r.y);
    ctx.fillText(r.author, cols[3].x, r.y);
    ctx.strokeStyle = "#cdc7af";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(110, r.y + 36);
    ctx.lineTo(W - 110, r.y + 36);
    ctx.stroke();
  }

  // Footer divider
  ctx.strokeStyle = "#a89e80";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(110, 1340);
  ctx.lineTo(W - 110, 1340);
  ctx.stroke();

  // Current revision callout
  ctx.font =
    "600 32px ui-sans-serif, system-ui, -apple-system, 'Inter', sans-serif";
  ctx.fillStyle = "#7a7058";
  ctx.letterSpacing = "1.2px";
  ctx.fillText("CURRENT REVISION", 110, 1432);
  ctx.font =
    "700 60px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillStyle = "#1a1a1a";
  ctx.fillText("04", 110, 1508);

  ctx.font =
    "600 28px ui-sans-serif, system-ui, -apple-system, 'Inter', sans-serif";
  ctx.fillStyle = "#7a7058";
  ctx.letterSpacing = "1.2px";
  ctx.fillText("APPROVED BY", 480, 1432);
  ctx.font =
    "500 38px ui-sans-serif, system-ui, -apple-system, 'Inter', sans-serif";
  ctx.fillStyle = "#1a1a1a";
  ctx.fillText("K. Lee", 480, 1494);
  ctx.font =
    "400 28px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillStyle = "#5a5340";
  ctx.fillText("3 / 1 / 24", 480, 1538);

  // Signature lines
  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(110, 1740);
  ctx.lineTo(640, 1740);
  ctx.stroke();
  ctx.font = "500 22px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillStyle = "#7a7058";
  ctx.letterSpacing = "1.5px";
  ctx.fillText("SIGNATURE", 110, 1772);

  ctx.beginPath();
  ctx.moveTo(720, 1740);
  ctx.lineTo(W - 110, 1740);
  ctx.stroke();
  ctx.fillText("DATE", 720, 1772);

  // Footer metadata
  ctx.font = "500 22px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillStyle = "#9a9078";
  ctx.letterSpacing = "1.2px";
  ctx.fillText("PAGE 1 OF 1", 110, 1968);
  ctx.textAlign = "right";
  ctx.fillText("CONFIDENTIAL  ·  QMS-CONTROLLED", W - 110, 1968);
  ctx.textAlign = "left";
  ctx.letterSpacing = "0px";

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 16;
  tex.generateMipmaps = true;
  tex.center.set(0.5, 0.5);
  tex.needsUpdate = true;
  return tex;
}

// ── Record side-face texture (paper-stack striations) ──
function createPaperStackSideTexture(): THREE.CanvasTexture {
  const W = 1024;
  const H = 96;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  // Cream paper gradient — slightly darker at top (shadow from above) and bottom edge
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#dcd2b0");
  grad.addColorStop(0.12, "#ebe2c2");
  grad.addColorStop(0.5, "#efe7cb");
  grad.addColorStop(0.88, "#e6dcbd");
  grad.addColorStop(1, "#cfc5a4");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Top edge — fine shadow line (where the document sits on top)
  ctx.fillStyle = "rgba(60,50,30,0.35)";
  ctx.fillRect(0, 0, W, 2);
  ctx.fillStyle = "rgba(60,50,30,0.18)";
  ctx.fillRect(0, 2, W, 1);

  // Bottom edge — soft contact line where the record meets the layer below
  ctx.fillStyle = "rgba(60,50,30,0.30)";
  ctx.fillRect(0, H - 1, W, 1);

  // Paper-sheet striations through the body
  const numSheets = 14;
  const startY = 6;
  const endY = H - 4;
  const span = endY - startY;
  for (let i = 1; i < numSheets; i++) {
    const y = startY + (span / numSheets) * i;
    // Subtle dark line — the edge of one paper sheet
    ctx.fillStyle = "rgba(110,95,60,0.22)";
    ctx.fillRect(0, y, W, 0.8);
    // Faint highlight just below the line
    ctx.fillStyle = "rgba(255,245,210,0.16)";
    ctx.fillRect(0, y + 1, W, 0.6);

    // Per-sheet random horizontal nicks (worn paper texture)
    ctx.fillStyle = "rgba(110,95,60,0.10)";
    const nickStart = ((i * 91) % W);
    const nickWidth = 30 + ((i * 43) % 90);
    ctx.fillRect(nickStart, y + 0.2, nickWidth, 0.4);
  }

  // Subtle vertical noise (sheets aren't perfectly stacked)
  for (let x = 0; x < W; x += 3) {
    if ((x * 7) % 11 === 0) {
      ctx.fillStyle = "rgba(110,95,60,0.04)";
      ctx.fillRect(x, 4, 1, H - 8);
    }
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

// ── Solid icon drawing for layer labels ────────────────
function drawSolidIcon(
  ctx: CanvasRenderingContext2D,
  type: IconType,
  cx: number,
  cy: number,
  size: number,
  fillCss: string,
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = fillCss;
  ctx.strokeStyle = fillCss;
  const s = size;

  if (type === "envelope") {
    // Filled body
    const w = s;
    const h = s * 0.7;
    ctx.fillRect(-w / 2, -h / 2, w, h);
    // Flap V — drawn as light strokes on top of body
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = s * 0.07;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(-w / 2, -h / 2);
    ctx.lineTo(0, h * 0.05);
    ctx.lineTo(w / 2, -h / 2);
    ctx.stroke();
  } else if (type === "meeting") {
    // 3 heads + shoulders silhouette
    const r = s * 0.13;
    const headY = -s * 0.16;
    const positions = [-s * 0.3, 0, s * 0.3];
    for (const x of positions) {
      ctx.beginPath();
      ctx.arc(x, headY, r, 0, Math.PI * 2);
      ctx.fill();
    }
    // Shoulders — overlapping bumps
    const sr = r * 1.6;
    const sy = s * 0.18;
    for (const x of positions) {
      ctx.beginPath();
      ctx.arc(x, sy, sr, Math.PI, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
  } else if (type === "chat") {
    // Rounded rectangle bubble
    const w = s * 0.95;
    const h = s * 0.7;
    const r = s * 0.18;
    ctx.beginPath();
    ctx.moveTo(-w / 2 + r, -h / 2);
    ctx.lineTo(w / 2 - r, -h / 2);
    ctx.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    ctx.lineTo(w / 2, h / 2 - r);
    ctx.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    ctx.lineTo(-w / 2 + r, h / 2);
    ctx.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    ctx.lineTo(-w / 2, -h / 2 + r);
    ctx.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    ctx.closePath();
    ctx.fill();
    // Tail
    ctx.beginPath();
    ctx.moveTo(-w * 0.22, h / 2);
    ctx.lineTo(-w * 0.32, h / 2 + s * 0.18);
    ctx.lineTo(-w * 0.05, h / 2);
    ctx.closePath();
    ctx.fill();
  } else if (type === "draft") {
    // Page with folded corner
    const w = s * 0.78;
    const h = s * 0.95;
    const fold = s * 0.2;
    ctx.beginPath();
    ctx.moveTo(-w / 2, -h / 2);
    ctx.lineTo(w / 2 - fold, -h / 2);
    ctx.lineTo(w / 2, -h / 2 + fold);
    ctx.lineTo(w / 2, h / 2);
    ctx.lineTo(-w / 2, h / 2);
    ctx.closePath();
    ctx.fill();
    // Folded-corner indicator (slightly lighter triangle)
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.beginPath();
    ctx.moveTo(w / 2 - fold, -h / 2);
    ctx.lineTo(w / 2 - fold, -h / 2 + fold);
    ctx.lineTo(w / 2, -h / 2 + fold);
    ctx.closePath();
    ctx.fill();
    // Page lines
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    const lineYs = [-h * 0.18, -h * 0.02, h * 0.14, h * 0.3];
    for (const ly of lineYs) {
      ctx.fillRect(-w / 2 + s * 0.1, ly, w - s * 0.2, s * 0.04);
    }
    ctx.fillStyle = fillCss;
  } else if (type === "decision") {
    // Checkmark
    ctx.lineWidth = s * 0.18;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(-s * 0.34, s * 0.02);
    ctx.lineTo(-s * 0.06, s * 0.28);
    ctx.lineTo(s * 0.4, -s * 0.26);
    ctx.stroke();
  } else if (type === "call") {
    // Phone handset — curved bar with two end caps
    ctx.lineWidth = s * 0.18;
    ctx.lineCap = "round";
    const r = s * 0.32;
    // Main curve (upper handset bar)
    ctx.beginPath();
    ctx.arc(0, s * 0.06, r, Math.PI * 1.18, Math.PI * 1.82);
    ctx.stroke();
    // End caps as small filled circles
    const cap = s * 0.085;
    const a1 = Math.PI * 1.18;
    const a2 = Math.PI * 1.82;
    ctx.beginPath();
    ctx.arc(r * Math.cos(a1), s * 0.06 + r * Math.sin(a1), cap, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(r * Math.cos(a2), s * 0.06 + r * Math.sin(a2), cap, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === "revision") {
    // Circular arrow (refresh)
    ctx.lineWidth = s * 0.13;
    ctx.lineCap = "round";
    const r = s * 0.32;
    const startA = Math.PI * 0.2;
    const endA = Math.PI * 1.85;
    ctx.beginPath();
    ctx.arc(0, 0, r, startA, endA);
    ctx.stroke();
    // Arrowhead at endA
    const ex = r * Math.cos(endA);
    const ey = r * Math.sin(endA);
    const ah = s * 0.13;
    const tx = Math.cos(endA + Math.PI / 2);
    const ty = Math.sin(endA + Math.PI / 2);
    const nx = Math.cos(endA);
    const ny = Math.sin(endA);
    ctx.beginPath();
    ctx.moveTo(ex + nx * ah * 0.9, ey + ny * ah * 0.9);
    ctx.lineTo(ex - nx * ah * 0.9, ey - ny * ah * 0.9);
    ctx.lineTo(ex + tx * ah * 1.6, ey + ty * ah * 1.6);
    ctx.closePath();
    ctx.fill();
  } else if (type === "mention") {
    // @ symbol as text
    ctx.font = `700 ${s * 0.95}px ui-sans-serif, system-ui, -apple-system, "Inter", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("@", 0, s * 0.04);
  }

  ctx.restore();
}

// ── Layer side-face label texture ───────────────────────
function createLayerLabelTexture(
  label: string,
  color: number,
  icon: IconType,
): THREE.CanvasTexture {
  const W = 2048;
  const H = 128;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  const baseColor = new THREE.Color(color);
  const toRgb = (mul: number) => {
    const r = Math.max(0, Math.min(255, Math.round(baseColor.r * 255 * mul)));
    const g = Math.max(0, Math.min(255, Math.round(baseColor.g * 255 * mul)));
    const b = Math.max(0, Math.min(255, Math.round(baseColor.b * 255 * mul)));
    return `rgb(${r},${g},${b})`;
  };

  // Vertical gradient — subtle shadow at top suggesting weight from layer above
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, toRgb(0.62));
  grad.addColorStop(0.18, toRgb(0.78));
  grad.addColorStop(1, toRgb(0.92));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Top hairline shadow (where the layer above sits)
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.fillRect(0, 0, W, 2);

  // Bottom hairline highlight (where this layer sits on the next)
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.fillRect(0, H - 1, W, 1);

  // Solid icon on the left
  const ICON_SIZE = 76;
  const ICON_CX = 76;
  const ICON_CY = H / 2;
  drawSolidIcon(ctx, icon, ICON_CX, ICON_CY, ICON_SIZE, "rgba(0,0,0,0.62)");

  // Label (shifted right to make room for the icon)
  ctx.fillStyle = "rgba(0,0,0,0.62)";
  ctx.font =
    "600 42px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText(label, 156, H / 2 + 2);

  // Right-side count placeholder (visual rhythm)
  ctx.font =
    "32px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
  ctx.fillStyle = "rgba(0,0,0,0.32)";
  ctx.textAlign = "right";
  ctx.fillText("· · ·", W - 56, H / 2 + 2);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 16;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}

// ── Slab with optional textured faces ───────────────────
interface TexturedSlabHandle {
  group: THREE.Group;
  mesh: THREE.Mesh;
  materials: THREE.MeshBasicMaterial[];
  textures: THREE.Texture[];
  edgeMaterial: THREE.LineBasicMaterial;
  edgeGeometry: THREE.EdgesGeometry;
  meshGeometry: THREE.BoxGeometry;
}

function createTexturedSlab(opts: {
  w: number;
  h: number;
  d: number;
  baseColor: number;
  topColor?: number;
  topTexture?: THREE.Texture;
  frontTexture?: THREE.Texture;
  sideTexture?: THREE.Texture;
  edgeOpacity?: number;
  edgeColor?: number;
}): TexturedSlabHandle {
  const {
    w,
    h,
    d,
    baseColor,
    topColor,
    topTexture,
    frontTexture,
    sideTexture,
    edgeOpacity = 0.28,
    edgeColor,
  } = opts;

  const geo = new THREE.BoxGeometry(w, h, d);
  geo.translate(0, h / 2, 0);

  const c = new THREE.Color(baseColor);
  // Subtler shading — closer to base color so faces feel like the same material
  const sideBright = c.clone().multiplyScalar(0.94).getHex();
  const sideDark = c.clone().multiplyScalar(0.78).getHex();
  // Edges: darker variant of the layer's own color, not pure black
  const resolvedEdgeColor =
    edgeColor !== undefined
      ? edgeColor
      : c.clone().multiplyScalar(0.32).getHex();

  // Helper: build a side material — uses sideTexture if provided
  const sideMat = (fallback: number) =>
    sideTexture
      ? new THREE.MeshBasicMaterial({ map: sideTexture })
      : new THREE.MeshBasicMaterial({ color: fallback });

  // Material order: +X, -X, +Y, -Y, +Z, -Z
  const mPlusX = sideMat(sideBright);
  const mMinusX = sideMat(sideBright);
  const mPlusY = topTexture
    ? new THREE.MeshBasicMaterial({ map: topTexture })
    : new THREE.MeshBasicMaterial({ color: topColor ?? baseColor });
  const mMinusY = new THREE.MeshBasicMaterial({ color: sideDark });
  const mPlusZ = frontTexture
    ? new THREE.MeshBasicMaterial({ map: frontTexture })
    : sideMat(sideDark);
  const mMinusZ = sideMat(sideDark);

  const materials = [mPlusX, mMinusX, mPlusY, mMinusY, mPlusZ, mMinusZ];
  const mesh = new THREE.Mesh(geo, materials);

  const edges = new THREE.EdgesGeometry(geo);
  const edgeMaterial = new THREE.LineBasicMaterial({
    color: resolvedEdgeColor,
    transparent: true,
    opacity: edgeOpacity,
  });
  const lines = new THREE.LineSegments(edges, edgeMaterial);

  const group = new THREE.Group();
  group.add(mesh);
  group.add(lines);

  const textures: THREE.Texture[] = [];
  if (topTexture) textures.push(topTexture);
  if (frontTexture) textures.push(frontTexture);

  return {
    group,
    mesh,
    materials,
    textures,
    edgeMaterial,
    edgeGeometry: edges,
    meshGeometry: geo,
  };
}

// ── Iso grid (unchanged) ────────────────────────────────
interface IsoGrid {
  mesh: THREE.LineSegments;
  material: THREE.ShaderMaterial;
}

function createIsoGrid(size: number, divisions: number): IsoGrid {
  const points: number[] = [];
  const half = size / 2;
  const step = size / divisions;
  for (let i = 0; i <= divisions; i++) {
    const t = -half + i * step;
    points.push(-half, 0, t, half, 0, t);
    points.push(t, 0, -half, t, 0, half);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(points, 3),
  );

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uResolution: { value: new THREE.Vector2(1, 1) },
      uColor: { value: new THREE.Color(0xffffff) },
      uOpacity: { value: 0.22 },
    },
    vertexShader: `
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec2 uResolution;
      uniform vec3 uColor;
      uniform float uOpacity;
      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution;
        vec2 dn = vec2((uv.x - 0.5) / 0.78, uv.y / 0.85);
        float r = length(dn);
        float alpha = 1.0 - smoothstep(0.35, 1.0, r);
        gl_FragColor = vec4(uColor, uOpacity * alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
  });
  return { mesh: new THREE.LineSegments(geo, material), material };
}

export default function Blank() {
  const mountRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const lookAtRef = useRef<THREE.Vector3>(LOOKAT_INITIAL.clone());
  const startTimeRef = useRef(performance.now());

  const [elevation, setElevation] = useState(INITIAL_ELEVATION);
  const [azimuth, setAzimuth] = useState(INITIAL_AZIMUTH);
  const [frustum, setFrustum] = useState(INITIAL_FRUSTUM);
  const [showGrid, setShowGrid] = useState(true);
  const gridMeshRef = useRef<THREE.LineSegments | null>(null);
  const gridMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
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

    const grid = createIsoGrid(80, 80);
    grid.mesh.position.y = 0;
    grid.material.uniforms.uOpacity.value = 0;
    scene.add(grid.mesh);
    gridMeshRef.current = grid.mesh;
    gridMaterialRef.current = grid.material;

    const updateGridUniforms = () => {
      const dpr = renderer.getPixelRatio();
      grid.material.uniforms.uResolution.value.set(
        width * dpr,
        height * dpr,
      );
    };
    updateGridUniforms();

    const disposables: Array<{ dispose: () => void }> = [];

    // ── Soft contact shadow under the tower ──
    const shadowSize = 512;
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = shadowSize;
    shadowCanvas.height = shadowSize;
    const sctx = shadowCanvas.getContext("2d")!;
    const sgrad = sctx.createRadialGradient(
      shadowSize / 2,
      shadowSize / 2,
      0,
      shadowSize / 2,
      shadowSize / 2,
      shadowSize / 2,
    );
    sgrad.addColorStop(0, "rgba(0,0,0,0.55)");
    sgrad.addColorStop(0.35, "rgba(0,0,0,0.30)");
    sgrad.addColorStop(0.7, "rgba(0,0,0,0.08)");
    sgrad.addColorStop(1, "rgba(0,0,0,0)");
    sctx.fillStyle = sgrad;
    sctx.fillRect(0, 0, shadowSize, shadowSize);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    shadowTex.colorSpace = THREE.SRGBColorSpace;
    shadowTex.minFilter = THREE.LinearFilter;
    shadowTex.magFilter = THREE.LinearFilter;
    shadowTex.needsUpdate = true;
    disposables.push(shadowTex);
    const shadowGeo = new THREE.PlaneGeometry(RECORD_W * 2.4, RECORD_D * 2.4);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.85,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.005; // slightly above floor to avoid z-fighting
    scene.add(shadowPlane);
    disposables.push(shadowGeo, shadowMat);

    // ── Build the layers (bottom to top), then the record ON TOP ──
    let yCursor = 0;
    LAYERS.forEach((spec) => {
      const labelTex = createLayerLabelTexture(spec.type, spec.color, spec.icon);
      disposables.push(labelTex);
      const slab = createTexturedSlab({
        w: LAYER_W,
        h: spec.h,
        d: LAYER_D,
        baseColor: spec.color,
        frontTexture: labelTex,
        edgeOpacity: 0.42,
      });
      slab.group.position.set(0, yCursor, 0);
      // Full size from t=0 — no rise animation.
      slab.group.scale.set(1, 1, 1);
      scene.add(slab.group);

      disposables.push(slab.meshGeometry, slab.edgeGeometry, slab.edgeMaterial);
      for (const m of slab.materials) disposables.push(m);

      yCursor += spec.h;
    });

    // The record sits ON TOP of the stack — built as N individual paper sheets
    // with slight random offsets so the stack feels real, not machine-stacked.
    const docTexture = createDocumentTexture();
    disposables.push(docTexture);

    // Seeded RNG so sheet offsets are stable across renders/replays.
    const seed = (s0: number) => {
      let s = s0 >>> 0;
      return () => {
        s = (s + 0x6d2b79f5) >>> 0;
        let t = s;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    };
    const rand = seed(73);

    const NUM_PAPER_SHEETS = 12;
    const PAPER_SHEET_H = RECORD_H / NUM_PAPER_SHEETS;
    const PAPER_OFFSET_X = 0.03;
    const PAPER_OFFSET_Z = 0.025;
    // Subtly varied cream tones — sheets are not identical paper batches
    const SHEET_COLORS = [
      0xede5c2, 0xf0e8c6, 0xece4c0, 0xefe7c4, 0xf2eaca,
      0xede5c1, 0xf0e8c8, 0xece4c1, 0xf1e9c8, 0xefe7c4,
      0xf2eacb, 0xf4eed8, // top sheet — slightly brighter to feel "fresh"
    ];

    let sheetY = yCursor;
    for (let i = 0; i < NUM_PAPER_SHEETS; i++) {
      const isTop = i === NUM_PAPER_SHEETS - 1;
      const dx = (rand() - 0.5) * 2 * PAPER_OFFSET_X;
      const dz = (rand() - 0.5) * 2 * PAPER_OFFSET_Z;
      const sheetColor = SHEET_COLORS[i] ?? PAPER_SIDE_HEX;

      const sheet = createTexturedSlab({
        w: RECORD_W,
        h: PAPER_SHEET_H,
        d: RECORD_D,
        baseColor: sheetColor,
        topColor: isTop ? PAPER_TOP_HEX : sheetColor,
        topTexture: isTop ? docTexture : undefined,
        edgeOpacity: isTop ? 0.42 : 0.18,
        edgeColor: 0x6b5e3a,
      });
      sheet.group.position.set(dx, sheetY, dz);
      sheet.group.scale.set(1, 1, 1);
      scene.add(sheet.group);

      disposables.push(sheet.meshGeometry, sheet.edgeGeometry, sheet.edgeMaterial);
      for (const m of sheet.materials) disposables.push(m);

      sheetY += PAPER_SHEET_H;
    }

    startTimeRef.current = performance.now();

    let frameId = 0;
    const animate = () => {
      const t = (performance.now() - startTimeRef.current) / 1000;

      if (gridMaterialRef.current) {
        const gridT = Math.min(t / GRID_FADE_DURATION, 1);
        const gridEased = 1 - Math.pow(1 - gridT, 3);
        gridMaterialRef.current.uniforms.uOpacity.value =
          GRID_TARGET_OPACITY * gridEased;
      }

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
      updateGridUniforms();
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
      gridMeshRef.current = null;
      gridMaterialRef.current = null;
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

  useEffect(() => {
    if (gridMeshRef.current) gridMeshRef.current.visible = showGrid;
  }, [showGrid]);

  // Entrance: tween elevation, azimuth, frustum, AND lookAt point.
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
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at center, #1c1c1d 0%, #131313 60%, #0a0a0b 100%)",
      }}
    >
      <div ref={mountRef} className="absolute inset-0 h-full w-full" />

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
            min={5}
            max={90}
            step={0.1}
            value={elevation}
            onChange={handleElevationChange}
          />
          <ControlSlider
            label="Azimuth"
            unit="°"
            min={0}
            max={90}
            step={0.1}
            value={azimuth}
            onChange={handleAzimuthChange}
          />
          <ControlSlider
            label="Zoom"
            unit=""
            min={4}
            max={36}
            step={0.1}
            value={frustum}
            onChange={handleZoomChange}
            invert
          />
          <label className="flex items-center justify-between py-2 cursor-pointer select-none">
            <span>Show grid</span>
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
              className="accent-blue-500"
            />
          </label>
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
