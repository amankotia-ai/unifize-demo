import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Zap,
  Star,
  Heart,
  Bell,
  Search,
  Settings,
  Mail,
  ChevronRight,
  Check,
  AlertCircle,
  Info,
  ExternalLink,
  Download,
  Upload,
  Trash2,
  Edit3,
  Copy,
  Eye,
  Sparkles,
  Boxes,
  LayoutGrid,
  Quote,
  Type,
  Palette,
  MousePointerClick,
  Tag,
  TextCursorInput,
  Minus,
  Grid3X3,
  PanelsTopLeft,
  ChevronsUpDown,
  Columns3,
  PanelRight,
  Layers,
  RectangleHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

/* ──────────────────────────────────────────────
   Section nav items
   ────────────────────────────────────────────── */
const sections = [
  { id: "typography", label: "Typography", icon: Type, level: "atom" as const },
  { id: "colors", label: "Colors", icon: Palette, level: "atom" as const },
  {
    id: "buttons",
    label: "Buttons",
    icon: MousePointerClick,
    level: "atom" as const,
  },
  { id: "badges", label: "Badges", icon: Tag, level: "atom" as const },
  {
    id: "inputs",
    label: "Inputs",
    icon: TextCursorInput,
    level: "atom" as const,
  },
  { id: "separators", label: "Separators", icon: Minus, level: "atom" as const },
  { id: "icons", label: "Icons", icon: Grid3X3, level: "atom" as const },
  { id: "cards", label: "Cards", icon: PanelsTopLeft, level: "molecule" as const },
  {
    id: "accordion",
    label: "Accordion",
    icon: ChevronsUpDown,
    level: "molecule" as const,
  },
  { id: "tabs", label: "Tabs", icon: Columns3, level: "molecule" as const },
  {
    id: "dialog",
    label: "Dialog",
    icon: PanelsTopLeft,
    level: "molecule" as const,
  },
  { id: "sheet", label: "Sheet", icon: PanelRight, level: "molecule" as const },
  {
    id: "section-pill",
    label: "Section Pill",
    icon: Layers,
    level: "molecule" as const,
  },
  {
    id: "section-frame",
    label: "Section Frame",
    icon: RectangleHorizontal,
    level: "organism" as const,
  },
];

/* ──────────────────────────────────────────────
   Section heading — mirrors the homepage pill + heading + desc pattern
   ────────────────────────────────────────────── */
