// V2 — Hero iso frame, two static states.
//
// Phase 1 ("Without Unifize") and Phase 2 ("With Unifize") render
// the same SoC + SoR floor; Phase 2 adds the Unifize band, the
// cream thread tiles, the lavender capture + cream writeback
// arrows, and the anchored human. The toggle is user-driven (no
// scroll activation, no auto-reveal): each state is a complete
// static frame in its own right and can be screenshot-tested.

import { useId, useState, type CSSProperties } from "react";

// ── Iso projection ────────────────────────────────────
// True isometric, 30° rotation. World axes:
//   u: floor axis going screen-up-right
//   v: floor axis going screen-up-left
//   w: vertical, +w goes screen-up
// Camera sits at (-u, -v, +w) so visible faces have normals -u, -v, +w.
const COS30 = Math.cos(Math.PI / 6);
const SIN30 = 0.5;
const UNIT = 36; // pixels per world unit

const VB_W = 1920;
const VB_H = 820;
const CX = VB_W / 2;
const FLOOR_Y = 600;

type Pt = [number, number];

const proj = (u: number, v: number, w: number): Pt => [
  CX + (u - v) * COS30 * UNIT,
  FLOOR_Y - (u + v) * SIN30 * UNIT - w * UNIT,
];

const poly = (pts: Pt[]) =>
  pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

// ── Tokens ────────────────────────────────────────────
// Constraint 4: Unifize blue is reserved. No SoR cube, no SoC tile,
// no record gets this colour.
const UNIFIZE_BLUE = "#0052FF";
const UNIFIZE_BLUE_TOP = "#3D7AFF";
const UNIFIZE_BLUE_FRONT = "#1A5AFF";
const UNIFIZE_BLUE_RIGHT = "#0040C9";

// SoR cubes — flat neutral grey (Constraint 3). All four identical
// in colour so no record reads as a special case.
const SOR_TOP = "#3A3D45";
const SOR_FRONT = "#2A2D35";
const SOR_RIGHT = "#1E2027";

// Thread tiles — cream, the captured evidence living on Unifize
// (Constraint 2, Constraint 6).
const THREAD_TOP = "#F1E4C9";
const THREAD_FRONT = "#D9C7A5";
const THREAD_RIGHT = "#B59E78";

// SoC silhouettes — recognisable brand greys, no colour.
const SOC_FILL = "#1F2128";
const SOC_EDGE = "#2E3038";
const SOC_LABEL = "#9A9DA6";

// Capture arrows lavender, write-back arrows cream.
const LAVENDER = "#B7A7E8";
const LAVENDER_DIM = "#7E70B5";
const CREAM_ARROW = "#E8D8B0";

// Severity colours used by the HTML annotation overlay (Constraint 10).
const SEV_RED = "#E5484D";
const SEV_AMBER = "#F59E0B";

// Floor grid / ambient.
const FLOOR_GRID = "rgba(255,255,255,0.04)";
const VOID_HATCH = "rgba(255,255,255,0.06)";

// ── Generic iso cuboid ────────────────────────────────
interface Faces {
  top: Pt[];
  left: Pt[];
  front: Pt[];
}

function cuboid(u0: number, u1: number, v0: number, v1: number, w0: number, w1: number): Faces {
  return {
    top: [
      proj(u0, v1, w1),
      proj(u1, v1, w1),
      proj(u1, v0, w1),
      proj(u0, v0, w1),
    ],
    left: [
      proj(u0, v0, w1),
      proj(u0, v1, w1),
      proj(u0, v1, w0),
      proj(u0, v0, w0),
    ],
    front: [
      proj(u0, v0, w1),
      proj(u1, v0, w1),
      proj(u1, v0, w0),
      proj(u0, v0, w0),
    ],
  };
}

// ── SoR cube ──────────────────────────────────────────
// Neutral grey, labelled QMS / DMS / ERP / PLM. The label sits on the
// front face so the eye reads "that's the QMS box" without colour.
const SorCube = ({
  u0, u1, v0, v1, w0, w1, label,
}: { u0: number; u1: number; v0: number; v1: number; w0: number; w1: number; label: string }) => {
  const f = cuboid(u0, u1, v0, v1, w0, w1);
  const anchor = f.front[0];
  const labelMatrix = `matrix(${COS30}, ${-SIN30}, 0, 1, ${anchor[0]}, ${anchor[1]})`;
  const labelDx = (u1 - u0) * UNIT * 0.5 - 14;
  const labelDy = (w1 - w0) * UNIT * 0.5;
  return (
    <g>
      <polygon points={poly(f.top)} fill={SOR_TOP} />
      <polygon points={poly(f.left)} fill={SOR_RIGHT} />
      <polygon points={poly(f.front)} fill={SOR_FRONT} />
      <polyline
        points={poly([...f.top, f.top[0]])}
        fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={1}
      />
      <polyline
        points={poly([...f.front, f.front[0]])}
        fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={1}
      />
      <polyline
        points={poly([...f.left, f.left[0]])}
        fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={1}
      />
      <text
        x={labelDx}
        y={labelDy}
        transform={labelMatrix}
        textAnchor="start"
        dominantBaseline="middle"
        fill="rgba(230,232,238,0.95)"
        fontFamily="'JetBrains Mono', ui-monospace, monospace"
        fontSize={15}
        fontWeight={500}
        letterSpacing={1.4}
      >
        {label}
      </text>
    </g>
  );
};

