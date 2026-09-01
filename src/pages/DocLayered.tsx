import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";

// ============================================================================
// DocLayered — DOSS-style document decomposition (standalone study)
// ----------------------------------------------------------------------------
// A layered 3D scene that mirrors the reference DOSS visual: a skeletal
// translucent document stack in the back, a layer of structured cards
// floating in front of it, magenta leader lines threading between them,
// and side annotation pills on the far right.
//
// Animation: docs load first (skeletal state, like reference image 1);
// then the card layer materializes in front (reference image 2 state),
// with leader lines drawing card-to-doc and side annotation pills landing.
//
// Camera and doc positioning match the reference angle: low-elevation
// isometric viewed from upper-right, no big swooping entrance — the
// reveal energy is in the layered populate.
// ============================================================================

const DL_STYLES = `
html:has(.dl-root) { scroll-behavior: smooth; }
.dl-root [id] { scroll-margin-top: 72px; }
.dl-root {
  --dl-fg: 17, 18, 22;
  --dl-bg: #F5F5F1;
  --dl-bg-rgb: 245, 245, 241;
  --dl-text: #11121C;
  --dl-text-muted: rgba(var(--dl-fg), 0.62);
  --dl-text-faint: rgba(var(--dl-fg), 0.42);
  --dl-border: rgba(var(--dl-fg), 0.10);
  --dl-accent: #EC4899;
  --dl-accent-deep: #BE185D;
  --dl-accent-soft: #FBCFE8;
  --dl-amber: #F59E0B;
  --dl-amber-soft: #FED7AA;

  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  background: var(--dl-bg);
  color: var(--dl-text);
  -webkit-font-smoothing: antialiased;
  letter-spacing: -0.011em;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}
.dl-root * { box-sizing: border-box; }
.dl-root .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
.dl-root a { color: inherit; text-decoration: none; }

.dl-nav {
  position: sticky; top: 0; z-index: 50;
  backdrop-filter: saturate(160%) blur(18px);
  background: rgba(var(--dl-bg-rgb), 0.78);
  border-bottom: 1px solid var(--dl-border);
}
.dl-nav-inner {
  max-width: 1320px; margin: 0 auto;
  padding: 10px 24px;
  display: flex; align-items: center; gap: 40px;
}
.dl-nav-logo { display: inline-flex; align-items: center; }
.dl-nav-logo-img {
  height: 22px; width: auto; display: block;
  filter: brightness(0);
}
.dl-nav-items { display: flex; gap: 26px; font-size: 13.5px; color: var(--dl-text-muted); }
.dl-nav-items a:hover { color: var(--dl-text); }
.dl-nav-actions { margin-left: auto; display: flex; gap: 18px; align-items: center; }
.dl-nav-link { font-size: 13.5px; color: var(--dl-text-muted); }
.dl-nav-link:hover { color: var(--dl-text); }
.dl-nav-btn {
  font-size: 13px; font-weight: 500;
  background: var(--dl-text); color: var(--dl-bg);
  padding: 7px 14px; border-radius: 999px;
  border: 1px solid var(--dl-text);
  cursor: pointer;
}

.dl-stage-wrap {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background:
    linear-gradient(180deg, #F8F8F4 0%, #EFEFEA 100%);
  /* Faint isometric grid pattern in CSS to mirror the reference paper */
  background-image:
    linear-gradient(180deg, #F8F8F4 0%, #EFEFEA 100%),
    repeating-linear-gradient(60deg,
      rgba(20,20,28,0.04) 0 1px, transparent 1px 80px),
    repeating-linear-gradient(-60deg,
      rgba(20,20,28,0.04) 0 1px, transparent 1px 80px),
    repeating-linear-gradient(0deg,
      rgba(20,20,28,0.025) 0 1px, transparent 1px 80px);
  background-blend-mode: normal, multiply, multiply, multiply;
}
.dl-stage { position: absolute; inset: 0; width: 100%; height: 100%; }

.dl-banner {
  position: absolute;
  top: 18%;
  left: 38%;
  transform: rotate(-26deg) translateZ(0);
  transform-origin: 0 0;
  z-index: 5;
  pointer-events: none;
  opacity: 0;
  animation: dlBannerIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) 1.0s forwards;
}
.dl-banner-pill {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 8px 16px;
  background: var(--dl-accent);
  color: #FFFFFF;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-radius: 4px;
  box-shadow: 0 8px 24px rgba(190,24,93,0.18);
}
.dl-banner-marks {
  display: inline-flex; gap: 4px;
  margin-right: 4px;
}
.dl-banner-marks span {
  display: inline-block; width: 4px; height: 16px;
  background: rgba(255,255,255,0.85);
}
@keyframes dlBannerIn {
  from { opacity: 0; transform: rotate(-26deg) translate(-12px, 8px); }
  to   { opacity: 1; transform: rotate(-26deg) translate(0, 0); }
}

.dl-side-annots {
  position: absolute;
  top: 22%;
  right: 6%;
  z-index: 5;
  display: flex;
  flex-direction: column;
  gap: 16px;
  pointer-events: none;
}
.dl-annot-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  opacity: 0;
  animation: dlAnnotIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.dl-annot-group.g1 { animation-delay: 2.6s; }
.dl-annot-group.g2 { animation-delay: 2.85s; }
.dl-annot-group.g3 { animation-delay: 3.05s; }
.dl-annot-pill {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 7px 14px;
  background: #FFFFFF;
  border: 1.5px solid var(--dl-accent);
  border-radius: 3px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  font-family: 'Crimson Pro', 'Times New Roman', serif;
  font-size: 14px;
  font-style: italic;
  letter-spacing: 0.18em;
  color: var(--dl-text);
  text-transform: uppercase;
  font-weight: 500;
}
.dl-annot-pill svg {
  width: 16px; height: 16px; color: var(--dl-accent);
}
@keyframes dlAnnotIn {
  from { opacity: 0; transform: translateX(8px); }
  to   { opacity: 1; transform: translateX(0); }
}

@media (max-width: 860px) {
  .dl-side-annots { right: 4%; top: 18%; }
  .dl-annot-pill { font-size: 12px; padding: 6px 10px; }
  .dl-banner { left: 30%; top: 14%; }
  .dl-banner-pill { font-size: 13px; padding: 6px 12px; }
}
`;

