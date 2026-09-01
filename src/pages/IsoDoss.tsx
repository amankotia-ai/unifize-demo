import { useState } from "react";

// =============================================================================
// Isometric projection helpers (true 30° iso)
// World: u = floor-right, v = floor-back, w = vertical-up.
// Camera looks from (+u, -v, +w) toward origin → 30° iso.
// =============================================================================

const COS30 = Math.cos(Math.PI / 6);
const SIN30 = 0.5;
type Pt = [number, number];

const proj = (u: number, v: number, w: number, cx: number, fy: number): Pt => [
  cx + (u - v) * COS30,
  fy - (u + v) * SIN30 - w,
];
const polyStr = (pts: Pt[]) =>
  pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

interface BoxFaces {
  top: Pt[];
  rightFace: Pt[];
  frontFace: Pt[];
  topCenter: Pt;
  frontCenter: Pt;
  rightCenter: Pt;
}

function isoCuboid(
  u0: number, u1: number,
  v0: number, v1: number,
  w0: number, w1: number,
  cx: number, fy: number
): BoxFaces {
  const top: Pt[] = [
    proj(u0, v1, w1, cx, fy),
    proj(u1, v1, w1, cx, fy),
    proj(u1, v0, w1, cx, fy),
    proj(u0, v0, w1, cx, fy),
  ];
  const rightFace: Pt[] = [
    proj(u1, v0, w1, cx, fy),
    proj(u1, v1, w1, cx, fy),
    proj(u1, v1, w0, cx, fy),
    proj(u1, v0, w0, cx, fy),
  ];
  const frontFace: Pt[] = [
    proj(u0, v0, w1, cx, fy),
    proj(u1, v0, w1, cx, fy),
    proj(u1, v0, w0, cx, fy),
    proj(u0, v0, w0, cx, fy),
  ];
  const topCenter = proj((u0 + u1) / 2, (v0 + v1) / 2, w1, cx, fy);
  const frontCenter = proj((u0 + u1) / 2, v0, (w0 + w1) / 2, cx, fy);
  const rightCenter = proj(u1, (v0 + v1) / 2, (w0 + w1) / 2, cx, fy);
  return { top, rightFace, frontFace, topCenter, frontCenter, rightCenter };
}

// Iso transform that maps a flat 2D shape onto the front face of a box.
const frontFaceMatrix = (cx: number, cy: number) =>
  `matrix(${COS30}, ${-SIN30}, 0, 1, ${cx}, ${cy})`;

// Iso transform for stuff lying flat on the top face of a box.
// +x_text reads along +u (floor-right); +y_text (descender) goes toward -v
// (front, toward viewer) so letters are right-side-up to the camera.
const topFaceMatrix = (cx: number, cy: number) =>
  `matrix(${COS30}, ${-SIN30}, ${COS30}, ${SIN30}, ${cx}, ${cy})`;

// =============================================================================
// Box renderers
// =============================================================================

interface HatchedBoxProps {
  cx: number;
  fy: number;
  u0: number; u1: number;
  v0: number; v1: number;
  w0: number; w1: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  hatchOpacity?: number;
}

// Cream box with sparse diagonal hatching on every face.
function HatchedBox(p: HatchedBoxProps) {
  const f = isoCuboid(p.u0, p.u1, p.v0, p.v1, p.w0, p.w1, p.cx, p.fy);
  const fill = p.fill ?? "#F5F0E2";
  const stroke = p.stroke ?? "#0A0A0A";
  const sw = p.strokeWidth ?? 1.6;
  const op = p.hatchOpacity ?? 0.45;
  return (
    <g shapeRendering="geometricPrecision">
      <polygon points={polyStr(f.top)} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="miter" />
      <polygon points={polyStr(f.top)} fill="url(#hatch-top-coarse)" opacity={op} stroke="none" />
      <polygon points={polyStr(f.frontFace)} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="miter" />
      <polygon points={polyStr(f.frontFace)} fill="url(#hatch-front-coarse)" opacity={op} stroke="none" />
      <polygon points={polyStr(f.rightFace)} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="miter" />
      <polygon points={polyStr(f.rightFace)} fill="url(#hatch-right-coarse)" opacity={op} stroke="none" />
    </g>
  );
}

