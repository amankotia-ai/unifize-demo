import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Menu, X, FileText, ShieldCheck, GitMerge, Factory, Wrench, Plane, Car, Microscope, Sparkles, Utensils, FlaskConical, Stethoscope, Pill, Video, Briefcase, BookOpen, Camera, Scale, HelpCircle, Code, Info } from "lucide-react";
import { products, industries, resources } from "@/data/siteData";
import BookDemoModal from "@/components/BookDemoModal";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import React from "react";

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
    FileText, ShieldCheck, GitMerge, Factory, Wrench, Plane, Car, Microscope, Sparkles, Utensils, FlaskConical, Stethoscope, Pill, Video, Briefcase, BookOpen, Camera, Scale, HelpCircle, Code, Info
};

const solidIconClass = "size-[15px] text-zinc-400 transition-colors group-hover/nav-item:text-[#0052FF] [stroke-width:2.2] [&_path]:fill-current [&_path]:stroke-current [&_circle]:fill-current [&_circle]:stroke-current [&_rect]:fill-current [&_rect]:stroke-current";
const productIconClass = "size-[18px] text-[var(--product-icon-color)] [stroke-width:2.2] [&_path]:fill-current [&_path]:stroke-current [&_circle]:fill-current [&_circle]:stroke-current [&_rect]:fill-current [&_rect]:stroke-current";
const mobileCardIconClass = "size-[15px] text-zinc-400 transition-colors group-hover/mobile-item:text-[#0052FF] [stroke-width:2.2] [&_path]:fill-current [&_path]:stroke-current [&_circle]:fill-current [&_circle]:stroke-current [&_rect]:fill-current [&_rect]:stroke-current";
const mobileProductIconClass = "size-[15px] text-[var(--product-icon-color)] [stroke-width:2.2] [&_path]:fill-current [&_path]:stroke-current [&_circle]:fill-current [&_circle]:stroke-current [&_rect]:fill-current [&_rect]:stroke-current";
const mobilePrimaryIconClass = "size-[18px] text-zinc-400 transition-colors group-hover/mobile-primary:text-[#0052FF] [stroke-width:2.2] [&_path]:fill-current [&_path]:stroke-current [&_circle]:fill-current [&_circle]:stroke-current [&_rect]:fill-current [&_rect]:stroke-current";
const productDropdownThemes: Record<string, { iconColor: string; iconBg: string; iconBgHover: string }> = {
    "Document Management System": {
        iconColor: "#EA7432",
        iconBg: "#FFF1E6",
        iconBgHover: "#FFE8D7",
    },
    "Quality Management System": {
        iconColor: "#D3A126",
        iconBg: "#FFF7D6",
        iconBgHover: "#FFEDB8",
    },
    "Product Lifecycle Management": {
        iconColor: "#8667A8",
        iconBg: "#F1EAF8",
        iconBgHover: "#E8DCF5",
    },
    "Manufacturing Execution System": {
        iconColor: "#4EA867",
        iconBg: "#ECF9E8",
        iconBgHover: "#DDF4D6",
    },
    "Maintenance Management (CMMS)": {
        iconColor: "#8667A8",
        iconBg: "#F1EAF8",
        iconBgHover: "#E8DCF5",
    },
};
const defaultProductDropdownTheme = {
    iconColor: "#71717A",
    iconBg: "rgba(228, 228, 231, 0.7)",
    iconBgHover: "rgba(228, 228, 231, 1)",
};
const mobileTabsRadiusVars = {
    "--mobile-tabs-radius": "12px",
    "--mobile-tabs-inset": "4px",
} as React.CSSProperties;
const mobileTabTriggerStyle: React.CSSProperties = {
    boxShadow: "none",
    borderRadius: "calc(var(--mobile-tabs-radius) - var(--mobile-tabs-inset))",
};

const mobilePrimaryLinks = [
    { title: "Platform", href: "#", icon: "GitMerge" },
    { title: "Integrations", href: "#", icon: "Code" },
    { title: "Pricing", href: "#", icon: "Scale" },
    { title: "About Us", href: "#", icon: "Info" },
];

