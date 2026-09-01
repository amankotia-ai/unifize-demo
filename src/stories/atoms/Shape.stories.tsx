import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Atoms/Shape",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const radiusTokens = [
  { name: "none", var: "--radius-none", value: "0" },
  { name: "sm", var: "--radius-sm", value: "2px" },
  { name: "md", var: "--radius-md", value: "5px" },
  { name: "lg", var: "--radius-lg", value: ".625rem" },
  { name: "xl", var: "--radius-xl", value: "1.125rem" },
  { name: "full", var: "--radius-full", value: "1.5625rem" },
];

export const BorderRadius: Story = {
  name: "Border Radius",
  render: () => (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
      {radiusTokens.map((r) => (
        <div key={r.name} className="space-y-2 text-center">
          <div
            className="mx-auto flex h-20 w-20 items-center justify-center border-2 border-[#0052FF] bg-[#0052FF]/5"
            style={{ borderRadius: r.value }}
          >
            <span className="font-mono text-[11px] font-medium text-[#0052FF]">
              {r.name}
            </span>
          </div>
          <div>
            <p className="font-mono text-[11px] text-slate-500">{r.value}</p>
            <p className="font-mono text-[10px] text-slate-400">
              var({r.var})
            </p>
          </div>
        </div>
      ))}
    </div>
  ),
};
