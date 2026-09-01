import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import { ArrowRight, TrendingUp, Clock, Zap, Eye } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import Navbar from "@/components/sections/Navbar";
import LogoMarquee from "@/components/sections/LogoMarquee";
import WhyUnifizeSection from "@/components/sections/WhyUnifizeSection";
import ProductsSection from "@/components/sections/ProductsSection";
import IndustriesSection from "@/components/sections/IndustriesSection";
import BenefitsTabsSection from "@/components/sections/BenefitsTabsSection";
import CustomerTestimonialsSection from "@/components/sections/CustomerTestimonialsSection";
import Footer from "@/components/sections/Footer";

/* ------------------------------------------------------------------ */
/*  Shared animation helpers                                          */
/* ------------------------------------------------------------------ */
const subtleEase = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: subtleEase },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

/* ------------------------------------------------------------------ */
/*  Stats data                                                        */
/* ------------------------------------------------------------------ */
const stats = [
  { stat: "70%", label: "Faster time-to-market", source: "Biovation Labs", icon: TrendingUp },
  { stat: "90%", label: "Fewer meetings", source: "Harmonic Bionics", icon: Clock },
  { stat: "75%", label: "Faster issue closure", source: "Will-Burt Company", icon: Zap },
  { stat: "100%", label: "Process visibility", source: "Red Sun Farms", icon: Eye },
];

const statColors = [
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-[#0667FF] to-blue-400",
  "from-amber-500 to-orange-500",
];

const statsSectionVariants = {
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

const statsHeadingVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: subtleEase },
  },
};

const statsCardVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.99 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: subtleEase },
  },
};

