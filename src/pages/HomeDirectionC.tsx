import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const INDUSTRIES = [
  { name: "Medical devices", factor: 1.35 },
  { name: "Aerospace", factor: 1.48 },
  { name: "Automotive", factor: 1.22 },
  { name: "Pharmaceuticals", factor: 1.42 },
  { name: "Laboratories", factor: 1.18 },
  { name: "CROs", factor: 1.15 },
  { name: "Industrial machinery", factor: 1.08 },
  { name: "Other regulated", factor: 1.0 },
];

const DOMAINS = [
  { key: "quality", name: "Quality", weight: 1.6 },
  { key: "change", name: "Change Control", weight: 1.4 },
  { key: "supplier", name: "Supplier Quality", weight: 1.3 },
  { key: "ops", name: "Operations", weight: 1.25 },
  { key: "docs", name: "Docs", weight: 1.1 },
  { key: "training", name: "Training", weight: 0.9 },
  { key: "reg", name: "Regulatory", weight: 1.35 },
];

const PRIMITIVES = [
  { name: "Handoffs", def: "Cross-functional transitions where ownership moves between people or systems." },
  { name: "Governance", def: "Rework driven by compliance re-checks, approval loops, and review cycles." },
  { name: "Evidence", def: "Time spent locating, attaching, or reconstructing supporting artefacts." },
  { name: "Latency", def: "Idle time between a request and a response across inboxes and queues." },
  { name: "System boundaries", def: "Friction at the edges of the QMS, ERP, PLM, DMS, and collaboration tools." },
  { name: "Organisational boundaries", def: "Friction between departments, sites, contract manufacturers, and suppliers." },
  { name: "Meeting overhead", def: "Synchronous coordination substituting for a thread that should persist." },
  { name: "Exceptions", def: "Non-conformances, deviations, excursions, and their resolution tail." },
  { name: "Rework", def: "Revisions caused by missing context, stale revisions, or miscommunicated scope." },
  { name: "Late discovery", def: "Findings that only surface during audit, release, or post-market review." },
  { name: "Pressure", def: "Compression premium when work lands in a fast lane against a live deadline." },
];

