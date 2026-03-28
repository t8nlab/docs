import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { vulnerabilities, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fresh check against DB
        const user = await db.query.users.findFirst({
            where: eq(users.uid, session.uid)
        });

        if (!user || !user.isAdmin) {
            return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 });
        }

        const body = await req.json();
        const { id, affectedVersions, component, severity, description, workaround, status, devDetails } = body;

        // Basic validation
        if (!id || !affectedVersions || !component || !severity || !description) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await db.insert(vulnerabilities).values({
            id,
            affectedVersions: Array.isArray(affectedVersions) ? affectedVersions : [affectedVersions],
            component,
            severity,
            description,
            workaround,
            devDetails,
            status: status || 'active'
        });

        return NextResponse.json({ success: true, message: 'Vulnerability added successfully' });

    } catch (error: any) {
        console.error('Admin status error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const user = await db.query.users.findFirst({ where: eq(users.uid, session.uid) });
        if (!user || !user.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const { id, status, devDetails } = await req.json();
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        await db.update(vulnerabilities)
            .set({ status, devDetails })
            .where(eq(vulnerabilities.id, id));

        return NextResponse.json({ success: true, message: 'Incident updated.' });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to update incident' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const user = await db.query.users.findFirst({ where: eq(users.uid, session.uid) });
        if (!user || !user.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        await db.delete(vulnerabilities).where(eq(vulnerabilities.id, id));

        return NextResponse.json({ success: true, message: 'Incident purged.' });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to delete incident' }, { status: 500 });
    }
}
