import { useTranslations, useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Hero } from "./HeroSection";
import { AboutSection } from "./AboutSection";
import { ServicesPreview } from "./ServicesPreview";
import { JsonLd } from "@/components/JsonLd";

export default async function HomePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <>
            <JsonLd locale={locale} />
            <Hero />
            <AboutSection />
            <ServicesPreview />
        </>
    );
}
