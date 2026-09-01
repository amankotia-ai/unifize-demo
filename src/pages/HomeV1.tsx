import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PAIN_POINTS = [
  "CAPA still open from last quarter.",
  "Change order stuck on four inboxes.",
  "Wrong revision on the shop floor.",
  "Audit week spent rebuilding context.",
  "Deviation lifted from a Teams thread.",
  "Supplier response in someone's sent folder.",
  "Training record nobody can prove.",
  "Complaint that found its owner three handoffs late.",
  "MRB decision nobody minuted.",
  "Label approval buried in email.",
  "Batch released before sign-offs landed.",
  "Recall scope built from memory.",
  "Investigation that timed out before evidence landed.",
  "Non-conformance nobody closed.",
  "Audit finding about a gap nobody named.",
];

const STYLES = `
.v1-root {
  --v1-bg: #08090A;
  --v1-bg-card: #101116;
  --v1-border: rgba(255,255,255,0.08);
  --v1-border-strong: rgba(255,255,255,0.14);
  --v1-text: #FFFFFF;
  --v1-text-muted: rgba(255,255,255,0.56);
  --v1-text-faint: rgba(255,255,255,0.38);
  --v1-accent: #0052FF;

  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  background: var(--v1-bg);
  color: var(--v1-text);
  -webkit-font-smoothing: antialiased;
  letter-spacing: -0.011em;
  min-height: 100vh;
}
.v1-root * { box-sizing: border-box; }
.v1-root .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
.v1-root a { color: inherit; text-decoration: none; }

.v1-nav {
  position: sticky; top: 0; z-index: 50;
  backdrop-filter: saturate(160%) blur(18px);
  background: rgba(8,9,10,0.72);
  border-bottom: 1px solid var(--v1-border);
}
.v1-nav-inner {
  max-width: 1240px; margin: 0 auto;
  padding: 12px 28px;
  display: flex; align-items: center; gap: 40px;
}
.v1-nav-logo-img { height: 22px; width: auto; filter: brightness(0) invert(1); }
.v1-nav-items {
  display: flex; gap: 26px;
  font-size: 13.5px; color: var(--v1-text-muted);
}
.v1-nav-items a:hover { color: var(--v1-text); }
.v1-nav-actions { margin-left: auto; display: flex; gap: 18px; align-items: center; }
.v1-nav-link { font-size: 13.5px; color: var(--v1-text-muted); }
.v1-nav-link:hover { color: var(--v1-text); }
.v1-nav-btn {
  font-size: 13px; font-weight: 500;
  background: white; color: #0B0D11;
  padding: 7px 14px; border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.9);
  cursor: pointer;
}
@media (max-width: 860px) { .v1-nav-items { display: none; } }

.v1-hero {
  max-width: 1240px; margin: 0 auto;
  padding: 72px 28px 56px;
}
.v1-hero-h1 {
  font-size: clamp(38px, 6.4vw, 78px);
  font-weight: 500;
  line-height: 0.98;
  letter-spacing: -0.042em;
  max-width: 22ch;
  margin: 0;
}
.v1-hero-subtitle {
  margin: 28px 0 0;
  font-size: 17px;
  color: var(--v1-text-muted);
  max-width: 80ch;
  line-height: 1.5;
  letter-spacing: -0.006em;
}
.v1-hero-cta {
  margin-top: 40px;
  display: flex; gap: 12px; align-items: center; flex-wrap: wrap;
}
.v1-btn-primary {
  font-family: inherit; font-size: 14px; font-weight: 500;
  background: white; color: #0B0D11;
  padding: 10px 18px; border-radius: 999px;
  border: none; cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px;
}
.v1-btn-primary:hover { background: #EBECEE; }
.v1-btn-ghost {
  font-family: inherit; font-size: 14px; font-weight: 500;
  background: transparent; color: var(--v1-text);
  padding: 10px 16px; border-radius: 999px;
  border: 1px solid var(--v1-border-strong);
  cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px;
}
.v1-btn-ghost:hover { background: rgba(255,255,255,0.04); }

.v1-hero-sidenote {
  margin-left: auto;
  display: inline-flex; align-items: center; gap: 10px;
  font-size: 13px;
}
.v1-hero-sidenote .dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #0052FF; box-shadow: 0 0 0 3px rgba(0,82,255,0.18);
}
.v1-pain-label {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--v1-text-faint);
}
.v1-pain-slot {
  position: relative;
  display: inline-flex; align-items: center;
  height: 1.4em;
  min-width: 30ch;
  overflow: hidden;
}
.v1-pain-text {
  display: inline-block;
  color: var(--v1-text); font-weight: 500;
  white-space: nowrap;
  animation: v1-pain-in 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes v1-pain-in {
  0%   { opacity: 0; transform: translateY(90%); filter: blur(6px); }
  100% { opacity: 1; transform: translateY(0); filter: blur(0); }
}
@media (max-width: 760px) {
  .v1-hero-sidenote { margin-left: 0; margin-top: 4px; width: 100%; }
  .v1-pain-slot { min-width: 0; flex: 1; }
}

.v1-preview {
  max-width: 1340px; margin: 0 auto;
  padding: 0 28px 90px;
  position: relative; isolation: isolate;
}
.v1-preview-caption {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.14em;
  color: var(--v1-text-faint); text-transform: uppercase;
  margin-bottom: 14px;
}
.v1-preview-frame {
  position: relative; border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--v1-border-strong);
  background: var(--v1-bg-card);
  box-shadow: 0 50px 120px -30px rgba(0,82,255,0.25), 0 30px 80px -20px rgba(0,0,0,0.8);
  aspect-ratio: 16 / 9.6;
}
.v1-preview-glow {
  position: absolute; left: 50%; top: -380px;
  transform: translateX(-50%);
  width: 1200px; max-width: 100%; height: 700px;
  background:
    radial-gradient(60% 55% at 50% 75%, rgba(0,82,255,0.55) 0%, rgba(0,82,255,0.22) 40%, rgba(0,82,255,0) 78%);
  filter: blur(32px); pointer-events: none; z-index: 0;
}
.v1-preview-frame iframe { width: 100%; height: 100%; border: 0; display: block; }

.v1-logos-wrap {
  border-top: 1px solid var(--v1-border);
  border-bottom: 1px solid var(--v1-border);
  background: rgba(255,255,255,0.015);
}
.v1-logos-eyebrow {
  max-width: 1240px; margin: 0 auto;
  padding: 32px 28px 0;
  font-size: 11px; letter-spacing: 0.14em;
  color: var(--v1-text-faint); text-transform: uppercase;
}
.v1-logos {
  max-width: 1240px; margin: 0 auto;
  padding: 20px 28px 40px;
  display: flex; gap: 48px; justify-content: space-between; align-items: center;
  flex-wrap: wrap; opacity: 0.82;
}
.v1-logos-item img { height: 24px; filter: brightness(0) invert(1); opacity: 0.85; }

.v1-light {
  background: #FFFFFF; color: #08090A;
  --v1-text: #08090A;
  --v1-text-muted: rgba(8,9,10,0.58);
  --v1-text-faint: rgba(8,9,10,0.42);
  --v1-border: rgba(8,9,10,0.08);
}
.v1-light .v1-btn-primary { background: #08090A; color: #FFFFFF; }
.v1-light .v1-btn-ghost { color: #08090A; border-color: rgba(8,9,10,0.14); }

.v1-secondary {
  max-width: 1240px; margin: 0 auto;
  padding: 120px 28px 40px;
}
.v1-secondary-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.12em;
  color: var(--v1-text-faint); text-transform: uppercase;
  margin-bottom: 32px;
  display: flex; align-items: center; gap: 10px;
}
.v1-secondary-eyebrow .line { flex: 1; height: 1px; background: var(--v1-border); max-width: 200px; }
.v1-secondary-h2 {
  font-size: clamp(30px, 4.6vw, 58px);
  line-height: 1.06;
  letter-spacing: -0.032em;
  font-weight: 500;
  max-width: 26ch;
  margin: 0;
}
.v1-secondary-h2 .dim { color: var(--v1-text-muted); }

.v1-figs {
  max-width: 1240px; margin: 0 auto;
  padding: 60px 28px 100px;
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 64px;
}
@media (max-width: 900px) { .v1-figs { grid-template-columns: 1fr; gap: 48px; } }
.v1-fig { position: relative; display: flex; flex-direction: column; }
.v1-fig-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.14em;
  color: var(--v1-text-faint);
}
.v1-fig-title {
  margin-top: 16px;
  font-size: 14px; font-weight: 500; letter-spacing: -0.01em;
  line-height: 1.45;
}
.v1-fig-title .dim { color: var(--v1-text-muted); }
.v1-fig-art {
  display: flex; align-items: center; justify-content: center;
  aspect-ratio: 1 / 0.7;
  color: #08090A;
}
.v1-fig-art svg { width: 100%; height: 100%; }

.v1-bottom {
  max-width: 1240px; margin: 0 auto;
  padding: 60px 28px 120px;
  text-align: center;
}
.v1-bottom-kicker {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.12em;
  color: var(--v1-text-faint); text-transform: uppercase;
  margin-bottom: 20px;
}
.v1-bottom-h2 {
  font-size: clamp(34px, 5vw, 64px);
  line-height: 1.02; letter-spacing: -0.035em;
  font-weight: 500; margin: 0 auto; max-width: 22ch;
}
.v1-bottom-sub {
  margin: 22px auto 0; max-width: 48ch;
  font-size: 15px; color: var(--v1-text-muted); line-height: 1.5;
}
.v1-bottom-actions {
  margin-top: 32px;
  display: inline-flex; gap: 12px; flex-wrap: wrap; justify-content: center;
}

.v1-foot {
  border-top: 1px solid var(--v1-border);
  padding: 28px;
}
.v1-foot-inner {
  max-width: 1240px; margin: 0 auto;
  display: flex; justify-content: space-between; align-items: center;
  font-size: 12px; color: var(--v1-text-faint);
  flex-wrap: wrap; gap: 16px;
}
`;

