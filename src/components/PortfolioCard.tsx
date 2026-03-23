"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface PortfolioCardProps {
    title: string;
    category: string;
    image: string;
    techStack: string[];
    index: number;
    viewProjectText: string;
}

export function PortfolioCard({
    title,
    category,
    image,
    techStack,
    index,
    viewProjectText,
}: PortfolioCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="group relative rounded-2xl overflow-hidden card-hover bg-white/[0.025] border border-white/[0.06]"
        >
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1222] via-[#0c1222]/40 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-500" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/20 backdrop-blur-sm">
                        {category}
                    </span>
                </div>

                {/* View Project button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary text-sm"
                    >
                        {viewProjectText}
                    </motion.button>
                </div>
            </div>

            {/* Content */}
            <div className="p-7">
                <h3 className="text-lg font-bold text-text-primary mb-4 group-hover:text-accent transition-colors duration-300 tracking-tight">
                    {title}
                </h3>
                <div className="flex flex-wrap gap-2">
                    {techStack.map((tech) => (
                        <span
                            key={tech}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.04] text-text-muted border border-white/[0.06]"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
