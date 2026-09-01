import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const OUTCOMES = [
  "close CAPAs in half the time.",
  "cut audit prep from three weeks to three days.",
  "release batches without waiting on inboxes.",
  "stop the wrong revision reaching the floor.",
  "thread evidence to every decision.",
  "measure what coordination is costing this quarter.",
];

const SYMPTOMS: { text: string; tag: string }[] = [
  { text: "CAPA 2147 is still open. Last year it was closed in 11 days.", tag: "Quality" },
  { text: "The change order has four approvers and three of them are in different tools.", tag: "Change" },
  { text: "The wrong revision made it to the shop floor last Tuesday.", tag: "Docs" },
  { text: "Audit prep swallowed the last three weeks.", tag: "Regulatory" },
  { text: "The deviation was rebuilt from a Teams thread and three emails.", tag: "Quality" },
  { text: "The supplier response lives in someone's sent folder.", tag: "Supplier" },
  { text: "Training sign-off cannot be produced without a calendar invite.", tag: "Training" },
  { text: "The complaint reached the owner on the third handoff.", tag: "Quality" },
  { text: "The MRB decision was made in a meeting nobody minuted.", tag: "Quality" },
  { text: "Label approval traces through five reply-all chains.", tag: "Regulatory" },
  { text: "Batch release waited on two of five sign-offs. Nobody knew which two.", tag: "Ops" },
  { text: "Recall scope was built from memory.", tag: "Post-Market" },
  { text: "The investigation timed out before evidence was complete.", tag: "Quality" },
  { text: "The non-conformance closed itself by attrition.", tag: "Quality" },
  { text: "The audit finding was about a gap nobody had named.", tag: "Regulatory" },
];

const PROCESS_STAGES = [
  { label: "01 · Capture", title: "Capture.", body: "The intake lands. The thread opens. AI Assist pre-fills from the source artefact." },
  { label: "02 · Route", title: "Route.", body: "Roles assemble. Approvers are attached. Missing evidence is flagged before work starts." },
  { label: "03 · Investigate", title: "Investigate.", body: "Decisions and counter-evidence accumulate in the thread. Every claim is attached to a fact." },
  { label: "04 · Approve", title: "Approve.", body: "QA, engineering, and supplier approvals timestamp to the thread. The chain is reviewable." },
  { label: "05 · Close", title: "Close.", body: "Completion is supported by evidence, not a status label. The QMS gets the outcome written back." },
  { label: "06 · Measure", title: "Measure.", body: "The thread ages. The lane reports. The baseline moves." },
];

const DOMAINS = [
  { name: "Quality", weight: 3 },
  { name: "Change Control", weight: 3 },
  { name: "Supplier Quality", weight: 3 },
  { name: "Operations", weight: 2 },
  { name: "New Product Development", weight: 2 },
  { name: "Document and Records Control", weight: 2 },
  { name: "Regulatory Affairs", weight: 2 },
  { name: "Training and Competency", weight: 2 },
  { name: "Customer Management", weight: 2 },
  { name: "Supply Chain and Planning", weight: 2 },
  { name: "Compliance", weight: 2 },
  { name: "Post-Market and Recall", weight: 1 },
  { name: "System and Data Integration Governance", weight: 1 },
  { name: "Procurement and Sourcing", weight: 1 },
  { name: "Periodic Review and Data Governance", weight: 1 },
];

const OUTCOME_TILES = [
  {
    quote: "Audit prep used to be a three-week fire drill. This year it was a Tuesday.",
    who: "VP Quality",
    where: "Class II medical device customer",
  },
  {
    quote: "We stopped asking where the evidence was. The thread had it.",
    who: "Quality Director",
    where: "Aerospace supplier",
  },
  {
    quote: "Change orders moved from a sign-off queue to a tracked conversation. Cycle time fell.",
    who: "Operations Lead",
    where: "Industrial machinery",
  },
];

