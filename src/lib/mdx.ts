import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const contentDirectory = path.join(process.cwd(), "content", "blog");

export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    author: string;
    category: string;
    readingTime: string;
    content: string;
}

export function getAllPosts(locale: string): BlogPost[] {
    const localeDir = path.join(contentDirectory, locale);

    if (!fs.existsSync(localeDir)) {
        return [];
    }

    const files = fs.readdirSync(localeDir).filter((f) => f.endsWith(".mdx"));

    const posts = files.map((filename) => {
        const slug = filename.replace(/\.mdx$/, "");
        return getPostBySlug(slug, locale);
    }).filter((post): post is BlogPost => post !== null);

    return posts.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

export function getPostBySlug(
    slug: string,
    locale: string
): BlogPost | null {
    try {
        const filePath = path.join(contentDirectory, locale, `${slug}.mdx`);
        const fileContents = fs.readFileSync(filePath, "utf8");
        const { data, content } = matter(fileContents);
        const stats = readingTime(content);

        return {
            slug,
            title: data.title || "",
            excerpt: data.excerpt || "",
            date: data.date || new Date().toISOString(),
            author: data.author || "Ammar Mahmoud Farghaly",
            category: data.category || "Web Development",
            readingTime: Math.ceil(stats.minutes).toString(),
            content,
        };
    } catch {
        return null;
    }
}
