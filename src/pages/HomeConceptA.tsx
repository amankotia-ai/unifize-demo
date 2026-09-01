import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * Concept A ·Recognition first, then layer.
 *
 * Fixes from HomeOptionB:
 * - No CAPA, ECO, deviation, SCAR or other record-type labels in the hero.
 * - Coordination tax is not named in section 1 or 2. It earns its name
 *   only after the buyer has seen the chaos and felt the cost.
 * - Ideal vs chaos comparison is added at the problem level (Lakshman).
 * - Wasted time is shown as a Gantt rail (Ketchen reference).
 * - Four-band stack from the locked Concept Map replaces the floating
 *   thread anatomy as the "what Unifize is" visual.
 * - AI implication section is restored.
 * - Tagline "People. Process. AI. Outcomes." sits under the logo.
 * - Descriptor "Coordination tax, visible, measurable, reducible. For
 *   regulated processes." sits under the tagline.
 * - No em dashes anywhere.
 * - Unifize blue #0052FF, no purple/indigo.
 * - Linear-style chrome: sticky nav, dark hero, light sections after,
 *   each section is at least 100vh.
 */

const PAIN_POINTS = [
  "Investigation still open from last quarter.",
  "Approval stuck across four inboxes.",
  "Supplier follow-up chased through three mailboxes.",
  "Release shipped before sign-offs landed.",
  "Review closed on a verbal yes.",
  "Wrong revision on the floor.",
  "Submission stitched from four folders.",
  "Training record nobody can produce.",
  "Complaint that found its owner three handoffs late.",
  "Hold reason living in a Teams chat.",
  "Audit finding about a gap nobody named.",
  "Recall scope built from memory.",
  "Decision made in chat, record never updated.",
  "Onboarding stalled on one form.",
  "Periodic review overdue, owner unassigned.",
];

const PERSONAS = [
  { role: "VP Quality", scope: "92 days. Three reopens. One investigation." },
  { role: "Operations Director", scope: "On-time delivery slipping six points a quarter." },
  { role: "Head of Regulatory", scope: "Submission rebuilt from four shared drives." },
  { role: "CFO", scope: "Twelve to twenty percent of payroll, paid in coordination." },
  { role: "CIO", scope: "AI cannot compound on coordination that lives in email." },
];

const DOMAINS = [
  { label: "CAPA", who: "QA Manager", trigger: "Deviation raised" },
  { label: "Change Control", who: "Engineering Lead", trigger: "Drawing change" },
  { label: "Supplier Quality", who: "SQE", trigger: "Supplier finding" },
  { label: "Complaints", who: "QA Ops", trigger: "Customer report" },
  { label: "Deviations", who: "Production", trigger: "Out-of-spec batch" },
  { label: "Audit & Inspection", who: "Compliance", trigger: "Inspection notice" },
  { label: "Document Control", who: "DocControl", trigger: "SOP revision" },
  { label: "Training", who: "HR / QA", trigger: "New SOP issued" },
  { label: "Risk Management", who: "QA Director", trigger: "Design review" },
  { label: "Design Review", who: "R&D Lead", trigger: "Phase gate" },
  { label: "MRB", who: "Quality Engineer", trigger: "Material rejected" },
  { label: "Calibration", who: "Metrology", trigger: "Calibration due" },
  { label: "Periodic Review", who: "QA Manager", trigger: "Annual cycle" },
  { label: "Recall", who: "Regulatory Affairs", trigger: "Field action" },
  { label: "Submission Assembly", who: "Regulatory Affairs", trigger: "510(k) prep" },
];

