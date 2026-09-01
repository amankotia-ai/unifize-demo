// HeroIsoScene
//
// Native re-build of the hero graphic that previously was a static SVG snapshot
// extracted from a third-party Lottie scene. Pure inline SVG with isometric
// geometry computed from world coords, plus subtle CSS animations (drifting
// boxes, spinning globe). Sharp at any size, no asset weight.

import { useId, type CSSProperties } from "react";

// Iso projection helpers. World axes:
//   u: floor-right (one iso axis)
//   v: floor-back (other iso axis)
//   w: vertical, +w goes up
// Screen projection (true iso, 30°):
//   X = (u - v) * cos30 + cx
//   Y = -(u + v) * sin30 - w + fy   (screen Y grows downward)
const COS30 = Math.cos(Math.PI / 6); // ≈ 0.8660254
const SIN30 = 0.5;

type Pt = [number, number];

const proj = (u: number, v: number, w: number, cx: number, fy: number): Pt => [
  cx + (u - v) * COS30,
  fy - (u + v) * SIN30 - w,
];

const polyStr = (pts: Pt[]) => pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

interface BoxFaces {
  top: Pt[];
  leftFace: Pt[];   // u = u0  → visible left-leaning face on screen
  frontFace: Pt[];  // v = v0  → visible right-leaning face on screen (labels go here)
  topCenter: Pt;
}

// World-space cuboid spanning u in [u0, u1], v in [v0, v1], w in [w0, w1].
// In this iso projection +u goes screen-up-right, +v goes screen-up-left, +w goes
// screen-up. Camera is at -u, -v, +w (front-left-up). Visible faces are therefore
// the ones whose normals point toward the camera: u=u0, v=v0, w=w1.
function isoCuboid(
  u0: number, u1: number,
  v0: number, v1: number,
  w0: number, w1: number,
  cx: number, fy: number
): BoxFaces {
  const top = [
    proj(u0, v1, w1, cx, fy), // back-left
    proj(u1, v1, w1, cx, fy), // back-right
    proj(u1, v0, w1, cx, fy), // front-right
    proj(u0, v0, w1, cx, fy), // front-left
  ];
  // Left face on screen: u = u0, normal -u.
  const leftFace = [
    proj(u0, v0, w1, cx, fy), // top-front
    proj(u0, v1, w1, cx, fy), // top-back
    proj(u0, v1, w0, cx, fy), // bottom-back
    proj(u0, v0, w0, cx, fy), // bottom-front
  ];
  // Front face on screen: v = v0, normal -v. The right-leaning slope.
  const frontFace = [
    proj(u0, v0, w1, cx, fy), // top-left
    proj(u1, v0, w1, cx, fy), // top-right
    proj(u1, v0, w0, cx, fy), // bottom-right
    proj(u0, v0, w0, cx, fy), // bottom-left
  ];
  const topCenter: Pt = proj((u0 + u1) / 2, (v0 + v1) / 2, w1, cx, fy);
  return { top, leftFace, frontFace, topCenter };
}

interface BoxProps {
  cx: number;
  fy: number;
  u0: number;
  u1: number;
  v0: number;
  v1: number;
  w0: number;
  w1: number;
  label: string;
  driftDelay: number;
}

