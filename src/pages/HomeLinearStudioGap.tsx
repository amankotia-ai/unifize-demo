// HomeLinearStudioGap
//
// /linear-studio-gap — duplicate of HomeLinearStudio (dark studio hero) with
// the gantt cycle-time chart swapped for the SoR/SoC/Unifize "gap" animation
// from HomeSoRSoCGapV2. Same nav, same hero, different visual under the header.
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { Link } from "react-router-dom";

const STYLES = `
html:has(.lf-root) { scroll-behavior: smooth; }
.lf-root [id] { scroll-margin-top: 72px; }
.lf-root {
  --lf-fg: 245, 245, 245;
  --lf-bg: #0A0A0A;
  --lf-bg-rgb: 10, 10, 10;
  --lf-bg-subtle: #141412;
  --lf-bg-card: #131313;
  --lf-border: rgba(var(--lf-fg), 0.10);
  --lf-border-strong: rgba(var(--lf-fg), 0.18);
  --lf-text: #F5F5F5;
  --lf-text-muted: #9A9A95;
  --lf-text-faint: #6B6B6B;

  --ls-r-pill: 999px;
  --ls-page-x: clamp(20px, 2vw, 40px);
  --ls-nav-h: 72px;

  font-family: 'Inter Tight', 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', system-ui, sans-serif;
  background: var(--lf-bg);
  color: var(--lf-text);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  letter-spacing: -0.005em;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
  isolation: isolate;
}
/* Page-wide isometric grid. Two sets of 30°/-30° lines forming a faint
   triangular tessellation. Sits at z-index 0 behind nav, hero text, and the
   scene; radial mask fades the grid out toward the edges. */
.lf-bg-iso-grid {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image:
    repeating-linear-gradient(30deg,
      transparent 0,
      transparent 71px,
      rgba(255,255,255,0.055) 71px,
      rgba(255,255,255,0.055) 72px),
    repeating-linear-gradient(-30deg,
      transparent 0,
      transparent 71px,
      rgba(255,255,255,0.055) 71px,
      rgba(255,255,255,0.055) 72px);
  -webkit-mask-image: radial-gradient(ellipse 70% 80% at 50% 45%, #000 0%, rgba(0,0,0,0.6) 50%, transparent 95%);
  mask-image: radial-gradient(ellipse 70% 80% at 50% 45%, #000 0%, rgba(0,0,0,0.6) 50%, transparent 95%);
}
.lf-root * { box-sizing: border-box; }
.lf-root .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
.lf-root a { color: inherit; text-decoration: none; }

/* Nav lifted from /linear-v2 — sticky, blurred backdrop, single 1240px row,
   white pill CTA. */
.lin-nav {
  position: sticky; top: 0; z-index: 50;
  background: transparent;
}
.lin-nav-inner {
  max-width: 1240px; margin: 0 auto;
  padding: 12px 28px;
  display: flex; align-items: center; gap: 40px;
}
.lin-nav-logo { display: inline-flex; align-items: center; }
.lin-nav-logo-img {
  height: 22px; width: auto; display: block;
  filter: brightness(0) invert(1);
}
.lin-nav-items {
  display: flex; gap: 26px;
  font-size: 13.5px; color: rgba(255,255,255,0.56);
}
.lin-nav-items a { transition: color .15s; }
.lin-nav-items a:hover { color: #FFFFFF; }
.lin-nav-actions { margin-left: auto; display: flex; gap: 18px; align-items: center; }
.lin-nav-link { font-size: 13.5px; color: rgba(255,255,255,0.56); }
.lin-nav-link:hover { color: #FFFFFF; }
.lin-nav-btn {
  font-size: 13px; font-weight: 500;
  background: #FFFFFF; color: #0B0D11;
  padding: 7px 14px; border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.9);
  cursor: pointer; transition: background .15s;
}
.lin-nav-btn:hover { background: #EBECEE; }
@media (max-width: 860px) { .lin-nav-items { display: none; } }

.lf-hero {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: clamp(28px, 3vw, 48px) clamp(28px, 4vw, 56px) clamp(20px, 2vw, 32px);
  position: relative;
  display: flex;
  justify-content: center;
}
.lf-hero-copy {
  display: flex; flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 1;
}
.lf-hero-h1 {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', system-ui, sans-serif;
  font-optical-sizing: auto;
  font-variation-settings: "opsz" 32;
  font-size: clamp(38px, 4.4vw, 60px);
  font-weight: 500; line-height: 1.04; letter-spacing: -0.020em;
  max-width: 18ch; margin: 0 auto; text-align: center;
  color: #FFFFFF;
}
.lf-hero-accent { font-weight: 500; color: #FFFFFF; }
.lf-hero-subtitle {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', system-ui, sans-serif;
  font-optical-sizing: auto;
  font-variation-settings: "opsz" 32;
  margin: 24px auto 32px; font-size: 17px; color: rgba(255,255,255,0.78);
  max-width: 42ch; line-height: 1.55; letter-spacing: -0.005em; text-align: center;
}
.lf-hero-cta { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; justify-content: center; }
@media (max-width: 880px) {
  .lf-hero {
    padding-top: clamp(20px, 4vw, 40px);
    padding-bottom: clamp(16px, 3vw, 28px);
  }
}
.lf-btn-primary {
  font-family: inherit; font-size: 14px; font-weight: 500;
  background: rgba(255, 255, 255, 0.10); backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px);
  color: var(--lf-text); padding: 0 18px; height: 38px; border-radius: var(--ls-r-pill);
  border: 0; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
  letter-spacing: -0.005em; transition: background .18s ease, color .18s ease, transform .18s ease;
}
.lf-btn-primary:hover { background: #F5F5F5; color: #0A0A0A; }
.lf-btn-primary:active { transform: scale(0.98); }
.lf-btn-primary:focus-visible { outline: none; box-shadow: 0 0 0 2px rgba(245,245,245,0.35); }
.lf-btn-primary svg { transition: transform .15s ease; }
.lf-btn-primary:hover svg { transform: translateX(1px); }

.lf-graphic-section {
  position: relative;
  width: 100%;
  padding: clamp(24px, 4vw, 64px) var(--ls-page-x) 0;
  display: flex; justify-content: center;
}
.lf-graphic-img {
  width: 100%;
  max-width: 1240px;
  height: auto;
  display: block;
}
.lf-gap-section {
  position: relative;
  width: 100%;
  padding: 0 var(--ls-page-x) clamp(80px, 10vw, 120px);
  display: flex; justify-content: center;
}
/* The stage reserves SYS_TOP=140 of empty space above the cards — that's ~19%
   of the 720-tall canvas. A larger negative margin pulls the cards closer to
   the hero CTA without clipping their headers (no overflow:hidden so the
   leak/void/column animations keep their full vertical reach). */
.lf-gap-stage { margin-top: clamp(-40px, -3vw, -16px); }
`;

