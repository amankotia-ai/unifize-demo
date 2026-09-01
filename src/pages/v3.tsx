import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ── Visual tokens ─────────────────────────────────────
const TOP_BLUE = 0x1840ff;
const MID_BLUE = 0x4060ff;
const BASE_BLUE = 0x6080ff;
const TIER_COLOR = 0x1a1a1a;
const SOC_TIER_COLOR = 0x14151a;
const SOC_CELL_COLOR = 0x1c1d24;
const IDP_INITIAL_COLOR = TIER_COLOR;
const COLOR_FADE_FRACTION = 0.35;
const GRID_TARGET_OPACITY = 0.22;
const GRID_FADE_DURATION = 0.5;
const EDGE = 0x000000;

// ── Camera ────────────────────────────────────────────
const DEFAULT_ELEVATION = 35.264;
const DEFAULT_AZIMUTH = 32.6;
const DEFAULT_FRUSTUM = 23.9;
const INITIAL_AZIMUTH = 18;
const INITIAL_FRUSTUM = 16;
const ENTRANCE_DURATION = 1300;
const CAM_DIST = 60;

// ── V3: Approach A — three-stage spatial reveal ───────
// Stage 0 (~3s): tight on the v1 scene as is — SoR + chaos + SoC
// Stage 1 (~3s): camera pulls back and shifts left, Unifize platform
//                emerges to the LEFT of SoC
// Stage 2 (~4s): camera continues left, outcome surface (product
//                screen + audit cards) appears further LEFT of Unifize
const STAGE_DURATIONS_S = [3.0, 3.0, 4.0]; // seconds per stage
const STAGE_LERP_RATE = 0.045;             // camera + opacity lerp per frame
const STAGE_LOOPING = false;               // hold at stage 2 — no loop

// Per-stage camera poses. Elevation stays fixed at 35.264° (true iso);
// look-target, frustum, and azimuth all lerp between stages.
// Narrative: each stage is TIGHTLY framed on the element of interest —
// stage 0 on the existing v1 scene (SoR + SoC + chaos), stage 1 on the
// Unifize platform, stage 2 on the outcome / audit trail.
const STAGE_CAM = [
  // Stage 0 — tight on the right side: SoR + chaos + SoC.
  { look: new THREE.Vector3(2, 4, 1),     frustum: 22, azimuth: 32 },
  // Stage 1 — tight on Unifize platform; SoC + capture arrows still
  // partially visible on the right edge of the frame for context.
  { look: new THREE.Vector3(-17, 2.5, 10),  frustum: 13, azimuth: 32 },
  // Stage 2 — pull back wide to frame the WHOLE world: SoR (right),
  // Unifize (left-back), SoC (left-front). Look-target is shifted far
  // to the LEFT of the scene's actual content centre so the iso
  // projection pushes the rendered content into the right ~55% of the
  // viewport, leaving the audit HTML panel an empty left strip to live in.
  { look: new THREE.Vector3(-20, 3, 2),  frustum: 36, azimuth: 32 },
];

// Per-stage visibility for the new elements added by V3.
// Same keys are used in `visTargets` and lerped per frame.
const STAGE_VIS = [
  { unifize: 0,   outcome: 0,   capture: 0,    writeback: 0,   audit: 0   },
  { unifize: 1,   outcome: 0,   capture: 1,    writeback: 0,   audit: 0   },
  { unifize: 1,   outcome: 1,   capture: 1,    writeback: 1,   audit: 1   },
];

// ── V3: Unifize platform geometry (Anthropic-style faceted stack) ──
// Each customer-facing layer is built from a grid of subcubes (the
// "bricks" pattern from the Concept Map / Anthropic Customer Boundary
// reference). Three layers per Concept Map §4 with Core Platform hidden.
const UNIFIZE_X = -19;
const UNIFIZE_Z = 11;
const UNIFIZE_BRICK_W = 1.35;
const UNIFIZE_BRICK_H = 0.72;
const UNIFIZE_BRICK_D = 1.35;
const UNIFIZE_BRICK_GAP = 0.05;
const UNIFIZE_GRID_X = 3; // bricks per layer along X
const UNIFIZE_GRID_Z = 3; // bricks per layer along Z
const UNIFIZE_LAYER_GAP = 0.05;
// Three customer-facing bands. Top = Outcomes + AI (brand blue, emissive);
// middle = Product Suite (deep blue); bottom = Workflow Components (deepest).
const UNIFIZE_BAND_DEFS = [
  { label: "OUTCOMES + AI ASSIST",
    top: 0x4078ff, front: 0x2862ff, right: 0x0040c9,
    emissive: 0x4090ff, emissiveIntensity: 0.5 },
  { label: "PRODUCT SUITE",
    top: 0x2244aa, front: 0x1a3590, right: 0x122670,
    emissive: 0x000000, emissiveIntensity: 0 },
  { label: "WORKFLOW COMPONENTS",
    top: 0x182558, front: 0x101840, right: 0x080e28,
    emissive: 0x000000, emissiveIntensity: 0 },
];

// ── V3: Outcome surface — vertical UI panel facing the camera ──
// The audit trail is now rendered as a high-res canvas-textured plane
// standing vertically next to Unifize, rotated to face the iso camera
// so the rows of the audit log are readable from the viewer's angle.
const OUTCOME_X = -27;
const OUTCOME_Z = 12;
// Panel face dimensions (in world units). The texture inside is rendered
// at a much higher pixel resolution and resampled.
const OUTCOME_PANEL_W = 6.6;
const OUTCOME_PANEL_H = 4.2;
// Floor pedestal under the panel — keeps it grounded in the iso world.
const OUTCOME_PEDESTAL_W = 7.4;
const OUTCOME_PEDESTAL_H = 0.18;
const OUTCOME_PEDESTAL_D = 1.6;
// (Audit row config now lives in the AuditTrailPanel component below.)
// Panel rotates this many degrees around Y so its +Z face points back
// at the iso camera. Three.js Y-rotation of +θ maps the default +Z
// normal to (sin θ, 0, cos θ) — which is exactly the direction from
// look-target to the iso camera position at azimuth θ.
const OUTCOME_PANEL_FACING_DEG = 32;

// ── Layout: two halves balanced across the iso diagonal ─
// In iso (azimuth 45°, elevation 35°), screen-y is contributed to by
// (worldX + worldZ). x+z = 0 for both stacks puts them on the same
// horizontal screen line, with (worldX - worldZ) driving them to far
// left / far right.
// 180° anti-clockwise: SoR sits screen-right, SoC sits screen-left.
const SOR_X = 7.5;
const SOR_Z = -7.5;
// SoC is pushed further away from SoR along the iso screen-left
// direction so there's more visible gap between the two stacks
// for the kaleidoscope to live in.
const SOC_X = -10;
const SOC_Z = 10;
// Look-at is raised well above the stacks so the scene sits below the
// hero header. The header takes the upper third; the scene fills the
// lower two thirds. The camera orbits this point (not origin) so the
// iso angle stays constant when LOOKAT_DEFAULT.y changes.
const LOOKAT_DEFAULT = new THREE.Vector3(0, 7, 0);

// ── Churn (the kaleidoscope between the two stacks) ───
// Shard origins are now anchored to the SoC icon cells (see
// SHARD_SOURCE_CELL); destinations are anchored to the SoR records
// or to a per-shard fall point along the actual flight path.
// Count is deliberately modest so individual flights stay trackable
// — the field reads as discrete artefacts attempting (and mostly
// failing) to crystallise, not as a wall of motion.
const CHURN_COUNT = 180;

// Fraction of shards that successfully crystallise as a record. The
// rest fall mid-flight as failed coordination work. The thesis is
// that most cross-functional work is lost; only a small fraction lands
// in a system of record. Rate is tuned so each record's visible stack
// has 4-6 shards at any time at 420 total count.
const SHARD_SUCCESS_RATE = 0.22;

// ── Debris (work that falls away under the churn) ─────
const DEBRIS_Y_MIN = -2.6;
const DEBRIS_Y_MAX = -0.5;
const DEBRIS_X_HALF = 4.5;
const DEBRIS_Z_HALF = 4.5;
const DEBRIS_COUNT = 200;

// ── Evidence stack dimensions (with-Unifize state) ─────
// Four organised slabs, one beneath each record, where peeled shards
// crystallise as auditable evidence in the with-Unifize state.
const EVIDENCE_Y_TOP = -0.55;
const EVIDENCE_W = 2.4;
const EVIDENCE_D = 2.4;
const EVIDENCE_H = 0.55;

// ── Chaotic debris fall region (without-Unifize state) ─
// Vertical band where failed shards come to rest in the gap floor.
// X/Z destinations are derived per-shard from the journey progress
// (so shards land where their flight ran out of altitude), not from
// a uniform debris zone.
const DEBRIS_FALL_Y_MIN = -1.6;
const DEBRIS_FALL_Y_MAX = -0.6;

// Per-record-type palette. Each shard belongs to a specific record
// (QMS / DMS / ERP / PLM) and inherits a colour family. Two tones
// per family keep the kaleidoscope feeling without losing the type
// signal at a glance. Order matches the SoR layout indices.
const RECORD_PALETTE: number[][] = [
  [0xfdba74, 0xfb923c], // QMS  → orange family (quality/SOPs)
  [0xa5b4fc, 0x818cf8], // DMS  → indigo family (documents)
  [0x6ee7b7, 0x34d399], // ERP  → emerald family (orders/invoices)
  [0xc4b5fd, 0xa78bfa], // PLM  → violet family (parts/BOMs)
];

// ── Shard silhouettes ─────────────────────────────────
// Each shard is rendered as a tiny silhouette of a coordination
// artefact — envelope, chat bubble, doc page, calendar tile, an
// @-mention pill, a transcript snippet — so the kaleidoscope reads
// as a kaleidoscope of WORK, not a confetti of pixels.
type ShardKind =
  | "envelope"
  | "chat"
  | "doc"
  | "calendar"
  | "mention"
  | "transcript";

const SHARD_KINDS: ShardKind[] = [
  "envelope",
  "chat",
  "doc",
  "calendar",
  "mention",
  "transcript",
];
const SHARD_PLANE_SIZE = 0.55;

// Origin map: each shard kind rises out of a specific SoC icon cell
// (3×3 grid coords matching the SoC layout in createSocStack). The
// eye learns "envelopes come from the email tile, chats from the
// chat tile, transcripts from the meeting tile" so flight starts
// read as emissions from real tools, not from a generic mouth.
const SHARD_SOURCE_CELL: Record<ShardKind, { gx: number; gz: number }> = {
  envelope: { gx: -1, gz: -1 },
  chat: { gx: 1, gz: -1 },
  doc: { gx: 1, gz: 0 },
  calendar: { gx: -1, gz: 1 },
  mention: { gx: 1, gz: 1 },
  transcript: { gx: 0, gz: -1 },
};

// ── Shard behaviours ──────────────────────────────────
// A shard's flight path is no longer a single clean parabola.
// Each shard picks one of four behaviours so the field reads as
// real coordination work — pauses, rework loops, orbits — not a
// uniform stream.
const BEHAVIOR_DIRECT = 0;
const BEHAVIOR_PAUSE = 1;
const BEHAVIOR_REWORK = 2;
const BEHAVIOR_ORBIT = 3;

// Cumulative bands used during shard creation. Roughly:
//   84% direct, 0% pause, 11% rework, 5% orbit.
// Pause was visually noisy without adding narrative; orbit is
// kept as visual punctuation but kept rare so it stays special.
const BEHAVIOR_BAND_DIRECT = 0.84;
const BEHAVIOR_BAND_PAUSE = 0.84;
const BEHAVIOR_BAND_REWORK = 0.95;

// Bursty arrival cadence: shards belong to one of N "burst groups".
// Each group has its own activity envelope so the population pulses
// rather than streaming uniformly. Baseline keeps a small trickle so
// a quiet page never looks frozen.
const BURST_GROUPS = 6;
const BURST_BASELINE = 0.05;

// Orbit phase boundaries (fractions of the per-shard cycle).
const ORBIT_TRAVERSE_END = 0.55;
const ORBIT_PHASE_END = 0.85;
const ORBIT_DROP_END = 0.97;

// SoR record growth: each successful shard absorbing into a record
// notches that record's scale.y up by a small increment, eased
// smoothly toward a cap. This is the cumulative "records are
// filling up" cue — the cube physically grows as work crystallises.
const MAX_RECORD_GROWTH = 1.45;
const RECORD_GROWTH_PER_IMPACT = 0.018;
const RECORD_GROWTH_LERP = 0.08;

interface SlabHandle {
  group: THREE.Group;
  materials: THREE.MeshBasicMaterial[];
  targetColors: THREE.Color[];
  lineMaterial: THREE.LineBasicMaterial;
}

function createSlab(
  w: number,
  h: number,
  d: number,
  baseColor: number,
  edgeOpacity = 0.45,
  initialColor?: number,
): SlabHandle {
  const geo = new THREE.BoxGeometry(w, h, d);
  geo.translate(0, h / 2, 0);

  const c = new THREE.Color(baseColor);
  const sideBright = c.clone().multiplyScalar(0.82).getHex();
  const sideDark = c.clone().multiplyScalar(0.62).getHex();

  const targetHexes = [
    sideBright,
    sideBright,
    baseColor,
    baseColor,
    sideDark,
    sideDark,
  ];
  const startColor = initialColor ?? -1;
  const materials = targetHexes.map(
    (t) =>
      new THREE.MeshBasicMaterial({
        color: startColor >= 0 ? startColor : t,
      }),
  );
  const targetColors = targetHexes.map((t) => new THREE.Color(t));

  const mesh = new THREE.Mesh(geo, materials);

  const edges = new THREE.EdgesGeometry(geo);
  const lineMaterial = new THREE.LineBasicMaterial({
    color: EDGE,
    transparent: true,
    opacity: edgeOpacity,
  });
  const lines = new THREE.LineSegments(edges, lineMaterial);

  const slab = new THREE.Group();
  slab.add(mesh);
  slab.add(lines);
  return { group: slab, materials, targetColors, lineMaterial };
}

const W = 3;
const D = 3;
const H = 0.5;
const GAP = 0.04;

const TIER_H = 0.4;
const TIERS = [{ size: 12 }, { size: 10 }, { size: 8 }];
const TIER_BASE_Y = 0;
const IDP_BASE_Y = TIER_BASE_Y + TIERS.length * TIER_H;