const STYLES = `
html:has(.cna-root) { scroll-behavior: smooth; }
.cna-root [id] { scroll-margin-top: 76px; }
.cna-root {
  --u-primary: #0052FF;
  --u-primary-hover: #003ECC;
  --u-primary-tint: #F0F4FF;
  --u-primary-border: #D6E0FF;

  --bg: #08090A;
  --bg-soft: #0E0F12;
  --bg-card: #101116;
  --border: rgba(255,255,255,0.08);
  --border-strong: rgba(255,255,255,0.16);
  --text: #FFFFFF;
  --text-muted: rgba(255,255,255,0.60);
  --text-faint: rgba(255,255,255,0.42);

  --paper: #FBFBFC;
  --paper-soft: #F6F7F8;
  --paper-card: #FFFFFF;
  --ink: #0B0D11;
  --ink-muted: #454B56;
  --ink-faint: #8B93A0;
  --ink-line: #E4E7EB;
  --ink-line-strong: #D8DCE1;

  --u-font: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --u-mono: 'JetBrains Mono', ui-monospace, monospace;

  font-family: var(--u-font);
  background: var(--bg);
  color: var(--text);
  -webkit-font-smoothing: antialiased;
  letter-spacing: -0.011em;
  min-height: 100vh;
  overflow-x: hidden;
}
.cna-root * { box-sizing: border-box; }
.cna-root .mono { font-family: var(--u-mono); }
.cna-root a { color: inherit; text-decoration: none; }

/* ---------- NAV ---------- */
.cna-nav {
  position: sticky; top: 0; z-index: 50;
  backdrop-filter: saturate(160%) blur(18px);
  background: rgba(8,9,10,0.72);
  border-bottom: 1px solid var(--border);
}
.cna-nav-inner {
  max-width: 1280px; margin: 0 auto;
  padding: 14px 28px;
  display: flex; align-items: center; gap: 36px;
}
.cna-nav-logo {
  display: inline-flex; flex-direction: column; gap: 2px;
}
.cna-nav-logo .word {
  font-size: 17px; font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1;
}
.cna-nav-logo .word b { color: var(--u-primary); font-weight: 700; }
.cna-nav-logo .tag {
  font-family: var(--u-mono);
  font-size: 9.5px; letter-spacing: 0.08em;
  color: var(--text-faint);
  text-transform: uppercase;
}
.cna-nav-items {
  display: flex; gap: 24px;
  font-size: 13.5px; color: var(--text-muted);
  margin-left: 16px;
}
.cna-nav-items a:hover { color: var(--text); }
.cna-nav-actions { margin-left: auto; display: flex; gap: 16px; align-items: center; }
.cna-nav-link { font-size: 13.5px; color: var(--text-muted); }
.cna-nav-link:hover { color: var(--text); }
.cna-btn-primary {
  font-family: inherit; font-size: 13px; font-weight: 500;
  background: white; color: var(--ink);
  padding: 8px 16px; border-radius: 999px;
  border: 1px solid white; cursor: pointer;
  display: inline-flex; align-items: center; gap: 7px;
  transition: background .15s, transform .15s;
}
.cna-btn-primary:hover { background: #EBECEE; }
.cna-btn-blue {
  background: var(--u-primary); color: white; border-color: var(--u-primary);
}
.cna-btn-blue:hover { background: var(--u-primary-hover); border-color: var(--u-primary-hover); }
.cna-btn-ghost {
  font-family: inherit; font-size: 13px; font-weight: 500;
  background: transparent; color: var(--text);
  padding: 8px 16px; border-radius: 999px;
  border: 1px solid var(--border-strong);
  cursor: pointer;
  display: inline-flex; align-items: center; gap: 7px;
  transition: background .15s, border-color .15s;
}
.cna-btn-ghost:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.28); }
.cna-section.light .cna-btn-ghost,
.cna-section.papersoft .cna-btn-ghost { color: var(--ink); border-color: var(--ink-line-strong); }
.cna-section.light .cna-btn-ghost:hover,
.cna-section.papersoft .cna-btn-ghost:hover { background: rgba(11,13,17,0.04); }
.cna-section.light .cna-btn-primary,
.cna-section.papersoft .cna-btn-primary { background: var(--ink); color: white; border-color: var(--ink); }
.cna-section.light .cna-btn-primary:hover,
.cna-section.papersoft .cna-btn-primary:hover { background: #1A1B1F; }
@media (max-width: 980px) { .cna-nav-items { display: none; } }

/* ---------- SECTION SHELL ---------- */
.cna-section {
  min-height: 100vh;
  display: flex; flex-direction: column;
  position: relative;
}
.cna-section.dark { background: var(--bg); color: var(--text); }
.cna-section.light { background: var(--paper); color: var(--ink); }
.cna-section.papersoft { background: var(--paper-soft); color: var(--ink); }
.cna-inner {
  flex: 1;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 100px 28px;
  display: flex; flex-direction: column; gap: 56px;
  justify-content: center;
}
.cna-section.light, .cna-section.papersoft {
  --text: var(--ink);
  --text-muted: var(--ink-muted);
  --text-faint: var(--ink-faint);
  --border: var(--ink-line);
  --border-strong: var(--ink-line-strong);
  --bg-card: var(--paper-card);
  color: var(--ink);
}
.cna-section.light .cna-h2 .dim,
.cna-section.papersoft .cna-h2 .dim {
  color: var(--ink-muted);
}
.cna-section.light .cna-sub,
.cna-section.papersoft .cna-sub {
  color: var(--ink-muted);
}
.cna-section.light .cna-eyebrow,
.cna-section.papersoft .cna-eyebrow {
  color: var(--ink-faint);
}
.cna-section.light .cna-eyebrow .num,
.cna-section.papersoft .cna-eyebrow .num {
  color: var(--ink);
  border-color: var(--ink-line);
}
.cna-section.light .cna-eyebrow .line,
.cna-section.papersoft .cna-eyebrow .line {
  background: var(--ink-line);
}

/* ---------- EYEBROW ---------- */
.cna-eyebrow {
  font-family: var(--u-mono);
  font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--text-faint);
  display: flex; align-items: center; gap: 12px;
}
.cna-eyebrow .num {
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 2px 7px;
}
.cna-eyebrow .line { width: 80px; height: 1px; background: var(--border); }

/* ---------- HEADINGS ---------- */
.cna-h1 {
  font-size: clamp(40px, 6.4vw, 84px);
  font-weight: 500;
  line-height: 0.96;
  letter-spacing: -0.044em;
  margin: 0;
  max-width: 22ch;
}
.cna-h1 .accent {
  color: var(--u-primary);
  font-weight: 500;
}
.cna-h2 {
  font-size: clamp(32px, 4.6vw, 56px);
  line-height: 1.04;
  letter-spacing: -0.034em;
  font-weight: 500;
  margin: 0;
  max-width: 22ch;
}
.cna-h2 .dim { color: var(--text-muted); }
.cna-sub {
  margin: 0;
  font-size: 17px;
  color: var(--text-muted);
  max-width: 56ch;
  line-height: 1.5;
}

/* ---------- HERO ---------- */
.cna-hero { min-height: calc(100vh - 60px); }
.cna-hero-inner {
  max-width: 1280px; margin: 0 auto;
  padding: 80px 28px 60px;
  display: grid; grid-template-columns: 1.1fr 0.9fr;
  gap: 64px; align-items: center;
  flex: 1;
}
@media (max-width: 1080px) { .cna-hero-inner { grid-template-columns: 1fr; gap: 48px; } }
.cna-hero-tag {
  font-family: var(--u-mono);
  font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--text-faint);
  margin-bottom: 28px;
  display: inline-flex; align-items: center; gap: 10px;
}
.cna-hero-tag .dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--u-primary);
  box-shadow: 0 0 0 3px rgba(0,82,255,0.22);
}
.cna-hero-cta { margin-top: 36px; display: flex; gap: 12px; flex-wrap: wrap; }

.cna-hero-rotator {
  margin-top: 32px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: rgba(255,255,255,0.025);
  padding: 14px 18px;
  display: inline-flex; align-items: center; gap: 14px;
  max-width: 100%;
}
.cna-hero-rotator .label {
  font-family: var(--u-mono);
  font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--text-faint);
  flex-shrink: 0;
}
.cna-hero-rotator .slot {
  position: relative; height: 1.4em;
  min-width: 26ch; max-width: 100%;
  overflow: hidden;
}
.cna-hero-rotator .slot span {
  display: inline-block;
  font-size: 14px; color: var(--text); font-weight: 450;
  white-space: nowrap;
  animation: cna-slot-in 540ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes cna-slot-in {
  0% { opacity: 0; transform: translateY(80%); filter: blur(4px); }
  60% { opacity: 1; filter: blur(0); }
  100% { opacity: 1; transform: translateY(0); filter: blur(0); }
}
@media (prefers-reduced-motion: reduce) { .cna-hero-rotator .slot span { animation: none; } }

/* ---------- HERO COLLAGE (no record-type labels) ---------- */
.cna-collage {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 0.92;
}
.cna-frame {
  position: absolute;
  background: rgba(20,21,27,0.78);
  border: 1px solid var(--border-strong);
  border-radius: 10px;
  padding: 14px;
  backdrop-filter: blur(14px);
  box-shadow:
    0 30px 60px -20px rgba(0,0,0,0.6),
    0 0 0 1px rgba(255,255,255,0.04);
}
.cna-frame .head {
  font-family: var(--u-mono);
  font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--text-faint);
  display: flex; justify-content: space-between; align-items: center;
  padding-bottom: 9px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 10px;
}
.cna-frame .head .who { color: var(--text-muted); }
.cna-frame.calendar { top: 0; right: 0; width: 64%; transform: rotate(-2.6deg); z-index: 3; }
.cna-frame.email { bottom: 30px; left: 0; width: 60%; transform: rotate(1.8deg); z-index: 4; }
.cna-frame.docs { top: 220px; right: 8%; width: 54%; transform: rotate(2.4deg); z-index: 2; }

.cna-cal { display: grid; grid-template-columns: 28px repeat(5, 1fr); gap: 3px; }
.cna-cal-h {
  font-family: var(--u-mono); font-size: 8.5px; letter-spacing: 0.1em;
  color: var(--text-faint); padding: 2px 0;
}
.cna-cal-cell {
  height: 22px; border-radius: 2px;
  background: rgba(0,82,255,0.16);
  border-left: 2px solid rgba(0,82,255,0.65);
}
.cna-cal-cell.dim { background: rgba(255,255,255,0.04); border-left-color: rgba(255,255,255,0.18); }
.cna-cal-cell.tall { height: 44px; }
.cna-cal-cell.empty { background: transparent; border: 0; }

.cna-row {
  display: grid; grid-template-columns: 18px 1fr 50px;
  gap: 10px; align-items: center;
  padding: 7px 0; border-bottom: 1px dotted var(--border);
}
.cna-row:last-child { border-bottom: 0; }
.cna-av {
  width: 16px; height: 16px; border-radius: 50%;
  background: linear-gradient(135deg, rgba(0,82,255,0.3), rgba(77,133,255,0.3));
  border: 1px solid var(--border);
}
.cna-row .body .ln1 { height: 6px; border-radius: 2px; background: rgba(255,255,255,0.6); width: 85%; }
.cna-row .body .ln2 { height: 4px; border-radius: 2px; background: rgba(255,255,255,0.18); width: 65%; margin-top: 4px; }
.cna-row .when { font-family: var(--u-mono); font-size: 9px; color: var(--text-faint); text-align: right; }

.cna-doc {
  display: grid; grid-template-columns: 12px 1fr 36px;
  gap: 8px; align-items: center;
  padding: 6px 0; border-bottom: 1px dotted var(--border);
  font-family: var(--u-mono); font-size: 9px; color: var(--text-muted);
}
.cna-doc .ico { width: 9px; height: 11px; background: rgba(255,255,255,0.14); border-radius: 1.5px; }
.cna-doc .nm { color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* ---------- IDEAL VS CHAOS GANTT ---------- */
.cna-gantt {
  display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
  margin-top: 32px;
}
@media (max-width: 980px) { .cna-gantt { grid-template-columns: 1fr; } }
.cna-gantt-pane {
  background: var(--paper-card);
  border: 1px solid var(--ink-line);
  border-radius: 10px;
  padding: 28px;
  display: flex; flex-direction: column; gap: 18px;
}
.cna-gantt-pane .head {
  display: flex; justify-content: space-between; align-items: baseline;
}
.cna-gantt-pane .head .label {
  font-family: var(--u-mono);
  font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ink-faint);
}
.cna-gantt-pane .head .stat {
  font-family: var(--u-mono); font-size: 11px;
  color: var(--ink);
}
.cna-gantt-pane .title {
  font-size: 22px; font-weight: 500; letter-spacing: -0.022em;
  margin: 0;
}
.cna-gantt-pane .title .accent { color: #0B8A5C; }
.cna-gantt-pane .title .err { color: #C4303A; }
.cna-gantt-pane .scale {
  display: grid; grid-template-columns: 80px 1fr;
  gap: 0;
}
.cna-gantt-pane .scale .day-row {
  display: contents;
}
.cna-gantt-pane .scale .lane {
  font-family: var(--u-mono); font-size: 10.5px;
  color: var(--ink-faint);
  padding: 8px 12px 8px 0;
  border-bottom: 1px dashed var(--ink-line);
  text-align: right;
}
.cna-gantt-pane .scale .bar-cell {
  position: relative; height: 30px;
  border-bottom: 1px dashed var(--ink-line);
}
.cna-gantt-pane .bar {
  position: absolute; top: 7px; height: 16px;
  border-radius: 3px;
}
.cna-gantt-pane .bar.solid { background: var(--u-primary); }
.cna-gantt-pane .bar.outline { background: rgba(0,82,255,0.16); border: 1px dashed rgba(0,82,255,0.5); }
.cna-gantt-pane .bar.warn { background: #B4731A; }
.cna-gantt-pane .bar.err { background: #C4303A; }
.cna-gantt-pane .bar.muted { background: rgba(11,13,17,0.12); }
.cna-gantt-pane .bar .lab {
  position: absolute; top: -3px; right: 4px;
  font-family: var(--u-mono); font-size: 9px; color: white;
  background: rgba(11,13,17,0.7); padding: 1px 5px; border-radius: 2px;
}
.cna-gantt-pane .footer {
  margin-top: 8px;
  font-family: var(--u-mono);
  font-size: 11px; color: var(--ink-muted);
  letter-spacing: 0.04em;
}
.cna-gantt-pane.before { background: #FFFFFF; border-color: rgba(196,48,58,0.25); }
.cna-gantt-pane.after { background: #FFFFFF; border-color: rgba(11,138,92,0.25); }
.cna-gantt-pane.before .head .stat { color: #C4303A; }
.cna-gantt-pane.after .head .stat { color: #0B8A5C; }
.cna-gantt-axis {
  display: grid; grid-template-columns: 80px 1fr; gap: 0;
}
.cna-gantt-axis .empty { padding: 0; }
.cna-gantt-axis .ticks {
  display: flex; justify-content: space-between;
  font-family: var(--u-mono); font-size: 9.5px;
  color: var(--ink-faint);
  border-bottom: 1px solid var(--ink-line);
  padding-bottom: 4px;
}

/* ---------- PERSONA MATRIX ---------- */
.cna-persona-grid {
  display: grid; grid-template-columns: repeat(5, 1fr);
  gap: 1px;
  background: var(--ink-line);
  border: 1px solid var(--ink-line);
  border-radius: 8px;
  overflow: hidden;
  margin-top: 32px;
}
@media (max-width: 1080px) { .cna-persona-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .cna-persona-grid { grid-template-columns: 1fr; } }
.cna-persona-cell {
  background: white;
  padding: 28px 24px;
  display: flex; flex-direction: column; gap: 12px;
  min-height: 200px;
}
.cna-persona-cell .role {
  font-size: 15px; font-weight: 500; letter-spacing: -0.012em;
}
.cna-persona-cell .scope {
  font-size: 14px; color: var(--ink-muted); line-height: 1.45;
  flex: 1;
}
.cna-persona-cell .read {
  font-family: var(--u-mono); font-size: 10px;
  color: var(--ink-faint);
  letter-spacing: 0.1em; text-transform: uppercase;
}

/* ---------- COORDINATION TAX BAND (dark) ---------- */
.cna-tax-stage {
  display: grid; grid-template-columns: 1fr 1fr 1fr;
  gap: 24px;
  margin-top: 40px;
}
@media (max-width: 900px) { .cna-tax-stage { grid-template-columns: 1fr; } }
.cna-tax-pillar {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 28px 24px;
  background: rgba(255,255,255,0.02);
  display: flex; flex-direction: column; gap: 12px;
  min-height: 280px;
}
.cna-tax-pillar .key {
  font-family: var(--u-mono);
  font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--u-primary);
}
.cna-tax-pillar .name {
  font-size: 22px; font-weight: 500; letter-spacing: -0.022em;
}
.cna-tax-pillar .desc {
  font-size: 14px; color: var(--text-muted); line-height: 1.5;
}
.cna-tax-pillar .meter {
  margin-top: auto; padding-top: 16px;
  font-family: var(--u-mono); font-size: 10.5px;
  color: var(--text-faint);
  letter-spacing: 0.04em;
}

.cna-tax-headline {
  font-size: clamp(48px, 8vw, 112px);
  line-height: 0.96;
  letter-spacing: -0.05em;
  font-weight: 500;
  margin: 0;
}
.cna-tax-headline .blue { color: var(--u-primary); }

/* ---------- WHY EXISTING TOOLS DON'T ---------- */
.cna-grid-4 {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--ink-line);
  border: 1px solid var(--ink-line);
  border-radius: 12px;
  overflow: hidden;
  margin-top: 32px;
}
@media (max-width: 980px) { .cna-grid-4 { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .cna-grid-4 { grid-template-columns: 1fr; } }
.cna-tool {
  background: white;
  padding: 32px 26px;
  display: flex; flex-direction: column; gap: 18px;
  min-height: 280px;
}
.cna-tool .glyph {
  width: 48px; height: 48px;
  border: 1px solid var(--ink-line);
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  color: var(--ink-muted);
}
.cna-tool .tag {
  font-family: var(--u-mono);
  font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-faint);
}
.cna-tool .scope {
  font-size: 15px; line-height: 1.4; letter-spacing: -0.012em;
  font-weight: 500;
}
.cna-tool.empty { background: var(--paper-soft); }
.cna-tool.empty .scope { color: var(--u-primary); }
.cna-tool.empty .glyph {
  border-style: dashed;
  border-color: rgba(0,82,255,0.4);
  color: var(--u-primary);
}

/* ---------- FOUR BAND STACK ---------- */
.cna-stack {
  display: grid; grid-template-columns: 1fr 2fr 1fr;
  gap: 12px;
  margin-top: 40px;
  align-items: stretch;
}
@media (max-width: 980px) { .cna-stack { grid-template-columns: 1fr; } }
.cna-stack-side {
  display: flex; flex-direction: column; gap: 10px;
}
.cna-stack-side .lab {
  font-family: var(--u-mono);
  font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 4px;
}
.cna-stack-chip {
  border: 1px solid var(--ink-line);
  background: white;
  border-radius: 6px;
  padding: 14px 16px;
  display: flex; flex-direction: column; gap: 4px;
}
.cna-stack-chip .nm { font-size: 13.5px; font-weight: 500; }
.cna-stack-chip .arrow {
  font-family: var(--u-mono);
  font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--u-primary);
}
.cna-stack-center {
  border: 1px solid var(--ink-line);
  border-radius: 14px;
  background: var(--paper-card);
  overflow: hidden;
}
.cna-band {
  padding: 22px 24px;
  border-bottom: 1px solid var(--ink-line);
  display: flex; flex-direction: column; gap: 6px;
}
.cna-band:last-child { border-bottom: 0; }
.cna-band .band-key {
  font-family: var(--u-mono);
  font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--ink-faint);
}
.cna-band .band-name {
  font-size: 17px; font-weight: 500; letter-spacing: -0.018em;
}
.cna-band .band-desc { font-size: 13px; color: var(--ink-muted); line-height: 1.45; }
.cna-band.outcomes { background: linear-gradient(180deg, rgba(0,82,255,0.08), rgba(0,82,255,0.02)); border-bottom-color: rgba(0,82,255,0.18); }
.cna-band.outcomes .band-key { color: var(--u-primary); }

/* ---------- THREAD PRODUCT SURFACE ---------- */
.cna-thread-wrap {
  margin-top: 56px;
  display: flex; flex-direction: column; gap: 18px;
}
.cna-thread-cap {
  font-family: var(--u-mono);
  font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-faint);
  display: flex; align-items: center; gap: 12px;
}
.cna-thread-cap .line { flex: 1; height: 1px; background: var(--ink-line); }
.cna-thread-card {
  background: #0B0D11;
  color: #FFFFFF;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 24px 60px -24px rgba(11,13,17,0.32);
}
.cna-thread-head {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: 14px;
  align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
}
.cna-thread-id {
  font-family: var(--u-mono);
  font-size: 11px; letter-spacing: 0.12em;
  color: rgba(255,255,255,0.6);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 4px;
  padding: 3px 7px;
}
.cna-thread-title {
  font-size: 14px; font-weight: 500;
  color: #FFFFFF;
  letter-spacing: -0.012em;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.cna-thread-status {
  font-size: 11.5px; font-weight: 500;
  padding: 3px 9px;
  border-radius: 999px;
  background: rgba(0,82,255,0.18);
  color: #7DA8FF;
  border: 1px solid rgba(0,82,255,0.38);
}
.cna-thread-aging {
  font-family: var(--u-mono);
  font-size: 10.5px;
  color: rgba(255,255,255,0.42);
  letter-spacing: 0.06em;
}
.cna-thread-stages {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  position: relative;
  padding: 14px 18px 18px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.cna-thread-stages::before {
  content: "";
  position: absolute;
  left: 28px; right: 28px; top: 24px; height: 1px;
  background: linear-gradient(90deg, rgba(0,82,255,0.55) 0%, rgba(0,82,255,0.55) 50%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.12) 100%);
}
.cna-thread-stage {
  display: flex; flex-direction: column; gap: 6px;
  align-items: flex-start;
  position: relative;
  padding-top: 4px;
}
.cna-thread-stage .dot {
  width: 12px; height: 12px; border-radius: 50%;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.18);
  position: relative; z-index: 1;
  margin-left: 4px;
}
.cna-thread-stage.done .dot { background: var(--u-primary); border-color: var(--u-primary); }
.cna-thread-stage.active .dot {
  background: #0B0D11;
  border-color: var(--u-primary);
  box-shadow: 0 0 0 3px rgba(0,82,255,0.22);
}
.cna-thread-stage .nm { font-size: 12px; color: rgba(255,255,255,0.85); margin-left: 0; }
.cna-thread-stage .day {
  font-family: var(--u-mono);
  font-size: 10px; color: rgba(255,255,255,0.42);
  letter-spacing: 0.06em;
}
.cna-thread-rows {
  display: flex; flex-direction: column;
}
.cna-thread-row {
  display: grid;
  grid-template-columns: 92px 1fr auto;
  gap: 16px;
  align-items: center;
  padding: 12px 18px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  font-size: 13px;
}
.cna-thread-row:last-child { border-bottom: 0; }
.cna-thread-row-tag {
  font-family: var(--u-mono);
  font-size: 9.5px; letter-spacing: 0.16em; text-transform: uppercase;
  color: rgba(255,255,255,0.42);
}
.cna-thread-row-text {
  color: rgba(255,255,255,0.92);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.cna-thread-row-text b { color: #FFFFFF; font-weight: 500; }
.cna-thread-row-by {
  font-family: var(--u-mono);
  font-size: 10px; color: rgba(255,255,255,0.5);
  letter-spacing: 0.06em;
  white-space: nowrap;
}
.cna-thread-row.write-back {
  background: rgba(0,82,255,0.06);
  border-top: 1px dashed rgba(0,82,255,0.24);
}
.cna-thread-row.write-back .cna-thread-row-tag { color: #7DA8FF; }
.cna-thread-foot {
  display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px;
  padding: 10px 18px;
  font-family: var(--u-mono);
  font-size: 10.5px; letter-spacing: 0.06em;
  color: rgba(255,255,255,0.5);
  border-top: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.02);
}
.cna-thread-foot b { color: rgba(255,255,255,0.85); font-weight: 500; }
@media (max-width: 720px) {
  .cna-thread-head { grid-template-columns: auto 1fr; row-gap: 8px; }
  .cna-thread-aging { grid-column: 1 / -1; }
  .cna-thread-row { grid-template-columns: 1fr; gap: 4px; }
  .cna-thread-stages { padding: 14px 12px; }
  .cna-thread-stage .nm { font-size: 11px; }
}

/* ---------- DOMAINS ---------- */
.cna-domains {
  display: grid; grid-template-columns: repeat(5, 1fr);
  gap: 1px;
  background: var(--ink-line);
  border: 1px solid var(--ink-line);
  border-radius: 12px;
  overflow: hidden;
  margin-top: 32px;
}
@media (max-width: 1080px) { .cna-domains { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 720px) { .cna-domains { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .cna-domains { grid-template-columns: 1fr; } }
.cna-domain {
  background: white;
  padding: 22px 18px;
  display: flex; flex-direction: column; gap: 6px;
  min-height: 130px;
  transition: background .15s;
}
.cna-domain:hover { background: var(--u-primary-tint); }
.cna-domain .nm { font-size: 14.5px; font-weight: 500; letter-spacing: -0.012em; }
.cna-domain .who { font-size: 12px; color: var(--ink-muted); }
.cna-domain .trig {
  margin-top: auto;
  font-family: var(--u-mono);
  font-size: 10px; letter-spacing: 0.06em;
  color: var(--ink-faint);
}

/* ---------- AI THREE LEVELS (dark) ---------- */
.cna-ai {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 40px;
}
@media (max-width: 900px) { .cna-ai { grid-template-columns: 1fr; } }
.cna-ai-step {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 32px 28px;
  background: rgba(255,255,255,0.02);
  display: flex; flex-direction: column; gap: 14px;
  min-height: 320px;
  position: relative;
}
.cna-ai-step .lvl {
  font-family: var(--u-mono);
  font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--u-primary);
}
.cna-ai-step .name { font-size: 22px; font-weight: 500; letter-spacing: -0.022em; }
.cna-ai-step .desc { font-size: 14px; color: var(--text-muted); line-height: 1.55; }
.cna-ai-step .lock {
  margin-top: auto; padding-top: 16px;
  border-top: 1px solid var(--border);
  font-size: 12.5px; color: var(--text-muted);
}
.cna-ai-step .lock b { color: var(--text); font-weight: 500; }

/* ---------- PROOF ---------- */
.cna-proof-card {
  background: white;
  border: 1px solid var(--ink-line);
  border-radius: 14px;
  padding: 48px 44px;
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 48px; align-items: center;
  margin-top: 32px;
}
@media (max-width: 900px) { .cna-proof-card { grid-template-columns: 1fr; gap: 32px; padding: 32px; } }
.cna-proof-quote {
  font-size: 26px; line-height: 1.3; letter-spacing: -0.022em;
  font-weight: 500;
  margin: 0;
}
.cna-proof-quote .blue { color: var(--u-primary); }
.cna-proof-meta {
  display: flex; flex-direction: column; gap: 14px;
}
.cna-proof-meta .name { font-size: 15px; font-weight: 500; }
.cna-proof-meta .role { font-size: 13px; color: var(--ink-muted); }
.cna-proof-meta .stamp {
  font-family: var(--u-mono);
  font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ink-faint);
  margin-top: 8px;
  border-top: 1px solid var(--ink-line);
  padding-top: 14px;
}

/* ---------- CTA ---------- */
.cna-cta-h {
  font-size: clamp(40px, 6vw, 80px);
  font-weight: 500; letter-spacing: -0.044em;
  line-height: 1;
  margin: 0;
  max-width: 18ch;
}
.cna-cta-actions {
  margin-top: 36px;
  display: inline-flex; gap: 14px; flex-wrap: wrap;
}

/* ---------- FOOTER ---------- */
.cna-foot {
  border-top: 1px solid var(--border);
  background: var(--bg);
  color: var(--text-muted);
  padding: 28px;
}
.cna-foot-inner {
  max-width: 1280px; margin: 0 auto;
  display: flex; justify-content: space-between; align-items: center;
  font-size: 12px; flex-wrap: wrap; gap: 16px;
}
`;