// ─────────────────────────────────────────────────────────────────────────────
// SoR/SoC/Gap animation — lifted from HomeSoRSoCGapV2.
// Self-contained: palette, geometry, items, hooks, sub-components, Stage.
// ─────────────────────────────────────────────────────────────────────────────

const BG = "#0A0A0A";
const BG_RAISED = "#13151E";
const SURFACE_GLASS = "rgba(255,255,255,0.035)";
const TOP_HIGHLIGHT = "rgba(255,255,255,0.08)";
const STROKE = "rgba(255,255,255,0.07)";
const STROKE_STRONG = "rgba(255,255,255,0.12)";
const TEXT = "#ECEEF6";
const TEXT_DIM = "#A0A6BD";
const TEXT_VDM = "#6B7187";
// Unifize blue palette, mirrors the hero accent gradient (#2870FF → #BCD2FF).
const ACCENT = "#5C92FF";
const ACCENT_DEEP = "#1F58D9";
const ACCENT_SOFT = "rgba(92,146,255,0.14)";
const ACCENT_BORDER = "rgba(92,146,255,0.40)";
const WARM = "#F4B068";
const STATE_GREEN = "#5EE0A4";
const STATE_AMBER = "#F4B068";

const STAGE_W = 1680;
const STAGE_H = 720;
const SYS_W = 540;
const SYS_H = 420;
const SYS_TOP = 140;
const SOR_X = 100;
const SOR_RIGHT = SOR_X + SYS_W;
const SOC_X = STAGE_W - SOR_X - SYS_W;
const GAP_LEFT = SOR_RIGHT;
const GAP_RIGHT = SOC_X;
const GAP_WIDTH = GAP_RIGHT - GAP_LEFT;
const COL_W = 280;
const COL_X = GAP_LEFT + (GAP_WIDTH - COL_W) / 2;
const COL_TOP = SYS_TOP - 40;
const ROW_LEFT_PAD = 16;
const ROW_TOP_PAD = 90;
const ROW_W = COL_W - ROW_LEFT_PAD * 2;
const ROW_H = 48;
const ROW_GAP = 8;
const ROW_COUNT = 6;
const COL_BOTTOM_PAD = 24;
// Hug the captured rows. ROW_TOP_PAD (header zone) + N rows + (N-1) gaps + bottom pad.
const COL_HEIGHT = ROW_TOP_PAD + ROW_COUNT * ROW_H + (ROW_COUNT - 1) * ROW_GAP + COL_BOTTOM_PAD;
const ROW_X = COL_X + ROW_LEFT_PAD;

