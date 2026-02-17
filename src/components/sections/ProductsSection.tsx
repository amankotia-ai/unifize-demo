import { ArrowLeft, ArrowRight, Boxes, ListChecks, SquarePen } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { useRef, type ReactNode } from "react";

type ProductKey = "dms" | "qms" | "plm" | "mes";

type ProductCard = {
    key: ProductKey;
    title: string;
    description: string;
    link: string;
    linkText: string;
    accent: string;
    surface: string;
    preview: string;
    previewData: ProductPreviewData;
};

type ProductTheme = {
    outerBorder: string;
    innerBorder: string;
    statusBg: string;
    statusText: string;
};

type PreviewRow = {
    label: string;
    value: string;
    checkboxLabel?: string;
    defaultChecked?: boolean;
};

type PreviewMeta = {
    label: string;
    statuses: string[];
    showAvatars?: boolean;
};

type ProductPreviewData = {
    eyebrow: string;
    heading: string;
    rows: PreviewRow[];
    meta?: PreviewMeta;
    accentEyebrow?: boolean;
    marker?: "dot" | "checklist";
};

const avatarImages = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64&q=80",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=64&h=64&q=80",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=64&h=64&q=80",
] as const;

const productCards: ProductCard[] = [
    {
        key: "dms",
        title: "Document Management System",
        description: "Simplify document control, and training, and ensure regulatory compliance.",
        link: "#",
        linkText: "Explore DMS",
        accent: "#EA7432",
        surface: "bg-white",
        preview: "bg-[#FFF8F2]",
        previewData: {
            eyebrow: "Document #07",
            heading: "Supplier evaluation",
            marker: "dot",
            rows: [
                { label: "Assigned Team", value: "4 reviewers assigned" },
            ],
            meta: { label: "Owner", statuses: ["In Progress"], showAvatars: true },
        },
    },
    {
        key: "qms",
        title: "Quality Management System",
        description: "Ensure regulatory compliance, lower quality risks, and enhance audit readiness.",
        link: "#",
        linkText: "Explore QMS",
        accent: "#D3A126",
        surface: "bg-white",
        preview: "bg-[#FFFDF4]",
        previewData: {
            eyebrow: "Audit Information",
            heading: "ISO 9001 Internal Audit",
            accentEyebrow: true,
            rows: [
                { label: "Standard", value: "ISO 9001" },
                { label: "Audit Date", value: "24 Aug 2024" },
            ],
            meta: { label: "Review Team", statuses: ["In Progress"], showAvatars: true },
        },
    },
    {
        key: "plm",
        title: "Product Lifecycle Management",
        description: "Accelerate product development and improve traceability across your product lifecycle.",
        link: "#",
        linkText: "Explore PLM",
        accent: "#8667A8",
        surface: "bg-white",
        preview: "bg-[#FAF7FD]",
        previewData: {
            eyebrow: "Updated",
            heading: "Checklist",
            marker: "checklist",
            rows: [
                { label: "Product Risk ID", value: "RA-2024-002", checkboxLabel: "Mark Product Risk ID complete", defaultChecked: true },
                { label: "Product", value: "BXS-2793N", checkboxLabel: "Mark Product complete" },
            ],
        },
    },
    {
        key: "mes",
        title: "Manufacturing Execution System",
        description: "Gain real-time visibility and optimize the production process with ease.",
        link: "#",
        linkText: "Explore MES",
        accent: "#4EA867",
        surface: "bg-white",
        preview: "bg-[#F6FCF3]",
        previewData: {
            eyebrow: "Inspection #07",
            heading: "Q2 inspection schedule",
            rows: [
                { label: "FG Lot", value: "FS718" },
                { label: "Shipment", value: "#242 to Arizona" },
            ],
            meta: { label: "Dispatch Team", statuses: ["Ready for Shipping", "Scheduled"], showAvatars: true },
        },
    },
];

const productThemes: Record<ProductKey, ProductTheme> = {
    dms: {
        outerBorder: "border-slate-200/70",
        innerBorder: "border-[#FFF1E4]",
        statusBg: "bg-[#FFF1E6]",
        statusText: "text-[#A8540B]",
    },
    qms: {
        outerBorder: "border-slate-200/70",
        innerBorder: "border-[#FFF4CF]",
        statusBg: "bg-[#FFF7D6]",
        statusText: "text-[#8A7000]",
    },
    plm: {
        outerBorder: "border-slate-200/70",
        innerBorder: "border-[#F4EDFC]",
        statusBg: "bg-[#F1EAF8]",
        statusText: "text-[#6A4E8D]",
    },
    mes: {
        outerBorder: "border-slate-200/70",
        innerBorder: "border-[#E5F6DF]",
        statusBg: "bg-[#ECF9E8]",
        statusText: "text-[#237E16]",
    },
};

const subtleEase = [0.16, 1, 0.3, 1] as const;

const sectionVariants = {
    hidden: {},
    visible: {
        transition: {
            when: "beforeChildren" as const,
            delayChildren: 0.26,
            staggerChildren: 0.14,
        },
    },
};

