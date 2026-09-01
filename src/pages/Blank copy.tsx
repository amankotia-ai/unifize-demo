import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";

const LF_STYLES = `
html:has(.lf-root) { scroll-behavior: smooth; }
.lf-root [id] { scroll-margin-top: 72px; }
.lf-root {
  /* Default to dark tokens. Overridden by [data-theme="light"] below. */
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

/* NAV */
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
.lf-root[data-theme="light"] .lf-nav-logo-img {
  filter: brightness(0);
}
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
.lf-nav-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(124,139,240,0.6);
}

/* Theme toggle */
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
.lf-theme-toggle:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(124,139,240,0.55);
}
.lf-theme-toggle svg { display: block; }
@media (max-width: 860px) { .lf-nav-items { display: none; } }

/* HERO */
.lf-hero {
  max-width: 1320px; margin: 0 auto;
  padding: 120px 24px 0;
  position: relative;
}
.lf-hero-h1 {
  font-size: clamp(38px, 6.4vw, 78px);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.042em;
  max-width: 22ch;
  margin: 0;
}
.lf-hero-accent {
  background: linear-gradient(90deg, #9AA6F6 0%, #7C8BF0 35%, #F59E0B 70%, #EF4444 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  background-size: 200% 100%;
  animation: lf-hero-gradient 12s ease-in-out infinite;
}
@keyframes lf-hero-gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
@media (prefers-reduced-motion: reduce) {
  .lf-hero-accent { animation: none; }
}
.lf-hero-subtitle {
  margin: 28px 0 0;
  font-size: 16px;
  color: var(--lf-text-muted);
  max-width: 80ch;
  line-height: 1.5;
  letter-spacing: -0.006em;
}
.lf-hero-sub-em {
  color: var(--lf-text);
  font-weight: 500;
}
.lf-hero-cta {
  margin-top: 28px;
  padding-bottom: 56px;
  display: flex; gap: 20px; align-items: center; flex-wrap: wrap;
  justify-content: space-between;
}
.lf-btn-primary {
  font-family: inherit; font-size: 13.5px; font-weight: 500;
  background: var(--lf-text);
  color: var(--lf-bg);
  padding: 9px 18px; border-radius: 999px;
  border: 1px solid var(--lf-text);
  cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px;
  transition: opacity .15s ease, background .25s ease, color .25s ease, border-color .25s ease;
}
.lf-btn-primary:hover { opacity: 0.88; }
.lf-btn-primary:focus-visible {
  outline: 2px solid rgba(var(--lf-fg), 0.5);
  outline-offset: 2px;
}
.lf-btn-primary svg { transition: transform .15s ease; }
.lf-btn-primary:hover svg { transform: translateX(1px); }

/* Anchor line */
.lf-anchor {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-left: auto;
}
.lf-anchor-label {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--lf-text-faint);
  white-space: nowrap;
}
.lf-anchor-slot {
  position: relative;
  display: inline-flex;
  align-items: baseline;
  min-width: 24ch;
  overflow: hidden;
  height: 1.3em;
}
.lf-anchor-text {
  display: inline-block;
  color: var(--lf-text);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.012em;
  white-space: nowrap;
  animation: lf-anchor-in 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes lf-anchor-in {
  0%   { opacity: 0; transform: translateY(90%); filter: blur(6px); }
  60%  { opacity: 1; filter: blur(0); }
  100% { opacity: 1; transform: translateY(0); filter: blur(0); }
}
@media (prefers-reduced-motion: reduce) { .lf-anchor-text { animation: none; } }
@media (max-width: 760px) {
  .lf-anchor { margin-left: 0; gap: 8px; }
}
`;