interface ColoredBoxProps {
  cx: number;
  fy: number;
  u0: number; u1: number;
  v0: number; v1: number;
  w0: number; w1: number;
  topColor: string;
  frontColor: string;
  rightColor: string;
  label: string;
  iconNode?: React.ReactNode;
}
function ColoredBox(p: ColoredBoxProps) {
  const f = isoCuboid(p.u0, p.u1, p.v0, p.v1, p.w0, p.w1, p.cx, p.fy);
  const stroke = "#0A0A0A";
  const sw = 1.7;
  const fcx = (f.frontFace[0][0] + f.frontFace[2][0]) / 2;
  const fcy = (f.frontFace[0][1] + f.frontFace[2][1]) / 2;
  const wHalf = (p.w1 - p.w0) / 2;
  return (
    <g shapeRendering="geometricPrecision">
      <polygon points={polyStr(f.top)} fill={p.topColor} stroke={stroke} strokeWidth={sw} strokeLinejoin="miter" />
      <polygon points={polyStr(f.top)} fill="url(#hatch-c-top)" opacity={0.16} stroke="none" />
      <polygon points={polyStr(f.frontFace)} fill={p.frontColor} stroke={stroke} strokeWidth={sw} strokeLinejoin="miter" />
      <polygon points={polyStr(f.rightFace)} fill={p.rightColor} stroke={stroke} strokeWidth={sw} strokeLinejoin="miter" />
      <polygon points={polyStr(f.rightFace)} fill="url(#hatch-c-right)" opacity={0.28} stroke="none" />
      <g transform={frontFaceMatrix(fcx, fcy)}>
        {p.iconNode && (
          <g transform={`translate(0, ${-wHalf * 0.32})`}>{p.iconNode}</g>
        )}
        <text
          x={0}
          y={wHalf * 0.55}
          textAnchor="middle"
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
          fontSize={11}
          fontWeight={800}
          fill="#0A0A0A"
          letterSpacing={0.6}
        >
          {p.label}
        </text>
      </g>
    </g>
  );
}

interface DarkTagProps {
  cx: number;
  fy: number;
  u0: number; u1: number;
  v0: number; v1: number;
  w0: number; w1: number;
  line1: string;
  line2: string;
}
function DarkTag(p: DarkTagProps) {
  const f = isoCuboid(p.u0, p.u1, p.v0, p.v1, p.w0, p.w1, p.cx, p.fy);
  const stroke = "#0A0A0A";
  const sw = 1.2;
  const fcx = (f.frontFace[0][0] + f.frontFace[2][0]) / 2;
  const fcy = (f.frontFace[0][1] + f.frontFace[2][1]) / 2;
  return (
    <g shapeRendering="geometricPrecision">
      <polygon points={polyStr(f.top)} fill="#3D3D3D" stroke={stroke} strokeWidth={sw} strokeLinejoin="miter" />
      <polygon points={polyStr(f.frontFace)} fill="#262626" stroke={stroke} strokeWidth={sw} strokeLinejoin="miter" />
      <polygon points={polyStr(f.rightFace)} fill="#161616" stroke={stroke} strokeWidth={sw} strokeLinejoin="miter" />
      <g transform={frontFaceMatrix(fcx, fcy)}>
        <text
          x={0}
          y={-3}
          textAnchor="middle"
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
          fontSize={10}
          fontWeight={800}
          fill="#FFFFFF"
          letterSpacing={0.7}
        >
          {p.line1}
        </text>
        <text
          x={0}
          y={11}
          textAnchor="middle"
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
          fontSize={10}
          fontWeight={800}
          fill="#FFFFFF"
          letterSpacing={0.7}
        >
          {p.line2}
        </text>
      </g>
    </g>
  );
}

// =============================================================================
// Icons drawn on box front faces (already inside frontFaceMatrix transform)
// =============================================================================

