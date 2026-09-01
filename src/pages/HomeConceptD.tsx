import { useEffect, useState } from "react";

const THREAD_BEATS = [
  { k: "T0", label: "Trigger", caption: "A deviation, a complaint, a supplier finding, an ECO request.", role: "QA OPS", reg: "ISO 9001" },
  { k: "T1", label: "Owner", caption: "Who owns the decision. What context they inherit.", role: "QA MGR", reg: "Role-based" },
  { k: "T2", label: "Decision", caption: "What was decided. Who decided it. Why.", role: "SQE", reg: "Captured" },
  { k: "T3", label: "Evidence", caption: "CoA, photos, GC trace bound to the decision, not floating.", role: "VP QA", reg: "21 CFR 11" },
  { k: "T4", label: "Approval", caption: "Roles, regulation, signature, stamped in place.", role: "MFG LEAD", reg: "Signed" },
  { k: "T5", label: "Handoff", caption: "Cross-functional pickup with state preserved.", role: "QA OPS", reg: "ISO 9001" },
  { k: "T6", label: "Closed", caption: "Effectiveness check. Linked records. Audit trail final.", role: "QA OPS", reg: "Completed" },
];

// Brand rule: Unifize blue only, no purple. Personas differentiated by blue intensity.
const PERSONAS = [
  { label: "VP Quality", color: "#0052FF" },
  { label: "Operations", color: "#2D6FFF" },
  { label: "Regulatory", color: "#5C8DFF" },
  { label: "CFO", color: "#85ABFF" },
  { label: "CIO", color: "#ADC6FF" },
];

const DOMAINS = [
  { label: "CAPA", persona: "QA", trigger: "Deviation", weight: "advocacy" },
  { label: "ECO / DCO", persona: "Eng", trigger: "Drawing", weight: "advocacy" },
  { label: "Supplier CAR", persona: "SQE", trigger: "Finding", weight: "advocacy" },
  { label: "Complaint", persona: "QA Ops", trigger: "Report", weight: "evidence" },
  { label: "Deviation / NCR", persona: "Prod", trigger: "Batch", weight: "evidence" },
  { label: "Audit", persona: "Comp", trigger: "Inspection", weight: "evidence" },
  { label: "Doc Control", persona: "DC", trigger: "Revision", weight: "evidence" },
  { label: "Training", persona: "HR", trigger: "SOP", weight: "evidence" },
  { label: "Risk Mgmt", persona: "QA", trigger: "Review", weight: "evidence" },
  { label: "Design Review", persona: "R&D", trigger: "Gate", weight: "evidence" },
  { label: "MRB", persona: "QE", trigger: "Reject", weight: "hypothesis" },
  { label: "Calibration", persona: "Metrology", trigger: "Due", weight: "hypothesis" },
  { label: "Periodic", persona: "QA", trigger: "Annual", weight: "hypothesis" },
  { label: "Recall", persona: "Reg", trigger: "Field", weight: "hypothesis" },
  { label: "Submission", persona: "Reg", trigger: "510(k)", weight: "hypothesis" },
];

const MS_TOOLS = ["Outlook", "SharePoint", "Teams", "Excel"];