type Theme = "dark" | "light";

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
// Tower now: bottom record (0–0.5) + coord layers (0.5–2.74) + top record (2.74–3.24)
const LOOKAT_INITIAL = new THREE.Vector3(0, 3.0, 0); // top record in top-down
const LOOKAT_DEFAULT = new THREE.Vector3(0, 1.62, 0); // tower midpoint in iso

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
// Modern palette — Tailwind 300-level tones across the spectrum. Each
// coordination type has a distinct hue, leaning vibrant but not garish.
const LAYERS: LayerSpec[] = [
  { type: "EMAIL THREAD", h: 0.30, color: 0xfdba74, icon: "envelope" }, // orange
  { type: "MEETING", h: 0.26, color: 0xa5b4fc, icon: "meeting" }, // indigo
  { type: "CHAT THREAD", h: 0.32, color: 0x7dd3fc, icon: "chat" }, // sky
  { type: "DRAFT", h: 0.28, color: 0xfcd34d, icon: "draft" }, // amber
  { type: "DECISION", h: 0.24, color: 0x6ee7b7, icon: "decision" }, // emerald
  { type: "CALL", h: 0.30, color: 0x5eead4, icon: "call" }, // teal
  { type: "REVISION", h: 0.28, color: 0xc4b5fd, icon: "revision" }, // violet
  { type: "MENTION", h: 0.26, color: 0xf9a8d4, icon: "mention" }, // pink
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

// ── Architectural label sprite (camera-facing) ─────────
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

  // Subtle dark backdrop pill — keeps text readable over any colour underneath
  const bgPad = 30;
  const bgX = bgPad;
  const bgY = 30;
  const bgW = W - bgPad * 2;
  const bgH = H - 60;
  const bgR = bgH / 2;
  // rounded rect
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

  // Tracking dots inside the pill (left and right)
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.beginPath();
  ctx.arc(bgX + 28, H / 2, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(bgX + bgW - 28, H / 2, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Label text
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
  // World-space size: 2.6 wide × 0.5 tall
  sprite.scale.set(2.6, 0.49, 1);
  sprite.renderOrder = 5;

  return { sprite, material, texture };
}

// ── Connector line (label → zone) ──────────────────────
function createConnectorLine(
  start: THREE.Vector3,
  end: THREE.Vector3,
  color = 0xffffff,
): {
  line: THREE.Line;
  material: THREE.LineBasicMaterial;
  geometry: THREE.BufferGeometry;
} {
  const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    depthTest: false,
  });
  const line = new THREE.Line(geometry, material);
  line.renderOrder = 4;
  return { line, material, geometry };
}

