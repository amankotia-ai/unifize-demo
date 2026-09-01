import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";

// ============================================================================
// E1 — The Gap, Three Zones (problem only, no Unifize centre)
// ----------------------------------------------------------------------------
// Grounded in the canonical Story Architecture v1.4 and Unifize Concept Map
// v1.2. Three-zone coexistence model, with the centre Unifize platform
// intentionally OMITTED here because E1 is "problem only" per the Ben call
// constraints. The viewer sees:
//
//   LEFT   ── SYSTEMS OF RECORD (function-labelled, no product names)
//   CENTRE ── empty. This is the gap. It is the visual subject.
//   RIGHT  ── SYSTEMS OF COORDINATION, two strata:
//             top    : horizontal tools  (SharePoint, Excel, OneDrive, ...)
//             bottom : collaboration channels (Outlook, Teams, Calls, ...)
//
// Story carried by the hero copy above the visual; the visual carries the
// architectural shape. Plural everywhere: systemS of record / systemS of
// coordination. Microsoft-stack vocabulary on the right per diagram rules.
// ============================================================================

const E1_STYLES = `
html:has(.e1-root) { scroll-behavior: smooth; }
.e1-root [id] { scroll-margin-top: 72px; }
.e1-root {
  --e1-fg: 255, 255, 255;
  --e1-bg: #08090A;
  --e1-bg-rgb: 8, 9, 10;
  --e1-bg-card: #14151B;
  --e1-border: rgba(var(--e1-fg), 0.08);
  --e1-border-strong: rgba(var(--e1-fg), 0.14);
  --e1-text: #FFFFFF;
  --e1-text-muted: rgba(var(--e1-fg), 0.56);
  --e1-text-faint: rgba(var(--e1-fg), 0.38);
  --e1-accent: #EC4899;

  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  background: var(--e1-bg);
  color: var(--e1-text);
  -webkit-font-smoothing: antialiased;
  letter-spacing: -0.011em;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}
.e1-root[data-theme="light"] {
  --e1-fg: 11, 13, 17;
  --e1-bg: #FAFAFB;
  --e1-bg-rgb: 250, 250, 251;
  --e1-bg-card: #FFFFFF;
  --e1-text: #0B0D11;
  --e1-text-muted: rgba(var(--e1-fg), 0.62);
  --e1-text-faint: rgba(var(--e1-fg), 0.42);
}
.e1-root * { box-sizing: border-box; }
.e1-root .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
.e1-root a { color: inherit; text-decoration: none; }

.e1-nav {
  position: sticky; top: 0; z-index: 50;
  backdrop-filter: saturate(160%) blur(18px);
  background: rgba(var(--e1-bg-rgb), 0.72);
  border-bottom: 1px solid var(--e1-border);
}
.e1-nav-inner {
  max-width: 1320px; margin: 0 auto;
  padding: 10px 24px;
  display: flex; align-items: center; gap: 40px;
}
.e1-nav-logo { display: inline-flex; align-items: center; }
.e1-nav-logo-img {
  height: 22px; width: auto; display: block;
  filter: brightness(0) invert(1);
}
.e1-root[data-theme="light"] .e1-nav-logo-img { filter: brightness(0); }
.e1-nav-items { display: flex; gap: 26px; font-size: 13.5px; color: var(--e1-text-muted); }
.e1-nav-items a:hover { color: var(--e1-text); }
.e1-nav-actions { margin-left: auto; display: flex; gap: 18px; align-items: center; }
.e1-nav-link { font-size: 13.5px; color: var(--e1-text-muted); }
.e1-nav-link:hover { color: var(--e1-text); }
.e1-nav-btn {
  font-size: 13px; font-weight: 500;
  background: var(--e1-text); color: var(--e1-bg);
  padding: 7px 14px; border-radius: 999px;
  border: 1px solid var(--e1-text);
  cursor: pointer;
}
.e1-theme-toggle {
  width: 30px; height: 30px;
  display: inline-flex; align-items: center; justify-content: center;
  background: transparent;
  border: 1px solid var(--e1-border);
  border-radius: 999px;
  color: var(--e1-text-muted);
  cursor: pointer;
}
@media (max-width: 860px) { .e1-nav-items { display: none; } }

.e1-hero {
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: 64px 24px 28px;
}
.e1-eyebrow {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--e1-text-faint);
  margin-bottom: 18px;
}
.e1-h1 {
  font-size: clamp(36px, 5vw, 72px);
  font-weight: 500;
  line-height: 1.04;
  letter-spacing: -0.024em;
  max-width: 24ch;
  margin: 0;
  color: var(--e1-text);
}
.e1-h1-fade { color: var(--e1-text-muted); }
.e1-subhead {
  margin: 22px 0 0;
  font-size: 16.5px;
  line-height: 1.55;
  color: var(--e1-text-muted);
  max-width: 64ch;
  letter-spacing: -0.006em;
}

.e1-visual-wrap {
  position: relative;
  width: 100%;
  height: 70vh;
  min-height: 520px;
  overflow: hidden;
  background: radial-gradient(ellipse at center, #18181a 0%, #101011 60%, #0a0a0b 100%);
}
.e1-visual { position: absolute; inset: 0; width: 100%; height: 100%; }
`;

type Theme = "dark" | "light";

