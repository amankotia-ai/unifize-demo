import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";

const PAIN_POINTS = [
  "CAPA still open from last quarter.",
  "Change order stuck on four inboxes.",
  "Supplier CAR chased across three mailboxes.",
  "Batch released before sign-offs landed.",
  "Design review closed on a verbal yes.",
  "Wrong revision on the shop floor.",
  "Submission stitched from four folders.",
  "Training record nobody can produce.",
  "Complaint that found its owner three handoffs late.",
  "Lot on hold — reason in a Teams chat.",
  "Audit finding about a gap nobody named.",
  "Recall scope built from memory.",
  "Decision made in chat, QMS never updated.",
  "Supplier onboarding stalled on one form.",
  "Periodic review overdue, owner unassigned.",
];

const LINEAR_STYLES = `
.lin-root {
  --lin-bg: #08090A;
  --lin-bg-subtle: #0E0F12;
  --lin-bg-card: #101116;
  --lin-border: rgba(255,255,255,0.08);
  --lin-border-strong: rgba(255,255,255,0.14);
  --lin-text: #FFFFFF;
  --lin-text-muted: rgba(255,255,255,0.56);
  --lin-text-faint: rgba(255,255,255,0.38);
  --lin-accent: #5E6AD2;

  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  background: var(--lin-bg);
  color: var(--lin-text);
  -webkit-font-smoothing: antialiased;
  letter-spacing: -0.011em;
  min-height: 100vh;
}
.lin-root * { box-sizing: border-box; }
.lin-root .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
.lin-root a { color: inherit; text-decoration: none; }

/* ------------ NAV ------------ */
.lin-nav {
  position: sticky; top: 0; z-index: 50;
  backdrop-filter: saturate(160%) blur(18px);
  background: rgba(8,9,10,0.72);
  border-bottom: 1px solid var(--lin-border);
}
.lin-nav-inner {
  max-width: 1240px; margin: 0 auto;
  padding: 12px 28px;
  display: flex; align-items: center; gap: 40px;
}
.lin-nav-logo { display: inline-flex; align-items: center; }
.lin-nav-logo-img {
  height: 22px; width: auto; display: block;
  filter: brightness(0) invert(1);
}
.lin-nav-items {
  display: flex; gap: 26px;
  font-size: 13.5px; color: var(--lin-text-muted);
}
.lin-nav-items a { transition: color .15s; }
.lin-nav-items a:hover { color: var(--lin-text); }
.lin-nav-actions { margin-left: auto; display: flex; gap: 18px; align-items: center; }
.lin-nav-link { font-size: 13.5px; color: var(--lin-text-muted); }
.lin-nav-link:hover { color: var(--lin-text); }
.lin-nav-btn {
  font-size: 13px; font-weight: 500;
  background: white; color: #0B0D11;
  padding: 7px 14px; border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.9);
  cursor: pointer; transition: background .15s;
}
.lin-nav-btn:hover { background: #EBECEE; }
@media (max-width: 860px) { .lin-nav-items { display: none; } }

/* ------------ HERO (Linear-style) ------------ */
.lin-hero {
  max-width: 1240px; margin: 0 auto;
  padding: 72px 28px 56px;
  position: relative;
  display: flex; flex-direction: column;
  justify-content: flex-start;
}
.lin-hero-h1 {
  font-size: clamp(38px, 6.4vw, 78px);
  font-weight: 500;
  line-height: 0.98;
  letter-spacing: -0.042em;
  max-width: 22ch;
  margin: 0;
}
.lin-hero-subtitle {
  margin: 28px 0 0;
  font-size: 17px;
  color: var(--lin-text-muted);
  max-width: 80ch;
  line-height: 1.5;
  letter-spacing: -0.006em;
}
.lin-hero-cta {
  margin-top: 40px;
  display: flex; gap: 12px; align-items: center; flex-wrap: wrap;
}
.lin-btn-primary {
  font-family: inherit; font-size: 14px; font-weight: 500;
  background: white; color: #0B0D11;
  padding: 10px 18px; border-radius: 999px;
  border: none; cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px;
  transition: background .15s;
}
.lin-btn-primary:hover { background: #EBECEE; }
.lin-btn-ghost {
  font-family: inherit; font-size: 14px; font-weight: 500;
  background: transparent; color: var(--lin-text);
  padding: 10px 16px; border-radius: 999px;
  border: 1px solid var(--lin-border-strong);
  cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px;
  transition: background .15s, border-color .15s;
}
.lin-btn-ghost:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.22); }
.lin-hero-sidenote {
  margin-left: auto;
  display: inline-flex; align-items: center; gap: 10px;
  font-size: 13px;
}
.lin-hero-sidenote .dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #0052FF;
  box-shadow: 0 0 0 3px rgba(0,82,255,0.18);
}
.lin-pain { gap: 12px; }
.lin-pain-label {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--lin-text-faint);
}
.lin-pain-slot {
  position: relative;
  display: inline-flex; align-items: center;
  height: 1.4em;
  min-width: 30ch;
  overflow: hidden;
}
.lin-pain-text {
  display: inline-block;
  color: var(--lin-text); font-weight: 500;
  white-space: nowrap;
  animation: lin-pain-in 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes lin-pain-in {
  0%   { opacity: 0; transform: translateY(90%); filter: blur(6px); }
  60%  { opacity: 1; filter: blur(0); }
  100% { opacity: 1; transform: translateY(0); filter: blur(0); }
}
@media (prefers-reduced-motion: reduce) { .lin-pain-text { animation: none; } }
@media (max-width: 760px) {
  .lin-hero-sidenote { margin-left: 0; margin-top: 4px; width: 100%; }
  .lin-pain-slot { min-width: 0; flex: 1; }
}

/* ============ CONCEPT MAP SECTION (3D animated) ============ */
.iso-section {
  position: relative;
  width: 100%;
  padding: 0 0 120px;
  background: #06070A;
}
.iso-section-inner {
  max-width: 1340px;
  margin: 0 auto;
  padding: 0 28px;
}
.iso-section-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.14em;
  color: var(--lin-text-faint); text-transform: uppercase;
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 24px;
}
.iso-section-eyebrow .line { flex: 1; height: 1px; background: var(--lin-border); max-width: 200px; }
.iso-section-h2 {
  margin: 0;
  font-size: clamp(28px, 3.6vw, 44px);
  line-height: 1.12; letter-spacing: -0.028em;
  font-weight: 500;
  max-width: 34ch;
}
.iso-section-h2 .dim { color: var(--lin-text-muted); }
.iso-section-sub {
  max-width: 62ch; margin: 18px 0 0;
  font-size: 15px; color: var(--lin-text-muted);
  line-height: 1.55;
}

.iso-stage {
  position: relative;
  margin: 44px auto 0;
  max-width: 1340px;
  padding: 0 28px;
}
.iso-canvas-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9.2;
  border-radius: 16px;
  overflow: hidden;
  background:
    radial-gradient(50% 60% at 55% 50%, rgba(94,106,210,0.16) 0%, rgba(6,7,10,0) 70%),
    #06070A;
  border: 1px solid var(--lin-border);
  isolation: isolate;
  box-shadow:
    0 50px 120px -30px rgba(94,106,210,0.25),
    0 30px 80px -20px rgba(0,0,0,0.8);
}
.iso-canvas-wrap::before {
  content: ""; position: absolute; inset: 0;
  background-image:
    linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(120% 90% at 50% 55%, #000 30%, transparent 90%);
  z-index: 0;
  pointer-events: none;
}
.iso-canvas {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  z-index: 1;
}
.iso-canvas canvas { display: block; width: 100% !important; height: 100% !important; }
.iso-labels {
  position: absolute; inset: 0;
  z-index: 2;
  pointer-events: none;
}
.iso-lbl {
  position: absolute;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.6);
  white-space: nowrap;
  display: inline-flex; align-items: center; gap: 8px;
}
.iso-lbl-dim { color: rgba(255,255,255,0.38); }
.iso-lbl-accent { color: #A7BEFF; }
.iso-lbl-brand {
  color: rgba(255,255,255,0.9);
  letter-spacing: 0.26em;
  font-size: 12px;
}
.iso-lbl-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: currentColor;
  opacity: 0.7;
}

.iso-caption {
  margin: 28px auto 0;
  max-width: 68ch;
  padding: 14px 22px;
  border: 1px solid var(--lin-border);
  border-radius: 12px;
  background: rgba(255,255,255,0.025);
  font-size: 13.5px; color: var(--lin-text-muted);
  line-height: 1.55;
  text-align: center;
}
.iso-caption strong { color: var(--lin-text); font-weight: 500; }

@media (max-width: 900px) {
  .iso-canvas-wrap { aspect-ratio: 4 / 5; }
  .iso-lbl { font-size: 9px; letter-spacing: 0.12em; }
}

/* ------------ LOGOS ------------ */
.lin-logos-wrap {
  border-top: 1px solid var(--lin-border);
  border-bottom: 1px solid var(--lin-border);
  background: rgba(255,255,255,0.015);
}
.lin-logos-eyebrow {
  max-width: 1240px; margin: 0 auto;
  padding: 32px 28px 0;
  font-size: 11px; letter-spacing: 0.14em;
  color: var(--lin-text-faint); text-transform: uppercase;
}
.lin-logos {
  max-width: 1240px; margin: 0 auto;
  padding: 20px 28px 40px;
  display: flex; gap: 48px; justify-content: space-between; align-items: center;
  flex-wrap: wrap;
  opacity: 0.82;
}
.lin-logos-item { display: inline-flex; align-items: center; height: 36px; }
.lin-logos-item img {
  height: 24px; width: auto; filter: brightness(0) invert(1);
  opacity: 0.85;
}

/* ------------ LIGHT THEME WRAPPER ------------ */
.lin-light {
  background: #FFFFFF; color: #08090A;
  --lin-text: #08090A;
  --lin-text-muted: rgba(8,9,10,0.58);
  --lin-text-faint: rgba(8,9,10,0.42);
  --lin-border: rgba(8,9,10,0.08);
  --lin-border-strong: rgba(8,9,10,0.16);
}
.lin-light .lin-btn-primary { background: #08090A; color: #FFFFFF; }
.lin-light .lin-btn-primary:hover { background: #1A1B1F; }
.lin-light .lin-btn-ghost {
  color: #08090A;
  border-color: rgba(8,9,10,0.14);
}
.lin-light .lin-btn-ghost:hover {
  background: rgba(8,9,10,0.04);
  border-color: rgba(8,9,10,0.22);
}

.lin-secondary {
  max-width: 1240px; margin: 0 auto;
  padding: 120px 28px 40px;
}
.lin-secondary-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.12em;
  color: var(--lin-text-faint); text-transform: uppercase;
  margin-bottom: 32px;
  display: flex; align-items: center; gap: 10px;
}
.lin-secondary-eyebrow .line { flex: 1; height: 1px; background: var(--lin-border); max-width: 200px; }
.lin-secondary-h2 {
  font-size: clamp(30px, 4.6vw, 58px);
  line-height: 1.06;
  letter-spacing: -0.032em;
  font-weight: 500;
  max-width: 26ch;
  margin: 0;
}
.lin-secondary-h2 .dim { color: var(--lin-text-muted); }

.lin-figs {
  max-width: 1240px; margin: 0 auto;
  padding: 60px 28px 100px;
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 64px;
}
@media (max-width: 900px) { .lin-figs { grid-template-columns: 1fr; gap: 48px; } }
.lin-fig { position: relative; display: flex; flex-direction: column; }
.lin-fig-title {
  margin-top: 16px;
  font-size: 14px; font-weight: 500; letter-spacing: -0.01em;
  line-height: 1.45;
}
.lin-fig-title .dim { color: var(--lin-text-muted); }
.lin-fig-art {
  display: flex; align-items: center; justify-content: center;
  aspect-ratio: 1 / 0.7;
  opacity: 0.95;
}
.lin-fig-art svg { width: 100%; height: 100%; }
.lin-light .lin-fig-art { color: #08090A; }

.lin-bottom {
  max-width: 1240px; margin: 0 auto;
  padding: 60px 28px 120px;
  text-align: center;
}
.lin-bottom-kicker {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.12em;
  color: var(--lin-text-faint); text-transform: uppercase;
  margin-bottom: 20px;
}
.lin-bottom-h2 {
  font-size: clamp(34px, 5vw, 64px);
  line-height: 1.02; letter-spacing: -0.035em;
  font-weight: 500; margin: 0 auto; max-width: 18ch;
}
.lin-bottom-sub {
  margin: 22px auto 0; max-width: 48ch;
  font-size: 15px; color: var(--lin-text-muted); line-height: 1.5;
}
.lin-bottom-actions {
  margin-top: 32px;
  display: inline-flex; gap: 12px; flex-wrap: wrap; justify-content: center;
}

.lin-foot {
  border-top: 1px solid var(--lin-border);
  padding: 28px;
}
.lin-foot-inner {
  max-width: 1240px; margin: 0 auto;
  display: flex; justify-content: space-between; align-items: center;
  font-size: 12px; color: var(--lin-text-faint);
  flex-wrap: wrap; gap: 16px;
}
`;