function POIcon() {
  return (
    <g>
      <rect x={-15} y={-12} width={30} height={24} rx={4} fill="#0A0A0A" />
      <text
        x={0}
        y={6}
        textAnchor="middle"
        fontFamily="'JetBrains Mono', ui-monospace, monospace"
        fontSize={14}
        fontWeight={900}
        fill="#FFFFFF"
        letterSpacing={0.5}
      >
        PO
      </text>
    </g>
  );
}
function PackageIcon() {
  return (
    <g stroke="#0A0A0A" strokeWidth={2} fill="none" strokeLinejoin="round" strokeLinecap="round">
      <path d="M -15 -3 L 0 -12 L 15 -3 L 15 10 L 0 19 L -15 10 Z" />
      <path d="M -15 -3 L 0 6 L 15 -3" />
      <path d="M 0 6 L 0 19" />
    </g>
  );
}
function CartIcon() {
  return (
    <g stroke="#0A0A0A" strokeWidth={2} fill="none" strokeLinejoin="round" strokeLinecap="round">
      <path d="M -17 -10 L -12 -10 L -7 8 L 13 8 L 15 -4 L -8 -4" />
      <circle cx={-5} cy={14} r={2} fill="#0A0A0A" />
      <circle cx={10} cy={14} r={2} fill="#0A0A0A" />
    </g>
  );
}
function UpDownArrows() {
  return (
    <g stroke="#0A0A0A" strokeWidth={1.7} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <line x1={-7} y1={6} x2={-7} y2={-12} />
      <polyline points="-11,-8 -7,-12 -3,-8" />
      <line x1={7} y1={-12} x2={7} y2={6} />
      <polyline points="3,2 7,6 11,2" />
    </g>
  );
}

function Cable({ d, width = 16 }: { d: string; width?: number }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke="#0A0A0A" strokeWidth={width + 1.6} />
      <path d={d} stroke="#FFFFFF" strokeWidth={width} />
      <path d={d} stroke="rgba(0,0,0,0.10)" strokeWidth={1} opacity={0.6} />
    </g>
  );
}

// Partner glyphs
function SPSGlyph() {
  return (
    <g fill="#0A0A0A" stroke="none">
      <path d="M -14 -3 q 0 -10 14 -10 q 14 0 14 10 l -4 0 q 0 -6 -10 -6 q -10 0 -10 6 z" />
      <path d="M -10 4 q 0 -7 10 -7 q 10 0 10 7 l -3 0 q 0 -4 -7 -4 q -7 0 -7 4 z" />
      <circle cx={0} cy={11} r={2.5} />
    </g>
  );
}
function ShopifyGlyph() {
  return (
    <g>
      <path
        d="M -10 -14 q 4 -5 10 -5 q 6 0 10 5 l 3 1 l 2 22 l -30 0 l 2 -22 z"
        fill="#0A0A0A"
        stroke="none"
      />
      <text
        x={0}
        y={5}
        textAnchor="middle"
        fontFamily="'Inter', ui-sans-serif, system-ui, sans-serif"
        fontSize={15}
        fontStyle="italic"
        fontWeight={800}
        fill="#FFFFFF"
      >
        S
      </text>
    </g>
  );
}
function FlexportGlyph() {
  return (
    <text
      x={0}
      y={5}
      textAnchor="middle"
      fontFamily="'Inter', ui-sans-serif, system-ui, sans-serif"
      fontSize={13}
      fontWeight={700}
      fill="#0A0A0A"
      letterSpacing={-0.4}
    >
      flexport
    </text>
  );
}

// =============================================================================
// Page
// =============================================================================

const TABS = [
  "Consumer goods",
  "Food and Beverage",
  "Health & Beauty",
  "Manufacturing",
  "Distribution",
] as const;