// ── Camera ──────────────────────────────────────────────
// Iso angle matched to the reference: looking from upper-right, doc stack
// receding into the upper-left. Subtle elevation drift on entrance only
// so the geometry doesn't feel static at frame zero.
const INITIAL_ELEVATION = 30;
const DEFAULT_ELEVATION = 26;
const INITIAL_AZIMUTH = 32;
const DEFAULT_AZIMUTH = 32;
const INITIAL_FRUSTUM = 9.5;
const DEFAULT_FRUSTUM = 9.0;
const CAM_DIST = 42;
const ENTRANCE_DURATION = 1600;

const LOOKAT = new THREE.Vector3(0.6, 1.7, 0.4);

// ── Document stack (back layer) ─────────────────────────
// Five translucent A4-portrait panels fanned into Z-depth.
const NUM_DOCS = 5;
const DOC_W = 2.6;
const DOC_H = 3.55;
const DOC_T = 0.04;
const DOC_X_BASE = -1.4;
const DOC_Y_BASE = 0.0;          // bottom of stack at floor level
const DOC_Z_BASE = -0.6;
const DOC_X_STEP = 0.08;
const DOC_Y_STEP = 0.04;
const DOC_Z_STEP = -0.10;
const DOC_ROT_STEP_DEG = 1.5;
const FRONT_DOC_INDEX = 0;        // the one with content; rest are skeletal

// ── Card layer (front, six structured views in 2 × 3) ───
type CardKind =
  | "revenue" | "transactions" | "doc-info"
  | "entities" | "expense" | "summary";

interface CardSpec {
  kind: CardKind;
  title: string;
  col: 0 | 1;
  row: 0 | 1 | 2;
}

const CARDS: CardSpec[] = [
  { kind: "revenue",      title: "REVENUE TREND",     col: 0, row: 0 },
  { kind: "transactions", title: "TRANSACTIONS",      col: 1, row: 0 },
  { kind: "doc-info",     title: "DOCUMENT INFO",     col: 0, row: 1 },
  { kind: "entities",     title: "ENTITIES",          col: 1, row: 1 },
  { kind: "expense",      title: "EXPENSE BREAKDOWN", col: 0, row: 2 },
  { kind: "summary",      title: "DOCUMENT SUMMARY",  col: 1, row: 2 },
];

const CARD_W = 1.85;
const CARD_H = 1.30;
const CARD_T = 0.04;
const CARD_X_BASE = 1.0;          // grid origin
const CARD_Y_TOP = 3.20;          // top row Y
const CARD_X_STEP = CARD_W + 0.20;
const CARD_Y_STEP = CARD_H + 0.16;
const CARD_Z_BASE = 1.6;          // floats in front of doc stack
const CARD_Z_JITTER = 0.10;

// ── Animation timing (s) ────────────────────────────────
const DOC_REVEAL_START = 0.10;
const DOC_REVEAL_PER = 0.08;
const DOC_REVEAL_DURATION = 0.65;

const CARD_REVEAL_START = 1.30;
const CARD_REVEAL_PER = 0.10;
const CARD_REVEAL_DURATION = 0.65;
const CARD_SLIDE_FROM_Z = -0.6;   // cards start tucked behind, slide forward

const LEADER_START = 1.85;
const LEADER_PER = 0.10;
const LEADER_DURATION = 0.55;

// ── Easing ──────────────────────────────────────────────
function easeInOutCubic(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
function easeOutCubic(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - x, 3);
}