const STYLES = `
.dc-root {
  --dc-bg: #FAFAFA;
  --dc-paper: #FFFFFF;
  --dc-ink: #0A0A0A;
  --dc-muted: rgba(10,10,10,0.62);
  --dc-faint: rgba(10,10,10,0.42);
  --dc-rule: rgba(10,10,10,0.12);
  --dc-rule-soft: rgba(10,10,10,0.06);
  --dc-accent: #0052FF;
  --dc-accent-soft: rgba(0,82,255,0.08);
  --dc-positive: #047857;

  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  background: var(--dc-bg);
  color: var(--dc-ink);
  -webkit-font-smoothing: antialiased;
  letter-spacing: -0.006em;
  min-height: 100vh;
}
.dc-root * { box-sizing: border-box; }
.dc-root a { color: inherit; text-decoration: none; }
.dc-root .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
.dc-num-display { font-variant-numeric: tabular-nums; }

/* NAV */
.dc-nav {
  position: sticky; top: 0; z-index: 50;
  background: rgba(250,250,250,0.9);
  backdrop-filter: saturate(150%) blur(18px);
  border-bottom: 1px solid var(--dc-rule-soft);
}
.dc-nav-inner {
  max-width: 1240px; margin: 0 auto;
  padding: 14px 28px;
  display: flex; align-items: center; gap: 40px;
}
.dc-nav-logo-img { height: 22px; }
.dc-nav-items {
  display: flex; gap: 26px;
  font-size: 13.5px; color: var(--dc-muted);
}
.dc-nav-items a:hover { color: var(--dc-ink); }
.dc-nav-actions { margin-left: auto; display: flex; gap: 16px; align-items: center; }
.dc-nav-btn {
  font-size: 13px; font-weight: 500;
  background: var(--dc-ink); color: var(--dc-bg);
  padding: 8px 14px; border: 0; cursor: pointer;
  border-radius: 6px;
}
@media (max-width: 860px) { .dc-nav-items { display: none; } }

/* HERO */
.dc-hero {
  max-width: 1240px; margin: 0 auto;
  padding: 72px 28px 72px;
  position: relative;
}
.dc-hero-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--dc-faint);
  margin-bottom: 28px;
}
.dc-hero-h1 {
  font-size: clamp(34px, 4.6vw, 60px);
  font-weight: 500;
  line-height: 1.05; letter-spacing: -0.03em;
  margin: 0; max-width: 24ch;
}
.dc-hero-sub {
  margin: 22px 0 0;
  font-size: 16px; color: var(--dc-muted);
  max-width: 68ch; line-height: 1.55;
}

/* Calculator panel */
.dc-calc {
  margin-top: 48px;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 0;
  background: var(--dc-paper);
  border: 1px solid var(--dc-rule);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 30px 70px -30px rgba(0,0,0,0.18);
}
@media (max-width: 900px) { .dc-calc { grid-template-columns: 1fr; } }

.dc-calc-inputs {
  padding: 32px 32px 28px;
  display: flex; flex-direction: column; gap: 28px;
  border-right: 1px solid var(--dc-rule);
}
@media (max-width: 900px) { .dc-calc-inputs { border-right: 0; border-bottom: 1px solid var(--dc-rule); } }
.dc-field { display: flex; flex-direction: column; gap: 10px; }
.dc-field-label {
  display: flex; justify-content: space-between;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--dc-faint);
}
.dc-field-label span.val { color: var(--dc-ink); }
.dc-select {
  font-family: inherit; font-size: 15px; font-weight: 500;
  padding: 12px 14px;
  background: var(--dc-paper);
  border: 1px solid var(--dc-rule);
  border-radius: 8px; color: var(--dc-ink);
  appearance: none;
  background-image:
    linear-gradient(45deg, transparent 50%, var(--dc-faint) 50%),
    linear-gradient(-45deg, transparent 50%, var(--dc-faint) 50%);
  background-position: calc(100% - 18px) 20px, calc(100% - 12px) 20px;
  background-size: 6px 6px;
  background-repeat: no-repeat;
}
.dc-slider {
  appearance: none;
  width: 100%; height: 4px; border-radius: 2px;
  background: var(--dc-rule);
  outline: none; margin: 10px 0 0;
}
.dc-slider::-webkit-slider-thumb {
  appearance: none; width: 18px; height: 18px; border-radius: 50%;
  background: var(--dc-accent);
  box-shadow: 0 0 0 4px rgba(0,82,255,0.14);
  cursor: pointer;
}
.dc-domain-row {
  display: flex; flex-wrap: wrap; gap: 6px;
}
.dc-chip {
  font-size: 12px; font-weight: 500;
  padding: 7px 12px; border-radius: 999px;
  border: 1px solid var(--dc-rule);
  background: var(--dc-paper);
  cursor: pointer;
  color: var(--dc-muted);
  transition: all .14s;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.04em;
}
.dc-chip.active {
  background: var(--dc-ink); color: var(--dc-bg);
  border-color: var(--dc-ink);
}

.dc-calc-output {
  background: var(--dc-ink);
  color: #FAFAFA;
  padding: 32px 32px 28px;
  display: flex; flex-direction: column; gap: 6px;
}
.dc-out-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.22em; text-transform: uppercase;
  color: rgba(255,255,255,0.46);
}
.dc-out-main {
  margin-top: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(36px, 5.5vw, 60px);
  letter-spacing: -0.02em;
  color: #FFFFFF;
  font-variant-numeric: tabular-nums;
  line-height: 1.05;
}
.dc-out-unit {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px; letter-spacing: 0.14em;
  color: rgba(255,255,255,0.6);
  text-transform: uppercase;
  margin-top: 2px;
}
.dc-out-rows {
  margin-top: 26px;
  border-top: 1px solid rgba(255,255,255,0.14);
  padding-top: 18px;
  display: flex; flex-direction: column; gap: 10px;
}
.dc-out-row {
  display: flex; justify-content: space-between;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12.5px; letter-spacing: 0.02em;
}
.dc-out-row .l { color: rgba(255,255,255,0.6); }
.dc-out-row .r { color: #FFFFFF; font-variant-numeric: tabular-nums; }
.dc-out-actions {
  margin-top: auto; padding-top: 26px;
  display: flex; gap: 10px; flex-wrap: wrap;
}
.dc-btn-white {
  font-family: inherit; font-size: 13px; font-weight: 500;
  background: #FFFFFF; color: var(--dc-ink);
  padding: 10px 16px; border: 0; border-radius: 6px; cursor: pointer;
}
.dc-btn-outline {
  font-family: inherit; font-size: 13px; font-weight: 500;
  background: transparent; color: #FFFFFF;
  padding: 10px 16px; border: 1px solid rgba(255,255,255,0.3);
  border-radius: 6px; cursor: pointer;
}

/* 5-SEC-RULE ticker — the three summary numbers */
.dc-hero-summary {
  margin-top: 16px;
  display: flex; gap: 24px; flex-wrap: wrap;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.14em;
  color: var(--dc-faint); text-transform: uppercase;
}

/* RECEIPT */
.dc-receipt {
  max-width: 1240px; margin: 0 auto;
  padding: 80px 28px 60px;
  border-top: 1px solid var(--dc-rule-soft);
}
.dc-kicker {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--dc-faint); margin-bottom: 14px;
}
.dc-h2 {
  font-size: clamp(26px, 3.6vw, 44px);
  font-weight: 500; line-height: 1.1; letter-spacing: -0.024em;
  margin: 0; max-width: 26ch;
}
.dc-table {
  margin-top: 38px;
  border-top: 1px solid var(--dc-rule);
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
}
.dc-tr {
  display: grid; grid-template-columns: 180px 1fr 140px;
  padding: 14px 0;
  border-bottom: 1px solid var(--dc-rule);
  align-items: start;
  gap: 20px;
}
@media (max-width: 760px) {
  .dc-tr { grid-template-columns: 1fr; gap: 4px; }
}
.dc-tr .name { font-weight: 500; color: var(--dc-ink); letter-spacing: -0.008em; }
.dc-tr .def { color: var(--dc-muted); font-size: 12.5px; line-height: 1.55; font-family: 'Inter', sans-serif; letter-spacing: 0; }
.dc-tr .val { text-align: right; color: var(--dc-ink); font-variant-numeric: tabular-nums; }
.dc-tr.total { background: var(--dc-accent-soft); padding: 16px; border-bottom: 1px solid var(--dc-accent); }
.dc-tr.total .name { color: var(--dc-accent); }
.dc-tr.total .val { color: var(--dc-accent); font-size: 15px; }
.dc-receipt-closer {
  margin-top: 18px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px; color: var(--dc-faint);
}

/* BUILD NOTE */
.dc-build {
  max-width: 1240px; margin: 0 auto;
  padding: 90px 28px;
  border-top: 1px solid var(--dc-rule-soft);
  display: grid; grid-template-columns: 320px 1fr; gap: 60px;
}
@media (max-width: 860px) { .dc-build { grid-template-columns: 1fr; } }
.dc-build-h {
  font-size: clamp(22px, 2.8vw, 32px);
  font-weight: 500; letter-spacing: -0.02em; line-height: 1.15;
  margin: 0;
}
.dc-build-body { display: flex; flex-direction: column; gap: 14px; }
.dc-build-body p { margin: 0; font-size: 15px; line-height: 1.6; color: var(--dc-ink); }

/* TWO COLUMN ROOT-CAUSE */
.dc-twocol {
  max-width: 1240px; margin: 0 auto;
  padding: 90px 28px;
  border-top: 1px solid var(--dc-rule-soft);
}
.dc-twocol-grid {
  margin-top: 48px;
  display: grid; grid-template-columns: 1fr 80px 1fr; gap: 0;
  align-items: stretch;
}
@media (max-width: 760px) { .dc-twocol-grid { grid-template-columns: 1fr; } }
.dc-twocol-col {
  border: 1px solid var(--dc-rule);
  background: var(--dc-paper); padding: 28px;
}
.dc-twocol-col h4 {
  margin: 0 0 4px; font-size: 16px; font-weight: 500;
}
.dc-twocol-col .head {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--dc-faint); margin-bottom: 16px;
}
.dc-twocol-col ul { list-style: none; padding: 0; margin: 16px 0 0; display: flex; flex-direction: column; gap: 6px; }
.dc-twocol-col li {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px; color: var(--dc-ink);
}
.dc-twocol-rule {
  position: relative;
  display: flex; align-items: center; justify-content: center;
}
.dc-twocol-rule::before {
  content: ""; position: absolute; inset: 0;
  border-left: 1px dashed var(--dc-rule);
  left: 50%; width: 0;
}
.dc-twocol-rule-label {
  background: var(--dc-bg); padding: 8px 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--dc-accent); z-index: 2;
  writing-mode: vertical-rl; transform: rotate(180deg);
}
@media (max-width: 760px) { .dc-twocol-rule { display: none; } }

/* ONE-PARAGRAPH */
.dc-para {
  max-width: 1240px; margin: 0 auto;
  padding: 90px 28px;
  border-top: 1px solid var(--dc-rule-soft);
}
.dc-para p {
  font-size: 17px; line-height: 1.7; margin: 22px 0 0;
  max-width: 68ch;
}

/* CLOSE */
.dc-close {
  max-width: 1240px; margin: 0 auto;
  padding: 110px 28px;
  border-top: 1px solid var(--dc-rule-soft);
}
.dc-close-h {
  font-size: clamp(30px, 4.2vw, 54px);
  font-weight: 500; letter-spacing: -0.028em; line-height: 1.05; margin: 0;
  max-width: 22ch;
}
.dc-close-p {
  margin-top: 22px; max-width: 56ch;
  font-size: 16px; line-height: 1.6;
}
.dc-close-actions { margin-top: 32px; display: flex; gap: 12px; flex-wrap: wrap; }
.dc-btn-ink {
  font-family: inherit; font-size: 13.5px; font-weight: 500;
  background: var(--dc-ink); color: var(--dc-bg);
  padding: 11px 18px; border-radius: 6px; border: 0; cursor: pointer;
}
.dc-btn-link {
  font-family: inherit; font-size: 13.5px; font-weight: 500;
  background: transparent; color: var(--dc-ink);
  padding: 11px 16px; border-radius: 6px;
  border: 1px solid var(--dc-rule); cursor: pointer;
}

/* FOOTER */
.dc-foot {
  border-top: 1px solid var(--dc-rule);
  background: var(--dc-ink);
  color: #FAFAFA;
  padding: 28px;
  font-family: 'JetBrains Mono', monospace;
}
.dc-foot-inner {
  max-width: 1240px; margin: 0 auto;
  display: flex; justify-content: space-between; align-items: center;
  font-size: 12px; flex-wrap: wrap; gap: 16px;
}
.dc-foot-counter {
  color: rgba(255,255,255,0.6);
}
.dc-foot-counter .n {
  color: #FFFFFF; font-variant-numeric: tabular-nums;
}
`;

