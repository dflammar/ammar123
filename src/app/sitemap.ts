import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/mdx";

const baseUrl = "https://ammarfarghaly.com";

export default function sitemap(): MetadataRoute.Sitemap {
    const locales = ["en", "ar"];
    const staticPages = [
        "",
        "/services",
        "/portfolio",
        "/blog",
        "/contact",
    ];

    const staticEntries: MetadataRoute.Sitemap = [];

    for (const locale of locales) {
        for (const page of staticPages) {
            staticEntries.push({
                url: `${baseUrl}/${locale}${page}`,
                lastModified: new Date(),
                changeFrequency: page === "" ? "weekly" : "monthly",
                priority: page === "" ? 1 : 0.8,
                alternates: {
                    languages: {
                        en: `${baseUrl}/en${page}`,
                        ar: `${baseUrl}/ar${page}`,
                    },
                },
            });
        }
    }

    // Blog post entries
    const blogEntries: MetadataRoute.Sitemap = [];
    for (const locale of locales) {
        const posts = getAllPosts(locale);
        for (const post of posts) {
            blogEntries.push({
                url: `${baseUrl}/${locale}/blog/${post.slug}`,
                lastModified: new Date(post.date),
                changeFrequency: "monthly",
                priority: 0.6,
                alternates: {
                    languages: {
                        en: `${baseUrl}/en/blog/${post.slug}`,
                        ar: `${baseUrl}/ar/blog/${post.slug}`,
                    },
                },
            });
        }
    }

    return [...staticEntries, ...blogEntries];
}
