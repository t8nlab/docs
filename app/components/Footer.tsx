'use client';

import Link from "next/link";
import { Activity, ArrowRight, Zap } from "lucide-react";
import { RiGithubFill, RiNpmjsFill, RiTwitterXLine, RiDiscordFill } from "@remixicon/react";
import Image from "next/image";
import { useStatus } from "@/context/StatusContext";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "./AuthModal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

export default function Footer() {
    const { status } = useStatus();
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    const getStatusInfo = () => {
        switch (status) {
            case 'operational':
                return { text: 'All Systems Operational', color: 'bg-emerald-500', ping: 'bg-emerald-400' };
            case 'degraded':
                return { text: 'Performance Degraded', color: 'bg-amber-500', ping: 'bg-amber-400' };
            case 'maintenance':
                return { text: 'Systems Maintenance', color: 'bg-blue-500', ping: 'bg-blue-400' };
            default:
                return { text: 'Unknown Status', color: 'bg-gray-500', ping: 'bg-gray-400' };
        }
    };

    const { text, color, ping } = getStatusInfo();

    return (
        <footer className="w-full border-t border-black/5 dark:border-white/10 bg-white dark:bg-black z-50 relative">
            <div className="mx-auto w-full max-w-[1800px] px-6 py-12 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
                    {/* Brand/CTA Section */}
                    <div className="flex flex-col justify-between">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 overflow-hidden">
                                    <Image
                                        alt="Titan Planet Logo"
                                        src="/favicon.ico"
                                        width={32}
                                        height={32}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Titan Planet</span>
                            </div>

                            <p className="max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                                The modern backend framework for JavaScript developers who demand performance, type safety, and simplicity.
                            </p>

                            <Link
                                href="https://discord.gg/Dm9cD8QGUa"
                                target="_blank"
                                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-indigo-600 px-8 py-2 text-sm font-bold text-white transition-all hover:bg-indigo-500 hover:ring-4 hover:ring-indigo-500/20 active:scale-95 shadow-lg shadow-indigo-500/20"
                            >
                                <RiDiscordFill className="h-4 w-4 relative z-10" />
                                <span className="relative z-10">Join our Discord</span>
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 relative z-10" />
                                <div className="absolute inset-0 z-0 bg-linear-to-r from-indigo-600 to-violet-600 opacity-100 transition-opacity group-hover:opacity-90" />
                            </Link>
                            <div className="mt-6 flex flex-wrap gap-4">
                                <Link
                                    href="https://x.com/TitanPl"
                                    target="_blank"
                                    className="group flex h-10 w-10 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 transition-colors hover:bg-black/10 dark:hover:bg-white/20"
                                    aria-label="Twitter"
                                >
                                    <RiTwitterXLine className="h-5 w-5 text-zinc-700 dark:text-zinc-300 transition-colors group-hover:text-black dark:group-hover:text-white" />
                                </Link>
                                <Link
                                    href="https://discord.gg/Dm9cD8QGUa"
                                    target="_blank"
                                    className="group flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 dark:bg-indigo-500/10 transition-colors hover:bg-indigo-500/20 dark:hover:bg-indigo-500/20"
                                    aria-label="Discord"
                                >
                                    <RiDiscordFill className="h-5 w-5 text-indigo-500 dark:text-indigo-400 transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-300" />
                                </Link>
                                <Link
                                    href="https://github.com/t8nlab"
                                    target="_blank"
                                    className="group flex h-10 w-10 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 transition-colors hover:bg-black/10 dark:hover:bg-white/20"
                                    aria-label="GitHub"
                                >
                                    <RiGithubFill className="h-5 w-5 text-zinc-700 dark:text-zinc-300 transition-colors group-hover:text-black dark:group-hover:text-white" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="flex flex-col gap-4">
                            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Product</h3>
                            <Link href="/docs" className="text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white">
                                Documentation
                            </Link>
                            <Link href="/changelog" className="text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white">
                                Changelog
                            </Link>
                            <Link href="/observatory/download" className="text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white">
                                Observatory
                            </Link>
                            <Link href="/kit" className="flex gap-2 items-center text-sm text-indigo-500 dark:text-indigo-400 font-bold transition-all hover:scale-105 active:scale-95">
                                <Zap size={14} className="animate-pulse" />
                                TitanPL Kit
                            </Link>
                            <Link href="/benchmark" className="flex gap-2 items-center text-sm text-zinc-500 dark:text-zinc-400 font-medium transition-colors hover:text-zinc-900 dark:hover:text-white">
                                <Activity size={14} />
                                Benchmark
                            </Link>
                            <Link href="/docs/knowledge/01-how-it-works" className="text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white">
                                How Titan Works
                            </Link>
                            <Link href="/docs/knowledge/02-runtime-architecture" className="text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white">
                                Gravity Runtime
                            </Link>
                            <Link href="/extensions" className="text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-blue-500 dark:hover:text-blue-400">
                                Extension Market
                            </Link>
                            <Link href="/playground" className="text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white">
                                Project Titan
                            </Link>
                            <Link href="/security" className="text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-green-600">
                                Is Titan Secure?
                            </Link>
                        </div>

                        <div className="flex flex-col gap-6">
                            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Resources</h3>

                            {/* GitHub Group */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    <RiGithubFill className="h-4 w-4" />
                                    <span>Source Code</span>
                                </div>
                                <ul className="space-y-2 pl-3 border-l border-black/10 dark:border-white/10 border-dashed">
                                    <li>
                                        <Link href="https://github.com/t8nlab/titanpl" target="_blank" className="block text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white">
                                            titanpl
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="https://github.com/t8nlab/kit" target="_blank" className="block text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white">
                                            @titanpl/kit
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="https://github.com/shoya-129/core" target="_blank" className="block text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white">
                                            @titanpl/core
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="https://github.com/shoya-129/valid" target="_blank" className="block text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white">
                                            @titanpl/valid
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="https://github.com/David200197/eslint-plugin-titanpl" target="_blank" className="block text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white">
                                            eslint-plugin-titanpl
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="https://github.com/t8nlab/extTemplate" target="_blank" className="block text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white">
                                            @titanpl/extension-template
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* NPM Group */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    <RiNpmjsFill className="h-4 w-4" />
                                    <span>Packages</span>
                                </div>
                                <ul className="space-y-2 pl-3 border-l border-black/10 dark:border-white/10 border-dashed">
                                    <li>
                                        <Link href="https://www.npmjs.com/package/@titanpl/cli" target="_blank" className="block text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white">
                                            @titanpl/cli
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="https://www.npmjs.com/package/@titanpl/kit" target="_blank" className="block text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white">
                                            @titanpl/kit
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="https://www.npmjs.com/package/@titanpl/valid" target="_blank" className="block text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white">
                                            @titanpl/valid
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="https://www.npmjs.com/package/@titanpl/core" target="_blank" className="block text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white">
                                            @titanpl/core
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="https://www.npmjs.com/package/eslint-plugin-titanpl" target="_blank" className="block text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white">
                                            eslint-plugin-titanpl
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="https://www.npmjs.com/package/@titanpl/route" target="_blank" className="block text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white">
                                            @titanpl/route
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="https://www.npmjs.com/package/@titanpl/native" target="_blank" className="block text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white">
                                            @titanpl/native
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="https://www.npmjs.com/package/@titanpl/packet" target="_blank" className="block text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white">
                                            @titanpl/packet
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t border-black/5 dark:border-white/5 pt-8 sm:mt-20 lg:mt-24">
                    <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
                        <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                            &copy; {new Date().getFullYear()} Titan Planet. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link href="/status" className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white">
                                <span className="relative flex h-2 w-2">
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${ping}`}></span>
                                    <span className={`relative inline-flex rounded-full h-2 w-2 ${color}`}></span>
                                </span>
                                {text}
                            </Link>
                            <Link href="https://petalite-stew-867.notion.site/Ezet-privacy-vault-2742b05812ae802da69ef20c3ef491d8" target="_blank" className="text-xs text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white">
                                Privacy Policy
                            </Link>

                            {/* Seamless Auth Portal */}
                            <div className="flex items-center gap-4">
                                {user && (
                                    <button
                                        onClick={() => {
                                            logout();
                                            showToast.success('Session Ended', 'Logged out successfully.');
                                        }}
                                        className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-red-500 transition-colors"
                                    >
                                        Exit
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        if (!user) setIsAuthOpen(true);
                                        else if (user.isAdmin) router.push('/admin');
                                        else {
                                            // For regular users, maybe just show a simple toast or do nothing
                                            showToast.success('Titan Link Active', `Logged in as ${user.username}`);
                                        }
                                    }}
                                    className="group relative flex items-center justify-center"
                                    aria-label="Titan Portal"
                                >
                                    <div className="p-2 transition-all duration-500 group-hover:rotate-180">
                                        <div className="flex gap-[2px]">
                                            <span className={cn("w-1 h-1 rounded-full transition-colors", user ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-800 group-hover:bg-blue-500")} />
                                            <span className={cn("w-1 h-1 rounded-full transition-colors", user ? "bg-emerald-400" : "bg-zinc-200 dark:bg-zinc-800 group-hover:bg-blue-400")} />
                                            <span className={cn("w-1 h-1 rounded-full transition-colors", user ? "bg-emerald-300" : "bg-zinc-200 dark:bg-zinc-800 group-hover:bg-blue-300")} />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-full mb-3 px-3 py-1.5 rounded-xl bg-black/90 dark:bg-zinc-900 border border-white/5 text-[10px] font-black text-white opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none whitespace-nowrap shadow-2xl">
                                        {user ? (user.isAdmin ? 'DASHBOARD' : user.username.toUpperCase()) : 'CONNECT TO TITAN'}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90 dark:border-t-zinc-900" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
                onSuccess={(u) => {
                    setIsAuthOpen(false);
                    if (u.isAdmin) router.push('/admin');
                }}
            />
        </footer>
    );
}
