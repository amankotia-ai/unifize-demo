import { useState } from "react";
import {
  Shield,
  ShieldCheck,
  Award,
  Star,
  Users,
  CheckCircle2,
  ArrowRight,
  Play,
  FileText,
  Factory,
  GitMerge,
  Lock,
  Globe,
  BarChart3,
  Zap,
  ChevronRight,
  Quote,
  TrendingUp,
  Clock,
  Eye,
  Target,
  Phone,
  Mail,
  Search,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const navSections = [
  { id: "typography", label: "Typography" },
  { id: "colors", label: "Colors" },
  { id: "buttons", label: "Buttons" },
  { id: "trust", label: "Trust" },
  { id: "dark-hero", label: "Dark Hero" },
  { id: "cards", label: "Cards" },
  { id: "sections", label: "Sections" },
  { id: "navigation", label: "Navigation" },
  { id: "spacing", label: "Spacing" },
];

const textStyles = [
  {
    name: "Display XL",
    font: "Inter",
    weight: "Light 300",
    size: "64px",
    lineHeight: "1.05",
    tracking: "-0.04em",
    preview: "Enterprise Platform",
    className:
      "text-[64px] font-light leading-[1.05] tracking-[-0.04em] text-slate-900",
  },
  {
    name: "Display L",
    font: "Inter",
    weight: "Semibold 600",
    size: "52px",
    lineHeight: "1.08",
    tracking: "-0.03em",
    preview: "Unified Quality",
    className:
      "text-[52px] font-semibold leading-[1.08] tracking-[-0.03em] text-slate-900",
  },
  {
    name: "Display M",
    font: "Inter",
    weight: "Semibold 600",
    size: "44px",
    lineHeight: "1.12",
    tracking: "-0.025em",
    preview: "Accelerate Innovation",
    className:
      "text-[44px] font-semibold leading-[1.12] tracking-[-0.025em] text-slate-900",
  },
  {
    name: "Heading 1",
    font: "Inter",
    weight: "Semibold 600",
    size: "36px",
    lineHeight: "1.16",
    tracking: "-0.02em",
    preview: "Products for Every Team",
    className:
      "text-[36px] font-semibold leading-[1.16] tracking-[-0.02em] text-slate-900",
  },
  {
    name: "Heading 2",
    font: "Inter",
    weight: "Semibold 600",
    size: "28px",
    lineHeight: "1.2",
    tracking: "-0.02em",
    preview: "Manage Risk & Compliance",
    className:
      "text-[28px] font-semibold leading-[1.2] tracking-[-0.02em] text-slate-900",
  },
  {
    name: "Heading 3",
    font: "Inter",
    weight: "Medium 500",
    size: "22px",
    lineHeight: "1.3",
    tracking: "-0.015em",
    preview: "Document Management System",
    className:
      "text-[22px] font-medium leading-[1.3] tracking-[-0.015em] text-slate-900",
  },
  {
    name: "Body Large",
    font: "Inter",
    weight: "Regular 400",
    size: "18px",
    lineHeight: "1.65",
    tracking: "-0.01em",
    preview:
      "Unify your processes, enhance collaboration, and accelerate decision-making with a platform built for regulated companies.",
    className:
      "text-[18px] font-normal leading-[1.65] tracking-[-0.01em] text-slate-600",
  },
  {
    name: "Body",
    font: "Inter",
    weight: "Regular 400",
    size: "16px",
    lineHeight: "1.65",
    tracking: "normal",
    preview:
      "Streamline processes, optimize resources, and reduce operational delays to improve productivity.",
    className: "text-[16px] font-normal leading-[1.65] text-slate-600",
  },
  {
    name: "Body Small",
    font: "Inter",
    weight: "Regular 400",
    size: "14px",
    lineHeight: "1.6",
    tracking: "normal",
    preview:
      "CFR Part 11 compliant eSignatures, comprehensive audit trails, and SOC-2 compliant data storage.",
    className: "text-[14px] font-normal leading-[1.6] text-slate-500",
  },
  {
    name: "Overline",
    font: "Inter",
    weight: "Bold 700",
    size: "12px",
    lineHeight: "1",
    tracking: "0.08em",
    preview: "TRUSTED BY REGULATED TEAMS WORLDWIDE",
    className:
      "text-[12px] font-bold uppercase leading-[1] tracking-[0.08em] text-slate-400",
  },
];

const navyColors = [
  { hex: "#060D18", name: "Navy 950", usage: "Darkest BG" },
  { hex: "#0A1628", name: "Navy 900", usage: "Hero BG" },
  { hex: "#0F1D31", name: "Navy 800", usage: "Footer BG" },
  { hex: "#162544", name: "Navy 700", usage: "Card on dark" },
  { hex: "#1E3A5F", name: "Navy 600", usage: "Borders on dark" },
  { hex: "#2A4A73", name: "Navy 500", usage: "Muted text dark" },
];

const blueColors = [
  { hex: "#003ACC", name: "Blue 700", usage: "Hover state" },
  { hex: "#0052FF", name: "Blue 600", usage: "Primary CTA" },
  { hex: "#3378FF", name: "Blue 500", usage: "Links" },
  { hex: "#85AEFF", name: "Blue 300", usage: "Text on dark" },
  { hex: "#DCEAFF", name: "Blue 100", usage: "Light surface" },
  { hex: "#F0F5FF", name: "Blue 50", usage: "Section BG" },
];

const grayScale = [
  "#020617",
  "#0f172a",
  "#1e293b",
  "#334155",
  "#475569",
  "#64748b",
  "#94a3b8",
  "#cbd5e1",
  "#e2e8f0",
  "#f1f5f9",
];

const semanticTokens = [
  { name: "--cta", value: "#0052FF", usage: "Call-to-action" },
  { name: "--heading", value: "#0f172a", usage: "Heading text" },
  { name: "--body-muted", value: "#64748b", usage: "Body / muted text" },
  { name: "--surface-tint", value: "#EEF3FF", usage: "Tinted surfaces" },
  { name: "--surface-subtle", value: "#F9FBFF", usage: "Subtle backgrounds" },
];

const productAccents = [
  { name: "DMS", hex: "#EA7432", bg: "#FFF6F0", icon: FileText },
  { name: "QMS", hex: "#C48A1A", bg: "#FFFBF0", icon: ShieldCheck },
  { name: "PLM", hex: "#7349A0", bg: "#F9F5FF", icon: GitMerge },
  { name: "MES", hex: "#2D8A4E", bg: "#F0FAF4", icon: Factory },
];

const quotes = [
  {
    name: "Denis Machoka",
    title: "Quality Director",
    company: "Biovation Labs",
    quote:
      "Unifize transformed our quality assurance process. We cut testing costs from $146K to $65K in just two months.",
    metric: "55% cost reduction",
  },
  {
    name: "Clarissa Archer",
    title: "Regulatory Affairs Manager",
    company: "Harmonic Bionics",
    quote:
      "The transition to regulatory compliance was seamless. Change control and documentation became effortless.",
    metric: "100% audit readiness",
  },
  {
    name: "Tedd Carr",
    title: "VP of Quality",
    company: "The Will-Burt Company",
    quote:
      "We consolidated five systems into one and reduced issue closure time from months to days.",
    metric: "75% faster resolution",
  },
];

const stats = [
  {
    stat: "70%",
    label: "Faster time-to-market",
    source: "Biovation Labs",
    icon: TrendingUp,
  },
  {
    stat: "90%",
    label: "Fewer meetings",
    source: "Harmonic Bionics",
    icon: Clock,
  },
  {
    stat: "75%",
    label: "Faster issue closure",
    source: "Will-Burt Company",
    icon: Zap,
  },
  {
    stat: "100%",
    label: "Process visibility",
    source: "Red Sun Farms",
    icon: Eye,
  },
];

const productCards = [
  {
    name: "Document Management",
    desc: "Simplify document control, training, and regulatory compliance.",
    icon: FileText,
    color: "#EA7432",
    bg: "#FFF6F0",
  },
  {
    name: "Quality Management",
    desc: "Lower quality risks and enhance audit readiness.",
    icon: ShieldCheck,
    color: "#C48A1A",
    bg: "#FFFBF0",
  },
  {
    name: "Product Lifecycle",
    desc: "Accelerate product development and improve traceability.",
    icon: GitMerge,
    color: "#7349A0",
    bg: "#F9F5FF",
  },
  {
    name: "Manufacturing",
    desc: "Real-time visibility and production process optimization.",
    icon: Factory,
    color: "#2D8A4E",
    bg: "#F0FAF4",
  },
];

const comparisonFeatures = [
  "Real-time collaboration",
  "No-code configuration",
  "FDA 21 CFR Part 11",
  "Automated workflows",
  "Mobile access",
  "SOC-2 compliance",
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[56px] font-extrabold uppercase leading-none tracking-tight text-black sm:text-[72px]">
      {children}
    </h2>
  );
}

