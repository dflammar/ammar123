"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { PortfolioCard } from "@/components/PortfolioCard";
import { motion } from "framer-motion";
import type { Project } from "@/lib/projects";

const categoryKeys = ["web", "mobile", "dashboard", "design"] as const;

interface Props {
    projects: Project[];
}

export default function PortfolioPageClient({ projects }: Props) {
    const t = useTranslations("portfolio");
    const [activeCategory, setActiveCategory] = useState("all");

    const filteredItems =
        activeCategory === "all"
            ? projects
            : projects.filter((item) => item.category === activeCategory);

    return (
        <section className="section-padding pt-40 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <SectionHeading
                    subtitle={t("sectionSubtitle")}
                    title={t("title")}
                    description={t("description")}
                />

                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveCategory("all")}
                        className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${activeCategory === "all"
                                ? "bg-accent text-black"
                                : "bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/70"
                            }`}
                    >
                        {t("allCategories")}
                    </motion.button>
                    {categoryKeys.map((key) => (
                        <motion.button
                            key={key}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveCategory(key)}
                            className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${activeCategory === key
                                    ? "bg-accent text-black"
                                    : "bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/70"
                                }`}
                        >
                            {t(`categories.${key}`)}
                        </motion.button>
                    ))}
                </div>

                {/* Portfolio Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredItems.map((item, i) => (
                        <PortfolioCard
                            key={item.id}
                            title={item.title}
                            category={t(
                                `categories.${item.category as (typeof categoryKeys)[number]}`
                            )}
                            image={item.image}
                            techStack={item.techStack}
                            index={i}
                            viewProjectText={t("viewProject")}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