const logos = [
  { src: "/logos/John-Deere.png", alt: "John Deere" },
  { src: "/logos/Airbus-Logo.svg", alt: "Airbus" },
  { src: "/logos/TTK-Prestige.png", alt: "TTK Prestige" },
  { src: "/logos/Target-1.png", alt: "Target" },
  { src: "/logos/Applechem.png", alt: "Applechem" },
  { src: "/logos/Red-Sun-Farms.png", alt: "Red Sun Farms" },
  { src: "/logos/Vans.png", alt: "Vans" },
];

type Fig = {
  n: string;
  title: string;
  subtitle: string;
  art: React.ReactNode;
};

const figs: Fig[] = [
  {
    n: "FIG 0.1",
    title: "One thread per record.",
    subtitle: "Investigation, approval, evidence, owner. Same place.",
    art: (
      <svg viewBox="0 0 320 260" fill="none">
        <rect x="38" y="36" width="214" height="90" rx="12" fill="#EEF0F4" stroke="currentColor" strokeOpacity="0.14" />
        <rect x="52" y="60" width="226" height="104" rx="12" fill="#F4F6F9" stroke="currentColor" strokeOpacity="0.18" />
        <rect x="68" y="94" width="236" height="138" rx="12" fill="#FFFFFF" stroke="currentColor" strokeOpacity="0.3" />
        <circle cx="88" cy="120" r="11" fill="#0052FF" />
        <rect x="106" y="112" width="64" height="6" rx="3" fill="currentColor" fillOpacity="0.5" />
        <rect x="106" y="124" width="40" height="5" rx="2.5" fill="currentColor" fillOpacity="0.26" />
        <line x1="80" y1="146" x2="292" y2="146" stroke="currentColor" strokeOpacity="0.08" />
        <rect x="80" y="156" width="180" height="5" rx="2.5" fill="currentColor" fillOpacity="0.3" />
        <rect x="80" y="168" width="152" height="5" rx="2.5" fill="currentColor" fillOpacity="0.2" />
      </svg>
    ),
  },
  {
    n: "FIG 0.2",
    title: "AI reads the thread.",
    subtitle: "It proposes the next step. People approve. Work moves.",
    art: (
      <svg viewBox="0 0 320 260" fill="none">
        <g transform="translate(160 96)">
          <path d="M0 0 L44 22 L0 44 L-44 22 Z" fill="#2E5DF5" fillOpacity="0.3" stroke="#4D85FF" strokeOpacity="0.7" strokeWidth="1" />
          <path d="M-44 22 L0 44 L0 92 L-44 70 Z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1" />
          <path d="M44 22 L0 44 L0 92 L44 70 Z" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1" />
          <circle cx="0" cy="24" r="4" fill="#4D85FF" />
        </g>
      </svg>
    ),
  },
  {
    n: "FIG 0.3",
    title: "Regulated by construction.",
    subtitle: "ISO, FDA, GxP, IATF threaded into the work. Partnered with Microsoft.",
    art: (
      <svg viewBox="0 0 320 260" fill="none">
        <rect x="60" y="34" width="200" height="196" rx="12" fill="#FFFFFF" stroke="currentColor" strokeOpacity="0.26" />
        <rect x="74" y="50" width="80" height="7" rx="3.5" fill="currentColor" fillOpacity="0.58" />
        <rect x="74" y="84" width="172" height="4" rx="2" fill="currentColor" fillOpacity="0.1" />
        <rect x="74" y="84" width="116" height="4" rx="2" fill="#0052FF" />
      </svg>
    ),
  },
];

