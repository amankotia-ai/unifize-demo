// v4 — sanity-check page for the new iso kit.
//
// Composes the kit primitives in roughly the LEFT (SoR) → CENTRE
// (Unifize) → RIGHT (channels/tools) layout the hero plan calls for,
// but using ONLY <IsoScene> + <Cuboid> from src/iso/. The rest of the
// hero scene (arrows, threads baked into Outcomes, humans, orbit,
// debris pile, ghosted Phase-1 stack) gets added once you sign off on
// this foundation pattern.
//
// Notes
// • Page is intentionally tiny (~80 lines) — proves "lighter pages".
// • LEFT/RIGHT placement follows Concept Map §3 (SoR = left).
// • Unifize is shown as three stacked bands inline; that becomes its
//   own <UnifizeStack/> primitive next pass.

import { IsoScene } from "@/iso/scene/IsoScene";
import { Cuboid } from "@/iso/primitives/Cuboid";
import {
  SOR_TOP,
  SOR_FRONT,
  SOR_RIGHT,
  UNIFIZE_BLUE_TOP,
  UNIFIZE_BLUE_FRONT,
  UNIFIZE_BLUE_RIGHT,
  UNIFIZE_BLUE_DEEP,
  UNIFIZE_BLUE_DEEPER,
  SOC_FILL,
  SOC_EDGE,
} from "@/iso/tokens";

const SOR_PALETTE = { top: SOR_TOP, front: SOR_FRONT, right: SOR_RIGHT };
const SOC_PALETTE = { top: SOC_FILL, front: SOC_FILL, right: SOC_EDGE };

// Three Unifize bands, equal footprint, stacked vertically.
const UNIFIZE_BAND_W = 5;
const UNIFIZE_BAND_D = 4;
const BAND_H = 0.8;

export default function V4() {
  return (
    <main className="min-h-screen w-full bg-[#0a0a0b] text-white">
      <header className="flex items-center justify-between px-8 pt-7">
        <span className="text-[15px] font-semibold tracking-tight">unifize</span>
        <span className="text-[12px] text-white/40 font-mono uppercase tracking-[0.2em]">
          v4 · iso kit sanity check
        </span>
      </header>

      <section className="mx-auto mt-10 max-w-[1280px] px-8">
        <p className="text-[12px] font-mono uppercase tracking-[0.2em] text-white/60">
          Kit foundation
        </p>
        <h1 className="mt-4 max-w-[26ch] text-[clamp(34px,4.6vw,56px)] font-medium leading-[1.05] tracking-[-0.03em]">
          One Canvas. One Cuboid. The rest composes from here.
        </h1>
      </section>

      {/* 70vh iso scene — same target sizing as the hero plan. */}
      <IsoScene className="w-full h-[70vh]" frustum={12} target={[0, 1, 0]}>
        {/* LEFT zone: 4 SoR cubes in a 2x2 plinth. */}
        <Cuboid position={[-7, 0, -2]} size={[2, 2.6, 2]} color={SOR_PALETTE} label="QMS" />
        <Cuboid position={[-4.5, 0, -2]} size={[2, 2, 2]} color={SOR_PALETTE} label="DMS" />
        <Cuboid position={[-7, 0, 1]} size={[2, 2.2, 2]} color={SOR_PALETTE} label="ERP" />
        <Cuboid position={[-4.5, 0, 1]} size={[2, 2.4, 2]} color={SOR_PALETTE} label="PLM" />

        {/* CENTRE: three Unifize bands. Bottom = Workflow Components,
            middle = Products, top = Outcomes + AI Assist. */}
        <Cuboid
          position={[0, 0, 0]}
          size={[UNIFIZE_BAND_W, BAND_H, UNIFIZE_BAND_D]}
          color={{ top: UNIFIZE_BLUE_DEEPER, front: UNIFIZE_BLUE_DEEPER, right: UNIFIZE_BLUE_DEEPER }}
        />
        <Cuboid
          position={[0, BAND_H, 0]}
          size={[UNIFIZE_BAND_W, BAND_H, UNIFIZE_BAND_D]}
          color={{ top: UNIFIZE_BLUE_DEEP, front: UNIFIZE_BLUE_DEEP, right: UNIFIZE_BLUE_DEEP }}
        />
        <Cuboid
          position={[0, BAND_H * 2, 0]}
          size={[UNIFIZE_BAND_W, BAND_H, UNIFIZE_BAND_D]}
          color={{ top: UNIFIZE_BLUE_TOP, front: UNIFIZE_BLUE_FRONT, right: UNIFIZE_BLUE_RIGHT }}
          label="UNIFIZE"
          labelSize={0.4}
          labelColor="#FFFFFF"
          labelOpacity={0.96}
        />

        {/* RIGHT zone: 2 horizontal tools (top), 2 collaboration channels (bottom). */}
        <Cuboid position={[5, 0, -2]} size={[1.8, 0.5, 1.8]} color={SOC_PALETTE} label="SHAREPOINT" labelSize={0.22} />
        <Cuboid position={[7.2, 0, -2]} size={[1.8, 0.5, 1.8]} color={SOC_PALETTE} label="EXCEL" labelSize={0.22} />
        <Cuboid position={[5, 0, 1]} size={[1.8, 0.5, 1.8]} color={SOC_PALETTE} label="OUTLOOK" labelSize={0.22} />
        <Cuboid position={[7.2, 0, 1]} size={[1.8, 0.5, 1.8]} color={SOC_PALETTE} label="TEAMS" labelSize={0.22} />
      </IsoScene>
    </main>
  );
}
