import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Atoms/Colors",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Colors: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {[
        { name: "Background", var: "--color-background", hex: "#ffffff" },
        { name: "Text", var: "--color-text", hex: "#000000" },
        { name: "Primary", var: "--color-primary", hex: "#0052FF" },
        { name: "Secondary", var: "--color-secondary", hex: "#000db5" },
        { name: "Accent", var: "--color-accent", hex: "#c2b8ff" },
        { name: "Border", var: "--color-border", hex: "#d6d7d1" },
      ].map((c) => (
        <div key={c.name} className="space-y-2">
          <div
            className="flex h-20 items-end rounded-lg border p-3"
            style={{
              backgroundColor: c.hex,
              borderColor: "#d6d7d1",
              color: ["#ffffff", "#c2b8ff", "#d6d7d1"].includes(c.hex)
                ? "#000000"
                : "#ffffff",
            }}
          >
            <span className="text-[11px] font-semibold">{c.name}</span>
          </div>
          <div className="pl-1">
            <p className="font-mono text-[11px] text-slate-500">{c.hex}</p>
            <p className="font-mono text-[10px] text-slate-400">
              var({c.var})
            </p>
          </div>
        </div>
      ))}
    </div>
  ),
};
