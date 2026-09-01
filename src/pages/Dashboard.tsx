import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

// Tracks a container element's pixel size. Returns a ref to attach + current
// width/height. Uses ResizeObserver so charts can render at exact pixel
// dimensions instead of stretching via preserveAspectRatio="none".
function useContainerSize<T extends HTMLElement>(fallback = { w: 600, h: 260 }) {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState(fallback);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width && rect.height) {
        setSize({ w: Math.round(rect.width), h: Math.round(rect.height) });
      }
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, size };
}

const DASHBOARD_STYLES = `
.dashboard-root {
  --u-primary: #0052FF;
  --u-primary-hover: #003ECC;
  --u-primary-tint: #F0F4FF;
  --u-primary-border: #D6E0FF;
  --u-font: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --u-mono: 'JetBrains Mono', ui-monospace, monospace;

  --r-1: 2px;
  --r-2: 3px;
  --r-3: 5px;
  --r-4: 8px;

  --d: 1;
  --gap-1: calc(4px * var(--d));
  --gap-2: calc(8px * var(--d));
  --gap-3: calc(12px * var(--d));
  --gap-4: calc(16px * var(--d));
  --gap-5: calc(24px * var(--d));
  --gap-6: calc(32px * var(--d));

  --n-0: #FFFFFF;
  --n-25: #FBFBFC;
  --n-50: #F6F7F8;
  --n-100: #EEF0F2;
  --n-150: #E4E7EB;
  --n-200: #D8DCE1;
  --n-300: #B8BEC7;
  --n-400: #8B93A0;
  --n-500: #646B78;
  --n-600: #454B56;
  --n-700: #2B2F38;
  --n-800: #181B22;
  --n-900: #0B0D11;

  --s-ok: #0B8A5C;
  --s-ok-tint: #E8F5EF;
  --s-warn: #B4731A;
  --s-warn-tint: #FBF2E2;
  --s-err: #C4303A;
  --s-err-tint: #FBEBEC;

  --border: var(--n-150);
  --border-strong: var(--n-200);
  --text: var(--n-800);
  --text-muted: var(--n-500);
  --text-faint: var(--n-400);

  --shadow-sm: 0 1px 2px rgba(11,13,17,0.04), 0 0 0 1px rgba(11,13,17,0.04);
  --shadow-md: 0 4px 12px -2px rgba(11,13,17,0.06), 0 0 0 1px rgba(11,13,17,0.05);
  --shadow-lg: 0 20px 40px -12px rgba(11,13,17,0.10), 0 0 0 1px rgba(11,13,17,0.05);

  font-family: var(--u-font);
  -webkit-font-smoothing: antialiased;
  background: var(--n-25);
  color: var(--text);
  font-size: 14px;
  letter-spacing: -0.005em;
  height: 100vh;
  overflow: hidden;
}
.dashboard-root * { box-sizing: border-box; }
.dashboard-root .mono { font-family: var(--u-mono); }

/* App shell */
.dashboard-root .app { display: grid; grid-template-columns: 56px 1fr; height: 100vh; }

/* LEFT NAV */
.dashboard-root .nav {
  background: var(--n-0);
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column; align-items: center;
  padding: 14px 0 14px;
  gap: 4px;
}
.dashboard-root .nav-logo {
  width: 32px; height: 32px;
  background: var(--u-primary);
  color: white;
  border-radius: var(--r-2);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: -0.03em;
  margin-bottom: 14px;
  text-decoration: none;
}
.dashboard-root .nav-item {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  color: var(--n-400);
  border-radius: var(--r-2);
  cursor: pointer;
  position: relative;
  text-decoration: none;
}
.dashboard-root .nav-item:hover { background: var(--n-50); color: var(--n-700); }
.dashboard-root .nav-item.active {
  background: var(--u-primary-tint);
  color: var(--u-primary);
}
.dashboard-root .nav-item.active::before {
  content: '';
  position: absolute;
  left: -10px; top: 6px; bottom: 6px;
  width: 2px;
  background: var(--u-primary);
  border-radius: 0 1px 1px 0;
}
.dashboard-root .nav-spacer { flex: 1; }
.dashboard-root .nav-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: linear-gradient(180deg, #C4D0E8, #8F9FBF);
}

/* MAIN */
.dashboard-root .shell-main { display: flex; flex-direction: column; overflow: hidden; min-width: 0; }

/* Topbar */
.dashboard-root .topbar {
  display: flex; align-items: center; gap: 14px;
  padding: 12px 24px;
  border-bottom: 1px solid var(--border);
  background: var(--n-0);
}
.dashboard-root .breadcrumb {
  font-family: var(--u-mono);
  font-size: 11px;
  color: var(--text-faint);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  display: flex; align-items: center; gap: 8px;
}
.dashboard-root .breadcrumb .sep { color: var(--n-200); }
.dashboard-root .breadcrumb .current { color: var(--text); }
.dashboard-root .topbar .spacer { flex: 1; }
.dashboard-root .search {
  display: flex; align-items: center; gap: 8px;
  background: var(--n-50);
  border: 1px solid var(--border);
  border-radius: var(--r-2);
  padding: 6px 10px;
  width: 320px;
  font-size: 13px;
  color: var(--text-muted);
}
.dashboard-root .search input { all: unset; flex: 1; font-size: 13px; color: var(--text); }
.dashboard-root .search .kbd { font-family: var(--u-mono); font-size: 10px; padding: 1px 5px; border: 1px solid var(--border); border-radius: 2px; color: var(--text-faint); }

.dashboard-root .btn {
  font-family: var(--u-font);
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  padding: 7px 12px;
  border-radius: var(--r-2);
  border: 1px solid transparent;
  background: transparent;
  color: var(--text);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  letter-spacing: -0.005em;
}
.dashboard-root .btn-primary { background: var(--u-primary); color: white; }
.dashboard-root .btn-primary:hover { background: var(--u-primary-hover); }
.dashboard-root .btn-secondary { background: var(--n-0); border-color: var(--border-strong); color: var(--text); }
.dashboard-root .btn-secondary:hover { background: var(--n-50); }
.dashboard-root .btn-ghost { color: var(--text-muted); }
.dashboard-root .btn-ghost:hover { background: var(--n-100); color: var(--text); }
.dashboard-root .btn-sm { padding: 5px 9px; font-size: 12px; }

/* Page header */
.dashboard-root .page-head {
  padding: 24px 24px 20px;
  border-bottom: 1px solid var(--border);
  display: flex; align-items: flex-end; justify-content: space-between;
  gap: 24px;
  background: var(--n-0);
}
.dashboard-root .page-head .eyebrow {
  font-family: var(--u-mono); font-size: 11px; color: var(--text-faint);
  text-transform: uppercase; letter-spacing: 0.06em;
  margin-bottom: 6px;
  display: flex; align-items: center; gap: 8px;
}
.dashboard-root .page-head .eyebrow .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--u-primary); box-shadow: 0 0 0 3px var(--u-primary-tint); }
.dashboard-root .page-head h1 {
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.022em;
  margin: 0 0 8px;
}
.dashboard-root .page-head .sub {
  font-size: 13px; color: var(--text-muted); max-width: 540px;
}
.dashboard-root .page-head .actions { display: flex; gap: 8px; align-items: center; }

/* Segmented control */
.dashboard-root .seg {
  display: inline-flex;
  border: 1px solid var(--border-strong);
  border-radius: var(--r-2);
  background: var(--n-0);
  padding: 2px;
  gap: 2px;
}
.dashboard-root .seg button {
  all: unset;
  font-family: var(--u-font);
  font-size: 12px;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: var(--r-1);
  color: var(--text-muted);
  cursor: pointer;
}
.dashboard-root .seg button.active {
  background: var(--u-primary-tint);
  color: var(--u-primary);
}

/* Content grid */
.dashboard-root .content {
  flex: 1;
  overflow: auto;
  padding: 24px;
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(12, 1fr);
  align-content: start;
}

/* KPI cards */
.dashboard-root .kpi {
  background: var(--n-0);
  border: 1px solid var(--border);
  border-radius: var(--r-3);
  padding: 16px 18px;
  display: flex; flex-direction: column; gap: 4px;
  grid-column: span 3;
  position: relative;
}
.dashboard-root .kpi-label {
  font-family: var(--u-mono); font-size: 10px;
  text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--text-faint);
}
.dashboard-root .kpi-value {
  font-size: 30px; font-weight: 600; letter-spacing: -0.025em;
  display: flex; align-items: baseline; gap: 4px;
}
.dashboard-root .kpi-value .unit { font-size: 13px; color: var(--text-muted); font-weight: 500; letter-spacing: -0.005em; }
.dashboard-root .kpi-delta { font-family: var(--u-mono); font-size: 11px; margin-top: 2px; }
.dashboard-root .kpi-delta.up { color: var(--s-ok); }
.dashboard-root .kpi-delta.down { color: var(--s-err); }
.dashboard-root .kpi-spark {
  position: absolute; right: 14px; bottom: 14px; opacity: 0.35;
}

/* Chart cards */
.dashboard-root .card {
  background: var(--n-0);
  border: 1px solid var(--border);
  border-radius: var(--r-3);
  display: flex;
  flex-direction: column;
}
.dashboard-root .card-head {
  padding: 14px 18px 10px;
  display: flex; align-items: baseline; justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid var(--border);
  flex: 0 0 auto;
}
.dashboard-root .card-head .title { font-size: 14px; font-weight: 600; letter-spacing: -0.01em; margin: 0; }
.dashboard-root .card-head .meta { font-family: var(--u-mono); font-size: 10px; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.06em; }
.dashboard-root .card-body { padding: 18px; flex: 1 1 auto; min-height: 0; }
.dashboard-root .card-body.chart-body {
  display: flex;
  padding: 14px 18px 18px;
}
.dashboard-root .card-body.chart-body > .chart-fill {
  flex: 1 1 auto;
  min-height: 260px;
  width: 100%;
}

.dashboard-root .card-wide { grid-column: span 8; }
.dashboard-root .card-narrow { grid-column: span 4; }
.dashboard-root .card-half { grid-column: span 6; }
.dashboard-root .card-third { grid-column: span 4; }

/* Legend */
.dashboard-root .legend { display: flex; gap: 14px; align-items: center; font-size: 11px; color: var(--text-muted); }
.dashboard-root .legend .sw { display: inline-flex; align-items: center; gap: 6px; }
.dashboard-root .legend .dot { width: 8px; height: 8px; border-radius: 2px; }

/* Table */
.dashboard-root .tbl {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.dashboard-root .tbl th {
  text-align: left;
  font-family: var(--u-mono);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-faint);
  font-weight: 500;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  background: var(--n-25);
  position: sticky;
  top: 0;
}
.dashboard-root .tbl td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  color: var(--text);
}
.dashboard-root .tbl tr:last-child td { border-bottom: 0; }
.dashboard-root .tbl tr:hover td { background: var(--n-25); }
.dashboard-root .tbl .rec {
  display: flex; align-items: center; gap: 8px;
  font-weight: 500;
}
.dashboard-root .tbl .rec .mk {
  width: 3px; height: 14px; border-radius: 1px;
}
.dashboard-root .tbl .id { font-family: var(--u-mono); font-size: 11px; color: var(--text-muted); }

/* Badge */
.dashboard-root .badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11px; font-weight: 500;
  padding: 2px 7px; border-radius: var(--r-1);
  line-height: 1.5;
}
.dashboard-root .badge .pulse { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
.dashboard-root .badge-ok { background: var(--s-ok-tint); color: var(--s-ok); }
.dashboard-root .badge-warn { background: var(--s-warn-tint); color: var(--s-warn); }
.dashboard-root .badge-err { background: var(--s-err-tint); color: var(--s-err); }
.dashboard-root .badge-info { background: var(--u-primary-tint); color: var(--u-primary); }
.dashboard-root .badge-neutral { background: var(--n-100); color: var(--n-600); }
.dashboard-root .badge-outline { background: transparent; color: var(--text-muted); box-shadow: inset 0 0 0 1px var(--border-strong); }

.dashboard-root .avatar {
  width: 20px; height: 20px; border-radius: 50%;
  background: var(--n-150); color: var(--n-600);
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 9px; font-weight: 600;
}

/* Progress */
.dashboard-root .prog-bar { height: 4px; background: var(--n-100); border-radius: 2px; overflow: hidden; position: relative; }
.dashboard-root .prog-bar .fill { height: 100%; background: var(--u-primary); border-radius: 2px; }

/* Activity feed */
.dashboard-root .feed { display: flex; flex-direction: column; }
.dashboard-root .feed-item { display: grid; grid-template-columns: 24px 1fr; gap: 10px; padding: 12px 18px; border-bottom: 1px solid var(--border); }
.dashboard-root .feed-item:last-child { border-bottom: 0; }
.dashboard-root .feed-ic { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--n-100); color: var(--n-500); font-size: 10px; font-weight: 600; }
.dashboard-root .feed-body { font-size: 12px; color: var(--text); line-height: 1.5; }
.dashboard-root .feed-body b { font-weight: 600; }
.dashboard-root .feed-meta { font-family: var(--u-mono); font-size: 10px; color: var(--text-faint); margin-top: 3px; letter-spacing: 0.04em; }

/* Donut card */
.dashboard-root .donut-card-body {
  padding: 20px 20px 20px;
  display: flex; flex-direction: column; gap: 20px;
  align-items: center;
  height: 100%;
}
.dashboard-root .donut-svg { width: 100%; max-width: 240px; height: auto; }
.dashboard-root .donut-legend {
  display: flex; flex-direction: column; gap: 10px;
  width: 100%;
}
.dashboard-root .donut-row {
  display: grid;
  grid-template-columns: 10px 1fr auto auto;
  column-gap: 10px;
  align-items: center;
  font-size: 12px;
}
.dashboard-root .donut-row .sw { width: 10px; height: 10px; border-radius: 2px; }
.dashboard-root .donut-row .k { color: var(--text); font-weight: 500; letter-spacing: -0.005em; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dashboard-root .donut-row .pct { font-family: var(--u-mono); color: var(--text-faint); font-size: 11px; }
.dashboard-root .donut-row .v { font-family: var(--u-mono); color: var(--text); font-size: 12px; font-weight: 500; width: 22px; text-align: right; }
`;