const sectionBackgroundFadeVariants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 0,
        transition: { duration: 0.15, ease: [0.42, 0, 1, 1] as const },
    },
};

const cardsGridVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.08,
        },
    },
};

const headingVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.48, ease: subtleEase },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 14, scale: 0.99 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5, ease: subtleEase },
    },
};

function AvatarGroup() {
    return (
        <div className="flex items-center -space-x-1.5">
            {avatarImages.map((src, index) => (
                <img
                    key={`${src}-${index}`}
                    src={src}
                    alt=""
                    aria-hidden="true"
                    className="size-4 rounded-full border border-white object-cover"
                    loading="lazy"
                    decoding="async"
                />
            ))}
        </div>
    );
}

function StatusPill({ label, theme }: { label: string; theme: ProductTheme }) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full border border-dashed px-2 py-0.5 text-[10px] font-medium",
                theme.statusBg,
                theme.statusText,
            )}
        >
            {label}
        </span>
    );
}

function PreviewShell({ card, theme, children }: { card: ProductCard; theme: ProductTheme; children: ReactNode }) {
    return (
        <div className="h-full p-1.5 lg:p-2">
            <div
                className={cn(
                    "flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border p-2.5",
                    card.key === "dms" ? "shadow-none" : "shadow-[0_14px_34px_-22px_rgba(15,23,42,0.35)]",
                    card.preview,
                    theme.innerBorder,
                )}
            >
                {children}
            </div>
        </div>
    );
}

function PreviewDivider({ theme }: { theme: ProductTheme }) {
    return <div className={cn("my-3.5 border-t border-dashed", theme.innerBorder)} />;
}

function WideInfoRow({
    theme,
    label,
    value,
    checkboxLabel,
    defaultChecked,
}: {
    theme: ProductTheme;
    label: string;
    value: string;
    checkboxLabel?: string;
    defaultChecked?: boolean;
}) {
    return (
        <div className={cn("flex w-full gap-2 border-b border-dashed pb-1.5", theme.innerBorder)}>
            {checkboxLabel ? (
                <input
                    type="checkbox"
                    aria-label={checkboxLabel}
                    defaultChecked={defaultChecked}
                    className="mt-0.5 size-3.5 rounded border-[#CDBAE6] accent-[#6E50A2]"
                />
            ) : null}
            <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase text-slate-500">{label}</p>
                <p className="mt-0.5 text-xs font-semibold text-slate-700">{value}</p>
            </div>
        </div>
    );
}

function WideMetaRow({ children }: { children: ReactNode }) {
    return <div className="w-full pt-1.5">{children}</div>;
}

