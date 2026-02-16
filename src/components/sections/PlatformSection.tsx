import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { platformTabs } from "@/data/siteData";
import { Settings, MessageSquare, Zap, Plug, BarChart3, Shield, Check } from "lucide-react";

const tabIcons = [Settings, MessageSquare, Zap, Plug, BarChart3, Shield];
const colorMap: Record<string, { pill: string; dot: string; accent: string }> = {
    orange: { pill: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-400", accent: "text-orange-600" },
    purple: { pill: "bg-blue-50 text-[#0667FF] border-blue-200", dot: "bg-[#0667FF]", accent: "text-[#0667FF]" },
    green: { pill: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-400", accent: "text-emerald-600" },
};

export default function PlatformSection() {
    const [activeTab, setActiveTab] = useState("configuration");

    return (
        <section className="py-20 sm:py-28 bg-[#F9FBFF]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
                        Built on a platform engineered to enhance{" "}
                        <span className="text-[#0667FF]">
                            visibility, flexibility, and accountability
                        </span>
                    </h2>
                    <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                        The Unifize platform integrates communication, data, and workflows into a single system. Unifize helps teams work smarter, reduce errors, and improve efficiency—without relying on complex IT setups.
                    </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="overflow-x-auto overflow-y-hidden scrollbar-hide px-2 pb-1 touch-pan-x sm:overflow-visible sm:px-0 sm:pb-0">
                        <TabsList className="flex h-auto w-max items-center gap-1 rounded-2xl bg-muted/50 p-1.5 group-data-[orientation=horizontal]/tabs:!h-auto sm:mx-auto">
                            {platformTabs.map((tab, i) => {
                                const Icon = tabIcons[i];
                                return (
                                    <TabsTrigger
                                        key={tab.value}
                                        value={tab.value}
                                        className="h-auto flex-none shrink-0 rounded-xl px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm sm:text-sm"
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span className="hidden sm:inline">{tab.label}</span>
                                        <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>
                    </div>

                    {platformTabs.map((tab) => {
                        const colors = colorMap[tab.colorScheme];
                        return (
                            <TabsContent key={tab.value} value={tab.value} className="mt-10">
                                <div className="grid lg:grid-cols-2 gap-12 items-start">
                                    <div>
                                        <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">{tab.heading}</h3>
                                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">{tab.description}</p>
                                        <div className="grid sm:grid-cols-2 gap-3">
                                            {tab.features.map((feature) => (
                                                <div key={feature} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 border border-border/30 hover:border-border/60 transition-colors">
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${colors.pill}`}>
                                                        <Check className="h-3 w-3" />
                                                    </div>
                                                    <span className="text-sm font-medium text-foreground">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Decorative placeholder */}
                                    <div className="hidden lg:flex items-center justify-center">
                                        <div className="w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-border/30 flex items-center justify-center">
                                            <div className="text-center p-8">
                                                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0667FF] flex items-center justify-center shadow-lg shadow-[#0667FF]/20 mb-4">
                                                    {(() => {
                                                        const idx = platformTabs.findIndex((t) => t.value === tab.value);
                                                        const Icon = tabIcons[idx];
                                                        return <Icon className="h-8 w-8 text-white" />;
                                                    })()}
                                                </div>
                                                <p className="text-lg font-semibold text-foreground">{tab.heading}</p>
                                                <p className="text-sm text-muted-foreground mt-1">{tab.features.length} features</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        );
                    })}
                </Tabs>
            </div>
        </section>
    );
}
