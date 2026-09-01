import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const lines = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({
      color: EDGE,
      transparent: true,
      opacity: edgeOpacity,
    }),
  );

  const slab = new THREE.Group();
  slab.add(mesh);
  slab.add(lines);
  return { group: slab, materials, targetColors };
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

export default function V1Page() {
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

  const [elevation, setElevation] = useState(DEFAULT_ELEVATION);
  const [azimuth, setAzimuth] = useState(INITIAL_AZIMUTH);
  const [frustum, setFrustum] = useState(INITIAL_FRUSTUM);
  const [showGrid, setShowGrid] = useState(true);
  const [showDebris, setShowDebris] = useState(true);
  const [showChurn, setShowChurn] = useState(true);
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

    entriesRef.current = entries;
    startTimeRef.current = performance.now();

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

  useEffect(() => {
    const cam = cameraRef.current;
    if (!cam) return;
    const e = (elevation * Math.PI) / 180;
    const a = (azimuth * Math.PI) / 180;
    // Orbit around the lookAt point so the iso angle is independent
    // of LOOKAT_DEFAULT.y.
    cam.position.set(
      LOOKAT_DEFAULT.x + CAM_DIST * Math.cos(e) * Math.sin(a),
      LOOKAT_DEFAULT.y + CAM_DIST * Math.sin(e),
      LOOKAT_DEFAULT.z + CAM_DIST * Math.cos(e) * Math.cos(a),
    );
    cam.lookAt(LOOKAT_DEFAULT);
  }, [elevation, azimuth]);

  useEffect(() => {
    const cam = cameraRef.current;
    const m = mountRef.current;
    if (!cam || !m) return;
    const aspect = m.clientWidth / m.clientHeight;
    cam.left = (-frustum * aspect) / 2;
    cam.right = (frustum * aspect) / 2;
    cam.top = frustum / 2;
    cam.bottom = -frustum / 2;
    cam.updateProjectionMatrix();
  }, [frustum]);

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

  const startEntranceAnimation = useCallback(() => {
    if (entranceFrameRef.current !== null) {
      cancelAnimationFrame(entranceFrameRef.current);
    }
    userInteractedRef.current = false;
    setFrustum(INITIAL_FRUSTUM);
    setAzimuth(INITIAL_AZIMUTH);
    const start = performance.now();
    const tick = () => {
      if (userInteractedRef.current) {
        entranceFrameRef.current = null;
        return;
      }
      const t = Math.min(
        (performance.now() - start) / ENTRANCE_DURATION,
        1,
      );
      const eased = 1 - Math.pow(1 - t, 3);
      setFrustum(
        INITIAL_FRUSTUM + (DEFAULT_FRUSTUM - INITIAL_FRUSTUM) * eased,
      );
      setAzimuth(
        INITIAL_AZIMUTH + (DEFAULT_AZIMUTH - INITIAL_AZIMUTH) * eased,
      );
      if (t < 1) {
        entranceFrameRef.current = requestAnimationFrame(tick);
      } else {
        entranceFrameRef.current = null;
      }
    };
    entranceFrameRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    startEntranceAnimation();
    return () => {
      if (entranceFrameRef.current !== null) {
        cancelAnimationFrame(entranceFrameRef.current);
        entranceFrameRef.current = null;
      }
    };
  }, [startEntranceAnimation]);

  const cancelEntrance = useCallback(() => {
    userInteractedRef.current = true;
    if (entranceFrameRef.current !== null) {
      cancelAnimationFrame(entranceFrameRef.current);
      entranceFrameRef.current = null;
    }
  }, []);

  const handleZoomChange = useCallback(
    (v: number) => {
      cancelEntrance();
      setFrustum(v);
    },
    [cancelEntrance],
  );

  const handleAzimuthChange = useCallback(
    (v: number) => {
      cancelEntrance();
      setAzimuth(v);
    },
    [cancelEntrance],
  );

  const replay = useCallback(() => {
    startTimeRef.current = performance.now();
    for (const entry of entriesRef.current) {
      if (!entry.iconMaterial) {
        entry.group.scale.y = 0.001;
      }
      if (entry.materials && entry.initialColor) {
        for (const mat of entry.materials) {
          mat.color.copy(entry.initialColor);
        }
      }
      if (entry.labelMaterial) {
        entry.labelMaterial.opacity = 0;
      }
      if (entry.iconMaterial) {
        entry.iconMaterial.opacity = 0;
      }
    }
    startEntranceAnimation();
  }, [startEntranceAnimation]);

  const resetCamera = useCallback(() => {
    cancelEntrance();
    setElevation(DEFAULT_ELEVATION);
    setAzimuth(DEFAULT_AZIMUTH);
    setFrustum(DEFAULT_FRUSTUM);
  }, [cancelEntrance]);

  const heroSubtitle = useMemo(
    () =>
      "Approvals, change control, revisions, risk reviews. Most of the work that produces them happens between systems. Only a fraction lands as a record.",
    [],
  );

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0b] text-white">
      <div ref={mountRef} className="absolute inset-0 h-full w-full" />

      {/* Hero overlay */}
      <header className="relative z-10 flex items-center justify-between px-8 pt-7">
        <div className="flex items-center gap-10">
          <span className="text-[15px] font-semibold tracking-tight">
            unifize
          </span>
          <nav className="hidden md:flex items-center gap-7 text-[13.5px] text-white/60">
            <a href="#problem">The Problem</a>
            <a href="#world">Your World</a>
            <a href="#industry">By Industry</a>
            <a href="#how">How It Works</a>
            <a href="#proof">Proof</a>
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
      </header>

      <section className="relative z-10 mx-auto mt-16 max-w-[1320px] px-8">
        <h1 className="text-[clamp(40px,6.4vw,80px)] font-medium leading-[1] tracking-[-0.042em] max-w-[22ch]">
          Records live in systems.
          <br />
          Work lives between them.
        </h1>
        <p className="mt-7 max-w-[80ch] text-[16px] leading-[1.5] text-white/60">
          {heroSubtitle}
        </p>
        <div className="mt-7">
          <a
            href="#demo"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13.5px] font-medium text-black hover:opacity-90"
          >
            Book a demo
            <span aria-hidden>→</span>
          </a>
        </div>
      </section>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-20 group">
        <button
          type="button"
          className="bg-black/70 backdrop-blur border border-white/15 text-white/90 px-3 py-2 rounded font-mono text-[11px] tracking-wide hover:bg-black/90"
        >
          CONTROLS
        </button>
        <div className="hidden group-hover:block absolute top-full right-0 mt-2 w-72 bg-black/90 backdrop-blur border border-white/15 rounded p-4 font-mono text-[11px] text-white/90">
          <ControlSlider
            label="Elevation"
            unit="°"
            min={5}
            max={75}
            step={0.1}
            value={elevation}
            onChange={setElevation}
          />
          <ControlSlider
            label="Azimuth"
            unit="°"
            min={0}
            max={90}
            step={0.1}
            value={azimuth}
            onChange={handleAzimuthChange}
          />
          <ControlSlider
            label="Zoom"
            unit=""
            min={6}
            max={48}
            step={0.1}
            value={frustum}
            onChange={handleZoomChange}
            invert
          />
          <label className="flex items-center justify-between py-2 cursor-pointer select-none">
            <span>Show grid</span>
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
              className="accent-blue-500"
            />
          </label>
          <label className="flex items-center justify-between py-2 cursor-pointer select-none">
            <span>Show churn</span>
            <input
              type="checkbox"
              checked={showChurn}
              onChange={(e) => setShowChurn(e.target.checked)}
              className="accent-blue-500"
            />
          </label>
          <label className="flex items-center justify-between py-2 cursor-pointer select-none">
            <span>Show debris</span>
            <input
              type="checkbox"
              checked={showDebris}
              onChange={(e) => setShowDebris(e.target.checked)}
              className="accent-blue-500"
            />
          </label>
          <div className="flex gap-2 pt-2 border-t border-white/10 mt-2">
            <button
              type="button"
              onClick={resetCamera}
              className="flex-1 border border-white/15 hover:bg-white/10 py-1.5 px-2 rounded uppercase tracking-wide"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={replay}
              className="flex-1 border border-white/15 hover:bg-white/10 py-1.5 px-2 rounded uppercase tracking-wide"
            >
              Replay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlSlider({
  label,
  unit,
  min,
  max,
  step,
  value,
  onChange,
  invert,
}: {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  invert?: boolean;
}) {
  return (
    <div className="py-1.5">
      <div className="flex justify-between mb-1">
        <span>{label}</span>
        <span className="text-white/60">
          {value.toFixed(1)}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={invert ? min + max - value : value}
        onChange={(e) =>
          onChange(invert ? min + max - +e.target.value : +e.target.value)
        }
        className="w-full accent-blue-500"
      />
    </div>
  );
}