function ProductGridItem({
    className,
    title,
    children,
    icon,
    ...props
}: React.ComponentPropsWithoutRef<"a"> & { title: string; icon?: string }) {
    const Icon = icon ? iconMap[icon] : null;
    const theme = productDropdownThemes[title] ?? defaultProductDropdownTheme;

    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    className={cn(
                        "group/product-item block select-none rounded-xl border border-transparent p-3 leading-none no-underline outline-none transition-colors duration-150 hover:bg-zinc-100 focus:bg-zinc-100",
                        className
                    )}
                    style={
                        {
                            "--product-icon-color": theme.iconColor,
                            "--product-icon-bg": theme.iconBg,
                            "--product-icon-bg-hover": theme.iconBgHover,
                        } as React.CSSProperties
                    }
                    {...props}
                >
                    {Icon && (
                        <div className="mb-2 flex size-9 items-center justify-center rounded-lg border border-transparent bg-[var(--product-icon-bg)] transition-colors group-hover/product-item:border-transparent group-hover/product-item:bg-[var(--product-icon-bg-hover)]">
                            <Icon className={productIconClass} aria-hidden="true" />
                        </div>
                    )}
                    <div className="text-sm font-medium leading-tight text-zinc-900 whitespace-nowrap">{title}</div>
                    <p className="mt-1 text-xs leading-snug text-zinc-600">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a"> & { title: string; icon?: string }
>(({ className, title, children, icon, ...props }, ref) => {
    const Icon = icon ? iconMap[icon] : null;
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "group/nav-item block select-none rounded-lg px-2 py-2 leading-none no-underline outline-none transition-colors duration-150 hover:bg-zinc-100 focus:bg-zinc-100",
                        className
                    )}
                    {...props}
                >
                    <div className="flex items-start gap-2.5">
                        {Icon && (
                            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-zinc-100 transition-colors group-hover/nav-item:bg-[#0052FF]/10">
                                <Icon className={solidIconClass} aria-hidden="true" />
                            </div>
                        )}
                        <div className="space-y-1">
                            <div className="text-sm font-medium leading-tight text-zinc-900">{title}</div>
                            <p className="line-clamp-1 text-xs leading-snug text-zinc-600">
                                {children}
                            </p>
                        </div>
                    </div>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = "ListItem";

function MobileMenuCard({
    title,
    description,
    href = "#",
    icon,
    productTheme,
    onClick,
}: {
    title: string;
    description?: string;
    href?: string;
    icon?: string;
    productTheme?: { iconColor: string; iconBg: string; iconBgHover: string };
    onClick?: () => void;
}) {
    const Icon = icon ? iconMap[icon] : null;

    return (
        <a
            href={href}
            onClick={onClick}
            className="group/mobile-item flex min-h-0 items-center gap-2.5 px-1 py-2 no-underline transition-colors duration-150"
            style={
                productTheme
                    ? ({
                        "--product-icon-color": productTheme.iconColor,
                        "--product-icon-bg": productTheme.iconBg,
                        "--product-icon-bg-hover": productTheme.iconBgHover,
                    } as React.CSSProperties)
                    : undefined
            }
        >
            {Icon && (
                <div
                    className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-md transition-colors",
                        productTheme
                            ? "border border-transparent bg-[var(--product-icon-bg)] group-hover/mobile-item:bg-[var(--product-icon-bg-hover)]"
                            : "bg-zinc-100 group-hover/mobile-item:bg-[#0052FF]/10"
                    )}
                >
                    <Icon className={productTheme ? mobileProductIconClass : mobileCardIconClass} aria-hidden="true" />
                </div>
            )}
            <div className="min-w-0">
                <div className="truncate text-[13px] font-medium leading-tight text-zinc-900">{title}</div>
                {description && (
                    <p className="truncate text-[11px] leading-tight text-zinc-600">{description}</p>
                )}
            </div>
        </a>
    );
}

