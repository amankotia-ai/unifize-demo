import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// ============================================================================
// /one-document — One CAPA, told as touchpoints (dark mode)
// ----------------------------------------------------------------------------
// Layout
//   LEFT pane  : chart only, sticky, full height. Mid-market bar grows live
//                as toasts emit on the right; Small + Enterprise bars fade in
//                after the live demo completes for context.
//   RIGHT pane : the CAPA document fills field-by-field; a compact toast
//                sidebar on the right edge of the pane stacks each emission.
//
// Two-colour story
//   Internal touchpoints : amber  (warm, between colleagues)
//   External touchpoints : cyan   (cool, with customers and suppliers)
// ============================================================================

const OD_STYLES = `
html:has(.od-root) { scroll-behavior: smooth; }
.od-root [id] { scroll-margin-top: 72px; }
.od-root {
  --od-bg: #0A0B0F;
  --od-bg-soft: #14151B;
  --od-bg-deep: #1B1D26;
  --od-text: #F4F4F8;
  --od-text-muted: rgba(244, 244, 248, 0.66);
  --od-text-faint: rgba(244, 244, 248, 0.42);
  --od-border: rgba(244, 244, 248, 0.10);
  --od-border-strong: rgba(244, 244, 248, 0.20);
  --od-internal: #F59E0B;
  --od-internal-soft: rgba(245, 158, 11, 0.22);
  --od-internal-deep: #B45309;
  --od-external: #22D3EE;
  --od-external-soft: rgba(34, 211, 238, 0.20);
  --od-external-deep: #0891B2;

  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  background: var(--od-bg);
  color: var(--od-text);
  -webkit-font-smoothing: antialiased;
  letter-spacing: -0.011em;
  min-height: 100vh;
  position: relative;
}
.od-root * { box-sizing: border-box; }
.od-root .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
.od-root a { color: inherit; text-decoration: none; }

/* ── Nav ──────────────────────────────────────────────── */
.od-nav {
  position: sticky; top: 0; z-index: 50;
  backdrop-filter: saturate(160%) blur(18px);
  background: rgba(10, 11, 15, 0.78);
  border-bottom: 1px solid var(--od-border);
}
.od-nav-inner {
  max-width: 1320px; margin: 0 auto;
  padding: 10px 24px;
  display: flex; align-items: center; gap: 40px;
}
.od-nav-logo { display: inline-flex; align-items: center; }
.od-nav-logo-img {
  height: 22px; width: auto; display: block;
  filter: brightness(0) invert(1);
}
.od-nav-items { display: flex; gap: 26px; font-size: 13.5px; color: var(--od-text-muted); }
.od-nav-items a:hover { color: var(--od-text); }
.od-nav-actions { margin-left: auto; display: flex; gap: 18px; align-items: center; }
.od-nav-link { font-size: 13.5px; color: var(--od-text-muted); }
.od-nav-link:hover { color: var(--od-text); }
.od-nav-btn {
  font-size: 13px; font-weight: 500;
  background: var(--od-text); color: var(--od-bg);
  padding: 7px 14px; border-radius: 999px;
  border: 1px solid var(--od-text);
  cursor: pointer;
}
@media (max-width: 860px) { .od-nav-items { display: none; } }

/* ── Stage layout: full height, two columns ───────────── */
.od-stage {
  display: grid;
  grid-template-columns: 38% 62%;
  width: 100%;
  height: calc(100vh - 56px);
  min-height: 720px;
  background:
    radial-gradient(ellipse at 30% 0%, #16161E 0%, var(--od-bg) 60%, #060609 100%);
}
.od-left {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 36px 28px;
  border-right: 1px solid var(--od-border);
  background: linear-gradient(180deg, rgba(10,11,15,0.60) 0%, rgba(10,11,15,0.00) 100%);
}
.od-right {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 24px;
  padding: 36px 28px;
  overflow: hidden;
  min-height: 0;
}
.od-doc-area {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
  overflow-x: hidden;
}
.od-toast-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding-bottom: 36px;
}

@media (max-width: 1180px) {
  .od-stage { grid-template-columns: 42% 58%; }
}
@media (max-width: 980px) {
  .od-stage { grid-template-columns: 1fr; height: auto; min-height: auto; }
  .od-left, .od-right { padding: 24px; height: auto; min-height: 600px; }
  .od-right { grid-template-columns: minmax(0, 1fr) 220px; }
}

/* ── Replay button ─────────────────────────────────────── */
.od-replay {
  position: absolute;
  top: 18px;
  right: 22px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid var(--od-border-strong);
  border-radius: 999px;
  padding: 7px 13px;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--od-text-muted);
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  z-index: 5;
}
.od-replay:hover {
  background: var(--od-text);
  color: var(--od-bg);
  border-color: var(--od-text);
}

/* ── Chart panel ───────────────────────────────────────── */
.od-chart-panel {
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.od-chart-eyebrow {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--od-text-faint);
}
.od-chart-h {
  font-size: clamp(22px, 2.4vw, 30px);
  font-weight: 600;
  line-height: 1.10;
  letter-spacing: -0.018em;
  color: var(--od-text);
  margin: 0;
}
.od-chart-h-fade { color: var(--od-text-muted); }
.od-chart-sub {
  margin: 0;
  font-size: 13px;
  line-height: 1.55;
  color: var(--od-text-muted);
}
.od-legend {
  display: flex;
  gap: 22px;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--od-text-muted);
}
.od-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.od-legend-swatch {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}
.od-legend-swatch.internal { background: var(--od-internal); }
.od-legend-swatch.external { background: var(--od-external); }
.od-chart-svg-wrap {
  margin-top: 4px;
  background: var(--od-bg-soft);
  border: 1px solid var(--od-border);
  border-radius: 12px;
  padding: 22px 18px 16px;
  position: relative;
}

/* ── Document ──────────────────────────────────────────── */
.od-doc {
  width: 100%;
  max-width: 580px;
  background: var(--od-bg-soft);
  border: 1px solid var(--od-border);
  border-radius: 10px;
  padding: 30px 36px 36px;
  position: relative;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.03) inset,
    0 16px 36px rgba(0, 0, 0, 0.35),
    0 4px 12px rgba(0, 0, 0, 0.18);
}
.od-doc::before {
  content: "";
  position: absolute;
  inset: 1px;
  border-radius: 9px;
  pointer-events: none;
  background:
    repeating-linear-gradient(0deg,
      transparent 0 31px,
      rgba(255, 255, 255, 0.025) 31px 32px);
}
.od-doc-eyebrow {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10px;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  color: var(--od-text-faint);
}
.od-doc-title {
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin-top: 6px;
  margin-bottom: 8px;
}
.od-doc-id {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 24px;
  font-weight: 600;
  color: var(--od-text);
  letter-spacing: -0.01em;
}
.od-doc-tag {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--od-internal);
  border: 1px solid var(--od-internal);
  padding: 3px 8px;
  border-radius: 3px;
}
.od-doc-meta {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--od-text-muted);
  margin-bottom: 20px;
}
.od-doc-meta b {
  color: var(--od-text);
  font-weight: 600;
}
.od-doc-divider {
  height: 1px;
  background: var(--od-border);
  margin: 0 0 22px;
}
.od-section {
  margin-bottom: 16px;
  position: relative;
}
.od-section-h {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--od-text-muted);
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.od-section-status {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(255,255,255,0.20);
  transition: background 0.4s ease;
}
.od-section-status.filling {
  background: var(--od-internal);
  animation: odPulse 1s ease-in-out infinite;
}
.od-section-status.filled  {
  background: var(--od-external);
}
@keyframes odPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
}
.od-field {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--od-border-strong);
  border-radius: 4px;
  padding: 12px 14px;
  min-height: 56px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--od-text);
  position: relative;
  transition: background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
}
.od-field.placeholder {
  color: var(--od-text-faint);
  font-style: italic;
}
.od-field.filling {
  background: rgba(245, 158, 11, 0.07);
  border-color: var(--od-internal);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.10);
}
.od-field.filled {
  background: rgba(34, 211, 238, 0.05);
  border-color: var(--od-external);
}
.od-field-content {
  white-space: pre-wrap;
}
.od-field-cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background: var(--od-internal);
  vertical-align: text-bottom;
  margin-left: 1px;
  animation: odCursor 0.9s steps(1) infinite;
}
@keyframes odCursor {
  0%, 50% { opacity: 1; }
  50.01%, 100% { opacity: 0; }
}
.od-doc-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--od-border);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10.5px;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--od-text-faint);
}
.od-doc-foot-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: var(--od-text-muted);
  transition: color 0.4s ease;
}
.od-doc-foot-status.closed {
  color: var(--od-external);
}
.od-doc-foot-status .dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: currentColor;
}

/* ── Toasts (sidebar within right pane) ────────────────── */
.od-toast-header {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--od-text-faint);
  padding: 6px 4px 8px;
  border-bottom: 1px solid var(--od-border);
}
.od-toast-empty {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10.5px;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--od-text-faint);
  padding: 14px 4px;
  text-align: left;
  font-style: italic;
}
.od-toast {
  background: var(--od-bg-soft);
  border: 1px solid var(--od-border-strong);
  border-radius: 10px;
  padding: 12px 12px;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateX(8px) scale(0.98);
  animation: odToastIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.od-toast::before {
  content: "";
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: var(--od-internal);
}
@keyframes odToastIn {
  from { opacity: 0; transform: translateX(12px) scale(0.96); }
  to   { opacity: 1; transform: translateX(0) scale(1); }
}
.od-toast-row1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 9.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--od-text-faint);
}
.od-toast-chip {
  padding: 2px 7px;
  background: rgba(245, 158, 11, 0.14);
  border: 1px solid rgba(245, 158, 11, 0.45);
  border-radius: 999px;
  color: var(--od-internal);
  font-weight: 600;
}
.od-toast-title {
  font-size: 14.5px;
  font-weight: 600;
  letter-spacing: -0.012em;
  color: var(--od-text);
  line-height: 1.25;
}
.od-toast-counts {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 1px;
}
.od-count-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--od-text-muted);
}
.od-count-label {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10px;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  width: 56px;
  color: var(--od-text-faint);
}
.od-dots {
  display: inline-flex;
  gap: 3px;
}
.od-dot {
  width: 9px;
  height: 9px;
  border-radius: 2px;
  display: inline-block;
}
.od-dot.internal { background: var(--od-internal); }
.od-dot.external { background: var(--od-external); }
.od-count-num {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-weight: 700;
  font-size: 12px;
  color: var(--od-text);
  margin-left: auto;
}
.od-toast-running {
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px dashed var(--od-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 9.5px;
  color: var(--od-text-faint);
  letter-spacing: 0.10em;
  text-transform: uppercase;
}
.od-running-num {
  font-size: 15px;
  font-weight: 700;
  color: var(--od-internal);
  letter-spacing: -0.01em;
  text-transform: none;
}
`;

