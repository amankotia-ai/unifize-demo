import { useEffect } from "react";
import { Link } from "react-router-dom";

const STYLES = `
.db-root {
  --db-bg: #FAF7F2;
  --db-ink: #16181C;
  --db-ink-muted: rgba(22,24,28,0.62);
  --db-ink-faint: rgba(22,24,28,0.44);
  --db-rule: rgba(22,24,28,0.16);
  --db-rule-light: rgba(22,24,28,0.08);
  --db-accent: #0052FF;
  --db-paper: #FFFFFF;

  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  background: var(--db-bg);
  color: var(--db-ink);
  -webkit-font-smoothing: antialiased;
  letter-spacing: -0.008em;
  min-height: 100vh;
}
.db-root * { box-sizing: border-box; }
.db-root a { color: inherit; text-decoration: none; }
.db-root .serif {
  font-family: 'Fraunces', 'GT Sectra', Georgia, 'Times New Roman', serif;
  font-optical-sizing: auto;
  font-weight: 400;
}
.db-root .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
.db-root .smcap {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--db-ink-faint);
}

/* NAV */
.db-nav {
  position: sticky; top: 0; z-index: 50;
  background: rgba(250,247,242,0.88);
  backdrop-filter: saturate(140%) blur(16px);
  border-bottom: 1px solid var(--db-rule-light);
}
.db-nav-inner {
  max-width: 1180px; margin: 0 auto;
  padding: 14px 28px;
  display: flex; align-items: center; gap: 40px;
}
.db-nav-logo-img { height: 22px; }
.db-nav-items {
  display: flex; gap: 26px;
  font-size: 13.5px; color: var(--db-ink-muted);
}
.db-nav-items a:hover { color: var(--db-ink); }
.db-nav-actions { margin-left: auto; display: flex; gap: 16px; align-items: center; }
.db-nav-btn {
  font-size: 13px; font-weight: 500;
  background: var(--db-ink); color: #FAF7F2;
  padding: 8px 14px; border: 0; cursor: pointer;
}
@media (max-width: 860px) { .db-nav-items { display: none; } }

/* HERO — pure typography, no image */
.db-hero {
  max-width: 1180px; margin: 0 auto;
  padding: 100px 28px 80px;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 60px;
}
@media (max-width: 860px) {
  .db-hero { grid-template-columns: 1fr; }
}
.db-hero-main { position: relative; }
.db-hero-eyebrow {
  margin-bottom: 44px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.28em; text-transform: uppercase;
  color: var(--db-ink-faint);
}
.db-hero-h1 {
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 350;
  font-size: clamp(44px, 6.4vw, 96px);
  line-height: 1.02;
  letter-spacing: -0.028em;
  margin: 0;
  max-width: 18ch;
}
.db-hero-h1 em {
  font-style: italic; font-weight: 350;
  color: var(--db-ink);
}
.db-hero-sub {
  margin: 40px 0 0;
  font-size: 17px; line-height: 1.62;
  color: var(--db-ink);
  max-width: 58ch;
  font-weight: 400;
}
.db-hero-sub .lead-cap { font-family: 'Fraunces', Georgia, serif; font-size: 22px; font-weight: 400; }
.db-hero-cta {
  margin-top: 48px; display: flex; gap: 16px; flex-wrap: wrap;
}
.db-btn {
  font-family: inherit; font-size: 13.5px; font-weight: 500;
  padding: 10px 18px; cursor: pointer; border: 1px solid var(--db-ink);
  background: var(--db-ink); color: var(--db-bg);
  display: inline-flex; align-items: center; gap: 8px;
}
.db-btn-ghost {
  background: transparent; color: var(--db-ink);
  border-color: var(--db-rule);
}
.db-btn-ghost:hover { border-color: var(--db-ink); }
.db-hero-rail {
  position: relative;
  border-left: 1px solid var(--db-ink);
  padding: 0 0 0 24px;
  display: flex; flex-direction: column;
  justify-content: space-between;
}
.db-hero-rail::before {
  content: "";
  position: absolute; left: -4px; top: 0;
  width: 7px; height: 7px; background: var(--db-ink); border-radius: 50%;
}
.db-hero-rail::after {
  content: "";
  position: absolute; left: -4px; bottom: 0;
  width: 7px; height: 7px; background: var(--db-ink); border-radius: 50%;
}
.db-hero-rail-tag {
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic; font-size: 17px; line-height: 1.45;
  color: var(--db-ink-muted);
  max-width: 26ch;
  margin-top: auto;
  padding-bottom: 8px;
}
.db-hero-rail-head {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.24em;
  text-transform: uppercase; color: var(--db-ink-faint);
}
.db-hero-volnum {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 14px; color: var(--db-ink-faint);
  font-style: italic;
  margin-top: 24px;
}

/* section rhythm */
.db-section {
  max-width: 1180px; margin: 0 auto;
  padding: 100px 28px;
  border-top: 1px solid var(--db-rule-light);
}
.db-section-grid {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 56px;
  align-items: start;
}
@media (max-width: 860px) { .db-section-grid { grid-template-columns: 1fr; } }
.db-section-kicker {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--db-ink-faint);
  position: sticky; top: 80px;
}
.db-section-h {
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 380;
  font-size: clamp(28px, 4vw, 48px);
  line-height: 1.1; letter-spacing: -0.022em;
  margin: 0 0 28px;
  max-width: 28ch;
}
.db-section-p {
  font-size: 17px; line-height: 1.7; color: var(--db-ink);
  max-width: 68ch; margin: 0 0 20px;
}
.db-section-p:first-of-type::first-letter {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 48px;
  float: left;
  line-height: 0.95;
  padding: 4px 10px 0 0;
  font-weight: 380;
}

/* Pull quote */
.db-pull {
  position: relative;
  padding: 28px 0 28px 28px;
  border-left: 3px solid var(--db-ink);
  max-width: 46ch;
  margin: 44px 0 0 auto;
}
.db-pull-text {
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-size: 22px; line-height: 1.38;
  color: var(--db-ink);
  margin: 0 0 14px;
}
.db-pull-attr {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--db-ink-faint);
}

/* GAP diagram (editorial, minimal) */
.db-diagram {
  margin: 52px 0 18px;
  padding: 40px;
  background: var(--db-paper);
  border: 1px solid var(--db-rule);
}
.db-diagram svg { width: 100%; height: auto; display: block; }
.db-diagram-cap {
  margin-top: 18px;
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic; font-size: 14px; color: var(--db-ink-faint);
  text-align: center;
}

/* NAME, oversized serif */
.db-name {
  max-width: 1180px; margin: 0 auto;
  padding: 180px 28px 160px;
  text-align: center;
  border-top: 1px solid var(--db-rule-light);
  border-bottom: 1px solid var(--db-rule-light);
}
.db-name-h {
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 380;
  font-size: clamp(54px, 8vw, 132px);
  letter-spacing: -0.032em; line-height: 0.98;
  margin: 0 auto; max-width: 14ch;
}
.db-name-h em { font-style: italic; font-weight: 380; }
.db-name-p {
  margin: 40px auto 0; max-width: 52ch;
  font-size: 17px; line-height: 1.7;
  color: var(--db-ink);
}

/* LAYER DIAGRAM (E2 editorial) */
.db-layer-diagram {
  margin-top: 52px;
  background: var(--db-paper);
  border: 1px solid var(--db-rule);
  padding: 40px;
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr;
  gap: 18px;
}
@media (max-width: 860px) { .db-layer-diagram { grid-template-columns: 1fr; } }
.db-layer-col {
  border: 1px solid var(--db-rule);
  padding: 22px 20px; min-height: 230px;
  display: flex; flex-direction: column;
}
.db-layer-col.center {
  border-color: var(--db-accent);
  background: rgba(0,82,255,0.04);
}
.db-layer-col h4 {
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 420; font-size: 22px; margin: 0 0 4px;
  letter-spacing: -0.015em;
}
.db-layer-col .head {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--db-ink-faint); margin-bottom: 18px;
}
.db-layer-col ul { list-style: none; padding: 0; margin: 10px 0 0; display: flex; flex-direction: column; gap: 6px; }
.db-layer-col li { font-size: 14px; color: var(--db-ink-muted); }
.db-layer-col.center li { color: #2645A5; }

/* PROOF — quotes stack */
.db-proof-list { margin-top: 48px; display: flex; flex-direction: column; gap: 40px; }
.db-proof-item {
  padding: 36px 0;
  border-top: 1px solid var(--db-rule);
}
.db-proof-item:last-child { border-bottom: 1px solid var(--db-rule); }
.db-proof-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--db-ink-faint); margin-bottom: 16px;
}
.db-proof-q {
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic; font-weight: 400;
  font-size: clamp(22px, 3vw, 32px);
  line-height: 1.3; letter-spacing: -0.014em;
  margin: 0 0 14px;
  max-width: 38ch;
}
.db-proof-attr {
  font-size: 13.5px; color: var(--db-ink-muted);
}
.db-proof-note {
  margin-top: 32px;
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic; font-size: 14px;
  color: var(--db-ink-faint);
}

/* CLOSE */
.db-close {
  max-width: 1180px; margin: 0 auto;
  padding: 140px 28px 120px;
  text-align: left;
  border-top: 1px solid var(--db-rule-light);
}
.db-close-h {
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 380;
  font-size: clamp(34px, 5vw, 64px);
  letter-spacing: -0.024em; line-height: 1.05;
  max-width: 22ch; margin: 0;
}
.db-close-p {
  margin-top: 26px; max-width: 56ch;
  font-size: 17px; line-height: 1.62;
}
.db-close-actions { margin-top: 36px; display: flex; gap: 16px; flex-wrap: wrap; }

/* Sticky bottom bar for cold prospects */
.db-sticky {
  position: fixed;
  bottom: 20px; right: 20px; z-index: 40;
  display: inline-flex;
}
.db-sticky .db-btn { box-shadow: 0 10px 40px -10px rgba(0,0,0,0.35); }

/* FOOTER */
.db-foot {
  border-top: 1px solid var(--db-rule-light);
  padding: 28px;
}
.db-foot-inner {
  max-width: 1180px; margin: 0 auto;
  display: flex; justify-content: space-between; align-items: center;
  font-size: 12px; color: var(--db-ink-faint); flex-wrap: wrap; gap: 16px;
}
`;

