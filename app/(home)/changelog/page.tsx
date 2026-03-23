import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { RiGithubFill } from '@remixicon/react';
import Link from 'next/link';
import Image from 'next/image';


export const metadata: Metadata = {
    title: 'Changelog - Titan Planet',
    description: 'Latest updates, improvements, and fixes for the Titan Framework.',
};

export const dynamic = 'force-dynamic';

export default async function ChangelogPage() {
    let markdown = '';

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const res = await fetch('https://raw.githubusercontent.com/ezet-galaxy/titanpl/main/CHANGELOG.md', {
            cache: 'no-store',
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
            throw new Error('Failed to fetch changelog');
        }

        markdown = await res.text();
    } catch (error) {
        console.warn('Changelog Sync: Destination Unreachable (Offline or DNS issue).');
        markdown = '# Changelog Unavailable\n\nWe could not sync the latest changelog from GitHub. Please check the [GitHub repository](https://github.com/ezet-galaxy/titanpl) manually for the latest updates.';
    }



    const systems = [
        { name: "Orbit System", image: "/images/orbit-system.png", href: "/docs/knowledge/03-orbit-system" },
        { name: "Gravity Runtime", image: "/images/gravity-runtime.png", href: "/docs/knowledge/02-runtime-architecture" },
        { name: "@titanpl/sdk", image: "/images/titanpl-sdk.png", href: "/docs/how-to-use/12-package-ecosystem" },
        { name: "Extensions", image: "/images/titanpl-ext.png", href: "/docs/knowledge/07-extensions" },
    ];

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[100px] opacity-80 mix-blend-screen dark:opacity-20 dark:bg-blue-500/10 dark:blur-[120px]" />
            </div>

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-16">
                    <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                        <div>
                            <Link
                                href="https://github.com/ezet-galaxy/titanpl"
                                target="_blank"
                                className="group inline-flex items-center gap-2 py-1.5 rounded-full border border-border/40 bg-zinc-100/50 dark:bg-zinc-900/50 backdrop-blur-md hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 hover:border-zinc-300/50 dark:hover:border-zinc-700/50 transition-all duration-300 mb-8 whitespace-nowrap"
                            >
                                <div className="flex ml-1 items-center justify-center p-1 rounded-full text-foreground group-hover:scale-110 transition-transform duration-300">
                                    <RiGithubFill className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors mr-2">
                                    Synced from GitHub
                                </span>
                            </Link>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
                                Changelog
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl">
                                Stay up to date with the latest improvements, fixes, and features for Titan Framework.
                            </p>
                        </div>

                        {/* System Logos */}
                        <div className="flex gap-4">
                            {systems.map((sys) => (
                                <Link
                                    key={sys.name}
                                    href={sys.href}
                                    className="group relative flex items-center justify-center w-14 h-14 rounded-2xl border bg-background/50 backdrop-blur-sm hover:scale-110 transition-all duration-300 overflow-hidden shadow-sm"
                                    title={sys.name}
                                >
                                    <Image
                                        src={sys.image}
                                        alt={sys.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {/* Tooltip */}
                                    <span className="absolute -bottom-10 px-2 py-1 bg-popover border rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 shadow-lg">
                                        {sys.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="relative">
                    <article className="prose prose-zinc dark:prose-invert max-w-none 
                        prose-headings:scroll-mt-28 
                        prose-headings:font-semibold prose-headings:tracking-tight
                        prose-a:text-blue-500 hover:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                        prose-pre:bg-zinc-100 dark:prose-pre:bg-zinc-900/50 prose-pre:backdrop-blur-sm prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl
                        prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-code:font-mono prose-code:text-sm
                        prose-img:rounded-xl prose-img:border prose-img:border-border/50 prose-img:shadow-lg
                        prose-hr:border-border/50 prose-hr:my-12
                        prose-p:text-muted-foreground prose-p:leading-relaxed
                        prose-li:text-muted-foreground prose-li:marker:text-zinc-400 dark:prose-li:marker:text-zinc-600
                    ">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h1: ({ node, ...props }) => <h1 className="hidden" {...props} />,
                                h2: ({ node, ...props }) => (
                                    <div className="group flex items-center mt-16 mb-8 pb-4 border-b border-border/40">
                                        <div className="flex-1">
                                            <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70" {...props} />
                                        </div>
                                    </div>
                                ),
                                h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mt-8 mb-4 flex items-center gap-2 text-foreground" {...props} />,
                                ul: ({ node, ...props }) => <ul className="my-6 space-y-2 list-disc list-outside ml-4" {...props} />,
                                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                blockquote: ({ node, ...props }) => (
                                    <blockquote className="border-l-4 border-blue-500/50 bg-blue-500/5 pl-6 py-4 rounded-r-lg my-8 not-italic text-muted-foreground" {...props} />
                                ),
                            }}
                        >
                            {markdown}
                        </ReactMarkdown>
                    </article>

                    {/* Bottom fade for smoother exit if needed, or visual spacer */}
                    <div className="w-full h-24" />
                </div>
            </div>
        </div>
    );
}