// ── CAPA fields ─────────────────────────────────────────
interface FieldSpec {
  id: string;
  label: string;
  placeholder: string;
  content: string;
  internal: number;
  external: number;
}

const FIELDS: FieldSpec[] = [
  {
    id: "issue",
    label: "Issue Description",
    placeholder: "Describe the deviation in plain language",
    content:
      "Bearing failure on Lot A-2024-FN-138 detected at Station 4 inspection. Vibration on three units exceeds release spec.",
    internal: 1,
    external: 1,
  },
  {
    id: "root",
    label: "Root Cause",
    placeholder: "Investigation findings and source of failure",
    content:
      "Heat-treatment cycle drift at Apex (supplier). SCAR opened. Confirmed against incoming COA on lots from week 36.",
    internal: 1,
    external: 2,
  },
  {
    id: "corrective",
    label: "Corrective Action",
    placeholder: "Steps to contain and resolve",
    content:
      "Quarantine remaining stock. Re-source from secondary supplier (Nova) for the next two production runs.",
    internal: 1,
    external: 1,
  },
  {
    id: "verification",
    label: "Verification",
    placeholder: "Evidence the corrective action worked",
    content:
      "Re-inspection of replacement lots passed. Vibration trace within spec across all sampled units. Photos attached.",
    internal: 1,
    external: 1,
  },
  {
    id: "approval",
    label: "Approval",
    placeholder: "Sign-off across the responsible roles",
    content: "K. Lee, QA · 09/19/2024 · supplier acknowledgment received",
    internal: 1,
    external: 1,
  },
];

