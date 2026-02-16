import { useState, type ComponentType } from "react";
import { Bell, LayoutGrid, Rocket, Search, ShieldCheck, Signpost, Users, Workflow } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { benefitsTabs } from "@/data/siteData";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
    search: Search,
    signpost: Signpost,
    bell: Bell,
    users: Users,
};

const tabMedia: Record<string, {
    imageSrc: string;
    imageAlt: string;
    titleIcon: ComponentType<{ className?: string }>;
    titleIconColor: string;
    titleIconBg: string;
    featureIconColor: string;
    featureIconBg: string;
    featureDividerColor: string;
}> = {
    risk: {
        imageSrc: "/1st_benefit_card.png",
        imageAlt: "Manage risk and compliance customer story visual",
        titleIcon: ShieldCheck,
        titleIconColor: "text-[#8667A8]",
        titleIconBg: "bg-[#F1EAF8]",
        featureIconColor: "text-[#8667A8]",
        featureIconBg: "bg-[#F1EAF8]",
        featureDividerColor: "border-[#E6DAF3]",
    },
    efficiency: {
        imageSrc: "https://cdn.prod.website-files.com/6473a18f1599f3a16be86f38/673f0500e5783a2be3b8651b_Frame%2035d091.png",
        imageAlt: "Drive operational efficiency customer story visual",
        titleIcon: Workflow,
        titleIconColor: "text-[#EA7432]",
        titleIconBg: "bg-[#FFF1E6]",
        featureIconColor: "text-[#EA7432]",
        featureIconBg: "bg-[#FFF1E6]",
        featureDividerColor: "border-[#FFE4CF]",
    },
    innovation: {
        imageSrc: "https://cdn.prod.website-files.com/6473a18f1599f3a16be86f38/673f0429d7d38ff4e8c4fe0c_Frame%2035s091.png",
        imageAlt: "Accelerate innovation customer story visual",
        titleIcon: Rocket,
        titleIconColor: "text-[#4EA867]",
        titleIconBg: "bg-[#ECF9E8]",
        featureIconColor: "text-[#4EA867]",
        featureIconBg: "bg-[#ECF9E8]",
        featureDividerColor: "border-[#DDF2D6]",
    },
};

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

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.28, ease: subtleEase },
    },
};

const panelVariants = {
    hidden: { opacity: 0, y: 14, scale: 0.99 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.3, ease: subtleEase },
    },
};

