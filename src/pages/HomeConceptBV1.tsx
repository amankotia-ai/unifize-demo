import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/**
 * Concept B v1 . Product-led hierarchy proposal.
 *
 * Brief: 2026-04-27. Owner: Abhishek. For Ben and Lakshman.
 *
 * Three takeaways, in scroll order:
 *  1. Above the fold. "This is the thing. One thread. Trigger to closed
 *     outcome. It is real."
 *  2. Second. "What it replaces is the four-tool reconstruction my team
 *     does today."
 *  3. Third. "Here is the framework that explains why it works. Here is
 *     the number it moves."
 *
 * Section sequence (10 sections, all 100vh):
 *   01 Hero (dark) . live working thread + persona ribbon
 *   02 Thread dissected (papersoft) . trigger to closed in 7 steps
 *   03 What it replaces (light) . 4-tool reconstruction + 92d aggregate
 *   04 Why this works (papersoft) . one paragraph + one diagram
 *   05 Name the cost (dark) . coordination tax, shorter beat
 *   06 Where it shows up (light) . 15 domains
 *   07 The layer (papersoft) . four-band stack, architectural detail
 *   08 AI implication (dark) . three levels
 *   09 Proof (light) . advocacy testimonial
 *   10 CTA (dark) . demo + calculator
 *
 * Locked rules: tagline in nav, descriptor in footer, Unifize blue
 * #0052FF, no purple, no em dashes anywhere.
 */

const PERSONA_HOOKS = [
  { role: "VP Quality", line: "An investigation that closes in 21 days. With evidence." },
  { role: "Operations", line: "Hold released the same shift. Reason in the thread." },
  { role: "Regulatory", line: "Submission assembly as a byproduct, not a quarterly project." },
  { role: "CFO", line: "12 to 20 percent of payroll, recovered lane by lane." },
  { role: "CIO", line: "AI that compounds because the data is structured." },
];

const DISSECTED_STEPS = [
  {
    key: "01",
    name: "Trigger",
    headline: "The work begins where the work begins.",
    body: "A production hold gets logged at 10:32. Lot, reason, and CFR clause captured at the source. The thread exists from the first second.",
    accent: "Logged from the floor",
  },
  {
    key: "02",
    name: "Owner",
    headline: "Routing is structural, not heroic.",
    body: "QA Ops is assigned by role, not by a person remembering. Acknowledged in 14 minutes. The owner is visible to everyone on the thread.",
    accent: "Role-based assignment",
  },
  {
    key: "03",
    name: "Decision",
    headline: "Five whys, captured inline.",
    body: "The investigation is structured fields, not a buried reply. Root cause options narrow as the conversation proceeds. The decision is the artifact.",
    accent: "Structured, not narrative",
  },
  {
    key: "04",
    name: "Evidence bound",
    headline: "Attachments are bound to the step they answer.",
    body: "GC trace, supplier letter, capability study. Six files. Each one bound to step 03 with a timestamp. The evidence is part of the record, not next to it.",
    accent: "Bound to step 03",
  },
  {
    key: "05",
    name: "Approval",
    headline: "Approval lands inside the thread.",
    body: "QA Manager approves. The 21 CFR Part 11 stamp is captured at the point of decision. A linked SCAR routes automatically. No printed page. No re-keying.",
    accent: "21 CFR Part 11 inline",
  },
  {
    key: "06",
    name: "Handoff",
    headline: "Handoffs come with their own clock.",
    body: "Effectiveness verification gets scheduled at the moment of approval. Manufacturing Lead is the next owner. The 30-day window starts immediately.",
    accent: "Owner. Window. Clock.",
  },
  {
    key: "07",
    name: "Closed",
    headline: "Closure writes back.",
    body: "REC-2412 closes on day 21. Outcomes write back to the QMS, the audit log, and the dashboards that the CFO already reads. Audit assembly is one click.",
    accent: "Outcomes write back",
  },
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
html:has(.cnb1-root) { scroll-behavior: smooth; }
.cnb1-root [id] { scroll-margin-top: 76px; }
.cnb1-root {
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
.cnb1-root * { box-sizing: border-box; }
.cnb1-root .mono { font-family: var(--u-mono); }
.cnb1-root a { color: inherit; text-decoration: none; }

/* ---------- NAV ---------- */
.cnb1-nav {
  position: sticky; top: 0; z-index: 50;
  backdrop-filter: saturate(160%) blur(18px);
  background: rgba(8,9,10,0.72);
  border-bottom: 1px solid var(--border);
}
.cnb1-nav-inner {
  max-width: 1280px; margin: 0 auto;
  padding: 14px 28px;
  display: flex; align-items: center; gap: 36px;
}
.cnb1-nav-logo { display: inline-flex; flex-direction: column; gap: 2px; }
.cnb1-nav-logo .word {
  font-size: 17px; font-weight: 600;
  letter-spacing: -0.025em; line-height: 1;
}
.cnb1-nav-logo .word b { color: var(--u-primary); font-weight: 700; }
.cnb1-nav-logo .tag {
  font-family: var(--u-mono);
  font-size: 9.5px; letter-spacing: 0.08em;
  color: var(--text-faint);
  text-transform: uppercase;
}
.cnb1-nav-items {
  display: flex; gap: 24px;
  font-size: 13.5px; color: var(--text-muted);
  margin-left: 16px;
}
.cnb1-nav-items a:hover { color: var(--text); }
.cnb1-nav-actions { margin-left: auto; display: flex; gap: 16px; align-items: center; }
.cnb1-nav-link { font-size: 13.5px; color: var(--text-muted); }
.cnb1-nav-link:hover { color: var(--text); }
.cnb1-btn-primary {
  font-family: inherit; font-size: 13px; font-weight: 500;
  background: white; color: var(--ink);
  padding: 8px 16px; border-radius: 999px;
  border: 1px solid white; cursor: pointer;
  display: inline-flex; align-items: center; gap: 7px;
  transition: background .15s;
}
.cnb1-btn-primary:hover { background: #EBECEE; }
.cnb1-btn-blue { background: var(--u-primary); color: white; border-color: var(--u-primary); }
.cnb1-btn-blue:hover { background: var(--u-primary-hover); border-color: var(--u-primary-hover); }
.cnb1-btn-ghost {
  font-family: inherit; font-size: 13px; font-weight: 500;
  background: transparent; color: var(--text);
  padding: 8px 16px; border-radius: 999px;
  border: 1px solid var(--border-strong);
  cursor: pointer;
  display: inline-flex; align-items: center; gap: 7px;
  transition: background .15s, border-color .15s;
}
.cnb1-btn-ghost:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.28); }
.cnb1-light .cnb1-btn-ghost, .cnb1-papersoft .cnb1-btn-ghost { color: var(--ink); border-color: var(--ink-line-strong); }
.cnb1-light .cnb1-btn-ghost:hover, .cnb1-papersoft .cnb1-btn-ghost:hover { background: rgba(11,13,17,0.04); }
.cnb1-light .cnb1-btn-primary, .cnb1-papersoft .cnb1-btn-primary { background: var(--ink); color: white; border-color: var(--ink); }
@media (max-width: 980px) { .cnb1-nav-items { display: none; } }

/* ---------- SECTION ---------- */
.cnb1-section {
  min-height: 100vh;
  display: flex; flex-direction: column;
  position: relative;
}
.cnb1-section.dark { background: var(--bg); color: var(--text); }
.cnb1-section.light { background: var(--paper); color: var(--ink); }
.cnb1-section.papersoft { background: var(--paper-soft); color: var(--ink); }
.cnb1-inner {
  flex: 1;
  max-width: 1280px; width: 100%;
  margin: 0 auto;
  padding: 100px 28px;
  display: flex; flex-direction: column; gap: 48px;
  justify-content: center;
}
.cnb1-section.light, .cnb1-section.papersoft,
.cnb1-light, .cnb1-papersoft {
  --text: var(--ink);
  --text-muted: var(--ink-muted);
  --text-faint: var(--ink-faint);
  --border: var(--ink-line);
  --border-strong: var(--ink-line-strong);
  --bg-card: var(--paper-card);
}

.cnb1-eyebrow {
  font-family: var(--u-mono);
  font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--text-faint);
  display: flex; align-items: center; gap: 12px;
}
.cnb1-eyebrow .num {
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 2px 7px;
}
.cnb1-eyebrow .line { width: 80px; height: 1px; background: var(--border); }

