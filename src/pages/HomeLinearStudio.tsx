// HomeLinearStudio
//
// /linear-studio — visual variant of HomeLinearFlow restyled to match the
// "This Is It Studio" reference (off-white surface, asymmetric right-offset
// hero, large 500-weight display heading, pill buttons, hairline borders).
// Same nav + hero + flow-stage structure as HomeLinearFlow; only the visual
// tokens and hero/nav layout change. Theme toggle removed (light-only).
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const STYLES = `
/* ============================================================
   HomeLinearStudio — tokens lifted from This Is It Studio.
   Variable names kept as --lf-* so the FlowStage SVG keeps
   working unchanged (it references var(--lf-fg) / --lf-bg /
   --lf-bg-card inline). Only the *values* and the nav/hero
   layout differ from HomeLinearFlow.
   ============================================================ */
html:has(.lf-root) { scroll-behavior: smooth; }
.lf-root [id] { scroll-margin-top: 72px; }
.lf-root {
  /* Dark surface. Inverted from the studio reference. */
  --lf-fg: 245, 245, 245;          /* near-white */
  --lf-bg: #0A0A0A;                /* near-black */
  --lf-bg-rgb: 10, 10, 10;
  --lf-bg-subtle: #141412;         /* card surface (subtle warm dark) */
  --lf-bg-card: #131313;
  --lf-border: rgba(var(--lf-fg), 0.10);
  --lf-border-strong: rgba(var(--lf-fg), 0.18);
  --lf-text: #F5F5F5;
  --lf-text-muted: #9A9A95;
  --lf-text-faint: #6B6B6B;

  /* Studio-specific tokens (not used by the SVG). */
  --ls-pill: #1F1F1C;
  --ls-pill-hover: #292927;
  --ls-tag: #1A1A18;
  --ls-tag-active: #2A3A1A;
  --ls-r-pill: 999px;
  --ls-r-card: 24px;
  /* Full-viewport layout: nav + content hug the edges, no centered max-width
     letterbox. Reference shows the wordmark and button anchored to the
     viewport edges with ~32-40px of breathing room. */
  --ls-content-w: none;
  --ls-page-x: clamp(20px, 2vw, 40px);
  --ls-right-col-x: 33%;
  --ls-right-col-w: 720px;
  --ls-nav-h: 72px;

  /* Inter Tight is the closest free match to the Söhne-style face on the
     reference. Falls back to Inter / system. */
  font-family: 'Inter Tight', 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', system-ui, sans-serif;
  background: var(--lf-bg);
  color: var(--lf-text);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  letter-spacing: -0.005em;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}
.lf-root * { box-sizing: border-box; }
.lf-root .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
.lf-root a { color: inherit; text-decoration: none; }

/* ----- NAV (matches the studio reference: 3 equal columns) -----
   Logo flex-start in col 1, nav items centered in col 2, button flex-end
   in col 3. Container padding 12px 16px, white bg, no border. */
.lf-nav {
  position: sticky; top: 0; z-index: 50;
  background: #0A0A0A;
}
.lf-nav-inner {
  width: 100%;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.lf-nav-col {
  flex: 1 0 0;
  display: flex;
  align-items: center;
}
.lf-nav-col-logo { justify-content: flex-start; }
.lf-nav-col-center { justify-content: center; }
.lf-nav-col-actions { justify-content: flex-end; }

.lf-nav-logo {
  display: inline-flex; align-items: center;
  color: #F5F5F5;
}
.lf-nav-logo img {
  height: 20px;
  width: auto;
  display: block;
  filter: brightness(0) invert(1);
}
.lf-nav-items {
  display: flex;
  align-items: center;
  font-family: 'Inter Display', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}
.lf-nav-items a {
  position: relative;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  line-height: 15.6px;
  letter-spacing: -0.2px;
  color: #9A9A95;
  transition: color .15s ease;
}
.lf-nav-items a:hover { color: #F5F5F5; }
.lf-nav-items a.active { color: #F5F5F5; }
.lf-nav-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.lf-nav-btn {
  font-family: 'Inter Display', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: -0.04px;
  background: rgba(255, 255, 255, 0.10);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  color: #F5F5F5;
  padding: 8px 12px;
  border-radius: 8px;
  border: 0;
  cursor: pointer;
  display: inline-flex; align-items: center;
  transition: background .18s ease, color .18s ease, transform .18s ease;
}
.lf-nav-btn:hover {
  background: #F5F5F5;
  color: #0A0A0A;
}
.lf-nav-btn:active { transform: scale(0.98); }
.lf-nav-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(245,245,245,0.35);
}
@media (max-width: 860px) {
  .lf-nav-col-center { display: none; }
}

/* ----- HERO: centered (matches the homepage reference, image 1) ----- */
.lf-hero {
  width: 100%;
  padding: clamp(80px, 10vw, 140px) var(--ls-page-x) clamp(40px, 6vw, 80px);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.lf-hero-left { display: none; }
.lf-hero-right {
  max-width: 720px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.lf-hero-h1 {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', system-ui, sans-serif;
  font-optical-sizing: auto;
  font-variation-settings: "opsz" 32;
  font-size: clamp(36px, 4.6vw, 60px);
  font-weight: 500;
  line-height: 1.06;
  letter-spacing: -0.018em;
  max-width: 22ch;
  margin: 0;
  text-align: center;
}
.lf-hero-accent {
  font-weight: 500;
  background-image: linear-gradient(
    100deg,
    #2870FF,
    #5C92FF,
    #8FB6FF,
    #BCD2FF,
    #5C92FF,
    #2870FF
  );
  background-size: 200% 100%;
  background-position: 0% 50%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: lf-accent-flow 7s linear infinite;
}
@keyframes lf-accent-flow {
  to { background-position: 200% 50%; }
}
@media (prefers-reduced-motion: reduce) {
  .lf-hero-accent { animation: none; }
}
.lf-hero-subtitle {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', system-ui, sans-serif;
  font-optical-sizing: auto;
  font-variation-settings: "opsz" 32;
  margin: 24px auto 32px;
  font-size: 17px;
  color: var(--lf-text-muted);
  max-width: 56ch;
  line-height: 1.5;
  letter-spacing: -0.005em;
  text-align: center;
}
.lf-hero-sub-em {
  color: var(--lf-text);
  font-weight: 500;
}
.lf-hero-cta {
  display: flex; gap: 12px; align-items: center; flex-wrap: wrap;
  justify-content: center;
}
.lf-btn-primary {
  font-family: inherit; font-size: 14px; font-weight: 500;
  background: rgba(255, 255, 255, 0.10);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  color: var(--lf-text);
  padding: 0 18px;
  height: 38px;
  border-radius: var(--ls-r-pill);
  border: 0;
  cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px;
  letter-spacing: -0.005em;
  transition: background .18s ease, color .18s ease, transform .18s ease;
}
.lf-btn-primary:hover {
  background: #F5F5F5;
  color: #0A0A0A;
}
.lf-btn-primary:active { transform: scale(0.98); }
.lf-btn-primary:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(245,245,245,0.35);
}
.lf-btn-primary svg { transition: transform .15s ease; }
.lf-btn-primary:hover svg { transform: translateX(1px); }

/* ----- PROCESS CYCLE TIME CHART (light mode, no card) ----- */
.lf-rails-section {
  width: 100%;
  padding: clamp(40px, 5vw, 80px) var(--ls-page-x) clamp(80px, 10vw, 120px);
  display: flex;
  justify-content: center;
}
.lf-rails-section .opa-recovered-overlay {
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
.lf-rails-section .opa-recovered-line {
  flex: 1;
  height: 1px;
}
.lf-rails-section .opa-recovered-line.left {
  background: linear-gradient(90deg, rgba(92,146,255,0.10), rgba(92,146,255,0.75));
}
.lf-rails-section .opa-recovered-line.right {
  background: linear-gradient(90deg, rgba(92,146,255,0.75), rgba(92,146,255,0.10));
}
.lf-rails-section .opa-recovered-label {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  white-space: nowrap;
}
.lf-rails-section .opa-recovered-days {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.012em;
  color: #BCD2FF;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
.lf-rails-section .opa-recovered-unit {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #8FB6FF;
  line-height: 1;
}
.lf-rails-section .opa-recovered-sep {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px;
  color: rgba(143, 182, 255, 0.45);
  line-height: 1;
}
.lf-rails-section .opa-recovered-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #8FB6FF;
  line-height: 1;
}
.lf-rails-section .opa-rails-stack {
  width: 100%;
  max-width: 1080px;
  display: flex; flex-direction: column;
  gap: 28px;
}
.lf-rails-section .opa-gantt-row {
  position: relative;
  width: 100%;
}
.lf-rails-section .opa-gantt-row .gh {
  display: flex; justify-content: space-between; align-items: baseline;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.18em; text-transform: uppercase;
  margin-bottom: 10px;
}
.lf-rails-section .opa-gantt-row .gh .name {
  color: var(--lf-text);
  font-weight: 500;
}
.lf-rails-section .opa-gantt-track {
  position: relative;
  height: 140px;
  background: var(--lf-bg-subtle);
  border: 1px solid var(--lf-border-strong);
  border-radius: 7px;
  overflow: hidden;
  display: flex;
  box-shadow:
    inset 0 2px 4px rgba(0,0,0,0.45),
    inset 0 -1px 0 rgba(255,255,255,0.04);
}
/* Subtle outer aura that builds during the cascade and peaks at phase 7's
   climax — the whole chart visibly "reacts" to the recovery, framing all
   the per-phase moments as one cohesive transformation. */
.lf-rails-section .opa-gantt-row.unified .opa-gantt-track {
  animation: lf-track-aura 14s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
@keyframes lf-track-aura {
  0%, 22% {
    box-shadow:
      inset 0 2px 4px rgba(0,0,0,0.45),
      inset 0 -1px 0 rgba(255,255,255,0.04),
      0 0 0 rgba(0, 82, 255, 0);
  }
  38% {
    box-shadow:
      inset 0 2px 4px rgba(0,0,0,0.45),
      inset 0 -1px 0 rgba(255,255,255,0.04),
      0 0 24px rgba(0, 82, 255, 0.08);
  }
  54% {
    box-shadow:
      inset 0 2px 4px rgba(0,0,0,0.45),
      inset 0 -1px 0 rgba(255,255,255,0.04),
      0 0 48px rgba(0, 82, 255, 0.18),
      0 0 0 1px rgba(0, 82, 255, 0.12);
  }
  68%, 75% {
    box-shadow:
      inset 0 2px 4px rgba(0,0,0,0.45),
      inset 0 -1px 0 rgba(255,255,255,0.04),
      0 0 28px rgba(0, 82, 255, 0.10);
  }
  79%, 100% {
    box-shadow:
      inset 0 2px 4px rgba(0,0,0,0.45),
      inset 0 -1px 0 rgba(255,255,255,0.04),
      0 0 0 rgba(0, 82, 255, 0);
  }
}
.lf-rails-section .opa-gantt-phase {
  display: flex;
  height: 100%;
  border-right: 1px solid var(--lf-border);
}
.lf-rails-section .opa-gantt-phase:last-child { border-right: 0; }
.lf-rails-section .opa-gantt-seg { height: 100%; position: relative; }
.lf-rails-section .opa-gantt-row.unified .opa-gantt-phase:nth-child(4n+1) .opa-gantt-seg.active {
  background: linear-gradient(180deg, #FFB94A 0%, #E68B1A 100%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.28),
    inset 0 -1px 0 rgba(120,60,10,0.4),
    0 0 14px rgba(255,170,60,0.32);
}
.lf-rails-section .opa-gantt-row.unified .opa-gantt-phase:nth-child(4n+2) .opa-gantt-seg.active {
  background: linear-gradient(180deg, #F47950 0%, #C9461F 100%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.26),
    inset 0 -1px 0 rgba(100,40,10,0.42),
    0 0 14px rgba(244,121,80,0.32);
}
.lf-rails-section .opa-gantt-row.unified .opa-gantt-phase:nth-child(4n+3) .opa-gantt-seg.active {
  background: linear-gradient(180deg, #F5D682 0%, #B59138 100%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.32),
    inset 0 -1px 0 rgba(120,80,20,0.4),
    0 0 14px rgba(245,214,130,0.28);
}
.lf-rails-section .opa-gantt-row.unified .opa-gantt-phase:nth-child(4n+4) .opa-gantt-seg.active {
  background: linear-gradient(180deg, #D69445 0%, #95621A 100%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.24),
    inset 0 -1px 0 rgba(80,40,10,0.42),
    0 0 14px rgba(214,148,69,0.30);
}
.lf-rails-section .opa-gantt-row.unified .opa-gantt-seg.waiting {
  background:
    repeating-linear-gradient(
      -45deg,
      rgba(214,148,69,0.42) 0,
      rgba(214,148,69,0.42) 5px,
      rgba(214,148,69,0.10) 5px,
      rgba(214,148,69,0.10) 10px
    );
  box-shadow:
    inset 0 1px 1px rgba(10,10,10,0.05),
    inset 0 -1px 0 rgba(10,10,10,0.04);
}

/* Unified row: an element-by-element transformation. Each phase has its own
   moment to compress and recolor, with a counter ticking up the days saved
   in lockstep so every phase visibly contributes to the takeaway.

   14s cycle staging (stagger = duration, so phases run sequentially with no
   overlap — each phase finishes its collapse before the next one starts):
     - 0-22%:   hold "without" (3.08s; labels fade in, hold, fade out by 22%)
     - 22-54%:  cascade collapse, phase 0 to phase 7 (4% stagger, 4% per phase)
                each per-phase transition takes 560ms with cubic ease
     - 54-75%:  hold "with" (2.94s; TIME RECOVERED reveals 35-44%, holds 54-75%)
     - 75-100%: cascade reset, phase 0 to phase 7

   Per-phase animation-delay = (var(--i) * 560ms). Held-with overlap window is
   54-75% (all 8 phases settled at phase-end), wide enough for legibility.

   Label stagger: animation-delay = (var(--li) * 200ms) so labels appear and
   disappear left-to-right matching the cascade direction. */
.lf-rails-section .opa-gantt-row.unified .opa-gantt-phase {
  width: var(--phase-start);
  animation: lf-phase-merge 14s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  animation-delay: calc(var(--i, 0) * 560ms);
  will-change: width;
}
.lf-rails-section .opa-gantt-row.unified .opa-gantt-seg.active {
  width: var(--active-start);
  position: relative;
  animation: lf-active-merge 14s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  animation-delay: calc(var(--i, 0) * 560ms);
  will-change: width;
}
.lf-rails-section .opa-gantt-row.unified .opa-gantt-seg.active::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #2870FF 0%, #0042D9 100%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.32),
    inset 0 -1px 0 rgba(0,30,100,0.45),
    0 0 22px rgba(0,82,255,0.45);
  opacity: 0;
  pointer-events: none;
  animation: lf-blue-fade 14s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  animation-delay: calc(var(--i, 0) * 560ms);
}
.lf-rails-section .opa-gantt-row.unified .opa-gantt-seg.waiting {
  width: var(--waiting-start);
  animation: lf-waiting-collapse 14s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  animation-delay: calc(var(--i, 0) * 560ms);
  will-change: width, opacity;
}
.lf-rails-section .opa-gantt-row.unified .opa-recovered-line.left {
  transform: scaleX(0);
  transform-origin: left center;
  animation: lf-recovered-line-left 14s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
.lf-rails-section .opa-gantt-row.unified .opa-recovered-line.right {
  transform: scaleX(0);
  transform-origin: left center;
  animation: lf-recovered-line-right 14s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
.lf-rails-section .opa-gantt-row.unified .opa-recovered-label {
  opacity: 0;
  animation: lf-recovered-label 14s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
.lf-rails-section .opa-gantt-row.unified .opa-recovered-days {
  display: inline-block;
  transform-origin: right baseline;
  animation: lf-recovered-days-pulse 14s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
/* The TIME RECOVERED headline literally lands with the climax — a brief
   color intensification + halo at the phase 7 beat ties the verbal payoff
   to the moment the biggest contribution is registered. */
.lf-rails-section .opa-gantt-row.unified .opa-recovered-tag {
  animation: lf-recovered-tag-climax 14s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
@keyframes lf-recovered-tag-climax {
  0%, 50%   {
    color: #0052FF;
    text-shadow: 0 0 0 rgba(0, 82, 255, 0);
    letter-spacing: 0.22em;
  }
  54%       {
    color: #0035B0;
    text-shadow: 0 0 14px rgba(0, 82, 255, 0.55), 0 0 4px rgba(0, 82, 255, 0.4);
    letter-spacing: 0.26em;
  }
  62%, 75%  {
    color: #0042D9;
    text-shadow: 0 0 6px rgba(0, 82, 255, 0.25);
    letter-spacing: 0.22em;
  }
  79%, 100% {
    color: #0052FF;
    text-shadow: 0 0 0 rgba(0, 82, 255, 0);
    letter-spacing: 0.22em;
  }
}
.lf-rails-section .opa-gantt-row.unified .opa-wait-label {
  position: relative;
  animation: lf-wait-label-cycle 14s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  animation-delay: calc(var(--li, 0) * 200ms);
}
/* Strikethrough sweeps across each wait label as it dies — pain points
   visibly cancelled in sequence rather than just fading. */
.lf-rails-section .opa-gantt-row.unified .opa-wait-label::after {
  content: '';
  position: absolute;
  left: -3px;
  right: -3px;
  top: 50%;
  height: 1.5px;
  background: currentColor;
  border-radius: 1px;
  transform: scaleX(0);
  transform-origin: left center;
  animation: lf-wait-label-strike 14s cubic-bezier(0.65, 0.05, 0.35, 1) infinite;
  animation-delay: calc(var(--li, 0) * 200ms);
}
@keyframes lf-wait-label-strike {
  0%, 12%   { transform: scaleX(0); }
  16%       { transform: scaleX(1); }
  20%, 100% { transform: scaleX(1); }
}
.lf-rails-section .opa-gantt-row.unified .opa-wait-tick {
  animation: lf-wait-tick-cycle 14s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  animation-delay: calc(var(--li, 0) * 200ms);
}

@keyframes lf-phase-merge {
  0%, 22%   { width: var(--phase-start); }
  26%       { width: calc(var(--phase-end) * 0.92); }  /* slight overshoot, "snap" */
  28%, 75%  { width: var(--phase-end); }
  79%, 100% { width: var(--phase-start); }
}
@keyframes lf-active-merge {
  0%, 22%   { width: var(--active-start); }
  26%, 75%  { width: 100%; }
  79%, 100% { width: var(--active-start); }
}
@keyframes lf-waiting-collapse {
  0%, 22%   { width: var(--waiting-start); opacity: 1; }
  25%       { opacity: 0; }
  26%, 75%  { width: 0; opacity: 0; }
  78%       { opacity: 1; }
  79%, 100% { width: var(--waiting-start); opacity: 1; }
}
@keyframes lf-blue-fade {
  0%, 23%   {
    opacity: 0;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.32),
      inset 0 -1px 0 rgba(0,30,100,0.45),
      0 0 22px rgba(0,82,255,0.45);
  }
  26%, 28%  {
    opacity: 1;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.45),
      inset 0 -1px 0 rgba(0,30,100,0.55),
      0 0 36px 6px rgba(40,112,255,0.65);
  }
  32%, 75%  {
    opacity: 1;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.32),
      inset 0 -1px 0 rgba(0,30,100,0.45),
      0 0 22px rgba(0,82,255,0.45);
  }
  79%, 100% { opacity: 0; }
}
/* Staircase keyframes: each stop coincides with a phase finishing its
   collapse, and the scaleX value is the cumulative savings normalized to
   the 63-day total. With stagger=duration=4% the cascade now spans 22-54%,
   giving each phase its own non-overlapping beat. */
@keyframes lf-recovered-line-left {
  0%, 22%   { transform: scaleX(0); }
  26%       { transform: scaleX(0); }     /* phase 0 done · -1 day, clamped */
  30%       { transform: scaleX(0.05); }  /* phase 1 done · +4 */
  34%       { transform: scaleX(0.11); }  /* phase 2 done · +4 */
  38%       { transform: scaleX(0.25); }  /* phase 3 done · +9 */
  42%       { transform: scaleX(0.41); }  /* phase 4 done · +10 */
  46%       { transform: scaleX(0.48); }  /* phase 5 done · +4 */
  50%       { transform: scaleX(0.64); }  /* phase 6 done · +10 */
  54%, 75%  { transform: scaleX(1); }     /* phase 7 done · +23 → full */
  79%, 100% { transform: scaleX(0); }
}
@keyframes lf-recovered-line-right {
  0%, 38%   { transform: scaleX(0); }
  42%       { transform: scaleX(0.20); }
  46%       { transform: scaleX(0.32); }
  50%       { transform: scaleX(0.55); }
  54%, 75%  { transform: scaleX(1); }
  79%, 100% { transform: scaleX(0); }
}
@keyframes lf-recovered-label {
  0%, 35%   { opacity: 0; transform: translateY(3px) scale(0.96); }
  44%       { opacity: 1; transform: translateY(0) scale(1.04); }
  54%, 75%  { opacity: 1; transform: translateY(0) scale(1); }
  79%, 100% { opacity: 0; transform: translateY(-3px) scale(0.98); }
}
/* Days number narrative arc:
   - Small lift at 44% when the label fades fully in (cascade midway)
   - Climactic peak at 54% when phase 7 (the +23 day contribution) lands
   - Settle by 68%, hold through hold-with state, reset on cascade reset.
   Tying the biggest pulse to phase 7's landing makes the counter visibly
   "react" to the largest contribution. */
@keyframes lf-recovered-days-pulse {
  0%, 38%   { transform: scale(1); }
  44%       { transform: scale(1.05); }
  50%       { transform: scale(1.04); }
  54%       { transform: scale(1.16); }
  60%       { transform: scale(1.04); }
  68%, 100% { transform: scale(1); }
}
@keyframes lf-wait-label-cycle {
  0%        { opacity: 0; transform: translateY(6px); filter: blur(2px); }
  3%, 16%   { opacity: 1; transform: translateY(0); filter: blur(0); }
  20%       { opacity: 0; transform: translateY(-6px); filter: blur(2px); }
  100%      { opacity: 0; transform: translateY(-6px); filter: blur(2px); }
}
@keyframes lf-wait-tick-cycle {
  0%        { opacity: 0; }
  4%, 16%   { opacity: 1; }
  20%, 100% { opacity: 0; }
}
@keyframes lf-pain-in {
  0%   { opacity: 0; transform: translateY(90%); filter: blur(6px); }
  60%  { opacity: 1; filter: blur(0); }
  100% { opacity: 1; transform: translateY(0); filter: blur(0); }
}
.lf-rails-section .opa-wait-annotation {
  position: relative;
  height: 32px;
}
.lf-rails-section .opa-wait-annotation.top { margin-bottom: 8px; }
.lf-rails-section .opa-wait-annotation.bottom { margin-top: 8px; }
.lf-rails-section .opa-wait-anchor {
  position: absolute;
  transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center;
  gap: 4px;
  pointer-events: none;
  white-space: nowrap;
}
.lf-rails-section .opa-wait-annotation.top .opa-wait-anchor { bottom: 0; }
.lf-rails-section .opa-wait-annotation.bottom .opa-wait-anchor { top: 0; }
.lf-rails-section .opa-wait-tick { width: 1px; height: 12px; }
.lf-rails-section .opa-wait-annotation.top .opa-wait-tick {
  background: linear-gradient(0deg, rgba(245,158,11,0.6), rgba(245,158,11,0));
  margin-bottom: -2px;
}
.lf-rails-section .opa-wait-annotation.bottom .opa-wait-tick {
  background: linear-gradient(180deg, rgba(245,158,11,0.6), rgba(245,158,11,0));
  margin-top: -2px;
}
.lf-rails-section .opa-wait-label {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 11.5px; font-weight: 500; letter-spacing: -0.003em;
  color: #F59E0B;
  animation: lf-pain-in 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* Per-phase "+N" savings pop-up. Anchored at the WITHOUT-state center of each
   phase so it lands over the painful waste region as that phase resolves.
   Hidden during held-without; pops up just as the phase finishes its
   collapse, holds briefly, then floats up and fades. */
.lf-rails-section .opa-gantt-row.unified .opa-phase-savings {
  position: absolute;
  bottom: 2px;
  transform: translate(-50%, 6px) scale(0.85);
  opacity: 0;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: -0.005em;
  color: #FFFFFF;
  background: linear-gradient(180deg, #2870FF 0%, #0042D9 100%);
  border: 1px solid rgba(0, 66, 217, 0.5);
  border-radius: 999px;
  padding: 4px 11px;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 6px 18px rgba(0, 66, 217, 0.28), 0 0 0 4px rgba(40, 112, 255, 0.08);
  animation: lf-savings-pop 14s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
  animation-delay: calc(var(--i, 0) * 560ms);
}
@keyframes lf-savings-pop {
  0%, 24% {
    opacity: 0;
    transform: translate(-50%, 6px) scale(0.85);
  }
  26% {
    opacity: 1;
    transform: translate(-50%, -2px) scale(1.18);
  }
  29%, 32% {
    opacity: 1;
    transform: translate(-50%, -4px) scale(1);
  }
  38% {
    opacity: 0.55;
    transform: translate(-50%, -12px) scale(0.95);
  }
  44%, 100% {
    opacity: 0;
    transform: translate(-50%, -18px) scale(0.9);
  }
}
@media (prefers-reduced-motion: reduce) {
  .lf-rails-section .opa-wait-label,
  .lf-rails-section .opa-gantt-row.unified .opa-gantt-phase,
  .lf-rails-section .opa-gantt-row.unified .opa-gantt-seg.active,
  .lf-rails-section .opa-gantt-row.unified .opa-gantt-seg.active::before,
  .lf-rails-section .opa-gantt-row.unified .opa-gantt-seg.waiting,
  .lf-rails-section .opa-gantt-row.unified .opa-recovered-line.left,
  .lf-rails-section .opa-gantt-row.unified .opa-recovered-line.right,
  .lf-rails-section .opa-gantt-row.unified .opa-recovered-label,
  .lf-rails-section .opa-gantt-row.unified .opa-recovered-days,
  .lf-rails-section .opa-gantt-row.unified .opa-recovered-tag,
  .lf-rails-section .opa-gantt-row.unified .opa-gantt-track,
  .lf-rails-section .opa-gantt-row.unified .opa-wait-tick {
    animation: none;
  }
  .lf-rails-section .opa-gantt-row.unified .opa-recovered-days {
    transform: none;
  }
  .lf-rails-section .opa-gantt-row.unified .opa-gantt-phase {
    width: var(--phase-end);
  }
  .lf-rails-section .opa-gantt-row.unified .opa-gantt-seg.active {
    width: 100%;
  }
  .lf-rails-section .opa-gantt-row.unified .opa-gantt-seg.active::before {
    opacity: 1;
  }
  .lf-rails-section .opa-gantt-row.unified .opa-gantt-seg.waiting {
    display: none;
  }
  .lf-rails-section .opa-gantt-row.unified .opa-recovered-line.left,
  .lf-rails-section .opa-gantt-row.unified .opa-recovered-line.right {
    transform: scaleX(1);
  }
  .lf-rails-section .opa-gantt-row.unified .opa-recovered-label {
    opacity: 1;
  }
  .lf-rails-section .opa-gantt-row.unified .opa-phase-savings {
    display: none;
  }
}
@media (max-width: 760px) {
  .lf-rails-section .opa-gantt-track { height: 100px; }
}
`;

