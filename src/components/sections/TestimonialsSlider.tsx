import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { testimonials } from "@/data/siteData";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

export default function TestimonialsSlider() {
    const [current, setCurrent] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % testimonials.length);
    }, []);

    const prev = useCallback(() => {
        setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }, []);

    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(next, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, next]);

    const testimonial = testimonials[current];

    return (
        <section className="py-20 sm:py-28 bg-[#F9FBFF] overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="rounded-[28px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-4 py-10 text-white sm:px-8 sm:py-12 lg:px-10">
                    <div className="text-center mb-12">
                        <div className="section-pill mb-6 justify-center">
                            <span className="section-pill-marker" aria-hidden>
                                <Quote className="section-pill-icon" />
                            </span>
                            <span className="section-pill-label">Customer Stories</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                            Don't just take our word for it
                        </h2>
                    </div>

                    <div
                        className="max-w-4xl mx-auto"
                        onMouseEnter={() => setIsAutoPlaying(false)}
                        onMouseLeave={() => setIsAutoPlaying(true)}
                    >
                        <div className="relative">
                            <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-8 sm:p-12">
                                <Quote className="h-10 w-10 text-blue-400/40 mb-6" />
                                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 leading-tight">
                                    {testimonial.title}
                                </h3>
                                <p className="text-base sm:text-lg text-white/70 leading-relaxed mb-8">
                                    {testimonial.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-white">{testimonial.name}</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                                        asChild
                                    >
                                        <a href={testimonial.caseStudyLink}>View Case Study</a>
                                    </Button>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="flex items-center justify-center gap-4 mt-8">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={prev}
                                    className="rounded-full text-white/60 hover:text-white hover:bg-white/10"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <div className="flex gap-2">
                                    {testimonials.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrent(i)}
                                            className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-blue-400 w-6" : "bg-white/30 hover:bg-white/50"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={next}
                                    className="rounded-full text-white/60 hover:text-white hover:bg-white/10"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
