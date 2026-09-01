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

/* Anchor line: sits inline with the CTA, right-aligned */
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

/* Stage SVG: phase-driven transitions */
.lf-stage-svg { --lf-ease: cubic-bezier(0.22, 1, 0.36, 1); }
.lf-stage-svg .lf-fade { transition: opacity .55s var(--lf-ease); }
.lf-stage-svg .lf-pop { transition: opacity .35s var(--lf-ease), transform .35s var(--lf-ease); transform-box: fill-box; transform-origin: center; }
.lf-stage-svg .lf-path { transition: stroke-dashoffset .9s var(--lf-ease), opacity .45s var(--lf-ease); }

/* ---------- Direction D: Two timelines ---------- */

/* Rails: draw left to right. Top rail in P1, bottom rail in P2. */
.lf-stage-svg .lf-rail {
  stroke-dasharray: 1060;
  stroke-dashoffset: 1060;
  transition: stroke-dashoffset 1.1s var(--lf-ease), opacity .45s var(--lf-ease);
}
.lf-stage-svg[data-phase="1"] .lf-rail-top { stroke-dashoffset: 0; }
.lf-stage-svg[data-phase="2"] .lf-rail-top,
.lf-stage-svg[data-phase="3"] .lf-rail-top { stroke-dashoffset: 0; }
.lf-stage-svg[data-phase="2"] .lf-rail-bottom { stroke-dashoffset: 0; transition-delay: 0.15s; }
.lf-stage-svg[data-phase="3"] .lf-rail-bottom { stroke-dashoffset: 0; }

/* Time axis: draws with the bottom rail. */
.lf-stage-svg .lf-time-axis {
  stroke-dasharray: 1060;
  stroke-dashoffset: 1060;
  transition: stroke-dashoffset 1.1s var(--lf-ease);
}
.lf-stage-svg[data-phase="2"] .lf-time-axis,
.lf-stage-svg[data-phase="3"] .lf-time-axis { stroke-dashoffset: 0; transition-delay: 0.2s; }

.lf-stage-svg .lf-tick {
  opacity: 0;
  transition: opacity .4s var(--lf-ease);
}
.lf-stage-svg[data-phase="2"] .lf-tick,
.lf-stage-svg[data-phase="3"] .lf-tick { opacity: 1; }
.lf-stage-svg[data-phase="2"] .lf-tick-0 { transition-delay: 0.25s; }
.lf-stage-svg[data-phase="2"] .lf-tick-1 { transition-delay: 0.35s; }
.lf-stage-svg[data-phase="2"] .lf-tick-2 { transition-delay: 0.45s; }
.lf-stage-svg[data-phase="2"] .lf-tick-3 { transition-delay: 0.55s; }
.lf-stage-svg[data-phase="2"] .lf-tick-4 { transition-delay: 0.65s; }
.lf-stage-svg[data-phase="2"] .lf-tick-5 { transition-delay: 0.75s; }
.lf-stage-svg[data-phase="2"] .lf-tick-6 { transition-delay: 0.85s; }

/* Rail titles: fade with their rails. */
.lf-stage-svg .lf-rail-title { opacity: 0; transition: opacity .4s var(--lf-ease); }
.lf-stage-svg[data-phase="1"] .lf-rail-title-top,
.lf-stage-svg[data-phase="2"] .lf-rail-title-top,
.lf-stage-svg[data-phase="3"] .lf-rail-title-top { opacity: 1; transition-delay: 0.3s; }
.lf-stage-svg[data-phase="2"] .lf-rail-title-bottom,
.lf-stage-svg[data-phase="3"] .lf-rail-title-bottom { opacity: 1; transition-delay: 0.25s; }

/* MILESTONE CHIPS: top rail. Fade in staggered in P1. */
.lf-stage-svg .lf-milestone {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  transition: opacity .45s var(--lf-ease);
}
.lf-stage-svg[data-phase="1"] .lf-milestone,
.lf-stage-svg[data-phase="2"] .lf-milestone,
.lf-stage-svg[data-phase="3"] .lf-milestone { opacity: 1; }
.lf-stage-svg[data-phase="1"] .lf-milestone-0 { transition-delay: 0.50s; }
.lf-stage-svg[data-phase="1"] .lf-milestone-1 { transition-delay: 0.65s; }
.lf-stage-svg[data-phase="1"] .lf-milestone-2 { transition-delay: 0.80s; }
.lf-stage-svg[data-phase="1"] .lf-milestone-3 { transition-delay: 0.95s; }
.lf-stage-svg[data-phase="1"] .lf-milestone-4 { transition-delay: 1.10s; }

