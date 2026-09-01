import { useEffect, useRef, useState, useLayoutEffect, type ReactNode, type CSSProperties } from "react";
import { Link } from "react-router-dom";

/* =============================================================================
 * THE GAP. Dark hero variant.
 *
 * First principles. This section must do three things in five seconds:
 *   1. Records live in one world (System of Record).
 *   2. Coordination lives in another (System of Coordination).
 *   3. The work between has no system. Unifize is the layer that holds it.
 *
 * Geometry. SoR and SoC sit on the left and right. Unifize is the vertical
 * column between them, taller than both, suggesting a deeper layer that the
 * two systems interface with. Items leak from both into the column area,
 * hover in the gap, then resolve as governed records inside the column.
 * ===========================================================================*/

// ── Palette ────────────────────────────────────────────────────────────────
const BG = "#0A0B11";
const BG_RAISED = "#13151E";
const SURFACE_GLASS = "rgba(255,255,255,0.035)";
const TOP_HIGHLIGHT = "rgba(255,255,255,0.08)";
const STROKE = "rgba(255,255,255,0.07)";
const STROKE_STRONG = "rgba(255,255,255,0.12)";
const TEXT = "#ECEEF6";
const TEXT_DIM = "#A0A6BD";
const TEXT_VDM = "#6B7187";
const ACCENT = "#8E96FF";
const ACCENT_DEEP = "#5860D6";
const ACCENT_SOFT = "rgba(142,150,255,0.14)";
const ACCENT_BORDER = "rgba(142,150,255,0.32)";
const WARM = "#F4B068";
const STATE_GREEN = "#5EE0A4";
const STATE_AMBER = "#F4B068";

// ── Stage geometry. Wider than the standard 1280 page width. ───────────────
const STAGE_W = 1680;
const STAGE_H = 720;

const SYS_W = 540;
const SYS_H = 420;
const SYS_TOP = 140;
const SOR_X = 100;
const SOR_RIGHT = SOR_X + SYS_W;            // 640
const SOC_X = STAGE_W - SOR_X - SYS_W;      // 1040

const GAP_LEFT = SOR_RIGHT;                 // 640
const GAP_RIGHT = SOC_X;                    // 1040
const GAP_WIDTH = GAP_RIGHT - GAP_LEFT;     // 400

// Unifize column. Centered in the gap, taller than the cards, so the eye
// reads it as a deeper layer the two systems interface with.
const COL_W = 280;
const COL_X = GAP_LEFT + (GAP_WIDTH - COL_W) / 2;   // 700
const COL_TOP = SYS_TOP - 40;                       // 100
const COL_HEIGHT = SYS_H + 80;                      // 500

// Captured-record rows inside the column.
const ROW_LEFT_PAD = 16;
const ROW_TOP_PAD = 90;
const ROW_W = COL_W - ROW_LEFT_PAD * 2;             // 248
const ROW_H = 48;
const ROW_GAP = 8;
const ROW_X = COL_X + ROW_LEFT_PAD;                 // 716

// ── Animation timeline ─────────────────────────────────────────────────────
const DURATION = 12;
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

// ── Items ──────────────────────────────────────────────────────────────────
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

const OWNER_PM_COLOR = "#7B9CE5";
const OWNER_KS_COLOR = "#B69CE5";
const OWNER_JT_COLOR = "#F4B068";

