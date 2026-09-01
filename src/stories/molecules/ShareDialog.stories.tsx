import type { Meta, StoryObj } from "@storybook/react-vite";
import { ShareDialog } from "@/components/molecules/ShareDialog";

const meta = {
  title: "Molecules/ShareDialog",
  component: ShareDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    url: { control: "text" },
    isPublic: { control: "boolean" },
  },
  args: {
    url: "https://orevbajohn.me",
  },
} satisfies Meta<typeof ShareDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PublicEnabled: Story = {
  name: "Public Access On",
  args: {
    isPublic: true,
  },
};

export const PublicDisabled: Story = {
  name: "Public Access Off",
  args: {
    isPublic: false,
  },
};

export const LongUrl: Story = {
  name: "Long URL",
  args: {
    url: "https://app.example.com/workspace/projects/design-system/share/abcdef123456",
  },
};