const DURATION = 12;
const LOOP_REST = 1.2;
const easeOutCubic = (t: number) => --t * t * t + 1;
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const T_LEAK_START = 1.6;
const T_LEAK_STAGGER = 0.32;
const T_LEAK_DURATION = 1.4;
const T_VOID_HOLD_END = 5.4;
const T_COL_FORM_START = 5.4;
const T_COL_FORM_END = 6.2;
const T_PULL_START = 6.2;
const T_PULL_STAGGER = 0.13;
const T_PULL_DURATION = 0.9;
const T_PULL_END = T_PULL_START + 5 * T_PULL_STAGGER + T_PULL_DURATION;
const HATCH_FLOOR = 0.18;

type VoidItem = {
  id: number;
  source: "sor" | "soc";
  label: string;
  recordType: string;
  stage: string;
  ownerInitials: string;
  ownerColor: string;
  fromX: number;
  fromY: number;
  voidX: number;
  voidY: number;
  voidRot: number;
  rowIndex: number;
};

const OWNER_PM_COLOR = "#5C92FF";
const OWNER_KS_COLOR = "#8FB6FF";
const OWNER_JT_COLOR = "#F4B068";

const ITEMS: VoidItem[] = [
  { id: 0, source: "sor", label: "CAPA owner?", recordType: "CAPA", stage: "Action plan", ownerInitials: "PM", ownerColor: OWNER_PM_COLOR, fromX: SOR_X + 380, fromY: SYS_TOP + 80,  voidX: GAP_LEFT + 30,  voidY: SYS_TOP + 30,  voidRot: -8, rowIndex: 0 },
  { id: 1, source: "soc", label: "approval pending", recordType: "ECN", stage: "QA review", ownerInitials: "KS", ownerColor: OWNER_KS_COLOR, fromX: SOC_X + 90,  fromY: SYS_TOP + 100, voidX: GAP_RIGHT - 162, voidY: SYS_TOP + 80,  voidRot: 7,  rowIndex: 1 },
  { id: 2, source: "sor", label: "root cause?",   recordType: "DEV",  stage: "Root cause", ownerInitials: "JT", ownerColor: OWNER_JT_COLOR, fromX: SOR_X + 400, fromY: SYS_TOP + 170, voidX: GAP_LEFT + 22,  voidY: SYS_TOP + 150, voidRot: 5,  rowIndex: 2 },
  { id: 3, source: "soc", label: "spec rev v3?",  recordType: "DOC",  stage: "In review",  ownerInitials: "PM", ownerColor: OWNER_PM_COLOR, fromX: SOC_X + 100, fromY: SYS_TOP + 190, voidX: GAP_RIGHT - 158, voidY: SYS_TOP + 200, voidRot: -9, rowIndex: 3 },
  { id: 4, source: "sor", label: "scope drift",   recordType: "ECN",  stage: "Impact asmt", ownerInitials: "KS", ownerColor: OWNER_KS_COLOR, fromX: SOR_X + 360, fromY: SYS_TOP + 270, voidX: GAP_LEFT + 36,  voidY: SYS_TOP + 280, voidRot: -4, rowIndex: 4 },
  { id: 5, source: "soc", label: "v4 comment lost", recordType: "DOC", stage: "Comments", ownerInitials: "KS", ownerColor: OWNER_KS_COLOR, fromX: SOC_X + 110, fromY: SYS_TOP + 290, voidX: GAP_RIGHT - 168, voidY: SYS_TOP + 340, voidRot: 8,  rowIndex: 5 },
];

// Auto-looping clock: counts from 0 -> DURATION, holds briefly, restarts.
function useLoopingTime(duration: number, restSeconds: number, running: boolean) {
  const [t, setT] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      return;
    }
    const total = duration + restSeconds;
    const tick = (now: number) => {
      if (startRef.current == null) startRef.current = now;
      const elapsed = ((now - startRef.current) / 1000) % total;
      setT(Math.min(elapsed, duration));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current != null) cancelAnimationFrame(rafRef.current); };
  }, [duration, restSeconds, running]);

  return t;
}

