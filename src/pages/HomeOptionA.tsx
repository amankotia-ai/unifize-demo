import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * Option A · Structural diagnosis.
 * Mirrors HomeOptionB structure and tokens.
 * Illustrations replaced with diagrammatic / architectural variants:
 *  - Hero: parallel-rails diagram (SoR rail + SoC rail) instead of rotated UI frames.
 *  - Symptoms: six architectural fault cards instead of native-habitat UI mocks.
 *  - Timeline: same component shape, parallel-rails treatment with named lanes.
 *  - Diptych BEFORE: fragmentation node graph instead of retro Win-style overlapping windows.
 *  - Diptych AFTER, layer iframe, ROI dashboard, records table, CTA: identical to Option B.
 */

const STYLES = `
.opa-root {
  --paper: #EFF1F5;
  --paper-card: #FFFFFF;
  --paper-line: rgba(11,13,17,0.08);
  --ink: #0B0D11;
  --ink-muted: rgba(11,13,17,0.62);
  --ink-faint: rgba(11,13,17,0.42);
  --ink-line: rgba(11,13,17,0.08);
  --ink-line-strong: rgba(11,13,17,0.14);
  --bg: #08090A;
  --bg-card: #14151B;
  --border: rgba(255,255,255,0.08);
  --border-strong: rgba(255,255,255,0.14);
  --text: #FFFFFF;
  --text-muted: rgba(255,255,255,0.56);
  --text-faint: rgba(255,255,255,0.38);
  --accent: #5E6AD2;
  --accent-soft: #7C8BF0;
  --warm-accent: #F59E0B;
  --red: #EF4444;
  --green: #10B981;
  --gradient-accent: linear-gradient(90deg, #9AA6F6 0%, #7C8BF0 35%, #F59E0B 70%, #EF4444 100%);

  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  background: var(--paper);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
  letter-spacing: -0.011em;
  min-height: 100vh;
}
.opa-root * { box-sizing: border-box; }
.opa-root .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
.opa-root a { color: inherit; text-decoration: none; }

.opa-nav {
  position: sticky; top: 0; z-index: 50;
  backdrop-filter: saturate(160%) blur(18px);
  background: rgba(250,250,251,0.88);
  border-bottom: 1px solid rgba(11,13,17,0.05);
  transition: background .25s ease, border-color .25s ease;
}
.opa-nav-inner {
  max-width: 1240px; margin: 0 auto;
  padding: 12px 28px;
  display: flex; align-items: center; gap: 32px;
}
.opa-nav-logo { display: inline-flex; align-items: center; color: var(--ink); transition: color .25s ease; }
.opa-nav-logo-img { display: block; height: 24px; width: auto; transition: filter .25s ease; }
.opa-nav-items { display: flex; gap: 24px; font-size: 13.5px; color: var(--ink-muted); transition: color .25s ease; }
.opa-nav-items a { transition: color .15s ease; }
.opa-nav-items a:hover { color: var(--ink); }
.opa-nav-actions { margin-left: auto; display: flex; gap: 16px; align-items: center; }
.opa-nav-link { font-size: 13.5px; color: var(--ink-muted); transition: color .25s ease; }
.opa-nav-link:hover { color: var(--ink); }
.opa-nav-btn {
  font-size: 13px; font-weight: 500;
  background: var(--ink); color: var(--paper);
  padding: 7px 14px; border-radius: 999px;
  border: 1px solid var(--ink); cursor: pointer;
  transition: opacity .15s ease, background .25s ease, color .25s ease, border-color .25s ease;
}
.opa-nav-btn:hover { opacity: 0.88; }
@media (max-width: 860px) { .opa-nav-items { display: none; } }

.opa-nav.is-dark { background: rgba(8,9,10,0.86); border-bottom-color: rgba(255,255,255,0.05); }
.opa-nav.is-dark .opa-nav-logo { color: var(--text); }
.opa-nav.is-dark .opa-nav-logo-img { filter: brightness(0) invert(1); }
.opa-nav.is-dark .opa-nav-items { color: var(--text-muted); }
.opa-nav.is-dark .opa-nav-items a:hover { color: var(--text); }
.opa-nav.is-dark .opa-nav-link { color: var(--text-muted); }
.opa-nav.is-dark .opa-nav-link:hover { color: var(--text); }
.opa-nav.is-dark .opa-nav-btn { background: var(--text); color: #0B0D11; border-color: var(--text); }

.opa-section { max-width: 1240px; margin: 0 auto; padding: 120px 28px; }
.opa-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-muted);
  display: inline-flex; align-items: center; gap: 9px;
  padding: 6px 12px 6px 10px;
  background: var(--paper-card);
  border: 1px solid var(--ink-line);
  border-radius: 999px;
  margin-bottom: 28px;
  box-shadow: 0 1px 2px rgba(11,13,17,0.025);
}
.opa-eyebrow .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 3px rgba(94,106,210,0.16); flex-shrink: 0; }
.opa-eyebrow .num { color: var(--ink); font-weight: 500; }
.opa-eyebrow .sep { color: var(--ink-line-strong); opacity: 0.7; }
.opa-eyebrow .name { color: var(--ink); }
.opa-h2 {
  font-size: clamp(32px, 4.6vw, 56px);
  line-height: 1.04; letter-spacing: -0.034em;
  font-weight: 500; max-width: 22ch; margin: 0;
  color: var(--ink);
}
.opa-h2 .dim { color: var(--ink-muted); }
.opa-sub { margin-top: 22px; font-size: 16px; color: var(--ink-muted); max-width: 64ch; line-height: 1.5; }

.opa-btn-primary {
  font-family: inherit; font-size: 14px; font-weight: 500;
  background: var(--ink); color: var(--paper);
  padding: 11px 20px; border-radius: 999px;
  border: 1px solid var(--ink); cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px;
  transition: opacity .15s ease;
}
.opa-btn-primary:hover { opacity: 0.88; }
.opa-btn-ghost {
  font-family: inherit; font-size: 14px; font-weight: 500;
  background: transparent; color: var(--ink);
  padding: 11px 18px; border-radius: 999px;
  border: 1px solid var(--ink-line); cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px;
  transition: border-color .15s ease, background .15s ease;
}
.opa-btn-ghost:hover { border-color: var(--ink-line-strong); background: rgba(11,13,17,0.03); }

.opa-dark { background: var(--bg); color: var(--text); }
.opa-dark .opa-eyebrow { background: rgba(255,255,255,0.04); border-color: var(--border); color: var(--text-muted); box-shadow: none; }
.opa-dark .opa-eyebrow .num, .opa-dark .opa-eyebrow .name { color: var(--text); }
.opa-dark .opa-eyebrow .sep { color: rgba(255,255,255,0.22); }
.opa-dark .opa-eyebrow .dot { box-shadow: 0 0 0 3px rgba(94,106,210,0.26); }
.opa-dark .opa-h2 { color: var(--text); }
.opa-dark .opa-h2 .dim { color: var(--text-muted); }
.opa-dark .opa-sub { color: var(--text-muted); }
.opa-dark .opa-btn-primary { background: var(--text); color: #0B0D11; border-color: var(--text); }
.opa-dark .opa-btn-primary:hover { opacity: 0.88; }
.opa-dark .opa-btn-ghost { color: var(--text); border-color: var(--border-strong); }
.opa-dark .opa-btn-ghost:hover { background: rgba(255,255,255,0.04); }

.opa-hero {
  max-width: 1240px; margin: 0 auto;
  padding: 96px 28px 80px;
  display: grid; grid-template-columns: 1fr 1.05fr; gap: 48px; align-items: center;
}
@media (max-width: 980px) { .opa-hero { grid-template-columns: 1fr; } }
.opa-hero-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 24px;
  display: inline-flex; align-items: center; gap: 10px;
}
.opa-hero-tag .dot { width: 6px; height: 6px; border-radius: 50%; background: #0052FF; box-shadow: 0 0 0 4px rgba(0,82,255,0.18); }
.opa-hero-h1 {
  font-size: clamp(36px, 5.2vw, 64px);
  font-weight: 450; line-height: 1.04; letter-spacing: -0.034em;
  margin: 0; color: var(--ink);
  text-wrap: balance;
}
.opa-hero-h1 .em { color: var(--ink-muted); font-weight: 450; }
.opa-hero-h1 .accent { color: #0052FF; }
.opa-hero-sub { margin-top: 32px; font-size: 17.5px; color: var(--ink-muted); max-width: 38ch; line-height: 1.45; }
.opa-hero-cta { margin-top: 36px; display: flex; gap: 12px; flex-wrap: wrap; }

.opa-hero-band {
  position: relative;
  background: var(--bg);
  color: var(--text);
  border-bottom: 1px solid var(--border);
  overflow: hidden;
  min-height: 100vh;
  display: flex; align-items: center;
}
.opa-hero-band > .opa-hero { width: 100%; }
.opa-hero-band::before {
  content: ""; position: absolute; inset: 0;
  background:
    radial-gradient(900px 480px at 12% 18%, rgba(94,106,210,0.18), transparent 70%),
    radial-gradient(700px 420px at 88% 82%, rgba(245,158,11,0.10), transparent 70%);
  pointer-events: none;
}
.opa-hero-band > * { position: relative; z-index: 1; }

.opa-hero-band .opa-hero-tag { color: var(--text-faint); }
.opa-hero-band .opa-hero-tag .dot { box-shadow: 0 0 0 4px rgba(0,82,255,0.28); }
.opa-hero-band .opa-hero-h1 { color: var(--text); }
.opa-hero-band .opa-hero-h1 .em { color: var(--text-muted); }
.opa-hero-band .opa-hero-h1 .accent { color: #4D85FF; }
.opa-hero-band .opa-hero-sub { color: var(--text-muted); }
.opa-hero-band .opa-btn-primary { background: var(--text); color: #0B0D11; border-color: var(--text); }
.opa-hero-band .opa-btn-primary:hover { opacity: 0.88; }
.opa-hero-band .opa-btn-ghost { color: var(--text); border-color: var(--border-strong); }
.opa-hero-band .opa-btn-ghost:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.22); }

.opa-rails {
  position: relative;
  width: 100%; max-width: 820px; margin-left: auto;
  min-height: 70vh;
  background: var(--bg-card);
  border: 1px solid var(--border-strong);
  border-radius: 14px;
  padding: 32px 32px 28px;
  box-shadow:
    0 40px 80px -32px rgba(0,0,0,0.6),
    0 14px 32px -16px rgba(0,0,0,0.45),
    0 0 0 1px rgba(255,255,255,0.02);
  display: flex;
  flex-direction: column;
}
.opa-rails-headline {
  display: flex;
  align-items: stretch;
  gap: 16px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}
.opa-rails-headline-mark {
  width: 2px;
  background: linear-gradient(180deg, #FFB94A 0%, #E68B1A 100%);
  border-radius: 1px;
  flex-shrink: 0;
}
.opa-rails-headline-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.opa-rails-header {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text);
}
.opa-rails-subhead {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 14px;
  font-weight: 450;
  letter-spacing: -0.005em;
  color: var(--text-muted);
}

/* Time recovered: an overlay that sits inside the With rail track,
   in the empty trail after the blue blocks end (32% to 100%).
   Labels the recovered cycle time inside the bar's chrome. */
.opa-recovered-overlay {
  position: absolute;
  left: 32%;
  right: 0;
  top: 0; bottom: 0;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 18px;
  pointer-events: none;
}
.opa-recovered-line {
  flex: 1;
  height: 1px;
}
.opa-recovered-line.left {
  background: linear-gradient(90deg, rgba(0,82,255,0.06), rgba(0,82,255,0.5));
}
.opa-recovered-line.right {
  background: linear-gradient(90deg, rgba(0,82,255,0.5), rgba(0,82,255,0.06));
}
.opa-recovered-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px; letter-spacing: 0.22em; text-transform: uppercase;
  color: #5BA0FF;
  white-space: nowrap;
}
.opa-rails-eb {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--text-faint);
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 22px;
}
.opa-rails-eb .who { color: var(--text); font-weight: 500; }
.opa-rails-stack {
  display: flex; flex-direction: column;
  gap: 28px;
  flex: 1;
  justify-content: center;
  padding-top: 24px;
  padding-bottom: 12px;
}
.opa-rail { position: relative; }
.opa-rail-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.18em; text-transform: uppercase;
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 8px;
}
.opa-rail-label .name { color: var(--text); }
.opa-rail-label .count { color: var(--text-faint); }

.opa-rail-line { height: 64px; position: relative; border-radius: 4px; }
.opa-rail.sor .opa-rail-line {
  background: linear-gradient(180deg, rgba(94,106,210,0.10), rgba(94,106,210,0.02));
  border: 1px solid rgba(94,106,210,0.22);
}
.opa-rail.soc .opa-rail-line {
  background: linear-gradient(180deg, rgba(245,158,11,0.06), rgba(245,158,11,0.02));
  border: 1px solid rgba(245,158,11,0.18);
  height: 138px;
  padding: 14px 14px 24px;
}

/* Histogram inside SoC rail */
.opa-histogram {
  position: relative;
  width: 100%; height: 100%;
}
.opa-histogram-bars {
  display: flex; align-items: flex-end;
  gap: 2px;
  height: 100%;
  padding-bottom: 14px;
}
.opa-histogram-bar {
  flex: 1;
  display: flex;
  flex-direction: column-reverse;
  align-items: stretch;
  position: relative;
  min-width: 0;
}
.opa-histogram-bar .seg {
  width: 100%;
  display: block;
  border-radius: 1px;
}
.opa-histogram-bar .seg + .seg { margin-bottom: 1px; }
.opa-histogram-bar .seg.teams { background: #4D86FF; }
.opa-histogram-bar .seg.outlook { background: #F0A33A; }
.opa-histogram-bar .seg.sharepoint { background: #B8BEC7; }
.opa-histogram-bar .seg.excel { background: #0B8A5C; }
.opa-histogram-bar.peak::before {
  content: "";
  position: absolute; top: -6px; left: 50%;
  transform: translateX(-50%);
  width: 4px; height: 4px; border-radius: 50%;
  background: rgba(245,158,11,0.7);
}

.opa-histogram-axis {
  position: absolute;
  left: 0; right: 0; bottom: 4px;
  height: 14px;
  pointer-events: none;
}
.opa-histogram-axis .tick {
  position: absolute;
  transform: translateX(-50%);
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-faint);
  white-space: nowrap;
}
.opa-histogram-baseline {
  position: absolute;
  left: 4px; right: 4px;
  bottom: 18px;
  height: 1px;
  background: rgba(255,255,255,0.06);
}

/* Drop-lines through the gap zone */
.opa-rail-gap-droplines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.opa-rail-gap-droplines .dl {
  position: absolute;
  top: 0; bottom: 0;
  width: 1px;
  background: linear-gradient(180deg,
    rgba(245,158,11,0.55) 0%,
    rgba(245,158,11,0.18) 45%,
    rgba(245,158,11,0.18) 55%,
    rgba(245,158,11,0.55) 100%);
  transform: translateX(-50%);
}

/* Two-Gantt comparison */
.opa-gantt-row {
  position: relative;
  width: 100%;
}
.opa-gantt-row .gh {
  display: flex; justify-content: space-between; align-items: baseline;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.18em; text-transform: uppercase;
  margin-bottom: 10px;
}
.opa-gantt-row .gh .name { color: var(--text); font-weight: 500; }
.opa-gantt-row .gh .days { color: var(--text-faint); }
.opa-gantt-row.without .gh .days { color: #F0A33A; }
.opa-gantt-row.with .gh .days { color: #4D85FF; }

.opa-gantt-track {
  position: relative;
  height: 140px;
  background: rgba(0,0,0,0.35);
  border: 1px solid rgba(0,0,0,0.45);
  border-radius: 7px;
  overflow: hidden;
  display: flex;
  box-shadow:
    inset 0 4px 9px rgba(0,0,0,0.55),
    inset 0 -1px 0 rgba(255,255,255,0.025);
}
.opa-gantt-phase {
  display: flex;
  height: 100%;
  border-right: 1px solid rgba(0,0,0,0.45);
}
.opa-gantt-phase:last-child { border-right: 0; }
.opa-gantt-seg { height: 100%; position: relative; }

/* Active segments cycle through four warm hues to suggest fragmentation
   across different tools. No tool naming on the hero. The colour variation
   alone communicates "different things." Pattern repeats every 4 phases. */
.opa-gantt-row.without .opa-gantt-phase:nth-child(4n+1) .opa-gantt-seg.active {
  background: linear-gradient(180deg, #FFB94A 0%, #E68B1A 100%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.28),
    inset 0 -1px 0 rgba(120,60,10,0.4),
    0 0 14px rgba(255,170,60,0.32);
}
.opa-gantt-row.without .opa-gantt-phase:nth-child(4n+2) .opa-gantt-seg.active {
  background: linear-gradient(180deg, #F47950 0%, #C9461F 100%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.26),
    inset 0 -1px 0 rgba(100,40,10,0.42),
    0 0 14px rgba(244,121,80,0.32);
}
.opa-gantt-row.without .opa-gantt-phase:nth-child(4n+3) .opa-gantt-seg.active {
  background: linear-gradient(180deg, #F5D682 0%, #B59138 100%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.32),
    inset 0 -1px 0 rgba(120,80,20,0.4),
    0 0 14px rgba(245,214,130,0.28);
}
.opa-gantt-row.without .opa-gantt-phase:nth-child(4n+4) .opa-gantt-seg.active {
  background: linear-gradient(180deg, #D69445 0%, #95621A 100%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.24),
    inset 0 -1px 0 rgba(80,40,10,0.42),
    0 0 14px rgba(214,148,69,0.30);
}

/* Wait: dense, decayed, oppressive. Two layered patterns and a subtle inset shadow. */
.opa-gantt-row.without .opa-gantt-seg.waiting {
  background:
    repeating-linear-gradient(
      -45deg,
      rgba(120,75,30,0.55) 0,
      rgba(120,75,30,0.55) 5px,
      rgba(40,25,10,0.55) 5px,
      rgba(40,25,10,0.55) 10px
    );
  box-shadow:
    inset 0 1px 1px rgba(0,0,0,0.45),
    inset 0 -1px 0 rgba(0,0,0,0.35);
}

/* With rail: signal blue cutting through noise. Luminous gradient, inner highlight, outer halo. */
.opa-gantt-row.with .opa-gantt-seg.active {
  background: linear-gradient(180deg, #2870FF 0%, #0042D9 100%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.32),
    inset 0 -1px 0 rgba(0,30,100,0.45),
    0 0 22px rgba(0,82,255,0.45);
}

.opa-gantt-labels {
  position: relative;
  margin-top: 8px;
  height: 14px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--text-faint);
}
.opa-gantt-labels span {
  position: absolute;
  transform: translateX(-50%);
  white-space: nowrap;
}


/* Shared reveal animation used by the rotating eyebrow and wait labels. */
@keyframes opa-pain-in {
  0%   { opacity: 0; transform: translateY(90%); filter: blur(6px); }
  60%  { opacity: 1; filter: blur(0); }
  100% { opacity: 1; transform: translateY(0); filter: blur(0); }
}

/* Rotating domain eyebrow */
.opa-hero-tag-rot {
  display: inline-block;
  animation: opa-pain-in 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* Wait annotations. Four labels per chart split across two rows so they
   never collide horizontally. Indices 0 and 2 sit above the bar.
   Indices 1 and 3 sit below. Ticks point toward the bar in each row. */
.opa-wait-annotation {
  position: relative;
  height: 32px;
}
.opa-wait-annotation.top { margin-bottom: 8px; }
.opa-wait-annotation.bottom { margin-top: 8px; }

.opa-wait-anchor {
  position: absolute;
  transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center;
  gap: 4px;
  pointer-events: none;
  white-space: nowrap;
}
.opa-wait-annotation.top .opa-wait-anchor { bottom: 0; }
.opa-wait-annotation.bottom .opa-wait-anchor { top: 0; }

.opa-wait-tick { width: 1px; height: 12px; }
.opa-wait-annotation.top .opa-wait-tick {
  background: linear-gradient(0deg, rgba(245,158,11,0.6), rgba(245,158,11,0));
  margin-bottom: -2px;
}
.opa-wait-annotation.bottom .opa-wait-tick {
  background: linear-gradient(180deg, rgba(245,158,11,0.6), rgba(245,158,11,0));
  margin-top: -2px;
}

.opa-wait-label {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 11.5px; font-weight: 500; letter-spacing: -0.003em;
  color: #F59E0B;
  animation: opa-pain-in 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

@media (prefers-reduced-motion: reduce) {
  .opa-hero-tag-rot, .opa-wait-label { animation: none; }
}

.opa-rail-axis {
  position: absolute; top: 50%; left: 16px; right: 16px;
  height: 1px; background: var(--border);
}
.opa-rail-node {
  position: absolute; top: 50%;
  width: 10px; height: 10px; border-radius: 50%;
  transform: translate(-50%, -50%);
  background: var(--accent);
  box-shadow: 0 0 0 3px rgba(94,106,210,0.22);
}
.opa-rail-node-label {
  position: absolute; top: 50%;
  transform: translate(-50%, -28px);
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--text-muted);
  white-space: nowrap;
}
.opa-rail-chip {
  position: absolute; top: 50%;
  transform: translateY(-50%);
  width: 5px; height: 5px; border-radius: 50%;
  opacity: 0.92;
}
.opa-rail-chip.outlook { background: #F0A33A; }
.opa-rail-chip.teams { background: #4D86FF; }
.opa-rail-chip.sharepoint { background: #B8BEC7; }
.opa-rail-chip.excel { background: #0B8A5C; }

.opa-rail-gap {
  position: relative;
  text-align: center;
  padding: 14px 0;
  height: 44px;
}
.opa-rail-gap .lab {
  position: relative;
  z-index: 1;
  display: inline-flex; align-items: center; gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--warm-accent);
  background: var(--bg-card);
  padding: 0 14px;
}
.opa-rail-gap .lab::before, .opa-rail-gap .lab::after {
  content: ""; width: 36px; height: 1px;
  background: rgba(245,158,11,0.32);
}
.opa-rail-foot {
  margin-top: 28px;
  display: flex; justify-content: space-between;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--text-faint);
}
.opa-rail-foot .strong { color: var(--text); }

.opa-symptoms {
  margin-top: 60px;
  position: relative;
  overflow: hidden;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  padding: 6px 0;
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%);
}
.opa-symptoms-track {
  display: flex; gap: 24px;
  width: max-content;
  padding: 4px 12px;
  animation: opa-symptoms-marquee 80s linear infinite;
  will-change: transform;
}
.opa-symptoms:hover .opa-symptoms-track,
.opa-symptoms:focus-within .opa-symptoms-track {
  animation-play-state: paused;
}
@media (prefers-reduced-motion: reduce) { .opa-symptoms-track { animation: none; } }
@keyframes opa-symptoms-marquee {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(-50%, 0, 0); }
}
@media (max-width: 760px) { .opa-symptoms-track { animation-duration: 60s; } }

.opa-fault {
  flex: 0 0 380px; width: 380px;
  background: var(--paper-card);
  border: 1px solid var(--ink-line);
  border-radius: 10px;
  display: flex; flex-direction: column;
  overflow: hidden;
  min-height: 420px;
  position: relative;
  box-shadow: 0 1px 2px rgba(11,13,17,0.025);
}
.opa-fault-head {
  display: flex; justify-content: space-between; align-items: center;
  padding: 11px 16px;
  border-bottom: 1px solid var(--ink-line);
  background: linear-gradient(180deg, rgba(11,13,17,0.022), rgba(11,13,17,0.005));
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
}
.opa-fault-head .key { display: inline-flex; align-items: center; gap: 8px; color: var(--ink); font-weight: 500; }
.opa-fault-head .key .num { color: var(--ink-faint); }
.opa-fault-head .meta { color: var(--ink-faint); }
.opa-fault-art {
  background: #F7F8FA;
  border-bottom: 1px solid var(--ink-line);
  padding: 22px;
  height: 200px;
  display: flex; align-items: center; justify-content: center;
}
.opa-fault-art svg { width: 100%; height: 100%; }
.opa-fault-body {
  flex: 1;
  padding: 16px 18px 14px;
  display: flex; flex-direction: column; gap: 8px;
}
.opa-fault-body .title { font-size: 16px; font-weight: 500; letter-spacing: -0.014em; color: var(--ink); }
.opa-fault-body .text { font-size: 13.5px; line-height: 1.45; color: var(--ink-muted); }
.opa-fault-foot {
  border-top: 1px dashed var(--ink-line);
  padding: 13px 18px 16px;
  background: rgba(11,13,17,0.022);
  display: flex; justify-content: flex-start; align-items: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase;
}
.opa-fault-foot .role { color: var(--ink-faint); }
.opa-fault-foot .stamp { display: inline-flex; align-items: center; gap: 6px; color: var(--warm-accent); }
.opa-fault-foot .stamp .dot { width: 5px; height: 5px; border-radius: 50%; background: var(--warm-accent); }

.opa-timeline-band { position: relative; margin: 80px -80px 0; }
.opa-tl-rail { position: relative; height: 84px; margin-bottom: 22px; }
.opa-tl-rail-line {
  position: absolute; top: 50%; left: 0; right: 0;
  height: 1px; background: var(--ink-line-strong);
}
.opa-tl-milestone { position: absolute; top: 0; height: 84px; z-index: 2; }
.opa-tl-milestone .title {
  position: absolute; top: 50%; left: 0;
  transform: translateY(calc(-100% - 12px));
  font-size: 14px; font-weight: 500;
  color: var(--ink);
  letter-spacing: -0.011em; white-space: nowrap;
}
.opa-tl-milestone .node {
  position: absolute; top: 50%; left: 0;
  transform: translateY(-50%);
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--ink);
  box-shadow: 0 0 0 4px var(--paper);
}
.opa-tl-milestone .day {
  position: absolute; top: 50%; left: 0;
  transform: translateY(14px);
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-muted);
  white-space: nowrap;
}
.opa-tl-milestone.end .title, .opa-tl-milestone.end .day { left: auto; right: 0; }
.opa-tl-milestone.end .node { left: auto; right: 0; transform: translateY(-50%); }

.opa-tl-lanes { display: flex; flex-direction: column; gap: 0; border-top: 1px solid var(--ink-line); }
.opa-tl-lane {
  display: grid; grid-template-columns: 130px 1fr;
  border-bottom: 1px solid var(--ink-line);
  align-items: stretch;
}
.opa-tl-lane:last-child { border-bottom: 0; }
.opa-tl-lane-label {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 18px 14px 0;
  border-right: 1px solid var(--ink-line);
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-muted);
}
.opa-tl-lane-label .dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.opa-tl-lane.outlook .dot { background: #F0A33A; }
.opa-tl-lane.teams .dot { background: #4D86FF; }
.opa-tl-lane.sharepoint .dot { background: #B8BEC7; }
.opa-tl-lane.excel .dot { background: #0B8A5C; }
.opa-tl-lane-track { position: relative; height: 38px; padding: 0 16px; }
.opa-tl-lane-track .gridline { position: absolute; top: 0; bottom: 0; width: 1px; background: var(--ink-line); }
.opa-tl-lane-track .activity {
  position: absolute; top: 50%;
  transform: translateY(-50%);
  width: 8px; height: 8px;
  border-radius: 50%;
  border: 1px solid rgba(11,13,17,0.04);
}
.opa-tl-lane.outlook .activity { background: #F0A33A; box-shadow: 0 0 0 2px rgba(240,163,58,0.12); }
.opa-tl-lane.teams .activity { background: #4D86FF; box-shadow: 0 0 0 2px rgba(77,134,255,0.12); }
.opa-tl-lane.sharepoint .activity { background: #B8BEC7; box-shadow: 0 0 0 2px rgba(184,190,199,0.16); }
.opa-tl-lane.excel .activity { background: #0B8A5C; box-shadow: 0 0 0 2px rgba(11,138,92,0.12); }

.opa-tl-aggregate {
  display: flex; justify-content: space-between; align-items: baseline;
  padding-top: 14px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ink-faint);
}
.opa-tl-aggregate .strong { color: var(--ink); }

.opa-tl-milestone, .opa-tl-lane {
  opacity: 0; transform: translateY(8px);
  transition: opacity .9s ease, transform .9s ease;
}
.opa-tl-milestone { transition-delay: calc(var(--i, 0) * 90ms); }
.opa-tl-lane     { transition-delay: calc(var(--i, 0) * 140ms + 360ms); }
.opa-timeline-band.is-revealed .opa-tl-milestone,
.opa-timeline-band.is-revealed .opa-tl-lane {
  opacity: 1; transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  .opa-tl-milestone, .opa-tl-lane { opacity: 1; transform: none; transition: none; }
}
@media (max-width: 1380px) { .opa-timeline-band { margin: 80px -32px 0; } }
@media (max-width: 1100px) { .opa-timeline-band { margin: 80px 0 0; } }
@media (max-width: 760px) {
  .opa-tl-rail { height: 70px; }
  .opa-tl-milestone { height: 70px; }
  .opa-tl-milestone .title { font-size: 12px; }
  .opa-tl-lane { grid-template-columns: 90px 1fr; }
  .opa-tl-lane-label { padding: 10px 12px 10px 0; font-size: 9.5px; }
}

@keyframes opa-gradient-pan {
  0%, 100% { background-position: 0% 50%; }
  50%      { background-position: 100% 50%; }
}
.opa-name-reveal {
  font-style: italic;
  background: var(--gradient-accent);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: opa-gradient-pan 14s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) { .opa-name-reveal { animation: none; } }
.opa-tax-def { margin: 28px 0 0; max-width: 56ch; font-size: 19px; color: var(--ink-muted); line-height: 1.45; }

.opa-layer { max-height: 120vh; overflow: hidden; position: relative; padding-bottom: 0 !important; }
.opa-preview { margin-top: 56px; position: relative; isolation: isolate; }
.opa-preview-glow {
  position: absolute;
  left: 50%; top: -260px;
  transform: translateX(-50%);
  width: 1100px; max-width: 100%;
  height: 600px;
  background:
    radial-gradient(60% 55% at 50% 75%, rgba(94,106,210,0.45) 0%, rgba(94,106,210,0.18) 40%, rgba(94,106,210,0) 78%),
    radial-gradient(50% 55% at 25% 65%, rgba(124,139,240,0.28) 0%, rgba(124,139,240,0) 72%),
    radial-gradient(50% 55% at 78% 60%, rgba(80,120,220,0.22) 0%, rgba(80,120,220,0) 72%);
  filter: blur(32px); pointer-events: none; z-index: 0;
}
.opa-preview-frame {
  position: relative; z-index: 1;
  border-radius: 14px 14px 0 0; overflow: hidden;
  border: 1px solid rgba(255,255,255,0.08); border-bottom: 0;
  background: var(--paper-card);
  box-shadow:
    0 50px 120px -30px rgba(94,106,210,0.25),
    0 30px 80px -20px rgba(0,0,0,0.55),
    0 0 0 1px rgba(255,255,255,0.04);
  height: 80vh;
  -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 72%, transparent 100%);
  mask-image: linear-gradient(180deg, #000 0%, #000 72%, transparent 100%);
}
.opa-preview-frame iframe { width: 100%; height: 100%; border: 0; display: block; }

.opa-diptych { margin-top: 56px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
@media (max-width: 980px) { .opa-diptych { grid-template-columns: 1fr; } }
.opa-diptych-pane {
  border: 1px solid var(--ink-line);
  border-radius: 14px;
  background: var(--paper-card);
  min-height: 540px;
  display: flex; flex-direction: column;
  overflow: hidden;
}
.opa-pane-head { padding: 24px 28px 18px; display: flex; flex-direction: column; gap: 12px; }
.opa-diptych-pane .head {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--ink-faint);
  display: flex; justify-content: space-between; align-items: center;
}
.opa-diptych-pane .head .state { font-size: 9.5px; letter-spacing: 0.18em; }
.opa-diptych-pane.before .head .state { color: var(--red); }
.opa-diptych-pane.after .head .state { color: var(--green); }
.opa-diptych-pane .title { font-size: 20px; font-weight: 500; letter-spacing: -0.022em; color: var(--ink); }
.opa-diptych-pane.after { background: #FBFBFC; border-color: rgba(0,82,255,0.18); }

.opa-frag {
  position: relative;
  flex: 1;
  margin: 0 14px 14px;
  background:
    radial-gradient(circle at 1px 1px, rgba(11,13,17,0.05) 1px, transparent 1px),
    rgba(11,13,17,0.025);
  background-size: 18px 18px, 100% 100%;
  border: 1px solid rgba(11,13,17,0.06);
  border-radius: 8px;
  overflow: hidden;
  padding: 12px;
}
.opa-frag svg { display: block; width: 100%; height: 100%; }

.opa-mini-app {
  background: #FBFBFC;
  border-top: 1px solid var(--ink-line);
  display: flex; flex-direction: column;
  flex: 1;
}
.opa-mini-bar { display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: #fff; border-bottom: 1px solid var(--ink-line); }
.opa-mini-bar .dots { display: inline-flex; gap: 5px; }
.opa-mini-bar .dots i { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: rgba(11,13,17,0.10); }
.opa-mini-bar .dots i:nth-child(1) { background: rgba(239,68,68,0.55); }
.opa-mini-bar .dots i:nth-child(2) { background: rgba(245,158,11,0.55); }
.opa-mini-bar .dots i:nth-child(3) { background: rgba(16,185,129,0.55); }
.opa-mini-bar .crumb { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--ink-faint); text-transform: uppercase; letter-spacing: 0.06em; }
.opa-mini-bar .spacer { flex: 1; }
.opa-mini-bar .kbd { font-family: 'JetBrains Mono', monospace; font-size: 9px; border: 1px solid var(--ink-line); padding: 1px 5px; border-radius: 2px; color: var(--ink-faint); }
.opa-mini-thread-head {
  padding: 18px 20px 16px;
  border-bottom: 1px solid var(--ink-line);
  background: #fff;
}
.opa-mini-thread-head .eb {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ink-faint);
  display: inline-flex; align-items: center; gap: 7px;
  margin-bottom: 8px;
}
.opa-mini-thread-head .eb .dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: #0052FF;
  box-shadow: 0 0 0 3px #F0F4FF;
}
.opa-mini-thread-head .id {
  display: flex; align-items: center; gap: 10px;
  font-size: 18px; font-weight: 600; letter-spacing: -0.014em;
  color: var(--ink);
}
.opa-mini-thread-head .id .badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; font-weight: 500; letter-spacing: 0.06em;
  padding: 2px 7px; border-radius: 3px;
  background: rgba(11,138,92,0.10); color: #0B8A5C;
  text-transform: uppercase;
}
.opa-mini-thread-head .meta {
  margin-top: 5px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; color: var(--ink-muted);
  display: flex; gap: 8px; align-items: center;
}
.opa-mini-thread-head .meta .sep { color: var(--ink-line-strong); }

.opa-mini-thread {
  flex: 1;
  background: #fff;
  padding: 14px 20px 22px 20px;
  position: relative;
}
.opa-mini-thread-line {
  position: absolute;
  top: 30px; bottom: 30px;
  left: 32px;
  width: 1px;
  background: var(--ink-line-strong);
  z-index: 1;
}
.opa-mini-thread-event {
  display: flex; align-items: flex-start; gap: 16px;
  padding: 7px 0;
  position: relative;
  z-index: 2;
}
.opa-mini-thread-event .node {
  flex-shrink: 0;
  width: 11px; height: 11px;
  margin-left: 7px; margin-top: 5px;
  border-radius: 50%;
  background: var(--paper-card);
  border: 2px solid var(--ink);
  box-shadow: 0 0 0 3px #fff;
}
.opa-mini-thread-event.ai .node {
  background: var(--accent);
  border: 0;
  border-radius: 2px;
  width: 10px; height: 10px;
  margin-left: 7.5px; margin-top: 6px;
  transform: rotate(45deg);
  box-shadow: 0 0 0 3px #fff;
}
.opa-mini-thread-event .content {
  flex: 1; min-width: 0;
}
.opa-mini-thread-event .meta {
  display: flex; align-items: baseline; gap: 10px;
  margin-bottom: 1px;
}
.opa-mini-thread-event .day {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px;
  color: var(--ink-faint);
  letter-spacing: 0.08em; text-transform: uppercase;
}
.opa-mini-thread-event .kind {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; font-weight: 600;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ink);
}
.opa-mini-thread-event.ai .kind { color: var(--accent); }
.opa-mini-thread-event .desc {
  font-size: 12.5px;
  line-height: 1.45;
  color: var(--ink-muted);
}

.opa-app-card {
  margin-top: 56px;
  background: var(--paper-card);
  border: 1px solid var(--ink-line);
  border-radius: 14px;
  overflow: hidden;
  color: var(--ink);
  box-shadow: 0 24px 60px -28px rgba(11,13,17,0.10), 0 8px 20px -12px rgba(11,13,17,0.06), 0 0 0 1px rgba(11,13,17,0.03);
}
.opa-app-chrome { display: flex; align-items: center; gap: 14px; padding: 11px 14px; background: var(--paper); border-bottom: 1px solid var(--ink-line); }
.opa-app-chrome .dots { display: inline-flex; gap: 6px; }
.opa-app-chrome .dots i { display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: rgba(11,13,17,0.10); }
.opa-app-chrome .dots i:nth-child(1) { background: rgba(239,68,68,0.55); }
.opa-app-chrome .dots i:nth-child(2) { background: rgba(245,158,11,0.55); }
.opa-app-chrome .dots i:nth-child(3) { background: rgba(16,185,129,0.55); }
.opa-app-chrome .url { flex: 1; text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.04em; color: var(--ink-muted); }
.opa-app-chrome .pill { font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent); border: 1px solid rgba(94,106,210,0.32); background: rgba(94,106,210,0.08); padding: 2px 8px; border-radius: 999px; }

.opa-dash-bar { display: flex; align-items: center; gap: 16px; padding: 12px 18px; background: var(--paper); border-bottom: 1px solid var(--ink-line); }
.opa-dash-bar .crumb { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-faint); display: flex; gap: 7px; align-items: center; }
.opa-dash-bar .crumb .sep { color: var(--ink-line-strong); }
.opa-dash-bar .crumb .cur { color: var(--ink); }
.opa-dash-bar .spacer { flex: 1; }
.opa-dash-bar .seg { display: inline-flex; border: 1px solid var(--ink-line-strong); border-radius: 4px; background: var(--paper-card); padding: 2px; gap: 2px; }
.opa-dash-bar .seg button { all: unset; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: 0.06em; font-weight: 500; padding: 4px 9px; border-radius: 3px; color: var(--ink-muted); cursor: pointer; }
.opa-dash-bar .seg button.active { background: rgba(94,106,210,0.12); color: var(--accent); }
.opa-dash-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--ink-line); border-bottom: 1px solid var(--ink-line); }
@media (max-width: 900px) { .opa-dash-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 540px) { .opa-dash-grid { grid-template-columns: 1fr; } }
.opa-kpi { background: var(--paper-card); padding: 18px 20px 16px; display: flex; flex-direction: column; gap: 4px; position: relative; overflow: hidden; }
.opa-kpi-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-faint); }
.opa-kpi-value { font-size: 30px; font-weight: 500; letter-spacing: -0.025em; display: flex; align-items: baseline; gap: 4px; color: var(--ink); line-height: 1.05; }
.opa-kpi-value .unit { font-size: 13px; color: var(--ink-muted); font-weight: 500; letter-spacing: -0.005em; }
.opa-kpi-delta { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; margin-top: 4px; letter-spacing: 0.04em; }
.opa-kpi-delta.up { color: var(--green); }
.opa-kpi-delta.down { color: var(--red); }
.opa-kpi-spark { position: absolute; right: 14px; bottom: 14px; opacity: 0.45; }
.opa-dash-row { display: grid; grid-template-columns: 1.4fr 1fr; gap: 1px; background: var(--ink-line); }
@media (max-width: 900px) { .opa-dash-row { grid-template-columns: 1fr; } }
.opa-dash-card { background: var(--paper-card); padding: 16px 20px 18px; }
.opa-dash-card .head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--ink-line); margin-bottom: 14px; }
.opa-dash-card .head h5 { font-size: 14px; font-weight: 500; letter-spacing: -0.012em; margin: 0; color: var(--ink); }
.opa-dash-card .legend { display: flex; gap: 14px; font-size: 11px; color: var(--ink-muted); }
.opa-dash-card .legend .sw { display: inline-flex; align-items: center; gap: 6px; }
.opa-dash-card .legend .sw i { display: inline-block; width: 8px; height: 8px; border-radius: 2px; }
.opa-dash-card .legend .sw.grey i { background: var(--ink-line-strong); }
.opa-dash-card .legend .sw.accent i { background: var(--accent); }
.opa-dash-card .meta { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-faint); }
.opa-dash-card .chart { height: 156px; position: relative; }
.opa-dash-bars { display: flex; flex-direction: column; gap: 12px; }
.opa-dash-bars .row .top { display: flex; justify-content: space-between; font-size: 12.5px; margin-bottom: 5px; color: var(--ink); }
.opa-dash-bars .row .top .v { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: var(--ink-muted); }
.opa-dash-bars .row .bar { height: 5px; background: rgba(11,13,17,0.06); border-radius: 2px; overflow: hidden; }
.opa-dash-bars .row .bar .fill { height: 100%; background: var(--ink-line-strong); border-radius: 2px; }
.opa-dash-bars .row.lead .bar .fill { background: var(--accent); }

.opa-records-bar { display: flex; align-items: center; gap: 14px; padding: 12px 18px; background: var(--paper); border-bottom: 1px solid var(--ink-line); }
.opa-records-bar .crumb { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-faint); display: flex; gap: 7px; align-items: center; }
.opa-records-bar .crumb .sep { color: var(--ink-line-strong); }
.opa-records-bar .crumb .cur { color: var(--ink); }
.opa-records-bar .spacer { flex: 1; }
.opa-records-bar .filters { display: flex; gap: 6px; }
.opa-records-bar .fbtn { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: 0.04em; padding: 4px 9px; background: var(--paper-card); border: 1px solid var(--ink-line-strong); border-radius: 4px; color: var(--ink); display: inline-flex; align-items: center; gap: 5px; }
.opa-records-bar .fbtn .ca { color: var(--ink-faint); font-size: 9px; }
.opa-records-table-wrap { overflow: auto; }
.opa-tbl { width: 100%; border-collapse: collapse; font-size: 13px; }
.opa-tbl th { text-align: left; font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-faint); font-weight: 500; padding: 11px 18px; border-bottom: 1px solid var(--ink-line); background: var(--paper); white-space: nowrap; }
.opa-tbl td { padding: 13px 18px; border-bottom: 1px solid var(--ink-line); color: var(--ink); vertical-align: middle; white-space: nowrap; }
.opa-tbl tr:last-child td { border-bottom: 0; }
.opa-tbl tr:hover td { background: var(--paper); }
.opa-tbl .rec { display: flex; align-items: center; gap: 10px; font-weight: 500; }
.opa-tbl .rec .mk { width: 3px; height: 16px; border-radius: 1px; background: var(--accent); }
.opa-tbl .rec.evidence .mk { background: var(--ink-line-strong); }
.opa-tbl .rec.hypothesis .mk { background: var(--warm-accent); }
.opa-tbl .rec .id { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: var(--ink-faint); font-weight: 400; margin-left: 4px; }
.opa-tbl .person { display: flex; align-items: center; gap: 10px; font-size: 13px; }
.opa-tbl .av { width: 26px; height: 26px; border-radius: 50%; color: white; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 9.5px; font-weight: 600; flex-shrink: 0; }
.opa-tbl .av.av-1 { background: linear-gradient(180deg, #8AA9FF, #5775D9); }
.opa-tbl .av.av-2 { background: linear-gradient(180deg, #8DBDA6, #5E9277); }
.opa-tbl .av.av-3 { background: linear-gradient(180deg, #E1A879, #B47C4E); }
.opa-tbl .av.av-4 { background: linear-gradient(180deg, #D29ACC, #A06BA5); }
.opa-tbl .av.av-5 { background: linear-gradient(180deg, #B8BEC7, #8B93A0); color: #2B2F38; }
.opa-tbl .av.av-6 { background: linear-gradient(180deg, #9EB4CE, #6D8AAC); }
.opa-tbl .av.av-7 { background: linear-gradient(180deg, #CEBE9E, #A08E6E); }
.opa-tbl .av.av-8 { background: linear-gradient(180deg, #9ECEBE, #6EA08E); }
.opa-tbl .mono { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--ink-muted); }
.opa-tbl .age { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--ink-faint); }
.opa-records-foot { padding: 11px 18px; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-faint); background: var(--paper); border-top: 1px solid var(--ink-line); display: flex; justify-content: space-between; }

.opa-chat-badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.16em; text-transform: uppercase;
  padding: 3px 8px; border-radius: 3px;
  font-weight: 500; line-height: 1;
}
.opa-chat-badge .pulse { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
.opa-chat-badge.ok { background: rgba(16,185,129,0.10); color: var(--green); }
.opa-chat-badge.info { background: rgba(94,106,210,0.10); color: var(--accent); }
.opa-chat-badge.warn { background: rgba(245,158,11,0.12); color: var(--warm-accent); }

.opa-pnl {
  margin-top: 56px;
  background: #FDFCF9;
  border: 1px solid var(--ink-line);
  border-radius: 12px;
  padding: 40px 56px 32px;
  box-shadow: 0 1px 2px rgba(11,13,17,0.025), 0 32px 80px -40px rgba(11,13,17,0.18);
}
.opa-pnl-head {
  display: flex; justify-content: space-between; align-items: baseline;
  padding-bottom: 18px; margin-bottom: 18px;
  border-bottom: 2px solid var(--ink);
}
.opa-pnl-title { font-size: 20px; font-weight: 600; letter-spacing: -0.018em; color: var(--ink); }
.opa-pnl-sub {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--ink-faint);
}
.opa-pnl-rows { display: flex; flex-direction: column; }
.opa-pnl-row {
  display: flex; justify-content: space-between; align-items: baseline; gap: 32px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(11,13,17,0.06);
}
.opa-pnl-row:last-child { border-bottom: 0; }
.opa-pnl-row-main { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.opa-pnl-row-label { font-size: 16px; color: var(--ink); letter-spacing: -0.011em; font-weight: 500; }
.opa-pnl-row-attr {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.02em; color: var(--ink-faint);
}
.opa-pnl-row-amount {
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px; font-weight: 500; letter-spacing: -0.012em;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}
.opa-pnl-total {
  display: flex; justify-content: space-between; align-items: baseline;
  margin-top: 18px; padding-top: 18px;
  border-top: 2px solid var(--ink);
}
.opa-pnl-total-label { font-size: 18px; font-weight: 600; letter-spacing: -0.014em; color: var(--ink); }
.opa-pnl-total-amount {
  font-family: 'JetBrains Mono', monospace;
  font-size: 28px; font-weight: 600; letter-spacing: -0.022em;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}
.opa-pnl-cta {
  display: flex; align-items: center; gap: 14px;
  margin-top: 24px; padding-top: 18px;
  border-top: 1px dashed var(--ink-line);
}
.opa-pnl-cta-link {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 14px; font-weight: 500; color: var(--ink);
  padding: 8px 14px; border-radius: 999px;
  border: 1px solid var(--ink);
  transition: background .15s ease, color .15s ease;
}
.opa-pnl-cta-link:hover { background: var(--ink); color: var(--paper); }
.opa-pnl-cta-sub {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; color: var(--ink-faint);
  letter-spacing: 0.04em; text-transform: uppercase;
}
@media (max-width: 720px) {
  .opa-pnl { padding: 24px 20px 20px; }
  .opa-pnl-head { flex-direction: column; align-items: flex-start; gap: 6px; }
  .opa-pnl-row { flex-direction: column; align-items: flex-start; gap: 8px; }
  .opa-pnl-row-amount { font-size: 20px; }
  .opa-pnl-total { flex-direction: column; align-items: flex-start; gap: 6px; }
  .opa-pnl-total-amount { font-size: 24px; }
  .opa-pnl-cta { flex-direction: column; align-items: flex-start; gap: 10px; }
}

.opa-cta { background: var(--paper-card); padding: 120px 28px; text-align: center; border-top: 1px solid var(--ink-line); }
.opa-cta-inner { max-width: 760px; margin: 0 auto; }
.opa-cta-h { font-size: clamp(36px, 5vw, 60px); font-weight: 500; letter-spacing: -0.038em; line-height: 1.04; margin: 0; color: var(--ink); }
.opa-cta-sub { margin: 22px auto 0; max-width: 50ch; font-size: 16px; color: var(--ink-muted); line-height: 1.5; }
.opa-cta-actions { margin-top: 36px; display: inline-flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
.opa-cta-quote { margin: 80px auto 0; max-width: 640px; padding: 32px 28px; background: var(--paper); border: 1px solid var(--ink-line); border-radius: 14px; text-align: left; }
.opa-cta-quote .text { font-size: 18px; line-height: 1.4; letter-spacing: -0.018em; color: var(--ink); font-style: italic; }
.opa-cta-quote .who { margin-top: 18px; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-faint); }

.opa-foot { background: var(--paper); border-top: 1px solid var(--ink-line); padding: 28px; }
.opa-foot-inner { max-width: 1240px; margin: 0 auto; display: flex; justify-content: space-between; font-size: 12px; color: var(--ink-faint); flex-wrap: wrap; gap: 16px; }
`;