/* COORDINATION CHIPS: bottom rail. Typewriter stagger in P2. */
.lf-stage-svg .lf-coord {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  transition: opacity .5s var(--lf-ease);
}
.lf-stage-svg[data-phase="2"] .lf-coord,
.lf-stage-svg[data-phase="3"] .lf-coord { opacity: 1; }
.lf-stage-svg[data-phase="2"] .lf-coord-0  { transition-delay: 0.10s; }
.lf-stage-svg[data-phase="2"] .lf-coord-1  { transition-delay: 0.15s; }
.lf-stage-svg[data-phase="2"] .lf-coord-2  { transition-delay: 0.20s; }
.lf-stage-svg[data-phase="2"] .lf-coord-3  { transition-delay: 0.25s; }
.lf-stage-svg[data-phase="2"] .lf-coord-4  { transition-delay: 0.30s; }
.lf-stage-svg[data-phase="2"] .lf-coord-5  { transition-delay: 0.35s; }
.lf-stage-svg[data-phase="2"] .lf-coord-6  { transition-delay: 0.40s; }
.lf-stage-svg[data-phase="2"] .lf-coord-7  { transition-delay: 0.45s; }
.lf-stage-svg[data-phase="2"] .lf-coord-8  { transition-delay: 0.50s; }
.lf-stage-svg[data-phase="2"] .lf-coord-9  { transition-delay: 0.55s; }
.lf-stage-svg[data-phase="2"] .lf-coord-10 { transition-delay: 0.60s; }
.lf-stage-svg[data-phase="2"] .lf-coord-11 { transition-delay: 0.65s; }

/* GAP BAND: saturates from faint to visible across phases. */
.lf-stage-svg .lf-gap-band {
  transition: fill .6s var(--lf-ease);
}
.lf-stage-svg[data-phase="1"] .lf-gap-band { fill: rgba(255,255,255,0.02); }
.lf-stage-svg[data-phase="2"] .lf-gap-band { fill: rgba(255,255,255,0.05); }
.lf-stage-svg[data-phase="3"] .lf-gap-band { fill: rgba(255,255,255,0.08); }

.lf-stage-svg .lf-gap-label {
  opacity: 0;
  transition: opacity .5s var(--lf-ease);
}
.lf-stage-svg[data-phase="2"] .lf-gap-label { opacity: 0.55; }
.lf-stage-svg[data-phase="3"] .lf-gap-label { opacity: 0; }

/* TAX COUNTER: phase 3 reveal, docked in gap band. */
.lf-stage-svg .lf-tax {
  opacity: 0;
  transform: translateY(6px) scale(0.96);
  transform-box: fill-box;
  transform-origin: center;
  transition: opacity .55s var(--lf-ease), transform .55s var(--lf-ease);
}
.lf-stage-svg[data-phase="3"] .lf-tax { opacity: 1; transform: translateY(0) scale(1); transition-delay: 0.5s; }
.lf-stage-svg .lf-tax-num { animation: lf-tax-pulse 1.4s ease-in-out infinite; animation-play-state: paused; }
.lf-stage-svg[data-phase="3"] .lf-tax-num { animation-play-state: running; animation-delay: 0.8s; }
@keyframes lf-tax-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}

/* LATE CALLOUT: pins to milestone 5 in P3. */
.lf-stage-svg .lf-late-callout {
  opacity: 0;
  transition: opacity .45s var(--lf-ease);
}
.lf-stage-svg[data-phase="3"] .lf-late-callout { opacity: 1; transition-delay: 0.65s; }

/* Closing caption */
.lf-closing-caption {
  max-width: 1320px;
  margin: 0 auto;
  padding: 32px 24px 80px;
  text-align: center;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.44);
}

