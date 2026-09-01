import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * Concept C · Demonstration-led.
 * Bet: show the alternative working in section 1, then frame.
 * Hero is a dense, polished Unifize thread mock. The product carries the moment.
 * Subsequent sections explain what the viewer just watched.
 */

type Persona = { key: string; label: string; lens: string };

const PERSONAS: Persona[] = [
  { key: "qa", label: "VP Quality", lens: "Evidence completeness, audit trail, decisions logged in place." },
  { key: "ops", label: "Operations", lens: "Cycle time across handoffs, blockers, work-in-flight." },
  { key: "reg", label: "Regulatory", lens: "21 CFR 11 stamps, rationale captured at decision time." },
  { key: "cfo", label: "CFO", lens: "Reopen cost, effort recovered, coordination tax reducing." },
  { key: "cio", label: "CIO", lens: "AI Assist coverage, integration with the systems of record." },
];

type ThreadBeat = {
  k: string;
  label: string;
  caption: string;
  who: string;
  reg: string;
};

const THREAD_BEATS: ThreadBeat[] = [
  { k: "01", label: "Trigger",  caption: "Out-of-spec batch flagged in incoming inspection.",       who: "QA Ops",      reg: "ISO 9001 §8.7" },
  { k: "02", label: "Owner",    caption: "Decision authority assigned. Context inherited.",           who: "QA Mgr",      reg: "Role-based" },
  { k: "03", label: "Decision", caption: "Investigation scope set. Boundaries logged in place.",      who: "QA Mgr",      reg: "Rationale captured" },
  { k: "04", label: "Evidence", caption: "CoA, GC trace, supplier response bound to the decision.",   who: "SQE",         reg: "21 CFR 11.10" },
  { k: "05", label: "Approval", caption: "Two signatures required. Stamped in place.",                who: "VP QA",       reg: "21 CFR 11.50" },
  { k: "06", label: "Handoff",  caption: "Cross-functional pickup with state preserved.",             who: "Mfg Lead",    reg: "ISO 9001 §8.5" },
  { k: "07", label: "Closed",   caption: "Effectiveness check. Linked records updated. Trail final.", who: "QA Ops",      reg: "ISO 9001 §10.2" },
];

type DomainEntry = {
  label: string;
  persona: string;
  trigger: string;
  weight: "advocacy" | "evidence" | "hypothesis";
};

// 15 DOMAINS, not 15 records. Sourced from the IA Decision document.
const DOMAINS: DomainEntry[] = [
  { label: "Quality",                   persona: "QA Manager",     trigger: "Deviation raised",     weight: "advocacy" },
  { label: "Document & Records",        persona: "Doc Control",    trigger: "SOP revision",         weight: "advocacy" },
  { label: "Supplier Quality",          persona: "SQE",            trigger: "Supplier finding",     weight: "advocacy" },
  { label: "Change Control",            persona: "Eng. Lead",      trigger: "Drawing change",       weight: "advocacy" },
  { label: "Customer Management",       persona: "QA Ops",         trigger: "Customer report",      weight: "evidence" },
  { label: "Operations",                persona: "Production",     trigger: "Out-of-spec batch",    weight: "evidence" },
  { label: "Compliance & Audit",        persona: "Compliance",     trigger: "Inspection notice",    weight: "evidence" },
  { label: "Training & Competency",     persona: "HR / QA",        trigger: "New SOP issued",       weight: "evidence" },
  { label: "Risk Management",           persona: "QA Director",    trigger: "Design review",        weight: "evidence" },
  { label: "New Product Development",   persona: "R&D Lead",       trigger: "Phase gate",           weight: "evidence" },
  { label: "MRB & Disposition",         persona: "Quality Eng.",   trigger: "Material rejected",    weight: "hypothesis" },
  { label: "Calibration",               persona: "Metrology",      trigger: "Calibration due",      weight: "hypothesis" },
  { label: "Periodic Review",           persona: "QA Mgr",         trigger: "Annual cycle",         weight: "hypothesis" },
  { label: "Recall Management",         persona: "Reg. Affairs",   trigger: "Field action",         weight: "hypothesis" },
  { label: "Regulatory Submissions",    persona: "Reg. Affairs",   trigger: "510(k) prep",          weight: "hypothesis" },
];

type Convo = {
  id: string;
  label: string;
  meta: string;
  state: "active" | "waiting" | "approved" | "closed";
};

// Inbox conversations shown in the product mock left rail.
const CONVOS: Convo[] = [
  { id: "NCR-219",  label: "Out-of-spec batch 2403-A",    meta: "QA Ops · 2d",   state: "active" },
  { id: "ECO-0788", label: "Drawing rev for fixture B2",  meta: "Eng · 4d",      state: "waiting" },
  { id: "CAPA-241", label: "Recurring deviation, line 3", meta: "QA Mgr · 6d",   state: "waiting" },
  { id: "SCAR-12",  label: "Solvent purity off-spec",     meta: "SQE · 9d",      state: "approved" },
  { id: "DOC-25",   label: "SOP-411 rev 4 release",       meta: "Doc Control",   state: "closed" },
];

// 4-tool reconstruction in the diptych BEFORE pane.
const REPLACES_TOOLS = [
  {
    chrome: "Outlook",
    title: "Inbox",
    items: [
      { from: "Sarah K. (QA Ops)",  subj: "RE: RE: RE: REC-2412, root cause?",      time: "Tue 09:14",  count: "17" },
      { from: "Priya T.",           subj: "FW: GC trace from B2, missing pages",     time: "Mon 16:42",  count: "5" },
      { from: "Marc J. (Mfg)",      subj: "Following up on supplier CoA",            time: "Mon 11:08",  count: "8" },
      { from: "Daniel S. (VP QA)",  subj: "Looping in supplier. Need by EOW.",       time: "Fri 17:51",  count: "3" },
    ],
  },
  {
    chrome: "SharePoint",
    title: "/Quality/Audit/2024",
    items: [
      { from: "Audit_Working.xlsx",                     subj: "Modified Tue 15:22 by Sarah K.",   time: "12 KB",     count: "v1" },
      { from: "Audit_Working_FINAL.xlsx",               subj: "Modified Wed 10:05 by Marc J.",    time: "14 KB",     count: "v2" },
      { from: "Audit_Working_FINAL_v2.xlsx",            subj: "Modified Wed 16:48 by Priya T.",   time: "16 KB",     count: "v3" },
      { from: "Audit_FINAL_USE_THIS.xlsx",              subj: "Broken link · access denied",      time: "..",        count: "?" },
    ],
  },
  {
    chrome: "Teams",
    title: "#quality-ops",
    items: [
      { from: "Sarah K.",           subj: "Anyone holding lot 47B? OOS on incoming.",  time: "10:14",  count: "" },
      { from: "Marc J.",            subj: "Lot is on hold. Reason in this thread.",     time: "10:17",  count: "" },
      { from: "Priya T.",           subj: "Pulled the supplier CoA, sending to QA.",    time: "10:23",  count: "" },
      { from: "Daniel S.",          subj: "Let's just call about this. 30 min ok?",     time: "10:31",  count: "" },
    ],
  },
  {
    chrome: "Excel",
    title: "NC_Tracker.xlsx",
    items: [
      { from: "REC-2412",           subj: "In progress · Owner: Sarah K. · #REF!",     time: "92d",    count: "" },
      { from: "REC-2398",           subj: "Reopened · Owner: Marc J.",                  time: "61d",    count: "" },
      { from: "REC-2376",           subj: "Closed · Owner: Daniel S.",                  time: "44d",    count: "" },
      { from: "REC-2401",           subj: "Awaiting evidence",                          time: "28d",    count: "" },
    ],
  },
];