/* ========================================================================
 * 3D concept map scene — Three.js WebGL with continuous dataflow animation
 *
 * Concept (per Unifize Concept Map v1.2):
 *   Systems of record (left) ↔ Unifize platform (center) ↔ Systems of coordination (right)
 *   Flows: context (in from both sides), write-back (out to left),
 *          artifacts + decisions (in from right), AI Assist pulse (top band)
 * ======================================================================== */

function seededRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const CUBE_UNIT = 1;
const CUBE_GAP = 0.05;
const CELL = CUBE_UNIT + CUBE_GAP;

const COLORS = {
  base: 0x1130A0,
  mid: 0x1D44D8,
  top: 0x2E5DF5,
  accent: 0x93B3FF,
  accentHot: 0xFFFFFF,
  record: 0x2A2D37,
  recordDeep: 0x1A1B22,
  context: 0x5E6AD2, // inbound from SOR
  decisions: 0x4DA3FF, // inbound from coordination
  writeback: 0x8DAEFF, // outbound
};

function makeBox(
  w: number,
  h: number,
  d: number,
  color: number,
  emissive = 0x000000,
  emissiveIntensity = 0
) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.62,
    metalness: 0.18,
    emissive,
    emissiveIntensity,
  });
  return new THREE.Mesh(geo, mat);
}