/* ----------------------------------------------------------------------------
   Architectural fault SVGs (six small diagrams that fill the .opa-fault-art
   container in the symptom marquee)
---------------------------------------------------------------------------- */

function FaultDisconnect() {
  return (
    <svg viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <line x1="20" y1="56" x2="180" y2="56" stroke="#5E6AD2" strokeWidth="1.6" />
      <line x1="140" y1="104" x2="300" y2="104" stroke="rgba(11,13,17,0.32)" strokeWidth="1.6" />
      <circle cx="20" cy="56" r="5" fill="#5E6AD2" />
      <circle cx="180" cy="56" r="5" fill="#5E6AD2" />
      <circle cx="140" cy="104" r="5" fill="rgba(11,13,17,0.5)" />
      <circle cx="300" cy="104" r="5" fill="rgba(11,13,17,0.5)" />
      <path d="M 180 56 Q 200 80 140 104" stroke="#F59E0B" strokeWidth="1.4" strokeDasharray="3 3" fill="none" />
      <text x="206" y="74" fontFamily="JetBrains Mono" fontSize="8" letterSpacing="0.14em" fill="#8A5400">NO HANDOFF</text>
      <text x="20" y="42" fontFamily="JetBrains Mono" fontSize="8.5" letterSpacing="0.14em" fill="rgba(11,13,17,0.6)">RECORD</text>
      <text x="140" y="128" fontFamily="JetBrains Mono" fontSize="8.5" letterSpacing="0.14em" fill="rgba(11,13,17,0.6)">COORDINATION</text>
    </svg>
  );
}

