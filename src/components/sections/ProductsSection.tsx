import { ArrowRight, Boxes, FileText, ShieldCheck, RefreshCcw, Factory, type LucideIcon } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

type ProductKey = "dms" | "qms" | "plm" | "mes";

type ProductCard = {
    key: ProductKey;
    title: string;
    shortName: string;
    description: string;
    link: string;
    linkText: string;
    accent: string;
    icon: LucideIcon;
};

const productCards: ProductCard[] = [
    {
        key: "dms",
        title: "Document Management",
        shortName: "DMS",
        description: "Simplify document control, training, and regulatory compliance.",
        link: "#",
        linkText: "Explore DMS",
        accent: "#EA7432",
        icon: FileText,
    },
    {
        key: "qms",
        title: "Quality Management",
        shortName: "QMS",
        description: "Lower quality risks and enhance audit readiness.",
        link: "#",
        linkText: "Explore QMS",
        accent: "#D3A126",
        icon: ShieldCheck,
    },
    {
        key: "plm",
        title: "Product Lifecycle",
        shortName: "PLM",
        description: "Accelerate product development and improve traceability.",
        link: "#",
        linkText: "Explore PLM",
        accent: "#8667A8",
        icon: RefreshCcw,
    },
    {
        key: "mes",
        title: "Manufacturing Execution",
        shortName: "MES",
        description: "Real-time visibility and production process optimization.",
        link: "#",
        linkText: "Explore MES",
        accent: "#4EA867",
        icon: Factory,
    },
];

const subtleEase = [0.16, 1, 0.3, 1] as const;

const sectionVariants = {
    hidden: {},
    visible: {
        transition: {
            when: "beforeChildren" as const,
            delayChildren: 0.2,
            staggerChildren: 0.1,
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
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: subtleEase },
    },
};


export default function ProductsSection() {
    const shouldReduceMotion = useReducedMotion();
    const triggerRef = useRef<HTMLDivElement | null>(null);
    const inView = useInView(triggerRef, { once: true, margin: "0px 0px -30% 0px" });
    const animationState = shouldReduceMotion ? undefined : inView ? "visible" : "hidden";

    return (
        <motion.section
            className="hero-noise-bg relative overflow-hidden bg-[#F6F9FF] py-16 sm:py-20 lg:py-24"
            variants={sectionVariants}
            initial={shouldReduceMotion ? false : "hidden"}
            animate={animationState}
        >
            <div ref={triggerRef} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <motion.div variants={headingVariants} className="section-pill mb-5 justify-center sm:mb-6">
                        <span className="section-pill-marker" aria-hidden>
                            <Boxes className="section-pill-icon" />
                        </span>
                        <span className="section-pill-label">Products</span>
                    </motion.div>
                    <motion.h2
                        variants={headingVariants}
                        className="text-balance text-[28px] font-semibold leading-[1.22] tracking-[-0.015em] text-heading sm:text-[34px] lg:text-[36px] lg:leading-[1.2]"
                    >
                        Products for every team in the value chain
                    </motion.h2>
                    <motion.p
                        variants={headingVariants}
                        className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-body-muted sm:mt-4 sm:text-base"
                    >
                        A unified platform with purpose-built modules for quality, documents, products, and manufacturing.
                    </motion.p>
                </div>

                <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-5">
                    {productCards.map((card) => (
                        <motion.article
                            key={card.key}
                            variants={cardVariants}
                            className="group flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 transition-shadow hover:shadow-lg hover:shadow-slate-200/60 sm:p-6"
                        >
                            <div
                                className="mb-4 inline-flex size-11 items-center justify-center rounded-xl text-white"
                                style={{ backgroundColor: card.accent }}
                            >
                                <card.icon className="size-5" strokeWidth={2} />
                            </div>

                            <h3 className="text-[17px] font-semibold leading-snug text-heading sm:text-[18px]">
                                {card.title}
                            </h3>
                            <p className="mt-2 text-[13px] leading-relaxed text-body-muted sm:text-[14px]">
                                {card.description}
                            </p>

                            <a
                                href={card.link}
                                className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[14px] font-medium transition-colors"
                                style={{ color: card.accent }}
                            >
                                {card.linkText}
                                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                            </a>
                        </motion.article>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}
