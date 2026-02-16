import { benefitsStats } from "@/data/siteData";
import { TrendingUp } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const statColors = [
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-[#0667FF] to-blue-400",
    "from-amber-500 to-orange-500",
    "from-rose-500 to-red-500",
];

const subtleEase = [0.16, 1, 0.3, 1] as const;

const sectionVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.32,
            ease: subtleEase,
            when: "beforeChildren" as const,
            staggerChildren: 0.06,
        },
    },
};

const headingVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.28, ease: subtleEase },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 14, scale: 0.99 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.3, ease: subtleEase },
    },
};

const quoteVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: subtleEase },
    },
};

export default function BenefitsStatsSection() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.section
            className="bg-[#F9FBFF] py-20 sm:py-28"
            variants={sectionVariants}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.2 }}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div variants={headingVariants} className="mx-auto mb-16 max-w-3xl text-center">
                    <div className="section-pill mb-6 justify-center">
                        <span className="section-pill-marker" aria-hidden>
                            <TrendingUp className="section-pill-icon" />
                        </span>
                        <span className="section-pill-label">Benefits</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
                        Driving measurable impact across the organization
                    </h2>
                    <p className="mt-5 text-lg text-muted-foreground">
                        Transform your operations with tangible benefits.
                    </p>
                </motion.div>

                <motion.div variants={headingVariants} className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {benefitsStats.map((item, i) => (
                        <motion.div
                            key={i}
                            variants={cardVariants}
                            className={`group relative rounded-2xl bg-slate-50 border border-border/40 p-8 transition-all hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1 ${i >= 3 ? "sm:col-span-1 lg:col-span-1" : ""
                                } ${i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}`}
                        >
                            <div className={`text-4xl sm:text-5xl font-black bg-gradient-to-r ${statColors[i]} bg-clip-text text-transparent mb-3`}>
                                {item.stat}
                            </div>
                            <h3 className="text-base font-bold text-foreground mb-2">{item.label}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Testimonial quote */}
                <motion.div variants={quoteVariants} className="mx-auto mt-12 max-w-3xl">
                    <div className="rounded-2xl bg-blue-50 border border-blue-100/50 p-8 sm:p-10 text-center">
                        <p className="text-lg sm:text-xl text-foreground/80 italic leading-relaxed">
                            "The platform has given us the opportunity to be 100% transparent with each other and allowed for collaborative efforts to ensure all processes are aligned, streamlined, and effective."
                        </p>
                        <div className="mt-6">
                            <p className="font-semibold text-foreground">Mikala S</p>
                            <p className="text-sm text-muted-foreground">Food and Beverages</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
}
