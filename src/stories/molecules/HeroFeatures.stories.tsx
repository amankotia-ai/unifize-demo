import type { Meta, StoryObj } from "@storybook/react-vite";
import { HeroFeatures } from "@/components/molecules/HeroFeatures";

const meta = {
  title: "Molecules/HeroFeatures",
  component: HeroFeatures,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    tagline: { control: "text" },
    heading: { control: "text" },
  },
} satisfies Meta<typeof HeroFeatures>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomContent: Story = {
  name: "Custom Content",
  args: {
    tagline: "Why Unifize",
    heading: "Everything you need to\nstreamline quality",
  },
};
