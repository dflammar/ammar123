#!/usr/bin/env node

/**
 * Auto-Generate MDX Articles Script
 *
 * Usage:
 *   node scripts/auto-generate-articles.js --lang en --topic "Your article topic"
 *   node scripts/auto-generate-articles.js --lang ar --topic "موضوع المقال"
 *
 * Requirements:
 *   - Set OPENAI_API_KEY environment variable
 *   - npm install openai (or have it globally)
 *
 * This script generates SEO-optimized MDX blog posts using OpenAI,
 * creates proper frontmatter, and saves them to the correct locale folder.
 */

const fs = require("fs");
const path = require("path");

// Parse CLI arguments
const args = process.argv.slice(2);
const langIndex = args.indexOf("--lang");
const topicIndex = args.indexOf("--topic");

if (langIndex === -1 || topicIndex === -1) {
    console.error("Usage: node auto-generate-articles.js --lang <en|ar> --topic <topic>");
    process.exit(1);
}

const lang = args[langIndex + 1];
const topic = args[topicIndex + 1];

if (!["en", "ar"].includes(lang)) {
    console.error('Error: Language must be "en" or "ar"');
    process.exit(1);
}

if (!topic) {
    console.error("Error: Topic is required");
    process.exit(1);
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error("Error: OPENAI_API_KEY environment variable is not set.");
    console.error("Set it with: set OPENAI_API_KEY=your-api-key (Windows)");
    console.error("Or: export OPENAI_API_KEY=your-api-key (Linux/Mac)");
    process.exit(1);
}

async function generateArticle() {
    const isArabic = lang === "ar";

    const systemPrompt = isArabic
        ? `أنت كاتب محتوى تقني محترف. اكتب مقالات مدونة باللغة العربية محسّنة لمحركات البحث. استخدم تنسيق Markdown مع عناوين H2 و H3 وقوائم ونقاط. اكتب محتوى قيم وعملي يتراوح بين 800-1200 كلمة. اكتب المحتوى فقط بدون frontmatter.`
        : `You are a professional tech content writer. Write SEO-optimized blog articles in English. Use Markdown formatting with H2, H3 headings, lists, and bullet points. Write valuable, practical content between 800-1200 words. Write only the content without frontmatter.`;

    const userPrompt = isArabic
        ? `اكتب مقال مدونة محسّن لمحركات البحث حول: "${topic}". يجب أن يكون المقال شاملاً وعملياً ومكتوباً بأسلوب احترافي. اكتب المحتوى فقط بدون أي frontmatter أو عنوان، سأضيفها لاحقاً.`
        : `Write an SEO-optimized blog article about: "${topic}". The article should be comprehensive, practical, and written in a professional tone. Write only the content without any frontmatter or title, I'll add those later.`;

    console.log(`\n🚀 Generating ${isArabic ? "Arabic" : "English"} article about: "${topic}"\n`);

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt },
                ],
                temperature: 0.7,
                max_tokens: 3000,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`OpenAI API Error: ${JSON.stringify(error)}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        // Generate metadata
        const titlePrompt = isArabic
            ? `اكتب عنوان SEO جذاب وقصير (أقل من 60 حرف) لمقال حول "${topic}". أعد العنوان فقط بدون علامات تنصيص.`
            : `Write a catchy, short SEO title (under 60 characters) for an article about "${topic}". Return only the title without quotes.`;

        const excerptPrompt = isArabic
            ? `اكتب وصف meta قصير (أقل من 160 حرف) لمقال حول "${topic}". أعد الوصف فقط بدون علامات تنصيص.`
            : `Write a short meta description (under 160 characters) for an article about "${topic}". Return only the description without quotes.`;

        const [titleRes, excerptRes] = await Promise.all([
            fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: titlePrompt }],
                    temperature: 0.7,
                    max_tokens: 100,
                }),
            }),
            fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: excerptPrompt }],
                    temperature: 0.7,
                    max_tokens: 200,
                }),
            }),
        ]);

        const titleData = await titleRes.json();
        const excerptData = await excerptRes.json();

        const title = titleData.choices[0].message.content.trim().replace(/^["']|["']$/g, "");
        const excerpt = excerptData.choices[0].message.content.trim().replace(/^["']|["']$/g, "");

        // Create slug from topic
        const slug = topic
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .slice(0, 60);

        const date = new Date().toISOString().split("T")[0];
        const author = isArabic ? "عمار محمود فرغلي" : "Ammar Mahmoud Farghaly";
        const category = isArabic ? "تطوير الويب" : "Web Development";

        // Build MDX file
        const mdxContent = `---
title: "${title}"
excerpt: "${excerpt}"
date: "${date}"
author: "${author}"
category: "${category}"
---

${content}
`;

        // Save file
        const outputDir = path.join(process.cwd(), "content", "blog", lang);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const filePath = path.join(outputDir, `${slug}.mdx`);
        fs.writeFileSync(filePath, mdxContent, "utf8");

        console.log(`✅ Article generated successfully!`);
        console.log(`📁 Saved to: ${filePath}`);
        console.log(`📝 Title: ${title}`);
        console.log(`📄 Excerpt: ${excerpt}`);
        console.log(`🏷️  Slug: ${slug}`);
    } catch (error) {
        console.error("❌ Error generating article:", error.message);
        process.exit(1);
    }
}

generateArticle();
