import { motion, useReducedMotion } from "motion/react";
import { Sparkles } from "lucide-react";

const subtleEase = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.32,
            ease: subtleEase,
            when: "beforeChildren" as const,
            staggerChildren: 0.07,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.28, ease: subtleEase },
    },
};

const mediaVariants = {
    hidden: { opacity: 0, y: 14, scale: 0.985 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.32, ease: subtleEase },
    },
};

export default function WhyUnifizeSection() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.section
            className="hero-noise-bg bg-[#FEFEFF] py-20 sm:py-24 lg:py-28"
            variants={containerVariants}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.2 }}
        >
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl text-center">
                    <motion.div variants={itemVariants} className="section-pill mb-5 justify-center sm:mb-6">
                        <span className="section-pill-marker" aria-hidden>
                            <Sparkles className="section-pill-icon" />
                        </span>
                        <span className="section-pill-label">Why Unifize?</span>
                    </motion.div>

                    <motion.h2 variants={itemVariants} className="mx-auto px-2 text-balance text-[28px] font-semibold leading-[1.22] tracking-[-0.015em] text-black sm:px-0 sm:text-[34px] lg:max-w-[24ch] lg:text-[36px] lg:leading-[1.2]">
                        One source of truth for people, processes, and information
                    </motion.h2>

                    <motion.p variants={itemVariants} className="mx-auto mt-5 max-w-[40ch] text-pretty text-[14px] font-normal leading-[1.65] text-black sm:mt-6 sm:text-[15px] lg:max-w-[560px] lg:text-[17px] lg:leading-[1.72]">
                        Reduce risk, boost productivity, and speed time to market.
                    </motion.p>

                    <div className="px-2 sm:px-0">
                        <motion.div variants={mediaVariants} className="mx-auto mt-10 w-full max-w-[884px] overflow-hidden rounded-[20px] border border-[#EEF3FF] bg-[#F4F8FF] p-2 sm:p-2">
                            <div className="aspect-video w-full rounded-[14px] border border-[#EEF3FF] bg-white" />
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