// Items hover in two loose columns inside the gap area at varied y. The
// scatter is intentional: while the column hasn't formed, the work has
// no place. Once Unifize forms, they resolve into ordered rows.
const ITEMS: VoidItem[] = [
  {
    id: 0, source: "sor", label: "CAPA owner?",
    recordType: "CAPA", stage: "Action plan", ownerInitials: "PM", ownerColor: OWNER_PM_COLOR,
    fromX: SOR_X + 380, fromY: SYS_TOP + 80,
    voidX: GAP_LEFT + 30, voidY: SYS_TOP + 30, voidRot: -8,
    rowIndex: 0,
  },
  {
    id: 1, source: "soc", label: "approval pending",
    recordType: "ECN", stage: "QA review", ownerInitials: "KS", ownerColor: OWNER_KS_COLOR,
    fromX: SOC_X + 90, fromY: SYS_TOP + 100,
    voidX: GAP_RIGHT - 162, voidY: SYS_TOP + 80, voidRot: 7,
    rowIndex: 1,
  },
  {
    id: 2, source: "sor", label: "root cause?",
    recordType: "DEV", stage: "Root cause", ownerInitials: "JT", ownerColor: OWNER_JT_COLOR,
    fromX: SOR_X + 400, fromY: SYS_TOP + 170,
    voidX: GAP_LEFT + 22, voidY: SYS_TOP + 150, voidRot: 5,
    rowIndex: 2,
  },
  {
    id: 3, source: "soc", label: "spec rev v3?",
    recordType: "DOC", stage: "In review", ownerInitials: "PM", ownerColor: OWNER_PM_COLOR,
    fromX: SOC_X + 100, fromY: SYS_TOP + 190,
    voidX: GAP_RIGHT - 158, voidY: SYS_TOP + 200, voidRot: -9,
    rowIndex: 3,
  },
  {
    id: 4, source: "sor", label: "scope drift",
    recordType: "ECN", stage: "Impact asmt", ownerInitials: "KS", ownerColor: OWNER_KS_COLOR,
    fromX: SOR_X + 360, fromY: SYS_TOP + 270,
    voidX: GAP_LEFT + 36, voidY: SYS_TOP + 280, voidRot: -4,
    rowIndex: 4,
  },
  {
    id: 5, source: "soc", label: "v4 comment lost",
    recordType: "DOC", stage: "Comments", ownerInitials: "KS", ownerColor: OWNER_KS_COLOR,
    fromX: SOC_X + 110, fromY: SYS_TOP + 290,
    voidX: GAP_RIGHT - 168, voidY: SYS_TOP + 340, voidRot: 8,
    rowIndex: 5,
  },
];

// ── Hooks ──────────────────────────────────────────────────────────────────
function useTime(duration: number, running: boolean, replayKey: number) {
  const [t, setT] = useState(0);
  const startRef = useRef<number | null>(null);
  const elapsedAtPauseRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    elapsedAtPauseRef.current = 0;
    setT(0);
  }, [replayKey, duration]);

  useEffect(() => {
    if (!running) {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (startRef.current != null) {
        const elapsedNow = (performance.now() - startRef.current) / 1000;
        elapsedAtPauseRef.current = Math.min(elapsedNow, duration);
      }
      startRef.current = null;
      return;
    }
    const tick = (now: number) => {
      if (startRef.current == null) {
        startRef.current = now - elapsedAtPauseRef.current * 1000;
      }
      const elapsed = (now - startRef.current) / 1000;
      const clamped = Math.min(elapsed, duration);
      setT(clamped);
      if (elapsed < duration) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [duration, running]);

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
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [stageW, stageH]);

  return { ref, scale };
}

// ── Glass surface ──────────────────────────────────────────────────────────
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
      ? "linear-gradient(180deg, rgba(142,150,255,0.06) 0%, transparent 60%)"
      : undefined;
  return (
    <div
      style={{
        position: "absolute",
        left, top, width, height,
        background: SURFACE_GLASS,
        backgroundImage: tint,
        border: `1px solid ${STROKE}`,
        borderRadius: 16,
        boxShadow: `inset 0 1px 0 ${TOP_HIGHLIGHT}, 0 24px 60px -24px rgba(0,0,0,0.55)`,
        opacity: dim ? 1 - dim * 0.18 : 1,
        transition: "opacity 0.4s ease",
        overflow: "hidden",
        zIndex: 5,
      }}
    >
      {children}
    </div>
  );
};

// ── System of Record ───────────────────────────────────────────────────────
type SoRRow = {
  id: string;
  title: string;
  state: string;
  stateColor: string;
  group: string;
};

const SOR_ROWS: SoRRow[] = [
  { id: "CAPA-2104", title: "Investigation closure", state: "In review", stateColor: STATE_AMBER, group: "Quality" },
  { id: "DEV-218", title: "Batch deviation, cycle 12", state: "Awaiting QA", stateColor: TEXT_DIM, group: "Production" },
  { id: "ECN-091", title: "Change order, BoM update", state: "Approved", stateColor: STATE_GREEN, group: "Engineering" },
];

