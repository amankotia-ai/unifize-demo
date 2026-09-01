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

/* Anchor line . sits inline with the CTA, right-aligned */
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

/* Stage SVG . phase-driven transitions */
.lf-stage-svg { --lf-ease: cubic-bezier(0.22, 1, 0.36, 1); }
.lf-stage-svg .lf-fade { transition: opacity .55s var(--lf-ease); }
.lf-stage-svg .lf-pop { transition: opacity .35s var(--lf-ease), transform .35s var(--lf-ease); transform-box: fill-box; transform-origin: center; }
.lf-stage-svg .lf-path { transition: stroke-dashoffset .9s var(--lf-ease), opacity .45s var(--lf-ease); }

/* CHAOS CARDS . fade in for phase 2, live through 3 */
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

/* DEPTH GAUGE . scale labels saturate as cards reveal */
.lf-stage-svg .lf-depth-tick {
  transition: fill .5s var(--lf-ease);
  fill: rgba(255,255,255,0.22);
}
.lf-stage-svg[data-phase="2"] .lf-depth-tick-0 { fill: rgba(255,255,255,0.65); transition-delay: 0.12s; }
.lf-stage-svg[data-phase="2"] .lf-depth-tick-1 { fill: rgba(255,255,255,0.55); transition-delay: 0.26s; }
.lf-stage-svg[data-phase="2"] .lf-depth-tick-2 { fill: rgba(255,255,255,0.5); transition-delay: 0.40s; }
.lf-stage-svg[data-phase="2"] .lf-depth-tick-3 { fill: rgba(255,255,255,0.42); transition-delay: 0.54s; }
.lf-stage-svg[data-phase="2"] .lf-depth-tick-4 { fill: rgba(255,255,255,0.32); transition-delay: 0.68s; }
.lf-stage-svg[data-phase="3"] .lf-depth-tick-0 { fill: rgba(255,255,255,0.75); }
.lf-stage-svg[data-phase="3"] .lf-depth-tick-1 { fill: rgba(255,255,255,0.72); }
.lf-stage-svg[data-phase="3"] .lf-depth-tick-2 { fill: rgba(255,255,255,0.72); transition-delay: 0.12s; }
.lf-stage-svg[data-phase="3"] .lf-depth-tick-3 { fill: rgba(255,255,255,0.7); transition-delay: 0.22s; }
.lf-stage-svg[data-phase="3"] .lf-depth-tick-4 { fill: rgba(255,255,255,0.68); transition-delay: 0.34s; }

.lf-stage-svg .lf-depth-tick-mark {
  transition: stroke .5s var(--lf-ease);
  stroke: rgba(255,255,255,0.18);
}
.lf-stage-svg[data-phase="3"] .lf-depth-tick-mark { stroke: rgba(255,255,255,0.46); }

/* SURFACE CARD . the quiet record */
.lf-stage-svg .lf-surface-card { opacity: 1; }

/* WATERLINE . sharpens through phases */
.lf-stage-svg .lf-waterline-rule {
  transition: stroke .55s var(--lf-ease);
  stroke: rgba(255,255,255,0.28);
}
.lf-stage-svg[data-phase="3"] .lf-waterline-rule { stroke: rgba(255,255,255,0.38); }

.lf-stage-svg .lf-depth-wash {
  transition: opacity .7s var(--lf-ease);
  opacity: 0.55;
}
.lf-stage-svg[data-phase="2"] .lf-depth-wash { opacity: 0.85; }
.lf-stage-svg[data-phase="3"] .lf-depth-wash { opacity: 1; }

/* Latency stamps . phase 3 accumulation */
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

/* Tax counter . phase 3 reveal */
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

/* Status pulse */
.lf-stage-svg .lf-entry-dot { animation: lf-entry-pulse 1.6s ease-in-out infinite; }
@keyframes lf-entry-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* Closing caption under stage */
.lf-closing-caption {
  max-width: 1320px;
  margin: 0 auto;
  padding: 28px 24px 72px;
  text-align: center;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 12px;
  letter-spacing: 0.16em;
  color: rgba(255,255,255,0.46);
  text-transform: uppercase;
}

