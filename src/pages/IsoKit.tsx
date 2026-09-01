// IsoKit
// Single-page showcase of every primitive in src/iso/primitives.
// Each card has its own dedicated iso scene + variant chips so you can
// iterate on one primitive in isolation without leaving the page.
// Replaces Storybook for our purposes — same isolation, less plumbing.
//
// Adding a new primitive to the kit:
//   1. Write src/iso/primitives/Foo.tsx
//   2. Add a PrimitiveCard entry below with its variants
//   3. Done — no config, no rebuild step

import { useState, type ReactNode } from "react";

import { IsoScene } from "@/iso/scene/IsoScene";
import { Cuboid } from "@/iso/primitives/Cuboid";
import { UnifizeStack } from "@/iso/primitives/UnifizeStack";
import {
  SOR_TOP,
  SOR_FRONT,
  SOR_RIGHT,
  UNIFIZE_BLUE_TOP,
  UNIFIZE_BLUE_FRONT,
  UNIFIZE_BLUE_RIGHT,
  THREAD_TOP,
  THREAD_FRONT,
  THREAD_RIGHT,
  SOC_FILL,
  SOC_EDGE,
} from "@/iso/tokens";

// ── PrimitiveCard ─────────────────────────────────────
// One card per primitive. Variant chips swap the scene without
// remounting the canvas (state is internal).
interface Variant {
  name: string;
  scene: ReactNode;
  /** Optional override of the scene frustum for this variant. */
  frustum?: number;
}

interface PrimitiveCardProps {
  name: string;
  description: string;
  importPath: string;
  variants: Variant[];
}

function PrimitiveCard({ name, description, importPath, variants }: PrimitiveCardProps) {
  const [active, setActive] = useState(0);
  const current = variants[active];
  return (
    <article className="rounded-2xl border border-white/[0.08] bg-[#0E0F12] overflow-hidden">
      <header className="px-6 pt-5 pb-4 border-b border-white/[0.06]">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-mono text-[15px] font-medium tracking-tight text-white">{name}</h3>
          <code className="text-[11px] text-white/35 font-mono">{importPath}</code>
        </div>
        <p className="mt-1.5 text-[13.5px] leading-snug text-white/55">{description}</p>
        {variants.length > 1 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {variants.map((v, i) => (
              <button
                key={v.name}
                type="button"
                onClick={() => setActive(i)}
                className={
                  "rounded-md px-2.5 py-1 text-[11px] font-mono tracking-wide transition " +
                  (i === active
                    ? "bg-white/10 text-white"
                    : "bg-white/[0.03] text-white/45 hover:text-white/80 hover:bg-white/[0.06]")
                }
              >
                {v.name}
              </button>
            ))}
          </div>
        )}
      </header>
      <div className="relative h-[420px]">
        <IsoScene className="w-full h-full" frustum={current.frustum ?? 6}>
          {current.scene}
        </IsoScene>
      </div>
    </article>
  );
}

// ── Variant scenes ────────────────────────────────────
// Defined as constants so we can swap them without re-creating render
// functions inside the card render loop.
const SOR_PALETTE = { top: SOR_TOP, front: SOR_FRONT, right: SOR_RIGHT };
const UNIFIZE_PALETTE = {
  top: UNIFIZE_BLUE_TOP,
  front: UNIFIZE_BLUE_FRONT,
  right: UNIFIZE_BLUE_RIGHT,
};
const THREAD_PALETTE = { top: THREAD_TOP, front: THREAD_FRONT, right: THREAD_RIGHT };
const SOC_PALETTE = { top: SOC_FILL, front: SOC_FILL, right: SOC_EDGE };

const CUBOID_VARIANTS: Variant[] = [
  {
    name: "Neutral",
    scene: <Cuboid position={[0, 0, 0]} size={[2, 2, 2]} color="#555866" />,
  },
  {
    name: "SoR cube — QMS",
    scene: (
      <Cuboid
        position={[0, 0, 0]}
        size={[2, 2.6, 2]}
        color={SOR_PALETTE}
        label="QMS"
        labelSize={0.45}
      />
    ),
  },
  {
    name: "SoR cube — PLM",
    scene: (
      <Cuboid
        position={[0, 0, 0]}
        size={[2, 2.4, 2]}
        color={SOR_PALETTE}
        label="PLM"
        labelSize={0.45}
      />
    ),
  },
  {
    name: "Unifize band (single)",
    scene: (
      <Cuboid
        position={[0, 0, 0]}
        size={[5, 1.2, 4]}
        color={UNIFIZE_PALETTE}
        label="UNIFIZE"
        labelSize={0.48}
        labelColor="#FFFFFF"
        labelOpacity={0.96}
      />
    ),
  },
  {
    name: "Thread tile",
    scene: (
      <Cuboid
        position={[0, 0, 0]}
        size={[2.6, 0.36, 2]}
        color={THREAD_PALETTE}
        label="CR-241"
        labelSize={0.32}
        labelColor="#1E1608"
        labelOpacity={0.88}
      />
    ),
    frustum: 3.5,
  },
  {
    name: "SoC tile — Outlook",
    scene: (
      <Cuboid
        position={[0, 0, 0]}
        size={[2.4, 0.5, 2.4]}
        color={SOC_PALETTE}
        label="OUTLOOK"
        labelSize={0.28}
      />
    ),
    frustum: 4,
  },
];