function buildUnifizeStack(parent: THREE.Group) {
  const W = 14;
  const D = 9;
  const baseY = -1.4;
  const accentMeshes: THREE.Mesh[] = [];

  // Layer 0 — Core Platform / base slab
  for (let x = 0; x < W; x++) {
    for (let z = 0; z < D; z++) {
      const cube = makeBox(CUBE_UNIT, 0.55, CUBE_UNIT, COLORS.base);
      cube.position.set(
        (x - W / 2 + 0.5) * CELL,
        baseY + 0.275,
        (z - D / 2 + 0.5) * CELL
      );
      cube.castShadow = true;
      cube.receiveShadow = true;
      parent.add(cube);
    }
  }

  // Layer 1 — Workflow Components
  const r1 = seededRandom(11);
  const midY = baseY + 0.55 + 0.08;
  for (let x = 1; x < W - 1; x++) {
    for (let z = 1; z < D - 1; z++) {
      const r = r1();
      if (r > 0.14) {
        const extraH = r > 0.82 ? 0.3 : 0;
        const h = 0.5 + extraH;
        const cube = makeBox(
          CUBE_UNIT,
          h,
          CUBE_UNIT,
          COLORS.mid,
          0x0A1F6E,
          0.06
        );
        cube.position.set(
          (x - W / 2 + 0.5) * CELL,
          midY + h / 2,
          (z - D / 2 + 0.5) * CELL
        );
        cube.castShadow = true;
        cube.receiveShadow = true;
        parent.add(cube);
      }
    }
  }

  // Layer 2 — Product Suite
  const r2 = seededRandom(37);
  const prodY = midY + 0.55 + 0.08;
  for (let x = 2; x < W - 2; x++) {
    for (let z = 2; z < D - 2; z++) {
      const r = r2();
      if (r > 0.28) {
        const h = 0.45 + r2() * 0.5;
        const cube = makeBox(
          CUBE_UNIT,
          h,
          CUBE_UNIT,
          COLORS.top,
          0x17329F,
          0.12
        );
        cube.position.set(
          (x - W / 2 + 0.5) * CELL,
          prodY + h / 2,
          (z - D / 2 + 0.5) * CELL
        );
        cube.castShadow = true;
        cube.receiveShadow = true;
        parent.add(cube);
      }
    }
  }

  // Layer 3 — Outcomes + AI Assist (top, accent cubes that pulse)
  const r3 = seededRandom(71);
  const outY = prodY + 0.7;
  for (let x = 3; x < W - 3; x++) {
    for (let z = 3; z < D - 3; z++) {
      const r = r3();
      if (r > 0.42) {
        const h = 0.5 + r3() * 1.1;
        const cube = makeBox(
          CUBE_UNIT,
          h,
          CUBE_UNIT,
          COLORS.accent,
          0x5472E0,
          0.28
        );
        cube.position.set(
          (x - W / 2 + 0.5) * CELL,
          outY + h / 2,
          (z - D / 2 + 0.5) * CELL
        );
        cube.castShadow = true;
        cube.receiveShadow = true;
        parent.add(cube);
        accentMeshes.push(cube);
      }
    }
  }

  return { accentMeshes };
}

