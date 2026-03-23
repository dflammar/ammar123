import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const ADMIN_EMAIL = "h@admin.com";
const ADMIN_PASS_HASH = crypto
    .createHash("sha256")
    .update("Ammar4455##")
    .digest("hex");

function hashPassword(password: string) {
    return crypto.createHash("sha256").update(password).digest("hex");
}

function generateToken() {
    return crypto.randomBytes(32).toString("hex");
}

// Simple in-memory token store (resets on server restart — acceptable for single-user admin)
const validTokens = new Set<string>();

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (email === ADMIN_EMAIL && hashPassword(password) === ADMIN_PASS_HASH) {
            const token = generateToken();
            validTokens.add(token);

            const response = NextResponse.json({ success: true });
            response.cookies.set("admin_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 60 * 60 * 8, // 8 hours
            });
            return response;
        }

        return NextResponse.json(
            { success: false, error: "Invalid credentials" },
            { status: 401 }
        );
    } catch {
        return NextResponse.json(
            { success: false, error: "Invalid request" },
            { status: 400 }
        );
    }
}

export async function GET(req: NextRequest) {
    const token = req.cookies.get("admin_token")?.value;
    if (token && validTokens.has(token)) {
        return NextResponse.json({ authenticated: true });
    }
    return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE(req: NextRequest) {
    const token = req.cookies.get("admin_token")?.value;
    if (token) validTokens.delete(token);

    const response = NextResponse.json({ success: true });
    response.cookies.delete("admin_token");
    return response;
}

// Export for use in other API routes
export { validTokens };