function FaultAuditGap() {
  return (
    <svg viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="20" y="24" width="100" height="112" rx="6" fill="#fff" stroke="rgba(11,13,17,0.18)" />
      <rect x="32" y="38" width="60" height="4" rx="2" fill="rgba(11,13,17,0.5)" />
      <rect x="32" y="50" width="44" height="3" rx="1.5" fill="rgba(11,13,17,0.22)" />
      <line x1="32" y1="64" x2="108" y2="64" stroke="rgba(11,13,17,0.08)" />
      <rect x="32" y="74" width="64" height="3" rx="1.5" fill="rgba(11,13,17,0.28)" />
      <rect x="32" y="84" width="50" height="3" rx="1.5" fill="rgba(11,13,17,0.18)" />
      <rect x="32" y="94" width="58" height="3" rx="1.5" fill="rgba(11,13,17,0.18)" />
      <rect x="32" y="112" width="50" height="14" rx="999" fill="rgba(16,185,129,0.10)" stroke="rgba(16,185,129,0.32)" />
      <text x="40" y="122" fontFamily="JetBrains Mono" fontSize="7" letterSpacing="0.14em" fill="#0B8A5C">CLOSED</text>
      <g opacity="0.85">
        {[160, 200, 240, 280].map((cx, i) => (
          <rect key={cx} x={cx - 12} y={40 + (i % 2) * 18} width="36" height="14" rx="3" fill="#fff" stroke="rgba(11,13,17,0.18)" />
        ))}
        {[180, 220, 260].map((cx, i) => (
          <rect key={`b${cx}`} x={cx - 14} y={84 + (i % 2) * 18} width="36" height="14" rx="3" fill="#fff" stroke="rgba(11,13,17,0.18)" />
        ))}
      </g>
      <g stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="2 4" fill="none">
        <path d="M 120 60 L 156 50" />
        <path d="M 120 80 L 170 92" />
        <path d="M 120 100 L 180 112" />
      </g>
      <text x="140" y="140" fontFamily="JetBrains Mono" fontSize="8" letterSpacing="0.14em" fill="#8A5400">UNLINKED EVIDENCE</text>
    </svg>
  );
}

