import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

/**
 * Option D · Product-anchored.
 * The product is the spine. It opens, sits sticky through every section,
 * evolves with scroll, and closes the page. Symptoms, framework, and
 * coordination tax are annotations on the product, not separate sections.
 *
 * Sections 1, 2, 3, 6, 9, 11 are dark. Sections 4, 5, 7, 8, 10 are light.
 * Sections 6 and 10 are the only product-free moments.
 */

const PERSONAS = [
  { id: "qa", label: "VP Quality", reading: "Evidence completeness, audit-ready in one click." },
  { id: "ops", label: "Operations", reading: "Handoff speed. State preserved across functions." },
  { id: "reg", label: "Regulatory", reading: "21 CFR 11 stamps. Every signature bound to role." },
  { id: "cfo", label: "CFO", reading: "Cycle time and rework cost. Quantified per record." },
  { id: "cio", label: "CIO", reading: "AI Assist. Integrations to Microsoft and SAP." },
];

const THREAD_BEATS = [
  { n: "01", k: "Trigger", caption: "Deviation raised. Owner role auto-assigned by stage." },
  { n: "02", k: "Owner", caption: "QA Ops picks up. Linked to Lot 2403-A." },
  { n: "03", k: "Decision", caption: "Severity 2. Disposition: scrap 12 units." },
  { n: "04", k: "Evidence", caption: "Supplier CoA, GC trace, photos bound to the decision." },
  { n: "05", k: "Approval", caption: "QA Mgr signs. 21 CFR 11. Witness countersigns." },
  { n: "06", k: "Handoff", caption: "Linked to ECO-0788. Engineering picks up. State preserved." },
  { n: "07", k: "Closed", caption: "Effectiveness verified. Audit trail final." },
];

const REPLACE_TOOLS = [
  { id: "outlook",   label: "Outlook",   chip: "17-reply chain", note: "RE: RE: RE: RE: REC-2412 root cause?" },
  { id: "sharepoint",label: "SharePoint",chip: "FINAL_v2 versions", note: "Audit_Working_FINAL_USE_THIS.xlsx" },
  { id: "teams",     label: "Teams",     chip: "Lot on hold", note: "Reason in this thread, not in the system." },
  { id: "excel",     label: "Excel",     chip: "Tracker #REF!", note: "Last updated six days ago." },
];

const DOMAINS = [
  "CAPA", "ECO / DCO", "Supplier CAR", "Complaint", "Deviation / NCR",
  "Audit", "Document Control", "Training", "Risk Management", "Design Review",
  "MRB", "Calibration", "Periodic Review", "Recall", "Submission Assembly",
];

const KPIS = [
  { lbl: "Cycle time",   val: "−65", unit: "%", note: "vs four-tool baseline" },
  { lbl: "Rework",       val: "−72", unit: "%", note: "fewer reopens" },
  { lbl: "Audit prep",   val: "1",   unit: "click", note: "evidence already bound" },
  { lbl: "Handoff lag",  val: "−4.2", unit: "days", note: "median, cross-function" },
];

const AI_LEVELS = [
  { n: "01", title: "Execution", caption: "Suggest next-step. Route to the right approver. Human approves." },
  { n: "02", title: "Understanding", caption: "Read the thread. Surface aging, blocked, reopened weekly." },
  { n: "03", title: "Transformation", caption: "Each level locks the previous. The layer compounds." },
];