const STYLES = `
.cpd-root {
  --bg: #08090A;
  --bg-card: #101116;
  --bg-card-2: #0E0F12;
  --border: rgba(255,255,255,0.08);
  --border-strong: rgba(255,255,255,0.16);
  --text: #FFFFFF;
  --text-muted: rgba(255,255,255,0.58);
  --text-faint: rgba(255,255,255,0.38);
  --accent: #0052FF;
  --accent-2: #4C85FF;
  --accent-soft: rgba(0,82,255,0.14);
  --green: #10B981;
  --paper: #EFF1F5;
  --paper-card: #FFFFFF;
  --ink: #0B0D11;
  --ink-muted: rgba(11,13,17,0.62);

  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  background: var(--bg);
  color: var(--text);
  -webkit-font-smoothing: antialiased;
  letter-spacing: -0.011em;
}
.cpd-root * { box-sizing: border-box; }
.cpd-root .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
.cpd-root a { color: inherit; text-decoration: none; }

/* NAV */
.cpd-nav {
  position: sticky; top: 0; z-index: 50;
  backdrop-filter: saturate(160%) blur(18px);
  background: rgba(8,9,10,0.72);
  border-bottom: 1px solid var(--border);
}
.cpd-nav-inner {
  max-width: 1240px; margin: 0 auto;
  padding: 12px 28px;
  display: flex; align-items: center; gap: 32px;
}
.cpd-nav-logo {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px; letter-spacing: 0.04em;
  margin-right: 4px;
}
.cpd-nav-logo-mark { width: 8px; height: 8px; border-radius: 2px; background: var(--accent); }
.cpd-nav-tagline {
  font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--text-faint);
  display: flex; gap: 2px;
}
.cpd-nav-items {
  display: flex; gap: 24px;
  font-size: 13.5px; color: var(--text-muted);
}
.cpd-nav-items a:hover { color: var(--text); }
.cpd-nav-actions { margin-left: auto; display: flex; gap: 16px; align-items: center; }
.cpd-nav-link { font-size: 13.5px; color: var(--text-muted); transition: color .15s ease; }
.cpd-nav-link:hover { color: var(--text); }
.cpd-nav-btn {
  font-size: 13px; font-weight: 500;
  background: white; color: #0B0D11;
  padding: 7px 14px; border-radius: 999px; border: none; cursor: pointer;
  transition: background .15s ease;
}
.cpd-nav-btn:hover { background: #EBECEE; }
@media (max-width: 860px) { .cpd-nav-items { display: none; } }

/* SECTIONS */
.cpd-section {
  position: relative;
  min-height: 100vh;
  display: flex; align-items: center;
  max-width: 1240px; margin: 0 auto;
  padding: 120px 28px;
  width: 100%;
}
.cpd-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--text-faint);
  display: inline-flex; align-items: center; gap: 12px;
  margin-bottom: 28px;
}
.cpd-eyebrow .num { color: var(--text); font-weight: 500; }
.cpd-eyebrow .line { flex: 0 0 60px; height: 1px; background: var(--border); }
.cpd-h2 {
  font-size: clamp(32px, 4.6vw, 56px);
  line-height: 1.04;
  letter-spacing: -0.034em;
  font-weight: 500;
  max-width: 22ch;
  margin: 0;
}
.cpd-h2 .dim { color: var(--text-muted); }
.cpd-sub {
  margin-top: 22px;
  font-size: 16px;
  color: var(--text-muted);
  max-width: 64ch;
  line-height: 1.5;
}
.cpd-dark { background: var(--bg); color: var(--text); }
.cpd-light { background: var(--paper); color: var(--ink); }
.cpd-light .cpd-eyebrow { color: var(--ink-muted); }
.cpd-light .cpd-eyebrow .num { color: var(--ink); }
.cpd-light .cpd-h2 { color: var(--ink); }
.cpd-light .cpd-h2 .dim { color: var(--ink-muted); }
.cpd-light .cpd-sub { color: var(--ink-muted); }

.cpd-btn-primary {
  font-family: inherit; font-size: 14px; font-weight: 500;
  background: var(--accent); color: white;
  padding: 11px 20px; border-radius: 999px;
  border: none; cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px;
  transition: background .15s ease;
}
.cpd-btn-primary:hover { background: #0044D6; }
.cpd-light .cpd-btn-primary { background: var(--ink); color: var(--paper); }
.cpd-light .cpd-btn-primary:hover { background: rgba(11,13,17,0.88); }

.cpd-btn-ghost {
  font-family: inherit; font-size: 14px; font-weight: 500;
  background: transparent; color: var(--text);
  padding: 11px 18px; border-radius: 999px;
  border: 1px solid var(--border-strong); cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px;
  transition: background .15s ease, border-color .15s ease;
}
.cpd-btn-ghost:hover { background: rgba(255,255,255,0.04); }
.cpd-light .cpd-btn-ghost { color: var(--ink); border-color: var(--ink-muted); }
.cpd-light .cpd-btn-ghost:hover { background: rgba(11,13,17,0.04); }

/* HERO BAND */
.cpd-hero {
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(180deg, rgba(0,82,255,0.08) 0%, var(--bg) 100%);
  position: relative;
  overflow: hidden;
}
.cpd-hero::before {
  content: "";
  position: absolute; inset: 0;
  background: radial-gradient(600px 400px at 50% 50%, rgba(0,82,255,0.14), transparent 70%);
  pointer-events: none;
  z-index: 0;
}
.cpd-hero-content {
  position: relative; z-index: 1;
  width: 100%; max-width: 1240px; padding: 0 28px;
}
.cpd-hero-headline { max-width: 22ch; }
.cpd-hero-headline-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--text-faint);
  display: inline-flex; align-items: center; gap: 10px;
  margin-bottom: 28px;
}
.cpd-hero-headline-tag .dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 4px rgba(0,82,255,0.18);
}
.cpd-hero-h1 {
  font-size: clamp(40px, 6.4vw, 78px);
  line-height: 0.98;
  letter-spacing: -0.044em;
  font-weight: 500;
  margin: 0;
}
.cpd-hero-sub {
  margin-top: 32px;
  font-size: 17.5px;
  color: var(--text-muted);
  max-width: 56ch;
  line-height: 1.45;
}
.cpd-hero-cta { margin-top: 36px; display: flex; gap: 12px; flex-wrap: wrap; }

.cpd-hero-product {
  margin-top: 64px;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: rgba(255,255,255,0.022);
  padding: 40px;
  min-height: 520px;
  display: grid;
  grid-template-columns: 140px 1fr 180px;
  gap: 24px;
}
.cpd-hero-product-nav { font-size: 12px; color: var(--text-muted); }
.cpd-hero-product-nav-item { padding: 12px 8px; cursor: pointer; transition: color .15s ease; }
.cpd-hero-product-nav-item:hover { color: var(--text); }
.cpd-hero-product-nav-item.active { color: var(--accent); }

.cpd-hero-product-main {
  display: flex; flex-direction: column; gap: 20px;
  border: 1px solid var(--border); border-radius: 12px;
  background: rgba(255,255,255,0.025); padding: 20px;
}
.cpd-hero-product-header {
  display: flex; align-items: center; justify-content: space-between;
  font-size: 13px; color: var(--text-muted); font-family: 'JetBrains Mono', monospace;
  padding-bottom: 12px; border-bottom: 1px solid var(--border);
}
.cpd-hero-product-header .title { color: var(--text); }

.cpd-hero-product-messages {
  display: flex; flex-direction: column; gap: 12px;
  max-height: 280px; overflow-y: auto;
}
.cpd-hero-product-message {
  padding: 12px; border-radius: 8px;
  font-size: 13px; line-height: 1.45;
}
.cpd-hero-product-message.mine { background: rgba(0,82,255,0.14); color: var(--text); }
.cpd-hero-product-message.theirs { background: rgba(255,255,255,0.05); color: var(--text-muted); }

.cpd-hero-product-ai {
  background: linear-gradient(135deg, rgba(0,82,255,0.16), rgba(76,133,255,0.08));
  border: 1px solid rgba(0,82,255,0.32);
  border-radius: 8px; padding: 16px;
  font-size: 12.5px; color: var(--text-muted); line-height: 1.45;
  margin-top: 12px;
}
.cpd-hero-product-ai .label { color: var(--accent-2); font-family: 'JetBrains Mono', monospace; font-size: 10px; text-transform: uppercase; margin-bottom: 6px; }

.cpd-hero-product-evidence {
  border-top: 1px solid var(--border); padding-top: 12px; margin-top: 12px;
  font-size: 12px; color: var(--text-muted);
}
.cpd-hero-product-evidence-item {
  padding: 6px 0; display: flex; align-items: center; gap: 8px;
}
.cpd-hero-product-evidence-item .icon {
  width: 16px; height: 16px; border-radius: 50%; background: var(--accent-soft); }

.cpd-hero-product-approve {
  margin-top: 12px;
  padding: 12px 16px;
  background: var(--accent);
  color: white;
  border: none; border-radius: 8px;
  cursor: pointer; font-size: 13px; font-weight: 500;
  transition: background .15s ease;
}
.cpd-hero-product-approve:hover { background: #0044D6; }

.cpd-hero-product-closure {
  border-left: 1px solid var(--border); padding-left: 20px;
  font-size: 12px;
}
.cpd-hero-product-closure-title { color: var(--accent-2); font-family: 'JetBrains Mono', monospace; font-size: 10px; text-transform: uppercase; margin-bottom: 12px; }
.cpd-hero-product-closure-item {
  padding: 8px 0; display: flex; align-items: center; gap: 8px;
  color: var(--text-muted);
}
.cpd-hero-product-closure-item .done { color: var(--green); }

.cpd-hero-persona-ribbon {
  display: flex; gap: 12px; margin-top: 32px; flex-wrap: wrap;
}
.cpd-hero-persona {
  font-size: 12px; padding: 6px 12px; border-radius: 999px;
  border: 1px solid var(--border); color: var(--text-muted);
  transition: all .15s ease;
}
.cpd-hero-persona:hover { border-color: var(--accent); color: var(--text); }

.cpd-hero-teaser {
  text-align: center; margin-top: 48px;
  font-size: 14px; color: var(--text-muted);
  animation: bounce 2s infinite;
}
@keyframes bounce {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* SECTION 2 - THREAD ANATOMY */
.cpd-anatomy {
  display: grid; grid-template-columns: 1fr 1.2fr; gap: 56px; align-items: flex-start;
  @media (max-width: 980px) { grid-template-columns: 1fr; }
}
.cpd-anatomy-rail { display: flex; flex-direction: column; gap: 32px; }
.cpd-anatomy-beat {
  font-size: 13px;
}
.cpd-anatomy-beat-label { color: var(--text); font-weight: 500; margin-bottom: 6px; }
.cpd-anatomy-beat-caption { color: var(--text-muted); font-size: 12.5px; line-height: 1.45; }

.cpd-anatomy-product {
  border: 1px solid var(--border); border-radius: 18px;
  background: rgba(255,255,255,0.018); padding: 40px;
  min-height: 420px;
  display: flex; flex-direction: column; gap: 16px;
}
.cpd-anatomy-thread { position: relative; flex: 1; }

/* SECTION 3 - PERSONA PIVOT */
.cpd-personas { display: grid; grid-template-columns: 1fr 1.2fr; gap: 56px; align-items: flex-start; }
.cpd-personas-list { display: flex; flex-direction: column; gap: 16px; }
.cpd-personas-item {
  padding: 14px 16px; border-radius: 8px; border: 1px solid var(--border);
  background: rgba(255,255,255,0.025); cursor: pointer;
  font-size: 13px; transition: all .15s ease;
}
.cpd-personas-item:hover { background: rgba(255,255,255,0.04); border-color: var(--accent); }
.cpd-personas-item.active { background: var(--accent-soft); border-color: var(--accent); color: var(--text); }

/* SECTION 4 - CHROME MORPH */
.cpd-morph { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; }
.cpd-morph-chrome {
  border: 1px solid var(--border); border-radius: 12px;
  background: rgba(255,255,255,0.025); padding: 24px;
  min-height: 280px;
}
.cpd-morph-header {
  display: flex; align-items: center; gap: 8px; margin-bottom: 16px;
  padding-bottom: 12px; border-bottom: 1px solid var(--border);
}
.cpd-morph-header-dot {
  width: 4px; height: 4px; border-radius: 50%; background: var(--border-strong);
}
.cpd-morph-header-text { font-size: 12px; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; }
.cpd-morph-content { font-size: 12px; color: var(--text-muted); line-height: 1.6; }

/* SECTION 5 - SOR/SOC DIAGRAM */
.cpd-layers { display: grid; grid-template-columns: 1fr auto 1fr; gap: 48px; align-items: center; }
.cpd-cluster {
  display: flex; flex-direction: column; gap: 16px;
}
.cpd-cluster-title { font-size: 12px; color: var(--text-faint); font-family: 'JetBrains Mono', monospace; text-transform: uppercase; margin-bottom: 8px; }
.cpd-cluster-item {
  padding: 12px 16px; border-radius: 6px;
  background: rgba(255,255,255,0.025); border: 1px solid var(--border);
  font-size: 12.5px; color: var(--text-muted);
}
.cpd-layer-label { text-align: center; font-size: 11px; color: var(--text-faint); font-family: 'JetBrains Mono', monospace; text-transform: uppercase; }

/* SECTION 6 - COORDINATION TAX */
.cpd-tax-content {
  display: flex; flex-direction: column; gap: 28px; align-items: flex-start;
}
.cpd-tax-heading { max-width: 28ch; }
.cpd-tax-stat {
  font-size: 56px; font-weight: 600; letter-spacing: -0.044em;
  color: var(--accent);
  margin: 20px 0;
}
.cpd-tax-descriptor {
  font-size: 18px; color: var(--text-muted); line-height: 1.5;
  max-width: 52ch;
}

/* SECTION 7 - DOMAINS */
.cpd-domains-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
}
.cpd-domain {
  border: 1px solid var(--border); border-radius: 8px;
  background: rgba(255,255,255,0.025); padding: 16px;
  cursor: pointer; transition: all .15s ease;
  text-align: center;
}
.cpd-domain:hover { background: rgba(255,255,255,0.04); border-color: var(--accent); }
.cpd-domain-label { font-size: 12.5px; color: var(--text); font-weight: 500; margin-bottom: 8px; }
.cpd-domain-meta { font-size: 11px; color: var(--text-muted); }

/* SECTION 8 - DASHBOARD/KPIs */
.cpd-dashboard {
  border: 1px solid var(--border); border-radius: 18px;
  background: rgba(255,255,255,0.022); padding: 40px;
  min-height: 320px;
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;
}
.cpd-kpi {
  display: flex; flex-direction: column; gap: 12px;
}
.cpd-kpi-label { font-size: 12px; color: var(--text-muted); }
.cpd-kpi-value { font-size: 28px; font-weight: 600; color: var(--accent-2); }
.cpd-kpi-delta { font-size: 11px; color: var(--green); font-family: 'JetBrains Mono', monospace; }

/* SECTION 9 - AI COMPOUNDS */
.cpd-ai-content { display: grid; grid-template-columns: 1fr 1.2fr; gap: 56px; align-items: flex-start; }
.cpd-ai-levels { display: flex; flex-direction: column; gap: 20px; }
.cpd-ai-level {
  padding: 20px; border-radius: 8px; border: 1px solid var(--border);
  background: rgba(255,255,255,0.025); cursor: pointer;
  transition: all .15s ease;
}
.cpd-ai-level:hover { background: rgba(255,255,255,0.04); border-color: var(--accent); }
.cpd-ai-level-title { font-size: 14px; font-weight: 500; color: var(--text); margin-bottom: 6px; }
.cpd-ai-level-caption { font-size: 12px; color: var(--text-muted); line-height: 1.4; }

/* SECTION 10 - PROOF */
.cpd-testimonial {
  max-width: 720px;
  background: rgba(255,255,255,0.025); border: 1px solid var(--border);
  border-radius: 18px; padding: 48px;
  display: flex; flex-direction: column; gap: 28px;
}
.cpd-testimonial-quote {
  font-size: 20px; line-height: 1.6;
  font-weight: 450; letter-spacing: -0.018em;
}
.cpd-testimonial-quote .open { color: var(--accent); }
.cpd-testimonial-attr { display: flex; flex-direction: column; gap: 6px; font-size: 13px; }
.cpd-testimonial-name { color: var(--text); font-weight: 500; }
.cpd-testimonial-role { color: var(--text-muted); }

/* SECTION 11 - FINAL CTA */
.cpd-cta-content { max-width: 28ch; }
.cpd-cta-product {
  margin-top: 48px; border: 1px solid var(--border); border-radius: 18px;
  background: rgba(255,255,255,0.022); padding: 32px;
  min-height: 280px;
}

/* FOOTER */
.cpd-footer {
  background: var(--bg); border-top: 1px solid var(--border);
  padding: 60px 28px 40px;
}
.cpd-footer-inner {
  max-width: 1240px; margin: 0 auto;
  display: grid; grid-template-columns: 1fr auto;
  gap: 60px; align-items: flex-start;
}
.cpd-footer-left { display: flex; flex-direction: column; gap: 24px; }
.cpd-footer-logo { display: inline-flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px; }
.cpd-footer-logo .dot { width: 6px; height: 6px; border-radius: 2px; background: var(--accent); }
.cpd-footer-descriptor {
  font-size: 14px; line-height: 1.6; color: var(--text-muted); max-width: 52ch;
}
.cpd-footer-descriptor .strong { color: var(--text); font-weight: 500; }
.cpd-footer-partner { font-size: 13px; color: var(--text-muted); }
.cpd-footer-right { text-align: right; }
.cpd-footer-links { display: flex; flex-direction: column; gap: 12px; font-size: 13px; }
.cpd-footer-links a { color: var(--text-muted); transition: color .15s ease; }
.cpd-footer-links a:hover { color: var(--text); }
.cpd-footer-copyright {
  margin-top: 40px; padding-top: 40px; border-top: 1px solid var(--border);
  font-size: 12px; color: var(--text-faint);
  text-align: right;
}
`;