/* ================================================================== */
/*  ENTERPRISE HOMEPAGE                                               */
/* ================================================================== */
export default function HomeEnterprise() {
  const shouldReduceMotion = useReducedMotion();
  const [lottieData, setLottieData] = useState(null);
  const lottieRef = useRef(null);

  useEffect(() => {
    fetch("/Hero Lottie Fast Loop FINAL.json")
      .then((res) => res.json())
      .then((data) => setLottieData(data))
      .catch(() => {});
  }, []);

  const initial = shouldReduceMotion ? false : "hidden";

  return (
    <div className="benchling-theme min-h-screen bg-surface-subtle">
      <Navbar />

      <main>
        {/* ============================================================ */}
        {/* 1. DARK HERO                                                 */}
        {/* ============================================================ */}
        <section className="relative overflow-hidden bg-[var(--heading)]">
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid min-h-[80dvh] items-center gap-8 pb-8 pt-28 sm:min-h-[86dvh] sm:gap-10 sm:pb-12 sm:pt-36 lg:min-h-[95dvh] lg:grid-cols-2 lg:gap-6 lg:py-0">
              {/* Left */}
              <motion.div
                className="mx-auto flex max-w-[560px] flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left"
                variants={staggerContainer}
                initial={initial}
                animate="visible"
              >
                {/* Social proof pill */}
                <motion.div
                  variants={fadeUp}
                  className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold text-white/80">
                    Trusted by 500+ regulated companies
                  </span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                  variants={fadeUp}
                  className="text-balance text-[31px] font-semibold leading-[1.22] tracking-[-0.015em] text-white sm:text-[40px] lg:text-[36px] lg:leading-[1.2]"
                >
                  <span className="block leading-[1.22] lg:leading-[1.2]">
                    The Unified Platform for Quality, Ops & Product Teams
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  variants={fadeUp}
                  className="mt-6 max-w-[40ch] text-pretty text-[14px] font-normal leading-[1.65] text-slate-300 sm:text-[15px] lg:max-w-[460px] lg:text-[17px] lg:leading-[1.72]"
                >
                  Streamline compliance, accelerate innovation, and eliminate
                  silos — built for ISO and FDA-regulated companies.
                </motion.p>

                {/* Email capture pill */}
                <motion.div variants={fadeUp} className="mt-6 flex w-full max-w-[460px] items-center gap-2 rounded-[22px] border border-white/10 bg-white/5 p-[12px] pl-[14px] backdrop-blur-sm sm:p-[14px] sm:pl-[16px]">
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="h-10 min-w-0 flex-1 border-none bg-transparent px-2 text-[14px] leading-[18px] font-medium text-white placeholder:text-white/40 outline-none sm:h-11 sm:text-[15px]"
                  />
                  <button className="inline-flex h-10 shrink-0 items-center gap-2 rounded-[8px] bg-cta px-[14px] text-[13px] font-medium leading-[18px] whitespace-nowrap text-cta-foreground transition-colors hover:bg-cta/80 sm:h-[40px] sm:px-[18px] sm:text-[14px]">
                    Book a Demo
                    <ArrowRight className="size-3.5" />
                  </button>
                </motion.div>

                {/* Review Badges */}
                <motion.div variants={fadeUp} className="mt-8 w-full max-w-[620px]">
                  <img
                    src="/badges.png"
                    alt="Rated on Capterra, Software Advice, G2 & Gartner"
                    className="mx-auto h-auto w-[88%] opacity-90 sm:w-[82%] lg:mx-0 lg:w-[72%]"
                  />
                </motion.div>
              </motion.div>

              {/* Right — Lottie */}
              <div className="relative hidden items-center justify-center md:flex lg:justify-end">
                <div className="relative w-full max-w-3xl lg:max-w-[54rem] lg:translate-x-4">
                  {lottieData ? (
                    <Lottie
                      lottieRef={lottieRef}
                      animationData={lottieData}
                      loop={false}
                      autoplay
                      className="h-auto w-full"
                      style={{ filter: "brightness(1.1)" }}
                    />
                  ) : (
                    <div className="aspect-square w-full animate-pulse rounded-3xl bg-white/5" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 2. BODY — Section frame system                               */}
        {/* ============================================================ */}
        <div className="section-frame-range">
          <div aria-hidden className="section-frame-rails">
            <span className="section-frame-rail section-frame-rail-left" />
            <span className="section-frame-rail section-frame-rail-right" />
          </div>

          <div className="section-frame-block section-frame-block-logo">
            <span aria-hidden className="section-frame-divider" />
            <LogoMarquee />
          </div>

          <div className="section-frame-block">
            <span aria-hidden className="section-frame-divider" />
            <WhyUnifizeSection />
          </div>

          <div className="section-frame-block">
            <span aria-hidden className="section-frame-divider" />
            <ProductsSection />
          </div>

          {/* Enterprise Stats */}
          <div className="section-frame-block">
            <span aria-hidden className="section-frame-divider" />
            <motion.section
              className="hero-noise-bg bg-surface-subtle py-16 sm:py-20 lg:py-24"
              variants={statsSectionVariants}
              initial={shouldReduceMotion ? false : "hidden"}
              whileInView={shouldReduceMotion ? undefined : "visible"}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div variants={statsHeadingVariants} className="mx-auto mb-12 max-w-2xl text-center sm:mb-14">
                  <div className="section-pill mb-5 justify-center sm:mb-6">
                    <span className="section-pill-marker" aria-hidden>
                      <TrendingUp className="section-pill-icon" />
                    </span>
                    <span className="section-pill-label">Real Results</span>
                  </div>
                  <h2 className="text-balance text-[28px] font-semibold leading-[1.22] tracking-[-0.015em] text-heading sm:text-[34px] lg:text-[36px] lg:leading-[1.2]">
                    Measurable impact from day one
                  </h2>
                  <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-body-muted sm:mt-4 sm:text-base">
                    Real outcomes from regulated companies using Unifize.
                  </p>
                </motion.div>

                <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
                  {stats.map((s, i) => (
                    <motion.div
                      key={s.stat}
                      variants={statsCardVariants}
                      className="group rounded-2xl border border-border/40 bg-white p-6 transition-shadow hover:shadow-lg hover:shadow-slate-200/60 sm:p-7"
                    >
                      <div className={`text-[40px] font-bold leading-none tracking-tight bg-gradient-to-r ${statColors[i]} bg-clip-text text-transparent sm:text-[44px]`}>
                        {s.stat}
                      </div>
                      <h3 className="mt-2 text-[15px] font-semibold text-heading">
                        {s.label}
                      </h3>
                      <p className="mt-2 text-[13px] leading-relaxed text-body-muted/70">
                        — {s.source}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          </div>

          <div className="section-frame-block">
            <span aria-hidden className="section-frame-divider" />
            <IndustriesSection />
          </div>

          <div className="section-frame-block">
            <span aria-hidden className="section-frame-divider" />
            <BenefitsTabsSection />
          </div>

          <div className="section-frame-block section-frame-block-last">
            <span aria-hidden className="section-frame-divider" />
            <CustomerTestimonialsSection />
            <span aria-hidden className="section-frame-bottom-dots" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
