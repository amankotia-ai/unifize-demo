import type { Meta, StoryObj } from "@storybook/react-vite";
import { Logo } from "@/components/ui/logo";

const meta = {
  title: "Atoms/Logo",
  component: Logo,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["wordmark", "icon"],
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg", "xl"],
    },
  },
  args: {
    variant: "wordmark",
    size: "default",
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Wordmark: Story = {};

export const Icon: Story = {
  args: { variant: "icon" },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <Logo size="sm" />
      <Logo size="default" />
      <Logo size="lg" />
      <Logo size="xl" />
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div className="flex items-center justify-between rounded-lg border border-border bg-background px-6 py-3">
      <Logo />
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <span>Product</span>
        <span>Solutions</span>
        <span>Pricing</span>
      </div>
    </div>
  ),
};