function FaultReconstruction() {
  return (
    <svg viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <g>
        {[
          { x: 24, y: 30, w: 50, h: 14 },
          { x: 36, y: 60, w: 46, h: 12 },
          { x: 24, y: 90, w: 60, h: 14 },
          { x: 42, y: 116, w: 40, h: 12 },
          { x: 244, y: 32, w: 50, h: 14 },
          { x: 232, y: 62, w: 54, h: 12 },
          { x: 248, y: 92, w: 44, h: 14 },
          { x: 234, y: 118, w: 56, h: 12 },
        ].map((f, i) => (
          <rect key={i} x={f.x} y={f.y} width={f.w} height={f.h} rx="2" fill="#fff" stroke="rgba(11,13,17,0.18)" />
        ))}
      </g>
      <g stroke="rgba(11,13,17,0.22)" strokeWidth="1" fill="none" strokeDasharray="2 3">
        <path d="M 80 38 L 152 80" />
        <path d="M 84 66 L 152 80" />
        <path d="M 84 96 L 152 80" />
        <path d="M 84 122 L 152 80" />
        <path d="M 240 38 L 168 80" />
        <path d="M 232 68 L 168 80" />
        <path d="M 248 98 L 168 80" />
        <path d="M 234 124 L 168 80" />
      </g>
      <rect x="142" y="62" width="36" height="36" rx="4" fill="rgba(245,158,11,0.06)" stroke="#F59E0B" strokeDasharray="3 3" />
      <text x="160" y="84" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" letterSpacing="0.18em" fill="#8A5400">?</text>
      <text x="160" y="118" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" letterSpacing="0.14em" fill="rgba(11,13,17,0.6)">REBUILT FROM PIECES</text>
    </svg>
  );
}

