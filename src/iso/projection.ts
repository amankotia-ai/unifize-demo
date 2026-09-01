// SVG iso projection helpers.
// Kept here so the SVG-iso surfaces (v2.tsx, HeroIsoScene.tsx) and any
// future SVG annotation layers can share the same math.
// For R3F (true 3D), use the IsoScene camera instead — these are SVG-only.

import { UNIT_SVG_PX } from "./tokens";

export const COS30 = Math.cos(Math.PI / 6); // ≈ 0.8660254
export const SIN30 = 0.5;

export type Pt = [number, number];

export interface ProjOpts {
  /** SVG centre X (the projection's horizontal anchor). */
  cx: number;
  /** SVG floor Y (the projection's vertical anchor at world w=0). */
  floorY: number;
  /** Pixels per world unit. Defaults to UNIT_SVG_PX. */
  unit?: number;
}

/**
 * Project a world point (u, v, w) to screen (x, y) using a 30° SVG iso.
 * World axes: u → screen-up-right, v → screen-up-left, w → screen-up.
 */
export const proj = (u: number, v: number, w: number, opts: ProjOpts): Pt => {
  const unit = opts.unit ?? UNIT_SVG_PX;
  return [
    opts.cx + (u - v) * COS30 * unit,
    opts.floorY - (u + v) * SIN30 * unit - w * unit,
  ];
};

/** Stringify a list of points into an SVG polygon `points` attribute. */
export const poly = (pts: Pt[]): string =>
  pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

export interface CuboidFaces {
  top: Pt[];
  left: Pt[];
  front: Pt[];
}

/**
 * Compute the three visible faces of an iso cuboid spanning world AABB
 * [u0,u1] × [v0,v1] × [w0,w1]. Camera is at -u, -v, +w so visible faces
 * are those with normals -u, -v, +w.
 */
export function cuboid(
  u0: number, u1: number,
  v0: number, v1: number,
  w0: number, w1: number,
  opts: ProjOpts,
): CuboidFaces {
  return {
    top: [
      proj(u0, v1, w1, opts),
      proj(u1, v1, w1, opts),
      proj(u1, v0, w1, opts),
      proj(u0, v0, w1, opts),
    ],
    left: [
      proj(u0, v0, w1, opts),
      proj(u0, v1, w1, opts),
      proj(u0, v1, w0, opts),
      proj(u0, v0, w0, opts),
    ],
    front: [
      proj(u0, v0, w1, opts),
      proj(u1, v0, w1, opts),
      proj(u1, v0, w0, opts),
      proj(u0, v0, w0, opts),
    ],
  };
}
