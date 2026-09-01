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

/* ------------ UNION (nodes LEFT, chat overflows RIGHT) ------------ */
.lin-union {
  position: relative;
  padding: 0 0 110px;
  overflow-x: clip;
  isolation: isolate;
}
.lin-union-glow {
  position: absolute;
  left: 45%; top: -380px;
  transform: translateX(-50%);
  width: 1200px; max-width: 100%;
  height: 700px;
  background:
    radial-gradient(60% 55% at 50% 75%, rgba(94,106,210,0.55) 0%, rgba(94,106,210,0.22) 40%, rgba(94,106,210,0) 78%),
    radial-gradient(50% 55% at 25% 65%, rgba(124,139,240,0.34) 0%, rgba(124,139,240,0) 72%),
    radial-gradient(50% 55% at 78% 60%, rgba(80,120,220,0.28) 0%, rgba(80,120,220,0) 72%);
  filter: blur(32px);
  pointer-events: none;
  z-index: 0;
  will-change: transform, opacity;
  animation: lin-glow-drift-top 22s ease-in-out infinite;
}
.lin-union-glow-bottom {
  position: absolute;
  left: 55%; top: 260px;
  transform: translateX(-50%);
  width: 1200px; max-width: 100%;
  height: 720px;
  background:
    radial-gradient(60% 55% at 50% 35%, rgba(94,106,210,0.5) 0%, rgba(94,106,210,0) 78%),
    radial-gradient(60% 55% at 50% 85%, rgba(94,106,210,0.3) 0%, rgba(94,106,210,0) 78%);
  filter: blur(38px);
  pointer-events: none;
  z-index: 0;
  will-change: transform, opacity;
  animation: lin-glow-drift-bottom 28s ease-in-out infinite;
}
@keyframes lin-glow-drift-top {
  0%, 100% {
    transform: translateX(-50%) translate3d(0, 0, 0) scale(1);
    opacity: 0.92;
  }
  33% {
    transform: translateX(-50%) translate3d(26px, -10px, 0) scale(1.04);
    opacity: 1;
  }
  66% {
    transform: translateX(-50%) translate3d(-22px, 6px, 0) scale(0.98);
    opacity: 0.9;
  }
}
@keyframes lin-glow-drift-bottom {
  0%, 100% {
    transform: translateX(-50%) translate3d(0, 0, 0) scale(1);
    opacity: 0.88;
  }
  40% {
    transform: translateX(-50%) translate3d(-24px, 10px, 0) scale(1.04);
    opacity: 1;
  }
  75% {
    transform: translateX(-50%) translate3d(18px, -6px, 0) scale(0.97);
    opacity: 0.9;
  }
}
@media (prefers-reduced-motion: reduce) {
  .lin-union-glow, .lin-union-glow-bottom { animation: none; }
}

/* Row: diagram (left, fixed) + chat (right, overflows viewport).
   No gap — chat's left edge meets the dock points on the diagram's right edge. */
.lin-union-row {
  position: relative;
  max-width: 1340px;
  margin: 0 auto;
  padding: 0 0 0 28px;
  display: flex;
  align-items: flex-start;
  gap: 0;
  z-index: 1;
}
.lin-union-diagram {
  flex: 0 0 320px;
  position: relative;
  z-index: 1;
}
.lin-union-diagram svg {
  display: block;
  width: 100%;
  height: auto;
}

.lin-union-chat {
  flex: 0 0 auto;
  width: 1280px;
  aspect-ratio: 16 / 9.6;
  border-radius: 14px;
  border: 1px solid rgba(94,106,210,0.4);
  background: var(--lin-bg-card);
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(94,106,210,0.28),
    0 50px 120px -30px rgba(94,106,210,0.35),
    0 30px 80px -20px rgba(0,0,0,0.8);
  position: relative;
  z-index: 2;
}
.lin-union-chat iframe {
  width: 100%; height: 100%; border: 0; display: block;
  background: #FBFBFC;
}
/* Subtle indigo gradient at chat's LEFT edge — fading rightward,
   reinforcing the visual flow from the node column into the thread. */
.lin-union-chat::after {
  content: "";
  position: absolute;
  top: 0; left: 0; bottom: 0;
  width: 18%;
  background: linear-gradient(
    90deg,
    rgba(94,106,210,0.18) 0%,
    rgba(94,106,210,0.08) 45%,
    rgba(94,106,210,0) 100%
  );
  pointer-events: none;
  z-index: 3;
  border-radius: 13px 0 0 13px;
}