const SoR = ({ dim }: { dim: number }) => (
  <GlassSurface left={SOR_X} top={SYS_TOP} width={SYS_W} height={SYS_H} accent="platform" dim={dim}>
    <div style={{ padding: "24px 28px 18px", borderBottom: `1px solid ${STROKE}` }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: TEXT, letterSpacing: "-0.022em" }}>
            System of Record
          </span>
          <span style={{ fontSize: 13, color: TEXT_DIM, letterSpacing: "-0.005em" }}>
            Forms, approvals, audit. Append-only.
          </span>
        </div>
        <span
          style={{
            fontSize: 11,
            color: TEXT_VDM,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontWeight: 600,
            paddingTop: 4,
          }}
        >
          SoR
        </span>
      </div>
    </div>
    <div style={{ padding: "10px 28px 18px" }}>
      {SOR_ROWS.map((r, i) => (
        <div
          key={r.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "16px 0",
            borderTop: i === 0 ? "none" : `1px solid ${STROKE}`,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: 3, background: r.stateColor, flexShrink: 0 }} />
          <span
            style={{
              fontSize: 12,
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              color: TEXT_DIM,
              letterSpacing: "0.04em",
              fontWeight: 500,
              flexShrink: 0,
            }}
          >
            {r.id}
          </span>
          <span
            style={{
              fontSize: 14,
              color: TEXT,
              fontWeight: 500,
              letterSpacing: "-0.008em",
              flex: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {r.title}
          </span>
          <span style={{ fontSize: 12, color: r.stateColor, fontWeight: 600, letterSpacing: "0.005em" }}>
            {r.state}
          </span>
        </div>
      ))}
    </div>
  </GlassSurface>
);

// ── System of Coordination ─────────────────────────────────────────────────
type SoCRow = {
  initials: string;
  avatar: string;
  sender: string;
  preview: string;
  channel: string;
  time: string;
  unread?: boolean;
};

const SOC_ROWS: SoCRow[] = [
  { initials: "JT", avatar: "#F4B068", sender: "Jamie Tarr", preview: "Re: ECN-091 release approval, please ack", channel: "Outlook", time: "2:14p", unread: true },
  { initials: "PM", avatar: "#7B9CE5", sender: "Priya M.", preview: "Spec rev v3 attached, can you take a look?", channel: "Teams", time: "11:42a" },
  { initials: "KS", avatar: "#B69CE5", sender: "Karim S.", preview: "Commented on spec_v3.xlsx, §4 needs a redline", channel: "SharePoint", time: "Yest." },
];

const SoC = ({ dim }: { dim: number }) => (
  <GlassSurface left={SOC_X} top={SYS_TOP} width={SYS_W} height={SYS_H} accent="warm" dim={dim}>
    <div style={{ padding: "24px 28px 18px", borderBottom: `1px solid ${STROKE}` }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: TEXT, letterSpacing: "-0.022em" }}>
            System of Coordination
          </span>
          <span style={{ fontSize: 13, color: TEXT_DIM, letterSpacing: "-0.005em" }}>
            Threads, files, notifications. Always live.
          </span>
        </div>
        <span
          style={{
            fontSize: 11,
            color: TEXT_VDM,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontWeight: 600,
            paddingTop: 4,
          }}
        >
          SoC
        </span>
      </div>
    </div>
    <div style={{ padding: "10px 28px 18px" }}>
      {SOC_ROWS.map((r, i) => (
        <div
          key={r.sender}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 0",
            borderTop: i === 0 ? "none" : `1px solid ${STROKE}`,
          }}
        >
          <span
            style={{
              width: 26, height: 26, borderRadius: 13,
              background: r.avatar,
              color: "#fff",
              fontSize: 10.5, fontWeight: 700,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {r.initials}
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 14,
                color: TEXT,
                letterSpacing: "-0.008em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: 1.35,
              }}
            >
              <span style={{ fontWeight: 600 }}>{r.sender}</span>{" "}
              <span style={{ color: TEXT_DIM }}>{r.preview}</span>
            </div>
            <div style={{ fontSize: 12, color: TEXT_VDM, letterSpacing: "-0.003em" }}>
              {r.channel}
            </div>
          </div>
          {r.unread && <span style={{ width: 6, height: 6, borderRadius: 3, background: WARM, flexShrink: 0 }} />}
          <span
            style={{
              fontSize: 12,
              color: TEXT_VDM,
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              letterSpacing: "0.02em",
              flexShrink: 0,
            }}
          >
            {r.time}
          </span>
        </div>
      ))}
    </div>
  </GlassSurface>
);

