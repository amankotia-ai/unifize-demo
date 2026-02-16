import { useState } from "react";
import { ChevronLeft, ChevronRight, Check, Quote } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";

type CustomerStory = {
    heading: string;
    description: string;
    bullets: string[];
    visualSrc: string;
    visualAlt: string;
};

const customerStories: CustomerStory[] = [
    {
        heading: "Improved cross-team clarity for Harmonic Bionics.",
        description:
            "Denis Machoka shares how Unifize helped combine communication with quality records so teams always had current context while staying audit-ready.",
        bullets: [
            "Conversations and records stayed in one place.",
            "Teams found the latest information faster.",
            "Implementation was completed in weeks, not months.",
            "Compliance workflows stayed simple and transparent.",
        ],
        visualSrc:
            "https://cdn.prod.website-files.com/6473a18f1599f3a16be86f38/6527cfd60fa29250ae9c5965_we23e23.webp",
        visualAlt: "Harmonic Bionics customer quote by Denis Machoka",
    },
    {
        heading: "Ensured 50% Faster Turnaround for Biovation Labs.",
        description:
            "Learn how and why Biovation Labs, an FDA regulated nutraceutical manufacturer based in Salt Lake City, took the decision to transition from MasterControl to Unifize for their product lifecycle (PLM) and quality management (QMS) processes.",
        bullets: [
            "Centralized chat reduced emails.",
            "All-in-one view for better analysis.",
            "Reduced testing costs and lead times.",
            "No data loss or dual systems.",
        ],
        visualSrc:
            "https://cdn.prod.website-files.com/6473a18f1599f3a16be86f38/652504fea217ddfd9f8c5cec_Jesse324-1.webp",
        visualAlt: "Biovation Labs customer quote by Denis Machoka",
    },
    {
        heading: "Accelerated engineering feedback loops in MedTech.",
        description:
            "Michael Hogan explains how using Unifize improved ownership and traceability so product and quality teams could resolve issues with less delay.",
        bullets: [
            "Faster handoffs between engineering and QA.",
            "Real-time visibility into project status.",
            "Better traceability across product changes.",
            "Less rework from disconnected updates.",
        ],
        visualSrc:
            "https://cdn.prod.website-files.com/6473a18f1599f3a16be86f38/6527d03124e7fba0686b6cb7_a231231.webp",
        visualAlt: "Harmonic Bionics customer quote by Michael Hogan",
    },
    {
        heading: "Reduced issue closure time by 75% in one month.",
        description:
            "The Will-Burt Company consolidated fragmented quality tools into Unifize to increase accountability and drive faster resolution across teams.",
        bullets: [
            "Unified systems replaced siloed workflows.",
            "Ownership and accountability became clearer.",
            "Teams resolved issues in days instead of months.",
            "Decision-making improved with shared context.",
        ],
        visualSrc:
            "https://cdn.prod.website-files.com/6473a18f1599f3a16be86f38/6567022d5947410b25d5d728_Frame%20144.webp",
        visualAlt: "The Will-Burt customer quote card",
    },
];

const sectionVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.32,
            ease: "easeOut" as const,
            when: "beforeChildren" as const,
            staggerChildren: 0.06,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.28, ease: "easeOut" as const },
    },
};

const panelVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.28, ease: "easeOut" as const },
    },
};

const cardSwapVariants = {
    enter: (direction: 1 | -1) => ({
        opacity: 0,
        x: direction === 1 ? 18 : -18,
    }),
    center: {
        opacity: 1,
        x: 0,
    },
    exit: (direction: 1 | -1) => ({
        opacity: 0,
        x: direction === 1 ? -18 : 18,
    }),
};

const navbarBorderClass = "border-[#EEF3FF]";

