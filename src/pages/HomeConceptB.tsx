import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * Concept B ·Platform first. Frame second.
 *
 * Contrarian to Concept A. Same design system, same chrome, same tokens.
 * The hero shows the platform working, not the problem. The framework
 * (system of record vs system of coordination, coordination tax) explains
 * why it works, after the buyer has seen what it does.
 *
 * - Hero is dark and shows a live working thread (Chat-style product UI).
 * - Section 2: this is your work today, fragmented across four tools.
 * - Section 3: the same work on Unifize, as one thread.
 * - Section 4: the gap has a name. Coordination tax. Pillars beat (dark).
 * - Section 5: where it shows up. 15 domains.
 * - Section 6: how it connects. Concept Map / four-band stack.
 * - Section 7: AI implication (dark).
 * - Section 8: proof.
 * - Section 9: CTA (dark).
 *
 * No purple. No em dashes. No record-type labels in the hero collage.
 * Tagline + descriptor in nav. Unifize blue #0052FF.
 */

const PERSONA_HOOKS = [
  { role: "VP Quality", line: "An investigation that closes in 21 days. With evidence." },
  { role: "Operations", line: "Hold released the same shift. Reason in the thread." },
  { role: "Regulatory", line: "Submission assembly as a byproduct, not a quarterly project." },
  { role: "CFO", line: "12 to 20 percent of payroll, recovered lane by lane." },
  { role: "CIO", line: "AI that compounds because the data is structured." },
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
.cnb-root {
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
.cnb-root * { box-sizing: border-box; }
.cnb-root .mono { font-family: var(--u-mono); }
.cnb-root a { color: inherit; text-decoration: none; }

/* ---------- NAV (shared with Concept A) ---------- */
.cnb-nav {
  position: sticky; top: 0; z-index: 50;
  backdrop-filter: saturate(160%) blur(18px);
  background: rgba(8,9,10,0.72);
  border-bottom: 1px solid var(--border);
}
.cnb-nav-inner {
  max-width: 1280px; margin: 0 auto;
  padding: 14px 28px;
  display: flex; align-items: center; gap: 36px;
}
.cnb-nav-logo {
  display: inline-flex; flex-direction: column; gap: 2px;
}
.cnb-nav-logo .word {
  font-size: 17px; font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1;
}
.cnb-nav-logo .word b { color: var(--u-primary); font-weight: 700; }
.cnb-nav-logo .tag {
  font-family: var(--u-mono);
  font-size: 9.5px; letter-spacing: 0.08em;
  color: var(--text-faint);
  text-transform: uppercase;
}
.cnb-nav-items {
  display: flex; gap: 24px;
  font-size: 13.5px; color: var(--text-muted);
  margin-left: 16px;
}
.cnb-nav-items a:hover { color: var(--text); }
.cnb-nav-actions { margin-left: auto; display: flex; gap: 16px; align-items: center; }
.cnb-nav-link { font-size: 13.5px; color: var(--text-muted); }
.cnb-nav-link:hover { color: var(--text); }
.cnb-btn-primary {
  font-family: inherit; font-size: 13px; font-weight: 500;
  background: white; color: var(--ink);
  padding: 8px 16px; border-radius: 999px;
  border: 1px solid white; cursor: pointer;
  display: inline-flex; align-items: center; gap: 7px;
  transition: background .15s;
}
.cnb-btn-primary:hover { background: #EBECEE; }
.cnb-btn-blue { background: var(--u-primary); color: white; border-color: var(--u-primary); }
.cnb-btn-blue:hover { background: var(--u-primary-hover); border-color: var(--u-primary-hover); }
.cnb-btn-ghost {
  font-family: inherit; font-size: 13px; font-weight: 500;
  background: transparent; color: var(--text);
  padding: 8px 16px; border-radius: 999px;
  border: 1px solid var(--border-strong);
  cursor: pointer;
  display: inline-flex; align-items: center; gap: 7px;
  transition: background .15s, border-color .15s;
}
.cnb-btn-ghost:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.28); }
.cnb-light .cnb-btn-ghost { color: var(--ink); border-color: var(--ink-line-strong); }
.cnb-light .cnb-btn-ghost:hover { background: rgba(11,13,17,0.04); }
.cnb-light .cnb-btn-primary { background: var(--ink); color: white; border-color: var(--ink); }
@media (max-width: 980px) { .cnb-nav-items { display: none; } }

/* ---------- SECTION ---------- */
.cnb-section {
  min-height: 100vh;
  display: flex; flex-direction: column;
  position: relative;
}
.cnb-section.dark { background: var(--bg); color: var(--text); }
.cnb-section.light { background: var(--paper); color: var(--ink); }
.cnb-section.papersoft { background: var(--paper-soft); color: var(--ink); }
.cnb-inner {
  flex: 1;
  max-width: 1280px; width: 100%;
  margin: 0 auto;
  padding: 100px 28px;
  display: flex; flex-direction: column; gap: 48px;
  justify-content: center;
}
.cnb-section.light, .cnb-section.papersoft,
.cnb-light, .cnb-papersoft {
  --text: var(--ink);
  --text-muted: var(--ink-muted);
  --text-faint: var(--ink-faint);
  --border: var(--ink-line);
  --border-strong: var(--ink-line-strong);
  --bg-card: var(--paper-card);
}

.cnb-eyebrow {
  font-family: var(--u-mono);
  font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--text-faint);
  display: flex; align-items: center; gap: 12px;
}
.cnb-eyebrow .num {
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 2px 7px;
}
.cnb-eyebrow .line { width: 80px; height: 1px; background: var(--border); }