// ── Unifize column (vertical layer between SoR and SoC) ─────────────────────
const UnifizeColumn = ({ formP }: { formP: number }) => {
  if (formP <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: COL_X,
        top: COL_TOP,
        width: COL_W,
        height: COL_HEIGHT,
        background: "linear-gradient(180deg, rgba(142,150,255,0.10) 0%, rgba(142,150,255,0.04) 100%)",
        border: `1px solid ${ACCENT_BORDER}`,
        borderRadius: 16,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), 0 30px 80px -32px rgba(88,96,214,0.40)",
        opacity: formP,
        transform: `scaleY(${lerp(0.94, 1, formP)})`,
        transformOrigin: "top center",
        zIndex: 6,
        pointerEvents: "none",
      }}
    >
      {/* Subtle infrastructure dot grid */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)",
          opacity: 0.7,
        }}
      />
      {/* Column header */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 22,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            width: 30, height: 30, borderRadius: 8,
            background: ACCENT,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 6px 16px -4px ${ACCENT_DEEP}`,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 3v5A4.5 4.5 0 007 12.5 4.5 4.5 0 0011.5 8V3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
        <span style={{ fontSize: 14, fontWeight: 600, color: TEXT, letterSpacing: "-0.012em" }}>
          Unifize
        </span>
      </div>
    </div>
  );
};

// ── Floating items ─────────────────────────────────────────────────────────
type ItemState = {
  x: number;
  y: number;
  rot: number;
  opacity: number;
  scale: number;
  width: number;
  phase: "hidden" | "leaking" | "void" | "pulling" | "captured";
};

function getItemState(item: VoidItem, t: number): ItemState {
  const leakStart = T_LEAK_START + item.id * T_LEAK_STAGGER;
  const leakEnd = leakStart + T_LEAK_DURATION;
  const pullStart = T_PULL_START + item.id * T_PULL_STAGGER;
  const pullEnd = pullStart + T_PULL_DURATION;

  const toX = ROW_X;
  const toY = COL_TOP + ROW_TOP_PAD + item.rowIndex * (ROW_H + ROW_GAP);

  if (t < leakStart) {
    return { x: item.fromX, y: item.fromY, rot: 0, opacity: 0, scale: 0.85, width: 132, phase: "hidden" };
  }
  if (t < leakEnd) {
    const p = (t - leakStart) / (leakEnd - leakStart);
    const e = easeOutCubic(p);
    return {
      x: lerp(item.fromX, item.voidX, e),
      y: lerp(item.fromY, item.voidY, e),
      rot: lerp(0, item.voidRot, e),
      opacity: clamp01(p * 1.6),
      scale: lerp(0.9, 1, e),
      width: 132,
      phase: "leaking",
    };
  }
  if (t < pullStart) {
    const wob = (t - leakEnd) * 1.4;
    return {
      x: item.voidX + Math.sin(wob + item.id * 0.7) * 2.6,
      y: item.voidY + Math.cos(wob * 0.9 + item.id) * 2,
      rot: item.voidRot + Math.sin(wob * 0.7 + item.id) * 1.1,
      opacity: 1,
      scale: 1,
      width: 132,
      phase: "void",
    };
  }
  if (t < pullEnd) {
    const p = (t - pullStart) / (pullEnd - pullStart);
    const e = easeOutCubic(p);
    return {
      x: lerp(item.voidX, toX, e),
      y: lerp(item.voidY, toY, e),
      rot: lerp(item.voidRot, 0, e),
      opacity: 1,
      scale: 1,
      width: lerp(132, ROW_W, e),
      phase: "pulling",
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
    <div
      style={{
        position: "absolute",
        left: s.x,
        top: s.y,
        width: s.width,
        height,
        opacity: s.opacity,
        transform: `rotate(${s.rot}deg) scale(${s.scale})`,
        transformOrigin: "left center",
        background: captured ? BG_RAISED : "rgba(244,176,104,0.10)",
        border: `1px solid ${inVoid ? "rgba(244,176,104,0.45)" : "rgba(255,255,255,0.10)"}`,
        boxShadow: captured
          ? "0 12px 30px -12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)"
          : "0 8px 20px -8px rgba(244,176,104,0.32)",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        gap: captured ? 9 : 8,
        padding: captured ? "8px 10px" : "0 11px",
        zIndex: captured ? 7 : 9,
        pointerEvents: "none",
        transition: "border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease",
      }}
    >
      {captured ? (
        <>
          <span
            style={{
              fontSize: 9.5,
              fontWeight: 600,
              color: ACCENT,
              background: ACCENT_SOFT,
              border: `1px solid ${ACCENT_BORDER}`,
              borderRadius: 4,
              padding: "2px 6px",
              letterSpacing: "0.06em",
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              flexShrink: 0,
            }}
          >
            {item.recordType}
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 1, flex: 1, minWidth: 0 }}>
            <span
              style={{
                fontSize: 11.5,
                color: TEXT,
                fontWeight: 500,
                letterSpacing: "-0.008em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {item.stage}
            </span>
            <span style={{ fontSize: 9.5, color: TEXT_VDM, letterSpacing: "-0.003em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {item.label}
            </span>
          </div>
          <span
            style={{
              width: 20, height: 20, borderRadius: 10,
              background: item.ownerColor,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              color: "#fff",
              fontSize: 8.5, fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {item.ownerInitials}
          </span>
        </>
      ) : (
        <>
          <span style={{ width: 5, height: 5, borderRadius: 3, background: WARM, flexShrink: 0 }} />
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: WARM,
              letterSpacing: "-0.005em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              flex: 1,
            }}
          >
            {item.label}
          </span>
        </>
      )}
    </div>
  );
};

// ── The void (between systems, before column forms) ────────────────────────
const VoidSpace = ({ op, labelOp }: { op: number; labelOp: number }) => {
  if (op <= 0) return null;
  const left = GAP_LEFT + 20;
  const top = SYS_TOP + 10;
  const width = GAP_WIDTH - 40;
  const height = SYS_H - 20;
  return (
    <div
      style={{
        position: "absolute",
        left, top, width, height,
        opacity: op * 0.95,
        zIndex: 3,
        pointerEvents: "none",
        border: "1px dashed rgba(244,176,104,0.30)",
        borderRadius: 14,
        background: `repeating-linear-gradient(135deg,
          rgba(244,176,104,0.04) 0px,
          rgba(244,176,104,0.04) 5px,
          transparent 5px,
          transparent 16px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -28,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "-0.005em",
          color: WARM,
          opacity: labelOp,
          transition: "opacity 0.3s ease",
        }}
      >
        No system. No owner.
      </div>
    </div>
  );
};

