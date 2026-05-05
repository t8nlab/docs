'use client';

import React, { createContext, useContext } from 'react';

interface VersionContextType {
    titanVersion: string;
    expressVersion: string;
}

const VersionContext = createContext<VersionContextType | undefined>(undefined);

export const VersionProvider = ({ children }: { children: React.ReactNode }) => {
    const titanVersion = 'v7.0.4';
    const expressVersion = 'v5.2.1';

    return (
        <VersionContext.Provider value={{ titanVersion, expressVersion }}>
            {children}
        </VersionContext.Provider>
    );
};

export const useVersion = () => {
    const context = useContext(VersionContext);
    if (context === undefined) {
        throw new Error('useVersion must be used within a VersionProvider');
    }
    return context;
};
