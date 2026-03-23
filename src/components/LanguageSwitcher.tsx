"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { motion } from "framer-motion";

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const toggleLocale = () => {
        const newLocale = locale === "en" ? "ar" : "en";
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleLocale}
            className="relative flex items-center gap-2 px-3 py-2 rounded-full glass-light hover:bg-white/10 transition-all duration-300 text-sm font-medium"
            aria-label="Switch language"
            id="language-switcher"
        >
            <span className="text-base">
                {locale === "en" ? "🇸🇦" : "🇬🇧"}
            </span>
            <span className="text-text-secondary">
                {locale === "en" ? "عربي" : "EN"}
            </span>
        </motion.button>
    );
}