const STYLES = `
.opd-root {
  --paper: #EFF1F5;
  --paper-card: #FFFFFF;
  --ink: #0B0D11;
  --ink-muted: rgba(11,13,17,0.62);
  --ink-faint: rgba(11,13,17,0.42);
  --ink-line: rgba(11,13,17,0.08);
  --ink-line-strong: rgba(11,13,17,0.14);
  --bg: #08090A;
  --bg-card: #14151B;
  --border: rgba(255,255,255,0.08);
  --border-strong: rgba(255,255,255,0.16);
  --text: #FFFFFF;
  --text-muted: rgba(255,255,255,0.62);
  --text-faint: rgba(255,255,255,0.42);
  --accent: #0052FF;
  --accent-2: #4C85FF;
  --accent-soft: rgba(0,82,255,0.14);
  --accent-tint: #F0F4FF;
  --accent-border: #D6E0FF;
  --green: #0B8A5C;
  --warn: #B4731A;
  --red: #C4303A;

  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  background: var(--paper);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
  letter-spacing: -0.011em;
  min-height: 100vh;
}
.opd-root * { box-sizing: border-box; }
.opd-root .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
.opd-root a { color: inherit; text-decoration: none; }

/* NAV */
.opd-nav {
  position: sticky; top: 0; z-index: 100;
  backdrop-filter: saturate(160%) blur(18px);
  background: rgba(250,250,251,0.88);
  border-bottom: 1px solid var(--ink-line);
  color: var(--ink);
}
.opd-nav-inner {
  max-width: 1280px; margin: 0 auto;
  padding: 10px 28px;
  display: flex; align-items: center; gap: 28px;
}
.opd-nav-logo {
  display: inline-flex; flex-direction: column; gap: 2px;
  color: var(--ink);
}
.opd-nav-logo .name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px; font-weight: 600; letter-spacing: 0.02em;
  display: inline-flex; align-items: center; gap: 7px;
}
.opd-nav-logo .name .mark {
  width: 10px; height: 10px; border-radius: 2px; background: var(--accent);
  box-shadow: 0 0 0 3px rgba(0,82,255,0.18);
}
.opd-nav-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--ink-faint);
}
.opd-nav-items { display: flex; gap: 22px; font-size: 13px; color: var(--ink-muted); margin-left: 8px; }
.opd-nav-items a:hover { color: var(--ink); }
.opd-nav-actions { margin-left: auto; display: flex; gap: 14px; align-items: center; }
.opd-nav-link { font-size: 13px; color: var(--ink-muted); }
.opd-nav-link:hover { color: var(--ink); }
.opd-nav-btn {
  font-size: 13px; font-weight: 500;
  background: var(--accent); color: white;
  padding: 7px 14px; border-radius: 999px;
  border: none; cursor: pointer;
}
.opd-nav-btn:hover { background: #0044D6; }
@media (max-width: 980px) { .opd-nav-items { display: none; } }

/* SHARED */
.opd-section {
  position: relative;
  padding: 96px 28px;
}
.opd-section#hero { padding-top: 64px; min-height: calc(100vh - 60px); }
.opd-section.dark { background: var(--bg); color: var(--text); }
.opd-section.light { background: var(--paper); color: var(--ink); }
.opd-section.papersoft { background: #F6F7F8; color: var(--ink); }
.opd-section.fullbleed-copy { display: flex; align-items: center; }

.opd-section-inner {
  max-width: 1280px; margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(360px, 5fr) 7fr;
  gap: 56px;
  align-items: start;
}
.opd-section.no-product .opd-section-inner {
  display: block;
  text-align: center;
}
.opd-section.full .opd-section-inner {
  display: block;
  max-width: 1240px;
}
.opd-section.full .opd-section-inner > * { max-width: 100%; }
@media (max-width: 980px) {
  .opd-section-inner { grid-template-columns: 1fr; gap: 32px; }
}

/* Eyebrow chip */
.opd-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase;
  display: inline-flex; align-items: center; gap: 9px;
  padding: 6px 12px 6px 10px;
  border-radius: 999px;
  margin-bottom: 24px;
}
.opd-section.light .opd-eyebrow,
.opd-section.papersoft .opd-eyebrow {
  background: var(--paper-card);
  border: 1px solid var(--ink-line);
  color: var(--ink-muted);
  box-shadow: 0 1px 2px rgba(11,13,17,0.025);
}
.opd-section.dark .opd-eyebrow {
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  color: var(--text-muted);
}
.opd-eyebrow .dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 3px rgba(0,82,255,0.18);
}
.opd-section.dark .opd-eyebrow .num,
.opd-section.dark .opd-eyebrow .name { color: var(--text); }
.opd-section.light .opd-eyebrow .num,
.opd-section.light .opd-eyebrow .name,
.opd-section.papersoft .opd-eyebrow .num,
.opd-section.papersoft .opd-eyebrow .name { color: var(--ink); }
.opd-eyebrow .sep { opacity: 0.42; }

/* Headline */
.opd-h2 {
  font-size: clamp(32px, 4.6vw, 56px);
  line-height: 1.04; letter-spacing: -0.034em;
  font-weight: 500; max-width: 22ch; margin: 0;
}
.opd-h2 .dim { opacity: 0.62; }
.opd-h2 .accent { color: var(--accent); }
.opd-section.dark .opd-h2 .accent { color: var(--accent-2); }
.opd-sub {
  margin-top: 22px;
  font-size: 16.5px;
  line-height: 1.5;
  max-width: 56ch;
}
.opd-section.dark .opd-sub { color: var(--text-muted); }
.opd-section.light .opd-sub,
.opd-section.papersoft .opd-sub { color: var(--ink-muted); }

/* CTA buttons */
.opd-btn-primary {
  font-family: inherit; font-size: 14px; font-weight: 500;
  background: var(--accent); color: white;
  padding: 11px 20px; border-radius: 999px;
  border: none; cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px;
  transition: background .15s ease;
}
.opd-btn-primary:hover { background: #0044D6; }
.opd-btn-ghost {
  font-family: inherit; font-size: 14px; font-weight: 500;
  background: transparent;
  padding: 11px 18px; border-radius: 999px;
  border: 1px solid;
  cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px;
  transition: background .15s ease, border-color .15s ease;
}
.opd-section.dark .opd-btn-ghost { color: var(--text); border-color: var(--border-strong); }
.opd-section.dark .opd-btn-ghost:hover { background: rgba(255,255,255,0.04); }
.opd-section.light .opd-btn-ghost,
.opd-section.papersoft .opd-btn-ghost { color: var(--ink); border-color: var(--ink-line-strong); }
.opd-section.light .opd-btn-ghost:hover,
.opd-section.papersoft .opd-btn-ghost:hover { background: rgba(11,13,17,0.04); }
.opd-cta-row { margin-top: 32px; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }

/* HERO copy block */
.opd-hero-copy { display: flex; flex-direction: column; gap: 0; }
.opd-hero-h1 {
  font-size: clamp(40px, 6vw, 76px);
  line-height: 0.98; letter-spacing: -0.04em;
  font-weight: 500; margin: 0;
  max-width: 18ch;
  color: var(--ink);
}
.opd-hero-h1 .accent { color: var(--accent); }
.opd-hero-subhead {
  margin-top: 22px;
  font-size: 17.5px; line-height: 1.5;
  color: var(--ink-muted);
  max-width: 48ch;
}

/* PERSONA RIBBON */
.opd-personas {
  margin-top: 28px;
  display: flex; flex-wrap: wrap; gap: 8px;
}
.opd-persona {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase;
  padding: 7px 12px; border-radius: 999px;
  border: 1px solid var(--ink-line);
  background: var(--paper-card);
  color: var(--ink-muted);
  cursor: pointer;
  transition: all .15s ease;
}
.opd-section.dark .opd-persona {
  border-color: var(--border);
  background: rgba(255,255,255,0.04);
  color: var(--text-muted);
}
.opd-persona.active {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}
.opd-persona:hover { color: var(--ink); }
.opd-section.dark .opd-persona:hover { color: var(--text); }
.opd-persona.active:hover { color: white; }
.opd-persona-reading {
  margin-top: 16px;
  padding: 14px 18px;
  border: 1px solid var(--accent-border);
  border-left: 2px solid var(--accent);
  border-radius: 6px;
  background: var(--accent-tint);
  color: var(--ink);
  font-size: 14px;
  max-width: 56ch;
}
.opd-section.dark .opd-persona-reading {
  border-color: var(--border);
  border-left-color: var(--accent);
  background: rgba(0,82,255,0.10);
  color: var(--text);
}

/* Product mock — sticky right rail */
.opd-product {
  position: sticky;
  top: 80px;
  align-self: start;
  max-height: calc(100vh - 100px);
}
@media (max-width: 980px) {
  .opd-product { position: relative; top: auto; max-height: none; }
}
.opd-product-frame {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--border);
  background: #0E0F12;
  color: var(--text);
  box-shadow:
    0 60px 100px -40px rgba(0,82,255,0.30),
    0 30px 60px -20px rgba(0,0,0,0.65),
    0 0 0 1px rgba(255,255,255,0.04);
}
.opd-section.light .opd-product-frame,
.opd-section.papersoft .opd-product-frame {
  background: #FFFFFF;
  color: var(--ink);
  border-color: var(--ink-line);
  box-shadow:
    0 40px 80px -30px rgba(11,13,17,0.18),
    0 20px 40px -20px rgba(11,13,17,0.10),
    0 0 0 1px rgba(11,13,17,0.04);
}

.opd-app-bar {
  display: flex; align-items: center; gap: 12px;
  padding: 9px 14px;
  border-bottom: 1px solid;
  border-color: inherit;
  background: rgba(255,255,255,0.04);
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.04em;
}
.opd-section.light .opd-app-bar,
.opd-section.papersoft .opd-app-bar {
  background: #FBFBFC;
  border-bottom-color: var(--ink-line);
}
.opd-app-bar .dots { display: inline-flex; gap: 5px; }
.opd-app-bar .dots i {
  width: 9px; height: 9px; border-radius: 50%;
  background: rgba(255,255,255,0.12);
}
.opd-app-bar .dots i:nth-child(1) { background: rgba(239,68,68,0.55); }
.opd-app-bar .dots i:nth-child(2) { background: rgba(245,158,11,0.55); }
.opd-app-bar .dots i:nth-child(3) { background: rgba(16,185,129,0.55); }
.opd-app-bar .url {
  flex: 1; text-align: center;
  color: var(--text-muted);
}
.opd-section.light .opd-app-bar .url,
.opd-section.papersoft .opd-app-bar .url { color: var(--ink-muted); }
.opd-app-bar .pill {
  font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
  padding: 2px 8px; border-radius: 999px;
  display: inline-flex; align-items: center; gap: 5px;
  color: #16C784;
  border: 1px solid rgba(16,185,129,0.32);
  background: rgba(16,185,129,0.08);
}
.opd-app-bar .pill .pulse {
  width: 5px; height: 5px; border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 0 2px rgba(16,185,129,0.18);
}

.opd-app-shell {
  display: grid;
  grid-template-columns: 44px 220px 1fr 240px;
  min-height: 520px;
}
@media (max-width: 1180px) {
  .opd-app-shell { grid-template-columns: 44px 1fr 240px; }
  .opd-app-shell .opd-app-list { display: none; }
}
@media (max-width: 720px) {
  .opd-app-shell { grid-template-columns: 1fr; }
  .opd-app-shell .opd-app-rail,
  .opd-app-shell .opd-app-aside { display: none; }
}

.opd-app-rail {
  border-right: 1px solid var(--border);
  padding: 10px 6px;
  display: flex; flex-direction: column; gap: 4px; align-items: center;
  background: rgba(255,255,255,0.02);
}
.opd-section.light .opd-app-rail,
.opd-section.papersoft .opd-app-rail {
  border-right-color: var(--ink-line);
  background: #FBFBFC;
}
.opd-app-rail .logo {
  width: 30px; height: 30px; border-radius: 6px;
  background: var(--accent); color: white;
  display: inline-flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 13px; letter-spacing: -0.03em;
  margin-bottom: 8px;
}
.opd-app-rail .icon {
  width: 30px; height: 30px; border-radius: 6px;
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--text-faint);
  cursor: pointer;
}
.opd-section.light .opd-app-rail .icon,
.opd-section.papersoft .opd-app-rail .icon { color: var(--ink-faint); }
.opd-app-rail .icon.active {
  background: var(--accent-tint); color: var(--accent);
}
.opd-section.dark .opd-app-rail .icon.active {
  background: var(--accent-soft); color: var(--accent-2);
}

.opd-app-list {
  border-right: 1px solid var(--border);
  padding: 14px 8px;
  background: rgba(255,255,255,0.015);
  display: flex; flex-direction: column; gap: 4px;
}
.opd-section.light .opd-app-list,
.opd-section.papersoft .opd-app-list {
  border-right-color: var(--ink-line);
  background: #FBFBFC;
}
.opd-app-list .head {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--text-faint);
  padding: 6px 8px 4px;
}
.opd-section.light .opd-app-list .head,
.opd-section.papersoft .opd-app-list .head { color: var(--ink-faint); }
.opd-app-list .row {
  display: grid; grid-template-columns: 18px 1fr auto;
  gap: 8px; align-items: center;
  padding: 7px 8px;
  border-radius: 5px;
  font-size: 12.5px;
  cursor: pointer;
}
.opd-app-list .row:hover { background: rgba(255,255,255,0.04); }
.opd-section.light .opd-app-list .row:hover,
.opd-section.papersoft .opd-app-list .row:hover { background: rgba(11,13,17,0.04); }
.opd-app-list .row.active {
  background: var(--accent-soft);
  color: var(--text);
}
.opd-section.light .opd-app-list .row.active,
.opd-section.papersoft .opd-app-list .row.active {
  background: var(--accent-tint);
  color: var(--ink);
}
.opd-app-list .row .mk {
  width: 8px; height: 8px; border-radius: 2px;
  background: var(--accent);
}
.opd-app-list .row .name { font-weight: 500; }
.opd-app-list .row .when {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; color: var(--text-faint);
}
.opd-section.light .opd-app-list .row .when,
.opd-section.papersoft .opd-app-list .row .when { color: var(--ink-faint); }

.opd-app-thread { padding: 0; min-width: 0; }
.opd-app-thead {
  padding: 16px 22px 12px;
  border-bottom: 1px solid var(--border);
}
.opd-section.light .opd-app-thead,
.opd-section.papersoft .opd-app-thead { border-bottom-color: var(--ink-line); }
.opd-app-thead .row1 {
  display: flex; align-items: center; gap: 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.16em; text-transform: uppercase;
}
.opd-app-thead .badge {
  background: var(--accent-tint); color: var(--accent);
  padding: 3px 8px; border-radius: 3px;
  display: inline-flex; align-items: center; gap: 5px;
  font-weight: 500;
}
.opd-section.dark .opd-app-thead .badge {
  background: var(--accent-soft); color: var(--accent-2);
}
.opd-app-thead .badge .pulse {
  width: 5px; height: 5px; border-radius: 50%; background: currentColor;
}
.opd-app-thead .id { color: var(--text-faint); }
.opd-section.light .opd-app-thead .id,
.opd-section.papersoft .opd-app-thead .id { color: var(--ink-faint); }
.opd-app-thead h4 {
  margin: 10px 0 0;
  font-size: 17px; font-weight: 500; letter-spacing: -0.012em;
}
.opd-app-thead .meta {
  display: flex; flex-wrap: wrap; gap: 14px;
  margin-top: 10px;
  font-size: 11.5px;
  color: var(--text-muted);
}
.opd-section.light .opd-app-thead .meta,
.opd-section.papersoft .opd-app-thead .meta { color: var(--ink-muted); }
.opd-app-thead .meta .k {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--text-faint);
  margin-right: 5px;
}
.opd-section.light .opd-app-thead .meta .k,
.opd-section.papersoft .opd-app-thead .meta .k { color: var(--ink-faint); }

.opd-app-body {
  padding: 14px 22px 18px;
  display: flex; flex-direction: column; gap: 14px;
  max-height: 420px;
  overflow: hidden;
  position: relative;
}
.opd-app-body::after {
  content: "";
  position: absolute; bottom: 0; left: 0; right: 0; height: 60px;
  background: linear-gradient(180deg, rgba(14,15,18,0) 0%, #0E0F12 100%);
  pointer-events: none;
}
.opd-section.light .opd-app-body::after,
.opd-section.papersoft .opd-app-body::after {
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, #FFFFFF 100%);
}

.opd-anchor {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--text-faint);
  margin-top: 6px;
}
.opd-section.light .opd-anchor,
.opd-section.papersoft .opd-anchor { color: var(--ink-faint); }
.opd-msg {
  display: grid; grid-template-columns: 28px 1fr;
  gap: 10px;
}
.opd-msg .av {
  width: 26px; height: 26px; border-radius: 50%;
  background: rgba(255,255,255,0.10); color: var(--text);
  font-size: 10px; font-weight: 600;
  display: inline-flex; align-items: center; justify-content: center;
}
.opd-section.light .opd-msg .av,
.opd-section.papersoft .opd-msg .av {
  background: var(--ink-line); color: var(--ink-muted);
}
.opd-msg .av.bot { background: var(--accent-soft); color: var(--accent-2); }
.opd-section.light .opd-msg .av.bot,
.opd-section.papersoft .opd-msg .av.bot { background: var(--accent-tint); color: var(--accent); }
.opd-msg .body { min-width: 0; }
.opd-msg .who { font-size: 12.5px; font-weight: 500; }
.opd-msg .who.primary { color: var(--accent-2); }
.opd-section.light .opd-msg .who.primary,
.opd-section.papersoft .opd-msg .who.primary { color: var(--accent); }
.opd-msg .when {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; color: var(--text-faint); margin-left: 8px;
}
.opd-section.light .opd-msg .when,
.opd-section.papersoft .opd-msg .when { color: var(--ink-faint); }
.opd-msg .text {
  margin-top: 4px;
  font-size: 13px; line-height: 1.45;
  color: var(--text-muted);
}
.opd-section.light .opd-msg .text,
.opd-section.papersoft .opd-msg .text { color: var(--ink-muted); }
.opd-msg .ai-card {
  margin-top: 8px;
  border: 1px solid rgba(0,82,255,0.32);
  background: var(--accent-soft);
  border-radius: 8px;
  padding: 10px 12px;
}
.opd-section.light .opd-msg .ai-card,
.opd-section.papersoft .opd-msg .ai-card {
  border-color: var(--accent-border);
  background: var(--accent-tint);
}
.opd-msg .ai-card .t {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--accent-2);
  margin-bottom: 4px;
}
.opd-section.light .opd-msg .ai-card .t,
.opd-section.papersoft .opd-msg .ai-card .t { color: var(--accent); }
.opd-msg .ai-card .body {
  font-size: 12.5px;
  color: var(--text);
}
.opd-section.light .opd-msg .ai-card .body,
.opd-section.papersoft .opd-msg .ai-card .body { color: var(--ink); }
.opd-msg .stamp {
  display: inline-flex; align-items: center; gap: 6px;
  margin-top: 8px;
  padding: 3px 9px; border-radius: 3px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase;
  background: rgba(11,138,92,0.10); color: var(--green);
}
.opd-msg .approve {
  display: inline-flex; align-items: center; gap: 6px;
  margin-top: 8px;
  padding: 6px 12px; border-radius: 6px;
  background: var(--accent); color: white;
  font-size: 11px; font-weight: 500;
  border: none; cursor: pointer;
}

.opd-app-aside {
  border-left: 1px solid var(--border);
  padding: 14px 14px 14px;
  background: rgba(255,255,255,0.02);
}
.opd-section.light .opd-app-aside,
.opd-section.papersoft .opd-app-aside {
  border-left-color: var(--ink-line);
  background: #FBFBFC;
}
.opd-app-aside .head {
  display: flex; justify-content: space-between; align-items: baseline;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--text-faint);
}
.opd-section.light .opd-app-aside .head,
.opd-section.papersoft .opd-app-aside .head { color: var(--ink-faint); }
.opd-app-aside .ttl {
  font-size: 13px; font-weight: 500; margin-top: 6px;
}
.opd-app-aside .prog-row {
  margin-top: 12px; display: flex; justify-content: space-between;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.10em; text-transform: uppercase;
  color: var(--text-faint);
}
.opd-section.light .opd-app-aside .prog-row,
.opd-section.papersoft .opd-app-aside .prog-row { color: var(--ink-faint); }
.opd-app-aside .bar {
  height: 4px; border-radius: 2px;
  background: rgba(255,255,255,0.08);
  margin-top: 6px; overflow: hidden;
}
.opd-section.light .opd-app-aside .bar,
.opd-section.papersoft .opd-app-aside .bar { background: var(--ink-line); }
.opd-app-aside .bar .fill { height: 100%; background: var(--accent); }
.opd-app-aside .secs { display: flex; flex-direction: column; gap: 6px; margin-top: 14px; }
.opd-app-aside .sec {
  display: grid; grid-template-columns: 8px 1fr auto; gap: 8px; align-items: center;
  padding: 6px 8px; border-radius: 4px;
  font-size: 11.5px;
}
.opd-app-aside .sec .d { width: 8px; height: 8px; border-radius: 50%; }
.opd-app-aside .sec.done .d { background: var(--green); }
.opd-app-aside .sec.active .d { background: var(--accent); box-shadow: 0 0 0 3px rgba(0,82,255,0.18); }
.opd-app-aside .sec.pend .d { background: rgba(255,255,255,0.18); }
.opd-section.light .opd-app-aside .sec.pend .d,
.opd-section.papersoft .opd-app-aside .sec.pend .d { background: var(--ink-line-strong); }
.opd-app-aside .sec.active { background: var(--accent-soft); }
.opd-section.light .opd-app-aside .sec.active,
.opd-section.papersoft .opd-app-aside .sec.active { background: var(--accent-tint); }
.opd-app-aside .sec .frac {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; color: var(--text-faint);
}
.opd-section.light .opd-app-aside .sec .frac,
.opd-section.papersoft .opd-app-aside .sec .frac { color: var(--ink-faint); }

/* HERO scroll teaser */
.opd-hero-teaser {
  margin-top: 36px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--ink-faint);
  display: inline-flex; align-items: center; gap: 10px;
}
.opd-section.dark .opd-hero-teaser { color: var(--text-faint); }
.opd-hero-teaser .arrow {
  display: inline-block; width: 1px; height: 18px;
  background: linear-gradient(180deg, transparent, var(--ink-faint));
  animation: opd-bob 1.6s ease-in-out infinite;
}
.opd-section.dark .opd-hero-teaser .arrow {
  background: linear-gradient(180deg, transparent, var(--text-faint));
}
@keyframes opd-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(4px); }
}

/* SECTION 2 — anatomy as full-width grid */
.opd-anatomy-grid {
  display: grid; grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-top: 40px;
}
@media (max-width: 1100px) { .opd-anatomy-grid { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 720px) { .opd-anatomy-grid { grid-template-columns: repeat(2, 1fr); } }
.opd-anatomy-card {
  padding: 18px 16px;
  border: 1px solid var(--ink-line);
  border-top: 2px solid var(--ink-line);
  border-radius: 6px;
  background: var(--paper-card);
  cursor: pointer;
  transition: border-color .2s, background .2s, transform .2s;
}
.opd-anatomy-card:hover { transform: translateY(-1px); }
.opd-anatomy-card.active {
  border-top-color: var(--accent);
  background: var(--accent-tint);
}
.opd-anatomy-card .n {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.16em;
  color: var(--ink-faint);
  margin-bottom: 10px;
}
.opd-anatomy-card.active .n { color: var(--accent); }
.opd-anatomy-card .k {
  font-size: 15px; font-weight: 500;
  color: var(--ink);
}
.opd-anatomy-card .cap {
  font-size: 12px; line-height: 1.4;
  color: var(--ink-muted);
  margin-top: 6px;
}

/* SECTION 3 — persona cards */
.opd-persona-grid {
  margin-top: 40px;
  display: grid; grid-template-columns: repeat(5, 1fr);
  gap: 14px;
}
@media (max-width: 1180px) { .opd-persona-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 720px) { .opd-persona-grid { grid-template-columns: 1fr; } }
.opd-persona-card {
  padding: 18px;
  border: 1px solid var(--ink-line);
  border-radius: 10px;
  background: var(--paper-card);
  display: flex; flex-direction: column; gap: 14px;
  min-height: 280px;
}
.opd-persona-head { display: flex; flex-direction: column; gap: 4px; }
.opd-persona-card .lbl {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.10em; text-transform: uppercase;
  color: var(--accent);
}
.opd-persona-card .lens {
  font-size: 13.5px; font-weight: 500; letter-spacing: -0.01em;
  color: var(--ink);
}
.opd-persona-visual {
  flex: 1;
  padding: 14px;
  border: 1px solid var(--ink-line);
  border-radius: 6px;
  background: #FBFBFC;
  min-height: 120px;
  display: flex; flex-direction: column; justify-content: center;
}
.opd-persona-reading-text {
  font-size: 12.5px; line-height: 1.45;
  color: var(--ink-muted);
}

/* persona visuals */
.opd-persona-evidence { display: flex; flex-direction: column; gap: 6px; }
.opd-persona-evidence .row {
  display: flex; align-items: center; gap: 8px;
  font-size: 11.5px;
}
.opd-persona-evidence .cb {
  width: 14px; height: 14px; border-radius: 3px;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 9px; font-weight: 700;
}
.opd-persona-evidence .row.done .cb { background: rgba(11,138,92,0.14); color: var(--green); }
.opd-persona-evidence .row.pend .cb { background: var(--ink-line); color: var(--ink-faint); }
.opd-persona-evidence .row.done span:last-child { color: var(--ink); }
.opd-persona-evidence .row.pend span:last-child { color: var(--ink-muted); }

.opd-persona-flow { display: flex; flex-direction: column; gap: 8px; }
.opd-persona-flow .lane {
  position: relative;
  height: 16px;
  font-size: 10px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--ink-muted);
}
.opd-persona-flow .lane .who {
  position: absolute; left: 0; top: 0;
  font-size: 9.5px; letter-spacing: 0.08em;
  color: var(--ink-faint);
  text-transform: uppercase;
}
.opd-persona-flow .lane .bar {
  position: absolute; bottom: 0; left: 0;
  height: 4px; border-radius: 2px;
  background: var(--accent);
  display: block;
}
.opd-persona-flow .lane .bar.done { background: var(--green); }

.opd-persona-stamps { display: flex; flex-wrap: wrap; gap: 6px; }
.opd-persona-stamps .stamp {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.10em; text-transform: uppercase;
  padding: 4px 8px; border-radius: 3px;
  background: var(--accent-tint); color: var(--accent);
}
.opd-persona-stamps .stamp.ok {
  background: rgba(11,138,92,0.14); color: var(--green);
}

.opd-persona-cost { text-align: left; }
.opd-persona-cost .big {
  display: flex; align-items: baseline; gap: 4px;
  margin-bottom: 6px;
}
.opd-persona-cost .num {
  font-size: 38px; font-weight: 600; letter-spacing: -0.034em;
  color: var(--accent);
}
.opd-persona-cost .u {
  font-size: 18px; color: var(--ink-muted); font-weight: 500;
}
.opd-persona-cost .lbl {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.08em;
  color: var(--ink-faint);
  margin-bottom: 8px;
}
.opd-persona-cost .bar {
  height: 4px; border-radius: 2px;
  background: var(--ink-line); overflow: hidden;
}
.opd-persona-cost .bar .fill {
  height: 100%; background: var(--accent);
}

.opd-persona-ai { display: flex; flex-direction: column; gap: 8px; }
.opd-persona-ai .card {
  padding: 10px 12px;
  border: 1px solid var(--accent-border);
  background: var(--accent-tint);
  border-radius: 6px;
}
.opd-persona-ai .hd {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--accent);
}
.opd-persona-ai .bd {
  font-size: 11.5px; color: var(--ink); margin-top: 4px;
}
.opd-persona-ai .btn {
  margin-top: 8px;
  font-size: 10.5px; font-weight: 500;
  background: var(--accent); color: white;
  border: none; padding: 5px 10px; border-radius: 4px;
  cursor: pointer;
}

/* SECTION 7 — domain grid (15 mini thread cards) */
.opd-domain-grid {
  margin-top: 40px;
  display: grid; grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}
@media (max-width: 1100px) { .opd-domain-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 720px) { .opd-domain-grid { grid-template-columns: repeat(2, 1fr); } }
.opd-domain-card {
  padding: 14px;
  border: 1px solid var(--ink-line);
  border-radius: 8px;
  background: var(--paper-card);
  display: flex; flex-direction: column; gap: 8px;
  transition: border-color .2s, transform .2s;
}
.opd-domain-card.active {
  border-color: var(--accent);
  box-shadow: 0 8px 20px -10px rgba(0,82,255,0.30);
  transform: translateY(-1px);
}
.opd-domain-head {
  display: flex; justify-content: space-between; align-items: flex-start;
  gap: 8px;
}
.opd-domain-head .lbl {
  font-size: 12.5px; font-weight: 500; letter-spacing: -0.01em;
  color: var(--ink);
}
.opd-domain-state {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8.5px; letter-spacing: 0.10em; text-transform: uppercase;
  padding: 2px 6px; border-radius: 3px;
  display: inline-flex; align-items: center; gap: 4px;
  flex-shrink: 0;
}
.opd-domain-state .pulse { width: 4px; height: 4px; border-radius: 50%; background: currentColor; }
.opd-domain-state.info { background: var(--accent-tint); color: var(--accent); }
.opd-domain-state.warn { background: rgba(180,115,26,0.14); color: var(--warn); }
.opd-domain-state.neutral { background: rgba(11,13,17,0.06); color: var(--ink-muted); }
.opd-domain-id {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.06em;
  color: var(--ink-faint);
}
.opd-domain-meta {
  font-size: 11px; color: var(--ink-muted);
}
.opd-domain-meta .k {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8.5px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--ink-faint); margin-right: 4px;
}
.opd-domain-trigger {
  font-size: 11px; color: var(--ink-muted);
  font-style: italic;
  border-top: 1px dotted var(--ink-line);
  padding-top: 8px;
}
.opd-domain-spark {
  display: flex; align-items: center;
  margin-top: 4px;
}
.opd-domain-spark .dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--ink-line-strong);
  flex-shrink: 0;
}
.opd-domain-spark .dot.done { background: var(--green); }
.opd-domain-spark .dot.active {
  background: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-tint);
}
.opd-domain-spark .line {
  flex: 1;
  height: 1px;
  background: var(--ink-line-strong);
  margin: 0 2px;
}
.opd-domain-spark .line.done { background: var(--green); }

/* SECTION 4 — morph 2x2 grid of legacy tools */
.opd-morph-grid {
  margin-top: 40px;
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}
@media (max-width: 720px) { .opd-morph-grid { grid-template-columns: 1fr; } }
.opd-morph-card {
  /* container that holds one ProductMock variant; child handles its own chrome */
}
.opd-morph-card .opd-product-frame {
  background: #FFFFFF;
  color: #1B1B1B;
  border: 1px solid #C6CFE0;
  border-radius: 6px;
  box-shadow:
    0 18px 36px -16px rgba(11,13,17,0.18),
    0 8px 16px -8px rgba(11,13,17,0.10);
}

/* SECTION 5 — bridge layout (SoR | Layer | SoC) */
.opd-bridge {
  margin-top: 40px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 18px;
  align-items: stretch;
}
@media (max-width: 980px) { .opd-bridge { grid-template-columns: 1fr; } }
.opd-bridge-col {
  padding: 22px;
  border: 1px solid var(--ink-line);
  border-radius: 10px;
  background: var(--paper-card);
}
.opd-bridge-col .head {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 14px;
}
.opd-bridge-col .item {
  font-size: 13px; padding: 7px 0;
  border-bottom: 1px dotted var(--ink-line);
  color: var(--ink);
}
.opd-bridge-col .item:last-child { border-bottom: 0; }
.opd-bridge-layer {
  align-self: center;
  padding: 22px 26px;
  border-radius: 10px;
  background: var(--accent);
  color: white;
  text-align: center;
  min-width: 200px;
  box-shadow: 0 24px 48px -20px rgba(0,82,255,0.40);
}
.opd-bridge-layer .lbl {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.20em; text-transform: uppercase;
  opacity: 0.78;
}
.opd-bridge-layer .name {
  display: block;
  font-size: 22px; font-weight: 600; letter-spacing: -0.02em;
  margin: 8px 0 4px;
}
.opd-bridge-layer .cap {
  display: block;
  font-size: 11.5px; opacity: 0.85;
  font-family: 'JetBrains Mono', monospace; letter-spacing: 0.04em;
}

/* SECTION 9 — AI three cards */
.opd-ai-grid {
  margin-top: 40px;
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
@media (max-width: 880px) { .opd-ai-grid { grid-template-columns: 1fr; } }
.opd-ai-card {
  padding: 22px;
  border: 1px solid var(--ink-line);
  border-radius: 10px;
  background: var(--paper-card);
  position: relative;
}
.opd-ai-card::before {
  content: "";
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 2px;
  background: var(--accent);
  border-radius: 2px 0 0 2px;
}
.opd-ai-card .n {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.16em;
  color: var(--accent);
  margin-bottom: 12px;
}
.opd-ai-card .t {
  font-size: 17px; font-weight: 500; letter-spacing: -0.012em;
  color: var(--ink);
}
.opd-ai-card .c {
  font-size: 13px; line-height: 1.5;
  color: var(--ink-muted);
  margin-top: 8px;
}

/* SECTION 11 — CTA centered */
.opd-cta-block {
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
}
.opd-cta-block .opd-eyebrow { display: inline-flex; }
.opd-cta-block .opd-cta-h { margin: 0 auto; }
.opd-cta-block .opd-cta-sub { margin: 24px auto 0; }
.opd-cta-block .opd-cta-row { justify-content: center; }

/* SECTION 4 — what it replaces (chrome morph chips) */
.opd-replace {
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 28px;
}
.opd-replace-card {
  padding: 16px;
  border: 1px solid var(--ink-line);
  border-radius: 8px;
  background: var(--paper-card);
  display: flex; flex-direction: column; gap: 6px;
}
.opd-replace-card .lbl {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-faint);
}
.opd-replace-card.outlook    .lbl { color: #1A73E8; }
.opd-replace-card.sharepoint .lbl { color: #03787C; }
.opd-replace-card.teams      .lbl { color: #4B53BC; }
.opd-replace-card.excel      .lbl { color: #107C41; }
.opd-replace-card .chip {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 11.5px; font-weight: 500;
  color: var(--ink);
}
.opd-replace-card .chip .pulse { width: 5px; height: 5px; border-radius: 50%; background: var(--red); }
.opd-replace-card .note {
  font-size: 12.5px; color: var(--ink-muted);
  font-style: italic;
}
.opd-replace-attrib {
  margin-top: 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.10em;
  color: var(--ink-faint);
}

/* SECTION 5 — why it works (annotations) */
.opd-why {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 28px;
}
.opd-why-col {
  padding: 16px;
  border: 1px dashed var(--ink-line-strong);
  border-radius: 8px;
}
.opd-why-col .head {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 8px;
}
.opd-why-col .item {
  font-size: 12.5px;
  color: var(--ink);
  padding: 5px 0;
  border-bottom: 1px dotted var(--ink-line);
}
.opd-why-col .item:last-child { border-bottom: 0; }

/* SECTION 6 — name the cost (full bleed, on light) */
.opd-cost {
  text-align: center;
  width: 100%;
  max-width: 920px;
  margin: 0 auto;
}
.opd-cost .opd-eyebrow { display: inline-flex; }
.opd-cost h2 {
  font-size: clamp(56px, 8vw, 120px);
  line-height: 1.0; letter-spacing: -0.05em;
  font-weight: 500; margin: 24px 0 0;
  color: var(--ink);
}
.opd-cost h2 .accent { color: var(--accent); font-style: italic; }
.opd-cost p {
  margin: 28px auto 0;
  max-width: 56ch;
  font-size: 18px;
  color: var(--ink-muted);
  line-height: 1.5;
}
.opd-cost-stat {
  margin: 36px 0 0;
  display: inline-flex; align-items: baseline; gap: 16px;
  padding: 18px 28px;
  border: 1px solid var(--accent-border);
  border-radius: 12px;
  background: var(--accent-tint);
}
.opd-cost-stat .num {
  font-size: 56px; font-weight: 500; letter-spacing: -0.04em;
  color: var(--accent);
}
.opd-cost-stat .lbl {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-muted);
  text-align: left;
}

/* SECTION 7 — domains */
.opd-domains {
  margin-top: 28px;
  display: flex; flex-wrap: wrap; gap: 8px;
}
.opd-domain {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase;
  padding: 7px 12px; border-radius: 999px;
  border: 1px solid var(--ink-line);
  background: var(--paper-card);
  color: var(--ink-muted);
}
.opd-domain.active {
  background: var(--accent-tint);
  color: var(--accent);
  border-color: var(--accent-border);
}

/* SECTION 8 — outcomes (KPIs morph the product surface) */
.opd-kpis {
  margin-top: 28px;
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.opd-kpi {
  padding: 16px;
  border: 1px solid var(--ink-line);
  border-radius: 8px;
  background: var(--paper-card);
}
.opd-kpi .lbl {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-faint);
}
.opd-kpi .val {
  font-size: 36px; font-weight: 500; letter-spacing: -0.03em;
  margin-top: 6px;
}
.opd-kpi .val .unit {
  font-size: 14px; color: var(--ink-muted); font-weight: 500; margin-left: 4px;
}
.opd-kpi .note {
  font-size: 12px; color: var(--ink-muted); margin-top: 4px;
}

/* SECTION 9 — AI compounds */
.opd-ai {
  margin-top: 28px;
  display: flex; flex-direction: column; gap: 12px;
}
.opd-ai-level {
  padding: 16px 18px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: rgba(255,255,255,0.02);
  display: grid; grid-template-columns: 36px 1fr;
  gap: 14px;
}
.opd-ai-level .n {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.16em;
  color: var(--accent-2);
}
.opd-ai-level .t {
  font-size: 15px; font-weight: 500; color: var(--text);
}
.opd-ai-level .c {
  font-size: 12.5px; color: var(--text-muted); margin-top: 4px;
}

/* SECTION 10 — proof */
.opd-proof {
  width: 100%;
  max-width: 980px;
  margin: 0 auto;
  text-align: left;
}
.opd-proof-quote {
  font-size: clamp(28px, 3.4vw, 40px);
  line-height: 1.18;
  letter-spacing: -0.022em;
  font-weight: 450;
  color: var(--ink);
  max-width: 28ch;
  font-style: italic;
}
.opd-proof-quote .accent { color: var(--accent); font-style: normal; }
.opd-proof-meta {
  margin-top: 28px;
  display: flex; gap: 24px; flex-wrap: wrap;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.10em; text-transform: uppercase;
  color: var(--ink-faint);
}
.opd-proof-meta strong { color: var(--ink); font-weight: 500; }
.opd-proof-stats {
  margin-top: 32px;
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding: 24px;
  border-top: 1px solid var(--ink-line);
  border-bottom: 1px solid var(--ink-line);
}
.opd-proof-stats .stat .v {
  font-size: 36px; font-weight: 500; letter-spacing: -0.03em;
  color: var(--accent);
}
.opd-proof-stats .stat .l {
  font-size: 12px; color: var(--ink-muted); margin-top: 4px;
}

/* PRODUCT PREVIEW (iframe-based, mirrors /linear) */
.opd-preview {
  position: relative;
  isolation: isolate;
}
.opd-preview-glow {
  position: absolute;
  left: 50%; top: -200px;
  transform: translateX(-50%);
  width: 1100px; max-width: 100%;
  height: 600px;
  background:
    radial-gradient(60% 55% at 50% 75%, rgba(0,82,255,0.32) 0%, rgba(0,82,255,0.12) 40%, rgba(0,82,255,0) 78%),
    radial-gradient(50% 55% at 25% 65%, rgba(76,133,255,0.20) 0%, rgba(76,133,255,0) 72%),
    radial-gradient(50% 55% at 78% 60%, rgba(50,100,220,0.16) 0%, rgba(50,100,220,0) 72%);
  filter: blur(32px);
  pointer-events: none;
  z-index: 0;
}
.opd-preview-frame {
  position: relative;
  z-index: 1;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--ink-line);
  background: var(--paper-card);
  box-shadow:
    0 50px 120px -30px rgba(0,82,255,0.20),
    0 30px 60px -20px rgba(11,13,17,0.18),
    0 0 0 1px rgba(11,13,17,0.04);
  aspect-ratio: 16 / 9.6;
}
.opd-preview-frame iframe {
  width: 100%; height: 100%; border: 0;
  display: block;
}

/* SECTION 11 — CTA */
.opd-cta-h {
  font-size: clamp(40px, 5.4vw, 72px);
  line-height: 1.0;
  letter-spacing: -0.038em;
  font-weight: 450;
  margin: 0;
  max-width: 22ch;
}
.opd-section.dark .opd-cta-h { color: var(--text); }
.opd-section.light .opd-cta-h,
.opd-section.papersoft .opd-cta-h { color: var(--ink); }
.opd-cta-sub {
  margin-top: 24px;
  font-size: 17px;
  max-width: 56ch;
  line-height: 1.5;
}
.opd-section.dark .opd-cta-sub { color: var(--text-muted); }
.opd-section.light .opd-cta-sub,
.opd-section.papersoft .opd-cta-sub { color: var(--ink-muted); }
.opd-cta-row { margin-top: 36px; display: flex; gap: 12px; flex-wrap: wrap; }

/* FOOTER */
.opd-foot {
  background: var(--paper-card);
  color: var(--ink-muted);
  border-top: 1px solid var(--ink-line);
  padding: 36px 28px;
}
.opd-foot-inner {
  max-width: 1280px; margin: 0 auto;
  display: flex; flex-wrap: wrap; gap: 12px;
  align-items: baseline; justify-content: space-between;
}
.opd-foot .desc {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.08em;
  color: var(--ink-muted);
}
.opd-foot .copy { font-size: 12px; color: var(--ink-muted); }
`;

