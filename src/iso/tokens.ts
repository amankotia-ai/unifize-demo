// Iso kit — single source of design tokens.
// Adding new colours/timings here keeps the primitives interchangeable.
// Do not hardcode hex values inside primitive components.

// ── Brand colours ────────────────────────────────────
// Unifize blue is reserved for the platform itself. Do not use on SoR cubes,
// SoC tiles, or thread tiles. Keeps the sovereign object readable.
export const UNIFIZE_BLUE = "#0052FF";
export const UNIFIZE_BLUE_TOP = "#3D7AFF";
export const UNIFIZE_BLUE_FRONT = "#1A5AFF";
export const UNIFIZE_BLUE_RIGHT = "#0040C9";
export const UNIFIZE_BLUE_DEEP = "#0033A6";  // Product band
export const UNIFIZE_BLUE_DEEPER = "#1A1F3D"; // Workflow Components band

// Systems of record cubes — flat neutral graphite. All four cubes
// share the palette so no record reads as a special case.
export const SOR_TOP = "#3A3D45";
export const SOR_FRONT = "#2A2D35";
export const SOR_RIGHT = "#1E2027";

// Thread tiles — cream, the captured evidence that lives ON Unifize's
// Outcomes band. The tile IS Unifize's record-keeping primitive.
export const THREAD_TOP = "#F1E4C9";
export const THREAD_FRONT = "#D9C7A5";
export const THREAD_RIGHT = "#B59E78";

// SoC tiles — channels + horizontal tools share a neutral darker family
// so the eye reads "these are tools, not records."
export const SOC_FILL = "#1F2128";
export const SOC_EDGE = "#2E3038";
export const SOC_LABEL = "#9A9DA6";

// Arrow palette — five canonical arrows, two colour families.
// Lavender = capture flows from the messy right zone.
// Cream    = write-back (deterministic, agreed outcomes).
// Blue     = context flow from SoR / connectors.
export const LAVENDER = "#B7A7E8";
export const LAVENDER_DIM = "#7E70B5";
export const CREAM_ARROW = "#E8D8B0";
export const CONTEXT_BLUE = "#3D7AFF";
export const CONTEXT_BLUE_DIM = "#1A5AFF";

// ── UI / severity tokens ─────────────────────────────
export const SEV_RED = "#E5484D";
export const SEV_AMBER = "#F59E0B";
export const SEV_GREEN = "#1F9B5A";

// ── Ambient ──────────────────────────────────────────
export const FLOOR_GRID_RGBA = "rgba(255,255,255,0.04)";
export const VOID_HATCH_RGBA = "rgba(255,255,255,0.06)";
export const PAGE_BG = "#0a0a0b";

// ── World dimensions (R3F + SVG share these) ─────────
// One world unit ≈ 36 SVG pixels in the legacy v2.tsx projection.
// In R3F, world units are direct — we just pick sensible defaults.
export const UNIT_SVG_PX = 36;
export const CUBOID_EDGE_OPACITY = 0.18;

// ── Motion grammar ───────────────────────────────────
// All durations in seconds. Keep this list short — every motion in the
// scene should map to one of these tokens.
export const MOTION = {
  threadPulse: 5.6,
  captureShimmer: 3.2,
  debrisDrift: 8,
  phaseTransition: 0.6,
  arrowStagger: 0.12,
  hoverTilt: 0.18,
} as const;

// ── Typography ───────────────────────────────────────
export const FONT_MONO = "'JetBrains Mono', ui-monospace, monospace";
export const FONT_SANS = "Inter, system-ui, sans-serif";

// ── Camera defaults for IsoScene ─────────────────────
// True isometric: 35.264° elevation, 45° azimuth, ortho projection.
// Frustum value tunes how zoomed-in the scene is in world units.
export const ISO_ELEVATION_DEG = 35.264;
export const ISO_AZIMUTH_DEG = 45;
export const ISO_FRUSTUM = 12;
export const ISO_CAM_DISTANCE = 40;
