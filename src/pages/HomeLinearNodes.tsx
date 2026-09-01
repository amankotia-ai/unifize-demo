import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
.lin-nav-logo {
  display: inline-flex; align-items: center;
}
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
@media (max-width: 860px) {
  .lin-nav-items { display: none; }
}

/* ------------ HERO ------------ */
.lin-hero {
  max-width: 1240px; margin: 0 auto;
  padding: 72px 28px 56px;
  position: relative;
  display: flex; flex-direction: column;
  justify-content: flex-start;
}
.lin-hero-h1 {
  font-size: clamp(28px, 3.8vw, 52px);
  font-weight: 500;
  line-height: 1.04;
  letter-spacing: -0.032em;
  max-width: 28ch;
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
.lin-hero-sidenote .bold { color: var(--lin-text); font-weight: 500; }
.lin-hero-sidenote a {
  color: var(--lin-text-muted);
  display: inline-flex; align-items: center; gap: 5px;
}
.lin-hero-sidenote a:hover { color: var(--lin-text); }

/* Pain-point rotator */
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
@media (prefers-reduced-motion: reduce) {
  .lin-pain-text { animation: none; }
}
@media (max-width: 760px) {
  .lin-hero-sidenote {
    margin-left: 0; margin-top: 4px; width: 100%;
  }
  .lin-pain-slot { min-width: 0; flex: 1; }
  .lin-hero { min-height: auto; padding-top: 72px; }
}

/* ------------ PRODUCT PREVIEW (node diagram, full width) ------------ */
.lin-preview {
  width: 100%;
  margin: 0 auto;
  padding: 20px 0 110px;
  position: relative;
  isolation: isolate;
}
.lin-preview-glow {
  position: absolute;
  left: 50%; top: -380px;
  transform: translateX(-50%);
  width: 1400px; max-width: 100%;
  height: 700px;
  background:
    radial-gradient(60% 55% at 50% 75%, rgba(94,106,210,0.45) 0%, rgba(94,106,210,0.18) 40%, rgba(94,106,210,0) 78%),
    radial-gradient(50% 55% at 25% 65%, rgba(124,139,240,0.26) 0%, rgba(124,139,240,0) 72%),
    radial-gradient(50% 55% at 78% 60%, rgba(80,120,220,0.22) 0%, rgba(80,120,220,0) 72%);
  filter: blur(32px);
  pointer-events: none;
  z-index: 0;
}
.lin-preview svg.lin-node-diagram {
  width: 100%;
  height: auto;
  display: block;
  position: relative;
  z-index: 1;
}

/* ------------ CONCEPT MAP ------------ */
.lin-cm {
  max-width: 1340px; margin: 0 auto;
  padding: 20px 28px 110px;
  position: relative;
}
.lin-cm-head {
  max-width: 1240px; margin: 0 auto 44px;
}
.lin-cm-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.14em;
  color: var(--lin-text-faint); text-transform: uppercase;
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 24px;
}
.lin-cm-eyebrow .line { flex: 1; height: 1px; background: var(--lin-border); max-width: 200px; }
.lin-cm-h2 {
  margin: 0;
  font-size: clamp(28px, 3.6vw, 44px);
  line-height: 1.12; letter-spacing: -0.028em;
  font-weight: 500;
  max-width: 32ch;
}
.lin-cm-h2 .dim { color: var(--lin-text-muted); }
.lin-cm-sub {
  max-width: 68ch; margin: 18px 0 0;
  font-size: 15px; color: var(--lin-text-muted);
  line-height: 1.55;
}
.lin-cm-stage {
  position: relative;
  border-radius: 18px;
  border: 1px solid var(--lin-border);
  background:
    radial-gradient(80% 60% at 50% 50%, rgba(94,106,210,0.10) 0%, rgba(8,9,10,0) 70%),
    linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 100%),
    var(--lin-bg);
  overflow: hidden;
  padding: 18px;
  isolation: isolate;
}
.lin-cm-stage::before {
  content: ""; position: absolute; inset: 0;
  background-image:
    radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 1px);
  background-size: 24px 24px;
  mask-image: radial-gradient(80% 70% at 50% 50%, #000 40%, transparent 92%);
  pointer-events: none;
  z-index: 0;
}
.lin-cm-svg {
  display: block; width: 100%; height: auto;
  position: relative; z-index: 1;
}
.lin-cm-callout {
  max-width: 58ch; margin: 36px auto 0;
  padding: 14px 22px;
  border: 1px solid var(--lin-border);
  border-radius: 12px;
  background: rgba(255,255,255,0.025);
  font-size: 13.5px; color: var(--lin-text-muted);
  line-height: 1.55;
  text-align: center;
}
.lin-cm-callout strong { color: var(--lin-text); font-weight: 500; }

