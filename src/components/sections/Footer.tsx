import { Separator } from "@/components/ui/separator";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-border/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-[1fr_auto] gap-12">
                    {/* Left */}
                    <div className="max-w-sm">
                        <a href="#" className="flex items-center">
                            <img src="/Link - home.svg" alt="Unifize" className="h-7" />
                        </a>
                        <div className="mt-6 text-sm text-muted-foreground leading-relaxed">
                            <p>430 Cambridge Avenue</p>
                            <p>Palo Alto, CA 94306</p>
                            <p className="mt-3">
                                <span className="font-semibold text-foreground">Contact:</span>
                            </p>
                            <p>
                                <a href="tel:+1-800-458-7319" className="hover:text-foreground transition-colors">+1-800-458-7319</a> (Toll free)
                            </p>
                            <p>
                                <a href="tel:+1-234-225-0101" className="hover:text-foreground transition-colors">+1-234-225-0101</a> (International)
                            </p>
                            <p className="mt-2">
                                <a href="mailto:info@unifize.com" className="hover:text-foreground transition-colors">info@unifize.com</a>
                            </p>
                        </div>
                    </div>

                    {/* Right links */}
                    <div className="flex flex-wrap gap-6">
                        {["About Us", "Blog", "Videos", "Contact Us", "Careers"].map((link) => (
                            <a key={link} href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                {link}
                            </a>
                        ))}
                    </div>
                </div>

                <Separator className="my-8" />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">© 2025 Unifize. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