type MergedPhase = { withoutActive: number; withoutWaiting: number; withActive: number };

// Each phase encodes the days spent active and waiting in the painful state, plus
// the days spent active in the streamlined state (waiting collapses to 0). The bar
// animates between these two configurations on a single shared row.
const MERGED_PHASES: MergedPhase[] = [
  { withoutActive: 1, withoutWaiting: 0,  withActive: 2 },
  { withoutActive: 3, withoutWaiting: 4,  withActive: 3 },
  { withoutActive: 2, withoutWaiting: 5,  withActive: 3 },
  { withoutActive: 4, withoutWaiting: 9,  withActive: 4 },
  { withoutActive: 4, withoutWaiting: 11, withActive: 5 },
  { withoutActive: 3, withoutWaiting: 5,  withActive: 4 },
  { withoutActive: 3, withoutWaiting: 11, withActive: 4 },
  { withoutActive: 3, withoutWaiting: 24, withActive: 4 },
];

const WAIT_POSITIONS = [26, 41, 65, 87];

type DomainRotation = {
  label: string;
  waits: [string, string, string, string];
};

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
const CYCLE_MS = 14000;
const COLLAPSE_START = 0.22;
const COLLAPSE_PHASE_DUR = 0.04;
const RESET_START = 0.75;
const RESET_PHASE_DUR = 0.04;
const PHASE_STAGGER = 0.04;

