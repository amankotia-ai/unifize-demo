import { Quote } from "lucide-react";

export default function TestimonialsMarquee() {
    const reviews = [
        { text: "The most intuitive quality management platform I've ever used.", author: "Quality Director", company: "Medical Devices" },
        { text: "We cut our document review cycles in half within the first month.", author: "VP Operations", company: "Aerospace" },
        { text: "Unifize transformed how our team communicates about quality issues.", author: "QA Manager", company: "Food Production" },
        { text: "Finally, a platform that understands regulated environments.", author: "Compliance Lead", company: "Contract Research" },
        { text: "The no-code approach made onboarding incredibly fast.", author: "IT Director", company: "Manufacturing" },
        { text: "Real-time visibility into every process has been a game-changer.", author: "COO", company: "Nutritional Supplements" },
    ];

    return (
        <section className="py-16 bg-[#F9FBFF] overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
                <div className="text-center">
                    <div className="section-pill mb-6 justify-center">
                        <span className="section-pill-marker" aria-hidden>
                            <Quote className="section-pill-icon" />
                        </span>
                        <span className="section-pill-label">Testimonials</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
                        And here's what{" "}
                        <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                            our customers are saying
                        </span>
                    </h2>
                </div>
            </div>

            {/* Scrolling reviews - Row 1 */}
            <div className="relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#F9FBFF] to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#F9FBFF] to-transparent z-10" />
                <div className="flex animate-marquee-slow gap-6">
                    {[...reviews, ...reviews].map((review, i) => (
                        <div key={i} className="flex-shrink-0 w-[380px] rounded-2xl bg-white border border-border/40 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-sm text-foreground/80 leading-relaxed italic">"{review.text}"</p>
                            <div className="mt-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#0667FF] flex items-center justify-center text-xs font-bold text-white">
                                    {review.author[0]}
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-foreground">{review.author}</p>
                                    <p className="text-xs text-muted-foreground">{review.company}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Row 2 */}
            <div className="relative overflow-hidden mt-6">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#F9FBFF] to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#F9FBFF] to-transparent z-10" />
                <div className="flex animate-marquee-slow-reverse gap-6">
                    {[...reviews.reverse(), ...reviews].map((review, i) => (
                        <div key={i} className="flex-shrink-0 w-[380px] rounded-2xl bg-white border border-border/40 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-sm text-foreground/80 leading-relaxed italic">"{review.text}"</p>
                            <div className="mt-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-xs font-bold text-white">
                                    {review.author[0]}
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-foreground">{review.author}</p>
                                    <p className="text-xs text-muted-foreground">{review.company}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
