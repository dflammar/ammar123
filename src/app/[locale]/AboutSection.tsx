"use client";

import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SectionHeading } from "@/components/SectionHeading";
import { motion } from "framer-motion";

const stats = [
    { key: "experience", value: "7+" },
    { key: "projects", value: "120+" },
    { key: "clients", value: "80+" },
    { key: "technologies", value: "25+" },
];

export function AboutSection() {
    const t = useTranslations("about");

    return (
        <section className="section-padding relative overflow-hidden" id="about">
            <div className="max-w-7xl mx-auto relative z-10">
                <SectionHeading subtitle={t("sectionSubtitle")} title={t("sectionTitle")} />

                <div className="grid lg:grid-cols-2 gap-24 items-center">
                    {/* Text */}
                    <AnimatedSection>
                        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8 leading-tight tracking-tight">
                            {t("title")}
                        </h3>
                        <p className="text-white/50 leading-[1.9] text-base sm:text-lg">
                            {t("description")}
                        </p>
                    </AnimatedSection>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-5">
                        {stats.map((stat, i) => (
                            <AnimatedSection key={stat.key} delay={i * 0.1}>
                                <motion.div
                                    whileHover={{ scale: 1.03, borderColor: "rgba(255,255,255,0.1)" }}
                                    className="card rounded-2xl p-10 text-center"
                                >
                                    <div className="text-4xl sm:text-5xl font-extrabold gradient-text-gold mb-4 tracking-tight">
                                        {stat.value}
                                    </div>
                                    <div className="text-white/30 text-[11px] font-semibold uppercase tracking-[0.15em]">
                                        {t(stat.key as "experience" | "projects" | "clients" | "technologies")}
                                    </div>
                                </motion.div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