const UNIFIZE_STACK_VARIANTS: Variant[] = [
  {
    name: "Default — hero state",
    scene: <UnifizeStack position={[0, 0, 0]} footprint={[6, 4.5]} bandHeight={0.8} />,
    frustum: 7,
  },
  {
    name: "With band labels",
    scene: (
      <UnifizeStack
        position={[0, 0, 0]}
        footprint={[6, 4.5]}
        bandHeight={0.8}
        showBandLabels
      />
    ),
    frustum: 7,
  },
  {
    name: "No AI chip",
    scene: (
      <UnifizeStack
        position={[0, 0, 0]}
        footprint={[6, 4.5]}
        bandHeight={0.8}
        showAiChip={false}
      />
    ),
    frustum: 7,
  },
  {
    name: "Compact",
    scene: <UnifizeStack position={[0, 0, 0]} footprint={[4.5, 3.5]} bandHeight={0.6} />,
    frustum: 5.5,
  },
];

// Sketched preview for primitives that don't exist yet — keeps the kit
// honest about what's built vs. what's still ahead.
const PENDING: Array<{ name: string; description: string; importPath: string }> = [
  {
    name: "ThreadTile",
    description:
      "Cream tile with decision / approval / evidence / owner / completion pips bound on the top face. Bakes flush into the Outcomes band's top.",
    importPath: "@/iso/primitives/ThreadTile",
  },
  {
    name: "Arrow",
    description:
      "Five canonical variants: context (SoR→Unifize), context-connectors, write-back, artifacts, decisions. Labelled tab lands on its anchor.",
    importPath: "@/iso/primitives/Arrow",
  },
  {
    name: "OrbitGlyphs",
    description:
      "Kaleidoscope of recognisable artifacts (envelope, chat bubble, calendar pip, doc corner, phone) drifting around a collaboration cluster. Yan's metaphor.",
    importPath: "@/iso/primitives/OrbitGlyphs",
  },
  {
    name: "DebrisPile",
    description:
      "Floor accumulation of fallen glyphs beneath the SoC zone. Grows in Phase 1, shrinks in Phase 2 as Unifize reclaims it.",
    importPath: "@/iso/primitives/DebrisPile",
  },
  {
    name: "Human",
    description:
      "Three postures — heads-down, handoff, anchored-on-Unifize. The anchored figure stands on the thread floor with a soft blue halo.",
    importPath: "@/iso/primitives/Human",
  },
  {
    name: "GhostedStack",
    description:
      "Phase-1 should-be-there outline of UnifizeStack. Dotted iso edges, no fill. Communicates 'the thread that holds the work — missing'.",
    importPath: "@/iso/primitives/GhostedStack",
  },
];

export default function IsoKit() {
  return (
    <main className="min-h-screen w-full bg-[#0a0a0b] text-white">
      <header className="flex items-center justify-between px-8 pt-7">
        <span className="text-[15px] font-semibold tracking-tight">unifize</span>
        <span className="text-[11.5px] text-white/40 font-mono uppercase tracking-[0.2em]">
          iso kit · v0
        </span>
      </header>

      <section className="mx-auto mt-10 max-w-[1280px] px-8">
        <p className="text-[11.5px] font-mono uppercase tracking-[0.2em] text-white/55">
          Component library
        </p>
        <h1 className="mt-3 max-w-[28ch] text-[clamp(34px,4.4vw,52px)] font-medium leading-[1.05] tracking-[-0.03em]">
          Every iso primitive, in isolation.
        </h1>
        <p className="mt-4 max-w-[60ch] text-[14.5px] leading-[1.55] text-white/55">
          Each card renders one primitive in a dedicated 3D scene. Click a
          variant chip to swap states. New primitives land below as they
          ship.
        </p>
      </section>

      {/* Built primitives */}
      <section className="mx-auto mt-12 max-w-[1280px] px-8">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[#1F9B5A]" />
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/55">
            Built · {2} primitives
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PrimitiveCard
            name="Cuboid"
            description="The base 3D box every other primitive composes from. Three-face palette, optional mono label, optional edge stroke. y=0 sits it on the floor automatically."
            importPath="@/iso/primitives/Cuboid"
            variants={CUBOID_VARIANTS}
          />
          <PrimitiveCard
            name="UnifizeStack"
            description="Three vertically stacked Cuboids — Workflow Components / Products / Outcomes+AI — with the AI Assist corner chip baked into the top face. The sovereign object on the hero."
            importPath="@/iso/primitives/UnifizeStack"
            variants={UNIFIZE_STACK_VARIANTS}
          />
        </div>
      </section>

      {/* Pending primitives — sketched roadmap */}
      <section className="mx-auto mt-14 mb-20 max-w-[1280px] px-8">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/55">
            Pending · {PENDING.length} primitives
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {PENDING.map((p) => (
            <div
              key={p.name}
              className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-4"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h4 className="font-mono text-[13.5px] font-medium text-white/85">{p.name}</h4>
                <code className="text-[10.5px] text-white/30 font-mono">{p.importPath.split("/").pop()}</code>
              </div>
              <p className="mt-1.5 text-[12.5px] leading-snug text-white/45">{p.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