function SectionDesc({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-gray-500">
      {children}
    </p>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[40px] font-extrabold uppercase leading-none tracking-tight text-black sm:text-[48px]">
      {children}
    </h3>
  );
}

function ColorSwatch({
  hex,
  name,
  usage,
  light = false,
}: {
  hex: string;
  name: string;
  usage: string;
  light?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <div
        className={`h-20 rounded-xl ${light ? "border border-gray-200" : ""}`}
        style={{ backgroundColor: hex }}
      />
      <p className="mt-2.5 text-sm font-semibold text-slate-900">{name}</p>
      <p className="font-mono text-xs text-slate-400">{hex}</p>
      <p className="mt-1 text-xs text-slate-400">{usage}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function EnterpriseDesignSystem() {
  const [textTab, setTextTab] = useState<"all" | "table">("all");

  return (
    <div className="min-h-screen bg-white">
      {/* ── Top Navigation ── */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-8 overflow-x-auto">
            <a href="/" className="shrink-0">
              <img
                src="/Link - home.svg"
                alt="Unifize"
                className="h-5"
              />
            </a>
            <div className="hidden items-center gap-6 md:flex">
              {navSections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="shrink-0 text-sm text-gray-500 transition-colors hover:text-gray-900"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          <button className="shrink-0 text-gray-400 hover:text-gray-600">
            <Search className="size-[18px]" />
          </button>
        </div>
      </nav>

      {/* ── Content ── */}
      <main className="mx-auto max-w-[1440px] px-6 lg:px-10">
        {/* ============================================================ */}
        {/* 1. TYPOGRAPHY                                                */}
        {/* ============================================================ */}
        <section id="typography" className="scroll-mt-20 pb-28 pt-16">
          <SectionTitle>Typography</SectionTitle>
          <SectionDesc>
            Our typographic system is built on legibility and readability. Inter
            provides the clarity enterprise interfaces demand — from large
            display headings to compact UI labels.
          </SectionDesc>

          {/* Hero decorative element */}
          <div className="mt-14 overflow-hidden rounded-2xl bg-[#d6d7d1] px-8 py-20 text-center sm:py-28">
            <p className="select-none text-[80px] font-black leading-none tracking-tight text-[#000650]/20 sm:text-[140px] lg:text-[180px]">
              UNIFIZE
            </p>
          </div>

          {/* ── Approach ── */}
          <div className="mt-24">
            <SubTitle>Approach</SubTitle>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {[
                {
                  label: "Clarity",
                  desc: "Every heading, label, and paragraph uses a deliberate size and weight to create a clear visual hierarchy. Larger display sizes command attention while body text stays easy to read.",
                },
                {
                  label: "Consistency",
                  desc: "A fixed type scale ensures every page feels cohesive. Designers and developers use the same tokens — no ad-hoc sizes, no guessing.",
                },
                {
                  label: "Enterprise scale",
                  desc: "Display headings up to 64px, tighter letter-spacing, and heavier weights create the visual authority expected by regulated-industry buyers.",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex h-48 items-center justify-center rounded-xl bg-gray-100">
                    <span className="text-sm text-gray-400">
                      Placeholder image
                    </span>
                  </div>
                  <p className="mt-5 text-sm font-semibold text-gray-900">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Text Styles ── */}
          <div className="mt-24">
            <SubTitle>Text Styles</SubTitle>

            {/* Tabs */}
            <div className="mt-8 flex gap-2">
              <button
                onClick={() => setTextTab("all")}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  textTab === "all"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-500 hover:text-gray-700"
                }`}
              >
                All sizes
              </button>
              <button
                onClick={() => setTextTab("table")}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  textTab === "table"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-500 hover:text-gray-700"
                }`}
              >
                Table
              </button>
            </div>

            {textTab === "all" ? (
              <div className="mt-8">
                <p className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
                  Product Styles
                </p>
                <div className="divide-y divide-gray-100">
                  {textStyles.map((style) => (
                    <div
                      key={style.name}
                      className="grid items-baseline gap-6 py-7 lg:grid-cols-[280px_1fr]"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {style.name}
                        </p>
                        <p className="mt-1 font-mono text-[11px] leading-relaxed text-gray-400">
                          {style.font} · {style.weight}
                          <br />
                          {style.size} / {style.lineHeight}
                          {style.tracking !== "normal" &&
                            ` / ${style.tracking}`}
                        </p>
                      </div>
                      <p className={style.className}>{style.preview}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-8 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-400">
                      <th className="pb-3 pr-6">Name</th>
                      <th className="pb-3 pr-6">Font</th>
                      <th className="pb-3 pr-6">Weight</th>
                      <th className="pb-3 pr-6">Size</th>
                      <th className="pb-3 pr-6">Line-height</th>
                      <th className="pb-3">Tracking</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {textStyles.map((s) => (
                      <tr key={s.name}>
                        <td className="py-3 pr-6 font-semibold text-gray-900">
                          {s.name}
                        </td>
                        <td className="py-3 pr-6 text-gray-500">{s.font}</td>
                        <td className="py-3 pr-6 text-gray-500">
                          {s.weight}
                        </td>
                        <td className="py-3 pr-6 font-mono text-gray-500">
                          {s.size}
                        </td>
                        <td className="py-3 pr-6 font-mono text-gray-500">
                          {s.lineHeight}
                        </td>
                        <td className="py-3 font-mono text-gray-500">
                          {s.tracking}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── Inter Font Specimen ── */}
          <div className="mt-24">
            <SubTitle>Inter</SubTitle>
            <SectionDesc>
              Inter's simplicity, clarity, and rounded terminals make it the
              perfect functional typeface for an always-default-to-clear product.
              It gives us the flexibility to communicate easily with precise,
              expressive, yet clear typography.
            </SectionDesc>

            <div className="mt-12 space-y-12">
              {/* Inter Medium */}
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                  Inter Medium
                </p>
                <div className="space-y-1 text-[32px] font-medium leading-snug tracking-tight text-gray-900 sm:text-[40px]">
                  <p>A B C D E F G H I J K L M</p>
                  <p>N O P Q R S T U V W X Y Z</p>
                  <p className="text-gray-500">a b c d e f g h i j k l m</p>
                  <p className="text-gray-500">n o p q r s t u v w x y z</p>
                  <p>1 2 3 4 5 6 7 8 9 0 &amp; $</p>
                  <p className="text-gray-400">
                    ! ? # % $ &amp; = + @ {"{"} {"}"}
                  </p>
                </div>
              </div>

              {/* Inter SemiBold */}
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                  Inter Semi Bold
                </p>
                <div className="space-y-1 text-[32px] font-semibold leading-snug tracking-tight text-gray-900 sm:text-[40px]">
                  <p>A B C D E F G H I J K L M</p>
                  <p>N O P Q R S T U V W X Y Z</p>
                  <p className="text-gray-500">a b c d e f g h i j k l m</p>
                  <p className="text-gray-500">n o p q r s t u v w x y z</p>
                  <p>1 2 3 4 5 6 7 8 9 0 &amp; $</p>
                  <p className="text-gray-400">
                    ! ? # % $ &amp; = + @ {"{"} {"}"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 2. COLORS                                                    */}
        {/* ============================================================ */}
        <section id="colors" className="scroll-mt-20 pb-28">
          <SectionTitle>Colors</SectionTitle>
          <SectionDesc>
            Dark navy backgrounds, stronger brand blue usage, and a richer gray
            scale create visual authority. Semantic tokens keep the palette
            consistent and theme-able across pages.
          </SectionDesc>

          {/* Brand Colors */}
          <div className="mt-14">
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
              Brand
            </p>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
              {[
                { name: "primary", hex: "#0052FF" },
                { name: "secondary", hex: "#000650" },
                { name: "accent", hex: "#c2b8ff" },
              ].map((c) => (
                <div key={c.name} className="flex flex-col">
                  <div
                    className="aspect-square rounded-2xl"
                    style={{ backgroundColor: c.hex }}
                  />
                  <p className="mt-3 text-base font-semibold text-gray-900">
                    {c.name}
                  </p>
                  <p className="font-mono text-sm text-gray-400">{c.hex}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Neutrals */}
          <div className="mt-14">
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
              Neutrals
            </p>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
              {[
                { name: "background", hex: "#ffffff", light: true },
                { name: "text", hex: "#000000", light: false },
                { name: "border", hex: "#d6d7d1", light: false },
              ].map((c) => (
                <div key={c.name} className="flex flex-col">
                  <div
                    className={`aspect-square rounded-2xl ${c.light ? "border border-gray-200" : ""}`}
                    style={{ backgroundColor: c.hex }}
                  />
                  <p className="mt-3 text-base font-semibold text-gray-900">
                    {c.name}
                  </p>
                  <p className="font-mono text-sm text-gray-400">{c.hex}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Semantic Tokens */}
          <div className="mt-14">
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
              Semantic Tokens
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {semanticTokens.map((t) => (
                <div key={t.name} className="flex flex-col">
                  <div
                    className={`h-20 rounded-xl ${t.value === "#F9FBFF" || t.value === "#EEF3FF" ? "border border-gray-200" : ""}`}
                    style={{ backgroundColor: t.value }}
                  />
                  <p className="mt-2.5 font-mono text-sm font-semibold text-slate-900">
                    {t.name}
                  </p>
                  <p className="font-mono text-xs text-slate-400">{t.value}</p>
                  <p className="mt-1 text-xs text-slate-400">{t.usage}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dark Navy System */}
          <div className="mt-14">
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
              Dark Navy System
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {navyColors.map((c) => (
                <ColorSwatch key={c.hex} {...c} />
              ))}
            </div>
          </div>

          {/* Brand Blue */}
          <div className="mt-14">
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
              Brand Blue
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {blueColors.map((c) => (
                <ColorSwatch
                  key={c.hex}
                  {...c}
                  light={c.hex === "#F0F5FF" || c.hex === "#DCEAFF"}
                />
              ))}
            </div>
          </div>

          {/* Gray Scale */}
          <div className="mt-14">
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
              Slate Gray Scale
            </p>
            <div className="grid grid-cols-5 gap-4 lg:grid-cols-10">
              {grayScale.map((bg, i) => (
                <div key={bg} className="flex flex-col items-center">
                  <div
                    className="h-14 w-full rounded-lg"
                    style={{ backgroundColor: bg }}
                  />
                  <p className="mt-1.5 font-mono text-[11px] text-gray-400">
                    {[950, 900, 800, 700, 600, 500, 400, 300, 200, 100][i]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Product Accents */}
          <div className="mt-14">
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
              Product Accents
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {productAccents.map((p) => (
                <div
                  key={p.name}
                  className="overflow-hidden rounded-xl border border-gray-200"
                >
                  <div
                    className="flex h-16 items-center justify-center"
                    style={{ backgroundColor: p.hex }}
                  >
                    <p.icon className="size-6 text-white" />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {p.name}
                    </p>
                    <p className="font-mono text-xs text-gray-400">{p.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 3. BUTTONS & CTAs                                            */}
        {/* ============================================================ */}
        <section id="buttons" className="scroll-mt-20 pb-28">
          <SectionTitle>Buttons</SectionTitle>
          <SectionDesc>
            Enterprise CTAs use generous sizing (h-12 to h-14) and clear visual
            hierarchy. Primary actions are bold blue; secondary actions use
            outlines or ghost styles.
          </SectionDesc>

          {/* Size Scale */}
          <div className="mt-14">
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
              Size Scale
            </p>
            <div className="flex flex-wrap items-end gap-6">
              {[
                { h: "h-9", px: "px-4", text: "text-sm", label: "h-9 (36px)" },
                {
                  h: "h-11",
                  px: "px-6",
                  text: "text-sm",
                  label: "h-11 (44px)",
                },
                {
                  h: "h-12",
                  px: "px-8",
                  text: "text-[15px]",
                  label: "h-12 (48px)",
                },
                {
                  h: "h-14",
                  px: "px-10",
                  text: "text-base",
                  label: "h-14 (56px)",
                },
              ].map((b) => (
                <div key={b.label} className="text-center">
                  <button
                    className={`inline-flex ${b.h} items-center justify-center gap-2 rounded-lg bg-[#0052FF] ${b.px} ${b.text} font-semibold text-white transition-colors hover:bg-[#003ACC]`}
                  >
                    Book a Demo
                  </button>
                  <p className="mt-2 font-mono text-[11px] text-gray-400">
                    {b.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Pairs */}
          <div className="mt-14">
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
              Dual CTA Patterns
            </p>
            <div className="space-y-8">
              {/* Light */}
              <div>
                <p className="mb-3 text-xs font-medium text-gray-500">
                  On light background
                </p>
                <div className="flex flex-wrap gap-3">
                  <button className="inline-flex h-12 items-center gap-2.5 rounded-lg bg-[#0052FF] px-8 text-[15px] font-semibold text-white hover:bg-[#003ACC]">
                    Book a Demo
                    <ArrowRight className="size-4" />
                  </button>
                  <button className="inline-flex h-12 items-center gap-2.5 rounded-lg border-2 border-gray-200 bg-white px-8 text-[15px] font-semibold text-gray-700 hover:bg-gray-50">
                    <Play className="size-4" />
                    Watch Overview
                  </button>
                </div>
              </div>

              {/* Dark */}
              <div className="rounded-xl bg-[#0A1628] p-6">
                <p className="mb-3 text-xs font-medium text-gray-400">
                  On dark background
                </p>
                <div className="flex flex-wrap gap-3">
                  <button className="inline-flex h-12 items-center gap-2.5 rounded-lg bg-[#0052FF] px-8 text-[15px] font-semibold text-white hover:bg-[#3378FF]">
                    Book a Demo
                    <ArrowRight className="size-4" />
                  </button>
                  <button className="inline-flex h-12 items-center gap-2.5 rounded-lg border border-white/20 bg-white/10 px-8 text-[15px] font-semibold text-white backdrop-blur-sm hover:bg-white/15">
                    <Play className="size-4" />
                    Watch Overview
                  </button>
                </div>
              </div>

              {/* Contact Sales */}
              <div>
                <p className="mb-3 text-xs font-medium text-gray-500">
                  Contact Sales path
                </p>
                <div className="flex flex-wrap gap-3">
                  <button className="inline-flex h-12 items-center gap-2.5 rounded-lg bg-gray-900 px-8 text-[15px] font-semibold text-white hover:bg-gray-800">
                    <Phone className="size-4" />
                    Contact Sales
                  </button>
                  <button className="inline-flex h-12 items-center gap-2.5 rounded-lg border-2 border-[#0052FF]/20 bg-[#0052FF]/5 px-8 text-[15px] font-semibold text-[#0052FF] hover:bg-[#0052FF]/10">
                    <Mail className="size-4" />
                    Request Pricing
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="mt-14">
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
              Badges & Pills
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                <CheckCircle2 className="size-3.5" />
                SOC-2 Compliant
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
                <Shield className="size-3.5" />
                ISO 13485
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 ring-1 ring-purple-200">
                <Lock className="size-3.5" />
                FDA 21 CFR Part 11
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                <Award className="size-3.5" />
                HIPAA Ready
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 ring-1 ring-gray-200">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                4.8/5 on G2
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white">
                <Users className="size-3.5" />
                500+ Enterprise Teams
              </span>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4. TRUST & SOCIAL PROOF                                      */}
        {/* ============================================================ */}
        <section id="trust" className="scroll-mt-20 pb-28">
          <SectionTitle>Trust</SectionTitle>
          <SectionDesc>
            Enterprise buyers decide based on peer validation. Trust badges,
            named quotes with titles, and attributed stats are non-negotiable
            elements for regulated-industry credibility.
          </SectionDesc>

          {/* Trust Bar — Light */}
          <div className="mt-14">
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
              Trust Badges Bar
            </p>
            <div className="rounded-2xl border border-gray-200 p-6">
              <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
                {[
                  {
                    icon: ShieldCheck,
                    label: "SOC-2 Type II",
                    color: "text-emerald-600",
                    bg: "bg-emerald-50",
                  },
                  {
                    icon: Shield,
                    label: "ISO 13485",
                    color: "text-blue-600",
                    bg: "bg-blue-50",
                  },
                  {
                    icon: Lock,
                    label: "FDA Part 11",
                    color: "text-purple-600",
                    bg: "bg-purple-50",
                  },
                  {
                    icon: Award,
                    label: "HIPAA",
                    color: "text-amber-600",
                    bg: "bg-amber-50",
                  },
                ].map((b) => (
                  <div
                    key={b.label}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${b.bg}`}
                    >
                      <b.icon className={`size-6 ${b.color}`} />
                    </div>
                    <span className="text-xs font-semibold text-gray-700">
                      {b.label}
                    </span>
                  </div>
                ))}
                <div className="hidden h-12 w-px bg-gray-200 sm:block" />
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`size-4 ${i <= 4 ? "fill-amber-400 text-amber-400" : "fill-amber-400/50 text-amber-400/50"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    4.8/5
                  </span>
                  <span className="text-[11px] text-gray-500">on G2</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl font-bold text-gray-900">500+</span>
                  <span className="text-[11px] text-gray-500">
                    Enterprise Teams
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Bar — Dark */}
          <div className="mt-14">
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
              Dark Trust Bar
            </p>
            <div className="rounded-2xl bg-[#0A1628] px-8 py-8">
              <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14">
                <div className="flex flex-col items-center gap-1.5">
                  <ShieldCheck className="size-6 text-emerald-400" />
                  <span className="text-xs font-semibold text-white/90">
                    SOC-2 Type II
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <Shield className="size-6 text-blue-400" />
                  <span className="text-xs font-semibold text-white/90">
                    ISO 13485
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <Lock className="size-6 text-purple-400" />
                  <span className="text-xs font-semibold text-white/90">
                    FDA Part 11
                  </span>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="size-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                  <span className="ml-1.5 text-sm font-bold text-white">
                    4.8
                  </span>
                  <span className="text-xs text-white/50">on G2</span>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <span className="text-sm font-semibold text-white/80">
                  <span className="text-lg font-bold text-white">500+</span>{" "}
                  regulated teams
                </span>
              </div>
            </div>
          </div>

          {/* Customer Quote Cards */}
          <div className="mt-14">
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
              Customer Quotes
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {quotes.map((t) => (
                <div
                  key={t.name}
                  className="flex flex-col justify-between rounded-2xl border border-gray-200 p-6 transition-shadow hover:shadow-lg"
                >
                  <div>
                    <Quote className="mb-3 size-8 text-[#0052FF]/20" />
                    <p className="text-[15px] leading-relaxed text-gray-600">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>
                  <div className="mt-6">
                    <div className="mb-3 inline-block rounded-full bg-[#0052FF]/10 px-3 py-1 text-xs font-bold text-[#0052FF]">
                      {t.metric}
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {t.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t.title}, {t.company}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attributed Stats */}
          <div className="mt-14">
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
              Attributed Stats
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.stat}
                  className="rounded-xl border border-gray-200 p-5 transition-shadow hover:shadow-md"
                >
                  <s.icon className="mb-2 size-5 text-[#0052FF]" />
                  <p className="text-3xl font-bold tracking-tight text-gray-900">
                    {s.stat}
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-600">
                    {s.label}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">— {s.source}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5. DARK HERO                                                 */}
        {/* ============================================================ */}
        <section id="dark-hero" className="scroll-mt-20 pb-28">
          <SectionTitle>Dark Hero</SectionTitle>
          <SectionDesc>
            A dark navy hero immediately signals enterprise seriousness. This is
            the single highest-impact change for &ldquo;enterprise
            feel&rdquo; — larger type, dark background, inline trust elements.
          </SectionDesc>

          <div className="mt-14 overflow-hidden rounded-2xl border border-gray-800">
            <div className="relative bg-[#0A1628] px-8 py-20 sm:px-12 sm:py-28 lg:px-16">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0052FF]/10 via-transparent to-[#0052FF]/5" />
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />

              <div className="relative z-10 mx-auto max-w-3xl text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold text-white/80">
                    Trusted by 500+ regulated companies
                  </span>
                </div>

                <h1 className="text-[44px] font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-[56px]">
                  The Unified Platform for Quality, Ops &amp; Product Teams
                </h1>

                <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
                  Streamline compliance, accelerate innovation, and eliminate
                  silos — built for ISO and FDA-regulated companies.
                </p>

                <div className="mt-10 flex flex-wrap justify-center gap-4">
                  <button className="inline-flex h-13 items-center gap-2.5 rounded-xl bg-[#0052FF] px-8 text-[15px] font-semibold text-white hover:bg-[#3378FF] hover:shadow-lg hover:shadow-[#0052FF]/20">
                    Book a Demo
                    <ArrowRight className="size-4" />
                  </button>
                  <button className="inline-flex h-13 items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-8 text-[15px] font-semibold text-white backdrop-blur-sm hover:bg-white/10">
                    <Play className="size-4" />
                    Watch Overview
                  </button>
                </div>

                <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-emerald-400" />
                    <span className="text-xs font-medium text-white/60">
                      SOC-2
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Shield className="size-4 text-blue-400" />
                    <span className="text-xs font-medium text-white/60">
                      ISO 13485
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Lock className="size-4 text-purple-400" />
                    <span className="text-xs font-medium text-white/60">
                      FDA Part 11
                    </span>
                  </div>
                  <div className="h-4 w-px bg-white/10" />
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="size-3 fill-amber-400 text-amber-400"
                      />
                    ))}
                    <span className="ml-1 text-xs font-semibold text-white/70">
                      4.8 on G2
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 6. CARDS                                                     */}
        {/* ============================================================ */}
        <section id="cards" className="scroll-mt-20 pb-28">
          <SectionTitle>Cards</SectionTitle>
          <SectionDesc>
            Stronger borders, larger padding, bolder headings, and purpose-built
            card types for enterprise content patterns — product cards,
            comparisons, customer stories, and pricing tiers.
          </SectionDesc>

          {/* Product Cards */}
          <div className="mt-14">
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
              Product Cards
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {productCards.map((p) => (
                <div
                  key={p.name}
                  className="group cursor-pointer rounded-2xl border border-gray-200 p-6 transition-all hover:border-gray-300 hover:shadow-lg"
                >
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: p.bg }}
                  >
                    <p.icon className="size-6" style={{ color: p.color }} />
                  </div>
                  <h4 className="text-lg font-semibold tracking-tight text-gray-900">
                    {p.name}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    {p.desc}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-[#0052FF] group-hover:text-[#003ACC]">
                    Learn more
                    <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Comparison */}
          <div className="mt-14">
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
              Feature Comparison
            </p>
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <div className="grid grid-cols-4 border-b border-gray-100 bg-gray-50 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <span>Feature</span>
                <span className="text-center">Unifize</span>
                <span className="text-center">Legacy QMS</span>
                <span className="text-center">Spreadsheets</span>
              </div>
              {comparisonFeatures.map((feature, i) => (
                <div
                  key={feature}
                  className={`grid grid-cols-4 px-6 py-3.5 text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                >
                  <span className="font-medium text-gray-700">{feature}</span>
                  <span className="flex justify-center">
                    <CheckCircle2 className="size-5 text-emerald-500" />
                  </span>
                  <span className="flex justify-center">
                    {i < 3 ? (
                      <CheckCircle2 className="size-5 text-gray-300" />
                    ) : (
                      <span className="text-gray-300">&mdash;</span>
                    )}
                  </span>
                  <span className="flex justify-center">
                    {i === 0 ? (
                      <CheckCircle2 className="size-5 text-gray-300" />
                    ) : (
                      <span className="text-gray-300">&mdash;</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Story Cards */}
          <div className="mt-14">
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
              Customer Story Cards
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-900 to-gray-800">
                <div className="p-8">
                  <div className="mb-6 inline-block rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white/70">
                    Case Study
                  </div>
                  <p className="text-3xl font-bold tracking-tight text-white">
                    55%
                  </p>
                  <p className="mt-1 text-lg font-medium text-white/80">
                    Cost reduction in testing
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-white/60">
                    Biovation Labs reduced testing costs from $146K to $65K in
                    two months after switching to Unifize.
                  </p>
                </div>
                <div className="border-t border-white/10 px-8 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white/80">
                      Biovation Labs
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#85AEFF]">
                      Read case study
                      <ArrowRight className="size-3.5" />
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#0052FF]/20 bg-gradient-to-br from-[#0052FF] to-[#003ACC]">
                <div className="p-8">
                  <div className="mb-6 inline-block rounded-lg bg-white/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white/80">
                    Case Study
                  </div>
                  <p className="text-3xl font-bold tracking-tight text-white">
                    75%
                  </p>
                  <p className="mt-1 text-lg font-medium text-white/90">
                    Faster issue closure
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-white/70">
                    The Will-Burt Company consolidated five systems into one and
                    reduced issue closure from months to days.
                  </p>
                </div>
                <div className="border-t border-white/15 px-8 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white/90">
                      Will-Burt Company
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-white">
                      Read case study
                      <ArrowRight className="size-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Tiers */}
          <div className="mt-14">
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
              Pricing Tiers
            </p>
            <div className="grid gap-6 sm:grid-cols-3">
              {/* Starter */}
              <div className="rounded-2xl border border-gray-200 p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Starter
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  For small teams getting started with quality management
                </p>
                <p className="mt-4 text-3xl font-bold text-gray-900">Custom</p>
                <button className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-lg border-2 border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  Contact Sales
                </button>
                <ul className="mt-6 space-y-3">
                  {[
                    "Up to 25 users",
                    "1 module",
                    "Email support",
                    "Standard onboarding",
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <CheckCircle2 className="size-4 shrink-0 text-gray-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Professional */}
              <div className="relative rounded-2xl border-2 border-[#0052FF] p-6 shadow-lg shadow-[#0052FF]/10">
                <span className="absolute -top-3 left-6 rounded-full bg-[#0052FF] px-3 py-0.5 text-xs font-bold text-white">
                  Most Popular
                </span>
                <p className="text-xs font-bold uppercase tracking-wider text-[#0052FF]">
                  Professional
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  For growing teams needing full compliance capabilities
                </p>
                <p className="mt-4 text-3xl font-bold text-gray-900">Custom</p>
                <button className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#0052FF] text-sm font-semibold text-white hover:bg-[#003ACC]">
                  Book a Demo
                </button>
                <ul className="mt-6 space-y-3">
                  {[
                    "Unlimited users",
                    "All modules",
                    "Priority support",
                    "White-glove onboarding",
                    "Custom workflows",
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <CheckCircle2 className="size-4 shrink-0 text-[#0052FF]" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Enterprise */}
              <div className="rounded-2xl border border-gray-200 p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Enterprise
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  For large organizations with complex compliance needs
                </p>
                <p className="mt-4 text-3xl font-bold text-gray-900">Custom</p>
                <button className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-lg border-2 border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  Contact Sales
                </button>
                <ul className="mt-6 space-y-3">
                  {[
                    "Everything in Pro",
                    "Dedicated CSM",
                    "Custom integrations",
                    "SLA guarantee",
                    "On-premise option",
                    "Advanced analytics",
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <CheckCircle2 className="size-4 shrink-0 text-gray-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 7. SECTION RHYTHM                                            */}
        {/* ============================================================ */}
        <section id="sections" className="scroll-mt-20 pb-28">
          <SectionTitle>Sections</SectionTitle>
          <SectionDesc>
            Enterprise sites create visual rhythm by alternating dark and light
            sections. This creates natural separation and keeps users engaged
            through long pages.
          </SectionDesc>

          <div className="mt-14 overflow-hidden rounded-2xl border border-gray-200">
            {/* Light */}
            <div className="bg-white px-8 py-14 sm:px-12">
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#0052FF]">
                  Products
                </p>
                <h3 className="mt-3 text-[32px] font-semibold leading-[1.12] tracking-[-0.025em] text-gray-900">
                  Products for every team in the value chain
                </h3>
                <p className="mt-4 text-base leading-relaxed text-gray-500">
                  A unified platform with purpose-built modules for quality,
                  documents, products, and manufacturing.
                </p>
              </div>
              <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
                {["DMS", "QMS", "PLM", "MES"].map((p) => (
                  <div
                    key={p}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center"
                  >
                    <p className="text-sm font-semibold text-gray-700">{p}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dark */}
            <div className="bg-[#0A1628] px-8 py-14 sm:px-12">
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#85AEFF]">
                  Trusted worldwide
                </p>
                <h3 className="mt-3 text-[32px] font-semibold leading-[1.12] tracking-[-0.025em] text-white">
                  Powering quality at the world&apos;s best companies
                </h3>
                <div className="mx-auto mt-8 grid max-w-lg grid-cols-3 gap-6">
                  {["John Deere", "Airbus", "Target"].map((logo) => (
                    <div
                      key={logo}
                      className="flex items-center justify-center rounded-lg border border-white/10 bg-white/5 p-4"
                    >
                      <span className="text-sm font-semibold text-white/50">
                        {logo}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tinted */}
            <div className="bg-[#F8FAFC] px-8 py-14 sm:px-12">
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#0052FF]">
                  Results
                </p>
                <h3 className="mt-3 text-[32px] font-semibold leading-[1.12] tracking-[-0.025em] text-gray-900">
                  Real results from real customers
                </h3>
                <div className="mx-auto mt-8 grid max-w-lg grid-cols-3 gap-6">
                  {[
                    { stat: "70%", label: "Faster" },
                    { stat: "90%", label: "Less meetings" },
                    { stat: "2x", label: "Accountability" },
                  ].map((s) => (
                    <div key={s.stat} className="text-center">
                      <p className="text-3xl font-bold text-gray-900">
                        {s.stat}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dark CTA */}
            <div className="bg-gradient-to-r from-[#0A1628] to-[#0F1D31] px-8 py-14 sm:px-12">
              <div className="mx-auto max-w-2xl text-center">
                <h3 className="text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-white">
                  Ready to unify your quality operations?
                </h3>
                <p className="mx-auto mt-3 max-w-md text-base text-gray-400">
                  Join 500+ regulated companies using Unifize to streamline
                  compliance and accelerate innovation.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <button className="inline-flex h-12 items-center gap-2.5 rounded-xl bg-[#0052FF] px-8 text-[15px] font-semibold text-white hover:bg-[#3378FF]">
                    Book a Demo
                    <ArrowRight className="size-4" />
                  </button>
                  <button className="inline-flex h-12 items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-8 text-[15px] font-semibold text-white hover:bg-white/10">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 8. NAVIGATION                                                */}
        {/* ============================================================ */}
        <section id="navigation" className="scroll-mt-20 pb-28">
          <SectionTitle>Navigation</SectionTitle>
          <SectionDesc>
            Enterprise navs use more visual weight — taller bars, bolder type,
            stronger borders. Compare the current floating pill to heavier
            alternatives.
          </SectionDesc>

          <div className="mt-14 space-y-10">
            {/* Current */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
                Current — Floating pill
              </p>
              <div className="rounded-full border border-[#EEF3FF] bg-white px-6 py-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <span className="text-lg font-bold text-[#0052FF]">
                      unifize
                    </span>
                    <div className="flex gap-4 text-[13px] font-medium text-gray-500">
                      <span>Products</span>
                      <span>Platform</span>
                      <span>Industries</span>
                      <span>Pricing</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-xs text-gray-600">
                      Sign In
                    </button>
                    <button className="h-8 rounded-md bg-[#0052FF] px-4 text-xs font-semibold text-white">
                      Book a Demo
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Enterprise A */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
                Enterprise A — Taller, border-bottom
              </p>
              <div className="border-b-2 border-gray-200 bg-white px-8 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-10">
                    <span className="text-xl font-bold text-gray-900">
                      unifize
                    </span>
                    <div className="flex gap-6 text-sm font-medium text-gray-600">
                      <span className="text-gray-900">Products</span>
                      <span>Platform</span>
                      <span>Industries</span>
                      <span>Pricing</span>
                      <span>Resources</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-sm font-medium text-gray-600 hover:text-gray-900">
                      Sign In
                    </button>
                    <button className="h-10 rounded-lg bg-[#0052FF] px-6 text-sm font-semibold text-white">
                      Book a Demo
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Enterprise B — Dark */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
                Enterprise B — Dark nav
              </p>
              <div className="rounded-xl bg-[#0A1628] px-8 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-10">
                    <span className="text-xl font-bold text-white">
                      unifize
                    </span>
                    <div className="flex gap-6 text-sm font-medium text-white/60">
                      <span className="text-white">Products</span>
                      <span>Platform</span>
                      <span>Industries</span>
                      <span>Pricing</span>
                      <span>Resources</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-sm font-medium text-white/60 hover:text-white">
                      Sign In
                    </button>
                    <button className="h-10 rounded-lg bg-[#0052FF] px-6 text-sm font-semibold text-white">
                      Book a Demo
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Enterprise C — Accent line */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
                Enterprise C — Blue accent line
              </p>
              <div className="border-t-2 border-[#0052FF] bg-white px-8 py-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-10">
                    <span className="text-xl font-bold text-gray-900">
                      unifize
                    </span>
                    <div className="flex gap-6 text-sm font-medium text-gray-500">
                      <span className="border-b-2 border-[#0052FF] pb-4 text-[#0052FF]">
                        Products
                      </span>
                      <span className="pb-4">Platform</span>
                      <span className="pb-4">Industries</span>
                      <span className="pb-4">Pricing</span>
                      <span className="pb-4">Resources</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-sm font-medium text-gray-600 hover:text-gray-900">
                      Sign In
                    </button>
                    <button className="h-10 rounded-lg bg-gray-900 px-6 text-sm font-semibold text-white">
                      Book a Demo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 9. SPACING & DENSITY                                         */}
        {/* ============================================================ */}
        <section id="spacing" className="scroll-mt-20 pb-28">
          <SectionTitle>Spacing</SectionTitle>
          <SectionDesc>
            Enterprise sites vary density intentionally — generous spacing for
            hero/CTA areas, tighter grids for features. Larger max-widths give
            content room to breathe on wide screens.
          </SectionDesc>

          {/* Max Width */}
          <div className="mt-14">
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
              Max Width Comparison
            </p>
            <div className="space-y-4">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mx-auto max-w-[1280px] rounded-lg border-2 border-dashed border-gray-300 bg-white p-3 text-center">
                  <span className="font-mono text-xs text-gray-400">
                    max-w-7xl (1280px) — current
                  </span>
                </div>
              </div>
              <div className="rounded-xl border border-[#0052FF]/20 bg-[#F0F5FF] p-4">
                <div className="mx-auto max-w-[1440px] rounded-lg border-2 border-dashed border-[#0052FF]/30 bg-white p-3 text-center">
                  <span className="font-mono text-xs text-[#0052FF]">
                    max-w-[1440px] — enterprise wide
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Density */}
          <div className="mt-14">
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
              Grid Density
            </p>
            <div className="space-y-8">
              <div>
                <p className="mb-3 text-xs font-medium text-gray-500">
                  3-column — more breathing room
                </p>
                <div className="grid grid-cols-3 gap-5">
                  {[
                    {
                      title: "Proactive Risk Management",
                      desc: "Identify, assess, and address risks early to prevent escalation.",
                      icon: Target,
                    },
                    {
                      title: "Process Accountability",
                      desc: "Establish clear ownership and transparent workflows.",
                      icon: Users,
                    },
                    {
                      title: "Regulatory Adaptability",
                      desc: "Align with changing standards and regulations.",
                      icon: Globe,
                    },
                  ].map((f) => (
                    <div
                      key={f.title}
                      className="rounded-xl border border-gray-200 p-5"
                    >
                      <f.icon className="mb-3 size-5 text-[#0052FF]" />
                      <h4 className="text-sm font-semibold text-gray-900">
                        {f.title}
                      </h4>
                      <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                        {f.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-medium text-gray-500">
                  4-column — higher info density
                </p>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { title: "Risk Management", icon: Target },
                    { title: "Accountability", icon: Users },
                    { title: "Compliance", icon: Globe },
                    { title: "Analytics", icon: BarChart3 },
                  ].map((f) => (
                    <div
                      key={f.title}
                      className="rounded-xl border border-gray-200 p-4 text-center"
                    >
                      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-[#F0F5FF]">
                        <f.icon className="size-5 text-[#0052FF]" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        {f.title}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section Padding */}
          <div className="mt-14">
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
              Section Padding
            </p>
            <div className="space-y-4">
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <div className="bg-gray-50 py-16 text-center">
                  <span className="font-mono text-xs text-gray-400">
                    py-16 (64px) — Current standard
                  </span>
                </div>
              </div>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <div className="bg-gray-50 py-24 text-center">
                  <span className="font-mono text-xs text-gray-400">
                    py-24 (96px) — Enterprise standard
                  </span>
                </div>
              </div>
              <div className="overflow-hidden rounded-xl border border-[#0052FF]/20">
                <div className="bg-[#F0F5FF] py-32 text-center">
                  <span className="font-mono text-xs text-[#0052FF]">
                    py-32 (128px) — Enterprise hero/CTA
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Spacing Token Reference */}
          <div className="mt-14">
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
              Spacing Tokens
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-400">
                    <th className="pb-3 pr-6">Token</th>
                    <th className="pb-3 pr-6">Value</th>
                    <th className="pb-3">Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { token: "--spacing-section-xs", value: "3.75rem (60px)" },
                    { token: "--spacing-section-sm", value: "5.4375rem (87px)" },
                    { token: "--spacing-section-md", value: "6.5rem (104px)" },
                    { token: "--spacing-section-lg", value: "7.5rem (120px)" },
                    { token: "--spacing-section-xl", value: "8.75rem (140px)" },
                    {
                      token: "--spacing-section-2xl",
                      value: "10.5rem (168px)",
                    },
                    {
                      token: "--spacing-section-3xl",
                      value: "12.4375rem (199px)",
                    },
                  ].map((s) => (
                    <tr key={s.token}>
                      <td className="py-3 pr-6 font-mono text-gray-900">
                        {s.token}
                      </td>
                      <td className="py-3 pr-6 font-mono text-gray-500">
                        {s.value}
                      </td>
                      <td className="py-3">
                        <div
                          className="rounded bg-[#0052FF]/10"
                          style={{
                            width: s.value.match(/\d+px/)?.[0] ?? "60px",
                            height: "8px",
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Border Radius Scale */}
          <div className="mt-14">
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
              Border Radius Scale
            </p>
            <div className="flex flex-wrap items-end gap-6">
              {[
                { name: "sm", value: "0.225rem" },
                { name: "md", value: "0.425rem" },
                { name: "lg", value: "0.625rem" },
                { name: "xl", value: "1.025rem" },
                { name: "2xl", value: "1.225rem" },
                { name: "3xl", value: "1.425rem" },
                { name: "4xl", value: "1.625rem" },
              ].map((r) => (
                <div key={r.name} className="text-center">
                  <div
                    className="h-16 w-16 border-2 border-[#0052FF] bg-[#0052FF]/5"
                    style={{ borderRadius: r.value }}
                  />
                  <p className="mt-2 text-xs font-semibold text-gray-900">
                    {r.name}
                  </p>
                  <p className="font-mono text-[11px] text-gray-400">
                    {r.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* End spacer */}
        <div className="h-20" />
      </main>
    </div>
  );
}