.cnb-h1 {
  font-size: clamp(40px, 6.4vw, 84px);
  font-weight: 500;
  line-height: 0.96;
  letter-spacing: -0.044em;
  margin: 0;
  max-width: 22ch;
}
.cnb-h1 .accent { color: var(--u-primary); font-weight: 500; }
.cnb-h2 {
  font-size: clamp(32px, 4.6vw, 56px);
  line-height: 1.04; letter-spacing: -0.034em;
  font-weight: 500; margin: 0;
  max-width: 22ch;
}
.cnb-h2 .dim { color: var(--text-muted); }
.cnb-sub {
  margin: 0; font-size: 17px; color: var(--text-muted);
  max-width: 56ch; line-height: 1.5;
}

/* ---------- HERO ---------- */
.cnb-hero { min-height: calc(100vh - 60px); }
.cnb-hero-inner {
  max-width: 1340px; margin: 0 auto;
  padding: 80px 28px 60px;
  flex: 1;
  display: flex; flex-direction: column; gap: 48px; align-items: center;
}
.cnb-hero-copy {
  text-align: center; max-width: 920px;
  display: flex; flex-direction: column; align-items: center; gap: 20px;
}
.cnb-hero-tag {
  font-family: var(--u-mono);
  font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--text-faint);
  display: inline-flex; align-items: center; gap: 10px;
}
.cnb-hero-tag .dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--u-primary);
  box-shadow: 0 0 0 3px rgba(0,82,255,0.22);
}
.cnb-hero-h1 {
  font-size: clamp(44px, 6.8vw, 92px);
  font-weight: 500; line-height: 0.96; letter-spacing: -0.046em;
  margin: 0; max-width: 18ch;
}
.cnb-hero-h1 .accent { color: var(--u-primary); }
.cnb-hero-sub {
  margin-top: 10px;
  font-size: 18px; color: var(--text-muted); max-width: 56ch; line-height: 1.5;
}
.cnb-hero-cta {
  margin-top: 24px;
  display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;
}

