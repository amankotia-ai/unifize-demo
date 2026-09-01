import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "motion/react";

// Anchor line first, then the rest cycle through.
const PAIN_POINTS = [
  "Design review closed on a verbal yes.",
  "CAPA still open from last quarter.",
  "Change order stuck on four inboxes.",
  "Supplier CAR chased across three mailboxes.",
  "Batch released before sign-offs landed.",
  "Wrong revision on the shop floor.",
  "Submission stitched from four folders.",
  "Training record nobody can produce.",
  "Complaint that found its owner three handoffs late.",
  "Lot on hold - reason in a Teams chat.",
  "Audit finding about a gap nobody named.",
  "Recall scope built from memory.",
  "Decision made in chat, QMS never updated.",
  "Supplier onboarding stalled on one form.",
  "Periodic review overdue, owner unassigned.",
];

const STYLES = `
html:has(.lf-root) { scroll-behavior: smooth; }
.lf-root [id] { scroll-margin-top: 72px; }
.lf-root {
  --lf-bg: #08090A;
  --lf-bg-subtle: #0E0F12;
  --lf-bg-card: #101116;
  --lf-border: rgba(255,255,255,0.08);
  --lf-border-strong: rgba(255,255,255,0.14);
  --lf-text: #FFFFFF;
  --lf-text-muted: rgba(255,255,255,0.56);
  --lf-text-faint: rgba(255,255,255,0.38);
  --lf-accent: #5E6AD2;
  --lf-accent-soft: rgba(94,106,210,0.22);
  --lf-ok: #10B981;
  --lf-warn: #F59E0B;
  --lf-err: #EF4444;

  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  background: var(--lf-bg);
  color: var(--lf-text);
  -webkit-font-smoothing: antialiased;
  letter-spacing: -0.011em;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}
.lf-root * { box-sizing: border-box; }
.lf-root .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
.lf-root a { color: inherit; text-decoration: none; }

/* NAV */
.lf-nav {
  position: sticky; top: 0; z-index: 50;
  backdrop-filter: saturate(160%) blur(18px);
  background: rgba(8,9,10,0.72);
  border-bottom: 1px solid var(--lf-border);
}
.lf-nav-inner {
  max-width: 1320px; margin: 0 auto;
  padding: 12px 24px;
  display: flex; align-items: center; gap: 40px;
}
.lf-nav-logo { display: inline-flex; align-items: center; }
.lf-nav-logo-img {
  height: 22px; width: auto; display: block;
  filter: brightness(0) invert(1);
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
  background: white; color: #0B0D11;
  padding: 7px 14px; border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.9);
  cursor: pointer; transition: background .15s;
}
.lf-nav-btn:hover { background: #EBECEE; }
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
  line-height: 0.98;
  letter-spacing: -0.042em;
  max-width: 22ch;
  margin: 0;
}
.lf-hero-accent {
  background: linear-gradient(92deg, #9AA6F6 0%, #7C8BF0 35%, #F59E0B 70%, #EF4444 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  background-size: 200% 100%;
  animation: lf-hero-gradient 6s ease-in-out infinite;
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
  font-size: 17px;
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
  display: flex; gap: 20px; align-items: center; flex-wrap: wrap;
  justify-content: space-between;
}
.lf-btn-primary {
  font-family: inherit; font-size: 13.5px; font-weight: 500;
  background: #FFFFFF;
  color: #0B0D11;
  padding: 9px 18px; border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.12);
  cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px;
  transition: background .15s ease;
}
.lf-btn-primary:hover { background: #EBECEE; }
.lf-btn-primary:focus-visible {
  outline: 2px solid rgba(255,255,255,0.5);
  outline-offset: 2px;
}
.lf-btn-primary svg { transition: transform .15s ease; }
.lf-btn-primary:hover svg { transform: translateX(1px); }
.lf-nav-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(124,139,240,0.6);
}

/* Anchor line - sits inline with the CTA, right-aligned */
.lf-anchor {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-left: auto;
}
.lf-anchor-label {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10px;
  letter-spacing: 0.22em;
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

/* STAGE */
.lf-stage-wrap {
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 88px 24px 24px;
  position: relative;
  isolation: isolate;
}
.lf-stage-wrap > * {
  position: relative;
  z-index: 1;
}
@media (max-width: 760px) {
  .lf-stage-wrap { padding: 0 16px 24px; }
  .lf-stage-scroll {
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.2) transparent;
    scroll-snap-type: x mandatory;
    border-radius: 14px;
  }
  .lf-stage-frame {
    min-width: 980px;
    scroll-snap-align: start;
  }
}
.lf-stage-scroll { position: relative; border-radius: 14px; }
.lf-stage-frame {
  position: relative;
  border-radius: 14px;
  overflow: visible;
  background: var(--lf-bg);
  aspect-ratio: 3 / 1;
}
.lf-stage-frame svg {
  width: 100%; height: 100%; display: block;
}

/* Stage SVG - phase-driven transitions */
.lf-stage-svg { --lf-ease: cubic-bezier(0.22, 1, 0.36, 1); }

/* ---------- Left lattice (governed) ---------- */
.lf-stage-svg .lf-lattice-node {
  opacity: 0;
  transition: opacity .45s var(--lf-ease);
}
.lf-stage-svg[data-phase="1"] .lf-lattice-node,
.lf-stage-svg[data-phase="2"] .lf-lattice-node,
.lf-stage-svg[data-phase="3"] .lf-lattice-node {
  opacity: 1;
}
.lf-stage-svg .lf-lattice-node-0 { transition-delay: 0.02s; }
.lf-stage-svg .lf-lattice-node-1 { transition-delay: 0.07s; }
.lf-stage-svg .lf-lattice-node-2 { transition-delay: 0.12s; }
.lf-stage-svg .lf-lattice-node-3 { transition-delay: 0.17s; }
.lf-stage-svg .lf-lattice-node-4 { transition-delay: 0.22s; }
.lf-stage-svg .lf-lattice-node-5 { transition-delay: 0.27s; }
.lf-stage-svg .lf-lattice-node-6 { transition-delay: 0.32s; }
.lf-stage-svg .lf-lattice-node-7 { transition-delay: 0.37s; }

.lf-stage-svg .lf-lattice-edge {
  stroke-dasharray: 140;
  stroke-dashoffset: 140;
  transition: stroke-dashoffset .85s var(--lf-ease), opacity .5s var(--lf-ease);
  opacity: 0;
}
.lf-stage-svg[data-phase="1"] .lf-lattice-edge,
.lf-stage-svg[data-phase="2"] .lf-lattice-edge,
.lf-stage-svg[data-phase="3"] .lf-lattice-edge {
  stroke-dashoffset: 0;
  opacity: 1;
  transition-delay: 0.22s;
}

.lf-stage-svg .lf-lattice-pulse { opacity: 1; }
.lf-stage-svg[data-phase="2"] .lf-lattice-pulse,
.lf-stage-svg[data-phase="3"] .lf-lattice-pulse {
  opacity: 0.45;
  transition: opacity .6s var(--lf-ease);
}

/* ---------- Right sprawl (ungoverned) ---------- */
.lf-stage-svg .lf-sprawl-node {
  opacity: 0;
  transition: opacity .5s var(--lf-ease), transform .5s var(--lf-ease);
  transform-box: fill-box;
  transform-origin: center;
}
.lf-stage-svg[data-phase="2"] .lf-sprawl-node,
.lf-stage-svg[data-phase="3"] .lf-sprawl-node {
  opacity: 1;
}
.lf-stage-svg[data-phase="2"] .lf-sprawl-node-0 { transition-delay: 0.05s; }
.lf-stage-svg[data-phase="2"] .lf-sprawl-node-1 { transition-delay: 0.12s; }
.lf-stage-svg[data-phase="2"] .lf-sprawl-node-2 { transition-delay: 0.19s; }
.lf-stage-svg[data-phase="2"] .lf-sprawl-node-3 { transition-delay: 0.26s; }
.lf-stage-svg[data-phase="2"] .lf-sprawl-node-4 { transition-delay: 0.33s; }
.lf-stage-svg[data-phase="2"] .lf-sprawl-node-5 { transition-delay: 0.40s; }
.lf-stage-svg[data-phase="2"] .lf-sprawl-node-6 { transition-delay: 0.47s; }
.lf-stage-svg[data-phase="2"] .lf-sprawl-node-7 { transition-delay: 0.54s; }
.lf-stage-svg[data-phase="2"] .lf-sprawl-node-8 { transition-delay: 0.61s; }
.lf-stage-svg[data-phase="2"] .lf-sprawl-node-9 { transition-delay: 0.68s; }
.lf-stage-svg[data-phase="2"] .lf-sprawl-node-10 { transition-delay: 0.75s; }
.lf-stage-svg[data-phase="2"] .lf-sprawl-node-11 { transition-delay: 0.82s; }
.lf-stage-svg[data-phase="2"] .lf-sprawl-node-12 { transition-delay: 0.89s; }

.lf-stage-svg .lf-sprawl-edge {
  stroke-dasharray: 420;
  stroke-dashoffset: 420;
  opacity: 0;
  transition: stroke-dashoffset 1.1s var(--lf-ease), opacity .5s var(--lf-ease);
}
.lf-stage-svg[data-phase="2"] .lf-sprawl-edge,
.lf-stage-svg[data-phase="3"] .lf-sprawl-edge {
  stroke-dashoffset: 0;
  opacity: 1;
  transition-delay: 0.32s;
}

.lf-stage-svg .lf-sprawl-pulse {
  opacity: 0;
  transition: opacity .4s var(--lf-ease);
}
.lf-stage-svg[data-phase="2"] .lf-sprawl-pulse,
.lf-stage-svg[data-phase="3"] .lf-sprawl-pulse {
  opacity: 1;
}

/* ---------- Entropy meter needle ---------- */
.lf-stage-svg .lf-entropy-needle {
  transition: transform 0.9s var(--lf-ease), filter .6s var(--lf-ease);
  transform-box: fill-box;
  transform-origin: center;
}
.lf-stage-svg[data-phase="3"] .lf-entropy-needle {
  filter: drop-shadow(0 0 3px rgba(239,68,68,0.55));
}

.lf-stage-svg .lf-entropy-value {
  transition: opacity .4s var(--lf-ease);
}

/* ---------- Captions ---------- */
.lf-stage-svg .lf-zone-header {
  opacity: 0;
  transition: opacity .6s var(--lf-ease);
}
.lf-stage-svg[data-phase="1"] .lf-zone-header-left,
.lf-stage-svg[data-phase="2"] .lf-zone-header-left,
.lf-stage-svg[data-phase="3"] .lf-zone-header-left {
  opacity: 1;
}
.lf-stage-svg[data-phase="2"] .lf-zone-header-right,
.lf-stage-svg[data-phase="3"] .lf-zone-header-right {
  opacity: 1;
  transition-delay: 0.1s;
}

.lf-stage-svg .lf-closing-caption {
  opacity: 0;
  transition: opacity .6s var(--lf-ease);
}
.lf-stage-svg[data-phase="3"] .lf-closing-caption {
  opacity: 1;
  transition-delay: 0.6s;
}

/* ---------- Tax counter (reused from HomeLinearFlow) ---------- */
.lf-stage-svg .lf-tax {
  opacity: 0;
  transform: translateY(6px) scale(0.96);
  transform-box: fill-box;
  transform-origin: center;
  transition: opacity .55s var(--lf-ease), transform .55s var(--lf-ease);
}
.lf-stage-svg[data-phase="3"] .lf-tax { opacity: 1; transform: translateY(0) scale(1); transition-delay: 0.8s; }
.lf-stage-svg .lf-tax-num { animation: lf-tax-pulse 1.4s ease-in-out infinite; animation-play-state: paused; }
.lf-stage-svg[data-phase="3"] .lf-tax-num { animation-play-state: running; animation-delay: 1.1s; }
@keyframes lf-tax-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}

@media (prefers-reduced-motion: reduce) {
  .lf-stage-svg .lf-lattice-node,
  .lf-stage-svg .lf-lattice-edge,
  .lf-stage-svg .lf-sprawl-node,
  .lf-stage-svg .lf-sprawl-edge,
  .lf-stage-svg .lf-entropy-needle,
  .lf-stage-svg .lf-zone-header,
  .lf-stage-svg .lf-closing-caption,
  .lf-stage-svg .lf-tax {
    transition: none !important;
    animation: none !important;
  }
  .lf-stage-svg .lf-lattice-node,
  .lf-stage-svg .lf-sprawl-node,
  .lf-stage-svg .lf-zone-header,
  .lf-stage-svg .lf-closing-caption { opacity: 1; }
  .lf-stage-svg .lf-lattice-edge,
  .lf-stage-svg .lf-sprawl-edge {
    stroke-dashoffset: 0;
    opacity: 1;
  }
  .lf-stage-svg .lf-tax {
    opacity: 1;
    transform: none;
  }
}
`;