const STYLES = `
.da-root {
  --da-bg: #08090A;
  --da-bg-elev: #0E0F12;
  --da-bg-card: #101116;
  --da-border: rgba(255,255,255,0.08);
  --da-border-strong: rgba(255,255,255,0.16);
  --da-text: #FFFFFF;
  --da-muted: rgba(255,255,255,0.58);
  --da-faint: rgba(255,255,255,0.38);
  --da-accent: #0052FF;
  --da-accent-soft: rgba(0,82,255,0.22);

  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  background: var(--da-bg);
  color: var(--da-text);
  letter-spacing: -0.011em;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}
.da-root * { box-sizing: border-box; }
.da-root .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
.da-root a { color: inherit; text-decoration: none; }

/* NAV */
.da-nav {
  position: sticky; top: 0; z-index: 50;
  backdrop-filter: saturate(160%) blur(18px);
  background: rgba(8,9,10,0.72);
  border-bottom: 1px solid var(--da-border);
}
.da-nav-inner {
  max-width: 1280px; margin: 0 auto;
  padding: 14px 28px;
  display: flex; align-items: center; gap: 40px;
}
.da-nav-logo-img { height: 22px; filter: brightness(0) invert(1); }
.da-nav-items {
  display: flex; gap: 26px;
  font-size: 13.5px; color: var(--da-muted);
}
.da-nav-items a:hover { color: var(--da-text); }
.da-nav-actions { margin-left: auto; display: flex; gap: 18px; align-items: center; }
.da-nav-link { font-size: 13.5px; color: var(--da-muted); }
.da-nav-btn {
  font-size: 13px; font-weight: 500;
  background: white; color: #08090A;
  padding: 7px 14px; border-radius: 999px;
  border: 0; cursor: pointer;
}
@media (max-width: 860px) { .da-nav-items { display: none; } }

.da-btn-primary {
  font-family: inherit; font-size: 14px; font-weight: 500;
  background: white; color: #08090A;
  padding: 11px 20px; border-radius: 999px;
  border: 0; cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px;
}
.da-btn-primary:hover { background: #EBECEE; }
.da-btn-ghost {
  font-family: inherit; font-size: 14px; font-weight: 500;
  background: transparent; color: var(--da-text);
  padding: 11px 18px; border-radius: 999px;
  border: 1px solid var(--da-border-strong);
  cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px;
}
.da-btn-ghost:hover { background: rgba(255,255,255,0.05); }

/* HERO */
.da-hero {
  position: relative;
  max-width: 1280px; margin: 0 auto;
  padding: 80px 28px 110px;
  overflow: hidden;
}
.da-hero-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--da-faint);
  margin-bottom: 44px;
}
.da-hero-h1 {
  font-size: clamp(44px, 7.2vw, 96px);
  font-weight: 500;
  line-height: 1.0;
  letter-spacing: -0.042em;
  margin: 0;
  max-width: 22ch;
}
.da-hero-stem { display: block; color: var(--da-text); }
.da-hero-tail-wrap {
  display: block;
  position: relative;
  height: 1.05em;
  overflow: hidden;
}
.da-hero-tail {
  display: block;
  color: var(--da-text);
  background: linear-gradient(90deg, #FFFFFF 30%, #7AA8FF 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: da-tail-in 560ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes da-tail-in {
  0%   { opacity: 0; transform: translateY(96%); filter: blur(8px); }
  100% { opacity: 1; transform: translateY(0); filter: blur(0); }
}
.da-hero-sub {
  margin: 32px 0 0;
  font-size: 18px;
  color: var(--da-muted);
  max-width: 72ch;
  line-height: 1.5;
}
.da-hero-cta {
  margin-top: 44px;
  display: flex; gap: 12px; flex-wrap: wrap;
}

/* thread drawing under hero */
.da-hero-thread {
  margin-top: 72px;
  height: 140px;
  position: relative;
  border-top: 1px solid var(--da-border);
  border-bottom: 1px solid var(--da-border);
  background:
    radial-gradient(60% 120% at 50% 50%, rgba(0,82,255,0.24) 0%, rgba(0,82,255,0) 70%);
}
.da-thread-svg {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
}
.da-thread-axis {
  stroke: #0052FF; stroke-width: 2;
  animation: da-thread-draw 1800ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
  stroke-dasharray: 1200;
  stroke-dashoffset: 1200;
}
@keyframes da-thread-draw {
  to { stroke-dashoffset: 0; }
}
.da-thread-node-g { opacity: 0; animation: da-node-in 600ms ease 1200ms forwards; }
.da-thread-node-g:nth-child(2) { animation-delay: 1350ms; }
.da-thread-node-g:nth-child(3) { animation-delay: 1500ms; }
.da-thread-node-g:nth-child(4) { animation-delay: 1650ms; }
.da-thread-node-g:nth-child(5) { animation-delay: 1800ms; }
.da-thread-node-g:nth-child(6) { animation-delay: 1950ms; }
@keyframes da-node-in {
  0%   { opacity: 0; transform: scale(0.6); }
  100% { opacity: 1; transform: scale(1); }
}
.da-thread-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  fill: var(--da-muted);
}

/* SECTION BASE */
.da-section {
  max-width: 1280px; margin: 0 auto;
  padding: 110px 28px;
}
.da-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--da-faint);
  margin-bottom: 28px;
  display: flex; align-items: center; gap: 12px;
}
.da-eyebrow .line { flex: 1; height: 1px; max-width: 220px; background: var(--da-border); }
.da-h2 {
  font-size: clamp(32px, 5vw, 64px);
  font-weight: 500; line-height: 1.02; letter-spacing: -0.036em;
  margin: 0; max-width: 22ch;
}
.da-sub {
  margin: 26px 0 0;
  font-size: 17px;
  color: var(--da-muted);
  max-width: 70ch;
  line-height: 1.55;
}

/* SYMPTOMS */
.da-symptom-strip {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
  margin-top: 48px;
}
@media (max-width: 900px) { .da-symptom-strip { grid-template-columns: 1fr; } }
.da-symptom {
  border: 1px solid var(--da-border);
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0));
  border-radius: 10px; padding: 18px 20px;
  display: flex; flex-direction: column; gap: 10px;
  min-height: 110px;
}
.da-symptom-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--da-faint);
}
.da-symptom-text {
  font-size: 14px; line-height: 1.5; color: var(--da-text);
}
.da-symptom-closer {
  margin-top: 56px;
  font-size: clamp(22px, 3vw, 34px);
  font-weight: 500; letter-spacing: -0.022em; line-height: 1.18;
  color: var(--da-text); max-width: 30ch;
}

/* GAP E1 */
.da-gap {
  background: var(--da-bg-elev);
  border-top: 1px solid var(--da-border);
  border-bottom: 1px solid var(--da-border);
}
.da-gap-visual {
  position: relative;
  margin-top: 56px;
  padding: 48px 0 64px;
}
.da-gap-svg {
  width: 100%; height: auto;
  display: block;
}
.da-gap-caption {
  margin-top: 18px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px; color: var(--da-faint);
  text-align: center;
}

/* NAME */
.da-name {
  text-align: center;
  padding: 160px 28px;
  border-bottom: 1px solid var(--da-border);
}
.da-name-h {
  font-size: clamp(36px, 6vw, 84px);
  font-weight: 500; letter-spacing: -0.042em; line-height: 1.02;
  margin: 0 auto; max-width: 22ch;
}
.da-name-sub {
  margin-top: 26px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px; color: var(--da-muted);
}

/* LAYER E2 — three-band stack */
.da-layer-visual {
  display: grid; grid-template-columns: 1fr 1.2fr 1fr; gap: 20px;
  margin-top: 48px;
  align-items: stretch;
}
@media (max-width: 900px) { .da-layer-visual { grid-template-columns: 1fr; } }
.da-layer-col {
  border: 1px solid var(--da-border);
  border-radius: 14px; padding: 22px;
  background: linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0));
  min-height: 260px;
  display: flex; flex-direction: column;
}
.da-layer-col.center {
  background:
    linear-gradient(180deg, rgba(0,82,255,0.22), rgba(0,82,255,0.04));
  border-color: rgba(0,82,255,0.46);
  box-shadow: 0 0 0 1px rgba(0,82,255,0.18), 0 30px 80px -20px rgba(0,82,255,0.35);
}
.da-layer-col-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--da-faint);
  margin-bottom: 16px;
}
.da-layer-col h4 {
  margin: 0 0 14px; font-size: 20px; font-weight: 500; letter-spacing: -0.014em;
}
.da-layer-col ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
.da-layer-col li {
  font-size: 13px; color: var(--da-muted);
  display: flex; align-items: center; gap: 8px;
}
.da-layer-col li::before {
  content: ""; width: 4px; height: 4px; background: currentColor; border-radius: 50%; opacity: 0.6;
}
.da-layer-col.center li { color: #C5D6FF; }
.da-arrow-row {
  display: flex; justify-content: space-between;
  margin-top: 28px; padding: 0 4%;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--da-faint);
  gap: 18px; flex-wrap: wrap;
}

/* PROCESS SCROLL */
.da-process-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;
  margin-top: 52px;
}
@media (max-width: 900px) { .da-process-grid { grid-template-columns: 1fr; } }
.da-process-card {
  border: 1px solid var(--da-border);
  border-radius: 14px; padding: 28px 26px;
  background: linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0));
  display: flex; flex-direction: column; gap: 12px;
}
.da-process-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase;
  color: #7AA8FF;
}
.da-process-title {
  font-size: 22px; font-weight: 500; letter-spacing: -0.018em; margin: 0;
}
.da-process-body {
  font-size: 14px; color: var(--da-muted); line-height: 1.55; margin: 0;
}
.da-process-closer {
  margin-top: 56px;
  font-size: clamp(22px, 3vw, 34px);
  font-weight: 500; letter-spacing: -0.022em; line-height: 1.18;
  max-width: 32ch;
}

/* OUTCOMES */
.da-outcomes-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
  margin-top: 48px;
}
@media (max-width: 900px) { .da-outcomes-grid { grid-template-columns: 1fr; } }
.da-outcome-tile {
  border: 1px solid var(--da-border);
  border-radius: 14px;
  padding: 36px 28px;
  background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0));
  display: flex; flex-direction: column; gap: 20px;
  min-height: 260px;
}
.da-outcome-quote {
  font-size: 20px; line-height: 1.4; letter-spacing: -0.014em;
  margin: 0;
}
.da-outcome-who {
  margin-top: auto;
  display: flex; flex-direction: column; gap: 4px;
  font-size: 13px;
}
.da-outcome-who .name { color: var(--da-text); font-weight: 500; }
.da-outcome-who .where { color: var(--da-faint); font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.1em; }

/* DOMAINS INDEX */
.da-domains-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-top: 48px;
}
@media (max-width: 900px) { .da-domains-grid { grid-template-columns: repeat(2, 1fr); } }
.da-domain-tile {
  border: 1px solid var(--da-border);
  border-radius: 12px;
  padding: 22px 18px;
  background: linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0));
  display: flex; flex-direction: column;
  justify-content: space-between; min-height: 120px;
}
.da-domain-tile.w3 { min-height: 160px; background: linear-gradient(180deg, rgba(0,82,255,0.12), rgba(0,82,255,0.02)); border-color: rgba(0,82,255,0.28); }
.da-domain-tile.w2 { min-height: 140px; }
.da-domain-name {
  font-size: 14px; font-weight: 500; letter-spacing: -0.012em; line-height: 1.25;
}
.da-domain-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--da-faint);
}
.da-domain-tile.w3 .da-domain-dot { background: #0052FF; }
.da-domain-tile.w2 .da-domain-dot { background: rgba(0,82,255,0.5); }

/* AI IMPLICATION */
.da-ai-wrap {
  background: var(--da-bg-elev);
  border-top: 1px solid var(--da-border);
  border-bottom: 1px solid var(--da-border);
}

/* CTA */
.da-cta {
  text-align: center;
  padding: 140px 28px;
}
.da-cta-kicker {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--da-faint);
  margin-bottom: 22px;
}
.da-cta-h {
  font-size: clamp(34px, 5.4vw, 72px);
  font-weight: 500; letter-spacing: -0.038em; line-height: 1.02;
  margin: 0 auto; max-width: 22ch;
}
.da-cta-sub {
  margin: 24px auto 0; max-width: 60ch;
  color: var(--da-muted); font-size: 16px; line-height: 1.55;
}
.da-cta-actions {
  margin-top: 32px;
  display: inline-flex; gap: 12px; flex-wrap: wrap; justify-content: center;
}

/* FOOTER */
.da-foot {
  border-top: 1px solid var(--da-border); padding: 30px 28px;
}
.da-foot-inner {
  max-width: 1280px; margin: 0 auto;
  display: flex; justify-content: space-between; align-items: center;
  font-size: 12px; color: var(--da-faint); flex-wrap: wrap; gap: 16px;
}
`;