function GlyphLedger() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="1.2" />
      <line x1="3" y1="13" x2="21" y2="13" stroke="currentColor" strokeWidth="1.2" />
      <line x1="3" y1="17" x2="21" y2="17" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
function GlyphForm() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <line x1="8" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="1.2" />
      <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="16" cy="17" r="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M14.5 17l1 1 2-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function GlyphSchem() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="18" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      <line x1="8.5" y1="6" x2="15.5" y2="6" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" />
      <line x1="7" y1="8" x2="11" y2="16" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" />
      <line x1="17" y1="8" x2="13" y2="16" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" />
    </svg>
  );
}
function GlyphGap() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="2 3" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export default function HomeConceptA() {
  const [painIdx, setPainIdx] = useState(0);

  useEffect(() => {
    document.title = "Unifize · Coordination tax, visible, measurable, reducible.";
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setPainIdx((i) => (i + 1) % PAIN_POINTS.length), 2400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="cna-root">
      <style>{STYLES}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;550;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* Nav with tagline + descriptor */}
      <nav className="cna-nav">
        <div className="cna-nav-inner">
          <Link to="/concept-a" className="cna-nav-logo" aria-label="Unifize">
            <span className="word">unifize<b>.</b></span>
            <span className="tag">People · Process · AI · Outcomes</span>
          </Link>
          <div className="cna-nav-items">
            <a href="#ideal-vs-chaos">The Problem</a>
            <a href="#tax">The Tax</a>
            <a href="#how">The Layer</a>
            <a href="#proof">Proof</a>
          </div>
          <div className="cna-nav-actions">
            <a href="#login" className="cna-nav-link">Log in</a>
            <button className="cna-btn-primary cna-btn-blue">Book a demo</button>
          </div>
        </div>
      </nav>

      {/* SECTION 1 ·HERO (dark) */}
      <section className="cna-section dark cna-hero" id="hero">
        <div className="cna-hero-inner">
          <div>
            <div className="cna-hero-tag">
              <span className="dot" />
              <span>Coordination tax, visible, measurable, reducible. For regulated processes.</span>
            </div>
            <h1 className="cna-h1">
              Records live in systems.<br />
              <span className="accent">Work lives between them.</span>
            </h1>
            <p className="cna-sub" style={{ marginTop: 28 }}>
              Your system of record is fine. The work that produces it is not. Investigations,
              approvals, evidence and handoffs run through email, meetings, shared folders and chat.
              Unifize is the layer underneath.
            </p>
            <div className="cna-hero-cta">
              <button className="cna-btn-primary cna-btn-blue">
                Book a demo
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <a href="#how" className="cna-btn-ghost">See it live</a>
            </div>
            <div className="cna-hero-rotator" aria-live="polite">
              <span className="label">You'll recognise</span>
              <span className="slot">
                <span key={painIdx}>{PAIN_POINTS[painIdx]}</span>
              </span>
            </div>
          </div>

          {/* Hero collage ·abstract shapes only, no record-type labels */}
          <div className="cna-collage" aria-hidden>
            {/* Calendar ·empty cells, no record-type names */}
            <div className="cna-frame calendar">
              <div className="head">
                <span className="who">Calendar</span>
                <span>32 events</span>
              </div>
              <div className="cna-cal">
                <div className="cna-cal-h" />
                <div className="cna-cal-h">M</div>
                <div className="cna-cal-h">T</div>
                <div className="cna-cal-h">W</div>
                <div className="cna-cal-h">T</div>
                <div className="cna-cal-h">F</div>

                <div className="cna-cal-h">9</div>
                <div className="cna-cal-cell" />
                <div className="cna-cal-cell tall" />
                <div className="cna-cal-cell" />
                <div className="cna-cal-cell tall" />
                <div className="cna-cal-cell dim" />

                <div className="cna-cal-h">10</div>
                <div className="cna-cal-cell tall" />
                <div className="cna-cal-cell dim" />
                <div className="cna-cal-cell" />
                <div className="cna-cal-cell empty" />
                <div className="cna-cal-cell" />

                <div className="cna-cal-h">11</div>
                <div className="cna-cal-cell" />
                <div className="cna-cal-cell empty" />
                <div className="cna-cal-cell tall" />
                <div className="cna-cal-cell" />
                <div className="cna-cal-cell tall" />
              </div>
            </div>

            {/* Email ·no subject lines that name records */}
            <div className="cna-frame email">
              <div className="head">
                <span className="who">Inbox</span>
                <span>17 replies</span>
              </div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="cna-row">
                  <div className="cna-av" />
                  <div className="body">
                    <div className="ln1" />
                    <div className="ln2" />
                  </div>
                  <div className="when">{`9:${i}2`}</div>
                </div>
              ))}
            </div>

            {/* Docs ·generic file names, no record-type leaks */}
            <div className="cna-frame docs">
              <div className="head">
                <span className="who">Shared drive</span>
                <span>14 items</span>
              </div>
              {["Investigation_v3_FINAL_v2", "Supplier_letter_scan", "Trace_BatchA", "Meeting_notes", "Five_whys_v2", "Approval_chain", "Effectiveness_check"].map((nm, i) => (
                <div key={nm} className="cna-doc">
                  <div className="ico" />
                  <div className="nm">{nm}</div>
                  <div>{`Apr ${i + 2}`}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 ·IDEAL VS CHAOS (light) */}
      <section className="cna-section light" id="ideal-vs-chaos">
        <div className="cna-inner">
          <div>
            <div className="cna-eyebrow">
              <span className="num">02</span>
              <span>How it should work. How it actually works.</span>
              <span className="line" />
            </div>
            <h2 className="cna-h2">
              The work itself is five days.{" "}
              <span className="dim">The waiting between is ninety-two.</span>
            </h2>
            <p className="cna-sub" style={{ marginTop: 22 }}>
              Same record. Same regulations. Same people. The difference is how much of the
              calendar is actually moving the work.
            </p>
          </div>

          <div className="cna-gantt">
            <div className="cna-gantt-pane after">
              <div className="head">
                <span className="label">Ideal flow</span>
                <span className="stat">5 working days</span>
              </div>
              <h3 className="title"><span className="accent">As it should run.</span></h3>
              <div className="cna-gantt-axis">
                <div />
                <div className="ticks">
                  <span>D 0</span><span>D 5</span><span>D 10</span><span>D 20</span><span>D 40</span><span>D 90</span>
                </div>
              </div>
              <div className="scale">
                <div className="lane">Discover</div>
                <div className="bar-cell"><div className="bar solid" style={{ left: "0%", width: "8%" }} /></div>
                <div className="lane">Investigate</div>
                <div className="bar-cell"><div className="bar solid" style={{ left: "8%", width: "16%" }} /></div>
                <div className="lane">Bind evidence</div>
                <div className="bar-cell"><div className="bar solid" style={{ left: "24%", width: "12%" }} /></div>
                <div className="lane">Approve</div>
                <div className="bar-cell"><div className="bar solid" style={{ left: "36%", width: "10%" }} /></div>
                <div className="lane">Close</div>
                <div className="bar-cell"><div className="bar solid" style={{ left: "46%", width: "6%" }} /></div>
              </div>
              <div className="footer">5 days of work. 5 days of calendar. No reopens.</div>
            </div>

            <div className="cna-gantt-pane before">
              <div className="head">
                <span className="label">Actual flow</span>
                <span className="stat">92 working days</span>
              </div>
              <h3 className="title"><span className="err">As it actually runs.</span></h3>
              <div className="cna-gantt-axis">
                <div />
                <div className="ticks">
                  <span>D 0</span><span>D 5</span><span>D 10</span><span>D 20</span><span>D 40</span><span>D 90</span>
                </div>
              </div>
              <div className="scale">
                <div className="lane">Discover</div>
                <div className="bar-cell">
                  <div className="bar solid" style={{ left: "0%", width: "4%" }} />
                  <div className="bar muted" style={{ left: "4%", width: "12%" }} />
                </div>
                <div className="lane">Investigate</div>
                <div className="bar-cell">
                  <div className="bar warn" style={{ left: "16%", width: "8%" }} />
                  <div className="bar muted" style={{ left: "24%", width: "20%" }} />
                </div>
                <div className="lane">Bind evidence</div>
                <div className="bar-cell">
                  <div className="bar muted" style={{ left: "44%", width: "16%" }} />
                  <div className="bar warn" style={{ left: "60%", width: "6%" }} />
                </div>
                <div className="lane">Approve</div>
                <div className="bar-cell">
                  <div className="bar muted" style={{ left: "66%", width: "12%" }} />
                  <div className="bar err" style={{ left: "78%", width: "8%" }} />
                </div>
                <div className="lane">Close</div>
                <div className="bar-cell">
                  <div className="bar muted" style={{ left: "86%", width: "8%" }} />
                  <div className="bar solid" style={{ left: "94%", width: "6%" }} />
                </div>
              </div>
              <div className="footer">5 days of work. 92 days of calendar. Three reopens.</div>
            </div>
          </div>

          <p className="cna-sub" style={{ marginTop: 12 }}>
            The gap is not failed effort. It is waiting. Waiting on a person, an email reply, an attached file, a meeting,
            a missing approver. That gap has a name.
          </p>
        </div>
      </section>

      {/* SECTION 3 ·SECOND ORDER EFFECTS (paper soft) */}
      <section className="cna-section papersoft" id="effects">
        <div className="cna-inner">
          <div>
            <div className="cna-eyebrow">
              <span className="num">03</span>
              <span>What it actually costs.</span>
              <span className="line" />
            </div>
            <h2 className="cna-h2">
              You feel it as meeting hours.{" "}
              <span className="dim">It shows up as missed releases, failed audits, and budget you cannot point to.</span>
            </h2>
            <p className="cna-sub" style={{ marginTop: 22 }}>
              Same shape, different chair. The cost of holding cross-functional work together
              shows up differently for each role, but it is the same gap.
            </p>
          </div>

          <div className="cna-persona-grid">
            {PERSONAS.map((p) => (
              <div key={p.role} className="cna-persona-cell">
                <div className="read">As felt by</div>
                <div className="role">{p.role}</div>
                <div className="scope">{p.scope}</div>
              </div>
            ))}
          </div>

          <p className="cna-sub" style={{ marginTop: 12 }}>
            Industry estimates put this at 12 to 20 percent of regulated payroll. It is paid in
            cycle time, in audit risk, in releases pushed by a quarter, and in decisions made twice.
          </p>
        </div>
      </section>

      {/* SECTION 4 ·NAME THE TAX (dark) */}
      <section className="cna-section dark" id="tax">
        <div className="cna-inner">
          <div>
            <div className="cna-eyebrow">
              <span className="num">04</span>
              <span>Name it.</span>
              <span className="line" />
            </div>
            <h2 className="cna-tax-headline">
              Coordination <span className="blue">tax</span>.
            </h2>
            <p className="cna-sub" style={{ marginTop: 28 }}>
              The structural cost of holding cross-functional work together when no system owns
              it end to end. Persistent in well-run organisations running regulated processes.
              Compounding as complexity grows. Three things have to be true to remove it.
            </p>
          </div>

          <div className="cna-tax-stage">
            <div className="cna-tax-pillar">
              <span className="key">01 / Visible</span>
              <span className="name">Name the work that lives between systems.</span>
              <span className="desc">
                Threads. Decisions. Evidence. Approvals. Handoffs. They get a single accountable
                shape, not a search across four tools.
              </span>
              <span className="meter">→ Aging, blockers, owners</span>
            </div>
            <div className="cna-tax-pillar">
              <span className="key">02 / Measurable</span>
              <span className="name">Count the cost in cycle time and reopens.</span>
              <span className="desc">
                Active vs. waiting time per stage. Reopen rate. Evidence completeness at closure.
                The same numbers your CFO already understands.
              </span>
              <span className="meter">→ Cycle time, reopen rate</span>
            </div>
            <div className="cna-tax-pillar">
              <span className="key">03 / Reducible</span>
              <span className="name">Bind the work to the record at the moment of decision.</span>
              <span className="desc">
                Outcomes write back to the system of record on close. Audit assembly is a byproduct,
                not a quarterly scramble.
              </span>
              <span className="meter">→ Lane by lane, week by week</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 ·WHY EXISTING TOOLS DON'T (light) */}
      <section className="cna-section light" id="why">
        <div className="cna-inner">
          <div>
            <div className="cna-eyebrow">
              <span className="num">05</span>
              <span>Why your stack does not fix it.</span>
              <span className="line" />
            </div>
            <h2 className="cna-h2">
              Each one records something true.{" "}
              <span className="dim">None of them owns the work between.</span>
            </h2>
            <p className="cna-sub" style={{ marginTop: 22 }}>
              This is not a knock on your existing systems. It is a structural observation
              about what they were designed to do.
            </p>
          </div>

          <div className="cna-grid-4">
            <div className="cna-tool">
              <div className="glyph"><GlyphLedger /></div>
              <div className="tag">ERP</div>
              <div className="scope">Records the transaction.</div>
            </div>
            <div className="cna-tool">
              <div className="glyph"><GlyphForm /></div>
              <div className="tag">QMS</div>
              <div className="scope">Records the compliance state.</div>
            </div>
            <div className="cna-tool">
              <div className="glyph"><GlyphSchem /></div>
              <div className="tag">PLM</div>
              <div className="scope">Records the product data.</div>
            </div>
            <div className="cna-tool empty">
              <div className="glyph"><GlyphGap /></div>
              <div className="tag">System of coordination</div>
              <div className="scope">The work between. Decisions, evidence, approvals. Owned by nothing.</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 ·THE LAYER / FOUR BAND STACK (paper soft) */}
      <section className="cna-section papersoft" id="how">
        <div className="cna-inner">
          <div>
            <div className="cna-eyebrow">
              <span className="num">06</span>
              <span>What Unifize does differently.</span>
              <span className="line" />
            </div>
            <h2 className="cna-h2">
              The layer that makes the work between reviewable.{" "}
              <span className="dim">It coexists with your record. It does not replace it.</span>
            </h2>
            <p className="cna-sub" style={{ marginTop: 22 }}>
              Outcomes are what you measure. Workflow Components are how you compose. The Core Platform
              is what makes it reliable. Products are how teams meet the platform in their language.
            </p>
          </div>

          <div className="cna-stack">
            <div className="cna-stack-side">
              <div className="lab">Systems of record</div>
              <div className="cna-stack-chip"><span className="nm">QMS</span><span className="arrow">→ context</span></div>
              <div className="cna-stack-chip"><span className="nm">ERP</span><span className="arrow">→ context</span></div>
              <div className="cna-stack-chip"><span className="nm">PLM</span><span className="arrow">→ context</span></div>
              <div className="cna-stack-chip"><span className="nm">MES / LIMS</span><span className="arrow">→ context</span></div>
              <div className="cna-stack-chip" style={{ borderColor: "rgba(0,82,255,0.4)" }}>
                <span className="nm">Write-back</span>
                <span className="arrow" style={{ color: "var(--ink-muted)" }}>← outcomes only</span>
              </div>
            </div>

            <div className="cna-stack-center">
              <div className="cna-band outcomes">
                <span className="band-key">Outcomes + AI Assist</span>
                <span className="band-name">Faster decisions. Lower aging. Higher evidence completeness.</span>
                <span className="band-desc">Weekly measurement. AI accelerates capture, execution, and measurement.</span>
              </div>
              <div className="cna-band">
                <span className="band-key">Product Suite</span>
                <span className="band-name">Pre-validated templates by domain.</span>
                <span className="band-desc">QMS, DMS, PLM, MES, EHS, Supplier Quality, Training. Mapped to how customers think.</span>
              </div>
              <div className="cna-band">
                <span className="band-key">Workflow Components</span>
                <span className="band-name">Stages, gates, roles, approvals, evidence requirements.</span>
                <span className="band-desc">No-code building blocks. Composed by you. Read by AI.</span>
              </div>
              <div className="cna-band">
                <span className="band-key">Core Platform</span>
                <span className="band-name">Audit model. Permissions. Reliability. Connector strategy.</span>
                <span className="band-desc">The foundation that makes the bands above trustworthy.</span>
              </div>
            </div>

            <div className="cna-stack-side">
              <div className="lab">Where work happens</div>
              <div className="cna-stack-chip"><span className="nm">SharePoint</span><span className="arrow">→ artifacts</span></div>
              <div className="cna-stack-chip"><span className="nm">Excel trackers</span><span className="arrow">→ artifacts</span></div>
              <div className="cna-stack-chip"><span className="nm">Outlook</span><span className="arrow">→ decisions</span></div>
              <div className="cna-stack-chip"><span className="nm">Microsoft Teams</span><span className="arrow">→ decisions</span></div>
              <div className="cna-stack-chip" style={{ borderColor: "rgba(0,82,255,0.4)" }}>
                <span className="nm">Captured</span>
                <span className="arrow" style={{ color: "var(--ink-muted)" }}>into the thread</span>
              </div>
            </div>
          </div>

          {/* Product surface · what the layer looks like in practice */}
          <div className="cna-thread-wrap" aria-label="Example thread surface">
            <div className="cna-thread-cap">
              <span>What it looks like</span>
              <span className="line" />
              <span>One thread. Decisions, evidence, approvals. Bound to the record on close.</span>
            </div>
            <div className="cna-thread-card">
              <div className="cna-thread-head">
                <span className="cna-thread-id mono">THR-2419</span>
                <span className="cna-thread-title">Investigation · Lot 24-A8 out-of-spec</span>
                <span className="cna-thread-status">In review</span>
                <span className="cna-thread-aging mono">D 12 / D 5 target</span>
              </div>
              <div className="cna-thread-stages">
                <div className="cna-thread-stage done">
                  <span className="dot" />
                  <span className="nm">Discover</span>
                  <span className="day">D 0</span>
                </div>
                <div className="cna-thread-stage done">
                  <span className="dot" />
                  <span className="nm">Investigate</span>
                  <span className="day">D 3</span>
                </div>
                <div className="cna-thread-stage active">
                  <span className="dot" />
                  <span className="nm">Bind evidence</span>
                  <span className="day">D 7</span>
                </div>
                <div className="cna-thread-stage">
                  <span className="dot" />
                  <span className="nm">Approve</span>
                  <span className="day">·</span>
                </div>
                <div className="cna-thread-stage">
                  <span className="dot" />
                  <span className="nm">Close</span>
                  <span className="day">·</span>
                </div>
              </div>
              <div className="cna-thread-rows">
                <div className="cna-thread-row">
                  <span className="cna-thread-row-tag">Decision</span>
                  <span className="cna-thread-row-text">Root cause confirmed: <b>supplier coupon variance</b>. 5-Whys logged.</span>
                  <span className="cna-thread-row-by">QA Engineer · D 5</span>
                </div>
                <div className="cna-thread-row">
                  <span className="cna-thread-row-tag">Evidence</span>
                  <span className="cna-thread-row-text">Investigation_v3.pdf · Trace_BatchA · 5-Whys</span>
                  <span className="cna-thread-row-by">3 attached · D 7</span>
                </div>
                <div className="cna-thread-row">
                  <span className="cna-thread-row-tag">Approval</span>
                  <span className="cna-thread-row-text">Awaiting <b>VP Quality</b>, <b>Head of Regulatory</b>.</span>
                  <span className="cna-thread-row-by">2 of 3 · D 7</span>
                </div>
                <div className="cna-thread-row write-back">
                  <span className="cna-thread-row-tag">Write-back</span>
                  <span className="cna-thread-row-text"><b>CAPA-1187</b> in QMS · pending closure event</span>
                  <span className="cna-thread-row-by">Bound · D 12</span>
                </div>
              </div>
              <div className="cna-thread-foot">
                <span>Bound to: <b>QMS · ERP · DMS</b></span>
                <span>Audit-ready on close. No reassembly.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 ·DOMAINS (light) */}
      <section className="cna-section light" id="world">
        <div className="cna-inner">
          <div>
            <div className="cna-eyebrow">
              <span className="num">07</span>
              <span>Where it shows up.</span>
              <span className="line" />
            </div>
            <h2 className="cna-h2">
              Fifteen rooms. One layer.{" "}
              <span className="dim">Same shape every time. Trigger, owner, decision, evidence, approval, handoff, closure.</span>
            </h2>
          </div>

          <div className="cna-domains">
            {DOMAINS.map((d) => (
              <div key={d.label} className="cna-domain">
                <span className="nm">{d.label}</span>
                <span className="who">{d.who}</span>
                <span className="trig">{d.trigger}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 ·AI IMPLICATION (dark) */}
      <section className="cna-section dark" id="ai">
        <div className="cna-inner">
          <div>
            <div className="cna-eyebrow">
              <span className="num">08</span>
              <span>What AI changes. And what has to be true first.</span>
              <span className="line" />
            </div>
            <h2 className="cna-h2">
              AI compounds on governed coordination.{" "}
              <span className="dim">It does not compound on email.</span>
            </h2>
            <p className="cna-sub" style={{ marginTop: 22 }}>
              When the thread is the work, AI has something durable to read. Three levels, in sequence.
              Skipping one and the next will not hold.
            </p>
          </div>

          <div className="cna-ai">
            <div className="cna-ai-step">
              <span className="lvl">Level 1 / Execution</span>
              <span className="name">AI moves the thread.</span>
              <span className="desc">
                Drafts the next step. Surfaces missing evidence. Routes the right approver. People
                approve. Work moves.
              </span>
              <span className="lock"><b>Locked by:</b> the thread becoming the unit of work.</span>
            </div>
            <div className="cna-ai-step">
              <span className="lvl">Level 2 / Understanding</span>
              <span className="name">AI reads across threads.</span>
              <span className="desc">
                Recurring root causes. Bottleneck patterns. Processes diverging from how they were
                drawn. The map and the territory get reconciled weekly.
              </span>
              <span className="lock"><b>Locked by:</b> Level 1 producing structured data.</span>
            </div>
            <div className="cna-ai-step">
              <span className="lvl">Level 3 / Transformation</span>
              <span className="name">Coordination tax shrinks every week.</span>
              <span className="desc">
                Lane by lane. Site by site. Compounding because the structured data grows with
                every thread. The number is reducible because it is measurable.
              </span>
              <span className="lock"><b>Locked by:</b> Levels 1 and 2 in production.</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9 ·PROOF (light, Advocacy-grade) */}
      <section className="cna-section light" id="proof">
        <div className="cna-inner">
          <div>
            <div className="cna-eyebrow">
              <span className="num">09</span>
              <span>Proof at the level we can claim it.</span>
              <span className="line" />
            </div>
            <h2 className="cna-h2">
              We are not the tenth QMS.{" "}
              <span className="dim">We are what the QMS connects to so it can close cleanly.</span>
            </h2>
          </div>

          <div className="cna-proof-card">
            <p className="cna-proof-quote">
              We stopped reconstructing investigations from email.{" "}
              <span className="blue">The thread is the investigation now.</span>{" "}
              Audit prep used to take weeks. It takes an afternoon.
            </p>
            <div className="cna-proof-meta">
              <span className="name">VP Quality</span>
              <span className="role">Class II medical device manufacturer · ISO 13485 / 21 CFR Part 11</span>
              <span className="stamp">Advocacy · Customer-attributed quote</span>
            </div>
          </div>

          <p className="cna-sub" style={{ marginTop: 12 }}>
            We make claims at the level our proof supports. Today that is testimonials and qualitative
            workflow descriptions in Medical Devices, Aerospace, Laboratories and Industrial Machinery.
            Scorecard-grade metrics arrive as customers complete their first measurement cycles.
          </p>
        </div>
      </section>

      {/* SECTION 10 ·CTA (dark) */}
      <section className="cna-section dark" id="cta">
        <div className="cna-inner" style={{ textAlign: "center", alignItems: "center" }}>
          <div className="cna-eyebrow" style={{ justifyContent: "center" }}>
            <span className="line" />
            <span>Forty-five minutes. Your process. Your numbers.</span>
            <span className="line" />
          </div>
          <h2 className="cna-cta-h">
            Walk through your week.<br />As one governed thread.
          </h2>
          <p className="cna-sub" style={{ margin: "0 auto" }}>
            We pick one of your processes and rebuild it as a single accountable thread on screen.
            You leave with a baseline number for your coordination tax.
          </p>
          <div className="cna-cta-actions">
            <button className="cna-btn-primary cna-btn-blue">
              Book a demo
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <a href="#tax" className="cna-btn-ghost">Calculate your coordination tax</a>
          </div>
        </div>
      </section>

      <footer className="cna-foot">
        <div className="cna-foot-inner">
          <span>© {new Date().getFullYear()} Unifize. Coordination tax, visible, measurable, reducible. For regulated processes.</span>
          <span className="mono">Concept A · Recognition first</span>
        </div>
      </footer>
    </div>
  );
}