function useStageScale(stageW: number, stageH: number) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const update = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const s = Math.min(w / stageW, h / stageH);
      setScale(Number.isFinite(s) && s > 0 ? s : 1);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => { ro.disconnect(); window.removeEventListener("resize", update); };
  }, [stageW, stageH]);
  return { ref, scale };
}

const GlassSurface = ({
  left, top, width, height, children, accent, dim,
}: {
  left: number; top: number; width: number; height: number;
  children: ReactNode; accent?: "warm" | "platform" | "none"; dim?: number;
}) => {
  const tint =
    accent === "warm"
      ? "linear-gradient(180deg, rgba(244,176,104,0.04) 0%, transparent 60%)"
      : accent === "platform"
      ? "linear-gradient(180deg, rgba(92,146,255,0.06) 0%, transparent 60%)"
      : undefined;
  return (
    <div style={{
      position: "absolute", left, top, width, height,
      background: SURFACE_GLASS, backgroundImage: tint,
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      border: `1px solid ${STROKE}`, borderRadius: 18,
      boxShadow:
        `inset 0 1px 0 ${TOP_HIGHLIGHT}, ` +
        `inset 0 0 0 1px rgba(255,255,255,0.025), ` +
        `inset 0 -1px 0 rgba(0,0,0,0.30), ` +
        `0 1px 0 rgba(255,255,255,0.04), ` +
        `0 8px 18px -8px rgba(0,0,0,0.45), ` +
        `0 32px 72px -28px rgba(0,0,0,0.65)`,
      opacity: dim ? 1 - dim * 0.18 : 1,
      transition: "opacity 0.4s ease", overflow: "hidden", zIndex: 5,
    }}>
      {children}
    </div>
  );
};

type SoRRow = { id: string; title: string; state: string; stateColor: string; group: string };
const SOR_ROWS: SoRRow[] = [
  { id: "CAPA-2104", title: "Investigation closure",       state: "In review",   stateColor: STATE_AMBER, group: "Quality" },
  { id: "DEV-218",   title: "Batch deviation, cycle 12",   state: "Awaiting QA", stateColor: TEXT_DIM,    group: "Production" },
  { id: "ECN-091",   title: "Change order, BoM update",    state: "Approved",    stateColor: STATE_GREEN, group: "Engineering" },
];

const SoR = ({ dim }: { dim: number }) => (
  <GlassSurface left={SOR_X} top={SYS_TOP} width={SYS_W} height={SYS_H} accent="platform" dim={dim}>
    <div style={{ padding: "24px 28px 18px", borderBottom: `1px solid ${STROKE}` }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontSize: 18, fontWeight: 600, color: TEXT, letterSpacing: "-0.022em" }}>System of Record</span>
        <span style={{ fontSize: 13, color: TEXT_DIM, letterSpacing: "-0.005em" }}>Forms, approvals, audit. Append-only.</span>
      </div>
    </div>
    <div style={{ padding: "10px 28px 18px" }}>
      {SOR_ROWS.map((r, i) => (
        <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 0", borderTop: i === 0 ? "none" : `1px solid ${STROKE}` }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: r.stateColor, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', ui-monospace, monospace", color: TEXT_DIM, letterSpacing: "0.04em", fontWeight: 500, flexShrink: 0 }}>{r.id}</span>
          <span style={{ fontSize: 14, color: TEXT, fontWeight: 500, letterSpacing: "-0.008em", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.title}</span>
          <span style={{ fontSize: 12, color: r.stateColor, fontWeight: 600, letterSpacing: "0.005em" }}>{r.state}</span>
        </div>
      ))}
    </div>
  </GlassSurface>
);

type SoCRow = { initials: string; avatar: string; sender: string; preview: string; channel: string; time: string; unread?: boolean };
const SOC_ROWS: SoCRow[] = [
  { initials: "JT", avatar: "#F4B068", sender: "Jamie Tarr", preview: "Re: ECN-091 release approval, please ack",       channel: "Outlook",     time: "2:14p",  unread: true },
  { initials: "PM", avatar: "#7B9CE5", sender: "Priya M.",   preview: "Spec rev v3 attached, can you take a look?",      channel: "Teams",       time: "11:42a" },
  { initials: "KS", avatar: "#B69CE5", sender: "Karim S.",   preview: "Commented on spec_v3.xlsx, §4 needs a redline",   channel: "SharePoint",  time: "Yest." },
];