const StackBox = ({ cx, fy, u0, u1, v0, v1, w0, w1, label, driftDelay }: BoxProps) => {
  const f = isoCuboid(u0, u1, v0, v1, w0, w1, cx, fy);
  // Anchor the label at the LEFT edge of the leftFace (matches reference
  // alignment — labels run across the screen-left face). leftFace[0] = top-front.
  // The leftFace's local +x is the +v axis, which projects to (-cos30, -sin30)
  // — i.e. up-left. So the label's local-X needs to map to that direction.
  const anchor = f.leftFace[0];
  const labelMatrix = `matrix(${-COS30}, ${-SIN30}, 0, 1, ${anchor[0]}, ${anchor[1]})`;
  return (
    <g
      className="hero-iso-box"
      style={{ animationDelay: `${driftDelay}s` } as CSSProperties}
    >
      <polygon points={polyStr(f.top)} fill="url(#iso-top)" />
      <polygon points={polyStr(f.leftFace)} fill="url(#iso-right)" />
      <polygon points={polyStr(f.frontFace)} fill="url(#iso-front)" />
      {/* Crisp white edge outlines on every visible face — matches the reference. */}
      <polyline
        points={polyStr([f.top[0], f.top[1], f.top[2], f.top[3], f.top[0]])}
        fill="none" stroke="rgba(255,255,255,0.92)" strokeWidth={1.1}
      />
      <polyline
        points={polyStr([f.frontFace[0], f.frontFace[1], f.frontFace[2], f.frontFace[3], f.frontFace[0]])}
        fill="none" stroke="rgba(255,255,255,0.92)" strokeWidth={1.1}
      />
      <polyline
        points={polyStr([f.leftFace[0], f.leftFace[1], f.leftFace[2], f.leftFace[3], f.leftFace[0]])}
        fill="none" stroke="rgba(255,255,255,0.92)" strokeWidth={1.1}
      />
      <text
        x={20}
        y={(w1 - w0) / 2}
        transform={labelMatrix}
        textAnchor="start"
        dominantBaseline="middle"
        fill="rgba(255,255,255,0.95)"
        fontFamily="'JetBrains Mono', ui-monospace, monospace"
        fontSize={13}
        fontWeight={500}
        letterSpacing={0.6}
      >
        {label}
      </text>
    </g>
  );
};

// Floor grid: lines parallel to u-axis (varying v) and lines parallel to v-axis (varying u).
const FloorGrid = ({ cx, fy }: { cx: number; fy: number }) => {
  const U_MIN = -560, U_MAX = 560;
  const V_MIN = -120, V_MAX = 700;
  const STEP = 60;
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let v = V_MIN; v <= V_MAX; v += STEP) {
    const a = proj(U_MIN, v, 0, cx, fy);
    const b = proj(U_MAX, v, 0, cx, fy);
    lines.push({ x1: a[0], y1: a[1], x2: b[0], y2: b[1] });
  }
  for (let u = U_MIN; u <= U_MAX; u += STEP) {
    const a = proj(u, V_MIN, 0, cx, fy);
    const b = proj(u, V_MAX, 0, cx, fy);
    lines.push({ x1: a[0], y1: a[1], x2: b[0], y2: b[1] });
  }
  return (
    <g stroke="rgba(255,255,255,0.06)" strokeWidth={0.8}>
      {lines.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
      ))}
    </g>
  );
};

// Wireframe globe: silhouette + 7 parallels (horizontal ellipses, more dense
// near the equator) + 5 meridians whose rx animates to fake rotation, plus a
// visible vertical axis line that extends slightly above and below the sphere.
const WireGlobe = ({ cx, cy, r }: { cx: number; cy: number; r: number }) => {
  const parallels = [-0.85, -0.6, -0.3, 0, 0.3, 0.6, 0.85].map((k) => ({
    cy: cy + k * r,
    rx: Math.sqrt(1 - k * k) * r,
    ry: Math.sqrt(1 - k * k) * r * 0.30,
  }));
  return (
    <g>
      {/* Vertical axis through the sphere, extending slightly past the poles. */}
      <line
        x1={cx} y1={cy - r - 14}
        x2={cx} y2={cy + r + 14}
        stroke="rgba(255,255,255,0.85)" strokeWidth={1}
      />
      {/* Sphere silhouette. */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.92)" strokeWidth={1.2} />
      {/* Parallels — horizontal slices that read as a 3D sphere. */}
      {parallels.map((p, i) => (
        <ellipse
          key={`par-${i}`}
          cx={cx}
          cy={p.cy}
          rx={p.rx}
          ry={p.ry}
          fill="none"
          stroke="rgba(255,255,255,0.62)"
          strokeWidth={0.9}
        />
      ))}
      {/* Meridians: 5 of them at evenly-spaced phases. As the sphere "rotates",
          each meridian's rx cycles through |cos|, giving the impression of
          spinning around the vertical axis. */}
      {[0, 1, 2, 3, 4].map((i) => {
        const phase = (i / 5) * Math.PI;
        const samples = Array.from({ length: 13 }, (_, k) => {
          const t = (k / 12) * 2 * Math.PI;
          return Math.cos(t + phase) * r;
        });
        return (
          <ellipse
            key={`mer-${i}`}
            cx={cx}
            cy={cy}
            rx={Math.abs(samples[0])}
            ry={r}
            fill="none"
            stroke="rgba(255,255,255,0.62)"
            strokeWidth={0.9}
          >
            <animate
              attributeName="rx"
              values={samples.map((s) => Math.abs(s).toFixed(2)).join(";")}
              dur="14s"
              repeatCount="indefinite"
            />
          </ellipse>
        );
      })}
    </g>
  );
};

