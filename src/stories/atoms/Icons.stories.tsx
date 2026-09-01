import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import {
  // Products
  FileText,
  ShieldCheck,
  Atom,
  Factory,
  Wrench,

  // Industries
  Stethoscope,
  AirplaneTilt,
  GearSix,
  Pill,
  ForkKnife,
  Sparkle,
  Microscope,
  Flask,
  Car,

  // Configuration
  TreeStructure,
  SquaresFour,
  ChartBar,
  ListChecks,
  QrCode,
  GitBranch,
  ClipboardText,

  // Collaboration
  ChatCircle,
  Handshake,
  PenNib,
  EnvelopeSimple,
  DeviceMobileCamera,
  ClockCounterClockwise,
  Users,

  // Automation
  GitMerge,
  SealCheck,
  BellRinging,
  ArrowsLeftRight,
  Hash,
  Bell,

  // Integration
  Code,
  Key,
  CloudArrowUp,
  Envelope,
  PlugsConnected,

  // Analytics & Reports
  PresentationChart,
  Timer,
  Gauge,
  ChartLine,
  Kanban,

  // Security
  LockKey,
  Certificate,
  HardDrives,
  ListMagnifyingGlass,
  Lock,
} from "@phosphor-icons/react";

const meta = {
  title: "Atoms/Icons",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

type IconEntry = { Icon: PhosphorIcon; label: string; name: string };
type IconCategory = { label: string; icons: IconEntry[] };

const categories: IconCategory[] = [
  {
    label: "Products",
    icons: [
      { Icon: FileText, label: "Document Management", name: "FileText" },
      { Icon: ShieldCheck, label: "Quality Management", name: "ShieldCheck" },
      { Icon: Atom, label: "Product Lifecycle", name: "Atom" },
      { Icon: Factory, label: "Manufacturing Execution", name: "Factory" },
      { Icon: Wrench, label: "Maintenance (CMMS)", name: "Wrench" },
    ],
  },
  {
    label: "Industries",
    icons: [
      { Icon: Stethoscope, label: "Medical Devices", name: "Stethoscope" },
      { Icon: AirplaneTilt, label: "Aerospace & Defence", name: "AirplaneTilt" },
      { Icon: GearSix, label: "Manufacturing", name: "GearSix" },
      { Icon: Pill, label: "Nutritional Supplements", name: "Pill" },
      { Icon: ForkKnife, label: "Food Production", name: "ForkKnife" },
      { Icon: Sparkle, label: "Cosmetics", name: "Sparkle" },
      { Icon: Microscope, label: "Contract Research", name: "Microscope" },
      { Icon: Flask, label: "Laboratories", name: "Flask" },
      { Icon: Car, label: "Automotives", name: "Car" },
    ],
  },
  {
    label: "Configuration",
    icons: [
      { Icon: TreeStructure, label: "No-Code Process Builder", name: "TreeStructure" },
      { Icon: SquaresFour, label: "Role-Based Home Screens", name: "SquaresFour" },
      { Icon: ChartBar, label: "Dashboards & Reports", name: "ChartBar" },
      { Icon: ListChecks, label: "Checklists & Forms", name: "ListChecks" },
      { Icon: QrCode, label: "PDFs with QR Codes", name: "QrCode" },
      { Icon: GitBranch, label: "Conditional Logic", name: "GitBranch" },
      { Icon: ClipboardText, label: "Specifications", name: "ClipboardText" },
    ],
  },
  {
    label: "Collaboration",
    icons: [
      { Icon: ChatCircle, label: "Chat-Driven Records", name: "ChatCircle" },
      { Icon: Handshake, label: "Vendor / Customer Portal", name: "Handshake" },
      { Icon: PenNib, label: "eSignatures (CFR Part 11)", name: "PenNib" },
      { Icon: EnvelopeSimple, label: "Email To / From Records", name: "EnvelopeSimple" },
      { Icon: DeviceMobileCamera, label: "Mobile & Tablet", name: "DeviceMobileCamera" },
      { Icon: ClockCounterClockwise, label: "Real-Time Audit Trail", name: "ClockCounterClockwise" },
      { Icon: Users, label: "Dynamic Teams", name: "Users" },
    ],
  },
  {
    label: "Automation",
    icons: [
      { Icon: GitMerge, label: "Version Control", name: "GitMerge" },
      { Icon: SealCheck, label: "Approval Workflows", name: "SealCheck" },
      { Icon: BellRinging, label: "Reminder & Escalation", name: "BellRinging" },
      { Icon: ArrowsLeftRight, label: "Record & Doc Routing", name: "ArrowsLeftRight" },
      { Icon: Hash, label: "Custom Auto-Numbering", name: "Hash" },
      { Icon: Bell, label: "Notifications", name: "Bell" },
    ],
  },
  {
    label: "Integration",
    icons: [
      { Icon: Code, label: "Unifize API", name: "Code" },
      { Icon: Key, label: "SSO / SAML Auth", name: "Key" },
      { Icon: CloudArrowUp, label: "SharePoint / OneDrive", name: "CloudArrowUp" },
      { Icon: Envelope, label: "Email Integration", name: "Envelope" },
      { Icon: PlugsConnected, label: "Slack Integration", name: "PlugsConnected" },
    ],
  },
  {
    label: "Analytics & Reports",
    icons: [
      { Icon: PresentationChart, label: "Reports & Dashboards", name: "PresentationChart" },
      { Icon: Timer, label: "Cycle Time Tracking", name: "Timer" },
      { Icon: Gauge, label: "Real-Time Metrics & KPIs", name: "Gauge" },
      { Icon: ChartLine, label: "Custom Reporting", name: "ChartLine" },
      { Icon: Kanban, label: "Role-Based Dashboards", name: "Kanban" },
    ],
  },
  {
    label: "Enterprise-Grade Security",
    icons: [
      { Icon: LockKey, label: "Role-Based Access Control", name: "LockKey" },
      { Icon: Certificate, label: "CFR Part 11 eSignatures", name: "Certificate" },
      { Icon: HardDrives, label: "SOC-2 Data Storage", name: "HardDrives" },
      { Icon: ListMagnifyingGlass, label: "Audit Trails", name: "ListMagnifyingGlass" },
      { Icon: Lock, label: "Enterprise Encryption", name: "Lock" },
    ],
  },
];

export const IconGrid: Story = {
  name: "Icon Grid",
  render: () => (
    <div className="flex flex-col gap-8">
      {categories.map((category) => (
        <div key={category.label}>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {category.label}
          </h3>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {category.icons.map(({ Icon, label, name }) => (
              <div
                key={name}
                className="flex flex-col items-center gap-2 rounded-lg border border-transparent p-3 transition-colors hover:border-slate-100 hover:bg-slate-50"
              >
                <Icon size={28} weight={category.label === "Products" ? "fill" : "duotone"} className="text-[#0052FF]" />
                <span className="text-center text-[9px] leading-tight text-slate-500">
                  {label}
                </span>
                <span className="font-mono text-[8px] text-slate-300">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