type NavIconProps = { path: React.ReactNode };
const NavIconSvg = ({ path }: NavIconProps) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    {path}
  </svg>
);

type Range = "7d" | "30d" | "90d" | "YTD";

// Stacked bars: Closure TAT by stage
const StackedBarsChart = () => {
  const { ref, size } = useContainerSize<HTMLDivElement>({ w: 720, h: 280 });
  const W = size.w;
  const H = size.h;
  const PAD_L = 36;
  const PAD_R = 12;
  const PAD_T = 20;
  const PAD_B = 46;
  const plotW = Math.max(0, W - PAD_L - PAD_R);
  const plotH = Math.max(0, H - PAD_T - PAD_B);

  const data = [
    { l: "Identification", a: 3, b: 2 },
    { l: "Disposition", a: 5, b: 2 },
    { l: "CAR", a: 8, b: 3 },
    { l: "Root Cause", a: 7, b: 2 },
    { l: "Action Plan", a: 4, b: 2 },
    { l: "Implementation", a: 8, b: 3 },
    { l: "Verify & Valid.", a: 2, b: 1 },
  ];
  const max = 12;
  const ticks = [0, 3, 6, 9, 12];
  const slot = plotW / data.length;
  const barW = Math.min(56, slot * 0.52);

  return (
    <div ref={ref} style={{ width: "100%", height: "100%" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        {ticks.map((t) => {
          const y = PAD_T + plotH * (1 - t / max);
          return (
            <g key={`tick-${t}`}>
              <line x1={PAD_L} x2={W - PAD_R} y1={y} y2={y} stroke="#E4E7EB" strokeWidth={1} />
              <text
                x={PAD_L - 8}
                y={y + 3}
                textAnchor="end"
                fill="#8B93A0"
                fontFamily="JetBrains Mono, monospace"
                fontSize={10}
              >
                {t}
              </text>
            </g>
          );
        })}
        <text
          x={-H / 2}
          y={14}
          transform="rotate(-90)"
          textAnchor="middle"
          fill="#8B93A0"
          fontFamily="Inter"
          fontSize={10}
        >
          No. of days until closure
        </text>
        {data.map((d, i) => {
          const xc = PAD_L + i * slot + slot / 2;
          const x = xc - barW / 2;
          const hA = (d.a / max) * plotH;
          const hB = (d.b / max) * plotH;
          const yA = PAD_T + plotH - hA;
          const yB = yA - hB;
          return (
            <g key={d.l}>
              <rect x={x} y={yA} width={barW} height={hA} fill="var(--u-primary)" />
              <rect x={x} y={yB} width={barW} height={hB} fill="var(--u-primary-border)" />
              <text
                x={xc}
                y={yB - 6}
                textAnchor="middle"
                fill="#2B2F38"
                fontFamily="JetBrains Mono"
                fontSize={10}
                fontWeight={500}
              >
                {d.a + d.b}d
              </text>
              <text
                x={xc}
                y={H - 18}
                textAnchor="middle"
                fill="#646B78"
                fontFamily="Inter"
                fontSize={11}
              >
                {d.l}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Trend line: Opened vs Closed
const TrendChart = () => {
  const { ref, size } = useContainerSize<HTMLDivElement>({ w: 500, h: 200 });
  const W = size.w;
  const H = size.h;
  const PAD_L = 32;
  const PAD_R = 12;
  const PAD_T = 16;
  const PAD_B = 30;
  const plotW = Math.max(0, W - PAD_L - PAD_R);
  const plotH = Math.max(0, H - PAD_T - PAD_B);
  const labels = ["W-4", "W-3", "W-2", "W-1", "This"];
  const opened = [7, 9, 6, 8, 5];
  const closed = [4, 6, 7, 9, 11];
  const max = 12;

  const xAt = (i: number) => PAD_L + (plotW * i) / (labels.length - 1);
  const yAt = (v: number) => PAD_T + plotH * (1 - v / max);
  const toPath = (arr: number[]) =>
    arr
      .map((v, i) => `${i === 0 ? "M" : "L"}${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`)
      .join(" ");

  return (
    <div ref={ref} style={{ width: "100%", height: "100%" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        {[0, 3, 6, 9, 12].map((t) => {
          const y = PAD_T + plotH * (1 - t / max);
          return (
            <g key={`trend-grid-${t}`}>
              <line x1={PAD_L} x2={W - PAD_R} y1={y} y2={y} stroke="#EEF0F2" strokeWidth={1} />
              <text
                x={PAD_L - 8}
                y={y + 3}
                textAnchor="end"
                fill="#8B93A0"
                fontFamily="JetBrains Mono, monospace"
                fontSize={10}
              >
                {t}
              </text>
            </g>
          );
        })}
        <path d={toPath(opened)} stroke="#8B93A0" strokeWidth={1.4} fill="none" strokeDasharray="4 3" />
        <path d={toPath(closed)} stroke="var(--u-primary)" strokeWidth={1.8} fill="none" />
        {closed.map((v, i) => (
          <circle key={`cd-${i}`} cx={xAt(i)} cy={yAt(v)} r={3} fill="var(--u-primary)" />
        ))}
        {opened.map((v, i) => (
          <circle
            key={`od-${i}`}
            cx={xAt(i)}
            cy={yAt(v)}
            r={2.5}
            fill="white"
            stroke="#8B93A0"
            strokeWidth={1.2}
          />
        ))}
        {labels.map((l, i) => (
          <text
            key={l}
            x={xAt(i)}
            y={H - 10}
            textAnchor="middle"
            fill="#8B93A0"
            fontFamily="JetBrains Mono"
            fontSize={10}
          >
            {l}
          </text>
        ))}
      </svg>
    </div>
  );
};

// Horizontal bars: Top causes
const CausesBars = () => {
  const causes = [
    { l: "Material variance", v: 38 },
    { l: "Operator instruction", v: 24 },
    { l: "Calibration drift", v: 18 },
    { l: "Supplier mis-spec", v: 14 },
    { l: "Environmental", v: 6 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {causes.map((c, i) => (
        <div key={c.l}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: "var(--text)" }}>{c.l}</span>
            <span className="mono" style={{ color: "var(--text-muted)", fontSize: 11 }}>
              {c.v}% · {Math.round((c.v * 27) / 100)} NCs
            </span>
          </div>
          <div style={{ height: 6, background: "var(--n-100)", borderRadius: 2, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${c.v * 2}%`,
                background: i === 0 ? "var(--u-primary)" : "var(--n-400)",
                borderRadius: 2,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Donut: Open NCs by stage
const StagesDonut = () => {
  const data = [
    { l: "Identification", v: 6, c: "var(--u-primary)" },
    { l: "Disposition", v: 4, c: "var(--n-700)" },
    { l: "CAR", v: 8, c: "var(--n-500)" },
    { l: "Root cause", v: 5, c: "var(--n-400)" },
    { l: "Implementation", v: 4, c: "var(--n-300)" },
  ];
  const total = data.reduce((a, c) => a + c.v, 0);
  const W = 240;
  const H = 240;
  const R = 104;
  const r = 70;
  const cx = W / 2;
  const cy = H / 2;

  const slices = useMemo(() => {
    let a0 = -Math.PI / 2;
    return data.map((d) => {
      const frac = d.v / total;
      const a1 = a0 + frac * Math.PI * 2;
      const large = frac > 0.5 ? 1 : 0;
      const x0 = cx + R * Math.cos(a0);
      const y0 = cy + R * Math.sin(a0);
      const x1 = cx + R * Math.cos(a1);
      const y1 = cy + R * Math.sin(a1);
      const xi0 = cx + r * Math.cos(a1);
      const yi0 = cy + r * Math.sin(a1);
      const xi1 = cx + r * Math.cos(a0);
      const yi1 = cy + r * Math.sin(a0);
      const d_ = `M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1} L ${xi0} ${yi0} A ${r} ${r} 0 ${large} 0 ${xi1} ${yi1} Z`;
      a0 = a1;
      return { d: d_, fill: d.c };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="donut-card-body">
      <svg className="donut-svg" viewBox={`0 0 ${W} ${H}`}>
        {slices.map((s, i) => (
          <path key={i} d={s.d} fill={s.fill} stroke="white" strokeWidth={2} />
        ))}
        <text
          x={cx}
          y={cy - 2}
          textAnchor="middle"
          fill="#181B22"
          fontFamily="Inter"
          fontSize={40}
          fontWeight={600}
          letterSpacing="-0.025em"
        >
          {total}
        </text>
        <text
          x={cx}
          y={cy + 22}
          textAnchor="middle"
          fill="#8B93A0"
          fontFamily="JetBrains Mono"
          fontSize={10}
          letterSpacing="0.1em"
        >
          OPEN NCs
        </text>
      </svg>
      <div className="donut-legend">
        {data.map((d) => {
          const pct = Math.round((d.v / total) * 100);
          return (
            <div className="donut-row" key={d.l}>
              <span className="sw" style={{ background: d.c }} />
              <span className="k">{d.l}</span>
              <span className="pct">{pct}%</span>
              <span className="v">{d.v}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

type NCStageKind = "info" | "warn" | "err" | "ok";
type NCRow = {
  id: string;
  title: string;
  stage: string;
  stageKind: NCStageKind;
  owner: string;
  age: string;
  prog: number;
  mk: string;
};

const NC_ROWS: NCRow[] = [
  { id: "NC-25", title: "Assembly defect in final inspection", stage: "Identified", stageKind: "info", owner: "Lisa Martin", age: "2d", prog: 0.15, mk: "var(--u-primary)" },
  { id: "NC-24", title: "Spec mismatch · delivery packaging", stage: "Disposition", stageKind: "warn", owner: "Luke Skywalker", age: "4d", prog: 0.4, mk: "var(--s-warn)" },
  { id: "NC-22", title: "Incoming material out-of-tolerance", stage: "CAR open", stageKind: "info", owner: "Rupa Kapoor", age: "7d", prog: 0.55, mk: "var(--u-primary)" },
  { id: "NC-21", title: "Jig alignment drift · Line 2", stage: "RCA", stageKind: "warn", owner: "Daniel Storm", age: "9d", prog: 0.7, mk: "var(--s-warn)" },
  { id: "NC-19", title: "Calibration failure · torque tool", stage: "Implementation", stageKind: "info", owner: "Han Solo", age: "11d", prog: 0.82, mk: "var(--u-primary)" },
  { id: "NC-18", title: "Paint thickness below spec", stage: "Overdue", stageKind: "err", owner: "Leia Organa", age: "14d", prog: 0.35, mk: "var(--s-err)" },
  { id: "NC-17", title: "Mislabelled carton · Lot #271", stage: "Verify", stageKind: "ok", owner: "Chewbacca", age: "6d", prog: 0.92, mk: "var(--s-ok)" },
];

type FeedItem = { who: string; tone: "primary" | "neutral"; text: string; meta: string };
const FEED: FeedItem[] = [
  { who: "DS", tone: "primary", text: "<b>Daniel Storm</b> closed <b>CAR-41</b> on NC-22", meta: "Just now" },
  { who: "RK", tone: "neutral", text: "<b>Rupa Kapoor</b> uploaded inspection report to <b>NC-25</b>", meta: "12 min ago" },
  { who: "LM", tone: "neutral", text: "<b>Lisa Martin</b> assigned <b>NC-25</b> to Daniel", meta: "34 min ago" },
  { who: "UA", tone: "primary", text: "<b>Unifize Assistant</b> linked <b>RCA-12</b> to CAR-41", meta: "1h ago" },
  { who: "HS", tone: "neutral", text: "<b>Han Solo</b> verified calibration on <b>NC-19</b>", meta: "2h ago" },
];

const initialsOf = (name: string) => name.split(" ").map((s) => s[0]).slice(0, 2).join("");

export default function Dashboard() {
  const [range, setRange] = useState<Range>("30d");
  const [recentFilter, setRecentFilter] = useState<"All" | "Mine" | "Overdue">("All");

  useEffect(() => {
    const prev = document.title;
    document.title = "Unifize — Dashboard";
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="dashboard-root">
      <style>{DASHBOARD_STYLES}</style>
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
      />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;550;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <div className="app">
        {/* Nav */}
        <aside className="nav">
          <Link to="/" className="nav-logo" title="Home">U</Link>
          <Link to="/" className="nav-item" title="Home">
            <NavIconSvg
              path={
                <path
                  d="M3 8L9 3.5 15 8v6.5a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5V8z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              }
            />
          </Link>
          <Link to="/chat" className="nav-item" title="Conversations">
            <NavIconSvg
              path={
                <path
                  d="M3 5a1 1 0 011-1h10a1 1 0 011 1v7a1 1 0 01-1 1H7l-4 3V5z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              }
            />
          </Link>
          <Link to="/chat" className="nav-item" title="Documents">
            <NavIconSvg
              path={
                <>
                  <path
                    d="M5 2.5h5.5L14 6v8.5a1 1 0 01-1 1H5a1 1 0 01-1-1v-11a1 1 0 011-1z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <path d="M10 2.5V6h4" stroke="currentColor" strokeWidth="1.4" />
                </>
              }
            />
          </Link>
          <Link to="/dashboard" className="nav-item active" title="Dashboard">
            <NavIconSvg
              path={
                <>
                  <rect x="3" y="3" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.4" />
                  <rect x="9.5" y="3" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.4" />
                  <rect x="3" y="9.5" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.4" />
                  <rect x="9.5" y="9.5" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.4" />
                </>
              }
            />
          </Link>
          <Link to="/dashboard" className="nav-item" title="People">
            <NavIconSvg
              path={
                <>
                  <circle cx="9" cy="7" r="2.8" stroke="currentColor" strokeWidth="1.4" />
                  <path
                    d="M3.5 15c1.2-2.8 3.4-3.9 5.5-3.9s4.3 1.1 5.5 3.9"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </>
              }
            />
          </Link>
          <div className="nav-spacer" />
          <div className="nav-item" title="Settings">
            <NavIconSvg
              path={
                <>
                  <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.4" />
                  <path
                    d="M14 9a5 5 0 00-.1-1.1l1.5-1.2-1.5-2.6-1.8.6a5 5 0 00-2-1.1L9.7 1.8H8.3L8 3.6a5 5 0 00-2 1.1l-1.8-.6-1.5 2.6 1.5 1.2A5 5 0 004 9c0 .4 0 .7.1 1.1L2.6 11.3l1.5 2.6 1.8-.6a5 5 0 002 1.1l.3 1.8h1.5l.3-1.8a5 5 0 002-1.1l1.8.6 1.5-2.6-1.5-1.2c.1-.4.1-.7.1-1.1z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                </>
              }
            />
          </div>
          <div className="nav-avatar" />
        </aside>

        {/* Main */}
        <main className="shell-main">
          {/* Topbar */}
          <div className="topbar">
            <div className="breadcrumb">
              <span>Engineering Industries</span>
              <span className="sep">/</span>
              <span>Quality</span>
              <span className="sep">/</span>
              <span className="current">Dashboard</span>
            </div>
            <div className="spacer" />
            <div className="search">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <input placeholder="Search conversations, NCs, CARs, LOTs…" />
              <span className="kbd">⌘K</span>
            </div>
            <button className="btn btn-ghost btn-sm" aria-label="Notifications">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 6a5 5 0 015-5v0a5 5 0 015 5v3l2 2H1l2-2V6z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
                <path d="M6 13a2 2 0 004 0" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
            <button className="btn btn-primary btn-sm">+ New</button>
          </div>

          {/* Page head */}
          <header className="page-head">
            <div>
              <div className="eyebrow">
                <span className="dot" />
                Quality · Q2 2026
              </div>
              <h1>Non-conformances</h1>
              <div className="sub">
                27 open across 4 processes. Closure TAT is down 8.1% quarter-over-quarter —
                driven by faster CAR and RCA stages.
              </div>
            </div>
            <div className="actions">
              <div className="seg">
                {(["7d", "30d", "90d", "YTD"] as Range[]).map((r) => (
                  <button
                    key={r}
                    className={range === r ? "active" : ""}
                    onClick={() => setRange(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <button className="btn btn-secondary btn-sm">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2 4h12M4 8h8M6 12h4"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
                Filters
              </button>
              <button className="btn btn-secondary btn-sm">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 2v8m0 0l-3-3m3 3l3-3M3 13h10"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Export
              </button>
            </div>
          </header>

          {/* Content */}
          <div className="content">
            {/* KPIs */}
            <div className="kpi">
              <div className="kpi-label">Avg closure TAT</div>
              <div className="kpi-value">
                14.2 <span className="unit">days</span>
              </div>
              <div className="kpi-delta up">↓ 8.1% vs last 30d</div>
              <svg className="kpi-spark" width="68" height="24" viewBox="0 0 68 24" fill="none">
                <polyline
                  points="0,18 8,16 16,17 24,14 32,11 40,10 48,7 56,5 68,6"
                  stroke="var(--u-primary)"
                  strokeWidth="1.6"
                  fill="none"
                />
              </svg>
            </div>
            <div className="kpi">
              <div className="kpi-label">Open NCs</div>
              <div className="kpi-value">27</div>
              <div className="kpi-delta down">↑ 3 new this week</div>
              <svg className="kpi-spark" width="68" height="24" viewBox="0 0 68 24" fill="none">
                <polyline
                  points="0,14 8,15 16,12 24,13 32,12 40,10 48,13 56,11 68,8"
                  stroke="var(--n-500)"
                  strokeWidth="1.6"
                  fill="none"
                />
              </svg>
            </div>
            <div className="kpi">
              <div className="kpi-label">Closed in quarter</div>
              <div className="kpi-value">41</div>
              <div className="kpi-delta up">↑ 12 vs Q1</div>
              <svg className="kpi-spark" width="68" height="24" viewBox="0 0 68 24" fill="none">
                <polyline
                  points="0,20 8,19 16,16 24,14 32,12 40,13 48,9 56,8 68,5"
                  stroke="var(--s-ok)"
                  strokeWidth="1.6"
                  fill="none"
                />
              </svg>
            </div>
            <div className="kpi">
              <div className="kpi-label">On-time closure</div>
              <div className="kpi-value">
                82<span className="unit">%</span>
              </div>
              <div className="kpi-delta up">↑ 4pts vs 30d</div>
              <svg className="kpi-spark" width="68" height="24" viewBox="0 0 68 24" fill="none">
                <polyline
                  points="0,14 8,12 16,13 24,10 32,11 40,8 48,9 56,6 68,5"
                  stroke="var(--u-primary)"
                  strokeWidth="1.6"
                  fill="none"
                />
              </svg>
            </div>

            {/* Main chart: Closure TAT by stage (stacked) */}
            <div className="card card-wide">
              <div className="card-head">
                <div>
                  <h3 className="title">Closure TAT by stage</h3>
                  <div
                    className="mono"
                    style={{
                      fontSize: 10,
                      color: "var(--text-faint)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginTop: 2,
                    }}
                  >
                    Days until closure · last 30 days
                  </div>
                </div>
                <div className="legend">
                  <span className="sw">
                    <span className="dot" style={{ background: "var(--u-primary)" }} /> Active work
                  </span>
                  <span className="sw">
                    <span className="dot" style={{ background: "var(--u-primary-border)" }} /> Waiting on review
                  </span>
                </div>
              </div>
              <div className="card-body chart-body" style={{ position: "relative" }}>
                <div className="chart-fill">
                  <StackedBarsChart />
                </div>
              </div>
            </div>

            {/* Side: NC distribution donut */}
            <div className="card card-narrow">
              <div className="card-head">
                <h3 className="title">Open NCs by stage</h3>
                <span className="meta">27 total</span>
              </div>
              <StagesDonut />
            </div>

            {/* Half: Trend line */}
            <div className="card card-half">
              <div className="card-head">
                <h3 className="title">NCs opened vs closed</h3>
                <div className="legend">
                  <span className="sw">
                    <span className="dot" style={{ background: "var(--n-400)" }} />
                    Opened
                  </span>
                  <span className="sw">
                    <span className="dot" style={{ background: "var(--u-primary)" }} />
                    Closed
                  </span>
                </div>
              </div>
              <div className="card-body chart-body" style={{ position: "relative" }}>
                <div className="chart-fill" style={{ minHeight: 200 }}>
                  <TrendChart />
                </div>
              </div>
            </div>

            {/* Half: Top contributors */}
            <div className="card card-half">
              <div className="card-head">
                <h3 className="title">Top causes · root cause analysis</h3>
                <span className="meta">Q2 2026</span>
              </div>
              <div className="card-body">
                <CausesBars />
              </div>
            </div>

            {/* Table: recent NCs */}
            <div className="card card-wide">
              <div className="card-head">
                <h3 className="title">Recent non-conformances</h3>
                <div style={{ display: "flex", gap: 8 }}>
                  {(["All", "Mine", "Overdue"] as const).map((f) => (
                    <button
                      key={f}
                      className="btn btn-ghost btn-sm"
                      style={
                        recentFilter === f
                          ? { background: "var(--u-primary-tint)", color: "var(--u-primary)" }
                          : undefined
                      }
                      onClick={() => setRecentFilter(f)}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Record</th>
                    <th>Stage</th>
                    <th>Owner</th>
                    <th>Age</th>
                    <th style={{ textAlign: "right" }}>Progress</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {NC_ROWS.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <div className="rec">
                          <span className="mk" style={{ background: r.mk }} />
                          <span>{r.title}</span>
                          <span className="id">{r.id}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${r.stageKind}`}>
                          <span className="pulse" />
                          {r.stage}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <span className="avatar">{initialsOf(r.owner)}</span>
                          <span>{r.owner}</span>
                        </div>
                      </td>
                      <td>
                        <span className="mono" style={{ color: "var(--text-muted)", fontSize: 12 }}>
                          {r.age}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
                          <span
                            className="mono"
                            style={{ fontSize: 11, color: "var(--text-muted)", width: 30, textAlign: "right" }}
                          >
                            {Math.round(r.prog * 100)}%
                          </span>
                          <div className="prog-bar" style={{ width: 80 }}>
                            <div className="fill" style={{ width: `${r.prog * 100}%`, background: r.mk }} />
                          </div>
                        </div>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button className="btn btn-ghost btn-sm" style={{ padding: "3px 6px" }} aria-label="Open">
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M6 4l4 4-4 4"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Activity */}
            <div className="card card-narrow">
              <div className="card-head">
                <h3 className="title">Activity</h3>
                <span className="meta">Today</span>
              </div>
              <div className="feed">
                {FEED.map((f, i) => (
                  <div className="feed-item" key={i}>
                    <div
                      className="feed-ic"
                      style={
                        f.tone === "primary"
                          ? { background: "var(--u-primary-tint)", color: "var(--u-primary)" }
                          : undefined
                      }
                    >
                      {f.who}
                    </div>
                    <div>
                      <div className="feed-body" dangerouslySetInnerHTML={{ __html: f.text }} />
                      <div className="feed-meta">{f.meta}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