// Wireframe cube on the floor near the stack. Includes both visible and
// hidden edges (drawn at lower opacity) and an inline `< • • >` icon on the
// front face — matches the reference's chevron-eyes mark.
const WireCube = ({
  cx, fy, u0, v0, size,
}: { cx: number; fy: number; u0: number; v0: number; size: number }) => {
  const u1 = u0 + size, v1 = v0 + size, w0 = 0, w1 = size;
  const f = isoCuboid(u0, u1, v0, v1, w0, w1, cx, fy);
  const stroke = "rgba(255,255,255,0.92)";
  const sw = 1.1;
  // 8 corners for full wireframe rendering
  const c = (u: number, v: number, w: number) => proj(u, v, w, cx, fy);
  // Hidden back edges (back-top, back-vertical) — drawn at lower opacity for depth.
  const backTopL = c(u0, v1, w1);
  const backBotL = c(u0, v1, w0);

  // Front-face icon anchor (label matrix for the front face).
  const anchor = f.frontFace[0];
  const iconMatrix = `matrix(${COS30}, ${-SIN30}, 0, 1, ${anchor[0]}, ${anchor[1]})`;

  return (
    <g className="hero-iso-cube">
      {/* Visible faces — outlines only (no fill) */}
      <polyline points={polyStr([...f.frontFace, f.frontFace[0]])} fill="none" stroke={stroke} strokeWidth={sw} />
      <polyline points={polyStr([...f.top, f.top[0]])} fill="none" stroke={stroke} strokeWidth={sw} />
      <polyline points={polyStr([...f.leftFace, f.leftFace[0]])} fill="none" stroke={stroke} strokeWidth={sw} />
      {/* Hidden back-left vertical edge + back-left top edge, dimmer */}
      <line x1={f.top[3][0]} y1={f.top[3][1]} x2={backTopL[0]} y2={backTopL[1]} stroke="rgba(255,255,255,0.40)" strokeWidth={0.9} />
      <line x1={backTopL[0]} y1={backTopL[1]} x2={backBotL[0]} y2={backBotL[1]} stroke="rgba(255,255,255,0.40)" strokeWidth={0.9} />
      <line x1={backTopL[0]} y1={backTopL[1]} x2={f.top[2][0]} y2={f.top[2][1]} stroke="rgba(255,255,255,0.40)" strokeWidth={0.9} />
      {/* Front-face icon: < • • > pattern, projected onto the iso face. */}
      <g transform={iconMatrix} fill="rgba(255,255,255,0.92)" stroke="rgba(255,255,255,0.92)">
        <path
          d={`M ${size * 0.18} ${size * 0.42} L ${size * 0.10} ${size * 0.50} L ${size * 0.18} ${size * 0.58}`}
          fill="none" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round"
        />
        <path
          d={`M ${size * 0.62} ${size * 0.42} L ${size * 0.70} ${size * 0.50} L ${size * 0.62} ${size * 0.58}`}
          fill="none" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round"
        />
        <circle cx={size * 0.32} cy={size * 0.50} r={size * 0.06} />
        <circle cx={size * 0.48} cy={size * 0.50} r={size * 0.06} />
      </g>
    </g>
  );
};

