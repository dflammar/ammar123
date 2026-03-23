import { setRequestLocale } from "next-intl/server";
import { useTranslations, useLocale } from "next-intl";
import { getAllPosts } from "@/lib/mdx";
import { SectionHeading } from "@/components/SectionHeading";
import { BlogCard } from "@/components/BlogCard";
import type { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === "ar" ? "المدونة" : "Blog",
        description:
            locale === "ar"
                ? "مقالات ورؤى حول تطوير الويب واتجاهات التكنولوجيا والابتكار الرقمي"
                : "Articles and insights on web development, technology trends, and digital innovation",
    };
}

export default async function BlogPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const posts = getAllPosts(locale);

    return <BlogContent posts={posts} />;
}

function BlogContent({
    posts,
}: {
    posts: ReturnType<typeof getAllPosts>;
}) {
    const t = useTranslations("blog");

    return (
        <section className="section-padding pt-40 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <SectionHeading
                    subtitle={t("sectionSubtitle")}
                    title={t("title")}
                    description={t("description")}
                />

                {posts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-text-secondary text-lg">{t("noPosts")}</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post, i) => (
                            <BlogCard
                                key={post.slug}
                                title={post.title}
                                excerpt={post.excerpt}
                                date={post.date}
                                readingTime={post.readingTime}
                                slug={post.slug}
                                index={i}
                                readMoreText={t("readMore")}
                                minReadText={t("minRead")}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