// ── Document panel texture (skeletal, image-1 style) ────
// Mostly white. Front-most doc gets a bit more content (amber header,
// faint chart, faint table). Other docs are pure ghost panels.
function createDocTexture(opts: { full: boolean }): THREE.CanvasTexture {
  const W = 1024;
  const H = 1400; // ~A4 ratio
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  // Pure white background with a tiny tint
  ctx.fillStyle = "#FAFAF6";
  ctx.fillRect(0, 0, W, H);

  // Subtle grain
  const grain = ctx.getImageData(0, 0, W, H);
  for (let i = 0; i < grain.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 4;
    grain.data[i] = Math.max(0, Math.min(255, grain.data[i] + n));
    grain.data[i + 1] = Math.max(0, Math.min(255, grain.data[i + 1] + n));
    grain.data[i + 2] = Math.max(0, Math.min(255, grain.data[i + 2] + n));
  }
  ctx.putImageData(grain, 0, 0);

  // Inner dashed margin (soft frame, classic editorial look)
  ctx.strokeStyle = "rgba(20,20,28,0.18)";
  ctx.setLineDash([6, 6]);
  ctx.lineWidth = 1.4;
  ctx.strokeRect(38, 38, W - 76, H - 76);
  ctx.setLineDash([]);

  if (opts.full) {
    // Front-most doc — amber section markers + skeleton chart + skeleton table
    const amber = "#F59E0B";
    const amberSoft = "#FED7AA";

    // Top header band — amber outlined rectangle
    ctx.strokeStyle = amber;
    ctx.lineWidth = 1.5;
    ctx.fillStyle = amberSoft + "55"; // semi-transparent
    ctx.fillRect(74, 110, W - 148, 96);
    ctx.strokeRect(74, 110, W - 148, 96);

    // Body section block — amber outlined wider rectangle
    ctx.fillStyle = amberSoft + "33";
    ctx.fillRect(74, 240, W - 148, 220);
    ctx.strokeRect(74, 240, W - 148, 220);

    // Skeleton paragraph lines inside the body section
    ctx.fillStyle = "rgba(30,30,38,0.30)";
    let py = 270;
    const lineWs = [W - 220, W - 184, W - 280, W - 198, W - 320];
    for (const w of lineWs) { ctx.fillRect(94, py, w, 4); py += 30; }

    // Skeleton bar chart (lower left)
    const chartX = 110;
    const chartY = 540;
    const chartW = 380;
    const chartH = 280;
    ctx.strokeStyle = "rgba(20,20,28,0.25)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(chartX, chartY);
    ctx.lineTo(chartX, chartY + chartH);
    ctx.lineTo(chartX + chartW, chartY + chartH);
    ctx.stroke();

    // Bars
    const heights = [0.42, 0.58, 0.36, 0.72, 0.50, 0.85, 0.62, 0.94, 0.70];
    const barW = (chartW - 20) / heights.length;
    heights.forEach((h, i) => {
      const bh = h * (chartH - 20);
      const bx = chartX + 10 + i * barW;
      const by = chartY + chartH - bh;
      ctx.fillStyle = "rgba(30,30,38,0.55)";
      ctx.fillRect(bx + 2, by, barW - 8, bh);
    });

    // Skeleton table (lower right)
    const tableX = 540;
    const tableY = 540;
    const tableW = W - 540 - 110;
    const rowH = 38;
    const rows = 6;
    ctx.strokeStyle = "rgba(20,20,28,0.30)";
    ctx.lineWidth = 1.2;
    ctx.strokeRect(tableX, tableY, tableW, rowH * rows);
    for (let i = 1; i < rows; i++) {
      ctx.beginPath();
      ctx.moveTo(tableX, tableY + i * rowH);
      ctx.lineTo(tableX + tableW, tableY + i * rowH);
      ctx.stroke();
    }
    // Column dividers (3 cols)
    const cols = 4;
    const colW = tableW / cols;
    for (let i = 1; i < cols; i++) {
      ctx.beginPath();
      ctx.moveTo(tableX + i * colW, tableY);
      ctx.lineTo(tableX + i * colW, tableY + rowH * rows);
      ctx.stroke();
    }
    // Header row tinted
    ctx.fillStyle = "rgba(30,30,38,0.10)";
    ctx.fillRect(tableX + 1, tableY + 1, tableW - 2, rowH - 2);

    // Faux footnote / observation block
    ctx.strokeStyle = amber;
    ctx.lineWidth = 1.5;
    ctx.fillStyle = amberSoft + "33";
    ctx.fillRect(74, 920, W - 148, 60);
    ctx.strokeRect(74, 920, W - 148, 60);

    // Lower body lines
    ctx.fillStyle = "rgba(30,30,38,0.22)";
    let py2 = 1020;
    const lineWs2 = [W - 240, W - 198, W - 312, W - 220];
    for (const w of lineWs2) { ctx.fillRect(94, py2, w, 4); py2 += 26; }
  } else {
    // Skeletal — just very faint ruling lines + dashed margin
    ctx.fillStyle = "rgba(20,20,28,0.06)";
    let py = 130;
    while (py < H - 130) {
      ctx.fillRect(74, py, W - 148, 1.4);
      py += 32;
    }
  }

  // Plus-mark crop registers in all four corners (DOSS signature)
  const plus = (px: number, py: number) => {
    ctx.strokeStyle = "rgba(20,20,28,0.55)";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(px - 14, py); ctx.lineTo(px + 14, py);
    ctx.moveTo(px, py - 14); ctx.lineTo(px, py + 14);
    ctx.stroke();
  };
  plus(56, 56);
  plus(W - 56, 56);
  plus(56, H - 56);
  plus(W - 56, H - 56);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 16;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}

