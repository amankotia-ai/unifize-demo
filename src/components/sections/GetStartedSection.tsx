import { onboardingSteps } from "@/data/siteData";
import { Headset, Code, ArrowUpFromLine } from "lucide-react";

const stepIcons = [Headset, Code, ArrowUpFromLine];
const stepColors = [
    { bg: "bg-blue-50", border: "border-blue-100", icon: "text-blue-600", highlight: "text-blue-600" },
    { bg: "bg-emerald-50", border: "border-emerald-100", icon: "text-emerald-600", highlight: "text-emerald-600" },
    { bg: "bg-blue-50", border: "border-blue-100", icon: "text-[#0667FF]", highlight: "text-[#0667FF]" },
];

export default function GetStartedSection() {
    return (
        <section className="py-20 sm:py-28 bg-[#F9FBFF]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
                        Get up and running in less than{" "}
                        <span className="text-[#0667FF]">30 days</span>
                    </h2>
                    <p className="mt-5 text-lg text-muted-foreground">
                        Our process template libraries and no code configurator allow for lightning fast implementation.
                    </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {onboardingSteps.map((step, i) => {
                        const Icon = stepIcons[i];
                        const colors = stepColors[i];
                        return (
                            <div key={i} className={`relative rounded-2xl ${colors.bg} border ${colors.border} p-8 transition-all hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1`}>
                                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-xs font-bold text-foreground/40">
                                    {i + 1}
                                </div>
                                <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-6 ${colors.icon} shadow-sm`}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-base font-bold text-foreground mb-1">
                                    <span className={colors.highlight}>{step.highlight}</span>{" "}
                                    <span>{step.title}</span>
                                </h3>
                                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{step.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