// ── Unifize band ──────────────────────────────────────
// The dominant central object. Brand blue (Constraint 4). Raised
// off the floor so its top surface carries the thread tiles.
const UnifizeBand = ({
  u0, u1, v0, v1, w0, w1,
}: { u0: number; u1: number; v0: number; v1: number; w0: number; w1: number }) => {
  const f = cuboid(u0, u1, v0, v1, w0, w1);
  return (
    <g>
      {/* Soft blue floor halo under the band, sells "this is the layer". */}
      <ellipse
        cx={proj((u0 + u1) / 2, (v0 + v1) / 2, 0)[0]}
        cy={proj((u0 + u1) / 2, (v0 + v1) / 2, 0)[1] + 18}
        rx={(u1 - u0) * COS30 * UNIT * 0.78}
        ry={(u1 - u0) * SIN30 * UNIT * 0.38}
        fill="url(#unifize-halo)"
      />
      <polygon points={poly(f.left)} fill={UNIFIZE_BLUE_RIGHT} />
      <polygon points={poly(f.front)} fill={UNIFIZE_BLUE_FRONT} />
      <polygon points={poly(f.top)} fill={UNIFIZE_BLUE_TOP} />
      {/* Internal stack lines on the front face — sells "layered
          governed records" rather than a featureless slab. */}
      {(() => {
        const lines: { a: Pt; b: Pt }[] = [];
        for (let i = 1; i < 4; i++) {
          const wL = w0 + ((w1 - w0) * i) / 4;
          lines.push({ a: proj(u0, v0, wL), b: proj(u1, v0, wL) });
        }
        return lines.map((l, i) => (
          <line key={`uf-stack-${i}`} x1={l.a[0]} y1={l.a[1]} x2={l.b[0]} y2={l.b[1]} stroke="rgba(255,255,255,0.12)" strokeWidth={0.8} />
        ));
      })()}
      {/* Edge highlights. */}
      <polyline
        points={poly([...f.top, f.top[0]])}
        fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth={1.4}
      />
      <polyline
        points={poly([...f.front, f.front[0]])}
        fill="none" stroke="rgba(255,255,255,0.26)" strokeWidth={1.1}
      />
      <polyline
        points={poly([...f.left, f.left[0]])}
        fill="none" stroke="rgba(255,255,255,0.26)" strokeWidth={1.1}
      />
      {/* Mono UNIFIZE label on the front face. */}
      <text
        x={(u1 - u0) * UNIT * 0.5 - 44}
        y={(w1 - w0) * UNIT * 0.5}
        transform={`matrix(${COS30}, ${-SIN30}, 0, 1, ${f.front[0][0]}, ${f.front[0][1]})`}
        textAnchor="start"
        dominantBaseline="middle"
        fill="rgba(255,255,255,0.96)"
        fontFamily="'JetBrains Mono', ui-monospace, monospace"
        fontSize={18}
        fontWeight={500}
        letterSpacing={3.8}
      >
        UNIFIZE
      </text>
    </g>
  );
};

// ── Thread tile ───────────────────────────────────────
// Cream evidence tile sitting on the Unifize band's top surface
// (Constraint 2: evidence lives on Unifize, never below SoR).
// Each tile carries a thread reference label so the eye reads "CR-241"
// or "DOC-114" as a real record, not decoration.
const ThreadTile = ({
  u0, u1, v0, v1, wBase, thick, label, pulseDelay,
}: {
  u0: number; u1: number; v0: number; v1: number;
  wBase: number; thick: number; label: string; pulseDelay: number;
}) => {
  const f = cuboid(u0, u1, v0, v1, wBase, wBase + thick);
  return (
    <g
      className="v2-thread"
      style={{ animationDelay: `${pulseDelay}s` } as CSSProperties}
    >
      <polygon points={poly(f.left)} fill={THREAD_RIGHT} />
      <polygon points={poly(f.front)} fill={THREAD_FRONT} />
      <polygon points={poly(f.top)} fill={THREAD_TOP} />
      <polyline
        points={poly([...f.top, f.top[0]])}
        fill="none" stroke="rgba(0,0,0,0.32)" strokeWidth={1}
      />
      {/* Record-row lines on the top surface so each thread tile reads
          as "a stacked record with status rows", not a blank cream tile. */}
      {(() => {
        const a = proj(u0 + 0.2, v0 + 0.45, wBase + thick);
        const b = proj(u1 - 0.2, v0 + 0.45, wBase + thick);
        const c = proj(u0 + 0.2, v0 + 0.95, wBase + thick);
        const d = proj(u1 - 0.2, v0 + 0.95, wBase + thick);
        return (
          <g>
            <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="rgba(40,30,12,0.32)" strokeWidth={0.9} />
            <line x1={c[0]} y1={c[1]} x2={d[0]} y2={d[1]} stroke="rgba(40,30,12,0.22)" strokeWidth={0.9} />
            {/* Green status pip — "this thread closed" cue. */}
            <circle cx={a[0] - 4} cy={a[1]} r={2.6} fill="#1F9B5A" />
          </g>
        );
      })()}
      {/* Thread reference, monospace, dark on cream. */}
      <text
        x={proj((u0 + u1) / 2, (v0 + v1) / 2, wBase + thick)[0]}
        y={proj((u0 + u1) / 2, (v0 + v1) / 2, wBase + thick)[1] + 18}
        textAnchor="middle"
        fill="rgba(30,22,8,0.88)"
        fontFamily="'JetBrains Mono', ui-monospace, monospace"
        fontSize={16}
        fontWeight={700}
        letterSpacing={1.4}
      >
        {label}
      </text>
    </g>
  );
};

// ── SoC silhouette tiles ──────────────────────────────
// Recognisable brand silhouettes — Outlook envelope, Teams chat,
// Excel grid, Word doc, calendar. Rendered as small iso slabs with a
// glyph etched into the top face. Identical neutral palette so the
// eye reads "tools, not records". This is the SoC pile carrying the
// "lived reality" half of the story.
type SocKind = "envelope" | "chat" | "excel" | "doc" | "calendar";

const SocTile = ({
  u, v, w, kind, label,
}: { u: number; v: number; w: number; kind: SocKind; label: string }) => {
  const SIZE = 2.6;
  const THICK = 0.42;
  const f = cuboid(u, u + SIZE, v, v + SIZE, w, w + THICK);
  const topCenter = proj(u + SIZE / 2, v + SIZE / 2, w + THICK);
  const glyph = renderGlyph(kind, topCenter);
  return (
    <g>
      <polygon points={poly(f.left)} fill={SOC_EDGE} />
      <polygon points={poly(f.front)} fill={SOC_FILL} />
      <polygon points={poly(f.top)} fill="#2B2E37" />
      <polyline
        points={poly([...f.top, f.top[0]])}
        fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={0.9}
      />
      {glyph}
      <text
        x={proj(u, v + SIZE, w + THICK)[0] - 4}
        y={proj(u, v + SIZE, w + THICK)[1] + 18}
        textAnchor="start"
        fill="rgba(235,237,242,0.98)"
        fontFamily="'JetBrains Mono', ui-monospace, monospace"
        fontSize={17}
        letterSpacing={1.6}
        fontWeight={500}
      >
        {label}
      </text>
    </g>
  );
};