// ── Camera ──────────────────────────────────────────────
// Subtle entrance: a small elevation drop. The reveal energy lives in
// the populate sequence, not in a big camera swoop.
const INITIAL_ELEVATION = 38;
const DEFAULT_ELEVATION = 24;
const INITIAL_AZIMUTH = 28;
const DEFAULT_AZIMUTH = 28;
const INITIAL_FRUSTUM = 11.5;
const DEFAULT_FRUSTUM = 10.5;
const CAM_DIST = 42;
const ENTRANCE_DURATION = 1800;

const LOOKAT_INITIAL = new THREE.Vector3(0, 1.0, 0);
const LOOKAT_DEFAULT = new THREE.Vector3(0, 1.0, 0);

// ── Records (left zone) ────────────────────────────────
// Six function-level systems of record. Function names rather than
// product categories per the homepage no-product-labels rule.
interface RecordSpec {
  id: string;
  label: string;
  iconKind: "design" | "quality" | "production" | "resource" | "lab" | "equipment";
}
const RECORDS: RecordSpec[] = [
  { id: "r1", label: "DESIGN RECORDS",      iconKind: "design"      },
  { id: "r2", label: "QUALITY RECORDS",     iconKind: "quality"     },
  { id: "r3", label: "PRODUCTION RECORDS",  iconKind: "production"  },
  { id: "r4", label: "RESOURCE RECORDS",    iconKind: "resource"    },
  { id: "r5", label: "LAB RECORDS",         iconKind: "lab"         },
  { id: "r6", label: "EQUIPMENT RECORDS",   iconKind: "equipment"   },
];

const REC_W = 1.45;
const REC_H = 2.0;
const REC_T = 0.05;
// Two columns × three rows on the left side
const REC_X_BASE = -6.4;
const REC_Y_BASE = 0.0;
const REC_COL_GAP = 0.28;
const REC_ROW_GAP = 0.24;
const REC_Z_JITTER = 0.12;

// ── Coordination (right zone) ──────────────────────────
// Two strata, four tiles each.
//   Top    : Horizontal tools          (SharePoint, Excel, OneDrive, Drives)
//   Bottom : Collaboration channels    (Outlook, Teams, Calls, Meetings)
type ToolKind =
  | "sharepoint" | "excel" | "onedrive" | "drives"
  | "outlook" | "teams" | "calls" | "meetings";

interface ToolSpec {
  id: string;
  label: string;
  kind: ToolKind;
  stratum: "horizontal" | "collab";
}

const TOOLS: ToolSpec[] = [
  // Top row — horizontal tools
  { id: "h1", label: "SHAREPOINT", kind: "sharepoint", stratum: "horizontal" },
  { id: "h2", label: "EXCEL",      kind: "excel",      stratum: "horizontal" },
  { id: "h3", label: "ONEDRIVE",   kind: "onedrive",   stratum: "horizontal" },
  { id: "h4", label: "DRIVES",     kind: "drives",     stratum: "horizontal" },
  // Bottom row — collaboration channels
  { id: "c1", label: "OUTLOOK",    kind: "outlook",    stratum: "collab"     },
  { id: "c2", label: "TEAMS",      kind: "teams",      stratum: "collab"     },
  { id: "c3", label: "CALLS",      kind: "calls",      stratum: "collab"     },
  { id: "c4", label: "MEETINGS",   kind: "meetings",   stratum: "collab"     },
];

const TOOL_W = 1.30;
const TOOL_H = 1.55;
const TOOL_T = 0.05;
// Right cluster: 4 columns × 2 rows
const TOOL_X_BASE = 1.4;
const TOOL_COL_GAP = 0.30;
const TOOL_ROW_GAP = 0.34;
const TOOL_TOP_Y = TOOL_H + TOOL_ROW_GAP; // top row y-base
const TOOL_BOTTOM_Y = 0.0;                // bottom row y-base

// ── Animation timing ────────────────────────────────────
const GRID_FADE_DURATION = 0.6;
const GRID_TARGET_OPACITY = 0.13;

const REC_REVEAL_START = 0.35;
const REC_REVEAL_PER = 0.07;
const REC_REVEAL_DURATION = 0.55;

const TOOL_REVEAL_START = 1.25;
const TOOL_REVEAL_PER = 0.07;
const TOOL_REVEAL_DURATION = 0.55;

const ZONE_LABEL_START = 2.4;
const ZONE_LABEL_DURATION = 0.8;

// ── Easing ──────────────────────────────────────────────
function easeInOutCubic(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
function easeOutCubic(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - x, 3);
}

