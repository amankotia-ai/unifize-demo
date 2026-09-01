import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "motion/react";

// Anchor line first, then the rest cycle through. Anchor aligned to the visual:
// CAPA-241 is closed on record on the left, still in motion on the right.
const PAIN_POINTS = [
  "CAPA closed on paper. Still running in email.",
  "Design review closed on a verbal yes.",
  "Change order stuck on four inboxes.",
  "Supplier CAR chased across three mailboxes.",
  "Batch released before sign-offs landed.",
  "Wrong revision on the shop floor.",
  "Submission stitched from four folders.",
  "Training record nobody can produce.",
  "Complaint that found its owner three handoffs late.",
  "Lot on hold. Reason in a Teams chat.",
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

/* Stage SVG */
.lf-stage-svg { --lf-ease: cubic-bezier(0.22, 1, 0.36, 1); }
.lf-stage-svg .lf-fade { transition: opacity .55s var(--lf-ease); }
.lf-stage-svg .lf-pop { transition: opacity .35s var(--lf-ease), transform .35s var(--lf-ease); transform-box: fill-box; transform-origin: center; }
.lf-stage-svg .lf-path { transition: stroke-dashoffset .9s var(--lf-ease), opacity .45s var(--lf-ease); }

/* RECORD COLUMN: left half, staggered fade-in at phase 1 */
.lf-stage-svg .lf-record-card {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  transition: opacity .55s var(--lf-ease);
}
.lf-stage-svg[data-phase="1"] .lf-record-card,
.lf-stage-svg[data-phase="2"] .lf-record-card,
.lf-stage-svg[data-phase="3"] .lf-record-card {
  opacity: 1;
}
.lf-stage-svg[data-phase="1"] .lf-record-card-0 { transition-delay: 0.08s; }
.lf-stage-svg[data-phase="1"] .lf-record-card-1 { transition-delay: 0.18s; }
.lf-stage-svg[data-phase="1"] .lf-record-card-2 { transition-delay: 0.28s; }
.lf-stage-svg[data-phase="1"] .lf-record-card-3 { transition-delay: 0.38s; }
.lf-stage-svg[data-phase="1"] .lf-record-card-4 { transition-delay: 0.48s; }
.lf-stage-svg[data-phase="1"] .lf-record-card-5 { transition-delay: 0.58s; }

/* CHAOS CARDS: right half, fade in at phase 2 */
.lf-stage-svg .lf-chaos-card {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  transition: opacity .6s var(--lf-ease);
}
.lf-stage-svg[data-phase="2"] .lf-chaos-card { opacity: 0.98; }
.lf-stage-svg[data-phase="3"] .lf-chaos-card { opacity: 1; }
.lf-stage-svg[data-phase="2"] .lf-chaos-card-0 { transition-delay: 0.08s; }
.lf-stage-svg[data-phase="2"] .lf-chaos-card-1 { transition-delay: 0.18s; }
.lf-stage-svg[data-phase="2"] .lf-chaos-card-2 { transition-delay: 0.28s; }
.lf-stage-svg[data-phase="2"] .lf-chaos-card-3 { transition-delay: 0.38s; }
.lf-stage-svg[data-phase="2"] .lf-chaos-card-4 { transition-delay: 0.48s; }
.lf-stage-svg[data-phase="2"] .lf-chaos-card-5 { transition-delay: 0.58s; }
.lf-stage-svg[data-phase="2"] .lf-chaos-card-6 { transition-delay: 0.68s; }
.lf-stage-svg[data-phase="2"] .lf-chaos-card-7 { transition-delay: 0.78s; }

/* Seam label crossfade */
.lf-stage-svg .lf-seam-label {
  opacity: 0;
  transition: opacity .5s var(--lf-ease);
}
.lf-stage-svg[data-phase="1"] .lf-seam-label-1 { opacity: 1; }
.lf-stage-svg[data-phase="2"] .lf-seam-label-2 { opacity: 1; }
.lf-stage-svg[data-phase="3"] .lf-seam-label-3 { opacity: 1; }

/* Seam void: fixed 56px wide vertical band. Opacity saturates with phase so the
   wash deepens as the coordination tax accumulates without the geometry jumping. */
.lf-stage-svg .lf-seam-band {
  opacity: 0.4;
  transition: opacity .6s var(--lf-ease);
}
.lf-stage-svg[data-phase="1"] .lf-seam-band { opacity: 0.4; }
.lf-stage-svg[data-phase="2"] .lf-seam-band { opacity: 0.7; }
.lf-stage-svg[data-phase="3"] .lf-seam-band { opacity: 1; }

/* Seam hairlines flanking the void. Static. */
.lf-stage-svg .lf-seam-hairline {
  opacity: 1;
}

/* Seam caption at the top of the void — reads on all phases. */
.lf-stage-svg .lf-seam-caption {
  opacity: 0.78;
}

/* At P3 the rotated narrator label hands the seam over to the tax counter —
   it fades out so the counter isn't reading on top of a duplicate label. */
.lf-stage-svg[data-phase="3"] .lf-seam-label-3 {
  opacity: 0;
}

/* Latency stamps: phase 3 */
.lf-stage-svg .lf-latency { opacity: 0; transition: opacity .45s var(--lf-ease); }
.lf-stage-svg[data-phase="3"] .lf-latency { opacity: 1; }
.lf-stage-svg[data-phase="3"] .lf-latency-0 { transition-delay: 0.18s; }
.lf-stage-svg[data-phase="3"] .lf-latency-1 { transition-delay: 0.28s; }
.lf-stage-svg[data-phase="3"] .lf-latency-2 { transition-delay: 0.38s; }
.lf-stage-svg[data-phase="3"] .lf-latency-3 { transition-delay: 0.48s; }
.lf-stage-svg[data-phase="3"] .lf-latency-4 { transition-delay: 0.58s; }
.lf-stage-svg[data-phase="3"] .lf-latency-5 { transition-delay: 0.68s; }
.lf-stage-svg[data-phase="3"] .lf-latency-6 { transition-delay: 0.78s; }
.lf-stage-svg[data-phase="3"] .lf-latency-7 { transition-delay: 0.88s; }

/* Tax counter: phase 3 reveal */
.lf-stage-svg .lf-tax {
  opacity: 0;
  transform: translateY(6px) scale(0.96);
  transform-box: fill-box;
  transform-origin: center;
  transition: opacity .55s var(--lf-ease), transform .55s var(--lf-ease);
}
.lf-stage-svg[data-phase="3"] .lf-tax { opacity: 1; transform: translateY(0) scale(1); transition-delay: 0.6s; }
.lf-stage-svg .lf-tax-num { animation: lf-tax-pulse 1.4s ease-in-out infinite; animation-play-state: paused; }
.lf-stage-svg[data-phase="3"] .lf-tax-num { animation-play-state: running; animation-delay: 0.9s; }
@keyframes lf-tax-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}

