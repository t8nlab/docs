'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export function ConditionalFooter() {
    const pathname = usePathname();

    // Hide footer exactly on the observatory tool page
    // but show it everywhere else (including /observatory/download)
    if (pathname === '/observatory' || pathname.startsWith('/admin')) {
        return null;
    }

    return <Footer />;
}
