"use client";

import { motion } from "framer-motion";

interface ServiceCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    index: number;
}

export function ServiceCard({ icon, title, description, index }: ServiceCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.06 }}
            className="group card relative rounded-2xl p-10 overflow-hidden"
            data-cursor="pointer"
        >
            {/* Hover accent glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl" />

            {/* Icon */}
            <div className="relative z-10 w-10 h-10 flex items-center justify-center text-accent/60 group-hover:text-accent mb-8 transition-colors duration-500">
                {icon}
            </div>

            {/* Content */}
            <div className="relative z-10">
                <h3 className="text-base font-bold text-white mb-3 group-hover:text-accent transition-colors duration-500 tracking-tight">
                    {title}
                </h3>
                <p className="text-white/35 leading-relaxed text-sm">
                    {description}
                </p>
            </div>

            {/* Bottom line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
        </motion.div>
    );
}