// ── Animation timing (ms) ───────────────────────────────
const FIELD_INITIAL_DELAY = 700;
const FIELD_FILL_DURATION = 1500;
const FIELD_PAUSE_BETWEEN = 700;
const OTHER_BARS_DELAY_AFTER_LAST = 1000;

function fieldStartTime(index: number): number {
  return FIELD_INITIAL_DELAY + index * (FIELD_FILL_DURATION + FIELD_PAUSE_BETWEEN);
}
function fieldEndTime(index: number): number {
  return fieldStartTime(index) + FIELD_FILL_DURATION;
}
function otherBarsStartTime(): number {
  return fieldEndTime(FIELDS.length - 1) + OTHER_BARS_DELAY_AFTER_LAST;
}

// ── Chart data ──────────────────────────────────────────
interface BarSpec {
  label: string;
  sublabel: string;
  internal: number;
  external: number;
}
const CHART_BARS: BarSpec[] = [
  { label: "Small",      sublabel: "51–250 employees",      internal: 4, external: 4 },
  { label: "Mid-market", sublabel: "251–3,000 employees",   internal: 5, external: 6 },
  { label: "Enterprise", sublabel: "3,001–5,000 employees", internal: 5, external: 5 },
];
const MID_INDEX = 1;

// ============================================================================
// Component
// ============================================================================

