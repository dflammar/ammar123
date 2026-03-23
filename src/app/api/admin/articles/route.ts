import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

async function isAuthenticated(req: NextRequest) {
    const token = req.cookies.get("admin_token")?.value;
    if (!token) return false;
    const { validTokens } = await import("../auth/route");
    return validTokens.has(token);
}

function getArticles(locale: string) {
    const dir = path.join(CONTENT_DIR, locale);
    if (!fs.existsSync(dir)) return [];

    return fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".mdx"))
        .map((filename) => {
            const raw = fs.readFileSync(path.join(dir, filename), "utf8");
            const slug = filename.replace(".mdx", "");

            // Parse frontmatter
            const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
            if (!match) return { slug, filename, title: slug, excerpt: "", date: "", author: "", category: "", content: raw };

            const frontmatter = match[1];
            const content = match[2];

            const get = (key: string) => {
                const m = frontmatter.match(new RegExp(`^${key}:\\s*"?([^"\\n]*)"?`, "m"));
                return m ? m[1] : "";
            };

            return {
                slug,
                filename,
                title: get("title"),
                excerpt: get("excerpt"),
                date: get("date"),
                author: get("author"),
                category: get("category"),
                content: content.trim(),
            };
        })
        .sort((a, b) => (b.date > a.date ? 1 : -1));
}

// GET — list articles for a locale
export async function GET(req: NextRequest) {
    if (!(await isAuthenticated(req))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const locale = req.nextUrl.searchParams.get("locale") || "en";
    const articles = getArticles(locale);
    return NextResponse.json({ articles });
}

// POST — create a new article
export async function POST(req: NextRequest) {
    if (!(await isAuthenticated(req))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const locale = body.locale || "en";
    const slug =
        body.slug ||
        body.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .slice(0, 60);

    const dir = path.join(CONTENT_DIR, locale);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const mdxContent = `---
title: "${body.title || ""}"
excerpt: "${body.excerpt || ""}"
date: "${body.date || new Date().toISOString().split("T")[0]}"
author: "${body.author || (locale === "ar" ? "عمار محمود فرغلي" : "Ammar Mahmoud Farghaly")}"
category: "${body.category || ""}"
---

${body.content || ""}
`;

    fs.writeFileSync(path.join(dir, `${slug}.mdx`), mdxContent, "utf8");

    return NextResponse.json({ success: true, slug });
}

// PUT — update an existing article
export async function PUT(req: NextRequest) {
    if (!(await isAuthenticated(req))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const locale = body.locale || "en";
    const slug = body.slug;
    const filepath = path.join(CONTENT_DIR, locale, `${slug}.mdx`);

    if (!fs.existsSync(filepath)) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const mdxContent = `---
title: "${body.title || ""}"
excerpt: "${body.excerpt || ""}"
date: "${body.date || new Date().toISOString().split("T")[0]}"
author: "${body.author || ""}"
category: "${body.category || ""}"
---

${body.content || ""}
`;

    fs.writeFileSync(filepath, mdxContent, "utf8");

    return NextResponse.json({ success: true, slug });
}

// DELETE — delete an article
export async function DELETE(req: NextRequest) {
    if (!(await isAuthenticated(req))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const locale = req.nextUrl.searchParams.get("locale") || "en";
    const slug = req.nextUrl.searchParams.get("slug");

    if (!slug) {
        return NextResponse.json({ error: "Slug required" }, { status: 400 });
    }

    const filepath = path.join(CONTENT_DIR, locale, `${slug}.mdx`);

    if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
    }

    return NextResponse.json({ success: true });
}