@media (max-width: 860px) {
  .lin-cm { padding-bottom: 72px; }
  .lin-cm-stage { padding: 8px; }
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
.lin-logos-item {
  display: inline-flex; align-items: center;
  height: 36px;
}
.lin-logos-item img {
  height: 24px; width: auto; filter: brightness(0) invert(1);
  opacity: 0.85;
}

/* ------------ LIGHT THEME WRAPPER ------------ */
.lin-light {
  background: #FFFFFF;
  color: #08090A;
  --lin-text: #08090A;
  --lin-text-muted: rgba(8,9,10,0.58);
  --lin-text-faint: rgba(8,9,10,0.42);
  --lin-border: rgba(8,9,10,0.08);
  --lin-border-strong: rgba(8,9,10,0.16);
  --lin-bg-subtle: #F7F8FA;
  --lin-bg-card: #FFFFFF;
}
.lin-light .lin-btn-primary {
  background: #08090A; color: #FFFFFF;
}
.lin-light .lin-btn-primary:hover { background: #1A1B1F; }
.lin-light .lin-btn-ghost {
  color: #08090A;
  border-color: rgba(8,9,10,0.14);
}
.lin-light .lin-btn-ghost:hover {
  background: rgba(8,9,10,0.04);
  border-color: rgba(8,9,10,0.22);
}

/* ------------ SECONDARY HEADLINE ------------ */
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

/* ------------ FIG GRID ------------ */
.lin-figs {
  max-width: 1240px; margin: 0 auto;
  padding: 60px 28px 100px;
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 64px;
}
@media (max-width: 900px) {
  .lin-figs { grid-template-columns: 1fr; gap: 48px; }
}
.lin-fig {
  position: relative;
  display: flex; flex-direction: column;
}
.lin-fig-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.14em;
  color: var(--lin-text-faint);
}
.lin-fig-title {
  margin-top: 16px;
  font-size: 14px; font-weight: 500; letter-spacing: -0.01em;
  line-height: 1.45;
}
.lin-fig-title .dim { color: var(--lin-text-muted); }

/* Iso illustrations */
.lin-fig-art {
  display: flex; align-items: center; justify-content: center;
  aspect-ratio: 1 / 0.7;
  opacity: 0.95;
}
.lin-fig-art svg { width: 100%; height: 100%; }
.lin-fig-art { color: rgba(255,255,255,0.96); }
.lin-light .lin-fig-art { color: #08090A; }

/* ------------ BOTTOM CTA ------------ */
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

/* ------------ FOOTER ------------ */
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

/* ------------ NODE DIAGRAM (preview replacement) ------------ */
.lin-node-diagram {
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
}
.lin-node-diagram .node-label {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 450;
  fill: #E8EAF0;
  letter-spacing: -0.005em;
}
.lin-node-diagram .node-sub {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.08em;
  fill: rgba(255,255,255,0.42);
}
.lin-node-diagram .zone-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.18em;
  fill: rgba(255,255,255,0.38);
  text-transform: uppercase;
}
.lin-node-diagram .arrow-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.12em;
  fill: rgba(255,255,255,0.62);
}
.lin-node-diagram .miss-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.08em;
  fill: #F87171;
}
.lin-node-diagram .hit-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.08em;
  fill: #6EE7B7;
}