// ── Card texture (six kinds, image-2 style) ─────────────
function createCardTexture(spec: CardSpec): THREE.CanvasTexture {
  const W = 1024;
  const H = 720;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  const ACCENT = "#EC4899";
  const ACCENT_DEEP = "#BE185D";
  const ACCENT_SOFT = "#FBCFE8";
  const INK = "#1A0F1B";
  const BG = "#FBFAF6";

  // Background
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  // Outer frame
  ctx.strokeStyle = ACCENT;
  ctx.lineWidth = 3;
  ctx.strokeRect(6, 6, W - 12, H - 12);

  // Header pill at top — full width with title
  ctx.fillStyle = ACCENT;
  ctx.fillRect(6, 6, W - 12, 78);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "700 38px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText(spec.title, 32, 46);

  // Body content varies by kind
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = INK;
  ctx.textAlign = "left";

  if (spec.kind === "revenue") {
    // Area chart with two KPI rows
    const cx = 60, cy = 130, cw = 540, ch = 360;
    ctx.strokeStyle = "rgba(20,14,24,0.18)";
    ctx.lineWidth = 1.2;
    ctx.strokeRect(cx, cy, cw, ch);

    const points = [0.20, 0.34, 0.30, 0.55, 0.62, 0.74, 0.68, 0.92];
    ctx.beginPath();
    ctx.moveTo(cx, cy + ch);
    points.forEach((p, i) => {
      const x = cx + (i * cw) / (points.length - 1);
      const y = cy + ch - p * ch * 0.85;
      ctx.lineTo(x, y);
    });
    ctx.lineTo(cx + cw, cy + ch);
    ctx.closePath();
    ctx.fillStyle = ACCENT_SOFT;
    ctx.fill();

    ctx.beginPath();
    points.forEach((p, i) => {
      const x = cx + (i * cw) / (points.length - 1);
      const y = cy + ch - p * ch * 0.85;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = ACCENT_DEEP;
    ctx.lineWidth = 4.5;
    ctx.stroke();

    // KPI rows on the right
    ctx.fillStyle = INK;
    ctx.font = "500 30px ui-sans-serif, system-ui, -apple-system, 'Inter', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Quarter 1", 660, 200);
    ctx.fillText("Quarter 2", 660, 340);
    ctx.font = "700 44px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.textAlign = "right";
    ctx.fillText("$1.2M", W - 36, 200);
    ctx.fillText("$1.35M", W - 36, 340);

    // Faint divider
    ctx.strokeStyle = "rgba(20,14,24,0.10)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(660, 240); ctx.lineTo(W - 36, 240); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(660, 380); ctx.lineTo(W - 36, 380); ctx.stroke();
  }

  else if (spec.kind === "transactions") {
    const headers = ["DATE:", "VENDOR:", "AMOUNT:"];
    const xs = [42, 320, 720];
    const yHeader = 156;

    ctx.fillStyle = ACCENT_SOFT;
    ctx.fillRect(20, 116, W - 40, 64);
    ctx.fillStyle = ACCENT_DEEP;
    ctx.font = "700 28px ui-monospace, SFMono-Regular, Menlo, monospace";
    headers.forEach((h, i) => ctx.fillText(h, xs[i], yHeader + 6));

    const rows = [
      { d: "02.14", v: "Apex",  a: "$4,200" },
      { d: "02.16", v: "Nova",  a: "$1,180" },
      { d: "02.18", v: "Orion", a: "$980" },
    ];
    ctx.fillStyle = INK;
    ctx.font = "500 32px ui-sans-serif, system-ui, -apple-system, 'Inter', sans-serif";
    rows.forEach((r, i) => {
      const y = 256 + i * 110;
      ctx.fillText(r.d, xs[0], y);
      ctx.fillText(r.v, xs[1], y);
      ctx.fillText(r.a, xs[2], y);
      ctx.strokeStyle = "rgba(20,14,24,0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(20, y + 28);
      ctx.lineTo(W - 20, y + 28);
      ctx.stroke();
    });
  }

  else if (spec.kind === "doc-info") {
    const items = [
      { k: "PROCESSED:", v: "Financial_report.pdf" },
      { k: "TYPE:",      v: "Statement"  },
      { k: "STATUS:",    v: "Processed"  },
    ];
    items.forEach((it, i) => {
      const y = 180 + i * 130;
      ctx.fillStyle = ACCENT_DEEP;
      ctx.font = "700 26px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillText(it.k, 36, y);

      ctx.fillStyle = INK;
      ctx.font = "500 32px ui-sans-serif, system-ui, -apple-system, 'Inter', sans-serif";
      ctx.fillText(it.v, 360, y);

      ctx.strokeStyle = "rgba(20,14,24,0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(20, y + 30);
      ctx.lineTo(W - 20, y + 30);
      ctx.stroke();
    });

    // Small file glyph on the left
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.strokeRect(36, 460, 56, 70);
    ctx.beginPath();
    ctx.moveTo(70, 460);
    ctx.lineTo(92, 482);
    ctx.lineTo(70, 482);
    ctx.closePath();
    ctx.stroke();
  }

  else if (spec.kind === "entities") {
    const headers = ["VENDOR:", "CONFIDENCE:"];
    const xs = [42, 700];
    const yHeader = 156;

    ctx.fillStyle = ACCENT_SOFT;
    ctx.fillRect(20, 116, W - 40, 64);
    ctx.fillStyle = ACCENT_DEEP;
    ctx.font = "700 28px ui-monospace, SFMono-Regular, Menlo, monospace";
    headers.forEach((h, i) => ctx.fillText(h, xs[i], yHeader + 6));

    const rows = [
      { v: "Apex",  c: "98%" },
      { v: "Nova",  c: "96%" },
      { v: "Orion", c: "95%" },
    ];
    rows.forEach((r, i) => {
      const y = 256 + i * 110;
      ctx.fillStyle = INK;
      ctx.font = "500 32px ui-sans-serif, system-ui, -apple-system, 'Inter', sans-serif";
      ctx.fillText(r.v, xs[0], y);
      ctx.font = "700 32px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textAlign = "right";
      ctx.fillText(r.c, W - 36, y);
      ctx.textAlign = "left";

      ctx.strokeStyle = "rgba(20,14,24,0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(20, y + 28);
      ctx.lineTo(W - 20, y + 28);
      ctx.stroke();
    });
  }

  else if (spec.kind === "expense") {
    const items = [
      { k: "Logistics",  pct: 0.38 },
      { k: "Materials",  pct: 0.27 },
      { k: "Operations", pct: 0.21 },
    ];
    const yStart = 168;
    const rowH = 158;
    const labelX = 32;
    const barX = 280;
    const barMaxW = W - 380;

    items.forEach((it, i) => {
      const y = yStart + i * rowH;
      ctx.fillStyle = INK;
      ctx.font = "500 32px ui-sans-serif, system-ui, -apple-system, 'Inter', sans-serif";
      ctx.fillText(it.k, labelX, y + 14);

      ctx.fillStyle = "#F3E8EE";
      ctx.fillRect(barX, y - 16, barMaxW, 48);
      ctx.fillStyle = ACCENT;
      ctx.fillRect(barX, y - 16, barMaxW * it.pct, 48);

      ctx.fillStyle = ACCENT_DEEP;
      ctx.font = "700 30px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textAlign = "right";
      ctx.fillText(`${Math.round(it.pct * 100)}%`, W - 36, y + 14);
      ctx.textAlign = "left";
    });

    // Header label "EXPENSE BREAKDOWN" with weight numbers
    ctx.fillStyle = ACCENT_DEEP;
    ctx.font = "700 26px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.textAlign = "right";
    ctx.fillText("38%%", W - 36, 124);
    ctx.textAlign = "left";
  }

  else if (spec.kind === "summary") {
    const para =
      "Quarterly report indicating steady growth across operational divisions with revenue increasing year-over-year.";

    ctx.fillStyle = INK;
    ctx.font = "500 38px 'Crimson Pro', 'Times New Roman', serif";
    const wrap = (text: string, x: number, y: number, maxW: number, lineH: number) => {
      const words = text.split(" ");
      let line = "";
      let yy = y;
      for (const w of words) {
        const test = line ? `${line} ${w}` : w;
        if (ctx.measureText(test).width > maxW && line) {
          ctx.fillText(line, x, yy);
          line = w;
          yy += lineH;
        } else {
          line = test;
        }
      }
      if (line) ctx.fillText(line, x, yy);
    };
    wrap(para, 36, 200, W - 80, 60);
  }

  // Plus marks — top-right + bottom-right (DOSS signature)
  const plus = (px: number, py: number) => {
    ctx.strokeStyle = ACCENT;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(px - 12, py); ctx.lineTo(px + 12, py);
    ctx.moveTo(px, py - 12); ctx.lineTo(px, py + 12);
    ctx.stroke();
  };
  plus(W - 32, 32);
  plus(W - 32, H - 32);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 16;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}

// ── Vertical panel slab ─────────────────────────────────
interface PanelHandle {
  group: THREE.Group;
  mesh: THREE.Mesh;
  materials: THREE.MeshBasicMaterial[];
  edgeMaterial: THREE.LineBasicMaterial;
  geo: THREE.BoxGeometry;
  edgeGeo: THREE.EdgesGeometry;
  textures: THREE.Texture[];
}

function createPanel(opts: {
  w: number;
  h: number;
  t: number;
  frontTexture: THREE.Texture;
  edgeColor: number;
  edgeOpacity?: number;
  baseOpacity?: number;
  sideTint?: number;
}): PanelHandle {
  const { w, h, t, frontTexture, edgeColor } = opts;
  const edgeOpacity = opts.edgeOpacity ?? 0.42;
  const baseOpacity = opts.baseOpacity ?? 1.0;
  const sideTint = opts.sideTint ?? 0xEEEEEE;

  const geo = new THREE.BoxGeometry(w, h, t);
  geo.translate(0, h / 2, 0);

  const sideMat = (col: number) =>
    new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: baseOpacity });

  const mPlusX = sideMat(sideTint);
  const mMinusX = sideMat(sideTint);
  const mPlusY = sideMat(sideTint);
  const mMinusY = sideMat(sideTint);
  const mPlusZ = new THREE.MeshBasicMaterial({
    map: frontTexture, transparent: true, opacity: baseOpacity,
  });
  const mMinusZ = sideMat(sideTint);

  const materials = [mPlusX, mMinusX, mPlusY, mMinusY, mPlusZ, mMinusZ];
  const mesh = new THREE.Mesh(geo, materials);

  const edgeGeo = new THREE.EdgesGeometry(geo);
  const edgeMaterial = new THREE.LineBasicMaterial({
    color: edgeColor, transparent: true, opacity: edgeOpacity * baseOpacity,
  });
  const edges = new THREE.LineSegments(edgeGeo, edgeMaterial);

  const group = new THREE.Group();
  group.add(mesh);
  group.add(edges);

  return {
    group, mesh, materials, edgeMaterial, geo, edgeGeo,
    textures: [frontTexture],
  };
}