export default function HomeDirectionB() {
  useEffect(() => {
    document.title = "Unifize. Direction B — The Diagnosis.";
  }, []);

  return (
    <div className="db-root">
      <style>{STYLES}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <nav className="db-nav">
        <div className="db-nav-inner">
          <Link to="/direction-b" aria-label="Unifize">
            <img src="/Link - home.svg" alt="Unifize" className="db-nav-logo-img" />
          </Link>
          <div className="db-nav-items">
            <a href="#problem">The Problem</a>
            <a href="#world">Your World</a>
            <a href="#industry">By Industry</a>
            <a href="#how">How It Works</a>
            <a href="#proof">Proof</a>
          </div>
          <div className="db-nav-actions">
            <a href="#login" style={{ fontSize: 13.5, color: "var(--db-ink-muted)" }}>Log in</a>
            <button className="db-nav-btn">Book a demo</button>
          </div>
        </div>
      </nav>

      {/* HERO — pure typography, no image */}
      <section className="db-hero">
        <div className="db-hero-main">
          <div className="db-hero-eyebrow">A structural diagnosis.</div>
          <h1 className="db-hero-h1">
            The record and the reality<br />
            are <em>two different things.</em><br />
            Every regulated team knows it.
          </h1>
          <p className="db-hero-sub">
            <span className="lead-cap">Your QMS</span> captures what is officially true. Your team captures what actually happened. The space between them is where the investigations, the approvals, the evidence, and the cross-functional work live. It is also where they get lost. The cost of living in that space has a name. We give it one.
          </p>
          <div className="db-hero-cta">
            <a href="#thesis" className="db-btn">
              Read the thesis
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="#demo" className="db-btn db-btn-ghost">Book a demo</a>
          </div>
        </div>
        <aside className="db-hero-rail">
          <div>
            <div className="db-hero-rail-head">Vol. I</div>
            <div className="db-hero-volnum">A white paper on coordination in regulated industries.</div>
          </div>
          <div className="db-hero-rail-tag">
            "Unifize. A platform for regulated processes."
          </div>
        </aside>
      </section>

      {/* S2 — SYMPTOMS */}
      <section className="db-section" id="thesis">
        <div className="db-section-grid">
          <div className="db-section-kicker">§ 01 · Symptoms</div>
          <div>
            <h2 className="db-section-h">
              If you work in a regulated process, you already know the shape of the problem.
            </h2>
            <p className="db-section-p">
              You have a QMS. It is well run. It captures what is officially true. The CAPA closes, the change order gets approved, the supplier gets qualified. The records are in order.
            </p>
            <p className="db-section-p">
              But the work that produced those records did not live in the QMS. It lived in your inbox. In a Teams thread. In a spreadsheet with three versions. In a meeting nobody minuted. When the audit came, that work had to be rebuilt from memory, artefacts, and sent folders.
            </p>
            <p className="db-section-p">
              That reconstruction is the tax. You paid it last quarter. You will pay it this quarter. And you have never counted it.
            </p>

            <div className="db-pull">
              <p className="db-pull-text">
                "Audit week is not the work. Audit week is the reconstruction of the work."
              </p>
              <div className="db-pull-attr">VP Quality — Class II medical device</div>
            </div>
          </div>
        </div>
      </section>

      {/* S3 — TWO SYSTEMS */}
      <section className="db-section" id="problem">
        <div className="db-section-grid">
          <div className="db-section-kicker">§ 02 · The two systems</div>
          <div>
            <h2 className="db-section-h">
              Your systems of record and your systems of coordination are two different systems.
            </h2>
            <p className="db-section-p">
              Systems of record are what the industry has built for decades. QMS, ERP, PLM, DMS, MES, LIMS. They are authoritative for their domain. They hold lots, lot numbers, change orders, training records, specifications. They capture what is officially true, once it is true.
            </p>
            <p className="db-section-p">
              Systems of coordination are not in any of those. The investigation that produced the deviation disposition. The evidence that justified the CAPA closure. The cross-functional approvals that sit between a change request and a released revision. The supplier conversation that resolved the SCAR. All of this is coordination, and none of it is in your system of record.
            </p>
            <p className="db-section-p">
              Coordination runs through email, meetings, Excel, and SharePoint. Every regulated organisation runs a parallel operating model nobody names. When complexity grows (more products, more sites, more partners, more lots) the coordination grows non-linearly. The organisation becomes dependent on memory. That is fragile and expensive.
            </p>

            {/* E1 editorial — two timelines */}
            <div className="db-diagram">
              <svg viewBox="0 0 1000 340" fill="none">
                <defs>
                  <pattern id="db-shade" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="8" x2="8" y2="0" stroke="#16181C" strokeOpacity="0.08" strokeWidth="1" />
                  </pattern>
                </defs>

                {/* shaded gap between lines */}
                <rect x="60" y="92" width="880" height="156" fill="url(#db-shade)" />

                {/* top line */}
                <text x="60" y="66" fill="#16181C" opacity="0.52" fontFamily="JetBrains Mono" fontSize="11" letterSpacing="2">
                  SYSTEMS OF RECORD
                </text>
                <line x1="60" y1="88" x2="940" y2="88" stroke="#16181C" strokeWidth="1.2" />
                {[140, 380, 620, 860].map((x, i) => (
                  <g key={`t-${i}`}>
                    <circle cx={x} cy="88" r="5" fill="#16181C" />
                  </g>
                ))}

                {/* bottom line */}
                <text x="60" y="288" fill="#16181C" opacity="0.52" fontFamily="JetBrains Mono" fontSize="11" letterSpacing="2">
                  SYSTEMS OF COORDINATION
                </text>
                <line x1="60" y1="252" x2="940" y2="252" stroke="#16181C" strokeWidth="1.2" />
                {[90, 130, 180, 230, 290, 340, 380, 430, 480, 530, 580, 640, 700, 750, 800, 850, 900].map((x, i) => (
                  <circle key={`b-${i}`} cx={x} cy="252" r="3" fill="#16181C" opacity="0.72" />
                ))}

                {/* forks */}
                <path d="M 180 252 Q 220 190, 290 230" stroke="#16181C" strokeWidth="1" opacity="0.3" fill="none" />
                <path d="M 430 252 Q 480 170, 530 220" stroke="#16181C" strokeWidth="1" opacity="0.3" fill="none" />
                <path d="M 700 252 Q 760 170, 820 220" stroke="#16181C" strokeWidth="1" opacity="0.3" fill="none" />

                {/* gap annotation */}
                <text x="500" y="174" textAnchor="middle" fill="#0052FF" fontFamily="JetBrains Mono" fontSize="12" letterSpacing="3">
                  ← THE GAP →
                </text>
              </svg>
              <div className="db-diagram-cap">Figure 1. The shaded area is what we call coordination tax.</div>
            </div>
          </div>
        </div>
      </section>

      {/* S4 — THE NAME */}
      <section className="db-name">
        <h2 className="db-name-h">
          Coordination <em>tax.</em>
        </h2>
        <p className="db-name-p">
          It is the cost of holding cross-functional work together when no system owns it. It is paid in cycle time, rework, audit prep, orphaned commitments, and institutional memory. It is structural, not behavioural. It persists in well-run organisations. And it is reducible.
        </p>
      </section>

      {/* S5 — THE LAYER */}
      <section className="db-section" id="world">
        <div className="db-section-grid">
          <div className="db-section-kicker">§ 03 · The layer</div>
          <div>
            <h2 className="db-section-h">
              Unifize is the layer that captures what happens in the gap.
            </h2>
            <p className="db-section-p">
              Every cross-functional event becomes one accountable thread. The thread holds the record, the decisions, the approvals, the evidence, the ownership, and the completion. It is reviewable end to end. It is auditable on the first request. It coexists with your existing systems. It does not replace them.
            </p>
            <p className="db-section-p">
              Context flows in from your QMS, ERP, and PLM. Outcomes flow back to them when you want. Artefacts bind to the thread from SharePoint and file drives. Decisions from Teams and email get captured into the thread. The thread is the one place where the shape of the work is preserved.
            </p>

            <div className="db-layer-diagram">
              <div className="db-layer-col">
                <div className="head">Systems of Record</div>
                <h4>Authoritative.</h4>
                <ul><li>QMS</li><li>ERP</li><li>PLM</li><li>DMS</li><li>MES</li></ul>
              </div>
              <div className="db-layer-col center">
                <div className="head">Unifize</div>
                <h4>One accountable thread.</h4>
                <ul>
                  <li>Record attached</li>
                  <li>Decisions logged</li>
                  <li>Evidence bound</li>
                  <li>Approvals timestamped</li>
                  <li>Ownership explicit</li>
                </ul>
              </div>
              <div className="db-layer-col">
                <div className="head">Horizontal tools</div>
                <h4>Where work happens.</h4>
                <ul><li>Teams</li><li>Outlook</li><li>SharePoint</li><li>Excel</li><li>Meetings</li></ul>
              </div>
            </div>
            <div className="db-diagram-cap">Figure 2. The Unifize placement model. Coexistence, not replacement.</div>
          </div>
        </div>
      </section>

      {/* S6 — PROOF */}
      <section className="db-section" id="proof">
        <div className="db-section-grid">
          <div className="db-section-kicker">§ 04 · The proof</div>
          <div>
            <h2 className="db-section-h">What practitioners said after a year.</h2>

            <div className="db-proof-list">
              <div className="db-proof-item">
                <div className="db-proof-label">Medical Devices — Class II</div>
                <p className="db-proof-q">
                  "The audit used to be a three-week fire drill. This year it was a Tuesday."
                </p>
                <div className="db-proof-attr">VP Quality, Class II medical device manufacturer.</div>
              </div>
              <div className="db-proof-item">
                <div className="db-proof-label">Aerospace and Defence</div>
                <p className="db-proof-q">
                  "We stopped asking where the evidence was. The thread had it."
                </p>
                <div className="db-proof-attr">Quality Director, aerospace and defence supplier.</div>
              </div>
              <div className="db-proof-item">
                <div className="db-proof-label">Industrial Machinery</div>
                <p className="db-proof-q">
                  "Change orders moved from a sign-off queue to a tracked conversation. Cycle time fell."
                </p>
                <div className="db-proof-attr">Operations Lead, industrial machinery manufacturer.</div>
              </div>
            </div>

            <p className="db-proof-note">
              Claims above are drawn from interviews. See the Proof page for workflow-specific detail and maturity.
            </p>
          </div>
        </div>
      </section>

      {/* S7 — THE CLOSE */}
      <section className="db-close">
        <h2 className="db-close-h">
          Forty-five minutes. One thread in your process. A number at the end.
        </h2>
        <p className="db-close-p">
          Book time with a practitioner. We walk one coordination-heavy thread in your process, price the tax in your numbers, and leave you with the baseline. Demo or not.
        </p>
        <div className="db-close-actions">
          <a href="#demo" className="db-btn">Book a demo</a>
          <a href="#thesis" className="db-btn db-btn-ghost">Read the full thesis</a>
        </div>
      </section>

      {/* sticky bar for cold prospects */}
      <div className="db-sticky">
        <a href="#demo" className="db-btn">Book a demo</a>
      </div>

      <footer className="db-foot">
        <div className="db-foot-inner">
          <span>© {new Date().getFullYear()} Unifize. All rights reserved.</span>
          <span className="mono">Partnered with Microsoft.</span>
        </div>
      </footer>
    </div>
  );
}