export default function HomeDirectionA() {
  const [tailIdx, setTailIdx] = useState(0);

  useEffect(() => {
    document.title = "Unifize. Direction A — The Agreed Brief.";
  }, []);

  useEffect(() => {
    const id = window.setInterval(
      () => setTailIdx((i) => (i + 1) % OUTCOMES.length),
      3200
    );
    return () => window.clearInterval(id);
  }, []);

  const threadNodes = [
    { x: 140, label: "RECORD" },
    { x: 320, label: "DECISION" },
    { x: 500, label: "EVIDENCE" },
    { x: 680, label: "APPROVAL" },
    { x: 860, label: "OWNER" },
    { x: 1040, label: "CLOSED" },
  ];

  return (
    <div className="da-root">
      <style>{STYLES}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <nav className="da-nav">
        <div className="da-nav-inner">
          <Link to="/direction-a" aria-label="Unifize">
            <img src="/Link - home.svg" alt="Unifize" className="da-nav-logo-img" />
          </Link>
          <div className="da-nav-items">
            <a href="#problem">The Problem</a>
            <a href="#world">Your World</a>
            <a href="#industry">By Industry</a>
            <a href="#how">How It Works</a>
            <a href="#proof">Proof</a>
          </div>
          <div className="da-nav-actions">
            <a href="#login" className="da-nav-link">Log in</a>
            <button className="da-nav-btn">Book a demo</button>
          </div>
        </div>
      </nav>

      {/* HERO — outcomes-led with flipping tail */}
      <section className="da-hero">
        <div className="da-hero-eyebrow">People. Process. AI. Outcomes.</div>
        <h1 className="da-hero-h1">
          <span className="da-hero-stem">Unifize helps regulated teams</span>
          <span className="da-hero-tail-wrap" aria-live="polite">
            <span key={tailIdx} className="da-hero-tail">
              {OUTCOMES[tailIdx]}
            </span>
          </span>
        </h1>
        <p className="da-hero-sub">
          One accountable thread per record. Every team, every decision, every evidence, in one place.
        </p>
        <div className="da-hero-cta">
          <button className="da-btn-primary">
            Book a demo
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <a href="#cta" className="da-btn-ghost">See your coordination tax.</a>
        </div>

        {/* Thread visualization under hero — architectural, not UI */}
        <div className="da-hero-thread" aria-hidden>
          <svg className="da-thread-svg" viewBox="0 0 1200 140" preserveAspectRatio="none">
            <defs>
              <linearGradient id="da-axis-g" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#0052FF" stopOpacity="0.2" />
                <stop offset="0.5" stopColor="#4D85FF" stopOpacity="1" />
                <stop offset="1" stopColor="#0052FF" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <line className="da-thread-axis" x1="100" y1="70" x2="1100" y2="70" stroke="url(#da-axis-g)" />
            {threadNodes.map((n, i) => (
              <g key={n.label} className="da-thread-node-g">
                <circle cx={n.x} cy="70" r="14" fill="#08090A" stroke="#4D85FF" strokeWidth="1.5" />
                <circle cx={n.x} cy="70" r="5" fill="#0052FF" />
                <text x={n.x} y={i % 2 === 0 ? 38 : 114} textAnchor="middle" className="da-thread-label">{n.label}</text>
              </g>
            ))}
          </svg>
        </div>
      </section>

      {/* S2 — SYMPTOMS */}
      <section className="da-section" id="problem">
        <div className="da-eyebrow">
          <span>You will recognise at least three.</span>
          <span className="line" />
        </div>
        <h2 className="da-h2">Every regulated team has seen this ledger.</h2>
        <div className="da-symptom-strip">
          {SYMPTOMS.map((s) => (
            <div key={s.text} className="da-symptom">
              <span className="da-symptom-tag">{s.tag}</span>
              <span className="da-symptom-text">{s.text}</span>
            </div>
          ))}
        </div>
        <p className="da-symptom-closer">
          Every one of these is the same problem, wearing a different uniform.
        </p>
      </section>

      {/* S3 — THE GAP / E1 */}
      <section className="da-gap">
        <div className="da-section">
          <div className="da-eyebrow">
            <span>The root cause is structural.</span>
            <span className="line" />
          </div>
          <h2 className="da-h2">
            Your systems of record and your systems of coordination are two different systems.
          </h2>
          <p className="da-sub">
            Your QMS, ERP, PLM, and DMS hold what is officially true. Your email, meetings, and spreadsheets hold what actually happened. The gap between them persists in well-run organisations with mature systems of record. It is architectural, not behavioural.
          </p>

          <div className="da-gap-visual">
            <svg className="da-gap-svg" viewBox="0 0 1200 380" fill="none">
              <defs>
                <linearGradient id="da-gap-shade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#0052FF" stopOpacity="0.22" />
                  <stop offset="1" stopColor="#0052FF" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* shaded gap */}
              <rect x="80" y="110" width="1040" height="160" fill="url(#da-gap-shade)" opacity="0.7" />

              {/* top timeline — Systems of Record */}
              <text x="80" y="76" fill="rgba(255,255,255,0.42)" fontFamily="JetBrains Mono" fontSize="11" letterSpacing="2">
                SYSTEMS OF RECORD
              </text>
              <line x1="80" y1="100" x2="1120" y2="100" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
              {[180, 440, 700, 1000].map((x, i) => (
                <g key={`top-${i}`}>
                  <circle cx={x} cy="100" r="6" fill="#FFFFFF" />
                  <line x1={x} y1="100" x2={x} y2="86" stroke="rgba(255,255,255,0.5)" />
                </g>
              ))}

              {/* bottom timeline — Systems of Coordination */}
              <text x="80" y="322" fill="rgba(255,255,255,0.42)" fontFamily="JetBrains Mono" fontSize="11" letterSpacing="2">
                SYSTEMS OF COORDINATION
              </text>
              <line x1="80" y1="280" x2="1120" y2="280" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
              {[110, 160, 220, 270, 340, 390, 450, 510, 560, 640, 700, 770, 820, 880, 940, 1000, 1060].map((x, i) => (
                <circle key={`bot-${i}`} cx={x} cy="280" r="3.5" fill="rgba(255,255,255,0.72)" />
              ))}

              {/* forked coordination branches */}
              <path d="M 220 280 Q 260 220, 340 260" stroke="rgba(255,255,255,0.28)" strokeWidth="1" fill="none" />
              <path d="M 450 280 Q 500 210, 560 250" stroke="rgba(255,255,255,0.28)" strokeWidth="1" fill="none" />
              <path d="M 700 280 Q 740 200, 820 240" stroke="rgba(255,255,255,0.28)" strokeWidth="1" fill="none" />
              <path d="M 940 280 Q 980 220, 1060 260" stroke="rgba(255,255,255,0.28)" strokeWidth="1" fill="none" />

              {/* gap label in the middle */}
              <text x="600" y="200" textAnchor="middle" fill="#7AA8FF" fontFamily="JetBrains Mono" fontSize="13" letterSpacing="3">
                THE GAP
              </text>
            </svg>
            <div className="da-gap-caption">The shaded area is where coordination tax accumulates.</div>
          </div>
        </div>
      </section>

      {/* S4 — THE NAME */}
      <section className="da-name">
        <h2 className="da-name-h">
          The cost of living in that gap is what we call coordination tax.
        </h2>
        <div className="da-name-sub mono">
          It is measurable. It has a number. Most teams have never counted it.
        </div>
      </section>

      {/* S5 — THE LAYER / E2 */}
      <section className="da-section" id="world">
        <div className="da-eyebrow">
          <span>The governed layer.</span>
          <span className="line" />
        </div>
        <h2 className="da-h2">Unifize is the layer that captures what happens in the gap.</h2>
        <p className="da-sub">
          Every cross-functional event becomes one accountable thread. The record, the decisions, the evidence, the approvals, the ownership, and the completion stay connected. Across every team involved. On the first audit request.
        </p>

        <div className="da-layer-visual">
          <div className="da-layer-col">
            <div className="da-layer-col-label">Systems of record</div>
            <h4>Authoritative.</h4>
            <ul>
              <li>QMS</li>
              <li>ERP</li>
              <li>PLM</li>
              <li>DMS</li>
              <li>MES</li>
              <li>LIMS</li>
            </ul>
          </div>
          <div className="da-layer-col center">
            <div className="da-layer-col-label">Unifize</div>
            <h4>One accountable thread.</h4>
            <ul>
              <li>Record attached</li>
              <li>Decisions logged</li>
              <li>Evidence bound</li>
              <li>Approvals timestamped</li>
              <li>Ownership explicit</li>
              <li>Writes back to the record</li>
            </ul>
          </div>
          <div className="da-layer-col">
            <div className="da-layer-col-label">Horizontal tools</div>
            <h4>Where work happens.</h4>
            <ul>
              <li>Teams</li>
              <li>Outlook</li>
              <li>SharePoint</li>
              <li>Excel</li>
              <li>Meetings</li>
              <li>Phone</li>
            </ul>
          </div>
        </div>
        <div className="da-arrow-row">
          <span>→ context</span>
          <span>→ context</span>
          <span>← write-back</span>
          <span>↔ artifacts</span>
          <span>↔ decisions</span>
        </div>
      </section>

      {/* S6 — PROCESS SCROLL */}
      <section className="da-section" id="how">
        <div className="da-eyebrow">
          <span>Watch one thread travel.</span>
          <span className="line" />
        </div>
        <h2 className="da-h2">
          One process. Six stages. One accountable thread.
        </h2>
        <p className="da-sub">
          A CAPA investigation for a Class II device. Scroll the stages, watch the thread accumulate.
        </p>

        <div className="da-process-grid">
          {PROCESS_STAGES.map((s) => (
            <div key={s.label} className="da-process-card">
              <span className="da-process-label">{s.label}</span>
              <h3 className="da-process-title">{s.title}</h3>
              <p className="da-process-body">{s.body}</p>
            </div>
          ))}
        </div>
        <p className="da-process-closer">
          Every decision, every approver, every piece of evidence, connected to the same thing.
        </p>
      </section>

      {/* S7 — OUTCOMES */}
      <section className="da-section" id="proof">
        <div className="da-eyebrow">
          <span>Measurable outcomes, powered by Unifize and Unifize AI.</span>
          <span className="line" />
        </div>
        <h2 className="da-h2">Proof.</h2>
        <div className="da-outcomes-grid">
          {OUTCOME_TILES.map((t) => (
            <div key={t.who} className="da-outcome-tile">
              <p className="da-outcome-quote">"{t.quote}"</p>
              <div className="da-outcome-who">
                <span className="name">{t.who}</span>
                <span className="where mono">{t.where.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* S8 — DOMAINS INDEX */}
      <section className="da-section" id="industry">
        <div className="da-eyebrow">
          <span>Where coordination tax shows up.</span>
          <span className="line" />
        </div>
        <h2 className="da-h2">Fifteen domains. Pick the door that hurts.</h2>
        <div className="da-domains-grid">
          {DOMAINS.map((d) => (
            <div key={d.name} className={`da-domain-tile w${d.weight}`}>
              <div className="da-domain-dot" />
              <div className="da-domain-name">{d.name}</div>
            </div>
          ))}
        </div>
        <p className="da-process-closer">
          Pick the door that hurts. Start there. Measure the tax. Scale from one lane.
        </p>
      </section>

      {/* S9 — AI IMPLICATION */}
      <section className="da-ai-wrap">
        <div className="da-section">
          <div className="da-eyebrow">
            <span>Why this matters for AI.</span>
            <span className="line" />
          </div>
          <h2 className="da-h2">AI cannot compound on coordination it cannot see.</h2>
          <p className="da-sub">
            When the coordination runs through email and spreadsheets, AI speeds up conversation, not closure. When the coordination runs through governed threads, AI has structure to reason over. Unifize is the layer that makes the second one true.
          </p>
        </div>
      </section>

      {/* S10 — CTA */}
      <section className="da-cta" id="cta">
        <div className="da-cta-kicker">The next step.</div>
        <h2 className="da-cta-h">Your coordination tax has a number.</h2>
        <p className="da-cta-sub">
          Forty-five minutes with a practitioner. We walk one coordination-heavy thread in your process, price the cost in your numbers, and leave you with the baseline. Demo or not.
        </p>
        <div className="da-cta-actions">
          <button className="da-btn-primary">Book a demo</button>
          <a href="#estimator" className="da-btn-ghost">See your coordination tax</a>
        </div>
      </section>

      <footer className="da-foot">
        <div className="da-foot-inner">
          <span>© {new Date().getFullYear()} Unifize. All rights reserved.</span>
          <span className="mono">People. Process. AI. Outcomes. — Partnered with Microsoft.</span>
        </div>
      </footer>
    </div>
  );
}