// ── Connector (magenta leader with terminal dot) ───────
function createLeader(start: THREE.Vector3, end: THREE.Vector3): {
  line: THREE.Line;
  material: THREE.LineBasicMaterial;
  geometry: THREE.BufferGeometry;
  dot: THREE.Mesh;
  dotMaterial: THREE.MeshBasicMaterial;
  dotGeo: THREE.CircleGeometry;
} {
  const geometry = new THREE.BufferGeometry().setFromPoints([start.clone(), end.clone()]);
  const material = new THREE.LineBasicMaterial({
    color: 0xEC4899,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    depthTest: false,
  });
  const line = new THREE.Line(geometry, material);
  line.renderOrder = 6;

  const dotGeo = new THREE.CircleGeometry(0.04, 24);
  const dotMaterial = new THREE.MeshBasicMaterial({
    color: 0xEC4899, transparent: true, opacity: 0,
    depthWrite: false, depthTest: false,
  });
  const dot = new THREE.Mesh(dotGeo, dotMaterial);
  dot.position.copy(start);
  dot.renderOrder = 7;

  return { line, material, geometry, dot, dotMaterial, dotGeo };
}

// ============================================================================
// Component
// ============================================================================

export default function DocLayered() {
  const mountRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const lookAtRef = useRef<THREE.Vector3>(LOOKAT.clone());
  const startTimeRef = useRef(performance.now());

  const [elevation, setElevation] = useState(INITIAL_ELEVATION);
  const [azimuth, setAzimuth] = useState(INITIAL_AZIMUTH);
  const [frustum, setFrustum] = useState(INITIAL_FRUSTUM);

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
        CAM_DIST * Math.cos(e) * Math.sin(a) + LOOKAT.x,
        CAM_DIST * Math.sin(e) + LOOKAT.y,
        CAM_DIST * Math.cos(e) * Math.cos(a) + LOOKAT.z,
      );
      camera.lookAt(LOOKAT);
    }
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true, alpha: true, powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const disposables: Array<{ dispose: () => void }> = [];

    // ── Document stack (back layer) ──
    interface DocInst {
      group: THREE.Group;
      handle: PanelHandle;
      delay: number;
    }
    const docs: DocInst[] = [];
    for (let i = 0; i < NUM_DOCS; i++) {
      const isFront = i === FRONT_DOC_INDEX;
      const tex = createDocTexture({ full: isFront });
      disposables.push(tex);

      const handle = createPanel({
        w: DOC_W, h: DOC_H, t: DOC_T,
        frontTexture: tex,
        edgeColor: 0x1A1A1F,
        edgeOpacity: isFront ? 0.45 : 0.18,
        baseOpacity: isFront ? 1.0 : 0.85,
        sideTint: 0xF6F4EE,
      });
      handle.materials.forEach((m) => { m.opacity = 0; });
      handle.edgeMaterial.opacity = 0;

      const x = DOC_X_BASE + i * DOC_X_STEP;
      const y = DOC_Y_BASE - i * DOC_Y_STEP;
      const z = DOC_Z_BASE + i * DOC_Z_STEP;
      const ry = (-i * DOC_ROT_STEP_DEG * Math.PI) / 180;
      handle.group.position.set(x, y, z);
      handle.group.rotation.y = ry;
      scene.add(handle.group);

      disposables.push(handle.geo, handle.edgeGeo, handle.edgeMaterial);
      for (const m of handle.materials) disposables.push(m);

      docs.push({ group: handle.group, handle, delay: i * DOC_REVEAL_PER });
    }

    // Capture front-doc anchor point in world space (for leader lines)
    const frontDocGroup = docs[FRONT_DOC_INDEX].group;
    frontDocGroup.updateMatrixWorld();

    // ── Card layer (front) ──
    interface CardInst {
      group: THREE.Group;
      handle: PanelHandle;
      target: THREE.Vector3;
      slideStart: THREE.Vector3;
      delay: number;
      leader: ReturnType<typeof createLeader>;
      leaderStart: THREE.Vector3;  // anchor on front doc, in world space
      leaderTarget: THREE.Vector3; // anchor on card, world space
    }
    const cards: CardInst[] = [];

    CARDS.forEach((spec, i) => {
      const tex = createCardTexture(spec);
      disposables.push(tex);

      const handle = createPanel({
        w: CARD_W, h: CARD_H, t: CARD_T,
        frontTexture: tex,
        edgeColor: 0xEC4899,
        edgeOpacity: 0.55,
        baseOpacity: 1.0,
        sideTint: 0xFCE7F3,
      });
      handle.materials.forEach((m) => { m.opacity = 0; });
      handle.edgeMaterial.opacity = 0;

      const x = CARD_X_BASE + spec.col * CARD_X_STEP;
      // grid descends from top
      const yTop = CARD_Y_TOP - spec.row * CARD_Y_STEP;
      // group origin is bottom of panel — offset so the target Y is the bottom
      const yBottom = yTop - CARD_H;
      const z = CARD_Z_BASE + ((i % 2 === 0) ? 0 : CARD_Z_JITTER);

      const target = new THREE.Vector3(x, yBottom, z);
      const slideStart = target.clone().add(new THREE.Vector3(0, 0, CARD_SLIDE_FROM_Z));
      handle.group.position.copy(slideStart);
      // Slight Y rotation per card so they don't all face exactly the same way
      handle.group.rotation.y = ((spec.col === 0 ? -1 : 1) * 1.5 * Math.PI) / 180;
      scene.add(handle.group);

      disposables.push(handle.geo, handle.edgeGeo, handle.edgeMaterial);
      for (const m of handle.materials) disposables.push(m);

      // Leader anchors:
      //   leaderStart = a point on the front doc's face (left side, varies per card row)
      //   leaderTarget = card centre-left-edge in world space (computed from target + slight)
      const localDocPoint = new THREE.Vector3(
        DOC_W * 0.18 + (spec.col === 0 ? -DOC_W * 0.04 : DOC_W * 0.06),
        DOC_H * (0.78 - spec.row * 0.18),
        DOC_T / 2 + 0.01,
      );
      const leaderStart = localDocPoint.clone().applyMatrix4(frontDocGroup.matrixWorld);
      const leaderTarget = new THREE.Vector3(
        target.x - CARD_W * 0.5,
        target.y + CARD_H * 0.62,
        target.z + CARD_T / 2 + 0.01,
      );

      const leader = createLeader(leaderStart, leaderTarget);
      scene.add(leader.line);
      scene.add(leader.dot);
      disposables.push(leader.geometry, leader.material, leader.dotGeo, leader.dotMaterial);

      cards.push({
        group: handle.group, handle, target, slideStart,
        delay: i * CARD_REVEAL_PER,
        leader, leaderStart, leaderTarget,
      });
    });

    startTimeRef.current = performance.now();

    let frameId = 0;
    const animate = () => {
      const t = (performance.now() - startTimeRef.current) / 1000;

      // Doc reveal
      docs.forEach((d) => {
        const local = t - DOC_REVEAL_START - d.delay;
        const p = Math.max(0, Math.min(local / DOC_REVEAL_DURATION, 1));
        const eased = easeOutCubic(p);
        const baseOp = d === docs[FRONT_DOC_INDEX] ? 1.0 : 0.85;
        d.handle.materials.forEach((m, idx) => {
          const target = idx === 4 ? baseOp : baseOp * 0.92;
          m.opacity = target * eased;
        });
        d.handle.edgeMaterial.opacity = (d === docs[FRONT_DOC_INDEX] ? 0.45 : 0.18) * eased;
      });

      // Card reveal — slide forward + fade in
      cards.forEach((c) => {
        const local = t - CARD_REVEAL_START - c.delay;
        const p = Math.max(0, Math.min(local / CARD_REVEAL_DURATION, 1));
        const eased = easeOutCubic(p);
        c.handle.materials.forEach((m, idx) => {
          const target = idx === 4 ? 1.0 : 0.92;
          m.opacity = target * eased;
        });
        c.handle.edgeMaterial.opacity = 0.55 * eased;

        c.group.position.x = c.slideStart.x + (c.target.x - c.slideStart.x) * eased;
        c.group.position.y = c.slideStart.y + (c.target.y - c.slideStart.y) * eased;
        c.group.position.z = c.slideStart.z + (c.target.z - c.slideStart.z) * eased;
      });

      // Leader lines (drawn-in effect)
      cards.forEach((c, i) => {
        const local = t - LEADER_START - i * LEADER_PER;
        const p = Math.max(0, Math.min(local / LEADER_DURATION, 1));
        const eased = easeOutCubic(p);
        c.leader.material.opacity = 0.7 * eased;
        // Animate the second point from start → target
        const positions = c.leader.geometry.attributes.position as THREE.BufferAttribute;
        const x = c.leaderStart.x + (c.leaderTarget.x - c.leaderStart.x) * eased;
        const y = c.leaderStart.y + (c.leaderTarget.y - c.leaderStart.y) * eased;
        const z = c.leaderStart.z + (c.leaderTarget.z - c.leaderStart.z) * eased;
        positions.setXYZ(0, c.leaderStart.x, c.leaderStart.y, c.leaderStart.z);
        positions.setXYZ(1, x, y, z);
        positions.needsUpdate = true;
        c.leader.dotMaterial.opacity = 0.9 * eased;
        c.leader.dot.position.set(c.leaderStart.x, c.leaderStart.y, c.leaderStart.z);
      });

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!mountRef.current) return;
      width = mountRef.current.clientWidth;
      height = mountRef.current.clientHeight;
      aspect = width / height;
      const f = (cameraRef.current && cameraRef.current.top * 2) || INITIAL_FRUSTUM;
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
        try { d.dispose(); } catch { /* noop */ }
      }
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      cameraRef.current = null;
    };
  }, []);

  // Camera reactive to elevation/azimuth (for entrance + future controls)
  useEffect(() => {
    const cam = cameraRef.current;
    if (!cam) return;
    const e = (elevation * Math.PI) / 180;
    const a = (azimuth * Math.PI) / 180;
    const lookAt = lookAtRef.current;
    cam.position.set(
      CAM_DIST * Math.cos(e) * Math.sin(a) + lookAt.x,
      CAM_DIST * Math.sin(e) + lookAt.y,
      CAM_DIST * Math.cos(e) * Math.cos(a) + lookAt.z,
    );
    cam.lookAt(lookAt);
  }, [elevation, azimuth]);

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

  // Subtle entrance — small elevation drift, no big camera move
  const startEntranceAnimation = useCallback(() => {
    if (entranceFrameRef.current !== null) {
      cancelAnimationFrame(entranceFrameRef.current);
    }
    userInteractedRef.current = false;
    setElevation(INITIAL_ELEVATION);
    setAzimuth(INITIAL_AZIMUTH);
    setFrustum(INITIAL_FRUSTUM);
    const start = performance.now();
    const tick = () => {
      if (userInteractedRef.current) {
        entranceFrameRef.current = null;
        return;
      }
      const t = Math.min((performance.now() - start) / ENTRANCE_DURATION, 1);
      const eased = easeInOutCubic(t);
      setElevation(INITIAL_ELEVATION + (DEFAULT_ELEVATION - INITIAL_ELEVATION) * eased);
      setAzimuth(INITIAL_AZIMUTH + (DEFAULT_AZIMUTH - INITIAL_AZIMUTH) * eased);
      setFrustum(INITIAL_FRUSTUM + (DEFAULT_FRUSTUM - INITIAL_FRUSTUM) * eased);
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

  return (
    <div className="dl-root">
      <style>{DL_STYLES}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;550;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Crimson+Pro:ital,wght@0,400;0,500;1,500&display=swap"
        rel="stylesheet"
      />

      <nav className="dl-nav">
        <div className="dl-nav-inner">
          <Link to="/linear-flow" className="dl-nav-logo" aria-label="Unifize">
            <img src="/Link - home.svg" alt="Unifize" className="dl-nav-logo-img" />
          </Link>
          <div className="dl-nav-items">
            <a href="#problem">The Problem</a>
            <a href="#world">Your World</a>
            <a href="#industry">By Industry</a>
            <a href="#how">How It Works</a>
            <a href="#proof">Proof</a>
          </div>
          <div className="dl-nav-actions">
            <a href="#login" className="dl-nav-link">Log in</a>
            <button className="dl-nav-btn">Book a demo</button>
          </div>
        </div>
      </nav>

      <div className="dl-stage-wrap">
        <div ref={mountRef} className="dl-stage" />

        {/* Diagonal banner — STRUCTURING DOCUMENT DATA... */}
        <div className="dl-banner">
          <div className="dl-banner-pill">
            <span className="dl-banner-marks">
              <span></span><span></span><span></span>
            </span>
            STRUCTURING DOCUMENT DATA<span style={{ marginLeft: 6 }}>..</span>
          </div>
        </div>

        {/* Side annotation pills — TABLES, GRAPHS, TEXTS, FORMS */}
        <div className="dl-side-annots">
          <div className="dl-annot-group g1">
            <div className="dl-annot-pill"><TablesIcon /> Tables</div>
            <div className="dl-annot-pill"><GraphsIcon /> Graphs</div>
          </div>
          <div className="dl-annot-group g2">
            <div className="dl-annot-pill"><TextsIcon /> Texts</div>
            <div className="dl-annot-pill"><FormsIcon /> Forms</div>
          </div>
          <div className="dl-annot-group g3">
            <div className="dl-annot-pill"><TablesIcon /> Tables</div>
            <div className="dl-annot-pill"><GraphsIcon /> Graphs</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Annotation icons ────────────────────────────────────
function TablesIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <rect x="2" y="3" width="12" height="10" rx="1" />
      <line x1="2" y1="6.5" x2="14" y2="6.5" />
      <line x1="2" y1="9.5" x2="14" y2="9.5" />
      <line x1="6" y1="3" x2="6" y2="13" />
    </svg>
  );
}
function GraphsIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <line x1="2" y1="13" x2="14" y2="13" />
      <rect x="3" y="9" width="2" height="4" fill="currentColor" />
      <rect x="7" y="6" width="2" height="7" fill="currentColor" />
      <rect x="11" y="3" width="2" height="10" fill="currentColor" />
    </svg>
  );
}
function TextsIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M4 4h8M8 4v9" />
    </svg>
  );
}
function FormsIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <rect x="2" y="3" width="12" height="10" rx="1" />
      <line x1="4.5" y1="6.5" x2="11.5" y2="6.5" />
      <line x1="4.5" y1="9.5" x2="9" y2="9.5" />
    </svg>
  );
}