function ProductPreview({ card }: { card: ProductCard }) {
    const theme = productThemes[card.key];

    if (card.key === "dms") {
        const dmsItems = [
            { reportId: "Inspection Report #07", title: "Draft Revision", status: "In Progress" },
            { reportId: "Inspection Report #08", title: "Pending Approval", status: "Under Review" },
        ] as const;

        return (
            <div className="flex h-full flex-col gap-3 p-1.5 lg:p-2">
                {dmsItems.map((item) => (
                    <div key={item.reportId} className={cn("min-w-0 rounded-2xl border p-2.5", card.preview, theme.innerBorder)}>
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex min-w-0 items-center gap-1.5 text-[10px] font-medium text-slate-700">
                                <ArrowLeft className="size-3 text-[#EA7432]" aria-hidden="true" />
                                <span className="truncate">Processes</span>
                                <span>/</span>
                                <span className="truncate text-slate-600">Produce Specs</span>
                            </div>
                            <button
                                type="button"
                                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#EA7432] px-2 py-1 text-[10px] font-medium text-white"
                            >
                                <SquarePen className="size-2.5" aria-hidden="true" />
                                Edit
                            </button>
                        </div>

                        <div className="mt-2.5 min-w-0">
                            <span className={cn("inline-flex rounded-sm px-2 py-1 text-[10px] font-medium", theme.statusBg, theme.statusText)}>
                                {item.reportId}
                            </span>
                            <h4 className="mt-2 truncate text-[14px] font-semibold leading-tight text-slate-800">{item.title}</h4>
                            <div className="mt-2 flex items-center gap-2">
                                <StatusPill label={item.status} theme={theme} />
                                <AvatarGroup />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    const preview = card.previewData;

    return (
        <PreviewShell card={card} theme={theme}>
            <div className="flex items-start justify-between gap-2.5">
                <div className="flex min-w-0 items-start gap-2">
                    {preview.marker === "checklist" ? (
                        <span
                            className={cn(
                                "inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-dashed bg-[#D7C7EA] text-[#6A4E8D]",
                                theme.innerBorder,
                            )}
                        >
                            <ListChecks className="size-3.5" aria-hidden="true" />
                        </span>
                    ) : null}

                    <div className="min-w-0">
                        <p className={cn("text-[9px] font-semibold uppercase text-slate-500", preview.accentEyebrow && theme.statusText)}>
                            {preview.eyebrow}
                        </p>
                        <h4 className={cn("mt-1 text-[14px] font-semibold leading-tight text-slate-800", preview.marker === "checklist" && "text-[#6E50A2]")}>
                            {preview.heading}
                        </h4>
                    </div>
                </div>

                {preview.marker === "dot" ? <span className={cn("mt-0.5 inline-flex size-2.5 rounded-full", theme.statusBg)} aria-hidden="true" /> : null}
            </div>

            <PreviewDivider theme={theme} />

            <div className="mt-auto space-y-2">
                {preview.rows.map((row) => (
                    <WideInfoRow
                        key={`${row.label}-${row.value}`}
                        theme={theme}
                        label={row.label}
                        value={row.value}
                        checkboxLabel={row.checkboxLabel}
                        defaultChecked={row.defaultChecked}
                    />
                ))}

                {preview.meta ? (
                    <WideMetaRow>
                        <p className="text-[9px] font-semibold uppercase text-slate-500">{preview.meta.label}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                            {preview.meta.statuses.map((status) => (
                                <StatusPill key={status} label={status} theme={theme} />
                            ))}
                            {preview.meta.showAvatars ? <AvatarGroup /> : null}
                        </div>
                    </WideMetaRow>
                ) : null}
            </div>
        </PreviewShell>
    );
}

export default function ProductsSection() {
    const shouldReduceMotion = useReducedMotion();
    const bgTriggerRef = useRef<HTMLDivElement | null>(null);
    const contentTriggerRef = useRef<HTMLDivElement | null>(null);

    const bgInView = useInView(bgTriggerRef, { once: true, margin: "0px 0px -20% 0px" });
    const contentInView = useInView(contentTriggerRef, { once: true, margin: "0px 0px -40% 0px" });

    const sectionAnimationState = shouldReduceMotion ? undefined : contentInView ? "visible" : "hidden";
    const backgroundAnimationState = shouldReduceMotion ? undefined : bgInView ? "visible" : "hidden";

    return (
        <motion.section
            className="hero-noise-bg relative overflow-hidden bg-[#F6F9FF] py-16 sm:py-20 lg:py-24"
            variants={sectionVariants}
            initial={shouldReduceMotion ? false : "hidden"}
            animate={sectionAnimationState}
        >
            <div ref={bgTriggerRef} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px" />
            <div ref={contentTriggerRef} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px" />

            {!shouldReduceMotion ? (
                <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-white"
                    variants={sectionBackgroundFadeVariants}
                    initial="hidden"
                    animate={backgroundAnimationState}
                />
            ) : null}

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl text-center">
                    <motion.div variants={headingVariants} className="section-pill mb-5 justify-center sm:mb-6">
                        <span className="section-pill-marker" aria-hidden>
                            <Boxes className="section-pill-icon" />
                        </span>
                        <span className="section-pill-label">Products</span>
                    </motion.div>
                    <motion.h2 variants={headingVariants} className="px-2 text-balance text-[28px] font-semibold leading-[1.22] tracking-[-0.015em] text-black sm:px-0 sm:text-[34px] lg:text-[36px] lg:leading-[1.2]">
                        Products for every team in the value chain
                    </motion.h2>
                </div>

                <motion.div variants={cardsGridVariants} className="mt-3 grid gap-4 px-4 pb-4 pt-4 sm:mt-4 sm:px-6 sm:pb-6 sm:pt-5 lg:mt-5 lg:grid-cols-2 lg:gap-5 lg:px-9 lg:pb-9 lg:pt-6">
                    {productCards.map((card) => (
                        <motion.article
                            key={card.title}
                            variants={cardVariants}
                            className={cn(
                                "h-full w-full overflow-hidden rounded-3xl border lg:h-[280px]",
                                card.surface,
                                productThemes[card.key].outerBorder,
                            )}
                        >
                            <div className="grid min-h-[220px] grid-rows-[auto_auto] gap-4 p-5 pt-7 sm:p-6 lg:h-full lg:min-h-0 lg:grid-cols-[1.28fr_1fr] lg:grid-rows-1 lg:p-7">
                                <div className="flex flex-col">
                                    <h3 className="text-balance text-[18px] font-semibold leading-[1.24] sm:text-[19px] lg:text-[20px]" style={{ color: card.accent }}>
                                        {card.title}
                                    </h3>
                                    <p className="mt-2.5 max-w-[34ch] text-pretty text-[13px] leading-[1.55] text-slate-500 sm:text-[14px]">
                                        {card.description}
                                    </p>
                                    <a
                                        href={card.link}
                                        className="mt-auto inline-flex items-center gap-2 pt-4 text-[14px] font-medium leading-none sm:text-[15px]"
                                        style={{ color: card.accent }}
                                    >
                                        {card.linkText}
                                        <ArrowRight className="size-4" />
                                    </a>
                                </div>

                                <div className="min-h-[160px] self-start overflow-visible lg:min-h-0">
                                    <div className="h-full w-full origin-top-left -translate-y-2 scale-[1.08] translate-x-3 sm:-translate-y-2.5 sm:scale-[1.1] sm:translate-x-3.5 lg:-translate-y-3 lg:scale-[1.2] lg:translate-x-5">
                                        <ProductPreview card={card} />
                                    </div>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    );
}