@media (prefers-reduced-motion: reduce) {
  .lf-stage-svg .lf-fade,
  .lf-stage-svg .lf-pop,
  .lf-stage-svg .lf-path,
  .lf-stage-svg .lf-milestone,
  .lf-stage-svg .lf-coord,
  .lf-stage-svg .lf-rail,
  .lf-stage-svg .lf-tick,
  .lf-stage-svg .lf-time-axis,
  .lf-stage-svg .lf-tax,
  .lf-stage-svg .lf-late-callout,
  .lf-stage-svg .lf-rail-title,
  .lf-stage-svg .lf-gap-band,
  .lf-stage-svg .lf-gap-label { transition: none !important; }
}
`;

type Phase = 1 | 2 | 3;

const PHASE_MS: Record<Phase, number> = {
  1: 2800,
  2: 3600,
  3: 5200,
};

// SVG viewBox: matches HomeLinearFlow.
const VB_W = 1200;
const VB_H = 720;

// ---------- Direction D geometry ----------

const STAGE_LEFT = 80;
const STAGE_RIGHT = 1140;
const TOP_RAIL_Y = 220;
const BOTTOM_RAIL_Y = 430;
const TIME_AXIS_Y = 510;
const GAP_TOP = 240;
const GAP_BOTTOM = 410;
const GAP_CENTER_Y = 325;

// Day-to-x mapping for the shared time axis.
const DAY_TICKS: Array<{ day: number; x: number; label: string }> = [
  { day: 0,  x: 80,   label: "DAY 0"  },
  { day: 3,  x: 185,  label: "DAY 3"  },
  { day: 7,  x: 320,  label: "DAY 7"  },
  { day: 14, x: 545,  label: "DAY 14" },
  { day: 21, x: 765,  label: "DAY 21" },
  { day: 28, x: 985,  label: "DAY 28" },
  { day: 35, x: 1140, label: "DAY 35" },
];

// ---------- Milestones (top rail, OFFICIAL RECORD) ----------

type MilestoneDef = {
  key: string;
  title: string;
  meta: string;
  cx: number;
  w: number;
  h: number;
  late?: boolean;
};

const MILESTONES: MilestoneDef[] = [
  { key: "open",        title: "Open",        meta: "DAY 0 · QMS",            cx: 80,  w: 132, h: 44 },
  { key: "investigate", title: "Investigate", meta: "DAY 7 · QMS",            cx: 320, w: 132, h: 44 },
  { key: "route",       title: "Route",       meta: "DAY 14 · QMS",           cx: 545, w: 132, h: 44 },
  { key: "approve",     title: "Approve",     meta: "DAY 21 · QMS",           cx: 765, w: 132, h: 44 },
  { key: "close",       title: "Close",       meta: "DAY 28 · QMS · 11D LATE", cx: 985, w: 168, h: 44, late: true },
];

// ---------- Coordination chips (bottom rail) ----------

type CoordDef = {
  key: string;
  tool: string;
  artifact: string;
  latency: string;
  cx: number;
  w: number;
  h: number;
};

const COORD_CHIPS: CoordDef[] = [
  { key: "c1",  tool: "OUTLOOK",  artifact: "Re: CAPA-241",      latency: "+3D", cx: 185, w: 116, h: 36 },
  { key: "c2",  tool: "TEAMS",    artifact: "@quality-ops",      latency: "+5D", cx: 230, w: 104, h: 36 },
  { key: "c3",  tool: "OUTLOOK",  artifact: "FW: Re: CAPA-241",  latency: "+2D", cx: 275, w: 118, h: 36 },
  { key: "c4",  tool: "SLACK",    artifact: "#quality",          latency: "+5D", cx: 380, w: 96,  h: 36 },
  { key: "c5",  tool: "DRIVE",    artifact: "v4-final",          latency: "+7D", cx: 440, w: 96,  h: 36 },
  { key: "c6",  tool: "EXCEL",    artifact: "tracker.xlsx",      latency: "+6D", cx: 520, w: 104, h: 36 },
  { key: "c7",  tool: "MEETING",  artifact: "7 on call",         latency: "+4D", cx: 605, w: 108, h: 36 },
  { key: "c8",  tool: "TEAMS",    artifact: "DM fork",           latency: "+2D", cx: 665, w: 96,  h: 36 },
  { key: "c9",  tool: "OUTLOOK",  artifact: "supplier ping",     latency: "+6D", cx: 735, w: 116, h: 36 },
  { key: "c10", tool: "MEETING",  artifact: "follow-up",         latency: "+3D", cx: 805, w: 108, h: 36 },
  { key: "c11", tool: "DRIVE",    artifact: "v7-final",          latency: "+4D", cx: 875, w: 96,  h: 36 },
  { key: "c12", tool: "EXCEL",    artifact: "v4_FINAL.xlsx",     latency: "+5D", cx: 940, w: 112, h: 36 },
];

export default function HomeTwoTimelines() {
  const [phase, setPhase] = useState<Phase>(1);
  const [painIdx, setPainIdx] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    document.title = "Unifize · One event. Two timelines.";
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
          <Link to="/two-timelines" className="lf-nav-logo" aria-label="Unifize">
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
          One event.<br />
          <span className="lf-hero-accent">Two timelines.</span>
        </h1>
        <p className="lf-hero-subtitle">
          The record tells the audit story. Coordination tells the real one.
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
            <TwoTimelinesStage phase={phase} />
          </div>
        </div>
      </div>

      {/* Closing caption */}
      <div className="lf-closing-caption">
        One record closed in twenty-eight days.&nbsp;&nbsp;The work took two of them.
      </div>
    </div>
  );
}

/* ---------------- STAGE ---------------- */

function TwoTimelinesStage({ phase }: { phase: Phase }) {
  return (
    <svg
      className="lf-stage-svg"
      data-phase={phase}
      viewBox={`0 138 ${VB_W} 402`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Two timelines for a single CAPA event. The top rail shows the official record with five clean milestones from Open to Close across twenty-eight days. The bottom rail shows the real coordination work: twelve tight chips of Outlook, Teams, Slack, Drive, Excel and meetings that pile up between them. The gap between the two rails is the coordination tax."
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
        <linearGradient id="lf-capa" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7C8BF0" />
          <stop offset="1" stopColor="#5E6AD2" />
        </linearGradient>
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

      {/* Gap band: shaded strip between the two rails */}
      <rect
        className="lf-gap-band"
        x={STAGE_LEFT}
        y={GAP_TOP}
        width={STAGE_RIGHT - STAGE_LEFT}
        height={GAP_BOTTOM - GAP_TOP}
        fill="rgba(255,255,255,0.02)"
      />

      {/* Gap band label: visible in P1/P2, fades before TaxCounter appears */}
      <text
        className="lf-gap-label"
        x={VB_W / 2}
        y={GAP_CENTER_Y + 4}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize={10.5}
        letterSpacing="0.24em"
        fill="rgba(255,255,255,0.52)"
      >
        COORDINATION TAX
      </text>

      {/* Top rail title */}
      <text
        className="lf-rail-title lf-rail-title-top"
        x={STAGE_LEFT}
        y={198}
        fontFamily="JetBrains Mono, monospace"
        fontSize={9.5}
        letterSpacing="0.24em"
        fill="rgba(255,255,255,0.6)"
      >
        OFFICIAL RECORD · CAPA-241
      </text>

      {/* Top rail rule */}
      <line
        className="lf-rail lf-rail-top"
        x1={STAGE_LEFT}
        y1={TOP_RAIL_Y}
        x2={STAGE_RIGHT}
        y2={TOP_RAIL_Y}
        stroke="rgba(255,255,255,0.22)"
        strokeWidth={1}
      />

      {/* Milestone chips on top rail */}
      <g>
        {MILESTONES.map((m, i) => (
          <MilestoneChip key={m.key} milestone={m} index={i} />
        ))}
      </g>

      {/* LATE callout: pinned above milestone 5 (Close) in P3 */}
      <g className="lf-late-callout">
        {(() => {
          const m = MILESTONES[4];
          const calloutX = m.cx + m.w / 2 + 12;
          const calloutY = TOP_RAIL_Y - 28;
          return (
            <>
              <line
                x1={m.cx + m.w / 2 - 4}
                y1={TOP_RAIL_Y - m.h / 2 - 4}
                x2={calloutX - 6}
                y2={calloutY + 4}
                stroke="rgba(248,113,113,0.5)"
                strokeWidth={1}
                strokeDasharray="2 3"
              />
              <text
                x={calloutX}
                y={calloutY + 8}
                fontFamily="JetBrains Mono, monospace"
                fontSize={10}
                letterSpacing="0.18em"
                fill="rgba(248,113,113,0.95)"
              >
                11D LATE
              </text>
            </>
          );
        })()}
      </g>

      {/* Bottom rail title */}
      <text
        className="lf-rail-title lf-rail-title-bottom"
        x={STAGE_LEFT}
        y={408}
        fontFamily="JetBrains Mono, monospace"
        fontSize={9.5}
        letterSpacing="0.24em"
        fill="rgba(255,255,255,0.6)"
      >
        COORDINATION · CAPA-241
      </text>

      {/* Bottom rail rule */}
      <line
        className="lf-rail lf-rail-bottom"
        x1={STAGE_LEFT}
        y1={BOTTOM_RAIL_Y}
        x2={STAGE_RIGHT}
        y2={BOTTOM_RAIL_Y}
        stroke="rgba(255,255,255,0.22)"
        strokeWidth={1}
      />

      {/* Coordination chips on bottom rail */}
      <g>
        {COORD_CHIPS.map((c, i) => (
          <CoordinationChip key={c.key} chip={c} index={i} />
        ))}
      </g>

      {/* Time axis rule */}
      <line
        className="lf-time-axis"
        x1={STAGE_LEFT}
        y1={TIME_AXIS_Y}
        x2={STAGE_RIGHT}
        y2={TIME_AXIS_Y}
        stroke="rgba(255,255,255,0.14)"
        strokeWidth={1}
      />

      {/* Ticks and labels */}
      <g>
        {DAY_TICKS.map((t, i) => (
          <g key={t.label} className={`lf-tick lf-tick-${i}`}>
            <line
              x1={t.x}
              y1={TIME_AXIS_Y - 4}
              x2={t.x}
              y2={TIME_AXIS_Y + 4}
              stroke="rgba(255,255,255,0.32)"
              strokeWidth={1}
            />
            <text
              x={t.x}
              y={528}
              textAnchor="middle"
              fontFamily="JetBrains Mono, monospace"
              fontSize={9}
              letterSpacing="0.22em"
              fill="rgba(255,255,255,0.44)"
            >
              {t.label}
            </text>
          </g>
        ))}
      </g>

      {/* Tax counter: docked inside gap band, P3 reveal */}
      <TaxCounter />
    </svg>
  );
}

/* ---------------- Pieces ---------------- */

function MilestoneChip({ milestone, index }: { milestone: MilestoneDef; index: number }) {
  const { title, meta, cx, w, h, late } = milestone;
  // cx is the chip's visual anchor on the rail. For milestone 1 (Open) we
  // left-align flush to STAGE_LEFT; for all others, we center horizontally on cx.
  const x = index === 0 ? STAGE_LEFT : cx - w / 2;
  const y = TOP_RAIL_Y - h / 2;
  const titleFill = late ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.9)";

  return (
    <g className={`lf-milestone lf-milestone-${index}`}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={6}
        fill="url(#lf-card-fill)"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth={1}
      />
      {late && (
        <circle
          cx={x + w - 10}
          cy={y + 10}
          r={2.6}
          fill="rgba(248,113,113,1)"
        />
      )}
      <text
        x={x + 14}
        y={y + 19}
        fontFamily="Inter, sans-serif"
        fontSize={14}
        fontWeight={500}
        fill={titleFill}
      >
        {title}
      </text>
      <text
        x={x + 14}
        y={y + 34}
        fontFamily="JetBrains Mono, monospace"
        fontSize={9}
        letterSpacing="0.18em"
        fill="rgba(255,255,255,0.5)"
      >
        {meta}
      </text>
    </g>
  );
}

function CoordinationChip({ chip, index }: { chip: CoordDef; index: number }) {
  const { tool, artifact, latency, cx, w, h } = chip;
  const x = cx - w / 2;
  const y = BOTTOM_RAIL_Y + 20 - h / 2; // chip centered vertically on y = 450
  return (
    <g className={`lf-coord lf-coord-${index}`}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={5}
        fill="url(#lf-card-fill)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth={1}
      />
      <text
        x={x + 8}
        y={y + 14}
        fontFamily="JetBrains Mono, monospace"
        fontSize={9}
        letterSpacing="0.2em"
        fill="rgba(255,255,255,0.62)"
      >
        {tool}
      </text>
      <text
        x={x + 8}
        y={y + 28}
        fontFamily="JetBrains Mono, monospace"
        fontSize={9}
        letterSpacing="0.02em"
        fill="rgba(255,255,255,0.82)"
      >
        {artifact}
      </text>
      <text
        x={x + w - 8}
        y={y + 28}
        textAnchor="end"
        fontFamily="JetBrains Mono, monospace"
        fontSize={9}
        letterSpacing="0.12em"
        fill="rgba(255,255,255,0.52)"
      >
        {latency}
      </text>
    </g>
  );
}

function TaxCounter() {
  const cx = VB_W / 2;
  const cy = GAP_CENTER_Y;
  const w = 236;
  const h = 32;
  return (
    <g className="lf-tax lf-pop">
      <rect
        x={cx - w / 2}
        y={cy - h / 2}
        width={w}
        height={h}
        rx={6}
        fill="url(#lf-card-fill)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth={1}
      />
      <circle cx={cx - w / 2 + 14} cy={cy} r={2.4} fill="#F87171" />
      <text
        x={cx - w / 2 + 26}
        y={cy + 3.5}
        fontFamily="JetBrains Mono, monospace"
        fontSize={10}
        letterSpacing="0.18em"
      >
        <tspan className="lf-tax-num" fill="rgba(255,255,255,0.96)">+24D</tspan>
        <tspan dx="10" fill="rgba(255,255,255,0.58)">ACCUMULATED</tspan>
      </text>
    </g>
  );
}