function renderGlyph(kind: SocKind, c: Pt) {
  const [cx, cy] = c;
  const s = 19;
  const stroke = "rgba(220,222,228,0.78)";
  switch (kind) {
    case "envelope":
      return (
        <g fill="none" stroke={stroke} strokeWidth={1.1} strokeLinecap="round">
          <rect x={cx - s} y={cy - s * 0.55} width={s * 2} height={s * 1.1} rx={1} />
          <polyline points={`${cx - s},${cy - s * 0.55} ${cx},${cy + 1} ${cx + s},${cy - s * 0.55}`} />
        </g>
      );
    case "chat":
      return (
        <g fill="none" stroke={stroke} strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round">
          <path
            d={`M ${cx - s} ${cy - s * 0.5} Q ${cx - s} ${cy - s} ${cx - s * 0.5} ${cy - s}
                L ${cx + s * 0.6} ${cy - s} Q ${cx + s} ${cy - s} ${cx + s} ${cy - s * 0.5}
                L ${cx + s} ${cy + s * 0.2} Q ${cx + s} ${cy + s * 0.7} ${cx + s * 0.55} ${cy + s * 0.7}
                L ${cx - s * 0.2} ${cy + s * 0.7} L ${cx - s * 0.5} ${cy + s} L ${cx - s * 0.35} ${cy + s * 0.7}
                Q ${cx - s} ${cy + s * 0.7} ${cx - s} ${cy + s * 0.2} Z`}
          />
        </g>
      );
    case "excel":
      return (
        <g fill="none" stroke={stroke} strokeWidth={1} strokeLinejoin="round">
          <rect x={cx - s * 0.95} y={cy - s * 0.7} width={s * 1.9} height={s * 1.4} rx={1.5} />
          <line x1={cx - s * 0.95} y1={cy - s * 0.23} x2={cx + s * 0.95} y2={cy - s * 0.23} />
          <line x1={cx - s * 0.95} y1={cy + s * 0.23} x2={cx + s * 0.95} y2={cy + s * 0.23} />
          <line x1={cx - s * 0.32} y1={cy - s * 0.7} x2={cx - s * 0.32} y2={cy + s * 0.7} />
          <line x1={cx + s * 0.32} y1={cy - s * 0.7} x2={cx + s * 0.32} y2={cy + s * 0.7} />
        </g>
      );
    case "doc":
      return (
        <g fill="none" stroke={stroke} strokeWidth={1.1} strokeLinejoin="round" strokeLinecap="round">
          <path d={`M ${cx - s * 0.7} ${cy - s * 0.9} L ${cx + s * 0.3} ${cy - s * 0.9}
                    L ${cx + s * 0.7} ${cy - s * 0.55} L ${cx + s * 0.7} ${cy + s * 0.9}
                    L ${cx - s * 0.7} ${cy + s * 0.9} Z`} />
          <polyline points={`${cx + s * 0.3},${cy - s * 0.9} ${cx + s * 0.3},${cy - s * 0.55} ${cx + s * 0.7},${cy - s * 0.55}`} />
          <line x1={cx - s * 0.45} y1={cy - s * 0.18} x2={cx + s * 0.45} y2={cy - s * 0.18} />
          <line x1={cx - s * 0.45} y1={cy + s * 0.15} x2={cx + s * 0.45} y2={cy + s * 0.15} />
          <line x1={cx - s * 0.45} y1={cy + s * 0.48} x2={cx + s * 0.2} y2={cy + s * 0.48} />
        </g>
      );
    case "calendar":
      return (
        <g fill="none" stroke={stroke} strokeWidth={1} strokeLinejoin="round">
          <rect x={cx - s * 0.85} y={cy - s * 0.7} width={s * 1.7} height={s * 1.4} rx={1.5} />
          <line x1={cx - s * 0.85} y1={cy - s * 0.3} x2={cx + s * 0.85} y2={cy - s * 0.3} />
          <circle cx={cx - s * 0.4} cy={cy - s * 0.85} r={1.6} fill={stroke} />
          <circle cx={cx + s * 0.4} cy={cy - s * 0.85} r={1.6} fill={stroke} />
          <rect x={cx - s * 0.55} y={cy + s * 0.05} width={s * 0.3} height={s * 0.3} fill={stroke} stroke="none" />
        </g>
      );
  }
}

// ── Human figure ──────────────────────────────────────
// Low-poly silhouette. Three figures total (Constraint 9). Drawn in
// screen space at the projected anchor so they don't slant into iso.
// The slight forward lean reads as "heads-down on email" / "mid-handoff".
const Human = ({ u, v, w, posture, scale = 1.85, halo = false }: {
  u: number; v: number; w: number;
  posture: "heads-down" | "handoff" | "anchored";
  scale?: number;
  halo?: boolean;
}) => {
  const [x, y] = proj(u, v, w);
  const HEIGHT = 52 * scale;
  const fill = "#F1F2F6";
  const dim = "#B5B8C0";
  // Posture deltas — small head/torso angles to read intent.
  const cfg = {
    "heads-down":  { headDx: -3, headDy: -HEIGHT + 4, torsoLean: -4 },
    "handoff":     { headDx:  4, headDy: -HEIGHT + 5, torsoLean:  3 },
    "anchored":    { headDx:  0, headDy: -HEIGHT + 3, torsoLean:  0 },
  }[posture];
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Blue floor halo for the anchored figure — visually ties them
          to the Unifize band so the "people on the layer" beat lands. */}
      {halo && (
        <ellipse cx={0} cy={1} rx={16} ry={4.5} fill="rgba(0,82,255,0.45)" />
      )}
      {/* Ground shadow ellipse with smoother blend. */}
      <ellipse cx={0} cy={0} rx={11} ry={2.8} fill="rgba(0,0,0,0.45)" filter="url(#shadow-blur)" />
      {/* Legs (two thin bars). */}
      <rect x={-4.5} y={-HEIGHT * 0.46} width={3.4} height={HEIGHT * 0.46} fill={dim} rx={1} />
      <rect x={1.1} y={-HEIGHT * 0.46} width={3.4} height={HEIGHT * 0.46} fill={dim} rx={1} />
      {/* Torso with slight lean. */}
      <path
        d={`M ${-8 + cfg.torsoLean * 0.3} ${-HEIGHT * 0.46}
            L ${8 + cfg.torsoLean * 0.3} ${-HEIGHT * 0.46}
            L ${7 + cfg.torsoLean} ${-HEIGHT * 0.80}
            L ${-7 + cfg.torsoLean} ${-HEIGHT * 0.80} Z`}
        fill={fill}
      />
      {/* Head. */}
      <circle cx={cfg.headDx} cy={cfg.headDy} r={6.6} fill={fill} />
      {/* Slight outline on torso to lift it off the band. */}
      <path
        d={`M ${-8 + cfg.torsoLean * 0.3} ${-HEIGHT * 0.46}
            L ${8 + cfg.torsoLean * 0.3} ${-HEIGHT * 0.46}
            L ${7 + cfg.torsoLean} ${-HEIGHT * 0.80}
            L ${-7 + cfg.torsoLean} ${-HEIGHT * 0.80} Z`}
        fill="none"
        stroke="rgba(0,0,0,0.4)"
        strokeWidth={0.7}
      />
    </g>
  );
};

