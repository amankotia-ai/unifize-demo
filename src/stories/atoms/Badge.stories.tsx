import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Check,
  WarningCircle,
  Info,
  Star,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";

const meta = {
  title: "Atoms/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline", "ghost", "link"],
    },
  },
  args: {
    children: "Badge",
    variant: "default",
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="link">Link</Badge>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge>
        <Check weight="duotone" /> Approved
      </Badge>
      <Badge variant="destructive">
        <WarningCircle weight="duotone" /> Error
      </Badge>
      <Badge variant="outline">
        <Info weight="duotone" /> Info
      </Badge>
      <Badge variant="secondary">
        <Star weight="duotone" /> Featured
      </Badge>
    </div>
  ),
};
