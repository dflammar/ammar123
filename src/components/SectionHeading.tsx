"use client";

import { AnimatedSection } from "./AnimatedSection";

interface SectionHeadingProps {
    subtitle: string;
    title: string;
    description?: string;
    centered?: boolean;
}

export function SectionHeading({
    subtitle,
    title,
    description,
    centered = true,
}: SectionHeadingProps) {
    return (
        <AnimatedSection
            className={`mb-24 ${centered ? "text-center" : ""}`}
        >
            <span className="inline-block text-accent text-[10px] font-bold tracking-[0.25em] uppercase mb-6">
                {subtitle}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] tracking-[-0.02em]">
                {title}
            </h2>
            {description && (
                <p className="text-white/40 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mt-6">
                    {description}
                </p>
            )}
        </AnimatedSection>
    );
}