function SectionBlock({
  id,
  pillIcon: PillIcon,
  pillLabel,
  title,
  description,
  children,
}: {
  id: string;
  pillIcon: React.ElementType;
  pillLabel: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="text-center">
        <div className="section-pill mb-5 justify-center sm:mb-6">
          <span className="section-pill-marker">
            <PillIcon className="section-pill-icon" />
          </span>
          <span className="section-pill-label">{pillLabel}</span>
        </div>
        <h2 className="mx-auto text-[28px] font-semibold leading-[1.22] tracking-[-0.015em] text-black sm:text-[34px] lg:text-[36px] lg:leading-[1.2]">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-[560px] text-[14px] font-normal leading-[1.65] text-black sm:text-[15px] lg:text-[17px] lg:leading-[1.72]">
          {description}
        </p>
      </div>
      <div className="mt-8 sm:mt-10">{children}</div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Showcase card — mirrors the homepage rounded-[24px] card style
   ────────────────────────────────────────────── */
function Showcase({
  label,
  children,
  className = "",
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="mb-6 last:mb-0">
      {label && (
        <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.06em] text-slate-400">
          {label}
        </p>
      )}
      <div
        className={`rounded-[20px] border border-[#EEF3FF] bg-white p-5 pt-7 sm:p-6 lg:p-7 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Page
   ────────────────────────────────────────────── */
export default function DesignLibrary() {
  const [activeSection, setActiveSection] = useState("typography");

  return (
    <div className="benchling-theme min-h-screen bg-[#F9FBFF]">
      {/* ── Navbar ─────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50 mx-auto max-w-7xl px-4 pt-4">
        <div className="flex h-16 items-center justify-between rounded-[22px] border border-[#EEF3FF] bg-white px-4 lg:px-5">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <img src="/Unifize Logo.svg" alt="Unifize" className="h-6" />
            </Link>
            <span className="h-5 w-px bg-[#EEF3FF]" />
            <span className="text-[13px] font-medium text-slate-600">
              Design Library
            </span>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-[#EEF3FF] bg-white px-4 py-2 text-[13px] font-medium text-slate-600 transition-colors hover:bg-[#F6F9FF] hover:text-black"
          >
            <ArrowLeft className="size-3.5" />
            Back to site
          </Link>
        </div>
      </header>

      {/* ── Layout ─────────────────────────────── */}
      <div className="mx-auto flex max-w-7xl pt-28">
        {/* Sidebar */}
        <aside className="sticky top-28 hidden h-[calc(100vh-8rem)] w-[220px] shrink-0 overflow-y-auto pr-6 lg:block">
          <nav className="space-y-0.5">
            {sections.map((s) => {
              const Icon = s.icon;
              const isActive = activeSection === s.id;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors ${
                    isActive
                      ? "bg-[#0052FF]/[0.06] text-[#0052FF]"
                      : "text-slate-500 hover:bg-[#F6F9FF] hover:text-slate-900"
                  }`}
                >
                  <Icon
                    className={`size-3.5 ${isActive ? "text-[#0052FF]" : "text-slate-400"}`}
                    strokeWidth={2.2}
                  />
                  {s.label}
                </a>
              );
            })}
          </nav>

          {/* Level legend */}
          <div className="mt-8 rounded-[16px] border border-[#EEF3FF] bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
              Levels
            </p>
            <div className="mt-3 space-y-2.5">
              {[
                { label: "Atom", color: "bg-[#0052FF]" },
                { label: "Molecule", color: "bg-[#8667A8]" },
                { label: "Organism", color: "bg-[#EA7432]" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-2.5">
                  <span
                    className={`size-2 rounded-full ${l.color}`}
                  />
                  <span className="text-[12px] font-medium text-slate-600">
                    {l.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Main content ────────────────────── */}
        <main className="flex-1 min-w-0 pb-24 lg:pl-4">

            {/* ═══ TYPOGRAPHY ═══ */}
            <div className="border-b border-[#EEF3FF] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
                <SectionBlock
                  id="typography"
                  pillIcon={Type}
                  pillLabel="Typography"
                  title="Type System"
                  description="The typographic scale used across the site — headings, body text, and supporting styles."
                >
                  <Showcase label="Headings">
                    <div className="space-y-5">
                      <h1 className="text-[31px] font-semibold leading-[1.22] tracking-[-0.015em] text-black sm:text-[40px] lg:text-[36px] lg:leading-[1.2]">
                        Heading 1 — Hero title
                      </h1>
                      <h2 className="text-[28px] font-semibold leading-[1.22] tracking-[-0.015em] text-black sm:text-[34px] lg:text-[36px] lg:leading-[1.2]">
                        Heading 2 — Section title
                      </h2>
                      <h3 className="text-[24px] font-semibold leading-[1.24] tracking-[-0.015em] text-black sm:text-[26px] lg:text-[28px]">
                        Heading 3 — Card title
                      </h3>
                      <h4 className="text-[18px] font-semibold leading-[1.24] text-black sm:text-[19px] lg:text-[20px]">
                        Heading 4 — Product title
                      </h4>
                      <h5 className="text-[15px] font-semibold leading-tight tracking-[-0.015em] text-slate-900 sm:text-base">
                        Heading 5 — Feature title
                      </h5>
                    </div>
                  </Showcase>

                  <Showcase label="Body & supporting text">
                    <div className="max-w-[560px] space-y-4">
                      <p className="text-[14px] font-normal leading-[1.65] text-black sm:text-[15px] lg:text-[17px] lg:leading-[1.72]">
                        Body large — Used for section descriptions. Unify your
                        processes, enhance collaboration, and accelerate
                        decision-making with Unifize.
                      </p>
                      <p className="text-[13px] leading-[1.55] text-slate-600 sm:text-[14px]">
                        Body — Used for card descriptions and feature text.
                        Simplify document control, training, and ensure
                        regulatory compliance.
                      </p>
                      <p className="text-[13px] font-medium leading-tight text-slate-600 sm:text-sm">
                        Label — Used for tab triggers and navigation.
                      </p>
                      <p className="text-[12px] leading-snug text-slate-600">
                        Small — Used for product grid descriptions and
                        metadata.
                      </p>
                    </div>
                  </Showcase>

                  <Showcase label="Accent & link text">
                    <div className="space-y-3">
                      <p className="text-[28px] font-semibold leading-[1.22] tracking-[-0.015em]">
                        <span className="text-[#0052FF]">
                          Accelerate Innovation
                        </span>
                      </p>
                      <p className="text-[14px] font-medium leading-none text-[#EA7432] sm:text-[15px]">
                        Explore DMS →
                      </p>
                      <p className="text-[14px] font-medium leading-none text-[#8667A8] sm:text-[15px]">
                        Explore PLM →
                      </p>
                      <p className="text-[14px] font-medium leading-none text-[#4EA867] sm:text-[15px]">
                        Explore MES →
                      </p>
                    </div>
                  </Showcase>
                </SectionBlock>
            </div>

            {/* ═══ COLORS ═══ */}
            <div className="border-b border-[#EEF3FF] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#F6F9FF]">
                <SectionBlock
                  id="colors"
                  pillIcon={Palette}
                  pillLabel="Colors"
                  title="Color Palette"
                  description="Brand colors, product accent colors, and neutral tones used across the interface."
                >
                  <Showcase label="Brand">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                      {[
                        { name: "Unifize Blue", hex: "#0052FF", text: "white" },
                        { name: "Page BG", hex: "#F9FBFF", text: "#1a1a2e" },
                        { name: "Section BG", hex: "#F6F9FF", text: "#1a1a2e" },
                        { name: "Card BG", hex: "#FFFFFF", text: "#1a1a2e" },
                        { name: "Border", hex: "#EEF3FF", text: "#1a1a2e" },
                        { name: "Dark Text", hex: "#000000", text: "white" },
                        { name: "Body Text", hex: "#475569", text: "white" },
                        { name: "Muted Text", hex: "#94A3B8", text: "#1a1a2e" },
                      ].map((c) => (
                        <div key={c.name} className="space-y-2">
                          <div
                            className="flex h-20 items-end rounded-2xl border border-[#EEF3FF] p-3"
                            style={{
                              backgroundColor: c.hex,
                              color: c.text,
                            }}
                          >
                            <span className="text-[11px] font-semibold">
                              {c.name}
                            </span>
                          </div>
                          <p className="pl-1 font-mono text-[11px] text-slate-400">
                            {c.hex}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Showcase>

                  <Showcase label="Product accents">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {[
                        {
                          name: "DMS — Orange",
                          hex: "#EA7432",
                          bg: "#FFF1E6",
                          text: "#A8540B",
                        },
                        {
                          name: "QMS — Gold",
                          hex: "#D3A126",
                          bg: "#FFF7D6",
                          text: "#8A7000",
                        },
                        {
                          name: "PLM — Purple",
                          hex: "#8667A8",
                          bg: "#F1EAF8",
                          text: "#6A4E8D",
                        },
                        {
                          name: "MES — Green",
                          hex: "#4EA867",
                          bg: "#ECF9E8",
                          text: "#237E16",
                        },
                      ].map((c) => (
                        <div key={c.name} className="space-y-2">
                          <div
                            className="flex h-20 flex-col justify-between rounded-2xl border border-[#EEF3FF] p-3"
                            style={{ backgroundColor: c.bg }}
                          >
                            <div
                              className="size-6 rounded-lg"
                              style={{ backgroundColor: c.hex }}
                            />
                            <span
                              className="text-[11px] font-semibold"
                              style={{ color: c.text }}
                            >
                              {c.name}
                            </span>
                          </div>
                          <p className="pl-1 font-mono text-[11px] text-slate-400">
                            {c.hex}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Showcase>

                  <Showcase label="Design tokens (CSS variables)">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                      {[
                        { name: "primary", tw: "bg-primary text-primary-foreground" },
                        { name: "secondary", tw: "bg-secondary text-secondary-foreground" },
                        { name: "destructive", tw: "bg-destructive text-white" },
                        { name: "muted", tw: "bg-muted text-muted-foreground" },
                        { name: "accent", tw: "bg-accent text-accent-foreground" },
                      ].map((t) => (
                        <div key={t.name} className="space-y-2">
                          <div
                            className={`flex h-14 items-center justify-center rounded-xl border border-[#EEF3FF] text-[11px] font-medium ${t.tw}`}
                          >
                            {t.name}
                          </div>
                          <p className="text-center font-mono text-[10px] text-slate-400">
                            --{t.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Showcase>
                </SectionBlock>
            </div>

            {/* ═══ BUTTONS ═══ */}
            <div className="border-b border-[#EEF3FF] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
                <SectionBlock
                  id="buttons"
                  pillIcon={MousePointerClick}
                  pillLabel="Buttons"
                  title="Buttons"
                  description="Interactive button styles with multiple variants, sizes, and icon support."
                >
                  <Showcase label="Variants">
                    <div className="flex flex-wrap items-center gap-3">
                      <Button variant="default">Default</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="destructive">Destructive</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="link">Link</Button>
                    </div>
                  </Showcase>

                  <Showcase label="Brand CTA style (from homepage)">
                    <div className="flex flex-wrap items-center gap-3">
                      <button className="h-[38px] rounded-lg border border-[#0052FF] bg-[#0052FF] px-[18px] text-[13px] font-medium text-white transition-colors hover:bg-[#0047E0]">
                        Book a Demo
                      </button>
                      <button className="h-[38px] rounded-lg border border-[#EEF3FF] bg-white px-[18px] text-[13px] font-medium text-slate-600 transition-colors hover:bg-[#F6F9FF]">
                        Sign In
                      </button>
                      <button className="h-10 rounded-[8px] border border-[#0052FF] bg-[#0052FF] px-[18px] text-[14px] font-medium leading-[18px] text-white">
                        Book a Demo
                      </button>
                    </div>
                  </Showcase>

                  <Showcase label="Sizes">
                    <div className="flex flex-wrap items-end gap-3">
                      <Button size="xs">Extra Small</Button>
                      <Button size="sm">Small</Button>
                      <Button size="default">Default</Button>
                      <Button size="lg">Large</Button>
                    </div>
                  </Showcase>

                  <Showcase label="With icons">
                    <div className="flex flex-wrap items-center gap-3">
                      <Button>
                        <Mail /> Send Email
                      </Button>
                      <Button variant="outline">
                        <Download /> Download
                      </Button>
                      <Button variant="secondary">
                        <Settings /> Settings
                      </Button>
                      <Button variant="destructive">
                        <Trash2 /> Delete
                      </Button>
                    </div>
                  </Showcase>

                  <Showcase label="Icon-only buttons">
                    <div className="flex flex-wrap items-center gap-3">
                      <Button size="icon-xs" variant="ghost">
                        <Edit3 />
                      </Button>
                      <Button size="icon-sm" variant="ghost">
                        <Copy />
                      </Button>
                      <Button size="icon" variant="outline">
                        <Search />
                      </Button>
                      <Button size="icon-lg" variant="secondary">
                        <Eye />
                      </Button>
                    </div>
                  </Showcase>

                  <Showcase label="Disabled state">
                    <div className="flex flex-wrap items-center gap-3">
                      <Button disabled>Disabled</Button>
                      <Button variant="outline" disabled>
                        Disabled Outline
                      </Button>
                    </div>
                  </Showcase>
                </SectionBlock>
            </div>

            {/* ═══ BADGES ═══ */}
            <div className="border-b border-[#EEF3FF] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#F6F9FF]">
                <SectionBlock
                  id="badges"
                  pillIcon={Tag}
                  pillLabel="Badges"
                  title="Badges"
                  description="Small status indicators and labels used for categorization and emphasis."
                >
                  <Showcase label="Variants">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="default">Default</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="destructive">Destructive</Badge>
                      <Badge variant="outline">Outline</Badge>
                      <Badge variant="ghost">Ghost</Badge>
                      <Badge variant="link">Link</Badge>
                    </div>
                  </Showcase>

                  <Showcase label="With icons">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge>
                        <Check /> Approved
                      </Badge>
                      <Badge variant="destructive">
                        <AlertCircle /> Error
                      </Badge>
                      <Badge variant="outline">
                        <Info /> Info
                      </Badge>
                      <Badge variant="secondary">
                        <Star /> Featured
                      </Badge>
                    </div>
                  </Showcase>

                  <Showcase label="Product status pills (from homepage)">
                    <div className="flex flex-wrap items-center gap-3">
                      {[
                        {
                          label: "In Progress",
                          bg: "bg-[#FFF1E6]",
                          text: "text-[#A8540B]",
                          border: "border-[#FFE4CF]",
                        },
                        {
                          label: "ISO 9001",
                          bg: "bg-[#FFF7D6]",
                          text: "text-[#8A7000]",
                          border: "border-[#FFEDB8]",
                        },
                        {
                          label: "Draft Revision",
                          bg: "bg-[#F1EAF8]",
                          text: "text-[#6A4E8D]",
                          border: "border-[#E6DAF3]",
                        },
                        {
                          label: "Ready for Shipping",
                          bg: "bg-[#ECF9E8]",
                          text: "text-[#237E16]",
                          border: "border-[#DDF2D6]",
                        },
                      ].map((pill) => (
                        <span
                          key={pill.label}
                          className={`rounded-full border border-dashed px-2 py-0.5 text-[10px] font-medium ${pill.bg} ${pill.text} ${pill.border}`}
                        >
                          {pill.label}
                        </span>
                      ))}
                    </div>
                  </Showcase>
                </SectionBlock>
            </div>

            {/* ═══ INPUTS ═══ */}
            <div className="border-b border-[#EEF3FF] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
                <SectionBlock
                  id="inputs"
                  pillIcon={TextCursorInput}
                  pillLabel="Inputs"
                  title="Inputs"
                  description="Form input fields for capturing user data."
                >
                  <Showcase label="States">
                    <div className="grid gap-5 max-w-md">
                      <div>
                        <label className="mb-1.5 block text-[13px] font-medium text-slate-900 sm:text-sm">
                          Default
                        </label>
                        <Input placeholder="Enter your email..." />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[13px] font-medium text-slate-900 sm:text-sm">
                          With value
                        </label>
                        <Input defaultValue="john@unifize.com" />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[13px] font-medium text-slate-500 sm:text-sm">
                          Disabled
                        </label>
                        <Input disabled placeholder="Cannot edit..." />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[13px] font-medium text-slate-900 sm:text-sm">
                          File input
                        </label>
                        <Input type="file" />
                      </div>
                    </div>
                  </Showcase>

                  <Showcase label="Hero email form (from homepage)">
                    <div className="mx-auto max-w-md">
                      <div className="flex items-center gap-2 rounded-[22px] border border-[#EEF3FF] bg-white p-[12px] pl-[14px] sm:p-[14px] sm:pl-[16px]">
                        <input
                          type="email"
                          placeholder="Email Address"
                          className="min-w-0 flex-1 bg-transparent text-[14px] text-black placeholder:text-[#646464] outline-none"
                        />
                        <button className="h-10 shrink-0 rounded-[8px] border border-[#0052FF] bg-[#0052FF] px-[14px] text-[13px] font-medium text-white sm:px-[18px] sm:text-[14px]">
                          Book a Demo
                        </button>
                      </div>
                    </div>
                  </Showcase>
                </SectionBlock>
            </div>

            {/* ═══ SEPARATORS ═══ */}
            <div className="border-b border-[#EEF3FF] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#F6F9FF]">
                <SectionBlock
                  id="separators"
                  pillIcon={Minus}
                  pillLabel="Separators"
                  title="Separators"
                  description="Horizontal and vertical dividers for visual separation."
                >
                  <Showcase>
                    <div className="space-y-8">
                      <div>
                        <p className="mb-3 text-[13px] font-medium text-slate-500">
                          Horizontal
                        </p>
                        <Separator />
                      </div>
                      <div>
                        <p className="mb-3 text-[13px] font-medium text-slate-500">
                          Dashed (from feature lists)
                        </p>
                        <div className="border-b border-dashed border-[#E6DAF3]" />
                      </div>
                      <div className="flex items-center gap-4 h-8">
                        <p className="text-[13px] font-medium text-slate-500">
                          Vertical
                        </p>
                        <Separator orientation="vertical" />
                        <p className="text-sm text-slate-600">Item A</p>
                        <Separator orientation="vertical" />
                        <p className="text-sm text-slate-600">Item B</p>
                        <Separator orientation="vertical" />
                        <p className="text-sm text-slate-600">Item C</p>
                      </div>
                    </div>
                  </Showcase>
                </SectionBlock>
            </div>

            {/* ═══ ICONS ═══ */}
            <div className="border-b border-[#EEF3FF] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
                <SectionBlock
                  id="icons"
                  pillIcon={Grid3X3}
                  pillLabel="Icons"
                  title="Icons"
                  description="Lucide icons used throughout the interface with consistent sizing and stroke width."
                >
                  <Showcase>
                    <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                      {[
                        { Icon: Shield, name: "Shield" },
                        { Icon: Zap, name: "Zap" },
                        { Icon: Star, name: "Star" },
                        { Icon: Heart, name: "Heart" },
                        { Icon: Bell, name: "Bell" },
                        { Icon: Search, name: "Search" },
                        { Icon: Settings, name: "Settings" },
                        { Icon: Mail, name: "Mail" },
                        { Icon: ChevronRight, name: "ChevronRight" },
                        { Icon: Check, name: "Check" },
                        { Icon: AlertCircle, name: "AlertCircle" },
                        { Icon: Info, name: "Info" },
                        { Icon: ExternalLink, name: "ExternalLink" },
                        { Icon: Download, name: "Download" },
                        { Icon: Upload, name: "Upload" },
                        { Icon: Trash2, name: "Trash2" },
                        { Icon: Edit3, name: "Edit3" },
                        { Icon: Copy, name: "Copy" },
                        { Icon: Eye, name: "Eye" },
                        { Icon: Sparkles, name: "Sparkles" },
                        { Icon: Boxes, name: "Boxes" },
                        { Icon: LayoutGrid, name: "LayoutGrid" },
                        { Icon: Quote, name: "Quote" },
                        { Icon: ArrowLeft, name: "ArrowLeft" },
                      ].map(({ Icon, name }) => (
                        <div
                          key={name}
                          className="flex flex-col items-center gap-2 rounded-xl p-3 transition-colors hover:bg-[#F6F9FF]"
                        >
                          <div className="flex size-10 items-center justify-center rounded-xl bg-[#F6F9FF]">
                            <Icon
                              className="size-[15px] text-slate-600"
                              strokeWidth={2.2}
                            />
                          </div>
                          <span className="font-mono text-[9px] text-slate-400">
                            {name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Showcase>

                  <Showcase label="Product icon boxes (from homepage nav)">
                    <div className="flex flex-wrap gap-4">
                      {[
                        { color: "#EA7432", bg: "#FFF1E6", label: "DMS" },
                        { color: "#D3A126", bg: "#FFF7D6", label: "QMS" },
                        { color: "#8667A8", bg: "#F1EAF8", label: "PLM" },
                        { color: "#4EA867", bg: "#ECF9E8", label: "MES" },
                      ].map((p) => (
                        <div
                          key={p.label}
                          className="flex flex-col items-center gap-2"
                        >
                          <div
                            className="flex size-9 items-center justify-center rounded-lg border border-transparent"
                            style={{ backgroundColor: p.bg }}
                          >
                            <Boxes
                              className="size-[18px]"
                              style={{ color: p.color }}
                              strokeWidth={2.2}
                            />
                          </div>
                          <span className="text-[11px] font-medium text-slate-500">
                            {p.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Showcase>
                </SectionBlock>
            </div>

            {/* ═══ CARDS ═══ */}
            <div className="border-b border-[#EEF3FF] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#F6F9FF]">
                <SectionBlock
                  id="cards"
                  pillIcon={PanelsTopLeft}
                  pillLabel="Cards"
                  title="Cards"
                  description="Content containers with header, body, and footer compositions."
                >
                  <Showcase label="shadcn/ui Card">
                    <div className="grid gap-6 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>Card Title</CardTitle>
                          <CardDescription>
                            A brief description of this card's content.
                          </CardDescription>
                          <CardAction>
                            <Button variant="ghost" size="icon-sm">
                              <Settings />
                            </Button>
                          </CardAction>
                        </CardHeader>
                        <CardContent>
                          <p className="text-[13px] leading-[1.55] text-slate-600 sm:text-[14px]">
                            Card content area — any text, images, or
                            other components can go here.
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button size="sm">Action</Button>
                        </CardFooter>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Feature Card</CardTitle>
                          <CardDescription>
                            Header and content only.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-3.5">
                            <div
                              className="flex size-10 items-center justify-center rounded-xl"
                              style={{ backgroundColor: "#F1EAF8" }}
                            >
                              <Zap
                                className="size-4"
                                style={{ color: "#8667A8" }}
                              />
                            </div>
                            <div>
                              <p className="text-[15px] font-semibold leading-tight tracking-[-0.015em] text-slate-900 sm:text-base">
                                Feature highlight
                              </p>
                              <p className="mt-1 text-[13px] leading-[1.55] text-slate-600 sm:text-[14px]">
                                Description of this feature.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </Showcase>

                  <Showcase label="Homepage-style product card">
                    <div className="rounded-3xl border border-slate-200/70 bg-white overflow-hidden">
                      <div className="grid gap-4 p-5 pt-7 sm:p-6 lg:grid-cols-[1.28fr_1fr] lg:gap-5 lg:p-7">
                        <div className="flex flex-col">
                          <h4 className="text-[18px] font-semibold leading-[1.24] text-[#EA7432] sm:text-[19px] lg:text-[20px]">
                            Document Management System
                          </h4>
                          <p className="mt-2.5 max-w-[34ch] text-[13px] leading-[1.55] text-slate-500 sm:text-[14px]">
                            Simplify document control, and training, and
                            ensure regulatory compliance.
                          </p>
                          <p className="mt-auto inline-flex items-center gap-2 pt-4 text-[14px] font-medium leading-none text-[#EA7432] sm:text-[15px]">
                            Explore DMS{" "}
                            <ChevronRight className="size-3.5" />
                          </p>
                        </div>
                        <div className="rounded-2xl border border-[#FFF1E4] bg-[#FFF8F2] p-2.5">
                          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-[#FFE4CF] p-4">
                            <span className="rounded-full border border-dashed border-[#FFE4CF] bg-[#FFF1E6] px-2 py-0.5 text-[10px] font-medium text-[#A8540B]">
                              In Progress
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Showcase>
                </SectionBlock>
            </div>

            {/* ═══ ACCORDION ═══ */}
            <div className="border-b border-[#EEF3FF] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
                <SectionBlock
                  id="accordion"
                  pillIcon={ChevronsUpDown}
                  pillLabel="Accordion"
                  title="Accordion"
                  description="Expandable content panels for FAQs and collapsible sections."
                >
                  <Showcase>
                    <Accordion
                      type="single"
                      collapsible
                      className="mx-auto max-w-xl"
                    >
                      <AccordionItem value="item-1">
                        <AccordionTrigger>What is Unifize?</AccordionTrigger>
                        <AccordionContent>
                          Unifize is a platform that streamlines quality
                          management, compliance, and collaboration for
                          regulated industries.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>
                          How does the accordion work?
                        </AccordionTrigger>
                        <AccordionContent>
                          Built on Radix UI primitives, the accordion supports
                          single or multiple expansion modes with smooth
                          animations.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>
                          Can I customize the styling?
                        </AccordionTrigger>
                        <AccordionContent>
                          Yes. All styles are composed with Tailwind CSS utility
                          classes through the cn() utility.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </Showcase>
                </SectionBlock>
            </div>

            {/* ═══ TABS ═══ */}
            <div className="border-b border-[#EEF3FF] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#F6F9FF]">
                <SectionBlock
                  id="tabs"
                  pillIcon={Columns3}
                  pillLabel="Tabs"
                  title="Tabs"
                  description="Tabbed interfaces in default pill and line-underline variants."
                >
                  <Showcase label="Default variant">
                    <Tabs defaultValue="tab1">
                      <TabsList>
                        <TabsTrigger value="tab1">Overview</TabsTrigger>
                        <TabsTrigger value="tab2">Features</TabsTrigger>
                        <TabsTrigger value="tab3">Pricing</TabsTrigger>
                      </TabsList>
                      <TabsContent value="tab1" className="pt-4">
                        <p className="text-[13px] leading-[1.55] text-slate-600 sm:text-[14px]">
                          Overview content. The default tabs variant uses a muted
                          background pill style.
                        </p>
                      </TabsContent>
                      <TabsContent value="tab2" className="pt-4">
                        <p className="text-[13px] leading-[1.55] text-slate-600 sm:text-[14px]">
                          Features content area.
                        </p>
                      </TabsContent>
                      <TabsContent value="tab3" className="pt-4">
                        <p className="text-[13px] leading-[1.55] text-slate-600 sm:text-[14px]">
                          Pricing content area.
                        </p>
                      </TabsContent>
                    </Tabs>
                  </Showcase>

                  <Showcase label="Line variant">
                    <Tabs defaultValue="tab1">
                      <TabsList variant="line">
                        <TabsTrigger value="tab1">Documents</TabsTrigger>
                        <TabsTrigger value="tab2">Settings</TabsTrigger>
                        <TabsTrigger value="tab3">Activity</TabsTrigger>
                      </TabsList>
                      <TabsContent value="tab1" className="pt-4">
                        <p className="text-[13px] leading-[1.55] text-slate-600 sm:text-[14px]">
                          Documents tab. The line variant uses an underline
                          indicator.
                        </p>
                      </TabsContent>
                      <TabsContent value="tab2" className="pt-4">
                        <p className="text-[13px] leading-[1.55] text-slate-600 sm:text-[14px]">
                          Settings tab content.
                        </p>
                      </TabsContent>
                      <TabsContent value="tab3" className="pt-4">
                        <p className="text-[13px] leading-[1.55] text-slate-600 sm:text-[14px]">
                          Activity tab content.
                        </p>
                      </TabsContent>
                    </Tabs>
                  </Showcase>

                  <Showcase label="Homepage pill tabs (from benefits section)">
                    <div className="flex flex-wrap gap-2">
                      {[
                        {
                          label: "Risk & Compliance",
                          active: true,
                          color: "#8667A8",
                        },
                        {
                          label: "Efficiency",
                          active: false,
                          color: "#EA7432",
                        },
                        {
                          label: "Innovation",
                          active: false,
                          color: "#4EA867",
                        },
                      ].map((tab) => (
                        <button
                          key={tab.label}
                          className={`rounded-full border px-4 py-2.5 text-[13px] font-medium transition-colors sm:text-sm ${
                            tab.active
                              ? "text-white"
                              : "border-[#EEF3FF] bg-white text-slate-600 hover:bg-[#F6F9FF]"
                          }`}
                          style={
                            tab.active
                              ? {
                                  backgroundColor: tab.color,
                                  borderColor: tab.color,
                                }
                              : undefined
                          }
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </Showcase>
                </SectionBlock>
            </div>

            {/* ═══ DIALOG ═══ */}
            <div className="border-b border-[#EEF3FF] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
                <SectionBlock
                  id="dialog"
                  pillIcon={PanelsTopLeft}
                  pillLabel="Dialog"
                  title="Dialog"
                  description="Modal dialogs for focused interactions and confirmations."
                >
                  <Showcase>
                    <div className="flex flex-wrap gap-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>Open Dialog</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Dialog Title</DialogTitle>
                            <DialogDescription>
                              This provides context about the dialog's purpose.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <p className="text-[13px] leading-[1.55] text-slate-600 sm:text-[14px]">
                              Dialog body content — forms, text, or any
                              components.
                            </p>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button>Confirm</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">
                            Without close button
                          </Button>
                        </DialogTrigger>
                        <DialogContent showCloseButton={false}>
                          <DialogHeader>
                            <DialogTitle>Minimal Dialog</DialogTitle>
                            <DialogDescription>
                              Close button hidden. Footer has a close action.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter showCloseButton>
                            <Button>Got it</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </Showcase>
                </SectionBlock>
            </div>

            {/* ═══ SHEET ═══ */}
            <div className="border-b border-[#EEF3FF] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#F6F9FF]">
                <SectionBlock
                  id="sheet"
                  pillIcon={PanelRight}
                  pillLabel="Sheet"
                  title="Sheet"
                  description="Slide-in panels from any edge of the screen."
                >
                  <Showcase>
                    <div className="flex flex-wrap gap-3">
                      {(["right", "left", "top", "bottom"] as const).map(
                        (side) => (
                          <Sheet key={side}>
                            <SheetTrigger asChild>
                              <Button variant="outline" className="capitalize">
                                {side}
                              </Button>
                            </SheetTrigger>
                            <SheetContent side={side}>
                              <SheetHeader>
                                <SheetTitle>Sheet from {side}</SheetTitle>
                                <SheetDescription>
                                  Slides in from the {side} of the screen.
                                </SheetDescription>
                              </SheetHeader>
                              <div className="p-4">
                                <p className="text-[13px] leading-[1.55] text-slate-600 sm:text-[14px]">
                                  Sheet content area.
                                </p>
                              </div>
                            </SheetContent>
                          </Sheet>
                        )
                      )}
                    </div>
                  </Showcase>
                </SectionBlock>
            </div>

            {/* ═══ SECTION PILL ═══ */}
            <div className="border-b border-[#EEF3FF] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
                <SectionBlock
                  id="section-pill"
                  pillIcon={Layers}
                  pillLabel="Section Pill"
                  title="Section Pill"
                  description="Custom icon + label markers used to introduce each homepage section."
                >
                  <Showcase>
                    <div className="flex flex-wrap justify-center gap-10">
                      {[
                        { Icon: Shield, label: "Trusted By" },
                        { Icon: Sparkles, label: "Why Unifize?" },
                        { Icon: Boxes, label: "Products" },
                        { Icon: LayoutGrid, label: "Key Benefits" },
                        { Icon: Quote, label: "Customer Stories" },
                      ].map(({ Icon, label }) => (
                        <div key={label} className="section-pill">
                          <span className="section-pill-marker">
                            <Icon className="section-pill-icon" />
                          </span>
                          <span className="section-pill-label">{label}</span>
                        </div>
                      ))}
                    </div>
                  </Showcase>
                </SectionBlock>
            </div>

            {/* ═══ SECTION FRAME ═══ */}
            <div className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#F6F9FF]">
                <SectionBlock
                  id="section-frame"
                  pillIcon={RectangleHorizontal}
                  pillLabel="Layout"
                  title="Section Frame"
                  description="The rail + divider + block layout wrapper that structures the homepage sections."
                >
                  <Showcase>
                    <div
                      className="section-frame-range relative"
                      style={{ minHeight: 240 }}
                    >
                      <div aria-hidden className="section-frame-rails">
                        <span className="section-frame-rail section-frame-rail-left" />
                        <span className="section-frame-rail section-frame-rail-right" />
                      </div>
                      <div className="section-frame-block">
                        <span aria-hidden className="section-frame-divider" />
                        <div className="py-10 px-6 text-center">
                          <p className="text-[13px] leading-[1.55] text-slate-600 sm:text-[14px]">
                            Content sits inside{" "}
                            <code className="rounded-md bg-[#F6F9FF] px-1.5 py-0.5 font-mono text-[12px] text-[#0052FF]">
                              section-frame-block
                            </code>{" "}
                            with rails on the left and right edges and dot
                            markers at divider intersections.
                          </p>
                        </div>
                      </div>
                      <div className="section-frame-block section-frame-block-last">
                        <span aria-hidden className="section-frame-divider" />
                        <div className="py-10 px-6 text-center">
                          <p className="text-[13px] leading-[1.55] text-slate-600 sm:text-[14px]">
                            Second block with bottom dots marker.
                          </p>
                        </div>
                        <span aria-hidden className="section-frame-bottom-dots" />
                      </div>
                    </div>
                  </Showcase>
                </SectionBlock>
            </div>
        </main>
      </div>
    </div>
  );
}
