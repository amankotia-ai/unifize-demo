import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "motion/react";

// Anchor line first, then the rest cycle through.
const PAIN_POINTS = [
  "Design review closed on a verbal yes.",
  "Investigation still open from last quarter.",
  "Change order stuck on four inboxes.",
  "Supplier CAR chased across three mailboxes.",
  "Batch released before sign-offs landed.",
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

const STYLES = `
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

/* Theme toggle — icon-only pill in nav */
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
.lf-nav-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(124,139,240,0.6);
}

/* Anchor line — sits inline with the CTA, right-aligned */
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

/* STAGE */
.lf-stage-wrap {
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 24px 24px;
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
    scrollbar-color: rgba(var(--lf-fg),0.2) transparent;
    scroll-snap-type: x mandatory;
    border-radius: 12px;
  }
  .lf-stage-frame {
    min-width: 980px;
    scroll-snap-align: start;
  }
}
.lf-stage-scroll { position: relative; border-radius: 12px; }
.lf-stage-frame {
  position: relative;
  border-radius: 12px;
  overflow: visible;
  background:
    radial-gradient(ellipse 78% 100% at 50% 108%, rgba(94, 106, 210, 0.45) 0%, rgba(94, 106, 210, 0.18) 40%, transparent 72%),
    var(--lf-bg);
  aspect-ratio: 3 / 1;
}
.lf-root[data-theme="light"] .lf-stage-frame {
  background:
    radial-gradient(ellipse 78% 100% at 50% 108%, rgba(94, 106, 210, 0.18) 0%, rgba(94, 106, 210, 0.07) 45%, transparent 74%),
    var(--lf-bg);
}
.lf-stage-frame svg {
  width: 100%; height: 100%; display: block;
}

/* Stage SVG — phase-driven transitions */
.lf-stage-svg { --lf-ease: cubic-bezier(0.22, 1, 0.36, 1); }
.lf-stage-svg .lf-path { transition: stroke-dashoffset .9s var(--lf-ease), opacity .5s var(--lf-ease); }

/* CHAOS CARDS — fade in for phase 2, live through 3 */
.lf-stage-svg .lf-chaos-card {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  transition: opacity .5s var(--lf-ease);
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

/* Shard lines — entry → chaos cards (phase 2). Dash rhythm 2 4 unified with
   the cluster outline + reply/closure paths so every dashed mark in the
   diagram shares the same period. Vercel-style: one dash, used everywhere. */
.lf-stage-svg .lf-shard-path {
  stroke-dasharray: 2 4;
  opacity: 0;
  transition: opacity 0.5s var(--lf-ease);
}
.lf-stage-svg[data-phase="2"] .lf-shard-path {
  opacity: 0.75;
}
.lf-stage-svg[data-phase="3"] .lf-shard-path {
  opacity: 0.42;
}
/* Static dashed lines — Vercel-style. The previous lf-shard-flow animation
   added ambient motion that drew the eye away from semantic warnings;
   static dashes let the heat anchors do the signaling. */
.lf-stage-svg[data-phase="2"] .lf-shard-path-0 { transition-delay: 0.03s; }
.lf-stage-svg[data-phase="2"] .lf-shard-path-1 { transition-delay: 0.13s; }
.lf-stage-svg[data-phase="2"] .lf-shard-path-2 { transition-delay: 0.23s; }
.lf-stage-svg[data-phase="2"] .lf-shard-path-3 { transition-delay: 0.33s; }
.lf-stage-svg[data-phase="2"] .lf-shard-path-4 { transition-delay: 0.43s; }
.lf-stage-svg[data-phase="2"] .lf-shard-path-5 { transition-delay: 0.53s; }
.lf-stage-svg[data-phase="2"] .lf-shard-path-6 { transition-delay: 0.63s; }
.lf-stage-svg[data-phase="2"] .lf-shard-path-7 { transition-delay: 0.73s; }

/* Node ports — fade in with shards, stay visible through phase 3 */
.lf-stage-svg .lf-port { opacity: 0; transition: opacity .5s var(--lf-ease); }
.lf-stage-svg[data-phase="2"] .lf-port,
.lf-stage-svg[data-phase="3"] .lf-port { opacity: 1; }
.lf-stage-svg[data-phase="2"] .lf-port-0 { transition-delay: 0.10s; }
.lf-stage-svg[data-phase="2"] .lf-port-1 { transition-delay: 0.20s; }
.lf-stage-svg[data-phase="2"] .lf-port-2 { transition-delay: 0.30s; }
.lf-stage-svg[data-phase="2"] .lf-port-3 { transition-delay: 0.40s; }
.lf-stage-svg[data-phase="2"] .lf-port-4 { transition-delay: 0.50s; }
.lf-stage-svg[data-phase="2"] .lf-port-5 { transition-delay: 0.60s; }
.lf-stage-svg[data-phase="2"] .lf-port-6 { transition-delay: 0.70s; }
.lf-stage-svg[data-phase="2"] .lf-port-7 { transition-delay: 0.80s; }

/* Closure-source ports — appear in phase 3 with the closure rollup paths
   they anchor. Vercel-style: every connector docks at a visible socket on
   both ends, never dissolving into a card border. */
.lf-stage-svg .lf-port-out { opacity: 0; transition: opacity .5s var(--lf-ease); }
.lf-stage-svg[data-phase="3"] .lf-port-out { opacity: 1; }
.lf-stage-svg[data-phase="3"] .lf-port-out-0 { transition-delay: 0.62s; }
.lf-stage-svg[data-phase="3"] .lf-port-out-1 { transition-delay: 0.68s; }
.lf-stage-svg[data-phase="3"] .lf-port-out-2 { transition-delay: 0.74s; }
.lf-stage-svg[data-phase="3"] .lf-port-out-3 { transition-delay: 0.80s; }

/* Reply-chain cross-talk between chaos cards — phase 3. Same 2 4 dash as
   shard/closure/cluster outline. */
.lf-stage-svg .lf-reply-path {
  stroke-dasharray: 2 4;
  opacity: 0;
  transition: opacity 0.5s var(--lf-ease);
}
.lf-stage-svg[data-phase="3"] .lf-reply-path { opacity: 0.68; }
.lf-stage-svg[data-phase="3"] .lf-reply-path-0 { transition-delay: 0.10s; }
.lf-stage-svg[data-phase="3"] .lf-reply-path-1 { transition-delay: 0.18s; }
.lf-stage-svg[data-phase="3"] .lf-reply-path-2 { transition-delay: 0.26s; }
.lf-stage-svg[data-phase="3"] .lf-reply-path-3 { transition-delay: 0.34s; }
.lf-stage-svg[data-phase="3"] .lf-reply-path-4 { transition-delay: 0.42s; }
.lf-stage-svg[data-phase="3"] .lf-reply-path-5 { transition-delay: 0.50s; }
.lf-stage-svg[data-phase="3"] .lf-reply-path-6 { transition-delay: 0.58s; }

/* Closure rollup — right-column cards funnel into Closure (phase 3). Same
   2 4 dash as shard/reply/cluster outline. */
.lf-stage-svg .lf-closure-path {
  stroke-dasharray: 2 4;
  opacity: 0;
  transition: opacity 0.5s var(--lf-ease);
}
.lf-stage-svg[data-phase="3"] .lf-closure-path {
  opacity: 0.5;
}
.lf-stage-svg[data-phase="3"] .lf-closure-path-0 { transition-delay: 0.66s; }
.lf-stage-svg[data-phase="3"] .lf-closure-path-1 { transition-delay: 0.72s; }
.lf-stage-svg[data-phase="3"] .lf-closure-path-2 { transition-delay: 0.78s; }
.lf-stage-svg[data-phase="3"] .lf-closure-path-3 { transition-delay: 0.84s; }

/* Latency stamps — phase 3 accumulation */
.lf-stage-svg .lf-latency { opacity: 0; transition: opacity .5s var(--lf-ease); }
.lf-stage-svg[data-phase="3"] .lf-latency { opacity: 1; }
.lf-stage-svg[data-phase="3"] .lf-latency-0 { transition-delay: 0.18s; }
.lf-stage-svg[data-phase="3"] .lf-latency-1 { transition-delay: 0.28s; }
.lf-stage-svg[data-phase="3"] .lf-latency-2 { transition-delay: 0.38s; }
.lf-stage-svg[data-phase="3"] .lf-latency-3 { transition-delay: 0.48s; }
.lf-stage-svg[data-phase="3"] .lf-latency-4 { transition-delay: 0.58s; }
.lf-stage-svg[data-phase="3"] .lf-latency-5 { transition-delay: 0.68s; }
.lf-stage-svg[data-phase="3"] .lf-latency-6 { transition-delay: 0.78s; }
.lf-stage-svg[data-phase="3"] .lf-latency-7 { transition-delay: 0.88s; }

/* Tax counter — phase 3 reveal */
.lf-stage-svg .lf-tax {
  opacity: 0;
  transform: translateY(6px) scale(0.96);
  transform-box: fill-box;
  transform-origin: center;
  transition: opacity .5s var(--lf-ease), transform .5s var(--lf-ease);
}
.lf-stage-svg[data-phase="3"] .lf-tax { opacity: 1; transform: translateY(0) scale(1); transition-delay: 0.8s; }

/* Closure card — status states */
.lf-stage-svg .lf-closure-state { transition: opacity .5s var(--lf-ease); }
.lf-stage-svg .lf-closure-state-expected { opacity: 1; }
.lf-stage-svg .lf-closure-state-blocked { opacity: 0; }
.lf-stage-svg[data-phase="3"] .lf-closure-state-expected { opacity: 0; }
.lf-stage-svg[data-phase="3"] .lf-closure-state-blocked { opacity: 1; }

/* Status pulse on entry card */
.lf-stage-svg .lf-entry-dot { animation: lf-entry-pulse 2.4s ease-in-out infinite; }
@keyframes lf-entry-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.65; }
}
@media (prefers-reduced-motion: reduce) {
  .lf-stage-svg .lf-entry-dot { animation: none; }
  .lf-stage-svg .lf-path,
  .lf-stage-svg .lf-chaos-card { transition: none !important; }
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

// SYSTEM OF RECORDS — left-anchored container showing the quality systems
// stack. The quality event originates from the QMS layer.
const SOR = { x: 32, y: 268, w: 240, h: 168 };
const SOR_HEADER_H = 28;
const SOR_QMS_H = 28;
const SOR_ROW_H = 28;
const SOR_QMS_Y = SOR.y + SOR_HEADER_H;
const COLLAPSED_SYSTEMS: string[] = ["DMS", "PLM", "MES", "CMMS"];

// CLOSURE CARD — right-anchored. The reassembly node.
const CLOSURE = { x: VB_W - 240 - 32, y: 260, w: 240, h: 184 };

// CHAOS CARDS — scattered, rotated, overlapping in the middle zone.
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
    artifact: "Re: REC-241",
    meta: "17 REPLIES · 4 CC",
    latency: "+3D",
    x: 336,
    y: 168,
    w: 224,
    h: 56,
    rot: 0,
  },
  {
    key: "teams-channel",
    name: "Teams Channel",
    artifact: "#rec-241 · @quality-ops",
    meta: "2 UNREAD",
    latency: "+11D",
    x: 592,
    y: 168,
    w: 224,
    h: 56,
    rot: 0,
    critical: true,
  },
  {
    key: "outlook-fw",
    name: "Outlook",
    artifact: "FW: Re: REC-241",
    meta: "17 CC · 2 BOUNCED",
    latency: "+2D",
    x: 336,
    y: 264,
    w: 224,
    h: 56,
    rot: 0,
  },
  {
    key: "teams-dm",
    name: "Teams DM",
    artifact: "Private · REC-241",
    meta: "22 MSG · FORK",
    latency: "+5D",
    x: 592,
    y: 264,
    w: 224,
    h: 56,
    rot: 0,
  },
  {
    key: "excel-v4",
    name: "Excel",
    artifact: "REC-241_v4_FINAL.xlsx",
    meta: "MERGED 2 TABS",
    latency: "+5D",
    x: 336,
    y: 384,
    w: 224,
    h: 56,
    rot: 0,
  },
  {
    key: "sharepoint",
    name: "SharePoint",
    artifact: "REC-241/v7-final",
    meta: "3 COPIES · 2 OWNERS",
    latency: "+7D",
    x: 592,
    y: 384,
    w: 224,
    h: 56,
    rot: 0,
  },
  {
    key: "excel",
    name: "Excel",
    artifact: "REC-241_tracker.xlsx",
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
    artifact: "REC-241 · 7 on call",
    meta: "NO NOTES · VERBAL YES",
    latency: "+4D",
    x: 592,
    y: 480,
    w: 224,
    h: 56,
    rot: 0,
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

type Theme = "dark" | "light";

export default function HomeLinearFlow() {
  const [phase, setPhase] = useState<Phase>(1);
  const [painIdx, setPainIdx] = useState(0);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    const stored = window.localStorage.getItem("lf-theme");
    return stored === "light" || stored === "dark" ? stored : "dark";
  });
  const reduced = useReducedMotion();

  useEffect(() => {
    document.title = "Unifize · The governed thread";
  }, []);

  useEffect(() => {
    window.localStorage.setItem("lf-theme", theme);
  }, [theme]);

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
    <div className="lf-root" data-theme={theme}>
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

      {/* Hero */}
      <section className="lf-hero">
        <h1 className="lf-hero-h1">
          Records live in systems.<br />
          Work lives <span className="lf-hero-accent">between them.</span>
        </h1>
        <p className="lf-hero-subtitle">
          The gap has a name.&nbsp;
          <span className="lf-hero-sub-em">Coordination&nbsp;tax.</span>
          &nbsp;Unifize is the layer that removes it.
        </p>
        <div className="lf-hero-cta">
          <button className="lf-btn-primary">
            Book a demo
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="lf-anchor" aria-live="polite">
            <span className="lf-anchor-label">You'll recognise it.</span>
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
            <FlowStage phase={phase} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- STAGE ---------------- */

function FlowStage({ phase }: { phase: Phase }) {
  const entryOut = { x: SOR.x + SOR.w, y: SOR_QMS_Y + SOR_QMS_H / 2 };
  const closureIn = { x: CLOSURE.x, y: CLOSURE.y + CLOSURE.h / 2 };

  // For each chaos card, the connector terminates at the midpoint of the LEFT
  // edge — Vercel-style side-entry so every node connects on its spine-facing
  // side, both columns identical. Tilted cards rotate their port accordingly.
  const shardTargets = CHAOS_CARDS.map((c) => {
    const cx = c.x + c.w / 2;
    const cy = c.y + c.h / 2;
    return rotatePoint(c.x, cy, cx, cy, c.rot);
  });

  // Shard paths — orthogonal routing from entry right edge to each card's
  // left-edge port. Left-column cards use a single rail just right of entry.
  // Right-column cards route through a second rail in the gap between columns
  // (so lines never pierce left cards). Paths stop 2px shy of the port so the
  // arrowhead sits in the gap.
  const shardRailX = entryOut.x + 24;
  const gapRailX = 576; // midway between left col right-edge (560) and right col left-edge (592)
  const shardPaths = CHAOS_CARDS.map((c, i) => {
    const t = shardTargets[i];
    const isRight = c.x >= 592;
    const cy = c.y + c.h / 2;
    const aboveEntry = cy < entryOut.y;
    if (!isRight) {
      return orthPath(
        [
          { x: entryOut.x + 2, y: entryOut.y },
          { x: shardRailX, y: entryOut.y },
          { x: shardRailX, y: t.y },
          { x: t.x - 2, y: t.y },
        ],
        6
      );
    }
    // Right column: bridge through the gap. The bridge-Y grazes the adjacent
    // left card's top/bottom edge so the horizontal never pierces a body.
    const bridgeY = aboveEntry ? c.y + c.h : c.y;
    return orthPath(
      [
        { x: entryOut.x + 2, y: entryOut.y },
        { x: shardRailX, y: entryOut.y },
        { x: shardRailX, y: bridgeY },
        { x: gapRailX, y: bridgeY },
        { x: gapRailX, y: t.y },
        { x: t.x - 2, y: t.y },
      ],
      6
    );
  });

  // Reply-chain cross-talk — Vercel-style orthogonal bus-bar routing.
  // Each pair rises/falls to a shared rail at a staggered y, crosses, descends.
  const replyPairs: [number, number, number][] = [
    [0, 1, -34],   // Outlook ↔ Teams (horizontal)
    [0, 2, -14],   // Outlook ↔ Outlook-FW (reply storm — same tool)
    [4, 6, 18],    // Excel-v4 ↔ Excel (version chaos — same file)
    [1, 3, 14],    // Teams ↔ Slack (chat tool sprawl)
    [5, 7, 22],    // Drive ↔ Meeting (post-meeting file drop)
    [6, 7, -18],   // Excel ↔ Meeting
    [3, 5, 26],    // Slack ↔ Drive
  ];

  // Closure rollup — right-column cards funnel toward Closure's left edge via a shared rail.
  // Each dashed line shows the chaos cluster trying to reach closure; they all converge.
  const rightColumnIndices = [1, 3, 5, 7]; // Teams, Slack, Drive, Meeting
  const closureSources = rightColumnIndices.map((i) => {
    const c = CHAOS_CARDS[i];
    const cx = c.x + c.w / 2;
    const cy = c.y + c.h / 2;
    return rotatePoint(c.x + c.w, c.y + c.h / 2, cx, cy, c.rot);
  });
  const closurePaths = closureSources.map((src) => {
    const railX = (src.x + closureIn.x) / 2;
    return orthPath(
      [
        { x: src.x + 2, y: src.y },
        { x: railX, y: src.y },
        { x: railX, y: closureIn.y },
        { x: closureIn.x - 2, y: closureIn.y },
      ],
      6
    );
  });
  const replyPaths = replyPairs.map(([a, b, busOffset]) => {
    const A = cardCenter(CHAOS_CARDS[a]);
    const B = cardCenter(CHAOS_CARDS[b]);
    const busY = (A.y + B.y) / 2 + busOffset;
    return orthPath(
      [
        { x: A.x, y: A.y },
        { x: A.x, y: busY },
        { x: B.x, y: busY },
        { x: B.x, y: B.y },
      ],
      4
    );
  });

  return (
    <svg
      className="lf-stage-svg"
      data-phase={phase}
      viewBox={`0 138 ${VB_W} 402`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Life of a record: a quality event enters cleanly at the system of record on the left, fans out into fragmented coordination across email, Teams, Excel and meetings in the middle, and has to reassemble on the right to close. The governed thread is a single blue line bypassing the chaos — the alternative, clean path."
    >
      <defs>
        <pattern id="lf-grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.6" fill="rgba(var(--lf-fg),0.08)" />
        </pattern>
        <filter id="lf-critical-glow" x="-20%" y="-40%" width="140%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#F87171" floodOpacity="0.22" />
        </filter>
        {/* Arrow chevron weight-matched to connector line opacity (0.34).
            Brighter arrows than lines drew the eye to endpoints; equal-weight
            keeps the connector reading as a single graphic. */}
        <marker
          id="lf-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="3.5"
          markerHeight="3.5"
          orient="auto"
        >
          <path
            d="M 2 2.5 L 8 5 L 2 7.5"
            fill="none"
            stroke="rgba(var(--lf-fg), 0.34)"
            strokeWidth="1.2"
            strokeLinecap="butt"
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
      />

      {/* Thread anchor label — names the specific record this diagram is
          tracking. Indigo dot + mono identifier. Single static dot mirrors
          the STATUS dot on the opposite side: symmetric canvas-level
          anchor pair, both reduced to a single dot per Vercel-style. */}
      <g>
        <circle
          cx={36}
          cy={148}
          r={3}
          fill="rgba(124,139,240,0.95)"
        />
        <text
          x={44}
          y={151.5}
          fontFamily="JetBrains Mono, monospace"
          fontSize={9}
          letterSpacing="0.18em"
          fontWeight={500}
        >
          <tspan fill="rgba(124,139,240,0.95)">THREAD</tspan>
          <tspan fill="rgba(124,139,240,0.5)"> · </tspan>
          <tspan fill="rgba(124,139,240,0.95)" fontWeight={600}>REC-241</tspan>
        </text>
      </g>

      {/* Status anchor label — pairs with the THREAD label on the left.
          Vercel-style canvas-level label pair: identity (left) / state (right).
          Dot is static — Vercel diagrams pulse only true "in progress" states,
          not error states. The red text already carries the warning. */}
      <g>
        <text
          x={VB_W - 44}
          y={151.5}
          textAnchor="end"
          fontFamily="JetBrains Mono, monospace"
          fontSize={9}
          letterSpacing="0.18em"
          fontWeight={500}
        >
          <tspan fill="rgba(248,113,113,0.92)">STATUS</tspan>
          <tspan fill="rgba(248,113,113,0.5)"> · </tspan>
          <tspan fill="rgba(248,113,113,0.92)">BLOCKED</tspan>
        </text>
        <circle
          cx={VB_W - 36}
          cy={148}
          r={3}
          fill="rgba(248,113,113,0.95)"
        />
      </g>

      {/* Chaos cluster region — Vercel/Linear-style scope outline. Outline +
          label drop to neutral gray so the COORDINATION TAX +24D badge is the
          single heat anchor in this zone. Critical card borders still carry
          the red signal at card level; the region outline is purely
          structural and matches the bottom-right "8 NODES · 14 OWNERS" footer
          in tone. */}
      <g>
        <rect
          x={326}
          y={160}
          width={500}
          height={380}
          rx={8}
          fill="none"
          stroke="rgba(var(--lf-fg),0.10)"
          strokeWidth={1}
          strokeDasharray="2 4"
        />
        <rect
          x={344}
          y={152}
          width={158}
          height={16}
          rx={3}
          fill="var(--lf-bg)"
        />
        <text
          x={352}
          y={163.5}
          fontFamily="JetBrains Mono, monospace"
          fontSize={8.5}
          letterSpacing="0.18em"
        >
          <tspan fill="rgba(var(--lf-fg),0.5)">THE GAP</tspan>
          <tspan fill="rgba(var(--lf-fg),0.28)"> · </tspan>
          <tspan fill="rgba(var(--lf-fg),0.5)">UNCAPTURED</tspan>
        </text>

        {/* Bottom-right summary footer — balances the top-left label.
            Positioned to cross the bottom dashed border (bg backplate masks the
            dashes underneath the text), kept within the viewBox bottom.
            Right padding matches the top-left label's 18px left padding. */}
        <rect
          x={630}
          y={524}
          width={186}
          height={16}
          rx={3}
          fill="var(--lf-bg)"
        />
        {/* Footer text muted: the center COORDINATION TAX +24D badge owns the
            tax accent. Repeating amber/red on the cluster footer was visual
            duplication; muted neutral keeps the structural balance without
            stealing focus from the badge. */}
        <text
          x={808}
          y={535.5}
          textAnchor="end"
          fontFamily="JetBrains Mono, monospace"
          fontSize={8.5}
          letterSpacing="0.18em"
        >
          <tspan fill="rgba(var(--lf-fg),0.5)">8 NODES</tspan>
          <tspan fill="rgba(var(--lf-fg),0.28)"> · </tspan>
          <tspan fill="rgba(var(--lf-fg),0.5)">14 OWNERS</tspan>
        </text>
      </g>

      {/* Shard paths — fan-out from entry into each chaos card (phase 2).
          No arrow markers: the concentric port circles at each card edge
          already signal "this is where the line lands." Two endpoint
          indicators was double-marking. */}
      <g fill="none" strokeLinecap="butt" strokeLinejoin="miter">
        {shardPaths.map((d, i) => (
          <path
            key={`shard-${i}`}
            className={`lf-shard-path lf-shard-path-${i} lf-path`}
            d={d}
            stroke="rgba(var(--lf-fg),0.34)"
            strokeWidth={1}
          />
        ))}
      </g>


      {/* Reply-chain cross-talk — phase 3 */}
      <g fill="none" strokeLinecap="butt" strokeLinejoin="miter">
        {replyPaths.map((d, i) => (
          <path
            key={`reply-${i}`}
            className={`lf-reply-path lf-reply-path-${i} lf-path`}
            d={d}
            stroke="rgba(var(--lf-fg),0.14)"
            strokeWidth={1}
          />
        ))}
      </g>

      {/* Closure rollup — right-column cards funnel into Closure (phase 3).
          No arrow markers, matching the shard paths: closure-destination port
          circle is the sole endpoint indicator. */}
      <g fill="none" strokeLinecap="butt" strokeLinejoin="miter">
        {closurePaths.map((d, i) => (
          <path
            key={`closure-${i}`}
            className={`lf-closure-path lf-closure-path-${i} lf-path`}
            d={d}
            stroke="rgba(var(--lf-fg),0.34)"
            strokeWidth={1}
          />
        ))}
      </g>

      {/* Chaos cards — scattered, rotated */}
      <g>
        {CHAOS_CARDS.map((c, i) => (
          <ChaosCard key={c.key} card={c} index={i} />
        ))}
      </g>

      {/* Node ports — ringed sockets where shard connectors meet each card edge.
          Vercel-style: outer ring (fill-none) + inner dot, so connectors terminate
          at a visible socket rather than dissolving into the card border. */}
      <g>
        {shardTargets.map((t, i) => (
          <g key={`port-${i}`} className={`lf-port lf-port-${i}`}>
            <circle
              cx={t.x}
              cy={t.y}
              r={3}
              fill="var(--lf-bg-card)"
              stroke="rgba(var(--lf-fg),0.18)"
              strokeWidth={1}
            />
            <circle
              cx={t.x}
              cy={t.y}
              r={1.4}
              fill="rgba(var(--lf-fg),0.55)"
            />
          </g>
        ))}
      </g>

      {/* Connector latency labels — muted monospace edge annotations,
          Vercel-style. Heat is communicated at the cluster level (COORDINATION
          TAX badge + the critical card's red border) rather than tinting every
          edge. Per-edge color was visual noise; muted edges let the cluster
          accents do the signaling. */}
      <g>
        {CHAOS_CARDS.map((c, i) => {
          const t = shardTargets[i];
          return (
            <text
              key={`latency-${i}`}
              className={`lf-latency lf-latency-${i}`}
              x={t.x - 8}
              y={t.y - 5}
              textAnchor="end"
              fontFamily="JetBrains Mono, monospace"
              fontSize={8}
              letterSpacing="0.08em"
              fontWeight={400}
              fill="rgba(var(--lf-fg),0.45)"
            >
              {c.latency}
            </text>
          );
        })}
      </g>

      {/* Coordination tax counter — phase 3 */}
      <TaxCounter />

      {/* System of Records — tall left anchor with QMS/DMS/PLM/MES/CMMS layers */}
      <SystemOfRecords phase={phase} />

      {/* Closure card — right anchor, the reassembly node */}
      <ClosureCard />

      {/* Source port — where shard connectors emerge from SOR's QMS row.
          Static neutral ring, Vercel-style. The pulse + red tint duplicated
          warning state already carried by the STUCK · 11D row, the critical
          card border, and the COORDINATION TAX badge. Static rings keep the
          diagram visually quieter. */}
      <g>
        <circle
          cx={entryOut.x}
          cy={entryOut.y}
          r={6}
          fill="none"
          stroke="rgba(var(--lf-fg),0.16)"
          strokeWidth={1}
        />
        <circle
          cx={entryOut.x}
          cy={entryOut.y}
          r={3}
          fill="var(--lf-bg-card)"
          stroke="rgba(var(--lf-fg),0.32)"
          strokeWidth={1}
        />
        <circle
          cx={entryOut.x}
          cy={entryOut.y}
          r={1.4}
          fill="rgba(var(--lf-fg),0.65)"
        />
      </g>

      {/* Shard fan-out junction — where the QMS trunk diverges into 8 branches.
          Vercel-style routing-junction marker: a small filled diamond, visually
          distinct from the circular edge ports. Placed at the shard rail x-coord
          (entryOut.x + 24) on the trunk's horizontal line. The "× 8" label
          annotates the branching factor at the junction. */}
      <g>
        {/* Junction marker — circle matching the chaos card port style.
            Diamond previously differentiated this as a routing-junction;
            unifying to circle keeps the connector vocabulary consistent. */}
        <circle
          cx={shardRailX}
          cy={entryOut.y}
          r={3.5}
          fill="var(--lf-bg-card)"
          stroke="rgba(var(--lf-fg),0.42)"
          strokeWidth={1}
        />
        <circle
          cx={shardRailX}
          cy={entryOut.y}
          r={1.6}
          fill="rgba(var(--lf-fg),0.7)"
        />
        <text
          x={shardRailX + 8}
          y={entryOut.y - 6}
          fontFamily="JetBrains Mono, monospace"
          fontSize={8}
          letterSpacing="0.08em"
          fill="rgba(var(--lf-fg),0.62)"
        >
          × 8
        </text>
      </g>

      {/* Closure source ports — where rollup connectors exit each right-column card */}
      <g>
        {closureSources.map((s, i) => (
          <g key={`close-src-${i}`}>
            <circle
              cx={s.x}
              cy={s.y}
              r={3}
              fill="var(--lf-bg-card)"
              stroke="rgba(var(--lf-fg),0.18)"
              strokeWidth={1}
            />
            <circle
              cx={s.x}
              cy={s.y}
              r={1.4}
              fill="rgba(var(--lf-fg),0.55)"
            />
          </g>
        ))}
      </g>

      {/* Closure destination port — convergence junction. Sized to match the
          fan-out junction on the opposite side: same vocabulary across both
          divergence and convergence points. The outer 6px halo was a vestige
          from the pulse era. */}
      <g>
        <circle
          cx={closureIn.x}
          cy={closureIn.y}
          r={3.5}
          fill="var(--lf-bg-card)"
          stroke="rgba(var(--lf-fg),0.42)"
          strokeWidth={1}
        />
        <circle
          cx={closureIn.x}
          cy={closureIn.y}
          r={1.6}
          fill="rgba(var(--lf-fg),0.7)"
        />
        <text
          x={closureIn.x - 10}
          y={closureIn.y - 8}
          textAnchor="end"
          fontFamily="JetBrains Mono, monospace"
          fontSize={8}
          letterSpacing="0.08em"
          fill="rgba(var(--lf-fg),0.62)"
        >
          × 4
        </text>
      </g>
    </svg>
  );
}

/* ---------------- Pieces ---------------- */

function SystemOfRecords({ phase }: { phase: Phase }) {
  const statusByPhase: Record<Phase, { dot: string; label: string }> = {
    1: { dot: "#7C8BF0", label: "OPEN · 0D" },
    2: { dot: "#F59E0B", label: "SCATTERING" },
    3: { dot: "#F87171", label: "STUCK · 11D" },
  };
  const s = statusByPhase[phase];

  return (
    <g>
      {/* Container — subtle red border tint reflects the card's critical state
          (QMS row is stuck, anchor of the broken thread). */}
      <rect
        x={SOR.x}
        y={SOR.y}
        width={SOR.w}
        height={SOR.h}
        rx={4}
        fill="var(--lf-bg-card)"
        stroke="rgba(248,113,113,0.18)"
        strokeWidth={1}
      />

      {/* Header — letter badge matches Closure/chaos-card pattern. Tinted red
          to match the Closure card's red "C" badge: both anchor cards of this
          thread are in critical states (SoR has stuck QMS row, Closure has
          blocked REC-241). Unified red badging signals "the thread is broken
          at both ends." Pulse rhythm in sync with TAX/STATUS/Teams/C badges. */}
      {/* SoR "S" letter badge — uniform neutral treatment, matches every
          other badge in the diagram. The "● STUCK · 11D" row below already
          marks this card as the broken source; duplicating heat on the badge
          (and pulsing it) was visual triple-coding. */}
      <g>
        <rect
          x={SOR.x + 10}
          y={SOR.y + 10}
          width={14}
          height={14}
          rx={3}
          fill="rgba(var(--lf-fg),0.06)"
          stroke="rgba(var(--lf-fg),0.18)"
          strokeWidth={1}
        />
        <text
          x={SOR.x + 17}
          y={SOR.y + 20.2}
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
          fontSize={8.5}
          fontWeight={600}
          letterSpacing="0.02em"
          fill="rgba(var(--lf-fg),0.72)"
        >
          S
        </text>
      </g>
      {/* Service name bumped to 0.78 opacity to match the chaos cards.
          Vercel-style hierarchy: service name is the prominent header. */}
      <text
        x={SOR.x + 30}
        y={SOR.y + 21}
        fontFamily="JetBrains Mono, monospace"
        fontSize={9.5}
        letterSpacing="0.14em"
        fill="rgba(var(--lf-fg),0.78)"
      >
        SYSTEM OF RECORDS
      </text>

      {/* Right-side header meta — uniform muted treatment matching all
          chaos-card right-edge meta. The QMS row's "STUCK · 11D" carries the
          SoR card's warning; the "1/5 ACTIVE" telemetry is just structural. */}
      <text
        x={SOR.x + SOR.w - 10}
        y={SOR.y + 21}
        textAnchor="end"
        fontFamily="JetBrains Mono, monospace"
        fontSize={8}
        letterSpacing="0.08em"
      >
        <tspan fill="rgba(var(--lf-fg),0.5)">1</tspan>
        <tspan fill="rgba(var(--lf-fg),0.22)">/</tspan>
        <tspan fill="rgba(var(--lf-fg),0.5)">5</tspan>
        <tspan fill="rgba(var(--lf-fg),0.28)"> · </tspan>
        <tspan fill="rgba(var(--lf-fg),0.5)">ACTIVE</tspan>
      </text>

      {/* Header divider — uniform neutral hairline, matches every other
          card divider in the diagram. The QMS row's STUCK · 11D text is the
          card's single warning anchor; the divider doesn't need to repeat it. */}
      <line
        x1={SOR.x}
        x2={SOR.x + SOR.w}
        y1={SOR.y + SOR_HEADER_H}
        y2={SOR.y + SOR_HEADER_H}
        stroke="rgba(var(--lf-fg),0.06)"
        strokeWidth={1}
      />

      {/* QMS row — active; opacity alone differentiates from collapsed rows.
          The "REC-241" reference in indigo ties this row to the same shared
          identifier highlighted across the chaos cards' bodies — visually
          proving "the record stuck in QMS is the one scattered across the gap." */}
      <g>
        <text
          x={SOR.x + 30}
          y={SOR_QMS_Y + SOR_QMS_H / 2 + 3.5}
          fontFamily="JetBrains Mono, monospace"
          fontSize={10}
          letterSpacing="0.14em"
        >
          <tspan fill="rgba(var(--lf-fg),0.9)">QMS</tspan>
          <tspan fill="rgba(var(--lf-fg),0.45)"> · </tspan>
          <tspan fill="rgba(var(--lf-fg),0.78)">REC-241</tspan>
        </text>
        {(() => {
          const midY = SOR_QMS_Y + SOR_QMS_H / 2;
          const textX = SOR.x + SOR.w - 10;
          const dotX = SOR.x + SOR.w - 88;
          return (
            <>
              {/* Static dot — Vercel-style. Halo + pulse duplicated the
                  "STUCK · 11D" red text already present on this row. */}
              <circle
                cx={dotX}
                cy={midY}
                r={2.5}
                fill={s.dot}
                style={{ transition: "fill 0.4s ease" }}
              />
              {(() => {
                // Split "STUCK · 11D" / "OPEN · 0D" into label + duration so
                // the duration can be weight-bumped, matching the highlight
                // pattern used across closure body and chaos region footer.
                const m = s.label.match(/^(.*\s·\s)(\S+)$/);
                if (!m) {
                  return (
                    <text
                      x={textX}
                      y={midY + 3.5}
                      textAnchor="end"
                      fontFamily="JetBrains Mono, monospace"
                      fontSize={8}
                      letterSpacing="0.08em"
                      fill={s.dot}
                      fillOpacity={0.78}
                      style={{ transition: "fill 0.4s ease" }}
                    >
                      {s.label}
                    </text>
                  );
                }
                return (
                  <text
                    x={textX}
                    y={midY + 3.5}
                    textAnchor="end"
                    fontFamily="JetBrains Mono, monospace"
                    fontSize={8}
                    letterSpacing="0.08em"
                    style={{ transition: "fill 0.4s ease" }}
                  >
                    <tspan fill={s.dot} fillOpacity={0.7}>{m[1]}</tspan>
                    <tspan fill={s.dot} fillOpacity={0.95} fontWeight={500}>{m[2]}</tspan>
                  </text>
                );
              })()}
            </>
          );
        })()}
      </g>

      {/* Collapsed rows: DMS, PLM, MES, CMMS — pushed deeper into dormant
          territory (0.28/0.22 vs former 0.36/0.32). Vercel-style: dormant
          background elements stay almost invisible so the active row reads
          as the only thing alive in the card. */}
      {COLLAPSED_SYSTEMS.map((label, i) => {
        const rowY = SOR_QMS_Y + SOR_QMS_H + i * SOR_ROW_H;
        const midY = rowY + SOR_ROW_H / 2;
        return (
          <g key={label}>
            <text
              x={SOR.x + 30}
              y={midY + 3.5}
              fontFamily="JetBrains Mono, monospace"
              fontSize={10}
              letterSpacing="0.14em"
              fill="rgba(var(--lf-fg),0.28)"
            >
              {label}
            </text>
            <text
              x={SOR.x + SOR.w - 10}
              y={midY + 3.5}
              textAnchor="end"
              fontFamily="JetBrains Mono, monospace"
              fontSize={8}
              letterSpacing="0.08em"
              fill="rgba(var(--lf-fg),0.22)"
            >
              —
            </text>
          </g>
        );
      })}
    </g>
  );
}

function ChaosCard({ card, index }: { card: ChaosCardDef; index: number }) {
  // Orthogonal grid alignment — Vercel-style diagrams keep all nodes
  // perfectly axis-aligned. Chaos is conveyed through density, connector
  // tangle, and heat tinting, not through random rotation.
  return (
    <g className={`lf-chaos-card lf-chaos-card-${index}`}>
      {(() => {
        const days = parseInt(card.latency.replace(/[+D]/g, ""), 10);
        const isHot = card.critical || days >= 10;
        const isWarm = !isHot && days >= 5;
        // Hot cards bump stroke opacity (0.45) instead of relying on a soft
        // glow filter — Vercel-style diagrams use hard edges, never blur.
        const stroke = isHot
          ? "rgba(248,113,113,0.45)"
          : isWarm
          ? "rgba(245,158,11,0.28)"
          : "rgba(var(--lf-fg),0.18)";
        return (
          <rect
            x={card.x}
            y={card.y}
            width={card.w}
            height={card.h}
            rx={4}
            fill="var(--lf-bg-card)"
            stroke={stroke}
            strokeWidth={1}
          />
        );
      })()}

      {/* Service letter badge — uniform across all cards (Vercel-style).
          Heat is conveyed via the card border alone; the pulse on critical
          cards added rhythm noise that duplicated the static red stroke. */}
      {(() => {
        return (
          <g>
            <rect
              x={card.x + 10}
              y={card.y + 10}
              width={14}
              height={14}
              rx={3}
              fill="rgba(var(--lf-fg),0.06)"
              stroke="rgba(var(--lf-fg),0.18)"
              strokeWidth={1}
            />
            <text
              x={card.x + 17}
              y={card.y + 20.2}
              textAnchor="middle"
              fontFamily="JetBrains Mono, monospace"
              fontSize={8.5}
              fontWeight={600}
              letterSpacing="0.02em"
              fill="rgba(var(--lf-fg),0.72)"
            >
              {card.name.charAt(0).toUpperCase()}
            </text>
          </g>
        );
      })()}
      {/* Service name — bumped from 0.5 to 0.78 opacity. Vercel-style cards
          treat the service name as the prominent header; right-edge meta and
          body artifact text stay muted. Restores correct visual hierarchy. */}
      <text
        x={card.x + 30}
        y={card.y + 21}
        fontFamily="JetBrains Mono, monospace"
        fontSize={9.5}
        letterSpacing="0.14em"
        fill="rgba(var(--lf-fg),0.78)"
      >
        {card.name.toUpperCase()}
      </text>

      {/* Right-edge metadata — uniform muted treatment, Vercel-style.
          Heat used to color these tokens by latency, but with the cluster
          outline + critical card border + COORDINATION TAX badge already
          carrying the warning, per-card amber metadata was just visual
          duplication. Dim-separator split keeps the typographic rhythm. */}
      {(() => {
        const tokens = card.meta.split(" · ");
        return (
          <text
            x={card.x + card.w - 10}
            y={card.y + 21}
            textAnchor="end"
            fontFamily="JetBrains Mono, monospace"
            fontSize={8}
            letterSpacing="0.08em"
          >
            {tokens.map((tok, ti) => (
              <Fragment key={`${tok}-${ti}`}>
                {ti > 0 && <tspan fill="rgba(var(--lf-fg),0.28)"> · </tspan>}
                <tspan fill="rgba(var(--lf-fg),0.5)">{tok}</tspan>
              </Fragment>
            ))}
          </text>
        );
      })()}

      {/* Header divider — uniform hairline across every chaos card.
          Vercel-style: the structural rule of the card is consistent; heat
          lives at semantic spots (border, cluster outline, tax badge), never
          repeated on every internal line. */}
      <line
        x1={card.x}
        x2={card.x + card.w}
        y1={card.y + 30}
        y2={card.y + 30}
        stroke="rgba(var(--lf-fg),0.06)"
        strokeWidth={1}
      />

      <text
        x={card.x + 10}
        y={card.y + 44}
        fontFamily="JetBrains Mono, monospace"
        fontSize={10.5}
        fill="rgba(var(--lf-fg),0.72)"
      >
        {(() => {
          // The shared "REC-241" identifier is bolded but kept in body color —
          // sparse-accent rule. The canvas-level THREAD anchor already owns the
          // indigo highlight; repeating it in 8 cards adds noise.
          const re = /rec-?241/i;
          const m = card.artifact.match(re);
          if (!m || m.index === undefined) return card.artifact;
          const before = card.artifact.slice(0, m.index);
          const key = m[0];
          const after = card.artifact.slice(m.index + key.length);
          return (
            <>
              {before}
              <tspan fill="rgba(var(--lf-fg),0.78)">{key}</tspan>
              {after}
            </>
          );
        })()}
      </text>
    </g>
  );
}

function TaxCounter() {
  // Centered on the chaos cluster (cards span x=336..816, midpoint x=576),
  // not the viewBox midpoint, so the TAX badge sits on the actual chaos
  // centerline rather than 24px right of it.
  const cx = 576;
  const cy = 352;
  const w = 192;
  const h = 28;
  return (
    <g className="lf-tax">
      {/* Outer box border neutral — the inner `!` badge and the "+24D" label
          already carry the red. Sparse-accent: one red signal per element. */}
      <rect
        x={cx - w / 2}
        y={cy - h / 2}
        width={w}
        height={h}
        rx={4}
        fill="var(--lf-bg-card)"
        stroke="rgba(var(--lf-fg),0.18)"
        strokeWidth={1}
      />
      {/* Badge — static red `!`, last remaining canvas pulse removed.
          Vercel-style: pulse means "in progress," not "error." The badge,
          the box, and the +24D label still carry the red. */}
      <g>
        <rect
          x={cx - w / 2 + 10}
          y={cy - 7}
          width={14}
          height={14}
          rx={3}
          fill="rgba(248,113,113,0.18)"
          stroke="rgba(248,113,113,0.45)"
          strokeWidth={1}
        />
        <text
          x={cx - w / 2 + 17}
          y={cy + 3.2}
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
          fontSize={8.5}
          fontWeight={600}
          letterSpacing="0.02em"
          fill="rgba(248,113,113,0.85)"
        >
          !
        </text>
      </g>
      <text
        x={cx - w / 2 + 30}
        y={cy + 3.5}
        fontFamily="JetBrains Mono, monospace"
        fontSize={9.5}
        letterSpacing="0.14em"
      >
        <tspan fill="rgba(var(--lf-fg),0.5)">COORDINATION TAX</tspan>
        <tspan dx="10" fontWeight={500} fill="rgba(248,113,113,0.95)">+24D</tspan>
      </text>
    </g>
  );
}

function ClosureCard() {
  return (
    <g>
      {/* Container — subtle red border tint reflects the card's critical state
          (REC-241 blocked, anchor of the broken thread). */}
      {/* Card border neutral — the "Blocked · 14D" body text carries the
          warning. Sparse-accent: a single red signal per card, never doubled
          on border + body. Matches the chaos card uniform-border treatment. */}
      <rect
        x={CLOSURE.x}
        y={CLOSURE.y}
        width={CLOSURE.w}
        height={CLOSURE.h}
        rx={4}
        fill="var(--lf-bg-card)"
        stroke="rgba(var(--lf-fg),0.18)"
        strokeWidth={1}
      />

      {/* Closure "C" letter badge — uniform neutral, matches every other
          badge in the diagram. The "Blocked · 14D" row already carries the
          closure-card warning; pulsing red on the badge stacked accents. */}
      <g>
        <rect
          x={CLOSURE.x + 10}
          y={CLOSURE.y + 10}
          width={14}
          height={14}
          rx={3}
          fill="rgba(var(--lf-fg),0.06)"
          stroke="rgba(var(--lf-fg),0.18)"
          strokeWidth={1}
        />
        <text
          x={CLOSURE.x + 17}
          y={CLOSURE.y + 20.2}
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
          fontSize={8.5}
          fontWeight={600}
          letterSpacing="0.02em"
          fill="rgba(var(--lf-fg),0.72)"
        >
          C
        </text>
      </g>
      <text
        x={CLOSURE.x + 30}
        y={CLOSURE.y + 21}
        fontFamily="JetBrains Mono, monospace"
        fontSize={9.5}
        letterSpacing="0.14em"
        fill="rgba(var(--lf-fg),0.78)"
      >
        CLOSURE
      </text>

      {/* Header meta uniform muted — matches every other card's header meta.
          The "Blocked · 14D" body status is the closure card's single warning;
          the structural "DUE · 4D" doesn't need its own amber accent. */}
      <text
        x={CLOSURE.x + CLOSURE.w - 10}
        y={CLOSURE.y + 21}
        textAnchor="end"
        fontFamily="JetBrains Mono, monospace"
        fontSize={8}
        letterSpacing="0.08em"
      >
        <tspan fill="rgba(var(--lf-fg),0.5)">DUE</tspan>
        <tspan fill="rgba(var(--lf-fg),0.28)"> · </tspan>
        <tspan fill="rgba(var(--lf-fg),0.5)">4D</tspan>
      </text>

      {/* Header + footer dividers — uniform neutral hairlines matching every
          other card divider. Closure card's "Blocked · 14D" body status is
          the single warning anchor; the structural rules don't repeat it. */}
      <line
        x1={CLOSURE.x}
        x2={CLOSURE.x + CLOSURE.w}
        y1={CLOSURE.y + 34}
        y2={CLOSURE.y + 34}
        stroke="rgba(var(--lf-fg),0.06)"
        strokeWidth={1}
      />
      <line
        x1={CLOSURE.x}
        x2={CLOSURE.x + CLOSURE.w}
        y1={CLOSURE.y + CLOSURE.h - 32}
        y2={CLOSURE.y + CLOSURE.h - 32}
        stroke="rgba(var(--lf-fg),0.06)"
        strokeWidth={1}
      />

      <g>
        <g className="lf-closure-state lf-closure-state-expected">
          <text
            x={CLOSURE.x + 10}
            y={CLOSURE.y + 82}
            fontFamily="Inter, sans-serif"
            fontSize={13}
            fontWeight={500}
            fill="rgba(16,185,129,0.9)"
          >
            Awaiting closure
          </text>
          <text
            x={CLOSURE.x + 10}
            y={CLOSURE.y + 104}
            fontFamily="Inter, sans-serif"
            fontSize={12}
            fill="rgba(16,185,129,0.55)"
          >
            Reviews, sign-offs, evidence.
          </text>
          <text
            x={CLOSURE.x + 10}
            y={CLOSURE.y + CLOSURE.h - 18}
            fontFamily="JetBrains Mono, monospace"
            fontSize={8}
            letterSpacing="0.08em"
            fontWeight={500}
          >
            <tspan fill="rgba(16,185,129,0.78)">EST</tspan>
            <tspan fill="rgba(16,185,129,0.4)"> · </tspan>
            <tspan fill="rgba(16,185,129,0.78)">4 DAYS</tspan>
          </text>
        </g>

        <g className="lf-closure-state lf-closure-state-blocked">
          {/* Status row — color carries the warning, not weight. Drops the
              medium weight so the heat reads from the red tspan alone. */}
          <text
            x={CLOSURE.x + 10}
            y={CLOSURE.y + 82}
            fontFamily="Inter, sans-serif"
            fontSize={13}
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            <tspan fontFamily="JetBrains Mono, monospace" fontSize={11.5} fill="rgba(var(--lf-fg),0.78)">REC-241</tspan>
            <tspan fill="rgba(var(--lf-fg),0.6)"> · </tspan>
            <tspan fill="rgba(248,113,113,0.92)">Blocked</tspan>
            <tspan fill="rgba(var(--lf-fg),0.6)"> · </tspan>
            <tspan fill="rgba(248,113,113,0.92)">14D</tspan>
          </text>
          {/* Description muted — Vercel sparse-accent rule. The "Blocked · 14D"
              status above already owns the warning; repeating amber on the
              descriptive sentence stacked three accents on a single card. */}
          <text
            x={CLOSURE.x + 10}
            y={CLOSURE.y + 104}
            fontFamily="Inter, sans-serif"
            fontSize={12}
          >
            <tspan fill="rgba(var(--lf-fg),0.6)">Pieces missing. Closure stalled.</tspan>
          </text>
          {/* Footer muted — "Blocked · 14D" above is already the closure
              card's warning anchor. Repeating red on the footer made the
              card carry two stacked accents. Vercel-style: one accent. */}
          <text
            x={CLOSURE.x + 10}
            y={CLOSURE.y + CLOSURE.h - 18}
            fontFamily="JetBrains Mono, monospace"
            fontSize={8}
            letterSpacing="0.08em"
            fontWeight={500}
          >
            <tspan fill="rgba(var(--lf-fg),0.5)">+10 DAYS</tspan>
            <tspan fill="rgba(var(--lf-fg),0.32)"> OVER</tspan>
          </text>
        </g>
      </g>
    </g>
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

