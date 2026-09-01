import { useEffect } from "react";
import { Link } from "react-router-dom";

const THREAD_NODES = [
  { key: "RECORD", detail: "The lot, the change order, the deviation. The thing the work is about." },
  { key: "DECISIONS", detail: "Every commit point, timestamped, owned, reviewable." },
  { key: "EVIDENCE", detail: "Every artefact attached to the claim that needed it." },
  { key: "APPROVALS", detail: "Every signature, role-bound, audit-ready." },
  { key: "OWNER", detail: "One person accountable, at every stage." },
  { key: "COMPLETION", detail: "Supported by evidence, not a status label." },
];

const STYLES = `
.dd-root {
  --dd-bg: #F5F2EC;
  --dd-paper: #FFFFFF;
  --dd-ink: #0A0A0A;
  --dd-rule: rgba(10,10,10,0.12);
  --dd-muted: rgba(10,10,10,0.58);
  --dd-faint: rgba(10,10,10,0.4);
  --dd-accent: #0052FF;

  font-family: 'Inter', 'Söhne', ui-sans-serif, system-ui, sans-serif;
  background: var(--dd-bg);
  color: var(--dd-ink);
  -webkit-font-smoothing: antialiased;
  letter-spacing: -0.008em;
  min-height: 100vh;
}
.dd-root * { box-sizing: border-box; }
.dd-root a { color: inherit; text-decoration: none; }
.dd-root .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
.dd-root .smcap {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10.5px; letter-spacing: 0.24em; text-transform: uppercase;
  color: var(--dd-faint);
}

/* NAV */
.dd-nav {
  position: sticky; top: 0; z-index: 50;
  background: rgba(245,242,236,0.9);
  backdrop-filter: saturate(150%) blur(16px);
  border-bottom: 1px solid var(--dd-ink);
}
.dd-nav-inner {
  max-width: 1340px; margin: 0 auto;
  padding: 14px 32px;
  display: grid;
  grid-template-columns: 140px 1fr auto;
  align-items: center; gap: 20px;
}
.dd-nav-logo-img { height: 22px; }
.dd-nav-items {
  display: flex; gap: 24px; justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--dd-muted);
}
.dd-nav-items a:hover { color: var(--dd-ink); }
.dd-nav-actions { display: flex; gap: 14px; align-items: center; }
.dd-nav-btn {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px; letter-spacing: 0.14em; text-transform: uppercase;
  background: var(--dd-ink); color: var(--dd-bg);
  padding: 9px 16px; border: 0; cursor: pointer;
}
@media (max-width: 900px) { .dd-nav-items { display: none; } }

/* GRID WRAPPER */
.dd-wrap {
  max-width: 1340px; margin: 0 auto;
  padding: 0 32px;
}

/* ========= HERO ========= */
.dd-hero {
  position: relative;
  padding: 80px 0 100px;
  border-bottom: 1px solid var(--dd-ink);
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  column-gap: 24px;
  min-height: 88vh;
}
@media (max-width: 900px) { .dd-hero { grid-template-columns: repeat(4, 1fr); } }

.dd-hero-meta {
  grid-column: 1 / 3;
  display: flex; flex-direction: column;
  justify-content: space-between;
  position: relative;
}
.dd-hero-meta-block { display: flex; flex-direction: column; gap: 10px; }
.dd-hero-meta-block .kicker { color: var(--dd-faint); }
.dd-hero-meta-block .val {
  font-family: 'Inter', sans-serif;
  font-size: 14px; font-weight: 500; letter-spacing: -0.01em;
  color: var(--dd-ink);
}
.dd-hero-title-col {
  grid-column: 3 / 7;
  display: flex; flex-direction: column; justify-content: center;
  gap: 56px;
  padding: 0 16px;
}
.dd-hero-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase;
  color: var(--dd-faint);
}
.dd-hero-h1 {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: clamp(54px, 9vw, 128px);
  line-height: 0.92;
  letter-spacing: -0.045em;
  margin: 0;
}
.dd-hero-h1 .spec-line {
  display: block;
}
.dd-hero-h1 .spec-line.dot::after {
  content: "."; color: var(--dd-accent);
}
.dd-hero-cta {
  display: flex; gap: 14px; flex-wrap: wrap;
}
.dd-btn {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px; letter-spacing: 0.14em; text-transform: uppercase;
  padding: 13px 20px; border: 1px solid var(--dd-ink);
  background: var(--dd-ink); color: var(--dd-bg); cursor: pointer;
}
.dd-btn-ghost { background: transparent; color: var(--dd-ink); }
.dd-btn-ghost:hover { background: var(--dd-ink); color: var(--dd-bg); }

/* THE THREAD — the hero visual */
.dd-thread-col {
  grid-column: 7 / 9;
  position: relative;
  display: flex; justify-content: center;
}
@media (max-width: 900px) { .dd-thread-col { grid-column: 1 / -1; margin-top: 60px; } }

.dd-thread {
  position: relative;
  width: 100%;
  max-width: 300px;
  display: flex; flex-direction: column;
  align-items: center;
  padding: 0 20px;
}
.dd-thread-svg {
  position: absolute;
  left: 50%;
  top: 40px;
  bottom: 40px;
  transform: translateX(-50%);
  width: 4px;
  height: calc(100% - 80px);
  pointer-events: none;
}
.dd-thread-rule {
  stroke: var(--dd-accent); stroke-width: 3;
  animation: dd-rule-draw 1800ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
  stroke-dasharray: 800; stroke-dashoffset: 800;
}
@keyframes dd-rule-draw { to { stroke-dashoffset: 0; } }

.dd-thread-inner {
  position: relative;
  display: flex; flex-direction: column;
  gap: 38px;
  width: 100%;
  padding: 40px 0;
}

.dd-thread-label-top,
.dd-thread-label-bottom {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--dd-ink);
  text-align: center;
  padding: 8px 12px;
  border: 1px solid var(--dd-ink);
  background: var(--dd-bg);
  display: inline-block;
  align-self: center;
}

.dd-thread-nodes {
  display: flex; flex-direction: column; gap: 28px;
  position: relative;
}
.dd-thread-node {
  position: relative;
  width: 100%;
  display: flex; align-items: center;
  opacity: 0;
  animation: dd-node-in 620ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.dd-thread-node:nth-child(1) { animation-delay: 1200ms; }
.dd-thread-node:nth-child(2) { animation-delay: 1330ms; flex-direction: row-reverse; }
.dd-thread-node:nth-child(3) { animation-delay: 1460ms; }
.dd-thread-node:nth-child(4) { animation-delay: 1590ms; flex-direction: row-reverse; }
.dd-thread-node:nth-child(5) { animation-delay: 1720ms; }
.dd-thread-node:nth-child(6) { animation-delay: 1850ms; flex-direction: row-reverse; }
@keyframes dd-node-in {
  0%   { opacity: 0; transform: translateX(0); filter: blur(4px); }
  100% { opacity: 1; transform: translateX(0); filter: blur(0); }
}
.dd-thread-node::before {
  content: ""; width: 40%; height: 1px; background: var(--dd-ink);
  flex-shrink: 0;
}
.dd-thread-node-dot {
  width: 10px; height: 10px; background: var(--dd-accent);
  flex-shrink: 0;
}
.dd-thread-node-label {
  width: calc(60% - 14px); flex-shrink: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--dd-ink);
  padding: 0 12px;
}
.dd-thread-node:nth-child(even) .dd-thread-node-label { text-align: right; }

/* ========= SECTIONS ========= */
.dd-sec {
  border-bottom: 1px solid var(--dd-ink);
  padding: 110px 0;
}
.dd-sec-head {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 24px;
  margin-bottom: 48px;
}
.dd-sec-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--dd-faint);
  padding-top: 8px;
}
.dd-sec-title {
  font-size: clamp(28px, 4vw, 52px);
  font-weight: 600; letter-spacing: -0.028em; line-height: 1;
  margin: 0; max-width: 26ch;
}

/* S2 — SIX LINES */
.dd-six {
  display: flex; flex-direction: column;
}
.dd-six-line {
  border-top: 1px solid var(--dd-rule);
  padding: 30px 0;
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 24px; align-items: baseline;
}
.dd-six-line:last-child { border-bottom: 1px solid var(--dd-rule); }
.dd-six-line .n {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.2em; color: var(--dd-faint);
}
.dd-six-line .t {
  font-size: clamp(22px, 2.8vw, 36px);
  font-weight: 500; letter-spacing: -0.022em; line-height: 1.15;
  margin: 0;
}
.dd-six-line.highlight .t { color: var(--dd-accent); }

/* S3 — THREAD ANNOTATED */
.dd-anno-grid {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 48px;
}
@media (max-width: 900px) { .dd-anno-grid { grid-template-columns: 1fr; } }
.dd-anno-visual {
  position: relative;
  background: var(--dd-paper);
  border: 1px solid var(--dd-ink);
  padding: 40px 20px;
  min-height: 540px;
  display: flex; justify-content: center;
}
.dd-anno-visual .dd-thread { max-width: 340px; }

.dd-anno-list {
  display: flex; flex-direction: column;
  border-top: 1px solid var(--dd-rule);
}
.dd-anno-item {
  padding: 22px 0;
  border-bottom: 1px solid var(--dd-rule);
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 20px;
  align-items: baseline;
}
.dd-anno-item .k {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--dd-accent);
}
.dd-anno-item .v {
  font-size: 15px; line-height: 1.5;
  color: var(--dd-ink);
}
.dd-anno-closer {
  margin-top: 40px;
  font-size: 15px; color: var(--dd-muted);
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.02em;
}

/* S4 — WHY IT MATTERS */
.dd-why-list {
  display: flex; flex-direction: column;
}
.dd-why-item {
  border-top: 1px solid var(--dd-ink);
  padding: 48px 0;
  display: grid; grid-template-columns: 80px 1fr; gap: 24px;
  align-items: baseline;
}
.dd-why-item:last-child { border-bottom: 1px solid var(--dd-ink); }
.dd-why-item .n { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.2em; color: var(--dd-faint); }
.dd-why-item .t {
  font-size: clamp(26px, 3.4vw, 48px);
  font-weight: 600; letter-spacing: -0.028em; line-height: 1.04;
  margin: 0; max-width: 20ch;
}

/* S5 — CLOSE */
.dd-close {
  padding: 140px 0;
  border-bottom: 1px solid var(--dd-ink);
}
.dd-close-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 60px; align-items: end;
}
@media (max-width: 900px) { .dd-close-grid { grid-template-columns: 1fr; } }
.dd-close-h {
  font-size: clamp(32px, 5vw, 72px);
  font-weight: 600; letter-spacing: -0.032em; line-height: 0.98;
  margin: 0; max-width: 16ch;
}
.dd-close-body {
  display: flex; flex-direction: column; gap: 24px; align-items: flex-start;
}
.dd-close-p {
  font-size: 16px; line-height: 1.55; max-width: 48ch;
  margin: 0;
}
.dd-close-actions { display: flex; gap: 12px; flex-wrap: wrap; }

/* FOOTER */
.dd-foot {
  padding: 28px 32px;
}
.dd-foot-inner {
  max-width: 1340px; margin: 0 auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--dd-ink);
  text-align: left;
}
`;