/* --- Chaos drift animation -------------------------------- */
@keyframes lin-drift {
  0%   { transform: translate(var(--dx1, 0px), var(--dy1, 0px)); }
  33%  { transform: translate(var(--dx2, 0px), var(--dy2, 0px)); }
  66%  { transform: translate(var(--dx3, 0px), var(--dy3, 0px)); }
  100% { transform: translate(var(--dx1, 0px), var(--dy1, 0px)); }
}
.lin-chaos-node {
  animation: lin-drift var(--dur, 10s) ease-in-out infinite;
  animation-delay: var(--del, 0s);
  will-change: transform;
  transform-box: fill-box;
}
@keyframes lin-line-pulse {
  0%, 100% { opacity: var(--op, 0.1); }
  50%      { opacity: calc(var(--op, 0.1) * 0.35); }
}
.lin-chaos-line {
  animation: lin-line-pulse var(--dur, 6s) ease-in-out infinite;
  animation-delay: var(--del, 0s);
}
@media (prefers-reduced-motion: reduce) {
  .lin-chaos-node,
  .lin-chaos-line { animation: none; }
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
        <defs>
          <linearGradient id="f1-glow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0052FF" stopOpacity="0" />
            <stop offset="0.5" stopColor="#0052FF" stopOpacity="0.55" />
            <stop offset="1" stopColor="#0052FF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="38" y="36" width="214" height="90" rx="12"
          fill="#EEF0F4"
          stroke="currentColor" strokeOpacity="0.14" />
        <rect x="52" y="60" width="226" height="104" rx="12"
          fill="#F4F6F9"
          stroke="currentColor" strokeOpacity="0.18" />
        <g>
          <rect x="68" y="94" width="236" height="138" rx="12"
            fill="#FFFFFF" stroke="currentColor" strokeOpacity="0.3" />
          <circle cx="88" cy="120" r="11" fill="#0052FF" />
          <rect x="106" y="112" width="64" height="6" rx="3" fill="currentColor" fillOpacity="0.5" />
          <rect x="106" y="124" width="40" height="5" rx="2.5" fill="currentColor" fillOpacity="0.26" />
          <rect x="268" y="114" width="28" height="6" rx="3" fill="currentColor" fillOpacity="0.22" />
          <line x1="80" y1="146" x2="292" y2="146" stroke="currentColor" strokeOpacity="0.08" />
          <rect x="80" y="156" width="180" height="5" rx="2.5" fill="currentColor" fillOpacity="0.3" />
          <rect x="80" y="168" width="152" height="5" rx="2.5" fill="currentColor" fillOpacity="0.2" />
          <rect x="80" y="180" width="120" height="5" rx="2.5" fill="currentColor" fillOpacity="0.14" />
          <g>
            <rect x="80" y="198" width="124" height="22" rx="6"
              fill="#0052FF" fillOpacity="0.14"
              stroke="#0052FF" strokeOpacity="0.55" />
            <circle cx="92" cy="209" r="3" fill="#0052FF" />
            <rect x="100" y="205" width="60" height="4" rx="2" fill="#0052FF" fillOpacity="0.95" />
            <rect x="100" y="212" width="42" height="3" rx="1.5" fill="#0052FF" fillOpacity="0.65" />
            <path d="M186 206 l8 3.5 -8 3.5 z" fill="#0052FF" fillOpacity="0.8" />
          </g>
        </g>
        <line x1="204" y1="209" x2="300" y2="209" stroke="url(#f1-glow)" strokeWidth="1" />
      </svg>
    ),
  },
  {
    n: "FIG 0.2",
    title: "AI reads the thread.",
    subtitle: "It proposes the next step. People approve. Work moves.",
    art: (
      <svg viewBox="0 0 320 260" fill="none">
        <defs>
          <linearGradient id="f2-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4D85FF" stopOpacity="0.32" />
            <stop offset="1" stopColor="#0052FF" stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id="f2-left" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="currentColor" stopOpacity="0.04" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.14" />
          </linearGradient>
          <linearGradient id="f2-right" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="currentColor" stopOpacity="0.16" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.03" />
          </linearGradient>
          <radialGradient id="f2-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#0052FF" stopOpacity="0.5" />
            <stop offset="1" stopColor="#0052FF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="160" cy="140" rx="110" ry="70" fill="url(#f2-glow)" />
        <ellipse cx="160" cy="140" rx="116" ry="30"
          stroke="currentColor" strokeOpacity="0.14" strokeDasharray="2 4" />
        <ellipse cx="160" cy="140" rx="88" ry="58"
          stroke="currentColor" strokeOpacity="0.1" strokeDasharray="2 4"
          transform="rotate(-18 160 140)" />
        <g transform="translate(160 96)">
          <path d="M0 0 L44 22 L0 44 L-44 22 Z"
            fill="url(#f2-top)" stroke="#4D85FF" strokeOpacity="0.7" strokeWidth="1" />
          <path d="M-44 22 L0 44 L0 92 L-44 70 Z"
            fill="url(#f2-left)" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1" />
          <path d="M44 22 L0 44 L0 92 L44 70 Z"
            fill="url(#f2-right)" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1" />
          <path d="M0 8 L32 24 L0 40 L-32 24 Z"
            stroke="#4D85FF" strokeOpacity="0.6" strokeWidth="0.8" fill="none" />
          <circle cx="0" cy="24" r="4" fill="#4D85FF" />
        </g>
        <g>
          <circle cx="68" cy="152" r="6" fill="#0052FF" />
          <circle cx="68" cy="152" r="11" fill="#0052FF" fillOpacity="0.18" />
          <rect x="40" y="168" width="56" height="10" rx="3"
            fill="currentColor" fillOpacity="0.05"
            stroke="currentColor" strokeOpacity="0.16" />
        </g>
        <g>
          <circle cx="254" cy="128" r="5" fill="currentColor" fillOpacity="0.9" />
          <circle cx="254" cy="128" r="9" fill="currentColor" fillOpacity="0.14" />
          <rect x="232" y="142" width="52" height="10" rx="3"
            fill="currentColor" fillOpacity="0.05"
            stroke="currentColor" strokeOpacity="0.16" />
        </g>
        <g>
          <circle cx="214" cy="186" r="4" fill="#4D85FF" fillOpacity="0.9" />
          <circle cx="214" cy="186" r="8" fill="#4D85FF" fillOpacity="0.2" />
        </g>
        <g transform="translate(242 72)">
          <path d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2 Z"
            fill="currentColor" fillOpacity="0.9" />
        </g>
        <g transform="translate(96 92)">
          <path d="M0 -4 L1 -1 L4 0 L1 1 L0 4 L-1 1 L-4 0 L-1 -1 Z"
            fill="#4D85FF" />
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
        <defs>
          <linearGradient id="f3-card" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity="0.06" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="f3-bar" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0052FF" />
            <stop offset="1" stopColor="#4D85FF" />
          </linearGradient>
        </defs>
        <rect x="52" y="42" width="212" height="178" rx="12"
          fill="#EEF0F4"
          stroke="currentColor" strokeOpacity="0.18"
          transform="rotate(-2 160 130)" />
        <g transform="rotate(3 160 140)">
          <rect x="60" y="34" width="200" height="196" rx="12"
            fill="#FFFFFF" stroke="currentColor" strokeOpacity="0.26" />
          <rect x="74" y="50" width="80" height="7" rx="3.5" fill="currentColor" fillOpacity="0.58" />
          <rect x="74" y="64" width="46" height="5" rx="2.5" fill="currentColor" fillOpacity="0.26" />
          <rect x="74" y="84" width="172" height="4" rx="2" fill="currentColor" fillOpacity="0.1" />
          <rect x="74" y="84" width="116" height="4" rx="2" fill="url(#f3-bar)" />
          <rect x="228" y="79" width="18" height="5" rx="2" fill="currentColor" fillOpacity="0.46" />
          <line x1="74" y1="102" x2="246" y2="102" stroke="currentColor" strokeOpacity="0.08" />
          <g transform="translate(74 114)">
            <circle cx="4" cy="6" r="4" fill="rgb(16,185,129)" />
            <path d="M2 6 L3.5 7.5 L6 5" stroke="#FFFFFF" strokeWidth="1" fill="none" />
            <rect x="14" y="3" width="84" height="5" rx="2.5" fill="currentColor" fillOpacity="0.32" />
            <rect x="156" y="3" width="20" height="5" rx="2.5" fill="currentColor" fillOpacity="0.2" />
          </g>
          <g transform="translate(74 132)">
            <rect x="-4" y="0" width="176" height="62" rx="6" fill="#0052FF" fillOpacity="0.09" />
            <circle cx="4" cy="6" r="4" fill="#0052FF" />
            <circle cx="4" cy="6" r="7" fill="#0052FF" fillOpacity="0.28" />
            <rect x="14" y="3" width="92" height="5" rx="2.5" fill="currentColor" fillOpacity="0.6" />
            <rect x="156" y="3" width="14" height="5" rx="2.5" fill="#0052FF" fillOpacity="0.9" />
            <g transform="translate(16 18)">
              <rect x="0" y="0" width="9" height="9" rx="2" stroke="#0052FF" strokeOpacity="0.95" fill="#0052FF" fillOpacity="0.22" />
              <path d="M2 5 L4 7 L7 3" stroke="#0052FF" strokeWidth="1.2" fill="none" />
              <rect x="16" y="2" width="110" height="4" rx="2" fill="currentColor" fillOpacity="0.42" />
            </g>
            <g transform="translate(16 32)">
              <rect x="0" y="0" width="9" height="9" rx="2" stroke="#0052FF" strokeOpacity="0.95" fill="#0052FF" fillOpacity="0.22" />
              <path d="M2 5 L4 7 L7 3" stroke="#0052FF" strokeWidth="1.2" fill="none" />
              <rect x="16" y="2" width="84" height="4" rx="2" fill="currentColor" fillOpacity="0.32" />
            </g>
            <g transform="translate(16 46)">
              <rect x="0" y="0" width="9" height="9" rx="2" stroke="currentColor" strokeOpacity="0.35" fill="none" />
              <rect x="16" y="2" width="96" height="4" rx="2" fill="currentColor" fillOpacity="0.2" />
            </g>
          </g>
          <g transform="translate(74 204)">
            <circle cx="4" cy="6" r="4" stroke="currentColor" strokeOpacity="0.26" fill="none" />
            <rect x="14" y="3" width="72" height="5" rx="2.5" fill="currentColor" fillOpacity="0.2" />
            <rect x="156" y="3" width="20" height="5" rx="2.5" fill="currentColor" fillOpacity="0.12" />
          </g>
        </g>
      </svg>
    ),
  },
];

