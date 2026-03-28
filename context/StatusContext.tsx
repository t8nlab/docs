'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type SystemStatus = 'operational' | 'degraded' | 'maintenance';

export interface Vulnerability {
    id: string;
    affectedVersions: string[];
    component: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
    workaround?: string;
    status: 'active' | 'resolved';
    devDetails?: string;
    createdAt?: string;
}

interface StatusContextType {
    status: SystemStatus;
    activeVulnerabilities: Vulnerability[];
    resolvedVulnerabilities: Vulnerability[];
    refreshStatus: () => Promise<void>;
}

const StatusContext = createContext<StatusContextType | undefined>(undefined);

export const StatusProvider = ({ children }: { children: React.ReactNode }) => {
    const [status, setStatus] = useState<SystemStatus>('operational');
    const [activeVulnerabilities, setActiveVulnerabilities] = useState<Vulnerability[]>([]);
    const [resolvedVulnerabilities, setResolvedVulnerabilities] = useState<Vulnerability[]>([]);

    const fetchStatus = async () => {
        try {
            // Add timestamp to prevent browser caching
            const res = await fetch(`/api/status?t=${Date.now()}`, {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                }
            });
            const data = await res.json();
            setStatus(data.status);
            setActiveVulnerabilities(data.active || []);
            setResolvedVulnerabilities(data.resolved || []);
        } catch (error) {
            console.error('Failed to fetch status:', error);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    return (
        <StatusContext.Provider value={{ status, activeVulnerabilities, resolvedVulnerabilities, refreshStatus: fetchStatus }}>
            {children}
        </StatusContext.Provider>
    );
};

export const useStatus = () => {
    const context = useContext(StatusContext);
    if (context === undefined) {
        throw new Error('useStatus must be used within a StatusProvider');
    }
    return context;
};
