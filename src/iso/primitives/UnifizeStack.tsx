// UnifizeStack
// The sovereign object — three vertically stacked bands with an AI Assist
// chip baked into the top band's surface. This is the visual answer to
// Yan's 11/5 critique ("Unifize doesn't look like a system itself"):
// the platform has visible internal mechanism rather than being a single
// slab with a logo.
//
// Per Story Architecture §2: three bands customer-facing, never four.
// The fourth (Core Platform) is internal architecture and must not render
// externally.
//
//   ┌────────────────────────┐  ← Outcomes + AI Assist (brand blue + chip)
//   ├────────────────────────┤  ← Product Suite (deeper blue)
//   ├────────────────────────┤  ← Workflow Components (deepest, foundational)
//   └────────────────────────┘
//
// The top face of the Outcomes band is the THREAD FLOOR — threads bake
// into this surface in higher-level compositions. We don't render
// threads inside this primitive; consumers attach <ThreadTile/>s to the
// `threadAnchor` height we export.

import { Text } from "@react-three/drei";
import { Cuboid } from "./Cuboid";
import {
  UNIFIZE_BLUE_TOP,
  UNIFIZE_BLUE_FRONT,
  UNIFIZE_BLUE_RIGHT,
  UNIFIZE_BLUE_DEEP,
  UNIFIZE_BLUE_DEEPER,
  SEV_AMBER,
} from "../tokens";

export interface UnifizeStackProps {
  /** Base-centre position. y=0 puts the stack on the iso floor. */
  position?: [number, number, number];
  /** Footprint [width, depth] in world units. Defaults to [6, 4.5]. */
  footprint?: [number, number];
  /** Height of each band in world units. Defaults to 0.8. */
  bandHeight?: number;
  /** Label drawn on the front face of the top band. Defaults to "UNIFIZE". */
  label?: string;
  /** Render the AI Assist corner chip on the top band's top face. */
  showAiChip?: boolean;
  /** Render faint band labels on each band's front face. Off by default —
   *  hero copy carries the naming, the bands carry the structure. */
  showBandLabels?: boolean;
}

/** Y coordinate of the thread floor (top face of the Outcomes band).
 *  Consumers stacking ThreadTile/s on top of Unifize should use this. */
export function unifizeThreadAnchor(bandHeight = 0.8): number {
  return bandHeight * 3;
}

export function UnifizeStack({
  position = [0, 0, 0],
  footprint = [6, 4.5],
  bandHeight = 0.8,
  label = "UNIFIZE",
  showAiChip = true,
  showBandLabels = false,
}: UnifizeStackProps) {
  const [w, d] = footprint;
  const h = bandHeight;
  const [px, py, pz] = position;

  return (
    <group position={[px, py, pz]}>
      {/* Band 3 — Workflow Components (foundation). Darkest shade. */}
      <Cuboid
        position={[0, 0, 0]}
        size={[w, h, d]}
        color={{
          top: UNIFIZE_BLUE_DEEPER,
          front: UNIFIZE_BLUE_DEEPER,
          right: "#0F1226",
        }}
        label={showBandLabels ? "WORKFLOW" : undefined}
        labelSize={0.22}
        labelColor="#B4BEDC"
        labelOpacity={0.65}
        edgeOpacity={0.22}
      />

      {/* Band 2 — Product Suite. Mid-tone blue. */}
      <Cuboid
        position={[0, h, 0]}
        size={[w, h, d]}
        color={{
          top: UNIFIZE_BLUE_DEEP,
          front: UNIFIZE_BLUE_DEEP,
          right: "#002A85",
        }}
        label={showBandLabels ? "PRODUCTS" : undefined}
        labelSize={0.22}
        labelColor="#BECDF0"
        labelOpacity={0.7}
        edgeOpacity={0.24}
      />

      {/* Band 1 — Outcomes + AI Assist. Brand blue, the top read. */}
      <Cuboid
        position={[0, h * 2, 0]}
        size={[w, h, d]}
        color={{
          top: UNIFIZE_BLUE_TOP,
          front: UNIFIZE_BLUE_FRONT,
          right: UNIFIZE_BLUE_RIGHT,
        }}
        label={label}
        labelSize={0.42}
        labelColor="#FFFFFF"
        labelOpacity={0.98}
        edgeOpacity={0.32}
      />

      {/* AI Assist corner chip — small luminous tile resting on the top
          face of the Outcomes band, top-right corner. Strategy: AI lives
          INSIDE the Outcomes band, never as a separate object. */}
      {showAiChip && <AiAssistChip footprint={footprint} bandHeight={bandHeight} />}
    </group>
  );
}

interface AiAssistChipProps {
  footprint: [number, number];
  bandHeight: number;
}

function AiAssistChip({ footprint, bandHeight }: AiAssistChipProps) {
  const [w, d] = footprint;
  const chipW = 1.4;
  const chipD = 0.7;
  const chipH = 0.08;
  // Top-right corner of the Outcomes band's top face, inset by ~0.25.
  const x = w / 2 - chipW / 2 - 0.25;
  const z = -d / 2 + chipD / 2 + 0.25;
  const y = bandHeight * 3; // top of Outcomes band

  return (
    <group position={[x, y, z]}>
      {/* Subtle glow under the chip — soft amber halo so the eye reads it
          as "luminous tag" rather than another tile. */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[chipW * 1.6, chipD * 1.8]} />
        <meshBasicMaterial color={SEV_AMBER} transparent opacity={0.16} />
      </mesh>

      {/* The chip itself — thin emissive slab. */}
      <mesh position={[0, chipH / 2, 0]}>
        <boxGeometry args={[chipW, chipH, chipD]} />
        <meshStandardMaterial
          color={SEV_AMBER}
          emissive={SEV_AMBER}
          emissiveIntensity={0.55}
          metalness={0.1}
          roughness={0.4}
        />
      </mesh>

      <Text
        position={[0, chipH + 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.22}
        letterSpacing={0.18}
        color="#140C00"
        fillOpacity={0.95}
        anchorX="center"
        anchorY="middle"
      >
        AI ASSIST
      </Text>
    </group>
  );
}