type Phase = 1 | 2 | 3;

const PHASE_MS: Record<Phase, number> = {
  1: 2800,
  2: 3600,
  3: 5200,
};

// SVG viewBox
const VB_W = 1200;
const VB_H = 720;

// ---- Left lattice (governed) ----
type LatticeNode = { col: number; row: number; x: number; y: number; caption: string };
const LATTICE_NODES: LatticeNode[] = [
  { col: 0, row: 0, x: 120, y: 240, caption: "CAPA" },
  { col: 1, row: 0, x: 240, y: 240, caption: "ECO" },
  { col: 2, row: 0, x: 360, y: 240, caption: "DEV" },
  { col: 3, row: 0, x: 450, y: 240, caption: "TRN" },
  { col: 0, row: 1, x: 120, y: 380, caption: "SCAR" },
  { col: 1, row: 1, x: 240, y: 380, caption: "SOP" },
  { col: 2, row: 1, x: 360, y: 380, caption: "LOT" },
  { col: 3, row: 1, x: 450, y: 380, caption: "REV" },
];

// Edges are index pairs in LATTICE_NODES.
const LATTICE_EDGES: [number, number][] = [
  // Row 0 horizontals: (0,0)->(1,0), (1,0)->(2,0), (2,0)->(3,0)
  [0, 1],
  [1, 2],
  [2, 3],
  // Row 1 horizontals: (0,1)->(1,1), (1,1)->(2,1), (2,1)->(3,1)
  [4, 5],
  [5, 6],
  [6, 7],
  // Columns: (0,0)->(0,1), (1,0)->(1,1), (2,0)->(2,1), (3,0)->(3,1)
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

// Pulse path traversing all 8 nodes in a clean sweep (row 0 right, down, row 1 left).
const LATTICE_PULSE_PATH = (() => {
  const order = [0, 1, 2, 3, 7, 6, 5, 4];
  let d = "";
  order.forEach((idx, i) => {
    const n = LATTICE_NODES[idx];
    d += (i === 0 ? "M " : " L ") + n.x + " " + n.y;
  });
  return d;
})();

// ---- Right sprawl (ungoverned) ----
type SprawlNode = { x: number; y: number; caption: string };
const SPRAWL_NODES: SprawlNode[] = [
  { x: 650, y: 230, caption: "EMAIL" },
  { x: 740, y: 265, caption: "THREAD" },
  { x: 780, y: 285, caption: "THREAD" },
  { x: 830, y: 310, caption: "DM" },
  { x: 900, y: 250, caption: "SHEET" },
  { x: 935, y: 295, caption: "SHEET" },
  { x: 990, y: 230, caption: "COPY" },
  { x: 1025, y: 260, caption: "COPY" },
  { x: 700, y: 380, caption: "CALL" },
  { x: 790, y: 400, caption: "FILE" },
  { x: 830, y: 420, caption: "FILE" },
  { x: 940, y: 380, caption: "FOLLOW-UP" },
  { x: 1050, y: 405, caption: "RE:RE:" },
];

// Bezier edges between sprawl nodes, with off-axis control points.
type SprawlEdge = { from: number; to: number; cx: number; cy: number };
const SPRAWL_EDGES: SprawlEdge[] = [
  // Upper cluster tangles
  { from: 0, to: 1, cx: 680, cy: 220 },
  { from: 1, to: 2, cx: 755, cy: 300 },
  { from: 2, to: 3, cx: 820, cy: 275 },
  { from: 0, to: 4, cx: 760, cy: 205 },
  { from: 4, to: 5, cx: 885, cy: 310 },
  { from: 5, to: 6, cx: 980, cy: 235 },
  { from: 6, to: 7, cx: 1000, cy: 290 },
  { from: 3, to: 7, cx: 960, cy: 320 },
  // Lower/crossing
  { from: 8, to: 9, cx: 720, cy: 420 },
  { from: 9, to: 10, cx: 820, cy: 395 },
  { from: 10, to: 11, cx: 900, cy: 430 },
  { from: 11, to: 12, cx: 1010, cy: 370 },
  { from: 3, to: 8, cx: 740, cy: 350 },
  { from: 7, to: 12, cx: 1080, cy: 340 },
  // Loop-back duplication
  { from: 12, to: 0, cx: 870, cy: 160 },
];

// Compose a quadratic Bezier path string from edge def.
function quadPath(e: SprawlEdge): string {
  const a = SPRAWL_NODES[e.from];
  const b = SPRAWL_NODES[e.to];
  return `M ${a.x} ${a.y} Q ${e.cx} ${e.cy} ${b.x} ${b.y}`;
}

// A single continuous meander through the sprawl for the red pulse.
const SPRAWL_PULSE_PATH = (() => {
  const order = [0, 1, 2, 3, 8, 9, 10, 11, 12, 7, 6, 5, 4, 0];
  const pts = order.map((i) => SPRAWL_NODES[i]);
  let d = "";
  pts.forEach((p, i) => {
    d += (i === 0 ? "M " : " L ") + p.x + " " + p.y;
  });
  return d;
})();

// ---- Entropy meter geometry ----
const METER = {
  cx: VB_W / 2,
  cy: 495,
  w: 520,
  h: 28,
};
const METER_LEFT = METER.cx - METER.w / 2;
const METER_RIGHT = METER.cx + METER.w / 2;

const PHASE_ENTROPY: Record<Phase, { value: number; label: string }> = {
  1: { value: 0.12, label: "0.12" },
  2: { value: 0.58, label: "0.58" },
  3: { value: 0.91, label: "0.91" },
};

function needleX(value: number) {
  return METER_LEFT + value * METER.w;
}

export default function HomeDataArt() {
  const [phase, setPhase] = useState<Phase>(1);
  const [painIdx, setPainIdx] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    document.title = "Unifize · Structure keeps the record. Sprawl runs the work.";
  }, []);

  useEffect(() => {
    const id = window.setInterval(
      () => setPainIdx((i) => (i + 1) % PAIN_POINTS.length),
      2800
    );
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (reduced || phase === 3) return;
    const delay = PHASE_MS[phase];
    const id = window.setTimeout(() => {
      setPhase((phase + 1) as Phase);
    }, delay);
    return () => window.clearTimeout(id);
  }, [phase, reduced]);

  // When reduced motion is on, jump straight to the final state so the
  // composition reads without animation.
  const effectivePhase: Phase = reduced ? 3 : phase;

  return (
    <div className="lf-root">
      <style>{STYLES}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;550;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* Nav */}
      <nav className="lf-nav">
        <div className="lf-nav-inner">
          <Link to="/data-art" className="lf-nav-logo" aria-label="Unifize">
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
            <button className="lf-nav-btn">Book a demo</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="lf-hero">
        <h1 className="lf-hero-h1">
          Structure keeps the record.<br />
          <span className="lf-hero-accent">Sprawl runs the work.</span>
        </h1>
        <p className="lf-hero-subtitle">
          Same nodes. Same events. Two very different shapes.
        </p>
        <div className="lf-hero-cta">
          <button className="lf-btn-primary">
            Book a demo
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="lf-anchor" aria-live="polite">
            <span className="lf-anchor-label">You will recognise it.</span>
            <span className="lf-anchor-slot">
              <span key={painIdx} className="lf-anchor-text">
                {PAIN_POINTS[painIdx]}
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* Stage */}
      <div
        className="lf-stage-wrap"
        data-phase={effectivePhase}
        style={{ ["--lf-phase-dur" as string]: `${PHASE_MS[effectivePhase]}ms` }}
      >
        <div className="lf-stage-scroll">
          <div className="lf-stage-frame">
            <DataArtStage phase={effectivePhase} reduced={!!reduced} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- STAGE ---------------- */