export default function HeroIsoScene() {
  const uid = useId().replace(/:/g, "");
  // viewBox-local coordinates
  const VB_W = 1200, VB_H = 920;
  const CX = VB_W / 2;
  const FLOOR_Y = 720;

  // Box footprint (world units): three thick slabs stacked with clear gaps.
  // Sized big — the stack is the dominant visual in the right hero column.
  const HALF_U = 245;
  const V_DEPTH = 360;
  const BOX_H = 78;
  const BOX_GAP = 22;

  const boxes = [0, 1, 2].map((i) => {
    const w0 = i * (BOX_H + BOX_GAP);
    const w1 = w0 + BOX_H;
    const labels = ["RECORDS", "WORKFLOWS", "SIGNALS"];
    return { w0, w1, label: labels[i], driftDelay: i * 0.6 };
  });

  // Globe sits on top of the top slab, anchored toward the back-left corner
  // (matches the reference where the globe overlaps onto the top surface).
  const topW = boxes[2].w1;
  const globeCenter = proj(-HALF_U * 0.35, V_DEPTH * 0.65, topW + 70, CX, FLOOR_Y);

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      width="100%"
      height="auto"
      role="img"
      aria-label="Isometric stack of records, workflows and signals with a wireframe globe"
      style={{ display: "block", maxWidth: "100%" }}
    >
      <defs>
        {/* Box face gradients — top brightest, front mid, right deeper. */}
        <linearGradient id={`iso-top-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5C92FF" />
          <stop offset="100%" stopColor="#2870FF" />
        </linearGradient>
        <linearGradient id={`iso-front-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2870FF" />
          <stop offset="100%" stopColor="#1F58D9" />
        </linearGradient>
        <linearGradient id={`iso-right-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1F58D9" />
          <stop offset="100%" stopColor="#163F99" />
        </linearGradient>
        {/* Aliased ids without the suffix so the StackBox/WireCube can reference them. */}
        <linearGradient id="iso-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5C92FF" />
          <stop offset="100%" stopColor="#2870FF" />
        </linearGradient>
        <linearGradient id="iso-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2870FF" />
          <stop offset="100%" stopColor="#1F58D9" />
        </linearGradient>
        <linearGradient id="iso-right" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1F58D9" />
          <stop offset="100%" stopColor="#163F99" />
        </linearGradient>
        <radialGradient id={`floor-fade-${uid}`} cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="rgba(40,112,255,0.06)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      <style>{`
        .hero-iso-box { animation: hero-iso-float 6s cubic-bezier(0.4,0,0.2,1) infinite; transform-box: fill-box; transform-origin: center; }
        .hero-iso-cube { animation: hero-iso-float 7s cubic-bezier(0.4,0,0.2,1) infinite reverse; transform-box: fill-box; transform-origin: center; }
        @keyframes hero-iso-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-3px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-iso-box, .hero-iso-cube { animation: none; }
        }
      `}</style>

      {/* Dashed orbital ellipse on the floor, encompassing the stack + cube.
          A circle of radius R in the world u-v plane projects to an ellipse
          with rx = R·cos30·√2, ry = R·sin30·√2 (ratio √3 : 1). */}
      {(() => {
        const R = 410;
        const center = proj(0, V_DEPTH / 2, 0, CX, FLOOR_Y);
        const rx = R * COS30 * Math.SQRT2;
        const ry = R * SIN30 * Math.SQRT2;
        return (
          <ellipse
            cx={center[0]}
            cy={center[1]}
            rx={rx}
            ry={ry}
            fill="none"
            stroke="rgba(255,255,255,0.30)"
            strokeWidth={1}
            strokeDasharray="6 6"
          />
        );
      })()}

      {/* Boxes painted bottom-up so upper boxes overlap correctly */}
      {boxes.map((b, i) => (
        <StackBox
          key={i}
          cx={CX}
          fy={FLOOR_Y}
          u0={-HALF_U}
          u1={HALF_U}
          v0={0}
          v1={V_DEPTH}
          w0={b.w0}
          w1={b.w1}
          label={b.label}
          driftDelay={b.driftDelay}
        />
      ))}

      {/* Wireframe cube on the floor, sitting next to the stack on the right. */}
      <WireCube cx={CX} fy={FLOOR_Y} u0={HALF_U + 90} v0={-50} size={120} />

      {/* Wireframe globe on top */}
      <WireGlobe cx={globeCenter[0]} cy={globeCenter[1]} r={108} />
    </svg>
  );
}