// SoC tile-grid layout. Kept at module scope so the churn layer can
// emit shards from the matching icon cells without re-deriving the
// cell positions.
const SOC_CELL_SIZE = 2.1;
const SOC_CELL_GAP = 0.06;
const SOC_CELL_HEIGHT = 0.18;
const SOC_CELL_PITCH = SOC_CELL_SIZE + SOC_CELL_GAP;
const SOC_CELL_TOP_Y = TIER_H + SOC_CELL_HEIGHT;

interface StackedBlockHandle {
  group: THREE.Group;
  materials: THREE.MeshBasicMaterial[];
  targetColors: THREE.Color[];
}

function createStackedBlock(soloTop = false): StackedBlockHandle {
  const group = new THREE.Group();
  const allMaterials: THREE.MeshBasicMaterial[] = [];
  const allTargets: THREE.Color[] = [];
  // Default: three brand-blue tiers (used by the SoR record cubes).
  // soloTop: a single TOP_BLUE slab — used by the SoC center cube
  // so it reads as one solid block rather than a layered stack.
  const tiers: { color: number; y: number }[] = soloTop
    ? [{ color: TOP_BLUE, y: 0 }]
    : [
        { color: BASE_BLUE, y: 0 },
        { color: MID_BLUE, y: H + GAP },
        { color: TOP_BLUE, y: (H + GAP) * 2 },
      ];
  for (const { color, y } of tiers) {
    const slab = createSlab(W, H, D, color, 0.45, IDP_INITIAL_COLOR);
    slab.group.position.y = y;
    group.add(slab.group);
    allMaterials.push(...slab.materials);
    allTargets.push(...slab.targetColors);
  }
  return { group, materials: allMaterials, targetColors: allTargets };
}

interface IsoGrid {
  mesh: THREE.LineSegments;
  material: THREE.ShaderMaterial;
}