export default function HomeConceptD() {
  const [activePersona, setActivePersona] = useState(0);
  const [activeDomain, setActiveDomain] = useState(0);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = STYLES;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="cpd-root">
      <nav className="cpd-nav">
        <div className="cpd-nav-inner">
          <div className="cpd-nav-logo">
            <div className="cpd-nav-logo-mark"></div>
            <span>Unifize</span>
          </div>
          <div className="cpd-nav-tagline">
            <span>People.</span>
            <span>Process.</span>
            <span>AI.</span>
            <span>Outcomes.</span>
          </div>
          <div className="cpd-nav-items">
            <a href="#anatomy">Anatomy</a>
            <a href="#personas">Personas</a>
            <a href="#replaces">Replaces</a>
            <a href="#why">Why</a>
            <a href="#tax">Coordination tax</a>
            <a href="#domains">Domains</a>
          </div>
          <div className="cpd-nav-actions">
            <a href="#cta" className="cpd-nav-link">Book a demo</a>
            <button className="cpd-nav-btn">Get started</button>
          </div>
        </div>
      </nav>

      <section className="cpd-section cpd-dark cpd-hero">
        <div className="cpd-hero-content">
          <div className="cpd-hero-headline">
            <div className="cpd-hero-headline-tag">
              <div className="dot"></div>
              <span>01 / The platform</span>
            </div>
            <h1 className="cpd-hero-h1">The platform, doing the work.</h1>
            <p className="cpd-hero-sub">The same thread, read five different ways. Five personas. Fifteen domains.</p>
            <div className="cpd-hero-cta">
              <button className="cpd-btn-primary">Book a demo</button>
              <button className="cpd-btn-ghost">Replay the demo</button>
            </div>
          </div>

          <div className="cpd-hero-product">
            <div className="cpd-hero-product-nav">
              <div className="cpd-hero-product-nav-item active">Conversations</div>
              <div className="cpd-hero-product-nav-item">Threads</div>
              <div className="cpd-hero-product-nav-item">Fleet</div>
            </div>

            <div className="cpd-hero-product-main">
              <div className="cpd-hero-product-header">
                <div className="cpd-hero-product-header-dot"></div>
                <span className="title">NCR-219: Solvent impurity</span>
              </div>
              <div className="cpd-hero-product-messages">
                <div className="cpd-hero-product-message theirs">We detected a purity drift in lot 2403-A. Sarah started the investigation.</div>
                <div className="cpd-hero-product-message mine">Root cause: supplier solvent temperature excursion. Attached supplier CoA and GC trace.</div>
                <div className="cpd-hero-product-message theirs">Evidence looks complete. Routing to QA for approval.</div>
                <div className="cpd-hero-product-message mine">Verbal yes from Mike. Effectiveness check passed. Closed.</div>
              </div>
              <div className="cpd-hero-product-ai">
                <div className="label">AI Assist</div>
                <div>Suggested next action: route to QA approval. Reason: evidence requirements complete.</div>
              </div>
              <div className="cpd-hero-product-evidence">
                <div className="label">Evidence bound</div>
                <div className="cpd-hero-product-evidence-item">
                  <div className="icon"></div>
                  <span>Supplier CoA (PDF)</span>
                </div>
                <div className="cpd-hero-product-evidence-item">
                  <div className="icon"></div>
                  <span>GC Trace (CSV)</span>
                </div>
              </div>
              <button className="cpd-hero-product-approve">Approve. Role: QA Mgr. 21 CFR 11.</button>
            </div>

            <div className="cpd-hero-product-closure">
              <div className="cpd-hero-product-closure-title">Closure checklist</div>
              <div className="cpd-hero-product-closure-item"><span className="done">✓</span> Root cause confirmed</div>
              <div className="cpd-hero-product-closure-item"><span className="done">✓</span> Corrective action approved</div>
              <div className="cpd-hero-product-closure-item"><span className="done">✓</span> Evidence complete</div>
              <div className="cpd-hero-product-closure-item"><span className="done">✓</span> Effectiveness verified</div>
              <div className="cpd-hero-product-closure-item">Linked CAPA-310</div>
              <div className="cpd-hero-product-closure-item">Sign-off documentation</div>
            </div>
          </div>

          <div className="cpd-hero-persona-ribbon">
            {PERSONAS.map((p, i) => (
              <div key={i} className="cpd-hero-persona">{p.label}</div>
            ))}
          </div>

          <div className="cpd-hero-teaser">Scroll. Watch it close.</div>
        </div>
      </section>

      <section id="anatomy" className="cpd-section cpd-dark">
        <div style={{ width: "100%" }}>
          <div className="cpd-eyebrow">
            <span className="num">02</span>
            <div className="line"></div>
            <span>Anatomy of a thread</span>
          </div>
          <h2 className="cpd-h2">Seven beats.</h2>
          <p className="cpd-sub">Each thread follows the same structure, but each beat adapts to the domain and the role.</p>

          <div className="cpd-anatomy">
            <div className="cpd-anatomy-rail">
              {THREAD_BEATS.map((beat) => (
                <div key={beat.k} className="cpd-anatomy-beat">
                  <div className="cpd-anatomy-beat-label">{beat.label}</div>
                  <div className="cpd-anatomy-beat-caption">{beat.caption}</div>
                </div>
              ))}
            </div>
            <div className="cpd-anatomy-product">
              <svg viewBox="0 0 360 400" style={{ width: "100%", height: "100%" }}>
                <line x1="20" y1="80" x2="340" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                {THREAD_BEATS.map((beat, i) => (
                  <g key={beat.k}>
                    <circle cx={20 + (i * 50)} cy="80" r="8" fill="var(--accent)" />
                    <line x1={20 + (i * 50)} y1="80" x2={20 + (i * 50)} y2="120" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="2,2" />
                    <text x={20 + (i * 50)} y="150" fontSize="11" textAnchor="middle" fill="rgba(255,255,255,0.4)">{beat.label}</text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section id="personas" className="cpd-section cpd-dark">
        <div style={{ width: "100%" }}>
          <div className="cpd-eyebrow">
            <span className="num">03</span>
            <div className="line"></div>
            <span>Five readings</span>
          </div>
          <h2 className="cpd-h2">Same thread. Different slice.</h2>
          <p className="cpd-sub">Each persona sees the data that matters to their role. Evidence, cycle time, approvals, integrations.</p>

          <div className="cpd-personas">
            <div className="cpd-personas-list">
              {PERSONAS.map((p, i) => (
                <div
                  key={i}
                  className={`cpd-personas-item ${activePersona === i ? "active" : ""}`}
                  onClick={() => setActivePersona(i)}
                >
                  {p.label}
                </div>
              ))}
            </div>
            <div style={{ borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", padding: "32px", background: "rgba(255,255,255,0.018)", minHeight: "320px" }}>
              <p style={{ color: "rgba(255,255,255,0.58)" }}>
                {activePersona === 0 && "VP Quality sees evidence completeness, approval chain, and regulatory stamps."}
                {activePersona === 1 && "Operations sees handoff speed, state preservation, and cross-functional routing."}
                {activePersona === 2 && "Regulatory sees 21 CFR 11 compliance, audit trail, and signed approvals."}
                {activePersona === 3 && "CFO sees cycle time, rework cost, and closure effectiveness."}
                {activePersona === 4 && "CIO sees AI Assist suggestions, integrations, and platform uptime."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="replaces" className="cpd-section cpd-dark">
        <div style={{ width: "100%" }}>
          <div className="cpd-eyebrow">
            <span className="num">04</span>
            <div className="line"></div>
            <span>What it replaces</span>
          </div>
          <h2 className="cpd-h2">REC-2412. Lived across four tools.</h2>
          <p className="cpd-sub">92 days. 3 reopens. Same record. Different layer underneath.</p>

          <div className="cpd-morph">
            {MS_TOOLS.map((tool, i) => (
              <div key={i} className="cpd-morph-chrome">
                <div className="cpd-morph-header">
                  <div className="cpd-morph-header-dot"></div>
                  <div className="cpd-morph-header-dot"></div>
                  <div className="cpd-morph-header-dot"></div>
                  <div className="cpd-morph-header-text">{tool}</div>
                </div>
                <div className="cpd-morph-content">
                  {tool === "Outlook" && "17-reply email thread. FINAL_v2_ACTUAL.docx attachment. #REF! errors in the message."}
                  {tool === "SharePoint" && "FINAL_v2, FINAL_v3, FINAL_FINAL.docx in folder /REC-2412. Last modified uncertain."}
                  {tool === "Teams" && "Side conversation. Manager weighs in with context the thread never sees. Decision lives in Slack."}
                  {tool === "Excel" && "Tracker with #REF! errors. Rows hidden. Who owns this row? Uncertain."}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="why" className="cpd-section cpd-dark">
        <div style={{ width: "100%" }}>
          <div className="cpd-eyebrow">
            <span className="num">05</span>
            <div className="line"></div>
            <span>The structural reason</span>
          </div>
          <h2 className="cpd-h2">Records live here. Coordination lives there. We are the layer between.</h2>

          <div className="cpd-layers" style={{ marginTop: "48px" }}>
            <div className="cpd-cluster">
              <div className="cpd-cluster-title">Systems of record</div>
              <div className="cpd-cluster-item">ERP</div>
              <div className="cpd-cluster-item">QMS</div>
              <div className="cpd-cluster-item">PLM</div>
              <div className="cpd-cluster-item">MES</div>
            </div>

            <div>
              <svg viewBox="0 0 80 200" style={{ width: "80px", height: "200px" }}>
                <rect x="10" y="40" width="60" height="120" fill="none" stroke="var(--accent)" strokeWidth="2" rx="4" />
                <text x="40" y="105" fontSize="11" textAnchor="middle" fill="var(--accent)" fontWeight="500">The Layer</text>
              </svg>
              <div className="cpd-layer-label">Coordination</div>
            </div>

            <div className="cpd-cluster">
              <div className="cpd-cluster-title">Systems of coordination</div>
              <div className="cpd-cluster-item">Teams</div>
              <div className="cpd-cluster-item">Outlook</div>
              <div className="cpd-cluster-item">SharePoint</div>
              <div className="cpd-cluster-item">Excel</div>
            </div>
          </div>
        </div>
      </section>

      <section id="tax" className="cpd-section cpd-dark">
        <div className="cpd-tax-content">
          <div className="cpd-eyebrow">
            <span className="num">06</span>
            <div className="line"></div>
            <span>The name</span>
          </div>
          <h2 className="cpd-h2">Coordination tax.</h2>
          <div className="cpd-tax-stat">15 to 30%</div>
          <p className="cpd-tax-descriptor">
            of white-collar operational cost, invisible in the org chart, visible in cycle time and rework.
            <br />
            <strong>Visible, measurable, reducible.</strong>
            <br />
            For regulated processes.
          </p>
        </div>
      </section>

      <section id="domains" className="cpd-section cpd-dark">
        <div style={{ width: "100%" }}>
          <div className="cpd-eyebrow">
            <span className="num">07</span>
            <div className="line"></div>
            <span>Where it shows up</span>
          </div>
          <h2 className="cpd-h2">Fifteen domains. Same shape every time.</h2>
          <p className="cpd-sub">CAPA, ECO, Complaint, NCR, Audit, Doc Control, Training, Risk, Design Review, MRB, Calibration, Periodic, Recall, Submission, and more.</p>

          <div className="cpd-domains-grid" style={{ marginTop: "48px" }}>
            {DOMAINS.map((domain, i) => (
              <div
                key={i}
                className="cpd-domain"
                onClick={() => setActiveDomain(i)}
                style={{ cursor: "pointer", borderColor: activeDomain === i ? "var(--accent)" : "rgba(255,255,255,0.08)" }}
              >
                <div className="cpd-domain-label">{domain.label}</div>
                <div className="cpd-domain-meta">{domain.trigger}</div>
                <div className="cpd-domain-meta">{domain.persona}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cpd-section cpd-dark">
        <div style={{ width: "100%" }}>
          <div className="cpd-eyebrow">
            <span className="num">08</span>
            <div className="line"></div>
            <span>What changes</span>
          </div>
          <h2 className="cpd-h2">Outcomes, quantified.</h2>
          <p className="cpd-sub">Directional. Across deployments. Figures TBD.</p>

          <div className="cpd-dashboard" style={{ marginTop: "48px" }}>
            <div className="cpd-kpi">
              <div className="cpd-kpi-label">Cycle time</div>
              <div className="cpd-kpi-value">6.2d</div>
              <div className="cpd-kpi-delta">+34% ↑</div>
            </div>
            <div className="cpd-kpi">
              <div className="cpd-kpi-label">Rework rate</div>
              <div className="cpd-kpi-value">8%</div>
              <div className="cpd-kpi-delta">-61% ↓</div>
            </div>
            <div className="cpd-kpi">
              <div className="cpd-kpi-label">Audit ready</div>
              <div className="cpd-kpi-value">100%</div>
              <div className="cpd-kpi-delta">+78% ↑</div>
            </div>
            <div className="cpd-kpi">
              <div className="cpd-kpi-label">Handoff speed</div>
              <div className="cpd-kpi-value">3.1h</div>
              <div className="cpd-kpi-delta">+52% ↑</div>
            </div>
          </div>
        </div>
      </section>

      <section className="cpd-section cpd-dark">
        <div style={{ width: "100%" }}>
          <div className="cpd-eyebrow">
            <span className="num">09</span>
            <div className="line"></div>
            <span>AI compounds</span>
          </div>
          <h2 className="cpd-h2">Three levels. Each unlocks the next.</h2>
          <p className="cpd-sub">Execution. Understanding. Transformation.</p>

          <div className="cpd-ai-content" style={{ marginTop: "48px" }}>
            <div className="cpd-ai-levels">
              <div className="cpd-ai-level">
                <div className="cpd-ai-level-title">Execution</div>
                <div className="cpd-ai-level-caption">Assisted capture. Email to thread. Human approves every proposal.</div>
              </div>
              <div className="cpd-ai-level">
                <div className="cpd-ai-level-title">Understanding</div>
                <div className="cpd-ai-level-caption">Execution assist. Reads the thread. Suggests next step. Routes to right approver.</div>
              </div>
              <div className="cpd-ai-level">
                <div className="cpd-ai-level-title">Transformation</div>
                <div className="cpd-ai-level-caption">Measurement assist. Surfaces aging. Blocks. Reopens. Proposes next intervention.</div>
              </div>
            </div>
            <div style={{ borderRadius: "18px", border: "1px solid rgba(0,82,255,0.4)", padding: "32px", background: "linear-gradient(135deg, rgba(0,82,255,0.16), rgba(76,133,255,0.08))", minHeight: "320px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center", color: "rgba(255,255,255,0.58)", fontSize: "14px" }}>
                AI assistant demonstrates progressively at each level.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cpd-section cpd-light">
        <div style={{ width: "100%" }}>
          <div className="cpd-eyebrow">
            <span className="num">10</span>
            <div className="line"></div>
            <span>Proof</span>
          </div>
          <h2 className="cpd-h2">From a regulated process manufacturer.</h2>

          <div className="cpd-testimonial" style={{ marginTop: "48px" }}>
            <div className="cpd-testimonial-quote">
              <span className="open">"</span>
              We stopped using five tools to chase a record. The thread gets built once. Everyone sees their slice. We went from 18 days to 6.
              <span className="open">"</span>
            </div>
            <div className="cpd-testimonial-attr">
              <div className="cpd-testimonial-name">Sarah Chen</div>
              <div className="cpd-testimonial-role">VP Quality, ISO 13485 manufacturer</div>
            </div>
          </div>
        </div>
      </section>

      <section id="cta" className="cpd-section cpd-dark">
        <div style={{ width: "100%" }}>
          <div className="cpd-eyebrow">
            <span className="num">11</span>
            <div className="line"></div>
            <span>Next</span>
          </div>
          <div className="cpd-cta-content">
            <h2 className="cpd-h2">Walk through your process. With us. With your numbers.</h2>
            <p className="cpd-sub">Forty-five minutes. We pick one of your processes and rebuild it as a single governed thread on screen.</p>
            <div className="cpd-hero-cta" style={{ marginTop: "36px" }}>
              <button className="cpd-btn-primary">Book a demo</button>
              <button className="cpd-btn-ghost">Calculate your coordination tax</button>
            </div>
          </div>

          <div className="cpd-cta-product">
            <svg viewBox="0 0 360 200" style={{ width: "100%", height: "100%" }}>
              <circle cx="180" cy="100" r="60" fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.3" />
              <text x="180" y="105" fontSize="13" textAnchor="middle" fill="rgba(255,255,255,0.5)">Your thread closes.</text>
            </svg>
          </div>
        </div>
      </section>

      <footer className="cpd-footer">
        <div className="cpd-footer-inner">
          <div className="cpd-footer-left">
            <div className="cpd-footer-logo">
              <div className="dot"></div>
              <span>Unifize</span>
            </div>
            <div className="cpd-footer-descriptor">
              <span className="strong">Coordination tax, visible, measurable, reducible.</span>
              <br />
              For regulated processes.
            </div>
            <div className="cpd-footer-partner">Partnered with Microsoft.</div>
          </div>
          <div className="cpd-footer-right">
            <div className="cpd-footer-links">
              <a href="#anatomy">Anatomy</a>
              <a href="#personas">Personas</a>
              <a href="#replaces">Replaces</a>
              <a href="#why">Why</a>
              <a href="#tax">Coordination tax</a>
              <a href="#domains">Domains</a>
              <a href="/concept-c">Concept C</a>
            </div>
            <div className="cpd-footer-copyright">
              Copyright 2026. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