/* ---------- LIVE THREAD (hero) ---------- */
.cnb-thread-wrap {
  position: relative;
  width: 100%; max-width: 1180px;
  isolation: isolate;
}
.cnb-thread-glow {
  position: absolute; inset: -80px -40px auto -40px;
  height: 360px;
  background:
    radial-gradient(60% 50% at 50% 20%, rgba(0,82,255,0.40) 0%, rgba(0,82,255,0) 70%),
    radial-gradient(40% 50% at 25% 30%, rgba(77,133,255,0.30) 0%, rgba(77,133,255,0) 70%);
  filter: blur(28px); pointer-events: none; z-index: -1;
}
.cnb-thread {
  background: var(--paper-card);
  border: 1px solid var(--border-strong);
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
@media (max-width: 1180px) { .cnb-thread { grid-template-columns: 56px 240px 1fr; } .cnb-thread .checklist { display: none; } }
@media (max-width: 860px) { .cnb-thread { grid-template-columns: 56px 1fr; } .cnb-thread .conversations { display: none; } }

/* product nav (left rail) */
.cnb-thread .nav {
  background: var(--paper-card);
  border-right: 1px solid var(--ink-line);
  display: flex; flex-direction: column; align-items: center;
  padding: 14px 0; gap: 4px;
}
.cnb-thread .nav .logo {
  width: 32px; height: 32px;
  background: var(--u-primary);
  color: white; border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 14px;
  letter-spacing: -0.03em; margin-bottom: 14px;
}
.cnb-thread .nav .ico {
  width: 36px; height: 36px; border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  color: var(--ink-faint); cursor: pointer;
}
.cnb-thread .nav .ico.active { background: var(--u-primary-tint); color: var(--u-primary); }

/* conversations list */
.cnb-thread .conversations {
  background: var(--paper-card);
  border-right: 1px solid var(--ink-line);
  display: flex; flex-direction: column; min-width: 0;
}
.cnb-thread .list-head {
  padding: 14px 16px 10px;
  border-bottom: 1px solid var(--ink-line);
}
.cnb-thread .list-head .org {
  font-family: var(--u-mono); font-size: 10px;
  text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--ink-faint);
}
.cnb-thread .list-head .title {
  font-size: 15px; font-weight: 600; letter-spacing: -0.015em;
  margin-top: 4px;
}
.cnb-thread .conv {
  padding: 10px 16px; border-bottom: 1px solid var(--ink-line);
  cursor: pointer; min-width: 0; position: relative;
}
.cnb-thread .conv.selected { background: var(--u-primary-tint); }
.cnb-thread .conv.selected::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0;
  width: 2px; background: var(--u-primary);
}
.cnb-thread .conv-top { display: flex; justify-content: space-between; gap: 8px; }
.cnb-thread .conv-title {
  font-size: 12.5px; font-weight: 500; letter-spacing: -0.005em;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.cnb-thread .conv-time { font-family: var(--u-mono); font-size: 9.5px; color: var(--ink-faint); }
.cnb-thread .conv-preview {
  font-size: 11.5px; color: var(--ink-muted); margin-top: 2px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.cnb-thread .conv-tag {
  display: inline-block;
  font-family: var(--u-mono); font-size: 9.5px;
  padding: 1px 5px; border-radius: 2px;
  margin-top: 6px;
  background: #EEF0F2; color: var(--ink-muted);
}
.cnb-thread .conv-tag.ok { background: #E8F5EF; color: #0B8A5C; }
.cnb-thread .conv-tag.warn { background: #FBF2E2; color: #B4731A; }

/* main thread */
.cnb-thread .main {
  background: var(--paper-card);
  display: flex; flex-direction: column;
  min-width: 0;
}
.cnb-thread .head {
  padding: 14px 22px;
  border-bottom: 1px solid var(--ink-line);
}
.cnb-thread .head .nc {
  font-family: var(--u-mono); font-size: 11px;
  color: var(--ink-faint); letter-spacing: 0.04em;
}
.cnb-thread .head h2 {
  font-size: 18px; font-weight: 600; letter-spacing: -0.018em;
  margin: 4px 0 8px;
}
.cnb-thread .head .meta {
  display: flex; gap: 8px; flex-wrap: wrap;
  font-size: 11px;
}
.cnb-thread .pill {
  font-family: var(--u-mono); font-size: 10px;
  padding: 2px 6px; border-radius: 2px;
  background: #EEF0F2; color: var(--ink-muted);
}
.cnb-thread .pill.ok { background: #E8F5EF; color: #0B8A5C; }
.cnb-thread .pill.info { background: var(--u-primary-tint); color: var(--u-primary); }
.cnb-thread .scroll {
  flex: 1; overflow: auto;
  padding: 16px 22px;
  display: flex; flex-direction: column; gap: 16px;
}
.cnb-thread .msg {
  display: grid; grid-template-columns: 28px 1fr; gap: 10px;
}
.cnb-thread .msg .av {
  width: 28px; height: 28px; border-radius: 50%;
  background: linear-gradient(180deg, #C4D0E8, #8F9FBF);
  flex-shrink: 0;
}
.cnb-thread .msg.ai .av { background: var(--u-primary); }
.cnb-thread .msg .body { min-width: 0; }
.cnb-thread .msg .name { font-size: 12.5px; font-weight: 500; }
.cnb-thread .msg .name .role {
  font-weight: 400; color: var(--ink-faint); margin-left: 6px;
  font-family: var(--u-mono); font-size: 10px;
}
.cnb-thread .msg .text {
  font-size: 13px; color: var(--ink); margin-top: 4px;
  line-height: 1.5;
}
.cnb-thread .msg.ai .text {
  background: var(--u-primary-tint);
  border-left: 2px solid var(--u-primary);
  padding: 10px 12px;
  border-radius: 4px;
  color: var(--ink);
}
.cnb-thread .evidence {
  border: 1px solid var(--ink-line);
  border-radius: 4px;
  padding: 10px 12px;
  margin-top: 8px;
  background: #FBFBFC;
  display: flex; gap: 10px; align-items: center;
}
.cnb-thread .evidence .ico {
  width: 28px; height: 28px; border-radius: 4px;
  background: var(--u-primary-tint);
  color: var(--u-primary);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--u-mono); font-size: 10px;
}
.cnb-thread .evidence .nm { font-size: 12px; font-weight: 500; }
.cnb-thread .evidence .meta { font-family: var(--u-mono); font-size: 10px; color: var(--ink-faint); }

.cnb-thread .compose {
  border-top: 1px solid var(--ink-line);
  padding: 12px 18px;
  display: flex; gap: 10px; align-items: center;
}
.cnb-thread .compose .input {
  flex: 1;
  background: var(--paper-soft);
  border: 1px solid var(--ink-line);
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 12.5px;
  color: var(--ink-faint);
}
.cnb-thread .compose .send {
  background: var(--u-primary);
  color: white;
  border: 0; border-radius: 4px;
  padding: 8px 12px; font-size: 12.5px;
  font-weight: 500;
}

/* checklist (right rail) */
.cnb-thread .checklist {
  background: var(--paper-card);
  border-left: 1px solid var(--ink-line);
  padding: 16px 18px;
  display: flex; flex-direction: column; gap: 14px;
  overflow: auto;
}
.cnb-thread .checklist h3 {
  font-size: 12px; font-weight: 600; letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--ink-muted); margin: 0;
}
.cnb-thread .check {
  display: grid; grid-template-columns: 18px 1fr;
  gap: 10px; align-items: flex-start;
}
.cnb-thread .check .box {
  width: 16px; height: 16px;
  border: 1.5px solid var(--ink-line-strong);
  border-radius: 3px;
  margin-top: 1px;
}
.cnb-thread .check.done .box {
  background: var(--u-primary);
  border-color: var(--u-primary);
  position: relative;
}
.cnb-thread .check.done .box::after {
  content: ""; position: absolute;
  top: 3px; left: 5px;
  width: 4px; height: 8px;
  border: solid white; border-width: 0 1.5px 1.5px 0;
  transform: rotate(45deg);
}
.cnb-thread .check .lbl {
  font-size: 12px; line-height: 1.4;
}
.cnb-thread .check .meta {
  font-family: var(--u-mono);
  font-size: 9.5px; color: var(--ink-faint);
  margin-top: 2px;
}

/* persona ribbon */
.cnb-persona-rotator {
  margin-top: 12px;
  padding: 10px 16px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: rgba(255,255,255,0.025);
  display: inline-flex; align-items: center; gap: 14px;
}
.cnb-persona-rotator .lab {
  font-family: var(--u-mono);
  font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--text-faint);
}
.cnb-persona-rotator .role {
  font-size: 13px; color: var(--text); font-weight: 500;
  min-width: 14ch;
}
.cnb-persona-rotator .line {
  font-size: 13px; color: var(--text-muted);
}

/* ---------- BEFORE ---------- */
.cnb-before {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 32px;
}
@media (max-width: 980px) { .cnb-before { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .cnb-before { grid-template-columns: 1fr; } }
.cnb-before-card {
  background: white;
  border: 1px solid var(--ink-line);
  border-radius: 8px;
  padding: 24px 22px;
  display: flex; flex-direction: column; gap: 14px;
  min-height: 280px;
  position: relative;
}
.cnb-before-card .src {
  font-family: var(--u-mono);
  font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ink-faint);
  display: flex; align-items: center; gap: 8px;
}
.cnb-before-card .src .dot {
  width: 8px; height: 8px; border-radius: 2px;
  background: var(--ink-line-strong);
}
.cnb-before-card .stat {
  font-size: 32px; font-weight: 500;
  letter-spacing: -0.026em;
}
.cnb-before-card .label { font-size: 13px; color: var(--ink-muted); line-height: 1.45; }
.cnb-before-card .lines {
  margin-top: auto; padding-top: 16px;
  border-top: 1px dashed var(--ink-line);
  display: flex; flex-direction: column; gap: 6px;
}
.cnb-before-card .lines .ln {
  height: 5px; border-radius: 2px;
  background: rgba(11,13,17,0.08);
}
.cnb-before-card .lines .ln.short { width: 60%; }
.cnb-before-card .lines .ln.mid { width: 80%; }

.cnb-aggregate {
  margin-top: 24px;
  background: white;
  border: 1px solid #C4303A33;
  border-radius: 10px;
  padding: 28px 32px;
  display: flex; gap: 32px; align-items: center; flex-wrap: wrap;
}
.cnb-aggregate .num {
  font-size: 64px; font-weight: 500; letter-spacing: -0.04em;
  line-height: 1; color: #C4303A;
}
.cnb-aggregate .copy {
  flex: 1; min-width: 240px;
  font-size: 17px; color: var(--ink); line-height: 1.4;
}
.cnb-aggregate .copy b { font-weight: 600; }

/* ---------- AFTER ---------- */
.cnb-after {
  display: grid; grid-template-columns: 0.9fr 1.1fr;
  gap: 32px; align-items: stretch;
  margin-top: 32px;
}
@media (max-width: 980px) { .cnb-after { grid-template-columns: 1fr; } }
.cnb-after-stats {
  background: white;
  border: 1px solid #0B8A5C33;
  border-radius: 12px;
  padding: 36px;
  display: flex; flex-direction: column; gap: 20px;
}
.cnb-after-stats .head {
  font-family: var(--u-mono);
  font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase;
  color: #0B8A5C;
}
.cnb-after-stats .row {
  display: flex; justify-content: space-between; align-items: baseline;
  padding: 14px 0;
  border-bottom: 1px dashed var(--ink-line);
}
.cnb-after-stats .row:last-child { border-bottom: 0; }
.cnb-after-stats .lab { font-size: 14px; color: var(--ink-muted); }
.cnb-after-stats .val { font-family: var(--u-mono); font-size: 22px; color: var(--ink); }
.cnb-after-stats .delta { font-size: 12px; color: #0B8A5C; margin-left: 8px; }

.cnb-after-thread {
  background: white;
  border: 1px solid var(--ink-line);
  border-radius: 12px;
  padding: 28px;
  display: flex; flex-direction: column; gap: 14px;
}
.cnb-after-thread .head {
  display: flex; justify-content: space-between; align-items: baseline;
  border-bottom: 1px solid var(--ink-line);
  padding-bottom: 14px;
}
.cnb-after-thread .head .id {
  font-family: var(--u-mono); font-size: 11px;
  color: var(--ink-faint); letter-spacing: 0.06em;
}
.cnb-after-thread .head .stat {
  font-family: var(--u-mono); font-size: 11px; color: #0B8A5C;
}
.cnb-after-thread .step {
  display: grid; grid-template-columns: 18px 1fr 64px;
  gap: 12px; align-items: center;
  padding: 9px 0;
}
.cnb-after-thread .step .dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: var(--u-primary);
  margin-left: 4px;
}
.cnb-after-thread .step.terminal .dot { background: #0B8A5C; box-shadow: 0 0 0 4px rgba(11,138,92,0.18); }
.cnb-after-thread .step .lbl { font-size: 13.5px; }
.cnb-after-thread .step .day {
  font-family: var(--u-mono); font-size: 11px;
  color: var(--ink-faint); text-align: right;
}

/* ---------- TAX BAND ---------- */
.cnb-tax-headline {
  font-size: clamp(48px, 8vw, 112px);
  line-height: 0.96;
  letter-spacing: -0.05em;
  font-weight: 500; margin: 0;
}
.cnb-tax-headline .blue { color: var(--u-primary); }
.cnb-tax-pillars {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 40px;
}
@media (max-width: 900px) { .cnb-tax-pillars { grid-template-columns: 1fr; } }
.cnb-pillar {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 28px 26px;
  background: rgba(255,255,255,0.02);
  display: flex; flex-direction: column; gap: 12px;
  min-height: 260px;
}
.cnb-pillar .key {
  font-family: var(--u-mono); font-size: 11px;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--u-primary);
}
.cnb-pillar .name {
  font-size: 22px; font-weight: 500; letter-spacing: -0.022em;
}
.cnb-pillar .desc {
  font-size: 14px; color: var(--text-muted); line-height: 1.5;
}

/* ---------- DOMAINS ---------- */
.cnb-domains {
  display: grid; grid-template-columns: repeat(5, 1fr);
  gap: 1px;
  background: var(--ink-line);
  border: 1px solid var(--ink-line);
  border-radius: 12px;
  overflow: hidden;
  margin-top: 32px;
}
@media (max-width: 1080px) { .cnb-domains { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 720px) { .cnb-domains { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .cnb-domains { grid-template-columns: 1fr; } }
.cnb-domain {
  background: white;
  padding: 22px 18px;
  display: flex; flex-direction: column; gap: 6px;
  min-height: 130px;
  transition: background .15s;
}
.cnb-domain:hover { background: var(--u-primary-tint); }
.cnb-domain .nm { font-size: 14.5px; font-weight: 500; letter-spacing: -0.012em; }
.cnb-domain .who { font-size: 12px; color: var(--ink-muted); }
.cnb-domain .trig {
  margin-top: auto;
  font-family: var(--u-mono); font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--ink-faint);
}

/* ---------- CONCEPT MAP ---------- */
.cnb-cm {
  display: grid; grid-template-columns: 1fr 2fr 1fr;
  gap: 12px;
  margin-top: 40px;
  align-items: stretch;
}
@media (max-width: 980px) { .cnb-cm { grid-template-columns: 1fr; } }
.cnb-cm-side {
  display: flex; flex-direction: column; gap: 10px;
}
.cnb-cm-side .lab {
  font-family: var(--u-mono);
  font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 4px;
}
.cnb-cm-chip {
  border: 1px solid var(--ink-line);
  background: white;
  border-radius: 6px;
  padding: 14px 16px;
  display: flex; flex-direction: column; gap: 4px;
}
.cnb-cm-chip .nm { font-size: 13.5px; font-weight: 500; }
.cnb-cm-chip .arrow {
  font-family: var(--u-mono);
  font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--u-primary);
}
.cnb-cm-center {
  border: 1px solid var(--ink-line);
  border-radius: 14px;
  background: var(--paper-card);
  overflow: hidden;
}
.cnb-band {
  padding: 22px 24px;
  border-bottom: 1px solid var(--ink-line);
  display: flex; flex-direction: column; gap: 6px;
}
.cnb-band:last-child { border-bottom: 0; }
.cnb-band .band-key {
  font-family: var(--u-mono);
  font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--ink-faint);
}
.cnb-band .band-name {
  font-size: 17px; font-weight: 500; letter-spacing: -0.018em;
}
.cnb-band .band-desc { font-size: 13px; color: var(--ink-muted); line-height: 1.45; }
.cnb-band.outcomes {
  background: linear-gradient(180deg, rgba(0,82,255,0.08), rgba(0,82,255,0.02));
  border-bottom-color: rgba(0,82,255,0.18);
}
.cnb-band.outcomes .band-key { color: var(--u-primary); }

/* ---------- AI ---------- */
.cnb-ai {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 40px;
}
@media (max-width: 900px) { .cnb-ai { grid-template-columns: 1fr; } }
.cnb-ai-step {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 32px 28px;
  background: rgba(255,255,255,0.02);
  display: flex; flex-direction: column; gap: 14px;
  min-height: 320px;
}
.cnb-ai-step .lvl {
  font-family: var(--u-mono);
  font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--u-primary);
}
.cnb-ai-step .name { font-size: 22px; font-weight: 500; letter-spacing: -0.022em; }
.cnb-ai-step .desc { font-size: 14px; color: var(--text-muted); line-height: 1.55; }
.cnb-ai-step .lock {
  margin-top: auto; padding-top: 16px;
  border-top: 1px solid var(--border);
  font-size: 12.5px; color: var(--text-muted);
}
.cnb-ai-step .lock b { color: var(--text); font-weight: 500; }

/* ---------- PROOF ---------- */
.cnb-proof-card {
  background: white;
  border: 1px solid var(--ink-line);
  border-radius: 14px;
  padding: 48px 44px;
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 48px; align-items: center;
  margin-top: 32px;
}
@media (max-width: 900px) { .cnb-proof-card { grid-template-columns: 1fr; padding: 32px; } }
.cnb-proof-quote {
  font-size: 26px; line-height: 1.3; letter-spacing: -0.022em;
  font-weight: 500; margin: 0;
}
.cnb-proof-quote .blue { color: var(--u-primary); }
.cnb-proof-meta { display: flex; flex-direction: column; gap: 14px; }
.cnb-proof-meta .name { font-size: 15px; font-weight: 500; }
.cnb-proof-meta .role { font-size: 13px; color: var(--ink-muted); }
.cnb-proof-meta .stamp {
  font-family: var(--u-mono);
  font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ink-faint);
  margin-top: 8px; border-top: 1px solid var(--ink-line); padding-top: 14px;
}

