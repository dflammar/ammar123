"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";

const serviceIcons: Record<string, React.ReactNode> = {
    webdev: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
    ),
    dashboards: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
    ),
    mobile: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
    ),
    email: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
};

const previewKeys = ["webdev", "dashboards", "mobile", "email"] as const;

export function ServicesPreview() {
    const t = useTranslations("services");

    return (
        <section className="section-padding relative" id="services-preview">
            <div className="max-w-7xl mx-auto">
                <SectionHeading
                    subtitle={t("sectionSubtitle")}
                    title={t("title")}
                    description={t("description")}
                />

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {previewKeys.map((key, i) => (
                        <ServiceCard
                            key={key}
                            icon={serviceIcons[key]}
                            title={t(`items.${key}.title`)}
                            description={t(`items.${key}.description`)}
                            index={i}
                        />
                    ))}
                </div>

                <div className="text-center">
                    <Link href="/services" className="btn-outline">
                        {t("sectionTitle")}
                        <svg
                            className="w-5 h-5 rtl:rotate-180"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
