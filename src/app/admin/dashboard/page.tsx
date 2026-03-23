"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */
interface Project {
    id: string;
    title: string;
    titleAr: string;
    category: string;
    image: string;
    techStack: string[];
    link: string;
    createdAt: string;
}

interface Article {
    slug: string;
    filename: string;
    title: string;
    excerpt: string;
    date: string;
    author: string;
    category: string;
    content: string;
}

/* ═══════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════ */
const styles = {
    card: {
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "1rem",
    } as React.CSSProperties,
    input: {
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "0.75rem",
        color: "#fff",
        padding: "0.75rem 1rem",
        fontSize: "0.875rem",
        width: "100%",
        outline: "none",
        transition: "all 0.2s",
    } as React.CSSProperties,
    goldBtn: {
        background: "linear-gradient(135deg, #e2b340, #f0cc62)",
        color: "#000",
        fontWeight: 700,
        fontSize: "0.75rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
        padding: "0.625rem 1.25rem",
        borderRadius: "0.75rem",
        border: "none",
        cursor: "pointer",
        transition: "all 0.2s",
    } as React.CSSProperties,
    ghostBtn: {
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "rgba(255,255,255,0.5)",
        fontSize: "0.75rem",
        fontWeight: 600,
        padding: "0.5rem 1rem",
        borderRadius: "0.625rem",
        cursor: "pointer",
        transition: "all 0.2s",
    } as React.CSSProperties,
    dangerBtn: {
        background: "rgba(239,68,68,0.08)",
        border: "1px solid rgba(239,68,68,0.15)",
        color: "rgba(248,113,113,0.7)",
        fontSize: "0.75rem",
        fontWeight: 600,
        padding: "0.5rem 1rem",
        borderRadius: "0.625rem",
        cursor: "pointer",
        transition: "all 0.2s",
    } as React.CSSProperties,
    label: {
        display: "block",
        color: "rgba(255,255,255,0.3)",
        fontSize: "10px",
        fontWeight: 700,
        textTransform: "uppercase" as const,
        letterSpacing: "0.15em",
        marginBottom: "0.5rem",
    } as React.CSSProperties,
};

/* ═══════════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════════ */
export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<"projects" | "articles">("projects");
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/admin/auth")
            .then((r) => r.json())
            .then((d) => {
                if (!d.authenticated) router.push("/admin");
                else setIsAuth(true);
            })
            .catch(() => router.push("/admin"));
    }, [router]);

    const handleLogout = async () => {
        await fetch("/api/admin/auth", { method: "DELETE" });
        router.push("/admin");
    };

    if (isAuth === null) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg className="animate-spin" style={{ width: 24, height: 24, color: "#e2b340" }} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.416" strokeDashoffset="10" />
                </svg>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh" }}>
            {/* ─── SIDEBAR HEADER ─── */}
            <header
                style={{
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    padding: "0 2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: "64px",
                    position: "sticky",
                    top: 0,
                    background: "rgba(8,9,13,0.85)",
                    backdropFilter: "blur(16px)",
                    zIndex: 50,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                    {/* Logo */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: 10,
                                background: "linear-gradient(135deg, #e2b340, #f0cc62)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 800,
                                fontSize: 14,
                                color: "#000",
                            }}
                        >
                            A
                        </div>
                        <span style={{ fontWeight: 700, fontSize: "1rem", color: "#fff", letterSpacing: "-0.02em" }}>
                            Admin
                        </span>
                    </div>

                    {/* Tabs */}
                    <nav style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 3 }}>
                        {(["projects", "articles"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: "0.5rem 1.25rem",
                                    borderRadius: 8,
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                    border: "none",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    background: activeTab === tab ? "rgba(255,255,255,0.08)" : "transparent",
                                    color: activeTab === tab ? "#fff" : "rgba(255,255,255,0.3)",
                                }}
                            >
                                {tab === "projects" ? "📁 Projects" : "📝 Articles"}
                            </button>
                        ))}
                    </nav>
                </div>

                <button
                    onClick={handleLogout}
                    style={{
                        ...styles.ghostBtn,
                        fontSize: "0.7rem",
                        padding: "0.4rem 1rem",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                >
                    Logout
                </button>
            </header>

            {/* ─── CONTENT ─── */}
            <main style={{ maxWidth: "72rem", margin: "0 auto", padding: "2rem" }}>
                {activeTab === "projects" ? <ProjectsManager /> : <ArticlesManager />}
            </main>
        </div>
    );
}