.cnb1-h1 {
  font-size: clamp(40px, 6.4vw, 84px);
  font-weight: 500;
  line-height: 0.96;
  letter-spacing: -0.044em;
  margin: 0;
  max-width: 22ch;
}
.cnb1-h1 .accent { color: var(--u-primary); font-weight: 500; }
.cnb1-h2 {
  font-size: clamp(32px, 4.6vw, 56px);
  line-height: 1.04; letter-spacing: -0.034em;
  font-weight: 500; margin: 0;
  max-width: 22ch;
}
.cnb1-h2 .dim { color: var(--text-muted); }
.cnb1-sub {
  margin: 0; font-size: 17px; color: var(--text-muted);
  max-width: 56ch; line-height: 1.5;
}

/* ---------- HERO ---------- */
.cnb1-hero { min-height: calc(100vh - 60px); }
.cnb1-hero-inner {
  max-width: 1340px; margin: 0 auto;
  padding: 80px 28px 60px;
  flex: 1;
  display: flex; flex-direction: column; gap: 48px; align-items: center;
}
.cnb1-hero-copy {
  text-align: center; max-width: 920px;
  display: flex; flex-direction: column; align-items: center; gap: 20px;
}
.cnb1-hero-tag {
  font-family: var(--u-mono);
  font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--text-faint);
  display: inline-flex; align-items: center; gap: 10px;
}
.cnb1-hero-tag .dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--u-primary);
  box-shadow: 0 0 0 3px rgba(0,82,255,0.22);
}
.cnb1-hero-h1 {
  font-size: clamp(44px, 6.8vw, 92px);
  font-weight: 500; line-height: 0.96; letter-spacing: -0.046em;
  margin: 0; max-width: 18ch;
}
.cnb1-hero-h1 .accent { color: var(--u-primary); }
.cnb1-hero-sub {
  margin-top: 10px;
  font-size: 18px; color: var(--text-muted); max-width: 56ch; line-height: 1.5;
}
.cnb1-hero-cta {
  margin-top: 24px;
  display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;
}

/* persona rotator under hero */
.cnb1-persona-rotator {
  margin-top: 12px;
  padding: 10px 16px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: rgba(255,255,255,0.025);
  display: inline-flex; align-items: center; gap: 14px;
  transition: opacity .35s;
}
.cnb1-persona-rotator .lab {
  font-family: var(--u-mono);
  font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--text-faint);
}
.cnb1-persona-rotator .role { font-size: 13px; color: var(--text); font-weight: 500; min-width: 14ch; }
.cnb1-persona-rotator .line { font-size: 13px; color: var(--text-muted); }

/* ---------- LIVE THREAD MOCK (shared by hero + dissected) ---------- */
.cnb1-thread-wrap {
  position: relative;
  width: 100%; max-width: 1180px;
  isolation: isolate;
}
.cnb1-thread-glow {
  position: absolute; inset: -80px -40px auto -40px;
  height: 360px;
  background:
    radial-gradient(60% 50% at 50% 20%, rgba(0,82,255,0.40) 0%, rgba(0,82,255,0) 70%),
    radial-gradient(40% 50% at 25% 30%, rgba(77,133,255,0.30) 0%, rgba(77,133,255,0) 70%);
  filter: blur(28px); pointer-events: none; z-index: -1;
}
.cnb1-thread {
  background: var(--paper-card);
  border: 1px solid var(--ink-line-strong);
  border-radius: 12px;
  overflow: hidden;
  box-shadow:
    0 50px 120px -30px rgba(0,82,255,0.30),
    0 30px 80px -20px rgba(0,0,0,0.6),
    0 0 0 1px rgba(255,255,255,0.04);
  display: grid;
  grid-template-columns: 56px 280px 1fr 320px;
  height: 540px;
  font-size: 13px; color: var(--ink);
  font-family: var(--u-font);
}
.cnb1-papersoft .cnb1-thread {
  box-shadow:
    0 30px 80px -28px rgba(11,13,17,0.20),
    0 0 0 1px rgba(11,13,17,0.04);
}
@media (max-width: 1180px) { .cnb1-thread { grid-template-columns: 56px 240px 1fr; } .cnb1-thread .checklist { display: none; } }
@media (max-width: 860px) { .cnb1-thread { grid-template-columns: 56px 1fr; } .cnb1-thread .conversations { display: none; } }

/* product nav */
.cnb1-thread .pnav {
  background: var(--paper-card);
  border-right: 1px solid var(--ink-line);
  display: flex; flex-direction: column; align-items: center;
  padding: 14px 0; gap: 4px;
}
.cnb1-thread .pnav .logo {
  width: 32px; height: 32px;
  background: var(--u-primary);
  color: white; border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 14px;
  letter-spacing: -0.03em; margin-bottom: 14px;
}
.cnb1-thread .pnav .ico {
  width: 36px; height: 36px; border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  color: var(--ink-faint); cursor: pointer;
}
.cnb1-thread .pnav .ico.active { background: var(--u-primary-tint); color: var(--u-primary); }

