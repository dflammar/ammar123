"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";

interface BlogCardProps {
    title: string;
    excerpt: string;
    date: string;
    readingTime: string;
    slug: string;
    index: number;
    readMoreText: string;
    minReadText: string;
}

export function BlogCard({
    title,
    excerpt,
    date,
    readingTime,
    slug,
    index,
    readMoreText,
    minReadText,
}: BlogCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group rounded-2xl overflow-hidden card-hover bg-white/[0.025] border border-white/[0.06]"
        >
            {/* Gradient top bar */}
            <div className="h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

            <div className="p-8 sm:p-10">
                {/* Meta */}
                <div className="flex items-center gap-3 mb-5 text-sm text-text-muted">
                    <time dateTime={date}>
                        {new Date(date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </time>
                    <span className="w-1 h-1 rounded-full bg-text-muted/40" />
                    <span>
                        {readingTime} {minReadText}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-text-primary mb-4 group-hover:text-accent transition-colors duration-300 line-clamp-2 leading-snug tracking-tight">
                    {title}
                </h3>

                {/* Excerpt */}
                <p className="text-text-secondary text-[0.9375rem] leading-relaxed mb-8 line-clamp-3">
                    {excerpt}
                </p>

                {/* Read More */}
                <Link
                    href={`/blog/${slug}`}
                    className="inline-flex items-center gap-2 text-accent text-sm font-semibold group-hover:gap-3 transition-all duration-300"
                >
                    {readMoreText}
                    <svg
                        className="w-4 h-4 rtl:rotate-180"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </div>
        </motion.div>
    );
}