/* ---------- CTA ---------- */
.cnb-cta-h {
  font-size: clamp(40px, 6vw, 80px);
  font-weight: 500; letter-spacing: -0.044em;
  line-height: 1; margin: 0;
  max-width: 18ch;
}
.cnb-cta-actions {
  margin-top: 36px;
  display: inline-flex; gap: 14px; flex-wrap: wrap;
}

/* ---------- FOOTER ---------- */
.cnb-foot {
  border-top: 1px solid var(--border);
  background: var(--bg);
  color: var(--text-muted);
  padding: 28px;
}
.cnb-foot-inner {
  max-width: 1280px; margin: 0 auto;
  display: flex; justify-content: space-between; align-items: center;
  font-size: 12px; flex-wrap: wrap; gap: 16px;
}
`;

export default function HomeConceptB() {
  const [pIdx, setPIdx] = useState(0);

  useEffect(() => {
    document.title = "Concept B ·Platform first. Frame second.";
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setPIdx((i) => (i + 1) % PERSONA_HOOKS.length), 3200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="cnb-root">
      <style>{STYLES}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;550;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* Nav */}
      <nav className="cnb-nav">
        <div className="cnb-nav-inner">
          <Link to="/concept-b" className="cnb-nav-logo" aria-label="Unifize">
            <span className="word">unifize<b>.</b></span>
            <span className="tag">People · Process · AI · Outcomes</span>
          </Link>
          <div className="cnb-nav-items">
            <a href="#today">The Problem</a>
            <a href="#world">Your World</a>
            <a href="#how">How It Works</a>
            <a href="#proof">Proof</a>
          </div>
          <div className="cnb-nav-actions">
            <a href="#login" className="cnb-nav-link">Log in</a>
            <button className="cnb-btn-primary cnb-btn-blue">Book a demo</button>
          </div>
        </div>
      </nav>

      {/* SECTION 1 ·HERO with live thread (dark) */}
      <section className="cnb-section dark cnb-hero" id="hero">
        <div className="cnb-hero-inner">
          <div className="cnb-hero-copy">
            <div className="cnb-hero-tag">
              <span className="dot" />
              <span>One thread. From trigger to signed outcome.</span>
            </div>
            <h1 className="cnb-hero-h1">
              The <span className="accent">layer</span> between your record<br />and where the work actually happens.
            </h1>
            <p className="cnb-hero-sub">
              Your record stays the record. Coordination stops living in email. Decisions, evidence,
              approvals and handoffs land in a single accountable thread, and write back to the system
              that owns the outcome.
            </p>
            <div className="cnb-hero-cta">
              <button className="cnb-btn-primary cnb-btn-blue">
                Book a demo
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <a href="#today" className="cnb-btn-ghost">See what it replaces</a>
            </div>
            <div className="cnb-persona-rotator" aria-live="polite">
              <span className="lab">For the</span>
              <span className="role">{PERSONA_HOOKS[pIdx].role}</span>
              <span className="line">{PERSONA_HOOKS[pIdx].line}</span>
            </div>
          </div>

          {/* Live working thread mock ·design tokens from product files */}
          <div className="cnb-thread-wrap">
            <div className="cnb-thread-glow" aria-hidden />
            <div className="cnb-thread" role="img" aria-label="Unifize thread preview">
              {/* Left rail */}
              <div className="nav">
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
                  <div className="org">Quality · Site 2</div>
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
                  <div className="conv-preview">Drawing change. R&D · QA · Manufacturing.</div>
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
                  <span className="nc">REC-2412 · Class II device · Site 2</span>
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
                          <div className="meta">Bound to step 03 · Mar 27</div>
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
                    <div className="meta">Step 00 · Production</div>
                  </div>
                </div>
                <div className="check done">
                  <div className="box" />
                  <div>
                    <div className="lbl">Owner assigned</div>
                    <div className="meta">Step 01 · Role-based</div>
                  </div>
                </div>
                <div className="check done">
                  <div className="box" />
                  <div>
                    <div className="lbl">Decision captured</div>
                    <div className="meta">Step 02 · Linked to evidence</div>
                  </div>
                </div>
                <div className="check done">
                  <div className="box" />
                  <div>
                    <div className="lbl">Evidence bound</div>
                    <div className="meta">Step 03 · 6 attachments</div>
                  </div>
                </div>
                <div className="check">
                  <div className="box" />
                  <div>
                    <div className="lbl">Approval stamp</div>
                    <div className="meta">Step 04 · 21 CFR 11</div>
                  </div>
                </div>
                <div className="check">
                  <div className="box" />
                  <div>
                    <div className="lbl">Effectiveness verified</div>
                    <div className="meta">Step 06 · 30 day window</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 ·TODAY (light) */}
      <section className="cnb-section light" id="today">
        <div className="cnb-inner">
          <div>
            <div className="cnb-eyebrow">
              <span className="num">02</span>
              <span>Today, that thread does not exist.</span>
              <span className="line" />
            </div>
            <h2 className="cnb-h2">
              The same record gets reconstructed across four tools.{" "}
              <span className="dim">Every time. By memory. Three weeks late.</span>
            </h2>
            <p className="cnb-sub" style={{ marginTop: 22 }}>
              This is not a process problem. It is a layer problem. No system owns the work between
              the systems.
            </p>
          </div>

          <div className="cnb-before">
            <div className="cnb-before-card">
              <div className="src"><span className="dot" /> Microsoft Teams</div>
              <div className="stat">17</div>
              <div className="label">Messages across two channels. Decisions made. Never written down.</div>
              <div className="lines">
                <div className="ln" />
                <div className="ln mid" />
                <div className="ln short" />
              </div>
            </div>
            <div className="cnb-before-card">
              <div className="src"><span className="dot" /> Outlook</div>
              <div className="stat">14</div>
              <div className="label">People on a thread three weeks deep. Approval lost in the middle.</div>
              <div className="lines">
                <div className="ln" />
                <div className="ln" />
                <div className="ln mid" />
              </div>
            </div>
            <div className="cnb-before-card">
              <div className="src"><span className="dot" /> SharePoint</div>
              <div className="stat">14</div>
              <div className="label">Versions in a folder. Three of them named FINAL. None of them reviewable.</div>
              <div className="lines">
                <div className="ln short" />
                <div className="ln mid" />
                <div className="ln" />
              </div>
            </div>
            <div className="cnb-before-card">
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

          <div className="cnb-aggregate">
            <div className="num">92d</div>
            <div className="copy">
              <b>Time to close one record.</b> Five days of actual work. Eighty-seven days of waiting,
              re-asking, rebuilding context. Audit prep starts at day ninety-two and adds another two weeks.
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 ·ON UNIFIZE (paper soft) */}
      <section className="cnb-section papersoft" id="ideal">
        <div className="cnb-inner">
          <div>
            <div className="cnb-eyebrow">
              <span className="num">03</span>
              <span>On Unifize.</span>
              <span className="line" />
            </div>
            <h2 className="cnb-h2">
              Same record. One thread.{" "}
              <span className="dim">Trigger. Owner. Decision. Evidence. Approval. Handoff. Closed.</span>
            </h2>
            <p className="cnb-sub" style={{ marginTop: 22 }}>
              The platform is the place the work happens, not just where it gets logged after the fact.
              Outcomes write back to your system of record on close.
            </p>
          </div>

          <div className="cnb-after">
            <div className="cnb-after-stats">
              <div className="head">After Unifize · 21 days</div>
              <div className="row">
                <span className="lab">Cycle time</span>
                <span><span className="val">21d</span><span className="delta">↓ 77%</span></span>
              </div>
              <div className="row">
                <span className="lab">Reopens</span>
                <span><span className="val">0</span><span className="delta">from 3</span></span>
              </div>
              <div className="row">
                <span className="lab">Active vs. waiting</span>
                <span><span className="val">94%</span><span className="delta">active</span></span>
              </div>
              <div className="row">
                <span className="lab">Audit assembly</span>
                <span><span className="val">1 click</span><span className="delta">on close</span></span>
              </div>
              <div className="row">
                <span className="lab">Evidence bound</span>
                <span><span className="val">6 / 6</span><span className="delta">complete</span></span>
              </div>
            </div>

            <div className="cnb-after-thread">
              <div className="head">
                <span className="id">REC-2412 · One governed thread</span>
                <span className="stat">CLOSED</span>
              </div>
              <div className="step"><span className="dot" /><span className="lbl">Trigger logged · Production hold</span><span className="day">D 0</span></div>
              <div className="step"><span className="dot" /><span className="lbl">Owner assigned · QA Ops</span><span className="day">D 0</span></div>
              <div className="step"><span className="dot" /><span className="lbl">Investigation captured · Five whys</span><span className="day">D 4</span></div>
              <div className="step"><span className="dot" /><span className="lbl">Evidence bound · Six attachments</span><span className="day">D 9</span></div>
              <div className="step"><span className="dot" /><span className="lbl">Approval · 21 CFR Part 11</span><span className="day">D 18</span></div>
              <div className="step terminal"><span className="dot" /><span className="lbl">Closed · Linked to ECO-0788</span><span className="day">D 21</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 ·NAME THE TAX (dark) */}
      <section className="cnb-section dark" id="tax">
        <div className="cnb-inner">
          <div>
            <div className="cnb-eyebrow">
              <span className="num">04</span>
              <span>The gap has a name.</span>
              <span className="line" />
            </div>
            <h2 className="cnb-tax-headline">
              Coordination <span className="blue">tax</span>.
            </h2>
            <p className="cnb-sub" style={{ marginTop: 28 }}>
              The structural cost of holding cross-functional work together when no system owns it
              end to end. Twelve to twenty percent of regulated payroll. Persistent. Compounding.
              It only goes down when three things are true.
            </p>
          </div>
          <div className="cnb-tax-pillars">
            <div className="cnb-pillar">
              <span className="key">01 / Visible</span>
              <span className="name">Threads, not folders.</span>
              <span className="desc">
                The work between systems gets a single accountable shape. Owner, decision,
                evidence, approval. Not a search across four tools.
              </span>
            </div>
            <div className="cnb-pillar">
              <span className="key">02 / Measurable</span>
              <span className="name">Cycle time, reopens, evidence completeness.</span>
              <span className="desc">
                Active vs. waiting time per stage. Lane by lane. The same numbers the CFO already
                tracks, finally connected to the work that produced them.
              </span>
            </div>
            <div className="cnb-pillar">
              <span className="key">03 / Reducible</span>
              <span className="name">Bind work to record at the moment of decision.</span>
              <span className="desc">
                Outcomes write back. Audit assembly is a byproduct. Lane targets shrink each
                week, not each quarter.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 ·DOMAINS (light) */}
      <section className="cnb-section light" id="world">
        <div className="cnb-inner">
          <div>
            <div className="cnb-eyebrow">
              <span className="num">05</span>
              <span>Where it shows up.</span>
              <span className="line" />
            </div>
            <h2 className="cnb-h2">
              Fifteen rooms. One layer.{" "}
              <span className="dim">Same shape every time. Different door, same tax inside.</span>
            </h2>
          </div>
          <div className="cnb-domains">
            {DOMAINS.map((d) => (
              <div key={d.label} className="cnb-domain">
                <span className="nm">{d.label}</span>
                <span className="who">{d.who}</span>
                <span className="trig">{d.trigger}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 ·CONCEPT MAP / FOUR BAND STACK (paper soft) */}
      <section className="cnb-section papersoft" id="how">
        <div className="cnb-inner">
          <div>
            <div className="cnb-eyebrow">
              <span className="num">06</span>
              <span>How it connects.</span>
              <span className="line" />
            </div>
            <h2 className="cnb-h2">
              Coexists with your record. Replaces the work between.{" "}
              <span className="dim">Outcomes on top. Core platform underneath.</span>
            </h2>
            <p className="cnb-sub" style={{ marginTop: 22 }}>
              Context flows in. Outcomes write back. Artifacts attach. Decisions get captured
              into the thread that holds them.
            </p>
          </div>
          <div className="cnb-cm">
            <div className="cnb-cm-side">
              <div className="lab">Systems of record</div>
              <div className="cnb-cm-chip"><span className="nm">QMS</span><span className="arrow">→ context</span></div>
              <div className="cnb-cm-chip"><span className="nm">ERP</span><span className="arrow">→ context</span></div>
              <div className="cnb-cm-chip"><span className="nm">PLM</span><span className="arrow">→ context</span></div>
              <div className="cnb-cm-chip"><span className="nm">MES / LIMS</span><span className="arrow">→ context</span></div>
              <div className="cnb-cm-chip" style={{ borderColor: "rgba(0,82,255,0.4)" }}>
                <span className="nm">Write-back</span>
                <span className="arrow" style={{ color: "var(--ink-muted)" }}>← outcomes only</span>
              </div>
            </div>

            <div className="cnb-cm-center">
              <div className="cnb-band outcomes">
                <span className="band-key">Outcomes + AI Assist</span>
                <span className="band-name">Faster decisions. Lower aging. Higher evidence completeness.</span>
                <span className="band-desc">Weekly measurement. AI accelerates capture, execution, measurement.</span>
              </div>
              <div className="cnb-band">
                <span className="band-key">Product Suite</span>
                <span className="band-name">Pre-validated templates by domain.</span>
                <span className="band-desc">QMS, DMS, PLM, MES, EHS, Supplier Quality, Training. Mapped to how customers think.</span>
              </div>
              <div className="cnb-band">
                <span className="band-key">Workflow Components</span>
                <span className="band-name">Stages, gates, roles, approvals, evidence requirements.</span>
                <span className="band-desc">No-code building blocks. Composed by you. Read by AI.</span>
              </div>
              <div className="cnb-band">
                <span className="band-key">Core Platform</span>
                <span className="band-name">Audit model. Permissions. Reliability. Connector strategy.</span>
                <span className="band-desc">The foundation that makes the bands above trustworthy.</span>
              </div>
            </div>

            <div className="cnb-cm-side">
              <div className="lab">Where work happens</div>
              <div className="cnb-cm-chip"><span className="nm">SharePoint</span><span className="arrow">→ artifacts</span></div>
              <div className="cnb-cm-chip"><span className="nm">Excel trackers</span><span className="arrow">→ artifacts</span></div>
              <div className="cnb-cm-chip"><span className="nm">Outlook</span><span className="arrow">→ decisions</span></div>
              <div className="cnb-cm-chip"><span className="nm">Microsoft Teams</span><span className="arrow">→ decisions</span></div>
              <div className="cnb-cm-chip" style={{ borderColor: "rgba(0,82,255,0.4)" }}>
                <span className="nm">Captured</span>
                <span className="arrow" style={{ color: "var(--ink-muted)" }}>into the thread</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 ·AI IMPLICATION (dark) */}
      <section className="cnb-section dark" id="ai">
        <div className="cnb-inner">
          <div>
            <div className="cnb-eyebrow">
              <span className="num">07</span>
              <span>What AI changes. And what has to be true first.</span>
              <span className="line" />
            </div>
            <h2 className="cnb-h2">
              AI compounds on governed coordination.{" "}
              <span className="dim">It does not compound on email.</span>
            </h2>
            <p className="cnb-sub" style={{ marginTop: 22 }}>
              When the thread is the work, AI has something durable to read. Three levels, in sequence.
            </p>
          </div>
          <div className="cnb-ai">
            <div className="cnb-ai-step">
              <span className="lvl">Level 1 / Execution</span>
              <span className="name">AI moves the thread.</span>
              <span className="desc">
                Drafts the next step. Surfaces missing evidence. Routes the right approver.
                People approve. Work moves.
              </span>
              <span className="lock"><b>Locked by:</b> the thread becoming the unit of work.</span>
            </div>
            <div className="cnb-ai-step">
              <span className="lvl">Level 2 / Understanding</span>
              <span className="name">AI reads across threads.</span>
              <span className="desc">
                Recurring root causes. Bottleneck patterns. Processes diverging from how they
                were drawn. Map and territory reconciled weekly.
              </span>
              <span className="lock"><b>Locked by:</b> Level 1 producing structured data.</span>
            </div>
            <div className="cnb-ai-step">
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

      {/* SECTION 8 ·PROOF (light) */}
      <section className="cnb-section light" id="proof">
        <div className="cnb-inner">
          <div>
            <div className="cnb-eyebrow">
              <span className="num">08</span>
              <span>Proof at the level we can claim it.</span>
              <span className="line" />
            </div>
            <h2 className="cnb-h2">
              We are not the tenth QMS.{" "}
              <span className="dim">We are what the QMS connects to so it can close cleanly.</span>
            </h2>
          </div>
          <div className="cnb-proof-card">
            <p className="cnb-proof-quote">
              We stopped reconstructing investigations from email.{" "}
              <span className="blue">The thread is the investigation now.</span>{" "}
              Audit prep used to take weeks. It takes an afternoon.
            </p>
            <div className="cnb-proof-meta">
              <span className="name">VP Quality</span>
              <span className="role">Class II medical device manufacturer · ISO 13485 / 21 CFR Part 11</span>
              <span className="stamp">Advocacy · Customer-attributed quote</span>
            </div>
          </div>
          <p className="cnb-sub" style={{ marginTop: 12 }}>
            We make claims at the level our proof supports. Today that is testimonials and
            qualitative workflow descriptions in Medical Devices, Aerospace, Laboratories and
            Industrial Machinery.
          </p>
        </div>
      </section>

      {/* SECTION 9 ·CTA (dark) */}
      <section className="cnb-section dark" id="cta">
        <div className="cnb-inner" style={{ textAlign: "center", alignItems: "center" }}>
          <div className="cnb-eyebrow" style={{ justifyContent: "center" }}>
            <span className="line" />
            <span>Forty-five minutes. Your process. Your numbers.</span>
            <span className="line" />
          </div>
          <h2 className="cnb-cta-h">
            Walk through your week.<br />As one governed thread.
          </h2>
          <p className="cnb-sub" style={{ margin: "0 auto" }}>
            We pick one of your processes and rebuild it as a single accountable thread on screen.
            You leave with a baseline number for your coordination tax.
          </p>
          <div className="cnb-cta-actions">
            <button className="cnb-btn-primary cnb-btn-blue">
              Book a demo
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <a href="#tax" className="cnb-btn-ghost">Calculate your coordination tax</a>
          </div>
        </div>
      </section>

      <footer className="cnb-foot">
        <div className="cnb-foot-inner">
          <span>© {new Date().getFullYear()} Unifize. Coordination tax, visible, measurable, reducible. For regulated processes.</span>
          <span className="mono">Concept B · Platform first</span>
        </div>
      </footer>
    </div>
  );
}
