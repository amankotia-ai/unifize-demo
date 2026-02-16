import { PlugZap } from "lucide-react";

export default function IntegrationsMarquee() {
    const integrations = [
        "Slack", "SharePoint", "OneDrive", "Outlook", "Gmail",
        "SAP", "Salesforce", "Jira", "Oracle", "ServiceNow",
        "MS Teams", "Dropbox"
    ];

    return (
        <section className="py-20 sm:py-28 bg-[#F9FBFF]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
                <div className="text-center max-w-3xl mx-auto">
                    <div className="section-pill mb-6 justify-center">
                        <span className="section-pill-marker" aria-hidden>
                            <PlugZap className="section-pill-icon" />
                        </span>
                        <span className="section-pill-label">Integrations</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
                        Curious to unify your other systems with our platform?
                    </h2>
                    <p className="mt-5 text-lg text-muted-foreground">
                        Click below to speak with sales.
                    </p>
                    <div className="mt-8">
                        <a href="#" className="inline-flex items-center justify-center rounded-xl bg-[#0667FF] hover:bg-[#0550CC] text-white px-8 py-3 text-sm font-medium shadow-lg shadow-[#0667FF]/25 transition-all hover:shadow-xl hover:shadow-[#0667FF]/30">
                            Book a Demo
                        </a>
                    </div>
                </div>
            </div>

            {/* Integration logos row 1 */}
            <div className="relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#F9FBFF] to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#F9FBFF] to-transparent z-10" />
                <div className="flex animate-marquee gap-8">
                    {[...integrations, ...integrations].map((name, i) => (
                        <div key={i} className="flex-shrink-0 w-36 h-20 rounded-xl bg-white border border-border/40 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                            <span className="text-sm font-semibold text-foreground/50">{name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Row 2 */}
            <div className="relative overflow-hidden mt-6">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#F9FBFF] to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#F9FBFF] to-transparent z-10" />
                <div className="flex animate-marquee-reverse gap-8">
                    {[...integrations.reverse(), ...integrations].map((name, i) => (
                        <div key={i} className="flex-shrink-0 w-36 h-20 rounded-xl bg-white border border-border/40 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                            <span className="text-sm font-semibold text-foreground/50">{name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
