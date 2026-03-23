"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/admin/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.success) {
                router.push("/admin/dashboard");
            } else {
                setError("Invalid email or password");
            }
        } catch {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{ background: "radial-gradient(circle at 50% 30%, #15161d 0%, #08090d 70%)" }}
        >
            <div className="w-full max-w-sm">
                {/* Logo area */}
                <div className="text-center mb-12">
                    <div
                        className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
                        style={{ background: "linear-gradient(135deg, #e2b340, #f0cc62)" }}
                    >
                        <span className="text-xl font-extrabold text-black">A</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-white">
                        Admin Panel
                    </h1>
                    <p className="text-white/25 text-xs mt-1.5 tracking-wider uppercase">
                        Ammar Mahmoud Farghaly
                    </p>
                </div>

                {/* Card */}
                <div
                    className="rounded-3xl p-8"
                    style={{
                        background: "rgba(255,255,255,0.025)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        backdropFilter: "blur(20px)",
                    }}
                >
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-white/30 text-[10px] uppercase tracking-[0.15em] font-bold mb-2.5">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                required
                                className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder:text-white/15 outline-none transition-all"
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = "rgba(226,179,64,0.4)";
                                    e.target.style.boxShadow = "0 0 0 3px rgba(226,179,64,0.08)";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = "rgba(255,255,255,0.06)";
                                    e.target.style.boxShadow = "none";
                                }}
                            />
                        </div>
                        <div>
                            <label className="block text-white/30 text-[10px] uppercase tracking-[0.15em] font-bold mb-2.5">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder:text-white/15 outline-none transition-all"
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = "rgba(226,179,64,0.4)";
                                    e.target.style.boxShadow = "0 0 0 3px rgba(226,179,64,0.08)";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = "rgba(255,255,255,0.06)";
                                    e.target.style.boxShadow = "none";
                                }}
                            />
                        </div>

                        {error && (
                            <div
                                className="text-xs text-center py-2.5 rounded-xl"
                                style={{ background: "rgba(239,68,68,0.08)", color: "#f87171", border: "1px solid rgba(239,68,68,0.15)" }}
                            >
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-50"
                            style={{
                                background: "linear-gradient(135deg, #e2b340, #f0cc62)",
                                color: "#000",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-1px)";
                                e.currentTarget.style.boxShadow = "0 8px 24px rgba(226,179,64,0.3)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.416" strokeDashoffset="10" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
