import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "@/components/ui/input";

const meta = {
  title: "Atoms/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url", "search"],
    },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
  args: {
    placeholder: "Enter text...",
    type: "text",
    disabled: false,
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <div className="grid max-w-md gap-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-900">
          Default
        </label>
        <Input placeholder="Enter your email..." />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-900">
          With value
        </label>
        <Input defaultValue="jane@example.com" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-500">
          Disabled
        </label>
        <Input disabled placeholder="Cannot edit..." />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-900">
          File input
        </label>
        <Input type="file" />
      </div>
    </div>
  ),
};