export default function HomeDirectionD() {
  useEffect(() => {
    document.title = "Unifize. Direction D — One Thread.";
  }, []);

  return (
    <div className="dd-root">
      <style>{STYLES}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <nav className="dd-nav">
        <div className="dd-nav-inner">
          <Link to="/direction-d" aria-label="Unifize">
            <img src="/Link - home.svg" alt="Unifize" className="dd-nav-logo-img" />
          </Link>
          <div className="dd-nav-items">
            <a href="#problem">Problem</a>
            <a href="#world">World</a>
            <a href="#how">How</a>
            <a href="#proof">Proof</a>
          </div>
          <div className="dd-nav-actions">
            <button className="dd-nav-btn">Book a demo</button>
          </div>
        </div>
      </nav>

      <div className="dd-wrap">
        {/* HERO — the thread as an architectural artefact */}
        <section className="dd-hero">
          {/* Meta column — specification drawing style */}
          <aside className="dd-hero-meta">
            <div className="dd-hero-meta-block">
              <div className="smcap">Artefact</div>
              <div className="val">One accountable thread.</div>
            </div>
            <div className="dd-hero-meta-block">
              <div className="smcap">Scale</div>
              <div className="val">1:1</div>
            </div>
            <div className="dd-hero-meta-block">
              <div className="smcap">Scope</div>
              <div className="val">Cross-functional.<br/>Record, decision, evidence, approval, owner, completion.</div>
            </div>
            <div className="dd-hero-meta-block">
              <div className="smcap">Revision</div>
              <div className="val mono">v1.2 · 2026-04</div>
            </div>
          </aside>

          {/* Title column */}
          <div className="dd-hero-title-col">
            <div className="dd-hero-eyebrow">One accountable thread.</div>
            <h1 className="dd-hero-h1">
              <span className="spec-line">One record<span style={{ color: "var(--dd-accent)" }}>.</span></span>
              <span className="spec-line">One thread<span style={{ color: "var(--dd-accent)" }}>.</span></span>
              <span className="spec-line">Everything attached<span style={{ color: "var(--dd-accent)" }}>.</span></span>
            </h1>
            <div className="dd-hero-cta">
              <button className="dd-btn">Book a demo</button>
              <a href="#thesis" className="dd-btn dd-btn-ghost">Read the thesis</a>
            </div>
          </div>

          {/* Thread visual — architectural */}
          <div className="dd-thread-col">
            <div className="dd-thread" aria-hidden>
              <svg className="dd-thread-svg" viewBox="0 0 4 800" preserveAspectRatio="none">
                <line className="dd-thread-rule" x1="2" y1="0" x2="2" y2="800" />
              </svg>

              <div className="dd-thread-label-top mono">BEGIN</div>

              <div className="dd-thread-inner" style={{ padding: "10px 0" }}>
                <div className="dd-thread-nodes">
                  {THREAD_NODES.map((n) => (
                    <div key={n.key} className="dd-thread-node">
                      <span className="dd-thread-node-dot" />
                      <span className="dd-thread-node-label">{n.key}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dd-thread-label-bottom mono">END</div>
            </div>
          </div>
        </section>

        {/* S2 — THE PROBLEM IN SIX LINES */}
        <section className="dd-sec" id="problem">
          <div className="dd-sec-head">
            <div className="dd-sec-num">§ 02 · Problem</div>
            <h2 className="dd-sec-title">The problem, in six lines.</h2>
          </div>
          <div className="dd-six">
            <div className="dd-six-line"><span className="n">01</span><p className="t">Your QMS holds the record.</p></div>
            <div className="dd-six-line"><span className="n">02</span><p className="t">Your team holds the reality.</p></div>
            <div className="dd-six-line"><span className="n">03</span><p className="t">The record is what the auditor sees.</p></div>
            <div className="dd-six-line"><span className="n">04</span><p className="t">The reality is what the business runs on.</p></div>
            <div className="dd-six-line highlight"><span className="n">05</span><p className="t">The gap between them is coordination tax.</p></div>
            <div className="dd-six-line highlight"><span className="n">06</span><p className="t">Unifize captures the gap.</p></div>
          </div>
        </section>

        {/* S3 — THE THREAD, ANNOTATED */}
        <section className="dd-sec" id="how">
          <div className="dd-sec-head">
            <div className="dd-sec-num">§ 03 · The thread</div>
            <h2 className="dd-sec-title">The thread, annotated.</h2>
          </div>

          <div className="dd-anno-grid">
            <div className="dd-anno-visual">
              <div className="dd-thread" aria-hidden>
                <svg className="dd-thread-svg" viewBox="0 0 4 800" preserveAspectRatio="none">
                  <line x1="2" y1="0" x2="2" y2="800" stroke="var(--dd-accent)" strokeWidth="3" />
                </svg>

                <div className="dd-thread-label-top mono">BEGIN</div>
                <div className="dd-thread-inner" style={{ padding: "10px 0" }}>
                  <div className="dd-thread-nodes">
                    {THREAD_NODES.map((n) => (
                      <div key={n.key} className="dd-thread-node" style={{ animation: "none", opacity: 1 }}>
                        <span className="dd-thread-node-dot" />
                        <span className="dd-thread-node-label">{n.key}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="dd-thread-label-bottom mono">END</div>
              </div>
            </div>

            <div>
              <div className="dd-anno-list">
                {THREAD_NODES.map((n) => (
                  <div key={n.key} className="dd-anno-item">
                    <span className="k">{n.key}</span>
                    <span className="v">{n.detail}</span>
                  </div>
                ))}
              </div>
              <p className="dd-anno-closer">
                One thread per record. Every team, every decision, in one place.
              </p>
            </div>
          </div>
        </section>

        {/* S4 — WHY IT MATTERS */}
        <section className="dd-sec" id="proof">
          <div className="dd-sec-head">
            <div className="dd-sec-num">§ 04 · Why it matters</div>
            <h2 className="dd-sec-title">Three consequences.</h2>
          </div>

          <div className="dd-why-list">
            <div className="dd-why-item">
              <span className="n">01</span>
              <p className="t">Audits stop being reconstructions.</p>
            </div>
            <div className="dd-why-item">
              <span className="n">02</span>
              <p className="t">AI has something to reason over.</p>
            </div>
            <div className="dd-why-item">
              <span className="n">03</span>
              <p className="t">Coordination tax becomes reducible.</p>
            </div>
          </div>
        </section>

        {/* S5 — CLOSE */}
        <section className="dd-close">
          <div className="dd-close-grid">
            <h2 className="dd-close-h">Pick one thread. Measure it. Reduce it.</h2>
            <div className="dd-close-body">
              <p className="dd-close-p">
                Forty-five minutes. We walk one thread in your process. We price it. You keep the baseline.
              </p>
              <div className="dd-close-actions">
                <button className="dd-btn">Book a demo</button>
                <a href="#thesis" className="dd-btn dd-btn-ghost">See the thesis</a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="dd-foot">
        <div className="dd-foot-inner">
          Unifize. A platform for regulated processes. Partnered with Microsoft. People. Process. AI. Outcomes.
        </div>
      </footer>
    </div>
  );
}
