interface JsonLdProps {
    locale: string;
}

export function JsonLd({ locale }: JsonLdProps) {
    const isAr = locale === "ar";

    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Ammar Mahmoud Farghaly",
        alternateName: isAr ? "عمار محمود فرغلي" : undefined,
        jobTitle: isAr
            ? "مطور ويب متكامل أول ورائد أعمال تقني"
            : "Senior Full-Stack Developer & Tech Entrepreneur",
        url: "https://ammarfarghaly.com",
        sameAs: [
            "https://wa.me/201234567890",
            "https://facebook.com/ammarfarghaly",
            "https://instagram.com/ammarfarghaly",
        ],
        knowsAbout: [
            "Web Development",
            "Full-Stack Development",
            "Mobile App Development",
            "UI/UX Design",
            "SEO",
            "Digital Marketing",
        ],
        nationality: {
            "@type": "Country",
            name: "Egypt",
        },
    };

    const businessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: isAr
            ? "عمار فرغلي - حلول رقمية"
            : "Ammar Farghaly - Digital Solutions",
        description: isAr
            ? "خدمات تصميم وتطوير مواقع وتطبيقات الويب الاحترافية"
            : "Professional web design & development services",
        url: "https://ammarfarghaly.com",
        founder: {
            "@type": "Person",
            name: "Ammar Mahmoud Farghaly",
        },
        address: {
            "@type": "PostalAddress",
            addressCountry: "EG",
        },
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            availableLanguage: ["English", "Arabic"],
        },
        priceRange: "$$",
        areaServed: {
            "@type": "GeoCircle",
            geoMidpoint: {
                "@type": "GeoCoordinates",
                latitude: 30.0444,
                longitude: 31.2357,
            },
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(personSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(businessSchema),
                }}
            />
        </>
    );
}