/* ═══════════════════════════════════════════
   STAT CARD
   ═══════════════════════════════════════════ */
function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
    return (
        <div style={{ ...styles.card, padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em" }}>
                        {label}
                    </p>
                    <p style={{ color: "#fff", fontSize: "2rem", fontWeight: 800, marginTop: 4, letterSpacing: "-0.03em" }}>
                        {value}
                    </p>
                </div>
                <span style={{ fontSize: "2rem" }}>{icon}</span>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════
   PROJECTS MANAGER
   ═══════════════════════════════════════════ */
function ProjectsManager() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        const res = await fetch("/api/admin/projects");
        const data = await res.json();
        setProjects(data.projects || []);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this project?")) return;
        await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
        fetchProjects();
    };

    const categoryColors: Record<string, string> = {
        web: "#3b82f6",
        mobile: "#10b981",
        dashboard: "#a855f7",
        design: "#f43f5e",
    };

    return (
        <div>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                <StatCard label="Total Projects" value={projects.length} icon="📁" />
                <StatCard label="Web" value={projects.filter((p) => p.category === "web").length} icon="🌐" />
                <StatCard label="Mobile" value={projects.filter((p) => p.category === "mobile").length} icon="📱" />
                <StatCard label="Dashboard" value={projects.filter((p) => p.category === "dashboard").length} icon="📊" />
            </div>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.125rem", fontWeight: 700 }}>All Projects</h2>
                <button
                    onClick={() => {
                        setEditingProject(null);
                        setShowForm(true);
                    }}
                    style={styles.goldBtn}
                >
                    + Add Project
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <ProjectForm
                    project={editingProject}
                    onClose={() => {
                        setShowForm(false);
                        setEditingProject(null);
                    }}
                    onSaved={fetchProjects}
                />
            )}

            {/* List */}
            {loading ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.2)" }}>Loading...</div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {projects.map((p) => (
                        <div
                            key={p.id}
                            style={{
                                ...styles.card,
                                padding: "1rem 1.25rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                        >
                            {/* Image */}
                            {p.image && (
                                <img
                                    src={p.image}
                                    alt={p.title}
                                    style={{ width: 56, height: 40, objectFit: "cover", borderRadius: 8, flexShrink: 0 }}
                                />
                            )}

                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {p.title}
                                </p>
                                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {p.titleAr}
                                </p>
                            </div>

                            {/* Category Badge */}
                            <span
                                style={{
                                    fontSize: "0.65rem",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em",
                                    padding: "0.25rem 0.625rem",
                                    borderRadius: "999px",
                                    background: `${categoryColors[p.category] || "#888"}15`,
                                    color: categoryColors[p.category] || "#888",
                                    border: `1px solid ${categoryColors[p.category] || "#888"}25`,
                                }}
                            >
                                {p.category}
                            </span>

                            {/* Tech Stack */}
                            <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                                {p.techStack.slice(0, 3).map((t) => (
                                    <span
                                        key={t}
                                        style={{
                                            fontSize: "0.6rem",
                                            padding: "0.2rem 0.5rem",
                                            borderRadius: 6,
                                            background: "rgba(255,255,255,0.04)",
                                            color: "rgba(255,255,255,0.35)",
                                        }}
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>

                            {/* Actions */}
                            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                                <button
                                    onClick={() => {
                                        setEditingProject(p);
                                        setShowForm(true);
                                    }}
                                    style={styles.ghostBtn}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(p.id)}
                                    style={styles.dangerBtn}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = "#f87171"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(248,113,113,0.7)"; }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════
   PROJECT FORM
   ═══════════════════════════════════════════ */
function ProjectForm({
    project,
    onClose,
    onSaved,
}: {
    project: Project | null;
    onClose: () => void;
    onSaved: () => void;
}) {
    const [form, setForm] = useState({
        title: project?.title || "",
        titleAr: project?.titleAr || "",
        category: project?.category || "web",
        image: project?.image || "",
        techStack: project?.techStack.join(", ") || "",
        link: project?.link || "",
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const body = {
            ...form,
            techStack: form.techStack
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            ...(project ? { id: project.id } : {}),
        };

        await fetch("/api/admin/projects", {
            method: project ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        setSaving(false);
        onSaved();
        onClose();
    };

    return (
        <div style={{ ...styles.card, padding: "1.75rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "0.875rem", fontWeight: 700 }}>
                    {project ? "✏️ Edit Project" : "✨ New Project"}
                </h3>
                <button
                    onClick={onClose}
                    style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: "1.25rem", cursor: "pointer" }}
                >
                    ×
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                        <label style={styles.label}>Title (EN)</label>
                        <input
                            placeholder="Project name"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            style={styles.input}
                            required
                        />
                    </div>
                    <div>
                        <label style={styles.label}>العنوان (AR)</label>
                        <input
                            placeholder="اسم المشروع"
                            value={form.titleAr}
                            onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                            style={styles.input}
                            dir="rtl"
                        />
                    </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                        <label style={styles.label}>Category</label>
                        <select
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            style={{ ...styles.input, cursor: "pointer" }}
                        >
                            <option value="web">🌐 Web</option>
                            <option value="mobile">📱 Mobile</option>
                            <option value="dashboard">📊 Dashboard</option>
                            <option value="design">🎨 Design</option>
                        </select>
                    </div>
                    <div>
                        <label style={styles.label}>Image URL</label>
                        <input
                            placeholder="https://images.unsplash.com/..."
                            value={form.image}
                            onChange={(e) => setForm({ ...form, image: e.target.value })}
                            style={styles.input}
                        />
                    </div>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                    <label style={styles.label}>Tech Stack</label>
                    <input
                        placeholder="React, Node.js, MongoDB"
                        value={form.techStack}
                        onChange={(e) => setForm({ ...form, techStack: e.target.value })}
                        style={styles.input}
                    />
                </div>
                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={styles.label}>Project Link</label>
                    <input
                        placeholder="https://..."
                        value={form.link}
                        onChange={(e) => setForm({ ...form, link: e.target.value })}
                        style={styles.input}
                    />
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button type="submit" disabled={saving} style={{ ...styles.goldBtn, opacity: saving ? 0.5 : 1 }}>
                        {saving ? "Saving..." : project ? "Update Project" : "Create Project"}
                    </button>
                    <button type="button" onClick={onClose} style={styles.ghostBtn}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

/* ═══════════════════════════════════════════
   ARTICLES MANAGER
   ═══════════════════════════════════════════ */
function ArticlesManager() {
    const [locale, setLocale] = useState<"en" | "ar">("en");
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);

    const fetchArticles = useCallback(async () => {
        setLoading(true);
        const res = await fetch(`/api/admin/articles?locale=${locale}`);
        const data = await res.json();
        setArticles(data.articles || []);
        setLoading(false);
    }, [locale]);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    const handleDelete = async (slug: string) => {
        if (!confirm("Delete this article?")) return;
        await fetch(`/api/admin/articles?locale=${locale}&slug=${slug}`, {
            method: "DELETE",
        });
        fetchArticles();
    };

    return (
        <div>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                <StatCard label="Total Articles" value={articles.length} icon="📝" />
                <StatCard label={`${locale.toUpperCase()} Articles`} value={articles.length} icon={locale === "en" ? "🇬🇧" : "🇪🇬"} />
            </div>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <h2 style={{ fontSize: "1.125rem", fontWeight: 700 }}>All Articles</h2>
                    {/* Locale Switcher */}
                    <div style={{ display: "flex", gap: 2, background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: 3 }}>
                        {(["en", "ar"] as const).map((l) => (
                            <button
                                key={l}
                                onClick={() => setLocale(l)}
                                style={{
                                    padding: "0.375rem 0.875rem",
                                    borderRadius: 6,
                                    fontSize: "0.7rem",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    border: "none",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    background: locale === l ? "rgba(255,255,255,0.08)" : "transparent",
                                    color: locale === l ? "#fff" : "rgba(255,255,255,0.25)",
                                }}
                            >
                                {l === "en" ? "🇬🇧 EN" : "🇪🇬 AR"}
                            </button>
                        ))}
                    </div>
                </div>
                <button
                    onClick={() => {
                        setEditingArticle(null);
                        setShowForm(true);
                    }}
                    style={styles.goldBtn}
                >
                    + Add Article
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <ArticleForm
                    article={editingArticle}
                    locale={locale}
                    onClose={() => {
                        setShowForm(false);
                        setEditingArticle(null);
                    }}
                    onSaved={fetchArticles}
                />
            )}

            {/* List */}
            {loading ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.2)" }}>Loading...</div>
            ) : articles.length === 0 ? (
                <div
                    style={{
                        ...styles.card,
                        padding: "3rem",
                        textAlign: "center",
                    }}
                >
                    <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📭</p>
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.875rem" }}>No articles yet</p>
                    <p style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.75rem", marginTop: 4 }}>Click &quot;Add Article&quot; to create one</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {articles.map((a) => (
                        <div
                            key={a.slug}
                            style={{
                                ...styles.card,
                                padding: "1rem 1.25rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                        >
                            {/* Icon */}
                            <div
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 10,
                                    background: "rgba(226,179,64,0.08)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "1rem",
                                    flexShrink: 0,
                                }}
                            >
                                📄
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p
                                    dir={locale === "ar" ? "rtl" : "ltr"}
                                    style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                                >
                                    {a.title}
                                </p>
                                <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.2)", marginTop: 2 }}>
                                    {a.date} {a.category && `· ${a.category}`}
                                </p>
                            </div>

                            {/* Actions */}
                            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                                <button
                                    onClick={() => {
                                        setEditingArticle(a);
                                        setShowForm(true);
                                    }}
                                    style={styles.ghostBtn}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(a.slug)}
                                    style={styles.dangerBtn}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = "#f87171"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(248,113,113,0.7)"; }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════
   ARTICLE FORM
   ═══════════════════════════════════════════ */
function ArticleForm({
    article,
    locale,
    onClose,
    onSaved,
}: {
    article: Article | null;
    locale: string;
    onClose: () => void;
    onSaved: () => void;
}) {
    const [form, setForm] = useState({
        title: article?.title || "",
        excerpt: article?.excerpt || "",
        date: article?.date || new Date().toISOString().split("T")[0],
        author: article?.author || (locale === "ar" ? "عمار محمود فرغلي" : "Ammar Mahmoud Farghaly"),
        category: article?.category || "",
        content: article?.content || "",
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const body = {
            ...form,
            locale,
            slug: article?.slug,
        };

        await fetch("/api/admin/articles", {
            method: article ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        setSaving(false);
        onSaved();
        onClose();
    };

    const isAr = locale === "ar";

    return (
        <div style={{ ...styles.card, padding: "1.75rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "0.875rem", fontWeight: 700 }}>
                    {article ? "✏️ Edit Article" : "✨ New Article"}{" "}
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", fontWeight: 500 }}>
                        ({locale.toUpperCase()})
                    </span>
                </h3>
                <button
                    onClick={onClose}
                    style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: "1.25rem", cursor: "pointer" }}
                >
                    ×
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "1rem" }}>
                    <label style={styles.label}>{isAr ? "عنوان المقال" : "Article Title"}</label>
                    <input
                        placeholder={isAr ? "أدخل عنوان المقال" : "Enter article title"}
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        style={styles.input}
                        dir={isAr ? "rtl" : "ltr"}
                        required
                    />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                    <label style={styles.label}>{isAr ? "وصف مختصر" : "Excerpt"}</label>
                    <input
                        placeholder={isAr ? "وصف مختصر للمقال..." : "Brief description..."}
                        value={form.excerpt}
                        onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                        style={styles.input}
                        dir={isAr ? "rtl" : "ltr"}
                    />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                        <label style={styles.label}>Date</label>
                        <input
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                            style={styles.input}
                        />
                    </div>
                    <div>
                        <label style={styles.label}>{isAr ? "الكاتب" : "Author"}</label>
                        <input
                            value={form.author}
                            onChange={(e) => setForm({ ...form, author: e.target.value })}
                            style={styles.input}
                            dir={isAr ? "rtl" : "ltr"}
                        />
                    </div>
                    <div>
                        <label style={styles.label}>{isAr ? "التصنيف" : "Category"}</label>
                        <input
                            placeholder={isAr ? "تقنية، تصميم..." : "tech, design..."}
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            style={styles.input}
                            dir={isAr ? "rtl" : "ltr"}
                        />
                    </div>
                </div>
                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={styles.label}>{isAr ? "محتوى المقال" : "Content"} (Markdown)</label>
                    <textarea
                        placeholder={isAr ? "اكتب محتوى المقال هنا..." : "Write article content here..."}
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        style={{
                            ...styles.input,
                            height: "280px",
                            resize: "vertical",
                            fontFamily: "'Monaco', 'Menlo', 'Courier New', monospace",
                            fontSize: "0.8125rem",
                            lineHeight: 1.7,
                        }}
                        dir={isAr ? "rtl" : "ltr"}
                    />
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button type="submit" disabled={saving} style={{ ...styles.goldBtn, opacity: saving ? 0.5 : 1 }}>
                        {saving ? "Saving..." : article ? "Update Article" : "Create Article"}
                    </button>
                    <button type="button" onClick={onClose} style={styles.ghostBtn}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