// ── Subtext (single live caption) ──────────────────────────────────────────
const Subtext = ({ text, color, op }: { text: ReactNode; color: string; op: number }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: SYS_TOP + SYS_H + 50,
      textAlign: "center",
      zIndex: 14,
      opacity: op,
      transition: "opacity 0.3s ease",
      pointerEvents: "none",
    }}
  >
    <span style={{ fontSize: 16, fontWeight: 500, color, letterSpacing: "-0.012em" }}>{text}</span>
  </div>
);

// ── Stage ──────────────────────────────────────────────────────────────────
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
    <div
      style={{
        position: "absolute",
        inset: 0,
        fontFamily: "'Inter Tight', 'Inter', sans-serif",
      }}
    >
      <Subtext text="No system owns the work between." color={WARM} op={subAOp} />
      <Subtext text="Unifize is the layer between." color={ACCENT} op={subBOp} />

      <SoR dim={cardLoss} />
      <SoC dim={cardLoss} />

      <VoidSpace
        op={hatchOp}
        labelOp={hatchOp <= HATCH_FLOOR + 0.001 ? 0 : clamp01((hatchOp - HATCH_FLOOR) / (1 - HATCH_FLOOR))}
      />
      <UnifizeColumn formP={formP} />

      {ITEMS.map((item) => (
        <FloatingItem key={item.id} item={item} t={t} />
      ))}
    </div>
  );
};