function DataArtStage({ phase, reduced }: { phase: Phase; reduced: boolean }) {
  const entropy = PHASE_ENTROPY[phase];
  const nx = needleX(entropy.value);

  return (
    <svg
      className="lf-stage-svg"
      data-phase={phase}
      viewBox={`0 138 ${VB_W} 402`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Abstract data art: left cluster shows eight record systems arranged in an orderly lattice. Right cluster shows thirteen sprawl nodes connected by tangled curved lines with duplication. An entropy meter below swings from low to high as work migrates from the governed left to the ungoverned right."
    >
      <defs>
        <pattern id="lf-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.6" fill="rgba(255,255,255,0.05)" />
        </pattern>
        <radialGradient id="lf-grid-mask" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="white" stopOpacity="1" />
          <stop offset="0.7" stopColor="white" stopOpacity="0.5" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="lf-grid-fade">
          <rect width={VB_W} height={VB_H} fill="url(#lf-grid-mask)" />
        </mask>
        <linearGradient id="lf-card-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0E0F12" />
          <stop offset="1" stopColor="#0E0F12" />
        </linearGradient>
      </defs>

      {/* Subtle dot grid backdrop */}
      <rect
        x={0}
        y={0}
        width={VB_W}
        height={VB_H}
        fill="url(#lf-grid)"
        mask="url(#lf-grid-fade)"
      />

      {/* ========== LEFT: GOVERNED · THE RECORD ========== */}
      <ZoneHeader side="left" x={90} y={178} text="GOVERNED · THE RECORD" />

      {/* Lattice edges (orthogonal, drawn straight with stroke-dashoffset reveal) */}
      <g fill="none" strokeLinecap="round">
        {LATTICE_EDGES.map(([a, b], i) => {
          const A = LATTICE_NODES[a];
          const B = LATTICE_NODES[b];
          return (
            <line
              key={`lattice-edge-${i}`}
              className="lf-lattice-edge"
              x1={A.x}
              y1={A.y}
              x2={B.x}
              y2={B.y}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth={1}
            />
          );
        })}
      </g>

      {/* Lattice nodes (6px discs) */}
      <g>
        {LATTICE_NODES.map((n, i) => (
          <g key={`lattice-node-${i}`} className={`lf-lattice-node lf-lattice-node-${i}`}>
            <circle
              cx={n.x}
              cy={n.y}
              r={3.5}
              fill="rgba(255,255,255,0.88)"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth={0.5}
            />
            <text
              x={n.x}
              y={n.y + 14}
              textAnchor="middle"
              fontFamily="JetBrains Mono, monospace"
              fontSize={8.5}
              letterSpacing="0.2em"
              fill="rgba(255,255,255,0.55)"
              dominantBaseline="hanging"
            >
              {n.caption}
            </text>
          </g>
        ))}
      </g>

      {/* Lattice pulse: a small brighter disc that sweeps all 8 nodes in P1,
          then dims in later phases. Hidden entirely in reduced motion. */}
      {!reduced && (
        <g className="lf-lattice-pulse">
          <circle r={2} fill="rgba(94,106,210,0.95)">
            <animateMotion dur="2.4s" repeatCount="indefinite" path={LATTICE_PULSE_PATH} />
          </circle>
        </g>
      )}

      {/* ========== RIGHT: UNGOVERNED · THE WORK ========== */}
      <ZoneHeader side="right" x={1110} y={178} text="UNGOVERNED · THE WORK" />

      {/* Sprawl edges (curved Bezier) */}
      <g fill="none" strokeLinecap="round">
        {SPRAWL_EDGES.map((e, i) => (
          <path
            key={`sprawl-edge-${i}`}
            className="lf-sprawl-edge"
            d={quadPath(e)}
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={1}
          />
        ))}
      </g>

      {/* Sprawl nodes (same disc style, duplicates overlap naturally via coords) */}
      <g>
        {SPRAWL_NODES.map((n, i) => (
          <g key={`sprawl-node-${i}`} className={`lf-sprawl-node lf-sprawl-node-${i}`}>
            <circle
              cx={n.x}
              cy={n.y}
              r={3.5}
              fill="rgba(255,255,255,0.88)"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth={0.5}
            />
            <text
              x={n.x}
              y={n.y + 14}
              textAnchor="middle"
              fontFamily="JetBrains Mono, monospace"
              fontSize={8.5}
              letterSpacing="0.2em"
              fill="rgba(255,255,255,0.55)"
              dominantBaseline="hanging"
            >
              {n.caption}
            </text>
          </g>
        ))}
      </g>

      {/* Sprawl pulse: red-ish disc meandering through the sprawl, loops
          and fades. Hidden in reduced motion. */}
      {!reduced && (
        <g className="lf-sprawl-pulse">
          <circle r={2} fill="rgba(239,68,68,0.9)">
            <animateMotion
              dur="3.2s"
              repeatCount="indefinite"
              path={SPRAWL_PULSE_PATH}
            />
            <animate
              attributeName="opacity"
              values="0;0.9;0.9;0.25;0"
              keyTimes="0;0.1;0.7;0.9;1"
              dur="3.2s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      )}

      {/* ========== ENTROPY METER ========== */}
      <EntropyMeter phase={phase} nx={nx} label={entropy.label} />

      {/* ========== Closing caption (P3) ========== */}
      <text
        className="lf-closing-caption"
        x={VB_W / 2}
        y={585}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize={10.5}
        letterSpacing="0.18em"
        fill="rgba(255,255,255,0.56)"
      >
        Same inputs.&nbsp;&nbsp;Different geometry.&nbsp;&nbsp;The geometry is the cost.
      </text>

      {/* Tax counter (P3) */}
      <TaxCounter />
    </svg>
  );
}

/* ---------------- Pieces ---------------- */

function ZoneHeader({
  side,
  x,
  y,
  text,
}: {
  side: "left" | "right";
  x: number;
  y: number;
  text: string;
}) {
  // Mono header with hairline flanks. The flank length sits in proportion
  // with the label so the typography reads as "labeled zone".
  const approxTextW = text.length * 6.4; // rough for letter-spacing 0.24em mono 9px
  const hairLen = 32;
  const gap = 10;
  const anchor: "start" | "end" = side === "left" ? "start" : "end";

  if (side === "left") {
    // text sits at x, flanks on either side.
    return (
      <g className={`lf-zone-header lf-zone-header-left`}>
        <text
          x={x}
          y={y}
          textAnchor={anchor}
          fontFamily="JetBrains Mono, monospace"
          fontSize={9}
          letterSpacing="0.24em"
          fill="rgba(255,255,255,0.56)"
        >
          {text}
        </text>
        {/* Right hairline */}
        <line
          x1={x + approxTextW + gap}
          x2={x + approxTextW + gap + hairLen}
          y1={y - 3}
          y2={y - 3}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={1}
        />
      </g>
    );
  }

  return (
    <g className={`lf-zone-header lf-zone-header-right`}>
      <text
        x={x}
        y={y}
        textAnchor={anchor}
        fontFamily="JetBrains Mono, monospace"
        fontSize={9}
        letterSpacing="0.24em"
        fill="rgba(255,255,255,0.56)"
      >
        {text}
      </text>
      {/* Left hairline */}
      <line
        x1={x - approxTextW - gap - hairLen}
        x2={x - approxTextW - gap}
        y1={y - 3}
        y2={y - 3}
        stroke="rgba(255,255,255,0.18)"
        strokeWidth={1}
      />
    </g>
  );
}

function EntropyMeter({ phase, nx, label }: { phase: Phase; nx: number; label: string }) {
  const { cx, cy, w, h } = METER;
  const left = cx - w / 2;
  const right = cx + w / 2;

  // The needle is a small white triangle. We translate it in x via the
  // transform attribute. CSS transitions handle the tween.
  const needleBaseY = cy - h / 2 - 4;
  const needleTipY = cy - h / 2 + 4;

  return (
    <g>
      {/* LOW label (left) */}
      <text
        x={left - 14}
        y={cy + 3.5}
        textAnchor="end"
        fontFamily="JetBrains Mono, monospace"
        fontSize={9.5}
        letterSpacing="0.18em"
        fill="rgba(255,255,255,0.5)"
      >
        LOW
      </text>

      {/* Bar */}
      <rect
        x={left}
        y={cy - h / 2}
        width={w}
        height={h}
        rx={6}
        fill="url(#lf-card-fill)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth={1}
      />

      {/* Interior tick marks for reference. Subtle. */}
      <g stroke="rgba(255,255,255,0.08)" strokeWidth={1}>
        {[0.25, 0.5, 0.75].map((t) => (
          <line
            key={`tick-${t}`}
            x1={left + w * t}
            x2={left + w * t}
            y1={cy - h / 2 + 6}
            y2={cy + h / 2 - 6}
          />
        ))}
      </g>

      {/* HIGH label (right): red */}
      <text
        x={right + 14}
        y={cy + 3.5}
        textAnchor="start"
        fontFamily="JetBrains Mono, monospace"
        fontSize={9.5}
        letterSpacing="0.18em"
        fill="rgba(239,68,68,0.85)"
      >
        HIGH
      </text>

      {/* Needle: triangle positioned via transform on group so CSS tween applies */}
      <g
        className="lf-entropy-needle"
        style={{ transform: `translateX(${nx - left}px)` }}
      >
        <polygon
          points={`${left - 6},${needleBaseY} ${left + 6},${needleBaseY} ${left},${needleTipY}`}
          fill={phase === 3 ? "rgba(255,180,180,0.95)" : "rgba(255,255,255,0.88)"}
        />
      </g>

      {/* Value readout below the bar */}
      <text
        key={label}
        className="lf-entropy-value"
        x={cx}
        y={cy + h / 2 + 18}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize={10}
        letterSpacing="0.16em"
        fill={phase === 3 ? "rgba(239,68,68,0.85)" : "rgba(255,255,255,0.72)"}
      >
        {label}
      </text>
    </g>
  );
}

function TaxCounter() {
  const cx = VB_W / 2;
  const cy = 550;
  const w = 204;
  const h = 30;
  return (
    <g className="lf-tax">
      <rect
        x={cx - w / 2}
        y={cy - h / 2}
        width={w}
        height={h}
        rx={6}
        fill="url(#lf-card-fill)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth={1}
      />
      <circle cx={cx - w / 2 + 14} cy={cy} r={2.2} fill="#F87171" />
      <text
        x={cx - w / 2 + 26}
        y={cy + 3.5}
        fontFamily="JetBrains Mono, monospace"
        fontSize={9.5}
        letterSpacing="0.16em"
      >
        <tspan fill="rgba(255,255,255,0.5)">COORDINATION TAX</tspan>
        <tspan dx="10" className="lf-tax-num" fill="rgba(255,255,255,0.92)">+24D</tspan>
      </text>
    </g>
  );
}
