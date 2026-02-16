import { Button } from "@/components/ui/button";

export default function CTASection() {
    return (
        <section className="py-20 sm:py-28 bg-[#F9FBFF] overflow-hidden">
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-900 via-[#0a2a5e] to-[#0667FF]/20 px-6 py-10 text-white sm:px-8 sm:py-12 lg:px-12">
                    {/* Decorative circles */}
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0667FF]/10 rounded-full blur-3xl" />

                    <div className="relative grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                                Witness first-hand the power of the{" "}
                                <span className="text-[#5A9FFF]">
                                    Unifize platform
                                </span>
                            </h2>
                            <p className="mt-5 text-lg text-white/70 leading-relaxed">
                                Learn how Unifize helps improve compliance, accelerate innovation, and drive operational efficiency.
                            </p>
                            <div className="mt-8">
                                <Button size="lg" className="bg-white text-slate-900 hover:bg-white/90 shadow-xl shadow-black/20">
                                    Book a Demo
                                </Button>
                            </div>
                        </div>

                        {/* Right visual */}
                        <div className="hidden lg:flex items-center justify-center">
                            <div className="relative w-60 aspect-[4/5]">
                                <div className="absolute inset-0 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10" />
                                <div className="absolute inset-4 rounded-xl bg-gradient-to-b from-white/10 to-transparent flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0667FF] flex items-center justify-center shadow-lg mb-4">
                                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-medium text-white/80">Schedule a call</p>
                                        <p className="text-xs text-white/50 mt-1">See it in action</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