// ── Capture arrow (SoC → Unifize) ─────────────────────
// Lavender bezier. Subtle dashed shimmer animation. Starts above the
// SoC tile and lands on a thread tile.
const CaptureArrow = ({
  from, to, delay = 0,
}: { from: Pt; to: Pt; delay?: number }) => {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const ctrl1: Pt = [from[0] + dx * 0.25, from[1] - 110];
  const ctrl2: Pt = [from[0] + dx * 0.7, to[1] - 60];
  const d = `M ${from[0]} ${from[1]} C ${ctrl1[0]} ${ctrl1[1]}, ${ctrl2[0]} ${ctrl2[1]}, ${to[0]} ${to[1]}`;
  const angle = Math.atan2(to[1] - ctrl2[1], to[0] - ctrl2[0]) * (180 / Math.PI);
  return (
    <g>
      <path d={d} fill="none" stroke={LAVENDER_DIM} strokeWidth={1.3} opacity={0.5} />
      <path
        d={d}
        fill="none"
        stroke={LAVENDER}
        strokeWidth={1.6}
        strokeDasharray="6 7"
        className="v2-capture-shimmer"
        style={{ animationDelay: `${delay}s` } as CSSProperties}
      />
      {/* Arrowhead at landing point. */}
      <g transform={`translate(${to[0]},${to[1]}) rotate(${angle})`}>
        <polygon points="0,0 -7,-3.5 -7,3.5" fill={LAVENDER} />
      </g>
      {/* Origin pip. */}
      <circle cx={from[0]} cy={from[1]} r={2.6} fill={LAVENDER} />
    </g>
  );
};

// ── Write-back arrow (Unifize → SoR) ──────────────────
// Cream bezier flowing the other direction. Same animation grammar,
// solid stroke (the writeback is the deterministic half).
const WriteBackArrow = ({ from, to, delay = 0 }: { from: Pt; to: Pt; delay?: number }) => {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const ctrl1: Pt = [from[0] + dx * 0.35, from[1] - 60];
  const ctrl2: Pt = [from[0] + dx * 0.7, to[1] - 36];
  const d = `M ${from[0]} ${from[1]} C ${ctrl1[0]} ${ctrl1[1]}, ${ctrl2[0]} ${ctrl2[1]}, ${to[0]} ${to[1]}`;
  const angle = Math.atan2(to[1] - ctrl2[1], to[0] - ctrl2[0]) * (180 / Math.PI);
  return (
    <g>
      <path d={d} fill="none" stroke={CREAM_ARROW} strokeWidth={1.4} opacity={0.85} />
      <path
        d={d}
        fill="none"
        stroke={CREAM_ARROW}
        strokeWidth={1.1}
        strokeDasharray="3 6"
        className="v2-capture-shimmer"
        style={{ animationDelay: `${delay}s`, opacity: 0.8 } as CSSProperties}
      />
      <g transform={`translate(${to[0]},${to[1]}) rotate(${angle})`}>
        <polygon points="0,0 -7,-3.5 -7,3.5" fill={CREAM_ARROW} />
      </g>
      <circle cx={from[0]} cy={from[1]} r={2.4} fill={CREAM_ARROW} />
    </g>
  );
};

// ── Floor grid + void hatch ───────────────────────────
const Floor = () => {
  const U_MIN = -16, U_MAX = 16;
  const V_MIN = -12, V_MAX = 14;
  const STEP = 2;
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let v = V_MIN; v <= V_MAX; v += STEP) {
    const a = proj(U_MIN, v, 0);
    const b = proj(U_MAX, v, 0);
    lines.push({ x1: a[0], y1: a[1], x2: b[0], y2: b[1] });
  }
  for (let u = U_MIN; u <= U_MAX; u += STEP) {
    const a = proj(u, V_MIN, 0);
    const b = proj(u, V_MAX, 0);
    lines.push({ x1: a[0], y1: a[1], x2: b[0], y2: b[1] });
  }
  return (
    <g stroke={FLOOR_GRID} strokeWidth={0.9}>
      {lines.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
      ))}
    </g>
  );
};

// Hatched void between SoC and Unifize — the gap where coordination
// work happens off-record. Subtle diagonal hatch on a soft floor band.
const VoidHatch = () => {
  // Hatch is a clipped band of diagonal lines projected onto the floor
  // between SoC zone and Unifize.
  const f = cuboid(-7, -1.5, 1.5, 8, 0, 0);
  return (
    <g>
      <polygon points={poly(f.top)} fill="rgba(255,255,255,0.025)" />
      <polygon
        points={poly(f.top)}
        fill="url(#void-hatch-pattern)"
        opacity={0.5}
      />
    </g>
  );
};