const PAGE_CSS = `
.iso-doss-root {
  --bg: #E5DECF;
  --ink: #0A0A0A;
  --ink-muted: #8A8579;
  background: var(--bg);
  color: var(--ink);
  min-height: 100vh;
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  letter-spacing: -0.01em;
}
.iso-doss-shell {
  max-width: 1500px;
  margin: 0 auto;
  padding: 56px 56px 64px;
}
.iso-doss-tabs {
  display: flex;
  gap: 56px;
  border-bottom: 1px solid rgba(10,10,10,0.14);
  margin-bottom: 16px;
}
.iso-doss-tab {
  position: relative;
  padding: 0 0 18px 0;
  font-size: 22px;
  font-weight: 600;
  color: var(--ink-muted);
  letter-spacing: -0.015em;
  background: none;
  border: 0;
  cursor: pointer;
  transition: color 180ms ease;
}
.iso-doss-tab:hover { color: rgba(10,10,10,0.7); }
.iso-doss-tab[data-active='true'] { color: var(--ink); }
.iso-doss-tab[data-active='true']::after {
  content: '';
  position: absolute;
  left: 0; right: 0; bottom: -1px;
  height: 2px;
  background: var(--ink);
}
.iso-doss-stage svg {
  width: 100%;
  height: auto;
  display: block;
}
@media (max-width: 900px) {
  .iso-doss-shell { padding: 24px 16px; }
  .iso-doss-tabs { gap: 24px; overflow-x: auto; }
  .iso-doss-tab { font-size: 16px; white-space: nowrap; }
}
`;

