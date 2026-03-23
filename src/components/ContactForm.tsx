"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function ContactForm() {
    const t = useTranslations("contact.form");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setStatus("idle"), 3000);
    };

    const inputClasses =
        "w-full px-5 py-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 focus:bg-white/[0.06] transition-all duration-300 text-[0.9375rem]";

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input
                    type="text"
                    required
                    placeholder={t("name")}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClasses}
                    id="contact-name"
                />
                <input
                    type="email"
                    required
                    placeholder={t("email")}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputClasses}
                    id="contact-email"
                />
            </div>
            <input
                type="text"
                required
                placeholder={t("subject")}
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className={inputClasses}
                id="contact-subject"
            />
            <textarea
                required
                rows={5}
                placeholder={t("message")}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className={`${inputClasses} resize-none`}
                id="contact-message"
            />

            <motion.button
                type="submit"
                disabled={status === "sending"}
                whileHover={{ scale: status === "sending" ? 1 : 1.01 }}
                whileTap={{ scale: status === "sending" ? 1 : 0.98 }}
                className={`w-full btn-primary justify-center text-base !py-4 mt-2 ${status === "sending" ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                id="contact-submit"
            >
                {status === "sending" ? t("sending") : t("send")}
            </motion.button>

            {status === "success" && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-emerald-400 text-sm text-center pt-2"
                >
                    ✓ {t("success")}
                </motion.p>
            )}

            {status === "error" && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm text-center pt-2"
                >
                    ✗ {t("error")}
                </motion.p>
            )}
        </form>
    );
}