/* Stage anchor — static one-liner that bridges the visual and the closing caption */
.lf-stage-anchor {
  margin: 24px auto 0;
  max-width: 1440px;
  padding: 0 24px;
  text-align: center;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 11.5px;
  font-weight: 500;
  letter-spacing: 0.28em;
  color: rgba(255,255,255,0.72);
  text-transform: none;
}

/* Closing caption */
.lf-closing-caption {
  margin: 14px auto 72px;
  max-width: 1440px;
  padding: 0 24px;
  text-align: center;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  color: rgba(255,255,255,0.5);
  text-transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .lf-stage-svg .lf-fade,
  .lf-stage-svg .lf-pop,
  .lf-stage-svg .lf-path,
  .lf-stage-svg .lf-chaos-card,
  .lf-stage-svg .lf-record-card,
  .lf-stage-svg .lf-seam-band,
  .lf-stage-svg .lf-seam-label,
  .lf-stage-svg .lf-latency,
  .lf-stage-svg .lf-tax { transition: none !important; }
}
`;

type Phase = 1 | 2 | 3;

const PHASE_MS: Record<Phase, number> = {
  1: 2800,
  2: 3600,
  3: 5200,
};

// SVG viewBox shared with HomeLinearFlow
const VB_W = 1200;
const VB_H = 720;
const SEAM_X = VB_W / 2;

// RECORD COLUMN: left half. Each card is a full zone element — status dot on
// the left, id + system label in the first column, closure date + delta on the
// right. No status pill: the amber CAPA anomaly reads louder because it is the
// only card whose closure line is coloured.
type RecordCardDef = {
  key: string;
  id: string;
  statusKind: "ok" | "warn";
  closureDate: string;
  delta: string;
  meta: string;
};

const RECORD_CARDS: RecordCardDef[] = [
  {
    key: "capa",
    id: "CAPA-241",
    statusKind: "warn",
    closureDate: "CLOSED · DAY 28",
    delta: "+11D PAST TARGET",
    meta: "QMS",
  },
  {
    key: "eco",
    id: "ECO-882",
    statusKind: "ok",
    closureDate: "APPROVED · DAY 14",
    delta: "ON TARGET",
    meta: "PLM",
  },
  {
    key: "dev",
    id: "DEV-2041",
    statusKind: "ok",
    closureDate: "SIGNED · DAY 9",
    delta: "AHEAD · 1D",
    meta: "DMS",
  },
  {
    key: "trn",
    id: "TRN-0317",
    statusKind: "ok",
    closureDate: "VALID · DAY 3",
    delta: "ON TARGET",
    meta: "LMS",
  },
  {
    key: "scar",
    id: "SCAR-314",
    statusKind: "ok",
    closureDate: "CLOSED · DAY 19",
    delta: "ON TARGET",
    meta: "",
  },
  {
    key: "sop",
    id: "SOP-0244",
    statusKind: "ok",
    closureDate: "PUBLISHED · DAY 5",
    delta: "ON TARGET",
    meta: "DOC-CTRL",
  },
];

const RECORD_COL_X = 80;
const RECORD_CARD_W = 420;
const RECORD_CARD_H = 54;
// Six records, tighter spacing so the left column bottoms at roughly the same
// baseline as the right cluster.
const RECORD_Y_POSITIONS = [168, 226, 284, 342, 400, 458];

// CHAOS CARDS: right half. Shifted from HomeLinearFlow by adding ~320 to x positions.
type ChaosCardDef = {
  key: string;
  name: string;
  artifact: string;
  meta: string;
  latency: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  critical?: boolean;
};

// Four clear rows of chaos, with an intentional gap in the middle where the
// seam's tax counter emerges. No card overlaps with another, no card overlaps
// the tax counter, and the latency stamps stay within 24px of their owner's
// outer edge without colliding with neighbours.
const CHAOS_CARDS: ChaosCardDef[] = [
  {
    key: "outlook",
    name: "Outlook",
    artifact: "Re: CAPA-241",
    meta: "17 REPLIES · 4 CC",
    latency: "+3D",
    x: 688,
    y: 152,
    w: 224,
    h: 56,
    rot: -4,
  },
  {
    key: "teams",
    name: "Teams",
    artifact: "CAPA-241 · @quality-ops",
    meta: "4 THREADS · 2 UNREAD",
    latency: "+8D",
    x: 948,
    y: 168,
    w: 224,
    h: 56,
    rot: 3,
    critical: true,
  },
  {
    key: "outlook-fw",
    name: "Outlook",
    artifact: "FW: Re: CAPA-241",
    meta: "17 CC · 2 BOUNCED",
    latency: "+2D",
    x: 700,
    y: 246,
    w: 224,
    h: 56,
    rot: 2,
  },
  {
    key: "slack",
    name: "Slack",
    artifact: "#quality · CAPA-241",
    meta: "22 MSG · DM FORK",
    latency: "+5D",
    x: 956,
    y: 262,
    w: 224,
    h: 56,
    rot: -2,
  },
  {
    key: "excel-v4",
    name: "Excel",
    artifact: "CAPA-241_v4_FINAL.xlsx",
    meta: "MERGED 2 TABS",
    latency: "+5D",
    x: 688,
    y: 376,
    w: 224,
    h: 56,
    rot: 3,
  },
  {
    key: "drive",
    name: "Drive",
    artifact: "CAPA-241/v7-final",
    meta: "3 COPIES · 2 OWNERS",
    latency: "+7D",
    x: 948,
    y: 388,
    w: 224,
    h: 56,
    rot: -3,
  },
  {
    key: "excel",
    name: "Excel",
    artifact: "CAPA-241_tracker.xlsx",
    meta: "RENAMED 3x · 2 OWNERS",
    latency: "+6D",
    x: 700,
    y: 462,
    w: 224,
    h: 56,
    rot: -3,
  },
  {
    key: "meeting",
    name: "Meeting",
    artifact: "CAPA-241 · 7 on call",
    meta: "NO NOTES · VERBAL YES",
    latency: "+4D",
    x: 948,
    y: 468,
    w: 224,
    h: 56,
    rot: 2,
  },
];

function rotatePoint(px: number, py: number, cx: number, cy: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = px - cx;
  const dy = py - cy;
  return {
    x: cx + dx * cos - dy * sin,
    y: cy + dx * sin + dy * cos,
  };
}

function cardCenter(c: ChaosCardDef) {
  return { x: c.x + c.w / 2, y: c.y + c.h / 2 };
}

function orthPath(points: Array<{ x: number; y: number }>, r = 5): string {
  if (points.length < 2) return "";
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];
    const inLen = Math.hypot(curr.x - prev.x, curr.y - prev.y);
    const outLen = Math.hypot(next.x - curr.x, next.y - curr.y);
    const rr = Math.min(r, inLen / 2, outLen / 2);
    const inDx = Math.sign(curr.x - prev.x);
    const inDy = Math.sign(curr.y - prev.y);
    const outDx = Math.sign(next.x - curr.x);
    const outDy = Math.sign(next.y - curr.y);
    const ax = curr.x - inDx * rr;
    const ay = curr.y - inDy * rr;
    const bx = curr.x + outDx * rr;
    const by = curr.y + outDy * rr;
    d += ` L ${ax} ${ay} Q ${curr.x} ${curr.y} ${bx} ${by}`;
  }
  const last = points[points.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
}

// Latency-stamp anchor: each card gets a stamp within 24px of its outer edge,
// on the outside of whichever sub-stack of the cluster the card belongs to.
// The chaos cluster sits entirely right of the seam, but splits internally
// into two physical stacks (left-stack, right-stack). Stamps emit outward
// from each stack so they do not collide with neighbouring cards in the
// cluster, and rotate with the card so they stay locked to their owner.
const CHAOS_STACK_SPLIT_X = 920;

function latencyAnchor(c: ChaosCardDef): {
  x: number;
  y: number;
  anchor: "start" | "end";
} {
  const cx = c.x + c.w / 2;
  const cy = c.y + c.h / 2;
  const leftStack = cx < CHAOS_STACK_SPLIT_X;
  const edgeX = leftStack ? c.x - 8 : c.x + c.w + 8;
  const edgeY = c.y + 4;
  const p = rotatePoint(edgeX, edgeY, cx, cy, c.rot);
  return { x: p.x, y: p.y, anchor: leftStack ? "end" : "start" };
}

// Silence unused warnings for helpers reserved for shard routing if needed later.
void cardCenter;
void orthPath;

export default function HomeSplitWorld() {
  const [phase, setPhase] = useState<Phase>(1);
  const [painIdx, setPainIdx] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    document.title = "Unifize · Records stay in place";
  }, []);

  useEffect(() => {
    const id = window.setInterval(
      () => setPainIdx((i) => (i + 1) % PAIN_POINTS.length),
      2800
    );
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (reduced) {
      setPhase(3);
      return;
    }
    if (phase === 3) return;
    const delay = PHASE_MS[phase];
    const id = window.setTimeout(() => {
      setPhase((phase + 1) as Phase);
    }, delay);
    return () => window.clearTimeout(id);
  }, [phase, reduced]);

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
          <Link to="/split-world" className="lf-nav-logo" aria-label="Unifize">
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
          Records stay in place.<br />
          Work <span className="lf-hero-accent">does not.</span>
        </h1>
        <p className="lf-hero-subtitle">
          Two worlds. Same company. No system holds what happens between them.
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
        data-phase={phase}
        style={{ ["--lf-phase-dur" as string]: `${PHASE_MS[phase]}ms` }}
      >
        <div className="lf-stage-scroll">
          <div className="lf-stage-frame">
            <SplitStage phase={phase} />
          </div>
        </div>
        <p className="lf-stage-anchor">
          SAME EVENT.&nbsp;&nbsp;TWO ADDRESSES.
        </p>
        <p className="lf-closing-caption">
          One row says what closed.&nbsp;&nbsp;The other holds what happened.
        </p>
      </div>
    </div>
  );
}

/* ---------------- STAGE ---------------- */

function SplitStage({ phase }: { phase: Phase }) {
  // Seam geometry: fixed 56px vertical void flanked by two hairlines. The void
  // is the gap the viewer is meant to feel, not a connector. The wash deepens
  // with phase but the geometry stays put so the eye doesn't jump.
  const SEAM_HALF = 28;
  const seamTop = 150;
  const seamBottom = 540;
  const seamMidY = (seamTop + seamBottom) / 2;

  // Phase-driven narrator text for screen readers.
  const seamNarration: Record<Phase, string> = {
    1: "The record.",
    2: "The reality.",
    3: "Coordination tax.",
  };
  void phase;

  return (
    <svg
      className="lf-stage-svg"
      data-phase={phase}
      viewBox={`0 138 ${VB_W} 402`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Two worlds side by side. The left half is the record: five compact quality records sitting quietly, each closed and signed. The right half is the reality: eight scattered, tilted cards from email, chat, spreadsheets and meetings, all carrying the same CAPA across tools. A dashed vertical seam separates them, widening into a shaded band labelled coordination tax. The gap between the two halves is what no system holds."
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
        <marker
          id="lf-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="4.5"
          markerHeight="4.5"
          orient="auto"
        >
          <path
            d="M 2 2.5 L 8 5 L 2 7.5"
            fill="none"
            stroke="rgba(255,255,255,0.58)"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
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

      {/* Zone header: THE RECORD. Single right-hand hairline that frames the
          card column's full width, so the header reads as the zone's top edge. */}
      <g>
        <text
          x={RECORD_COL_X}
          y={151}
          fontFamily="JetBrains Mono, monospace"
          fontSize={9}
          letterSpacing="0.24em"
          fill="rgba(255,255,255,0.56)"
        >
          THE RECORD.
        </text>
        <line
          x1={RECORD_COL_X + 108}
          x2={RECORD_COL_X + RECORD_CARD_W}
          y1={148}
          y2={148}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={1}
          strokeDasharray="3 4"
        />
      </g>

      {/* Zone header: THE REALITY. Matching single right-hand hairline that
          extends to the right cluster's right edge. */}
      <g>
        <text
          x={688}
          y={151}
          fontFamily="JetBrains Mono, monospace"
          fontSize={9}
          letterSpacing="0.24em"
          fill="rgba(255,255,255,0.56)"
        >
          THE REALITY.
        </text>
        <line
          x1={688 + 112}
          x2={1180}
          y1={148}
          y2={148}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={1}
          strokeDasharray="3 4"
        />
      </g>

      {/* Seam: fixed 56px void, two flanking hairlines, static caption at the top,
          and a phase-driven rotated narrator label at the centre. The seam is the
          whole point — not a line but a gap the viewer must feel. */}
      <g
        role="group"
        aria-label={`Seam between the record and the reality. ${seamNarration[phase]}`}
      >
        {/* Void wash */}
        <rect
          className="lf-seam-band"
          x={SEAM_X - SEAM_HALF}
          y={seamTop}
          width={SEAM_HALF * 2}
          height={seamBottom - seamTop}
          fill="rgba(255,255,255,0.035)"
        />

        {/* Left hairline */}
        <line
          className="lf-seam-hairline"
          x1={SEAM_X - SEAM_HALF}
          x2={SEAM_X - SEAM_HALF}
          y1={seamTop}
          y2={seamBottom}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={1}
        />
        {/* Right hairline */}
        <line
          className="lf-seam-hairline"
          x1={SEAM_X + SEAM_HALF}
          x2={SEAM_X + SEAM_HALF}
          y1={seamTop}
          y2={seamBottom}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={1}
        />

        {/* Top terminator — a 16px horizontal cap that gives the void a start. */}
        <line
          x1={SEAM_X - 8}
          x2={SEAM_X + 8}
          y1={seamTop}
          y2={seamTop}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={1}
        />

        {/* Bottom terminator — matching 16px cap that gives the void an end. */}
        <line
          x1={SEAM_X - 8}
          x2={SEAM_X + 8}
          y1={seamBottom}
          y2={seamBottom}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={1}
        />

        {/* Seam caption sits clearly inside the void, below the zone-header
            hairlines, so it reads as a seam label not a header extension. */}
        <text
          className="lf-seam-caption"
          x={SEAM_X}
          y={seamTop + 56}
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
          fontSize={8}
          letterSpacing="0.26em"
          fill="rgba(255,255,255,0.46)"
          aria-hidden="true"
        >
          NO OWNER · NO SYSTEM
        </text>
        <line
          x1={SEAM_X - 56}
          x2={SEAM_X + 56}
          y1={seamTop + 66}
          y2={seamTop + 66}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={1}
        />

        {/* Rotated narrator label — crossfades across P1 / P2 / P3 */}
        <g transform={`rotate(-90 ${SEAM_X} ${seamMidY})`} aria-hidden="true">
          <text
            className="lf-seam-label lf-seam-label-1"
            x={SEAM_X}
            y={seamMidY + 3}
            textAnchor="middle"
            fontFamily="JetBrains Mono, monospace"
            fontSize={9.5}
            letterSpacing="0.26em"
            fill="rgba(255,255,255,0.58)"
          >
            THE RECORD.
          </text>
          <text
            className="lf-seam-label lf-seam-label-2"
            x={SEAM_X}
            y={seamMidY + 3}
            textAnchor="middle"
            fontFamily="JetBrains Mono, monospace"
            fontSize={9.5}
            letterSpacing="0.26em"
            fill="rgba(255,255,255,0.58)"
          >
            THE REALITY.
          </text>
          <text
            className="lf-seam-label lf-seam-label-3"
            x={SEAM_X}
            y={seamMidY + 3}
            textAnchor="middle"
            fontFamily="JetBrains Mono, monospace"
            fontSize={9.5}
            letterSpacing="0.26em"
            fill="rgba(255,255,255,0.72)"
          >
            COORDINATION TAX.
          </text>
        </g>
      </g>

      {/* Record column: left half */}
      <g>
        {RECORD_CARDS.map((r, i) => (
          <RecordCard
            key={r.key}
            rec={r}
            index={i}
            x={RECORD_COL_X}
            y={RECORD_Y_POSITIONS[i]}
          />
        ))}
      </g>

      {/* Chaos cards: right half, scatter */}
      <g>
        {CHAOS_CARDS.map((c, i) => (
          <ChaosCard key={c.key} card={c} index={i} />
        ))}
      </g>

      {/* Latency stamps on right half — phase 3. Each chaos card gets a mono
          delta tagged just above its top-right edge. Together they read as an
          accumulating clock. */}
      <g aria-hidden="true">
        {CHAOS_CARDS.map((c, i) => {
          const stamp = latencyAnchor(c);
          return (
            <g
              key={`latency-${i}`}
              className={`lf-latency lf-latency-${i}`}
            >
              <text
                x={stamp.x}
                y={stamp.y}
                textAnchor={stamp.anchor}
                fontFamily="JetBrains Mono, monospace"
                fontSize={10}
                fontWeight={500}
                letterSpacing="0.12em"
                fill="rgba(248,113,113,0.82)"
              >
                {c.latency}
              </text>
            </g>
          );
        })}
      </g>

      {/* Coordination tax counter: docks on seam at phase 3 */}
      <TaxCounter />
    </svg>
  );
}

/* ---------------- Pieces ---------------- */

function RecordCard({
  rec,
  index,
  x,
  y,
}: {
  rec: RecordCardDef;
  index: number;
  x: number;
  y: number;
}) {
  const warn = rec.statusKind === "warn";
  const dotFill = warn ? "#F59E0B" : "#10B981";
  // The amber card's closure line and delta carry the only coloured text in
  // the column. All other cards stay in muted greys so the CAPA anomaly is
  // the single note that reads out loud.
  const closureFill = warn ? "rgba(252,210,106,0.96)" : "rgba(255,255,255,0.62)";
  const deltaFill = warn ? "rgba(252,210,106,0.74)" : "rgba(255,255,255,0.34)";

  return (
    <g className={`lf-record-card lf-record-card-${index}`}>
      {/* Card body */}
      <rect
        x={x}
        y={y}
        width={RECORD_CARD_W}
        height={RECORD_CARD_H}
        rx={5}
        fill="url(#lf-card-fill)"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={1}
      />

      {/* Vertical hairline dividing id block from closure column */}
      <line
        x1={x + 170}
        x2={x + 170}
        y1={y + 12}
        y2={y + RECORD_CARD_H - 12}
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={1}
      />

      {/* Status dot */}
      <circle cx={x + 14} cy={y + 22} r={2.6} fill={dotFill} />

      {/* Mono ID */}
      <text
        x={x + 26}
        y={y + 26}
        fontFamily="JetBrains Mono, monospace"
        fontSize={13}
        letterSpacing="0.04em"
        fill="rgba(255,255,255,0.92)"
      >
        {rec.id}
      </text>

      {/* System label — can be empty to vary the column */}
      {rec.meta && (
        <text
          x={x + 26}
          y={y + 43}
          fontFamily="JetBrains Mono, monospace"
          fontSize={9}
          letterSpacing="0.22em"
          fill="rgba(255,255,255,0.34)"
        >
          {rec.meta}
        </text>
      )}

      {/* Closure line — the single mono line that carries the record's timeline.
          Coloured amber on the warn card, muted white otherwise. */}
      <text
        x={x + 186}
        y={y + 26}
        fontFamily="JetBrains Mono, monospace"
        fontSize={10.5}
        letterSpacing="0.16em"
        fontWeight={warn ? 500 : 400}
        fill={closureFill}
      >
        {rec.closureDate}
      </text>

      {/* Delta line — present on every record so the column has a consistent
          grid rhythm. ON TARGET / AHEAD / PAST TARGET reads as the same slot. */}
      <text
        x={x + 186}
        y={y + 43}
        fontFamily="JetBrains Mono, monospace"
        fontSize={9}
        letterSpacing="0.18em"
        fill={deltaFill}
      >
        {rec.delta}
      </text>
    </g>
  );
}

function ChaosCard({ card, index }: { card: ChaosCardDef; index: number }) {
  const cx = card.x + card.w / 2;
  const cy = card.y + card.h / 2;
  return (
    <g
      className={`lf-chaos-card lf-chaos-card-${index}`}
      transform={`rotate(${card.rot} ${cx} ${cy})`}
    >
      <rect
        x={card.x}
        y={card.y}
        width={card.w}
        height={card.h}
        rx={5}
        fill="url(#lf-card-fill)"
        stroke={card.critical ? "rgba(248,113,113,0.28)" : "rgba(255,255,255,0.08)"}
        strokeWidth={1}
      />

      {card.critical && (
        <circle
          cx={card.x + card.w - 14}
          cy={card.y + 15}
          r={2.4}
          fill="rgba(248,113,113,0.85)"
        />
      )}

      {/* Tool icon chip */}
      <rect
        x={card.x + 10}
        y={card.y + 6}
        width={13}
        height={13}
        rx={3}
        fill="rgba(255,255,255,0.06)"
        stroke="rgba(255,255,255,0.09)"
        strokeWidth={1}
      />
      <text
        x={card.x + 16.5}
        y={card.y + 15.4}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize={8}
        fontWeight={600}
        letterSpacing="0.02em"
        fill="rgba(255,255,255,0.6)"
      >
        {card.name[0].toUpperCase()}
      </text>

      {/* Tool name (row 1) */}
      <text
        x={card.x + 29}
        y={card.y + 16.5}
        fontFamily="JetBrains Mono, monospace"
        fontSize={9}
        letterSpacing="0.14em"
        fill="rgba(255,255,255,0.48)"
      >
        {card.name.toUpperCase()}
      </text>

      {/* Artifact (row 2) — brighter so it anchors the card */}
      <text
        x={card.x + 14}
        y={card.y + 33}
        fontFamily="JetBrains Mono, monospace"
        fontSize={10.5}
        fontWeight={400}
        letterSpacing="0.01em"
        fill="rgba(255,255,255,0.78)"
      >
        {card.artifact.split(/(CAPA-241)/).map((part, i) =>
          part === "CAPA-241" ? (
            <tspan key={i} fill="rgba(255,255,255,0.94)">
              {part}
            </tspan>
          ) : (
            <tspan key={i}>{part}</tspan>
          )
        )}
      </text>

      {/* Meta (row 3) — the smoking-gun mono line that turns a tidy tool list
          into operational chaos. 17 REPLIES · 4 CC. RENAMED 3× · 2 OWNERS. */}
      <text
        x={card.x + 14}
        y={card.y + 48}
        fontFamily="JetBrains Mono, monospace"
        fontSize={8.5}
        letterSpacing="0.18em"
        fill="rgba(255,255,255,0.38)"
      >
        {card.meta}
      </text>
    </g>
  );
}

function TaxCounter() {
  const cx = SEAM_X;
  const cy = 345;
  // Compact counter that fits inside the 56px seam void. The label
  // "COORDINATION TAX" is already named in the seam's top caption; here we
  // only reveal the accumulating number, tagged in red to match the seam.
  const w = 52;
  const h = 60;
  const top = cy - h / 2;
  return (
    <g className="lf-tax lf-pop">
      <rect
        x={cx - w / 2}
        y={top}
        width={w}
        height={h}
        rx={5}
        fill="rgba(248,113,113,0.06)"
        stroke="rgba(248,113,113,0.32)"
        strokeWidth={1}
      />

      {/* Top label: TAX */}
      <text
        x={cx}
        y={top + 14}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize={8}
        letterSpacing="0.22em"
        fill="rgba(255,255,255,0.5)"
      >
        TAX
      </text>

      {/* Status dot */}
      <circle cx={cx} cy={top + 24} r={2.4} fill="#F87171" />

      {/* The number. Large, mono, red. */}
      <text
        x={cx}
        y={top + 46}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize={15}
        fontWeight={500}
        letterSpacing="0.04em"
        className="lf-tax-num"
        fill="rgba(252,180,180,0.98)"
      >
        +24D
      </text>
    </g>
  );
}