// ── Record tile texture (cream / parchment with function label) ──
function createRecordTexture(spec: RecordSpec): THREE.CanvasTexture {
  const W = 768;
  const H = 1024;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  // Cream gradient
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#F5EFD8");
  bg.addColorStop(1, "#E8E0C2");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Paper grain
  const grain = ctx.getImageData(0, 0, W, H);
  for (let i = 0; i < grain.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 6;
    grain.data[i] = Math.max(0, Math.min(255, grain.data[i] + n));
    grain.data[i + 1] = Math.max(0, Math.min(255, grain.data[i + 1] + n));
    grain.data[i + 2] = Math.max(0, Math.min(255, grain.data[i + 2] + n));
  }
  ctx.putImageData(grain, 0, 0);

  // Frame
  const ink = "#3A3528";
  const inkSoft = "#7A7058";
  ctx.strokeStyle = ink;
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, W - 40, H - 40);

  // Header strip — small monospace label at top
  ctx.fillStyle = ink;
  ctx.fillRect(20, 20, W - 40, 80);

  ctx.fillStyle = "#F5EFD8";
  ctx.font = "700 28px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(spec.label, W / 2, 60);

  // Icon area (centre, large)
  const cx = W / 2;
  const cy = H / 2 - 40;
  drawRecordIcon(ctx, spec.iconKind, cx, cy, 240, ink, inkSoft);

  // Faux metadata block at bottom
  ctx.fillStyle = inkSoft;
  ctx.font = "500 22px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.textAlign = "left";
  ctx.fillText("AUTHORITATIVE", 50, H - 160);
  ctx.fillStyle = ink;
  ctx.font = "700 24px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillText("System of Record", 50, H - 124);

  // Tiny faux table lines
  ctx.fillStyle = "rgba(58,53,40,0.55)";
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(50, H - 90 + i * 14, W - 100 - (i % 2) * 60, 3);
  }

  // Plus-mark crop registers (DOSS style)
  const plus = (px: number, py: number) => {
    ctx.strokeStyle = ink;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(px - 12, py); ctx.lineTo(px + 12, py);
    ctx.moveTo(px, py - 12); ctx.lineTo(px, py + 12);
    ctx.stroke();
  };
  plus(48, 130);
  plus(W - 48, 130);
  plus(48, H - 48);
  plus(W - 48, H - 48);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 16;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}

