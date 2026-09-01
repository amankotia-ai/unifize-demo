import { useEffect } from "react";
import { Link } from "react-router-dom";

const DOMAINS: {
  label: string;
  persona: string;
  trigger: string;
  weight: "advocacy" | "evidence" | "hypothesis";
}[] = [
  { label: "CAPA", persona: "QA Manager", trigger: "Deviation raised", weight: "advocacy" },
  { label: "ECO / DCO", persona: "Eng. Lead", trigger: "Drawing change", weight: "advocacy" },
  { label: "Supplier CAR", persona: "SQE", trigger: "Supplier finding", weight: "advocacy" },
  { label: "Complaint Handling", persona: "QA Ops", trigger: "Customer report", weight: "evidence" },
  { label: "Deviation / NCR", persona: "Production", trigger: "Out-of-spec batch", weight: "evidence" },
  { label: "Audit & Inspection", persona: "Compliance", trigger: "Inspection notice", weight: "evidence" },
  { label: "Document Control", persona: "DocControl", trigger: "SOP revision", weight: "evidence" },
  { label: "Training Records", persona: "HR / QA", trigger: "New SOP issued", weight: "evidence" },
  { label: "Risk Management", persona: "QA Director", trigger: "Design review", weight: "evidence" },
  { label: "Design Review", persona: "R&D Lead", trigger: "Phase gate", weight: "evidence" },
  { label: "MRB", persona: "Quality Eng.", trigger: "Material rejected", weight: "hypothesis" },
  { label: "Calibration", persona: "Metrology", trigger: "Calibration due", weight: "hypothesis" },
  { label: "Periodic Review", persona: "QA Mgr", trigger: "Annual cycle", weight: "hypothesis" },
  { label: "Recall Management", persona: "Reg. Affairs", trigger: "Field action", weight: "hypothesis" },
  { label: "Submission Assembly", persona: "Reg. Affairs", trigger: "510(k) prep", weight: "hypothesis" },
];