function ProductMock({
  variant = "thread",
  highlight,
}: {
  variant?: "thread" | "outlook" | "sharepoint" | "teams" | "excel" | "dashboard";
  highlight?: string;
}) {
  if (variant === "outlook") {
    return (
      <div className="opd-product-frame" style={{ background: "#FFFFFF", color: "#1B1B1B", border: "1px solid #C6CFE0" }}>
        <div style={{ background: "linear-gradient(180deg, #2E70CF, #1656B0)", color: "white", padding: "8px 14px", display: "flex", alignItems: "center", gap: 10, fontSize: 12, fontWeight: 600 }}>
          <span style={{ fontFamily: "Tahoma, Geneva, sans-serif" }}>Inbox · Microsoft Outlook</span>
          <span style={{ marginLeft: "auto", fontFamily: "Courier New, monospace", opacity: 0.8 }}>_ □ ✕</span>
        </div>
        <div style={{ padding: 16, fontFamily: "Tahoma, Geneva, sans-serif", fontSize: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 12, padding: "8px 0", borderBottom: "1px dotted #ccc", fontWeight: 700 }}>
            <span>Anna L.</span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>RE: RE: RE: RE: REC-2412 root cause? <span style={{ color: "#1A73E8" }}>(17)</span></span>
            <span style={{ color: "#888", fontSize: 11 }}>Mar 31</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 12, padding: "8px 0", borderBottom: "1px dotted #ccc" }}>
            <span style={{ color: "#555" }}>Priya T.</span>
            <span>FW: FW: GC trace from B2 missing</span>
            <span style={{ color: "#888", fontSize: 11 }}>Mar 22</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 12, padding: "8px 0" }}>
            <span style={{ color: "#555" }}>John M.</span>
            <span>Following up on supplier CoA</span>
            <span style={{ color: "#888", fontSize: 11 }}>Mar 18</span>
          </div>
        </div>
      </div>
    );
  }
  if (variant === "sharepoint") {
    return (
      <div className="opd-product-frame" style={{ background: "#FFFFFF", color: "#1B1B1B", border: "1px solid #C6CFE0" }}>
        <div style={{ background: "linear-gradient(180deg, #03787C, #035A5C)", color: "white", padding: "8px 14px", fontSize: 12, fontWeight: 600, fontFamily: "Tahoma, Geneva, sans-serif" }}>
          SharePoint · /Quality/Audit/2024
        </div>
        <div style={{ padding: 16, fontFamily: "Tahoma, Geneva, sans-serif", fontSize: 12 }}>
          {["Audit_Working.xlsx", "Audit_Working_FINAL.xlsx", "Audit_Working_FINAL_v2.xlsx", "Audit_FINAL_USE_THIS.xlsx"].map((f, i) => (
            <div key={f} style={{ padding: "6px 0", borderBottom: i < 3 ? "1px dotted #ccc" : "none", color: i === 3 ? "#C4303A" : "#1A3AA8", textDecoration: i === 3 ? "none" : "underline" }}>
              📄 {f} {i === 3 && <em style={{ fontStyle: "italic", opacity: 0.7, marginLeft: 6 }}>broken link</em>}
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (variant === "teams") {
    return (
      <div className="opd-product-frame" style={{ background: "#FFFFFF", color: "#1B1B1B", border: "1px solid #C6CFE0" }}>
        <div style={{ background: "linear-gradient(180deg, #4B53BC, #353A8A)", color: "white", padding: "8px 14px", fontSize: 12, fontWeight: 600, fontFamily: "Tahoma, Geneva, sans-serif" }}>
          Teams · #quality-ops
        </div>
        <div style={{ padding: 16, fontFamily: "Tahoma, Geneva, sans-serif", fontSize: 12 }}>
          <div style={{ padding: "6px 0", borderBottom: "1px dotted #ccc" }}>
            <div style={{ fontWeight: 700, fontSize: 12 }}>Marc M. <span style={{ fontWeight: 400, color: "#888", marginLeft: 6, fontSize: 10 }}>9:32</span></div>
            <div style={{ color: "#222", marginTop: 2 }}>Anyone holding lot 47B? OOS on incoming.</div>
          </div>
          <div style={{ padding: "6px 0" }}>
            <div style={{ fontWeight: 700, fontSize: 12 }}>Priya T. <span style={{ fontWeight: 400, color: "#888", marginLeft: 6, fontSize: 10 }}>10:46</span></div>
            <div style={{ color: "#222", marginTop: 2 }}>Lot is on hold. Reason in this thread.</div>
          </div>
        </div>
      </div>
    );
  }
  if (variant === "excel") {
    return (
      <div className="opd-product-frame" style={{ background: "#FFFFFF", color: "#1B1B1B", border: "1px solid #C6CFE0" }}>
        <div style={{ background: "linear-gradient(180deg, #107C41, #0B5C2F)", color: "white", padding: "8px 14px", fontSize: 12, fontWeight: 600, fontFamily: "Tahoma, Geneva, sans-serif" }}>
          NC_Tracker.xlsx [Read-Only]
        </div>
        <div style={{ padding: 0, fontFamily: "Courier New, monospace", fontSize: 11 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
            {["A", "B", "C"].map((h) => (
              <div key={h} style={{ background: "#ebebeb", border: "1px solid #d0d0d0", padding: "4px 8px", fontWeight: 700, textAlign: "center" }}>{h}</div>
            ))}
            {["REC-2412", "In progress", "#REF!", "REC-2410", "Closed", "Mar 14", "REC-2407", "Closed", "Mar 02"].map((c, i) => (
              <div key={i} style={{ border: "1px solid #d0d0d0", padding: "4px 8px", color: c === "#REF!" ? "#C4303A" : "#222", fontWeight: c === "#REF!" ? 700 : 400 }}>
                {c}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (variant === "dashboard") {
    return (
      <div className="opd-product-frame">
        <div className="opd-app-bar">
          <span className="dots"><i /><i /><i /></span>
          <span className="url">app.unifize.com / dashboard</span>
          <span className="pill" style={{ color: "var(--accent)", borderColor: "rgba(0,82,255,0.32)", background: "rgba(0,82,255,0.08)" }}><span className="pulse" />Q2 2026</span>
        </div>
        <div style={{ padding: 22, background: "#FBFBFC" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 4 }}>
            <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: "#0052FF", marginRight: 6, boxShadow: "0 0 0 3px #F0F4FF" }} />
            Quality · Q2 2026
          </div>
          <h4 style={{ margin: "4px 0 16px", fontSize: 18, fontWeight: 600, letterSpacing: "-0.012em", color: "var(--ink)" }}>Non-conformances</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", border: "1px solid var(--ink-line)", borderRadius: 6, overflow: "hidden", background: "#fff" }}>
            {KPIS.map((k, i) => (
              <div key={k.lbl} style={{ padding: "12px 14px", borderRight: i < 3 ? "1px solid var(--ink-line)" : "none" }}>
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-faint)" }}>{k.lbl}</div>
                <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.025em", color: "var(--ink)", marginTop: 4 }}>
                  {k.val}<span style={{ fontSize: 11, color: "var(--ink-muted)", fontWeight: 500, marginLeft: 2 }}>{k.unit}</span>
                </div>
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "var(--ink-muted)", marginTop: 2 }}>{k.note}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: 14, background: "#fff", border: "1px solid var(--ink-line)", borderRadius: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 500, marginBottom: 8 }}>Closure TAT by stage</div>
            <svg viewBox="0 0 280 80" preserveAspectRatio="none" style={{ width: "100%", height: 70, display: "block" }}>
              <rect x="6"   y="50" width="22" height="22" fill="#0052FF" />
              <rect x="6"   y="40" width="22" height="10" fill="#D6E0FF" />
              <rect x="38"  y="40" width="22" height="32" fill="#0052FF" />
              <rect x="38"  y="30" width="22" height="10" fill="#D6E0FF" />
              <rect x="70"  y="20" width="22" height="52" fill="#0052FF" />
              <rect x="70"  y="10" width="22" height="10" fill="#D6E0FF" />
              <rect x="102" y="22" width="22" height="50" fill="#0052FF" />
              <rect x="102" y="14" width="22" height="8"  fill="#D6E0FF" />
              <rect x="134" y="44" width="22" height="28" fill="#0052FF" />
              <rect x="134" y="36" width="22" height="8"  fill="#D6E0FF" />
              <rect x="166" y="20" width="22" height="52" fill="#0052FF" />
              <rect x="166" y="10" width="22" height="10" fill="#D6E0FF" />
              <rect x="198" y="58" width="22" height="14" fill="#0052FF" />
              <rect x="198" y="52" width="22" height="6"  fill="#D6E0FF" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
  // default — thread
  return (
    <div className="opd-product-frame">
      <div className="opd-app-bar">
        <span className="dots"><i /><i /><i /></span>
        <span className="url">app.unifize.com / NCR-219</span>
        <span className="pill"><span className="pulse" />LIVE</span>
      </div>
      <div className="opd-app-shell">
        <div className="opd-app-rail">
          <div className="logo">U</div>
          <div className="icon" title="Home"><svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M3 8L9 3.5 15 8v6.5a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5V8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg></div>
          <div className="icon active" title="Conversations"><svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M3 5a1 1 0 011-1h10a1 1 0 011 1v7a1 1 0 01-1 1H7l-4 3V5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg></div>
          <div className="icon" title="Records"><svg width="16" height="16" viewBox="0 0 18 18" fill="none"><rect x="3" y="3" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.4"/><rect x="9.5" y="3" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.4"/><rect x="3" y="9.5" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.4"/><rect x="9.5" y="9.5" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.4"/></svg></div>
          <div className="icon" title="People"><svg width="16" height="16" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="7" r="2.8" stroke="currentColor" strokeWidth="1.4"/><path d="M3.5 15c1.2-2.8 3.4-3.9 5.5-3.9s4.3 1.1 5.5 3.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg></div>
        </div>
        <div className="opd-app-list">
          <div className="head">Conversations</div>
          <div className="row active"><span className="mk" /><span className="name">NCR-219</span><span className="when">Apr 24</span></div>
          <div className="row"><span className="mk" style={{ background: "var(--warn)" }} /><span className="name">CAPA-241</span><span className="when">Apr 22</span></div>
          <div className="row"><span className="mk" /><span className="name">ECO-0788</span><span className="when">Apr 21</span></div>
          <div className="row"><span className="mk" style={{ background: "var(--green)" }} /><span className="name">SCAR-12</span><span className="when">Apr 18</span></div>
          <div className="row"><span className="mk" /><span className="name">CMP-58</span><span className="when">Apr 14</span></div>
        </div>
        <div className="opd-app-thread">
          <div className="opd-app-thead">
            <div className="row1">
              <span className="badge"><span className="pulse" />IDENTIFIED</span>
              <span className="id">NCR-219</span>
              <span className="id" style={{ opacity: 0.5 }}>·</span>
              <span className="id">Opened Apr 18</span>
            </div>
            <h4>Assembly defect detected in final inspection</h4>
            <div className="meta">
              <span><span className="k">Owner</span>Lisa Martin</span>
              <span><span className="k">Due</span>Apr 24</span>
              <span><span className="k">Linked</span>CAR-41 · RCA-12</span>
            </div>
          </div>
          <div className="opd-app-body">
            <span className="opd-anchor" data-beat="01">01 · Trigger</span>
            <div className="opd-msg">
              <div className="av">LM</div>
              <div className="body">
                <div className="who">Lisa Martin <span className="when">09:02</span></div>
                <div className="text">Assembly defect found at final inspection. Assigning ownership by role to Quality Lead. Daniel will pick this up.</div>
              </div>
            </div>

            <span className="opd-anchor" data-beat="03">03 · Decision</span>
            <div className="opd-msg">
              <div className="av bot">U</div>
              <div className="body">
                <div className="who primary">Unifize Assistant <span className="when">09:14</span></div>
                <div className="ai-card">
                  <div className="t">AI Assist · proposed</div>
                  <div className="body">Disposition: Scrap 12 units. Linked to Lot 2403-A. Severity 2.</div>
                </div>
                <button className="approve">Approve</button>
              </div>
            </div>

            <span className="opd-anchor" data-beat="05">05 · Approval</span>
            <div className="opd-msg">
              <div className="av">DS</div>
              <div className="body">
                <div className="who">Daniel Storm <span className="when">14:22</span></div>
                <div className="text">CAR-41 reviewed. Approving with electronic signature. Bound to role and regulation.</div>
                <span className="stamp">21 CFR 11 · Approved</span>
              </div>
            </div>
          </div>
        </div>
        <div className="opd-app-aside">
          <div className="head">
            <span>Closure check</span>
            <span>v4.2</span>
          </div>
          <div className="ttl">CAR-41 · Corrective action</div>
          <div className="prog-row">
            <span>Completion</span>
            <span>5 / 8</span>
          </div>
          <div className="bar"><div className="fill" style={{ width: "62.5%" }} /></div>
          <div className="secs">
            <div className="sec done"><span className="d" /><span>Inputs</span><span className="frac">4/4</span></div>
            <div className="sec done"><span className="d" /><span>Disposition</span><span className="frac">3/3</span></div>
            <div className="sec done"><span className="d" /><span>Evidence</span><span className="frac">6/6</span></div>
            <div className="sec done"><span className="d" /><span>Approval</span><span className="frac">2/2</span></div>
            <div className="sec active"><span className="d" /><span>Effectiveness</span><span className="frac">2/5</span></div>
            <div className="sec pend"><span className="d" /><span>Linked records</span><span className="frac">0/3</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomeOptionD() {
  const [persona, setPersona] = useState(0);
  const [activeBeat, setActiveBeat] = useState(0);
  const [domainIdx, setDomainIdx] = useState(0);

  useEffect(() => {
    document.title = "Option D · Product-anchored";
  }, []);

  // Cycle persona slowly so visitor sees the ribbon move on its own.
  useEffect(() => {
    const id = window.setInterval(() => setPersona((p) => (p + 1) % PERSONAS.length), 4200);
    return () => window.clearInterval(id);
  }, []);

  // Cycle anatomy beat highlight.
  useEffect(() => {
    const id = window.setInterval(() => setActiveBeat((b) => (b + 1) % THREAD_BEATS.length), 2400);
    return () => window.clearInterval(id);
  }, []);

  // Cycle domain pill.
  useEffect(() => {
    const id = window.setInterval(() => setDomainIdx((d) => (d + 1) % DOMAINS.length), 1800);
    return () => window.clearInterval(id);
  }, []);

  const personaActive = PERSONAS[persona];

  return (
    <div className="opd-root">
      <style>{STYLES}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* NAV */}
      <nav className="opd-nav">
        <div className="opd-nav-inner">
          <Link to="/option-d" className="opd-nav-logo">
            <span className="name"><span className="mark" />Unifize</span>
            <span className="opd-nav-tag">People · Process · AI · Outcomes</span>
          </Link>
          <div className="opd-nav-items">
            <a href="#anatomy">Anatomy</a>
            <a href="#personas">Personas</a>
            <a href="#replaces">Replaces</a>
            <a href="#cost">Cost</a>
            <a href="#domains">Domains</a>
            <a href="#outcomes">Outcomes</a>
            <a href="#proof">Proof</a>
          </div>
          <div className="opd-nav-actions">
            <Link to="/option-a" className="opd-nav-link mono">→ Option A</Link>
            <Link to="/option-b" className="opd-nav-link mono">→ Option B</Link>
            <button className="opd-nav-btn">Book a demo</button>
          </div>
        </div>
      </nav>

      {/* SECTION 1 — HERO */}
      <section className="opd-section light" id="hero">
        <div className="opd-section-inner">
          <div className="opd-hero-copy">
            <div className="opd-eyebrow">
              <span className="dot" />
              <span className="num">01</span>
              <span className="sep">/</span>
              <span className="name">The platform, doing the work</span>
            </div>
            <h1 className="opd-hero-h1">
              Watch a regulated process{" "}
              <span className="accent">close itself.</span>
            </h1>
            <p className="opd-hero-subhead">
              The same thread, read five different ways. Five personas. Fifteen domains.
            </p>

            <div className="opd-personas">
              {PERSONAS.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  className={"opd-persona" + (i === persona ? " active" : "")}
                  onClick={() => setPersona(i)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="opd-persona-reading">{personaActive.reading}</div>

            <div className="opd-cta-row">
              <button className="opd-btn-primary">
                Book a demo
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <a href="#anatomy" className="opd-btn-ghost">Replay the demo</a>
            </div>

            <div className="opd-hero-teaser">
              <span className="arrow" />
              <span>Scroll. Watch it close.</span>
            </div>
          </div>

          <div className="opd-preview">
            <span className="opd-preview-glow" aria-hidden />
            <div className="opd-preview-frame">
              <iframe src="/chat?embed=1" title="Unifize product preview" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — THREAD ANATOMY */}
      <section className="opd-section light full" id="anatomy">
        <div className="opd-section-inner">
          <div className="opd-eyebrow">
            <span className="dot" />
            <span className="num">02</span>
            <span className="sep">/</span>
            <span className="name">Anatomy of a thread</span>
          </div>
          <h2 className="opd-h2">
            Seven beats.{" "}
            <span className="dim">Trigger, owner, decision, evidence, approval, handoff, closed.</span>
          </h2>
          <p className="opd-sub">
            Every regulated record passes through these seven moves. Today they are scattered across four tools. Here, they are bound to one thread.
          </p>

          <div className="opd-anatomy-grid">
            {THREAD_BEATS.map((b, i) => (
              <div
                key={b.n}
                className={"opd-anatomy-card" + (i === activeBeat ? " active" : "")}
                onMouseEnter={() => setActiveBeat(i)}
              >
                <span className="n">{b.n}</span>
                <div className="k">{b.k}</div>
                <div className="cap">{b.caption}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — PERSONA PIVOT */}
      <section className="opd-section papersoft full" id="personas">
        <div className="opd-section-inner">
          <div className="opd-eyebrow">
            <span className="dot" />
            <span className="num">03</span>
            <span className="sep">/</span>
            <span className="name">Same thread, five readings</span>
          </div>
          <h2 className="opd-h2">
            One record. <span className="dim">Five jobs to be done.</span>
          </h2>
          <p className="opd-sub">
            The thread does not change. The reader does. Each persona sees the slice they need.
          </p>

          <div className="opd-persona-grid">
            {[
              {
                id: "qa", label: "VP Quality",
                lens: "Evidence completeness",
                reading: "Audit-ready in one click. Every signature bound to role and regulation.",
                visual: (
                  <div className="opd-persona-evidence">
                    <div className="row done"><span className="cb">✓</span><span>Disposition · 3/3</span></div>
                    <div className="row done"><span className="cb">✓</span><span>Investigation · 5/5</span></div>
                    <div className="row done"><span className="cb">✓</span><span>Evidence bound · 6 attach</span></div>
                    <div className="row done"><span className="cb">✓</span><span>Approval · 2 signatures</span></div>
                    <div className="row pend"><span className="cb">○</span><span>Effectiveness · 2/5</span></div>
                  </div>
                ),
              },
              {
                id: "ops", label: "Operations",
                lens: "Handoff speed",
                reading: "State preserved across functions. No re-explaining at every step.",
                visual: (
                  <div className="opd-persona-flow">
                    <div className="lane">
                      <span className="who">QA Ops</span>
                      <span className="bar" style={{ width: "22%" }} />
                    </div>
                    <div className="lane">
                      <span className="who">Mfg Lead</span>
                      <span className="bar" style={{ width: "32%", marginLeft: "22%" }} />
                    </div>
                    <div className="lane">
                      <span className="who">QA Mgr</span>
                      <span className="bar" style={{ width: "28%", marginLeft: "54%" }} />
                    </div>
                    <div className="lane">
                      <span className="who">Reg Affairs</span>
                      <span className="bar done" style={{ width: "18%", marginLeft: "82%" }} />
                    </div>
                  </div>
                ),
              },
              {
                id: "reg", label: "Regulatory",
                lens: "Stamps and signatures",
                reading: "21 CFR 11. Every approval is bound to a role, a regulation, a timestamp.",
                visual: (
                  <div className="opd-persona-stamps">
                    <span className="stamp">21 CFR 11.50</span>
                    <span className="stamp">ISO 13485</span>
                    <span className="stamp">21 CFR 820.100</span>
                    <span className="stamp ok">e-Sig · Approved</span>
                  </div>
                ),
              },
              {
                id: "cfo", label: "CFO",
                lens: "Cycle time and cost",
                reading: "Quantified per record. The expensive part of the work, finally visible.",
                visual: (
                  <div className="opd-persona-cost">
                    <div className="big"><span className="num">−65</span><span className="u">%</span></div>
                    <div className="lbl">Cycle time vs four-tool baseline</div>
                    <div className="bar"><div className="fill" style={{ width: "65%" }} /></div>
                  </div>
                ),
              },
              {
                id: "cio", label: "CIO",
                lens: "AI Assist + integrations",
                reading: "Connected to SAP, MasterControl, SharePoint. AI drafts. Humans approve.",
                visual: (
                  <div className="opd-persona-ai">
                    <div className="card">
                      <div className="hd">AI Assist · proposed</div>
                      <div className="bd">Disposition: scrap 12 units. Severity 2.</div>
                      <button className="btn">Approve</button>
                    </div>
                  </div>
                ),
              },
            ].map((p) => (
              <div key={p.id} className="opd-persona-card">
                <div className="opd-persona-head">
                  <span className="lbl">{p.label}</span>
                  <span className="lens">{p.lens}</span>
                </div>
                <div className="opd-persona-visual">{p.visual}</div>
                <div className="opd-persona-reading-text">{p.reading}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — WHAT IT REPLACES */}
      <section className="opd-section papersoft full" id="replaces">
        <div className="opd-section-inner">
          <div className="opd-eyebrow">
            <span className="dot" />
            <span className="num">04</span>
            <span className="sep">/</span>
            <span className="name">What it replaces</span>
          </div>
          <h2 className="opd-h2">
            Same record. <span className="dim">Four tools. Reconstruction job, every time.</span>
          </h2>
          <p className="opd-sub">
            The shape is constant. The chrome changes. Outlook holds the chain. SharePoint holds the versions. Teams holds the verbal. Excel holds the tracker. None of them holds the record.
          </p>

          <div className="opd-morph-grid">
            <div className="opd-morph-card">
              <ProductMock variant="outlook" />
            </div>
            <div className="opd-morph-card">
              <ProductMock variant="sharepoint" />
            </div>
            <div className="opd-morph-card">
              <ProductMock variant="teams" />
            </div>
            <div className="opd-morph-card">
              <ProductMock variant="excel" />
            </div>
          </div>

          <div className="opd-replace-attrib">
            REC-2412 · 92 days · 3 reopens · audit trail incomplete
          </div>
        </div>
      </section>

      {/* SECTION 5 — WHY IT WORKS */}
      <section className="opd-section light full" id="why">
        <div className="opd-section-inner">
          <div className="opd-eyebrow">
            <span className="dot" />
            <span className="num">05</span>
            <span className="sep">/</span>
            <span className="name">Why it works</span>
          </div>
          <h2 className="opd-h2">
            The layer between{" "}
            <span className="dim">systems of record and systems of coordination.</span>
          </h2>
          <p className="opd-sub">
            Systems of record stay authoritative. Coordination stays where it lives. Unifize is the layer between them. For regulated processes.
          </p>

          <div className="opd-bridge">
            <div className="opd-bridge-col record">
              <div className="head">Systems of record</div>
              <div className="item">QMS · MasterControl, Greenlight</div>
              <div className="item">ERP · SAP, NetSuite</div>
              <div className="item">PLM · Windchill, Arena</div>
              <div className="item">DMS · SharePoint, Veeva</div>
            </div>

            <div className="opd-bridge-layer">
              <span className="lbl">The layer</span>
              <span className="name">Unifize</span>
              <span className="cap">Thread. Decision. Evidence. Approval.</span>
            </div>

            <div className="opd-bridge-col coord">
              <div className="head">Systems of coordination</div>
              <div className="item">Email · Outlook</div>
              <div className="item">Chat · Teams</div>
              <div className="item">Files · SharePoint, Excel</div>
              <div className="item">Meetings · Teams, in-person</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — NAME THE COST (no product, full bleed) */}
      <section className="opd-section light no-product" id="cost">
        <div className="opd-section-inner">
          <div className="opd-cost">
            <div className="opd-eyebrow">
              <span className="dot" />
              <span className="num">06</span>
              <span className="sep">/</span>
              <span className="name">Coordination tax. Visible. Measurable. Reducible. For regulated processes.</span>
            </div>
            <h2>
              Coordination <span className="accent">tax.</span>
            </h2>
            <p>
              The cost of holding cross-functional work together when no layer owns it. Paid in cycle time, rework, audit risk, and decisions made twice. You've been paying it for years.
            </p>
            <div className="opd-cost-stat">
              <span className="num">71d</span>
              <span className="lbl">median, fragmented<br />vs 21d on the layer</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — WHERE IT SHOWS UP */}
      <section className="opd-section light full" id="domains">
        <div className="opd-section-inner">
          <div className="opd-eyebrow">
            <span className="dot" />
            <span className="num">07</span>
            <span className="sep">/</span>
            <span className="name">Every record</span>
          </div>
          <h2 className="opd-h2">
            Fifteen rooms in your building.{" "}
            <span className="dim">One layer behind every door.</span>
          </h2>
          <p className="opd-sub">
            Same shape, different content. CAPA, ECO, SCAR, Complaint, NCR, Audit, Document Control, Training, Risk, Design Review, MRB, Calibration, Periodic Review, Recall, Submission Assembly.
          </p>

          <div className="opd-domain-grid">
            {[
              { d: "CAPA", id: "CAPA-241", persona: "QA Manager", trigger: "Deviation raised", state: "Active", tone: "info" },
              { d: "ECO", id: "ECO-0788", persona: "Eng. Lead", trigger: "Drawing change", state: "Active", tone: "info" },
              { d: "Supplier CAR", id: "SCAR-12", persona: "SQE", trigger: "Supplier finding", state: "Active", tone: "info" },
              { d: "Complaint", id: "CMP-58", persona: "QA Ops", trigger: "Customer report", state: "In review", tone: "warn" },
              { d: "Deviation / NCR", id: "NCR-219", persona: "Production", trigger: "Out-of-spec batch", state: "In review", tone: "warn" },
              { d: "Audit", id: "AUD-7", persona: "Compliance", trigger: "Inspection notice", state: "In review", tone: "warn" },
              { d: "Document Control", id: "DOC-25", persona: "DocControl", trigger: "SOP revision", state: "In review", tone: "warn" },
              { d: "Training", id: "TRN-44", persona: "HR / QA", trigger: "New SOP issued", state: "In review", tone: "warn" },
              { d: "Risk Management", id: "RSK-9", persona: "QA Director", trigger: "Design review", state: "Backlog", tone: "neutral" },
              { d: "Design Review", id: "DRV-15", persona: "R&D Lead", trigger: "Phase gate", state: "Backlog", tone: "neutral" },
              { d: "MRB", id: "MRB-04", persona: "Quality Eng.", trigger: "Material rejected", state: "Backlog", tone: "neutral" },
              { d: "Calibration", id: "CAL-31", persona: "Metrology", trigger: "Calibration due", state: "Backlog", tone: "neutral" },
              { d: "Periodic Review", id: "PR-22", persona: "QA Mgr", trigger: "Annual cycle", state: "Backlog", tone: "neutral" },
              { d: "Recall", id: "REC-12", persona: "Reg. Affairs", trigger: "Field action", state: "Backlog", tone: "neutral" },
              { d: "Submission", id: "SUB-510k", persona: "Reg. Affairs", trigger: "510(k) prep", state: "Backlog", tone: "neutral" },
            ].map((row, i) => (
              <div key={row.id} className={"opd-domain-card" + (i === domainIdx ? " active" : "")}>
                <div className="opd-domain-head">
                  <span className="lbl">{row.d}</span>
                  <span className={`opd-domain-state ${row.tone}`}>
                    <span className="pulse" />
                    {row.state}
                  </span>
                </div>
                <div className="opd-domain-id">{row.id}</div>
                <div className="opd-domain-meta">
                  <span><span className="k">Owner</span>{row.persona}</span>
                </div>
                <div className="opd-domain-trigger">{row.trigger}</div>
                <div className="opd-domain-spark">
                  <span className="dot done" />
                  <span className="line done" />
                  <span className="dot done" />
                  <span className="line done" />
                  <span className="dot active" />
                  <span className="line" />
                  <span className="dot" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — WHAT CHANGES */}
      <section className="opd-section papersoft" id="outcomes">
        <div className="opd-section-inner">
          <div>
            <div className="opd-eyebrow">
              <span className="dot" />
              <span className="num">08</span>
              <span className="sep">/</span>
              <span className="name">What changes</span>
            </div>
            <h2 className="opd-h2">
              Cycle time, rework, audit-readiness.{" "}
              <span className="dim">Quantified per record.</span>
            </h2>
            <p className="opd-sub">
              Same product surface, different view. The thread becomes the dashboard. Same data, different shape. Directional figures, attribution where Proof Maturity supports.
            </p>

            <div className="opd-kpis">
              {KPIS.map((k) => (
                <div key={k.lbl} className="opd-kpi">
                  <div className="lbl">{k.lbl}</div>
                  <div className="val">{k.val}<span className="unit">{k.unit}</span></div>
                  <div className="note">{k.note}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="opd-product">
            <ProductMock variant="dashboard" />
          </div>
        </div>
      </section>

      {/* SECTION 9 — AI COMPOUNDS */}
      <section className="opd-section papersoft full" id="ai">
        <div className="opd-section-inner">
          <div className="opd-eyebrow">
            <span className="dot" />
            <span className="num">09</span>
            <span className="sep">/</span>
            <span className="name">AI compounds</span>
          </div>
          <h2 className="opd-h2">
            Three levels.{" "}
            <span className="dim">Each one locks the previous.</span>
          </h2>
          <p className="opd-sub">
            The layer is what makes AI compound. Without it, AI is a chat in another window. With it, every suggestion lands on a structured thread, gets a human approval, and writes back to the record.
          </p>

          <div className="opd-ai-grid">
            {AI_LEVELS.map((l) => (
              <div key={l.n} className="opd-ai-card">
                <span className="n">{l.n}</span>
                <div className="t">{l.title}</div>
                <div className="c">{l.caption}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10 — PROOF (no product, copy moment) */}
      <section className="opd-section light no-product" id="proof">
        <div className="opd-section-inner">
          <div className="opd-proof">
            <div className="opd-eyebrow">
              <span className="dot" />
              <span className="num">10</span>
              <span className="sep">/</span>
              <span className="name">Proof</span>
            </div>
            <p className="opd-proof-quote">
              "We replaced four tools with one thread. CAPA cycle time went from <span className="accent">92 days to 21.</span> Audit prep collapsed from a folder dive to a single export."
            </p>
            <div className="opd-proof-meta">
              <span><strong>VP Quality</strong> · ISO 13485 manufacturer</span>
              <span><strong>Med Devices</strong> · Class II implants</span>
              <span><strong>Deployed</strong> · Q4 2024</span>
            </div>
            <div className="opd-proof-stats">
              <div className="stat">
                <div className="v">−65%</div>
                <div className="l">Cycle time, CAPA</div>
              </div>
              <div className="stat">
                <div className="v">0</div>
                <div className="l">Reopens since deployment</div>
              </div>
              <div className="stat">
                <div className="v">1-click</div>
                <div className="l">Audit export</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11 — CTA */}
      <section className="opd-section light no-product" id="cta">
        <div className="opd-section-inner">
          <div className="opd-cta-block">
            <div className="opd-eyebrow">
              <span className="dot" />
              <span className="num">11</span>
              <span className="sep">/</span>
              <span className="name">See it on your process</span>
            </div>
            <h2 className="opd-cta-h">
              Forty-five minutes.{" "}
              <span className="dim">Your record. The layer underneath.</span>
            </h2>
            <p className="opd-cta-sub">
              We pick one of your processes and rebuild it as a single governed thread on screen. With your numbers.
            </p>
            <div className="opd-cta-row">
              <button className="opd-btn-primary">
                Book a demo
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <a href="#cost" className="opd-btn-ghost">Calculate your coordination tax</a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="opd-foot">
        <div className="opd-foot-inner">
          <span className="copy">© {new Date().getFullYear()} Unifize.</span>
          <span className="desc">Coordination tax, visible, measurable, reducible. For regulated processes.</span>
          <span className="copy mono">Product-anchored exploration · Concept D</span>
        </div>
      </footer>
    </div>
  );
}