function formatMoney(n: number) {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(2) + "M";
  return "$" + Math.round(n).toLocaleString();
}
function formatHours(n: number) {
  return Math.round(n).toLocaleString();
}

export default function HomeDirectionC() {
  const [industry, setIndustry] = useState(INDUSTRIES[0].name);
  const [size, setSize] = useState(1200);
  const [domains, setDomains] = useState<string[]>(["quality", "change", "supplier"]);

  useEffect(() => {
    document.title = "Unifize. Direction C — The Number.";
  }, []);

  const { total, hoursQ, cyclePct, primitives } = useMemo(() => {
    const industryFactor = INDUSTRIES.find((i) => i.name === industry)?.factor ?? 1.0;
    const domainFactor = domains.reduce(
      (acc, d) => acc + (DOMAINS.find((x) => x.key === d)?.weight ?? 1.0),
      0
    );
    const base = size * 1450; // rough USD tax per employee baseline
    const total = base * industryFactor * (0.6 + domainFactor * 0.12);

    const hoursQ = (size * 3.2) * industryFactor * (0.7 + domainFactor * 0.08);
    const cyclePct = Math.min(48, 18 + domainFactor * 2 + (industryFactor - 1) * 8);

    const shares = [0.18, 0.13, 0.12, 0.11, 0.09, 0.08, 0.08, 0.07, 0.06, 0.05, 0.03];
    const primitives = PRIMITIVES.map((p, i) => ({ ...p, val: total * shares[i] }));
    return { total, hoursQ, cyclePct, primitives };
  }, [industry, size, domains]);

  const toggleDomain = (key: string) => {
    setDomains((d) =>
      d.includes(key) ? d.filter((x) => x !== key) : [...d, key]
    );
  };

  return (
    <div className="dc-root">
      <style>{STYLES}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <nav className="dc-nav">
        <div className="dc-nav-inner">
          <Link to="/direction-c" aria-label="Unifize">
            <img src="/Link - home.svg" alt="Unifize" className="dc-nav-logo-img" />
          </Link>
          <div className="dc-nav-items">
            <a href="#problem">The Problem</a>
            <a href="#world">Your World</a>
            <a href="#industry">By Industry</a>
            <a href="#how">How It Works</a>
            <a href="#proof">Proof</a>
          </div>
          <div className="dc-nav-actions">
            <a href="#login" style={{ fontSize: 13.5, color: "var(--dc-muted)" }}>Log in</a>
            <button className="dc-nav-btn">Book a demo</button>
          </div>
        </div>
      </nav>

      {/* HERO — Calculator first */}
      <section className="dc-hero">
        <div className="dc-hero-eyebrow">Estimate your coordination tax.</div>
        <h1 className="dc-hero-h1">
          What is coordination costing you this quarter?
        </h1>
        <p className="dc-hero-sub">
          Pick your industry, your headcount, and the domain that hurts. The estimator runs in your browser. It uses eleven primitives, sixty-one signals, and the model the engine will price your engagement on.
        </p>

        <div className="dc-calc">
          <div className="dc-calc-inputs">
            <div className="dc-field">
              <div className="dc-field-label">
                <span>Industry</span>
                <span className="val mono">{industry}</span>
              </div>
              <select
                className="dc-select"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                {INDUSTRIES.map((i) => (
                  <option key={i.name} value={i.name}>{i.name}</option>
                ))}
              </select>
            </div>

            <div className="dc-field">
              <div className="dc-field-label">
                <span>Company size</span>
                <span className="val mono">{size.toLocaleString()} employees</span>
              </div>
              <input
                className="dc-slider"
                type="range"
                min={50}
                max={10000}
                step={50}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
              />
            </div>

            <div className="dc-field">
              <div className="dc-field-label">
                <span>Domain that hurts</span>
                <span className="val mono">{domains.length} selected</span>
              </div>
              <div className="dc-domain-row">
                {DOMAINS.map((d) => (
                  <button
                    key={d.key}
                    type="button"
                    className={`dc-chip ${domains.includes(d.key) ? "active" : ""}`}
                    onClick={() => toggleDomain(d.key)}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="dc-calc-output">
            <div className="dc-out-label">Estimated annual coordination tax</div>
            <div className="dc-out-main dc-num-display">{formatMoney(total)}</div>
            <div className="dc-out-unit">/ year</div>

            <div className="dc-out-rows">
              <div className="dc-out-row">
                <span className="l">Hours this quarter</span>
                <span className="r">{formatHours(hoursQ)} hrs</span>
              </div>
              <div className="dc-out-row">
                <span className="l">Cross-functional cycle time</span>
                <span className="r">{cyclePct.toFixed(1)}%</span>
              </div>
              <div className="dc-out-row">
                <span className="l">Primitives contributing</span>
                <span className="r">11 / 11</span>
              </div>
              <div className="dc-out-row">
                <span className="l">Signals ingested</span>
                <span className="r">61 / 61</span>
              </div>
            </div>

            <div className="dc-out-actions">
              <button className="dc-btn-white">Send me the full breakdown</button>
              <button className="dc-btn-outline">Book a demo</button>
            </div>
          </div>
        </div>
      </section>

      {/* S2 — RECEIPT */}
      <section className="dc-receipt" id="problem">
        <div className="dc-kicker mono">The eleven primitives.</div>
        <h2 className="dc-h2">The receipt. Line by line.</h2>

        <div className="dc-table">
          {primitives.map((p) => (
            <div key={p.name} className="dc-tr">
              <span className="name">{p.name}</span>
              <span className="def">{p.def}</span>
              <span className="val dc-num-display">{formatMoney(p.val)}</span>
            </div>
          ))}
          <div className="dc-tr total">
            <span className="name mono">TOTAL</span>
            <span className="def" />
            <span className="val dc-num-display">{formatMoney(total)}</span>
          </div>
        </div>

        <p className="dc-receipt-closer">Every primitive. Every assumption. Every number.</p>
      </section>

      {/* S3 — HOW THE ESTIMATOR WAS BUILT */}
      <section className="dc-build" id="how">
        <h2 className="dc-build-h">
          We measured coordination tax for two years before we priced anything.
        </h2>
        <div className="dc-build-body">
          <p>
            The estimator does not guess. It uses sixty-one external signals and eleven internal primitives. The primitives were defined before Unifize was a product. They were defined because we had been practitioners in regulated processes, and we had paid the tax ourselves.
          </p>
          <p>
            The engine is the same model we will use to price your engagement. What you get charged is a function of what you measurably reduce. The baseline is the number you just saw.
          </p>
          <p>
            If the number is wrong, we want to know. It is a model. It will converge on reality as your lane runs.
          </p>
        </div>
      </section>

      {/* S4 — ROOT CAUSE, BRIEFLY */}
      <section className="dc-twocol" id="world">
        <div className="dc-kicker mono">The root cause, briefly.</div>
        <h2 className="dc-h2">Where the record lives. Where the work lives.</h2>

        <div className="dc-twocol-grid">
          <div className="dc-twocol-col">
            <div className="head">Systems of record</div>
            <h4>Authoritative.</h4>
            <ul>
              <li>QMS</li>
              <li>ERP</li>
              <li>PLM</li>
              <li>DMS</li>
              <li>MES</li>
              <li>LIMS</li>
              <li>CMMS</li>
            </ul>
          </div>
          <div className="dc-twocol-rule">
            <span className="dc-twocol-rule-label">The Tax</span>
          </div>
          <div className="dc-twocol-col">
            <div className="head">Systems of coordination</div>
            <h4>Where work happens.</h4>
            <ul>
              <li>Email</li>
              <li>Meetings</li>
              <li>Teams</li>
              <li>Spreadsheets</li>
              <li>SharePoint</li>
              <li>Phone</li>
              <li>Memory</li>
            </ul>
          </div>
        </div>
        <p className="dc-receipt-closer" style={{ marginTop: 28 }}>
          The gap is where every primitive in the receipt above accumulates.
        </p>
      </section>

      {/* S5 — WHAT UNIFIZE DOES */}
      <section className="dc-para" id="proof">
        <div className="dc-kicker mono">What Unifize does.</div>
        <h2 className="dc-h2">Unifize is the layer that captures what happens in the gap.</h2>
        <p>
          One accountable thread per cross-functional event. The record, the decisions, the evidence, the approvals, the ownership, the completion, in one place. Coexists with your systems of record. Connected to your collaboration channels. Reviewable end to end. Auditable on the first request. The receipt you just read is what we reduce.
        </p>
      </section>

      {/* S6 — CLOSE */}
      <section className="dc-close">
        <div className="dc-kicker mono">The close.</div>
        <h2 className="dc-close-h">Forty-five minutes. One thread. One number.</h2>
        <p className="dc-close-p">
          Book a working session with a practitioner. We take one coordination-heavy thread in your process. We price it in your numbers. We leave you with the baseline, whether or not you ever buy.
        </p>
        <div className="dc-close-actions">
          <button className="dc-btn-ink">Book the session</button>
          <button className="dc-btn-link">Send me the full report</button>
        </div>
      </section>

      <footer className="dc-foot">
        <div className="dc-foot-inner">
          <span>© {new Date().getFullYear()} Unifize. Partnered with Microsoft.</span>
          <span className="dc-foot-counter">
            Coordination tax estimated today: <span className="n">$18,442,000</span> across <span className="n">312</span> sessions.
          </span>
        </div>
      </footer>
    </div>
  );
}