// ── Architectural annotation (bracket + connector + label) ──
// Builds a complete callout: a vertical bracket that spans the zone, a
// horizontal connector line, and a text label. Used to visibly call out
// "SYSTEM OF RECORD" and "SYSTEMS OF COORDINATION" zones in the iso scene.
function createArchAnnotation(opts: {
  text: string;
  zoneTopY: number;
  zoneBottomY: number;
  side: "right" | "left";
  bracketX?: number; // distance from origin
  labelX?: number;
}): {
  group: THREE.Group;
  spriteMaterial: THREE.SpriteMaterial;
  lineMaterial: THREE.LineBasicMaterial;
  texture: THREE.CanvasTexture;
  geometries: THREE.BufferGeometry[];
} {
  const { text, zoneTopY, zoneBottomY, side } = opts;
  const sign = side === "right" ? 1 : -1;
  const bracketX = sign * (opts.bracketX ?? 2.55);
  const labelX = sign * (opts.labelX ?? 4.6);
  const capLength = 0.18;
  const midY = (zoneTopY + zoneBottomY) / 2;

  const group = new THREE.Group();

  // Shared line material — both bracket and connector animate together
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    depthTest: false,
  });

  // Bracket: 4-point polyline forming "]" (right) or "[" (left)
  // Caps point toward the bracketed zone (inward).
  const capX = bracketX + -sign * capLength;
  const bracketPoints = [
    new THREE.Vector3(capX, zoneTopY, 0),
    new THREE.Vector3(bracketX, zoneTopY, 0),
    new THREE.Vector3(bracketX, zoneBottomY, 0),
    new THREE.Vector3(capX, zoneBottomY, 0),
  ];
  const bracketGeo = new THREE.BufferGeometry().setFromPoints(bracketPoints);
  const bracketLine = new THREE.Line(bracketGeo, lineMaterial);
  bracketLine.renderOrder = 4;
  group.add(bracketLine);

  // Connector: bracket vertical midpoint to label edge
  // Label sprite is centered at labelX with width ~2.9, so its near-edge is
  // at labelX - sign*1.45. Stop the connector just short of that.
  const connectorPoints = [
    new THREE.Vector3(bracketX, midY, 0),
    new THREE.Vector3(labelX - sign * 1.55, midY, 0),
  ];
  const connectorGeo = new THREE.BufferGeometry().setFromPoints(connectorPoints);
  const connectorLine = new THREE.Line(connectorGeo, lineMaterial);
  connectorLine.renderOrder = 4;
  group.add(connectorLine);

  // Label sprite
  const labelHandle = createArchLabelSprite(text);
  labelHandle.sprite.position.set(labelX, midY, 0);
  // Bigger and more visible than the previous default
  labelHandle.sprite.scale.set(3.0, 0.56, 1);
  group.add(labelHandle.sprite);

  return {
    group,
    spriteMaterial: labelHandle.material,
    lineMaterial,
    texture: labelHandle.texture,
    geometries: [bracketGeo, connectorGeo],
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
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    const stored = window.localStorage.getItem("lf-theme");
    return stored === "light" || stored === "dark" ? stored : "dark";
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("lf-theme", theme);
  }, [theme]);

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

    // ── Sandwich composition: bottom record + coord layers + top record ──
    // Records live in systems (plural). Work lives between them.

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

    // Helper: build a paper-sheet stack at a given baseY
    const buildPaperStack = (
      baseY: number,
      hasDocument: boolean,
      rngSeed: number,
    ) => {
      const r = seed(rngSeed);
      let sheetY = baseY;
      for (let i = 0; i < NUM_PAPER_SHEETS; i++) {
        const isTopOfStack = i === NUM_PAPER_SHEETS - 1;
        const dx = (r() - 0.5) * 2 * PAPER_OFFSET_X;
        const dz = (r() - 0.5) * 2 * PAPER_OFFSET_Z;
        const sheetColor = SHEET_COLORS[i] ?? PAPER_SIDE_HEX;
        const useDoc = isTopOfStack && hasDocument;

        const sheet = createTexturedSlab({
          w: RECORD_W,
          h: PAPER_SHEET_H,
          d: RECORD_D,
          baseColor: sheetColor,
          topColor: useDoc ? PAPER_TOP_HEX : sheetColor,
          topTexture: useDoc ? docTexture : undefined,
          edgeOpacity: useDoc ? 0.42 : 0.18,
          edgeColor: 0x6b5e3a,
        });
        sheet.group.position.set(dx, sheetY, dz);
        sheet.group.scale.set(1, 1, 1);
        scene.add(sheet.group);

        disposables.push(
          sheet.meshGeometry,
          sheet.edgeGeometry,
          sheet.edgeMaterial,
        );
        for (const m of sheet.materials) disposables.push(m);

        sheetY += PAPER_SHEET_H;
      }
    };

    // 1. Bottom record stack (no document texture — its top face will be
    //    occluded by the coord layers above anyway)
    buildPaperStack(0, false, 31);

    // 2. Coordination layers — sandwiched between the two record stacks
    let yCursor = RECORD_H; // start at top of bottom stack (= 0.5)
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
      slab.group.scale.set(1, 1, 1);
      scene.add(slab.group);

      disposables.push(slab.meshGeometry, slab.edgeGeometry, slab.edgeMaterial);
      for (const m of slab.materials) disposables.push(m);

      yCursor += spec.h;
    });
    // yCursor now = RECORD_H + sum(layer heights) = 0.5 + 2.24 = 2.74

    // 3. Top record stack (with document texture on the topmost sheet)
    buildPaperStack(yCursor, true, 73);

    // ── Architectural callouts: bracket + connector + label ──
    const bottomRecordTop = RECORD_H; // 0.5
    const bottomRecordBottom = 0;
    const coordZoneTop = yCursor; // 2.74
    const coordZoneBottom = RECORD_H; // 0.5
    const topRecordTop = yCursor + RECORD_H; // 3.24
    const topRecordBottom = yCursor; // 2.74

    const topRecordAnnot = createArchAnnotation({
      text: "SYSTEMS OF RECORD",
      zoneTopY: topRecordTop,
      zoneBottomY: topRecordBottom,
      side: "right",
    });
    scene.add(topRecordAnnot.group);
    disposables.push(
      topRecordAnnot.texture,
      topRecordAnnot.spriteMaterial,
      topRecordAnnot.lineMaterial,
    );
    for (const g of topRecordAnnot.geometries) disposables.push(g);

    const coordAnnot = createArchAnnotation({
      text: "SYSTEMS OF COORDINATION",
      zoneTopY: coordZoneTop,
      zoneBottomY: coordZoneBottom,
      side: "left",
    });
    scene.add(coordAnnot.group);
    disposables.push(
      coordAnnot.texture,
      coordAnnot.spriteMaterial,
      coordAnnot.lineMaterial,
    );
    for (const g of coordAnnot.geometries) disposables.push(g);

    const bottomRecordAnnot = createArchAnnotation({
      text: "SYSTEMS OF RECORD",
      zoneTopY: bottomRecordTop,
      zoneBottomY: bottomRecordBottom,
      side: "right",
    });
    scene.add(bottomRecordAnnot.group);
    disposables.push(
      bottomRecordAnnot.texture,
      bottomRecordAnnot.spriteMaterial,
      bottomRecordAnnot.lineMaterial,
    );
    for (const g of bottomRecordAnnot.geometries) disposables.push(g);

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

      // Architectural callouts (brackets + connectors + labels) fade in just
      // before the camera tween completes, so the vocabulary "lands" right as
      // the structure becomes visible.
      const LABEL_START = 1.6;
      const LABEL_DURATION = 0.9;
      const labelT = Math.max(
        0,
        Math.min((t - LABEL_START) / LABEL_DURATION, 1),
      );
      const labelEased = 1 - Math.pow(1 - labelT, 3);
      topRecordAnnot.spriteMaterial.opacity = 1.0 * labelEased;
      topRecordAnnot.lineMaterial.opacity = 0.6 * labelEased;
      coordAnnot.spriteMaterial.opacity = 1.0 * labelEased;
      coordAnnot.lineMaterial.opacity = 0.6 * labelEased;
      bottomRecordAnnot.spriteMaterial.opacity = 1.0 * labelEased;
      bottomRecordAnnot.lineMaterial.opacity = 0.6 * labelEased;

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
    <div className="lf-root" data-theme={theme}>
      <style>{LF_STYLES}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;550;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* Nav */}
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
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
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
          @keyframes blankSectionFade {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes blankCaptionFade {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <div ref={mountRef} className="absolute inset-0 h-full w-full" />

        {/* Section identifier — top-left of the visual */}
        <div
          className="pointer-events-none absolute top-6 left-8 z-10 md:top-8 md:left-12"
          style={{ animation: "blankSectionFade 0.9s ease-out 0.2s both" }}
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
            Concept 3
          </div>
          <div className="mt-1 font-serif text-base font-medium text-white/85 md:text-lg">
            The gap, visualised.
          </div>
        </div>

        {/* Vocabulary caption — bottom-center, fades in with the 3D labels */}
        <div
          className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center md:bottom-10"
          style={{ animation: "blankCaptionFade 1s ease-out 2.0s both" }}
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 md:text-[11px]">
            <span className="text-white/65">a single record</span>
            <span className="mx-3 text-white/25">·</span>
            <span className="text-white/65">eight systems of coordination</span>
          </div>
          <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.22em] text-white/25 md:text-[10px]">
            the architecture of coordination tax
          </div>
        </div>

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
