"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════
   MAGNETIC LINK — Pulls toward cursor
   ═══════════════════════════════════════════ */
function MagneticLink({
    children,
    href,
    isActive,
    className = "",
}: {
    children: React.ReactNode;
    href: string;
    isActive: boolean;
    className?: string;
}) {
    const ref = useRef<HTMLAnchorElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 15, stiffness: 200, mass: 0.2 };
    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        x.set(distX * 0.3);
        y.set(distY * 0.3);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <Link href={href} ref={ref} className="relative inline-block">
            <motion.span
                style={{ x: xSpring, y: ySpring }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={`inline-block ${className}`}
            >
                {children}
                {isActive && (
                    <motion.span
                        layoutId="nav-dot"
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                )}
            </motion.span>
        </Link>
    );
}

/* ═══════════════════════════════════════════
   NAVBAR — MAIN EXPORT
   ═══════════════════════════════════════════ */

const navLinks = [
    { href: "/", label: "home" },
    { href: "/services", label: "services" },
    { href: "/portfolio", label: "portfolio" },
    { href: "/blog", label: "blog" },
    { href: "/contact", label: "contact" },
] as const;

export function Navbar() {
    const t = useTranslations("nav");
    const locale = useLocale();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 80);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    return (
        <>
            {/* Desktop: Minimal top bar when not scrolled, floating dock when scrolled */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${isScrolled
                        ? "pointer-events-none opacity-0"
                        : "pointer-events-auto opacity-100"
                    }`}
            >
                <nav className="max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group" data-cursor="pointer">
                            <span className="text-lg font-bold text-white tracking-tight">
                                {locale === "ar" ? "عمار" : "Ammar"}
                                <span className="text-accent">.</span>
                            </span>
                        </Link>

                        {/* Center links */}
                        <div className="hidden md:flex items-center gap-10">
                            {navLinks.map((link) => (
                                <MagneticLink
                                    key={link.href}
                                    href={link.href}
                                    isActive={pathname === link.href}
                                    className={`text-[13px] font-medium tracking-[0.06em] uppercase transition-colors duration-300 ${pathname === link.href
                                            ? "text-white"
                                            : "text-white/35 hover:text-white/70"
                                        }`}
                                >
                                    {t(link.label)}
                                </MagneticLink>
                            ))}
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-5">
                            <LanguageSwitcher />
                            <button
                                onClick={() => setIsMobileOpen(!isMobileOpen)}
                                className="md:hidden p-2 text-white/50 hover:text-white transition-colors"
                                aria-label="Toggle menu"
                                id="mobile-menu-toggle"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isMobileOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </nav>
            </motion.header>

            {/* Floating dock — appears on scroll */}
            <motion.div
                initial={false}
                animate={{
                    y: isScrolled ? 0 : 100,
                    opacity: isScrolled ? 1 : 0,
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
                style={{ pointerEvents: isScrolled ? "auto" : "none" }}
            >
                <div className="flex items-center gap-1 px-2 py-2 rounded-full bg-white/[0.06] backdrop-blur-2xl border border-white/[0.08] shadow-2xl shadow-black/50">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                data-cursor="pointer"
                                className={`px-4 py-2 rounded-full text-[11px] font-semibold uppercase tracking-[0.1em] transition-all duration-300 ${isActive
                                        ? "bg-white text-black"
                                        : "text-white/50 hover:text-white hover:bg-white/[0.06]"
                                    }`}
                            >
                                {t(link.label)}
                            </Link>
                        );
                    })}
                    <div className="mx-1 w-px h-5 bg-white/10" />
                    <LanguageSwitcher />
                </div>
            </motion.div>

            {/* Mobile menu */}
            {isMobileOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
                >
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="absolute top-6 right-6 p-3 text-white/50 hover:text-white"
                        aria-label="Close menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    {navLinks.map((link, i) => (
                        <motion.div
                            key={link.href}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08, duration: 0.4 }}
                        >
                            <Link
                                href={link.href}
                                className={`text-3xl sm:text-4xl font-bold tracking-tight transition-colors ${pathname === link.href
                                        ? "text-accent"
                                        : "text-white/40 hover:text-white"
                                    }`}
                            >
                                {t(link.label)}
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </>
    );
}
