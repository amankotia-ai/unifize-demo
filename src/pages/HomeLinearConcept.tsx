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
  padding: 72px 28px 40px;
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

/* ------------ CONCEPT MAP (HERO-ADJACENT) ------------ */
.lin-cm {
  max-width: 1340px; margin: 0 auto;
  padding: 0 28px 110px;
  position: relative;
}
.lin-cm-stage {
  position: relative;
  padding: 0;
  isolation: isolate;
  background: transparent;
  border: 0;
  overflow: visible;
}
.lin-cm-glow {
  position: absolute;
  left: 50%; top: -320px;
  transform: translateX(-50%);
  width: 1200px; max-width: 100%;
  height: 640px;
  background:
    radial-gradient(60% 55% at 50% 75%, rgba(94,106,210,0.4) 0%, rgba(94,106,210,0.14) 40%, rgba(94,106,210,0) 78%),
    radial-gradient(50% 55% at 25% 65%, rgba(124,139,240,0.24) 0%, rgba(124,139,240,0) 72%),
    radial-gradient(50% 55% at 78% 60%, rgba(80,120,220,0.2) 0%, rgba(80,120,220,0) 72%);
  filter: blur(32px);
  pointer-events: none;
  z-index: 0;
}
.lin-cm-svg {
  display: block; width: 100%; height: auto;
  position: relative; z-index: 1;
}

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

export default function HomeLinearConcept() {
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
          <Link to="/linear-concept" className="lin-nav-logo" aria-label="Unifize">
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

      {/* Concept map — placed directly under the hero */}
      <section className="lin-cm" id="concept">
        <span className="lin-cm-glow" aria-hidden />
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

            {/* Zone labels */}
            <g fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="3">
              <text x="60" y="72" fill="rgba(255,255,255,0.38)">SYSTEMS OF RECORD</text>
              <text x="1180" y="72" textAnchor="end" fill="rgba(255,255,255,0.38)">COLLABORATION CHANNELS</text>
              <text x="1180" y="568" textAnchor="end" fill="rgba(255,255,255,0.38)">HORIZONTAL TOOLS</text>
              <text x="60" y="568" fill="rgba(255,255,255,0.38)">CONNECTORS</text>
            </g>

            {/* Circuit traces — left (context in, write-back out) */}
            <g fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 168 140 L 260 140 L 260 186 L 400 186" stroke="url(#cm-trace)" strokeWidth="1.25" />
              <path d="M 128 230 L 236 230 L 236 230 L 400 230" stroke="url(#cm-trace)" strokeWidth="1.25" />
              <path d="M 168 320 L 280 320 L 280 276 L 400 276" stroke="url(#cm-trace)" strokeWidth="1.25" />
              <path d="M 128 410 L 256 410 L 256 320 L 400 320" stroke="url(#cm-trace)" strokeWidth="1.25" />
              <path d="M 400 400 L 300 400 L 300 500 L 168 500" stroke="rgba(94,106,210,0.55)" strokeWidth="1.25" strokeDasharray="5 5" />
            </g>

            {/* Circuit traces — right (decisions, artifacts) */}
            <g fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 1072 140 L 960 140 L 960 186 L 840 186" stroke="url(#cm-trace-r)" strokeWidth="1.25" />
              <path d="M 1112 230 L 940 230 L 940 230 L 840 230" stroke="url(#cm-trace-r)" strokeWidth="1.25" />
              <path d="M 1072 410 L 964 410 L 964 364 L 840 364" stroke="url(#cm-trace-r)" strokeWidth="1.25" />
              <path d="M 1112 500 L 984 500 L 984 404 L 840 404" stroke="url(#cm-trace-r)" strokeWidth="1.25" />
              <path d="M 1072 320 L 940 320 L 940 276 L 840 276" stroke="rgba(255,255,255,0.16)" strokeWidth="1.25" strokeDasharray="3 5" />
            </g>

            {/* Trace endpoint dots at platform edge */}
            <g fill="#5E6AD2">
              {[186, 230, 276, 320].map((y) => (
                <circle key={`lc-${y}`} cx="400" cy={y} r="2.5" />
              ))}
              {[186, 230, 276, 320, 364, 404].map((y) => (
                <circle key={`rc-${y}`} cx="840" cy={y} r="2.5" />
              ))}
            </g>

            {/* Arrow labels */}
            <g fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="2.5" fill="rgba(122,168,255,0.85)">
              <text x="318" y="128">CONTEXT →</text>
              <text x="318" y="488">← WRITE-BACK</text>
              <text x="920" y="128" textAnchor="end">← DECISIONS</text>
              <text x="920" y="488" textAnchor="end">← ARTIFACTS</text>
            </g>

            {/* LEFT NODES — systems of record */}
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

            {/* RIGHT NODES — collab + horizontal tools */}
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

            {/* CENTER — Unifize platform card */}
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

              {/* Band 1 — Outcomes + AI Assist */}
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

              {/* Band 2 — Product Suite */}
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

              {/* Band 3 — Workflow Components */}
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

              {/* Band 4 — Core Platform */}
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
