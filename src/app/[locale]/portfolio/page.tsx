import { setRequestLocale } from "next-intl/server";
import PortfolioPageClient from "./PortfolioPageClient";
import { getProjects } from "@/lib/projects";
import type { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === "ar" ? "أعمالي" : "Portfolio",
        description:
            locale === "ar"
                ? "مجموعة من المشاريع المميزة في تطوير الويب وتطبيقات الجوال ولوحات التحكم"
                : "A selection of featured projects in web development, mobile apps, and dashboards",
    };
}

export default async function PortfolioPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const projects = getProjects();

    return <PortfolioPageClient projects={projects} />;
}
