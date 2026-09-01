// Cuboid
// Base 3D primitive that every iso surface composes from.
// One declarative component. Six face colours (or one). Optional label.
// Optional edge stroke. That is the whole API on purpose — anything else
// belongs in a higher-level primitive (SorCube, UnifizeStack, ChannelCube).
//
// World convention: position is the BASE-CENTRE of the box. The box
// extends [+y] from the floor up to height. So passing y=0 lands it on
// the iso floor without arithmetic at the call-site.

import { Text } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

import { CUBOID_EDGE_OPACITY } from "../tokens";

export interface CuboidFacePalette {
  top: string;
  front: string;
  right: string;
  /** Defaults to front. */
  left?: string;
  /** Defaults to top. Used only when looking up from below; usually invisible. */
  bottom?: string;
  /** Defaults to right. */
  back?: string;
}

export interface CuboidProps {
  /** Base-centre position [x, y, z]. y=0 sits the cube on the iso floor. */
  position?: [number, number, number];
  /** [width, height, depth] in world units. */
  size: [number, number, number];
  /** A single colour, or a three-face palette {top, front, right}. */
  color: string | CuboidFacePalette;
  /** Optional label drawn on the front face in mono. */
  label?: string;
  /** Label colour as a solid hex/named CSS colour (NOT rgba — THREE.Color
   *  strips alpha). Use labelOpacity for translucency. */
  labelColor?: string;
  /** Label fill opacity 0..1. Drei's Text supports this independently of color. */
  labelOpacity?: number;
  /** Label font size in world units. Defaults to 0.4. */
  labelSize?: number;
  /** Show edge lines around the cuboid. Defaults to true. */
  edges?: boolean;
  /** Edge stroke opacity 0..1. Defaults to CUBOID_EDGE_OPACITY. */
  edgeOpacity?: number;
  /** Edge stroke colour. Defaults to white. */
  edgeColor?: string;
}

export function Cuboid({
  position = [0, 0, 0],
  size,
  color,
  label,
  labelColor = "#E6E8EE",
  labelOpacity = 0.95,
  labelSize = 0.4,
  edges = true,
  edgeOpacity = CUBOID_EDGE_OPACITY,
  edgeColor = "#ffffff",
}: CuboidProps) {
  const [w, h, d] = size;
  // BoxGeometry centres at the mesh origin, so lift by h/2 to sit on the floor
  // when caller passes y=0.
  const meshY = position[1] + h / 2;

  const palette: Required<CuboidFacePalette> | null = useMemo(() => {
    if (typeof color === "string") return null;
    return {
      top: color.top,
      front: color.front,
      right: color.right,
      left: color.left ?? color.front,
      bottom: color.bottom ?? color.top,
      back: color.back ?? color.right,
    };
  }, [color]);

  // Edge geometry for crisp outlines — computed once per size change.
  const edgeGeometry = useMemo(() => {
    const box = new THREE.BoxGeometry(w, h, d);
    const edges = new THREE.EdgesGeometry(box);
    box.dispose();
    return edges;
  }, [w, h, d]);

  // Face label position: on the +z front face, nudged outward to avoid z-fighting.
  // Box face order in Three.js: +x, -x, +y, -y, +z, -z.
  return (
    <group position={[position[0], meshY, position[2]]}>
      <mesh>
        <boxGeometry args={[w, h, d]} />
        {palette ? (
          <>
            <meshStandardMaterial attach="material-0" color={palette.right} />
            <meshStandardMaterial attach="material-1" color={palette.left} />
            <meshStandardMaterial attach="material-2" color={palette.top} />
            <meshStandardMaterial attach="material-3" color={palette.bottom} />
            <meshStandardMaterial attach="material-4" color={palette.front} />
            <meshStandardMaterial attach="material-5" color={palette.back} />
          </>
        ) : (
          <meshStandardMaterial color={color as string} />
        )}
      </mesh>

      {edges && (
        <lineSegments geometry={edgeGeometry}>
          <lineBasicMaterial color={edgeColor} transparent opacity={edgeOpacity} />
        </lineSegments>
      )}

      {label && (
        <Text
          position={[0, 0, d / 2 + 0.01]}
          fontSize={labelSize}
          color={labelColor}
          fillOpacity={labelOpacity}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.08}
          maxWidth={w * 0.9}
        >
          {label}
        </Text>
      )}
    </group>
  );
}

// Re-export the font constant so consumers can wire a custom font URL via
// drei's Text font prop later without reaching into tokens.ts.
export { FONT_MONO } from "../tokens";
