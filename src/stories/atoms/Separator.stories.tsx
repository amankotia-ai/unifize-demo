import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "@/components/ui/separator";

const meta = {
  title: "Atoms/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div>
      <p className="mb-3 text-sm font-medium text-slate-500">Horizontal</p>
      <Separator />
    </div>
  ),
};

export const Dashed: Story = {
  render: () => (
    <div>
      <p className="mb-3 text-sm font-medium text-slate-500">Dashed</p>
      <Separator className="bg-transparent border-b border-dashed border-border" />
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-8 items-center gap-4">
      <p className="text-sm text-slate-600">Item A</p>
      <Separator orientation="vertical" />
      <p className="text-sm text-slate-600">Item B</p>
      <Separator orientation="vertical" />
      <p className="text-sm text-slate-600">Item C</p>
    </div>
  ),
};