// Cumulative days saved per phase as the bar collapses from "without" to "with".
// Phase 1 actually grows by 1 day (active goes 1->2, no waiting), the rest save
// time. Net total is 63 days. The counter reflects the cumulative running total.
const PHASE_SAVINGS = MERGED_PHASES.map(
  (p) => p.withoutActive + p.withoutWaiting - p.withActive
);
const TOTAL_SAVED = PHASE_SAVINGS.reduce((a, b) => a + b, 0);

// Per-phase "+N" pop-up data: the visible delta in cumulative-clamped savings
// (phase 0 grows by 1, phase 1 saves 4 -> visible +3 for phase 1) and the
// horizontal center of each phase in the WITHOUT layout (where the pop-up
// lands, anchored to where the phase's painful waste used to live).
const PHASE_POPUPS = (() => {
  let cum = 0;
  let prevDisplay = 0;
  let cumDays = 0;
  return MERGED_PHASES.map((p, i) => {
    cum += PHASE_SAVINGS[i];
    const display = Math.max(0, cum);
    const visibleSavings = display - prevDisplay;
    prevDisplay = display;
    const phaseDays = p.withoutActive + p.withoutWaiting;
    const center = ((cumDays + phaseDays / 2) / TOTAL_DAYS) * 100;
    cumDays += phaseDays;
    return { i, savings: visibleSavings, center };
  }).filter((x) => x.savings > 0);
})();

