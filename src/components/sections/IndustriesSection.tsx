import { useMemo, useState, type ComponentType } from "react";
import { Factory, FlaskConical, FolderOpen, GraduationCap, Leaf, Microscope, Pill, Plane, Sparkles, Stethoscope, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type IndustryTab = {
    value: string;
    label: string;
    icon: ComponentType<{ className?: string }>;
};

type IndustryFeature = {
    title: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
};

type IndustryContent = {
    lead: string;
    features: IndustryFeature[];
};

const industryTabs: IndustryTab[] = [
    { value: "all", label: "All", icon: Factory },
    { value: "medical-devices", label: "Medical Devices", icon: Stethoscope },
    { value: "manufacturing", label: "Manufacturing", icon: Factory },
    { value: "nutritional-supplements", label: "Nutritional Supplements", icon: Pill },
    { value: "aerospace-defence", label: "Aerospace & Defence", icon: Plane },
    { value: "food-production", label: "Food Production", icon: Utensils },
    { value: "cosmetics", label: "Cosmetics", icon: Sparkles },
    { value: "contract-research", label: "Contract Research", icon: Microscope },
    { value: "laboratories", label: "Laboratories", icon: FlaskConical },
];

const sharedFeatures: IndustryFeature[] = [
    {
        title: "Product & Raw Material Specifications",
        description: "Manage product and raw material specs in one place.",
        icon: Leaf,
    },
    {
        title: "Document Management",
        description: "Control and track compliance documents with full visibility.",
        icon: FolderOpen,
    },
    {
        title: "Training",
        description: "Keep teams trained on quality and safety procedures.",
        icon: GraduationCap,
    },
];

const contentByIndustry: Record<string, IndustryContent> = {
    all: {
        lead: "Unifize helps regulated teams streamline audits, complaint tracking, and supplier quality processes to ensure compliance and superior product standards.",
        features: sharedFeatures,
    },
    "medical-devices": {
        lead: "Unifize modernizes medical device quality operations with robust document control, training, and process traceability for FDA and ISO compliance.",
        features: sharedFeatures,
    },
    manufacturing: {
        lead: "Unifize brings manufacturing quality and operations together with structured workflows, controlled records, and real-time accountability.",
        features: sharedFeatures,
    },
    "nutritional-supplements": {
        lead: "Unifize revolutionizes nutraceutical quality management with seamless audits, complaint tracking, and robust supplier quality management, ensuring compliance and superior product standards.",
        features: sharedFeatures,
    },
    "aerospace-defence": {
        lead: "Unifize supports aerospace and defence teams with strict process control, audit readiness, and traceable execution across critical workflows.",
        features: sharedFeatures,
    },
    "food-production": {
        lead: "Unifize strengthens food production compliance with controlled specifications, quality checks, and standardized process execution.",
        features: sharedFeatures,
    },
    cosmetics: {
        lead: "Unifize helps cosmetics teams protect product quality with controlled formulas, documentation, and consistent compliance workflows.",
        features: sharedFeatures,
    },
    "contract-research": {
        lead: "Unifize helps contract research teams run compliant, collaborative workflows with complete visibility across process records and approvals.",
        features: sharedFeatures,
    },
    laboratories: {
        lead: "Unifize helps laboratories centralize quality workflows, document control, and training to improve consistency and audit readiness.",
        features: sharedFeatures,
    },
};

const processNodes = [
    { label: "Incoming RM", tone: "bg-[#0052FF]/10 border-[#0052FF]/20 text-[#0052FF]" },
    { label: "QA Check", tone: "bg-[#E9FAEC] border-[#C7EBCF] text-[#256F35]" },
    { label: "Blending", tone: "bg-[#FFF4E5] border-[#FFD7AD] text-[#9A4B00]" },
    { label: "Lab Review", tone: "bg-[#F3EEFF] border-[#DCCEFF] text-[#5B4390]" },
    { label: "Batch Record", tone: "bg-[#FFEFF3] border-[#FFCFE0] text-[#A23966]" },
    { label: "Release", tone: "bg-[#ECF9E8] border-[#CBEDC0] text-[#2F7E1F]" },
    { label: "Packaging", tone: "bg-[#FFF7E6] border-[#FFE2B4] text-[#8E5A00]" },
    { label: "COA", tone: "bg-[#0052FF]/10 border-[#0052FF]/20 text-[#0052FF]" },
    { label: "Dispatch", tone: "bg-[#E9FAEC] border-[#C7EBCF] text-[#256F35]" },
    { label: "CAPA", tone: "bg-[#FFF0EE] border-[#FFD4CD] text-[#A1432E]" },
];

const solidTabIconClass = "size-[14px] [stroke-width:2.2] [&_path]:fill-current [&_path]:stroke-current [&_circle]:fill-current [&_circle]:stroke-current [&_rect]:fill-current [&_rect]:stroke-current";

export default function IndustriesSection() {
    const [activeIndustry, setActiveIndustry] = useState("nutritional-supplements");
    const activeContent = useMemo(
        () => contentByIndustry[activeIndustry] ?? contentByIndustry.all,
        [activeIndustry],
    );
    const activeTab = useMemo(
        () => industryTabs.find((tab) => tab.value === activeIndustry) ?? industryTabs[0],
        [activeIndustry],
    );
    const ActiveTabIcon = activeTab.icon;

    return (
        <section className="hero-noise-bg bg-[#F6F9FF] py-16 sm:py-20 lg:py-24">
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl text-center">
                    <div className="section-pill mb-5 justify-center sm:mb-6">
                        <span className="section-pill-marker" aria-hidden>
                            <Factory className="section-pill-icon" />
                        </span>
                        <span className="section-pill-label">Industries</span>
                    </div>

                    <h2 className="mx-auto max-w-[24ch] px-2 text-balance text-[28px] font-semibold leading-[1.22] tracking-[-0.015em] text-black sm:px-0 sm:text-[34px] lg:text-[36px] lg:leading-[1.2]">
                        Unifize adapts to the unique requirements of your industry
                    </h2>
                    <p className="mx-auto mt-5 max-w-[58ch] text-pretty text-[14px] font-normal leading-[1.65] text-black sm:mt-6 sm:text-[15px] lg:text-[17px] lg:leading-[1.72]">
                        Enhance collaboration and streamline processes for all industries.
                    </p>
                </div>

                <Tabs value={activeIndustry} onValueChange={setActiveIndustry} className="mx-auto mt-8 w-full max-w-6xl gap-0 sm:mt-10">
                    <div className="sm:pl-0">
                        <TabsList className="mx-auto flex h-auto w-full max-w-5xl flex-wrap items-center justify-center gap-2 bg-transparent p-0 group-data-[orientation=horizontal]/tabs:!h-auto sm:gap-3">
                            {industryTabs.map((tab) => {
                                const Icon = tab.icon;

                                return (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className={cn(
                                        "h-auto min-w-max flex-none rounded-full border border-[#EEF3FF] bg-white px-4 py-2.5 text-[13px] font-medium text-slate-600 transition-colors duration-150 sm:text-sm",
                                        "data-[state=active]:!border-[#0052FF] data-[state=active]:!bg-[#0052FF] data-[state=active]:!text-white",
                                    )}
                                >
                                    <Icon className={solidTabIconClass} aria-hidden="true" />
                                    <span>{tab.label}</span>
                                </TabsTrigger>
                                );
                            })}
                        </TabsList>
                    </div>
                </Tabs>

                <div className="mx-auto mt-10 grid w-full max-w-6xl gap-8 px-4 sm:px-0 lg:mt-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
                    <div className="flex h-full flex-col lg:min-h-[548px]">
                        <div className="flex flex-col items-start gap-3">
                            <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#0052FF]/10 text-[#0052FF]">
                                <ActiveTabIcon className={cn(solidTabIconClass, "size-8")} aria-hidden="true" />
                            </span>
                            <h3 className="text-balance text-[24px] font-semibold leading-[1.24] tracking-[-0.015em] text-black sm:text-[26px] lg:text-[28px]">
                                {activeTab.label}
                            </h3>
                        </div>
                        <p className="mt-3 max-w-[60ch] text-pretty text-[14px] font-normal leading-[1.65] text-slate-600 sm:text-[15px] lg:text-[16px]">
                            {activeContent.lead}
                        </p>

                        <div className="mt-8 flex flex-col lg:mt-auto lg:pt-10">
                            <ul>
                                {activeContent.features.map((feature) => {
                                    const FeatureIcon = feature.icon;

                                    return (
                                        <li
                                            key={feature.title}
                                            className="flex gap-3.5 border-b border-dashed border-[#D9E5FF] py-4 last:border-b-0 sm:py-4.5"
                                        >
                                            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#0052FF]/10 text-[#0052FF]">
                                                <FeatureIcon
                                                    className="size-4 [stroke-width:2.2] [&_path]:fill-current [&_path]:stroke-current [&_circle]:fill-current [&_circle]:stroke-current [&_rect]:fill-current [&_rect]:stroke-current"
                                                    aria-hidden
                                                />
                                            </span>
                                            <div>
                                                <h4 className="text-[15px] font-semibold leading-tight tracking-[-0.015em] text-slate-900 sm:text-base">
                                                    {feature.title}
                                                </h4>
                                                <p className="mt-1 text-pretty text-[13px] leading-[1.55] text-slate-600 sm:text-[14px]">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>

                            <div className="mt-4 flex flex-wrap items-center gap-3">
                                <a
                                    href="#"
                                    className="inline-flex h-10 items-center justify-center rounded-[12px] border border-[#0052FF] bg-[#0052FF] px-6 text-[14px] font-medium text-white transition-colors hover:bg-[#0052FF]"
                                >
                                    View All
                                </a>
                                <a
                                    href="#"
                                    className="inline-flex h-10 items-center justify-center rounded-[12px] border border-[#0052FF] bg-transparent px-6 text-[14px] font-medium text-[#0052FF] transition-colors hover:bg-white/70"
                                >
                                    View Demo
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[26px] border border-[#0052FF]/12 bg-white p-4 sm:p-6">
                        <div className="relative min-h-[420px] overflow-hidden rounded-[20px] bg-[#F9FBFF] p-5 sm:min-h-[500px] sm:p-7">
                            <div className="absolute left-6 right-6 top-7 rounded-2xl border border-[#0052FF]/12 bg-white/90 p-4 sm:left-8 sm:right-8 sm:p-5">
                                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                                    {processNodes.map((node) => (
                                        <div
                                            key={node.label}
                                            className={cn(
                                                "rounded-md border px-2.5 py-2 text-center text-[10px] font-medium leading-tight sm:text-[11px]",
                                                node.tone,
                                            )}
                                        >
                                            {node.label}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="absolute bottom-9 left-1/2 w-[74%] -translate-x-1/2 rounded-2xl border border-[#0052FF]/12 bg-white/90 p-4 sm:bottom-12 sm:w-[72%] sm:p-5">
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                    <div className="rounded-md border border-[#0052FF]/20 bg-[#0052FF]/10 px-2 py-2 text-center text-[10px] font-medium text-[#0052FF] sm:text-[11px]">
                                        Workflow
                                    </div>
                                    <div className="rounded-md border border-[#C7EBCF] bg-[#E9FAEC] px-2 py-2 text-center text-[10px] font-medium text-[#256F35] sm:text-[11px]">
                                        Quality
                                    </div>
                                    <div className="rounded-md border border-[#FFD4CD] bg-[#FFF0EE] px-2 py-2 text-center text-[10px] font-medium text-[#A1432E] sm:text-[11px]">
                                        Compliance
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="absolute left-1/2 top-1/2 inline-flex h-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[12px] bg-[#0052FF] px-6 text-[15px] font-medium text-white"
                            >
                                View Process Map
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