function FaultVerbalYes() {
  return (
    <svg viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <line x1="20" y1="120" x2="300" y2="120" stroke="rgba(11,13,17,0.32)" strokeWidth="1.2" />
      {[40, 100, 160, 220, 280].map((x, i) => (
        <circle key={x} cx={x} cy="120" r="4.5" fill={i === 2 ? "#fff" : "rgba(11,13,17,0.7)"} stroke="rgba(11,13,17,0.7)" strokeWidth={i === 2 ? 1.2 : 0} />
      ))}
      <g>
        <path d="M 140 38 q 44 -16 70 0 q 0 16 -10 16 l -14 0 l -8 8 l 0 -8 l -28 0 q -10 0 -10 -16 z" fill="#fff" stroke="#F59E0B" strokeOpacity="0.6" />
        <text x="175" y="52" textAnchor="middle" fontFamily="Inter" fontSize="11" fontWeight="500" fill="rgba(11,13,17,0.7)">approval</text>
      </g>
      <line x1="170" y1="74" x2="160" y2="116" stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="2 3" />
      <text x="160" y="142" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" letterSpacing="0.14em" fill="#8A5400">DECISION OFF-RAIL</text>
      <text x="20" y="100" fontFamily="JetBrains Mono" fontSize="8.5" letterSpacing="0.14em" fill="rgba(11,13,17,0.6)">AUDIT TRAIL</text>
    </svg>
  );
}

