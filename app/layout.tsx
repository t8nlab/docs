import { RootProvider } from 'fumadocs-ui/provider/next';
import { AuthProvider } from '@/context/AuthContext';
import './global.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { Analytics } from "@vercel/analytics/next"
import { VersionProvider } from '@/context/VersionContext';
import { StatusProvider } from '@/context/StatusContext';
import { ConditionalFooter } from './components/ConditionalFooter';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Titan Planet Framework Docs',
  description:
    'Official documentation for Titan Planet Framework — a JavaScript-first backend framework that compiles JS into a native Rust + Axum server powered by the V8 JavaScript engine.',
  keywords: [
    'Ezet Galaxy Titan',
    'EzetGalaxyTitanPlanet',
    'Titan Framework',
    'Titan Planet',
    'Rust backend',
    'JavaScript backend',
    'Rust Axum',
    'V8 JavaScript engine',
    'Backend framework',
    'Zero config backend',
    'JS to Rust',
    'TitanPl',
    'Gravity Runtime',
    'TitanPl Core'
  ],
  authors: [{ name: 'Ezet Galaxy' }],
  creator: 'Titan Planet',
  publisher: 'Titan Planet',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    title: 'Titan Planet Framework Docs',
    description:
      'Build high-performance native Rust backends using pure JavaScript. Official Titan Planet documentation.',
    siteName: 'Titan Planet Docs',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Titan Planet Framework Docs',
    description:
      'JavaScript simplicity. Rust power. Native backends powered by the V8 engine.',
  },
  verification: {
    google: "_X5hMue4qdjjmB8Izg31ODqKG62J5mhQX0OfP_7RBYg",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body cz-shortcut-listen="true" className="flex flex-col min-h-screen">
        <RootProvider>
          <AuthProvider>
            <VersionProvider>
              <StatusProvider>
                {children}
                <ConditionalFooter />
                <Analytics />
                <Toaster position="bottom-right" reverseOrder={false} />
              </StatusProvider>
            </VersionProvider>
          </AuthProvider>
        </RootProvider>
      </body>
    </html>
  );
}