/* Subtle data-flow animation — dashes march along each path */
@keyframes lin-flow-right {
  from { stroke-dashoffset: 0; }
  to   { stroke-dashoffset: -16; }
}
.lin-union-diagram .flow-trace {
  animation: lin-flow-right 2.4s linear infinite;
}
@media (prefers-reduced-motion: reduce) {
  .lin-union-diagram .flow-trace { animation: none; }
}

@media (max-width: 1100px) {
  .lin-union-chat { width: 1100px; }
}
@media (max-width: 960px) {
  .lin-union { padding-bottom: 72px; }
  .lin-union-row {
    flex-direction: column;
    padding: 0 28px;
  }
  .lin-union-diagram { display: none; }
  .lin-union-chat { width: 100%; }
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

type ConnectorNode = {
  cy: number;
  label: string;
  fontSize: number;
  variant: "context" | "decisions" | "artifacts" | "writeback";
};

type ConnectorGroup = {
  id: string;
  title: string;
  flow: string;
  centerY: number;
  nodes: ConnectorNode[];
};

// Diagram viewBox: 320 x 680 — sits to the LEFT of the chat window.
// Dock points at x=320 (touching chat left edge). Nodes centered at x=50 (r=20).
const NODE_CX = 50;
const NODE_R = 20;
const NODE_RIGHT = NODE_CX + NODE_R + 2; // slight offset to clear halo ring
const JUNCTION_X = 160;
const DOCK_X = 320;

// Three groups stacked vertically — symmetrical spacing and visible dividers.
const GROUPS: ConnectorGroup[] = [
  {
    id: "sor",
    title: "SYSTEMS OF RECORD",
    flow: "→ CONTEXT  ·  ← WRITE-BACK",
    centerY: 180,
    nodes: [
      { cy: 80,  label: "QMS",  fontSize: 11, variant: "context" },
      { cy: 130, label: "PLM",  fontSize: 11, variant: "context" },
      { cy: 180, label: "ERP",  fontSize: 11, variant: "context" },
      { cy: 230, label: "MES",  fontSize: 11, variant: "context" },
      { cy: 280, label: "LIMS", fontSize: 10, variant: "writeback" },
    ],
  },
  {
    id: "collab",
    title: "COLLAB CHANNELS",
    flow: "→ DECISIONS",
    centerY: 440,
    nodes: [
      { cy: 390, label: "TEAMS",   fontSize: 10, variant: "decisions" },
      { cy: 440, label: "OUTLOOK", fontSize: 8,  variant: "decisions" },
      { cy: 490, label: "MEETS",   fontSize: 10, variant: "decisions" },
    ],
  },
  {
    id: "tools",
    title: "HORIZONTAL TOOLS",
    flow: "→ ARTIFACTS",
    centerY: 625,
    nodes: [
      { cy: 600, label: "SHPOINT", fontSize: 8,  variant: "artifacts" },
      { cy: 650, label: "EXCEL",   fontSize: 10, variant: "artifacts" },
    ],
  },
];

// Horizontal dividers between groups (dashed lines)
const DIVIDERS = [318, 528];

// Flat list (for traces & dock points)
const CONNECTORS: ConnectorNode[] = GROUPS.flatMap((g) => g.nodes);

export default function HomeLinearV3() {
  const [painIdx, setPainIdx] = useState(0);

  useEffect(() => {
    document.title = "Unifize. One seamless layer";
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
          <Link to="/linear-v3" className="lin-nav-logo" aria-label="Unifize">
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

      {/* Unified: nodes on the LEFT, chat overflows from the RIGHT */}
      <section className="lin-union" id="concept">
        <span className="lin-union-glow" aria-hidden />
        <span className="lin-union-glow-bottom" aria-hidden />

        <div className="lin-union-row">
          {/* Connector diagram — sits to the LEFT of the chat */}
          <div className="lin-union-diagram">
            <svg
              viewBox="0 0 320 680"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Connectors to the left of the Unifize thread: systems of record, collaboration channels, and horizontal tools flow directly in and out."
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Group dividers — subtle horizontal dashed lines between clusters */}
              <g stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="3 6">
                {DIVIDERS.map((y) => (
                  <line key={`div-${y}`} x1={0} y1={y} x2={320} y2={y} />
                ))}
              </g>

              {/* Per-group tree connectors — one trunk per group that forks into branches */}
              <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                {GROUPS.map((g) => {
                  const ys = g.nodes.map((n) => n.cy);
                  const topY = Math.min(...ys);
                  const bottomY = Math.max(...ys);
                  const stroke = "rgba(140,155,230,0.85)";
                  return (
                    <g key={`tree-${g.id}`}>
                      {/* Trunk: chat dock (right) → junction */}
                      <path
                        className="flow-trace"
                        d={`M ${DOCK_X} ${g.centerY} L ${JUNCTION_X} ${g.centerY}`}
                        stroke={stroke}
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                      />
                      {/* Vertical branch: topmost node y → bottommost node y (only if >1 node) */}
                      {g.nodes.length > 1 && (
                        <path
                          className="flow-trace"
                          d={`M ${JUNCTION_X} ${topY} L ${JUNCTION_X} ${bottomY}`}
                          stroke={stroke}
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                        />
                      )}
                      {/* Horizontal branches from junction to each node */}
                      {g.nodes.map((n) => (
                        <path
                          key={`branch-${n.label}`}
                          className="flow-trace"
                          d={`M ${JUNCTION_X} ${n.cy} L ${NODE_RIGHT} ${n.cy}`}
                          stroke={stroke}
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                        />
                      ))}
                    </g>
                  );
                })}
              </g>

              {/* Dock points — one per group at right edge, aligned with each trunk */}
              <g>
                {GROUPS.map((g) => (
                  <g key={`dock-${g.id}`}>
                    <circle cx={DOCK_X} cy={g.centerY} r="5.5" fill="#8C9BE6" fillOpacity="0.22" />
                    <circle cx={DOCK_X} cy={g.centerY} r="2.75" fill="#8C9BE6" />
                  </g>
                ))}
              </g>

              {/* Connector nodes */}
              <g>
                {CONNECTORS.map((n) => {
                  const isWriteback = n.variant === "writeback";
                  return (
                    <g key={`node-${n.label}`}>
                      <circle cx={NODE_CX} cy={n.cy} r={NODE_R}
                        fill="#101116"
                        stroke="rgba(255,255,255,0.22)" />
                      <circle cx={NODE_CX} cy={n.cy} r={NODE_R}
                        fill="none"
                        stroke={isWriteback ? "rgba(180,140,255,0.32)" : "rgba(94,106,210,0.22)"}
                        strokeWidth="5" />
                      <text x={NODE_CX} y={n.cy + 3} textAnchor="middle"
                        fontFamily="JetBrains Mono, monospace" fontSize={n.fontSize}
                        fontWeight="500" fill="#E8EAF6" letterSpacing="1">
                        {n.label}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* Per-group labels — sit ON the trunk at each group's junction,
                  with a dark background masking the dashed trunk line beneath. */}
              <g fontFamily="JetBrains Mono, monospace">
                {GROUPS.map((g) => {
                  const boxW = 116;
                  const boxH = 30;
                  const boxX = 178;
                  const boxCx = boxX + boxW / 2;
                  return (
                    <g key={`label-${g.id}`}>
                      <rect
                        x={boxX} y={g.centerY - boxH / 2}
                        width={boxW} height={boxH}
                        rx="5"
                        fill="#0B0C10"
                        stroke="rgba(255,255,255,0.14)"
                        strokeWidth="1"
                      />
                      <text
                        x={boxCx} y={g.centerY - 3}
                        textAnchor="middle"
                        fontSize="7" letterSpacing="1.2"
                        fontWeight="500"
                        fill="rgba(255,255,255,0.8)"
                      >
                        {g.title}
                      </text>
                      <text
                        x={boxCx} y={g.centerY + 9}
                        textAnchor="middle"
                        fontSize="5.8" letterSpacing="0.55"
                        fill={g.id === "sor" ? "rgba(170,160,230,0.88)" : "rgba(122,168,255,0.88)"}
                      >
                        {g.flow}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Chat window — overflows to the right of the viewport */}
          <div className="lin-union-chat">
            <iframe
              src="/chat?embed=1"
              title="Unifize live — the thread, the decision, the evidence"
              loading="lazy"
            />
          </div>
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

      {/* Light theme section group */}
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
