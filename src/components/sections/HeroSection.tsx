import { useEffect, useState, useRef } from "react";
import Lottie from "lottie-react";

const words = [
    "Improve Collaboration",
    "Accelerate Innovation",
    "Manage Risk",
    "Drive Accountability",
    "Enhance Efficiency",
];

export default function HeroSection() {
    const [displayText, setDisplayText] = useState("");
    const [wordIndex, setWordIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [lottieData, setLottieData] = useState(null);
    const lottieRef = useRef(null);

    // Load Lottie JSON
    useEffect(() => {
        fetch("/Hero Lottie Fast Loop FINAL.json")
            .then((res) => res.json())
            .then((data) => setLottieData(data))
            .catch((err) => console.error("Failed to load Lottie:", err));
    }, []);

    useEffect(() => {
        const currentWord = words[wordIndex];
        const timeout = setTimeout(() => {
            if (!isDeleting) {
                setDisplayText(currentWord.slice(0, charIndex + 1));
                setCharIndex((prev) => prev + 1);
                if (charIndex + 1 === currentWord.length) {
                    setTimeout(() => setIsDeleting(true), 1200);
                    return;
                }
            } else {
                setDisplayText(currentWord.slice(0, charIndex));
                setCharIndex((prev) => prev - 1);
                if (charIndex === 0) {
                    setIsDeleting(false);
                    setWordIndex((prev) => (prev + 1) % words.length);
                }
            }
        }, isDeleting ? 35 : 50);
        return () => clearTimeout(timeout);
    }, [charIndex, isDeleting, wordIndex]);

    return (
        <section className="hero-noise-bg relative overflow-hidden bg-[#F6F9FF]">
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid min-h-[80dvh] items-center gap-8 pb-8 pt-28 sm:min-h-[86dvh] sm:gap-10 sm:pb-12 sm:pt-36 lg:min-h-[95dvh] lg:grid-cols-2 lg:gap-6 lg:py-0">
                    {/* Left Content */}
                    <div className="mx-auto flex max-w-[560px] flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left">
                        {/* Heading */}
                        <h1 className="text-balance text-[31px] font-semibold leading-[1.22] capitalize tracking-[-0.015em] text-black sm:text-[40px] lg:text-[36px] lg:leading-[1.2]">
                            <span className="block leading-[1.22] lg:leading-[1.2]">
                                How effective product development, operations, and quality teams
                            </span>
                            <span className="block leading-[1.22] text-[#0052FF] lg:leading-[1.2]">
                                {displayText}
                                <span className="animate-pulse">|</span>
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="mt-6 max-w-[40ch] text-pretty text-[14px] font-normal leading-[1.65] text-black sm:text-[15px] lg:max-w-[460px] lg:text-[17px] lg:leading-[1.72]">
                            Unify your processes, enhance collaboration, and accelerate decision-making with Unifize—built for ISO and FDA-regulated companies.
                        </p>

                        {/* Email Form — pill container */}
                        <div className="mt-6 flex w-full max-w-[460px] items-center gap-2 rounded-[22px] border border-[#EEF3FF] bg-white p-[12px] pl-[14px] sm:p-[14px] sm:pl-[16px]">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="h-10 min-w-0 flex-1 border-none bg-transparent px-2 text-[14px] leading-[18px] font-medium text-black placeholder:text-[#646464] outline-none sm:h-11 sm:text-[15px]"
                            />
                            <button className="h-10 shrink-0 rounded-[8px] border border-[#0052FF] bg-[#0052FF] px-[14px] text-[13px] font-medium leading-[18px] whitespace-nowrap text-white transition-colors hover:bg-[#0052FF] sm:h-[40px] sm:px-[18px] sm:text-[14px]">
                                Book a Demo
                            </button>
                        </div>

                        {/* Review Badges */}
                        <div className="mt-8 w-full max-w-[620px]">
                            <img src="/badges.png" alt="Rated on Capterra, Software Advice, G2 & Gartner" className="mx-auto h-auto w-[88%] sm:w-[82%] lg:mx-0 lg:w-[72%]" />
                        </div>
                    </div>

                    {/* Right Side - Lottie Animation */}
                    <div className="relative mt-2 hidden items-center justify-center md:flex lg:mt-0 lg:justify-end">
                        <div className="relative w-full max-w-3xl lg:max-w-[54rem] lg:translate-x-4">
                            {lottieData ? (
                                <Lottie
                                    lottieRef={lottieRef}
                                    animationData={lottieData}
                                    loop={false}
                                    autoplay={true}
                                    className="w-full h-auto"
                                />
                            ) : (
                                <div className="w-full aspect-square rounded-3xl bg-slate-50 animate-pulse" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