export default function Navbar() {
    const [demoModalOpen, setDemoModalOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const hasAutoOpenedDemoModalRef = useRef(false);
    const hasUserScrolledRef = useRef(false);

    const openDemoModal = () => {
        hasAutoOpenedDemoModalRef.current = true;
        setDemoModalOpen(true);
    };

    useEffect(() => {
        const previousBodyOverflow = document.body.style.overflow;
        const previousHtmlOverflow = document.documentElement.style.overflow;

        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
        }

        return () => {
            document.body.style.overflow = previousBodyOverflow;
            document.documentElement.style.overflow = previousHtmlOverflow;
        };
    }, [mobileMenuOpen]);

    useEffect(() => {
        if (hasAutoOpenedDemoModalRef.current) return;

        const bottomThresholdPx = 24;

        const maybeAutoOpenModal = () => {
            if (mobileMenuOpen || demoModalOpen || hasAutoOpenedDemoModalRef.current) {
                return;
            }

            const scrollTop = window.scrollY || window.pageYOffset;

            if (scrollTop > 0) {
                hasUserScrolledRef.current = true;
            }

            if (!hasUserScrolledRef.current) return;

            const viewportBottom = scrollTop + window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const isAtBottom = viewportBottom >= documentHeight - bottomThresholdPx;

            if (!isAtBottom) return;

            hasAutoOpenedDemoModalRef.current = true;
            setDemoModalOpen(true);
        };

        maybeAutoOpenModal();
        window.addEventListener("scroll", maybeAutoOpenModal, { passive: true });
        window.addEventListener("resize", maybeAutoOpenModal);

        return () => {
            window.removeEventListener("scroll", maybeAutoOpenModal);
            window.removeEventListener("resize", maybeAutoOpenModal);
        };
    }, [demoModalOpen, mobileMenuOpen]);

    return (
        <nav
            className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] md:pt-[calc(env(safe-area-inset-top)+1rem)]"
        >
            <div className="mx-auto w-full max-w-7xl px-0 md:px-6 lg:px-8">
                <div className="border-b border-[#EEF3FF] bg-white md:rounded-[22px] md:border md:border-[#EEF3FF]">
                    <div className="flex h-16 items-center justify-between px-4 md:px-3.5 lg:px-4">
                        {/* Logo — left side */}
                        <a href="#" className="flex items-center shrink-0">
                            <img src="/Link - home.svg" alt="Unifize" className="h-6" />
                        </a>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center gap-1">
                            <NavigationMenu viewport={false}>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className="h-16">Products</NavigationMenuTrigger>
                                        <NavigationMenuContent className="group-data-[viewport=false]/navigation-menu:w-[36rem]">
                                            <ul className="grid grid-cols-2 gap-x-3 gap-y-2 p-2.5 [&>li]:min-w-0">
                                                {products.map((product) => (
                                                    <ProductGridItem
                                                        key={product.title}
                                                        title={product.title}
                                                        href={product.link}
                                                        icon={product.icon}
                                                    >
                                                        {product.description}
                                                    </ProductGridItem>
                                                ))}
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <a href="#" className={navigationMenuTriggerStyle()}>
                                            Platform
                                        </a>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className="h-16">Industries</NavigationMenuTrigger>
                                        <NavigationMenuContent className="w-[30rem]">
                                            <ul className="space-y-0.5 p-1">
                                                {industries.map((industry) => (
                                                    <ListItem
                                                        key={industry.title}
                                                        title={industry.title}
                                                        href="#"
                                                        icon={industry.icon}
                                                    >
                                                        {industry.description}
                                                    </ListItem>
                                                ))}
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <a href="#" className={navigationMenuTriggerStyle()}>
                                            Integrations
                                        </a>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <a href="#" className={navigationMenuTriggerStyle()}>
                                            Pricing
                                        </a>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className="h-16">Resources</NavigationMenuTrigger>
                                        <NavigationMenuContent className="w-[30rem] right-0 left-auto">
                                            <ul className="space-y-0.5 p-1">
                                                {resources.map((item) => (
                                                    <ListItem
                                                        key={item.title}
                                                        title={item.title}
                                                        href="#"
                                                        icon={item.icon}
                                                    >
                                                        {item.description}
                                                    </ListItem>
                                                ))}
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <a href="#" className={navigationMenuTriggerStyle()}>
                                            About Us
                                        </a>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>

                            {/* Divider */}
                            <div className="w-px h-5 bg-border/50 mx-2" />

                            <Button variant="ghost" size="sm" className="text-[13px] font-medium text-foreground/70 hover:text-foreground">
                                Sign In
                            </Button>
                            <Button
                                size="sm"
                                className="h-[38px] px-[18px] bg-[#0052FF] hover:bg-[#0052FF] text-white text-[13px] font-medium rounded-lg"
                                onClick={openDemoModal}
                            >
                                Book a Demo
                            </Button>
                        </div>

                        {/* Mobile Menu */}
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                            aria-expanded={mobileMenuOpen}
                            aria-controls="mobile-nav-panel"
                            onClick={() => setMobileMenuOpen((open) => !open)}
                            className="relative lg:hidden"
                        >
                            <Menu
                                className={cn(
                                    "size-5 transition-all duration-150",
                                    mobileMenuOpen ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100"
                                )}
                            />
                            <X
                                className={cn(
                                    "pointer-events-none absolute size-5 transition-all duration-150",
                                    mobileMenuOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0"
                                )}
                            />
                        </Button>
                    </div>

                    <AnimatePresence initial={false}>
                        {mobileMenuOpen && (
                            <motion.div
                                id="mobile-nav-panel"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "calc(100dvh - 4rem - env(safe-area-inset-top))", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                className="overflow-hidden lg:hidden"
                            >
                                <motion.div
                                    initial={{ y: -16, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -12, opacity: 0 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="flex h-full flex-col gap-4 bg-white px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4"
                                >
                                    <div className="grid grid-cols-2 gap-2">
                                        {mobilePrimaryLinks.map((link) => {
                                            const Icon = iconMap[link.icon];

                                            return (
                                                <a
                                                    key={link.title}
                                                    href={link.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="group/mobile-primary flex items-center gap-2.5 rounded-[12px] bg-zinc-100 px-3 py-3.5 text-[13px] font-medium text-zinc-900 transition-colors duration-150 hover:bg-zinc-200/60"
                                                    style={{ borderRadius: "12px" }}
                                                >
                                                    <Icon className={mobilePrimaryIconClass} aria-hidden="true" />
                                                    <span>{link.title}</span>
                                                </a>
                                            );
                                        })}
                                    </div>

                                    <Tabs defaultValue="products" className="min-h-0 flex-1">
                                        <TabsList
                                            className="grid w-full grid-cols-3 rounded-[var(--mobile-tabs-radius)] bg-zinc-100 p-1"
                                            style={mobileTabsRadiusVars}
                                        >
                                            <TabsTrigger
                                                value="products"
                                                className="text-[12px] shadow-none data-[state=active]:shadow-none"
                                                style={mobileTabTriggerStyle}
                                            >
                                                Products
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="industries"
                                                className="text-[12px] shadow-none data-[state=active]:shadow-none"
                                                style={mobileTabTriggerStyle}
                                            >
                                                Industries
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="resources"
                                                className="text-[12px] shadow-none data-[state=active]:shadow-none"
                                                style={mobileTabTriggerStyle}
                                            >
                                                Resources
                                            </TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="products" className="mt-3">
                                            <div className="grid grid-cols-1 gap-2">
                                                {products.map((product) => (
                                                    <MobileMenuCard
                                                        key={product.title}
                                                        title={product.title}
                                                        description={product.description}
                                                        href={product.link}
                                                        icon={product.icon}
                                                        productTheme={productDropdownThemes[product.title] ?? defaultProductDropdownTheme}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    />
                                                ))}
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="industries" className="mt-3">
                                            <div className="grid grid-cols-2 gap-2">
                                                {industries.map((industry) => (
                                                    <MobileMenuCard
                                                        key={industry.title}
                                                        title={industry.title}
                                                        href="#"
                                                        icon={industry.icon}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    />
                                                ))}
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="resources" className="mt-3">
                                            <div className="grid grid-cols-2 gap-2">
                                                {resources.map((resource) => (
                                                    <MobileMenuCard
                                                        key={resource.title}
                                                        title={resource.title}
                                                        href="#"
                                                        icon={resource.icon}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    />
                                                ))}
                                            </div>
                                        </TabsContent>
                                    </Tabs>

                                    <div className="mt-auto pt-2">
                                        <Button
                                            className="h-11 w-full !rounded-[12px] bg-[#0052FF] text-[13px] font-medium text-white hover:bg-[#0052FF]"
                                            style={{ borderRadius: "12px" }}
                                            onClick={() => {
                                                setMobileMenuOpen(false);
                                                openDemoModal();
                                            }}
                                        >
                                            Book a Demo
                                        </Button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            <BookDemoModal open={demoModalOpen} onOpenChange={setDemoModalOpen} />
        </nav>
    );
}