function buildGrayGrid(parent: THREE.Group, seed: number, W = 6, D = 4) {
  const rand = seededRandom(seed);
  for (let x = 0; x < W; x++) {
    for (let z = 0; z < D; z++) {
      const r = rand();
      if (r > 0.1) {
        const h = 0.45 + rand() * 0.35;
        const cube = makeBox(
          CUBE_UNIT,
          h,
          CUBE_UNIT,
          r > 0.88 ? COLORS.record : COLORS.recordDeep
        );
        cube.position.set(
          (x - W / 2 + 0.5) * CELL,
          h / 2,
          (z - D / 2 + 0.5) * CELL
        );
        cube.castShadow = true;
        cube.receiveShadow = true;
        parent.add(cube);
      }
    }
  }
}

/* ---- Flow particle: a glowing sphere that travels along a bezier arc ---- */
type FlowParticle = {
  mesh: THREE.Mesh;
  p0: THREE.Vector3;
  p1: THREE.Vector3;
  p2: THREE.Vector3;
  start: number;
  duration: number;
  color: number;
};

function quadraticBezier(
  p0: THREE.Vector3,
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  t: number,
  out: THREE.Vector3
) {
  const u = 1 - t;
  out.x = u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x;
  out.y = u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y;
  out.z = u * u * p0.z + 2 * u * t * p1.z + t * t * p2.z;
  return out;
}

function makeParticleMesh(color: number, size = 0.16) {
  const geo = new THREE.SphereGeometry(size, 12, 12);
  const mat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.95,
  });
  return new THREE.Mesh(geo, mat);
}