function FaultStalledHandoff() {
  return (
    <svg viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {[
        { y: 36, label: "QA" },
        { y: 72, label: "ENG" },
        { y: 108, label: "MFG" },
      ].map((lane) => (
        <g key={lane.y}>
          <line x1="46" y1={lane.y} x2="296" y2={lane.y} stroke="rgba(11,13,17,0.10)" />
          <text x="20" y={lane.y + 3} fontFamily="JetBrains Mono" fontSize="8.5" letterSpacing="0.14em" fill="rgba(11,13,17,0.6)">{lane.label}</text>
        </g>
      ))}
      <path d="M 60 36 L 140 36" stroke="#5E6AD2" strokeWidth="1.6" />
      <circle cx="60" cy="36" r="5" fill="#5E6AD2" />
      <circle cx="140" cy="36" r="5" fill="#5E6AD2" />
      <path d="M 140 36 L 158 72" stroke="#5E6AD2" strokeWidth="1.6" />
      <circle cx="158" cy="72" r="8" fill="#fff" stroke="#F59E0B" strokeWidth="1.4" />
      <text x="158" y="76" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fontWeight="500" fill="#8A5400">!</text>
      <path d="M 158 72 L 240 72 L 260 108" stroke="rgba(11,13,17,0.32)" strokeWidth="1.2" strokeDasharray="3 3" fill="none" />
      <circle cx="260" cy="108" r="5" fill="#fff" stroke="rgba(11,13,17,0.5)" />
      <text x="170" y="92" fontFamily="JetBrains Mono" fontSize="8" letterSpacing="0.14em" fill="#8A5400">WAITING ON OWNER</text>
    </svg>
  );
}

function FaultRecallScope() {
  return (
    <svg viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <g>
        {Array.from({ length: 60 }).map((_, idx) => {
          const col = idx % 12;
          const row = Math.floor(idx / 12);
          const cx = 36 + col * 22;
          const cy = 36 + row * 22;
          const known = (idx * 7) % 5 < 2;
          const fill = known ? "#5E6AD2" : "rgba(11,13,17,0.12)";
          return <circle key={idx} cx={cx} cy={cy} r="4" fill={fill} />;
        })}
      </g>
      <g stroke="#F59E0B" strokeWidth="1.2" fill="none">
        <path d="M 24 24 L 24 132" />
        <path d="M 24 24 L 30 24" />
        <path d="M 24 132 L 30 132" />
      </g>
      <text x="146" y="155" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" letterSpacing="0.14em" fill="rgba(11,13,17,0.6)">SCOPE = WHAT WE REMEMBER</text>
    </svg>
  );
}

const FAULTS = [
  {
    n: "F-01",
    label: "The decision QMS never heard",
    title: "Approval lands in a Teams call. The record waits weeks to catch up.",
    text: "Quality and engineering align on a path forward in a meeting. The QMS record waits two weeks for someone to translate it. PLM moves on a stale spec in the meantime.",
    role: "QMS · Teams · PLM",
    stamp: "+14d to reconciliation",
    art: <FaultDisconnect />,
  },
  {
    n: "F-02",
    label: "Sign-off without the evidence",
    title: "The signature exists. The justification is somewhere in Outlook.",
    text: "ERP shows the approval. The artifacts that justify it sit in three Outlook threads and a SharePoint folder no one named.",
    role: "ERP · Outlook · SharePoint",
    stamp: "+9d to audit prep",
    art: <FaultAuditGap />,
  },
  {
    n: "F-03",
    label: "Three-week record rewrite",
    title: "Records get rebuilt from memory after the fact.",
    text: "The rebuild happens by gathering fragments from people who were once in the room. The owner has moved on to the next item by then.",
    role: "QMS · Excel",
    stamp: "+18d to rebuild",
    art: <FaultReconstruction />,
  },
  {
    n: "F-04",
    label: "The verbal approval that drifts",
    title: "Decisions made in meetings that the record never knew.",
    text: "The right people aligned in a Teams call. The change control record was never updated. Downstream steps run on the wrong assumption.",
    role: "Teams · QMS",
    stamp: "+6d to drift correction",
    art: <FaultVerbalYes />,
  },
  {
    n: "F-05",
    label: "The handoff with no owner",
    title: "Quality finishes. Engineering waits for someone to pick it up.",
    text: "Each function is in motion. The handoff between them lives in a person's head. Records sit idle between functions.",
    role: "ERP · PLM · Outlook",
    stamp: "+11d idle between functions",
    art: <FaultStalledHandoff />,
  },
  {
    n: "F-06",
    label: "Scope by memory",
    title: "Impact is unknowable from the system of record alone.",
    text: "Records live across MES, ERP, and a register nobody reconciles. Scope is set by what the team can recall, not by what the system can prove.",
    role: "MES · ERP · SharePoint",
    stamp: "+21d to scope confirmation",
    art: <FaultRecallScope />,
  },
];

/* Fragmentation node graph for the diptych BEFORE pane */
function FragmentationGraph() {
  const nodes: { id: string; x: number; y: number; kind: "email" | "file" | "chat" | "meeting"; label: string }[] = [
    { id: "e1", x: 60, y: 60, kind: "email", label: "RE: where is..." },
    { id: "e2", x: 110, y: 110, kind: "email", label: "FW: FW: FW:" },
    { id: "e3", x: 50, y: 160, kind: "email", label: "RE: looping in" },
    { id: "f1", x: 220, y: 50, kind: "file", label: "Working_v3" },
    { id: "f2", x: 280, y: 110, kind: "file", label: "FINAL_v2" },
    { id: "f3", x: 240, y: 170, kind: "file", label: "DRAFT" },
    { id: "c1", x: 380, y: 60, kind: "chat", label: "Teams: change-control" },
    { id: "c2", x: 420, y: 130, kind: "chat", label: "Teams: DM with Lead" },
    { id: "m1", x: 540, y: 80, kind: "meeting", label: "Sync 32m" },
    { id: "m2", x: 510, y: 160, kind: "meeting", label: "Cross-fn" },
  ];
  const colorFor: Record<string, string> = {
    email: "#F0A33A",
    file: "#B8BEC7",
    chat: "#4D86FF",
    meeting: "#C4303A",
  };
  const links: Array<[string, string]> = [
    ["e1", "e2"], ["e2", "e3"],
    ["f1", "f2"], ["f2", "f3"],
    ["c1", "c2"],
    ["m1", "m2"],
  ];
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n] as const));
  return (
    <svg viewBox="0 0 600 240" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-hidden style={{ width: "100%", height: "100%" }}>
      {links.map(([a, b], i) => {
        const A = byId[a]; const B = byId[b];
        return <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="rgba(11,13,17,0.18)" strokeWidth="1" />;
      })}
      <g stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 4" opacity="0.55">
        <path d="M 110 110 L 220 50" />
        <path d="M 280 110 L 380 60" />
        <path d="M 420 130 L 540 80" />
      </g>
      {nodes.map((n) => (
        <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
          <circle cx="0" cy="0" r="14" fill="#fff" stroke={colorFor[n.kind]} strokeWidth="1.4" />
          <circle cx="0" cy="0" r="5" fill={colorFor[n.kind]} />
          <text x="20" y="4" fontFamily="JetBrains Mono" fontSize="8.5" letterSpacing="0.04em" fill="rgba(11,13,17,0.7)">{n.label}</text>
        </g>
      ))}
      <rect x="270" y="200" width="60" height="22" rx="4" fill="rgba(245,158,11,0.10)" stroke="#F59E0B" strokeDasharray="3 3" />
      <text x="300" y="215" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" letterSpacing="0.14em" fill="#8A5400">NO CENTER</text>
    </svg>
  );
}

const LANE_ACTIVITY: Record<string, number[]> = {
  teams: [3, 6, 8, 11, 14, 18, 24, 30, 38, 46, 52, 58, 62, 70, 76, 82, 88, 92],
  outlook: [4, 9, 15, 22, 28, 36, 44, 50, 56, 64, 72, 80, 86, 90],
  sharepoint: [12, 26, 40, 54, 68, 78, 84],
  excel: [10, 20, 32, 48, 60, 74, 88],
};

/* Process cycle time, four-domain rotation on a locked geometry.
   All domains share the same five-phase shape on the Without rail and the
   same five-phase compression on the With rail. Only the eyebrow label and
   the primary wait label change per domain. Locking the geometry kills the
   layout shift on rotation and makes the chart's gap shape the constant
   visual statement. */
type Phase = { active: number; waiting: number };

/* Eight phases on a 92-day scale. More chunks creates more rhythm:
   work, blocked, work, blocked, work, blocked. Phase widths are locked
   across all four domains so the chart shape is constant. */
const WITHOUT_PHASES: Phase[] = [
  { active: 1, waiting: 0 },    //  1d  open
  { active: 3, waiting: 4 },    //  7d
  { active: 2, waiting: 5 },    //  7d
  { active: 4, waiting: 9 },    // 13d  named wait #1
  { active: 4, waiting: 11 },   // 15d  named wait #2
  { active: 3, waiting: 5 },    //  8d
  { active: 3, waiting: 11 },   // 14d  named wait #3
  { active: 3, waiting: 24 },   // 27d  named wait #4 (longest)
];

const WITH_PHASES: Phase[] = [
  { active: 2, waiting: 0 },
  { active: 3, waiting: 0 },
  { active: 3, waiting: 0 },
  { active: 4, waiting: 0 },
  { active: 5, waiting: 0 },
  { active: 4, waiting: 0 },
  { active: 4, waiting: 0 },
  { active: 4, waiting: 0 },
];

/* Wait segment centres (% from left) for the four named waits.
   Computed from the WITHOUT_PHASES geometry. */
const WAIT_POSITIONS = [26, 41, 65, 87];

type DomainRotation = {
  label: string;
  waits: [string, string, string, string];
};

/* Each domain provides four wait labels matching WAIT_POSITIONS in order.
   Domain label and wait labels rotate together every 6s. */
const DOMAIN_ROTATIONS: DomainRotation[] = [
  {
    label: "APPROVAL CYCLE",
    waits: ["QA backlog", "Reg sign-off pending", "Stakeholders not aligned", "Manual reconciliation"],
  },
  {
    label: "CHANGE CONTROL",
    waits: ["Drawing not finalised", "QMS impact pending", "PLM versioning", "Awaiting line approval"],
  },
  {
    label: "DOC REVISIONS",
    waits: ["Comments unresolved", "DC backlog", "Schedule conflict", "Adoption tracking"],
  },
  {
    label: "DOC RISK",
    waits: ["Severity input pending", "Plan revisions", "Owner unavailable", "Review cycle slip"],
  },
];

const TOTAL_DAYS = 92;
const phaseDays = (p: Phase) => p.active + p.waiting;