/* conversations */
.cnb1-thread .conversations {
  background: var(--paper-card);
  border-right: 1px solid var(--ink-line);
  display: flex; flex-direction: column; min-width: 0;
}
.cnb1-thread .list-head { padding: 14px 16px 10px; border-bottom: 1px solid var(--ink-line); }
.cnb1-thread .list-head .org {
  font-family: var(--u-mono); font-size: 10px;
  text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--ink-faint);
}
.cnb1-thread .list-head .title { font-size: 15px; font-weight: 600; letter-spacing: -0.015em; margin-top: 4px; }
.cnb1-thread .conv {
  padding: 10px 16px; border-bottom: 1px solid var(--ink-line);
  cursor: pointer; min-width: 0; position: relative;
}
.cnb1-thread .conv.selected { background: var(--u-primary-tint); }
.cnb1-thread .conv.selected::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0;
  width: 2px; background: var(--u-primary);
}
.cnb1-thread .conv-top { display: flex; justify-content: space-between; gap: 8px; }
.cnb1-thread .conv-title {
  font-size: 12.5px; font-weight: 500; letter-spacing: -0.005em;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.cnb1-thread .conv-time { font-family: var(--u-mono); font-size: 9.5px; color: var(--ink-faint); }
.cnb1-thread .conv-preview {
  font-size: 11.5px; color: var(--ink-muted); margin-top: 2px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.cnb1-thread .conv-tag {
  display: inline-block;
  font-family: var(--u-mono); font-size: 9.5px;
  padding: 1px 5px; border-radius: 2px;
  margin-top: 6px;
  background: #EEF0F2; color: var(--ink-muted);
}
.cnb1-thread .conv-tag.ok { background: #E8F5EF; color: #0B8A5C; }
.cnb1-thread .conv-tag.warn { background: #FBF2E2; color: #B4731A; }

/* main */
.cnb1-thread .main { background: var(--paper-card); display: flex; flex-direction: column; min-width: 0; }
.cnb1-thread .head { padding: 14px 22px; border-bottom: 1px solid var(--ink-line); }
.cnb1-thread .head .nc {
  font-family: var(--u-mono); font-size: 11px;
  color: var(--ink-faint); letter-spacing: 0.04em;
}
.cnb1-thread .head h2 { font-size: 18px; font-weight: 600; letter-spacing: -0.018em; margin: 4px 0 8px; }
.cnb1-thread .head .meta { display: flex; gap: 8px; flex-wrap: wrap; font-size: 11px; }
.cnb1-thread .pill {
  font-family: var(--u-mono); font-size: 10px;
  padding: 2px 6px; border-radius: 2px;
  background: #EEF0F2; color: var(--ink-muted);
}
.cnb1-thread .pill.ok { background: #E8F5EF; color: #0B8A5C; }
.cnb1-thread .pill.info { background: var(--u-primary-tint); color: var(--u-primary); }
.cnb1-thread .scroll {
  flex: 1; overflow: auto;
  padding: 16px 22px;
  display: flex; flex-direction: column; gap: 16px;
}
.cnb1-thread .msg { display: grid; grid-template-columns: 28px 1fr; gap: 10px; }
.cnb1-thread .msg .av {
  width: 28px; height: 28px; border-radius: 50%;
  background: linear-gradient(180deg, #C4D0E8, #8F9FBF);
  flex-shrink: 0;
}
.cnb1-thread .msg.ai .av { background: var(--u-primary); }
.cnb1-thread .msg .body { min-width: 0; }
.cnb1-thread .msg .name { font-size: 12.5px; font-weight: 500; }
.cnb1-thread .msg .name .role {
  font-weight: 400; color: var(--ink-faint); margin-left: 6px;
  font-family: var(--u-mono); font-size: 10px;
}
.cnb1-thread .msg .text {
  font-size: 13px; color: var(--ink); margin-top: 4px;
  line-height: 1.5;
}
.cnb1-thread .msg.ai .text {
  background: var(--u-primary-tint);
  border-left: 2px solid var(--u-primary);
  padding: 10px 12px;
  border-radius: 4px;
  color: var(--ink);
}
.cnb1-thread .evidence {
  border: 1px solid var(--ink-line);
  border-radius: 4px;
  padding: 10px 12px;
  margin-top: 8px;
  background: #FBFBFC;
  display: flex; gap: 10px; align-items: center;
}
.cnb1-thread .evidence .ico {
  width: 28px; height: 28px; border-radius: 4px;
  background: var(--u-primary-tint);
  color: var(--u-primary);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--u-mono); font-size: 10px;
}
.cnb1-thread .evidence .nm { font-size: 12px; font-weight: 500; }
.cnb1-thread .evidence .meta { font-family: var(--u-mono); font-size: 10px; color: var(--ink-faint); }

.cnb1-thread .compose {
  border-top: 1px solid var(--ink-line);
  padding: 12px 18px;
  display: flex; gap: 10px; align-items: center;
}
.cnb1-thread .compose .input {
  flex: 1;
  background: var(--paper-soft);
  border: 1px solid var(--ink-line);
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 12.5px;
  color: var(--ink-faint);
}
.cnb1-thread .compose .send {
  background: var(--u-primary);
  color: white;
  border: 0; border-radius: 4px;
  padding: 8px 12px; font-size: 12.5px;
  font-weight: 500;
}

/* checklist */
.cnb1-thread .checklist {
  background: var(--paper-card);
  border-left: 1px solid var(--ink-line);
  padding: 16px 18px;
  display: flex; flex-direction: column; gap: 14px;
  overflow: auto;
}
.cnb1-thread .checklist h3 {
  font-size: 12px; font-weight: 600; letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--ink-muted); margin: 0;
}
.cnb1-thread .check { display: grid; grid-template-columns: 18px 1fr; gap: 10px; align-items: flex-start; }
.cnb1-thread .check .box {
  width: 16px; height: 16px;
  border: 1.5px solid var(--ink-line-strong);
  border-radius: 3px;
  margin-top: 1px;
  transition: background .25s, border-color .25s;
}
.cnb1-thread .check.done .box {
  background: var(--u-primary);
  border-color: var(--u-primary);
  position: relative;
}
.cnb1-thread .check.done .box::after {
  content: ""; position: absolute;
  top: 3px; left: 5px;
  width: 4px; height: 8px;
  border: solid white; border-width: 0 1.5px 1.5px 0;
  transform: rotate(45deg);
}
.cnb1-thread .check.active .box {
  border-color: var(--u-primary);
  box-shadow: 0 0 0 4px rgba(0,82,255,0.18);
}
.cnb1-thread .check.active .lbl { color: var(--u-primary); }
.cnb1-thread .check .lbl { font-size: 12px; line-height: 1.4; transition: color .25s; }
.cnb1-thread .check .meta {
  font-family: var(--u-mono);
  font-size: 9.5px; color: var(--ink-faint);
  margin-top: 2px;
}

/* ---------- DISSECTED (section 02) ---------- */
.cnb1-dissected {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: 56px;
  align-items: flex-start;
  margin-top: 32px;
}
@media (max-width: 1080px) { .cnb1-dissected { grid-template-columns: 1fr; gap: 36px; } }
.cnb1-dissected-sticky {
  position: sticky; top: 96px;
  display: flex; flex-direction: column; gap: 18px;
}
@media (max-width: 1080px) { .cnb1-dissected-sticky { position: static; } }
.cnb1-step-stage {
  border: 1px solid var(--ink-line);
  border-radius: 12px;
  background: var(--paper-card);
  padding: 24px 26px;
  display: flex; flex-direction: column; gap: 14px;
  box-shadow: 0 20px 50px -22px rgba(11,13,17,0.16);
  min-height: 360px;
}
.cnb1-step-stage .stage-head {
  display: flex; justify-content: space-between; align-items: baseline; gap: 12px;
}
.cnb1-step-stage .stage-key {
  font-family: var(--u-mono);
  font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--u-primary);
}
.cnb1-step-stage .stage-rec {
  font-family: var(--u-mono);
  font-size: 10px; letter-spacing: 0.12em;
  color: var(--ink-faint);
}
.cnb1-step-stage .stage-name {
  font-size: 28px; font-weight: 500; letter-spacing: -0.025em;
  line-height: 1.05; color: var(--ink);
}
.cnb1-step-stage .stage-msg {
  border: 1px solid var(--ink-line);
  border-radius: 8px;
  padding: 14px 16px;
  display: grid; grid-template-columns: 28px 1fr; gap: 10px;
  background: var(--paper-soft);
}
.cnb1-step-stage .stage-msg .av {
  width: 28px; height: 28px; border-radius: 50%;
  background: linear-gradient(180deg, #C4D0E8, #8F9FBF);
}
.cnb1-step-stage .stage-msg.ai .av { background: var(--u-primary); }
.cnb1-step-stage .stage-msg.system .av {
  background: var(--ink);
  color: white;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--u-mono); font-size: 10px;
}
.cnb1-step-stage .stage-msg .name { font-size: 12.5px; font-weight: 500; color: var(--ink); }
.cnb1-step-stage .stage-msg .name .who {
  font-family: var(--u-mono); font-size: 10px; color: var(--ink-faint);
  font-weight: 400; margin-left: 6px;
}
.cnb1-step-stage .stage-msg .text { font-size: 13px; color: var(--ink); line-height: 1.5; margin-top: 4px; }
.cnb1-step-stage .stage-msg .text b { font-weight: 600; }
.cnb1-step-stage .stage-evidence {
  border: 1px dashed var(--ink-line-strong);
  border-radius: 6px;
  padding: 10px 12px;
  display: flex; gap: 10px; align-items: center;
}
.cnb1-step-stage .stage-evidence .ico {
  width: 30px; height: 30px; border-radius: 6px;
  background: var(--u-primary-tint);
  color: var(--u-primary);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--u-mono); font-size: 10px;
}
.cnb1-step-stage .stage-evidence .nm { font-size: 12.5px; font-weight: 500; color: var(--ink); }
.cnb1-step-stage .stage-evidence .meta {
  font-family: var(--u-mono); font-size: 10px; color: var(--ink-faint);
}
.cnb1-step-stage .stage-action {
  display: flex; gap: 10px; align-items: center;
}
.cnb1-step-stage .stage-action .btn {
  background: var(--u-primary); color: white;
  font-size: 12.5px; font-weight: 500;
  padding: 8px 14px; border-radius: 4px; border: 0;
}
.cnb1-step-stage .stage-action .btn.ghost {
  background: white; color: var(--ink); border: 1px solid var(--ink-line-strong);
}
.cnb1-step-stage .stage-action .stamp {
  font-family: var(--u-mono); font-size: 10px;
  color: var(--ink-faint); letter-spacing: 0.08em;
}
.cnb1-step-stage .stage-trail {
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px dashed var(--ink-line);
  font-family: var(--u-mono);
  font-size: 10.5px; letter-spacing: 0.1em;
  color: var(--ink-faint);
  display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap;
}
.cnb1-step-stage .stage-trail .left { color: var(--u-primary); }

/* timeline rail under stage */
.cnb1-step-rail {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 18px;
  border: 1px solid var(--ink-line);
  border-radius: 8px;
  background: var(--paper-card);
  gap: 8px;
  flex-wrap: wrap;
}
.cnb1-step-rail .pip {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  flex: 1; min-width: 60px;
  cursor: pointer;
}
.cnb1-step-rail .pip .dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: var(--ink-line-strong);
  transition: background .2s, box-shadow .2s, transform .2s;
}
.cnb1-step-rail .pip.done .dot { background: var(--u-primary); }
.cnb1-step-rail .pip.active .dot {
  background: var(--u-primary);
  box-shadow: 0 0 0 4px rgba(0,82,255,0.20);
  transform: scale(1.15);
}
.cnb1-step-rail .pip .lab {
  font-family: var(--u-mono); font-size: 9.5px;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--ink-faint);
  text-align: center;
}
.cnb1-step-rail .pip.active .lab,
.cnb1-step-rail .pip.done .lab { color: var(--ink-muted); }

