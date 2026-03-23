import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CustomCursor } from "@/components/CustomCursor";
import type { Metadata } from "next";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const isAr = locale === "ar";

    const title = isAr
        ? "عمار محمود فرغلي | مطور ويب أول ورائد أعمال تقني"
        : "Ammar Mahmoud Farghaly | Senior Full-Stack Developer & Tech Entrepreneur";
    const description = isAr
        ? "مطور ويب متكامل أول متخصص في تصميم وتطوير مواقع وتطبيقات الويب الاحترافية. حلول رقمية متميزة للشركات."
        : "Senior Full-Stack Developer specializing in professional web design & development. Premium digital solutions for businesses worldwide.";

    return {
        title: {
            default: title,
            template: `%s | ${isAr ? "عمار فرغلي" : "Ammar Farghaly"}`,
        },
        description,
        keywords: isAr
            ? [
                "مطور ويب",
                "تصميم مواقع",
                "تطوير تطبيقات",
                "عمار فرغلي",
                "مطور متكامل",
                "حلول رقمية",
            ]
            : [
                "web developer",
                "web design",
                "full-stack developer",
                "Ammar Farghaly",
                "digital solutions",
                "tech entrepreneur",
            ],
        authors: [{ name: "Ammar Mahmoud Farghaly" }],
        creator: "Ammar Mahmoud Farghaly",
        openGraph: {
            type: "website",
            locale: isAr ? "ar_EG" : "en_US",
            alternateLocale: isAr ? "en_US" : "ar_EG",
            title,
            description,
            siteName: isAr ? "عمار فرغلي" : "Ammar Farghaly",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            languages: {
                en: "/en",
                ar: "/ar",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    setRequestLocale(locale);
    const messages = await getMessages();
    const direction = locale === "ar" ? "rtl" : "ltr";

    return (
        <html lang={locale} dir={direction}>
            <head>
                <link
                    rel="alternate"
                    hrefLang="en"
                    href="https://ammarfarghaly.com/en"
                />
                <link
                    rel="alternate"
                    hrefLang="ar"
                    href="https://ammarfarghaly.com/ar"
                />
                <link
                    rel="alternate"
                    hrefLang="x-default"
                    href="https://ammarfarghaly.com"
                />
            </head>
            <body
                className={`antialiased noise-overlay creative-cursor ${locale === "ar" ? "font-arabic" : "font-sans"
                    }`}
            >
                <NextIntlClientProvider messages={messages}>
                    <SmoothScroll>
                        <CustomCursor />
                        <Navbar />
                        <main>{children}</main>
                        <Footer />
                        <FloatingWhatsApp />
                    </SmoothScroll>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