const STYLES = `
.opb-root {
  /* Light-mode tokens mirror /linear-flow */
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
.opb-root * { box-sizing: border-box; }
.opb-root .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
.opb-root a { color: inherit; text-decoration: none; }

/* NAV */
.opb-nav {
  position: sticky; top: 0; z-index: 50;
  backdrop-filter: saturate(160%) blur(18px);
  background: rgba(250,250,251,0.88);
  border-bottom: 1px solid rgba(11,13,17,0.05);
  transition: background .25s ease, border-color .25s ease;
}
.opb-nav-inner {
  max-width: 1240px; margin: 0 auto;
  padding: 12px 28px;
  display: flex; align-items: center; gap: 32px;
}
.opb-nav-logo {
  display: inline-flex; align-items: center;
  color: var(--ink);
  transition: color .25s ease;
}
.opb-nav-logo-img {
  display: block;
  height: 24px; width: auto;
  transition: filter .25s ease;
}
.opb-nav-items {
  display: flex; gap: 24px;
  font-size: 13.5px; color: var(--ink-muted);
  transition: color .25s ease;
}
.opb-nav-items a { transition: color .15s ease; }
.opb-nav-items a:hover { color: var(--ink); }
.opb-nav-actions { margin-left: auto; display: flex; gap: 16px; align-items: center; }
.opb-nav-link {
  font-size: 13.5px; color: var(--ink-muted);
  transition: color .25s ease;
}
.opb-nav-link:hover { color: var(--ink); }
.opb-nav-btn {
  font-size: 13px; font-weight: 500;
  background: var(--ink); color: var(--paper);
  padding: 7px 14px; border-radius: 999px;
  border: 1px solid var(--ink); cursor: pointer;
  transition: opacity .15s ease, background .25s ease, color .25s ease, border-color .25s ease;
}
.opb-nav-btn:hover { opacity: 0.88; }
@media (max-width: 860px) { .opb-nav-items { display: none; } }

/* Adaptive nav: dark variant when sitting on the dark hero band */
.opb-nav.is-dark {
  background: rgba(8,9,10,0.86);
  border-bottom-color: rgba(255,255,255,0.05);
}
.opb-nav.is-dark .opb-nav-logo { color: var(--text); }
.opb-nav.is-dark .opb-nav-logo-img { filter: brightness(0) invert(1); }
.opb-nav.is-dark .opb-nav-items { color: var(--text-muted); }
.opb-nav.is-dark .opb-nav-items a:hover { color: var(--text); }
.opb-nav.is-dark .opb-nav-link { color: var(--text-muted); }
.opb-nav.is-dark .opb-nav-link:hover { color: var(--text); }
.opb-nav.is-dark .opb-nav-btn {
  background: var(--text); color: #0B0D11;
  border-color: var(--text);
}

/* SHARED */
.opb-section {
  max-width: 1240px; margin: 0 auto;
  padding: 120px 28px;
}
.opb-eyebrow {
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
.opb-eyebrow .dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 3px rgba(94,106,210,0.16);
  flex-shrink: 0;
}
.opb-eyebrow .num { color: var(--ink); font-weight: 500; }
.opb-eyebrow .sep { color: var(--ink-line-strong); opacity: 0.7; }
.opb-eyebrow .name { color: var(--ink); }
.opb-h2 {
  font-size: clamp(32px, 4.6vw, 56px);
  line-height: 1.04;
  letter-spacing: -0.034em;
  font-weight: 500;
  max-width: 22ch;
  margin: 0;
  color: var(--ink);
}
.opb-h2 .dim { color: var(--ink-muted); }
.opb-sub {
  margin-top: 22px;
  font-size: 16px;
  color: var(--ink-muted);
  max-width: 64ch;
  line-height: 1.5;
}

.opb-btn-primary {
  font-family: inherit; font-size: 14px; font-weight: 500;
  background: var(--ink); color: var(--paper);
  padding: 11px 20px; border-radius: 999px;
  border: 1px solid var(--ink); cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px;
  transition: opacity .15s ease;
}
.opb-btn-primary:hover { opacity: 0.88; }
.opb-btn-ghost {
  font-family: inherit; font-size: 14px; font-weight: 500;
  background: transparent; color: var(--ink);
  padding: 11px 18px; border-radius: 999px;
  border: 1px solid var(--ink-line); cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px;
  transition: border-color .15s ease, background .15s ease;
}
.opb-btn-ghost:hover { border-color: var(--ink-line-strong); background: rgba(11,13,17,0.03); }

/* DARK BAND (used for layer + cta sections) */
.opb-dark { background: var(--bg); color: var(--text); }
.opb-dark .opb-eyebrow {
  background: rgba(255,255,255,0.04);
  border-color: var(--border);
  color: var(--text-muted);
  box-shadow: none;
}
.opb-dark .opb-eyebrow .num,
.opb-dark .opb-eyebrow .name { color: var(--text); }
.opb-dark .opb-eyebrow .sep { color: rgba(255,255,255,0.22); }
.opb-dark .opb-eyebrow .dot { box-shadow: 0 0 0 3px rgba(94,106,210,0.26); }
.opb-dark .opb-h2 { color: var(--text); }
.opb-dark .opb-h2 .dim { color: var(--text-muted); }
.opb-dark .opb-sub { color: var(--text-muted); }
.opb-dark .opb-btn-primary { background: var(--text); color: #0B0D11; border-color: var(--text); }
.opb-dark .opb-btn-primary:hover { opacity: 0.88; }
.opb-dark .opb-btn-ghost { color: var(--text); border-color: var(--border-strong); }
.opb-dark .opb-btn-ghost:hover { background: rgba(255,255,255,0.04); }

/* SECTION 1: HERO (editorial collage) */
.opb-hero {
  max-width: 1240px; margin: 0 auto;
  padding: 96px 28px 80px;
  display: grid; grid-template-columns: 1fr 1.05fr; gap: 48px; align-items: center;
}
@media (max-width: 980px) { .opb-hero { grid-template-columns: 1fr; } }
.opb-hero-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 24px;
  display: inline-flex; align-items: center; gap: 10px;
}
.opb-hero-tag .dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 4px rgba(94,106,210,0.18);
}
.opb-hero-h1 {
  font-size: clamp(40px, 6.4vw, 80px);
  font-weight: 500;
  line-height: 0.98;
  letter-spacing: -0.044em;
  margin: 0;
  color: var(--ink);
}
.opb-hero-h1 .em {
  color: var(--ink-muted);
  font-weight: 450;
}
@keyframes opb-gradient-pan {
  0%, 100% { background-position: 0% 50%; }
  50%      { background-position: 100% 50%; }
}
.opb-hero-sub {
  margin-top: 32px;
  font-size: 17.5px;
  color: var(--ink-muted);
  max-width: 36ch;
  line-height: 1.45;
}
.opb-hero-cta { margin-top: 36px; display: flex; gap: 12px; flex-wrap: wrap; }

/* Collage of three artifact frames */
.opb-collage {
  position: relative;
  height: 560px;
  width: 100%;
  max-width: 620px;
  margin-left: auto;
}
@media (max-width: 980px) {
  .opb-collage { height: 520px; max-width: 560px; margin: 0 auto; }
}
@media (max-width: 600px) {
  .opb-collage { height: 480px; max-width: 100%; }
}
.opb-frame {
  position: absolute;
  background: var(--paper-card);
  border: 1px solid var(--ink-line);
  border-radius: 10px;
  padding: 16px;
  box-shadow:
    0 24px 60px -28px rgba(11,13,17,0.18),
    0 8px 20px -12px rgba(11,13,17,0.08),
    0 0 0 1px rgba(11,13,17,0.02);
}
.opb-frame .head {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ink-faint);
  display: flex; justify-content: space-between; align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--ink-line);
  margin-bottom: 12px;
}
.opb-frame .head .who { color: var(--ink); }

/* Calendar frame */
.opb-frame.calendar {
  top: 0; left: 22%; width: 72%;
  transform: rotate(-2.4deg);
  z-index: 3;
}
.opb-cal {
  display: grid; grid-template-columns: 50px repeat(5, 1fr); gap: 4px;
}
.opb-cal-time {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.06em;
  color: var(--ink-faint);
  padding: 8px 4px 0 0;
  text-align: right;
}
.opb-cal-day {
  display: flex; flex-direction: column; gap: 3px;
  border-left: 1px dashed var(--ink-line);
  padding: 4px 3px;
}
.opb-cal-day .head {
  font-size: 9px; letter-spacing: 0.14em;
  color: var(--ink-faint);
  border: 0; padding: 0; margin: 0;
}
.opb-cal-evt {
  background: rgba(94,106,210,0.14);
  border-left: 2px solid rgba(94,106,210,0.7);
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px; letter-spacing: 0.02em;
  color: rgba(11,13,17,0.78);
  padding: 4px 5px;
  border-radius: 2px;
  line-height: 1.25;
  min-height: 28px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
}
.opb-cal-evt.amber { background: rgba(245,158,11,0.18); border-left-color: rgba(245,158,11,0.85); }
.opb-cal-evt.dim { background: rgba(11,13,17,0.05); border-left-color: rgba(11,13,17,0.18); color: var(--ink-faint); }
.opb-cal-evt.tall { min-height: 58px; -webkit-line-clamp: 4; }

/* Email frame */
.opb-frame.email {
  bottom: 30px; left: 0; width: 60%;
  transform: rotate(1.6deg);
  z-index: 4;
}
.opb-email-row {
  display: grid; grid-template-columns: 24px 1fr 64px;
  gap: 12px; align-items: center;
  padding: 8px 0;
  border-bottom: 1px dotted var(--ink-line);
}
.opb-email-row:last-child { border-bottom: 0; }
.opb-email-av {
  width: 22px; height: 22px; border-radius: 50%;
  background: rgba(11,13,17,0.06);
  border: 1px solid var(--ink-line);
  display: flex; align-items: center; justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.04em;
  color: var(--ink);
}
.opb-email-row .body .from {
  font-size: 12px; font-weight: 500; color: var(--ink);
}
.opb-email-row .body .snip {
  font-size: 11px; color: var(--ink-muted); line-height: 1.3;
}
.opb-email-row .when {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.06em; text-align: right;
  color: var(--ink-faint);
}

/* SharePoint frame */
.opb-frame.sharepoint {
  top: 220px; right: 0; width: 56%;
  transform: rotate(2.2deg);
  z-index: 2;
}
.opb-sp-row {
  display: grid; grid-template-columns: 14px minmax(0, 1fr) 56px;
  gap: 8px; align-items: center;
  padding: 7px 0;
  border-bottom: 1px dotted var(--ink-line);
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.02em;
  color: var(--ink-muted);
}
.opb-sp-row .ico {
  width: 10px; height: 12px;
  background: rgba(11,13,17,0.08);
  border-radius: 1.5px;
  position: relative;
}
.opb-sp-row .ico::after {
  content: ""; position: absolute; top: 0; right: 0;
  width: 4px; height: 4px;
  border-bottom: 1px solid var(--paper);
  border-left: 1px solid var(--paper);
}
.opb-sp-row .name {
  color: var(--ink);
  font-weight: 500;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.opb-sp-row .when {
  color: var(--ink-faint);
  text-align: right;
  white-space: nowrap;
}
.opb-sp-row .by { display: none; }

/* DARK HERO BAND (full-bleed dark backdrop for the hero) */
.opb-hero-band {
  position: relative;
  background: var(--bg);
  color: var(--text);
  border-bottom: 1px solid var(--border);
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  align-items: center;
}
.opb-hero-band > .opb-hero { width: 100%; }
.opb-hero-band::before {
  content: "";
  position: absolute; inset: 0;
  background:
    radial-gradient(900px 480px at 12% 18%, rgba(94,106,210,0.18), transparent 70%),
    radial-gradient(700px 420px at 88% 82%, rgba(245,158,11,0.10), transparent 70%);
  pointer-events: none;
}
.opb-hero-band > * { position: relative; z-index: 1; }

.opb-hero-band .opb-hero-tag { color: var(--text-faint); }
.opb-hero-band .opb-hero-tag .dot {
  box-shadow: 0 0 0 4px rgba(94,106,210,0.28);
}
.opb-hero-band .opb-hero-h1 { color: var(--text); }
.opb-hero-band .opb-hero-h1 .em { color: var(--text-muted); }
.opb-hero-band .opb-hero-sub { color: var(--text-muted); }
.opb-hero-band .opb-btn-primary {
  background: var(--text); color: #0B0D11;
  border-color: var(--text);
}
.opb-hero-band .opb-btn-primary:hover { opacity: 0.88; }
.opb-hero-band .opb-btn-ghost {
  color: var(--text);
  border-color: var(--border-strong);
}
.opb-hero-band .opb-btn-ghost:hover {
  background: rgba(255,255,255,0.04);
  border-color: rgba(255,255,255,0.22);
}

/* Frames on dark */
.opb-hero-band .opb-frame {
  background: var(--bg-card);
  border-color: var(--border);
  box-shadow:
    0 32px 60px -28px rgba(0,0,0,0.55),
    0 10px 24px -14px rgba(0,0,0,0.40),
    0 0 0 1px rgba(255,255,255,0.02);
}
.opb-hero-band .opb-frame .head {
  color: var(--text-faint);
  border-bottom-color: var(--border);
}
.opb-hero-band .opb-frame .head .who { color: var(--text); }

/* Calendar — dark */
.opb-hero-band .opb-cal-time { color: var(--text-faint); }
.opb-hero-band .opb-cal-day { border-left-color: var(--border); }
.opb-hero-band .opb-cal-day .head { color: var(--text-faint); }
.opb-hero-band .opb-cal-evt {
  color: rgba(255,255,255,0.88);
  background: rgba(94,106,210,0.22);
  border-left-color: rgba(124,139,240,0.85);
}
.opb-hero-band .opb-cal-evt.amber {
  background: rgba(245,158,11,0.22);
  border-left-color: rgba(245,158,11,0.95);
}
.opb-hero-band .opb-cal-evt.dim {
  background: rgba(255,255,255,0.04);
  border-left-color: rgba(255,255,255,0.18);
  color: var(--text-faint);
}

/* Email rows — dark */
.opb-hero-band .opb-email-row { border-bottom-color: var(--border); }
.opb-hero-band .opb-email-av {
  background: rgba(255,255,255,0.05);
  border-color: var(--border);
  color: var(--text);
}
.opb-hero-band .opb-email-row .body .from { color: var(--text); }
.opb-hero-band .opb-email-row .body .snip { color: var(--text-muted); }
.opb-hero-band .opb-email-row .when { color: var(--text-faint); }

/* SharePoint rows — dark */
.opb-hero-band .opb-sp-row {
  border-bottom-color: var(--border);
  color: var(--text-muted);
}
.opb-hero-band .opb-sp-row .ico {
  background: rgba(255,255,255,0.10);
}
.opb-hero-band .opb-sp-row .ico::after {
  border-bottom-color: var(--bg-card);
  border-left-color: var(--bg-card);
}
.opb-hero-band .opb-sp-row .name { color: var(--text); }
.opb-hero-band .opb-sp-row .when { color: var(--text-faint); }

/* HERO CONTENT SHAPES (using the existing editorial frame chrome). QMS / ERP / PLM. */
/* Same overlap and rotation as the original calendar/email/sharepoint frames. */

.opb-frame.qms {
  top: 0; left: 22%; width: 72%;
  transform: rotate(-2.4deg);
  z-index: 3;
}
.opb-frame.erp {
  bottom: 30px; left: 0; width: 60%;
  transform: rotate(1.6deg);
  z-index: 4;
}
.opb-frame.plm {
  top: 220px; right: 0; width: 56%;
  transform: rotate(2.2deg);
  z-index: 2;
}

/* QMS workflow stepper */
.opb-flow {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
  padding: 8px 0 14px;
  position: relative;
}
.opb-flow::before {
  content: "";
  position: absolute;
  left: 6px; right: 6px; top: 17px;
  height: 1px;
  background: var(--border);
}
.opb-flow-step {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
  position: relative;
}
.opb-flow-step .dot {
  width: 9px; height: 9px;
  border-radius: 50%;
  background: var(--bg-card);
  border: 1.5px solid var(--text-faint);
  margin-top: 12px;
  position: relative;
  z-index: 1;
}
.opb-flow-step.done .dot {
  background: var(--text);
  border-color: var(--text);
}
.opb-flow-step.active .dot {
  background: rgba(245,158,11,1);
  border-color: rgba(245,158,11,1);
  box-shadow: 0 0 0 4px rgba(245,158,11,0.22);
}
.opb-flow-step .lbl {
  font-size: 10.5px;
  letter-spacing: 0.01em;
  color: var(--text-muted);
}
.opb-flow-step.active .lbl {
  color: var(--text);
  font-weight: 500;
}
.opb-flow-step .day {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--text-faint);
}
.opb-flow-step.active .day { color: rgba(245,158,11,1); }

/* QMS metadata rows */
.opb-meta-row {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 12px;
  padding: 8px 0;
  border-top: 1px dotted var(--border);
  align-items: baseline;
}
.opb-meta-row .k {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--text-faint);
}
.opb-meta-row .v {
  font-size: 12px;
  color: var(--text);
  line-height: 1.35;
}
.opb-meta-row.alert .v { color: rgba(245,158,11,1); }

/* ERP transaction rows. Echoes the email-row layout. */
.opb-erp-row {
  display: grid;
  grid-template-columns: 50px 1fr 56px;
  gap: 12px; align-items: center;
  padding: 8px 0;
  border-bottom: 1px dotted var(--border);
}
.opb-erp-row:last-child { border-bottom: 0; }
.opb-erp-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  padding: 4px 6px;
  border-radius: 2px;
  text-align: center;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  color: var(--text-muted);
}
.opb-erp-row.alert .opb-erp-tag {
  color: rgba(245,158,11,1);
  border-color: rgba(245,158,11,0.55);
  background: rgba(245,158,11,0.10);
}
.opb-erp-row.warn .opb-erp-tag {
  color: rgba(245,158,11,0.92);
  border-color: rgba(245,158,11,0.32);
  background: rgba(245,158,11,0.06);
}
.opb-erp-row .body .from {
  font-size: 12px; font-weight: 500; color: var(--text);
}
.opb-erp-row .body .snip {
  font-size: 11px; color: var(--text-muted); line-height: 1.3;
}
.opb-erp-row.alert .body .from { color: rgba(245,158,11,1); }
.opb-erp-row .when {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.08em;
  text-align: right;
  color: var(--text-faint);
}

/* PLM revision rows. Echoes the SharePoint row layout. */
.opb-plm-row {
  display: grid;
  grid-template-columns: 32px 1fr 1fr 60px;
  gap: 8px; align-items: center;
  padding: 7px 0;
  border-bottom: 1px dotted var(--border);
  font-size: 11px;
  color: var(--text-muted);
}
.opb-plm-row:last-child { border-bottom: 0; }
.opb-plm-row .rev {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--text);
  font-weight: 500;
}
.opb-plm-row .state { color: var(--text-muted); }
.opb-plm-row .who { color: var(--text-muted); }
.opb-plm-row .when {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.08em; text-align: right;
  color: var(--text-faint);
}
.opb-plm-row.warn .rev { color: rgba(245,158,11,1); }
.opb-plm-row.warn .state { color: rgba(245,158,11,1); }
.opb-plm-foot {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--border);
  display: flex; justify-content: space-between; align-items: baseline;
}
.opb-plm-foot .k {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--text-faint);
}
.opb-plm-foot .v {
  font-size: 11.5px;
  color: var(--text);
}

/* LEAK-OUT STICKIES. Teams / Outlook / Excel fragments pinned around the systems. */
/* Same paper-card chrome as the frames so the design language stays consistent. */
.opb-leak {
  position: absolute;
  z-index: 6;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 9px 12px;
  box-shadow:
    0 24px 40px -18px rgba(0,0,0,0.55),
    0 8px 16px -10px rgba(0,0,0,0.40),
    0 0 0 1px rgba(255,255,255,0.02);
  font-size: 11.5px;
  color: var(--text);
  max-width: 220px;
  line-height: 1.35;
}
.opb-leak .head {
  display: flex; align-items: center; gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--text-faint);
  padding-bottom: 6px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 6px;
}
.opb-leak .head .who { color: var(--text-muted); }
.opb-leak.teams { transform: rotate(2.2deg); }
.opb-leak.outlook { transform: rotate(-1.6deg); }
.opb-leak.excel { transform: rotate(1.4deg); }
.opb-leak .body { color: var(--text); }
.opb-leak.excel .body { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: 0.02em; }
.opb-leak.excel .body .err { color: rgba(245,158,11,1); font-weight: 600; }

.opb-leak.t1 { top: 22%; right: 4%; width: 200px; }
.opb-leak.t2 { top: 52%; left: 8%; width: 210px; }
.opb-leak.t3 { top: 82%; right: 18%; width: 180px; }

@media (max-width: 600px) {
  .opb-leak { display: none; }
  .opb-frame.qms { width: 88%; left: 6%; }
  .opb-frame.erp { width: 76%; }
  .opb-frame.plm { width: 70%; }
}

/* SECTION 2: SYMPTOM GALLERY — native habitat artifacts (marquee) */
.opb-symptoms {
  margin-top: 60px;
  position: relative;
  overflow: hidden;
  /* full viewport bleed within centered section */
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  padding: 6px 0;
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%);
}
.opb-symptoms-track {
  display: flex;
  gap: 24px;
  width: max-content;
  padding: 4px 12px;
  animation: opb-symptoms-marquee 80s linear infinite;
  will-change: transform;
}
.opb-symptoms:hover .opb-symptoms-track,
.opb-symptoms:focus-within .opb-symptoms-track {
  animation-play-state: paused;
}
@media (prefers-reduced-motion: reduce) {
  .opb-symptoms-track { animation: none; }
}
@keyframes opb-symptoms-marquee {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(-50%, 0, 0); }
}
@media (max-width: 760px) {
  .opb-symptoms-track { animation-duration: 60s; }
}

.opb-symptom {
  flex: 0 0 380px;
  width: 380px;
  background: var(--paper-card);
  border: 1px solid var(--ink-line);
  border-radius: 10px;
  display: flex; flex-direction: column;
  overflow: hidden;
  min-height: 420px;
  position: relative;
  box-shadow: 0 1px 2px rgba(11,13,17,0.025);
}
.opb-symptom-head {
  display: flex; justify-content: space-between; align-items: center;
  padding: 11px 16px;
  border-bottom: 1px solid var(--ink-line);
  background: linear-gradient(180deg, rgba(11,13,17,0.022), rgba(11,13,17,0.005));
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
}
.opb-symptom-head .app {
  display: inline-flex; align-items: center; gap: 8px;
  color: var(--ink); font-weight: 500;
}
.opb-symptom-head .app .glyph {
  width: 12px; height: 12px; border-radius: 2px;
  background: var(--ink-line-strong);
  flex-shrink: 0;
}
.opb-symptom-head .meta { color: var(--ink-faint); }

.opb-symptom-body {
  flex: 1;
  padding: 18px 18px 16px;
  display: flex; flex-direction: column;
  gap: 12px;
  min-height: 0;
}

.opb-symptom-foot {
  border-top: 1px dashed var(--ink-line);
  padding: 13px 18px 16px;
  background: rgba(11,13,17,0.022);
  display: flex; flex-direction: column; gap: 7px;
}
.opb-symptom-foot .role {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--ink-faint);
}
.opb-symptom-foot .quote {
  font-size: 14px;
  line-height: 1.42;
  letter-spacing: -0.011em;
  color: var(--ink);
  font-weight: 450;
}
.opb-symptom-foot .quote::before {
  content: "“"; margin-right: 1px; color: var(--ink-faint);
}
.opb-symptom-foot .quote::after {
  content: "”"; margin-left: 1px; color: var(--ink-faint);
}

/* CARD 1: CALENDAR */
.opb-symptom.calendar .glyph {
  background: linear-gradient(135deg, #0078D4, #00558B);
}
.opb-symptom .cal-title {
  font-size: 16.5px; font-weight: 500; color: var(--ink);
  letter-spacing: -0.014em; line-height: 1.3;
}
.opb-symptom .cal-pill {
  display: inline-flex; align-self: flex-start; align-items: center; gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
  background: rgba(245,158,11,0.10);
  color: #8A5400;
  border: 1px solid rgba(245,158,11,0.30);
  padding: 4px 9px;
  border-radius: 999px;
}
.opb-symptom .cal-pill .dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: #F59E0B;
}
.opb-symptom .cal-attendees {
  display: flex; align-items: center;
}
.opb-symptom .cal-attendees .av {
  width: 22px; height: 22px;
  border-radius: 50%;
  border: 2px solid var(--paper-card);
  background: rgba(11,13,17,0.06);
  font-family: 'JetBrains Mono', monospace;
  font-size: 8.5px; letter-spacing: 0.04em;
  color: var(--ink);
  display: inline-flex; align-items: center; justify-content: center;
  margin-left: -6px;
}
.opb-symptom .cal-attendees .av:first-child { margin-left: 0; }
.opb-symptom .cal-attendees .more {
  margin-left: 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; color: var(--ink-faint);
  letter-spacing: 0.04em;
}
.opb-symptom .cal-attempts {
  border-top: 1px dotted var(--ink-line);
  padding-top: 10px;
  display: flex; flex-direction: column;
}
.opb-symptom .cal-attempts-label {
  display: flex; justify-content: space-between; align-items: baseline;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 6px;
}
.opb-symptom .cal-attempts-label .count { color: var(--ink-muted); }
.opb-symptom .cal-attempt {
  display: grid; grid-template-columns: 24px 56px 1fr;
  gap: 10px; align-items: baseline;
  padding: 5px 0;
  border-bottom: 1px dotted var(--ink-line);
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.04em;
}
.opb-symptom .cal-attempt:last-child { border-bottom: 0; }
.opb-symptom .cal-attempt .num {
  color: var(--ink-faint);
  font-size: 9.5px;
  letter-spacing: 0.14em;
}
.opb-symptom .cal-attempt .date {
  color: var(--ink-muted);
  text-decoration: line-through;
  text-decoration-color: rgba(11,13,17,0.32);
}
.opb-symptom .cal-attempt .reason {
  color: var(--ink-faint);
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.opb-symptom .cal-attempt.current .num { color: #8A5400; font-weight: 500; }
.opb-symptom .cal-attempt.current .date {
  color: #8A5400;
  text-decoration: none;
  font-weight: 500;
}
.opb-symptom .cal-attempt.current .reason {
  color: #8A5400;
}
.opb-symptom .cal-foot-line {
  margin-top: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ink-faint);
  display: flex; justify-content: space-between; align-items: center;
  padding-top: 10px;
  border-top: 1px dotted var(--ink-line);
}
.opb-symptom .cal-foot-line .strike { text-decoration: line-through; }

/* CARD 2: SHAREPOINT */
.opb-symptom.sharepoint .glyph {
  background: linear-gradient(135deg, #038387, #015D60);
}
.opb-symptom .sp-crumbs {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.06em;
  color: var(--ink-faint);
  margin-bottom: 2px;
}
.opb-symptom .sp-crumbs b { color: var(--ink-muted); font-weight: 500; }
.opb-symptom .sp-folders {
  display: flex; flex-direction: column;
  border-top: 1px solid var(--ink-line);
}
.opb-symptom .sp-folder {
  display: grid; grid-template-columns: 18px minmax(0, 1fr) 60px;
  gap: 10px; align-items: center;
  padding: 9px 0;
  border-bottom: 1px dotted var(--ink-line);
}
.opb-symptom .sp-folder:last-child { border-bottom: 0; }
.opb-symptom .sp-folder .ico {
  width: 16px; height: 12px;
  background: rgba(245,158,11,0.40);
  border-radius: 2px;
  position: relative;
}
.opb-symptom .sp-folder .ico::before {
  content: "";
  position: absolute; top: -2px; left: 1px;
  width: 7px; height: 3px;
  background: rgba(245,158,11,0.55);
  border-radius: 1.5px 1.5px 0 0;
}
.opb-symptom .sp-folder .name {
  color: var(--ink);
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.01em;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.opb-symptom .sp-folder .meta {
  color: var(--ink-faint);
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.04em;
  text-align: right;
}
.opb-symptom .sp-banner {
  margin-top: auto;
  padding: 8px 10px;
  background: rgba(11,13,17,0.025);
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--ink-faint);
  display: flex; justify-content: space-between;
}

/* CARD 3: OUTLOOK */
.opb-symptom.outlook .glyph {
  background: linear-gradient(135deg, #0078D4, #00558B);
}
.opb-symptom .ol-subject {
  font-size: 14.5px; font-weight: 500;
  letter-spacing: -0.012em; color: var(--ink);
  line-height: 1.36;
}
.opb-symptom .ol-meta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-faint);
  margin-top: -6px;
}
.opb-symptom .ol-replies {
  display: flex; flex-direction: column;
  border-top: 1px solid var(--ink-line);
  margin-top: 2px;
}
.opb-symptom .ol-reply {
  display: grid; grid-template-columns: 22px minmax(0, 1fr) 50px;
  gap: 10px; align-items: center;
  padding: 9px 0;
  border-bottom: 1px dotted var(--ink-line);
}
.opb-symptom .ol-reply:last-child { border-bottom: 0; }
.opb-symptom .ol-reply .av {
  width: 22px; height: 22px;
  border-radius: 50%;
  background: rgba(11,13,17,0.06);
  border: 1px solid var(--ink-line);
  font-family: 'JetBrains Mono', monospace;
  font-size: 8.5px;
  display: flex; align-items: center; justify-content: center;
  color: var(--ink);
}
.opb-symptom .ol-reply .from {
  font-size: 12px; color: var(--ink);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.opb-symptom .ol-reply .from b { font-weight: 500; }
.opb-symptom .ol-reply .when {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; color: var(--ink-faint);
  text-align: right;
}

/* CARD 4: TEAMS MEETING */
.opb-symptom.tm-meet .glyph {
  background: linear-gradient(135deg, #6264A7, #464775);
}
.opb-symptom .tm-title {
  font-size: 16.5px; font-weight: 500; color: var(--ink);
  letter-spacing: -0.014em;
}
.opb-symptom .tm-warn {
  display: inline-flex; align-self: flex-start; align-items: center; gap: 7px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase;
  color: #B91C1C;
  background: rgba(239,68,68,0.07);
  border: 1px solid rgba(239,68,68,0.26);
  padding: 5px 10px;
  border-radius: 999px;
  margin-top: -4px;
}
.opb-symptom .tm-warn .dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: #EF4444;
  box-shadow: 0 0 0 3px rgba(239,68,68,0.16);
}
.opb-symptom .tm-attendees {
  display: flex; flex-direction: column; gap: 8px;
  margin-top: 2px;
  padding-top: 12px;
  border-top: 1px dotted var(--ink-line);
}
.opb-symptom .tm-attendee {
  display: grid; grid-template-columns: 22px minmax(0, 1fr) auto;
  gap: 10px; align-items: center;
}
.opb-symptom .tm-attendee .av {
  width: 22px; height: 22px;
  border-radius: 50%;
  background: rgba(11,13,17,0.06);
  font-family: 'JetBrains Mono', monospace;
  font-size: 8.5px;
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--ink);
  border: 1px solid var(--ink-line);
}
.opb-symptom .tm-attendee .nm { color: var(--ink); font-size: 12px; }
.opb-symptom .tm-attendee .role-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ink-faint);
}
.opb-symptom .tm-rec {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px dotted var(--ink-line);
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ink-faint);
  display: flex; justify-content: space-between;
}
.opb-symptom .tm-rec .strike { text-decoration: line-through; }

/* CARD 5: TEAMS CHAT */
.opb-symptom.tm-chat .glyph {
  background: linear-gradient(135deg, #6264A7, #464775);
}
.opb-symptom .tc-feed {
  display: flex; flex-direction: column;
  gap: 10px;
}
.opb-symptom .tc-msg {
  display: grid; grid-template-columns: 24px minmax(0, 1fr);
  gap: 10px;
  align-items: flex-start;
}
.opb-symptom .tc-msg .av {
  width: 24px; height: 24px;
  border-radius: 50%;
  background: rgba(11,13,17,0.06);
  font-family: 'JetBrains Mono', monospace;
  font-size: 8.5px;
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--ink);
  border: 1px solid var(--ink-line);
}
.opb-symptom .tc-msg .body { min-width: 0; }
.opb-symptom .tc-msg .body .from {
  font-size: 10.5px; font-weight: 500;
  color: var(--ink-muted);
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.04em;
  margin-bottom: 3px;
}
.opb-symptom .tc-msg .body .text {
  font-size: 13px; line-height: 1.42;
  color: var(--ink-muted);
}
.opb-symptom .tc-msg.muted { opacity: 0.40; }
.opb-symptom .tc-msg.highlight .body .from { color: var(--ink); }
.opb-symptom .tc-msg.highlight .body .text {
  color: var(--ink);
  font-weight: 450;
  background: rgba(245,158,11,0.10);
  border-left: 2px solid rgba(245,158,11,0.65);
  padding: 6px 9px;
  border-radius: 0 4px 4px 0;
  margin-top: 3px;
}
.opb-symptom .tc-typing {
  margin-top: auto;
  padding: 7px 10px;
  background: rgba(11,13,17,0.025);
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.10em; text-transform: uppercase;
  color: var(--ink-faint);
}

/* CARD 6: EXCEL */
.opb-symptom.excel .glyph {
  background: linear-gradient(135deg, #107C41, #0B5A30);
}
.opb-symptom .xl-tabs {
  display: flex; gap: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.06em;
  border-bottom: 1px solid var(--ink-line);
  margin: -4px -4px 0 -4px;
  padding: 0 4px;
}
.opb-symptom .xl-tabs .tab {
  padding: 4px 11px;
  border-bottom: 2px solid transparent;
  color: var(--ink-faint);
  margin-bottom: -1px;
}
.opb-symptom .xl-tabs .tab.active {
  color: var(--ink);
  border-bottom-color: #107C41;
  background: var(--paper-card);
}
.opb-symptom .xl-grid {
  border: 1px solid var(--ink-line);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 4px;
}
.opb-symptom .xl-row {
  display: grid; grid-template-columns: 28px 1.1fr 1fr 0.9fr;
  border-bottom: 1px solid var(--ink-line);
}
.opb-symptom .xl-row:last-child { border-bottom: 0; }
.opb-symptom .xl-row.head { background: rgba(11,13,17,0.05); }
.opb-symptom .xl-row.head .xl-cell {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-muted);
  font-weight: 500;
}
.opb-symptom .xl-cell {
  padding: 7px 9px;
  border-right: 1px solid var(--ink-line);
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--ink);
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.opb-symptom .xl-cell:last-child { border-right: 0; }
.opb-symptom .xl-cell.row-h {
  text-align: center;
  background: rgba(11,13,17,0.05);
  color: var(--ink-faint);
  font-size: 9.5px; letter-spacing: 0.04em;
}
.opb-symptom .xl-cell.flagged {
  outline: 2px solid #EF4444;
  outline-offset: -2px;
  z-index: 1;
  color: #B91C1C;
  font-weight: 500;
}
.opb-symptom .xl-comment {
  margin-top: 10px;
  align-self: flex-start;
  background: rgba(245,158,11,0.10);
  border: 1px solid rgba(245,158,11,0.32);
  padding: 9px 11px;
  border-radius: 6px;
  font-size: 12px; line-height: 1.4;
  color: var(--ink);
  position: relative;
  max-width: 100%;
}
.opb-symptom .xl-comment::before {
  content: "";
  position: absolute; top: -5px; right: 22px;
  width: 8px; height: 8px;
  background: rgba(245,158,11,0.10);
  border-left: 1px solid rgba(245,158,11,0.32);
  border-top: 1px solid rgba(245,158,11,0.32);
  transform: rotate(45deg);
}
.opb-symptom .xl-comment .by {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ink-faint);
  margin-top: 5px;
}

/* SECTION 3: WHY IT HAPPENS — open timeline, no container, slight bleed past content */
.opb-timeline-band {
  position: relative;
  margin: 80px -80px 0;
}

.opb-tl-rail {
  position: relative;
  height: 84px;
  margin-bottom: 28px;
}
.opb-tl-rail-line {
  position: absolute; top: 50%; left: 0; right: 0;
  height: 1px;
  background: var(--ink-line-strong);
}
.opb-tl-milestone {
  position: absolute;
  top: 0;
  height: 84px;
  z-index: 2;
}
.opb-tl-milestone .title {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(calc(-100% - 12px));
  font-size: 14px; font-weight: 500;
  color: var(--ink);
  letter-spacing: -0.011em;
  white-space: nowrap;
}
.opb-tl-milestone .node {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--ink);
  box-shadow: 0 0 0 4px var(--paper);
}
.opb-tl-milestone .day {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(14px);
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-muted);
  white-space: nowrap;
}
.opb-tl-milestone.end .title,
.opb-tl-milestone.end .day { left: auto; right: 0; }
.opb-tl-milestone.end .node { left: auto; right: 0; transform: translateY(-50%); }

/* Cluster rail */
.opb-tl-clusters {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  position: relative;
}
.opb-tl-cluster {
  display: flex; flex-wrap: wrap; gap: 6px;
  align-content: flex-start;
  padding: 0 14px;
}
.opb-tl-cluster:first-child { padding-left: 0; }
.opb-tl-cluster:last-child { padding-right: 0; }

.opb-tl-chip {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 9px;
  border: 1px solid var(--ink-line);
  border-radius: 3px;
  background: #fff;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.06em;
  color: var(--ink-muted);
  text-transform: uppercase;
  white-space: nowrap;
}
.opb-tl-chip .dot {
  width: 4px; height: 4px; border-radius: 50%;
  flex-shrink: 0;
}
.opb-tl-chip.outlook .dot { background: #F0A33A; }
.opb-tl-chip.teams .dot { background: #4D86FF; }
.opb-tl-chip.sharepoint .dot { background: #8B93A0; }
.opb-tl-chip.excel .dot { background: #0B8A5C; }
.opb-tl-chip.meeting .dot { background: #C4303A; }

/* Reveal animation */
.opb-tl-milestone, .opb-tl-cluster {
  opacity: 0;
  transform: translateY(8px);
  transition: opacity .9s ease, transform .9s ease;
}
.opb-tl-milestone { transition-delay: calc(var(--i, 0) * 90ms); }
.opb-tl-cluster   { transition-delay: calc(var(--i, 0) * 140ms + 360ms); }
.opb-timeline-band.is-revealed .opb-tl-milestone,
.opb-timeline-band.is-revealed .opb-tl-cluster {
  opacity: 1;
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  .opb-tl-milestone, .opb-tl-cluster {
    opacity: 1; transform: none; transition: none;
  }
}
@media (max-width: 1380px) {
  .opb-timeline-band { margin: 80px -32px 0; }
}
@media (max-width: 1100px) {
  .opb-timeline-band { margin: 80px 0 0; }
}
@media (max-width: 760px) {
  .opb-tl-rail { height: 70px; }
  .opb-tl-milestone { height: 70px; }
  .opb-tl-milestone .title { font-size: 12px; }
  .opb-tl-clusters { grid-template-columns: repeat(2, 1fr); gap: 14px; }
  .opb-tl-cluster { padding: 0; }
}

/* SECTION 4: TAX NAMED (continuation of section 3) */
.opb-tax {
  max-width: 1240px; margin: 0 auto;
  padding: 40px 28px 140px;
}
.opb-tax-inner {
  text-align: left;
}
.opb-tax-pre {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 36px;
  display: inline-flex; align-items: center; gap: 14px;
}
.opb-tax-pre .line { width: 64px; height: 1px; background: var(--ink-line); }
.opb-name-reveal {
  font-style: italic;
  background: var(--gradient-accent);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: opb-gradient-pan 14s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) { .opb-name-reveal { animation: none; } }
.opb-tax-def {
  margin: 28px 0 0;
  max-width: 56ch;
  font-size: 19px; color: var(--ink-muted); line-height: 1.45;
}

/* (Old SECTION 5 styles retained for SoR rail use in section 3) */
.opb-cols {
  margin-top: 60px;
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--ink-line);
  border: 1px solid var(--ink-line);
  border-radius: 14px;
  overflow: hidden;
}
@media (max-width: 980px) { .opb-cols { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .opb-cols { grid-template-columns: 1fr; } }
.opb-col {
  background: var(--paper-card);
  padding: 36px 28px;
  display: flex; flex-direction: column; gap: 22px;
  min-height: 280px;
}
.opb-col .glyph {
  width: 60px; height: 60px;
  border: 1px solid var(--ink-line);
  border-radius: 8px;
  background: var(--paper);
  display: flex; align-items: center; justify-content: center;
  color: var(--ink-muted);
}
.opb-col .tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.18em; color: var(--ink-faint);
}
.opb-col .scope {
  font-size: 17px; line-height: 1.3; letter-spacing: -0.018em;
  color: var(--ink); font-weight: 500;
}
.opb-col.empty {
  background: var(--paper);
  position: relative;
}
.opb-col.empty .scope {
  color: var(--warm-accent); font-style: italic; font-weight: 450;
}
.opb-col.empty .scribble {
  position: absolute; inset: 0;
  background-image:
    repeating-linear-gradient(
      45deg,
      rgba(245,158,11,0.06) 0,
      rgba(245,158,11,0.06) 1px,
      transparent 1px,
      transparent 12px
    );
  pointer-events: none;
}

/* SECTION 5: THE LAYER (dark, vertical thread anatomy) */
.opb-anatomy {
  margin-top: 56px;
  display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 56px; align-items: start;
}
@media (max-width: 980px) { .opb-anatomy { grid-template-columns: 1fr; gap: 32px; } }
.opb-anatomy-copy {}
.opb-anatomy-list {
  position: relative;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: rgba(255,255,255,0.018);
  padding: 18px 24px 18px 60px;
}
.opb-anatomy-spine {
  position: absolute;
  left: 28px; top: 22px; bottom: 22px;
  width: 1px;
  background: linear-gradient(180deg, rgba(94,106,210,0.7) 0%, rgba(94,106,210,0.05) 100%);
}
.opb-anatomy-row {
  position: relative;
  padding: 18px 0;
  border-top: 1px solid var(--border);
  display: grid; grid-template-columns: 64px 1fr; gap: 16px; align-items: baseline;
}
.opb-anatomy-row:first-child { border-top: 0; }
.opb-anatomy-row .node {
  position: absolute; left: -38px; top: 22px;
  width: 12px; height: 12px; border-radius: 50%;
  background: var(--bg-card);
  border: 1px solid rgba(94,106,210,0.7);
}
.opb-anatomy-row.terminal .node { background: var(--green); border-color: var(--green); box-shadow: 0 0 0 4px rgba(16,185,129,0.2); }
.opb-anatomy-row .k {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.18em; color: var(--text-faint);
}
.opb-anatomy-row .body .label {
  font-size: 16px; font-weight: 500; letter-spacing: -0.018em; color: var(--text);
}
.opb-anatomy-row .body .note {
  font-size: 13.5px; color: var(--text-muted); line-height: 1.45; margin-top: 6px;
}

/* SECTION 5: THE LAYER — embedded chat preview (matches /linear) */
.opb-layer {
  max-height: 120vh;
  overflow: hidden;
  position: relative;
  padding-bottom: 0 !important;
}
.opb-preview {
  margin-top: 56px;
  position: relative;
  isolation: isolate;
}
.opb-preview-glow {
  position: absolute;
  left: 50%; top: -260px;
  transform: translateX(-50%);
  width: 1100px; max-width: 100%;
  height: 600px;
  background:
    radial-gradient(60% 55% at 50% 75%, rgba(94,106,210,0.45) 0%, rgba(94,106,210,0.18) 40%, rgba(94,106,210,0) 78%),
    radial-gradient(50% 55% at 25% 65%, rgba(124,139,240,0.28) 0%, rgba(124,139,240,0) 72%),
    radial-gradient(50% 55% at 78% 60%, rgba(80,120,220,0.22) 0%, rgba(80,120,220,0) 72%);
  filter: blur(32px);
  pointer-events: none;
  z-index: 0;
}
.opb-preview-frame {
  position: relative;
  z-index: 1;
  border-radius: 14px 14px 0 0;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.08);
  border-bottom: 0;
  background: var(--paper-card);
  box-shadow:
    0 50px 120px -30px rgba(94,106,210,0.25),
    0 30px 80px -20px rgba(0,0,0,0.55),
    0 0 0 1px rgba(255,255,255,0.04);
  height: 80vh;
  -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 72%, transparent 100%);
  mask-image: linear-gradient(180deg, #000 0%, #000 72%, transparent 100%);
}
.opb-preview-frame iframe {
  width: 100%; height: 100%; border: 0; display: block;
}

/* OLD SECTION 5: CHAT ARTIFACT (kept for now, hidden) */
.opb-app-card {
  margin-top: 56px;
  background: var(--paper-card);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  overflow: hidden;
  color: var(--ink);
  box-shadow:
    0 40px 80px -20px rgba(0,0,0,0.45),
    0 12px 28px -10px rgba(0,0,0,0.25),
    0 0 0 1px rgba(255,255,255,0.04);
}
.opb-app-chrome {
  display: flex; align-items: center; gap: 14px;
  padding: 11px 14px;
  background: var(--paper);
  border-bottom: 1px solid var(--ink-line);
}
.opb-app-chrome .dots { display: inline-flex; gap: 6px; }
.opb-app-chrome .dots i {
  display: inline-block; width: 10px; height: 10px; border-radius: 50%;
  background: rgba(11,13,17,0.10);
}
.opb-app-chrome .dots i:nth-child(1) { background: rgba(239,68,68,0.55); }
.opb-app-chrome .dots i:nth-child(2) { background: rgba(245,158,11,0.55); }
.opb-app-chrome .dots i:nth-child(3) { background: rgba(16,185,129,0.55); }
.opb-app-chrome .url {
  flex: 1; text-align: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.04em;
  color: var(--ink-muted);
}
.opb-app-chrome .pill {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--green);
  border: 1px solid rgba(16,185,129,0.32);
  background: rgba(16,185,129,0.08);
  padding: 2px 8px; border-radius: 999px;
  display: inline-flex; align-items: center; gap: 5px;
}
.opb-app-chrome .pill .pulse {
  width: 5px; height: 5px; border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 0 2px rgba(16,185,129,0.18);
}

.opb-chat-shell {
  display: grid; grid-template-columns: 1fr 320px;
  min-height: 620px;
}
@media (max-width: 980px) { .opb-chat-shell { grid-template-columns: 1fr; min-height: 0; } }

/* Thread column */
.opb-chat-thread {
  border-right: 1px solid var(--ink-line);
  display: flex; flex-direction: column;
  min-width: 0;
}
@media (max-width: 980px) { .opb-chat-thread { border-right: 0; border-bottom: 1px solid var(--ink-line); } }

.opb-chat-thead {
  padding: 18px 24px 14px;
  border-bottom: 1px solid var(--ink-line);
}
.opb-chat-thead .row {
  display: flex; align-items: center; gap: 10px;
}
.opb-chat-thead h4 {
  font-size: 19px; font-weight: 500; letter-spacing: -0.02em;
  margin: 9px 0 0; color: var(--ink);
}
.opb-chat-thead .meta {
  display: flex; gap: 16px; margin-top: 12px; flex-wrap: wrap;
  font-size: 12px; color: var(--ink-muted);
}
.opb-chat-thead .meta .k {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ink-faint); margin-right: 5px;
}

.opb-chat-badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.16em; text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 3px;
  font-weight: 500;
  line-height: 1;
}
.opb-chat-badge .pulse { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
.opb-chat-badge.info { background: rgba(94,106,210,0.10); color: var(--accent); }
.opb-chat-badge.ok { background: rgba(16,185,129,0.10); color: var(--green); }
.opb-chat-badge.warn { background: rgba(245,158,11,0.12); color: var(--warm-accent); }
.opb-chat-badge.err { background: rgba(239,68,68,0.10); color: var(--red); }
.opb-chat-badge.neutral {
  background: rgba(11,13,17,0.05); color: var(--ink-muted);
}
.opb-chat-id {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.06em;
  color: var(--ink-faint);
}
.opb-chat-id.dim { color: var(--ink-faint); opacity: 0.7; }

.opb-chat-body {
  padding: 20px 24px 22px;
  flex: 1;
  display: flex; flex-direction: column; gap: 14px;
  overflow: hidden;
}
.opb-day {
  display: flex; align-items: center; gap: 10px;
  padding: 6px 0 0;
}
.opb-day .line { flex: 1; height: 1px; background: var(--ink-line); }
.opb-day .lbl {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ink-faint);
}
.opb-anchor {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--accent);
  background: rgba(94,106,210,0.06);
  padding: 4px 10px;
  border-left: 2px solid rgba(94,106,210,0.7);
  align-self: flex-start;
  border-radius: 0 3px 3px 0;
  margin-top: 6px;
}
.opb-sys {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--ink-faint);
  border-left: 2px solid var(--ink-line-strong);
  padding: 4px 12px;
  margin-left: 4px;
}
.opb-msg {
  display: grid; grid-template-columns: 30px 1fr; gap: 11px;
  min-width: 0;
}
.opb-msg .av {
  width: 30px; height: 30px; border-radius: 50%;
  background: rgba(11,13,17,0.06);
  border: 1px solid var(--ink-line);
  display: flex; align-items: center; justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; font-weight: 600;
  color: var(--ink);
  flex-shrink: 0;
}
.opb-msg .av.bot {
  background: rgba(94,106,210,0.10);
  border-color: rgba(94,106,210,0.28);
  color: var(--accent);
}
.opb-msg .body { min-width: 0; }
.opb-msg .head {
  display: flex; gap: 8px; align-items: baseline;
}
.opb-msg .head .who {
  font-size: 12.5px; font-weight: 600; color: var(--ink);
}
.opb-msg .head .who.primary { color: var(--accent); }
.opb-msg .head .when {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.04em;
  color: var(--ink-faint);
}
.opb-msg .text {
  font-size: 13px; line-height: 1.5; color: var(--ink);
  margin-top: 3px;
}

.opb-bot-card {
  margin-top: 8px;
  border: 1px solid var(--ink-line);
  border-radius: 6px;
  overflow: hidden;
  background: var(--paper-card);
}
.opb-bot-card .head {
  padding: 10px 14px;
  background: var(--paper);
  border-bottom: 1px solid var(--ink-line);
  display: flex; justify-content: space-between; align-items: center;
}
.opb-bot-card .head .t {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-faint);
}
.opb-bot-card .head .ttl {
  font-size: 13px; font-weight: 500; margin-top: 3px; color: var(--ink);
  letter-spacing: -0.012em;
}
.opb-bot-card .body {
  padding: 8px 14px 12px;
  display: flex; flex-direction: column; gap: 4px;
}
.opb-bot-row {
  display: grid; grid-template-columns: 14px 1fr auto;
  gap: 10px; align-items: center;
  font-size: 12.5px;
  padding: 4px 0;
}
.opb-bot-row .cb {
  width: 13px; height: 13px;
  border-radius: 3px;
  border: 1px solid var(--ink-line-strong);
  background: var(--paper-card);
  display: inline-flex; align-items: center; justify-content: center;
}
.opb-bot-row.done .cb {
  background: var(--accent);
  border-color: var(--accent);
}
.opb-bot-row.done .cb::after {
  content: ""; width: 6px; height: 3px;
  border-left: 1.6px solid white; border-bottom: 1.6px solid white;
  transform: rotate(-45deg) translate(0, -1px);
}
.opb-bot-row.done .k {
  color: var(--ink-muted); text-decoration: line-through;
  text-decoration-color: var(--ink-line-strong);
}
.opb-bot-row .k { color: var(--ink); }
.opb-bot-row .v {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; color: var(--ink-muted);
}

.opb-stamp {
  margin-top: 8px;
  display: inline-flex; align-self: flex-start; align-items: center; gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--green);
  background: rgba(16,185,129,0.08);
  border: 1px solid rgba(16,185,129,0.28);
  padding: 4px 9px;
  border-radius: 3px;
  font-weight: 500;
}
.opb-stamp::before {
  content: ""; width: 5px; height: 5px; border-radius: 50%;
  background: var(--green);
}

/* Aside checklist */
.opb-aside {
  background: var(--paper);
  display: flex; flex-direction: column;
  padding: 18px 18px 18px;
  min-width: 0;
}
.opb-aside .head {
  display: flex; justify-content: space-between; align-items: center;
}
.opb-aside .head .eb {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ink-faint);
}
.opb-aside .head .ver {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; color: var(--ink-faint);
}
.opb-aside .ttl {
  font-size: 15px; font-weight: 500; letter-spacing: -0.015em;
  margin-top: 6px; color: var(--ink);
}
.opb-aside .prog-row {
  display: flex; justify-content: space-between; align-items: baseline;
  font-size: 12px; margin-top: 14px;
  padding-top: 14px; border-top: 1px solid var(--ink-line);
}
.opb-aside .prog-row .frac {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; color: var(--ink-muted);
}
.opb-aside .bar {
  height: 3px; background: var(--ink-line); border-radius: 2px;
  margin-top: 8px; overflow: hidden;
}
.opb-aside .bar .fill {
  height: 100%; background: var(--accent); border-radius: 2px;
}
.opb-aside .secs {
  margin-top: 12px;
  display: flex; flex-direction: column;
  border-top: 1px solid var(--ink-line);
}
.opb-aside .sec {
  display: flex; align-items: center; gap: 10px;
  padding: 11px 0;
  font-size: 12.5px;
  border-bottom: 1px solid var(--ink-line);
}
.opb-aside .sec:last-child { border-bottom: 0; }
.opb-aside .sec .d {
  width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
}
.opb-aside .sec .d.done { background: var(--green); }
.opb-aside .sec .d.active { background: var(--accent); box-shadow: 0 0 0 3px rgba(94,106,210,0.18); }
.opb-aside .sec .d.pend { background: var(--ink-line-strong); }
.opb-aside .sec .t { flex: 1; color: var(--ink); }
.opb-aside .sec.done .t { color: var(--ink-muted); }
.opb-aside .sec.pend .t { color: var(--ink-muted); }
.opb-aside .sec .frac {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; color: var(--ink-faint);
}

/* SECTION 6: DIPTYCH */
.opb-diptych {
  margin-top: 56px;
  display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
}
@media (max-width: 980px) { .opb-diptych { grid-template-columns: 1fr; } }
.opb-diptych-pane {
  border: 1px solid var(--ink-line);
  border-radius: 14px;
  background: var(--paper-card);
  min-height: 540px;
  display: flex; flex-direction: column;
  overflow: hidden;
}
.opb-pane-head {
  padding: 24px 28px 18px;
  display: flex; flex-direction: column; gap: 12px;
}
.opb-diptych-pane .head {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--ink-faint);
  display: flex; justify-content: space-between; align-items: center;
}
.opb-diptych-pane .head .state {
  font-size: 9.5px; letter-spacing: 0.18em;
}
.opb-diptych-pane.before .head .state { color: var(--red); }
.opb-diptych-pane.after .head .state { color: var(--green); }
.opb-diptych-pane .title {
  font-size: 20px; font-weight: 500; letter-spacing: -0.022em;
  color: var(--ink);
}
.opb-diptych-pane.after {
  background: #FBFBFC;
  border-color: rgba(0,82,255,0.18);
}

/* BEFORE — overlapping legacy windows */
.opb-old-stack {
  position: relative;
  flex: 1;
  margin: 0 14px 14px;
  background:
    repeating-linear-gradient(45deg, rgba(11,13,17,0.02) 0 6px, transparent 6px 12px),
    rgba(11,13,17,0.025);
  border: 1px solid rgba(11,13,17,0.06);
  border-radius: 8px;
  overflow: hidden;
}
.opb-old-win {
  position: absolute;
  background: #fff;
  border: 1px solid #888;
  border-radius: 4px 4px 2px 2px;
  box-shadow: 2px 2px 0 rgba(0,0,0,0.18), 0 4px 14px rgba(0,0,0,0.12);
  font-family: Tahoma, Geneva, "Helvetica Neue", sans-serif;
  font-size: 11px;
  color: #111;
  overflow: hidden;
}
.opb-old-bar {
  background: linear-gradient(180deg, #4F8FF7 0%, #1F5BC0 100%);
  color: #fff;
  padding: 4px 8px;
  display: flex; justify-content: space-between; align-items: center;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.01em;
}
.opb-old-bar .x { font-family: 'Courier New', monospace; font-weight: 400; opacity: 0.85; }
.opb-old-body { padding: 6px 8px; }

.opb-old-outlook { left: 4%;  top: 6%;  width: 62%; transform: rotate(-1.4deg); z-index: 4; }
.opb-old-sp      { right: 3%; top: 18%; width: 58%; transform: rotate(1.6deg);  z-index: 5; }
.opb-old-teams   { left: 6%;  bottom: 8%; width: 56%; transform: rotate(0.8deg); z-index: 3; }
.opb-old-excel   { right: 4%; bottom: 4%; width: 50%; transform: rotate(-0.9deg); z-index: 6; }

.opb-old-row {
  display: grid; grid-template-columns: 70px 1fr 50px;
  gap: 6px;
  padding: 4px 0;
  border-bottom: 1px dotted #ccc;
  font-size: 10.5px;
}
.opb-old-row:last-child { border-bottom: 0; }
.opb-old-row.unread { font-weight: 700; color: #000; }
.opb-old-row .from { color: #555; }
.opb-old-row .subj { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.opb-old-row .subj em { color: #1a73e8; font-style: normal; }
.opb-old-row .date { color: #888; text-align: right; font-size: 10px; }

.opb-old-file {
  padding: 3px 6px;
  border-bottom: 1px dotted #ddd;
  font-size: 11px;
  color: #1a3aa8;
  text-decoration: underline;
}
.opb-old-file:last-child { border-bottom: 0; }
.opb-old-file.warn { color: #c4303a; text-decoration: none; }
.opb-old-file.warn em { font-style: italic; opacity: 0.7; margin-left: 4px; text-decoration: none; }

.opb-old-msg {
  padding: 5px 0;
  border-bottom: 1px dotted #ddd;
}
.opb-old-msg:last-child { border-bottom: 0; }
.opb-old-msg .who { font-weight: 700; font-size: 10.5px; display: block; }
.opb-old-msg .who .ts { font-weight: 400; color: #888; margin-left: 6px; font-size: 9px; }
.opb-old-msg .txt { display: block; font-size: 10.5px; color: #222; margin-top: 1px; }

.opb-old-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 0;
  padding: 0;
}
.opb-old-grid .cell {
  border: 1px solid #d0d0d0;
  padding: 3px 6px;
  font-size: 10px;
  font-family: 'Courier New', monospace;
  background: #fff;
}
.opb-old-grid .cell.h { background: #ebebeb; font-weight: 700; text-align: center; }
.opb-old-grid .cell.err { color: #c4303a; font-weight: 700; }

/* AFTER — Unifize dashboard slice */
.opb-mini-app {
  background: #FBFBFC;
  border-top: 1px solid var(--ink-line);
  display: flex; flex-direction: column;
  flex: 1;
}
.opb-mini-bar {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 12px;
  background: #fff;
  border-bottom: 1px solid var(--ink-line);
}
.opb-mini-bar .dots { display: inline-flex; gap: 5px; }
.opb-mini-bar .dots i {
  display: inline-block; width: 8px; height: 8px; border-radius: 50%;
  background: rgba(11,13,17,0.10);
}
.opb-mini-bar .dots i:nth-child(1) { background: rgba(239,68,68,0.55); }
.opb-mini-bar .dots i:nth-child(2) { background: rgba(245,158,11,0.55); }
.opb-mini-bar .dots i:nth-child(3) { background: rgba(16,185,129,0.55); }
.opb-mini-bar .crumb {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  color: var(--ink-faint); text-transform: uppercase; letter-spacing: 0.06em;
}
.opb-mini-bar .spacer { flex: 1; }
.opb-mini-bar .kbd {
  font-family: 'JetBrains Mono', monospace; font-size: 9px;
  border: 1px solid var(--ink-line); padding: 1px 5px; border-radius: 2px;
  color: var(--ink-faint);
}

.opb-mini-head {
  padding: 14px 18px 12px;
  border-bottom: 1px solid var(--ink-line);
  background: #fff;
}
.opb-mini-head .eb {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--ink-faint);
  display: flex; align-items: center; gap: 7px;
  margin-bottom: 5px;
}
.opb-mini-head .eb .dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: #0052FF;
  box-shadow: 0 0 0 3px #F0F4FF;
}
.opb-mini-head h4 {
  margin: 0;
  font-size: 16px; font-weight: 600; letter-spacing: -0.012em;
  color: var(--ink);
}

.opb-mini-kpis {
  display: grid; grid-template-columns: repeat(4, 1fr);
  border-bottom: 1px solid var(--ink-line);
  background: #fff;
}
.opb-mini-kpi {
  padding: 12px 14px;
  border-right: 1px solid var(--ink-line);
}
.opb-mini-kpi:last-child { border-right: 0; }
.opb-mini-kpi .lbl {
  font-family: 'JetBrains Mono', monospace; font-size: 8.5px;
  text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--ink-faint);
  margin-bottom: 4px;
}
.opb-mini-kpi .val {
  font-size: 20px; font-weight: 600; letter-spacing: -0.025em;
  color: var(--ink);
}
.opb-mini-kpi .val span {
  font-size: 11px; color: var(--ink-muted); font-weight: 500; margin-left: 2px;
}
.opb-mini-kpi .dl {
  font-family: 'JetBrains Mono', monospace; font-size: 9.5px; margin-top: 2px;
}
.opb-mini-kpi .dl.up { color: #0B8A5C; }
.opb-mini-kpi .dl.down { color: #C4303A; }

.opb-mini-chart {
  padding: 12px 18px 8px;
  border-bottom: 1px solid var(--ink-line);
  background: #fff;
}
.opb-mini-chart .lbl {
  font-size: 11px; font-weight: 500;
  color: var(--ink); margin-bottom: 6px;
}
.opb-mini-chart svg { width: 100%; height: 70px; display: block; }

.opb-mini-table { background: #fff; flex: 1; }
.opb-mini-table .row {
  display: grid; grid-template-columns: 1.5fr 1fr 0.5fr 0.5fr;
  gap: 10px;
  padding: 8px 18px;
  border-bottom: 1px solid var(--ink-line);
  font-size: 11.5px;
  align-items: center;
}
.opb-mini-table .row:last-child { border-bottom: 0; }
.opb-mini-table .row.head {
  background: var(--paper);
  font-family: 'JetBrains Mono', monospace; font-size: 9px;
  text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--ink-faint);
}
.opb-mini-table .row .rec {
  display: inline-flex; align-items: center; gap: 6px; font-weight: 500;
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  color: var(--ink);
}
.opb-mini-table .row .rec .mk {
  width: 3px; height: 12px; border-radius: 1px;
  background: #0052FF;
  display: inline-block;
}
.opb-mini-table .row .rec .mk.warn { background: #B4731A; }
.opb-mini-table .row .badge {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 9.5px; font-weight: 500;
  padding: 2px 6px; border-radius: 2px;
  font-family: 'JetBrains Mono', monospace; letter-spacing: 0.04em;
}
.opb-mini-table .row .badge.ok { background: rgba(11,138,92,0.10); color: #0B8A5C; }
.opb-mini-table .row .badge.info { background: #F0F4FF; color: #0052FF; }
.opb-mini-table .row .own {
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px; border-radius: 50%;
  background: var(--ink-line); color: var(--ink-muted);
  font-size: 8px; font-weight: 600;
}
.opb-mini-table .row .age {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  color: var(--ink-muted);
}

/* SECTION 7: ROI (stub - directional aggregate) */
.opb-roi {
  margin-top: 60px;
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--ink-line);
  border: 1px solid var(--ink-line);
  border-radius: 14px;
  overflow: hidden;
}
@media (max-width: 900px) { .opb-roi { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .opb-roi { grid-template-columns: 1fr; } }
.opb-roi-tile {
  background: var(--paper-card);
  padding: 36px 28px;
  display: flex; flex-direction: column; gap: 10px;
}
.opb-roi-num {
  font-size: clamp(40px, 5vw, 56px);
  font-weight: 500;
  letter-spacing: -0.04em;
  color: var(--ink);
  line-height: 1;
}
.opb-roi-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--ink-faint);
}
.opb-roi-note {
  font-size: 13px; color: var(--ink-muted); line-height: 1.4;
}
.opb-roi-attr {
  margin-top: 18px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-faint);
  text-align: right;
}

/* SECTION 7: DASHBOARD ARTIFACT (KPIs + charts in app frame) */
.opb-dash-bar {
  display: flex; align-items: center; gap: 16px;
  padding: 12px 18px;
  background: var(--paper);
  border-bottom: 1px solid var(--ink-line);
}
.opb-dash-bar .crumb {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--ink-faint);
  display: flex; gap: 7px; align-items: center;
}
.opb-dash-bar .crumb .sep { color: var(--ink-line-strong); }
.opb-dash-bar .crumb .cur { color: var(--ink); }
.opb-dash-bar .spacer { flex: 1; }
.opb-dash-bar .seg {
  display: inline-flex;
  border: 1px solid var(--ink-line-strong);
  border-radius: 4px;
  background: var(--paper-card);
  padding: 2px;
  gap: 2px;
}
.opb-dash-bar .seg button {
  all: unset;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.06em;
  font-weight: 500;
  padding: 4px 9px;
  border-radius: 3px;
  color: var(--ink-muted);
  cursor: pointer;
}
.opb-dash-bar .seg button.active {
  background: rgba(94,106,210,0.12);
  color: var(--accent);
}
.opb-dash-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--ink-line);
  border-bottom: 1px solid var(--ink-line);
}
@media (max-width: 900px) { .opb-dash-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 540px) { .opb-dash-grid { grid-template-columns: 1fr; } }
.opb-kpi {
  background: var(--paper-card);
  padding: 18px 20px 16px;
  display: flex; flex-direction: column; gap: 4px;
  position: relative;
  overflow: hidden;
}
.opb-kpi-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-faint);
}
.opb-kpi-value {
  font-size: 30px; font-weight: 500; letter-spacing: -0.025em;
  display: flex; align-items: baseline; gap: 4px;
  color: var(--ink);
  line-height: 1.05;
}
.opb-kpi-value .unit {
  font-size: 13px; color: var(--ink-muted); font-weight: 500; letter-spacing: -0.005em;
}
.opb-kpi-delta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; margin-top: 4px;
  letter-spacing: 0.04em;
}
.opb-kpi-delta.up { color: var(--green); }
.opb-kpi-delta.down { color: var(--red); }
.opb-kpi-delta.neutral { color: var(--ink-muted); }
.opb-kpi-spark {
  position: absolute; right: 14px; bottom: 14px; opacity: 0.45;
}
.opb-dash-row {
  display: grid; grid-template-columns: 1.4fr 1fr;
  gap: 1px;
  background: var(--ink-line);
}
@media (max-width: 900px) { .opb-dash-row { grid-template-columns: 1fr; } }
.opb-dash-card {
  background: var(--paper-card);
  padding: 16px 20px 18px;
}
.opb-dash-card .head {
  display: flex; align-items: baseline; justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--ink-line);
  margin-bottom: 14px;
}
.opb-dash-card .head h5 {
  font-size: 14px; font-weight: 500; letter-spacing: -0.012em;
  margin: 0; color: var(--ink);
}
.opb-dash-card .legend {
  display: flex; gap: 14px; font-size: 11px; color: var(--ink-muted);
}
.opb-dash-card .legend .sw { display: inline-flex; align-items: center; gap: 6px; }
.opb-dash-card .legend .sw i {
  display: inline-block; width: 8px; height: 8px; border-radius: 2px;
}
.opb-dash-card .legend .sw.grey i { background: var(--ink-line-strong); }
.opb-dash-card .legend .sw.accent i { background: var(--accent); }
.opb-dash-card .meta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--ink-faint);
}
.opb-dash-card .chart {
  height: 156px;
  position: relative;
}
.opb-dash-bars { display: flex; flex-direction: column; gap: 12px; }
.opb-dash-bars .row .top {
  display: flex; justify-content: space-between;
  font-size: 12.5px; margin-bottom: 5px;
  color: var(--ink);
}
.opb-dash-bars .row .top .v {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; color: var(--ink-muted);
}
.opb-dash-bars .row .bar {
  height: 5px; background: rgba(11,13,17,0.06);
  border-radius: 2px; overflow: hidden;
}
.opb-dash-bars .row .bar .fill {
  height: 100%; background: var(--ink-line-strong); border-radius: 2px;
}
.opb-dash-bars .row.lead .bar .fill { background: var(--accent); }
.opb-dash-attr {
  padding: 10px 18px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-faint);
  text-align: right;
  background: var(--paper);
  border-top: 1px solid var(--ink-line);
}

/* SECTION 8: RECORDS TABLE ARTIFACT */
.opb-records-bar {
  display: flex; align-items: center; gap: 14px;
  padding: 12px 18px;
  background: var(--paper);
  border-bottom: 1px solid var(--ink-line);
}
.opb-records-bar .crumb {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--ink-faint);
  display: flex; gap: 7px; align-items: center;
}
.opb-records-bar .crumb .sep { color: var(--ink-line-strong); }
.opb-records-bar .crumb .cur { color: var(--ink); }
.opb-records-bar .spacer { flex: 1; }
.opb-records-bar .filters {
  display: flex; gap: 6px;
}
.opb-records-bar .fbtn {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.04em;
  padding: 4px 9px;
  background: var(--paper-card);
  border: 1px solid var(--ink-line-strong);
  border-radius: 4px;
  color: var(--ink);
  display: inline-flex; align-items: center; gap: 5px;
}
.opb-records-bar .fbtn .v { color: var(--ink-faint); }
.opb-records-bar .fbtn .ca { color: var(--ink-faint); font-size: 9px; }
.opb-records-table-wrap { overflow: auto; }
.opb-tbl {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.opb-tbl th {
  text-align: left;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-faint);
  font-weight: 500;
  padding: 11px 18px;
  border-bottom: 1px solid var(--ink-line);
  background: var(--paper);
  white-space: nowrap;
}
.opb-tbl td {
  padding: 13px 18px;
  border-bottom: 1px solid var(--ink-line);
  color: var(--ink);
  vertical-align: middle;
  white-space: nowrap;
}
.opb-tbl tr:last-child td { border-bottom: 0; }
.opb-tbl tr:hover td { background: var(--paper); }
.opb-tbl .rec {
  display: flex; align-items: center; gap: 10px;
  font-weight: 500;
}
.opb-tbl .rec .mk {
  width: 3px; height: 16px; border-radius: 1px;
  background: var(--accent);
}
.opb-tbl .rec.evidence .mk { background: var(--ink-line-strong); }
.opb-tbl .rec.hypothesis .mk { background: var(--warm-accent); }
.opb-tbl .rec .id {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; color: var(--ink-faint); font-weight: 400;
  margin-left: 4px;
}
.opb-tbl .person {
  display: flex; align-items: center; gap: 10px;
  font-size: 13px;
}
.opb-tbl .av {
  width: 26px; height: 26px; border-radius: 50%;
  color: white;
  display: inline-flex; align-items: center; justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; font-weight: 600;
  flex-shrink: 0;
}
.opb-tbl .av.av-1 { background: linear-gradient(180deg, #8AA9FF, #5775D9); }
.opb-tbl .av.av-2 { background: linear-gradient(180deg, #8DBDA6, #5E9277); }
.opb-tbl .av.av-3 { background: linear-gradient(180deg, #E1A879, #B47C4E); }
.opb-tbl .av.av-4 { background: linear-gradient(180deg, #D29ACC, #A06BA5); }
.opb-tbl .av.av-5 { background: linear-gradient(180deg, #B8BEC7, #8B93A0); color: #2B2F38; }
.opb-tbl .av.av-6 { background: linear-gradient(180deg, #9EB4CE, #6D8AAC); }
.opb-tbl .av.av-7 { background: linear-gradient(180deg, #CEBE9E, #A08E6E); }
.opb-tbl .av.av-8 { background: linear-gradient(180deg, #9ECEBE, #6EA08E); }
.opb-tbl .mono {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px; color: var(--ink-muted);
}
.opb-tbl .age {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; color: var(--ink-faint);
}
.opb-records-foot {
  padding: 11px 18px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-faint);
  background: var(--paper);
  border-top: 1px solid var(--ink-line);
  display: flex; justify-content: space-between;
}

/* SECTION 8: DOMAINS */
.opb-domains {
  margin-top: 60px;
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
  background: var(--ink-line);
  border: 1px solid var(--ink-line);
  border-radius: 14px;
  overflow: hidden;
}
@media (max-width: 900px) { .opb-domains { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .opb-domains { grid-template-columns: 1fr; } }
.opb-domain {
  background: var(--paper-card);
  padding: 24px 22px;
  display: flex; flex-direction: column; gap: 10px;
  min-height: 130px;
}
.opb-domain .label {
  font-size: 18px; font-weight: 500; letter-spacing: -0.018em; color: var(--ink);
}
.opb-domain .meta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ink-muted);
  display: flex; gap: 8px; flex-wrap: wrap; align-items: center;
}
.opb-domain .meta .sep { color: var(--ink-faint); }
.opb-domain .weight {
  margin-top: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--ink-faint);
}
.opb-domain.advocacy .weight { color: var(--accent); }
.opb-domain.hypothesis .label { color: var(--ink-muted); }

/* SECTION 9: CTA (centered with testimonial) */
.opb-cta {
  background: var(--paper-card);
  padding: 120px 28px;
  text-align: center;
  border-top: 1px solid var(--ink-line);
}
.opb-cta-inner { max-width: 760px; margin: 0 auto; }
.opb-cta-h {
  font-size: clamp(36px, 5vw, 60px);
  font-weight: 500;
  letter-spacing: -0.038em;
  line-height: 1.04;
  margin: 0;
  color: var(--ink);
}
.opb-cta-sub {
  margin: 22px auto 0;
  max-width: 50ch;
  font-size: 16px; color: var(--ink-muted); line-height: 1.5;
}
.opb-cta-actions {
  margin-top: 36px;
  display: inline-flex; gap: 12px; flex-wrap: wrap; justify-content: center;
}
.opb-cta-quote {
  margin: 80px auto 0; max-width: 640px;
  padding: 32px 28px;
  background: var(--paper);
  border: 1px solid var(--ink-line);
  border-radius: 14px;
  text-align: left;
}
.opb-cta-quote .text {
  font-size: 18px; line-height: 1.4; letter-spacing: -0.018em; color: var(--ink);
  font-style: italic;
}
.opb-cta-quote .who {
  margin-top: 18px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ink-faint);
}

/* FOOTER */
.opb-foot {
  background: var(--paper);
  border-top: 1px solid var(--ink-line);
  padding: 28px;
}
.opb-foot-inner {
  max-width: 1240px; margin: 0 auto;
  display: flex; justify-content: space-between;
  font-size: 12px; color: var(--ink-faint);
  flex-wrap: wrap; gap: 16px;
}
`;