export default function IsoDoss() {
  const [active, setActive] = useState<(typeof TABS)[number]>("Consumer goods");

  // ---- World scene layout
  const VB_W = 1600;
  const VB_H = 900;
  const CX = 800;
  const FY = 720;

  // ---- Platform: long, shallow slab. Wide enough to give the partner stack
  // and CO-MANUFACTURING some breathing room visually.
  const PLAT_HU = 300;
  const PLAT_VFRONT = -140;
  const PLAT_VBACK = 220;
  const PLAT_W0 = 0;
  const PLAT_W1 = 22;

  // ---- 3 colored cubes. Each shifts +STEP_U (right) and -STEP_V (forward,
  // toward viewer) from the previous one — that's the reference's staircase
  // direction: low u + high v at the back-left, high u + low v at the
  // forward-right. Each cube's right face has a STEP_V-wide strip of v
  // exposed past the next cube, which reads as the visible right-side panel.
  const CUBE_U = 110;
  const CUBE_V = 110;
  const CUBE_H = 155;
  const STEP_U = 110;
  const STEP_V = 36; // each cube exposes 36/110 ≈ 33% of its right face

  // Yellow PROCUREMENT — back-left in 3D, but lower-front on screen (closest
  // to viewer in screen Y). Painted FIRST in the painter sequence because it
  // is FARTHEST from camera (lowest u, highest v).
  const yellow = {
    u0: -130, u1: -130 + CUBE_U,
    v0: 50, v1: 50 + CUBE_V,
    w0: PLAT_W1, w1: PLAT_W1 + CUBE_H,
  };
  const blue = {
    u0: yellow.u0 + STEP_U, u1: yellow.u0 + STEP_U + CUBE_U,
    v0: yellow.v0 - STEP_V, v1: yellow.v0 - STEP_V + CUBE_V,
    w0: PLAT_W1, w1: PLAT_W1 + CUBE_H,
  };
  const red = {
    u0: blue.u0 + STEP_U, u1: blue.u0 + STEP_U + CUBE_U,
    v0: blue.v0 - STEP_V, v1: blue.v0 - STEP_V + CUBE_V,
    w0: PLAT_W1, w1: PLAT_W1 + CUBE_H,
  };

  // ---- Hanging dark tags above blue and red cubes
  const tagW0 = PLAT_W1 + CUBE_H + 70;
  const tagW1 = tagW0 + 30;
  const TAG_PAD = 6;
  const lotTag = {
    u0: blue.u0 + TAG_PAD, u1: blue.u1 - TAG_PAD,
    v0: blue.v0 + TAG_PAD, v1: blue.v1 - TAG_PAD,
    w0: tagW0, w1: tagW1,
  };
  const oaTag = {
    u0: red.u0 + TAG_PAD, u1: red.u1 - TAG_PAD,
    v0: red.v0 + TAG_PAD, v1: red.v1 - TAG_PAD,
    w0: tagW0, w1: tagW1,
  };

  // Connection points: cube top-center → tag bottom-center
  const blueTopC = proj((blue.u0 + blue.u1) / 2, (blue.v0 + blue.v1) / 2, blue.w1, CX, FY);
  const lotBotC = proj((lotTag.u0 + lotTag.u1) / 2, (lotTag.v0 + lotTag.v1) / 2, lotTag.w0, CX, FY);
  const redTopC = proj((red.u0 + red.u1) / 2, (red.v0 + red.v1) / 2, red.w1, CX, FY);
  const oaBotC = proj((oaTag.u0 + oaTag.u1) / 2, (oaTag.v0 + oaTag.v1) / 2, oaTag.w0, CX, FY);

  // ---- CO-MANUFACTURING small cube on the left
  const cm = {
    u0: -PLAT_HU - 220, u1: -PLAT_HU - 100,
    v0: 80, v1: 220,
    w0: 0, w1: 90,
  };
  const cmFaces = isoCuboid(cm.u0, cm.u1, cm.v0, cm.v1, cm.w0, cm.w1, CX, FY);

  // ---- Right partner stack (3 hatched boxes)
  const STACK = {
    u0: PLAT_HU + 90, u1: PLAT_HU + 90 + 140,
    v0: -60, v1: 80,
  };
  const STACK_H = 90;
  const STACK_GAP = 22;
  const stack0 = { ...STACK, w0: 0, w1: STACK_H };
  const stack1 = { ...STACK, w0: STACK_H + STACK_GAP, w1: 2 * STACK_H + STACK_GAP };
  const stack2 = { ...STACK, w0: 2 * STACK_H + 2 * STACK_GAP, w1: 3 * STACK_H + 2 * STACK_GAP };
  const s0Faces = isoCuboid(stack0.u0, stack0.u1, stack0.v0, stack0.v1, stack0.w0, stack0.w1, CX, FY);
  const s1Faces = isoCuboid(stack1.u0, stack1.u1, stack1.v0, stack1.v1, stack1.w0, stack1.w1, CX, FY);
  const s2Faces = isoCuboid(stack2.u0, stack2.u1, stack2.v0, stack2.v1, stack2.w0, stack2.w1, CX, FY);

  // ---- Cable paths (drawn in screen-space)
  // Wire 1: from CO-MANUFACTURING right side, arcs up and over the platform
  // edge, landing in FRONT of the yellow cube (lower v than yellow).
  const cmCableStart = proj(cm.u1, cm.v0 + 40, cm.w1 - 18, CX, FY);
  const platLandPt = proj(yellow.u0 - 50, yellow.v0 - 40, PLAT_W1 + 4, CX, FY);
  const arcTopX = (cmCableStart[0] + platLandPt[0]) / 2;
  const arcTopY = Math.min(cmCableStart[1], platLandPt[1]) - 130;
  const cable1d = `
    M ${cmCableStart[0].toFixed(1)} ${cmCableStart[1].toFixed(1)}
    C ${cmCableStart[0] + 40} ${cmCableStart[1] - 100},
      ${arcTopX - 80} ${arcTopY},
      ${arcTopX} ${arcTopY}
    C ${arcTopX + 80} ${arcTopY},
      ${platLandPt[0] - 40} ${platLandPt[1] - 80},
      ${platLandPt[0]} ${platLandPt[1]}
  `;

  // Wire 2: from red box right face, curves out toward the bottom partner box
  const redRightC = proj(red.u1, (red.v0 + red.v1) / 2, (red.w0 + red.w1) / 2 - 20, CX, FY);
  const stackBottomFront = s0Faces.frontCenter;
  const cable2d = `
    M ${redRightC[0].toFixed(1)} ${redRightC[1].toFixed(1)}
    C ${redRightC[0] + 80} ${redRightC[1] + 40},
      ${stackBottomFront[0] - 140} ${stackBottomFront[1] + 30},
      ${stackBottomFront[0] - 20} ${stackBottomFront[1]}
  `;

  // Three black arrows pointing right between platform and partner stack
  const arrowsXStart = stackBottomFront[0] - 200;
  const arrowsXEnd = stackBottomFront[0] - 32;

  // Floor perspective dotted lines
  const floorBL = proj(-PLAT_HU - 320, PLAT_VFRONT - 50, 0, CX, FY);
  const floorBR = proj(PLAT_HU + 360, PLAT_VFRONT - 50, 0, CX, FY);
  const floorTL = proj(-PLAT_HU - 320, PLAT_VBACK + 80, 0, CX, FY);
  const floorTR = proj(PLAT_HU + 360, PLAT_VBACK + 80, 0, CX, FY);

  // DOSS wordmark — projected onto the platform top, sitting just in front
  // of the yellow cube along the diagonal.
  const dossOnTop = proj(yellow.u0 + 30, yellow.v0 - 90, PLAT_W1 + 0.5, CX, FY);

  return (
    <div className="iso-doss-root">
      <style>{PAGE_CSS}</style>
      <div className="iso-doss-shell">
        <nav className="iso-doss-tabs" aria-label="Industries">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              className="iso-doss-tab"
              data-active={active === tab}
              onClick={() => setActive(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="iso-doss-stage">
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            role="img"
            aria-label="Isometric DOSS platform with procurement, inventory, and order management cubes connected to co-manufacturing and partner integrations"
          >
            <defs>
              {/* Hatching for cream boxes — sparse and thin, three angles for
                  the three faces. */}
              <pattern id="hatch-top-coarse" patternUnits="userSpaceOnUse" width="13" height="13" patternTransform="rotate(60)">
                <line x1="0" y1="0" x2="0" y2="13" stroke="#0A0A0A" strokeWidth="0.8" />
              </pattern>
              <pattern id="hatch-front-coarse" patternUnits="userSpaceOnUse" width="13" height="13" patternTransform="rotate(-30)">
                <line x1="0" y1="0" x2="0" y2="13" stroke="#0A0A0A" strokeWidth="0.8" />
              </pattern>
              <pattern id="hatch-right-coarse" patternUnits="userSpaceOnUse" width="13" height="13" patternTransform="rotate(30)">
                <line x1="0" y1="0" x2="0" y2="13" stroke="#0A0A0A" strokeWidth="0.8" />
              </pattern>

              {/* Subtler hatch on coloured boxes (top + right faces only) */}
              <pattern id="hatch-c-top" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(60)">
                <line x1="0" y1="0" x2="0" y2="10" stroke="#0A0A0A" strokeWidth="0.7" />
              </pattern>
              <pattern id="hatch-c-right" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(30)">
                <line x1="0" y1="0" x2="0" y2="10" stroke="#0A0A0A" strokeWidth="0.7" />
              </pattern>

              {/* Soft floor glow under platform */}
              <radialGradient id="floor-glow" cx="50%" cy="60%" r="60%">
                <stop offset="0%" stopColor="rgba(10,10,10,0.10)" />
                <stop offset="100%" stopColor="rgba(10,10,10,0)" />
              </radialGradient>

              {/* Arrow marker for the partner connection arrows */}
              <marker
                id="arrow-black"
                viewBox="0 0 12 12"
                refX="10"
                refY="6"
                markerWidth="9"
                markerHeight="9"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 12 6 L 0 12 z" fill="#0A0A0A" />
              </marker>
            </defs>

            {/* Floor perspective dashes (subtle) */}
            <g stroke="rgba(10,10,10,0.22)" strokeWidth={1} strokeDasharray="3 8" fill="none">
              <line x1={floorBL[0]} y1={floorBL[1]} x2={floorTL[0]} y2={floorTL[1]} />
              <line x1={floorBR[0]} y1={floorBR[1]} x2={floorTR[0]} y2={floorTR[1]} />
              <line x1={floorBL[0]} y1={floorBL[1]} x2={floorBR[0]} y2={floorBR[1]} />
              <line x1={floorTL[0]} y1={floorTL[1]} x2={floorTR[0]} y2={floorTR[1]} />
            </g>

            {/* Soft contact shadow under platform */}
            <ellipse cx={CX + 15} cy={FY + 65} rx={420} ry={42} fill="url(#floor-glow)" />

            {/* ---- Platform */}
            <HatchedBox
              cx={CX} fy={FY}
              u0={-PLAT_HU} u1={PLAT_HU}
              v0={PLAT_VFRONT} v1={PLAT_VBACK}
              w0={PLAT_W0} w1={PLAT_W1}
              hatchOpacity={0.4}
            />
            {/* DOSS wordmark on the platform top — projected onto top face */}
            <g transform={topFaceMatrix(dossOnTop[0], dossOnTop[1])}>
              <g transform="translate(-30, 1)">
                <circle cx={0} cy={0} r={9} fill="#0A0A0A" />
                <circle cx={0} cy={0} r={3.5} fill="#F5F0E2" />
              </g>
              <text
                x={9}
                y={6}
                textAnchor="start"
                fontFamily="'Inter', ui-sans-serif, system-ui, sans-serif"
                fontSize={22}
                fontWeight={900}
                fill="#0A0A0A"
                letterSpacing={-0.5}
              >
                DOSS
              </text>
            </g>

            {/* ---- CO-MANUFACTURING small box */}
            <HatchedBox
              cx={CX} fy={FY}
              u0={cm.u0} u1={cm.u1}
              v0={cm.v0} v1={cm.v1}
              w0={cm.w0} w1={cm.w1}
              hatchOpacity={0.5}
            />
            {(() => {
              const fcx = (cmFaces.frontFace[0][0] + cmFaces.frontFace[2][0]) / 2;
              const fcy = (cmFaces.frontFace[0][1] + cmFaces.frontFace[2][1]) / 2;
              return (
                <g transform={frontFaceMatrix(fcx, fcy)}>
                  {/* Plate behind the label so hatching doesn't overprint */}
                  <rect x={-44} y={-18} width={88} height={36} rx={3} fill="#F5F0E2" stroke="#0A0A0A" strokeWidth={0.9} />
                  <text
                    x={-13}
                    y={-3}
                    textAnchor="middle"
                    fontFamily="'JetBrains Mono', ui-monospace, monospace"
                    fontSize={9}
                    fontWeight={800}
                    fill="#0A0A0A"
                    letterSpacing={0.7}
                  >
                    CO-
                  </text>
                  <text
                    x={-13}
                    y={11}
                    textAnchor="middle"
                    fontFamily="'JetBrains Mono', ui-monospace, monospace"
                    fontSize={9}
                    fontWeight={800}
                    fill="#0A0A0A"
                    letterSpacing={0.7}
                  >
                    MANUFACTURING
                  </text>
                  <g transform="translate(28, 4)">
                    <UpDownArrows />
                  </g>
                </g>
              );
            })()}

            {/* ---- Cable from CO-MANUFACTURING to platform / yellow */}
            <Cable d={cable1d} width={18} />

            {/* ---- 3 colored boxes — yellow first (farthest from camera in
                3D iso depth: low u, low v), then blue, then red on top.
                Each cube is staircased +u and +v from the previous, so each
                cube's right face has a 45-unit strip exposed past the next
                cube — those are the visible "right side panels". */}
            <ColoredBox
              cx={CX} fy={FY}
              u0={yellow.u0} u1={yellow.u1}
              v0={yellow.v0} v1={yellow.v1}
              w0={yellow.w0} w1={yellow.w1}
              topColor="#F0BD3D"
              frontColor="#D9A21E"
              rightColor="#A57714"
              label="PROCUREMENT"
              iconNode={<POIcon />}
            />
            <ColoredBox
              cx={CX} fy={FY}
              u0={blue.u0} u1={blue.u1}
              v0={blue.v0} v1={blue.v1}
              w0={blue.w0} w1={blue.w1}
              topColor="#5B82E8"
              frontColor="#2F58C8"
              rightColor="#1D3DA0"
              label="INVENTORY"
              iconNode={<PackageIcon />}
            />
            <ColoredBox
              cx={CX} fy={FY}
              u0={red.u0} u1={red.u1}
              v0={red.v0} v1={red.v1}
              w0={red.w0} w1={red.w1}
              topColor="#F26460"
              frontColor="#DD3D38"
              rightColor="#A82923"
              label="ORDER MGMT"
              iconNode={<CartIcon />}
            />

            {/* ---- Hanging connector lines + lamp caps */}
            <g stroke="#0A0A0A" strokeWidth={1.6} fill="#0A0A0A">
              <circle cx={blueTopC[0]} cy={blueTopC[1]} r={3.5} />
              <line x1={blueTopC[0]} y1={blueTopC[1]} x2={lotBotC[0]} y2={lotBotC[1]} />
              <circle cx={redTopC[0]} cy={redTopC[1]} r={3.5} />
              <line x1={redTopC[0]} y1={redTopC[1]} x2={oaBotC[0]} y2={oaBotC[1]} />
            </g>

            {/* ---- Dark hanging tags */}
            <DarkTag
              cx={CX} fy={FY}
              u0={lotTag.u0} u1={lotTag.u1}
              v0={lotTag.v0} v1={lotTag.v1}
              w0={lotTag.w0} w1={lotTag.w1}
              line1="LOT"
              line2="TRACKING"
            />
            <DarkTag
              cx={CX} fy={FY}
              u0={oaTag.u0} u1={oaTag.u1}
              v0={oaTag.v0} v1={oaTag.v1}
              w0={oaTag.w0} w1={oaTag.w1}
              line1="ORDER"
              line2="AUTOMATION"
            />

            {/* ---- Right partner stack (3 hatched boxes) */}
            <HatchedBox cx={CX} fy={FY}
              u0={stack0.u0} u1={stack0.u1}
              v0={stack0.v0} v1={stack0.v1}
              w0={stack0.w0} w1={stack0.w1}
              hatchOpacity={0.5}
            />
            <HatchedBox cx={CX} fy={FY}
              u0={stack1.u0} u1={stack1.u1}
              v0={stack1.v0} v1={stack1.v1}
              w0={stack1.w0} w1={stack1.w1}
              hatchOpacity={0.5}
            />
            <HatchedBox cx={CX} fy={FY}
              u0={stack2.u0} u1={stack2.u1}
              v0={stack2.v0} v1={stack2.v1}
              w0={stack2.w0} w1={stack2.w1}
              hatchOpacity={0.5}
            />
            {/* Logos sit on label plates so hatching doesn't overprint */}
            <g transform={frontFaceMatrix(s2Faces.frontCenter[0], s2Faces.frontCenter[1])}>
              <rect x={-30} y={-18} width={60} height={36} rx={3} fill="#F5F0E2" stroke="#0A0A0A" strokeWidth={0.9} />
              <SPSGlyph />
            </g>
            <g transform={frontFaceMatrix(s1Faces.frontCenter[0], s1Faces.frontCenter[1])}>
              <rect x={-30} y={-18} width={60} height={36} rx={3} fill="#F5F0E2" stroke="#0A0A0A" strokeWidth={0.9} />
              <ShopifyGlyph />
            </g>
            <g transform={frontFaceMatrix(s0Faces.frontCenter[0], s0Faces.frontCenter[1])}>
              <rect x={-32} y={-12} width={64} height={24} rx={3} fill="#F5F0E2" stroke="#0A0A0A" strokeWidth={0.9} />
              <FlexportGlyph />
            </g>

            {/* ---- Three arrows from platform to partner stack */}
            {[s2Faces.frontCenter[1], s1Faces.frontCenter[1], s0Faces.frontCenter[1]].map((y, i) => (
              <line
                key={i}
                x1={arrowsXStart}
                y1={y}
                x2={arrowsXEnd - 4}
                y2={y}
                stroke="#0A0A0A"
                strokeWidth={2.2}
                markerEnd="url(#arrow-black)"
              />
            ))}

            {/* ---- Cable from red box to bottom partner box */}
            <Cable d={cable2d} width={14} />
          </svg>
        </div>
      </div>
    </div>
  );
}
