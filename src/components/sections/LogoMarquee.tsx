import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ShieldCheck } from "lucide-react";

const logoAssets = [
    { src: "/logos/64abba5b0e60eb022e3c3b97_-7u2YR-A-8sfRyyFVd036KSSDuIBK1pJeyP7xFgZYjU.png", alt: "Dynamic Blending logo" },
    { src: "/logos/Airbus-Logo.svg", alt: "Airbus logo" },
    { src: "/logos/Applechem.png", alt: "Applechem logo" },
    { src: "/logos/Con-Forms-Logo.png", alt: "Con-Forms logo" },
    { src: "/logos/Engineering-Industries-1.png", alt: "Engineering Industries logo" },
    { src: "/logos/Group-633132.svg", alt: "Client logo" },
    { src: "/logos/John-Deere.png", alt: "John Deere logo" },
    { src: "/logos/King-Agro.png", alt: "King Agro logo" },
    { src: "/logos/Laundrytec.png", alt: "Laundrytec logo" },
    { src: "/logos/LeaderBrand-Produce.png", alt: "LeaderBrand Produce logo" },
    { src: "/logos/PhoMedics-1.png", alt: "PhoMedics logo" },
    { src: "/logos/Recovery-Force-1.png", alt: "Recovery Force logo" },
    { src: "/logos/Red-Sun-Farms.png", alt: "Red Sun Farms logo" },
    { src: "/logos/TTK-Prestige.png", alt: "TTK Prestige logo" },
    { src: "/logos/Target-1.png", alt: "Target logo" },
    { src: "/logos/Vans.png", alt: "Vans logo" },
    { src: "/logos/Yanuvia.png", alt: "Yanuvia logo" },
    { src: "/logos/e6f41e43850cea768e080bcbb8aba89f.png", alt: "Client logo" },
    { src: "/logos/logo-1.png", alt: "Client logo" },
    { src: "/logos/rastelli-logo-modified.svg", alt: "Rastelli logo" },
];

function LogoItem({ src, alt }: { src: string; alt: string }) {
    return (
        <div className="flex h-16 w-40 shrink-0 items-center justify-center px-4 sm:w-44">
            <img src={src} alt={alt} className="h-9 w-auto max-w-full object-contain grayscale" loading="lazy" />
        </div>
    );
}

function InfiniteLogoTrack({
    logos,
    duration,
}: {
    logos: { src: string; alt: string }[];
    duration: number;
}) {
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const sequenceRef = useRef<HTMLDivElement | null>(null);
    const isInView = useInView(viewportRef, { amount: 0.25 });
    const shouldReduceMotion = useReducedMotion();
    const [loopDistance, setLoopDistance] = useState(0);

    useEffect(() => {
        const sequenceNode = sequenceRef.current;
        if (!sequenceNode) return;

        const updateLoopDistance = () => setLoopDistance(sequenceNode.offsetWidth);
        updateLoopDistance();

        const resizeObserver = new ResizeObserver(updateLoopDistance);
        resizeObserver.observe(sequenceNode);

        return () => resizeObserver.disconnect();
    }, [logos.length]);

    if (shouldReduceMotion) {
        return (
            <div className="flex flex-wrap justify-center gap-2 px-4 sm:gap-4">
                {logos.map((logo, index) => (
                    <LogoItem key={`${logo.src}-${index}`} src={logo.src} alt={logo.alt} />
                ))}
            </div>
        );
    }

    const shouldAnimate = isInView && loopDistance > 0;

    return (
        <div ref={viewportRef} className="overflow-hidden">
            <motion.div
                className="flex w-max"
                animate={shouldAnimate ? { x: [0, -loopDistance] } : { x: 0 }}
                transition={
                    shouldAnimate
                        ? {
                            duration,
                            ease: "linear",
                            repeat: Infinity,
                            repeatType: "loop",
                        }
                        : { duration: 0.2, ease: "linear" }
                }
            >
                <div ref={sequenceRef} className="flex shrink-0 gap-2 pr-2 sm:gap-4 sm:pr-4">
                    {logos.map((logo, index) => (
                        <LogoItem key={`${logo.src}-${index}`} src={logo.src} alt={logo.alt} />
                    ))}
                </div>
                <div aria-hidden className="flex shrink-0 gap-2 pr-2 sm:gap-4 sm:pr-4">
                    {logos.map((logo, index) => (
                        <LogoItem key={`${logo.src}-${index}-clone`} src={logo.src} alt={logo.alt} />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

export default function LogoMarquee() {
    return (
        <section className="hero-noise-bg bg-[#FEFEFF] py-14 sm:py-16">
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <div className="section-pill justify-center">
                        <span className="section-pill-marker" aria-hidden>
                            <ShieldCheck className="section-pill-icon" />
                        </span>
                        <span className="section-pill-label">Trusted by regulated teams worldwide</span>
                    </div>
                </div>
            </div>

            <div className="relative z-10 mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden">
                    <div className="pointer-events-none absolute inset-y-0 left-3 z-10 w-16 bg-gradient-to-r from-[#F9FBFF] to-transparent sm:left-4 sm:w-24 lg:left-5 lg:w-28" />
                    <div className="pointer-events-none absolute inset-y-0 right-3 z-10 w-16 bg-gradient-to-l from-[#F9FBFF] to-transparent sm:right-4 sm:w-24 lg:right-5 lg:w-28" />
                    <div className="px-3 py-2 sm:px-4 lg:px-5">
                        <InfiniteLogoTrack logos={logoAssets} duration={28} />
                    </div>
                </div>
            </div>
        </section>
    );
}