// ── Composition ───────────────────────────────────────
// Hardcoded world-space coordinates, picked so SoC sits screen-left,
// SoR screen-right at roughly the same screen Y, Unifize in the
// middle and slightly raised. All values used by HTML annotation
// overlay too — kept in one place.
const LAYOUT = {
  unifize: { u0: -3, u1: 5, v0: -3, v1: 5, w0: 0, w1: 1.8 },
  threads: [
    { u0: -2.4, u1: -0.4, v0: -2.4, v1: -0.2, label: "CR-241", delay: 0 },
    { u0: -0.0, u1: 2.0,  v0: -1.2, v1: 1.2,  label: "DOC-114", delay: 0.8 },
    { u0: 2.2,  u1: 4.2,  v0: -2.5, v1: -0.4, label: "ECO-77",  delay: 1.6 },
    { u0: 0.4,  u1: 2.2,  v0: 1.6,  v1: 3.6,  label: "AUDIT-09", delay: 2.4 },
  ],
  sor: [
    { u0: 7,  u1: 9,  v0: -5, v1: -3, w0: 0, w1: 2.6, label: "QMS" },
    { u0: 10.5, u1: 12.5, v0: -5, v1: -3, w0: 0, w1: 2.0, label: "DMS" },
    { u0: 7,  u1: 9,  v0: -2, v1: 0, w0: 0, w1: 2.2, label: "ERP" },
    { u0: 10.5, u1: 12.5, v0: -2, v1: 0, w0: 0, w1: 2.4, label: "PLM" },
  ],
  soc: [
    { u: -9.5,  v: 4.2, w: 0,    kind: "envelope" as const, label: "OUTLOOK" },
    { u: -12,   v: 7,   w: 0,    kind: "chat"     as const, label: "TEAMS" },
    { u: -9.5,  v: 8.0, w: 0,    kind: "excel"    as const, label: "EXCEL" },
    { u: -12.5, v: 4,   w: 0,    kind: "doc"      as const, label: "DOC" },
    { u: -9.5,  v: 4.2, w: 0.42, kind: "calendar" as const, label: "CAL" },
    { u: -7,    v: 6.5, w: 0,    kind: "doc"      as const, label: "DOC v17" },
  ],
  humans: [
    { u: -10.0, v: 6.5,  w: 0,         posture: "heads-down" as const, halo: false },
    { u: -2.0,  v: 4.5,  w: 0,         posture: "handoff"    as const, halo: false },
    { u: 2.6,   v: 1.2,  w: 1.8 + 0.22, posture: "anchored"  as const, halo: true  },
  ],
  // Annotation card screen offsets are tuned so the three callouts
  // span across SoC pile, gap, and the band — they read as "these
  // happen everywhere on a normal day," not "three sticky notes in
  // one corner."
  annotations: [
    {
      kind: "red" as const,
      label: "Day 87",
      sub: "Approval still pending",
      anchor: proj(-12, 7, 1.5),
      offset: [-180, -140] as [number, number],
    },
    {
      kind: "amber" as const,
      label: "Rework #2",
      sub: "Same investigation, reopened",
      anchor: proj(-7, 6.5, 0.5),
      offset: [-60, -160] as [number, number],
    },
    {
      kind: "amber" as const,
      label: "Audit prep · 3 wks",
      sub: "Records rebuilt from memory",
      anchor: proj(-2, 4.5, 0.1),
      offset: [120, -180] as [number, number],
    },
  ],
};

// ── Phase 1 extras ────────────────────────────────────
// Annotations that ONLY exist in Phase 1 (the without-Unifize state).
// They show that the gap isn't just inconvenient — it's saturated
// with lost work. Each anchors to a Phase-1 visible element so the
// callouts land on objects, not empty floor.
const PHASE1_ANNOTATIONS = [
  {
    kind: "red" as const,
    label: "Sign-off · 14 days",
    sub: "Buried in a Teams thread",
    anchor: proj(-12 + 1.3, 7 + 1.3, 0.42 + 0.15),
    offset: [-220, 30] as [number, number],
  },
  {
    kind: "amber" as const,
    label: "Record · rebuilt",
    sub: "QMS entry written from memory",
    anchor: proj(8, -4, 2.6),
    offset: [60, -130] as [number, number],
  },
];