export default function CustomerTestimonialsSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState<1 | -1>(1);
    const shouldReduceMotion = useReducedMotion();
    const activeStory = customerStories[activeIndex];

    const handlePrevious = () => {
        setDirection(-1);
        setActiveIndex((currentIndex) =>
            currentIndex === 0 ? customerStories.length - 1 : currentIndex - 1
        );
    };

    const handleNext = () => {
        setDirection(1);
        setActiveIndex((currentIndex) =>
            currentIndex === customerStories.length - 1 ? 0 : currentIndex + 1
        );
    };

    return (
        <motion.section
            className="hero-noise-bg bg-[#FEFEFF] py-16 sm:py-20 lg:py-24"
            variants={sectionVariants}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.2 }}
        >
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl text-center">
                    <motion.div variants={itemVariants} className="section-pill mb-5 justify-center sm:mb-6">
                        <span className="section-pill-marker" aria-hidden>
                            <Quote className="section-pill-icon" />
                        </span>
                        <span className="section-pill-label">Customer Stories</span>
                    </motion.div>
                    <motion.h2 variants={itemVariants} className="mx-auto max-w-[22ch] px-2 text-balance text-[28px] font-semibold leading-[1.22] tracking-[-0.015em] text-black sm:px-0 sm:text-[34px] lg:text-[36px] lg:leading-[1.2]">
                        Meet Our Customers
                    </motion.h2>
                    <motion.p variants={itemVariants} className="mx-auto mt-5 max-w-[58ch] text-pretty text-[14px] font-normal leading-[1.65] text-black sm:mt-6 sm:text-[15px] lg:text-[17px] lg:leading-[1.72]">
                        Unifize powers high-impact product teams. From next-gen startups who
                        reach for the stars to established greats who change the world.
                    </motion.p>
                </div>

                <motion.div variants={panelVariants} className="mx-auto mt-8 w-full max-w-6xl sm:mt-10">
                    <div className="overflow-hidden rounded-[24px]">
                        <AnimatePresence initial={false} mode="wait" custom={direction}>
                            <motion.article
                                key={activeIndex}
                                custom={direction}
                                variants={cardSwapVariants}
                                initial={shouldReduceMotion ? { opacity: 1, x: 0 } : "enter"}
                                animate="center"
                                exit={shouldReduceMotion ? { opacity: 1, x: 0 } : "exit"}
                                transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.18, ease: "easeOut" }}
                                className={`rounded-[24px] border bg-white p-5 pt-7 sm:p-6 lg:p-7 ${navbarBorderClass}`}
                            >
                                <div className="grid items-start gap-7 lg:grid-cols-[0.88fr_1.12fr] lg:gap-8">
                                    <div className="flex flex-col">
                                        <h3 className="text-balance text-[24px] font-semibold leading-[1.24] tracking-[-0.015em] text-black sm:text-[26px] lg:text-[28px]">
                                            {activeStory.heading}
                                        </h3>
                                        <p className="mt-4 max-w-[58ch] text-pretty text-[14px] leading-[1.65] text-slate-600 sm:text-[15px] lg:text-[16px]">
                                            {activeStory.description}
                                        </p>

                                        <ul className="mt-6 space-y-3 sm:mt-7 sm:space-y-3.5 lg:mt-8">
                                            {activeStory.bullets.map((point) => (
                                                <li
                                                    key={point}
                                                    className="flex items-center gap-3.5 py-0.5 text-[13px] leading-[1.55] text-slate-600 sm:text-[14px]"
                                                >
                                                    <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#0052FF] text-white">
                                                        <Check className="size-4 stroke-[2.8]" aria-hidden="true" />
                                                    </span>
                                                    <span className="text-pretty">{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className={`w-full self-start overflow-hidden rounded-[20px] border ${navbarBorderClass}`}>
                                        <img
                                            src={activeStory.visualSrc}
                                            alt={activeStory.visualAlt}
                                            className="block h-auto w-full object-cover"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>
                                </div>
                            </motion.article>
                        </AnimatePresence>
                    </div>

                    <motion.div variants={itemVariants} className="mt-6 flex items-center gap-3 sm:mt-7">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={handlePrevious}
                            aria-label="Show previous customer testimonial"
                            className={`size-12 rounded-full border bg-white text-[#7B7F87] shadow-none hover:bg-white ${navbarBorderClass}`}
                        >
                            <ChevronLeft className="size-5" />
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={handleNext}
                            aria-label="Show next customer testimonial"
                            className={`size-12 rounded-full border bg-white text-[#7B7F87] shadow-none hover:bg-white ${navbarBorderClass}`}
                        >
                            <ChevronRight className="size-5" />
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </motion.section>
    );
}