/* ============================================================= */
/* NODE DIAGRAM — The gap (Exploration 1, Direction E: data-art)  */
/* No labels. No pills. No legends. Order vs. noise.              */
/* ============================================================= */

function NodeDiagram() {
  // Deterministic PRNG (mulberry32) so the chaos renders identically every time
  function mulberry32(seed: number) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = seed;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return (((t ^ (t >>> 14)) >>> 0) / 4294967296);
    };
  }

  // Records — 4 monospace tags on a clean 2×2 grid, generous whitespace
  const records = [
    { x: 160, y: 230, label: "QMS" },
    { x: 340, y: 230, label: "PLM" },
    { x: 160, y: 370, label: "ERP" },
    { x: 340, y: 370, label: "MES" },
  ];

  // Inbox-real fragments. The chaos has VOICE, not taxonomy.
  const fragments = [
    "re:", "fwd:", "fwd: fwd:", "cc: 14", "FYI", "pls advise", "Teams",
    "Excel", "Outlook", "tracker_v7", "zoom link", "any update?",
    "!urgent", "v2", "v3_FINAL", "[img]", "see attached", "did we approve?",
    "final_FINAL", "pinging again", "WhatsApp", "[screenshot]", "QA draft",
    "meeting notes", "SharePoint", "???", "check this", "thanks!",
    "cc: all", "TBD", "agenda", "notes.docx", "[xlsx]", "resend",
    "pls confirm", "Slack DM", "minutes", "drafting", "follow-up",
    "approve?", "ASAP", "pls review", "waiting", "blocker", "[pdf]",
    "sign-off?", "verify", "last call", "deviation?", "batch #?",
    "whose call", "moved to next wk", "where's the file", "owner?",
    "screenshot.png", "tracker.xlsx", "notes_Q3", "recap", "+ marking",
    "bump", "ping", "??",
  ];

  // Chaos field — ~170 small nodes pulled toward three loose attractors
  const attractors = [
    { x: 920, y: 200, pull: 0.55 },
    { x: 1260, y: 320, pull: 0.6 },
    { x: 1100, y: 460, pull: 0.5 },
  ];

  const rng = mulberry32(19881119);
  type ChaosNode = {
    x: number; y: number; w: number; h: number; label: string; dim: number;
    drift: React.CSSProperties;
  };
  const chaos: ChaosNode[] = [];
  for (let i = 0; i < 170; i++) {
    const a = attractors[Math.floor(rng() * attractors.length)];
    const jitter = rng() * 2 * Math.PI;
    const r = Math.pow(rng(), 0.7) * 260;
    const x = Math.max(680, Math.min(1590, a.x + Math.cos(jitter) * r * (1 + rng() * 0.4)));
    const y = Math.max(40, Math.min(540, a.y + Math.sin(jitter) * r * (0.8 + rng() * 0.4)));
    const label = fragments[Math.floor(rng() * fragments.length)];
    const w = label.length * 5.2 + 10;
    const h = 15;
    const dim = 0.35 + rng() * 0.45;

    // Independent drift per node: 3 waypoints around the origin
    const amp = 3 + rng() * 4;
    const drift = {
      "--dx1": `${((rng() - 0.5) * 2 * amp).toFixed(2)}px`,
      "--dy1": `${((rng() - 0.5) * 2 * amp).toFixed(2)}px`,
      "--dx2": `${((rng() - 0.5) * 2 * amp).toFixed(2)}px`,
      "--dy2": `${((rng() - 0.5) * 2 * amp).toFixed(2)}px`,
      "--dx3": `${((rng() - 0.5) * 2 * amp).toFixed(2)}px`,
      "--dy3": `${((rng() - 0.5) * 2 * amp).toFixed(2)}px`,
      "--dur": `${(7 + rng() * 9).toFixed(1)}s`,
      "--del": `-${(rng() * 15).toFixed(1)}s`,
    } as React.CSSProperties;

    chaos.push({ x, y, w, h, label, dim, drift });
  }

  // Chaos connections — lots of crossings, most very faint
  const rng2 = mulberry32(73019);
  type ChaosLine = {
    x1: number; y1: number; x2: number; y2: number;
    dashed: boolean; op: number;
    drift: React.CSSProperties;
  };
  const lines: ChaosLine[] = [];
  for (let i = 0; i < 360; i++) {
    const a = Math.floor(rng2() * chaos.length);
    const b = Math.floor(rng2() * chaos.length);
    if (a === b) continue;
    const dx = chaos[a].x - chaos[b].x;
    const dy = chaos[a].y - chaos[b].y;
    if (Math.hypot(dx, dy) > 340) continue;
    const op = 0.04 + rng2() * 0.1;
    lines.push({
      x1: chaos[a].x, y1: chaos[a].y,
      x2: chaos[b].x, y2: chaos[b].y,
      dashed: rng2() < 0.45,
      op,
      drift: {
        "--op": op.toFixed(3),
        "--dur": `${(5 + rng2() * 6).toFixed(1)}s`,
        "--del": `-${(rng2() * 10).toFixed(1)}s`,
      } as React.CSSProperties,
    });
  }

  return (
    <svg
      className="lin-node-diagram"
      viewBox="0 0 1600 600"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Records live in systems — work lives between them. Four clean records on the left; a dense storm of inbox fragments on the right."
    >
      <defs>
        <radialGradient id="nd-glow-left" cx="0.5" cy="0.5" r="0.55">
          <stop offset="0" stopColor="rgba(94,106,210,0.18)" />
          <stop offset="1" stopColor="rgba(94,106,210,0)" />
        </radialGradient>
        <radialGradient id="nd-glow-right" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="rgba(248,113,113,0.12)" />
          <stop offset="1" stopColor="rgba(248,113,113,0)" />
        </radialGradient>
        <linearGradient id="nd-vein" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(122,140,255,0.6)" />
          <stop offset="0.55" stopColor="rgba(255,255,255,0.25)" />
          <stop offset="1" stopColor="rgba(248,113,113,0.05)" />
        </linearGradient>
      </defs>

      {/* Soft glows only (no zone labels, no dividers, no explanations) */}
      <ellipse cx="260" cy="300" rx="260" ry="220" fill="url(#nd-glow-left)" />
      <ellipse cx="1160" cy="320" rx="520" ry="340" fill="url(#nd-glow-right)" />

      {/* =============== LEFT — records (breathing) ================ */}
      <g>
        {records.map((r) => (
          <g key={r.label}>
            <rect
              x={r.x - 56}
              y={r.y - 22}
              width={112}
              height={44}
              rx={4}
              fill="transparent"
              stroke="rgba(122,140,255,0.55)"
              strokeWidth={1}
            />
            <text
              x={r.x}
              y={r.y + 5}
              textAnchor="middle"
              fontFamily="JetBrains Mono, monospace"
              fontSize="12"
              letterSpacing="3"
              fill="rgba(255,255,255,0.86)"
              fontWeight="500"
            >
              {r.label}
            </text>
          </g>
        ))}
        {/* a few clean internal connectors — just enough to imply order */}
        <g fill="none" stroke="rgba(122,140,255,0.32)" strokeWidth="1">
          <line x1="216" y1="230" x2="284" y2="230" />
          <line x1="216" y1="370" x2="284" y2="370" />
          <line x1="160" y1="252" x2="160" y2="348" />
          <line x1="340" y1="252" x2="340" y2="348" />
        </g>
      </g>

      {/* =============== the thread leaves, fractures =============== */}
      <g fill="none">
        {/* starts solid, becomes dashed, then explodes into strands */}
        <path
          d="M 396 300 L 500 300"
          stroke="rgba(122,140,255,0.55)"
          strokeWidth="1"
        />
        <path
          d="M 500 300 C 560 300 590 298 640 304"
          stroke="url(#nd-vein)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        {/* spray of fragments shooting into the storm */}
        <g stroke="rgba(248,113,113,0.28)" strokeWidth="0.7">
          <path d="M 640 304 C 700 280 760 240 820 220" strokeDasharray="2 4" />
          <path d="M 640 304 C 720 310 780 320 840 330" strokeDasharray="2 4" />
          <path d="M 640 304 C 700 330 760 370 820 400" strokeDasharray="2 4" />
          <path d="M 640 304 C 700 290 740 260 800 260" strokeDasharray="2 4" />
          <path d="M 640 304 C 690 340 720 390 760 440" strokeDasharray="2 4" />
        </g>
      </g>

      {/* =============== RIGHT — the storm =============== */}
      {/* connections first (so they sit behind the nodes) */}
      <g>
        {lines.map((l, i) => (
          <line
            key={i}
            className="lin-chaos-line"
            style={l.drift}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke={`rgba(255,255,255,${l.op})`}
            strokeWidth="0.6"
            strokeDasharray={l.dashed ? "2 3" : undefined}
          />
        ))}
      </g>
      <g>
        {chaos.map((n, i) => (
          <g key={i} className="lin-chaos-node" style={n.drift}>
            <rect
              x={n.x - n.w / 2}
              y={n.y - n.h / 2}
              width={n.w}
              height={n.h}
              rx={2.5}
              fill="transparent"
              stroke={`rgba(255,255,255,${n.dim * 0.55})`}
              strokeWidth="0.6"
            />
            <text
              x={n.x}
              y={n.y + 3.5}
              textAnchor="middle"
              fontFamily="Inter, sans-serif"
              fontSize="8.5"
              fill={`rgba(255,255,255,${n.dim})`}
            >
              {n.label}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function HomeLinearNodes() {
  const [painIdx, setPainIdx] = useState(0);

  useEffect(() => {
    document.title = "Unifize. The coordination layer for regulated teams";
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

      {/* Nav */}
      <nav className="lin-nav">
        <div className="lin-nav-inner">
          <Link to="/linear-nodes" className="lin-nav-logo" aria-label="Unifize">
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

      {/* Hero */}
      <section className="lin-hero">
        <h1 className="lin-hero-h1">
          Your systems of record and your systems of coordination are disconnected.
        </h1>
        <p className="lin-hero-subtitle">
          Your QMS, ERP, and PLM capture what is officially true. But the coordination that produces those records — the investigation, the evidence, the review cycles, the handoffs — runs through email, meetings, and spreadsheets. That gap has a cost. It is called coordination tax.
        </p>
        <div className="lin-hero-cta">
          <button className="lin-btn-primary">
            See how it works
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

      {/* Product preview — single full-width node diagram (the gap) */}
      <div className="lin-preview">
        <span className="lin-preview-glow" aria-hidden />
        <NodeDiagram />
      </div>

      {/* Concept map — the layer, in one picture */}
      <section className="lin-cm" id="concept">
        <div className="lin-cm-head">
          <div className="lin-cm-eyebrow">
            <span>The concept map.</span>
            <span className="line" />
          </div>
          <h2 className="lin-cm-h2">
            One layer between the system of record and where the work actually happens.
          </h2>
          <p className="lin-cm-sub">
            Systems of record stay authoritative. Collaboration stays in chat. Unifize is the layer where the thread, the decision, the evidence, and the approval bind to the record.
          </p>
        </div>

        <div className="lin-cm-stage">
          <svg
            className="lin-cm-svg"
            viewBox="0 0 1240 620"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Unifize concept map: systems of record on the left, collaboration channels and horizontal tools on the right, connected through the Unifize platform stack."
          >
            <defs>
              <linearGradient id="cm-outcomes" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#5E6AD2" stopOpacity="0.55" />
                <stop offset="1" stopColor="#5E6AD2" stopOpacity="0.18" />
              </linearGradient>
              <linearGradient id="cm-band" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="rgba(255,255,255,0.09)" />
                <stop offset="1" stopColor="rgba(255,255,255,0.02)" />
              </linearGradient>
              <linearGradient id="cm-trace" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="rgba(255,255,255,0.08)" />
                <stop offset="0.5" stopColor="rgba(255,255,255,0.32)" />
                <stop offset="1" stopColor="rgba(94,106,210,0.7)" />
              </linearGradient>
              <linearGradient id="cm-trace-r" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0" stopColor="rgba(255,255,255,0.08)" />
                <stop offset="0.5" stopColor="rgba(255,255,255,0.32)" />
                <stop offset="1" stopColor="rgba(94,106,210,0.7)" />
              </linearGradient>
              <radialGradient id="cm-card-glow" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="rgba(94,106,210,0.32)" />
                <stop offset="1" stopColor="rgba(94,106,210,0)" />
              </radialGradient>
            </defs>

            <g fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="3">
              <text x="60" y="72" fill="rgba(255,255,255,0.38)">SYSTEMS OF RECORD</text>
              <text x="1180" y="72" textAnchor="end" fill="rgba(255,255,255,0.38)">COLLABORATION CHANNELS</text>
              <text x="1180" y="568" textAnchor="end" fill="rgba(255,255,255,0.38)">HORIZONTAL TOOLS</text>
              <text x="60" y="568" fill="rgba(255,255,255,0.38)">CONNECTORS</text>
            </g>

            <g fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 168 140 L 260 140 L 260 186 L 400 186" stroke="url(#cm-trace)" strokeWidth="1.25" />
              <path d="M 128 230 L 236 230 L 236 230 L 400 230" stroke="url(#cm-trace)" strokeWidth="1.25" />
              <path d="M 168 320 L 280 320 L 280 276 L 400 276" stroke="url(#cm-trace)" strokeWidth="1.25" />
              <path d="M 128 410 L 256 410 L 256 320 L 400 320" stroke="url(#cm-trace)" strokeWidth="1.25" />
              <path d="M 400 400 L 300 400 L 300 500 L 168 500" stroke="rgba(94,106,210,0.55)" strokeWidth="1.25" strokeDasharray="5 5" />
            </g>

            <g fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 1072 140 L 960 140 L 960 186 L 840 186" stroke="url(#cm-trace-r)" strokeWidth="1.25" />
              <path d="M 1112 230 L 940 230 L 940 230 L 840 230" stroke="url(#cm-trace-r)" strokeWidth="1.25" />
              <path d="M 1072 410 L 964 410 L 964 364 L 840 364" stroke="url(#cm-trace-r)" strokeWidth="1.25" />
              <path d="M 1112 500 L 984 500 L 984 404 L 840 404" stroke="url(#cm-trace-r)" strokeWidth="1.25" />
              <path d="M 1072 320 L 940 320 L 940 276 L 840 276" stroke="rgba(255,255,255,0.16)" strokeWidth="1.25" strokeDasharray="3 5" />
            </g>

            <g fill="#5E6AD2">
              {[186, 230, 276, 320].map((y) => (
                <circle key={`lc-${y}`} cx="400" cy={y} r="2.5" />
              ))}
              {[186, 230, 276, 320, 364, 404].map((y) => (
                <circle key={`rc-${y}`} cx="840" cy={y} r="2.5" />
              ))}
            </g>

            <g fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="2.5" fill="rgba(122,168,255,0.85)">
              <text x="318" y="128">CONTEXT →</text>
              <text x="318" y="488">← WRITE-BACK</text>
              <text x="920" y="128" textAnchor="end">← DECISIONS</text>
              <text x="920" y="488" textAnchor="end">← ARTIFACTS</text>
            </g>

            <g>
              {[
                { cx: 130, cy: 140, label: "QMS" },
                { cx: 90, cy: 230, label: "PLM" },
                { cx: 130, cy: 320, label: "ERP" },
                { cx: 90, cy: 410, label: "MES" },
                { cx: 130, cy: 500, label: "LIMS" },
              ].map((n) => (
                <g key={n.label}>
                  <circle cx={n.cx} cy={n.cy} r="30"
                    fill="#101116"
                    stroke="rgba(255,255,255,0.22)" />
                  <circle cx={n.cx} cy={n.cy} r="30"
                    fill="none"
                    stroke="rgba(94,106,210,0.18)" strokeWidth="6" />
                  <text x={n.cx} y={n.cy + 4} textAnchor="middle"
                    fontFamily="JetBrains Mono, monospace" fontSize="11"
                    fontWeight="500" fill="#E8EAF6" letterSpacing="1">
                    {n.label}
                  </text>
                </g>
              ))}
            </g>

            <g>
              {[
                { cx: 1110, cy: 140, label: "TEAMS", fontSize: 10 },
                { cx: 1150, cy: 230, label: "OUTLOOK", fontSize: 9 },
                { cx: 1110, cy: 320, label: "MEETS", fontSize: 10 },
                { cx: 1110, cy: 410, label: "SHPOINT", fontSize: 9 },
                { cx: 1150, cy: 500, label: "EXCEL", fontSize: 10 },
              ].map((n) => (
                <g key={n.label}>
                  <circle cx={n.cx} cy={n.cy} r="30"
                    fill="#101116"
                    stroke="rgba(255,255,255,0.22)" />
                  <circle cx={n.cx} cy={n.cy} r="30"
                    fill="none"
                    stroke="rgba(94,106,210,0.12)" strokeWidth="6" />
                  <text x={n.cx} y={n.cy + 4} textAnchor="middle"
                    fontFamily="JetBrains Mono, monospace" fontSize={n.fontSize}
                    fontWeight="500" fill="#E8EAF6" letterSpacing="1">
                    {n.label}
                  </text>
                </g>
              ))}
            </g>

            <g>
              <ellipse cx="620" cy="310" rx="280" ry="220" fill="url(#cm-card-glow)" />

              <text x="620" y="92" textAnchor="middle"
                fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="3"
                fill="rgba(255,255,255,0.6)">
                UNIFIZE PLATFORM
              </text>

              <rect x="400" y="108" width="440" height="400" rx="16"
                fill="rgba(16,17,22,0.92)"
                stroke="rgba(255,255,255,0.18)" strokeWidth="1" />

              <g>
                <rect x="418" y="126" width="404" height="72" rx="10"
                  fill="url(#cm-outcomes)"
                  stroke="rgba(94,106,210,0.65)" strokeWidth="1" />
                <text x="436" y="154" fontFamily="Inter, sans-serif"
                  fontSize="15" fontWeight="500" fill="#FFFFFF">
                  Outcomes
                </text>
                <text x="436" y="178" fontFamily="Inter, sans-serif"
                  fontSize="11.5" fill="rgba(255,255,255,0.72)">
                  Faster closure. Fewer reopens. Weekly measurement.
                </text>
                <g>
                  <rect x="734" y="138" width="72" height="20" rx="10"
                    fill="rgba(94,106,210,0.3)"
                    stroke="rgba(94,106,210,0.9)" strokeWidth="0.8" />
                  <text x="770" y="151" textAnchor="middle"
                    fontFamily="JetBrains Mono, monospace" fontSize="8.5"
                    letterSpacing="1.8" fill="#D7DAF2">
                    AI ASSIST
                  </text>
                </g>
              </g>

              <g>
                <rect x="418" y="210" width="404" height="72" rx="10"
                  fill="url(#cm-band)"
                  stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
                <text x="436" y="238" fontFamily="Inter, sans-serif"
                  fontSize="14" fontWeight="500" fill="rgba(255,255,255,0.92)">
                  Product Suite
                </text>
                <text x="436" y="260" fontFamily="Inter, sans-serif"
                  fontSize="11.5" fill="rgba(255,255,255,0.5)">
                  Pre-validated workflows by industry and regulation.
                </text>
              </g>

              <g>
                <rect x="418" y="294" width="404" height="72" rx="10"
                  fill="url(#cm-band)"
                  stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
                <text x="436" y="322" fontFamily="Inter, sans-serif"
                  fontSize="14" fontWeight="500" fill="rgba(255,255,255,0.92)">
                  Workflow Components
                </text>
                <text x="436" y="344" fontFamily="Inter, sans-serif"
                  fontSize="11.5" fill="rgba(255,255,255,0.5)">
                  Stages, roles, approvals, evidence, forms, automations.
                </text>
              </g>

              <g>
                <rect x="418" y="378" width="404" height="72" rx="10"
                  fill="url(#cm-band)"
                  stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
                <text x="436" y="406" fontFamily="Inter, sans-serif"
                  fontSize="14" fontWeight="500" fill="rgba(255,255,255,0.92)">
                  Core Platform
                </text>
                <text x="436" y="428" fontFamily="Inter, sans-serif"
                  fontSize="11.5" fill="rgba(255,255,255,0.5)">
                  Audit, permissions, identity, reliability, data model.
                </text>
              </g>

              <g fill="rgba(255,255,255,0.14)">
                {[162, 246, 330, 414].map((y) => (
                  <circle key={`bd-${y}`} cx="822" cy={y} r="1.5" />
                ))}
              </g>

              <text x="620" y="488" textAnchor="middle"
                fontFamily="Inter, sans-serif" fontSize="11.5"
                fill="rgba(255,255,255,0.5)">
                Shared operational source of truth
              </text>
            </g>
          </svg>
        </div>

        <p className="lin-cm-callout">
          <strong>Shared operational source of truth</strong> — the set of threads, consistently captured and discoverable, so status and completion proof are trusted without reconstruction.
        </p>
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

      {/* Light theme section group */}
      <div className="lin-light">
        {/* Secondary headline */}
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

        {/* Fig grid */}
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

        {/* Bottom CTA */}
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

        {/* Footer */}
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