function drawRecordIcon(
  ctx: CanvasRenderingContext2D,
  kind: RecordSpec["iconKind"],
  cx: number, cy: number,
  size: number,
  ink: string, inkSoft: string,
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = ink;
  ctx.fillStyle = ink;
  ctx.lineWidth = size * 0.022;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const s = size;

  if (kind === "design") {
    // Drafting grid + a folded blueprint corner
    ctx.strokeStyle = inkSoft;
    ctx.lineWidth = 1.5;
    for (let i = -3; i <= 3; i++) {
      const t = (i / 3) * (s * 0.45);
      ctx.beginPath(); ctx.moveTo(-s * 0.45, t); ctx.lineTo(s * 0.45, t); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(t, -s * 0.45); ctx.lineTo(t, s * 0.45); ctx.stroke();
    }
    ctx.strokeStyle = ink;
    ctx.lineWidth = s * 0.022;
    // page outline with folded corner
    const w = s * 0.7, h = s * 0.85, fold = s * 0.15;
    ctx.beginPath();
    ctx.moveTo(-w / 2, -h / 2);
    ctx.lineTo(w / 2 - fold, -h / 2);
    ctx.lineTo(w / 2, -h / 2 + fold);
    ctx.lineTo(w / 2, h / 2);
    ctx.lineTo(-w / 2, h / 2);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w / 2 - fold, -h / 2);
    ctx.lineTo(w / 2 - fold, -h / 2 + fold);
    ctx.lineTo(w / 2, -h / 2 + fold);
    ctx.stroke();
  } else if (kind === "quality") {
    // Shield with checkmark
    const w = s * 0.55;
    const h = s * 0.65;
    ctx.beginPath();
    ctx.moveTo(0, -h / 2);
    ctx.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 4);
    ctx.lineTo(w / 2, h / 6);
    ctx.quadraticCurveTo(w / 2, h / 2, 0, h / 2);
    ctx.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 6);
    ctx.lineTo(-w / 2, -h / 4);
    ctx.quadraticCurveTo(-w / 2, -h / 2, 0, -h / 2);
    ctx.closePath();
    ctx.stroke();
    // checkmark
    ctx.lineWidth = s * 0.05;
    ctx.beginPath();
    ctx.moveTo(-w * 0.35, 0);
    ctx.lineTo(-w * 0.05, w * 0.28);
    ctx.lineTo(w * 0.4, -w * 0.28);
    ctx.stroke();
  } else if (kind === "production") {
    // Two interlocking gears
    const drawGear = (gx: number, gy: number, r: number, teeth: number) => {
      const rt = r * 0.18;
      ctx.beginPath();
      for (let i = 0; i < teeth * 2; i++) {
        const a = (i / (teeth * 2)) * Math.PI * 2;
        const rr = i % 2 === 0 ? r + rt : r;
        const x = gx + rr * Math.cos(a);
        const y = gy + rr * Math.sin(a);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(gx, gy, r * 0.32, 0, Math.PI * 2);
      ctx.stroke();
    };
    drawGear(-s * 0.16, -s * 0.04, s * 0.24, 10);
    drawGear(s * 0.18, s * 0.10, s * 0.18, 8);
  } else if (kind === "resource") {
    // Stacked ledger / tabular bars
    const w = s * 0.7;
    const rowH = s * 0.10;
    const yStart = -s * 0.32;
    ctx.lineWidth = s * 0.02;
    ctx.strokeRect(-w / 2, yStart, w, rowH * 6);
    for (let i = 1; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(-w / 2, yStart + rowH * i);
      ctx.lineTo(w / 2, yStart + rowH * i);
      ctx.stroke();
    }
    // column divider
    ctx.beginPath();
    ctx.moveTo(0, yStart);
    ctx.lineTo(0, yStart + rowH * 6);
    ctx.stroke();
    // a few filled cells
    ctx.fillStyle = inkSoft;
    ctx.fillRect(-w / 2 + 4, yStart + 4, w / 2 - 8, rowH - 8);
    ctx.fillRect(4, yStart + rowH * 2 + 4, w / 2 - 8, rowH - 8);
    ctx.fillRect(-w / 2 + 4, yStart + rowH * 4 + 4, w / 2 - 8, rowH - 8);
  } else if (kind === "lab") {
    // Test tube with markings
    const tubeW = s * 0.22;
    const tubeH = s * 0.62;
    ctx.beginPath();
    ctx.moveTo(-tubeW / 2, -tubeH / 2);
    ctx.lineTo(-tubeW / 2, tubeH / 2 - tubeW / 2);
    ctx.quadraticCurveTo(-tubeW / 2, tubeH / 2, 0, tubeH / 2);
    ctx.quadraticCurveTo(tubeW / 2, tubeH / 2, tubeW / 2, tubeH / 2 - tubeW / 2);
    ctx.lineTo(tubeW / 2, -tubeH / 2);
    ctx.stroke();
    // top cap
    ctx.beginPath();
    ctx.moveTo(-tubeW / 2 - 0.04 * s, -tubeH / 2);
    ctx.lineTo(tubeW / 2 + 0.04 * s, -tubeH / 2);
    ctx.stroke();
    // tick marks
    ctx.strokeStyle = inkSoft;
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 5; i++) {
      const ty = -tubeH / 2 + (i + 1) * (tubeH / 6);
      ctx.beginPath();
      ctx.moveTo(-tubeW / 2 + 4, ty);
      ctx.lineTo(-tubeW / 2 + 14, ty);
      ctx.stroke();
    }
    // liquid fill
    ctx.fillStyle = ink;
    ctx.beginPath();
    ctx.moveTo(-tubeW / 2 + 2, 0);
    ctx.lineTo(-tubeW / 2 + 2, tubeH / 2 - tubeW / 2 - 2);
    ctx.quadraticCurveTo(-tubeW / 2 + 2, tubeH / 2 - 2, 0, tubeH / 2 - 2);
    ctx.quadraticCurveTo(tubeW / 2 - 2, tubeH / 2 - 2, tubeW / 2 - 2, tubeH / 2 - tubeW / 2 - 2);
    ctx.lineTo(tubeW / 2 - 2, 0);
    ctx.closePath();
    ctx.fill();
  } else if (kind === "equipment") {
    // Wrench overlapping a gear
    ctx.lineWidth = s * 0.022;
    // gear backdrop
    const r = s * 0.22;
    ctx.beginPath();
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const rr = i % 2 === 0 ? r + s * 0.04 : r;
      const x = rr * Math.cos(a);
      const y = rr * Math.sin(a);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.42, 0, Math.PI * 2);
    ctx.stroke();
    // wrench across
    ctx.save();
    ctx.rotate(Math.PI / 4);
    ctx.lineWidth = s * 0.05;
    ctx.beginPath();
    ctx.moveTo(-s * 0.3, 0);
    ctx.lineTo(s * 0.3, 0);
    ctx.stroke();
    // jaw circles
    ctx.beginPath();
    ctx.arc(-s * 0.32, 0, s * 0.07, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(s * 0.32, 0, s * 0.07, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

// ── Tool tile texture (magenta strata: horizontal vs collab) ──
function createToolTexture(spec: ToolSpec): THREE.CanvasTexture {
  const W = 768;
  const H = 832;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  const horizontal = spec.stratum === "horizontal";

  // Strata-specific palette
  const bgTop    = horizontal ? "#FCE7F3" : "#FBCFE8";
  const bgBottom = horizontal ? "#F9A8D4" : "#F472B6";
  const stripe   = horizontal ? "#DB2777" : "#9D174D";
  const ink      = horizontal ? "#831843" : "#500724";

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, bgTop);
  bg.addColorStop(1, bgBottom);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Frame
  ctx.strokeStyle = stripe;
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, W - 40, H - 40);

  // Side stripe (DOSS callout signature, magenta)
  ctx.fillStyle = stripe;
  ctx.fillRect(20, 20, 12, H - 40);

  // Header bar with label
  ctx.fillStyle = stripe;
  ctx.fillRect(40, 60, W - 80, 78);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "700 36px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(spec.label, W / 2, 100);

  // Icon area (centre)
  drawToolIcon(ctx, spec.kind, W / 2, H / 2 + 40, 280, ink, stripe);

  // Stratum caption at bottom
  ctx.fillStyle = ink;
  ctx.font = "600 22px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.textAlign = "center";
  const stratumCaption = horizontal ? "[ HORIZONTAL TOOL ]" : "[ COLLABORATION CHANNEL ]";
  ctx.fillText(stratumCaption, W / 2, H - 64);

  // Plus marks
  const plus = (px: number, py: number) => {
    ctx.strokeStyle = stripe;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(px - 12, py); ctx.lineTo(px + 12, py);
    ctx.moveTo(px, py - 12); ctx.lineTo(px, py + 12);
    ctx.stroke();
  };
  plus(48, 48);
  plus(W - 48, 48);
  plus(48, H - 48);
  plus(W - 48, H - 48);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 16;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}