// ── Page ──────────────────────────────────────────────
export default function V2() {
  const uid = useId().replace(/:/g, "");

  // Phase 1 (without Unifize) is the default — open on the gap, click
  // to see Unifize close it. Each phase is a complete static frame.
  const [phase, setPhase] = useState<1 | 2>(1);
  const showUnifize = phase === 2;

  // Arrow geometry computed from LAYOUT projections.
  // Capture arrows fly from the top center of a SoC tile (offset by
  // SoC SIZE/2 = 1.3 and stack height 0.42 + small gap) up to a thread
  // tile centre on the Unifize top surface (wBase 1.8 + thick 0.22).
  const captures: { from: Pt; to: Pt; delay: number }[] = [
    {
      from: proj(-9.5 + 1.3, 4.2 + 1.3, 0.42 + 0.15),
      to: proj(-1.4, -1.4, 1.8 + 0.22),
      delay: 0,
    },
    {
      from: proj(-12 + 1.3, 7 + 1.3, 0.42 + 0.15),
      to: proj(0.8, -0.2, 1.8 + 0.22),
      delay: 0.6,
    },
    {
      from: proj(-9.5 + 1.3, 8 + 1.3, 0.42 + 0.15),
      to: proj(1.2, 0.6, 1.8 + 0.22),
      delay: 1.2,
    },
    {
      from: proj(-7 + 1.3, 6.5 + 1.3, 0.42 + 0.15),
      to: proj(1.4, 2.4, 1.8 + 0.22),
      delay: 1.8,
    },
  ];

  const writebacks: { from: Pt; to: Pt; delay: number }[] = [
    {
      from: proj(4.5, -2,   1.8 + 0.22),
      to:   proj(7.5, -3.6, 2.6),
      delay: 0.4,
    },
    {
      from: proj(4.5, 0.5,  1.8 + 0.22),
      to:   proj(7.5, -0.6, 2.2),
      delay: 1.0,
    },
    {
      from: proj(4.7, -1.0, 1.8 + 0.22),
      to:   proj(11.0, -3.6, 2.0),
      delay: 1.6,
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0b] text-white">
      {/* Nav */}
      <header className="relative z-30 flex items-center justify-between px-8 pt-7">
        <div className="flex items-center gap-10">
          <span className="text-[15px] font-semibold tracking-tight">unifize</span>
          <nav className="hidden md:flex items-center gap-7 text-[13.5px] text-white/60">
            <a href="#problem">The Problem</a>
            <a href="#world">Your World</a>
            <a href="#industry">By Industry</a>
            <a href="#how">How It Works</a>
            <a href="#proof">Proof</a>
          </nav>
        </div>
        <div className="flex items-center gap-5">
          <a href="#login" className="text-[13.5px] text-white/70 hover:text-white">
            Log in
          </a>
          <a
            href="#demo"
            className="rounded-full bg-white px-4 py-2 text-[13px] font-medium text-black hover:opacity-90"
          >
            Book a demo
          </a>
        </div>
      </header>

      {/* Hero copy: lead with the symptom claim (Constraint 8 — no */}
      {/* phase activation, render the with-Unifize state directly).   */}
      <section className="relative z-20 mx-auto mt-10 max-w-[1280px] px-8">
        <div className="text-[12px] font-medium uppercase tracking-[0.2em] text-white/70">
          <span className="inline-block h-2 w-2 rounded-full bg-[#0052FF] align-middle mr-2.5 shadow-[0_0_10px_2px_rgba(0,82,255,0.55)]" />
          Coordination tax, on a normal day.
        </div>
        <h1 className="mt-5 max-w-[26ch] text-[clamp(38px,5.6vw,72px)] font-medium leading-[1.02] tracking-[-0.038em]">
          These aren&apos;t your worst days.
          <br />
          <span className="text-white/60">They&apos;re your normal ones.</span>
        </h1>
        <ul className="mt-7 grid max-w-[68ch] grid-cols-1 gap-y-2 text-[14.5px] leading-[1.55] text-white/65 sm:grid-cols-2 sm:gap-x-10">
          <li>The approval lands in a Teams call.</li>
          <li>The signature exists, the justification is somewhere else.</li>
          <li>The record gets built from memory before the audit.</li>
          <li>Investigations re-open because the trail is missing.</li>
        </ul>
        <div className="mt-7 flex items-center gap-4">
          <a
            href="#demo"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13.5px] font-medium text-black hover:opacity-90"
          >
            Book a demo
            <span aria-hidden>→</span>
          </a>
          <a
            href="#how"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-[13.5px] text-white/80 hover:text-white"
          >
            See the structure
          </a>
        </div>
      </section>

      {/* Phase toggle. Two static frames, user-driven switch — no
          scroll activation. The buyer opens on the diagnosis (Phase 1)
          and clicks into the solution (Phase 2). */}
      <div className="absolute right-8 top-1/2 z-20 -translate-y-1/2 hidden md:flex flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1 backdrop-blur">
        <button
          type="button"
          onClick={() => setPhase(1)}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
            phase === 1
              ? "bg-white/10 text-white"
              : "text-white/60 hover:text-white/85"
          }`}
        >
          <span className={`font-mono text-[11px] ${phase === 1 ? "text-[#E5484D]" : "text-white/40"}`}>01</span>
          <span className="flex flex-col">
            <span className="text-[12.5px] font-medium tracking-tight">Without Unifize</span>
            <span className="text-[11px] text-white/45">The gap, on a normal day</span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => setPhase(2)}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
            phase === 2
              ? "bg-white/10 text-white"
              : "text-white/60 hover:text-white/85"
          }`}
        >
          <span className={`font-mono text-[11px] ${phase === 2 ? "text-[#0052FF]" : "text-white/40"}`}>02</span>
          <span className="flex flex-col">
            <span className="text-[12.5px] font-medium tracking-tight">With Unifize</span>
            <span className="text-[11px] text-white/45">The governed layer closes it</span>
          </span>
        </button>
      </div>

      {/* Iso scene fills the bottom of the hero. Container is the
          anchor for the absolute-positioned HTML annotation layer. */}
      <div className="absolute inset-x-0 bottom-0 z-10 h-[68vh] w-full">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMax meet"
          aria-label="Isometric scene showing Outlook, Teams, Excel feeding lavender capture arrows into a central Unifize band carrying cream thread tiles, with cream write-back arrows flowing into neutral grey QMS, DMS, ERP and PLM cubes. Three human figures appear in the SoC pile, the gap, and on the Unifize band."
          role="img"
          style={{ display: "block", maxWidth: "100%" }}
        >
          <defs>
            <radialGradient id={`unifize-halo-${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(0,82,255,0.35)" />
              <stop offset="100%" stopColor="rgba(0,82,255,0)" />
            </radialGradient>
            <radialGradient id="unifize-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(0,82,255,0.35)" />
              <stop offset="100%" stopColor="rgba(0,82,255,0)" />
            </radialGradient>
            <pattern
              id="void-hatch-pattern"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(30)"
            >
              <line x1="0" y1="0" x2="0" y2="10" stroke={VOID_HATCH} strokeWidth="1" />
            </pattern>
            <linearGradient id="ambient-bottom" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(10,10,11,0)" />
              <stop offset="100%" stopColor="rgba(10,10,11,1)" />
            </linearGradient>
            <filter id="shadow-blur">
              <feGaussianBlur stdDeviation="2.5" />
            </filter>
          </defs>

          <style>{`
            .v2-thread {
              animation: v2-thread-pulse 5.6s ease-in-out infinite;
              transform-box: fill-box;
              transform-origin: center;
            }
            @keyframes v2-thread-pulse {
              0%, 100% { opacity: 0.92; }
              50%      { opacity: 1; }
            }
            .v2-capture-shimmer {
              animation: v2-shimmer 3.2s linear infinite;
            }
            @keyframes v2-shimmer {
              0%   { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: -52; }
            }
            .v2-debris-drift {
              animation: v2-drift 8s ease-in-out infinite;
              transform-box: fill-box;
              transform-origin: center;
            }
            @keyframes v2-drift {
              0%, 100% { transform: translateY(0); }
              50%      { transform: translateY(-1.5px); }
            }
            @media (prefers-reduced-motion: reduce) {
              .v2-thread, .v2-capture-shimmer, .v2-debris-drift { animation: none; }
            }
          `}</style>

          {/* Floor grid */}
          <Floor />

          {/* Zone floor tints — soft washes that read as "this part of
              the floor is SoC, this is the gap, this is SoR." Sits
              under everything so it never competes with content. */}
          {(() => {
            const socZone = cuboid(-12, -5.5, 3.5, 10, 0, 0);
            const sorZone = cuboid(6.5, 13, -5.5, 0.5, 0, 0);
            return (
              <>
                <polygon points={poly(socZone.top)} fill="rgba(183,167,232,0.05)" />
                <polygon points={poly(sorZone.top)} fill="rgba(232,216,176,0.04)" />
              </>
            );
          })()}

          {/* Hatched void band between SoC and Unifize */}
          <VoidHatch />

          {/* Debris pile under the SoC stack — tiny grey tiles drifting
              on the floor, the "fragmented record" cue. */}
          <g className="v2-debris-drift">
            {Array.from({ length: 26 }).map((_, i) => {
              const r1 = (i * 31) % 100 / 100;
              const r2 = (i * 67) % 100 / 100;
              const u = -12 + r1 * 7;
              const v = 4 + r2 * 6;
              const a = proj(u, v, 0);
              const sz = 5 + r1 * 4;
              return (
                <rect
                  key={i}
                  x={a[0] - sz / 2}
                  y={a[1] - sz / 4}
                  width={sz}
                  height={sz / 2}
                  fill="rgba(255,255,255,0.06)"
                  rx={1}
                />
              );
            })}
          </g>

          {/* SoR cubes — neutral grey, labelled. In Phase 1 they
              read as "records that exist but don't capture the work
              that produced them." In Phase 2 they receive writebacks. */}
          {LAYOUT.sor.map((c, i) => (
            <SorCube key={`sor-${i}`} {...c} />
          ))}

          {/* SoC tiles — recognisable silhouettes */}
          {LAYOUT.soc.map((t, i) => (
            <SocTile key={`soc-${i}`} {...t} />
          ))}

          {/* Phase 1 only: explicit gap visual. A wider hatched void
              where Unifize would otherwise sit, plus "lost shards"
              floating mid-air between SoC and SoR (artifacts that
              never landed anywhere). This is the diagnosis half. */}
          {!showUnifize && (
            <g>
              {/* Wider gap hatch on the floor where Unifize sits in P2. */}
              <polygon
                points={poly(cuboid(-3, 5.5, -3, 5.5, 0, 0).top)}
                fill="rgba(255,255,255,0.025)"
              />
              <polygon
                points={poly(cuboid(-3, 5.5, -3, 5.5, 0, 0).top)}
                fill="url(#void-hatch-pattern)"
                opacity={0.7}
              />
              {/* Lost shards — silhouettes of coordination artifacts
                  (envelopes, doc corners, chat tails) floating in mid
                  air between the two zones, never settling on either.
                  Each has a strong falling trail so the eye reads
                  "this was work, now it's gone." */}
              {Array.from({ length: 18 }).map((_, i) => {
                const r1 = ((i * 137) % 100) / 100;
                const r2 = ((i * 91) % 100) / 100;
                const u = -3 + r1 * 9;
                const v = -3 + r2 * 8;
                const w = 0.6 + ((i * 53) % 20) / 10;
                const [x, y] = proj(u, v, w);
                const [fx, fy] = proj(u, v, 0);
                const kind = i % 3;
                return (
                  <g key={`lost-${i}`} className="v2-debris-drift" style={{ animationDelay: `${i * 0.18}s` } as CSSProperties}>
                    {/* Vertical trail showing the shard is mid-fall. */}
                    <line
                      x1={x} y1={y + 6} x2={fx} y2={fy - 4}
                      stroke="rgba(220,222,228,0.18)"
                      strokeWidth={0.7}
                      strokeDasharray="2 4"
                    />
                    {/* Shard glyph — varies by kind so the void reads
                        as "real work falling", not generic confetti. */}
                    {kind === 0 && (
                      <g>
                        <rect x={x - 9} y={y - 5} width={18} height={10} fill="rgba(230,232,238,0.7)" stroke="rgba(0,0,0,0.6)" strokeWidth={0.6} rx={1.5} />
                        <line x1={x - 9} y1={y - 5} x2={x} y2={y + 1} stroke="rgba(0,0,0,0.55)" strokeWidth={0.6} />
                        <line x1={x + 9} y1={y - 5} x2={x} y2={y + 1} stroke="rgba(0,0,0,0.55)" strokeWidth={0.6} />
                      </g>
                    )}
                    {kind === 1 && (
                      <g>
                        <path
                          d={`M ${x - 9} ${y - 4} L ${x + 6} ${y - 4} L ${x + 9} ${y - 1} L ${x + 9} ${y + 4} L ${x - 9} ${y + 4} Z`}
                          fill="rgba(230,232,238,0.7)"
                          stroke="rgba(0,0,0,0.6)"
                          strokeWidth={0.6}
                        />
                        <line x1={x - 6} y1={y - 1} x2={x + 6} y2={y - 1} stroke="rgba(0,0,0,0.45)" strokeWidth={0.5} />
                        <line x1={x - 6} y1={y + 2} x2={x + 3} y2={y + 2} stroke="rgba(0,0,0,0.35)" strokeWidth={0.5} />
                      </g>
                    )}
                    {kind === 2 && (
                      <g>
                        <path
                          d={`M ${x - 8} ${y - 4} Q ${x - 8} ${y - 6} ${x - 5} ${y - 6}
                              L ${x + 8} ${y - 6} Q ${x + 10} ${y - 6} ${x + 10} ${y - 3}
                              L ${x + 10} ${y + 2} Q ${x + 10} ${y + 4} ${x + 7} ${y + 4}
                              L ${x - 3} ${y + 4} L ${x - 6} ${y + 7} L ${x - 5} ${y + 4}
                              Q ${x - 8} ${y + 4} ${x - 8} ${y + 2} Z`}
                          fill="rgba(230,232,238,0.65)"
                          stroke="rgba(0,0,0,0.55)"
                          strokeWidth={0.5}
                        />
                      </g>
                    )}
                  </g>
                );
              })}
              {/* Sub-label on the floor between the clusters making the
                  silent message explicit: this is where work falls. */}
              {(() => {
                const c = proj(1, 1, 0);
                return (
                  <text
                    x={c[0]}
                    y={c[1] - 6}
                    textAnchor="middle"
                    fill="rgba(229,72,77,0.55)"
                    fontFamily="'JetBrains Mono', ui-monospace, monospace"
                    fontSize={11}
                    letterSpacing={1.8}
                  >
                    WORK FALLS HERE
                  </text>
                );
              })()}
            </g>
          )}

          {/* Phase 2 only: Unifize band, threads, captures, writebacks. */}
          {showUnifize && (
            <>
              <UnifizeBand {...LAYOUT.unifize} />
              {LAYOUT.threads.map((t, i) => (
                <ThreadTile
                  key={`thr-${i}`}
                  u0={t.u0}
                  u1={t.u1}
                  v0={t.v0}
                  v1={t.v1}
                  wBase={1.8}
                  thick={0.22}
                  label={t.label}
                  pulseDelay={t.delay}
                />
              ))}
              {captures.map((a, i) => (
                <CaptureArrow key={`cap-${i}`} from={a.from} to={a.to} delay={a.delay} />
              ))}
              {writebacks.map((a, i) => (
                <WriteBackArrow key={`wb-${i}`} from={a.from} to={a.to} delay={a.delay} />
              ))}
            </>
          )}

          {/* Humans (Constraint 9) — anchored figure only renders in
              Phase 2 (no Unifize to anchor to in Phase 1). */}
          {LAYOUT.humans
            .filter((h) => showUnifize || h.posture !== "anchored")
            .map((h, i) => (
              <Human
                key={`h-${i}`}
                u={h.u}
                v={h.v}
                w={h.w}
                posture={h.posture}
                halo={h.halo && showUnifize}
              />
            ))}

          {/* Bottom fade — ties the scene into the page bg */}
          <rect x={0} y={VB_H - 120} width={VB_W} height={120} fill="url(#ambient-bottom)" />
        </svg>

        {/* HTML annotation layer (Constraint 10).
            Pinned to scene objects via screen-space projection.
            Severity tagged by colour. */}
        <div className="pointer-events-none absolute inset-0">
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMax meet"
            className="absolute inset-0"
            style={{ display: "block" }}
          >
            {[...LAYOUT.annotations, ...(showUnifize ? [] : PHASE1_ANNOTATIONS)].map((a, i) => {
              const tx = a.anchor[0] + a.offset[0];
              const ty = a.anchor[1] + a.offset[1];
              const color = a.kind === "red" ? SEV_RED : SEV_AMBER;
              return (
                <g key={`ann-${i}`}>
                  {/* Leader line from object to label. */}
                  <line
                    x1={a.anchor[0]}
                    y1={a.anchor[1]}
                    x2={tx}
                    y2={ty + 16}
                    stroke={color}
                    strokeWidth={1}
                    strokeDasharray="2 3"
                    opacity={0.7}
                  />
                  {/* Pin dot at anchor. */}
                  <circle cx={a.anchor[0]} cy={a.anchor[1]} r={3.2} fill={color} />
                  {/* Pulse ring kept gentle so the callouts read as
                      ambient "normal-day" cost, not crisis alarms. */}
                  <circle cx={a.anchor[0]} cy={a.anchor[1]} r={3.2} fill="none" stroke={color} strokeWidth={0.9} opacity={0.28}>
                    <animate attributeName="r" values="3.2;6.2;3.2" dur="3.6s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.28;0;0.28" dur="3.6s" repeatCount="indefinite" />
                  </circle>
                  {/* Card. */}
                  <g transform={`translate(${tx},${ty})`}>
                    <rect
                      x={-2}
                      y={0}
                      width={246}
                      height={48}
                      rx={5}
                      fill="rgba(12,13,17,0.94)"
                      stroke={color}
                      strokeWidth={1.1}
                    />
                    <rect x={-2} y={0} width={3.5} height={48} fill={color} rx={1.5} />
                    <text
                      x={12}
                      y={18}
                      fill={color}
                      fontFamily="'JetBrains Mono', ui-monospace, monospace"
                      fontSize={13.5}
                      fontWeight={600}
                      letterSpacing={0.6}
                    >
                      {a.label}
                    </text>
                    <text
                      x={12}
                      y={34}
                      fill="rgba(225,227,232,0.88)"
                      fontFamily="Inter, system-ui, sans-serif"
                      fontSize={12.5}
                    >
                      {a.sub}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Zone labels — mono caps anchoring the three regions.
                Sized for readability down to a 1280px viewport. */}
            <text
              x={proj(-10, 6.5, 0)[0]}
              y={proj(-10, 6.5, 0)[1] + 78}
              fill="rgba(255,255,255,0.62)"
              fontFamily="'JetBrains Mono', ui-monospace, monospace"
              fontSize={17}
              letterSpacing={2.6}
              textAnchor="middle"
              fontWeight={500}
            >
              SYSTEMS OF COLLABORATION
            </text>
            <text
              x={proj(1, 1, 0)[0]}
              y={FLOOR_Y + 70}
              fill={showUnifize ? UNIFIZE_BLUE : "rgba(229,72,77,0.78)"}
              fontFamily="'JetBrains Mono', ui-monospace, monospace"
              fontSize={17}
              letterSpacing={2.6}
              textAnchor="middle"
              fontWeight={600}
            >
              {showUnifize ? "UNIFIZE · GOVERNED LAYER" : "THE GAP · OFF-RECORD WORK"}
            </text>
            <text
              x={proj(9.5, -3.5, 0)[0]}
              y={proj(9.5, -3.5, 0)[1] + 78}
              fill="rgba(255,255,255,0.62)"
              fontFamily="'JetBrains Mono', ui-monospace, monospace"
              fontSize={17}
              letterSpacing={2.6}
              textAnchor="middle"
              fontWeight={500}
            >
              SYSTEMS OF RECORD
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