const SoC = ({ dim }: { dim: number }) => (
  <GlassSurface left={SOC_X} top={SYS_TOP} width={SYS_W} height={SYS_H} accent="warm" dim={dim}>
    <div style={{ padding: "24px 28px 18px", borderBottom: `1px solid ${STROKE}` }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontSize: 18, fontWeight: 600, color: TEXT, letterSpacing: "-0.022em" }}>System of Coordination</span>
        <span style={{ fontSize: 13, color: TEXT_DIM, letterSpacing: "-0.005em" }}>Threads, files, notifications. Always live.</span>
      </div>
    </div>
    <div style={{ padding: "10px 28px 18px" }}>
      {SOC_ROWS.map((r, i) => (
        <div key={r.sender} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderTop: i === 0 ? "none" : `1px solid ${STROKE}` }}>
          <span style={{ width: 26, height: 26, borderRadius: 13, background: r.avatar, color: "#fff", fontSize: 10.5, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{r.initials}</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, color: TEXT, letterSpacing: "-0.008em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: 1.35 }}>
              <span style={{ fontWeight: 600 }}>{r.sender}</span>{" "}
              <span style={{ color: TEXT_DIM }}>{r.preview}</span>
            </div>
            <div style={{ fontSize: 12, color: TEXT_VDM, letterSpacing: "-0.003em" }}>{r.channel}</div>
          </div>
          {r.unread && <span style={{ width: 6, height: 6, borderRadius: 3, background: WARM, flexShrink: 0 }} />}
          <span style={{ fontSize: 12, color: TEXT_VDM, fontFamily: "'JetBrains Mono', ui-monospace, monospace", letterSpacing: "0.02em", flexShrink: 0 }}>{r.time}</span>
        </div>
      ))}
    </div>
  </GlassSurface>
);

const UnifizeColumn = ({ formP }: { formP: number }) => {
  if (formP <= 0) return null;
  return (
    <div style={{
      position: "absolute", left: COL_X, top: COL_TOP, width: COL_W, height: COL_HEIGHT,
      // Layered glass: bright spec at top, mid blue body, deeper toe at bottom.
      background:
        "radial-gradient(120% 60% at 50% -10%, rgba(143,182,255,0.18) 0%, rgba(92,146,255,0.06) 50%, transparent 80%), " +
        "linear-gradient(180deg, rgba(92,146,255,0.12) 0%, rgba(92,146,255,0.05) 60%, rgba(31,88,217,0.08) 100%), " +
        "rgba(10,12,20,0.45)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      borderRadius: 18,
      // Multi-layer shadow stack: tight ambient occlusion + far soft drop + colored bloom.
      boxShadow:
        "inset 0 1px 0 rgba(255,255,255,0.14), " +
        "inset 0 0 0 1px rgba(143,182,255,0.18), " +
        "inset 0 -1px 0 rgba(31,88,217,0.20), " +
        "0 1px 0 rgba(255,255,255,0.04), " +
        "0 8px 16px -6px rgba(0,0,0,0.45), " +
        "0 30px 80px -32px rgba(31,88,217,0.55), " +
        "0 60px 120px -48px rgba(40,112,255,0.30)",
      opacity: formP, transform: `scaleY(${lerp(0.94, 1, formP)})`, transformOrigin: "top center",
      zIndex: 6, pointerEvents: "none",
    }}>
      {/* Gradient hairline border via padded mask. Lighter at top, darker at base. */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, borderRadius: 18, padding: 1,
        background: "linear-gradient(180deg, rgba(188,210,255,0.55) 0%, rgba(92,146,255,0.30) 35%, rgba(31,88,217,0.45) 100%)",
        WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        pointerEvents: "none",
      }} />
      {/* Refined dot grid — finer dots, deeper fade. */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, borderRadius: 18,
        backgroundImage: "radial-gradient(rgba(255,255,255,0.045) 0.7px, transparent 0.7px)",
        backgroundSize: "18px 18px",
        maskImage: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.10) 65%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.10) 65%, transparent 100%)",
        opacity: 0.85,
      }} />
      {/* Soft top spotlight, simulates an overhead key light on the layer. */}
      <div aria-hidden style={{
        position: "absolute", left: "50%", top: -40, width: 220, height: 100,
        transform: "translateX(-50%)",
        background: "radial-gradient(60% 100% at 50% 50%, rgba(188,210,255,0.18) 0%, transparent 70%)",
        filter: "blur(6px)", pointerEvents: "none",
      }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 22, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        {/* Brand icon. The SVG already includes the rounded gradient tile, so the
            wrapper just adds the colored bloom + soft top highlight. */}
        <span style={{
          position: "relative",
          width: 36, height: 36, borderRadius: 9,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          boxShadow:
            "0 6px 14px -3px rgba(31,88,217,0.55), " +
            "0 12px 28px -6px rgba(40,112,255,0.40)",
        }}>
          <img
            src="/icon_logo.svg"
            alt="Unifize"
            width={36}
            height={36}
            style={{ display: "block", borderRadius: 9 }}
          />
        </span>
        <span style={{
          fontSize: 14, fontWeight: 600, color: TEXT,
          letterSpacing: "-0.012em",
          textShadow: "0 1px 0 rgba(0,0,0,0.30)",
        }}>Unifize</span>
      </div>
    </div>
  );
};

