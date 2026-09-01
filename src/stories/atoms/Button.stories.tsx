import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Envelope,
  DownloadSimple,
  GearSix,
  Trash,
  PencilSimple,
  Copy,
  MagnifyingGlass,
  Eye,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

const meta = {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
    },
    disabled: { control: "boolean" },
  },
  args: {
    children: "Button",
    variant: "default",
    size: "default",
    disabled: false,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-3">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>
        <Envelope weight="duotone" /> Send Email
      </Button>
      <Button variant="outline">
        <DownloadSimple weight="duotone" /> Download
      </Button>
      <Button variant="secondary">
        <GearSix weight="duotone" /> Settings
      </Button>
      <Button variant="destructive">
        <Trash weight="duotone" /> Delete
      </Button>
    </div>
  ),
};

export const IconOnly: Story = {
  name: "Icon Only",
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="icon-xs" variant="ghost">
        <PencilSimple weight="duotone" />
      </Button>
      <Button size="icon-sm" variant="ghost">
        <Copy weight="duotone" />
      </Button>
      <Button size="icon" variant="outline">
        <MagnifyingGlass weight="duotone" />
      </Button>
      <Button size="icon-lg" variant="secondary">
        <Eye weight="duotone" />
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button disabled>Disabled</Button>
      <Button variant="outline" disabled>
        Disabled Outline
      </Button>
    </div>
  ),
};
