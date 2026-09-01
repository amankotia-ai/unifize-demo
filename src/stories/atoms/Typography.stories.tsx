import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Atoms/Typography",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const headings = [
  {
    tag: "h1",
    label: "Heading 1",
    var: "--font-heading-1",
    style: {
      fontFamily: "graphik, arial, helvetica, sans-serif",
      fontSize: "51.2px",
      fontWeight: 400,
      lineHeight: "56.32px",
      letterSpacing: "-1.024px",
      color: "#0052FF",
    },
  },
  {
    tag: "h2",
    label: "Heading 2",
    var: "--font-heading-2",
    style: {
      fontFamily: "graphik, arial, helvetica, sans-serif",
      fontSize: "48px",
      fontWeight: 400,
      lineHeight: "56px",
      letterSpacing: "-0.96px",
      color: "#0052FF",
    },
  },
  {
    tag: "h3",
    label: "Heading 3",
    var: "--font-heading-3",
    style: {
      fontFamily: "graphik, arial, helvetica, sans-serif",
      fontSize: "34px",
      fontWeight: 400,
      lineHeight: "38px",
      letterSpacing: "-0.68px",
      color: "#0052FF",
    },
  },
  {
    tag: "h4",
    label: "Heading 4",
    var: "--font-heading-4",
    style: {
      fontFamily: "graphik, arial, helvetica, sans-serif",
      fontSize: "24px",
      fontWeight: 400,
      lineHeight: "28px",
      letterSpacing: "-0.48px",
      color: "#0052FF",
    },
  },
  {
    tag: "h5",
    label: "Heading 5",
    var: "--font-heading-5",
    style: {
      fontFamily: "graphik, arial, helvetica, sans-serif",
      fontSize: "24px",
      fontWeight: 400,
      lineHeight: "28px",
      letterSpacing: "-0.48px",
      color: "#0052FF",
    },
  },
  {
    tag: "h6",
    label: "Heading 6",
    var: "--font-heading-6",
    style: {
      fontFamily: "graphik, arial, helvetica, sans-serif",
      fontSize: "18px",
      fontWeight: 400,
      lineHeight: "28px",
      letterSpacing: "-0.36px",
      color: "#0052FF",
    },
  },
];

const bodyStyles = [
  {
    label: "Body",
    var: "--font-body",
    style: {
      fontFamily: "graphik, arial, helvetica, sans-serif",
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: "18.4px",
      color: "#0052FF",
    },
  },
  {
    label: "Body Text",
    var: "--font-body-text",
    style: {
      fontFamily: "graphik, arial, helvetica, sans-serif",
      fontSize: "18px",
      fontWeight: 500,
      lineHeight: "22px",
      letterSpacing: "-0.36px",
      color: "#0052FF",
    },
  },
  {
    label: "Inline Text",
    var: "--font-inline-text",
    style: {
      fontFamily: "graphik, arial, helvetica, sans-serif",
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: "21px",
      letterSpacing: "-0.32px",
      color: "#0052FF",
    },
  },
];

const uiStyles = [
  {
    label: "Link",
    var: "--font-link",
    style: {
      fontFamily: "GT America, monospace",
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "20px",
      letterSpacing: "-0.28px",
      color: "#0052FF",
    },
  },
  {
    label: "Button",
    var: "--font-button",
    style: {
      fontFamily: "GT America, monospace",
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "20px",
      letterSpacing: "-0.28px",
      color: "#0052FF",
    },
  },
  {
    label: "Button Role",
    var: "--font-button-role",
    style: {
      fontFamily: "graphik, arial, helvetica, sans-serif",
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "16.1px",
      color: "#0052FF",
    },
  },
  {
    label: "Navigation",
    var: "--font-navigation",
    style: {
      fontFamily: "graphik, arial, helvetica, sans-serif",
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: "18.4px",
      color: "#0052FF",
    },
  },
];

function StyleMeta({ style }: { style: React.CSSProperties }) {
  return (
    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 font-mono text-[10px] text-slate-400">
      <span>{style.fontSize}</span>
      <span>/ {style.lineHeight}</span>
      <span>wt {style.fontWeight}</span>
      {style.letterSpacing && <span>ls {style.letterSpacing}</span>}
      <span className="text-slate-300">
        {(style.fontFamily as string)?.split(",")[0]}
      </span>
    </div>
  );
}

export const Headings: Story = {
  render: () => (
    <div className="space-y-6 rounded-lg bg-white p-6">
      {headings.map((h) => (
        <div key={h.tag} className="border-b border-slate-100 pb-4">
          <p className="mb-1 font-mono text-[10px] text-slate-400">
            {h.tag} &middot; {h.var}-*
          </p>
          <div style={h.style}>{h.label}</div>
          <StyleMeta style={h.style} />
        </div>
      ))}
    </div>
  ),
};

export const Body: Story = {
  name: "Body & Inline",
  render: () => (
    <div className="space-y-6 rounded-lg bg-white p-6">
      {bodyStyles.map((b) => (
        <div key={b.label} className="border-b border-slate-100 pb-4">
          <p className="mb-1 font-mono text-[10px] text-slate-400">
            {b.var}-*
          </p>
          <p style={b.style}>
            {b.label} — Streamline your processes, enhance collaboration, and
            accelerate decision-making across your organization.
          </p>
          <StyleMeta style={b.style} />
        </div>
      ))}
    </div>
  ),
};

export const UI: Story = {
  name: "Links, Buttons & Navigation",
  render: () => (
    <div className="space-y-6 rounded-lg bg-white p-6">
      {uiStyles.map((u) => (
        <div key={u.label} className="border-b border-slate-100 pb-4">
          <p className="mb-1 font-mono text-[10px] text-slate-400">
            {u.var}-*
          </p>
          <span style={u.style}>{u.label} — Click here to learn more</span>
          <StyleMeta style={u.style} />
        </div>
      ))}
    </div>
  ),
};