function createIsoGrid(size: number, divisions: number): IsoGrid {
  const points: number[] = [];
  const half = size / 2;
  const step = size / divisions;
  for (let i = 0; i <= divisions; i++) {
    const t = -half + i * step;
    points.push(-half, 0, t, half, 0, t);
    points.push(t, 0, -half, t, 0, half);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(points, 3),
  );

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uResolution: { value: new THREE.Vector2(1, 1) },
      uColor: { value: new THREE.Color(0xffffff) },
      uOpacity: { value: 0.22 },
    },
    vertexShader: `
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec2 uResolution;
      uniform vec3 uColor;
      uniform float uOpacity;
      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution;
        vec2 dn = vec2((uv.x - 0.5) / 0.78, uv.y / 0.85);
        float r = length(dn);
        float alpha = 1.0 - smoothstep(0.35, 1.0, r);
        gl_FragColor = vec4(uColor, uOpacity * alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
  });
  return { mesh: new THREE.LineSegments(geo, material), material };
}

function easeOutBack(t: number, overshoot = 1.15) {
  const c1 = overshoot;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

type RecordIconKind = "logo" | "qms" | "dms" | "erp" | "plm";

function createLabelTexture(
  label: string,
  kind: RecordIconKind = "logo",
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 12;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Icon area: roughly 90..260 in canvas y, horizontally centred.
  const iconCx = canvas.width / 2;
  const iconCy = 175;

  if (kind === "logo") {
    // Microsoft-style 4-dot grid (kept for the SoC centre tile).
    const dotSize = 78;
    const dotGap = 16;
    const totalSize = dotSize * 2 + dotGap;
    const iconLeft = (canvas.width - totalSize) / 2;
    const iconTop = 90;

    const drawDot = (x: number, y: number, size: number) => {
      const r = 8;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + size - r, y);
      ctx.arcTo(x + size, y, x + size, y + r, r);
      ctx.lineTo(x + size, y + size - r);
      ctx.arcTo(x + size, y + size, x + size - r, y + size, r);
      ctx.lineTo(x + r, y + size);
      ctx.arcTo(x, y + size, x, y + size - r, r);
      ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();
      ctx.fill();
    };

    drawDot(iconLeft, iconTop, dotSize);
    drawDot(iconLeft + dotSize + dotGap, iconTop, dotSize);
    drawDot(iconLeft, iconTop + dotSize + dotGap, dotSize);
    drawDot(
      iconLeft + dotSize + dotGap,
      iconTop + dotSize + dotGap,
      dotSize,
    );
  } else if (kind === "qms") {
    // QMS: shield outline with checkmark. Reads as quality / SOPs.
    const w = 100;
    const h = 130;
    const x = iconCx - w / 2;
    const y = iconCy - h / 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h * 0.42);
    ctx.bezierCurveTo(
      x + w,
      y + h * 0.78,
      x + w * 0.7,
      y + h,
      x + w / 2,
      y + h,
    );
    ctx.bezierCurveTo(
      x + w * 0.3,
      y + h,
      x,
      y + h * 0.78,
      x,
      y + h * 0.42,
    );
    ctx.closePath();
    ctx.stroke();
    // Checkmark inside.
    ctx.beginPath();
    ctx.moveTo(iconCx - 22, iconCy + 2);
    ctx.lineTo(iconCx - 4, iconCy + 22);
    ctx.lineTo(iconCx + 26, iconCy - 18);
    ctx.stroke();
  } else if (kind === "dms") {
    // DMS: stacked documents.  A back page peeks behind the front.
    const w = 90;
    const h = 120;
    const x = iconCx - w / 2;
    const y = iconCy - h / 2;
    // Back page (offset).
    ctx.beginPath();
    ctx.rect(x + 14, y - 8, w, h);
    ctx.stroke();
    // Front page with folded corner.
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w - 22, y);
    ctx.lineTo(x + w, y + 22);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.closePath();
    ctx.fillStyle = "#0f1115";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.stroke();
    // Folded corner crease.
    ctx.beginPath();
    ctx.moveTo(x + w - 22, y);
    ctx.lineTo(x + w - 22, y + 22);
    ctx.lineTo(x + w, y + 22);
    ctx.stroke();
    // Three text lines.
    const oldLW = ctx.lineWidth;
    ctx.lineWidth = 8;
    for (let i = 0; i < 3; i++) {
      const yy = y + 60 + i * 18;
      ctx.beginPath();
      ctx.moveTo(x + 14, yy);
      ctx.lineTo(x + w - 14, yy);
      ctx.stroke();
    }
    ctx.lineWidth = oldLW;
  } else if (kind === "erp") {
    // ERP: tag with a dollar sign. Reads as orders / invoices.
    const w = 130;
    const h = 90;
    const x = iconCx - w / 2;
    const y = iconCy - h / 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w - 30, y);
    ctx.lineTo(x + w, y + h / 2);
    ctx.lineTo(x + w - 30, y + h);
    ctx.lineTo(x, y + h);
    ctx.closePath();
    ctx.stroke();
    // Hole on the right.
    ctx.beginPath();
    ctx.arc(x + w - 30, y + h / 2, 8, 0, Math.PI * 2);
    ctx.stroke();
    // $ symbol.
    ctx.font =
      "800 70px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("$", iconCx - 15, iconCy + 2);
  } else if (kind === "plm") {
    // PLM: isometric cube wireframe. Reads as parts / assemblies.
    const sx = 68; // horizontal half-width of the iso rhombus
    const sy = 36; // vertical half of the rhombus
    const top = iconCy - 56;
    const mid = iconCy - 20;
    const bot = iconCy + 60;
    // Top diamond.
    ctx.beginPath();
    ctx.moveTo(iconCx, top);
    ctx.lineTo(iconCx + sx, mid);
    ctx.lineTo(iconCx, mid + sy);
    ctx.lineTo(iconCx - sx, mid);
    ctx.closePath();
    ctx.stroke();
    // Vertical edges.
    ctx.beginPath();
    ctx.moveTo(iconCx, mid + sy);
    ctx.lineTo(iconCx, bot);
    ctx.moveTo(iconCx + sx, mid);
    ctx.lineTo(iconCx + sx, bot - sy);
    ctx.moveTo(iconCx - sx, mid);
    ctx.lineTo(iconCx - sx, bot - sy);
    ctx.stroke();
    // Bottom edges (visible faces).
    ctx.beginPath();
    ctx.moveTo(iconCx, bot);
    ctx.lineTo(iconCx + sx, bot - sy);
    ctx.moveTo(iconCx, bot);
    ctx.lineTo(iconCx - sx, bot - sy);
    ctx.stroke();
  }

  ctx.fillStyle = "#ffffff";
  ctx.font = "600 92px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, canvas.width / 2, 380);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

interface LabelHandle {
  mesh: THREE.Mesh;
  material: THREE.MeshBasicMaterial;
}

function createLabelPlane(
  label: string,
  size: number,
  kind: RecordIconKind = "logo",
): LabelHandle {
  const tex = createLabelTexture(label, kind);
  const geo = new THREE.PlaneGeometry(size, size);
  geo.rotateX(-Math.PI / 2);
  const material = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geo, material);
  mesh.renderOrder = 1;
  return { mesh, material };
}

// ── Collab icon canvas (Microsoft-stack only) ─────────
type CollabIconKind =
  | "envelope"
  | "chat"
  | "call"
  | "calendar"
  | "mention"
  | "meeting"
  | "doc"
  | "approval";

function createCollabIconTexture(
  kind: CollabIconKind,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#ffffff";
  ctx.fillStyle = "#ffffff";
  ctx.lineWidth = 14;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  if (kind === "envelope") {
    // Outlook-style envelope
    const w = 150;
    const h = 100;
    ctx.strokeRect(cx - w / 2, cy - h / 2, w, h);
    ctx.beginPath();
    ctx.moveTo(cx - w / 2, cy - h / 2);
    ctx.lineTo(cx, cy + 8);
    ctx.lineTo(cx + w / 2, cy - h / 2);
    ctx.stroke();
  } else if (kind === "chat") {
    // Teams-style chat bubble
    ctx.beginPath();
    const r = 28;
    const x = cx - 70;
    const y = cy - 56;
    const w = 140;
    const h = 100;
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + 50, y + h);
    ctx.lineTo(x + 30, y + h + 26);
    ctx.lineTo(x + 30, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
    ctx.stroke();
  } else if (kind === "call") {
    // Phone handset
    ctx.beginPath();
    ctx.moveTo(cx - 56, cy - 60);
    ctx.lineTo(cx - 30, cy - 60);
    ctx.lineTo(cx - 14, cy - 14);
    ctx.lineTo(cx - 36, cy + 8);
    ctx.lineTo(cx + 8, cy + 56);
    ctx.lineTo(cx + 36, cy + 30);
    ctx.lineTo(cx + 64, cy + 46);
    ctx.lineTo(cx + 64, cy + 70);
    ctx.stroke();
  } else if (kind === "calendar") {
    // Outlook calendar
    const w = 140;
    const h = 130;
    ctx.strokeRect(cx - w / 2, cy - h / 2 + 12, w, h - 12);
    ctx.beginPath();
    ctx.moveTo(cx - 50, cy - h / 2);
    ctx.lineTo(cx - 50, cy - h / 2 + 24);
    ctx.moveTo(cx + 50, cy - h / 2);
    ctx.lineTo(cx + 50, cy - h / 2 + 24);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - w / 2, cy - h / 2 + 38);
    ctx.lineTo(cx + w / 2, cy - h / 2 + 38);
    ctx.stroke();
  } else if (kind === "mention") {
    // @ symbol
    ctx.font = "600 200px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("@", cx, cy + 6);
  } else if (kind === "meeting") {
    // Two avatar circles
    ctx.beginPath();
    ctx.arc(cx - 26, cy - 4, 30, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 26, cy + 4, 30, 0, Math.PI * 2);
    ctx.stroke();
  } else if (kind === "doc") {
    // SharePoint document
    const w = 110;
    const h = 140;
    const x = cx - w / 2;
    const y = cy - h / 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w - 32, y);
    ctx.lineTo(x + w, y + 32);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + w - 32, y);
    ctx.lineTo(x + w - 32, y + 32);
    ctx.lineTo(x + w, y + 32);
    ctx.stroke();
  } else if (kind === "approval") {
    // Checkmark
    ctx.beginPath();
    ctx.moveTo(cx - 56, cy + 4);
    ctx.lineTo(cx - 14, cy + 46);
    ctx.lineTo(cx + 60, cy - 40);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function createCollabIconPlane(
  kind: CollabIconKind,
  size: number,
): LabelHandle {
  const tex = createCollabIconTexture(kind);
  const geo = new THREE.PlaneGeometry(size, size);
  geo.rotateX(-Math.PI / 2);
  const material = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geo, material);
  mesh.renderOrder = 1;
  return { mesh, material };
}

// ── SoC stack: dark tier + center cube + 8 icon cells ─
interface SocStackHandle {
  group: THREE.Group;
  tierMaterials: THREE.MeshBasicMaterial[];
  tierTargets: THREE.Color[];
  cellMaterials: THREE.MeshBasicMaterial[];
  cellTargets: THREE.Color[];
  centerMaterials: THREE.MeshBasicMaterial[];
  centerTargets: THREE.Color[];
  iconMaterials: THREE.MeshBasicMaterial[];
  centerLabelMaterial: THREE.MeshBasicMaterial;
}

function createSocStack(): SocStackHandle {
  const group = new THREE.Group();

  // Single dark tier matching the SoR base height. Slightly smaller
  // footprint so the SoC reads as one unit, not a pyramid.
  const tier = createSlab(8, TIER_H, 8, SOC_TIER_COLOR, 0.55);
  tier.group.position.y = 0;
  group.add(tier.group);

  // 3x3 grid of cells on top of the tier. Each cell is 2x2 with a small
  // gap. The center cell holds the SoC cube. The 8 surrounding cells
  // each hold a flat icon plane. Layout is sourced from the SOC_CELL_*
  // module constants so the churn layer's source-cell lookups stay
  // aligned with what we render here.
  const CELL_SIZE = SOC_CELL_SIZE;
  const CELL_GAP = SOC_CELL_GAP;
  const CELL_H = SOC_CELL_HEIGHT;
  const cellY = TIER_H;
  const positions: { x: number; z: number; kind: CollabIconKind | "center" }[] = [
    { x: -1, z: -1, kind: "envelope" },
    { x: 0, z: -1, kind: "meeting" },
    { x: 1, z: -1, kind: "chat" },
    { x: -1, z: 0, kind: "call" },
    { x: 0, z: 0, kind: "center" },
    { x: 1, z: 0, kind: "doc" },
    { x: -1, z: 1, kind: "calendar" },
    { x: 0, z: 1, kind: "approval" },
    { x: 1, z: 1, kind: "mention" },
  ];

  const cellMaterials: THREE.MeshBasicMaterial[] = [];
  const cellTargets: THREE.Color[] = [];
  const iconMaterials: THREE.MeshBasicMaterial[] = [];

  // Center cube: a single TOP_BLUE slab so the SoC reads as one
  // solid block rather than a tiered stack. (The SoR record cubes
  // still use the full three-tier version.)
  const centerHandle = createStackedBlock(true);

  for (const cell of positions) {
    const px = cell.x * (CELL_SIZE + CELL_GAP);
    const pz = cell.z * (CELL_SIZE + CELL_GAP);

    if (cell.kind === "center") {
      centerHandle.group.position.set(px, cellY, pz);
      group.add(centerHandle.group);

      const centerLabel = createLabelPlane(
        "SoC",
        CELL_SIZE * 0.9,
      );
      // Single-slab top sits at y = H instead of (H+GAP)*2 + H.
      centerLabel.mesh.position.y = H + 0.01;
      centerHandle.group.add(centerLabel.mesh);
      // store for return
      (centerHandle as unknown as {
        labelMaterial: THREE.MeshBasicMaterial;
      }).labelMaterial = centerLabel.material;
      continue;
    }

    // Flat icon cell: a thin dark slab + an icon plane on top.
    const cellSlab = createSlab(
      CELL_SIZE,
      CELL_H,
      CELL_SIZE,
      SOC_CELL_COLOR,
      0.4,
      IDP_INITIAL_COLOR,
    );
    cellSlab.group.position.set(px, cellY, pz);
    group.add(cellSlab.group);
    cellMaterials.push(...cellSlab.materials);
    cellTargets.push(...cellSlab.targetColors);

    const icon = createCollabIconPlane(cell.kind, CELL_SIZE * 0.78);
    icon.mesh.position.set(px, cellY + CELL_H + 0.005, pz);
    group.add(icon.mesh);
    iconMaterials.push(icon.material);
  }

  return {
    group,
    tierMaterials: tier.materials,
    tierTargets: tier.targetColors,
    cellMaterials,
    cellTargets,
    centerMaterials: centerHandle.materials,
    centerTargets: centerHandle.targetColors,
    iconMaterials,
    centerLabelMaterial: (centerHandle as unknown as {
      labelMaterial: THREE.MeshBasicMaterial;
    }).labelMaterial,
  };
}

// ── Shard silhouette texture ──────────────────────────
// Renders a per-kind silhouette as a 256×256 alpha-cut canvas. The
// silhouette is drawn in opaque white; per-instance colour tints it
// at render time so the kaleidoscope still carries the per-record
// palette. Cutouts are made via destination-out so the eye reads
// recognisable artefact features (envelope flap, doc fold, calendar
// grid, @ glyph, etc) at small size.
function createShardTexture(kind: ShardKind): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#ffffff";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const cx = size / 2;
  const cy = size / 2;

  if (kind === "envelope") {
    const w = 184;
    const h = 124;
    const x = cx - w / 2;
    const y = cy - h / 2;
    ctx.fillRect(x, y, w, h);
    // V-flap knock-out so the shape reads as an envelope, not a card.
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.moveTo(x + 6, y + 8);
    ctx.lineTo(cx, y + 70);
    ctx.lineTo(x + w - 6, y + 8);
    ctx.lineTo(x + w - 6, y + 2);
    ctx.lineTo(x + 6, y + 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  } else if (kind === "chat") {
    const w = 178;
    const h = 116;
    const r = 30;
    const x = cx - w / 2;
    const y = cy - h / 2 - 12;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + 64, y + h);
    ctx.lineTo(x + 38, y + h + 36);
    ctx.lineTo(x + 38, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
    ctx.fill();
    // Two short knock-out lines suggesting message text.
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillRect(x + 22, y + 30, w - 86, 12);
    ctx.fillRect(x + 22, y + 58, w - 56, 12);
    ctx.restore();
  } else if (kind === "doc") {
    const w = 132;
    const h = 174;
    const fold = 36;
    const x = cx - w / 2;
    const y = cy - h / 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w - fold, y);
    ctx.lineTo(x + w, y + fold);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.closePath();
    ctx.fill();
    // Knock-out the fold corner triangle.
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.moveTo(x + w - fold, y);
    ctx.lineTo(x + w - fold, y + fold);
    ctx.lineTo(x + w, y + fold);
    ctx.closePath();
    ctx.fill();
    // Three knock-out text lines.
    for (let i = 0; i < 3; i++) {
      const ly = y + 64 + i * 24;
      ctx.fillRect(x + 18, ly, w - 36, 10);
    }
    ctx.restore();
  } else if (kind === "calendar") {
    const w = 162;
    const h = 152;
    const x = cx - w / 2;
    const y = cy - h / 2;
    ctx.fillRect(x, y, w, h);
    // Tabs at the top so it reads as a calendar.
    ctx.fillRect(x + 22, y - 18, 18, 26);
    ctx.fillRect(x + w - 40, y - 18, 18, 26);
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    // Header band.
    ctx.fillRect(x + 12, y + 30, w - 24, 6);
    // 4×2 date grid.
    const cellW = 24;
    const cellH = 20;
    const gx = 8;
    const gy = 12;
    const ox = x + 16;
    const oy = y + 56;
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 4; c++) {
        ctx.fillRect(ox + c * (cellW + gx), oy + r * (cellH + gy), cellW, cellH);
      }
    }
    ctx.restore();
  } else if (kind === "mention") {
    const w = 162;
    const h = 100;
    const r = h / 2;
    const x = cx - w / 2;
    const y = cy - h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + r, r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
    ctx.fill();
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.font = "800 88px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("@", cx, cy + 6);
    ctx.restore();
  } else {
    // transcript: stacked left-aligned bars suggesting meeting notes.
    const widths = [180, 144, 168, 110, 156, 90];
    const lineH = 14;
    const gap = 12;
    const totalH = widths.length * lineH + (widths.length - 1) * gap;
    const startY = cy - totalH / 2;
    const xLeft = cx - 90;
    for (let i = 0; i < widths.length; i++) {
      const y = startY + i * (lineH + gap);
      ctx.fillRect(xLeft, y, widths[i], lineH);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

// ── Churn: per-shard ballistic trajectory toward a typed record ──
// Each shard belongs to one of the four records (QMS/DMS/ERP/PLM)
// and travels on a single quadratic Bezier from a SoC emit point to
// either (a) a jittered landing on its target record (success) or
// (b) a fall point along the journey (failure). The Bezier control
// point gives the trajectory a natural ballistic shape: rise then
// fall. No separate "peel and arc" phase. Falling happens during
// the traversal, not as an event.
//
// Flow axis points from SoC (-7.5, _, +7.5) toward SoR (+7.5, _, -7.5).
// Reverse trickle anchor: 2 units forward of the SoC mouth toward
// SoR. When SOC_X/Z change, these shift in lockstep so the trickle
// still emerges from the new SoC mouth and terminates near SoR.
const FLOW_START_X = -8;
const FLOW_START_Z = 8;
const FLOW_LENGTH = 19.1;
const FLOW_DIR_X = 1 / Math.SQRT2;
const FLOW_DIR_Z = -1 / Math.SQRT2;
const PERP_DIR_X = 1 / Math.SQRT2;
const PERP_DIR_Z = 1 / Math.SQRT2;
const FLOW_FADE_IN = 0.04; // first 4% of trajectory: fade in
// 40% of each cycle is spent settled. Combined with random cycle
// offsets across the population, this means ~40% of shards are
// visibly piled at any moment, building persistent stacks on the
// records and evidence slabs.
const SETTLE_FRACTION = 0.40;
// Only the last 5% of the cycle fades out, so shards remain visible
// during their rest period rather than dimming as they sit.
const SETTLE_TAIL_FADE = 0.05;
// Smooth blend from tumble to flat orientation over the last 10% of
// the traverse. Without this, the rotation snap is visible at the
// landing instant.
const ROT_BLEND_WINDOW = 0.10;

interface ChurnHandle {
  // One InstancedMesh per silhouette kind. A shard's logical index
  // routes to (meshes[shardKindIndex[i]], slot shardLocalIndex[i]).
  meshes: THREE.InstancedMesh[];
  shardKindIndex: Uint8Array;
  shardLocalIndex: Uint16Array;
  // Per-shard time control
  cycleOffsets: Float32Array; // 0..1 initial phase
  cycleSpeeds: Float32Array; // cycles per second
  // Bezier endpoints (start/end change with mode for failures)
  startX: Float32Array;
  startY: Float32Array;
  startZ: Float32Array;
  // Jittered landing offset within record footprint (success only)
  landingDx: Float32Array;
  landingDz: Float32Array;
  // Per-shard chaotic fall destination (failure, without-Unifize)
  fallX: Float32Array;
  fallY: Float32Array;
  fallZ: Float32Array;
  // Trajectory shape control
  arcHeight: Float32Array; // peak rise above midpoint
  // Visual variety
  phases: Float32Array;
  spinRates: Float32Array;
  scaleSeeds: Float32Array;
  // Type and fate
  recordTargets: Uint8Array; // 0..3
  fates: Uint8Array; // 0 = fail, 1 = success
  // Stacking
  stackSeeds: Float32Array; // 0..1 normalised vertical offset within stack
  flatYRotations: Float32Array; // fixed Y rotation when settled
  // Per-shard behaviour (DIRECT / PAUSE / REWORK / ORBIT) and its params.
  behaviors: Uint8Array;
  pauseStarts: Float32Array; // stall start (fraction of cycle)
  pauseDurations: Float32Array; // stall length (fraction of cycle)
  reworkPerps: Float32Array; // perpendicular offset of loop apex
  orbitRadii: Float32Array;
  orbitYOffset: Float32Array;
  orbitDirection: Int8Array; // ±1
  // Bursty cadence: each shard belongs to a burst group; each group
  // accumulates its own effective time so arrivals come in waves.
  burstGroups: Uint8Array;
  groupEffectiveTime: Float32Array;
  prevT: number;
  // Last-frame flow per shard (-1 = uninitialised). Used to detect
  // the moment a successful shard transitions from traversal to
  // landing so the caller can grow the target record.
  prevFlows: Float32Array;
  count: number;
}

function createChurnLayer(
  count: number,
  recordPositions: { x: number; y: number; z: number }[],
  evidencePositions: { x: number; y: number; z: number }[],
): ChurnHandle {
  void evidencePositions;

  // Pre-assign each shard a silhouette kind so we know how many
  // instances each per-kind mesh needs. Round-robin distribution
  // gives an even mix of envelopes / chats / docs / etc.
  const shardKindIndex = new Uint8Array(count);
  const perKindCount = new Array<number>(SHARD_KINDS.length).fill(0);
  for (let i = 0; i < count; i++) {
    const k = i % SHARD_KINDS.length;
    shardKindIndex[i] = k;
    perKindCount[k]++;
  }

  // Build one InstancedMesh per kind. They share a flat-plane
  // geometry rotated to lie horizontally in XZ, with a per-kind
  // silhouette texture. Per-instance colour tints the silhouette
  // according to the shard's record-type palette.
  const baseGeo = new THREE.PlaneGeometry(SHARD_PLANE_SIZE, SHARD_PLANE_SIZE);
  baseGeo.rotateX(-Math.PI / 2);

  const meshes: THREE.InstancedMesh[] = SHARD_KINDS.map((kind, idx) => {
    const tex = createShardTexture(kind);
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: false,
      side: THREE.DoubleSide,
      alphaTest: 0.5,
    });
    const m = new THREE.InstancedMesh(baseGeo, mat, perKindCount[idx]);
    m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    return m;
  });

  // Hand each shard its slot in the right per-kind mesh.
  const shardLocalIndex = new Uint16Array(count);
  const cursors = new Array<number>(SHARD_KINDS.length).fill(0);
  for (let i = 0; i < count; i++) {
    const k = shardKindIndex[i];
    shardLocalIndex[i] = cursors[k]++;
  }

  const cycleOffsets = new Float32Array(count);
  const cycleSpeeds = new Float32Array(count);
  const startX = new Float32Array(count);
  const startY = new Float32Array(count);
  const startZ = new Float32Array(count);
  const landingDx = new Float32Array(count);
  const landingDz = new Float32Array(count);
  const fallX = new Float32Array(count);
  const fallY = new Float32Array(count);
  const fallZ = new Float32Array(count);
  const arcHeight = new Float32Array(count);
  const phases = new Float32Array(count);
  const spinRates = new Float32Array(count);
  const scaleSeeds = new Float32Array(count);
  const recordTargets = new Uint8Array(count);
  const fates = new Uint8Array(count);
  const stackSeeds = new Float32Array(count);
  const flatYRotations = new Float32Array(count);
  const behaviors = new Uint8Array(count);
  const pauseStarts = new Float32Array(count);
  const pauseDurations = new Float32Array(count);
  const reworkPerps = new Float32Array(count);
  const orbitRadii = new Float32Array(count);
  const orbitYOffset = new Float32Array(count);
  const orbitDirection = new Int8Array(count);
  const burstGroups = new Uint8Array(count);
  const prevFlows = new Float32Array(count).fill(-1);

  // Resolve palette into THREE.Color instances per record type.
  const palette = RECORD_PALETTE.map((tones) =>
    tones.map((c) => new THREE.Color(c)),
  );

  for (let i = 0; i < count; i++) {
    cycleOffsets[i] = Math.random();
    // 10..20 second traversal (cycles/sec = 0.05..0.10). Slower
    // than before so each individual flight is trackable — the eye
    // can follow an envelope from the email tile to its target.
    cycleSpeeds[i] = 0.05 + Math.random() * 0.05;

    // Emit from the airspace ABOVE the shard's source cell, not on
    // top of it. Lifting the emission band to 0.8..1.4 above the
    // cell top keeps the SoC icon cells visually clear — shards
    // spawn and rise into the gap rather than sitting on the icons.
    const sourceCell =
      SHARD_SOURCE_CELL[SHARD_KINDS[shardKindIndex[i]]];
    const cellWorldX = SOC_X + sourceCell.gx * SOC_CELL_PITCH;
    const cellWorldZ = SOC_Z + sourceCell.gz * SOC_CELL_PITCH;
    const cellJitter = SOC_CELL_SIZE * 0.32;
    startX[i] = cellWorldX + (Math.random() * 2 - 1) * cellJitter;
    startY[i] = SOC_CELL_TOP_Y + 0.8 + Math.random() * 0.6;
    startZ[i] = cellWorldZ + (Math.random() * 2 - 1) * cellJitter;

    // Type assignment: 0..3 (QMS, DMS, ERP, PLM in this layout).
    const target = Math.floor(Math.random() * 4);
    recordTargets[i] = target;

    // Most shards fail. Only a small fraction successfully land.
    fates[i] = Math.random() < SHARD_SUCCESS_RATE ? 1 : 0;

    // Successful shards land at a jittered offset within the record
    // footprint. Tighter than before so the visible pile reads as a
    // pile, not a halo.
    landingDx[i] = (Math.random() * 2 - 1) * 1.0;
    landingDz[i] = (Math.random() * 2 - 1) * 1.0;

    // Failure debris lands along this shard's specific flight path
    // between its source cell and its target record — not on a
    // generic flow axis. failProgress controls how far the shard got
    // before failing; a bias toward later failures keeps the debris
    // weighted toward the gap centre rather than near the SoC.
    const targetWorldX = recordPositions[target].x;
    const targetWorldZ = recordPositions[target].z;
    const failProgress = 0.25 + Math.pow(Math.random(), 0.7) * 0.55;
    const flightDx = targetWorldX - startX[i];
    const flightDz = targetWorldZ - startZ[i];
    const flightLen = Math.hypot(flightDx, flightDz) || 1;
    // Perpendicular to the shard's flight direction.
    const perpDX = -flightDz / flightLen;
    const perpDZ = flightDx / flightLen;
    const sideJitter = (Math.random() * 2 - 1) * 1.4;
    fallX[i] =
      startX[i] + flightDx * failProgress + perpDX * sideJitter;
    fallY[i] =
      DEBRIS_FALL_Y_MIN +
      Math.random() * (DEBRIS_FALL_Y_MAX - DEBRIS_FALL_Y_MIN);
    fallZ[i] =
      startZ[i] + flightDz * failProgress + perpDZ * sideJitter;

    arcHeight[i] = 0.6 + Math.random() * 1.2;
    phases[i] = Math.random() * Math.PI * 2;
    spinRates[i] = (Math.random() * 2 - 1) * 1.6;
    scaleSeeds[i] = 0.55 + Math.random() * 0.7;

    // Stack-Y normalised seed. random² biases toward 0, so the pile
    // is denser at the bottom than at the top — like a real stack
    // accumulating from the bottom up.
    const r = Math.random();
    stackSeeds[i] = r * r;
    flatYRotations[i] = Math.random() * Math.PI * 2;

    // Behaviour assignment.
    const br = Math.random();
    let behavior: number;
    if (br < BEHAVIOR_BAND_DIRECT) behavior = BEHAVIOR_DIRECT;
    else if (br < BEHAVIOR_BAND_PAUSE) behavior = BEHAVIOR_PAUSE;
    else if (br < BEHAVIOR_BAND_REWORK) behavior = BEHAVIOR_REWORK;
    else behavior = BEHAVIOR_ORBIT;
    // Orbit shards always fail — the orbit is a stall before falling.
    if (behavior === BEHAVIOR_ORBIT) fates[i] = 0;
    behaviors[i] = behavior;

    // Pause params: stall in [0.25, 0.45] for [0.10, 0.20] of the cycle.
    pauseStarts[i] = 0.25 + Math.random() * 0.20;
    pauseDurations[i] = 0.10 + Math.random() * 0.10;

    // Rework: perpendicular offset of the loop apex so multiple
    // simultaneous loops fan out instead of overlaying.
    reworkPerps[i] = (Math.random() * 2 - 1) * 1.6;

    // Orbit params.
    orbitRadii[i] = 1.05 + Math.random() * 0.45;
    orbitYOffset[i] = 0.55 + Math.random() * 0.6;
    orbitDirection[i] = Math.random() < 0.5 ? -1 : 1;

    burstGroups[i] = Math.floor(Math.random() * BURST_GROUPS);

    // Per-instance colour tint on the right per-kind mesh.
    const tones = palette[target];
    const k = shardKindIndex[i];
    meshes[k].setColorAt(shardLocalIndex[i], tones[i % tones.length]);
  }
  for (const m of meshes) {
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }

  return {
    meshes,
    shardKindIndex,
    shardLocalIndex,
    cycleOffsets,
    cycleSpeeds,
    startX,
    startY,
    startZ,
    landingDx,
    landingDz,
    fallX,
    fallY,
    fallZ,
    arcHeight,
    phases,
    spinRates,
    scaleSeeds,
    recordTargets,
    fates,
    stackSeeds,
    flatYRotations,
    behaviors,
    pauseStarts,
    pauseDurations,
    reworkPerps,
    orbitRadii,
    orbitYOffset,
    orbitDirection,
    burstGroups,
    groupEffectiveTime: new Float32Array(BURST_GROUPS),
    prevT: -1,
    prevFlows,
    count,
  };
}

// Activity envelope per burst group: a Gaussian bump centred on the
// group's own phase. Most of each group's cycle is near baseline;
// a short window near the bump centre is at full activity. Combined
// with offset phases across groups, the population shows bursts and
// quiet stretches instead of a uniform stream.
function burstEnvelope(group: number, t: number): number {
  const period = 9 + group * 1.7;
  const phase = group * 0.413;
  const x = (((t / period) + phase) % 1 + 1) % 1;
  const d = (x - 0.5) * 5.0;
  return BURST_BASELINE + (1 - BURST_BASELINE) * Math.exp(-d * d * 1.4);
}

function updateChurn(
  handle: ChurnHandle,
  t: number,
  intro: number,
  unifizeOn: boolean,
  recordPositions: { x: number; y: number; z: number }[],
  evidencePositions: { x: number; y: number; z: number }[],
  onImpact?: (target: number) => void,
) {
  // Advance per-group effective time using each group's bursty
  // envelope. Clamp dt so a backgrounded tab returning to the page
  // doesn't fast-forward the entire population.
  const dtRaw = handle.prevT < 0 ? 0 : t - handle.prevT;
  const dt = Math.max(0, Math.min(0.1, dtRaw));
  handle.prevT = t;
  for (let g = 0; g < BURST_GROUPS; g++) {
    handle.groupEffectiveTime[g] += dt * burstEnvelope(g, t);
  }

  const dummy = new THREE.Object3D();
  const meshDirty = new Array<boolean>(handle.meshes.length).fill(false);

  for (let i = 0; i < handle.count; i++) {
    const offset = handle.cycleOffsets[i];
    const speed = handle.cycleSpeeds[i];
    const phase = handle.phases[i];
    const seed = handle.scaleSeeds[i];
    const target = handle.recordTargets[i];
    const fate = handle.fates[i];
    const arcH = handle.arcHeight[i];
    const sx = handle.startX[i];
    const sy = handle.startY[i];
    const sz = handle.startZ[i];
    const behavior = handle.behaviors[i];

    // Per-shard cycle progresses on the burst group's effective time
    // rather than on raw wall-clock time, so groups in a low-activity
    // window appear paused while groups in a peak window sweep
    // through their cycle quickly.
    const groupT = handle.groupEffectiveTime[handle.burstGroups[i]];
    const flow = ((offset + groupT * speed) % 1 + 1) % 1;

    let posX = sx;
    let posY = sy;
    let posZ = sz;
    let edgeAlpha = 1;

    if (behavior === BEHAVIOR_REWORK) {
      // Rework loop: end equals start; control is forward-and-up
      // along the flow axis with a perpendicular offset. The Bezier
      // collapses into an out-and-back arc — shards that head toward
      // SoR and then return to SoC unfinished.
      const reworkPerp = handle.reworkPerps[i];
      const midForward = 0.55 * FLOW_LENGTH;
      const cxL = sx + midForward * FLOW_DIR_X + reworkPerp * PERP_DIR_X;
      const czL = sz + midForward * FLOW_DIR_Z + reworkPerp * PERP_DIR_Z;
      const cyL = sy + arcH * 1.3 + 0.4;
      const bezT = flow;
      const omt = 1 - bezT;
      posX = omt * omt * sx + 2 * omt * bezT * cxL + bezT * bezT * sx;
      posY = omt * omt * sy + 2 * omt * bezT * cyL + bezT * bezT * sy;
      posZ = omt * omt * sz + 2 * omt * bezT * czL + bezT * bezT * sz;

      // Persistent path noise — rework should feel uneasy, not clean.
      const wob =
        Math.sin(t * 0.7 + phase * 1.4) * 0.55 +
        Math.sin(t * 1.7 + phase * 2.7) * 0.30;
      posX += wob * PERP_DIR_X * 0.6;
      posZ += wob * PERP_DIR_Z * 0.6;
      posY += Math.sin(t * 0.5 + phase) * 0.18;

      if (flow < 0.05) edgeAlpha = flow / 0.05;
      else if (flow > 0.92) edgeAlpha = (1 - flow) / 0.08;
    } else if (behavior === BEHAVIOR_ORBIT && fate === 0) {
      // Traverse → orbit → drop. The shard heads for the target
      // record, circles it briefly, then drops into the debris
      // floor — the "almost made it but couldn't be filed" pattern.
      const r = recordPositions[target];
      const approachX = r.x + handle.landingDx[i] * 0.4;
      const approachY = r.y + handle.orbitYOffset[i] + 0.6;
      const approachZ = r.z + handle.landingDz[i] * 0.4;

      if (flow < ORBIT_TRAVERSE_END) {
        const bezT = flow / ORBIT_TRAVERSE_END;
        const ex = approachX;
        const ey = approachY;
        const ez = approachZ;
        const cxL = (sx + ex) * 0.5;
        const czL = (sz + ez) * 0.5;
        const cyL =
          Math.max(sy, ey) + arcH + Math.sin(phase * 1.7) * 0.15;
        const omt = 1 - bezT;
        posX = omt * omt * sx + 2 * omt * bezT * cxL + bezT * bezT * ex;
        posY = omt * omt * sy + 2 * omt * bezT * cyL + bezT * bezT * ey;
        posZ = omt * omt * sz + 2 * omt * bezT * czL + bezT * bezT * ez;

        if (flow < FLOW_FADE_IN) edgeAlpha = flow / FLOW_FADE_IN;

        const wobScale = 1 - bezT * 0.6;
        const wob =
          Math.sin(t * 0.7 + phase * 1.4) * 0.45 +
          Math.sin(t * 1.6 + phase * 2.7) * 0.25;
        posX += wob * PERP_DIR_X * wobScale;
        posZ += wob * PERP_DIR_Z * wobScale;
        posY += Math.sin(t * 0.5 + phase) * 0.12 * wobScale;
      } else if (flow < ORBIT_PHASE_END) {
        const orbitT =
          (flow - ORBIT_TRAVERSE_END) /
          (ORBIT_PHASE_END - ORBIT_TRAVERSE_END);
        const radius = handle.orbitRadii[i];
        const yOff = handle.orbitYOffset[i];
        const dir = handle.orbitDirection[i];
        const angle = phase + dir * orbitT * Math.PI * 2;
        posX = r.x + Math.cos(angle) * radius;
        posY = r.y + yOff + Math.sin(t * 1.2 + phase) * 0.08;
        posZ = r.z + Math.sin(angle) * radius;
      } else if (flow < ORBIT_DROP_END) {
        const dropT =
          (flow - ORBIT_PHASE_END) / (ORBIT_DROP_END - ORBIT_PHASE_END);
        const orbitEndAngle =
          phase + handle.orbitDirection[i] * Math.PI * 2;
        const sxOrb =
          r.x + Math.cos(orbitEndAngle) * handle.orbitRadii[i];
        const syOrb = r.y + handle.orbitYOffset[i];
        const szOrb =
          r.z + Math.sin(orbitEndAngle) * handle.orbitRadii[i];
        // Slight downward sag for a natural-feel drop.
        posX = sxOrb + (handle.fallX[i] - sxOrb) * dropT;
        posY =
          syOrb +
          (handle.fallY[i] - syOrb) * dropT -
          0.4 * dropT * (1 - dropT);
        posZ = szOrb + (handle.fallZ[i] - szOrb) * dropT;
        edgeAlpha = 1 - dropT * 0.85;
      } else {
        posX = handle.fallX[i];
        posY = handle.fallY[i];
        posZ = handle.fallZ[i];
        edgeAlpha = 0;
      }
    } else {
      // DIRECT or PAUSE: classic Bezier from start to end. PAUSE
      // warps the bezT mapping so the shard stalls mid-air for
      // a fraction of the cycle.
      let ex: number;
      let ey: number;
      let ez: number;
      if (fate === 1) {
        const r = recordPositions[target];
        // Tighter XZ spread + taller stack so successful landings
        // read as a visible pile right on the record icon, not a
        // halo around it.
        ex = r.x + handle.landingDx[i] * 0.55;
        ey = r.y + handle.stackSeeds[i] * 1.6;
        ez = r.z + handle.landingDz[i] * 0.55;
      } else if (unifizeOn) {
        const ev = evidencePositions[target];
        ex = ev.x + handle.landingDx[i] * 0.45;
        ey = ev.y + handle.stackSeeds[i] * 1.4;
        ez = ev.z + handle.landingDz[i] * 0.45;
      } else {
        ex = handle.fallX[i];
        ey = handle.fallY[i];
        ez = handle.fallZ[i];
      }

      const cxL = (sx + ex) * 0.5;
      const czL = (sz + ez) * 0.5;
      const cyL =
        Math.max(sy, ey) + arcH + Math.sin(phase * 1.7) * 0.15;

      const settleStart = 1 - SETTLE_FRACTION;
      const tailStart = 1 - SETTLE_TAIL_FADE;
      const approachStart = settleStart - ROT_BLEND_WINDOW;

      // Impact detection: a successful shard crossing into the
      // settle phase counts as one landing. Fired exactly once per
      // cycle (the prevFlow guard rejects re-fires within the same
      // settle window).
      const prevFlow = handle.prevFlows[i];
      if (
        fate === 1 &&
        prevFlow >= 0 &&
        prevFlow < settleStart &&
        flow >= settleStart
      ) {
        onImpact?.(target);
      }

      // bezT mapping with optional pause stall.
      let bezT: number;
      if (flow < settleStart) {
        if (behavior === BEHAVIOR_PAUSE) {
          const stallStart = handle.pauseStarts[i];
          const stallEnd = stallStart + handle.pauseDurations[i];
          if (flow < stallStart) {
            bezT = flow / settleStart;
          } else if (flow < stallEnd) {
            // Hold mid-air at the bezT we'd naturally have at flow
            // = stallStart, so the shard pauses in place.
            bezT = stallStart / settleStart;
          } else {
            const post = (flow - stallEnd) / (settleStart - stallEnd);
            const heldBezT = stallStart / settleStart;
            bezT = heldBezT + post * (1 - heldBezT);
          }
        } else {
          bezT = flow / settleStart;
        }
        if (flow < FLOW_FADE_IN) edgeAlpha = flow / FLOW_FADE_IN;
      } else {
        bezT = 1;
        if (fate === 1) {
          // Dissolve INTO the record: rapid scale-fade over the
          // first 10% of the settle window, invisible thereafter.
          // The cube growth on the caller side is the cumulative
          // record of these arrivals — no need for a hovering pile.
          const dissolveT = Math.min(1, (flow - settleStart) / 0.10);
          edgeAlpha = Math.max(0, 1 - dissolveT);
        } else if (unifizeOn) {
          // With-Unifize evidence pile: tail fade only.
          if (flow > tailStart) {
            edgeAlpha = (1 - flow) / SETTLE_TAIL_FADE;
          }
        } else {
          // Failed without Unifize: dissolves at fall point.
          const fadeT = (flow - settleStart) / SETTLE_FRACTION;
          edgeAlpha = Math.max(0, 1 - fadeT);
        }
      }

      const omt = 1 - bezT;
      posX = omt * omt * sx + 2 * omt * bezT * cxL + bezT * bezT * ex;
      posY = omt * omt * sy + 2 * omt * bezT * cyL + bezT * bezT * ey;
      posZ = omt * omt * sz + 2 * omt * bezT * czL + bezT * bezT * ez;

      // While dissolving onto a record, sink the shard down toward
      // the record's top so the absorption reads as "into the cube"
      // rather than "evaporating mid-air above it".
      if (fate === 1 && flow >= settleStart) {
        const dissolveT = Math.min(1, (flow - settleStart) / 0.10);
        const recY = recordPositions[target].y;
        posY = ey + (recY - ey) * dissolveT;
      }

      // Multi-frequency wobble. Damped to zero on landing approach
      // for direct shards, but pause-shards keep a slow bob during
      // their stall (since wobble doesn't depend on bezT).
      const wobScale = Math.max(
        0,
        1 - Math.max(0, (flow - approachStart) / ROT_BLEND_WINDOW),
      );
      const wob =
        Math.sin(t * 0.7 + phase * 1.4) * 0.45 +
        Math.sin(t * 1.6 + phase * 2.7) * 0.25;
      posX += wob * PERP_DIR_X * wobScale;
      posZ += wob * PERP_DIR_Z * wobScale;
      posY += Math.sin(t * 0.5 + phase) * 0.12 * wobScale;
    }

    // Common: fixed Y yaw, write matrix to the right per-kind mesh.
    const flatY = handle.flatYRotations[i];
    dummy.position.set(posX, posY, posZ);
    dummy.rotation.set(0, flatY, 0);
    const finalScale = seed * edgeAlpha * intro;
    dummy.scale.setScalar(Math.max(0.0001, finalScale));
    dummy.updateMatrix();

    const k = handle.shardKindIndex[i];
    handle.meshes[k].setMatrixAt(handle.shardLocalIndex[i], dummy.matrix);
    meshDirty[k] = true;

    handle.prevFlows[i] = flow;
  }

  for (let k = 0; k < handle.meshes.length; k++) {
    if (meshDirty[k]) handle.meshes[k].instanceMatrix.needsUpdate = true;
  }
}

// ── Debris (work that fell out of the coordination layer) ─
interface DebrisHandle {
  mesh: THREE.InstancedMesh;
  count: number;
}

function createDebrisLayer(count: number): DebrisHandle {
  const geo = new THREE.BoxGeometry(0.24, 0.06, 0.36);
  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  });
  const mesh = new THREE.InstancedMesh(geo, material, count);

  const dummy = new THREE.Object3D();
  const greys: THREE.Color[] = [];
  // Warm monochrome spread. Lightness only varies; no brand colour.
  for (let i = 0; i < 6; i++) {
    const l = 0.18 + i * 0.05;
    greys.push(new THREE.Color(`hsl(28, 8%, ${Math.round(l * 100)}%)`));
  }

  for (let i = 0; i < count; i++) {
    const x = (Math.random() * 2 - 1) * DEBRIS_X_HALF;
    const y = DEBRIS_Y_MIN + Math.random() * (DEBRIS_Y_MAX - DEBRIS_Y_MIN);
    const z = (Math.random() * 2 - 1) * DEBRIS_Z_HALF;
    dummy.position.set(x, y, z);
    dummy.rotation.set(
      (Math.random() * 2 - 1) * 0.4,
      Math.random() * Math.PI * 2,
      (Math.random() * 2 - 1) * 0.4,
    );
    dummy.scale.setScalar(0.6 + Math.random() * 0.8);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
    mesh.setColorAt(i, greys[i % greys.length]);
  }
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  return { mesh, count };
}

type Entry = {
  group: THREE.Group;
  delay: number;
  materials?: THREE.MeshBasicMaterial[];
  targetColors?: THREE.Color[];
  initialColor?: THREE.Color;
  labelMaterial?: THREE.MeshBasicMaterial;
  iconMaterial?: THREE.MeshBasicMaterial;
  // For SoR record cubes: index into recordCurrentGrowthRef so the
  // entry loop can multiply ongoing accumulation growth into scale.y
  // after the entrance animation completes.
  recordIndex?: number;
};

// ── Reverse trickle: a soft SoR → SoC counter-flow ────
// Honours Yan's "exchange between the two sides" comment. A small set
// of dim shards travel the opposite direction at low opacity. The
// thesis: records also shape coordination work. Not the headline
// story, but it stops the visual reading as purely one-way.
interface ReverseTrickleHandle {
  mesh: THREE.InstancedMesh;
  flowOffsets: Float32Array;
  flowSpeeds: Float32Array;
  perpOffsets: Float32Array;
  baseYs: Float32Array;
  phases: Float32Array;
  count: number;
}

function createReverseTrickle(count: number): ReverseTrickleHandle {
  const geo = new THREE.BoxGeometry(0.16, 0.05, 0.24);
  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.4,
    depthWrite: false,
  });
  const mesh = new THREE.InstancedMesh(geo, material, count);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

  const flowOffsets = new Float32Array(count);
  const flowSpeeds = new Float32Array(count);
  const perpOffsets = new Float32Array(count);
  const baseYs = new Float32Array(count);
  const phases = new Float32Array(count);

  // Dim brand-blue tones so reverse shards read as "from records".
  const palette = [
    new THREE.Color(0x4060c0),
    new THREE.Color(0x6080d0),
    new THREE.Color(0x8aa0e0),
  ];

  for (let i = 0; i < count; i++) {
    flowOffsets[i] = Math.random();
    flowSpeeds[i] = 0.018 + Math.random() * 0.03;
    // Reverse trickle is narrower so it doesn't compete with the main
    // flow; sits closer to the floor.
    perpOffsets[i] = (Math.random() * 2 - 1) * 1.4;
    baseYs[i] = 0.6 + Math.random() * 1.2;
    phases[i] = Math.random() * Math.PI * 2;
    mesh.setColorAt(i, palette[i % palette.length]);
  }
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

  return {
    mesh,
    flowOffsets,
    flowSpeeds,
    perpOffsets,
    baseYs,
    phases,
    count,
  };
}

function updateReverseTrickle(
  handle: ReverseTrickleHandle,
  t: number,
  intro: number,
) {
  const dummy = new THREE.Object3D();
  for (let i = 0; i < handle.count; i++) {
    const offset = handle.flowOffsets[i];
    const speed = handle.flowSpeeds[i];
    const perp = handle.perpOffsets[i];
    const baseY = handle.baseYs[i];
    const phase = handle.phases[i];

    const flow = ((offset + t * speed) % 1 + 1) % 1;
    // Reversed: start at SoR end, travel toward SoC end.
    const along = (1 - flow) * FLOW_LENGTH;
    const perpWobble = Math.sin(t * 0.55 + phase) * 0.25;
    const perpFinal = perp + perpWobble;

    const x =
      FLOW_START_X + along * FLOW_DIR_X + perpFinal * PERP_DIR_X;
    const z =
      FLOW_START_Z + along * FLOW_DIR_Z + perpFinal * PERP_DIR_Z;
    const y = baseY + Math.sin(t * 0.5 + phase * 1.3) * 0.18;

    const REVERSE_FADE = 0.08;
    let edgeAlpha = 1;
    if (flow < REVERSE_FADE) edgeAlpha = flow / REVERSE_FADE;
    else if (flow > 1 - REVERSE_FADE)
      edgeAlpha = (1 - flow) / REVERSE_FADE;

    dummy.position.set(x, y, z);
    dummy.rotation.set(
      0.2 * Math.sin(t * 0.4 + phase),
      t * 0.6 + phase,
      0.15 * Math.cos(t * 0.5 + phase),
    );
    dummy.scale.setScalar(Math.max(0.0001, 0.55 * edgeAlpha * intro));
    dummy.updateMatrix();
    handle.mesh.setMatrixAt(i, dummy.matrix);
  }
  handle.mesh.instanceMatrix.needsUpdate = true;
}

// ── V3: canvas-texture label helpers ───────────────────
// Drawn at high resolution and applied as MeshBasicMaterial maps so
// typography stays sharp at any iso zoom.
function createUnifizeBandLabel(text: string): THREE.CanvasTexture {
  const cv = document.createElement("canvas");
  cv.width = 1024; cv.height = 192;
  const ctx = cv.getContext("2d")!;
  ctx.clearRect(0, 0, cv.width, cv.height);
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = "700 76px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.letterSpacing = "8px" as unknown as string;
  ctx.fillText(text, cv.width / 2, cv.height / 2);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

export default function V3Page() {
  const mountRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const entriesRef = useRef<Entry[]>([]);
  const churnRef = useRef<ChurnHandle | null>(null);
  const debrisRef = useRef<{ mesh: THREE.InstancedMesh } | null>(null);
  const reverseRef = useRef<ReverseTrickleHandle | null>(null);
  const evidenceMaterialsRef = useRef<THREE.MeshBasicMaterial[]>([]);
  const filamentMaterialsRef = useRef<THREE.LineBasicMaterial[]>([]);
  const recordPositionsRef = useRef<{ x: number; y: number; z: number }[]>(
    [],
  );
  const evidencePositionsRef = useRef<{ x: number; y: number; z: number }[]>(
    [],
  );
  // Per-SoR-record growth tracking. target = where impacts are
  // accumulating; current = the eased value applied to scale.y so
  // the cube grows smoothly rather than jumping per impact.
  const recordCurrentGrowthRef = useRef<Float32Array>(
    new Float32Array([1, 1, 1, 1]),
  );
  const recordTargetGrowthRef = useRef<Float32Array>(
    new Float32Array([1, 1, 1, 1]),
  );
  const startTimeRef = useRef(performance.now());

  const [elevation] = useState(DEFAULT_ELEVATION);
  const [azimuth] = useState(INITIAL_AZIMUTH);
  const [frustum] = useState(INITIAL_FRUSTUM);
  const [showGrid] = useState(true);
  const [showDebris] = useState(true);
  const [showChurn] = useState(true);
  // Audit reveal value (0..1) — mirrored from visCurrentRef.current.audit
  // on a slow timer, so the HTML audit panel can render without forcing
  // a React render every animation frame.
  const [auditReveal, setAuditReveal] = useState(0);
  // The Unifize state is now permanently OFF (without-Unifize) since
  // the toggle UI has been removed. The mechanics for the with-Unifize
  // state remain in place and can be reactivated by setting this ref
  // to true (e.g. behind scroll or a button) if we want to bring it
  // back later.
  const unifizeOnRef = useRef(false);
  const gridMeshRef = useRef<THREE.LineSegments | null>(null);
  const gridMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const entranceFrameRef = useRef<number | null>(null);
  const userInteractedRef = useRef(false);

  // ── V3: stage state ────────────────────────────────────
  const stageRef = useRef(0);
  const stageStartTimeRef = useRef(performance.now());
  // Current and target camera state (lerped each frame).
  const cameraLookRef = useRef(STAGE_CAM[0].look.clone());
  const cameraFrustumRef = useRef(STAGE_CAM[0].frustum);
  const cameraAzimuthRef = useRef(STAGE_CAM[0].azimuth);
  const cameraLookTargetRef = useRef(STAGE_CAM[0].look.clone());
  const cameraFrustumTargetRef = useRef(STAGE_CAM[0].frustum);
  const cameraAzimuthTargetRef = useRef(STAGE_CAM[0].azimuth);
  // Visibility of new V3 elements (lerped each frame toward stage target).
  const visCurrentRef = useRef({ ...STAGE_VIS[0] });
  const visTargetRef  = useRef({ ...STAGE_VIS[0] });
  // Material handles populated in useEffect.
  const unifizeMatsRef = useRef<{ mat: THREE.MeshBasicMaterial | THREE.LineBasicMaterial; baseOpacity: number }[]>([]);
  const outcomeMatsRef = useRef<{ mat: THREE.MeshBasicMaterial | THREE.LineBasicMaterial | THREE.SpriteMaterial; baseOpacity: number }[]>([]);
  const captureLineMatsRef = useRef<THREE.LineBasicMaterial[]>([]);
  const writebackLineMatRef = useRef<THREE.LineBasicMaterial | null>(null);
  // Context arrows (SoR → Unifize) + flowing record particles.
  const contextLineMatsRef = useRef<THREE.LineBasicMaterial[]>([]);
  const contextPathsRef = useRef<THREE.Vector3[][]>([]);
  const capturePathsRef = useRef<THREE.Vector3[][]>([]);
  const captureParticlesRef = useRef<{
    mesh: THREE.InstancedMesh;
    paths: THREE.Vector3[][];
    material: THREE.MeshBasicMaterial;
    perPath: number;
  } | null>(null);
  const contextParticlesRef = useRef<{
    mesh: THREE.InstancedMesh;
    paths: THREE.Vector3[][];
    material: THREE.MeshBasicMaterial;
    perPath: number;
  } | null>(null);
  // Legacy horizontal audit cards — kept declared (unused) so the
  // animate loop's old branch compiles cleanly. The new audit trail
  // is the vertical panel below.
  void useRef<unknown>(null);
  // Audit-trail panel: now rendered as an HTML overlay (see JSX below).
  // No Three.js refs required.
  const auditPanelCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const auditPanelTextureRef = useRef<THREE.CanvasTexture | null>(null);
  void auditPanelCanvasRef; void auditPanelTextureRef;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    const scene = new THREE.Scene();

    let aspect = width / height;
    const camera = new THREE.OrthographicCamera(
      (-DEFAULT_FRUSTUM * aspect) / 2,
      (DEFAULT_FRUSTUM * aspect) / 2,
      DEFAULT_FRUSTUM / 2,
      -DEFAULT_FRUSTUM / 2,
      0.1,
      1000,
    );
    camera.position.set(20, 20, 20);
    camera.lookAt(LOOKAT_DEFAULT);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const grid = createIsoGrid(80, 80);
    grid.mesh.position.y = 0;
    grid.material.uniforms.uOpacity.value = 0;
    scene.add(grid.mesh);
    gridMeshRef.current = grid.mesh;
    gridMaterialRef.current = grid.material;

    const updateGridUniforms = () => {
      const dpr = renderer.getPixelRatio();
      grid.material.uniforms.uResolution.value.set(
        width * dpr,
        height * dpr,
      );
    };
    updateGridUniforms();

    const entries: Entry[] = [];

    // ── LEFT: Systems of Record ───────────────────────
    const sorGroup = new THREE.Group();
    sorGroup.position.set(SOR_X, 0, SOR_Z);
    scene.add(sorGroup);

    for (let i = 0; i < TIERS.length; i++) {
      const { size } = TIERS[i];
      const tier = createSlab(size, TIER_H, size, TIER_COLOR, 0.55).group;
      tier.position.set(0, TIER_BASE_Y + i * TIER_H, 0);
      tier.scale.set(1, 0.001, 1);
      sorGroup.add(tier);
      entries.push({ group: tier, delay: i * 0.12 });
    }

    const idpDelay = TIERS.length * 0.12 + 0.05;
    const layout: {
      x: number;
      z: number;
      label: string;
      kind: RecordIconKind;
    }[] = [
      { x: -1.5, z: -1.5, label: "QMS", kind: "qms" },
      { x: 1.5, z: -1.5, label: "DMS", kind: "dms" },
      { x: 1.5, z: 1.5, label: "ERP", kind: "erp" },
      { x: -1.5, z: 1.5, label: "PLM", kind: "plm" },
    ];
    const idpInitialColor = new THREE.Color(IDP_INITIAL_COLOR);
    const LABEL_Y = (H + GAP) * 2 + H + 0.01;
    for (let recordIdx = 0; recordIdx < layout.length; recordIdx++) {
      const cell = layout[recordIdx];
      const handle = createStackedBlock();
      handle.group.position.set(cell.x, IDP_BASE_Y, cell.z);
      handle.group.scale.set(1, 0.001, 1);

      const label = createLabelPlane(cell.label, W * 0.92, cell.kind);
      label.mesh.position.y = LABEL_Y;
      handle.group.add(label.mesh);

      sorGroup.add(handle.group);
      entries.push({
        group: handle.group,
        delay: idpDelay,
        materials: handle.materials,
        targetColors: handle.targetColors,
        initialColor: idpInitialColor,
        labelMaterial: label.material,
        recordIndex: recordIdx,
      });
    }
    // Reset growth state on (re)mount so a hot-reload doesn't leave
    // cubes stuck at a previous session's accumulated scale.
    recordCurrentGrowthRef.current.fill(1);
    recordTargetGrowthRef.current.fill(1);

    // ── RIGHT: Systems of Coordination ────────────────
    const socGroup = new THREE.Group();
    socGroup.position.set(SOC_X, 0, SOC_Z);
    scene.add(socGroup);

    const soc = createSocStack();
    soc.group.scale.set(1, 0.001, 1);
    socGroup.add(soc.group);
    const socDelay = idpDelay + 0.12;
    entries.push({
      group: soc.group,
      delay: socDelay,
      materials: [
        ...soc.tierMaterials,
        ...soc.cellMaterials,
        ...soc.centerMaterials,
      ],
      targetColors: [
        ...soc.tierTargets,
        ...soc.cellTargets,
        ...soc.centerTargets,
      ],
      initialColor: idpInitialColor,
      labelMaterial: soc.centerLabelMaterial,
    });
    // Icons fade in with the SoC group.
    for (const m of soc.iconMaterials) {
      entries.push({
        group: new THREE.Group(), // dummy; we only need the material fade
        delay: socDelay + 0.1,
        iconMaterial: m,
      });
    }

    // ── World-space record / evidence positions ───────
    // Index order matches the SoR layout above: QMS, DMS, ERP, PLM.
    const recordTopY = IDP_BASE_Y + (H + GAP) * 2 + H;
    const recordPositions = layout.map((cell) => ({
      x: SOR_X + cell.x,
      y: recordTopY + 0.05,
      z: SOR_Z + cell.z,
    }));
    const evidencePositions = layout.map((cell) => ({
      x: SOR_X + cell.x,
      y: EVIDENCE_Y_TOP - EVIDENCE_H / 2,
      z: SOR_Z + cell.z,
    }));

    // ── BELOW (with-Unifize): four evidence slabs ─────
    // Each slab sits beneath its record. Hidden by default and
    // animated up with the toggle.
    const evidenceMaterials: THREE.MeshBasicMaterial[] = [];
    const evidenceGroup = new THREE.Group();
    for (const p of evidencePositions) {
      const slab = createSlab(
        EVIDENCE_W,
        EVIDENCE_H,
        EVIDENCE_D,
        0x1c2030,
        0.55,
        0x0a0a0a,
      );
      slab.group.position.set(p.x, p.y, p.z);
      evidenceGroup.add(slab.group);
      evidenceMaterials.push(...slab.materials);
    }
    // Start hidden; opacity is driven by unifizeOn.
    for (const m of evidenceMaterials) {
      m.transparent = true;
      m.opacity = 0;
    }
    scene.add(evidenceGroup);
    evidenceMaterialsRef.current = evidenceMaterials;

    // ── Filaments: thin lines from evidence slab top to record bottom ──
    const filamentMaterials: THREE.LineBasicMaterial[] = [];
    const filamentGroup = new THREE.Group();
    for (let i = 0; i < layout.length; i++) {
      const evp = evidencePositions[i];
      const rp = recordPositions[i];
      const evTopY = evp.y + EVIDENCE_H / 2;
      const recBottomY = IDP_BASE_Y;
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(evp.x, evTopY, evp.z),
        new THREE.Vector3(rp.x, recBottomY, rp.z),
      ]);
      const mat = new THREE.LineBasicMaterial({
        color: 0x9ab2ff,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const line = new THREE.Line(geo, mat);
      filamentGroup.add(line);
      filamentMaterials.push(mat);
    }
    scene.add(filamentGroup);
    filamentMaterialsRef.current = filamentMaterials;

    // ── MIDDLE: churn ─────────────────────────────────
    const churn = createChurnLayer(
      CHURN_COUNT,
      recordPositions,
      evidencePositions,
    );
    for (const m of churn.meshes) scene.add(m);
    churnRef.current = churn;
    recordPositionsRef.current = recordPositions;
    evidencePositionsRef.current = evidencePositions;

    // ── BELOW: chaotic debris (without-Unifize visual) ─
    const debris = createDebrisLayer(DEBRIS_COUNT);
    scene.add(debris.mesh);
    debrisRef.current = debris;

    // ── Reverse trickle (SoR → SoC, low intensity) ────
    const reverse = createReverseTrickle(60);
    scene.add(reverse.mesh);
    reverseRef.current = reverse;

    // ── V3: UNIFIZE PLATFORM (LEFT of SoC) ─────────────
    // Faceted multi-brick stack inspired by the Anthropic Customer
    // Boundary cube. Each layer is a 3x3 grid of subcubes giving the
    // platform a sense of internal structure, not a flat slab. Three
    // layers customer-facing (Outcomes + AI / Product Suite / Workflow
    // Components). Lives at world (-19, 0, 11) — ALONGSIDE the existing
    // SoC + SoR, not between them.
    const unifizeMatsCollect: { mat: THREE.MeshBasicMaterial | THREE.LineBasicMaterial; baseOpacity: number }[] = [];
    const unifizeGroup = new THREE.Group();
    unifizeGroup.position.set(UNIFIZE_X, 0, UNIFIZE_Z);
    scene.add(unifizeGroup);

    const layerW = UNIFIZE_GRID_X * UNIFIZE_BRICK_W + (UNIFIZE_GRID_X - 1) * UNIFIZE_BRICK_GAP;
    const layerD = UNIFIZE_GRID_Z * UNIFIZE_BRICK_D + (UNIFIZE_GRID_Z - 1) * UNIFIZE_BRICK_GAP;
    const brickStrideX = UNIFIZE_BRICK_W + UNIFIZE_BRICK_GAP;
    const brickStrideZ = UNIFIZE_BRICK_D + UNIFIZE_BRICK_GAP;

    for (let layerIdx = 0; layerIdx < UNIFIZE_BAND_DEFS.length; layerIdx++) {
      const def = UNIFIZE_BAND_DEFS[layerIdx];
      // Layer 0 is the BOTTOM (Workflow Components); top of array (index 0)
      // is the brightest band — we render bottom-up so visual stack matches.
      const visualIdx = UNIFIZE_BAND_DEFS.length - 1 - layerIdx;
      const yBase = layerIdx * (UNIFIZE_BRICK_H + UNIFIZE_LAYER_GAP);
      const layerDef = UNIFIZE_BAND_DEFS[visualIdx];

      // Build a 3x3 grid of subcubes for this layer.
      for (let gx = 0; gx < UNIFIZE_GRID_X; gx++) {
        for (let gz = 0; gz < UNIFIZE_GRID_Z; gz++) {
          const x = -layerW / 2 + gx * brickStrideX + UNIFIZE_BRICK_W / 2;
          const z = -layerD / 2 + gz * brickStrideZ + UNIFIZE_BRICK_D / 2;
          // Slight per-brick height variation gives the faceted look from
          // the Anthropic reference. Centre brick is tallest on the top
          // layer (the "antenna" of the brand).
          const isTopLayer = visualIdx === 0;
          const isCentre = gx === 1 && gz === 1;
          const heightMul = isTopLayer && isCentre ? 1.18 : 1.0;
          const brickH = UNIFIZE_BRICK_H * heightMul;

          const brick = createSlab(
            UNIFIZE_BRICK_W,
            brickH,
            UNIFIZE_BRICK_D,
            layerDef.top, // base colour
            0.42,
            0x000000,
          );
          brick.group.position.set(x, yBase, z);

          // Override face materials with the proper iso-shaded palette
          // (top, front, right, etc.). Brick materials array order from
          // BoxGeometry: +X, -X, +Y, -Y, +Z, -Z = right, left, top, bottom, front, back.
          brick.materials[0].color.setHex(layerDef.right);
          brick.materials[1].color.setHex(layerDef.right);
          brick.materials[2].color.setHex(layerDef.top);
          brick.materials[3].color.setHex(layerDef.top);
          brick.materials[4].color.setHex(layerDef.front);
          brick.materials[5].color.setHex(layerDef.front);

          unifizeGroup.add(brick.group);
          for (const m of brick.materials) {
            m.transparent = true;
            m.opacity = 0;
            unifizeMatsCollect.push({ mat: m, baseOpacity: 1 });
          }
          unifizeMatsCollect.push({ mat: brick.lineMaterial, baseOpacity: 0.42 });
        }
      }

      // Side-face label for this layer — a tall narrow plane on the
      // FRONT face of the stack (facing +Z direction in iso, which
      // projects to screen-front-right). Reads cleanly in iso.
      const labelTex = createUnifizeBandLabel(def.label);
      const labelMat = new THREE.MeshBasicMaterial({
        map: labelTex,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      // Label width ≈ 80% of layer width; height ≈ 60% of brick height.
      const labelGeo = new THREE.PlaneGeometry(layerW * 0.78, UNIFIZE_BRICK_H * 0.55);
      const labelMesh = new THREE.Mesh(labelGeo, labelMat);
      // Position on front face of layer (+Z side), nudged slightly out
      // to avoid z-fighting with the brick faces.
      labelMesh.position.set(0, yBase + UNIFIZE_BRICK_H * 0.5, layerD / 2 + 0.01);
      unifizeGroup.add(labelMesh);
      unifizeMatsCollect.push({ mat: labelMat, baseOpacity: 1 });
    }
    unifizeMatsRef.current = unifizeMatsCollect;
    // Top-centre of the Unifize platform in world coords (for arrow targets).
    const unifizeTop = new THREE.Vector3(
      UNIFIZE_X,
      UNIFIZE_BAND_DEFS.length * (UNIFIZE_BRICK_H + UNIFIZE_LAYER_GAP),
      UNIFIZE_Z,
    );

    // ── V3: OUTCOME SURFACE removed from 3D scene ──────
    // The audit-trail panel now lives as a flat HTML overlay (rendered
    // in the React JSX) so it gets perfect product-UI typography and
    // doesn't fight with the iso projection. The 3D scene retains the
    // Unifize platform as its protagonist; the HTML panel reveals on
    // top during stage 2.
    outcomeMatsRef.current = [];
    void OUTCOME_X; void OUTCOME_Z;
    void OUTCOME_PANEL_W; void OUTCOME_PANEL_H;
    void OUTCOME_PEDESTAL_W; void OUTCOME_PEDESTAL_H; void OUTCOME_PEDESTAL_D;
    void OUTCOME_PANEL_FACING_DEG;

    // (Audit panel is now an HTML overlay below — no canvas texture.)

    // ── V3: CAPTURE ARROWS (SoC → Unifize) ─────────────
    // Lavender curves arching from the top of SoC into the top of
    // the Unifize platform. Three arrows, slight stagger.
    const captureLineMatsCollect: THREE.LineBasicMaterial[] = [];
    const socTopWorld = new THREE.Vector3(SOC_X, 4, SOC_Z);
    const captureSources = [
      socTopWorld.clone().add(new THREE.Vector3( 1.5, 0, -1.0)),
      socTopWorld.clone().add(new THREE.Vector3(-1.0, 0,  1.0)),
      socTopWorld.clone().add(new THREE.Vector3( 0.5, 0,  0.0)),
    ];
    const captureTargets = [
      unifizeTop.clone().add(new THREE.Vector3( 0.5, 0, -1.0)),
      unifizeTop.clone().add(new THREE.Vector3(-0.5, 0,  0.5)),
      unifizeTop.clone().add(new THREE.Vector3( 0.0, 0,  1.0)),
    ];
    for (let i = 0; i < captureSources.length; i++) {
      const from = captureSources[i];
      const to = captureTargets[i];
      const arch = Math.max(from.y, to.y) + 2.2 + i * 0.3;
      const mid = new THREE.Vector3(
        (from.x + to.x) / 2,
        arch,
        (from.z + to.z) / 2,
      );
      const pts: THREE.Vector3[] = [];
      const SEG = 28;
      for (let s = 0; s <= SEG; s++) {
        const tt = s / SEG;
        const a = 1 - tt;
        const x = a * a * from.x + 2 * a * tt * mid.x + tt * tt * to.x;
        const y = a * a * from.y + 2 * a * tt * mid.y + tt * tt * to.y;
        const z = a * a * from.z + 2 * a * tt * mid.z + tt * tt * to.z;
        pts.push(new THREE.Vector3(x, y, z));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: 0xa89bf0,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const line = new THREE.Line(geo, mat);
      scene.add(line);
      captureLineMatsCollect.push(mat);
    }
    captureLineMatsRef.current = captureLineMatsCollect;

    // ── V3: WRITE-BACK ARROW (Unifize → SoR, long arc) ─
    // A single cream arc travelling all the way across the scene
    // from the Unifize top down to a representative SoR cube.
    {
      const from = unifizeTop.clone().add(new THREE.Vector3(1.0, 0.2, -1.0));
      const to = new THREE.Vector3(SOR_X, 4, SOR_Z);
      const archY = Math.max(from.y, to.y) + 5.5;
      const midA = new THREE.Vector3(
        (from.x * 0.7 + to.x * 0.3),
        archY,
        (from.z * 0.7 + to.z * 0.3),
      );
      const midB = new THREE.Vector3(
        (from.x * 0.3 + to.x * 0.7),
        archY * 0.85,
        (from.z * 0.3 + to.z * 0.7),
      );
      const pts: THREE.Vector3[] = [];
      const SEG = 60;
      for (let s = 0; s <= SEG; s++) {
        const tt = s / SEG;
        // Cubic bezier
        const a = 1 - tt;
        const x = a*a*a*from.x + 3*a*a*tt*midA.x + 3*a*tt*tt*midB.x + tt*tt*tt*to.x;
        const y = a*a*a*from.y + 3*a*a*tt*midA.y + 3*a*tt*tt*midB.y + tt*tt*tt*to.y;
        const z = a*a*a*from.z + 3*a*a*tt*midA.z + 3*a*tt*tt*midB.z + tt*tt*tt*to.z;
        pts.push(new THREE.Vector3(x, y, z));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: 0xfff4d6,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const line = new THREE.Line(geo, mat);
      scene.add(line);
      writebackLineMatRef.current = mat;
    }

    // ── V3: CONTEXT ARROWS (SoR → Unifize) ─────────────
    // Blue arcs from each SoR record over to the Unifize Outcomes band.
    // Per Concept Map §5: SoR → Unifize is the "context" arrow type.
    const contextLineMatsCollect: THREE.LineBasicMaterial[] = [];
    const contextPaths: THREE.Vector3[][] = []; // sampled points for particle motion
    const sorTopsForContext = layout.map((cell) => new THREE.Vector3(
      SOR_X + cell.x, 4, SOR_Z + cell.z,
    ));
    for (let i = 0; i < sorTopsForContext.length; i++) {
      const from = sorTopsForContext[i];
      const to = unifizeTop.clone().add(new THREE.Vector3(-0.5 + i * 0.4, 0.4, -1.0 + i * 0.3));
      const arch = Math.max(from.y, to.y) + 4.5;
      const midA = new THREE.Vector3((from.x * 0.7 + to.x * 0.3), arch, (from.z * 0.7 + to.z * 0.3));
      const midB = new THREE.Vector3((from.x * 0.3 + to.x * 0.7), arch * 0.9, (from.z * 0.3 + to.z * 0.7));
      const pts: THREE.Vector3[] = [];
      const SEG = 60;
      for (let s = 0; s <= SEG; s++) {
        const tt = s / SEG;
        const a = 1 - tt;
        const x = a*a*a*from.x + 3*a*a*tt*midA.x + 3*a*tt*tt*midB.x + tt*tt*tt*to.x;
        const y = a*a*a*from.y + 3*a*a*tt*midA.y + 3*a*tt*tt*midB.y + tt*tt*tt*to.y;
        const z = a*a*a*from.z + 3*a*a*tt*midA.z + 3*a*tt*tt*midB.z + tt*tt*tt*to.z;
        pts.push(new THREE.Vector3(x, y, z));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: 0x7090ff, // context blue per Concept Map
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const line = new THREE.Line(geo, mat);
      scene.add(line);
      contextLineMatsCollect.push(mat);
      contextPaths.push(pts);
    }
    contextLineMatsRef.current = contextLineMatsCollect;
    contextPathsRef.current = contextPaths;

    // Also sample the capture arrow paths so particles can travel
    // along the same curves. Re-derive from the existing source/target
    // pairs above — easier than refactoring.
    const capturePaths: THREE.Vector3[][] = [];
    for (let i = 0; i < captureSources.length; i++) {
      const from = captureSources[i];
      const to = captureTargets[i];
      const arch = Math.max(from.y, to.y) + 2.2 + i * 0.3;
      const mid = new THREE.Vector3((from.x + to.x) / 2, arch, (from.z + to.z) / 2);
      const pts: THREE.Vector3[] = [];
      const SEG = 28;
      for (let s = 0; s <= SEG; s++) {
        const tt = s / SEG;
        const a = 1 - tt;
        const x = a*a*from.x + 2*a*tt*mid.x + tt*tt*to.x;
        const y = a*a*from.y + 2*a*tt*mid.y + tt*tt*to.y;
        const z = a*a*from.z + 2*a*tt*mid.z + tt*tt*to.z;
        pts.push(new THREE.Vector3(x, y, z));
      }
      capturePaths.push(pts);
    }
    capturePathsRef.current = capturePaths;

    // ── V3: FLOWING RECORD PARTICLES ───────────────────
    // Small glowing dots that travel along capture (SoC→Unifize) and
    // context (SoR→Unifize) curves on a loop, communicating that
    // records are constantly flowing INTO the Unifize platform.
    const PARTICLES_PER_PATH = 5;
    const totalParticles =
      (captureSources.length + sorTopsForContext.length) * PARTICLES_PER_PATH;
    const partGeo = new THREE.SphereGeometry(0.10, 8, 6);
    const partMatCapture = new THREE.MeshBasicMaterial({
      color: 0xa89bf0,
      transparent: true,
      opacity: 0.85,
    });
    const partMatContext = new THREE.MeshBasicMaterial({
      color: 0x7090ff,
      transparent: true,
      opacity: 0.85,
    });
    const captureInstanced = new THREE.InstancedMesh(
      partGeo, partMatCapture, captureSources.length * PARTICLES_PER_PATH,
    );
    const contextInstanced = new THREE.InstancedMesh(
      partGeo, partMatContext, sorTopsForContext.length * PARTICLES_PER_PATH,
    );
    captureInstanced.frustumCulled = false;
    contextInstanced.frustumCulled = false;
    scene.add(captureInstanced);
    scene.add(contextInstanced);
    captureParticlesRef.current = {
      mesh: captureInstanced,
      paths: capturePaths,
      material: partMatCapture,
      perPath: PARTICLES_PER_PATH,
    };
    contextParticlesRef.current = {
      mesh: contextInstanced,
      paths: contextPaths,
      material: partMatContext,
      perPath: PARTICLES_PER_PATH,
    };
    void totalParticles;

    entriesRef.current = entries;
    startTimeRef.current = performance.now();
    stageStartTimeRef.current = performance.now();

    const RISE_DURATION = 0.65;

    let frameId = 0;
    const animate = () => {
      const t = (performance.now() - startTimeRef.current) / 1000;

      if (gridMaterialRef.current) {
        const gridT = Math.min(t / GRID_FADE_DURATION, 1);
        const gridEased = 1 - Math.pow(1 - gridT, 3);
        gridMaterialRef.current.uniforms.uOpacity.value =
          GRID_TARGET_OPACITY * gridEased;
      }

      // Lerp record growth toward target before applying it to the
      // entry scale so the cube smoothly inflates between impacts.
      const targetGrowths = recordTargetGrowthRef.current;
      const currentGrowths = recordCurrentGrowthRef.current;
      for (let i = 0; i < currentGrowths.length; i++) {
        currentGrowths[i] +=
          (targetGrowths[i] - currentGrowths[i]) * RECORD_GROWTH_LERP;
      }

      for (const entry of entriesRef.current) {
        const local = Math.max(
          0,
          Math.min((t - entry.delay) / RISE_DURATION, 1),
        );
        const eased = easeOutBack(local);
        if (entry.iconMaterial) {
          // Icon-only fade entry (group is a dummy).
          entry.iconMaterial.opacity = local;
          continue;
        }
        // SoR record cubes have a recordIndex — multiply ongoing
        // accumulation growth into scale.y after the entrance ease
        // so each absorbed shard nudges the cube taller.
        const growthMul =
          entry.recordIndex !== undefined
            ? currentGrowths[entry.recordIndex]
            : 1;
        entry.group.scale.y = Math.max(0.001, eased) * growthMul;

        if (entry.materials && entry.targetColors && entry.initialColor) {
          const colorProgress = Math.min(local / COLOR_FADE_FRACTION, 1);
          for (let i = 0; i < entry.materials.length; i++) {
            entry.materials[i].color.lerpColors(
              entry.initialColor,
              entry.targetColors[i],
              colorProgress,
            );
          }
          if (entry.labelMaterial) {
            entry.labelMaterial.opacity = colorProgress;
          }
        }
      }

      // Churn drifts after a short hold so the static iso reads first.
      const churnIntro = Math.min(Math.max((t - 1.0) / 0.9, 0), 1);
      const unifizeOnNow = unifizeOnRef.current;
      if (churnRef.current) {
        updateChurn(
          churnRef.current,
          t,
          churnIntro,
          unifizeOnNow,
          recordPositionsRef.current,
          evidencePositionsRef.current,
          // Each successful absorption notches the target record's
          // scale.y up by RECORD_GROWTH_PER_IMPACT, capped at the
          // module's MAX_RECORD_GROWTH.
          (target) => {
            const cur = targetGrowths[target];
            targetGrowths[target] = Math.min(
              MAX_RECORD_GROWTH,
              cur + RECORD_GROWTH_PER_IMPACT,
            );
          },
        );
      }
      if (reverseRef.current) {
        // Reverse trickle is subtler and intentionally always on,
        // showing the records continue to influence coordination work
        // regardless of Unifize state.
        updateReverseTrickle(reverseRef.current, t, churnIntro);
      }

      // Smooth crossfade for evidence stacks and filaments. We blend
      // the visible state toward unifizeOn at a fixed rate per frame.
      const evidenceTarget = unifizeOnNow ? 0.85 : 0;
      const filamentTarget = unifizeOnNow ? 0.55 : 0;
      const debrisTarget = unifizeOnNow ? 0.18 : 0.55;

      const fadeStep = 0.04;
      for (const m of evidenceMaterialsRef.current) {
        m.opacity += (evidenceTarget - m.opacity) * fadeStep;
      }
      for (const m of filamentMaterialsRef.current) {
        // Pulse the filaments slightly so they read as "live links"
        // rather than static engineering schematics.
        const pulse =
          0.85 + 0.15 * Math.sin(t * 1.6 + (filamentMaterialsRef.current.indexOf(m) || 0));
        m.opacity +=
          (filamentTarget * pulse - m.opacity) * fadeStep;
      }
      // Dim the static debris pile when Unifize is on (because the
      // peeled shards are now organised, not chaotic).
      if (debrisRef.current) {
        const debrisMat = debrisRef.current.mesh
          .material as THREE.MeshBasicMaterial;
        debrisMat.opacity += (debrisTarget - debrisMat.opacity) * fadeStep;
      }

      // ── V3: stage progression + camera + visibility lerps ─
      {
        const stageT = (performance.now() - stageStartTimeRef.current) / 1000;
        const stageDur = STAGE_DURATIONS_S[stageRef.current];
        if (stageT >= stageDur) {
          // Advance stage
          let next = stageRef.current + 1;
          if (next >= STAGE_CAM.length) {
            next = STAGE_LOOPING ? 0 : stageRef.current;
          }
          if (next !== stageRef.current) {
            stageRef.current = next;
            stageStartTimeRef.current = performance.now();
            cameraLookTargetRef.current.copy(STAGE_CAM[next].look);
            cameraFrustumTargetRef.current = STAGE_CAM[next].frustum;
            cameraAzimuthTargetRef.current = STAGE_CAM[next].azimuth;
            visTargetRef.current = { ...STAGE_VIS[next] };
          }
        }

        // Lerp camera look + frustum + azimuth toward target.
        const lookCur = cameraLookRef.current;
        const lookTgt = cameraLookTargetRef.current;
        lookCur.x += (lookTgt.x - lookCur.x) * STAGE_LERP_RATE;
        lookCur.y += (lookTgt.y - lookCur.y) * STAGE_LERP_RATE;
        lookCur.z += (lookTgt.z - lookCur.z) * STAGE_LERP_RATE;
        cameraFrustumRef.current +=
          (cameraFrustumTargetRef.current - cameraFrustumRef.current) * STAGE_LERP_RATE;
        cameraAzimuthRef.current +=
          (cameraAzimuthTargetRef.current - cameraAzimuthRef.current) * STAGE_LERP_RATE;

        // Apply to camera. Elevation stays fixed at iso (35.264°);
        // azimuth and look-target lerp per stage so the camera both
        // dollies and rotates between beats.
        const e = (DEFAULT_ELEVATION * Math.PI) / 180;
        const a = (cameraAzimuthRef.current * Math.PI) / 180;
        camera.position.set(
          lookCur.x + CAM_DIST * Math.cos(e) * Math.sin(a),
          lookCur.y + CAM_DIST * Math.sin(e),
          lookCur.z + CAM_DIST * Math.cos(e) * Math.cos(a),
        );
        camera.lookAt(lookCur);
        const aspect2 = window.innerWidth / Math.max(1, window.innerHeight);
        const f = cameraFrustumRef.current;
        camera.left = (-f * aspect2) / 2;
        camera.right = (f * aspect2) / 2;
        camera.top = f / 2;
        camera.bottom = -f / 2;
        camera.updateProjectionMatrix();

        // Lerp visibility.
        const vCur = visCurrentRef.current as Record<string, number>;
        const vTgt = visTargetRef.current as Record<string, number>;
        for (const k of Object.keys(vTgt)) {
          vCur[k] = (vCur[k] ?? 0) + ((vTgt[k] ?? 0) - (vCur[k] ?? 0)) * STAGE_LERP_RATE;
        }

        // Apply Unifize platform opacity.
        for (const e of unifizeMatsRef.current) {
          (e.mat as THREE.Material & { opacity: number }).opacity = e.baseOpacity * vCur.unifize;
        }
        // Apply outcome surface opacity.
        for (const e of outcomeMatsRef.current) {
          (e.mat as THREE.Material & { opacity: number }).opacity = e.baseOpacity * vCur.outcome;
        }
        // Capture arrows: pulse so they read as live flow.
        const cap = vCur.capture;
        const pulse = 0.7 + 0.3 * Math.sin(t * 2.2);
        for (const m of captureLineMatsRef.current) {
          m.opacity = cap * pulse * 0.85;
        }
        // Context arrows (SoR → Unifize) — ride the same visibility
        // gate as capture; they appear when Unifize is up and start
        // ingesting context from the systems of record.
        for (const m of contextLineMatsRef.current) {
          m.opacity = cap * pulse * 0.55;
        }
        // Write-back arrow.
        if (writebackLineMatRef.current) {
          writebackLineMatRef.current.opacity = vCur.writeback * (0.7 + 0.3 * Math.sin(t * 1.6 + 1));
        }
        // Flowing record particles — travel along the capture (SoC→
        // Unifize, lavender) and context (SoR→Unifize, blue) curves on
        // a continuous loop. Each particle has its own phase so they
        // appear staggered along the arc.
        const partDummy = new THREE.Object3D();
        type ParticleHandle = NonNullable<typeof captureParticlesRef.current>;
        const updateParticleStream = (
          handle: ParticleHandle | null,
          visibility: number,
          speed: number,
        ) => {
          if (!handle) return;
          const { mesh, paths, perPath, material } = handle;
          material.opacity = 0.85 * visibility;
          let idx = 0;
          for (let p = 0; p < paths.length; p++) {
            const path = paths[p];
            const last = path.length - 1;
            for (let i = 0; i < perPath; i++) {
              const phase = (i / perPath + (t * speed + p * 0.13)) % 1;
              const pos = path[Math.floor(phase * last)];
              partDummy.position.set(pos.x, pos.y, pos.z);
              const scale = visibility > 0.05 ? (0.6 + 0.4 * Math.sin(phase * Math.PI)) : 0.001;
              partDummy.scale.setScalar(scale);
              partDummy.updateMatrix();
              mesh.setMatrixAt(idx++, partDummy.matrix);
            }
          }
          mesh.instanceMatrix.needsUpdate = true;
        };
        updateParticleStream(captureParticlesRef.current, cap, 0.35);
        updateParticleStream(contextParticlesRef.current, cap, 0.28);

        // Audit-trail panel: now rendered as an HTML overlay (see JSX
        // below). The animate loop simply leaves visCurrentRef.audit
        // updated; a separate setInterval polls it into React state.
        void vCur.audit;
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!mountRef.current) return;
      width = mountRef.current.clientWidth;
      height = mountRef.current.clientHeight;
      aspect = width / height;
      const f =
        (cameraRef.current && cameraRef.current.top * 2) || DEFAULT_FRUSTUM;
      camera.left = (-f * aspect) / 2;
      camera.right = (f * aspect) / 2;
      camera.top = f / 2;
      camera.bottom = -f / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      updateGridUniforms();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      cameraRef.current = null;
      gridMeshRef.current = null;
      gridMaterialRef.current = null;
      entriesRef.current = [];
      churnRef.current = null;
      debrisRef.current = null;
      reverseRef.current = null;
      evidenceMaterialsRef.current = [];
      filamentMaterialsRef.current = [];
      recordPositionsRef.current = [];
      evidencePositionsRef.current = [];
    };
  }, []);

  // V3: camera is now driven entirely by the stage state machine in
  // the animate loop. The elevation/azimuth/frustum useEffects from
  // v1 are intentionally disabled so they don't fight the stage lerps.
  // The state setters are kept around for the (now-removed) controls
  // panel but their effects are no-ops. Touching `elevation`,
  // `azimuth`, `frustum` here purely to satisfy the linter.
  useEffect(() => { void elevation; void azimuth; }, [elevation, azimuth]);
  useEffect(() => { void frustum; }, [frustum]);

  // Poll the audit reveal value from the animate-loop ref into React
  // state so the HTML audit panel can re-render its rows without
  // forcing a React render every frame.
  useEffect(() => {
    const id = setInterval(() => {
      const v = visCurrentRef.current.audit ?? 0;
      // Quantise to 50 steps; avoids unnecessary renders when the value
      // is changing imperceptibly.
      const q = Math.round(v * 50) / 50;
      setAuditReveal((prev) => (Math.abs(prev - q) > 0.01 ? q : prev));
    }, 50);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (gridMeshRef.current) gridMeshRef.current.visible = showGrid;
  }, [showGrid]);

  useEffect(() => {
    if (debrisRef.current) debrisRef.current.mesh.visible = showDebris;
  }, [showDebris]);

  useEffect(() => {
    if (!churnRef.current) return;
    for (const m of churnRef.current.meshes) m.visible = showChurn;
  }, [showChurn]);

  // V3: entrance animation removed — the stage state machine drives
  // the camera now. The references below are intentionally retained
  // (without bodies) so any incidental imports/types remain valid.
  void INITIAL_AZIMUTH;
  void INITIAL_FRUSTUM;
  void ENTRANCE_DURATION;
  void DEFAULT_AZIMUTH;
  void entranceFrameRef;
  void userInteractedRef;
  void LOOKAT_DEFAULT;

  return (
    <div
      className="relative w-full overflow-hidden bg-[#0a0a0b] text-white"
      style={{ height: "100vh" }}
    >
      {/* 3D iso scene fills the whole hero band */}
      <div ref={mountRef} className="absolute inset-0 h-full w-full" />

      {/* Header — constrained to the same max width as the hero content */}
      <header className="relative z-10 pt-7">
        <div className="mx-auto max-w-[1320px] px-8 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <a href="/" className="flex items-center shrink-0">
              <img src="/Link - home.svg" alt="Unifize" className="h-6" />
            </a>
            <nav className="hidden md:flex items-center gap-7 text-[13.5px] text-white/60">
              <a href="#industries">Industries</a>
              <a href="#platform">Platform</a>
              <a href="#pricing">Pricing</a>
              <a href="#resources">Resources</a>
            </nav>
          </div>
          <div className="flex items-center gap-5">
            <a
              href="#login"
              className="text-[13.5px] text-white/70 hover:text-white"
            >
              Log in
            </a>
            <a
              href="#demo"
              className="rounded-full bg-white px-4 py-2 text-[13px] font-medium text-black hover:opacity-90"
            >
              Book a demo
            </a>
          </div>
        </div>
      </header>

      {/* Constant headline + CTA — sits at top-left of the hero band.
          The 3D scene fills the band behind / around it. */}
      <section className="relative z-10 mx-auto mt-10 max-w-[1320px] px-8">
        <h1 className="text-[clamp(36px,5.4vw,68px)] font-medium leading-[1.02] tracking-[-0.03em] max-w-[20ch]">
          Records live in systems.
          <br />
          Work lives between them.
        </h1>
        <div className="mt-6">
          <a
            href="#demo"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13.5px] font-medium text-black hover:opacity-90"
          >
            Book a demo
            <span aria-hidden>→</span>
          </a>
        </div>
      </section>

      {/* Stage-2 audit-trail panel — flat HTML overlay, product-UI quality.
          Reveals when Stage 2 starts and rows fade in sequentially as
          the audit reveal value climbs from 0 to 1. */}
      <AuditTrailPanel reveal={auditReveal} />
    </div>
  );
}

// ── Audit trail HTML panel ─────────────────────────────
// A flat product-UI panel rendered over the 3D canvas during stage 2.
// Mimics a Unifize app window showing closed/in-review threads with
// status pills, owners, evidence counts, and timestamps. Each row
// reveals on a per-row threshold computed from `reveal` (0..1).
const AUDIT_PANEL_ROWS = [
  { id: "#4231", title: "Deviation · Lot 8821",   owner: "S. Chen",  ts: "09:14",  status: "closed" as const, evidence: "5/5" },
  { id: "#4232", title: "CAPA · Recurring NCR",   owner: "M. Patel", ts: "10:42",  status: "closed" as const, evidence: "4/4" },
  { id: "#4233", title: "Change Order · CR-118",  owner: "J. Park",  ts: "11:30",  status: "review" as const, evidence: "3/5" },
  { id: "#4234", title: "Supplier SCAR · V-9",    owner: "S. Chen",  ts: "13:02",  status: "closed" as const, evidence: "6/6" },
  { id: "#4235", title: "Audit Finding · #A21",   owner: "L. Vance", ts: "14:48",  status: "review" as const, evidence: "2/4" },
];
const ROW_STAGGER = 0.12;

function AuditTrailPanel({ reveal }: { reveal: number }) {
  // Panel itself fades in once Stage 2 starts revealing audit (>0).
  const panelOpacity = Math.min(1, Math.max(0, reveal * 1.4));
  if (panelOpacity <= 0.01) return null;

  const closedCount = AUDIT_PANEL_ROWS
    .slice(0, Math.floor(reveal * AUDIT_PANEL_ROWS.length))
    .filter(r => r.status === "closed").length;
  const totalRevealed = Math.floor(reveal * AUDIT_PANEL_ROWS.length);

  return (
    <div
      className="pointer-events-none absolute z-20"
      style={{
        // Left edge aligns with the hero headline (which sits in a
        // mx-auto max-w-[1320px] px-8 container — text left = 50%
        // minus 660px container offset, plus 32px padding).
        left: "max(32px, calc(50% - 628px))",
        bottom: "5vh",
        // Narrowed from 720/50vw so the 3D scene to the right stays
        // unobstructed when stage 2 pulls back to show SoR + Unifize + SoC.
        width: "min(560px, 38vw)",
        opacity: panelOpacity,
        transform: `translateY(${(1 - panelOpacity) * 16}px)`,
        transition: "opacity 0.4s ease, transform 0.4s ease",
      }}
    >
      <div
        className="rounded-[12px] overflow-hidden border border-white/10 shadow-2xl"
        style={{
          background: "#0f1118",
          boxShadow: "0 30px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        {/* Window chrome */}
        <div
          className="flex items-center px-4 py-3 border-b border-white/[0.06]"
          style={{ background: "#15171f" }}
        >
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
            <span className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
            <span className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
          </div>
          <div className="flex-1 text-center text-[12px] font-medium text-white/55 -ml-12">
            unifize · audit trail · today
          </div>
        </div>

        {/* Header row — compact: eyebrow + count + chip on a single line */}
        <div className="px-6 py-3 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <span
              className="text-[11px] font-mono font-semibold tracking-[0.18em]"
              style={{ color: "#3D7AFF" }}
            >
              AUDIT TRAIL
            </span>
            <span className="text-[13px] text-white/55">
              {totalRevealed} closed today · {closedCount} approved · {totalRevealed - closedCount} in review
            </span>
          </div>
          <div
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[10px] font-semibold tracking-[0.12em]"
            style={{
              background: "rgba(31,155,90,0.16)",
              border: "1px solid rgba(31,155,90,0.5)",
              color: "#34d399",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
            LIVE · GOVERNED
          </div>
        </div>

        {/* Table header */}
        <div
          className="grid items-center px-6 py-2 text-[10px] font-mono font-medium tracking-[0.16em] text-white/40 border-b border-white/[0.04]"
          style={{ gridTemplateColumns: "78px 1fr 100px 70px 110px 56px" }}
        >
          <div>THREAD</div>
          <div>EVENT</div>
          <div>OWNER</div>
          <div>EVIDENCE</div>
          <div>STATUS</div>
          <div className="text-right">AT</div>
        </div>

        {/* Rows — each fades and slides in based on its threshold */}
        <div>
          {AUDIT_PANEL_ROWS.map((row, i) => {
            const rowReveal = Math.max(0, Math.min(1, (reveal - i * ROW_STAGGER) / 0.32));
            const eased = 1 - Math.pow(1 - rowReveal, 3);
            if (eased <= 0.01) return (
              <div key={row.id} style={{ height: 56 }} aria-hidden />
            );
            const statusStyles =
              row.status === "closed"
                ? { bg: "rgba(31,155,90,0.16)", border: "rgba(31,155,90,0.5)", fg: "#34d399", label: "CLOSED" }
                : { bg: "rgba(245,158,11,0.16)", border: "rgba(245,158,11,0.5)", fg: "#fbbf24", label: "IN REVIEW" };
            return (
              <div
                key={row.id}
                className="grid items-center px-6 py-3 border-b border-white/[0.04]"
                style={{
                  gridTemplateColumns: "78px 1fr 100px 70px 110px 56px",
                  opacity: eased,
                  transform: `translateX(${(1 - eased) * 12}px)`,
                  transition: "opacity 0.3s ease, transform 0.3s ease",
                }}
              >
                <div className="text-[13px] font-mono font-medium" style={{ color: "#7a9eff" }}>
                  {row.id}
                </div>
                <div className="text-[14px] font-medium text-white/90">
                  {row.title}
                </div>
                <div className="text-[13px] text-white/65">
                  {row.owner}
                </div>
                <div className="text-[13px] font-medium text-white/75">
                  {row.evidence}
                </div>
                <div>
                  <span
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-[5px] text-[10px] font-semibold tracking-[0.12em]"
                    style={{
                      background: statusStyles.bg,
                      border: `1px solid ${statusStyles.border}`,
                      color: statusStyles.fg,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: statusStyles.fg }}
                    />
                    {statusStyles.label}
                  </span>
                </div>
                <div className="text-[12px] font-mono text-white/45 text-right">
                  {row.ts}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-2.5 flex items-center justify-between text-[10px] font-mono text-white/35"
          style={{ background: "#0c0e14" }}
        >
          <span>evidence bound at time of decision · CFR 21 part 11 · ISO 9001</span>
          <span>updated just now</span>
        </div>
      </div>
    </div>
  );
}

