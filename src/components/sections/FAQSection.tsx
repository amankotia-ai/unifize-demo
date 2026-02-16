import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { faqItems } from "@/data/siteData";

export default function FAQSection() {
    return (
        <section className="py-20 sm:py-28 bg-[#F9FBFF]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-[380px_1fr] gap-12">
                    {/* Left */}
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">FAQs</h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Here's some of the most asked questions.
                        </p>
                        <div className="mt-6">
                            <Button className="bg-[#0667FF] hover:bg-[#0550CC] text-white shadow-lg shadow-[#0667FF]/25">
                                Book a Demo
                            </Button>
                        </div>
                    </div>

                    {/* Right */}
                    <Accordion type="single" collapsible className="w-full">
                        {faqItems.map((item, i) => (
                            <AccordionItem key={i} value={`item-${i}`} className="border-border/40">
                                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}