function IsoScene3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth || window.innerWidth;
    let height = mount.clientHeight || window.innerHeight * 0.6;
    console.log("[iso] init dims:", { width, height, dpr: window.devicePixelRatio });

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 200);
    const CAM_DIST_X = 22;
    const CAM_DIST_Y = 18;
    const CAM_DIST_Z = 22;
    camera.position.set(CAM_DIST_X, CAM_DIST_Y, CAM_DIST_Z);
    camera.lookAt(0, -0.5, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0x6B7FC4, 0.55);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xFFFFFF, 1.35);
    keyLight.position.set(18, 28, 14);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.left = -24;
    keyLight.shadow.camera.right = 24;
    keyLight.shadow.camera.top = 24;
    keyLight.shadow.camera.bottom = -24;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 70;
    keyLight.shadow.bias = -0.0003;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x5E6AD2, 0.6);
    rimLight.position.set(-18, 12, -14);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x8DAEFF, 0.28);
    fillLight.position.set(0, 8, -20);
    scene.add(fillLight);

    // Ground shadow plane
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.ShadowMaterial({ opacity: 0.5, color: 0x000000 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -3.2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Unifize center stack
    const unifize = new THREE.Group();
    unifize.position.set(0, 0, 0);
    scene.add(unifize);
    const { accentMeshes } = buildUnifizeStack(unifize);

    // Systems of record (left)
    const sorPos = new THREE.Vector3(-12, -2.4, 6);
    const sor = new THREE.Group();
    sor.position.copy(sorPos);
    scene.add(sor);
    buildGrayGrid(sor, 17, 6, 4);

    // Systems of coordination (right)
    const socPos = new THREE.Vector3(10, -2.4, -5);
    const soc = new THREE.Group();
    soc.position.copy(socPos);
    scene.add(soc);
    buildGrayGrid(soc, 29, 6, 4);

    // ---- Entrance spring-up animation ----
    const entranceTargets: Array<{ mesh: THREE.Mesh; targetY: number; delay: number }> = [];
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj !== ground) {
        entranceTargets.push({
          mesh: obj,
          targetY: obj.position.y,
          delay: Math.random() * 0.45,
        });
      }
    });

    // ---- Flow particles (context, decisions, artifacts, write-back) ----
    // Anchor points
    const unifizeCenter = new THREE.Vector3(0, -0.2, 0);
    const unifizeLeft = new THREE.Vector3(-6, -0.2, 4);
    const unifizeRight = new THREE.Vector3(6, -0.2, -3);

    type FlowKind = "context" | "writeback" | "decisions" | "artifacts";
    const FLOW_DEFS: Record<FlowKind, { from: THREE.Vector3; to: THREE.Vector3; color: number; height: number }> = {
      context: { from: sorPos.clone().add(new THREE.Vector3(0, 1.6, 0)), to: unifizeLeft, color: COLORS.context, height: 6 },
      writeback: { from: unifizeLeft.clone().add(new THREE.Vector3(0, 0.5, 0)), to: sorPos.clone().add(new THREE.Vector3(0, 1.6, 0)), color: COLORS.writeback, height: 5 },
      decisions: { from: socPos.clone().add(new THREE.Vector3(0, 1.6, 0)), to: unifizeRight, color: COLORS.decisions, height: 6 },
      artifacts: { from: socPos.clone().add(new THREE.Vector3(-1.5, 1.6, 0.5)), to: unifizeRight.clone().add(new THREE.Vector3(-1.5, 0, 0.5)), color: COLORS.decisions, height: 5 },
    };

    const particles: FlowParticle[] = [];

    function spawnParticle(kind: FlowKind, startTime: number) {
      const def = FLOW_DEFS[kind];
      const jitter = new THREE.Vector3(
        (Math.random() - 0.5) * 1.2,
        0,
        (Math.random() - 0.5) * 1.2
      );
      const p0 = def.from.clone().add(jitter);
      const p2 = def.to.clone().add(jitter.clone().multiplyScalar(0.3));
      // control point: midpoint lifted up
      const p1 = p0.clone().lerp(p2, 0.5);
      p1.y += def.height + Math.random() * 1.5;

      const mesh = makeParticleMesh(def.color, 0.14 + Math.random() * 0.08);
      scene.add(mesh);
      particles.push({
        mesh,
        p0,
        p1,
        p2,
        start: startTime,
        duration: 1.6 + Math.random() * 0.6,
        color: def.color,
      });
    }

    // Animation loop
    let raf = 0;
    const clock = new THREE.Clock();
    const startTime = performance.now();
    let nextSpawn = 0;
    const spawnOrder: FlowKind[] = ["context", "decisions", "artifacts", "context", "writeback", "decisions"];
    let spawnIdx = 0;
    const tmpVec = new THREE.Vector3();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const elapsed = (performance.now() - startTime) / 1000;

      // Entrance tween (fade in from below)
      for (const tt of entranceTargets) {
        const localT = Math.min(1, Math.max(0, (elapsed - tt.delay) / 0.7));
        const eased = 1 - Math.pow(1 - localT, 3);
        tt.mesh.position.y = tt.targetY + (1 - eased) * 2;
      }

      // Accent band pulse (AI Assist)
      for (let i = 0; i < accentMeshes.length; i++) {
        const mesh = accentMeshes[i];
        const mat = mesh.material as THREE.MeshStandardMaterial;
        const phase = t * 1.4 + i * 0.24;
        const pulse = 0.25 + Math.max(0, Math.sin(phase)) * 0.4;
        mat.emissiveIntensity = pulse;
      }

      // Spawn flow particles (start after entrance animation)
      if (elapsed > 1.3 && t > nextSpawn) {
        const kind = spawnOrder[spawnIdx % spawnOrder.length];
        spawnParticle(kind, t);
        spawnIdx++;
        nextSpawn = t + 0.45 + Math.random() * 0.25;
      }

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const age = t - p.start;
        const localT = age / p.duration;
        if (localT >= 1) {
          scene.remove(p.mesh);
          p.mesh.geometry.dispose();
          (p.mesh.material as THREE.Material).dispose();
          particles.splice(i, 1);
          continue;
        }
        quadraticBezier(p.p0, p.p1, p.p2, localT, tmpVec);
        p.mesh.position.copy(tmpVec);
        const mat = p.mesh.material as THREE.MeshBasicMaterial;
        // Fade in / out
        if (localT < 0.2) mat.opacity = localT / 0.2;
        else if (localT > 0.8) mat.opacity = (1 - localT) / 0.2;
        else mat.opacity = 1;
        // Subtle scale pulse
        const scalePulse = 1 + Math.sin(localT * Math.PI) * 0.25;
        p.mesh.scale.setScalar(scalePulse);
      }

      // Subtle orbital camera drift
      const angle = Math.sin(t * 0.1) * 0.04;
      const radius = Math.hypot(30, 30);
      camera.position.x = radius * Math.sin(Math.PI / 4 + angle);
      camera.position.z = radius * Math.cos(Math.PI / 4 + angle);
      camera.position.y = 30 + Math.sin(t * 0.14) * 0.3;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      width = mount.clientWidth;
      height = mount.clientHeight;
      const a = width / height;
      camera.left = (-frustumSize * a) / 2;
      camera.right = (frustumSize * a) / 2;
      camera.top = frustumSize / 2;
      camera.bottom = -frustumSize / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="iso-canvas" aria-hidden />;
}