const STYLES = `
.cpc-root {
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
  --bg-card-2: #0E0F12;
  --border: rgba(255,255,255,0.08);
  --border-strong: rgba(255,255,255,0.14);
  --text: #FFFFFF;
  --text-muted: rgba(255,255,255,0.56);
  --text-faint: rgba(255,255,255,0.38);
  --accent: #0052FF;
  --accent-2: #4D85FF;
  --accent-soft: rgba(0,82,255,0.16);
  --accent-tint: rgba(0,82,255,0.08);
  --warm: #F0A33A;
  --green: #0B8A5C;
  --red: #C4303A;

  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  background: var(--paper);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
  letter-spacing: -0.011em;
  min-height: 100vh;
}
.cpc-root * { box-sizing: border-box; }
.cpc-root .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
.cpc-root a { color: inherit; text-decoration: none; }

/* ================ NAV ================ */
.cpc-nav {
  position: sticky; top: 0; z-index: 50;
  backdrop-filter: saturate(160%) blur(18px);
  background: rgba(250,250,251,0.88);
  border-bottom: 1px solid rgba(11,13,17,0.05);
  transition: background .25s ease, border-color .25s ease;
}
.cpc-nav.is-dark {
  background: rgba(8,9,10,0.86);
  border-bottom-color: rgba(255,255,255,0.05);
}
.cpc-nav-inner {
  max-width: 1240px; margin: 0 auto;
  padding: 12px 28px;
  display: flex; align-items: center; gap: 32px;
}
.cpc-nav-logo {
  display: flex; flex-direction: column; gap: 2px;
  color: var(--ink);
}
.cpc-nav.is-dark .cpc-nav-logo { color: var(--text); }
.cpc-nav-logo-img { height: 22px; width: auto; display: block; transition: filter .25s ease; }
.cpc-nav.is-dark .cpc-nav-logo-img { filter: brightness(0) invert(1); }
.cpc-nav-tagline {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--ink-faint);
  margin-top: 2px;
}
.cpc-nav.is-dark .cpc-nav-tagline { color: var(--text-faint); }
.cpc-nav-items { display: flex; gap: 24px; font-size: 13.5px; color: var(--ink-muted); }
.cpc-nav-items a:hover { color: var(--ink); }
.cpc-nav.is-dark .cpc-nav-items { color: var(--text-muted); }
.cpc-nav.is-dark .cpc-nav-items a:hover { color: var(--text); }
.cpc-nav-actions { margin-left: auto; display: flex; gap: 16px; align-items: center; }
.cpc-nav-link {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px; letter-spacing: 0.06em;
  color: var(--ink-faint);
}
.cpc-nav.is-dark .cpc-nav-link { color: var(--text-faint); }
.cpc-nav-link:hover { color: var(--ink); }
.cpc-nav.is-dark .cpc-nav-link:hover { color: var(--text); }
.cpc-nav-btn {
  font-size: 13px; font-weight: 500;
  background: var(--ink); color: var(--paper);
  padding: 7px 14px; border-radius: 999px;
  border: 1px solid var(--ink); cursor: pointer;
  transition: opacity .15s ease, background .25s ease, color .25s ease, border-color .25s ease;
}
.cpc-nav.is-dark .cpc-nav-btn { background: var(--text); color: #0B0D11; border-color: var(--text); }
.cpc-nav-btn:hover { opacity: 0.88; }
@media (max-width: 980px) { .cpc-nav-items { display: none; } .cpc-nav-tagline { display: none; } }

/* ================ COMMON ================ */
.cpc-section {
  max-width: 1240px; margin: 0 auto;
  padding: 120px 28px;
  min-height: 100vh;
  display: flex; flex-direction: column; justify-content: center;
}
.cpc-section.tight { padding: 80px 28px; min-height: auto; }
.cpc-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-muted);
  display: inline-flex; align-items: center; gap: 9px;
  padding: 6px 12px 6px 10px;
  background: var(--paper-card);
  border: 1px solid var(--ink-line);
  border-radius: 999px;
  margin-bottom: 28px;
  align-self: flex-start;
  box-shadow: 0 1px 2px rgba(11,13,17,0.025);
}
.cpc-eyebrow .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 3px rgba(0,82,255,0.18); flex-shrink: 0; }
.cpc-eyebrow .num { color: var(--ink); font-weight: 500; }
.cpc-eyebrow .sep { color: var(--ink-line-strong); opacity: 0.7; }
.cpc-eyebrow .name { color: var(--ink); }
.cpc-h2 {
  font-size: clamp(32px, 4.6vw, 56px);
  line-height: 1.04; letter-spacing: -0.034em;
  font-weight: 500; max-width: 22ch; margin: 0;
  color: var(--ink);
}
.cpc-h2 .dim { color: var(--ink-muted); }
.cpc-h2 .accent { color: var(--accent); }
.cpc-sub { margin-top: 22px; font-size: 16px; color: var(--ink-muted); max-width: 64ch; line-height: 1.5; }

.cpc-btn-primary {
  font-family: inherit; font-size: 14px; font-weight: 500;
  background: var(--ink); color: var(--paper);
  padding: 11px 20px; border-radius: 999px;
  border: 1px solid var(--ink); cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px;
  transition: opacity .15s ease;
}
.cpc-btn-primary:hover { opacity: 0.88; }
.cpc-btn-ghost {
  font-family: inherit; font-size: 14px; font-weight: 500;
  background: transparent; color: var(--ink);
  padding: 11px 18px; border-radius: 999px;
  border: 1px solid var(--ink-line); cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px;
  transition: border-color .15s ease, background .15s ease;
}
.cpc-btn-ghost:hover { border-color: var(--ink-line-strong); background: rgba(11,13,17,0.03); }

.cpc-dark { background: var(--bg); color: var(--text); }
.cpc-dark .cpc-eyebrow { background: rgba(255,255,255,0.04); border-color: var(--border); color: var(--text-muted); box-shadow: none; }
.cpc-dark .cpc-eyebrow .num, .cpc-dark .cpc-eyebrow .name { color: var(--text); }
.cpc-dark .cpc-eyebrow .sep { color: rgba(255,255,255,0.22); }
.cpc-dark .cpc-eyebrow .dot { box-shadow: 0 0 0 3px rgba(0,82,255,0.32); }
.cpc-dark .cpc-h2 { color: var(--text); }
.cpc-dark .cpc-h2 .dim { color: var(--text-muted); }
.cpc-dark .cpc-h2 .accent { color: var(--accent-2); }
.cpc-dark .cpc-sub { color: var(--text-muted); }
.cpc-dark .cpc-btn-primary { background: var(--text); color: #0B0D11; border-color: var(--text); }
.cpc-dark .cpc-btn-primary:hover { opacity: 0.88; }
.cpc-dark .cpc-btn-ghost { color: var(--text); border-color: var(--border-strong); }
.cpc-dark .cpc-btn-ghost:hover { background: rgba(255,255,255,0.04); }

/* ================ HERO ================ */
.cpc-hero-band {
  position: relative;
  background: var(--bg);
  color: var(--text);
  border-bottom: 1px solid var(--border);
  overflow: hidden;
  min-height: 100vh;
  display: flex; align-items: center;
  padding: 96px 0 72px;
}
.cpc-hero-band::before {
  content: ""; position: absolute; inset: 0;
  background:
    radial-gradient(900px 480px at 8% 14%, rgba(0,82,255,0.18), transparent 70%),
    radial-gradient(700px 420px at 92% 84%, rgba(0,82,255,0.10), transparent 70%);
  pointer-events: none;
}
.cpc-hero-band > * { position: relative; z-index: 1; }
.cpc-hero {
  max-width: 1240px; margin: 0 auto;
  padding: 0 28px;
  display: grid; grid-template-columns: minmax(320px, 0.92fr) minmax(560px, 1.18fr);
  gap: 48px; align-items: center;
  width: 100%;
}
@media (max-width: 1080px) { .cpc-hero { grid-template-columns: 1fr; } }

.cpc-hero-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--text-faint);
  margin-bottom: 22px;
  display: inline-flex; align-items: center; gap: 10px;
}
.cpc-hero-tag .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 4px rgba(0,82,255,0.28); }
.cpc-hero-h1 {
  font-size: clamp(38px, 5.4vw, 68px);
  font-weight: 450; line-height: 1.02; letter-spacing: -0.036em;
  margin: 0; color: var(--text);
}
.cpc-hero-h1 .em { color: var(--text-muted); font-weight: 450; }
.cpc-hero-h1 .accent { color: var(--accent-2); }
.cpc-hero-sub {
  margin-top: 28px;
  font-size: 18px; color: var(--text-muted);
  max-width: 42ch; line-height: 1.5;
}

.cpc-personas {
  margin-top: 32px;
  display: flex; flex-wrap: wrap; gap: 8px;
  align-items: center;
}
.cpc-persona-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase;
  padding: 7px 12px;
  border-radius: 999px;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  color: var(--text-muted);
  cursor: pointer;
  transition: all .15s ease;
}
.cpc-persona-tag:hover { border-color: var(--border-strong); color: var(--text); }
.cpc-persona-tag.is-active {
  background: var(--accent-soft);
  border-color: rgba(0,82,255,0.42);
  color: #DCE6FF;
}
.cpc-persona-lens {
  margin-top: 14px;
  font-size: 13px; color: var(--text-muted);
  max-width: 42ch; line-height: 1.5;
  font-style: italic;
  min-height: 40px;
}

.cpc-hero-cta { margin-top: 32px; display: flex; gap: 12px; flex-wrap: wrap; }
.cpc-hero-band .cpc-btn-primary { background: var(--text); color: #0B0D11; border-color: var(--text); }
.cpc-hero-band .cpc-btn-ghost { color: var(--text); border-color: var(--border-strong); }
.cpc-hero-band .cpc-btn-ghost:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.22); }

/* ================ PRODUCT MOCK ================ */
.cpc-mock {
  position: relative;
  width: 100%; max-width: 760px;
  margin-left: auto;
  background: var(--bg-card);
  border: 1px solid var(--border-strong);
  border-radius: 14px;
  overflow: hidden;
  box-shadow:
    0 50px 110px -32px rgba(0,82,255,0.30),
    0 30px 70px -20px rgba(0,0,0,0.55),
    0 0 0 1px rgba(255,255,255,0.04);
}
.cpc-mock-bar {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 14px;
  background: var(--bg-card-2);
  border-bottom: 1px solid var(--border);
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.04em;
  color: var(--text-faint);
}
.cpc-mock-bar .dots { display: inline-flex; gap: 5px; }
.cpc-mock-bar .dots i { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.10); }
.cpc-mock-bar .crumb { color: var(--text-muted); }
.cpc-mock-bar .crumb .strong { color: var(--text); }
.cpc-mock-bar .spacer { flex: 1; }
.cpc-mock-bar .kbd {
  border: 1px solid var(--border);
  padding: 2px 6px; border-radius: 3px;
  color: var(--text-faint);
  font-size: 9px;
}

.cpc-mock-body {
  display: grid;
  grid-template-columns: 56px 220px 1fr 168px;
  min-height: 540px;
}
@media (max-width: 700px) {
  .cpc-mock-body { grid-template-columns: 56px 1fr; }
  .cpc-mock-inbox, .cpc-mock-check { display: none; }
}

.cpc-mock-rail {
  background: var(--bg-card-2);
  border-right: 1px solid var(--border);
  padding: 16px 0;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
}
.cpc-mock-rail-icon {
  width: 32px; height: 32px; border-radius: 8px;
  display: grid; place-items: center;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; font-weight: 500;
  letter-spacing: 0;
}
.cpc-mock-rail-icon.is-active {
  background: var(--accent-soft);
  border-color: rgba(0,82,255,0.45);
  color: #DCE6FF;
}
.cpc-mock-rail-divider { width: 24px; height: 1px; background: var(--border); margin: 6px 0; }

.cpc-mock-inbox {
  background: var(--bg-card-2);
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column;
}
.cpc-mock-inbox-head {
  padding: 14px 16px 10px;
  border-bottom: 1px solid var(--border);
  display: flex; flex-direction: column; gap: 6px;
}
.cpc-mock-inbox-head .ttl { font-size: 12.5px; font-weight: 500; color: var(--text); }
.cpc-mock-inbox-head .meta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--text-faint);
  display: flex; align-items: center; gap: 7px;
}
.cpc-mock-inbox-head .meta .dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 3px rgba(0,82,255,0.22); }
.cpc-mock-inbox-list { display: flex; flex-direction: column; }
.cpc-mock-convo {
  padding: 10px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  display: flex; flex-direction: column; gap: 4px;
  cursor: pointer;
  transition: background .15s ease;
}
.cpc-mock-convo:hover { background: rgba(255,255,255,0.02); }
.cpc-mock-convo.is-active { background: rgba(0,82,255,0.10); border-left: 2px solid var(--accent); padding-left: 14px; }
.cpc-mock-convo .id {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.04em; color: var(--text);
  font-weight: 500;
  display: flex; align-items: center; justify-content: space-between;
}
.cpc-mock-convo .id .state {
  font-size: 8.5px; letter-spacing: 0.16em; text-transform: uppercase;
  padding: 2px 6px; border-radius: 2px;
}
.cpc-mock-convo .id .state.active { color: var(--accent-2); background: rgba(0,82,255,0.16); }
.cpc-mock-convo .id .state.waiting { color: #C8B07F; background: rgba(240,163,58,0.14); }
.cpc-mock-convo .id .state.approved { color: #6FCB9F; background: rgba(11,138,92,0.16); }
.cpc-mock-convo .id .state.closed { color: var(--text-faint); background: rgba(255,255,255,0.04); }
.cpc-mock-convo .lbl { font-size: 11.5px; color: var(--text-muted); line-height: 1.35; }
.cpc-mock-convo .meta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--text-faint);
}

/* THREAD MAIN */
.cpc-mock-thread {
  background: var(--bg-card);
  display: flex; flex-direction: column;
  min-width: 0;
}
.cpc-mock-thread-head {
  padding: 14px 22px 12px;
  border-bottom: 1px solid var(--border);
  display: flex; flex-direction: column; gap: 6px;
}
.cpc-mock-thread-head .row1 {
  display: flex; align-items: center; gap: 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px; letter-spacing: 0.04em; color: var(--text);
  font-weight: 500;
}
.cpc-mock-thread-head .row1 .badge {
  font-size: 9.5px; letter-spacing: 0.16em; text-transform: uppercase;
  padding: 3px 8px; border-radius: 3px;
  background: rgba(0,82,255,0.16); color: var(--accent-2);
}
.cpc-mock-thread-head .row1 .sev {
  font-size: 9.5px; letter-spacing: 0.16em; text-transform: uppercase;
  padding: 3px 8px; border-radius: 3px;
  background: rgba(196,48,58,0.16); color: #E27680;
}
.cpc-mock-thread-head .row2 {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--text-faint);
}
.cpc-mock-thread-body {
  flex: 1;
  padding: 22px;
  display: flex; flex-direction: column; gap: 18px;
  overflow: hidden;
}

.cpc-mock-msg {
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 12px;
}
.cpc-mock-msg-avatar {
  width: 28px; height: 28px; border-radius: 50%;
  background: linear-gradient(135deg, #5C8DFF 0%, #0052FF 100%);
  display: grid; place-items: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; font-weight: 500; color: var(--text);
  letter-spacing: 0;
}
.cpc-mock-msg-avatar.alt { background: linear-gradient(135deg, #2D6FFF 0%, #0052FF 100%); }
.cpc-mock-msg-avatar.alt2 { background: linear-gradient(135deg, #85ABFF 0%, #2D6FFF 100%); }
.cpc-mock-msg-content {
  display: flex; flex-direction: column; gap: 4px;
  min-width: 0;
}
.cpc-mock-msg-meta {
  display: flex; align-items: baseline; gap: 8px;
  font-size: 12px;
}
.cpc-mock-msg-meta .who { color: var(--text); font-weight: 500; }
.cpc-mock-msg-meta .role {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--text-faint);
}
.cpc-mock-msg-meta .time {
  margin-left: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; color: var(--text-faint);
}
.cpc-mock-msg-text {
  font-size: 13px; color: var(--text-muted); line-height: 1.5;
}

/* AI Assist tinted block */
.cpc-mock-ai {
  margin-left: 40px;
  padding: 14px 16px 14px 18px;
  background: var(--accent-soft);
  border: 1px solid rgba(0,82,255,0.32);
  border-left: 3px solid var(--accent);
  border-radius: 8px;
  display: flex; flex-direction: column; gap: 6px;
}
.cpc-mock-ai-head {
  display: flex; align-items: center; gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.18em; text-transform: uppercase;
  color: #B5CDFF;
}
.cpc-mock-ai-head .pulse {
  width: 6px; height: 6px; border-radius: 50%; background: var(--accent-2);
  box-shadow: 0 0 0 3px rgba(0,82,255,0.28);
}
.cpc-mock-ai-body { font-size: 12.5px; color: #DCE6FF; line-height: 1.5; }
.cpc-mock-ai-body .strong { color: var(--text); }
.cpc-mock-ai-foot {
  display: flex; align-items: center; gap: 10px; margin-top: 4px;
}
.cpc-mock-ai-btn {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
  background: var(--text); color: #0B0D11;
  padding: 5px 11px; border-radius: 4px;
  border: 0;
  cursor: pointer;
}
.cpc-mock-ai-btn.ghost { background: transparent; color: var(--text-muted); border: 1px solid var(--border-strong); }

/* Evidence binding */
.cpc-mock-evidence {
  margin-left: 40px;
  display: flex; gap: 8px; flex-wrap: wrap;
}
.cpc-mock-evidence-card {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 12px;
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border);
  border-radius: 6px;
}
.cpc-mock-evidence-card .icon {
  width: 28px; height: 32px; border-radius: 3px;
  background: linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02));
  border: 1px solid var(--border);
  display: grid; place-items: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; color: var(--text-faint);
  letter-spacing: 0;
}
.cpc-mock-evidence-card .info {
  display: flex; flex-direction: column; gap: 2px;
}
.cpc-mock-evidence-card .name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; color: var(--text); font-weight: 500; letter-spacing: 0;
}
.cpc-mock-evidence-card .stamp {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8.5px; letter-spacing: 0.14em; text-transform: uppercase;
  color: #6FCB9F;
  display: inline-flex; align-items: center; gap: 5px;
}
.cpc-mock-evidence-card .stamp::before { content: ""; width: 4px; height: 4px; border-radius: 50%; background: var(--green); }

/* Approve button */
.cpc-mock-approve {
  margin-left: 40px;
  display: flex; align-items: center; gap: 14px;
  padding: 12px 14px;
  background: var(--accent);
  border-radius: 6px;
  color: var(--text);
  cursor: pointer;
}
.cpc-mock-approve .ico {
  width: 22px; height: 22px; border-radius: 50%;
  background: rgba(255,255,255,0.18);
  display: grid; place-items: center;
}
.cpc-mock-approve .label { font-size: 13px; font-weight: 500; flex: 1; }
.cpc-mock-approve .stamp {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase;
  color: rgba(255,255,255,0.78);
}

/* Right rail closure checklist */
.cpc-mock-check {
  background: var(--bg-card-2);
  border-left: 1px solid var(--border);
  padding: 16px 18px;
}
.cpc-mock-check-head {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--text-faint);
  margin-bottom: 14px;
}
.cpc-mock-check-list { display: flex; flex-direction: column; gap: 10px; }
.cpc-mock-check-item {
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 10px; align-items: center;
}
.cpc-mock-check-box {
  width: 16px; height: 16px; border-radius: 4px;
  border: 1px solid var(--border-strong);
  display: grid; place-items: center;
  background: rgba(255,255,255,0.02);
}
.cpc-mock-check-item.done .cpc-mock-check-box {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--text);
}
.cpc-mock-check-item.active .cpc-mock-check-box {
  border-color: var(--accent);
  background: var(--accent-soft);
}
.cpc-mock-check-item.active .cpc-mock-check-box::before {
  content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--accent-2);
  box-shadow: 0 0 0 3px rgba(0,82,255,0.32);
}
.cpc-mock-check-label {
  font-size: 12px; color: var(--text-muted);
  display: flex; flex-direction: column; gap: 2px;
}
.cpc-mock-check-item.done .cpc-mock-check-label .name { color: var(--text); }
.cpc-mock-check-label .name { font-weight: 500; }
.cpc-mock-check-label .meta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--text-faint);
}

/* ================ S2: ANATOMY ================ */
.cpc-papersoft { background: #F2EFE8; color: var(--ink); }
.cpc-papersoft .cpc-eyebrow { background: var(--paper-card); }
.cpc-anatomy {
  margin-top: 56px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 14px;
}
@media (max-width: 980px) { .cpc-anatomy { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .cpc-anatomy { grid-template-columns: 1fr; } }
.cpc-beat {
  background: var(--paper-card);
  border: 1px solid var(--ink-line);
  border-radius: 10px;
  padding: 18px 16px 16px;
  display: flex; flex-direction: column; gap: 10px;
  position: relative;
}
.cpc-beat-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--ink-faint);
}
.cpc-beat-label { font-size: 16px; font-weight: 500; color: var(--ink); letter-spacing: -0.014em; }
.cpc-beat-caption { font-size: 13px; color: var(--ink-muted); line-height: 1.45; flex: 1; }
.cpc-beat-foot {
  border-top: 1px dashed var(--ink-line);
  padding-top: 10px;
  display: flex; flex-direction: column; gap: 3px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase;
}
.cpc-beat-foot .who { color: var(--ink); }
.cpc-beat-foot .reg { color: var(--ink-faint); }

/* ================ S3: WHAT IT REPLACES ================ */
.cpc-replaces-stats {
  margin-top: 32px;
  display: flex; gap: 24px;
  flex-wrap: wrap;
}
.cpc-replaces-stat {
  display: flex; flex-direction: column; gap: 4px;
}
.cpc-replaces-stat .num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 36px; font-weight: 500; letter-spacing: -0.024em;
  color: var(--ink);
}
.cpc-replaces-stat .lbl {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-faint);
}
.cpc-replaces-grid {
  margin-top: 48px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}
@media (max-width: 880px) { .cpc-replaces-grid { grid-template-columns: 1fr; } }
.cpc-replaces-pane {
  background: var(--paper-card);
  border: 1px solid var(--ink-line);
  border-radius: 12px;
  overflow: hidden;
  display: flex; flex-direction: column;
}
.cpc-replaces-chrome {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 14px;
  border-bottom: 1px solid var(--ink-line);
  background: rgba(11,13,17,0.022);
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.04em; color: var(--ink-faint);
}
.cpc-replaces-chrome .dots { display: inline-flex; gap: 4px; }
.cpc-replaces-chrome .dots i { width: 8px; height: 8px; border-radius: 50%; background: rgba(11,13,17,0.10); }
.cpc-replaces-chrome .app { color: var(--ink); font-weight: 500; }
.cpc-replaces-chrome .path { color: var(--ink-muted); }
.cpc-replaces-list {
  flex: 1;
  display: flex; flex-direction: column;
}
.cpc-replaces-row {
  padding: 10px 16px;
  border-bottom: 1px solid var(--ink-line);
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px; align-items: center;
}
.cpc-replaces-row:last-child { border-bottom: 0; }
.cpc-replaces-row .from {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px; color: var(--ink); font-weight: 500;
  letter-spacing: 0;
}
.cpc-replaces-row .subj { font-size: 11.5px; color: var(--ink-muted); margin-top: 2px; }
.cpc-replaces-row .right {
  display: flex; flex-direction: column; align-items: flex-end; gap: 2px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--ink-faint);
}
.cpc-replaces-row .right .count { color: var(--warm); }

/* ================ S4: GAP + COORDINATION TAX ================ */
.cpc-gap {
  margin-top: 56px;
  position: relative;
  padding: 56px 0;
}
.cpc-gap-canvas {
  display: grid;
  grid-template-columns: 1fr 280px 1fr;
  gap: 16px; align-items: stretch;
  min-height: 280px;
}
@media (max-width: 980px) { .cpc-gap-canvas { grid-template-columns: 1fr; } }
.cpc-gap-cluster {
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 22px 20px;
  display: flex; flex-direction: column; gap: 16px;
}
.cpc-gap-cluster-head {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--text-faint);
  display: flex; flex-direction: column; gap: 3px;
}
.cpc-gap-cluster-head .ttl { color: var(--text); font-size: 12px; }
.cpc-gap-cluster-items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.cpc-gap-pill {
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: rgba(255,255,255,0.02);
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--text-muted);
  text-align: center;
}
.cpc-gap-layer {
  background: linear-gradient(180deg, rgba(0,82,255,0.20), rgba(0,82,255,0.06));
  border: 1px solid rgba(0,82,255,0.42);
  border-radius: 12px;
  padding: 22px 20px;
  display: flex; flex-direction: column; gap: 12px;
  align-items: center; justify-content: center;
  text-align: center;
  position: relative;
}
.cpc-gap-layer-eb {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
  color: #B5CDFF;
}
.cpc-gap-layer-h { font-size: 22px; font-weight: 500; color: var(--text); letter-spacing: -0.022em; }
.cpc-gap-layer-sub { font-size: 12px; color: var(--text-muted); }
.cpc-gap-arrow-l, .cpc-gap-arrow-r {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 18px; height: 1px; background: rgba(0,82,255,0.42);
}
.cpc-gap-arrow-l { left: -18px; }
.cpc-gap-arrow-r { right: -18px; }
.cpc-gap-arrow-l::before, .cpc-gap-arrow-r::after {
  content: ""; position: absolute; top: 50%;
  width: 5px; height: 5px; border-right: 1px solid rgba(0,82,255,0.6); border-top: 1px solid rgba(0,82,255,0.6);
}
.cpc-gap-arrow-l::before { right: 0; transform: translateY(-50%) rotate(-135deg); }
.cpc-gap-arrow-r::after { right: 0; transform: translateY(-50%) rotate(45deg); }

.cpc-tax-name {
  margin-top: 88px;
  text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 14px;
}
.cpc-tax-name .eb {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--text-faint);
}
.cpc-tax-name .h {
  font-size: clamp(56px, 8vw, 96px);
  font-weight: 450; line-height: 1;
  letter-spacing: -0.04em;
  color: var(--text);
}
.cpc-tax-name .h .accent {
  background: linear-gradient(90deg, #4D85FF 0%, #0052FF 50%, #6699FF 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
.cpc-tax-name .def {
  margin-top: 18px;
  font-size: 18px; color: var(--text-muted);
  max-width: 56ch; line-height: 1.5;
}
.cpc-tax-name .stat {
  margin-top: 28px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--text-faint);
  display: inline-flex; align-items: center; gap: 12px;
  padding: 8px 14px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: rgba(255,255,255,0.03);
}
.cpc-tax-name .stat .num { color: var(--text); font-weight: 500; }

/* ================ S5: DOMAINS ================ */
.cpc-domains {
  margin-top: 56px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}
@media (max-width: 1080px) { .cpc-domains { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 720px)  { .cpc-domains { grid-template-columns: repeat(2, 1fr); } }
.cpc-domain {
  background: var(--paper-card);
  border: 1px solid var(--ink-line);
  border-radius: 10px;
  padding: 16px 14px;
  display: flex; flex-direction: column; gap: 8px;
  transition: border-color .15s ease, box-shadow .15s ease;
}
.cpc-domain:hover { border-color: var(--ink-line-strong); box-shadow: 0 4px 12px rgba(11,13,17,0.04); }
.cpc-domain.advocacy { border-left: 3px solid var(--accent); }
.cpc-domain.evidence { border-left: 3px solid var(--accent-2); }
.cpc-domain.hypothesis { border-left: 3px solid var(--ink-line-strong); }
.cpc-domain-label { font-size: 14px; font-weight: 500; color: var(--ink); letter-spacing: -0.012em; }
.cpc-domain-meta {
  display: flex; flex-direction: column; gap: 3px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase;
}
.cpc-domain-meta .persona { color: var(--ink-muted); }
.cpc-domain-meta .trigger { color: var(--ink-faint); }
.cpc-domain-foot {
  border-top: 1px dashed var(--ink-line);
  padding-top: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 8.5px; letter-spacing: 0.16em; text-transform: uppercase;
}
.cpc-domain.advocacy   .cpc-domain-foot { color: var(--accent); }
.cpc-domain.evidence   .cpc-domain-foot { color: var(--accent-2); }
.cpc-domain.hypothesis .cpc-domain-foot { color: var(--ink-faint); }

/* ================ S6: ROI DASHBOARD ================ */
.cpc-roi {
  margin-top: 48px;
  background: var(--paper-card);
  border: 1px solid var(--ink-line);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(11,13,17,0.04);
}
.cpc-roi-bar {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--ink-line);
  background: rgba(11,13,17,0.022);
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; color: var(--ink-faint);
}
.cpc-roi-bar .dots { display: inline-flex; gap: 4px; }
.cpc-roi-bar .dots i { width: 8px; height: 8px; border-radius: 50%; background: rgba(11,13,17,0.10); }
.cpc-roi-bar .crumb { color: var(--ink-muted); }
.cpc-roi-bar .crumb .strong { color: var(--ink); }
.cpc-roi-bar .spacer { flex: 1; }
.cpc-roi-bar .seg-group {
  display: inline-flex; gap: 0;
  border: 1px solid var(--ink-line);
  border-radius: 4px; overflow: hidden;
}
.cpc-roi-bar .seg-group span {
  padding: 4px 9px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.08em;
  color: var(--ink-faint);
  border-right: 1px solid var(--ink-line);
}
.cpc-roi-bar .seg-group span:last-child { border-right: 0; }
.cpc-roi-bar .seg-group span.active { background: var(--ink); color: var(--paper); }

.cpc-roi-kpis {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-bottom: 1px solid var(--ink-line);
}
.cpc-roi-kpi {
  padding: 18px 22px;
  border-right: 1px solid var(--ink-line);
  display: flex; flex-direction: column; gap: 4px;
}
.cpc-roi-kpi:last-child { border-right: 0; }
.cpc-roi-kpi .lbl {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--ink-faint);
}
.cpc-roi-kpi .val {
  font-size: 30px; font-weight: 500; letter-spacing: -0.028em;
  color: var(--ink);
}
.cpc-roi-kpi .delta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.06em;
  display: inline-flex; align-items: center; gap: 4px;
}
.cpc-roi-kpi .delta.up { color: var(--green); }
.cpc-roi-kpi .delta.down { color: var(--green); }

.cpc-roi-charts {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  border-bottom: 1px solid var(--ink-line);
}
@media (max-width: 880px) { .cpc-roi-charts { grid-template-columns: 1fr; } }
.cpc-roi-chart {
  padding: 18px 22px;
  border-right: 1px solid var(--ink-line);
}
.cpc-roi-chart:last-child { border-right: 0; }
@media (max-width: 880px) { .cpc-roi-chart { border-right: 0; border-bottom: 1px solid var(--ink-line); } .cpc-roi-chart:last-child { border-bottom: 0; } }
.cpc-roi-chart .ttl {
  font-size: 12.5px; font-weight: 500;
  color: var(--ink); margin-bottom: 4px;
}
.cpc-roi-chart .legend {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.10em; text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 14px;
  display: flex; gap: 16px;
}
.cpc-roi-chart .legend .key {
  display: inline-flex; align-items: center; gap: 6px;
}
.cpc-roi-chart .legend .key .swatch { width: 10px; height: 10px; border-radius: 2px; }
.cpc-roi-chart svg { display: block; width: 100%; height: 130px; }
.cpc-roi-chart .bars { display: flex; flex-direction: column; gap: 9px; margin-top: 4px; }
.cpc-roi-chart .barrow {
  display: grid;
  grid-template-columns: 110px 1fr 50px;
  gap: 10px; align-items: center;
  font-size: 11.5px;
}
.cpc-roi-chart .barrow .lab { color: var(--ink-muted); }
.cpc-roi-chart .barrow .pct {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; color: var(--ink); text-align: right;
}
.cpc-roi-chart .barrow .bar {
  height: 8px; border-radius: 2px;
  background: rgba(11,13,17,0.06);
  position: relative;
}
.cpc-roi-chart .barrow .fill {
  position: absolute; inset: 0 auto 0 0;
  background: var(--accent);
  border-radius: 2px;
}
.cpc-roi-foot {
  padding: 10px 22px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ink-faint);
  background: rgba(11,13,17,0.022);
}

/* ================ S7: CTA + FOOTER ================ */
.cpc-cta {
  background: var(--bg);
  color: var(--text);
  border-top: 1px solid var(--border);
}
.cpc-cta-inner {
  max-width: 880px; margin: 0 auto;
  padding: 120px 28px 80px;
  text-align: center;
}
.cpc-cta-h {
  font-size: clamp(34px, 4.6vw, 52px);
  font-weight: 500; letter-spacing: -0.034em;
  line-height: 1.06; color: var(--text);
}
.cpc-cta-sub {
  margin-top: 22px;
  font-size: 17px; color: var(--text-muted);
  line-height: 1.5;
  max-width: 56ch;
  margin-left: auto; margin-right: auto;
}
.cpc-cta-buttons {
  margin-top: 36px;
  display: inline-flex; gap: 12px; flex-wrap: wrap; justify-content: center;
}
.cpc-cta .cpc-btn-primary { background: var(--text); color: #0B0D11; border-color: var(--text); }
.cpc-cta .cpc-btn-ghost { color: var(--text); border-color: var(--border-strong); }
.cpc-cta .cpc-btn-ghost:hover { background: rgba(255,255,255,0.04); }

.cpc-quote {
  margin: 56px auto 0;
  max-width: 640px;
  padding: 22px 24px;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  border-radius: 12px;
  display: flex; flex-direction: column; gap: 12px;
}
.cpc-quote-text { font-size: 15px; color: var(--text); line-height: 1.55; font-style: italic; }
.cpc-quote-attr {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--text-faint);
}

.cpc-footer {
  background: var(--bg);
  border-top: 1px solid var(--border);
}
.cpc-footer-inner {
  max-width: 1240px; margin: 0 auto;
  padding: 40px 28px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  font-size: 12.5px; color: var(--text-muted);
  line-height: 1.55;
}
@media (max-width: 760px) { .cpc-footer-inner { grid-template-columns: 1fr; } }
.cpc-footer .descriptor {
  font-size: 13px; color: var(--text);
  max-width: 56ch;
}
.cpc-footer .partner {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--text-faint);
  margin-top: 8px;
}
.cpc-footer .copy {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--text-faint);
  text-align: right;
}
@media (max-width: 760px) { .cpc-footer .copy { text-align: left; } }
`;

