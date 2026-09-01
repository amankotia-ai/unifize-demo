import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const INDUSTRIES = [
  { key: "med", label: "Medical Devices", multiplier: 1.4 },
  { key: "pharma", label: "Pharma & Biotech", multiplier: 1.6 },
  { key: "auto", label: "Automotive", multiplier: 1.0 },
  { key: "aero", label: "Aerospace & Defense", multiplier: 1.5 },
  { key: "food", label: "Food & Beverage", multiplier: 0.9 },
  { key: "chem", label: "Chemicals & Coatings", multiplier: 1.1 },
];

const SIZES = [
  { key: "200", label: "200 employees", base: 1_900_000 },
  { key: "500", label: "500 employees", base: 4_400_000 },
  { key: "1000", label: "1,000 employees", base: 8_200_000 },
  { key: "2500", label: "2,500 employees", base: 18_400_000 },
  { key: "5000", label: "5,000 employees", base: 33_900_000 },
];

const SYMPTOMS = [
  { name: "Approval latency", share: 0.31, color: "#EF4444", note: "Decisions waiting on signatures across email, chat, meetings." },
  { name: "Rework loops", share: 0.22, color: "#F59E0B", note: "Investigations reopened because evidence was missing or stale." },
  { name: "Audit prep & evidence assembly", share: 0.18, color: "#F59E0B", note: "Pulling artifacts back together at audit time." },
  { name: "Reopened decisions", share: 0.14, color: "#EAB308", note: "Closed records reopened because the thread wasn't owned." },
  { name: "Cross-functional handoffs", share: 0.10, color: "#EAB308", note: "State lost between specialist groups; re-explanation cost." },
  { name: "Tool & version sprawl", share: 0.05, color: "#10B981", note: "Same artifact in three folders, four versions, two owners." },
];

const PROCESS_TRAJECTORY = [
  { week: "W-12", label: "Baseline", cost: 920 },
  { week: "W-8",  label: "Baseline", cost: 905 },
  { week: "W-4",  label: "Baseline", cost: 935 },
  { week: "W0",   label: "Phase 0 go-live", cost: 920, marker: true },
  { week: "W+4",  label: "Layer in place", cost: 720 },
  { week: "W+8",  label: "Capturing", cost: 540 },
  { week: "W+12", label: "Compounding", cost: 410 },
  { week: "W+24", label: "Steady state", cost: 290 },
];

const CURVE_LEVELS = [
  { n: "L1", label: "Execution", caption: "Threads captured. Approvals stamped. Cycle time visible." },
  { n: "L2", label: "Understanding", caption: "AI reads the thread. It proposes. People approve." },
  { n: "L3", label: "Transformation", caption: "Process patterns compound. The number bends." },
];

const DOMAINS = [
  { label: "CAPA",                tax: "$640K", trigger: "Deviation raised",  weight: "advocacy" },
  { label: "ECO / DCO",           tax: "$520K", trigger: "Drawing change",    weight: "advocacy" },
  { label: "Supplier CAR",        tax: "$480K", trigger: "Supplier finding",  weight: "advocacy" },
  { label: "Complaint Handling",  tax: "$410K", trigger: "Customer report",   weight: "evidence" },
  { label: "Deviation / NCR",     tax: "$390K", trigger: "Out-of-spec batch", weight: "evidence" },
  { label: "Audit & Inspection",  tax: "$340K", trigger: "Inspection notice", weight: "evidence" },
  { label: "Document Control",    tax: "$280K", trigger: "SOP revision",      weight: "evidence" },
  { label: "Training Records",    tax: "$220K", trigger: "New SOP issued",    weight: "evidence" },
  { label: "Risk Management",     tax: "$210K", trigger: "Design review",     weight: "evidence" },
  { label: "Design Review",       tax: "$190K", trigger: "Phase gate",        weight: "evidence" },
  { label: "MRB",                 tax: "$170K", trigger: "Material rejected", weight: "hypothesis" },
  { label: "Calibration",         tax: "$140K", trigger: "Calibration due",   weight: "hypothesis" },
  { label: "Periodic Review",     tax: "$130K", trigger: "Annual cycle",      weight: "hypothesis" },
  { label: "Recall Management",   tax: "$120K", trigger: "Field action",      weight: "hypothesis" },
  { label: "Submission Assembly", tax: "$110K", trigger: "510(k) prep",       weight: "hypothesis" },
] as const;

const SOR = ["ERP", "QMS", "PLM", "MES"];
const SOC = ["TEAMS", "OUTLOOK", "SHAREPOINT", "EXCEL"];

const LOGOS = [
  { src: "/logos/John-Deere.png", alt: "John Deere" },
  { src: "/logos/Airbus-Logo.svg", alt: "Airbus" },
  { src: "/logos/TTK-Prestige.png", alt: "TTK Prestige" },
  { src: "/logos/Target-1.png", alt: "Target" },
  { src: "/logos/Applechem.png", alt: "Applechem" },
  { src: "/logos/Red-Sun-Farms.png", alt: "Red Sun Farms" },
  { src: "/logos/Vans.png", alt: "Vans" },
];