@media (prefers-reduced-motion: reduce) {
  .lf-stage-svg .lf-entry-dot { animation: none; }
  .lf-stage-svg .lf-fade,
  .lf-stage-svg .lf-pop,
  .lf-stage-svg .lf-path,
  .lf-stage-svg .lf-chaos-card,
  .lf-stage-svg .lf-depth-tick,
  .lf-stage-svg .lf-depth-tick-mark,
  .lf-stage-svg .lf-depth-wash,
  .lf-stage-svg .lf-waterline-rule { transition: none !important; }
}
`;

type Phase = 1 | 2 | 3;

const PHASE_MS: Record<Phase, number> = {
  1: 2800,
  2: 3600,
  3: 5200,
};

// SVG viewBox . shared with HomeLinearFlow
const VB_W = 1200;
const VB_H = 720;

// WATERLINE . the horizontal rule that divides the scene
const WATERLINE_Y = 280;
const WATERLINE_PAD_X = 40;

// SURFACE CARD . the quiet record above the line
const SURFACE = { x: 470, y: 200, w: 260, h: 60 };

// DEPTH GAUGE . vertical mono scale in the left margin
const DEPTH_GAUGE_X = 40;
const DEPTH_HEADER_Y = 310;
const DEPTH_TICKS: Array<{ y: number; label: string }> = [
  { y: 335, label: "+0D" },
  { y: 385, label: "+5D" },
  { y: 430, label: "+11D" },
  { y: 480, label: "+18D" },
  { y: 525, label: "+24D" },
];

// CHAOS CARDS . reused below the waterline with compressed vertical spread.
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

const CHAOS_CARDS: ChaosCardDef[] = [
  {
    key: "outlook",
    name: "Outlook",
    artifact: "Re: CAPA-241",
    meta: "17 REPLIES · 4 CC",
    latency: "+3D",
    x: 336,
    y: 320,
    w: 224,
    h: 56,
    rot: 0,
  },
  {
    key: "teams",
    name: "Teams",
    artifact: "CAPA-241 · @quality-ops",
    meta: "4 THREADS · 2 UNREAD",
    latency: "+11D",
    x: 592,
    y: 320,
    w: 224,
    h: 56,
    rot: 0,
    critical: true,
  },
  {
    key: "outlook-fw",
    name: "Outlook",
    artifact: "FW: Re: CAPA-241",
    meta: "17 CC · 2 BOUNCED",
    latency: "+2D",
    x: 336,
    y: 375,
    w: 224,
    h: 56,
    rot: 0,
  },
  {
    key: "slack",
    name: "Slack",
    artifact: "#quality · CAPA-241",
    meta: "22 MSG · DM FORK",
    latency: "+5D",
    x: 592,
    y: 375,
    w: 224,
    h: 56,
    rot: 0,
  },
  {
    key: "excel-v4",
    name: "Excel",
    artifact: "CAPA-241_v4_FINAL.xlsx",
    meta: "MERGED 2 TABS",
    latency: "+5D",
    x: 336,
    y: 430,
    w: 224,
    h: 56,
    rot: 0,
  },
  {
    key: "drive",
    name: "Drive",
    artifact: "CAPA-241/v7-final",
    meta: "3 COPIES · 2 OWNERS",
    latency: "+7D",
    x: 592,
    y: 430,
    w: 224,
    h: 56,
    rot: 0,
  },
  {
    key: "excel",
    name: "Excel",
    artifact: "CAPA-241_tracker.xlsx",
    meta: "RENAMED 3× · 2 OWNERS",
    latency: "+6D",
    x: 336,
    y: 480,
    w: 224,
    h: 56,
    rot: 0,
  },
  {
    key: "meeting",
    name: "Meeting",
    artifact: "CAPA-241 · 7 on call",
    meta: "NO NOTES · VERBAL YES",
    latency: "+4D",
    x: 592,
    y: 480,
    w: 224,
    h: 56,
    rot: 0,
  },
];

export default function HomeIceberg() {
  const [phase, setPhase] = useState<Phase>(1);
  const [painIdx, setPainIdx] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    document.title = "Unifize · What closed on paper is not what it cost";
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
          <Link to="/iceberg" className="lf-nav-logo" aria-label="Unifize">
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
          What closed on paper.<br />
          <span className="lf-hero-accent">Is not what it cost.</span>
        </h1>
        <p className="lf-hero-subtitle">
          The record says done. The work that produced it is still on someone else's screen.
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
            <IcebergStage phase={phase} />
          </div>
        </div>
      </div>

      {/* Closing mono caption */}
      <p className="lf-closing-caption">
        The record closed in a week.&nbsp;&nbsp;The coordination took three.
      </p>
    </div>
  );
}

/* ---------------- STAGE ---------------- */

function IcebergStage({ phase }: { phase: Phase }) {
  return (
    <svg
      className="lf-stage-svg"
      data-phase={phase}
      viewBox={`0 138 ${VB_W} 402`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="An iceberg view of a CAPA closure. Above the waterline, a single quiet record card shows CAPA-241 marked closed on record. Below the waterline, eight chaos cards from Outlook, Teams, Slack, Excel, Drive and meetings scatter across a dim depth field, with a vertical depth gauge on the left counting the days of coordination that went into producing that clean record."
    >
      <defs>
        <pattern id="lf-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.6" fill="rgba(255,255,255,0.05)" />
        </pattern>
        <pattern id="lf-depth-grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.75" fill="rgba(255,255,255,0.055)" />
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
        <linearGradient id="lf-surface-wash" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="rgba(255,255,255,0.04)" />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <linearGradient id="lf-depth-wash" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(0,0,0,0.18)" />
          <stop offset="1" stopColor="rgba(0,0,0,0.45)" />
        </linearGradient>
        <radialGradient id="lf-depth-mask-grad" cx="0.5" cy="0" r="1">
          <stop offset="0" stopColor="white" stopOpacity="0.35" />
          <stop offset="0.6" stopColor="white" stopOpacity="0.75" />
          <stop offset="1" stopColor="white" stopOpacity="1" />
        </radialGradient>
        <mask id="lf-depth-mask">
          <rect x="0" y={WATERLINE_Y} width={VB_W} height={VB_H - WATERLINE_Y} fill="url(#lf-depth-mask-grad)" />
        </mask>
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

      {/* Subtle dot grid backdrop (entire stage) */}
      <rect
        x={0}
        y={0}
        width={VB_W}
        height={VB_H}
        fill="url(#lf-grid)"
        mask="url(#lf-grid-fade)"
      />

      {/* Surface wash . lighter tint above the waterline */}
      <rect
        x={0}
        y={WATERLINE_Y - 120}
        width={VB_W}
        height={120}
        fill="url(#lf-surface-wash)"
      />

      {/* Depth wash . darkens with depth, below the waterline */}
      <rect
        className="lf-depth-wash"
        x={0}
        y={WATERLINE_Y}
        width={VB_W}
        height={280}
        fill="url(#lf-depth-wash)"
      />

      {/* Depth caustic dot pattern . only below the waterline, denser with depth */}
      <rect
        x={0}
        y={WATERLINE_Y}
        width={VB_W}
        height={280}
        fill="url(#lf-depth-grid)"
        mask="url(#lf-depth-mask)"
      />

      {/* Waterline rule */}
      <line
        className="lf-waterline-rule"
        x1={WATERLINE_PAD_X}
        x2={VB_W - WATERLINE_PAD_X}
        y1={WATERLINE_Y}
        y2={WATERLINE_Y}
        strokeWidth={1}
      />

      {/* Waterline labels . four mono captions flanking the rule */}
      <text
        x={WATERLINE_PAD_X}
        y={270}
        fontFamily="JetBrains Mono, monospace"
        fontSize={9}
        letterSpacing="0.24em"
        fill="rgba(255,255,255,0.44)"
      >
        WHAT THE AUDITOR SEES
      </text>
      <text
        x={WATERLINE_PAD_X}
        y={296}
        fontFamily="JetBrains Mono, monospace"
        fontSize={9}
        letterSpacing="0.24em"
        fill="rgba(255,255,255,0.5)"
      >
        WHAT ACTUALLY HAPPENED
      </text>
      <text
        x={VB_W - WATERLINE_PAD_X}
        y={270}
        textAnchor="end"
        fontFamily="JetBrains Mono, monospace"
        fontSize={9}
        letterSpacing="0.24em"
        fill="rgba(255,255,255,0.44)"
      >
        CLOSED · 11D AFTER TARGET
      </text>
      <text
        x={VB_W - WATERLINE_PAD_X}
        y={296}
        textAnchor="end"
        fontFamily="JetBrains Mono, monospace"
        fontSize={9}
        letterSpacing="0.24em"
        fill="rgba(255,255,255,0.62)"
      >
        24D OF COORDINATION
      </text>

      {/* Surface card . the quiet record above the waterline */}
      <SurfaceCard />

      {/* Depth gauge . vertical mono scale in the left margin */}
      <DepthGauge />

      {/* Chaos cards . scattered below the waterline */}
      <g>
        {CHAOS_CARDS.map((c, i) => (
          <ChaosCard key={c.key} card={c} index={i} />
        ))}
      </g>

      {/* Connector latency labels . Vercel-style annotations under each chaos card */}
      <g>
        {CHAOS_CARDS.map((c, i) => {
          const tx = c.x + c.w - 12;
          const ty = c.y + c.h + 12;
          return (
            <text
              key={`latency-${i}`}
              className={`lf-latency lf-latency-${i}`}
              x={tx}
              y={ty}
              textAnchor="end"
              fontFamily="JetBrains Mono, monospace"
              fontSize={9}
              letterSpacing="0.14em"
              fill="rgba(255,255,255,0.52)"
            >
              {c.latency}
            </text>
          );
        })}
      </g>

      {/* Tax counter . phase 3 */}
      <TaxCounter />
    </svg>
  );
}

/* ---------------- Pieces ---------------- */

function SurfaceCard() {
  const midY = SURFACE.y + SURFACE.h / 2;

  return (
    <g className="lf-surface-card">
      {/* Card body */}
      <rect
        x={SURFACE.x}
        y={SURFACE.y}
        width={SURFACE.w}
        height={SURFACE.h}
        rx={6}
        fill="url(#lf-card-fill)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth={1}
      />

      {/* Title row: CAPA-241 */}
      <text
        x={SURFACE.x + 16}
        y={SURFACE.y + 24}
        fontFamily="Inter, sans-serif"
        fontSize={15}
        fontWeight={500}
        fill="rgba(255,255,255,0.94)"
      >
        CAPA-241
      </text>

      {/* Status pill . right-aligned on the title row */}
      {(() => {
        const pillW = 138;
        const pillH = 18;
        const pillX = SURFACE.x + SURFACE.w - pillW - 12;
        const pillY = SURFACE.y + 12;
        return (
          <g>
            <rect
              x={pillX}
              y={pillY}
              width={pillW}
              height={pillH}
              rx={9}
              fill="rgba(16,185,129,0.18)"
              stroke="rgba(16,185,129,0.55)"
              strokeWidth={1}
            />
            <text
              x={pillX + pillW / 2}
              y={pillY + pillH / 2 + 3.2}
              textAnchor="middle"
              fontFamily="JetBrains Mono, monospace"
              fontSize={9.5}
              letterSpacing="0.18em"
              fill="rgba(209,250,229,0.92)"
            >
              CLOSED · ON RECORD
            </text>
          </g>
        );
      })()}

      {/* Meta line */}
      <text
        x={SURFACE.x + 16}
        y={SURFACE.y + SURFACE.h - 14}
        fontFamily="JetBrains Mono, monospace"
        fontSize={10}
        letterSpacing="0.18em"
        fill="rgba(255,255,255,0.5)"
      >
        SIGNED BY 3 · QMS UPDATED
      </text>
      {/* Hidden reference to midY keeps math intentional without cluttering the card */}
      <title>{`surface card center y=${midY}`}</title>
    </g>
  );
}

function DepthGauge() {
  return (
    <g>
      {/* Vertical rule */}
      <line
        x1={DEPTH_GAUGE_X}
        x2={DEPTH_GAUGE_X}
        y1={DEPTH_HEADER_Y}
        y2={530}
        stroke="rgba(255,255,255,0.18)"
        strokeWidth={1}
      />

      {/* DEPTH header */}
      <text
        x={DEPTH_GAUGE_X + 10}
        y={DEPTH_HEADER_Y + 3.5}
        fontFamily="JetBrains Mono, monospace"
        fontSize={9}
        letterSpacing="0.24em"
        fill="rgba(255,255,255,0.44)"
      >
        DEPTH
      </text>

      {/* Tick marks and scale labels */}
      {DEPTH_TICKS.map((t, i) => (
        <g key={`tick-${i}`}>
          <line
            className={`lf-depth-tick-mark lf-depth-tick-mark-${i}`}
            x1={DEPTH_GAUGE_X - 3}
            x2={DEPTH_GAUGE_X + 3}
            y1={t.y}
            y2={t.y}
            strokeWidth={1}
          />
          <text
            className={`lf-depth-tick lf-depth-tick-${i}`}
            x={DEPTH_GAUGE_X + 10}
            y={t.y + 3.5}
            fontFamily="JetBrains Mono, monospace"
            fontSize={9}
            letterSpacing="0.18em"
          >
            {t.label}
          </text>
        </g>
      ))}
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
        rx={6}
        fill="url(#lf-card-fill)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth={1}
      />

      {card.critical && (
        <circle
          className="lf-entry-dot"
          cx={card.x + card.w - 14}
          cy={card.y + 15}
          r={2.4}
          fill="rgba(248,113,113,0.85)"
        />
      )}

      <rect
        x={card.x + 10}
        y={card.y + 8}
        width={14}
        height={14}
        rx={3}
        fill="rgba(255,255,255,0.05)"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth={1}
      />
      <text
        x={card.x + 17}
        y={card.y + 18.2}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize={8.5}
        fontWeight={600}
        letterSpacing="0.02em"
        fill="rgba(255,255,255,0.72)"
      >
        {card.name[0].toUpperCase()}
      </text>
      <text
        x={card.x + 30}
        y={card.y + 20}
        fontFamily="JetBrains Mono, monospace"
        fontSize={9.5}
        letterSpacing="0.2em"
        fill="rgba(255,255,255,0.56)"
      >
        {card.name.toUpperCase()}
      </text>

      <text
        x={card.x + 14}
        y={card.y + 42}
        fontFamily="JetBrains Mono, monospace"
        fontSize={11}
        fontWeight={400}
        letterSpacing="0.01em"
        fill="rgba(255,255,255,0.72)"
      >
        {card.artifact.split(/(CAPA-241)/).map((part, i) =>
          part === "CAPA-241" ? (
            <tspan key={i} fill="rgba(255,255,255,0.92)">
              {part}
            </tspan>
          ) : (
            <tspan key={i}>{part}</tspan>
          )
        )}
      </text>
    </g>
  );
}

function TaxCounter() {
  const cx = VB_W / 2;
  const cy = 560;
  const w = 204;
  const h = 30;
  return (
    <g className="lf-tax lf-pop">
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
