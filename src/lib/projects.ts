import fs from "fs";
import path from "path";

export interface Project {
    id: string;
    title: string;
    titleAr: string;
    category: string;
    image: string;
    techStack: string[];
    link: string;
    createdAt: string;
}

const DATA_PATH = path.join(process.cwd(), "data", "projects.json");

export function getProjects(): Project[] {
    try {
        const raw = fs.readFileSync(DATA_PATH, "utf8");
        return JSON.parse(raw).projects;
    } catch {
        return [];
    }
}
