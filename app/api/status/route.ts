
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { vulnerabilities } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Active Vulnerabilities
        const activeVulnerabilities = await db.query.vulnerabilities.findMany({
            where: eq(vulnerabilities.status, 'active')
        });

        // Resolved History
        const resolvedVulnerabilities = await db.query.vulnerabilities.findMany({
            where: eq(vulnerabilities.status, 'resolved'),
            orderBy: [desc(vulnerabilities.createdAt)],
            limit: 5
        });

        // Determine Status
        let status = 'operational';
        if (activeVulnerabilities.length > 0) {
            const hasHighSeverity = activeVulnerabilities.some(v => v.severity === 'high');
            status = hasHighSeverity ? 'degraded' : 'operational';
        }

        return NextResponse.json({
            status,
            active: activeVulnerabilities,
            resolved: resolvedVulnerabilities
        }, { status: 200 });

    } catch (error) {
        console.error('Failed to fetch status:', error);

        // Fallback
        return NextResponse.json({
            status: 'degraded',
            active: [
                {
                    id: 'TPL-EXT-TEST-001-26',
                    affectedVersions: ['26.12.8', '26.12.6'],
                    component: 'TitanPL Core Extension',
                    severity: 'high',
                    description: 'Core extension suggestions are working, but the testing of native extensions is not working properly under high vulnerability conditions.',
                    status: 'active',
                    workaround: null,
                    createdAt: new Date().toISOString()
                }
            ],
            resolved: []
        }, { status: 200 });
    }
}
