// Cuboid stories
// One story per visual concern. Each story renders inside <IsoScene/> so
// the Cuboid sits in a true iso world with lighting + the floor grid.
// This is the unit-level sandbox Yan asked for on 11/5 — iterate one
// primitive in isolation, screenshot it, A/B variants.

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Cuboid } from "./Cuboid";
import { IsoScene } from "../scene/IsoScene";
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
} from "../tokens";

const meta: Meta<typeof Cuboid> = {
  title: "Iso/Primitives/Cuboid",
  component: Cuboid,
  parameters: {
    layout: "fullscreen",
  },
  // Stories receive Cuboid props; we wrap them in IsoScene via decorator so
  // the canvas + camera + lighting are always the same.
  decorators: [
    (Story) => (
      <div style={{ width: "100vw", height: "100vh" }}>
        <IsoScene className="w-full h-full" frustum={6}>
          <Story />
        </IsoScene>
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Cuboid>;

// ── 1. Single neutral cuboid ──────────────────────────
// Smallest possible call site. Confirms the primitive renders, sits on
// the floor, and gets edge lines.
export const Neutral: Story = {
  args: {
    position: [0, 0, 0],
    size: [2, 2, 2],
    color: "#555866",
  },
};

// ── 2. SoR cube ───────────────────────────────────────
// Three-face graphite palette + mono label on the front face. This is
// the visual you would see in the left zone of the hero — one of four
// identical neutral cubes (QMS / DMS / ERP / PLM).
export const SystemOfRecord: Story = {
  args: {
    position: [0, 0, 0],
    size: [2, 2.6, 2],
    color: {
      top: SOR_TOP,
      front: SOR_FRONT,
      right: SOR_RIGHT,
    },
    label: "QMS",
    labelSize: 0.45,
  },
};

// ── 3. Unifize band ───────────────────────────────────
// Brand-blue cuboid. In the real hero this is one of three vertically
// stacked bands; in isolation we just render a single band to verify the
// palette reads as Unifize-sovereign blue, not as another SoR.
export const UnifizeBand: Story = {
  args: {
    position: [0, 0, 0],
    size: [6, 1.6, 4.5],
    color: {
      top: UNIFIZE_BLUE_TOP,
      front: UNIFIZE_BLUE_FRONT,
      right: UNIFIZE_BLUE_RIGHT,
    },
    label: "UNIFIZE",
    labelSize: 0.5,
    labelColor: "rgba(255,255,255,0.96)",
  },
};

// ── 4. Thread tile ────────────────────────────────────
// Cream tile, thin. In the hero, threads BAKE INTO the top face of the
// Unifize Outcomes band. In isolation we render one so we can iterate
// the cream palette + record-row pips later.
export const ThreadTile: Story = {
  args: {
    position: [0, 0, 0],
    size: [2.2, 0.32, 1.8],
    color: {
      top: THREAD_TOP,
      front: THREAD_FRONT,
      right: THREAD_RIGHT,
    },
    label: "CR-241",
    labelSize: 0.32,
    labelColor: "rgba(30,22,8,0.88)",
  },
};

// ── 5. SoC tile ───────────────────────────────────────
// Dark neutral slab — the collaboration channel / horizontal tool shape.
// No brand blue. No cream. These read as "tools, not records."
export const SocTile: Story = {
  args: {
    position: [0, 0, 0],
    size: [2.4, 0.5, 2.4],
    color: {
      top: SOC_FILL,
      front: SOC_FILL,
      right: SOC_EDGE,
    },
    label: "OUTLOOK",
    labelSize: 0.3,
  },
};