interface FieldStatus {
  status: "placeholder" | "filling" | "filled";
  visibleChars: number;
}

interface ToastInstance {
  fieldIndex: number;
  cumulativeInternal: number;
  cumulativeExternal: number;
}

export default function OneDocument() {
  const [fieldStates, setFieldStates] = useState<FieldStatus[]>(
    FIELDS.map(() => ({ status: "placeholder", visibleChars: 0 })),
  );
  const [toasts, setToasts] = useState<ToastInstance[]>([]);
  const [docClosed, setDocClosed] = useState(false);
  const [showOtherBars, setShowOtherBars] = useState(false);
  const [runId, setRunId] = useState(0);

  // Live cumulative running totals (drives the live mid-market bar growth)
  const [liveInternal, setLiveInternal] = useState(0);
  const [liveExternal, setLiveExternal] = useState(0);

  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const lastSeenIndexRef = useRef<number>(-1);

  const replay = useCallback(() => {
    setRunId((n) => n + 1);
  }, []);

  useEffect(() => {
    setFieldStates(FIELDS.map(() => ({ status: "placeholder", visibleChars: 0 })));
    setToasts([]);
    setDocClosed(false);
    setShowOtherBars(false);
    setLiveInternal(0);
    setLiveExternal(0);
    lastSeenIndexRef.current = -1;
    startRef.current = performance.now();

    const tick = () => {
      const now = performance.now();
      const t = now - startRef.current;

      // Per-field state
      const next = FIELDS.map((spec, i) => {
        const start = fieldStartTime(i);
        const end = fieldEndTime(i);
        if (t < start) {
          return { status: "placeholder" as const, visibleChars: 0 };
        }
        if (t >= end) {
          return { status: "filled" as const, visibleChars: spec.content.length };
        }
        const p = (t - start) / (end - start);
        const eased = 1 - Math.pow(1 - p, 2);
        const chars = Math.max(1, Math.floor(spec.content.length * eased));
        return { status: "filling" as const, visibleChars: chars };
      });
      setFieldStates(next);

      // Toasts emit at fieldEndTime(i)
      let highestFinished = -1;
      for (let i = 0; i < FIELDS.length; i++) {
        if (t >= fieldEndTime(i)) highestFinished = i;
      }
      if (highestFinished > lastSeenIndexRef.current) {
        const newlyFinished: number[] = [];
        for (let i = lastSeenIndexRef.current + 1; i <= highestFinished; i++) {
          newlyFinished.push(i);
        }
        if (newlyFinished.length > 0) {
          setToasts((prev) => {
            let runI = prev.reduce((s, x) => s + FIELDS[x.fieldIndex].internal, 0);
            let runE = prev.reduce((s, x) => s + FIELDS[x.fieldIndex].external, 0);
            const additions: ToastInstance[] = [];
            for (const idx of newlyFinished) {
              runI += FIELDS[idx].internal;
              runE += FIELDS[idx].external;
              additions.push({
                fieldIndex: idx,
                cumulativeInternal: runI,
                cumulativeExternal: runE,
              });
            }
            // Live cumulative drives the mid-market bar
            setLiveInternal(runI);
            setLiveExternal(runE);
            return [...additions.reverse(), ...prev];
          });
          lastSeenIndexRef.current = highestFinished;
        }
      }

      if (t >= fieldEndTime(FIELDS.length - 1)) {
        setDocClosed(true);
      }

      if (t >= otherBarsStartTime()) {
        setShowOtherBars(true);
        rafRef.current = null;
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [runId]);

  return (
    <div className="od-root">
      <style>{OD_STYLES}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <nav className="od-nav">
        <div className="od-nav-inner">
          <Link to="/linear-flow" className="od-nav-logo" aria-label="Unifize">
            <img src="/Link - home.svg" alt="Unifize" className="od-nav-logo-img" />
          </Link>
          <div className="od-nav-items">
            <a href="#problem">The Problem</a>
            <a href="#world">Your World</a>
            <a href="#industry">By Industry</a>
            <a href="#how">How It Works</a>
            <a href="#proof">Proof</a>
          </div>
          <div className="od-nav-actions">
            <a href="#login" className="od-nav-link">Log in</a>
            <button className="od-nav-btn">Book a demo</button>
          </div>
        </div>
      </nav>

      <div className="od-stage">
        {/* LEFT — chart only */}
        <div className="od-left">
          <ChartPanel
            liveInternal={liveInternal}
            liveExternal={liveExternal}
            showOtherBars={showOtherBars}
          />
          <button className="od-replay" onClick={replay} aria-label="Replay">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 15.46-6.36L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
            Replay
          </button>
        </div>

        {/* RIGHT — document + toast sidebar */}
        <div className="od-right">
          <div className="od-doc-area">
            <DocumentCard fieldStates={fieldStates} closed={docClosed} />
          </div>
          <div className="od-toast-area" aria-live="polite">
            <div className="od-toast-header">Touchpoint Log</div>
            {toasts.length === 0 ? (
              <div className="od-toast-empty">Awaiting first field…</div>
            ) : (
              toasts.map((toast) => (
                <ToastCard key={`${runId}-${toast.fieldIndex}`} toast={toast} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────

function ChartPanel({
  liveInternal,
  liveExternal,
  showOtherBars,
}: {
  liveInternal: number;
  liveExternal: number;
  showOtherBars: boolean;
}) {
  const max = Math.max(...CHART_BARS.map((b) => b.internal + b.external));

  // Live mid-market values clamped to its target
  const midSpec = CHART_BARS[MID_INDEX];
  const midI = Math.min(liveInternal, midSpec.internal);
  const midE = Math.min(liveExternal, midSpec.external);

  // SVG dimensions
  const barW = 56;
  const barGap = 56;
  const chartH = 220;
  const numberGap = 28;
  const labelGap = 30;
  const padX = 32;
  const totalW = CHART_BARS.length * barW + (CHART_BARS.length - 1) * barGap;
  const svgW = totalW + padX * 2;
  const svgH = chartH + numberGap + labelGap + 50;

  const barXs = CHART_BARS.map((_, i) => padX + i * (barW + barGap));
  const baselineY = numberGap + chartH;

  return (
    <div className="od-chart-panel">
      <div>
        <div className="od-chart-eyebrow">Coordination tax · live counter</div>
        <h2 className="od-chart-h">
          Five fields, eleven touchpoints.
          <br />
          <span className="od-chart-h-fade">And this is just the middle.</span>
        </h2>
      </div>

      <p className="od-chart-sub">
        Each field on the CAPA on the right takes internal touchpoints (between colleagues)
        and external touchpoints (with customers and suppliers). Watch the mid-market bar
        grow in real time as the document fills.
      </p>

      <div className="od-legend">
        <span className="od-legend-item">
          <span className="od-legend-swatch internal" />
          Internal touchpoints
        </span>
        <span className="od-legend-item">
          <span className="od-legend-swatch external" />
          External touchpoints
        </span>
      </div>

      <div className="od-chart-svg-wrap">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" height="auto">
          {/* Faint grid lines (3 horizontals) */}
          {[0.33, 0.66, 1.0].map((p, idx) => {
            const y = numberGap + chartH - p * chartH;
            return (
              <line
                key={`grid-${idx}`}
                x1={padX - 8}
                x2={svgW - padX + 8}
                y1={y}
                y2={y}
                stroke="rgba(244,244,248,0.06)"
                strokeWidth="1"
                strokeDasharray="2 4"
              />
            );
          })}

          {CHART_BARS.map((bar, i) => {
            const isMid = i === MID_INDEX;
            // For non-mid bars, only render after showOtherBars; for mid, always render (live)
            const targetI = isMid ? midI : bar.internal;
            const targetE = isMid ? midE : bar.external;
            const visible = isMid || showOtherBars;
            const total = targetI + targetE;
            const internalH = (targetI / max) * chartH;
            const externalH = (targetE / max) * chartH;
            const x = barXs[i];

            return (
              <g key={bar.label} style={{
                opacity: visible ? 1 : 0.0,
                transition: "opacity 0.4s ease",
              }}>
                {/* Bar slot outline (dashed) — visible from the start so the
                    eye knows where the bar will land */}
                <rect
                  x={x}
                  y={numberGap}
                  width={barW}
                  height={chartH}
                  fill="rgba(244,244,248,0.02)"
                  stroke="rgba(244,244,248,0.10)"
                  strokeWidth="1"
                  strokeDasharray="3 4"
                  rx="3"
                  style={{ opacity: visible || isMid ? 1 : 0 }}
                />

                {/* External (top, cyan) */}
                <rect
                  x={x}
                  y={numberGap + (chartH - internalH - externalH)}
                  width={barW}
                  height={externalH}
                  fill="var(--od-external)"
                  rx="2"
                  style={{
                    transition: isMid
                      ? "y 0.55s cubic-bezier(0.22, 1, 0.36, 1), height 0.55s cubic-bezier(0.22, 1, 0.36, 1)"
                      : "none",
                  }}
                />
                {/* Internal (bottom, amber) */}
                <rect
                  x={x}
                  y={numberGap + (chartH - internalH)}
                  width={barW}
                  height={internalH}
                  fill="var(--od-internal)"
                  rx="2"
                  style={{
                    transition: isMid
                      ? "y 0.55s cubic-bezier(0.22, 1, 0.36, 1), height 0.55s cubic-bezier(0.22, 1, 0.36, 1)"
                      : "none",
                  }}
                />

                {/* Total above bar */}
                {(isMid || showOtherBars) && total > 0 && (
                  <text
                    x={x + barW / 2}
                    y={numberGap + (chartH - internalH - externalH) - 8}
                    fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
                    fontWeight="700"
                    fontSize="20"
                    fill="var(--od-text)"
                    textAnchor="middle"
                    style={{
                      transition: "all 0.4s ease",
                    }}
                  >
                    {total}
                  </text>
                )}

                {/* Inside-bar count labels (only for non-mid bars; mid grows live) */}
                {showOtherBars && !isMid && (
                  <>
                    <text
                      x={x + barW / 2}
                      y={numberGap + (chartH - internalH - externalH) + externalH / 2 + 4}
                      fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
                      fontWeight="700"
                      fontSize="10.5"
                      fill="#0A0B0F"
                      textAnchor="middle"
                    >
                      {bar.external} ext
                    </text>
                    <text
                      x={x + barW / 2}
                      y={numberGap + (chartH - internalH) + internalH / 2 + 4}
                      fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
                      fontWeight="700"
                      fontSize="10.5"
                      fill="#0A0B0F"
                      textAnchor="middle"
                    >
                      {bar.internal} int
                    </text>
                  </>
                )}

                {/* Mid-market bar shows live count labels on top of each segment */}
                {isMid && targetI > 0 && (
                  <text
                    x={x + barW / 2}
                    y={numberGap + (chartH - internalH) + internalH / 2 + 4}
                    fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
                    fontWeight="700"
                    fontSize="10.5"
                    fill="#0A0B0F"
                    textAnchor="middle"
                  >
                    {targetI} int
                  </text>
                )}
                {isMid && targetE > 0 && (
                  <text
                    x={x + barW / 2}
                    y={numberGap + (chartH - internalH - externalH) + externalH / 2 + 4}
                    fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
                    fontWeight="700"
                    fontSize="10.5"
                    fill="#0A0B0F"
                    textAnchor="middle"
                  >
                    {targetE} ext
                  </text>
                )}

                {/* Column label */}
                <text
                  x={x + barW / 2}
                  y={baselineY + 22}
                  fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
                  fontWeight="600"
                  fontSize="12.5"
                  fill="var(--od-text)"
                  textAnchor="middle"
                  style={{ opacity: isMid ? 1 : (visible ? 1 : 0.3) }}
                >
                  {bar.label}
                </text>
                <text
                  x={x + barW / 2}
                  y={baselineY + 38}
                  fontFamily="JetBrains Mono, ui-monospace, monospace"
                  fontWeight="500"
                  fontSize="9.5"
                  fill="var(--od-text-faint)"
                  letterSpacing="0.04em"
                  textAnchor="middle"
                >
                  {bar.sublabel}
                </text>
              </g>
            );
          })}

          {/* Baseline */}
          <line
            x1={padX - 10}
            x2={svgW - padX + 10}
            y1={baselineY + 1}
            y2={baselineY + 1}
            stroke="rgba(244,244,248,0.30)"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  );
}

function ToastCard({ toast }: { toast: ToastInstance }) {
  const spec = FIELDS[toast.fieldIndex];
  const total = spec.internal + spec.external;
  return (
    <div className="od-toast">
      <div className="od-toast-row1">
        <span className="od-toast-chip">FIELD {toast.fieldIndex + 1} / {FIELDS.length}</span>
        <span>{total} touchpoint{total === 1 ? "" : "s"}</span>
      </div>

      <div className="od-toast-title">{spec.label}</div>

      <div className="od-toast-counts">
        <div className="od-count-row">
          <span className="od-count-label">Internal</span>
          <span className="od-dots">
            {Array.from({ length: spec.internal }, (_, i) => (
              <span key={`i-${i}`} className="od-dot internal" />
            ))}
          </span>
          <span className="od-count-num">{spec.internal}</span>
        </div>
        <div className="od-count-row">
          <span className="od-count-label">External</span>
          <span className="od-dots">
            {Array.from({ length: spec.external }, (_, i) => (
              <span key={`e-${i}`} className="od-dot external" />
            ))}
          </span>
          <span className="od-count-num">{spec.external}</span>
        </div>
      </div>

      <div className="od-toast-running">
        <span>Running total</span>
        <span className="od-running-num">
          {toast.cumulativeInternal + toast.cumulativeExternal}
        </span>
      </div>
    </div>
  );
}

function DocumentCard({
  fieldStates,
  closed,
}: {
  fieldStates: FieldStatus[];
  closed: boolean;
}) {
  return (
    <div className="od-doc">
      <div className="od-doc-eyebrow">Corrective &amp; Preventive Action</div>
      <div className="od-doc-title">
        <div className="od-doc-id">CAPA-2024-0847</div>
        <div className="od-doc-tag">Deviation</div>
      </div>
      <div className="od-doc-meta">
        <span><b>Initiated</b> · 09/15/2024</span>
        <span><b>Owner</b> · J. Cho, Engineering</span>
        <span><b>Affected lot</b> · A-2024-FN-138</span>
      </div>
      <div className="od-doc-divider" />

      {FIELDS.map((spec, i) => {
        const state = fieldStates[i];
        const visibleText = spec.content.slice(0, state.visibleChars);
        return (
          <div className="od-section" key={spec.id}>
            <div className="od-section-h">
              <span
                className={`od-section-status ${
                  state.status === "filling" ? "filling" :
                  state.status === "filled" ? "filled" : ""
                }`}
              />
              {spec.label}
            </div>
            <div className={`od-field ${state.status}`}>
              {state.status === "placeholder" ? (
                <span style={{ color: "var(--od-text-faint)", fontStyle: "italic" }}>
                  {spec.placeholder}
                </span>
              ) : (
                <span className="od-field-content">
                  {visibleText}
                  {state.status === "filling" && <span className="od-field-cursor" />}
                </span>
              )}
            </div>
          </div>
        );
      })}

      <div className="od-doc-foot">
        <span>Page 1 of 1 · QMS-controlled</span>
        <span className={`od-doc-foot-status ${closed ? "closed" : ""}`}>
          <span className="dot" />
          {closed ? "Closed" : "Open"}
        </span>
      </div>
    </div>
  );
}