/* step cards (right column, scroll-driven) */
.cnb1-step-cards { display: flex; flex-direction: column; gap: 24px; }
.cnb1-step-card {
  border: 1px solid var(--ink-line);
  border-radius: 12px;
  background: var(--paper-card);
  padding: 28px 28px 26px;
  display: flex; flex-direction: column; gap: 12px;
  transition: border-color .25s, box-shadow .25s, transform .25s;
  scroll-margin-top: 96px;
}
.cnb1-step-card.is-active {
  border-color: var(--u-primary);
  box-shadow: 0 14px 40px -22px rgba(0,82,255,0.30);
}
.cnb1-step-card .key {
  font-family: var(--u-mono);
  font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--u-primary);
  display: flex; align-items: center; gap: 10px;
}
.cnb1-step-card .key .num {
  border: 1px solid var(--u-primary-border);
  background: var(--u-primary-tint);
  color: var(--u-primary);
  padding: 2px 7px; border-radius: 3px;
}
.cnb1-step-card .name { font-size: 22px; font-weight: 500; letter-spacing: -0.022em; color: var(--ink); }
.cnb1-step-card .body { font-size: 14.5px; color: var(--ink-muted); line-height: 1.55; }
.cnb1-step-card .accent {
  font-family: var(--u-mono);
  font-size: 10.5px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--ink-faint);
  border-top: 1px dashed var(--ink-line);
  padding-top: 12px;
}
.cnb1-step-card.is-active .accent { color: var(--u-primary); }

/* ---------- BEFORE (section 03) ---------- */
.cnb1-before {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 32px;
}
@media (max-width: 980px) { .cnb1-before { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .cnb1-before { grid-template-columns: 1fr; } }
.cnb1-before-card {
  background: white;
  border: 1px solid var(--ink-line);
  border-radius: 8px;
  padding: 24px 22px;
  display: flex; flex-direction: column; gap: 14px;
  min-height: 280px;
  position: relative;
}
.cnb1-before-card .src {
  font-family: var(--u-mono);
  font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ink-faint);
  display: flex; align-items: center; gap: 8px;
}
.cnb1-before-card .src .dot {
  width: 8px; height: 8px; border-radius: 2px;
  background: var(--ink-line-strong);
}
.cnb1-before-card .stat {
  font-size: 32px; font-weight: 500;
  letter-spacing: -0.026em;
}
.cnb1-before-card .label { font-size: 13px; color: var(--ink-muted); line-height: 1.45; }
.cnb1-before-card .lines {
  margin-top: auto; padding-top: 16px;
  border-top: 1px dashed var(--ink-line);
  display: flex; flex-direction: column; gap: 6px;
}
.cnb1-before-card .lines .ln { height: 5px; border-radius: 2px; background: rgba(11,13,17,0.08); }
.cnb1-before-card .lines .ln.short { width: 60%; }
.cnb1-before-card .lines .ln.mid { width: 80%; }

.cnb1-aggregate {
  margin-top: 24px;
  background: white;
  border: 1px solid #C4303A33;
  border-radius: 10px;
  padding: 28px 32px;
  display: flex; gap: 32px; align-items: center; flex-wrap: wrap;
}
.cnb1-aggregate .num {
  font-size: 64px; font-weight: 500; letter-spacing: -0.04em;
  line-height: 1; color: #C4303A;
}
.cnb1-aggregate .copy { flex: 1; min-width: 240px; font-size: 17px; color: var(--ink); line-height: 1.4; }
.cnb1-aggregate .copy b { font-weight: 600; }

/* ---------- WHY (section 04) framework ---------- */
.cnb1-why {
  display: grid; grid-template-columns: 1fr;
  gap: 36px;
  margin-top: 32px;
}
.cnb1-why-statement {
  font-size: clamp(20px, 2vw, 22px);
  line-height: 1.5; color: var(--ink);
  max-width: 76ch;
}
.cnb1-why-statement b { font-weight: 600; }
.cnb1-why-statement .blue { color: var(--u-primary); font-weight: 600; }

.cnb1-record-diagram {
  display: grid; grid-template-columns: 1fr 1.1fr 1fr;
  gap: 0;
  align-items: stretch;
  border: 1px solid var(--ink-line);
  border-radius: 14px;
  background: white;
  overflow: hidden;
}
@media (max-width: 980px) { .cnb1-record-diagram { grid-template-columns: 1fr; } }
.cnb1-rd-col {
  padding: 28px 26px;
  display: flex; flex-direction: column; gap: 14px;
  position: relative;
}
.cnb1-rd-col + .cnb1-rd-col { border-left: 1px solid var(--ink-line); }
@media (max-width: 980px) { .cnb1-rd-col + .cnb1-rd-col { border-left: 0; border-top: 1px solid var(--ink-line); } }
.cnb1-rd-col.center {
  background: linear-gradient(180deg, rgba(0,82,255,0.05), rgba(0,82,255,0));
}
.cnb1-rd-col .lab {
  font-family: var(--u-mono);
  font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-faint);
}
.cnb1-rd-col.center .lab { color: var(--u-primary); }
.cnb1-rd-col h3 {
  font-size: 19px; font-weight: 500; letter-spacing: -0.018em;
  margin: 0;
  color: var(--ink);
}
.cnb1-rd-col p { margin: 0; font-size: 13.5px; color: var(--ink-muted); line-height: 1.5; }
.cnb1-rd-list {
  display: flex; flex-direction: column; gap: 6px;
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px dashed var(--ink-line);
}
.cnb1-rd-list span {
  font-family: var(--u-mono); font-size: 11px;
  letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--ink-muted);
}
.cnb1-rd-arrow {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 28px; height: 1px;
  background: var(--ink-line-strong);
  pointer-events: none;
}
.cnb1-rd-arrow.right { right: -14px; }
.cnb1-rd-arrow.right::after {
  content: ""; position: absolute; right: 0; top: -3px;
  width: 6px; height: 6px;
  border-top: 1px solid var(--ink-line-strong);
  border-right: 1px solid var(--ink-line-strong);
  transform: rotate(45deg);
}
.cnb1-rd-arrow.left { left: -14px; }
.cnb1-rd-arrow.left::after {
  content: ""; position: absolute; left: 0; top: -3px;
  width: 6px; height: 6px;
  border-bottom: 1px solid var(--ink-line-strong);
  border-left: 1px solid var(--ink-line-strong);
  transform: rotate(45deg);
}
.cnb1-rd-col.center .cnb1-rd-arrow { background: var(--u-primary); }
.cnb1-rd-col.center .cnb1-rd-arrow.right::after,
.cnb1-rd-col.center .cnb1-rd-arrow.left::after {
  border-color: var(--u-primary);
}
@media (max-width: 980px) { .cnb1-rd-arrow { display: none; } }

/* ---------- TAX (section 05) shorter ---------- */
.cnb1-tax-stack {
  display: flex; flex-direction: column; gap: 28px;
  margin-top: 24px;
}
.cnb1-tax-headline {
  font-size: clamp(56px, 9vw, 128px);
  line-height: 0.94;
  letter-spacing: -0.052em;
  font-weight: 500; margin: 0;
}
.cnb1-tax-headline .blue { color: var(--u-primary); }
.cnb1-tax-chips {
  display: flex; gap: 12px; flex-wrap: wrap;
  margin-top: 6px;
}
.cnb1-tax-chip {
  border: 1px solid var(--border);
  border-radius: 999px;
  background: rgba(255,255,255,0.04);
  padding: 10px 16px 10px 14px;
  display: inline-flex; align-items: center; gap: 12px;
}
.cnb1-tax-chip .key {
  font-family: var(--u-mono);
  font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--u-primary);
}
.cnb1-tax-chip .lab { font-size: 14px; color: var(--text); font-weight: 500; }
.cnb1-tax-callout {
  font-size: 16px; color: var(--text-muted); line-height: 1.55;
  max-width: 60ch;
}
.cnb1-tax-callout b { color: var(--text); font-weight: 600; }

