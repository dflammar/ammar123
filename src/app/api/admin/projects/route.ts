import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "projects.json");

async function isAuthenticated(req: NextRequest) {
    const token = req.cookies.get("admin_token")?.value;
    if (!token) return false;
    // Dynamic import to share token store
    const { validTokens } = await import("../auth/route");
    return validTokens.has(token);
}

function readProjects() {
    const raw = fs.readFileSync(DATA_PATH, "utf8");
    return JSON.parse(raw).projects;
}

function writeProjects(projects: any[]) {
    fs.writeFileSync(DATA_PATH, JSON.stringify({ projects }, null, 2), "utf8");
}

// GET — list all projects
export async function GET(req: NextRequest) {
    if (!(await isAuthenticated(req))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const projects = readProjects();
    return NextResponse.json({ projects });
}

// POST — add a new project
export async function POST(req: NextRequest) {
    if (!(await isAuthenticated(req))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const projects = readProjects();

    const newProject = {
        id: Date.now().toString(),
        title: body.title || "",
        titleAr: body.titleAr || "",
        category: body.category || "web",
        image: body.image || "",
        techStack: body.techStack || [],
        link: body.link || "",
        createdAt: new Date().toISOString().split("T")[0],
    };

    projects.unshift(newProject);
    writeProjects(projects);

    return NextResponse.json({ success: true, project: newProject });
}

// PUT — update a project
export async function PUT(req: NextRequest) {
    if (!(await isAuthenticated(req))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const projects = readProjects();
    const index = projects.findIndex((p: any) => p.id === body.id);

    if (index === -1) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    projects[index] = { ...projects[index], ...body };
    writeProjects(projects);

    return NextResponse.json({ success: true, project: projects[index] });
}

// DELETE — delete a project
export async function DELETE(req: NextRequest) {
    if (!(await isAuthenticated(req))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    let projects = readProjects();

    projects = projects.filter((p: any) => p.id !== id);
    writeProjects(projects);

    return NextResponse.json({ success: true });
}