export default function HomeOptionB() {
  useEffect(() => {
    document.title = "Option B · Recognition-led";
  }, []);

  useEffect(() => {
    const band = document.querySelector<HTMLElement>(".opb-timeline-band");
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
    const nav = document.querySelector<HTMLElement>(".opb-nav");
    const band = document.querySelector<HTMLElement>(".opb-hero-band");
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
      {/* CARD 1: CALENDAR INVITE */}
      <div className="opb-symptom calendar">
        <div className="opb-symptom-head">
          <span className="app"><span className="glyph" />Outlook Calendar</span>
          <span className="meta">Apr 18 · 2:00 PM</span>
        </div>
        <div className="opb-symptom-body">
          <div className="cal-title">Investigation review</div>
          <div className="cal-pill"><span className="dot" />9th rescheduling</div>

          <div className="cal-attempts">
            <div className="cal-attempts-label">
              <span>Attempt log</span>
              <span className="count">last 4 of 9</span>
            </div>
            <div className="cal-attempt">
              <span className="num">02</span>
              <span className="date">Feb 05</span>
              <span className="reason">moved · no quorum</span>
            </div>
            <div className="cal-attempt">
              <span className="num">05</span>
              <span className="date">Mar 18</span>
              <span className="reason">3 declines · moved</span>
            </div>
            <div className="cal-attempt">
              <span className="num">07</span>
              <span className="date">Apr 01</span>
              <span className="reason">7 declines · moved</span>
            </div>
            <div className="cal-attempt current">
              <span className="num">09</span>
              <span className="date">Apr 18</span>
              <span className="reason">tentative · 5 of 14</span>
            </div>
          </div>

          <div className="cal-attendees">
            <span className="av">JM</span>
            <span className="av">RS</span>
            <span className="av">PT</span>
            <span className="av">MM</span>
            <span className="av">AL</span>
            <span className="more">+ 9</span>
          </div>

          <div className="cal-foot-line">
            <span className="strike">view recording</span>
            <span>0 of 9 recorded</span>
          </div>
        </div>
        <div className="opb-symptom-foot">
          <span className="role">Quality Manager · Class II device company</span>
          <span className="quote">Your last investigation took 90 days. Nobody can tell you why.</span>
        </div>
      </div>

      {/* CARD 2: SHAREPOINT FOLDERS */}
      <div className="opb-symptom sharepoint">
        <div className="opb-symptom-head">
          <span className="app"><span className="glyph" />SharePoint</span>
          <span className="meta">/Quality/Audit/2024</span>
        </div>
        <div className="opb-symptom-body">
          <div className="sp-crumbs">
            Quality &gt; Audit &gt; <b>2024</b> &gt; <b>Q1 prep</b>
          </div>
          <div className="sp-folders">
            <div className="sp-folder">
              <span className="ico" />
              <span className="name">01_Internal_Audit_Prep</span>
              <span className="meta">47 items</span>
            </div>
            <div className="sp-folder">
              <span className="ico" />
              <span className="name">02_External_Audit_2024_Q1</span>
              <span className="meta">31 items</span>
            </div>
            <div className="sp-folder">
              <span className="ico" />
              <span className="name">03_Audit_Working_FINAL</span>
              <span className="meta">89 items</span>
            </div>
            <div className="sp-folder">
              <span className="ico" />
              <span className="name">04_Submission_v3_FINAL_v2</span>
              <span className="meta">22 items</span>
            </div>
          </div>
          <div className="sp-banner">
            <span>4 folders · 189 items</span>
            <span>last edit · 26m ago</span>
          </div>
        </div>
        <div className="opb-symptom-foot">
          <span className="role">VP Quality · ISO 13485 manufacturer</span>
          <span className="quote">Audit prep started with a scramble across four folders.</span>
        </div>
      </div>

      {/* CARD 3: OUTLOOK THREAD */}
      <div className="opb-symptom outlook">
        <div className="opb-symptom-head">
          <span className="app"><span className="glyph" />Outlook</span>
          <span className="meta">Inbox · 3 weeks</span>
        </div>
        <div className="opb-symptom-body">
          <div className="ol-subject">RE: RE: RE: RE: where is the GC trace?</div>
          <div className="ol-meta">17 replies · 14 people</div>
          <div className="ol-replies">
            <div className="ol-reply">
              <span className="av">JM</span>
              <span className="from"><b>John M.</b> · Following up on the supplier CoA</span>
              <span className="when">Mar 22</span>
            </div>
            <div className="ol-reply">
              <span className="av">PT</span>
              <span className="from"><b>Priya T.</b> · GC trace from B2 is missing</span>
              <span className="when">Mar 31</span>
            </div>
            <div className="ol-reply">
              <span className="av">AL</span>
              <span className="from"><b>Anna L.</b> · Adding everyone, let's just call</span>
              <span className="when">Apr 11</span>
            </div>
          </div>
        </div>
        <div className="opb-symptom-foot">
          <span className="role">QA Director · API supplier</span>
          <span className="quote">The review got rebuilt from email three weeks late.</span>
        </div>
      </div>

      {/* CARD 4: TEAMS MEETING */}
      <div className="opb-symptom tm-meet">
        <div className="opb-symptom-head">
          <span className="app"><span className="glyph" />Teams · Meeting</span>
          <span className="meta">Ended 11:42 AM</span>
        </div>
        <div className="opb-symptom-body">
          <div className="tm-title">Quick sync</div>
          <div className="tm-warn"><span className="dot" />notes captured: 0</div>
          <div className="tm-attendees">
            <div className="tm-attendee">
              <span className="av">DO</span>
              <span className="nm">Director of Operations</span>
              <span className="role-tag">organizer</span>
            </div>
            <div className="tm-attendee">
              <span className="av">AL</span>
              <span className="nm">Anna L.</span>
              <span className="role-tag">qa</span>
            </div>
            <div className="tm-attendee">
              <span className="av">RS</span>
              <span className="nm">Ravi S.</span>
              <span className="role-tag">eng</span>
            </div>
          </div>
          <div className="tm-rec">
            <span className="strike">no recording available</span>
            <span>32 min</span>
          </div>
        </div>
        <div className="opb-symptom-foot">
          <span className="role">Director of Operations · Medtech</span>
          <span className="quote">We had a verbal yes in a meeting. The system of record never knew.</span>
        </div>
      </div>

      {/* CARD 5: TEAMS CHAT */}
      <div className="opb-symptom tm-chat">
        <div className="opb-symptom-head">
          <span className="app"><span className="glyph" />Teams</span>
          <span className="meta">#quality-ops</span>
        </div>
        <div className="opb-symptom-body">
          <div className="tc-feed">
            <div className="tc-msg muted">
              <span className="av">MM</span>
              <div className="body">
                <div className="from">Marc M. · 9:32</div>
                <div className="text">Anyone holding lot 47B? OOS hit on incoming.</div>
              </div>
            </div>
            <div className="tc-msg highlight">
              <span className="av">PT</span>
              <div className="body">
                <div className="from">Priya T. · 10:46</div>
                <div className="text">Lot is on hold. Reason in this thread, not in the system.</div>
              </div>
            </div>
            <div className="tc-msg muted">
              <span className="av">AL</span>
              <div className="body">
                <div className="from">Anna L. · 11:30</div>
                <div className="text">Document this. We can't lose it.</div>
              </div>
            </div>
          </div>
          <div className="tc-typing">Anna L. is typing.</div>
        </div>
        <div className="opb-symptom-foot">
          <span className="role">Production Manager · Sterile fill-finish</span>
          <span className="quote">Lot was on hold for a reason living in a Teams chat.</span>
        </div>
      </div>

      {/* CARD 6: EXCEL */}
      <div className="opb-symptom excel">
        <div className="opb-symptom-head">
          <span className="app"><span className="glyph" />Excel</span>
          <span className="meta">Recall_Scope_v3.xlsx</span>
        </div>
        <div className="opb-symptom-body">
          <div className="xl-tabs">
            <span className="tab">Sheet1</span>
            <span className="tab active">Lots</span>
            <span className="tab">Customers</span>
          </div>
          <div className="xl-grid">
            <div className="xl-row head">
              <span className="xl-cell row-h" />
              <span className="xl-cell">Lot #</span>
              <span className="xl-cell">Status</span>
              <span className="xl-cell">In scope?</span>
            </div>
            <div className="xl-row">
              <span className="xl-cell row-h">1</span>
              <span className="xl-cell">B-2401</span>
              <span className="xl-cell">Shipped</span>
              <span className="xl-cell">Yes</span>
            </div>
            <div className="xl-row">
              <span className="xl-cell row-h">2</span>
              <span className="xl-cell">B-2402</span>
              <span className="xl-cell">Shipped</span>
              <span className="xl-cell flagged">Maybe?</span>
            </div>
            <div className="xl-row">
              <span className="xl-cell row-h">3</span>
              <span className="xl-cell">B-2403</span>
              <span className="xl-cell">Recalled</span>
              <span className="xl-cell">Yes</span>
            </div>
          </div>
          <div className="xl-comment">
            Should B-2402 be in scope? I think yes but I can't find the customer report.
            <span className="by">Comment · John M. · 6 days ago</span>
          </div>
        </div>
        <div className="opb-symptom-foot">
          <span className="role">Compliance Officer · Combination products</span>
          <span className="quote">Recall scope was built from memory.</span>
        </div>
      </div>
    </>
  );

  return (
    <div className="opb-root">
      <style>{STYLES}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,450;0,500;0,600;1,400;1,450&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* NAV */}
      <nav className="opb-nav">
        <div className="opb-nav-inner">
          <Link to="/option-b" className="opb-nav-logo" aria-label="Unifize">
            <img src="/Link%20-%20home.svg" alt="Unifize" className="opb-nav-logo-img" />
          </Link>
          <div className="opb-nav-items">
            <a href="#symptoms">Symptoms</a>
            <a href="#why">Why</a>
            <a href="#layer">The layer</a>
            <a href="#world">Your world</a>
          </div>
          <div className="opb-nav-actions">
            <Link to="/option-a" className="opb-nav-link mono">→ Option A</Link>
            <button className="opb-nav-btn">Book a demo</button>
          </div>
        </div>
      </nav>

      {/* SECTION 1: HERO (editorial collage) */}
      <div className="opb-hero-band">
      <section className="opb-hero">
        <div>
          <div className="opb-hero-tag">
            <span className="dot" />
            <span>You already live this</span>
          </div>
          <h1 className="opb-hero-h1">
            Records live in&nbsp;systems.{" "}
            <span className="em">Work lives between&nbsp;them.</span>
          </h1>
          <p className="opb-hero-sub">
            Calendar choked with sync-ups. An email thread three weeks deep. A folder of evidence nobody can find at audit. There's a name for it.
          </p>
          <div className="opb-hero-cta">
            <button className="opb-btn-primary">
              Book a demo
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <a href="#why" className="opb-btn-ghost">Why it happens</a>
          </div>
        </div>

        <div className="opb-collage" aria-hidden>
          {/* QMS. Investigation in flight. Calendar slot. Top, big, slight left tilt. */}
          <div className="opb-frame qms">
            <div className="head">
              <span className="who">TrackWise · CAPA-241</span>
              <span>Day 36 · pending</span>
            </div>
            <div className="opb-flow">
              <div className="opb-flow-step done">
                <span className="dot" />
                <span className="lbl">Initiated</span>
                <span className="day">Day 0</span>
              </div>
              <div className="opb-flow-step done">
                <span className="dot" />
                <span className="lbl">Investigation</span>
                <span className="day">Day 11</span>
              </div>
              <div className="opb-flow-step active">
                <span className="dot" />
                <span className="lbl">CAPA · approval</span>
                <span className="day">+24d</span>
              </div>
              <div className="opb-flow-step">
                <span className="dot" />
                <span className="lbl">Effectiveness</span>
                <span className="day">n/a</span>
              </div>
              <div className="opb-flow-step">
                <span className="dot" />
                <span className="lbl">Closed</span>
                <span className="day">n/a</span>
              </div>
            </div>
            <div className="opb-meta-row">
              <span className="k">Discrepancy</span>
              <span className="v">Material variance, Lot 47B</span>
            </div>
            <div className="opb-meta-row">
              <span className="k">Investigator</span>
              <span className="v">D. Storm, Quality Mgr</span>
            </div>
            <div className="opb-meta-row alert">
              <span className="k">Approval</span>
              <span className="v">Routed to D. Storm. Pending 24 days.</span>
            </div>
            <div className="opb-meta-row">
              <span className="k">Compliance</span>
              <span className="v">21 CFR Part 11. e-signature pending.</span>
            </div>
          </div>

          {/* ERP. Material movements with a hold. Email slot. Front, bottom-left. */}
          <div className="opb-frame erp">
            <div className="head">
              <span className="who">SAP · Material 47B</span>
              <span>11d on hold</span>
            </div>
            {[
              { tag: "HOLD", from: "47B-LOT-1142", snip: "BLOCKED. Awaiting QA disposition.", w: "11d", state: "alert" as const },
              { tag: "GR", from: "Goods receipt 4500001142", snip: "200 EA. Variance flagged on incoming inspection.", w: "Apr 18", state: "warn" as const },
              { tag: "GR", from: "Goods receipt 4500001138", snip: "200 EA. Cleared.", w: "Apr 15", state: "" as const },
              { tag: "REL", from: "Production order 7110-22", snip: "Released against component 47B.", w: "Apr 11", state: "" as const },
              { tag: "PO", from: "Purchase order 4500001120", snip: "Supplier: Pacific Materials.", w: "Apr 02", state: "" as const },
            ].map((r) => (
              <div key={r.from} className={`opb-erp-row ${r.state}`}>
                <div className="opb-erp-tag">{r.tag}</div>
                <div className="body">
                  <div className="from">{r.from}</div>
                  <div className="snip">{r.snip}</div>
                </div>
                <div className="when">{r.w}</div>
              </div>
            ))}
          </div>

          {/* PLM. Drawing revisions, awaiting QA. SharePoint slot. Right, mid-height. */}
          <div className="opb-frame plm">
            <div className="head">
              <span className="who">Windchill · DOC-25</span>
              <span>v3 to v4 · 8d</span>
            </div>
            {[
              { rev: "v4", state: "In work", who: "P. Tan", w: "8d open", warn: true },
              { rev: "v3", state: "Released", who: "P. Tan", w: "Sep 14", warn: false },
              { rev: "v2", state: "Superseded", who: "R. Singh", w: "Mar 02", warn: false },
              { rev: "v1", state: "Released", who: "R. Singh", w: "Oct 12", warn: false },
            ].map((r) => (
              <div key={r.rev} className={`opb-plm-row ${r.warn ? "warn" : ""}`}>
                <span className="rev">{r.rev}</span>
                <span className="state">{r.state}</span>
                <span className="who">{r.who}</span>
                <span className="when">{r.w}</span>
              </div>
            ))}
            <div className="opb-plm-foot">
              <span className="k">Linked ECN</span>
              <span className="v">ECN-0788. QA sign-off pending.</span>
            </div>
          </div>

          {/* LEAK-OUT STICKIES. Work that doesn't live in any of the systems above. */}
          <div className="opb-leak teams t1">
            <div className="head">
              <span>Teams DM</span>
              <span className="who">Priya T.</span>
            </div>
            <div className="body">"Did anyone confirm the lot disposition? Anil's blocking release on 47B."</div>
          </div>
          <div className="opb-leak outlook t2">
            <div className="head">
              <span>Outlook</span>
              <span className="who">RE: RE: RE: CAPA-241</span>
            </div>
            <div className="body">"What's holding this up? Audit's in two weeks."</div>
          </div>
          <div className="opb-leak excel t3">
            <div className="head">
              <span>Excel</span>
              <span className="who">NC_Tracker_FINAL_v3.xlsx</span>
            </div>
            <div className="body">CAPA-241 | <span className="err">#REF!</span> | "use this row"</div>
          </div>
        </div>
      </section>
      </div>

      {/* SECTION 2: SYMPTOM GALLERY */}
      <section className="opb-section" id="symptoms">
        <div className="opb-eyebrow">
          <span className="dot" />
          <span className="num">02</span>
          <span className="sep">/</span>
          <span className="name">The work the record does not catch</span>
        </div>
        <h2 className="opb-h2">
          Six recurring conditions in regulated operations. <span className="dim">None on the audit trail.</span>
        </h2>

        <div className="opb-symptoms">
          <div className="opb-symptoms-track">
            {symptomCards}
            {symptomCards}
          </div>
        </div>
      </section>

      {/* SECTION 3: WHY IT HAPPENS / GAP REVEAL (folded with old section 5 SoR rail) */}
      <section className="opb-section" id="why" style={{ paddingTop: 60, paddingBottom: 140 }}>
        <div className="opb-eyebrow">
          <span className="dot" />
          <span className="num">03</span>
          <span className="sep">/</span>
          <span className="name">Why it happens</span>
        </div>
        <h2 className="opb-h2">
          Each system records its part.{" "}
          <span className="dim">None of them owns the work between. That space has a name.</span>{" "}
          <span className="opb-name-reveal">Coordination tax.</span>
        </h2>
        <p className="opb-tax-def">
          The cost of holding cross-functional work together when no layer owns it. Paid in cycle time, rework, audit risk, decisions made twice. You've been paying it for years.
        </p>

        <div className="opb-timeline-band">
          <div className="opb-tl-rail">
            <div className="opb-tl-rail-line" />
            <div className="opb-tl-milestone" style={{ left: "0%", ["--i" as string]: 0 } as React.CSSProperties}>
              <span className="title">Opened</span>
              <span className="node" />
              <span className="day">Day 0</span>
            </div>
            <div className="opb-tl-milestone" style={{ left: "25%", ["--i" as string]: 1 } as React.CSSProperties}>
              <span className="title">Investigation</span>
              <span className="node" />
              <span className="day">Day 11</span>
            </div>
            <div className="opb-tl-milestone" style={{ left: "50%", ["--i" as string]: 2 } as React.CSSProperties}>
              <span className="title">Root cause</span>
              <span className="node" />
              <span className="day">Day 35</span>
            </div>
            <div className="opb-tl-milestone" style={{ left: "75%", ["--i" as string]: 3 } as React.CSSProperties}>
              <span className="title">Action plan</span>
              <span className="node" />
              <span className="day">Day 49</span>
            </div>
            <div className="opb-tl-milestone end" style={{ right: "0%", ["--i" as string]: 4 } as React.CSSProperties}>
              <span className="title">Closed</span>
              <span className="node" />
              <span className="day">Day 68</span>
            </div>
          </div>

          <div className="opb-tl-clusters">
            <div className="opb-tl-cluster" style={{ ["--i" as string]: 0 } as React.CSSProperties}>
              <span className="opb-tl-chip outlook"><span className="dot" />Outlook</span>
              <span className="opb-tl-chip teams"><span className="dot" />Teams</span>
              <span className="opb-tl-chip sharepoint"><span className="dot" />Share·v1</span>
              <span className="opb-tl-chip excel"><span className="dot" />Excel</span>
              <span className="opb-tl-chip outlook"><span className="dot" />Outlook</span>
              <span className="opb-tl-chip meeting"><span className="dot" />Meeting</span>
              <span className="opb-tl-chip teams"><span className="dot" />Teams·DM</span>
            </div>
            <div className="opb-tl-cluster" style={{ ["--i" as string]: 1 } as React.CSSProperties}>
              <span className="opb-tl-chip teams"><span className="dot" />Teams</span>
              <span className="opb-tl-chip outlook"><span className="dot" />Outlook</span>
              <span className="opb-tl-chip sharepoint"><span className="dot" />Share·v2</span>
              <span className="opb-tl-chip meeting"><span className="dot" />Meeting</span>
              <span className="opb-tl-chip excel"><span className="dot" />Excel</span>
              <span className="opb-tl-chip outlook"><span className="dot" />Outlook</span>
              <span className="opb-tl-chip teams"><span className="dot" />Teams·@QA</span>
              <span className="opb-tl-chip sharepoint"><span className="dot" />Share·v3</span>
              <span className="opb-tl-chip outlook"><span className="dot" />Outlook</span>
              <span className="opb-tl-chip meeting"><span className="dot" />Meeting</span>
              <span className="opb-tl-chip teams"><span className="dot" />Teams·DM</span>
              <span className="opb-tl-chip excel"><span className="dot" />Excel·Fin</span>
              <span className="opb-tl-chip sharepoint"><span className="dot" />Share·v4</span>
              <span className="opb-tl-chip outlook"><span className="dot" />Outlook</span>
              <span className="opb-tl-chip teams"><span className="dot" />Teams</span>
              <span className="opb-tl-chip meeting"><span className="dot" />Meeting</span>
              <span className="opb-tl-chip outlook"><span className="dot" />Outlook</span>
              <span className="opb-tl-chip sharepoint"><span className="dot" />Share·v5</span>
              <span className="opb-tl-chip excel"><span className="dot" />Excel·v2</span>
              <span className="opb-tl-chip outlook"><span className="dot" />Outlook</span>
              <span className="opb-tl-chip teams"><span className="dot" />Teams</span>
              <span className="opb-tl-chip meeting"><span className="dot" />Meeting</span>
            </div>
            <div className="opb-tl-cluster" style={{ ["--i" as string]: 2 } as React.CSSProperties}>
              <span className="opb-tl-chip outlook"><span className="dot" />Outlook</span>
              <span className="opb-tl-chip teams"><span className="dot" />Teams</span>
              <span className="opb-tl-chip sharepoint"><span className="dot" />Share·v6</span>
              <span className="opb-tl-chip excel"><span className="dot" />Excel·Fin</span>
              <span className="opb-tl-chip meeting"><span className="dot" />Meeting</span>
              <span className="opb-tl-chip outlook"><span className="dot" />Outlook</span>
              <span className="opb-tl-chip teams"><span className="dot" />Teams·DM</span>
              <span className="opb-tl-chip sharepoint"><span className="dot" />Share·v7</span>
              <span className="opb-tl-chip outlook"><span className="dot" />Outlook</span>
              <span className="opb-tl-chip excel"><span className="dot" />Excel·v3</span>
              <span className="opb-tl-chip meeting"><span className="dot" />Meeting</span>
              <span className="opb-tl-chip outlook"><span className="dot" />Outlook</span>
            </div>
            <div className="opb-tl-cluster" style={{ ["--i" as string]: 3 } as React.CSSProperties}>
              <span className="opb-tl-chip teams"><span className="dot" />Teams</span>
              <span className="opb-tl-chip outlook"><span className="dot" />Outlook</span>
              <span className="opb-tl-chip sharepoint"><span className="dot" />Share·v8</span>
              <span className="opb-tl-chip excel"><span className="dot" />Excel·Aud</span>
              <span className="opb-tl-chip meeting"><span className="dot" />Meeting</span>
              <span className="opb-tl-chip outlook"><span className="dot" />Outlook</span>
              <span className="opb-tl-chip teams"><span className="dot" />Teams·DM</span>
              <span className="opb-tl-chip sharepoint"><span className="dot" />Share·v9</span>
              <span className="opb-tl-chip outlook"><span className="dot" />Outlook</span>
              <span className="opb-tl-chip excel"><span className="dot" />Excel·v4</span>
              <span className="opb-tl-chip meeting"><span className="dot" />Meeting</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: THE LAYER (dark) */}
      <div className="opb-dark">
        <section className="opb-section opb-layer" id="layer">
          <div className="opb-eyebrow">
            <span className="dot" />
            <span className="num">05</span>
            <span className="sep">/</span>
            <span className="name">The layer</span>
          </div>
          <h2 className="opb-h2">
            One thread. Every move bound.
          </h2>

          <p className="opb-sub" style={{ maxWidth: "52ch" }}>
            Decision, evidence, and approval live in the same place as the record.
          </p>

          <div className="opb-preview">
            <span className="opb-preview-glow" aria-hidden />
            <div className="opb-preview-frame">
              <iframe src="/chat?embed=1" title="Unifize product preview" loading="lazy" />
            </div>
          </div>
        </section>
      </div>

      {/* OBSOLETE START — REMOVE_BEGIN */}
      <div style={{ display: "none" }}>
          <div className="opb-app-card">
            <div className="opb-app-chrome">
              <span className="dots"><i /><i /><i /></span>
              <span className="url">app.unifize.com / NC-25</span>
              <span className="pill"><span className="pulse" />LIVE</span>
            </div>

            <div className="opb-chat-shell">
              <div className="opb-chat-thread">
                <div className="opb-chat-thead">
                  <div className="row">
                    <span className="opb-chat-badge info"><span className="pulse" />IDENTIFIED</span>
                    <span className="opb-chat-id">NC-25</span>
                    <span className="opb-chat-id dim">·</span>
                    <span className="opb-chat-id">Opened Apr 18</span>
                  </div>
                  <h4>Assembly defect detected in final inspection</h4>
                  <div className="meta">
                    <span><span className="k">Owner</span>Lisa Martin</span>
                    <span><span className="k">Due</span>Apr 24</span>
                    <span><span className="k">Linked</span>CAR-41 · RCA-12</span>
                  </div>
                </div>

                <div className="opb-chat-body">
                  <div className="opb-day">
                    <span className="line" />
                    <span className="lbl">Apr 18</span>
                    <span className="line" />
                  </div>

                  <span className="opb-anchor">00 · Trigger event</span>
                  <div className="opb-sys">· Lisa Martin opened NC-25 from deviation log entry</div>

                  <span className="opb-anchor">01 · Owner assigned</span>
                  <div className="opb-msg">
                    <div className="av">LM</div>
                    <div className="body">
                      <div className="head">
                        <span className="who">Lisa Martin</span>
                        <span className="when">09:02</span>
                      </div>
                      <div className="text">
                        Assembly defect found at final inspection. Assigning ownership by role to Quality Lead. Daniel will pick this up.
                      </div>
                    </div>
                  </div>

                  <span className="opb-anchor">02 · Decision node</span>
                  <div className="opb-msg">
                    <div className="av bot">U</div>
                    <div className="body">
                      <div className="head">
                        <span className="who primary">Unifize Assistant</span>
                        <span className="when">09:14</span>
                      </div>
                      <div className="opb-bot-card">
                        <div className="head">
                          <div>
                            <div className="t">Updated checklist</div>
                            <div className="ttl">Disposition action</div>
                          </div>
                          <span className="opb-chat-badge info">LINKED</span>
                        </div>
                        <div className="body">
                          <div className="opb-bot-row done">
                            <span className="cb" />
                            <span className="k">Scrap</span>
                            <span className="v">12 units</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <span className="opb-anchor">03 · Evidence binding</span>
                  <div className="opb-msg">
                    <div className="av bot">U</div>
                    <div className="body">
                      <div className="head">
                        <span className="who primary">Unifize Assistant</span>
                        <span className="when">10:14</span>
                      </div>
                      <div className="opb-bot-card">
                        <div className="head">
                          <div>
                            <div className="t">Root cause analysis</div>
                            <div className="ttl">RCA-12 · evidence bound to decision</div>
                          </div>
                          <span className="opb-chat-badge info">LINKED</span>
                        </div>
                        <div className="body">
                          <div className="opb-bot-row done">
                            <span className="cb" />
                            <span className="k">Material inconsistency</span>
                            <span className="v">High confidence</span>
                          </div>
                          <div className="opb-bot-row done">
                            <span className="cb" />
                            <span className="k">GC trace · BatchA.xlsx</span>
                            <span className="v">5 attachments</span>
                          </div>
                          <div className="opb-bot-row">
                            <span className="cb" />
                            <span className="k">Operator training gap</span>
                            <span className="v">Investigating</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <span className="opb-anchor">04 · Approval stamp</span>
                  <div className="opb-msg">
                    <div className="av">DS</div>
                    <div className="body">
                      <div className="head">
                        <span className="who">Daniel Storm</span>
                        <span className="when">14:22</span>
                      </div>
                      <div className="text">
                        CAR-41 reviewed. Approving with electronic signature. Bound to role and regulation.
                      </div>
                      <span className="opb-stamp">21 CFR 11 · Approved</span>
                    </div>
                  </div>

                  <span className="opb-anchor">05 · Handoff</span>
                  <div className="opb-sys">· Linked to ECO-0788 · picked up by Engineering Lead, state preserved</div>

                  <span className="opb-anchor">06 · Closure check</span>
                  <div className="opb-msg">
                    <div className="av bot">U</div>
                    <div className="body">
                      <div className="head">
                        <span className="who primary">Unifize Assistant</span>
                        <span className="when">Apr 24</span>
                      </div>
                      <div className="text">
                        Effectiveness verified. Linked records updated. Audit trail final.
                      </div>
                      <span className="opb-stamp">Closed</span>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="opb-aside">
                <div className="head">
                  <span className="eb">CAR-41 · Checklist</span>
                  <span className="ver">v4.2</span>
                </div>
                <div className="ttl">Corrective action request</div>
                <div className="prog-row">
                  <span>Completion</span>
                  <span className="frac">5/8 sections</span>
                </div>
                <div className="bar"><div className="fill" style={{ width: "62.5%" }} /></div>
                <div className="secs">
                  <div className="sec done"><span className="d done" /><span className="t">Inputs</span><span className="frac">4/4</span></div>
                  <div className="sec done"><span className="d done" /><span className="t">Basic information</span><span className="frac">6/6</span></div>
                  <div className="sec done"><span className="d done" /><span className="t">Disposition</span><span className="frac">3/3</span></div>
                  <div className="sec active"><span className="d active" /><span className="t">Corrective actions</span><span className="frac">2/5</span></div>
                  <div className="sec pend"><span className="d pend" /><span className="t">Verify &amp; Validate</span><span className="frac">0/4</span></div>
                  <div className="sec pend"><span className="d pend" /><span className="t">Approvals</span><span className="frac">0/2</span></div>
                  <div className="sec pend"><span className="d pend" /><span className="t">PDF report</span><span className="frac">0/1</span></div>
                  <div className="sec pend"><span className="d pend" /><span className="t">Related records</span><span className="frac">0/3</span></div>
                </div>
              </aside>
            </div>
          </div>
      </div>
      {/* OBSOLETE END — REMOVE_END */}

      {/* SECTION 6: DIPTYCH */}
      <section className="opb-section" style={{ paddingTop: 120 }}>
        <div className="opb-eyebrow">
          <span className="dot" />
          <span className="num">06</span>
          <span className="sep">/</span>
          <span className="name">What changes</span>
        </div>
        <h2 className="opb-h2">
          The same record. Two shapes.{" "}
          <span className="dim">Same people, same regulation. Different layer underneath.</span>
        </h2>

        <div className="opb-diptych">
          <div className="opb-diptych-pane before">
            <div className="opb-pane-head">
              <div className="head">
                <span>BEFORE · Fragmented</span>
                <span className="state">92 days · 3 reopens</span>
              </div>
              <div className="title">REC-2412, lived across four tools.</div>
            </div>

            <div className="opb-old-stack">
              <div className="opb-old-win opb-old-outlook">
                <div className="opb-old-bar">
                  <span className="t">Inbox · Microsoft Outlook</span>
                  <span className="x">_ □ ✕</span>
                </div>
                <div className="opb-old-body">
                  <div className="opb-old-row unread">
                    <span className="from">Anna L.</span>
                    <span className="subj">RE: RE: RE: RE: REC-2412 root cause? <em>(17)</em></span>
                    <span className="date">Mar 31</span>
                  </div>
                  <div className="opb-old-row">
                    <span className="from">Priya T.</span>
                    <span className="subj">FW: FW: GC trace from B2 missing</span>
                    <span className="date">Mar 22</span>
                  </div>
                  <div className="opb-old-row">
                    <span className="from">John M.</span>
                    <span className="subj">Following up on supplier CoA</span>
                    <span className="date">Mar 18</span>
                  </div>
                </div>
              </div>

              <div className="opb-old-win opb-old-sp">
                <div className="opb-old-bar">
                  <span className="t">SharePoint · /Quality/Audit/2024</span>
                  <span className="x">_ □ ✕</span>
                </div>
                <div className="opb-old-body">
                  <div className="opb-old-file">📄 Audit_Working.xlsx</div>
                  <div className="opb-old-file">📄 Audit_Working_FINAL.xlsx</div>
                  <div className="opb-old-file">📄 Audit_Working_FINAL_v2.xlsx</div>
                  <div className="opb-old-file warn">📄 Audit_FINAL_USE_THIS.xlsx <em>broken link</em></div>
                </div>
              </div>

              <div className="opb-old-win opb-old-teams">
                <div className="opb-old-bar">
                  <span className="t">Teams · #quality-ops</span>
                  <span className="x">_ □ ✕</span>
                </div>
                <div className="opb-old-body">
                  <div className="opb-old-msg">
                    <span className="who">Marc M. <span className="ts">9:32</span></span>
                    <span className="txt">Anyone holding lot 47B? OOS on incoming.</span>
                  </div>
                  <div className="opb-old-msg">
                    <span className="who">Priya T. <span className="ts">10:46</span></span>
                    <span className="txt">Lot is on hold. Reason in this thread.</span>
                  </div>
                </div>
              </div>

              <div className="opb-old-win opb-old-excel">
                <div className="opb-old-bar">
                  <span className="t">NC_Tracker.xlsx [Read-Only]</span>
                  <span className="x">_ □ ✕</span>
                </div>
                <div className="opb-old-body opb-old-grid">
                  <div className="cell h">A</div>
                  <div className="cell h">B</div>
                  <div className="cell h">C</div>
                  <div className="cell">REC-2412</div>
                  <div className="cell">In progress</div>
                  <div className="cell err">#REF!</div>
                  <div className="cell">REC-2410</div>
                  <div className="cell">Closed</div>
                  <div className="cell">Mar 14</div>
                </div>
              </div>
            </div>
          </div>

          <div className="opb-diptych-pane after">
            <div className="opb-pane-head">
              <div className="head">
                <span>AFTER · Single thread</span>
                <span className="state">21 days · 0 reopens</span>
              </div>
              <div className="title">REC-2412, governed end to end.</div>
            </div>

            <div className="opb-mini-app">
              <div className="opb-mini-bar">
                <span className="dots"><i /><i /><i /></span>
                <span className="crumb">Quality / Dashboard</span>
                <span className="spacer" />
                <span className="kbd">⌘K</span>
              </div>

              <div className="opb-mini-head">
                <div className="eb"><span className="dot" />Quality · Q2 2026</div>
                <h4>Non-conformances</h4>
              </div>

              <div className="opb-mini-kpis">
                <div className="opb-mini-kpi">
                  <div className="lbl">Closure TAT</div>
                  <div className="val">14.2<span>d</span></div>
                  <div className="dl up">↓ 8.1%</div>
                </div>
                <div className="opb-mini-kpi">
                  <div className="lbl">Open NCs</div>
                  <div className="val">27</div>
                  <div className="dl down">↑ 3</div>
                </div>
                <div className="opb-mini-kpi">
                  <div className="lbl">Closed Q2</div>
                  <div className="val">41</div>
                  <div className="dl up">↑ 12</div>
                </div>
                <div className="opb-mini-kpi">
                  <div className="lbl">On-time</div>
                  <div className="val">82<span>%</span></div>
                  <div className="dl up">↑ 4pt</div>
                </div>
              </div>

              <div className="opb-mini-chart">
                <div className="lbl">Closure TAT by stage</div>
                <svg viewBox="0 0 280 80" preserveAspectRatio="none" aria-hidden>
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

              <div className="opb-mini-table">
                <div className="row head">
                  <span>Record</span>
                  <span>Stage</span>
                  <span>Owner</span>
                  <span>Age</span>
                </div>
                <div className="row">
                  <span className="rec"><b className="mk" />REC-2412</span>
                  <span className="badge ok">Verified</span>
                  <span className="own">DS</span>
                  <span className="age">21d</span>
                </div>
                <div className="row">
                  <span className="rec"><b className="mk warn" />NC-25</span>
                  <span className="badge info">CAR open</span>
                  <span className="own">LM</span>
                  <span className="age">9d</span>
                </div>
                <div className="row">
                  <span className="rec"><b className="mk" />NC-22</span>
                  <span className="badge info">RCA</span>
                  <span className="own">RK</span>
                  <span className="age">7d</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: ROI (stub - directional aggregate, replaces single-case diptych as proof) */}
      <section className="opb-section" style={{ paddingTop: 60 }}>
        <div className="opb-eyebrow">
          <span className="dot" />
          <span className="num">07</span>
          <span className="sep">/</span>
          <span className="name">The aggregate</span>
        </div>
        <h2 className="opb-h2">
          Now zoom out.{" "}
          <span className="dim">One thread above. This is what hundreds look like together.</span>
        </h2>

        {/* TODO: replace directional figures with attributed program data once Ben signs off. */}
        <div className="opb-app-card" style={{ marginTop: 56, boxShadow: "0 24px 60px -28px rgba(11,13,17,0.10), 0 8px 20px -12px rgba(11,13,17,0.06), 0 0 0 1px rgba(11,13,17,0.03)", borderColor: "var(--ink-line)" }}>
          <div className="opb-app-chrome">
            <span className="dots"><i /><i /><i /></span>
            <span className="url">app.unifize.com / dashboard / quality</span>
            <span className="pill" style={{ color: "var(--accent)", borderColor: "rgba(94,106,210,0.32)", background: "rgba(94,106,210,0.08)" }}>Q2 2026</span>
          </div>

          <div className="opb-dash-bar">
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

          <div className="opb-dash-grid">
            <div className="opb-kpi">
              <div className="opb-kpi-label">Cycle time</div>
              <div className="opb-kpi-value">−65<span className="unit">%</span></div>
              <div className="opb-kpi-delta up">↓ on threaded investigations</div>
              <svg className="opb-kpi-spark" width="68" height="24" viewBox="0 0 68 24" fill="none">
                <polyline points="0,18 8,16 16,17 24,14 32,11 40,10 48,7 56,5 68,4" stroke="var(--accent)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="opb-kpi">
              <div className="opb-kpi-label">Rework</div>
              <div className="opb-kpi-value">−80<span className="unit">%</span></div>
              <div className="opb-kpi-delta up">↓ post-closure reopens</div>
              <svg className="opb-kpi-spark" width="68" height="24" viewBox="0 0 68 24" fill="none">
                <polyline points="0,4 8,5 16,8 24,10 32,12 40,15 48,16 56,19 68,20" stroke="var(--green)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="opb-kpi">
              <div className="opb-kpi-label">Audit-ready</div>
              <div className="opb-kpi-value">99.7<span className="unit">%</span></div>
              <div className="opb-kpi-delta up">↑ records at any moment</div>
              <svg className="opb-kpi-spark" width="68" height="24" viewBox="0 0 68 24" fill="none">
                <polyline points="0,14 8,12 16,13 24,10 32,11 40,8 48,9 56,6 68,5" stroke="var(--accent)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="opb-kpi">
              <div className="opb-kpi-label">Handoff speed</div>
              <div className="opb-kpi-value">4.0<span className="unit">×</span></div>
              <div className="opb-kpi-delta up">↑ cross-functional pickup</div>
              <svg className="opb-kpi-spark" width="68" height="24" viewBox="0 0 68 24" fill="none">
                <polyline points="0,20 8,19 16,16 24,14 32,12 40,13 48,9 56,8 68,5" stroke="var(--accent)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div className="opb-dash-row">
            <div className="opb-dash-card">
              <div className="head">
                <h5>NCs opened vs closed</h5>
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
                  {/* opened — neutral dashed */}
                  <path d="M 24 60 L 138 30 L 252 78 L 366 48 L 478 102" stroke="rgba(11,13,17,0.32)" strokeWidth="1.4" fill="none" strokeDasharray="4 3" />
                  {/* closed — accent */}
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

            <div className="opb-dash-card">
              <div className="head">
                <h5>Top causes · root cause</h5>
                <span className="meta">Q2 2026</span>
              </div>
              <div className="opb-dash-bars">
                {[
                  { l: "Material variance", v: 38 },
                  { l: "Operator instruction", v: 24 },
                  { l: "Calibration drift", v: 18 },
                  { l: "Supplier mis-spec", v: 14 },
                  { l: "Environmental", v: 6 },
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

          <div className="opb-dash-attr">Directional · across deployments · figures TBD</div>
        </div>
      </section>

      {/* SECTION 8: DOMAINS */}
      <section className="opb-section" id="world" style={{ paddingTop: 60 }}>
        <div className="opb-eyebrow">
          <span className="dot" />
          <span className="num">08</span>
          <span className="sep">/</span>
          <span className="name">Every record</span>
        </div>
        <h2 className="opb-h2">
          Fifteen rooms in your building.{" "}
          <span className="dim">One layer behind every door.</span>
        </h2>

        <div className="opb-app-card" style={{ marginTop: 56, boxShadow: "0 24px 60px -28px rgba(11,13,17,0.10), 0 8px 20px -12px rgba(11,13,17,0.06), 0 0 0 1px rgba(11,13,17,0.03)", borderColor: "var(--ink-line)" }}>
          <div className="opb-app-chrome">
            <span className="dots"><i /><i /><i /></span>
            <span className="url">app.unifize.com / records</span>
            <span className="pill" style={{ color: "var(--ink-muted)", borderColor: "var(--ink-line-strong)", background: "var(--paper-card)" }}>15 records</span>
          </div>

          <div className="opb-records-bar">
            <div className="crumb">
              <span>Engineering</span>
              <span className="sep">/</span>
              <span>Records</span>
              <span className="sep">/</span>
              <span className="cur">All processes</span>
            </div>
            <span className="spacer" />
            <div className="filters">
              <span className="fbtn">Persona<span className="ca">▾</span></span>
              <span className="fbtn">Stage<span className="ca">▾</span></span>
              <span className="fbtn">Owner<span className="ca">▾</span></span>
            </div>
          </div>

          <div className="opb-records-table-wrap">
            <table className="opb-tbl">
              <thead>
                <tr>
                  <th>Record</th>
                  <th>Persona</th>
                  <th>Trigger</th>
                  <th>Stage</th>
                  <th style={{ textAlign: "right" }}>Last activity</th>
                </tr>
              </thead>
              <tbody>
                {DOMAINS.map((d, i) => {
                  const initials = d.persona.split(/[\s/.]+/).filter(Boolean).map((s) => s[0]).slice(0, 2).join("").toUpperCase();
                  const stageMap = {
                    advocacy: { l: "Active", c: "ok" as const },
                    evidence: { l: "In review", c: "info" as const },
                    hypothesis: { l: "Backlog", c: "warn" as const },
                  };
                  const stage = stageMap[d.weight];
                  const ages = ["12m ago", "34m ago", "1h ago", "2h ago", "3h ago", "4h ago", "Today", "Today", "Yesterday", "Yesterday", "2d ago", "3d ago", "4d ago", "6d ago", "9d ago"];
                  const ids = ["CAPA-241", "ECO-0788", "SCAR-12", "CMP-58", "NCR-219", "AUD-7", "DOC-25", "TRN-44", "RSK-9", "DRV-15", "MRB-04", "CAL-31", "PR-22", "REC-12", "SUB-510k"];
                  return (
                    <tr key={d.label}>
                      <td>
                        <div className={`rec ${d.weight}`}>
                          <span className="mk" />
                          <span>{d.label}</span>
                          <span className="id">{ids[i]}</span>
                        </div>
                      </td>
                      <td>
                        <div className="person">
                          <span className={`av av-${(i % 8) + 1}`}>{initials}</span>
                          <span>{d.persona}</span>
                        </div>
                      </td>
                      <td><span className="mono">{d.trigger}</span></td>
                      <td><span className={`opb-chat-badge ${stage.c}`}><span className="pulse" />{stage.l}</span></td>
                      <td style={{ textAlign: "right" }}><span className="age">{ages[i]}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="opb-records-foot">
            <span>Showing 15 of 15</span>
            <span>All processes</span>
          </div>
        </div>
      </section>

      {/* SECTION 9: CTA */}
      <section className="opb-cta">
        <div className="opb-cta-inner">
          <h2 className="opb-cta-h">Walk through your process. With us. With your numbers.</h2>
          <p className="opb-cta-sub">
            Forty-five minutes. We pick one of your processes and rebuild it as a single governed thread on screen.
          </p>
          <div className="opb-cta-actions">
            <button className="opb-btn-primary">
              Book a demo
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <Link to="/option-a" className="opb-btn-ghost">Compare to Option A →</Link>
          </div>

          <div className="opb-cta-quote">
            <div className="text">
              "We stopped reconstructing investigations from email. The thread is the investigation now."
            </div>
            <div className="who">VP Quality, ISO 13485 manufacturer</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="opb-foot">
        <div className="opb-foot-inner">
          <span>© {new Date().getFullYear()} Unifize. Recognition-led exploration.</span>
          {/* TODO: confirm partnership claim with Ben before shipping. */}
          <span className="mono">Partnered with Microsoft.</span>
        </div>
      </footer>
    </div>
  );
}