/* ---------- DOMAINS (section 06) ---------- */
.cnb1-domains {
  display: grid; grid-template-columns: repeat(5, 1fr);
  gap: 1px;
  background: var(--ink-line);
  border: 1px solid var(--ink-line);
  border-radius: 12px;
  overflow: hidden;
  margin-top: 32px;
}
@media (max-width: 1080px) { .cnb1-domains { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 720px) { .cnb1-domains { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .cnb1-domains { grid-template-columns: 1fr; } }
.cnb1-domain {
  background: white;
  padding: 22px 18px;
  display: flex; flex-direction: column; gap: 6px;
  min-height: 130px;
  transition: background .15s;
}
.cnb1-domain:hover { background: var(--u-primary-tint); }
.cnb1-domain .nm { font-size: 14.5px; font-weight: 500; letter-spacing: -0.012em; }
.cnb1-domain .who { font-size: 12px; color: var(--ink-muted); }
.cnb1-domain .trig {
  margin-top: auto;
  font-family: var(--u-mono); font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--ink-faint);
}

/* ---------- LAYER (section 07) four-band stack ---------- */
.cnb1-layer {
  display: grid; grid-template-columns: 1fr 1.6fr 1fr;
  gap: 12px;
  margin-top: 36px;
  align-items: stretch;
}
@media (max-width: 980px) { .cnb1-layer { grid-template-columns: 1fr; } }
.cnb1-layer-side {
  display: flex; flex-direction: column; gap: 10px;
}
.cnb1-layer-side .lab {
  font-family: var(--u-mono);
  font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 4px;
}
.cnb1-cm-chip {
  border: 1px solid var(--ink-line);
  background: white;
  border-radius: 6px;
  padding: 14px 16px;
  display: flex; flex-direction: column; gap: 4px;
}
.cnb1-cm-chip .nm { font-size: 13.5px; font-weight: 500; }
.cnb1-cm-chip .arrow {
  font-family: var(--u-mono);
  font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--u-primary);
}
.cnb1-layer-stack {
  border: 1px solid var(--ink-line);
  border-radius: 14px;
  background: var(--paper-card);
  overflow: hidden;
}
.cnb1-band {
  padding: 22px 24px;
  border-bottom: 1px solid var(--ink-line);
  display: flex; flex-direction: column; gap: 6px;
}
.cnb1-band:last-child { border-bottom: 0; }
.cnb1-band .band-key {
  font-family: var(--u-mono);
  font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--ink-faint);
}
.cnb1-band .band-name {
  font-size: 17px; font-weight: 500; letter-spacing: -0.018em;
}
.cnb1-band .band-desc { font-size: 13px; color: var(--ink-muted); line-height: 1.45; }
.cnb1-band.outcomes {
  background: linear-gradient(180deg, rgba(0,82,255,0.08), rgba(0,82,255,0.02));
  border-bottom-color: rgba(0,82,255,0.18);
}
.cnb1-band.outcomes .band-key { color: var(--u-primary); }
.cnb1-layer-callout {
  font-size: 13.5px; color: var(--ink-muted); line-height: 1.55;
  max-width: 60ch;
  margin-top: 18px;
  font-style: italic;
}
.cnb1-layer-callout b { font-style: normal; color: var(--ink); font-weight: 600; }

/* ---------- AI (section 08) ---------- */
.cnb1-ai {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 40px;
}
@media (max-width: 900px) { .cnb1-ai { grid-template-columns: 1fr; } }
.cnb1-ai-step {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 32px 28px;
  background: rgba(255,255,255,0.02);
  display: flex; flex-direction: column; gap: 14px;
  min-height: 320px;
}
.cnb1-ai-step .lvl {
  font-family: var(--u-mono);
  font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--u-primary);
}
.cnb1-ai-step .name { font-size: 22px; font-weight: 500; letter-spacing: -0.022em; }
.cnb1-ai-step .desc { font-size: 14px; color: var(--text-muted); line-height: 1.55; }
.cnb1-ai-step .lock {
  margin-top: auto; padding-top: 16px;
  border-top: 1px solid var(--border);
  font-size: 12.5px; color: var(--text-muted);
}
.cnb1-ai-step .lock b { color: var(--text); font-weight: 500; }

/* ---------- PROOF (section 09) ---------- */
.cnb1-proof-card {
  background: white;
  border: 1px solid var(--ink-line);
  border-radius: 14px;
  padding: 48px 44px;
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 48px; align-items: center;
  margin-top: 32px;
}
@media (max-width: 900px) { .cnb1-proof-card { grid-template-columns: 1fr; padding: 32px; } }
.cnb1-proof-quote {
  font-size: 26px; line-height: 1.3; letter-spacing: -0.022em;
  font-weight: 500; margin: 0;
}
.cnb1-proof-quote .blue { color: var(--u-primary); }
.cnb1-proof-meta { display: flex; flex-direction: column; gap: 14px; }
.cnb1-proof-meta .name { font-size: 15px; font-weight: 500; }
.cnb1-proof-meta .role { font-size: 13px; color: var(--ink-muted); }
.cnb1-proof-meta .stamp {
  font-family: var(--u-mono);
  font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ink-faint);
  margin-top: 8px; border-top: 1px solid var(--ink-line); padding-top: 14px;
}

/* ---------- CTA (section 10) ---------- */
.cnb1-cta-h {
  font-size: clamp(40px, 6vw, 80px);
  font-weight: 500; letter-spacing: -0.044em;
  line-height: 1; margin: 0;
  max-width: 18ch;
}
.cnb1-cta-actions {
  margin-top: 36px;
  display: inline-flex; gap: 14px; flex-wrap: wrap;
}