function drawToolIcon(
  ctx: CanvasRenderingContext2D,
  kind: ToolKind,
  cx: number, cy: number,
  size: number,
  ink: string, accent: string,
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = ink;
  ctx.fillStyle = ink;
  ctx.lineWidth = size * 0.022;
  const s = size;

  if (kind === "sharepoint") {
    // Stacked folder
    const w = s * 0.65;
    const h = s * 0.40;
    const fold = s * 0.15;
    const drawFolder = (yo: number, fill: boolean) => {
      ctx.beginPath();
      ctx.moveTo(-w / 2, -h / 2 + yo);
      ctx.lineTo(-w / 2 + fold, -h / 2 + yo - s * 0.06);
      ctx.lineTo(-fold * 0.2, -h / 2 + yo - s * 0.06);
      ctx.lineTo(0, -h / 2 + yo);
      ctx.lineTo(w / 2, -h / 2 + yo);
      ctx.lineTo(w / 2, h / 2 + yo);
      ctx.lineTo(-w / 2, h / 2 + yo);
      ctx.closePath();
      if (fill) { ctx.fillStyle = ink; ctx.fill(); }
      else ctx.stroke();
    };
    drawFolder(-s * 0.08, false);
    drawFolder(s * 0.06, true);
  } else if (kind === "excel") {
    // Spreadsheet grid
    const w = s * 0.66, h = s * 0.5;
    const cols = 4, rows = 5;
    const cw = w / cols, rh = h / rows;
    ctx.strokeRect(-w / 2, -h / 2, w, h);
    for (let i = 1; i < cols; i++) {
      ctx.beginPath(); ctx.moveTo(-w / 2 + i * cw, -h / 2); ctx.lineTo(-w / 2 + i * cw, h / 2); ctx.stroke();
    }
    for (let i = 1; i < rows; i++) {
      ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2 + i * rh); ctx.lineTo(w / 2, -h / 2 + i * rh); ctx.stroke();
    }
    // Header row filled
    ctx.fillStyle = ink;
    ctx.fillRect(-w / 2, -h / 2, w, rh);
    // First column filled
    ctx.fillRect(-w / 2, -h / 2 + rh, cw, h - rh);
    // Some scattered dots / values
    ctx.fillStyle = accent;
    for (let i = 1; i < cols; i++) {
      for (let j = 1; j < rows; j++) {
        if ((i + j) % 2 === 0) {
          ctx.fillRect(-w / 2 + i * cw + cw * 0.3, -h / 2 + j * rh + rh * 0.35, cw * 0.4, rh * 0.3);
        }
      }
    }
  } else if (kind === "onedrive") {
    // Cloud
    const r = s * 0.18;
    ctx.beginPath();
    ctx.arc(-s * 0.18, -s * 0.04, r, Math.PI, Math.PI * 2);
    ctx.arc(0, -s * 0.16, r * 1.2, Math.PI * 1.05, Math.PI * 1.95);
    ctx.arc(s * 0.18, -s * 0.06, r * 0.95, Math.PI * 1.05, Math.PI * 2.0);
    ctx.lineTo(s * 0.30, s * 0.18);
    ctx.lineTo(-s * 0.30, s * 0.18);
    ctx.closePath();
    ctx.stroke();
    // upload arrow inside
    ctx.lineWidth = s * 0.04;
    ctx.beginPath();
    ctx.moveTo(0, s * 0.10);
    ctx.lineTo(0, -s * 0.04);
    ctx.moveTo(-s * 0.06, s * 0.02);
    ctx.lineTo(0, -s * 0.04);
    ctx.lineTo(s * 0.06, s * 0.02);
    ctx.stroke();
  } else if (kind === "drives") {
    // Stack of disks
    const drawDisk = (yo: number) => {
      ctx.save();
      ctx.translate(0, yo);
      ctx.beginPath();
      ctx.ellipse(0, 0, s * 0.30, s * 0.08, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };
    drawDisk(-s * 0.18);
    drawDisk(0);
    drawDisk(s * 0.18);
    // sides
    ctx.beginPath();
    ctx.moveTo(-s * 0.30, -s * 0.18);
    ctx.lineTo(-s * 0.30, s * 0.18);
    ctx.moveTo(s * 0.30, -s * 0.18);
    ctx.lineTo(s * 0.30, s * 0.18);
    ctx.stroke();
  } else if (kind === "outlook") {
    // Envelope
    const w = s * 0.60, h = s * 0.42;
    ctx.strokeRect(-w / 2, -h / 2, w, h);
    ctx.beginPath();
    ctx.moveTo(-w / 2, -h / 2);
    ctx.lineTo(0, h / 6);
    ctx.lineTo(w / 2, -h / 2);
    ctx.stroke();
  } else if (kind === "teams") {
    // Two overlapping chat bubbles
    const bubble = (x: number, y: number, w: number, h: number, mirror: boolean) => {
      const r = w * 0.18;
      ctx.beginPath();
      ctx.moveTo(x - w / 2 + r, y - h / 2);
      ctx.lineTo(x + w / 2 - r, y - h / 2);
      ctx.quadraticCurveTo(x + w / 2, y - h / 2, x + w / 2, y - h / 2 + r);
      ctx.lineTo(x + w / 2, y + h / 2 - r);
      ctx.quadraticCurveTo(x + w / 2, y + h / 2, x + w / 2 - r, y + h / 2);
      ctx.lineTo(x - w / 2 + r, y + h / 2);
      ctx.quadraticCurveTo(x - w / 2, y + h / 2, x - w / 2, y + h / 2 - r);
      ctx.lineTo(x - w / 2, y - h / 2 + r);
      ctx.quadraticCurveTo(x - w / 2, y - h / 2, x - w / 2 + r, y - h / 2);
      ctx.closePath();
      ctx.stroke();
      // tail
      const tx = mirror ? x - w * 0.22 : x + w * 0.22;
      ctx.beginPath();
      ctx.moveTo(tx - 6, y + h / 2);
      ctx.lineTo(tx + (mirror ? -10 : 10), y + h / 2 + s * 0.10);
      ctx.lineTo(tx + 12, y + h / 2);
      ctx.closePath();
      ctx.stroke();
    };
    bubble(-s * 0.10, -s * 0.10, s * 0.42, s * 0.30, false);
    bubble(s * 0.12, s * 0.06, s * 0.36, s * 0.26, true);
  } else if (kind === "calls") {
    // Phone handset
    ctx.lineWidth = s * 0.05;
    const r = s * 0.30;
    ctx.beginPath();
    ctx.arc(0, 0, r, Math.PI * 1.18, Math.PI * 1.82);
    ctx.stroke();
    // small circles at ends
    const cap = s * 0.06;
    ctx.lineWidth = s * 0.022;
    const a1 = Math.PI * 1.18, a2 = Math.PI * 1.82;
    ctx.beginPath(); ctx.arc(r * Math.cos(a1), r * Math.sin(a1), cap, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(r * Math.cos(a2), r * Math.sin(a2), cap, 0, Math.PI * 2); ctx.fill();
  } else if (kind === "meetings") {
    // Three head silhouettes around a table
    const head = (hx: number, hy: number, r: number) => {
      ctx.beginPath();
      ctx.arc(hx, hy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(hx, hy + r * 1.3, r * 1.5, Math.PI, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    };
    head(-s * 0.22, -s * 0.04, s * 0.07);
    head(0,         -s * 0.10, s * 0.07);
    head(s * 0.22,  -s * 0.04, s * 0.07);
    // table
    ctx.beginPath();
    ctx.ellipse(0, s * 0.18, s * 0.30, s * 0.08, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

// ── Generic vertical panel slab ─────────────────────────
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

// ── Architectural label sprite ──────────────────────────
function createArchLabelSprite(text: string, scale: [number, number] = [3.0, 0.55]): {
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
  ctx.fillStyle = "rgba(12,12,16,0.84)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.beginPath(); ctx.arc(bgX + 28, H / 2, 3.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(bgX + bgW - 28, H / 2, 3.5, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.96)";
  ctx.font = "600 56px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
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
    map: texture, transparent: true, opacity: 0,
    depthWrite: false, depthTest: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(scale[0], scale[1], 1);
  sprite.renderOrder = 8;

  return { sprite, material, texture };
}

// ── Iso grid ────────────────────────────────────────────
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
  geo.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uResolution: { value: new THREE.Vector2(1, 1) },
      uColor: { value: new THREE.Color(0xffffff) },
      uOpacity: { value: 0.13 },
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

// ============================================================================
// Component
// ============================================================================

export default function E1Decompose() {
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
        CAM_DIST * Math.cos(e) * Math.sin(a) + LOOKAT_INITIAL.x,
        CAM_DIST * Math.sin(e) + LOOKAT_INITIAL.y,
        CAM_DIST * Math.cos(e) * Math.cos(a) + LOOKAT_INITIAL.z,
      );
      camera.lookAt(LOOKAT_INITIAL);
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

    const grid = createIsoGrid(80, 80);
    grid.mesh.position.y = 0;
    grid.material.uniforms.uOpacity.value = 0;
    scene.add(grid.mesh);
    gridMeshRef.current = grid.mesh;
    gridMaterialRef.current = grid.material;

    const updateGridUniforms = () => {
      const dpr = renderer.getPixelRatio();
      grid.material.uniforms.uResolution.value.set(width * dpr, height * dpr);
    };
    updateGridUniforms();

    const disposables: Array<{ dispose: () => void }> = [];

    // ── Build records (left, 2 cols × 3 rows) ──
    interface RecInst {
      group: THREE.Group;
      handle: PanelHandle;
      delay: number;
    }
    const records: RecInst[] = [];

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
    const r = seed(101);

    RECORDS.forEach((spec, i) => {
      const tex = createRecordTexture(spec);
      disposables.push(tex);
      const handle = createPanel({
        w: REC_W, h: REC_H, t: REC_T,
        frontTexture: tex,
        edgeColor: 0x6B5E3A,
        edgeOpacity: 0.32,
        baseOpacity: 0.95,
        sideTint: 0xEDE5C2,
      });
      handle.materials.forEach((m) => { m.opacity = 0; });
      handle.edgeMaterial.opacity = 0;

      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = REC_X_BASE + col * (REC_W + REC_COL_GAP);
      const yBase = REC_Y_BASE + row * (REC_H + REC_ROW_GAP);
      const z = (r() - 0.5) * 2 * REC_Z_JITTER;
      const ry = (r() - 0.5) * 0.06; // gentle randomized lean
      handle.group.position.set(x, yBase, z);
      handle.group.rotation.y = ry;
      scene.add(handle.group);

      disposables.push(handle.geo, handle.edgeGeo, handle.edgeMaterial);
      for (const m of handle.materials) disposables.push(m);

      records.push({
        group: handle.group, handle,
        delay: i * REC_REVEAL_PER,
      });
    });

    // ── Build tools (right, 4 cols × 2 rows) ──
    interface ToolInst {
      group: THREE.Group;
      handle: PanelHandle;
      delay: number;
    }
    const tools: ToolInst[] = [];
    const r2 = seed(214);

    TOOLS.forEach((spec, i) => {
      const tex = createToolTexture(spec);
      disposables.push(tex);
      const isHorizontal = spec.stratum === "horizontal";
      const handle = createPanel({
        w: TOOL_W, h: TOOL_H, t: TOOL_T,
        frontTexture: tex,
        edgeColor: isHorizontal ? 0xDB2777 : 0x9D174D,
        edgeOpacity: 0.45,
        baseOpacity: 0.95,
        sideTint: isHorizontal ? 0xFBCFE8 : 0xF9A8D4,
      });
      handle.materials.forEach((m) => { m.opacity = 0; });
      handle.edgeMaterial.opacity = 0;

      // Index within stratum
      const sIdx = i % 4;
      const x = TOOL_X_BASE + sIdx * (TOOL_W + TOOL_COL_GAP);
      const yBase = isHorizontal ? TOOL_TOP_Y : TOOL_BOTTOM_Y;
      const z = (r2() - 0.5) * 2 * REC_Z_JITTER;
      const ry = (r2() - 0.5) * 0.05;
      handle.group.position.set(x, yBase, z);
      handle.group.rotation.y = ry;
      scene.add(handle.group);

      disposables.push(handle.geo, handle.edgeGeo, handle.edgeMaterial);
      for (const m of handle.materials) disposables.push(m);

      tools.push({
        group: handle.group, handle,
        delay: i * TOOL_REVEAL_PER,
      });
    });

    // ── Architectural callouts ──
    const recCenterX = REC_X_BASE + (REC_W + REC_COL_GAP) * 0.5;
    const recTopY = REC_Y_BASE + 2 * (REC_H + REC_ROW_GAP) + REC_H + 0.4;
    const sorLabel = createArchLabelSprite("SYSTEMS OF RECORD");
    sorLabel.sprite.position.set(recCenterX, recTopY, 0);
    scene.add(sorLabel.sprite);
    disposables.push(sorLabel.texture, sorLabel.material);

    const toolCenterX = TOOL_X_BASE + (TOOL_W + TOOL_COL_GAP) * 1.5;
    const toolTopY = TOOL_TOP_Y + TOOL_H + 0.4;
    const socLabel = createArchLabelSprite("SYSTEMS OF COORDINATION", [3.4, 0.55]);
    socLabel.sprite.position.set(toolCenterX, toolTopY, 0);
    scene.add(socLabel.sprite);
    disposables.push(socLabel.texture, socLabel.material);

    // Sub-labels for the two strata (smaller mono pills)
    const horizSubLabel = createArchLabelSprite("HORIZONTAL TOOLS", [1.95, 0.35]);
    horizSubLabel.sprite.position.set(toolCenterX, TOOL_TOP_Y + TOOL_H * 0.5, -0.6);
    scene.add(horizSubLabel.sprite);
    disposables.push(horizSubLabel.texture, horizSubLabel.material);
    horizSubLabel.sprite.visible = false; // keep this off by default; can enable

    const collabSubLabel = createArchLabelSprite("COLLABORATION CHANNELS", [2.2, 0.35]);
    collabSubLabel.sprite.position.set(toolCenterX, TOOL_BOTTOM_Y + TOOL_H * 0.5, -0.6);
    scene.add(collabSubLabel.sprite);
    disposables.push(collabSubLabel.texture, collabSubLabel.material);
    collabSubLabel.sprite.visible = false;

    // ── Gap marker — a faint magenta bracket on the floor between the
    // two clusters, optional and very subtle. The empty centre carries
    // the meaning; this just nudges the eye toward the gap.
    const gapStartX = REC_X_BASE + (REC_W + REC_COL_GAP) + REC_W + 0.3;
    const gapEndX = TOOL_X_BASE - 0.3;
    const gapPoints = [
      new THREE.Vector3(gapStartX, 0.02, 0),
      new THREE.Vector3(gapEndX, 0.02, 0),
    ];
    const gapGeo = new THREE.BufferGeometry().setFromPoints(gapPoints);
    const gapMat = new THREE.LineDashedMaterial({
      color: 0xEC4899,
      dashSize: 0.35,
      gapSize: 0.22,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const gapLine = new THREE.Line(gapGeo, gapMat);
    gapLine.computeLineDistances();
    scene.add(gapLine);
    disposables.push(gapGeo, gapMat);

    startTimeRef.current = performance.now();

    let frameId = 0;
    const animate = () => {
      const t = (performance.now() - startTimeRef.current) / 1000;

      if (gridMaterialRef.current) {
        const gridT = Math.min(t / GRID_FADE_DURATION, 1);
        gridMaterialRef.current.uniforms.uOpacity.value = GRID_TARGET_OPACITY * easeOutCubic(gridT);
      }

      // Records reveal
      records.forEach((rec) => {
        const local = t - REC_REVEAL_START - rec.delay;
        const p = Math.max(0, Math.min(local / REC_REVEAL_DURATION, 1));
        const eased = easeOutCubic(p);
        rec.handle.materials.forEach((m, idx) => {
          const target = idx === 4 ? 0.95 : 0.86;
          m.opacity = target * eased;
        });
        rec.handle.edgeMaterial.opacity = 0.32 * eased;
      });

      // Tools reveal
      tools.forEach((td) => {
        const local = t - TOOL_REVEAL_START - td.delay;
        const p = Math.max(0, Math.min(local / TOOL_REVEAL_DURATION, 1));
        const eased = easeOutCubic(p);
        td.handle.materials.forEach((m, idx) => {
          const target = idx === 4 ? 0.95 : 0.86;
          m.opacity = target * eased;
        });
        td.handle.edgeMaterial.opacity = 0.45 * eased;
      });

      // Zone labels last + gap line dim
      const labelT = Math.max(0, Math.min((t - ZONE_LABEL_START) / ZONE_LABEL_DURATION, 1));
      const labelEased = easeOutCubic(labelT);
      sorLabel.material.opacity = 1.0 * labelEased;
      socLabel.material.opacity = 1.0 * labelEased;
      gapMat.opacity = 0.45 * labelEased;

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
      updateGridUniforms();
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
      gridMeshRef.current = null;
      gridMaterialRef.current = null;
    };
  }, []);

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

  useEffect(() => {
    if (gridMeshRef.current) gridMeshRef.current.visible = showGrid;
  }, [showGrid]);

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
      const t = Math.min((performance.now() - start) / ENTRANCE_DURATION, 1);
      const eased = easeInOutCubic(t);
      setElevation(INITIAL_ELEVATION + (DEFAULT_ELEVATION - INITIAL_ELEVATION) * eased);
      setAzimuth(INITIAL_AZIMUTH + (DEFAULT_AZIMUTH - INITIAL_AZIMUTH) * eased);
      setFrustum(INITIAL_FRUSTUM + (DEFAULT_FRUSTUM - INITIAL_FRUSTUM) * eased);
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
    (v: number) => { cancelEntrance(); setFrustum(v); }, [cancelEntrance]);
  const handleAzimuthChange = useCallback(
    (v: number) => { cancelEntrance(); setAzimuth(v); }, [cancelEntrance]);
  const handleElevationChange = useCallback(
    (v: number) => { cancelEntrance(); setElevation(v); }, [cancelEntrance]);

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
    <div className="e1-root" data-theme={theme}>
      <style>{E1_STYLES}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;550;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <nav className="e1-nav">
        <div className="e1-nav-inner">
          <Link to="/linear-flow" className="e1-nav-logo" aria-label="Unifize">
            <img src="/Link - home.svg" alt="Unifize" className="e1-nav-logo-img" />
          </Link>
          <div className="e1-nav-items">
            <a href="#problem">The Problem</a>
            <a href="#world">Your World</a>
            <a href="#industry">By Industry</a>
            <a href="#how">How It Works</a>
            <a href="#proof">Proof</a>
          </div>
          <div className="e1-nav-actions">
            <a href="#login" className="e1-nav-link">Log in</a>
            <button
              type="button"
              className="e1-theme-toggle"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={theme === "light"}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
            <button className="e1-nav-btn">Book a demo</button>
          </div>
        </div>
      </nav>

      {/* HERO TEXT — placeholder copy. Plural everywhere. Replace in place. */}
      <header className="e1-hero">
        <div className="e1-eyebrow">Exploration 1 · The gap, three zones</div>
        <h1 className="e1-h1">
          Your records sit on one side.
          <br />
          <span className="e1-h1-fade">Your work happens on the other.</span>
        </h1>
        <p className="e1-subhead">
          Systems of record hold the official version. Systems of coordination hold the work that produced it. Nothing in between holds them together.
        </p>
      </header>

      {/* VISUAL — full width, 70vh */}
      <div className="e1-visual-wrap">
        <div ref={mountRef} className="e1-visual" />

        <div className="absolute top-4 right-4 z-10 group">
          <button
            type="button"
            className="bg-black/70 backdrop-blur border border-white/15 text-white/90 px-3 py-2 rounded font-mono text-[11px] tracking-wide hover:bg-black/90"
          >
            CONTROLS
          </button>
          <div className="hidden group-hover:block absolute top-full right-0 mt-2 w-72 bg-black/90 backdrop-blur border border-white/15 rounded p-4 font-mono text-[11px] text-white/90">
            <ControlSlider
              label="Elevation" unit="°" min={5} max={90} step={0.1}
              value={elevation} onChange={handleElevationChange}
            />
            <ControlSlider
              label="Azimuth" unit="°" min={0} max={90} step={0.1}
              value={azimuth} onChange={handleAzimuthChange}
            />
            <ControlSlider
              label="Zoom" unit="" min={5} max={36} step={0.1}
              value={frustum} onChange={handleZoomChange} invert
            />
            <label className="flex items-center justify-between py-2 cursor-pointer select-none">
              <span>Show grid</span>
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                className="accent-pink-500"
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
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
function ControlSlider({
  label, unit, min, max, step, value, onChange, invert,
}: {
  label: string; unit: string; min: number; max: number; step: number;
  value: number; onChange: (v: number) => void; invert?: boolean;
}) {
  return (
    <div className="py-1.5">
      <div className="flex justify-between mb-1">
        <span>{label}</span>
        <span className="text-white/60">{value.toFixed(1)}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step}
        value={invert ? min + max - value : value}
        onChange={(e) => onChange(invert ? min + max - +e.target.value : +e.target.value)}
        className="w-full accent-pink-500"
      />
    </div>
  );
}