// ── Page ───────────────────────────────────────────────────────────────────
export default function HomeSoRSoCGapV2() {
  const [replayKey, setReplayKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const { ref, scale } = useStageScale(STAGE_W, STAGE_H);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setPrefersReducedMotion(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  const running = !paused && !prefersReducedMotion;
  const tRaw = useTime(DURATION, running, replayKey);
  const t = prefersReducedMotion ? DURATION : tRaw;

  useEffect(() => {
    document.title = "The Gap · Unifize";
  }, []);

  const progress = Math.min(1, t / DURATION);
  const sceneLabel =
    t < T_VOID_HOLD_END
      ? "Work falls into the gap"
      : t < T_PULL_END
      ? "Unifize catches it"
      : "The layer is governed";
  const barColor = t < T_VOID_HOLD_END ? WARM : ACCENT;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG,
        color: TEXT,
        fontFamily: "'Inter Tight', 'Inter', sans-serif",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 60,
          backdropFilter: "saturate(140%) blur(14px)",
          background: "rgba(10,11,17,0.72)",
          borderBottom: `1px solid ${STROKE}`,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 28px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, color: TEXT, textDecoration: "none" }}>
            <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.025em" }}>
              unifize<span style={{ color: ACCENT }}>.</span>
            </span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 13, color: TEXT_DIM, fontWeight: 500, letterSpacing: "-0.005em" }}>
              {sceneLabel}
            </span>
            <button
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Play animation" : "Pause animation"}
              aria-pressed={paused}
              disabled={prefersReducedMotion}
              style={{
                appearance: "none",
                background: "transparent",
                color: TEXT_DIM,
                border: `1px solid ${STROKE_STRONG}`,
                borderRadius: 8,
                padding: "8px 14px",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "-0.005em",
                cursor: prefersReducedMotion ? "not-allowed" : "pointer",
                opacity: prefersReducedMotion ? 0.4 : 1,
                fontFamily: "inherit",
                minHeight: 34,
              }}
            >
              {paused ? "Play" : "Pause"}
            </button>
            <button
              onClick={() => {
                setPaused(false);
                setReplayKey((k) => k + 1);
              }}
              aria-label="Replay animation from the start"
              style={{
                appearance: "none",
                background: TEXT,
                color: BG,
                border: `1px solid ${TEXT}`,
                borderRadius: 8,
                padding: "8px 14px",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "-0.005em",
                cursor: "pointer",
                fontFamily: "inherit",
                minHeight: 34,
              }}
            >
              Replay
            </button>
          </div>
        </div>
      </nav>

      <section
        style={{
          position: "relative",
          width: "100%",
          padding: "88px 0 120px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: BG,
          overflow: "hidden",
        }}
      >
        {/* Soft hero glow centered behind the column */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 200,
            left: "50%",
            transform: "translateX(-50%)",
            width: 1500,
            height: 620,
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(142,150,255,0.10) 0%, rgba(142,150,255,0.04) 30%, transparent 70%)",
            pointerEvents: "none",
            filter: "blur(40px)",
          }}
        />

        {/* Thesis copy at standard page width */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: 1080,
            padding: "0 24px",
            textAlign: "center",
            marginBottom: 48,
          }}
        >
          <div
            style={{
              fontSize: 48,
              fontWeight: 500,
              color: TEXT,
              letterSpacing: "-0.03em",
              lineHeight: 1.12,
            }}
          >
            The work that matters doesn’t live in <span style={{ color: ACCENT, fontWeight: 600 }}>a system</span>.{" "}
            <span style={{ color: WARM, fontWeight: 600 }}>It lives between them.</span>
          </div>
        </div>

        {/* Stage. Wider than page content. */}
        <div
          ref={ref}
          role="img"
          aria-labelledby="gap-thesis-title"
          aria-describedby="gap-thesis-desc"
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: STAGE_W,
            aspectRatio: `${STAGE_W} / ${STAGE_H}`,
            padding: "0 24px",
          }}
        >
          <h2 id="gap-thesis-title" style={visuallyHidden}>
            The work that matters lives between the systems.
          </h2>
          <p id="gap-thesis-desc" style={visuallyHidden}>
            Records live in your system of record. Coordination lives in chat,
            email, and shared files. The work between them, owner unclear,
            decision blocked, root cause unknown, has no system. Unifize is the
            layer between, every record typed at a workflow stage with an
            accountable owner.
          </p>
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: STAGE_W,
              height: STAGE_H,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <Stage t={t} />
          </div>
        </div>

        {/* Progress + timecode at page width */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: 1280,
            padding: "0 28px",
            marginTop: 28,
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: TEXT_VDM,
            fontSize: 12,
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            letterSpacing: "0.02em",
          }}
        >
          <span>00:{String(Math.floor(t)).padStart(2, "0")}</span>
          <div
            style={{
              flex: 1,
              height: 2,
              background: "rgba(255,255,255,0.08)",
              borderRadius: 1,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                width: `${progress * 100}%`,
                background: barColor,
                transition: "background 0.4s ease",
              }}
            />
          </div>
          <span>00:{String(DURATION).padStart(2, "0")}</span>
        </div>
      </section>
    </div>
  );
}

const visuallyHidden: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap",
  border: 0,
};
