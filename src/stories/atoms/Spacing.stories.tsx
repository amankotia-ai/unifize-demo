import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Atoms/Spacing",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const spacingTokens = [
  { name: "3xs", var: "--spacing-3xs", value: ".0625rem" },
  { name: "2xs", var: "--spacing-2xs", value: "1.75rem" },
  { name: "xs", var: "--spacing-xs", value: "3.75rem" },
  { name: "sm", var: "--spacing-sm", value: "5.4375rem" },
  { name: "md", var: "--spacing-md", value: "6.5rem" },
  { name: "lg", var: "--spacing-lg", value: "7.5rem" },
  { name: "xl", var: "--spacing-xl", value: "8.75rem" },
  { name: "2xl", var: "--spacing-2xl", value: "10.5rem" },
  { name: "3xl", var: "--spacing-3xl", value: "12.4375rem" },
  { name: "4xl", var: "--spacing-4xl", value: "16.75rem" },
  { name: "5xl", var: "--spacing-5xl", value: "18.75rem" },
  { name: "6xl", var: "--spacing-6xl", value: "20rem" },
];

export const Spacing: Story = {
  render: () => (
    <div className="space-y-3">
      {spacingTokens.map((s) => (
        <div key={s.name} className="flex items-center gap-4">
          <div className="w-16 shrink-0 text-right font-mono text-[11px] text-slate-500">
            {s.name}
          </div>
          <div
            className="h-5 rounded-sm bg-[#0052FF]"
            style={{ width: s.value }}
          />
          <div className="font-mono text-[10px] text-slate-400">
            {s.value}
            <span className="ml-2 text-slate-300">var({s.var})</span>
          </div>
        </div>
      ))}
    </div>
  ),
};