export default function HomeConceptC() {
  const [activePersona, setActivePersona] = useState(0);

  // Set page title
  useEffect(() => {
    document.title = "Concept C · Demonstration-led";
  }, []);

  // Toggle nav theme on scroll past hero band
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>(".cpc-nav");
    const band = document.querySelector<HTMLElement>(".cpc-hero-band");
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

  return (
    <div className="cpc-root">
      <style>{STYLES}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* NAV */}
      <nav className="cpc-nav">
        <div className="cpc-nav-inner">
          <Link to="/concept-c" className="cpc-nav-logo" aria-label="Unifize">
            <img src="/Link%20-%20home.svg" alt="Unifize" className="cpc-nav-logo-img" />
            <div className="cpc-nav-tagline">People. Process. AI. Outcomes.</div>
          </Link>
          <div className="cpc-nav-items">
            <a href="#anatomy">Anatomy</a>
            <a href="#replaces">Replaces</a>
            <a href="#tax">Coordination tax</a>
            <a href="#domains">Domains</a>
            <a href="#outcomes">Outcomes</a>
          </div>
          <div className="cpc-nav-actions">
            <Link to="/concept-d" className="cpc-nav-link">→ Concept D</Link>
            <button className="cpc-nav-btn">Book a demo</button>
          </div>
        </div>
      </nav>

      {/* SECTION 1: HERO with full product mock */}
      <div className="cpc-hero-band">
        <section className="cpc-hero">
          <div>
            <div className="cpc-hero-tag">
              <span className="dot" />
              <span>Live thread · NCR-219</span>
            </div>
            <h1 className="cpc-hero-h1">
              Watch one record{" "}
              <span className="accent">close.</span>
            </h1>
            <p className="cpc-hero-sub">
              The same thread, read five different ways. Five personas. Fifteen domains.
              No words. Just watch the alternative work.
            </p>

            <div className="cpc-personas">
              {PERSONAS.map((p, i) => (
                <button
                  key={p.key}
                  className={`cpc-persona-tag ${activePersona === i ? "is-active" : ""}`}
                  onClick={() => setActivePersona(i)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="cpc-persona-lens">
              {PERSONAS[activePersona].lens}
            </div>

            <div className="cpc-hero-cta">
              <button className="cpc-btn-primary">
                Book a demo
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="cpc-btn-ghost">Replay the demo</button>
            </div>
          </div>

          {/* Product mock */}
          <div className="cpc-mock" aria-hidden>
            <div className="cpc-mock-bar">
              <div className="dots"><i /><i /><i /></div>
              <div className="crumb">app.unifize.com / <span className="strong">Quality</span> / NCR-219</div>
              <div className="spacer" />
              <span className="kbd">⌘K</span>
            </div>

            <div className="cpc-mock-body">
              {/* Left rail - product nav */}
              <div className="cpc-mock-rail">
                <div className="cpc-mock-rail-icon is-active">Q</div>
                <div className="cpc-mock-rail-icon">D</div>
                <div className="cpc-mock-rail-icon">P</div>
                <div className="cpc-mock-rail-icon">M</div>
                <div className="cpc-mock-rail-divider" />
                <div className="cpc-mock-rail-icon">★</div>
                <div className="cpc-mock-rail-icon">⌖</div>
              </div>

              {/* Inbox / conversations list */}
              <div className="cpc-mock-inbox">
                <div className="cpc-mock-inbox-head">
                  <div className="ttl">Quality threads</div>
                  <div className="meta"><span className="dot" /><span>Inbox · 5 open</span></div>
                </div>
                <div className="cpc-mock-inbox-list">
                  {CONVOS.map((c, i) => (
                    <div key={c.id} className={`cpc-mock-convo ${i === 0 ? "is-active" : ""}`}>
                      <div className="id">
                        <span>{c.id}</span>
                        <span className={`state ${c.state}`}>{c.state}</span>
                      </div>
                      <div className="lbl">{c.label}</div>
                      <div className="meta">{c.meta}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Thread main */}
              <div className="cpc-mock-thread">
                <div className="cpc-mock-thread-head">
                  <div className="row1">
                    <span>NCR-219</span>
                    <span className="badge">Open</span>
                    <span className="sev">Sev 2</span>
                  </div>
                  <div className="row2">Opened 2 days ago · QA Ops · Lot 2403-A · Source: incoming inspection</div>
                </div>

                <div className="cpc-mock-thread-body">
                  <div className="cpc-mock-msg">
                    <div className="cpc-mock-msg-avatar">SK</div>
                    <div className="cpc-mock-msg-content">
                      <div className="cpc-mock-msg-meta">
                        <span className="who">Sarah K.</span>
                        <span className="role">QA Ops</span>
                        <span className="time">2d ago</span>
                      </div>
                      <div className="cpc-mock-msg-text">
                        Out-of-spec batch flagged in incoming inspection. Solvent purity reading 96.2 against spec floor 98. Blocking release until investigation closes.
                      </div>
                    </div>
                  </div>

                  <div className="cpc-mock-msg">
                    <div className="cpc-mock-msg-avatar alt">DS</div>
                    <div className="cpc-mock-msg-content">
                      <div className="cpc-mock-msg-meta">
                        <span className="who">Daniel S.</span>
                        <span className="role">VP Quality</span>
                        <span className="time">1d ago</span>
                      </div>
                      <div className="cpc-mock-msg-text">
                        Taking ownership. Pulling supplier into the thread. Looking for GC trace and CoA before we route to MRB.
                      </div>
                    </div>
                  </div>

                  <div className="cpc-mock-ai">
                    <div className="cpc-mock-ai-head">
                      <span className="pulse" />
                      <span>AI Assist · suggested next step</span>
                    </div>
                    <div className="cpc-mock-ai-body">
                      Bind <span className="strong">GC trace from B2 lot</span>. 4 of 5 historical CAPAs in this product line referenced GC trace as primary evidence. Routing to QA Manager for approval will require it.
                    </div>
                    <div className="cpc-mock-ai-foot">
                      <button className="cpc-mock-ai-btn">Apply</button>
                      <button className="cpc-mock-ai-btn ghost">Dismiss</button>
                    </div>
                  </div>

                  <div className="cpc-mock-evidence">
                    <div className="cpc-mock-evidence-card">
                      <div className="icon">PDF</div>
                      <div className="info">
                        <span className="name">CoA-2403-A.pdf</span>
                        <span className="stamp">Bound · 1d ago</span>
                      </div>
                    </div>
                    <div className="cpc-mock-evidence-card">
                      <div className="icon">CSV</div>
                      <div className="info">
                        <span className="name">GC-trace-B2.csv</span>
                        <span className="stamp">Bound · 4h ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="cpc-mock-msg">
                    <div className="cpc-mock-msg-avatar alt2">PT</div>
                    <div className="cpc-mock-msg-content">
                      <div className="cpc-mock-msg-meta">
                        <span className="who">Priya T.</span>
                        <span className="role">SQE</span>
                        <span className="time">3h ago</span>
                      </div>
                      <div className="cpc-mock-msg-text">
                        Evidence in. Routing to QA Manager for approval.
                      </div>
                    </div>
                  </div>

                  <div className="cpc-mock-approve">
                    <div className="ico">
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="label">Approve and stamp</div>
                    <div className="stamp">Daniel S. · 21 CFR 11 · 2h ago</div>
                  </div>
                </div>
              </div>

              {/* Right rail closure checklist */}
              <div className="cpc-mock-check">
                <div className="cpc-mock-check-head">Closure</div>
                <div className="cpc-mock-check-list">
                  {THREAD_BEATS.map((b, i) => {
                    const cls = i < 4 ? "done" : i === 4 ? "active" : "";
                    return (
                      <div key={b.k} className={`cpc-mock-check-item ${cls}`}>
                        <div className="cpc-mock-check-box">
                          {i < 4 && (
                            <svg width="9" height="9" viewBox="0 0 16 16" fill="none">
                              <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <div className="cpc-mock-check-label">
                          <span className="name">{b.label}</span>
                          <span className="meta">{b.who}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SECTION 2: Anatomy of what just happened */}
      <section className="cpc-section cpc-papersoft" id="anatomy">
        <div className="cpc-eyebrow">
          <span className="dot" />
          <span className="num">02</span>
          <span className="sep">/</span>
          <span className="name">What just happened</span>
        </div>
        <h2 className="cpc-h2">
          Seven moves. <span className="dim">Each captured. Each governed. Each on the audit trail.</span>
        </h2>
        <p className="cpc-sub">
          The thread above ran through these beats while you watched. Each beat names a role, captures a rationale, binds the evidence, and stamps the regulation in place. None of it lives in email.
        </p>

        <div className="cpc-anatomy">
          {THREAD_BEATS.map((b) => (
            <div key={b.k} className="cpc-beat">
              <div className="cpc-beat-num">{b.k}</div>
              <div className="cpc-beat-label">{b.label}</div>
              <div className="cpc-beat-caption">{b.caption}</div>
              <div className="cpc-beat-foot">
                <span className="who">{b.who}</span>
                <span className="reg">{b.reg}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: What it replaces */}
      <section className="cpc-section" id="replaces">
        <div className="cpc-eyebrow">
          <span className="dot" />
          <span className="num">03</span>
          <span className="sep">/</span>
          <span className="name">What it replaces</span>
        </div>
        <h2 className="cpc-h2">
          The same record. <span className="dim">Lived across four tools.</span>
        </h2>
        <p className="cpc-sub">
          Before Unifize, NCR-219 lived as fragments. An Outlook chain. A SharePoint folder of working files. A Teams thread no record knew about. An Excel tracker with a broken reference. Same regulation. Same people. No audit trail.
        </p>

        <div className="cpc-replaces-stats">
          <div className="cpc-replaces-stat">
            <span className="num">92</span>
            <span className="lbl">Days, calendar</span>
          </div>
          <div className="cpc-replaces-stat">
            <span className="num">3</span>
            <span className="lbl">Reopens</span>
          </div>
          <div className="cpc-replaces-stat">
            <span className="num">14</span>
            <span className="lbl">People copied</span>
          </div>
          <div className="cpc-replaces-stat">
            <span className="num">4</span>
            <span className="lbl">Tools to reconstruct</span>
          </div>
        </div>

        <div className="cpc-replaces-grid">
          {REPLACES_TOOLS.map((tool) => (
            <div key={tool.chrome} className="cpc-replaces-pane">
              <div className="cpc-replaces-chrome">
                <div className="dots"><i /><i /><i /></div>
                <span className="app">{tool.chrome}</span>
                <span className="path">· {tool.title}</span>
              </div>
              <div className="cpc-replaces-list">
                {tool.items.map((it, i) => (
                  <div key={i} className="cpc-replaces-row">
                    <div>
                      <div className="from">{it.from}</div>
                      <div className="subj">{it.subj}</div>
                    </div>
                    <div className="right">
                      <span>{it.time}</span>
                      {it.count && <span className="count">{it.count}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: Gap + Coordination tax (combined) */}
      <section className="cpc-section cpc-dark" id="tax">
        <div className="cpc-eyebrow">
          <span className="dot" />
          <span className="num">04</span>
          <span className="sep">/</span>
          <span className="name">The structural reason</span>
        </div>
        <h2 className="cpc-h2">
          Records live in systems. <span className="dim">Coordination lives between them.</span>
        </h2>
        <p className="cpc-sub" style={{ color: "var(--text-muted)" }}>
          Your systems of record (ERP, QMS, PLM, MES) capture what is officially true. Your systems of coordination (SharePoint, Teams, Outlook, Excel) carry the cross-functional work that produces those records. The space between them is where decisions go uncaptured. We are the layer that closes it.
        </p>

        <div className="cpc-gap">
          <div className="cpc-gap-canvas">
            <div className="cpc-gap-cluster">
              <div className="cpc-gap-cluster-head">
                <span>Left</span>
                <span className="ttl">Systems of record</span>
              </div>
              <div className="cpc-gap-cluster-items">
                <div className="cpc-gap-pill">ERP</div>
                <div className="cpc-gap-pill">QMS</div>
                <div className="cpc-gap-pill">PLM</div>
                <div className="cpc-gap-pill">MES</div>
              </div>
            </div>

            <div className="cpc-gap-layer">
              <div className="cpc-gap-arrow-l" />
              <div className="cpc-gap-layer-eb">The layer</div>
              <div className="cpc-gap-layer-h">Unifize</div>
              <div className="cpc-gap-layer-sub">Decisions, evidence, approvals, completion. Captured in place.</div>
              <div className="cpc-gap-arrow-r" />
            </div>

            <div className="cpc-gap-cluster">
              <div className="cpc-gap-cluster-head">
                <span>Right</span>
                <span className="ttl">Systems of coordination</span>
              </div>
              <div className="cpc-gap-cluster-items">
                <div className="cpc-gap-pill">SharePoint</div>
                <div className="cpc-gap-pill">Teams</div>
                <div className="cpc-gap-pill">Outlook</div>
                <div className="cpc-gap-pill">Excel</div>
              </div>
            </div>
          </div>
        </div>

        <div className="cpc-tax-name">
          <div className="eb">The name</div>
          <div className="h">
            <span className="accent">Coordination tax.</span>
          </div>
          <div className="def">
            Visible, measurable, reducible. The structural cost of holding cross-functional work together when no layer owns it. For regulated processes.
          </div>
          <div className="stat">
            <span className="num">15 to 30 percent</span>
            <span>of white-collar operational cost in regulated processes</span>
          </div>
        </div>
      </section>

      {/* SECTION 5: Where it shows up. Domains. */}
      <section className="cpc-section" id="domains">
        <div className="cpc-eyebrow">
          <span className="dot" />
          <span className="num">05</span>
          <span className="sep">/</span>
          <span className="name">Where it shows up</span>
        </div>
        <h2 className="cpc-h2">
          Fifteen domains. <span className="dim">Each a door. Each a thread you can run on this layer.</span>
        </h2>
        <p className="cpc-sub">
          Same shape across every domain. Same trigger pattern. Same approval flow. Different names, different personas, different regulations. The thread you watched in section 1 is the unit of work in all fifteen.
        </p>

        <div className="cpc-domains">
          {DOMAINS.map((d) => (
            <div key={d.label} className={`cpc-domain ${d.weight}`}>
              <div className="cpc-domain-label">{d.label}</div>
              <div className="cpc-domain-meta">
                <span className="persona">{d.persona}</span>
                <span className="trigger">{d.trigger}</span>
              </div>
              <div className="cpc-domain-foot">{d.weight}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: ROI dashboard */}
      <section className="cpc-section cpc-papersoft" id="outcomes">
        <div className="cpc-eyebrow">
          <span className="dot" />
          <span className="num">06</span>
          <span className="sep">/</span>
          <span className="name">What changes</span>
        </div>
        <h2 className="cpc-h2">
          Coordination tax, <span className="dim">made measurable.</span>
        </h2>
        <p className="cpc-sub">
          The same thread anatomy that makes one record close cleanly also makes the program legible. The dashboard below is what coordination tax looks like across deployments. Directional today. Validated as Proof Maturity advances.
        </p>

        <div className="cpc-roi">
          <div className="cpc-roi-bar">
            <div className="dots"><i /><i /><i /></div>
            <div className="crumb">app.unifize.com / <span className="strong">Quality</span> / Dashboard</div>
            <div className="spacer" />
            <div className="seg-group">
              <span>7d</span>
              <span>30d</span>
              <span className="active">90d</span>
              <span>YTD</span>
            </div>
          </div>

          <div className="cpc-roi-kpis">
            <div className="cpc-roi-kpi">
              <div className="lbl">Cycle time</div>
              <div className="val">−65%</div>
              <div className="delta up">↓ on threaded investigations</div>
            </div>
            <div className="cpc-roi-kpi">
              <div className="lbl">Rework</div>
              <div className="val">−80%</div>
              <div className="delta up">↓ post-closure reopens</div>
            </div>
            <div className="cpc-roi-kpi">
              <div className="lbl">Audit-ready</div>
              <div className="val">99.7%</div>
              <div className="delta up">↑ records at any moment</div>
            </div>
            <div className="cpc-roi-kpi">
              <div className="lbl">Handoff speed</div>
              <div className="val">4.0×</div>
              <div className="delta up">↑ cross-functional pickup</div>
            </div>
          </div>

          <div className="cpc-roi-charts">
            <div className="cpc-roi-chart">
              <div className="ttl">NCs opened vs closed</div>
              <div className="legend">
                <span className="key"><span className="swatch" style={{ background: "rgba(11,13,17,0.20)" }} /> Opened</span>
                <span className="key"><span className="swatch" style={{ background: "var(--accent)" }} /> Closed</span>
              </div>
              <svg viewBox="0 0 460 130" preserveAspectRatio="none" aria-hidden>
                <defs>
                  <pattern id="cpc-grid" width="46" height="32" patternUnits="userSpaceOnUse">
                    <path d="M46 0H0V32" stroke="rgba(11,13,17,0.05)" strokeWidth="1" fill="none" />
                  </pattern>
                </defs>
                <rect width="460" height="130" fill="url(#cpc-grid)" />
                <polyline
                  points="0,40 46,52 92,46 138,58 184,55 230,68 276,62 322,72 368,66 414,82 460,78"
                  fill="none" stroke="rgba(11,13,17,0.30)" strokeWidth="1.6" strokeDasharray="4 4"
                />
                <polyline
                  points="0,90 46,84 92,72 138,66 184,52 230,44 276,36 322,30 368,22 414,18 460,12"
                  fill="none" stroke="#0052FF" strokeWidth="2"
                />
                {[0, 46, 92, 138, 184, 230, 276, 322, 368, 414, 460].map((x, i) => (
                  <circle key={i} cx={x} cy={[90,84,72,66,52,44,36,30,22,18,12][i]} r="2.6" fill="#0052FF" />
                ))}
              </svg>
            </div>

            <div className="cpc-roi-chart">
              <div className="ttl">Top causes · root cause</div>
              <div className="legend">
                <span className="key">Q2 2026</span>
              </div>
              <div className="bars">
                <div className="barrow"><span className="lab">Material variance</span><div className="bar"><div className="fill" style={{ width: "78%" }} /></div><span className="pct">38%</span></div>
                <div className="barrow"><span className="lab">Operator instruction</span><div className="bar"><div className="fill" style={{ width: "52%", background: "rgba(0,82,255,0.62)" }} /></div><span className="pct">24%</span></div>
                <div className="barrow"><span className="lab">Calibration drift</span><div className="bar"><div className="fill" style={{ width: "38%", background: "rgba(0,82,255,0.46)" }} /></div><span className="pct">18%</span></div>
                <div className="barrow"><span className="lab">Supplier mis-spec</span><div className="bar"><div className="fill" style={{ width: "30%", background: "rgba(0,82,255,0.34)" }} /></div><span className="pct">14%</span></div>
                <div className="barrow"><span className="lab">Environmental</span><div className="bar"><div className="fill" style={{ width: "12%", background: "rgba(0,82,255,0.22)" }} /></div><span className="pct">6%</span></div>
              </div>
            </div>
          </div>

          <div className="cpc-roi-foot">Directional · across deployments · figures TBD</div>
        </div>
      </section>

      {/* SECTION 7: CTA */}
      <section className="cpc-cta">
        <div className="cpc-cta-inner">
          <div className="cpc-eyebrow" style={{ marginInline: "auto", marginBottom: 28 }}>
            <span className="dot" />
            <span className="num">07</span>
            <span className="sep">/</span>
            <span className="name">Walk through your process</span>
          </div>
          <h2 className="cpc-cta-h">
            Forty-five minutes. Your process. Your numbers.
          </h2>
          <p className="cpc-cta-sub">
            We pick one of your real workflows and rebuild it as a single governed thread on screen. You watch it close. We name the coordination tax. You decide what to do with what you see.
          </p>
          <div className="cpc-cta-buttons">
            <button className="cpc-btn-primary">
              Book a demo
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="cpc-btn-ghost">Calculate your coordination tax</button>
          </div>

          <div className="cpc-quote">
            <div className="cpc-quote-text">
              The chaos of cross-functional work was always invisible until we could see it laid out as a single thread. Then the cost was obvious.
            </div>
            <div className="cpc-quote-attr">VP Quality · ISO 13485 manufacturer</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="cpc-footer">
        <div className="cpc-footer-inner">
          <div>
            <div className="descriptor">Coordination tax, visible, measurable, reducible. For regulated processes.</div>
            <div className="partner">Partnered with Microsoft</div>
          </div>
          <div className="copy">© 2026 Unifize</div>
        </div>
      </footer>
    </div>
  );
}