type ItemState = { x: number; y: number; rot: number; opacity: number; scale: number; width: number; phase: "hidden" | "leaking" | "void" | "pulling" | "captured" };

function getItemState(item: VoidItem, t: number): ItemState {
  const leakStart = T_LEAK_START + item.id * T_LEAK_STAGGER;
  const leakEnd = leakStart + T_LEAK_DURATION;
  const pullStart = T_PULL_START + item.id * T_PULL_STAGGER;
  const pullEnd = pullStart + T_PULL_DURATION;
  const toX = ROW_X;
  const toY = COL_TOP + ROW_TOP_PAD + item.rowIndex * (ROW_H + ROW_GAP);

  if (t < leakStart) return { x: item.fromX, y: item.fromY, rot: 0, opacity: 0, scale: 0.85, width: 132, phase: "hidden" };
  if (t < leakEnd) {
    const p = (t - leakStart) / (leakEnd - leakStart);
    const e = easeOutCubic(p);
    return {
      x: lerp(item.fromX, item.voidX, e), y: lerp(item.fromY, item.voidY, e),
      rot: lerp(0, item.voidRot, e), opacity: clamp01(p * 1.6),
      scale: lerp(0.9, 1, e), width: 132, phase: "leaking",
    };
  }
  if (t < pullStart) {
    const wob = (t - leakEnd) * 1.4;
    return {
      x: item.voidX + Math.sin(wob + item.id * 0.7) * 2.6,
      y: item.voidY + Math.cos(wob * 0.9 + item.id) * 2,
      rot: item.voidRot + Math.sin(wob * 0.7 + item.id) * 1.1,
      opacity: 1, scale: 1, width: 132, phase: "void",
    };
  }
  if (t < pullEnd) {
    const p = (t - pullStart) / (pullEnd - pullStart);
    const e = easeOutCubic(p);
    return {
      x: lerp(item.voidX, toX, e), y: lerp(item.voidY, toY, e),
      rot: lerp(item.voidRot, 0, e), opacity: 1, scale: 1,
      width: lerp(132, ROW_W, e), phase: "pulling",
    };
  }
  return { x: toX, y: toY, rot: 0, opacity: 1, scale: 1, width: ROW_W, phase: "captured" };
}