export default function BenefitsTabsSection() {
    const [activeTab, setActiveTab] = useState("risk");
    const shouldReduceMotion = useReducedMotion();
    const activeCard = benefitsTabs.find((tab) => tab.value === activeTab) ?? benefitsTabs[0];
    const media = tabMedia[activeCard.value];
    const TitleIcon = media.titleIcon;
    const getActiveTabClass = (tabValue: string) => {
        if (tabValue === "risk") {
            return "data-[state=active]:!border-[#8667A8] data-[state=active]:!bg-[#8667A8] data-[state=active]:!text-white";
        }
        if (tabValue === "efficiency") {
            return "data-[state=active]:!border-[#EA7432] data-[state=active]:!bg-[#EA7432] data-[state=active]:!text-white";
        }
        return "data-[state=active]:!border-[#4EA867] data-[state=active]:!bg-[#4EA867] data-[state=active]:!text-white";
    };

    return (
        <motion.section
            className="hero-noise-bg bg-[#F6F9FF] py-16 sm:py-20 lg:py-24"
            variants={sectionVariants}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.2 }}
        >
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl text-center">
                    <motion.div variants={itemVariants} className="section-pill mb-5 justify-center sm:mb-6">
                        <span className="section-pill-marker" aria-hidden>
                            <LayoutGrid className="section-pill-icon" />
                        </span>
                        <span className="section-pill-label">Key Benefits</span>
                    </motion.div>
                    <motion.h2 variants={itemVariants} className="mx-auto max-w-[22ch] px-2 text-balance text-[28px] font-semibold leading-[1.22] tracking-[-0.015em] text-black sm:px-0 sm:text-[34px] lg:text-[36px] lg:leading-[1.2]">
                        Deliver products on time, on budget, and with lower risk
                    </motion.h2>
                    <motion.p variants={itemVariants} className="mx-auto mt-5 max-w-[58ch] text-pretty text-[14px] font-normal leading-[1.65] text-black sm:mt-6 sm:text-[15px] lg:text-[17px] lg:leading-[1.72]">
                        Unifize gives FDA- and ISO-compliant organizations what they need to excel in complex regulatory environments and deliver exceptional customer experiences.
                    </motion.p>
                </div>

                <motion.div variants={panelVariants}>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mx-auto mt-8 w-full max-w-6xl gap-0 sm:mt-10">
                        <div className="mb-6 overflow-x-auto overflow-y-hidden touch-pan-x pl-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mb-8 sm:overflow-visible sm:pl-0">
                            <TabsList className="mx-auto flex h-auto w-max flex-nowrap items-center gap-2 bg-transparent p-0 group-data-[orientation=horizontal]/tabs:!h-auto sm:grid sm:w-full sm:max-w-3xl sm:grid-cols-3 lg:flex lg:w-fit lg:max-w-none lg:grid-cols-none">
                                {benefitsTabs.map((tab) => {
                                    const TabIcon = (tabMedia[tab.value] ?? tabMedia.risk).titleIcon;

                                    return (
                                    <TabsTrigger
                                        key={tab.value}
                                        value={tab.value}
                                        className={cn(
                                            "h-auto min-w-max flex-none rounded-full border border-[#EEF3FF] bg-white px-4 py-2.5 text-[13px] font-medium text-slate-600 transition-colors duration-150 sm:min-w-0 sm:flex-1 sm:text-sm lg:flex-none",
                                            getActiveTabClass(tab.value)
                                        )}
                                    >
                                        <TabIcon
                                            className="size-4 shrink-0 [stroke-width:2.1] [&_path]:fill-current [&_path]:stroke-current [&_circle]:fill-current [&_circle]:stroke-current [&_rect]:fill-current [&_rect]:stroke-current"
                                            aria-hidden="true"
                                        />
                                        <span>{tab.label}</span>
                                    </TabsTrigger>
                                    );
                                })}
                            </TabsList>
                        </div>

                        <TabsContent value={activeCard.value} className="mt-2 px-4 sm:mt-0 sm:px-0">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={activeCard.value}
                                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                                    transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.18, ease: "easeOut" }}
                                >
                                        <div className="rounded-[24px] border border-[#EEF3FF] bg-white p-5 pt-7 sm:p-6 lg:p-7">
                                            <div className="grid gap-7 lg:h-[560px] lg:grid-cols-[0.88fr_1.12fr] lg:gap-8">
                                                <div className="flex h-full flex-col">
                                                    <div>
                                                    <span className={`inline-flex size-14 items-center justify-center rounded-2xl ${media.titleIconBg} ${media.titleIconColor}`}>
                                                        <TitleIcon
                                                            className="size-8 [stroke-width:2.2] [&_path]:fill-current [&_path]:stroke-current [&_circle]:fill-current [&_circle]:stroke-current [&_rect]:fill-current [&_rect]:stroke-current"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                    <h3 className="mt-4 text-balance text-[24px] font-semibold leading-[1.24] tracking-[-0.015em] text-black sm:text-[26px] lg:text-[28px]">
                                                        {activeCard.heading}
                                                    </h3>
                                                    <p className="mt-4 max-w-[58ch] text-pretty text-[14px] leading-[1.65] text-slate-600 sm:text-[15px] lg:text-[16px]">
                                                        {activeCard.description}
                                                    </p>
                                                    </div>

                                                    <ul className="mt-6 sm:mt-7 lg:mt-auto">
                                                        {activeCard.features.map((feature) => {
                                                            const FeatureIcon = iconMap[feature.icon] || Search;

                                                            return (
                                                                <li
                                                                    key={feature.title}
                                                                    className={`flex gap-3.5 border-b border-dashed py-4 last:border-b-0 sm:py-4.5 ${media.featureDividerColor}`}
                                                                >
                                                                    <span className={`inline-flex size-10 shrink-0 items-center justify-center rounded-xl ${media.featureIconBg} ${media.featureIconColor}`}>
                                                                        <FeatureIcon className="size-4" aria-hidden="true" />
                                                                    </span>
                                                                    <div>
                                                                        <h4 className="text-[15px] font-semibold leading-tight tracking-[-0.015em] text-slate-900 sm:text-base">
                                                                            {feature.title}
                                                                        </h4>
                                                                        <p className="mt-1 text-pretty text-[13px] leading-[1.55] text-slate-600 sm:text-[14px]">
                                                                            {feature.desc}
                                                                        </p>
                                                                    </div>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </div>

                                                <div className="hidden overflow-hidden rounded-[20px] border border-[#EEF3FF] sm:block">
                                                    <img
                                                        src={media.imageSrc}
                                                        alt={media.imageAlt}
                                                        className="h-full w-full object-cover"
                                                        loading="lazy"
                                                        decoding="async"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                </motion.div>
                            </AnimatePresence>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>
        </motion.section>
    );
}