const logos = [
  { src: "/logos/John-Deere.png", alt: "John Deere" },
  { src: "/logos/Airbus-Logo.svg", alt: "Airbus" },
  { src: "/logos/TTK-Prestige.png", alt: "TTK Prestige" },
  { src: "/logos/Target-1.png", alt: "Target" },
  { src: "/logos/Applechem.png", alt: "Applechem" },
  { src: "/logos/Red-Sun-Farms.png", alt: "Red Sun Farms" },
  { src: "/logos/Vans.png", alt: "Vans" },
];

type Fig = { title: string; subtitle: string; art: React.ReactNode };

const figs: Fig[] = [
  {
    title: "One thread per record.",
    subtitle: "Investigation, approval, evidence, owner. Same place.",
    art: (
      <svg viewBox="0 0 320 260" fill="none">
        <rect x="38" y="36" width="214" height="90" rx="12" fill="#EEF0F4" stroke="currentColor" strokeOpacity="0.14" />
        <rect x="52" y="60" width="226" height="104" rx="12" fill="#F4F6F9" stroke="currentColor" strokeOpacity="0.18" />
        <g>
          <rect x="68" y="94" width="236" height="138" rx="12" fill="#FFFFFF" stroke="currentColor" strokeOpacity="0.3" />
          <circle cx="88" cy="120" r="11" fill="#0052FF" />
          <rect x="106" y="112" width="64" height="6" rx="3" fill="currentColor" fillOpacity="0.5" />
          <rect x="106" y="124" width="40" height="5" rx="2.5" fill="currentColor" fillOpacity="0.26" />
          <line x1="80" y1="146" x2="292" y2="146" stroke="currentColor" strokeOpacity="0.08" />
          <rect x="80" y="156" width="180" height="5" rx="2.5" fill="currentColor" fillOpacity="0.3" />
          <rect x="80" y="168" width="152" height="5" rx="2.5" fill="currentColor" fillOpacity="0.2" />
          <rect x="80" y="180" width="120" height="5" rx="2.5" fill="currentColor" fillOpacity="0.14" />
          <g>
            <rect x="80" y="198" width="124" height="22" rx="6" fill="#0052FF" fillOpacity="0.14" stroke="#0052FF" strokeOpacity="0.55" />
            <circle cx="92" cy="209" r="3" fill="#0052FF" />
            <rect x="100" y="205" width="60" height="4" rx="2" fill="#0052FF" fillOpacity="0.95" />
            <rect x="100" y="212" width="42" height="3" rx="1.5" fill="#0052FF" fillOpacity="0.65" />
          </g>
        </g>
      </svg>
    ),
  },
  {
    title: "AI reads the thread.",
    subtitle: "It proposes the next step. People approve. Work moves.",
    art: (
      <svg viewBox="0 0 320 260" fill="none">
        <defs>
          <radialGradient id="v1f2-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#0052FF" stopOpacity="0.5" />
            <stop offset="1" stopColor="#0052FF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="160" cy="140" rx="110" ry="70" fill="url(#v1f2-glow)" />
        <ellipse cx="160" cy="140" rx="116" ry="30" stroke="currentColor" strokeOpacity="0.14" strokeDasharray="2 4" />
        <ellipse cx="160" cy="140" rx="88" ry="58" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="2 4" transform="rotate(-18 160 140)" />
        <g transform="translate(160 96)">
          <path d="M0 0 L44 22 L0 44 L-44 22 Z" fill="#0052FF" fillOpacity="0.2" stroke="#4D85FF" strokeOpacity="0.7" />
          <path d="M-44 22 L0 44 L0 92 L-44 70 Z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.28" />
          <path d="M44 22 L0 44 L0 92 L44 70 Z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.22" />
          <circle cx="0" cy="24" r="4" fill="#4D85FF" />
        </g>
        <circle cx="68" cy="152" r="6" fill="#0052FF" />
        <circle cx="254" cy="128" r="5" fill="currentColor" fillOpacity="0.9" />
        <circle cx="214" cy="186" r="4" fill="#4D85FF" fillOpacity="0.9" />
      </svg>
    ),
  },
  {
    title: "Regulated by construction.",
    subtitle: "ISO, FDA, GxP, IATF threaded into the work. Partnered with Microsoft.",
    art: (
      <svg viewBox="0 0 320 260" fill="none">
        <rect x="52" y="42" width="212" height="178" rx="12" fill="#EEF0F4" stroke="currentColor" strokeOpacity="0.18" transform="rotate(-2 160 130)" />
        <g transform="rotate(3 160 140)">
          <rect x="60" y="34" width="200" height="196" rx="12" fill="#FFFFFF" stroke="currentColor" strokeOpacity="0.26" />
          <rect x="74" y="50" width="80" height="7" rx="3.5" fill="currentColor" fillOpacity="0.58" />
          <rect x="74" y="84" width="172" height="4" rx="2" fill="currentColor" fillOpacity="0.1" />
          <rect x="74" y="84" width="116" height="4" rx="2" fill="#0052FF" />
          <g transform="translate(74 114)">
            <circle cx="4" cy="6" r="4" fill="rgb(16,185,129)" />
            <rect x="14" y="3" width="84" height="5" rx="2.5" fill="currentColor" fillOpacity="0.32" />
          </g>
          <g transform="translate(74 132)">
            <rect x="-4" y="0" width="176" height="62" rx="6" fill="#0052FF" fillOpacity="0.09" />
            <circle cx="4" cy="6" r="4" fill="#0052FF" />
            <rect x="14" y="3" width="92" height="5" rx="2.5" fill="currentColor" fillOpacity="0.6" />
          </g>
          <g transform="translate(74 204)">
            <circle cx="4" cy="6" r="4" stroke="currentColor" strokeOpacity="0.26" fill="none" />
            <rect x="14" y="3" width="72" height="5" rx="2.5" fill="currentColor" fillOpacity="0.2" />
          </g>
        </g>
      </svg>
    ),
  },
];

export default function HomeV1() {
  const [painIdx, setPainIdx] = useState(0);

  useEffect(() => {
    document.title = "Unifize. V1 — Refined.";
  }, []);

  useEffect(() => {
    const id = window.setInterval(
      () => setPainIdx((i) => (i + 1) % PAIN_POINTS.length),
      2600
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="v1-root">
      <style>{STYLES}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;550;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <nav className="v1-nav">
        <div className="v1-nav-inner">
          <Link to="/v1" aria-label="Unifize">
            <img src="/Link - home.svg" alt="Unifize" className="v1-nav-logo-img" />
          </Link>
          <div className="v1-nav-items">
            <a href="#problem">The Problem</a>
            <a href="#world">Your World</a>
            <a href="#industry">By Industry</a>
            <a href="#how">How It Works</a>
            <a href="#proof">Proof</a>
          </div>
          <div className="v1-nav-actions">
            <a href="#login" className="v1-nav-link">Log in</a>
            <button className="v1-nav-btn">Book a demo</button>
          </div>
        </div>
      </nav>

      <section className="v1-hero">
        <h1 className="v1-hero-h1">
          Records in the QMS.<br />Work between tools.
        </h1>
        <p className="v1-hero-subtitle">
          The gap has a name. Coordination tax. Unifize is the layer that removes it.
        </p>
        <div className="v1-hero-cta">
          <button className="v1-btn-primary">
            Book a demo
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <Link to="/chat" className="v1-btn-ghost">
            See the platform
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <div className="v1-hero-sidenote" aria-live="polite">
            <span className="dot" />
            <span className="v1-pain-label">You'll recognise it.</span>
            <span className="v1-pain-slot">
              <span key={painIdx} className="v1-pain-text">
                {PAIN_POINTS[painIdx]}
              </span>
            </span>
          </div>
        </div>
      </section>

      <div className="v1-preview">
        <div className="v1-preview-caption mono">One thread. Record, decision, evidence, owner.</div>
        <span className="v1-preview-glow" aria-hidden />
        <div className="v1-preview-frame">
          <iframe src="/chat?embed=1" title="Unifize product preview" loading="lazy" />
        </div>
      </div>

      <div className="v1-logos-wrap">
        <div className="v1-logos-eyebrow mono">Regulated teams run on Unifize.</div>
        <div className="v1-logos">
          {logos.map((l) => (
            <div key={l.alt} className="v1-logos-item">
              <img src={l.src} alt={l.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      <div className="v1-light">
        <section className="v1-secondary">
          <div className="v1-secondary-eyebrow">
            <span>The gap</span>
            <span className="line" />
          </div>
          <h2 className="v1-secondary-h2">
            Records hold the truth. Work moves between tools.{" "}
            <span className="dim">
              Unifize is the layer where the thread, the decision, and the record become one.
            </span>
          </h2>
        </section>

        <section className="v1-figs">
          {figs.map((f) => (
            <div key={f.title} className="v1-fig">
              <div className="v1-fig-art" aria-hidden>{f.art}</div>
              <div className="v1-fig-title">
                {f.title} <span className="dim">{f.subtitle}</span>
              </div>
            </div>
          ))}
        </section>

        <section className="v1-bottom">
          <div className="v1-bottom-kicker">Next step.</div>
          <h2 className="v1-bottom-h2">
            Your coordination tax has a number. See yours.
          </h2>
          <p className="v1-bottom-sub">
            Forty-five minutes. One thread in your process. Priced in your numbers.
          </p>
          <div className="v1-bottom-actions">
            <button className="v1-btn-primary">
              Book a demo
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <Link to="/" className="v1-btn-ghost">Read the thesis</Link>
          </div>
        </section>

        <footer className="v1-foot">
          <div className="v1-foot-inner">
            <span>© {new Date().getFullYear()} Unifize. All rights reserved.</span>
            <span className="mono">Partnered with Microsoft.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
