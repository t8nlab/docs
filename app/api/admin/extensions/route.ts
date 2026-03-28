import { NextResponse } from "next/server";
import { db } from "@/db";
import { extensions, users, vulnerabilities } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { desc, eq, and } from "drizzle-orm";

export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const user = await db.query.users.findFirst({
            where: eq(users.uid, session.uid)
        });

        if (!user?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "10");
        const offset = parseInt(searchParams.get("offset") || "0");
        const search = searchParams.get("search") || "";

        // Query all for stats calculation
        const allExtensions = await db.query.extensions.findMany({
            orderBy: [desc(extensions.createdAt)],
            with: {
                publisher: {
                    columns: {
                        username: true,
                        avatarUrl: true,
                    }
                }
            }
        });

        const activeVulnerabilities = await db.query.vulnerabilities.findMany({
            where: eq(vulnerabilities.status, "active")
        });

        const filtered = search 
            ? allExtensions.filter(e => 
                e.name.toLowerCase().includes(search.toLowerCase()) || 
                e.npmPackage.toLowerCase().includes(search.toLowerCase()))
            : allExtensions;

        const paginated = filtered.slice(offset, offset + limit);
        const hasMore = offset + limit < filtered.length;

        // Stats for the UI
        const stats = {
            total: allExtensions.length,
            official: allExtensions.filter(e => e.isOfficial).length,
            community: allExtensions.filter(e => !e.isOfficial).length,
            issues: activeVulnerabilities.length
        };

        return NextResponse.json({ 
            extensions: paginated, 
            hasMore,
            stats
        });
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch extensions" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const user = await db.query.users.findFirst({
            where: eq(users.uid, session.uid)
        });

        if (!user?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const body = await req.json();
        const { name, npmPackage, description, isOfficial, githubRepo, docsLink } = body;

        const [newExtension] = await db.insert(extensions).values({
            id: crypto.randomUUID(),
            name,
            npmPackage,
            description,
            isOfficial: !!isOfficial,
            githubRepo,
            docsLink,
            publisherId: user.uid
        }).returning();

        return NextResponse.json({ extension: newExtension });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to create extension" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const user = await db.query.users.findFirst({
            where: eq(users.uid, session.uid)
        });

        if (!user?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const body = await req.json();
        const { id, ...updates } = body;

        if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

        const [updatedExtension] = await db.update(extensions)
            .set(updates)
            .where(eq(extensions.id, id))
            .returning();

        return NextResponse.json({ extension: updatedExtension });
    } catch (e) {
        return NextResponse.json({ error: "Failed to update extension" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const user = await db.query.users.findFirst({
            where: eq(users.uid, session.uid)
        });

        if (!user?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

        await db.delete(extensions).where(eq(extensions.id, id));

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: "Failed to delete extension" }, { status: 500 });
    }
}