function computeSavedDays(cycleProgress: number): number {
  let saved = 0;
  for (let i = 0; i < MERGED_PHASES.length; i++) {
    const collapseStart = COLLAPSE_START + i * PHASE_STAGGER;
    const collapseEnd = collapseStart + COLLAPSE_PHASE_DUR;
    const resetStart = RESET_START + i * PHASE_STAGGER;
    const resetEnd = resetStart + RESET_PHASE_DUR;
    let progress = 0;
    if (cycleProgress < collapseStart) progress = 0;
    else if (cycleProgress < collapseEnd) {
      progress = (cycleProgress - collapseStart) / COLLAPSE_PHASE_DUR;
    } else if (cycleProgress < resetStart) progress = 1;
    else if (cycleProgress < resetEnd) {
      progress = 1 - (cycleProgress - resetStart) / RESET_PHASE_DUR;
    } else progress = 0;
    saved += PHASE_SAVINGS[i] * progress;
  }
  return Math.max(0, Math.round(saved));
}

export default function HomeLinearStudio() {
  const [domainIdx, setDomainIdx] = useState(0);
  const activeDomain = DOMAIN_ROTATIONS[domainIdx];
  const daysRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    document.title = "Unifize. The coordination layer for regulated teams";
  }, []);

  useEffect(() => {
    // Sync to the 8s gantt animation so each domain's pain labels swap during
    // the moment the bar holds its compressed "with" state and the labels are
    // already faded out.
    const id = window.setInterval(
      () => setDomainIdx((i) => (i + 1) % DOMAIN_ROTATIONS.length),
      CYCLE_MS
    );
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    // Drive the days counter directly off the cycle clock so the displayed
    // number tracks the cascade without React re-renders. Each phase visibly
    // increments the counter as it collapses, reinforcing element-by-element.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      if (daysRef.current) daysRef.current.textContent = String(TOTAL_SAVED);
      return;
    }
    let raf = 0;
    let last = -1;
    const tick = () => {
      const cycle = (performance.now() % CYCLE_MS) / CYCLE_MS;
      const days = computeSavedDays(cycle);
      if (days !== last && daysRef.current) {
        daysRef.current.textContent = String(days);
        last = days;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="lf-root">
      <style>{STYLES}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* Nav: 3 equal columns. Logo left, items centered, pill right. */}
      <nav className="lf-nav">
        <div className="lf-nav-inner">
          <div className="lf-nav-col lf-nav-col-logo">
            <Link to="/linear-studio" className="lf-nav-logo" aria-label="Unifize">
              <img src="/Link - home.svg" alt="Unifize" />
            </Link>
          </div>
          <div className="lf-nav-col lf-nav-col-center">
            <div className="lf-nav-items">
              <a href="#platform" className="active">Platform</a>
              <a href="#customers">Customers</a>
              <a href="#pricing">Pricing</a>
              <a href="#thinking">Thinking</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
          <div className="lf-nav-col lf-nav-col-actions">
            <button className="lf-nav-btn">Book a demo</button>
          </div>
        </div>
      </nav>

      {/* Hero: centered, matches the studio homepage reference */}
      <section className="lf-hero">
        <div className="lf-hero-right">
          <h1 className="lf-hero-h1">
            Cycle times in days.
            <br />
            <span className="lf-hero-accent">Not months.</span>
          </h1>
          <p className="lf-hero-subtitle">
            Approval cycles, change control, document revisions, risk reviews. Cross-functional work, on one thread. For regulated processes.
          </p>
          <div className="lf-hero-cta">
            <button className="lf-btn-primary">
              Book a demo
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Process cycle time: a single bar that loads in the painful "without"
          state and morphs into the streamlined "with" state, revealing the
          time recovered. */}
      <section className="lf-rails-section">
        <div className="opa-rails-stack">
          <div className="opa-gantt-row unified">
            <div className="opa-wait-annotation top">
              {[0, 2].map((i) => (
                <div
                  key={i}
                  className="opa-wait-anchor"
                  style={{
                    left: `${WAIT_POSITIONS[i]}%`,
                    ["--li" as string]: `${i}`,
                  } as React.CSSProperties}
                >
                  <span key={`${domainIdx}-${i}`} className="opa-wait-label">{activeDomain.waits[i]}</span>
                  <span className="opa-wait-tick" />
                </div>
              ))}
              {PHASE_POPUPS.map((pop) => (
                <span
                  key={`pop-${pop.i}`}
                  className="opa-phase-savings"
                  style={{
                    left: `${pop.center}%`,
                    ["--i" as string]: `${pop.i}`,
                  } as React.CSSProperties}
                >
                  +{pop.savings}
                </span>
              ))}
            </div>
            <div className="opa-gantt-track">
              {MERGED_PHASES.map((p, i) => {
                const wTotal = p.withoutActive + p.withoutWaiting;
                const phaseStart = (wTotal / TOTAL_DAYS) * 100;
                const phaseEnd = (p.withActive / TOTAL_DAYS) * 100;
                const activeStart = (p.withoutActive / wTotal) * 100;
                const waitingStart = 100 - activeStart;
                return (
                  <div
                    key={i}
                    className="opa-gantt-phase"
                    style={{
                      ["--i" as string]: `${i}`,
                      ["--phase-start" as string]: `${phaseStart}%`,
                      ["--phase-end" as string]: `${phaseEnd}%`,
                      ["--active-start" as string]: `${activeStart}%`,
                      ["--waiting-start" as string]: `${waitingStart}%`,
                    } as React.CSSProperties}
                  >
                    <div className="opa-gantt-seg active" />
                    {p.withoutWaiting > 0 && <div className="opa-gantt-seg waiting" />}
                  </div>
                );
              })}
              <div className="opa-recovered-overlay">
                <span className="opa-recovered-line left" />
                <span className="opa-recovered-label">
                  <span ref={daysRef} className="opa-recovered-days">0</span>
                  <span className="opa-recovered-unit">days</span>
                  <span className="opa-recovered-sep">·</span>
                  <span className="opa-recovered-tag">time recovered</span>
                </span>
                <span className="opa-recovered-line right" />
              </div>
            </div>
            <div className="opa-wait-annotation bottom">
              {[1, 3].map((i) => (
                <div
                  key={i}
                  className="opa-wait-anchor"
                  style={{
                    left: `${WAIT_POSITIONS[i]}%`,
                    ["--li" as string]: `${i}`,
                  } as React.CSSProperties}
                >
                  <span className="opa-wait-tick" />
                  <span key={`${domainIdx}-${i}`} className="opa-wait-label">{activeDomain.waits[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