/* ========================================================================
 * Page
 * ======================================================================== */

export default function HomeLinearIso() {
  const [painIdx, setPainIdx] = useState(0);

  useEffect(() => {
    document.title = "Unifize. The coordination layer for regulated teams.";
  }, []);

  useEffect(() => {
    const id = window.setInterval(
      () => setPainIdx((i) => (i + 1) % PAIN_POINTS.length),
      2600
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="lin-root">
      <style>{LINEAR_STYLES}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;550;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <nav className="lin-nav">
        <div className="lin-nav-inner">
          <Link to="/linear-iso" className="lin-nav-logo" aria-label="Unifize">
            <img src="/Link - home.svg" alt="Unifize" className="lin-nav-logo-img" />
          </Link>
          <div className="lin-nav-items">
            <a href="#problem">The Problem</a>
            <a href="#world">Your World</a>
            <a href="#industry">By Industry</a>
            <a href="#how">How It Works</a>
            <a href="#proof">Proof</a>
          </div>
          <div className="lin-nav-actions">
            <a href="#login" className="lin-nav-link">Log in</a>
            <button className="lin-nav-btn">Book a demo</button>
          </div>
        </div>
      </nav>

      {/* Original Linear hero */}
      <section className="lin-hero">
        <h1 className="lin-hero-h1">
          Records live in systems.<br />Work lives between them.
        </h1>
        <p className="lin-hero-subtitle">
          The gap has a name. Coordination tax. Unifize is the layer that removes it.
        </p>
        <div className="lin-hero-cta">
          <button className="lin-btn-primary">
            Book a demo
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="lin-hero-sidenote lin-pain" aria-live="polite">
            <span className="dot" />
            <span className="lin-pain-label">You'll recognise it.</span>
            <span className="lin-pain-slot">
              <span key={painIdx} className="lin-pain-text">
                {PAIN_POINTS[painIdx]}
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* 3D Concept Map section */}
      <section className="iso-section" id="concept">
        <div className="iso-section-inner">
          <div className="iso-section-eyebrow">
            <span>The concept map</span>
            <span className="line" />
          </div>
          <h2 className="iso-section-h2">
            One layer between the system of record and where the work actually happens.
          </h2>
          <p className="iso-section-sub">
            Systems of record stay authoritative. Collaboration stays in chat.
            Unifize is the layer where context flows in, decisions and artifacts
            bind to the thread, and outcomes write back to the record.
          </p>
        </div>

        <div className="iso-stage">
          <div className="iso-canvas-wrap">
            <IsoScene3D />

            <div className="iso-labels" aria-hidden>
              <span className="iso-lbl iso-lbl-brand" style={{ top: "10%", left: "50%", transform: "translateX(-50%)" }}>
                UNIFIZE
              </span>

              <span className="iso-lbl iso-lbl-accent" style={{ top: "22%", right: "4%" }}>
                <span className="iso-lbl-dot" /> OUTCOMES + AI ASSIST
              </span>
              <span className="iso-lbl" style={{ top: "37%", right: "4%" }}>
                <span className="iso-lbl-dot" /> PRODUCT SUITE
              </span>
              <span className="iso-lbl iso-lbl-dim" style={{ top: "52%", right: "4%" }}>
                <span className="iso-lbl-dot" /> WORKFLOW COMPONENTS
              </span>
              <span className="iso-lbl iso-lbl-dim" style={{ top: "67%", right: "4%" }}>
                <span className="iso-lbl-dot" /> CORE PLATFORM
              </span>

              <span className="iso-lbl iso-lbl-dim" style={{ bottom: "8%", left: "6%" }}>
                SYSTEMS OF RECORD
              </span>
              <span className="iso-lbl iso-lbl-dim" style={{ bottom: "7%", right: "24%" }}>
                SYSTEMS OF COORDINATION
              </span>

              <span className="iso-lbl iso-lbl-accent" style={{ top: "54%", left: "18%" }}>
                CONTEXT →
              </span>
              <span className="iso-lbl iso-lbl-dim" style={{ top: "66%", left: "21%" }}>
                ← WRITE-BACK
              </span>
              <span className="iso-lbl iso-lbl-accent" style={{ top: "54%", right: "30%" }}>
                ← DECISIONS
              </span>
              <span className="iso-lbl iso-lbl-dim" style={{ top: "66%", right: "33%" }}>
                ARTIFACTS
              </span>
            </div>
          </div>

          <p className="iso-caption">
            <strong>Shared operational source of truth</strong> — the set of threads,
            consistently captured and discoverable, so status and completion proof
            are trusted without reconstruction.
          </p>
        </div>
      </section>

      {/* Logos */}
      <div className="lin-logos-wrap">
        <div className="lin-logos-eyebrow mono">Regulated teams run on Unifize.</div>
        <div className="lin-logos">
          {logos.map((l) => (
            <div key={l.alt} className="lin-logos-item">
              <img src={l.src} alt={l.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      <div className="lin-light">
        <section className="lin-secondary">
          <div className="lin-secondary-eyebrow">
            <span>The gap</span>
            <span className="line" />
          </div>
          <h2 className="lin-secondary-h2">
            Records hold the truth. Work moves between tools.{" "}
            <span className="dim">
              Unifize is the layer where the thread, the decision, and the record become one.
            </span>
          </h2>
        </section>

        <section className="lin-figs">
          {figs.map((f) => (
            <div key={f.n} className="lin-fig">
              <div className="lin-fig-art" aria-hidden>{f.art}</div>
              <div className="lin-fig-title">
                {f.title} <span className="dim">{f.subtitle}</span>
              </div>
            </div>
          ))}
        </section>

        <section className="lin-bottom">
          <div className="lin-bottom-kicker">Next step.</div>
          <h2 className="lin-bottom-h2">
            Your coordination tax has a number. See yours.
          </h2>
          <p className="lin-bottom-sub">
            Forty-five minutes. One thread in your process. Priced in your numbers.
          </p>
          <div className="lin-bottom-actions">
            <button className="lin-btn-primary">
              Book a demo
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <Link to="/" className="lin-btn-ghost">
              Read the thesis
            </Link>
          </div>
        </section>

        <footer className="lin-foot">
          <div className="lin-foot-inner">
            <span>© {new Date().getFullYear()} Unifize. All rights reserved.</span>
            <span className="mono">Partnered with Microsoft.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