const STYLES = `
.opc-root {
  --bg: #08090A;
  --bg-card: #101116;
  --border: rgba(255,255,255,0.08);
  --border-strong: rgba(255,255,255,0.16);
  --text: #FFFFFF;
  --text-muted: rgba(255,255,255,0.58);
  --text-faint: rgba(255,255,255,0.38);
  --accent: #5E6AD2;
  --accent-soft: rgba(94,106,210,0.14);
  --green: #10B981;
  --amber: #F59E0B;
  --red: #EF4444;
  --warm: #F2EFE8;
  --warm-text: #1C1B18;
  --warm-muted: rgba(28,27,24,0.58);
  --warm-faint: rgba(28,27,24,0.42);
  --warm-border: rgba(28,27,24,0.1);

  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  background: var(--bg);
  color: var(--text);
  -webkit-font-smoothing: antialiased;
  letter-spacing: -0.011em;
  min-height: 100vh;
}
.opc-root * { box-sizing: border-box; }
.opc-root .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
.opc-root a { color: inherit; text-decoration: none; }

/* NAV */
.opc-nav {
  position: sticky; top: 0; z-index: 50;
  backdrop-filter: saturate(160%) blur(18px);
  background: rgba(8,9,10,0.72);
  border-bottom: 1px solid var(--border);
}
.opc-nav-inner {
  max-width: 1240px; margin: 0 auto;
  padding: 12px 28px;
  display: flex; align-items: center; gap: 32px;
}
.opc-nav-logo {
  display: inline-flex; align-items: center; gap: 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px; letter-spacing: 0.04em;
}
.opc-nav-logo .dot { width: 8px; height: 8px; border-radius: 2px; background: var(--red); }
.opc-nav-pill {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--text-faint);
  border: 1px solid var(--border); border-radius: 999px;
  padding: 4px 10px;
}
.opc-nav-items {
  display: flex; gap: 24px;
  font-size: 13.5px; color: var(--text-muted);
}
.opc-nav-items a:hover { color: var(--text); }
.opc-nav-actions { margin-left: auto; display: flex; gap: 16px; align-items: center; }
.opc-nav-link { font-size: 13.5px; color: var(--text-muted); }
.opc-nav-btn {
  font-size: 13px; font-weight: 500;
  background: white; color: #0B0D11;
  padding: 7px 14px; border-radius: 999px; border: none; cursor: pointer;
}
.opc-nav-btn:hover { background: #EBECEE; }
@media (max-width: 860px) { .opc-nav-items { display: none; } }

/* SHARED */
.opc-section {
  max-width: 1240px; margin: 0 auto;
  padding: 120px 28px;
}
.opc-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--text-faint);
  display: flex; align-items: center; gap: 12px;
  margin-bottom: 28px;
}
.opc-eyebrow .num { color: var(--text); }
.opc-eyebrow .line { flex: 0 0 80px; height: 1px; background: var(--border); }
.opc-h2 {
  font-size: clamp(32px, 4.6vw, 56px);
  line-height: 1.04;
  letter-spacing: -0.034em;
  font-weight: 500;
  max-width: 22ch;
  margin: 0;
}
.opc-h2 .dim { color: var(--text-muted); }
.opc-sub {
  margin-top: 22px;
  font-size: 16px;
  color: var(--text-muted);
  max-width: 64ch;
  line-height: 1.5;
}

.opc-btn-primary {
  font-family: inherit; font-size: 14px; font-weight: 500;
  background: var(--red); color: white;
  padding: 11px 20px; border-radius: 999px;
  border: none; cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px;
}
.opc-btn-primary:hover { background: #DC2626; }
.opc-btn-ghost {
  font-family: inherit; font-size: 14px; font-weight: 500;
  background: transparent; color: var(--text);
  padding: 11px 18px; border-radius: 999px;
  border: 1px solid var(--border-strong); cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px;
}
.opc-btn-ghost:hover { background: rgba(255,255,255,0.04); }

/* WARM BAND */
.opc-warm-band { background: var(--warm); color: var(--warm-text); }
.opc-warm-band .opc-eyebrow { color: var(--warm-faint); }
.opc-warm-band .opc-eyebrow .num { color: var(--warm-text); }
.opc-warm-band .opc-eyebrow .line { background: var(--warm-border); }
.opc-warm-band .opc-h2 { color: var(--warm-text); }
.opc-warm-band .opc-h2 .dim { color: var(--warm-muted); }
.opc-warm-band .opc-sub { color: var(--warm-muted); }

/* SECTION 1 — HERO COUNTER */
.opc-hero {
  position: relative;
  max-width: 1240px; margin: 0 auto;
  padding: 80px 28px 120px;
  overflow: hidden;
  isolation: isolate;
}
.opc-hero-glow {
  position: absolute; inset: 0;
  background:
    radial-gradient(60% 50% at 50% 30%, rgba(239,68,68,0.18) 0%, rgba(239,68,68,0) 70%),
    radial-gradient(60% 60% at 80% 80%, rgba(94,106,210,0.18) 0%, rgba(94,106,210,0) 70%);
  pointer-events: none;
  z-index: -1;
}
.opc-hero-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--text-faint);
  display: inline-flex; align-items: center; gap: 10px;
  margin-bottom: 36px;
}
.opc-hero-tag .dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--red);
  box-shadow: 0 0 0 4px rgba(239,68,68,0.18);
  animation: opc-pulse 1.6s ease-in-out infinite;
}
@keyframes opc-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.9); }
}
@media (prefers-reduced-motion: reduce) { .opc-hero-tag .dot { animation: none; } }

.opc-hero-h1 {
  font-size: clamp(34px, 4.8vw, 60px);
  line-height: 1.04;
  letter-spacing: -0.038em;
  font-weight: 500;
  max-width: 22ch;
  margin: 0;
}
.opc-hero-h1 .em { color: var(--text-muted); font-style: italic; font-weight: 450; }
.opc-counter {
  margin-top: 40px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  border: 1px solid rgba(239,68,68,0.32);
  border-radius: 24px;
  padding: 36px;
  background:
    radial-gradient(60% 80% at 50% 0%, rgba(239,68,68,0.14) 0%, rgba(8,9,10,0) 60%),
    var(--bg-card);
  position: relative;
  overflow: hidden;
}
.opc-counter-grid {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 36px;
  align-items: end;
}
@media (max-width: 900px) {
  .opc-counter-grid { grid-template-columns: 1fr; gap: 28px; }
}
.opc-counter-display {
  display: flex; flex-direction: column; gap: 8px;
}
.opc-counter-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--text-faint);
  display: flex; align-items: center; gap: 10px;
}
.opc-counter-label .pill {
  background: rgba(239,68,68,0.18);
  color: var(--red);
  padding: 3px 8px; border-radius: 999px;
  border: 1px solid rgba(239,68,68,0.32);
  font-size: 9.5px; letter-spacing: 0.16em;
}
.opc-counter-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(56px, 9vw, 132px);
  line-height: 0.96;
  letter-spacing: -0.05em;
  color: white;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  display: flex; align-items: baseline; gap: 12px;
  transition: opacity 0.3s ease;
}
.opc-counter-value .unit {
  font-size: clamp(22px, 3.4vw, 42px);
  letter-spacing: 0.04em;
  color: rgba(239,68,68,0.92);
  font-weight: 500;
}
.opc-counter-meta {
  margin-top: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px; letter-spacing: 0.06em;
  color: var(--text-muted);
  display: flex; gap: 16px; flex-wrap: wrap;
}
.opc-counter-meta .sep { color: var(--text-faint); }
.opc-counter-meta .accent { color: white; }

.opc-counter-controls {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  min-width: 320px;
}
.opc-control { display: flex; flex-direction: column; gap: 8px; }
.opc-control-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--text-faint);
}
.opc-control-pills {
  display: flex; flex-wrap: wrap; gap: 6px;
}
.opc-pill {
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 7px 11px;
  border-radius: 999px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.04em;
  cursor: pointer;
  transition: all .14s;
}
.opc-pill:hover { background: rgba(255,255,255,0.08); color: var(--text); }
.opc-pill.active {
  background: rgba(239,68,68,0.14);
  border-color: rgba(239,68,68,0.45);
  color: white;
}

/* Background heatmap */
.opc-counter-heatmap {
  position: absolute; inset: 0; pointer-events: none; opacity: 0.5;
  background-image:
    radial-gradient(circle at 22% 78%, rgba(239,68,68,0.18) 0, rgba(239,68,68,0) 18%),
    radial-gradient(circle at 60% 30%, rgba(245,158,11,0.16) 0, rgba(245,158,11,0) 22%),
    radial-gradient(circle at 80% 70%, rgba(239,68,68,0.14) 0, rgba(239,68,68,0) 18%),
    radial-gradient(circle at 38% 18%, rgba(245,158,11,0.10) 0, rgba(245,158,11,0) 18%);
  mix-blend-mode: screen;
}

/* SECTION 2 — WATERFALL */
.opc-waterfall {
  margin-top: 56px;
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 36px;
  background: rgba(255,255,255,0.018);
}
.opc-waterfall-head {
  display: flex; justify-content: space-between; align-items: baseline;
  margin-bottom: 28px;
}
.opc-waterfall-head .total {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px; letter-spacing: 0.14em;
  color: var(--text-faint);
}
.opc-waterfall-head .total .v {
  color: var(--red); font-weight: 500;
  font-size: 18px;
  letter-spacing: -0.02em;
  margin-left: 10px;
}
.opc-bar {
  display: grid;
  grid-template-columns: 240px 1fr 100px;
  align-items: center;
  gap: 18px;
  padding: 14px 0;
  border-top: 1px solid var(--border);
}
.opc-bar:first-of-type { border-top: 0; }
.opc-bar .name {
  font-size: 14px; font-weight: 500; letter-spacing: -0.01em;
}
.opc-bar .name .note {
  display: block;
  margin-top: 4px;
  font-size: 12px; font-weight: 400;
  color: var(--text-muted);
  letter-spacing: 0;
}
.opc-bar .track {
  position: relative;
  height: 8px; border-radius: 4px;
  background: rgba(255,255,255,0.04);
  overflow: hidden;
}
.opc-bar .track .fill {
  position: absolute; left: 0; top: 0; bottom: 0;
  border-radius: 4px;
  transition: width .8s cubic-bezier(0.22, 1, 0.36, 1);
}
.opc-bar .pct {
  text-align: right;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px; letter-spacing: 0.04em;
  color: var(--text);
  font-variant-numeric: tabular-nums;
}
.opc-bar .pct .dollar {
  color: var(--text-muted);
  font-size: 11px;
  margin-left: 10px;
}
@media (max-width: 800px) {
  .opc-bar { grid-template-columns: 1fr; }
  .opc-bar .track { display: none; }
}

/* SECTION 3 — STRUCTURAL CAUSE (gap heatmap) */
.opc-cause {
  margin-top: 56px;
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 48px 36px;
  background:
    radial-gradient(50% 60% at 50% 50%, rgba(239,68,68,0.10) 0%, rgba(8,9,10,0) 70%);
  display: grid;
  grid-template-columns: 1fr 96px 1fr;
  gap: 0; align-items: stretch;
  min-height: 320px;
}
@media (max-width: 980px) {
  .opc-cause { grid-template-columns: 1fr; gap: 16px; padding: 36px 24px; }
  .opc-cause-seam { display: none; }
}
.opc-cause-cluster {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
  align-content: start;
}
.opc-cause-head {
  grid-column: span 2;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--text-faint);
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 4px;
}
.opc-cause-head .dot {
  width: 5px; height: 5px; border-radius: 50%; background: var(--text-faint);
}
.opc-cause-tile {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: rgba(255,255,255,0.025);
  padding: 14px 14px 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.12em;
  color: var(--text);
  min-height: 92px;
  display: flex; flex-direction: column; justify-content: space-between;
}
.opc-cause-tile .meta {
  font-size: 9.5px; letter-spacing: 0.14em;
  color: var(--text-faint);
  margin-top: 18px;
}
.opc-cause-tile.chaos {
  background: transparent;
  border-style: dashed;
  border-color: rgba(255,255,255,0.14);
}
.opc-cause-seam {
  position: relative;
  display: flex; align-items: center; justify-content: center;
}
.opc-cause-seam::before {
  content: ""; position: absolute; top: 0; bottom: 0;
  width: 1px; left: 50%;
  background-image: linear-gradient(180deg,
    rgba(239,68,68,0.4) 50%, transparent 0%);
  background-size: 1px 6px;
}
.opc-cause-seam .label {
  position: relative;
  background: var(--bg); padding: 8px 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--red);
  text-align: center;
  writing-mode: vertical-rl; transform: rotate(180deg);
}
.opc-cause-seam .heatpoint {
  position: absolute;
  width: 22px; height: 22px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(239,68,68,0.5) 0%, rgba(239,68,68,0) 70%);
  pointer-events: none;
}
.opc-cause-seam .heatpoint.h1 { top: 18%; }
.opc-cause-seam .heatpoint.h2 { top: 52%; }
.opc-cause-seam .heatpoint.h3 { top: 78%; }

/* SECTION 4 — TAX NAMED */
.opc-tax {
  background: var(--bg-card);
  padding: 140px 28px;
  text-align: center;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.opc-tax-inner { max-width: 1100px; margin: 0 auto; }
.opc-tax-pre {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--text-faint);
  display: inline-flex; align-items: center; gap: 14px;
  margin-bottom: 36px;
}
.opc-tax-pre .line { width: 64px; height: 1px; background: var(--border); }
.opc-tax-h {
  font-size: clamp(56px, 9vw, 124px);
  line-height: 0.94;
  letter-spacing: -0.054em;
  font-weight: 500;
  margin: 0;
}
.opc-tax-stat {
  margin-top: 36px;
  display: inline-flex; flex-direction: column; align-items: center; gap: 6px;
}
.opc-tax-stat .v {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 500;
  color: var(--red);
  letter-spacing: -0.03em;
}
.opc-tax-stat .k {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--text-faint);
  max-width: 50ch;
  text-align: center;
  line-height: 1.5;
}

/* SECTION 5 — THE LAYER */
.opc-layer {
  margin-top: 56px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 36px;
  background:
    radial-gradient(60% 70% at 50% 50%, rgba(94,106,210,0.10) 0%, rgba(8,9,10,0) 60%);
}
@media (max-width: 980px) { .opc-layer { grid-template-columns: 1fr; } }
.opc-layer-stage {
  position: relative;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: rgba(255,255,255,0.015);
  padding: 28px;
  min-height: 360px;
  display: flex; flex-direction: column; justify-content: space-between; gap: 18px;
}
.opc-layer-cluster {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;
}
.opc-layer-tile {
  border: 1px solid var(--border);
  border-radius: 6px;
  background: rgba(255,255,255,0.025);
  padding: 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.14em;
  text-align: center;
  color: var(--text-muted);
}
.opc-layer-band {
  position: relative;
  border: 1px solid rgba(94,106,210,0.6);
  background:
    linear-gradient(90deg, rgba(94,106,210,0.18) 0%, rgba(94,106,210,0.32) 50%, rgba(94,106,210,0.18) 100%);
  border-radius: 10px;
  padding: 18px 20px;
  display: grid; grid-template-columns: auto 1fr auto; gap: 16px; align-items: center;
  box-shadow: 0 20px 60px -20px rgba(94,106,210,0.6);
}
.opc-layer-band::before {
  content: "MEASUREMENT LAYER";
  position: absolute; top: -10px; left: 18px;
  background: var(--bg);
  padding: 0 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.2em; color: var(--accent);
}
.opc-layer-band .dial {
  width: 56px; height: 56px;
  border-radius: 50%;
  border: 6px solid rgba(255,255,255,0.1);
  border-top-color: rgba(16,185,129,0.85);
  border-right-color: rgba(245,158,11,0.6);
  transform: rotate(-30deg);
}
.opc-layer-band .label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.16em;
  color: rgba(255,255,255,0.92);
  display: flex; flex-direction: column; gap: 4px;
}
.opc-layer-band .label .v {
  font-family: 'JetBrains Mono', monospace;
  font-size: 22px;
  letter-spacing: -0.02em;
  color: white; font-weight: 500;
}
.opc-layer-band .label .k {
  font-size: 9.5px; letter-spacing: 0.18em;
  color: rgba(255,255,255,0.65);
}
.opc-layer-band .delta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.06em;
  color: var(--green);
  background: rgba(16,185,129,0.12);
  padding: 6px 10px;
  border: 1px solid rgba(16,185,129,0.32);
  border-radius: 999px;
}
.opc-layer-copy h3 {
  font-size: 28px; font-weight: 500; line-height: 1.12; letter-spacing: -0.024em; margin: 0;
}
.opc-layer-copy .h-em { color: var(--green); }
.opc-layer-copy p {
  margin: 16px 0 0;
  font-size: 15.5px; color: var(--text-muted); line-height: 1.5;
}
.opc-layer-bullets { margin-top: 26px; display: grid; gap: 12px; }
.opc-layer-bullet {
  display: grid; grid-template-columns: 100px 1fr; gap: 18px; align-items: baseline;
  padding: 12px 0; border-top: 1px solid var(--border);
  font-size: 14px; color: var(--text-muted);
}
.opc-layer-bullet .k {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--text);
}

/* SECTION 6 — TRAJECTORY CHART */
.opc-trajectory {
  margin-top: 56px;
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 36px 36px 28px;
  background: rgba(255,255,255,0.018);
}
.opc-traj-svg {
  width: 100%;
  display: block;
}
.opc-traj-foot {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}
.opc-traj-stat {
  display: flex; flex-direction: column; gap: 6px;
}
.opc-traj-stat .k {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--text-faint);
}
.opc-traj-stat .v {
  font-size: 28px; font-weight: 500; letter-spacing: -0.024em;
}
.opc-traj-stat .v.green { color: var(--green); }
.opc-traj-stat .v.red { color: var(--red); }

/* SECTION 7 — COMPOUNDING CURVE */
.opc-curve {
  margin-top: 56px;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 48px;
  align-items: center;
}
@media (max-width: 980px) { .opc-curve { grid-template-columns: 1fr; } }
.opc-curve-svg {
  width: 100%; display: block;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: rgba(255,255,255,0.018);
  padding: 28px;
  min-height: 320px;
}
.opc-curve-list { display: grid; gap: 16px; }
.opc-curve-row {
  display: grid; grid-template-columns: 56px 1fr; gap: 18px; align-items: baseline;
  padding: 18px 0; border-top: 1px solid var(--border);
}
.opc-curve-row:first-child { border-top: 0; }
.opc-curve-row .n {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.18em;
  color: var(--text-faint);
}
.opc-curve-row .body .label {
  font-size: 18px; font-weight: 500; letter-spacing: -0.018em;
}
.opc-curve-row .body .caption {
  margin-top: 6px;
  font-size: 13.5px; color: var(--text-muted); line-height: 1.5;
}

/* SECTION 8 — DOMAIN GRID */
.opc-domains {
  margin-top: 60px;
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
}
@media (max-width: 1000px) { .opc-domains { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 600px) { .opc-domains { grid-template-columns: repeat(2, 1fr); } }
.opc-domain {
  background: var(--bg);
  padding: 22px 18px;
  display: flex; flex-direction: column; gap: 10px;
  min-height: 130px;
  cursor: pointer;
  transition: background .14s;
}
.opc-domain:hover { background: rgba(255,255,255,0.04); }
.opc-domain .label {
  font-size: 16px; font-weight: 500; letter-spacing: -0.016em;
}
.opc-domain .tax {
  font-family: 'JetBrains Mono', monospace;
  font-size: 22px; font-weight: 500; letter-spacing: -0.024em;
  color: var(--red);
}
.opc-domain .meta {
  margin-top: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--text-faint);
}
.opc-domain.advocacy { background: rgba(239,68,68,0.06); }
.opc-domain.advocacy:hover { background: rgba(239,68,68,0.12); }
.opc-domain.evidence { background: rgba(255,255,255,0.025); }
.opc-domain.hypothesis .label { color: var(--text-muted); }
.opc-domain.hypothesis .tax { color: rgba(239,68,68,0.7); }

/* SECTION 9 — CTA */
.opc-cta {
  margin: 0 28px 80px;
  max-width: 1240px; margin-left: auto; margin-right: auto;
  border-radius: 24px;
  border: 1px solid rgba(239,68,68,0.32);
  background:
    radial-gradient(50% 80% at 50% 0%, rgba(239,68,68,0.22) 0%, rgba(8,9,10,0) 70%),
    var(--bg-card);
  padding: 72px 48px;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 56px;
  align-items: center;
}
@media (max-width: 900px) { .opc-cta { grid-template-columns: 1fr; padding: 56px 32px; } }
.opc-cta-h {
  font-size: clamp(34px, 4.6vw, 56px);
  font-weight: 500;
  letter-spacing: -0.034em;
  line-height: 1.04;
  margin: 0;
  max-width: 18ch;
}
.opc-cta-sub {
  margin: 22px 0 0;
  font-size: 15.5px; color: var(--text-muted); line-height: 1.5;
  max-width: 52ch;
}
.opc-cta-actions {
  margin-top: 36px;
  display: inline-flex; gap: 12px; flex-wrap: wrap;
}
.opc-cta-mini-counter {
  background: var(--bg);
  border: 1px solid rgba(239,68,68,0.32);
  border-radius: 16px;
  padding: 28px 28px;
  font-family: 'JetBrains Mono', monospace;
}
.opc-cta-mini-counter .k {
  font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--text-faint);
  margin-bottom: 8px;
}
.opc-cta-mini-counter .v {
  font-size: clamp(40px, 6vw, 64px);
  letter-spacing: -0.038em;
  color: var(--text);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}
.opc-cta-mini-counter .v .unit {
  font-size: 14px; letter-spacing: 0.04em;
  color: rgba(239,68,68,0.92);
  margin-left: 6px;
}
.opc-cta-mini-counter .meta {
  margin-top: 14px;
  font-size: 11px; letter-spacing: 0.06em; color: var(--text-muted);
}

.opc-cta-logos {
  margin-top: 48px;
  display: flex; gap: 36px; justify-content: center; align-items: center;
  flex-wrap: wrap; opacity: 0.7;
  grid-column: 1 / -1;
}
.opc-cta-logos img { height: 22px; filter: brightness(0) invert(1); opacity: 0.85; }

/* FOOTER */
.opc-foot {
  border-top: 1px solid var(--border);
  padding: 28px;
}
.opc-foot-inner {
  max-width: 1240px; margin: 0 auto;
  display: flex; justify-content: space-between;
  font-size: 12px; color: var(--text-faint);
  flex-wrap: wrap; gap: 16px;
}
`;