/* ---------- FOOTER ---------- */
.cnb1-foot {
  border-top: 1px solid var(--border);
  background: var(--bg);
  color: var(--text-muted);
  padding: 28px;
}
.cnb1-foot-inner {
  max-width: 1280px; margin: 0 auto;
  display: flex; justify-content: space-between; align-items: center;
  font-size: 12px; flex-wrap: wrap; gap: 16px;
}
`;

type StageProps = {
  step: typeof DISSECTED_STEPS[number];
};

function StepStage({ step }: StageProps) {
  const k = step.key;
  return (
    <div className="cnb1-step-stage" key={k}>
      <div className="stage-head">
        <span className="stage-key">{`Step ${k} . ${step.name}`}</span>
        <span className="stage-rec">REC-2412 . Class II . Site 2</span>
      </div>
      <div className="stage-name">{step.headline}</div>

      {/* Per-step product fragment */}
      {k === "01" && (
        <div className="stage-msg system">
          <div className="av">U</div>
          <div>
            <div className="name">System <span className="who">Production hold</span></div>
            <div className="text">
              Lot Q1804 placed on hold at <b>10:32</b>. Reason: out of spec elution profile, second batch.
              CFR clause noted on the trigger.
            </div>
          </div>
        </div>
      )}
      {k === "02" && (
        <div className="stage-msg">
          <div className="av" />
          <div>
            <div className="name">A. Lewis <span className="who">QA Ops</span></div>
            <div className="text">
              Owner accepted by role. Acknowledged <b>14 minutes</b> after the trigger.
              Cross-functional reviewers added by template.
            </div>
          </div>
        </div>
      )}
      {k === "03" && (
        <div className="stage-msg">
          <div className="av" />
          <div>
            <div className="name">Priya T. <span className="who">SQE</span></div>
            <div className="text">
              Five whys captured inline. Root cause narrowed to <b>supplier process drift</b>.
              Two prior closures reference the same elution shift.
            </div>
          </div>
        </div>
      )}
      {k === "04" && (
        <div className="stage-evidence">
          <div className="ico">XLS</div>
          <div>
            <div className="nm">GC_trace_BatchA.xlsx</div>
            <div className="meta">Bound to step 03 . 6 attachments . Mar 27</div>
          </div>
        </div>
      )}
      {k === "05" && (
        <div className="stage-action">
          <button className="btn">Approved</button>
          <span className="stamp">21 CFR Part 11 stamp captured</span>
        </div>
      )}
      {k === "06" && (
        <div className="stage-msg ai">
          <div className="av" />
          <div>
            <div className="name">Unifize Assist <span className="who">Routing</span></div>
            <div className="text">
              Effectiveness verification scheduled. Owner: <b>M. Cole, Manufacturing Lead</b>.
              30 day window starts at approval. Calendar holds added.
            </div>
          </div>
        </div>
      )}
      {k === "07" && (
        <div className="stage-msg system">
          <div className="av">QMS</div>
          <div>
            <div className="name">Write-back <span className="who">on close</span></div>
            <div className="text">
              REC-2412 closed at <b>day 21</b>. Outcomes posted to QMS, audit log,
              and the dashboard the CFO already reads. Audit assembly ready.
            </div>
          </div>
        </div>
      )}

      <div className="stage-trail">
        <span className="left">{step.accent}</span>
        <span>One thread . trigger to closed</span>
      </div>
    </div>
  );
}

export default function HomeConceptBV1() {
  const [pIdx, setPIdx] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    document.title = "Concept B v1 . Product-led hierarchy";
  }, []);

  // Persona ribbon: auto-cycle on desktop, single static on mobile.
  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 980px)").matches;
    if (!isDesktop) return;
    const id = window.setInterval(() => setPIdx((i) => (i + 1) % PERSONA_HOOKS.length), 3200);
    return () => window.clearInterval(id);
  }, []);

  // Section 02 dissected: scroll-driven step activation on desktop.
  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 1080px)").matches;
    if (!isDesktop) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry closest to the viewport center that is intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (!visible.length) return;
        const idxAttr = (visible[0].target as HTMLElement).dataset.idx;
        if (idxAttr != null) setActiveStep(Number(idxAttr));
      },
      {
        rootMargin: "-30% 0px -45% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="cnb1-root">
      <style>{STYLES}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;550;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* Nav */}
      <nav className="cnb1-nav">
        <div className="cnb1-nav-inner">
          <Link to="/concept-b-v1" className="cnb1-nav-logo" aria-label="Unifize">
            <span className="word">unifize<b>.</b></span>
            <span className="tag">People . Process . AI . Outcomes</span>
          </Link>
          <div className="cnb1-nav-items">
            <a href="#dissected">The thread</a>
            <a href="#today">What it replaces</a>
            <a href="#why">Why it works</a>
            <a href="#proof">Proof</a>
          </div>
          <div className="cnb1-nav-actions">
            <a href="#login" className="cnb1-nav-link">Log in</a>
            <button className="cnb1-btn-primary cnb1-btn-blue">Book a demo</button>
          </div>
        </div>
      </nav>

      {/* SECTION 01 . HERO (dark) live working thread */}
      <section className="cnb1-section dark cnb1-hero" id="hero">
        <div className="cnb1-hero-inner">
          <div className="cnb1-hero-copy">
            <div className="cnb1-hero-tag">
              <span className="dot" />
              <span>One thread. From trigger to signed outcome.</span>
            </div>
            <h1 className="cnb1-hero-h1">
              The <span className="accent">layer</span> between your record<br />and where the work actually happens.
            </h1>
            <p className="cnb1-hero-sub">
              Your record stays the record. Coordination stops living in email. Decisions, evidence,
              approvals and handoffs land in a single accountable thread, and write back to the system
              that owns the outcome.
            </p>
            <div className="cnb1-hero-cta">
              <button className="cnb1-btn-primary cnb1-btn-blue">
                Book a demo
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <a href="#today" className="cnb1-btn-ghost">See what it replaces</a>
            </div>
            <div className="cnb1-persona-rotator" aria-live="polite">
              <span className="lab">For the</span>
              <span className="role">{PERSONA_HOOKS[pIdx].role}</span>
              <span className="line">{PERSONA_HOOKS[pIdx].line}</span>
            </div>
          </div>

          {/* Live thread mock with hero glow */}
          <div className="cnb1-thread-wrap">
            <div className="cnb1-thread-glow" aria-hidden />
            <div className="cnb1-thread" role="img" aria-label="Unifize thread preview">
              {/* Left rail */}
              <div className="pnav">
                <div className="logo">U</div>
                <div className="ico" title="Inbox">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 12h5l1 3h6l1-3h5M3 12V6a2 2 0 012-2h14a2 2 0 012 2v6M3 12v6a2 2 0 002 2h14a2 2 0 002-2v-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="ico active" title="Threads">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="ico" title="Records">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
                    <line x1="8" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1.4" />
                    <line x1="8" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </div>
                <div className="ico" title="Reports">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <line x1="4" y1="20" x2="4" y2="10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <line x1="10" y1="20" x2="10" y2="6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <line x1="16" y1="20" x2="16" y2="13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* Conversations */}
              <div className="conversations">
                <div className="list-head">
                  <div className="org">Quality . Site 2</div>
                  <div className="title">Threads</div>
                </div>
                <div className="conv selected">
                  <div className="conv-top">
                    <span className="conv-title">Investigation 2412</span>
                    <span className="conv-time">10:46</span>
                  </div>
                  <div className="conv-preview">Trace from second batch attached. Awaiting QA approval.</div>
                  <span className="conv-tag warn">In review</span>
                </div>
                <div className="conv">
                  <div className="conv-top">
                    <span className="conv-title">Change Order 0788</span>
                    <span className="conv-time">09:14</span>
                  </div>
                  <div className="conv-preview">Drawing change. R&D . QA . Manufacturing.</div>
                  <span className="conv-tag">Routing</span>
                </div>
                <div className="conv">
                  <div className="conv-top">
                    <span className="conv-title">Supplier Action 119</span>
                    <span className="conv-time">Yest</span>
                  </div>
                  <div className="conv-preview">Effectiveness verified. Closed.</div>
                  <span className="conv-tag ok">Closed</span>
                </div>
                <div className="conv">
                  <div className="conv-top">
                    <span className="conv-title">Document Revision 4408</span>
                    <span className="conv-time">Mon</span>
                  </div>
                  <div className="conv-preview">SOP revision. 14 trainees identified.</div>
                  <span className="conv-tag">Open</span>
                </div>
              </div>

              {/* Main thread */}
              <div className="main">
                <div className="head">
                  <span className="nc">REC-2412 . Class II device . Site 2</span>
                  <h2>Lot on hold. Trace from second batch reviewed.</h2>
                  <div className="meta">
                    <span className="pill info">Owner: A. Lewis</span>
                    <span className="pill">21 CFR 11</span>
                    <span className="pill ok">Evidence bound</span>
                  </div>
                </div>
                <div className="scroll">
                  <div className="msg">
                    <div className="av" />
                    <div className="body">
                      <div className="name">Priya T. <span className="role">SQE</span></div>
                      <div className="text">GC trace from the second batch is attached. Same elution profile as the supplier letter.</div>
                      <div className="evidence">
                        <div className="ico">XLS</div>
                        <div>
                          <div className="nm">GC_trace_BatchA.xlsx</div>
                          <div className="meta">Bound to step 03 . Mar 27</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="msg ai">
                    <div className="av" />
                    <div className="body">
                      <div className="name">Unifize Assist <span className="role">Level 1</span></div>
                      <div className="text">Two prior closures match this elution shift. Both cleared on supplier corrective action. Suggest routing to QA Manager for approval.</div>
                    </div>
                  </div>
                  <div className="msg">
                    <div className="av" />
                    <div className="body">
                      <div className="name">Anna L. <span className="role">QA Manager</span></div>
                      <div className="text">Aligned. Approving with linked SCAR. Closing this thread on effectiveness verification.</div>
                    </div>
                  </div>
                </div>
                <div className="compose">
                  <div className="input">Write a reply or @ Unifize Assist</div>
                  <button className="send">Approve</button>
                </div>
              </div>

              {/* Right rail checklist */}
              <div className="checklist">
                <h3>Closure checklist</h3>
                <div className="check done">
                  <div className="box" />
                  <div>
                    <div className="lbl">Trigger logged</div>
                    <div className="meta">Step 00 . Production</div>
                  </div>
                </div>
                <div className="check done">
                  <div className="box" />
                  <div>
                    <div className="lbl">Owner assigned</div>
                    <div className="meta">Step 01 . Role-based</div>
                  </div>
                </div>
                <div className="check done">
                  <div className="box" />
                  <div>
                    <div className="lbl">Decision captured</div>
                    <div className="meta">Step 02 . Linked to evidence</div>
                  </div>
                </div>
                <div className="check done">
                  <div className="box" />
                  <div>
                    <div className="lbl">Evidence bound</div>
                    <div className="meta">Step 03 . 6 attachments</div>
                  </div>
                </div>
                <div className="check active">
                  <div className="box" />
                  <div>
                    <div className="lbl">Approval stamp</div>
                    <div className="meta">Step 04 . 21 CFR 11</div>
                  </div>
                </div>
                <div className="check">
                  <div className="box" />
                  <div>
                    <div className="lbl">Effectiveness verified</div>
                    <div className="meta">Step 06 . 30 day window</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 02 . THREAD DISSECTED (papersoft) */}
      <section className="cnb1-section papersoft" id="dissected">
        <div className="cnb1-inner">
          <div>
            <div className="cnb1-eyebrow">
              <span className="num">02</span>
              <span>The thread, dissected.</span>
              <span className="line" />
            </div>
            <h2 className="cnb1-h2">
              One record. Seven steps.{" "}
              <span className="dim">Trigger. Owner. Decision. Evidence bound. Approval. Handoff. Closed.</span>
            </h2>
            <p className="cnb1-sub" style={{ marginTop: 22 }}>
              The same investigation walks across seven moments. Each one earns its place in the record.
              No framework yet. Just the shape of the work as it happens.
            </p>
          </div>

          <div className="cnb1-dissected">
            {/* Sticky stage on the left (desktop) */}
            <div className="cnb1-dissected-sticky">
              <StepStage step={DISSECTED_STEPS[activeStep]} />
              <div className="cnb1-step-rail">
                {DISSECTED_STEPS.map((s, i) => (
                  <button
                    key={s.key}
                    className={`pip ${i === activeStep ? "active" : ""} ${i < activeStep ? "done" : ""}`}
                    onClick={() => {
                      setActiveStep(i);
                      stepRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                    aria-label={`Step ${s.key} ${s.name}`}
                  >
                    <span className="dot" />
                    <span className="lab">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Scroll cards on the right (desktop), stacked on mobile */}
            <div className="cnb1-step-cards">
              {DISSECTED_STEPS.map((s, i) => (
                <div
                  key={s.key}
                  ref={(el) => (stepRefs.current[i] = el)}
                  data-idx={i}
                  className={`cnb1-step-card ${i === activeStep ? "is-active" : ""}`}
                >
                  <span className="key">
                    <span className="num">{s.key}</span>
                    <span>{s.name}</span>
                  </span>
                  <span className="name">{s.headline}</span>
                  <span className="body">{s.body}</span>
                  <span className="accent">{s.accent}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03 . WHAT IT REPLACES (light) */}
      <section className="cnb1-section light" id="today">
        <div className="cnb1-inner">
          <div>
            <div className="cnb1-eyebrow">
              <span className="num">03</span>
              <span>Today, that thread does not exist.</span>
              <span className="line" />
            </div>
            <h2 className="cnb1-h2">
              The same record gets reconstructed across four tools.{" "}
              <span className="dim">Every time. By memory. Three weeks late.</span>
            </h2>
            <p className="cnb1-sub" style={{ marginTop: 22 }}>
              This is not a process problem. It is a layer problem. No system owns the work between
              the systems.
            </p>
          </div>

          <div className="cnb1-before">
            <div className="cnb1-before-card">
              <div className="src"><span className="dot" /> Microsoft Teams</div>
              <div className="stat">17</div>
              <div className="label">Messages across two channels. Decisions made. Never written down.</div>
              <div className="lines">
                <div className="ln" />
                <div className="ln mid" />
                <div className="ln short" />
              </div>
            </div>
            <div className="cnb1-before-card">
              <div className="src"><span className="dot" /> Outlook</div>
              <div className="stat">14</div>
              <div className="label">People on a thread three weeks deep. Approval lost in the middle.</div>
              <div className="lines">
                <div className="ln" />
                <div className="ln" />
                <div className="ln mid" />
              </div>
            </div>
            <div className="cnb1-before-card">
              <div className="src"><span className="dot" /> SharePoint</div>
              <div className="stat">14</div>
              <div className="label">Versions in a folder. Three of them named FINAL. None of them reviewable.</div>
              <div className="lines">
                <div className="ln short" />
                <div className="ln mid" />
                <div className="ln" />
              </div>
            </div>
            <div className="cnb1-before-card">
              <div className="src"><span className="dot" /> Excel</div>
              <div className="stat">6 days</div>
              <div className="label">Since the tracker was last updated. Owners drifting. Status unknown.</div>
              <div className="lines">
                <div className="ln mid" />
                <div className="ln short" />
                <div className="ln" />
              </div>
            </div>
          </div>

          <div className="cnb1-aggregate">
            <div className="num">92d</div>
            <div className="copy">
              <b>Time to close one record.</b> Five days of actual work. Eighty-seven days of waiting,
              re-asking, rebuilding context. Audit prep starts at day ninety-two and adds another two weeks.
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 04 . WHY THIS WORKS (papersoft) */}
      <section className="cnb1-section papersoft" id="why">
        <div className="cnb1-inner">
          <div>
            <div className="cnb1-eyebrow">
              <span className="num">04</span>
              <span>Why this works.</span>
              <span className="line" />
            </div>
            <h2 className="cnb1-h2">
              System of record. <span className="dim">System of coordination.</span>
            </h2>
          </div>

          <div className="cnb1-why">
            <p className="cnb1-why-statement">
              Your <b>system of record</b> is the place that owns the outcome. The QMS, ERP, PLM, MES.
              They are good at storing, signing and reporting. They are not designed to hold the
              cross-functional conversation that produces the record.
              That work happens elsewhere. In email. In a tracker. In a chat thread.
              We call that layer the <span className="blue">system of coordination</span>.
              It already exists. Today it is invisible. Unifize gives it shape.
            </p>

            <div className="cnb1-record-diagram">
              <div className="cnb1-rd-col">
                <span className="lab">System of record</span>
                <h3>Stays the record.</h3>
                <p>
                  QMS, ERP, PLM, MES, LIMS. Storage. Signed audit log. Compliance reporting. The
                  destination, not the path.
                </p>
                <div className="cnb1-rd-list">
                  <span>QMS . ERP . PLM</span>
                  <span>MES . LIMS</span>
                </div>
                <span className="cnb1-rd-arrow right" aria-hidden />
              </div>

              <div className="cnb1-rd-col center">
                <span className="lab">System of coordination</span>
                <h3>Holds the work between.</h3>
                <p>
                  One thread per record. Owner, decision, evidence, approval, handoff, closed.
                  Read by AI. Write-back on close. Visible to everyone, accountable to one.
                </p>
                <div className="cnb1-rd-list">
                  <span>Threads . Roles . Evidence</span>
                  <span>Approvals . Write-back</span>
                </div>
                <span className="cnb1-rd-arrow left" aria-hidden />
                <span className="cnb1-rd-arrow right" aria-hidden />
              </div>

              <div className="cnb1-rd-col">
                <span className="lab">Where work happens</span>
                <h3>Captured, not policed.</h3>
                <p>
                  Teams, Outlook, SharePoint, Excel. People still talk. Decisions still happen
                  in line. Captured into the thread, not buried.
                </p>
                <div className="cnb1-rd-list">
                  <span>Teams . Outlook</span>
                  <span>SharePoint . Excel</span>
                </div>
                <span className="cnb1-rd-arrow left" aria-hidden />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 05 . NAME THE COST (dark) shorter beat */}
      <section className="cnb1-section dark" id="tax">
        <div className="cnb1-inner">
          <div>
            <div className="cnb1-eyebrow">
              <span className="num">05</span>
              <span>Name the cost.</span>
              <span className="line" />
            </div>

            <div className="cnb1-tax-stack">
              <h2 className="cnb1-tax-headline">
                Coordination <span className="blue">tax</span>.
              </h2>
              <div className="cnb1-tax-chips">
                <span className="cnb1-tax-chip">
                  <span className="key">01</span><span className="lab">Visible</span>
                </span>
                <span className="cnb1-tax-chip">
                  <span className="key">02</span><span className="lab">Measurable</span>
                </span>
                <span className="cnb1-tax-chip">
                  <span className="key">03</span><span className="lab">Reducible</span>
                </span>
              </div>
              <p className="cnb1-tax-callout">
                The structural cost of holding cross-functional work together when no system owns
                it end to end. <b>12 to 20 percent</b> of regulated payroll. You just watched
                seventy-one days of it disappear in section 02. The number is reducible because
                the work that produces it is now a thread.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 06 . WHERE IT SHOWS UP (light) */}
      <section className="cnb1-section light" id="world">
        <div className="cnb1-inner">
          <div>
            <div className="cnb1-eyebrow">
              <span className="num">06</span>
              <span>Where it shows up.</span>
              <span className="line" />
            </div>
            <h2 className="cnb1-h2">
              Fifteen rooms. One layer.{" "}
              <span className="dim">Same shape every time. Different door, same tax inside.</span>
            </h2>
          </div>
          <div className="cnb1-domains">
            {DOMAINS.map((d) => (
              <div key={d.label} className="cnb1-domain">
                <span className="nm">{d.label}</span>
                <span className="who">{d.who}</span>
                <span className="trig">{d.trigger}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 07 . THE LAYER (papersoft) four-band stack */}
      <section className="cnb1-section papersoft" id="how">
        <div className="cnb1-inner">
          <div>
            <div className="cnb1-eyebrow">
              <span className="num">07</span>
              <span>The layer, end to end.</span>
              <span className="line" />
            </div>
            <h2 className="cnb1-h2">
              Outcomes on top.{" "}
              <span className="dim">Core platform underneath. Architectural, not the reveal.</span>
            </h2>
          </div>
          <div className="cnb1-layer">
            <div className="cnb1-layer-side">
              <div className="lab">Systems of record</div>
              <div className="cnb1-cm-chip"><span className="nm">QMS</span><span className="arrow">. context</span></div>
              <div className="cnb1-cm-chip"><span className="nm">ERP</span><span className="arrow">. context</span></div>
              <div className="cnb1-cm-chip"><span className="nm">PLM</span><span className="arrow">. context</span></div>
              <div className="cnb1-cm-chip"><span className="nm">MES / LIMS</span><span className="arrow">. context</span></div>
              <div className="cnb1-cm-chip" style={{ borderColor: "rgba(0,82,255,0.4)" }}>
                <span className="nm">Write-back</span>
                <span className="arrow" style={{ color: "var(--ink-muted)" }}>outcomes only</span>
              </div>
            </div>

            <div className="cnb1-layer-stack">
              <div className="cnb1-band outcomes">
                <span className="band-key">Outcomes + AI Assist</span>
                <span className="band-name">Faster decisions. Lower aging. Higher evidence completeness.</span>
                <span className="band-desc">Weekly measurement. AI accelerates capture, execution, measurement.</span>
              </div>
              <div className="cnb1-band">
                <span className="band-key">Product Suite</span>
                <span className="band-name">Pre-validated templates by domain.</span>
                <span className="band-desc">QMS, DMS, PLM, MES, EHS, Supplier Quality, Training. Mapped to how customers think.</span>
              </div>
              <div className="cnb1-band">
                <span className="band-key">Workflow Components</span>
                <span className="band-name">Stages, gates, roles, approvals, evidence requirements.</span>
                <span className="band-desc">No-code building blocks. Composed by you. Read by AI.</span>
              </div>
              <div className="cnb1-band">
                <span className="band-key">Core Platform</span>
                <span className="band-name">Audit model. Permissions. Reliability. Connector strategy.</span>
                <span className="band-desc">The foundation that makes the bands above trustworthy.</span>
              </div>
            </div>

            <div className="cnb1-layer-side">
              <div className="lab">Where work happens</div>
              <div className="cnb1-cm-chip"><span className="nm">SharePoint</span><span className="arrow">. artifacts</span></div>
              <div className="cnb1-cm-chip"><span className="nm">Excel trackers</span><span className="arrow">. artifacts</span></div>
              <div className="cnb1-cm-chip"><span className="nm">Outlook</span><span className="arrow">. decisions</span></div>
              <div className="cnb1-cm-chip"><span className="nm">Microsoft Teams</span><span className="arrow">. decisions</span></div>
              <div className="cnb1-cm-chip" style={{ borderColor: "rgba(0,82,255,0.4)" }}>
                <span className="nm">Captured</span>
                <span className="arrow" style={{ color: "var(--ink-muted)" }}>into the thread</span>
              </div>
            </div>
          </div>
          <p className="cnb1-layer-callout">
            <b>Architectural detail.</b> The differentiation is the thread you saw in sections 01
            and 02. This stack is what makes that thread trustworthy at audit, scale, and rate.
          </p>
        </div>
      </section>

      {/* SECTION 08 . AI (dark) */}
      <section className="cnb1-section dark" id="ai">
        <div className="cnb1-inner">
          <div>
            <div className="cnb1-eyebrow">
              <span className="num">08</span>
              <span>What AI changes. And what has to be true first.</span>
              <span className="line" />
            </div>
            <h2 className="cnb1-h2">
              AI compounds on governed coordination.{" "}
              <span className="dim">It does not compound on email.</span>
            </h2>
            <p className="cnb1-sub" style={{ marginTop: 22 }}>
              When the thread is the work, AI has something durable to read. Three levels, in sequence.
            </p>
          </div>
          <div className="cnb1-ai">
            <div className="cnb1-ai-step">
              <span className="lvl">Level 1 / Execution</span>
              <span className="name">AI moves the thread.</span>
              <span className="desc">
                Drafts the next step. Surfaces missing evidence. Routes the right approver.
                People approve. Work moves.
              </span>
              <span className="lock"><b>Locked by:</b> the thread becoming the unit of work.</span>
            </div>
            <div className="cnb1-ai-step">
              <span className="lvl">Level 2 / Understanding</span>
              <span className="name">AI reads across threads.</span>
              <span className="desc">
                Recurring root causes. Bottleneck patterns. Processes diverging from how they
                were drawn. Map and territory reconciled weekly.
              </span>
              <span className="lock"><b>Locked by:</b> Level 1 producing structured data.</span>
            </div>
            <div className="cnb1-ai-step">
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

      {/* SECTION 09 . PROOF (light) */}
      <section className="cnb1-section light" id="proof">
        <div className="cnb1-inner">
          <div>
            <div className="cnb1-eyebrow">
              <span className="num">09</span>
              <span>Proof at the level we can claim it.</span>
              <span className="line" />
            </div>
            <h2 className="cnb1-h2">
              We are not the tenth QMS.{" "}
              <span className="dim">We are what the QMS connects to so it can close cleanly.</span>
            </h2>
          </div>
          <div className="cnb1-proof-card">
            <p className="cnb1-proof-quote">
              We stopped reconstructing investigations from email.{" "}
              <span className="blue">The thread is the investigation now.</span>{" "}
              Audit prep used to take weeks. It takes an afternoon.
            </p>
            <div className="cnb1-proof-meta">
              <span className="name">VP Quality</span>
              <span className="role">Class II medical device manufacturer . ISO 13485 / 21 CFR Part 11</span>
              <span className="stamp">Advocacy . Customer-attributed quote</span>
            </div>
          </div>
          <p className="cnb1-sub" style={{ marginTop: 12 }}>
            We make claims at the level our proof supports. Today that is testimonials and
            qualitative workflow descriptions in Medical Devices, Aerospace, Laboratories and
            Industrial Machinery.
          </p>
        </div>
      </section>

      {/* SECTION 10 . CTA (dark) */}
      <section className="cnb1-section dark" id="cta">
        <div className="cnb1-inner" style={{ textAlign: "center", alignItems: "center" }}>
          <div className="cnb1-eyebrow" style={{ justifyContent: "center" }}>
            <span className="line" />
            <span>Forty-five minutes. Your process. Your numbers.</span>
            <span className="line" />
          </div>
          <h2 className="cnb1-cta-h">
            Walk through your week.<br />As one governed thread.
          </h2>
          <p className="cnb1-sub" style={{ margin: "0 auto" }}>
            We pick one of your processes and rebuild it as a single accountable thread on screen.
            You leave with a baseline number for your coordination tax.
          </p>
          <div className="cnb1-cta-actions">
            <button className="cnb1-btn-primary cnb1-btn-blue">
              Book a demo
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <a href="#tax" className="cnb1-btn-ghost">Calculate your coordination tax</a>
          </div>
        </div>
      </section>

      <footer className="cnb1-foot">
        <div className="cnb1-foot-inner">
          <span>
            (c) {new Date().getFullYear()} Unifize. Coordination tax, visible, measurable, reducible.
            For regulated processes.
          </span>
          <span className="mono">Concept B v1 . Product-led</span>
        </div>
      </footer>
    </div>
  );
}