const FloatingItem = ({ item, t }: { item: VoidItem; t: number }) => {
  const s = getItemState(item, t);
  if (s.opacity === 0) return null;
  const inVoid = s.phase === "void" || s.phase === "leaking";
  const captured = s.phase === "pulling" || s.phase === "captured";
  const height = captured ? ROW_H : 30;
  return (
    <div style={{
      position: "absolute", left: s.x, top: s.y, width: s.width, height,
      opacity: s.opacity, transform: `rotate(${s.rot}deg) scale(${s.scale})`, transformOrigin: "left center",
      // Captured tiles: subtle raised gradient that catches light from above.
      // Floating items: warm-tinted glass.
      background: captured
        ? "linear-gradient(180deg, rgba(34,38,55,0.90) 0%, rgba(19,21,30,0.95) 100%)"
        : "linear-gradient(180deg, rgba(244,176,104,0.14) 0%, rgba(244,176,104,0.06) 100%)",
      border: `1px solid ${inVoid ? "rgba(244,176,104,0.50)" : "rgba(255,255,255,0.06)"}`,
      boxShadow: captured
        ? "0 1px 0 rgba(255,255,255,0.04), " +
          "0 6px 14px -6px rgba(0,0,0,0.55), " +
          "0 14px 36px -14px rgba(31,88,217,0.18), " +
          "inset 0 1px 0 rgba(255,255,255,0.06), " +
          "inset 0 -1px 0 rgba(0,0,0,0.30)"
        : "0 8px 20px -8px rgba(244,176,104,0.32), inset 0 1px 0 rgba(255,255,255,0.06)",
      borderRadius: 9, display: "flex", alignItems: "center",
      gap: captured ? 9 : 8, padding: captured ? "8px 10px" : "0 11px",
      zIndex: captured ? 7 : 9, pointerEvents: "none",
      transition: "border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease",
    }}>
      {captured ? (
        <>
          <span style={{
            fontSize: 9.5, fontWeight: 600, color: "#BCD2FF",
            background: "linear-gradient(180deg, rgba(143,182,255,0.20) 0%, rgba(92,146,255,0.10) 100%)",
            border: `1px solid rgba(143,182,255,0.35)`,
            borderRadius: 5, padding: "3px 7px",
            letterSpacing: "0.08em", fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            flexShrink: 0,
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.10), " +
              "inset 0 -1px 0 rgba(31,88,217,0.20), " +
              "0 1px 2px rgba(0,0,0,0.20)",
          }}>{item.recordType}</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 1, flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 11.5, color: TEXT, fontWeight: 500, letterSpacing: "-0.008em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.stage}</span>
            <span style={{ fontSize: 9.5, color: TEXT_VDM, letterSpacing: "-0.003em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</span>
          </div>
          <span style={{
            width: 22, height: 22, borderRadius: 11,
            background: `radial-gradient(120% 120% at 30% 25%, rgba(255,255,255,0.35) 0%, transparent 45%), ${item.ownerColor}`,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 9, fontWeight: 700, flexShrink: 0,
            letterSpacing: "0.01em",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.30), " +
              "inset 0 -1px 0 rgba(0,0,0,0.25), " +
              "0 2px 4px rgba(0,0,0,0.35)",
          }}>{item.ownerInitials}</span>
        </>
      ) : (
        <>
          <span style={{ width: 5, height: 5, borderRadius: 3, background: WARM, flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 500, color: WARM, letterSpacing: "-0.005em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>{item.label}</span>
        </>
      )}
    </div>
  );
};

const VoidSpace = ({ op, labelOp }: { op: number; labelOp: number }) => {
  if (op <= 0) return null;
  const left = GAP_LEFT + 20;
  const top = SYS_TOP + 10;
  const width = GAP_WIDTH - 40;
  const height = SYS_H - 20;
  return (
    <div style={{
      position: "absolute", left, top, width, height,
      opacity: op * 0.95, zIndex: 3, pointerEvents: "none",
      border: "1px dashed rgba(244,176,104,0.30)", borderRadius: 14,
      background: `repeating-linear-gradient(135deg,
        rgba(244,176,104,0.04) 0px,
        rgba(244,176,104,0.04) 5px,
        transparent 5px,
        transparent 16px)`,
    }}>
      <div style={{
        position: "absolute", top: -28, left: 0, right: 0, textAlign: "center",
        fontSize: 12, fontWeight: 600, letterSpacing: "-0.005em",
        color: WARM, opacity: labelOp, transition: "opacity 0.3s ease",
      }}>
        No system. No owner.
      </div>
    </div>
  );
};

const Subtext = ({ text, color, op }: { text: ReactNode; color: string; op: number }) => (
  <div style={{
    position: "absolute", left: 0, right: 0, top: SYS_TOP + SYS_H + 56,
    textAlign: "center", zIndex: 14, opacity: op, transition: "opacity 0.3s ease", pointerEvents: "none",
  }}>
    <span style={{
      fontSize: 17, fontWeight: 500, color,
      letterSpacing: "-0.014em",
      textShadow: "0 1px 0 rgba(0,0,0,0.35)",
    }}>{text}</span>
  </div>
);

const Stage = ({ t }: { t: number }) => {
  const hatchOp = (() => {
    if (t < T_LEAK_START + 0.3) return HATCH_FLOOR;
    if (t < 4.4) {
      const p = (t - (T_LEAK_START + 0.3)) / 0.9;
      return lerp(HATCH_FLOOR, 1, clamp01(p));
    }
    if (t < T_COL_FORM_START) return 1;
    if (t < T_COL_FORM_END - 0.1) {
      const p = (t - T_COL_FORM_START) / (T_COL_FORM_END - 0.1 - T_COL_FORM_START);
      return 1 - clamp01(p);
    }
    return 0;
  })();

  const formP = (() => {
    if (t < T_COL_FORM_START) return 0;
    if (t < T_COL_FORM_END) {
      const p = (t - T_COL_FORM_START) / (T_COL_FORM_END - T_COL_FORM_START);
      return easeOutCubic(p);
    }
    return 1;
  })();

  const cardLoss = (() => {
    if (t < T_LEAK_START) return 0;
    if (t < T_VOID_HOLD_END) return clamp01((t - T_LEAK_START) / 1.5);
    if (t < T_PULL_END) return clamp01(1 - (t - T_VOID_HOLD_END) / (T_PULL_END - T_VOID_HOLD_END));
    return 0;
  })();

  const subAOp = (() => {
    if (t < 1.4) return 0;
    if (t < 5.0) return clamp01((t - 1.4) / 0.4);
    return Math.max(0, 1 - (t - 5.0) / 0.5);
  })();

  const subBOp = (() => {
    if (t < T_PULL_END - 0.2) return 0;
    return clamp01((t - (T_PULL_END - 0.2)) / 0.6);
  })();

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: "'Inter Tight', 'Inter', sans-serif" }}>
      <Subtext text="No system owns the work between." color={WARM} op={subAOp} />
      <Subtext text="Unifize is the layer between." color={ACCENT} op={subBOp} />
      <SoR dim={cardLoss} />
      <SoC dim={cardLoss} />
      <VoidSpace op={hatchOp} labelOp={hatchOp <= HATCH_FLOOR + 0.001 ? 0 : clamp01((hatchOp - HATCH_FLOOR) / (1 - HATCH_FLOOR))} />
      <UnifizeColumn formP={formP} />
      {ITEMS.map((item) => <FloatingItem key={item.id} item={item} t={t} />)}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

export default function HomeLinearStudioGap() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const { ref, scale } = useStageScale(STAGE_W, STAGE_H);

  useEffect(() => {
    document.title = "Unifize. The coordination layer for regulated teams";
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setPrefersReducedMotion(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  const tRaw = useLoopingTime(DURATION, LOOP_REST, !prefersReducedMotion);
  const t = prefersReducedMotion ? DURATION : tRaw;

  return (
    <div className="lf-root">
      <style>{STYLES}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <div className="lf-bg-iso-grid" aria-hidden />

      <nav className="lin-nav">
        <div className="lin-nav-inner">
          <Link to="/linear-studio-gap" className="lin-nav-logo" aria-label="Unifize">
            <img src="/Link - home.svg" alt="Unifize" className="lin-nav-logo-img" />
          </Link>
          <div className="lin-nav-items">
            <a href="#problem">The Problem</a>
            <a href="#world">Your World</a>
            <a href="#industry">By Industry</a>
            <a href="#how">How It Works</a>
            <a href="#proof">Proof</a>
          </div>
          <div className="lin-nav-actions">
            <a href="#login" className="lin-nav-link">Log in</a>
            <button className="lin-nav-btn">Book a demo</button>
          </div>
        </div>
      </nav>

      <section className="lf-hero">
        <div className="lf-hero-copy">
          <h1 className="lf-hero-h1">
            Records live in systems.
            <br />
            <span className="lf-hero-accent">Work lives between them.</span>
          </h1>
          <p className="lf-hero-subtitle">
            Approval cycles, change control, document revisions, risk reviews. Cross-functional work, on one thread. For regulated processes.
          </p>
          <div className="lf-hero-cta">
            <button className="lf-btn-primary">
              Book a demo
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Gap animation: SoR / Unifize column / SoC. Auto-loops. */}
      <section className="lf-gap-section">
        <div
          ref={ref}
          className="lf-gap-stage"
          role="img"
          aria-label="Records and coordination work resolve into Unifize"
          style={{
            position: "relative",
            width: "100%",
            maxWidth: STAGE_W,
            aspectRatio: `${STAGE_W} / ${STAGE_H}`,
          }}
        >
          <div aria-hidden style={{
            position: "absolute",
            top: "16%", left: "50%", transform: "translateX(-50%)",
            width: "min(1500px, 95%)", height: "70%",
            background: "radial-gradient(ellipse at 50% 50%, rgba(92,146,255,0.10) 0%, rgba(92,146,255,0.04) 30%, transparent 70%)",
            pointerEvents: "none", filter: "blur(40px)", zIndex: 0,
          }} />
          <div aria-hidden style={{
            position: "absolute", top: 0, left: 0, width: STAGE_W, height: STAGE_H,
            transform: `scale(${scale})`, transformOrigin: "top left",
          }}>
            <Stage t={t} />
          </div>
        </div>
      </section>
    </div>
  );
}