function formatMoney(n: number): { value: string; unit: string } {
  if (n >= 1_000_000) return { value: (n / 1_000_000).toFixed(1), unit: "M" };
  if (n >= 1_000) return { value: (n / 1_000).toFixed(0), unit: "K" };
  return { value: String(Math.round(n)), unit: "" };
}

function useAnimatedNumber(target: number, durationMs = 700): number {
  const [value, setValue] = useState(target);
  useEffect(() => {
    const start = value;
    const startedAt = performance.now();
    let frame = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - startedAt) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(start + (target - start) * eased);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  return value;
}

export default function HomeOptionC() {
  const [industry, setIndustry] = useState(INDUSTRIES[0].key);
  const [size, setSize] = useState(SIZES[2].key);

  useEffect(() => {
    document.title = "Option C — Measurement-led";
  }, []);

  const target = useMemo(() => {
    const ind = INDUSTRIES.find((i) => i.key === industry)!;
    const sz = SIZES.find((s) => s.key === size)!;
    return Math.round(sz.base * ind.multiplier);
  }, [industry, size]);

  const animated = useAnimatedNumber(target);
  const fmt = formatMoney(animated);

  return (
    <div className="opc-root">
      <style>{STYLES}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,450;0,500;0,600;1,400;1,450&family=JetBrains+Mono:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* NAV */}
      <nav className="opc-nav">
        <div className="opc-nav-inner">
          <Link to="/option-c" className="opc-nav-logo">
            <span className="dot" />
            <span>UNIFIZE</span>
          </Link>
          <span className="opc-nav-pill">Option C · Measurement-led</span>
          <div className="opc-nav-items">
            <a href="#counter">The bill</a>
            <a href="#cause">Why structural</a>
            <a href="#layer">The layer</a>
            <a href="#world">Your world</a>
          </div>
          <div className="opc-nav-actions">
            <Link to="/option-a" className="opc-nav-link mono">→ Option A</Link>
            <Link to="/option-b" className="opc-nav-link mono">→ Option B</Link>
            <button className="opc-nav-btn">See your tax</button>
          </div>
        </div>
      </nav>

      {/* SECTION 1 — HERO COUNTER */}
      <section className="opc-hero" id="counter">
        <span className="opc-hero-glow" aria-hidden />
        <div className="opc-hero-tag">
          <span className="dot" />
          <span>Live · the bill</span>
        </div>
        <h1 className="opc-hero-h1">
          Your company loses{" "}
          <span className="em">this much per year</span>{" "}
          to coordination tax.
        </h1>

        <div className="opc-counter">
          <span className="opc-counter-heatmap" aria-hidden />
          <div className="opc-counter-grid">
            <div className="opc-counter-display">
              <div className="opc-counter-label">
                <span>Annual coordination tax</span>
                <span className="pill">LIVE</span>
              </div>
              <div className="opc-counter-value" aria-live="polite">
                <span>${fmt.value}</span>
                <span className="unit">{fmt.unit}</span>
              </div>
              <div className="opc-counter-meta">
                <span><span className="accent">{INDUSTRIES.find((i) => i.key === industry)?.label}</span></span>
                <span className="sep">·</span>
                <span>{SIZES.find((s) => s.key === size)?.label}</span>
                <span className="sep">·</span>
                <span>15–30% of regulated white-collar ops</span>
              </div>
            </div>

            <div className="opc-counter-controls">
              <div className="opc-control">
                <span className="opc-control-label">Industry</span>
                <div className="opc-control-pills">
                  {INDUSTRIES.map((i) => (
                    <button
                      key={i.key}
                      type="button"
                      className={`opc-pill ${industry === i.key ? "active" : ""}`}
                      onClick={() => setIndustry(i.key)}
                    >
                      {i.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="opc-control">
                <span className="opc-control-label">Company size</span>
                <div className="opc-control-pills">
                  {SIZES.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      className={`opc-pill ${size === s.key ? "active" : ""}`}
                      onClick={() => setSize(s.key)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — WATERFALL */}
      <section className="opc-section" style={{ paddingTop: 60 }}>
        <div className="opc-eyebrow">
          <span className="num">02</span>
          <span className="line" />
          <span>Where the number comes from</span>
        </div>
        <h2 className="opc-h2">
          Six contributions add up to the bill.{" "}
          <span className="dim">Each is the measurable cost of holding cross-functional work together.</span>
        </h2>

        <div className="opc-waterfall">
          <div className="opc-waterfall-head">
            <div className="mono" style={{ fontSize: 10.5, letterSpacing: "0.16em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
              ≈ Symptom Breakdown
            </div>
            <div className="total mono">
              TOTAL <span className="v">${fmt.value}{fmt.unit}/yr</span>
            </div>
          </div>

          {SYMPTOMS.map((s) => (
            <div key={s.name} className="opc-bar">
              <div className="name">
                {s.name}
                <span className="note">{s.note}</span>
              </div>
              <div className="track">
                <span
                  className="fill"
                  style={{ width: `${Math.round(s.share * 100)}%`, background: s.color }}
                />
              </div>
              <div className="pct mono">
                {Math.round(s.share * 100)}%
                <span className="dollar">·  ${formatMoney(target * s.share).value}{formatMoney(target * s.share).unit}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3 — STRUCTURAL CAUSE */}
      <section className="opc-section" id="cause" style={{ paddingTop: 60 }}>
        <div className="opc-eyebrow">
          <span className="num">03</span>
          <span className="line" />
          <span>Why the number is structural</span>
        </div>
        <h2 className="opc-h2">
          Records on one side. Work on the other.{" "}
          <span className="dim">The cost lives in the gap, not in any one tool.</span>
        </h2>

        <div className="opc-cause">
          <div className="opc-cause-cluster">
            <div className="opc-cause-head">
              <span className="dot" />
              <span>Systems of record</span>
            </div>
            {SOR.map((s) => (
              <div key={s} className="opc-cause-tile">
                <div>{s}</div>
                <div className="meta">CLOSED RECORD</div>
              </div>
            ))}
          </div>

          <div className="opc-cause-seam">
            <span className="heatpoint h1" />
            <span className="heatpoint h2" />
            <span className="heatpoint h3" />
            <span className="label">The gap · cost accumulates</span>
          </div>

          <div className="opc-cause-cluster">
            <div className="opc-cause-head">
              <span className="dot" />
              <span>Systems of coordination</span>
            </div>
            {SOC.map((s) => (
              <div key={s} className="opc-cause-tile chaos">
                <div>{s}</div>
                <div className="meta">UNCAPTURED</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — TAX NAMED */}
      <section className="opc-tax">
        <div className="opc-tax-inner">
          <div className="opc-tax-pre">
            <span className="line" />
            <span>04 · The name on the line item</span>
            <span className="line" />
          </div>
          <h2 className="opc-tax-h">Coordination tax.</h2>
          <div className="opc-tax-stat">
            <div className="v mono">15–30%</div>
            <div className="k mono">of white-collar operational cost in regulated processes</div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — THE LAYER */}
      <section className="opc-section" id="layer" style={{ paddingTop: 60 }}>
        <div className="opc-eyebrow">
          <span className="num">05</span>
          <span className="line" />
          <span>The layer that moves the number</span>
        </div>
        <h2 className="opc-h2">
          Unifize makes the number visible, measurable,{" "}
          <span className="dim">and reducible. The layer between the two worlds, instrumented.</span>
        </h2>

        <div className="opc-layer">
          <div className="opc-layer-stage">
            <div className="opc-layer-cluster">
              {SOR.map((s) => (
                <div key={s} className="opc-layer-tile">{s}</div>
              ))}
            </div>
            <div className="opc-layer-band">
              <div className="dial" aria-hidden />
              <div className="label">
                <span className="k">CURRENT TAX</span>
                <span className="v">${fmt.value}{fmt.unit}/yr</span>
              </div>
              <div className="delta mono">↓ ON LAYER</div>
            </div>
            <div className="opc-layer-cluster">
              {SOC.map((s) => (
                <div key={s} className="opc-layer-tile">{s}</div>
              ))}
            </div>
          </div>

          <div className="opc-layer-copy">
            <h3>
              The number is structural — and now <span className="h-em">structurally fixable</span>.
            </h3>
            <p>
              Records keep doing what records do. Channels keep doing what channels do. The layer captures the work between, and prices it. What gets captured gets measured. What gets measured gets reduced.
            </p>
            <div className="opc-layer-bullets">
              <div className="opc-layer-bullet">
                <span className="k">Visible</span>
                <span>Threads, decisions, evidence, approvals — captured at the commit points.</span>
              </div>
              <div className="opc-layer-bullet">
                <span className="k">Measurable</span>
                <span>Cycle time, reopen rate, evidence completeness, approval latency — by process, by team, by quarter.</span>
              </div>
              <div className="opc-layer-bullet">
                <span className="k">Reducible</span>
                <span>Process patterns surface. AI proposes the next step. People approve. The number bends.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — TRAJECTORY CHART */}
      <section className="opc-section" style={{ paddingTop: 60 }}>
        <div className="opc-eyebrow">
          <span className="num">06</span>
          <span className="line" />
          <span>How the number moves</span>
        </div>
        <h2 className="opc-h2">
          One process. Twenty-four weeks.{" "}
          <span className="dim">Baseline, intervention, measured reduction.</span>
        </h2>

        <div className="opc-trajectory">
          <TrajectorySvg />
          <div className="opc-traj-foot">
            <div className="opc-traj-stat">
              <span className="k">Baseline</span>
              <span className="v">$920K/yr</span>
            </div>
            <div className="opc-traj-stat">
              <span className="k">Steady state</span>
              <span className="v green">$290K/yr</span>
            </div>
            <div className="opc-traj-stat">
              <span className="k">Reduction</span>
              <span className="v red">−68%</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — COMPOUNDING CURVE */}
      <section className="opc-section" style={{ paddingTop: 60 }}>
        <div className="opc-eyebrow">
          <span className="num">07</span>
          <span className="line" />
          <span>Compounding</span>
        </div>
        <h2 className="opc-h2">
          The shape of value over time.{" "}
          <span className="dim">Three levels. The number doesn't just drop — it compounds.</span>
        </h2>

        <div className="opc-curve">
          <CompoundingSvg />
          <div className="opc-curve-list">
            {CURVE_LEVELS.map((c) => (
              <div key={c.n} className="opc-curve-row">
                <div className="n">{c.n}</div>
                <div className="body">
                  <div className="label">{c.label}</div>
                  <div className="caption">{c.caption}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — DOMAIN GRID */}
      <section className="opc-section" id="world" style={{ paddingTop: 60 }}>
        <div className="opc-eyebrow">
          <span className="num">08</span>
          <span className="line" />
          <span>Your world, priced</span>
        </div>
        <h2 className="opc-h2">
          Fifteen domains.{" "}
          <span className="dim">Each one a coordination tax bill of its own.</span>
        </h2>

        <div className="opc-domains">
          {DOMAINS.map((d) => (
            <div key={d.label} className={`opc-domain ${d.weight}`}>
              <div className="label">{d.label}</div>
              <div className="tax mono">{d.tax}</div>
              <div className="meta">{d.trigger}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 9 — CTA */}
      <section className="opc-cta">
        <div>
          <h2 className="opc-cta-h">See your coordination tax. In your numbers.</h2>
          <p className="opc-cta-sub">
            Forty-five minutes. We pick one of your processes and price the gap with you. The number that comes out is the number we'll measure against.
          </p>
          <div className="opc-cta-actions">
            <button className="opc-btn-primary">
              See your coordination tax
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="opc-btn-ghost">Book a demo</button>
          </div>
        </div>

        <div className="opc-cta-mini-counter" aria-hidden>
          <div className="k">Your annual tax</div>
          <div className="v mono">
            ${fmt.value}<span className="unit">{fmt.unit}/yr</span>
          </div>
          <div className="meta">{INDUSTRIES.find((i) => i.key === industry)?.label} · {SIZES.find((s) => s.key === size)?.label}</div>
        </div>

        <div className="opc-cta-logos">
          {LOGOS.map((l) => (
            <img key={l.alt} src={l.src} alt={l.alt} loading="lazy" />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="opc-foot">
        <div className="opc-foot-inner">
          <span>© {new Date().getFullYear()} Unifize. Measurement-led exploration.</span>
          <span className="mono">Partnered with Microsoft.</span>
        </div>
      </footer>
    </div>
  );
}

function TrajectorySvg() {
  // viewBox 720 x 280
  const W = 720;
  const H = 280;
  const padL = 48;
  const padR = 16;
  const padT = 20;
  const padB = 36;

  const xs = PROCESS_TRAJECTORY.map((_, i) =>
    padL + (i / (PROCESS_TRAJECTORY.length - 1)) * (W - padL - padR)
  );
  const maxCost = 1000;
  const ys = PROCESS_TRAJECTORY.map(
    (p) => padT + (1 - p.cost / maxCost) * (H - padT - padB)
  );
  const path = PROCESS_TRAJECTORY.map((_, i) =>
    i === 0 ? `M ${xs[i]} ${ys[i]}` : `L ${xs[i]} ${ys[i]}`
  ).join(" ");
  const areaPath = `${path} L ${xs[xs.length - 1]} ${H - padB} L ${xs[0]} ${H - padB} Z`;
  const markerIdx = PROCESS_TRAJECTORY.findIndex((p) => p.marker);

  // Gridlines
  const gridY = [200, 400, 600, 800, 1000];

  return (
    <svg className="opc-traj-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Coordination tax trajectory: flat baseline of about $920K per year for 12 weeks, intervention at week 0 (Phase 0 go-live), then a measured step-down across the next 24 weeks reaching about $290K per year">
      <defs>
        <linearGradient id="opc-traj-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#10B981" stopOpacity="0.32" />
          <stop offset="1" stopColor="#10B981" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Gridlines */}
      {gridY.map((g) => {
        const y = padT + (1 - g / maxCost) * (H - padT - padB);
        return (
          <g key={g}>
            <line x1={padL} x2={W - padR} y1={y} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="2 4" />
            <text x={padL - 6} y={y + 3} textAnchor="end" fill="rgba(255,255,255,0.42)" fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="0.06em">
              ${g}K
            </text>
          </g>
        );
      })}

      {/* Area */}
      <path d={areaPath} fill="url(#opc-traj-area)" />

      {/* Line */}
      <path d={path} fill="none" stroke="#10B981" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />

      {/* Intervention marker — vertical line + label */}
      <line
        x1={xs[markerIdx]}
        x2={xs[markerIdx]}
        y1={padT}
        y2={H - padB}
        stroke="#EF4444"
        strokeWidth="1"
        strokeDasharray="3 4"
      />
      <rect
        x={xs[markerIdx] + 4}
        y={padT - 2}
        width={140}
        height={16}
        rx={3}
        fill="rgba(8,9,10,1)"
        stroke="rgba(239,68,68,0.32)"
      />
      <text
        x={xs[markerIdx] + 12}
        y={padT + 9}
        fill="rgba(239,68,68,0.92)"
        fontFamily="JetBrains Mono, monospace"
        fontSize="9"
        letterSpacing="0.16em"
      >
        ! PHASE 0 GO-LIVE
      </text>

      {/* Points + week labels */}
      {PROCESS_TRAJECTORY.map((p, i) => (
        <g key={p.week}>
          <circle cx={xs[i]} cy={ys[i]} r="3" fill="#08090A" stroke="#10B981" strokeWidth="1.4" />
          <text
            x={xs[i]}
            y={H - padB + 18}
            textAnchor="middle"
            fill="rgba(255,255,255,0.5)"
            fontFamily="JetBrains Mono, monospace"
            fontSize="9"
            letterSpacing="0.06em"
          >
            {p.week}
          </text>
        </g>
      ))}

      {/* Annotations */}
      <text
        x={xs[0] + 8}
        y={ys[0] - 10}
        fill="rgba(255,255,255,0.7)"
        fontFamily="JetBrains Mono, monospace"
        fontSize="10"
        letterSpacing="0.06em"
      >
        Baseline · $920K
      </text>
      <text
        x={xs[xs.length - 1] - 4}
        y={ys[ys.length - 1] - 10}
        textAnchor="end"
        fill="rgba(16,185,129,0.95)"
        fontFamily="JetBrains Mono, monospace"
        fontSize="10"
        letterSpacing="0.06em"
        fontWeight={500}
      >
        Steady · $290K
      </text>
    </svg>
  );
}

function CompoundingSvg() {
  // viewBox 460 x 280
  const W = 460;
  const H = 280;
  const padL = 28;
  const padR = 12;
  const padT = 24;
  const padB = 28;

  // Three-tier curve: flat L1 → step at L2 → compound L3
  const points: Array<{ x: number; y: number }> = [];
  const segs = 80;
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const x = padL + t * (W - padL - padR);
    let v;
    if (t < 0.34) {
      v = 0.20 + 0.06 * t; // flat-ish baseline value
    } else if (t < 0.62) {
      // step change
      const u = (t - 0.34) / 0.28;
      v = 0.22 + 0.32 * (1 - Math.pow(1 - u, 2));
    } else {
      // compounding accelerates
      const u = (t - 0.62) / 0.38;
      v = 0.54 + 0.42 * (u + 0.8 * u * u);
    }
    const y = padT + (1 - v) * (H - padT - padB);
    points.push({ x, y });
  }
  const path = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
  const areaPath = `${path} L ${points[points.length - 1].x} ${H - padB} L ${points[0].x} ${H - padB} Z`;

  const segDividers = [0.34, 0.62];

  return (
    <svg className="opc-curve-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Compounding value curve: flat L1 execution baseline, step change at L2 understanding, accelerating slope at L3 transformation">
      <defs>
        <linearGradient id="opc-curve-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5E6AD2" stopOpacity="0.4" />
          <stop offset="1" stopColor="#5E6AD2" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Axis */}
      <line x1={padL} x2={W - padR} y1={H - padB} y2={H - padB} stroke="rgba(255,255,255,0.18)" />
      <line x1={padL} x2={padL} y1={padT} y2={H - padB} stroke="rgba(255,255,255,0.18)" />

      {/* Segment dividers */}
      {segDividers.map((d, i) => {
        const x = padL + d * (W - padL - padR);
        return (
          <g key={i}>
            <line x1={x} x2={x} y1={padT} y2={H - padB} stroke="rgba(255,255,255,0.08)" strokeDasharray="2 4" />
          </g>
        );
      })}

      {/* Tier labels */}
      {[
        { t: 0.17, label: "L1 EXECUTION" },
        { t: 0.48, label: "L2 UNDERSTANDING" },
        { t: 0.81, label: "L3 TRANSFORMATION" },
      ].map((tier) => {
        const x = padL + tier.t * (W - padL - padR);
        return (
          <text
            key={tier.label}
            x={x}
            y={H - padB + 16}
            textAnchor="middle"
            fill="rgba(255,255,255,0.5)"
            fontFamily="JetBrains Mono, monospace"
            fontSize="8"
            letterSpacing="0.14em"
          >
            {tier.label}
          </text>
        );
      })}

      {/* Area */}
      <path d={areaPath} fill="url(#opc-curve-area)" />

      {/* Line */}
      <path
        d={path}
        fill="none"
        stroke="#7C8BF0"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* End point dot */}
      <circle
        cx={points[points.length - 1].x - 1}
        cy={points[points.length - 1].y}
        r="4"
        fill="#7C8BF0"
      />
      <circle
        cx={points[points.length - 1].x - 1}
        cy={points[points.length - 1].y}
        r="8"
        fill="rgba(124,139,240,0.22)"
      />
    </svg>
  );
}
