import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { getPostBySlug, getAllPosts } from "@/lib/mdx";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
    const { locale, slug } = await params;
    const post = getPostBySlug(slug, locale);

    if (!post) return { title: "Not Found" };

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: "article",
            publishedTime: post.date,
            authors: [post.author],
        },
    };
}

export async function generateStaticParams() {
    const enPosts = getAllPosts("en");
    const arPosts = getAllPosts("ar");

    return [
        ...enPosts.map((post) => ({ locale: "en", slug: post.slug })),
        ...arPosts.map((post) => ({ locale: "ar", slug: post.slug })),
    ];
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    setRequestLocale(locale);
    const post = getPostBySlug(slug, locale);

    if (!post) notFound();

    return <BlogPostContent post={post} />;
}

function BlogPostContent({
    post,
}: {
    post: NonNullable<ReturnType<typeof getPostBySlug>>;
}) {
    const t = useTranslations("blog");

    return (
        <article className="section-padding pt-40 min-h-screen">
            <div className="max-w-3xl mx-auto">
                {/* Back to blog */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-accent text-sm font-semibold mb-8 hover:gap-3 transition-all duration-300"
                >
                    <svg
                        className="w-4 h-4 rtl:rotate-180 rotate-180"
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
                    {t("backToBlog")}
                </Link>

                {/* Header */}
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-4 text-sm text-text-muted">
                        <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </time>
                        <span>•</span>
                        <span>
                            {post.readingTime} {t("minRead")}
                        </span>
                        <span>•</span>
                        <span>{post.category}</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-tight">
                        {post.title}
                    </h1>
                    <p className="mt-4 text-lg text-text-secondary">{post.excerpt}</p>
                    <div className="mt-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                            A
                        </div>
                        <div>
                            <p className="text-text-primary text-sm font-medium">
                                {post.author}
                            </p>
                        </div>
                    </div>
                </header>

                {/* Divider */}
                <div className="h-px bg-border mb-12" />

                {/* Content */}
                <div className="prose-custom">
                    <MDXRemote source={post.content} />
                </div>
            </div>
        </article>
    );
}
