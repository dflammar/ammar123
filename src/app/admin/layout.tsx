import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
    title: "Admin Panel",
    robots: { index: false, follow: false },
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" dir="ltr">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body
                className="antialiased"
                style={{
                    background: "#08090d",
                    color: "#f5f5f5",
                    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                }}
            >
                {children}
            </body>
        </html>
    );
}