export default function HomeOptionA() {
  const [domainIdx, setDomainIdx] = useState(0);
  const activeDomain = DOMAIN_ROTATIONS[domainIdx];

  useEffect(() => {
    document.title = "Option A · Structural diagnosis";
  }, []);

  useEffect(() => {
    const id = window.setInterval(
      () => setDomainIdx((i) => (i + 1) % DOMAIN_ROTATIONS.length),
      6000
    );
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const band = document.querySelector<HTMLElement>(".opa-timeline-band");
    if (!band) return;
    let revealed = false;
    const check = () => {
      if (revealed) return;
      const r = band.getBoundingClientRect();
      const vh = window.innerHeight;
      const visible = Math.max(0, Math.min(vh, r.bottom) - Math.max(0, r.top));
      const ratio = r.height > 0 ? visible / Math.min(vh, r.height) : 0;
      if (ratio > 0.18) {
        band.classList.add("is-revealed");
        revealed = true;
        window.removeEventListener("scroll", check);
        window.removeEventListener("resize", check);
      }
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  useEffect(() => {
    const nav = document.querySelector<HTMLElement>(".opa-nav");
    const band = document.querySelector<HTMLElement>(".opa-hero-band");
    if (!nav || !band) return;
    const update = () => {
      const navH = nav.getBoundingClientRect().height;
      const bandBottom = band.getBoundingClientRect().bottom;
      nav.classList.toggle("is-dark", bandBottom > navH * 0.5);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const symptomCards = (
    <>
      {FAULTS.map((f) => (
        <div key={f.n} className="opa-fault">
          <div className="opa-fault-head">
            <span className="key">{f.label}</span>
          </div>
          <div className="opa-fault-art">{f.art}</div>
          <div className="opa-fault-body">
            <div className="title">{f.title}</div>
            <div className="text">{f.text}</div>
          </div>
          <div className="opa-fault-foot">
            <span className="role">{f.role}</span>
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="opa-root">
      <style>{STYLES}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,450;0,500;0,600;1,400;1,450&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* NAV */}
      <nav className="opa-nav">
        <div className="opa-nav-inner">
          <Link to="/option-a" className="opa-nav-logo" aria-label="Unifize">
            <img src="/Link%20-%20home.svg" alt="Unifize" className="opa-nav-logo-img" />
          </Link>
          <div className="opa-nav-items">
            <a href="#symptoms">Symptoms</a>
            <a href="#why">Why</a>
            <a href="#layer">The layer</a>
            <a href="#balance-sheet">The number</a>
          </div>
          <div className="opa-nav-actions">
            <Link to="/option-b" className="opa-nav-link mono">→ Option B</Link>
            <button className="opa-nav-btn">Book a demo</button>
          </div>
        </div>
      </nav>

      {/* SECTION 1: HERO (parallel-rails diagram, four-domain rotation) */}
      <div className="opa-hero-band">
      <section className="opa-hero">
        <div>
          <h1 className="opa-hero-h1">
            Cycle times in days.<br />
            <span className="em">Not months.</span>
          </h1>
          <p className="opa-hero-sub">
            Approval cycles, change control, document revisions, risk reviews. Cross-functional work, on one thread. For regulated processes.
          </p>
          <div className="opa-hero-cta">
            <button className="opa-btn-primary">
              Book a demo
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <a href="#symptoms" className="opa-btn-ghost">See where time goes</a>
          </div>
        </div>

        <div className="opa-rails">
          <div className="opa-rails-headline">
            <div className="opa-rails-headline-mark" />
            <div className="opa-rails-headline-text">
              <div className="opa-rails-header">Process cycle time</div>
              <div className="opa-rails-subhead">Same process. Two timelines.</div>
            </div>
          </div>
          <div className="opa-rails-stack">
            <div className="opa-gantt-row without">
              <div className="gh">
                <span className="name">Without Unifize</span>
              </div>
              <div className="opa-wait-annotation top">
                {[0, 2].map((i) => (
                  <div key={i} className="opa-wait-anchor" style={{ left: `${WAIT_POSITIONS[i]}%` }}>
                    <span key={`${domainIdx}-${i}`} className="opa-wait-label">{activeDomain.waits[i]}</span>
                    <span className="opa-wait-tick" />
                  </div>
                ))}
              </div>
              <div className="opa-gantt-track">
                {WITHOUT_PHASES.map((p, i) => {
                  const total = phaseDays(p);
                  const phaseW = (total / TOTAL_DAYS) * 100;
                  const activeW = (p.active / total) * 100;
                  return (
                    <div key={i} className="opa-gantt-phase" style={{ width: `${phaseW}%` }}>
                      <div className="opa-gantt-seg active" style={{ width: `${activeW}%` }} />
                      {p.waiting > 0 && (
                        <div className="opa-gantt-seg waiting" style={{ width: `${100 - activeW}%` }} />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="opa-wait-annotation bottom">
                {[1, 3].map((i) => (
                  <div key={i} className="opa-wait-anchor" style={{ left: `${WAIT_POSITIONS[i]}%` }}>
                    <span className="opa-wait-tick" />
                    <span key={`${domainIdx}-${i}`} className="opa-wait-label">{activeDomain.waits[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="opa-gantt-row with">
              <div className="gh">
                <span className="name">With Unifize</span>
              </div>
              <div className="opa-gantt-track">
                {WITH_PHASES.map((p, i) => {
                  const total = phaseDays(p);
                  const phaseW = (total / TOTAL_DAYS) * 100;
                  return (
                    <div key={i} className="opa-gantt-phase" style={{ width: `${phaseW}%` }}>
                      <div className="opa-gantt-seg active" style={{ width: "100%" }} />
                    </div>
                  );
                })}
                <div className="opa-recovered-overlay">
                  <span className="opa-recovered-line left" />
                  <span className="opa-recovered-label">Time recovered</span>
                  <span className="opa-recovered-line right" />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
      </div>

      {/* SECTION 2: SYMPTOM MARQUEE · architectural fault cards */}
      <section className="opa-section" id="symptoms">
        <div className="opa-eyebrow">
          <span className="dot" />
          <span className="num">02</span>
          <span className="sep">/</span>
          <span className="name">Where cycle time goes</span>
        </div>
        <h2 className="opa-h2">
          Six recurring conditions in regulated processes.{" "}
          <span className="dim">Each one stretches process cycle times.</span>
        </h2>

        <div className="opa-symptoms">
          <div className="opa-symptoms-track">
            {symptomCards}
            {symptomCards}
          </div>
        </div>
      </section>

      {/* SECTION 3: WHY IT HAPPENS / GAP REVEAL */}
      <section className="opa-section" id="why" style={{ paddingTop: 60, paddingBottom: 140 }}>
        <div className="opa-eyebrow">
          <span className="dot" />
          <span className="num">03</span>
          <span className="sep">/</span>
          <span className="name">The gap behind the record</span>
        </div>
        <h2 className="opa-h2">
          Each system records its part.{" "}
          <span className="dim">None of them owns the work between. That space has a name.</span>{" "}
          <span className="opa-name-reveal">Coordination tax.</span>
        </h2>
        <p className="opa-tax-def">
          The cost of holding cross-functional work together when no layer owns it. Paid in cycle time, rework, audit risk, and decisions made twice.
        </p>

        <div className="opa-timeline-band">
          <div className="opa-tl-rail">
            <div className="opa-tl-rail-line" />
            {[
              { left: "0%", title: "Opened", day: "Day 0", i: 0 },
              { left: "25%", title: "In review", day: "Day 14", i: 1 },
              { left: "50%", title: "Decided", day: "Day 47", i: 2 },
              { left: "75%", title: "Approved", day: "Day 66", i: 3 },
            ].map((m) => (
              <div key={m.title} className="opa-tl-milestone" style={{ left: m.left, ["--i" as string]: m.i } as React.CSSProperties}>
                <span className="title">{m.title}</span>
                <span className="node" />
                <span className="day">{m.day}</span>
              </div>
            ))}
            <div className="opa-tl-milestone end" style={{ right: "0%", ["--i" as string]: 4 } as React.CSSProperties}>
              <span className="title">Closed</span>
              <span className="node" />
              <span className="day">Day 92</span>
            </div>
          </div>

          <div className="opa-tl-lanes">
            {(["outlook", "teams", "sharepoint", "excel"] as const).map((lane, idx) => {
              const labels: Record<string, string> = {
                outlook: "Outlook",
                teams: "Teams",
                sharepoint: "SharePoint",
                excel: "Excel",
              };
              return (
                <div key={lane} className={`opa-tl-lane ${lane}`} style={{ ["--i" as string]: idx } as React.CSSProperties}>
                  <div className="opa-tl-lane-label">
                    <span className="dot" />
                    <span>{labels[lane]}</span>
                  </div>
                  <div className="opa-tl-lane-track">
                    {[25, 50, 75].map((g) => (
                      <span key={g} className="gridline" style={{ left: `${g}%` }} />
                    ))}
                    {LANE_ACTIVITY[lane].map((p, i) => (
                      <span key={i} className="activity" style={{ left: `${p}%` }} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="opa-tl-aggregate">
            <span><span className="strong">Official record.</span> 5 entries.</span>
            <span><span className="strong">Coordination work.</span> 46 touches across 4 tools.</span>
          </div>
        </div>
      </section>

      {/* SECTION 5: THE LAYER (dark) */}
      <div className="opa-dark">
        <section className="opa-section opa-layer" id="layer">
          <div className="opa-eyebrow">
            <span className="dot" />
            <span className="num">05</span>
            <span className="sep">/</span>
            <span className="name">The layer</span>
          </div>
          <h2 className="opa-h2">
            One thread. Every move bound.
          </h2>

          <p className="opa-sub" style={{ maxWidth: "58ch" }}>
            Decision, evidence, and approval live in the same place as the record. AI sees the patterns humans can't.
          </p>

          <div className="opa-preview">
            <span className="opa-preview-glow" aria-hidden />
            <div className="opa-preview-frame">
              <iframe src="/chat?embed=1" title="Unifize product preview" loading="lazy" />
            </div>
          </div>
        </section>
      </div>

      {/* SECTION 6: DIPTYCH */}
      <section className="opa-section" style={{ paddingTop: 120 }}>
        <div className="opa-eyebrow">
          <span className="dot" />
          <span className="num">06</span>
          <span className="sep">/</span>
          <span className="name">What changes</span>
        </div>
        <h2 className="opa-h2">
          The same record. Two shapes.{" "}
          <span className="dim">Same people, same regulation. Different layer underneath.</span>
        </h2>

        <div className="opa-diptych">
          <div className="opa-diptych-pane before">
            <div className="opa-pane-head">
              <div className="head">
                <span>BEFORE · Fragmented</span>
                <span className="state">92 days · 3 reopens</span>
              </div>
              <div className="title">REC-2412, scattered across ten artifacts.</div>
            </div>

            <div className="opa-frag">
              <FragmentationGraph />
            </div>
          </div>

          <div className="opa-diptych-pane after">
            <div className="opa-pane-head">
              <div className="head">
                <span>AFTER · Single thread</span>
                <span className="state">21 days · 0 reopens</span>
              </div>
              <div className="title">REC-2412, governed end to end.</div>
            </div>

            <div className="opa-mini-app">
              <div className="opa-mini-bar">
                <span className="dots"><i /><i /><i /></span>
                <span className="crumb">Records / REC-2412</span>
                <span className="spacer" />
                <span className="kbd">⌘K</span>
              </div>

              <div className="opa-mini-thread-head">
                <div className="eb"><span className="dot" />Approval cycle · Q2 2026</div>
                <div className="id">
                  REC-2412
                  <span className="badge">Approved</span>
                </div>
                <div className="meta">
                  <span>21 days</span>
                  <span className="sep">·</span>
                  <span>0 reopens</span>
                  <span className="sep">·</span>
                  <span>Owner DS</span>
                </div>
              </div>

              <div className="opa-mini-thread">
                <span className="opa-mini-thread-line" aria-hidden />

                <div className="opa-mini-thread-event">
                  <span className="node" />
                  <div className="content">
                    <div className="meta">
                      <span className="day">Day 0</span>
                      <span className="kind">Opened</span>
                    </div>
                    <div className="desc">AS · Approval requested for spec change.</div>
                  </div>
                </div>

                <div className="opa-mini-thread-event">
                  <span className="node" />
                  <div className="content">
                    <div className="meta">
                      <span className="day">Day 2</span>
                      <span className="kind">Evidence</span>
                    </div>
                    <div className="desc">Test results attached. 4 artifacts.</div>
                  </div>
                </div>

                <div className="opa-mini-thread-event ai">
                  <span className="node" />
                  <div className="content">
                    <div className="meta">
                      <span className="day">Day 3</span>
                      <span className="kind">AI · pattern</span>
                    </div>
                    <div className="desc">12 similar threads averaged 14d. Reg sign-off is the recurring lane.</div>
                  </div>
                </div>

                <div className="opa-mini-thread-event">
                  <span className="node" />
                  <div className="content">
                    <div className="meta">
                      <span className="day">Day 7</span>
                      <span className="kind">In review</span>
                    </div>
                    <div className="desc">LM picked up. QA Lead.</div>
                  </div>
                </div>

                <div className="opa-mini-thread-event ai">
                  <span className="node" />
                  <div className="content">
                    <div className="meta">
                      <span className="day">Day 9</span>
                      <span className="kind">AI · completeness</span>
                    </div>
                    <div className="desc">All required artifacts present. Ready for sign-off.</div>
                  </div>
                </div>

                <div className="opa-mini-thread-event">
                  <span className="node" />
                  <div className="content">
                    <div className="meta">
                      <span className="day">Day 14</span>
                      <span className="kind">Approved</span>
                    </div>
                    <div className="desc">RK signed. Director.</div>
                  </div>
                </div>

                <div className="opa-mini-thread-event">
                  <span className="node" />
                  <div className="content">
                    <div className="meta">
                      <span className="day">Day 21</span>
                      <span className="kind">Closed</span>
                    </div>
                    <div className="desc">Audit trail complete. Zero reopens.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: ROI / AGGREGATE DASHBOARD */}
      <section className="opa-section" style={{ paddingTop: 60 }}>
        <div className="opa-eyebrow">
          <span className="dot" />
          <span className="num">07</span>
          <span className="sep">/</span>
          <span className="name">The aggregate</span>
        </div>
        <h2 className="opa-h2">
          Now zoom out.{" "}
          <span className="dim">One thread above. This is what hundreds look like together.</span>
        </h2>

        {/* TODO: replace directional figures with attributed program data once Ben signs off. */}
        <div className="opa-app-card">
          <div className="opa-app-chrome">
            <span className="dots"><i /><i /><i /></span>
            <span className="url">app.unifize.com / dashboard / quality</span>
            <span className="pill">Q2 2026</span>
          </div>

          <div className="opa-dash-bar">
            <div className="crumb">
              <span>Engineering</span>
              <span className="sep">/</span>
              <span>Quality</span>
              <span className="sep">/</span>
              <span className="cur">Dashboard</span>
            </div>
            <span className="spacer" />
            <div className="seg">
              <button>7d</button>
              <button>30d</button>
              <button className="active">90d</button>
              <button>YTD</button>
            </div>
          </div>

          <div className="opa-dash-grid">
            <div className="opa-kpi">
              <div className="opa-kpi-label">Cycle time</div>
              <div className="opa-kpi-value">−65<span className="unit">%</span></div>
              <div className="opa-kpi-delta up">↓ AI-summarised threads</div>
              <svg className="opa-kpi-spark" width="68" height="24" viewBox="0 0 68 24" fill="none">
                <polyline points="0,18 8,16 16,17 24,14 32,11 40,10 48,7 56,5 68,4" stroke="var(--accent)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="opa-kpi">
              <div className="opa-kpi-label">Rework</div>
              <div className="opa-kpi-value">−80<span className="unit">%</span></div>
              <div className="opa-kpi-delta up">↓ AI-flagged before sign-off</div>
              <svg className="opa-kpi-spark" width="68" height="24" viewBox="0 0 68 24" fill="none">
                <polyline points="0,4 8,5 16,8 24,10 32,12 40,15 48,16 56,19 68,20" stroke="var(--green)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="opa-kpi">
              <div className="opa-kpi-label">Audit-ready</div>
              <div className="opa-kpi-value">99.7<span className="unit">%</span></div>
              <div className="opa-kpi-delta up">↑ Captured at the moment</div>
              <svg className="opa-kpi-spark" width="68" height="24" viewBox="0 0 68 24" fill="none">
                <polyline points="0,14 8,12 16,13 24,10 32,11 40,8 48,9 56,6 68,5" stroke="var(--accent)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="opa-kpi">
              <div className="opa-kpi-label">Handoff speed</div>
              <div className="opa-kpi-value">4.0<span className="unit">×</span></div>
              <div className="opa-kpi-delta up">↑ AI-routed pickup</div>
              <svg className="opa-kpi-spark" width="68" height="24" viewBox="0 0 68 24" fill="none">
                <polyline points="0,20 8,19 16,16 24,14 32,12 40,13 48,9 56,8 68,5" stroke="var(--accent)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div className="opa-dash-row">
            <div className="opa-dash-card">
              <div className="head">
                <h5>Records opened vs closed</h5>
                <div className="legend">
                  <span className="sw grey"><i />Opened</span>
                  <span className="sw accent"><i />Closed</span>
                </div>
              </div>
              <div className="chart">
                <svg viewBox="0 0 480 156" preserveAspectRatio="none" width="100%" height="100%">
                  {[0, 39, 78, 117, 156].map((y, i) => (
                    <line key={i} x1="22" x2="478" y1={y === 0 ? 12 : y === 156 ? 144 : 12 + (132 * i) / 4} y2={y === 0 ? 12 : y === 156 ? 144 : 12 + (132 * i) / 4} stroke="rgba(11,13,17,0.05)" strokeWidth="1" />
                  ))}
                  <path d="M 24 60 L 138 30 L 252 78 L 366 48 L 478 102" stroke="rgba(11,13,17,0.32)" strokeWidth="1.4" fill="none" strokeDasharray="4 3" />
                  <path d="M 24 110 L 138 96 L 252 78 L 366 48 L 478 18" stroke="var(--accent)" strokeWidth="1.8" fill="none" />
                  {[24, 138, 252, 366, 478].map((cx, i) => (
                    <circle key={`a${i}`} cx={cx} cy={[110, 96, 78, 48, 18][i]} r="2.6" fill="var(--accent)" />
                  ))}
                  {[24, 138, 252, 366, 478].map((cx, i) => (
                    <circle key={`b${i}`} cx={cx} cy={[60, 30, 78, 48, 102][i]} r="2.2" fill="white" stroke="rgba(11,13,17,0.32)" strokeWidth="1.2" />
                  ))}
                  {["W-4", "W-3", "W-2", "W-1", "This"].map((l, i) => (
                    <text key={l} x={[24, 138, 252, 366, 478][i]} y="152" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="rgba(11,13,17,0.42)">{l}</text>
                  ))}
                </svg>
              </div>
            </div>

            <div className="opa-dash-card">
              <div className="head">
                <h5>Where time is being recovered</h5>
                <span className="meta">Q2 2026</span>
              </div>
              <div className="opa-dash-bars">
                {[
                  { l: "Approval bottleneck", v: 38 },
                  { l: "Cross-functional handoff", v: 24 },
                  { l: "Revision cycles", v: 18 },
                  { l: "Manual reconciliation", v: 14 },
                  { l: "Stakeholder alignment", v: 6 },
                ].map((c, i) => (
                  <div key={c.l} className={`row${i === 0 ? " lead" : ""}`}>
                    <div className="top">
                      <span>{c.l}</span>
                      <span className="v">{c.v}%</span>
                    </div>
                    <div className="bar"><div className="fill" style={{ width: `${c.v * 2}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 8: COORDINATION TAX RECOVERED (CFO view) */}
      <section className="opa-section" id="balance-sheet" style={{ paddingTop: 60 }}>
        <div className="opa-eyebrow">
          <span className="dot" />
          <span className="num">08</span>
          <span className="sep">/</span>
          <span className="name">Coordination tax in dollars</span>
        </div>
        <h2 className="opa-h2">
          Now put a number on it.{" "}
          <span className="dim">Coordination tax, recovered.</span>
        </h2>
        <p className="opa-tax-def" style={{ maxWidth: "58ch" }}>
          Coordination tax made visible. Then reducible. Per event, per lane, per quarter.
        </p>

        {/* TODO: replace directional figures with attributed program data once Ben signs off. */}
        <div className="opa-pnl">
          <div className="opa-pnl-head">
            <div className="opa-pnl-title">Coordination tax recovered</div>
            <div className="opa-pnl-sub">FY 2026 · across regulated processes</div>
          </div>

          <div className="opa-pnl-rows">
            <div className="opa-pnl-row">
              <div className="opa-pnl-row-main">
                <span className="opa-pnl-row-label">Cost of poor quality reduced</span>
                <span className="opa-pnl-row-attr">AI flags contradictions before sign-off</span>
              </div>
              <span className="opa-pnl-row-amount">$2.4M</span>
            </div>
            <div className="opa-pnl-row">
              <div className="opa-pnl-row-main">
                <span className="opa-pnl-row-label">Meeting hours recovered</span>
                <span className="opa-pnl-row-attr">AI summarises threads, replaces status sync calls</span>
              </div>
              <span className="opa-pnl-row-amount">$1.8M</span>
            </div>
            <div className="opa-pnl-row">
              <div className="opa-pnl-row-main">
                <span className="opa-pnl-row-label">Rework avoided</span>
                <span className="opa-pnl-row-attr">AI checks completeness before approval</span>
              </div>
              <span className="opa-pnl-row-amount">$1.2M</span>
            </div>
            <div className="opa-pnl-row">
              <div className="opa-pnl-row-main">
                <span className="opa-pnl-row-label">Premium freight avoided</span>
                <span className="opa-pnl-row-attr">AI surfaces approval bottlenecks before they slip the cycle</span>
              </div>
              <span className="opa-pnl-row-amount">$0.8M</span>
            </div>
            <div className="opa-pnl-row">
              <div className="opa-pnl-row-main">
                <span className="opa-pnl-row-label">Audit prep time avoided</span>
                <span className="opa-pnl-row-attr">Audit trail captured at the moment</span>
              </div>
              <span className="opa-pnl-row-amount">$0.6M</span>
            </div>
          </div>

          <div className="opa-pnl-total">
            <span className="opa-pnl-total-label">Total recovered</span>
            <span className="opa-pnl-total-amount">$6.8M</span>
          </div>

          <div className="opa-pnl-cta">
            <Link to="/coordination-tax" className="opa-pnl-cta-link">
              Calculate your number
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <span className="opa-pnl-cta-sub">Coordination tax engine</span>
          </div>
        </div>
      </section>

      {/* SECTION 9: CTA */}
      <section className="opa-cta">
        <div className="opa-cta-inner">
          <h2 className="opa-cta-h">Walk through your process. With us. With your numbers.</h2>
          <p className="opa-cta-sub">
            Forty-five minutes. We pick one of your processes and rebuild it as a single governed thread on screen.
          </p>
          <div className="opa-cta-actions">
            <button className="opa-btn-primary">
              Book a demo
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <Link to="/option-b" className="opa-btn-ghost">Compare to Option B →</Link>
          </div>

          <div className="opa-cta-quote">
            <div className="text">
              "The chaos of cross-functional work was always invisible until we could see it laid out on parallel rails. Then the cost was obvious."
            </div>
            <div className="who">VP Quality, ISO 13485 manufacturer</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="opa-foot">
        <div className="opa-foot-inner">
          <span>© {new Date().getFullYear()} Unifize. Structural-diagnosis exploration.</span>
          {/* TODO: confirm partnership claim with Ben before shipping. */}
          <span className="mono">Partnered with Microsoft.</span>
        </div>
      </footer>
    </div>
  );
}
