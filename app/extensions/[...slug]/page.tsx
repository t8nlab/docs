"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
    RiVerifiedBadgeFill,
    RiNpmjsFill,
    RiGithubFill,
    RiArrowLeftLine,
    RiTimeLine,
    RiScalesLine,
    RiCodeLine,
    RiTerminalBoxLine,
    RiFileCopyLine,
    RiCheckLine,
    RiExternalLinkLine,
    RiStackLine,
    RiCalendarLine,
    RiPriceTag3Line,
    RiShieldCheckLine,
    RiBookOpenLine,
    RiGlobalLine,
    RiLoader4Line,
    RiBookOpenFill,
    RiFireFill,
    RiLightbulbFill,
    RiInformationFill,
    RiAlertFill,
    RiErrorWarningFill,
} from "@remixicon/react";

/* ─── Types ─── */
interface ExtensionDetail {
    id: string;
    name: string;
    npmPackage: string;
    githubRepo: string;
    docsLink: string;
    description: string;
    publisherId: string | null;
    isOfficial: boolean;
    createdAt: string;
    publisher?: { username: string; avatarUrl: string | null; isAdmin?: boolean };
    npm: {
        readme: string | null;
        latestVersion: string | null;
        license: string | null;
        homepage: string | null;
        keywords: string[];
        repository: any;
        maintainers: { name: string; email?: string }[];
        engines: Record<string, string> | null;
        dependencies: number;
        lastPublish: string | null;
        createdAt: string | null;
    };
    downloads: { monthly: number; weekly: number };
}

/* ─── Helpers ─── */
function fmtNum(n?: number | null): string {
    if (n == null) return "—";
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
    return n.toLocaleString();
}

function relativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const s = Math.floor(diff / 1000);
    if (s < 60) return "just now";
    const m = Math.floor(s / 60);
    if (m < 60) return `${m} minute${m > 1 ? "s" : ""} ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} hour${h > 1 ? "s" : ""} ago`;
    const d = Math.floor(h / 24);
    if (d < 30) return `${d} day${d > 1 ? "s" : ""} ago`;
    const mo = Math.floor(d / 30);
    if (mo < 12) return `${mo} month${mo > 1 ? "s" : ""} ago`;
    return `${Math.floor(mo / 12)} year${Math.floor(mo / 12) > 1 ? "s" : ""} ago`;
}

/* ─══════════════════════════════════════════════════════════════─ */
/*                         MAIN PAGE                               */
/* ─══════════════════════════════════════════════════════════════─ */
export default function ExtensionDetailPage() {
    const params = useParams();
    const slug = Array.isArray(params.slug)
        ? params.slug.join("/")
        : params.slug;

    const [ext, setExt] = useState<ExtensionDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [installCopied, setInstallCopied] = useState(false);

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        fetch(`/api/extensions/${slug}`)
            .then((r) => {
                if (!r.ok) throw new Error("Extension not found");
                return r.json();
            })
            .then((d) => { setExt(d); setError(null); })
            .catch((e) => { setError(e.message); setExt(null); })
            .finally(() => setLoading(false));
    }, [slug]);

    const copyInstall = () => {
        if (!ext) return;
        navigator.clipboard.writeText(`npm install ${ext.npmPackage}`);
        setInstallCopied(true);
        setTimeout(() => setInstallCopied(false), 2000);
    };

    /* ── Loading ── */
    if (loading) {
        return (
            <div className="ext-page-shell">
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
                    <div className="relative">
                        <RiLoader4Line size={44} className="animate-spin text-blue-500" />
                        <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
                    </div>
                    <span className="text-[11px] font-bold tracking-[0.3em] text-gray-600 animate-pulse uppercase">
                        Loading Extension…
                    </span>
                </div>
            </div>
        );
    }

    /* ── Error / Not Found ── */
    if (error || !ext) {
        return (
            <div className="ext-page-shell">
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
                    <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <RiShieldCheckLine size={34} className="text-red-400" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight">Extension Not Found</h2>
                    <p className="text-gray-500 max-w-sm text-sm">
                        The extension you&apos;re looking for doesn&apos;t exist or has been removed from the market.
                    </p>
                    <Link href="/extensions" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/8 transition-all text-sm font-bold">
                        <RiArrowLeftLine size={16} /> Back to Extensions
                    </Link>
                </div>
            </div>
        );
    }

    const npmUrl = `https://www.npmjs.com/package/${ext.npmPackage}`;
    const ghUrl = ext.githubRepo || null;

    return (
        <div className="ext-page-shell">
            {/* ── Top Nav ── */}
            <nav className="sticky top-0 z-50 bg-[#0a0a0b]/90 backdrop-blur-2xl border-b border-white/6">
                <div className="ext-container flex items-center justify-between h-14">
                    <div className="flex items-center gap-3">
                        <Link href="/extensions" className="p-2 -ml-2 rounded-lg hover:bg-white/5 transition-colors">
                            <RiArrowLeftLine size={18} className="text-gray-400" />
                        </Link>
                        <div className="hidden sm:flex items-center gap-1.5 text-[13px]">
                            <Link href="/extensions" className="text-gray-500 hover:text-gray-300 transition-colors">Extensions</Link>
                            <span className="text-gray-700">/</span>
                            <span className="text-white font-semibold">{ext.name}</span>
                            {ext.isOfficial && (
                                <RiVerifiedBadgeFill size={15} className="text-blue-400 ml-0.5" />
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* ── Header Section ── */}
            <header className="border-b border-white/6">
                <div className="ext-container py-8">
                    <div className="flex items-start gap-5">
                        <div className="w-16 h-16 shrink-0 rounded-2xl bg-linear-to-br from-white/6 to-white/2 border border-white/8 flex items-center justify-center">
                            <Image src="/images/titanpl-ext.png" alt={ext.name} width={44} height={44} className="object-contain rounded-xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap mb-1">
                                <h1 className="text-2xl font-black tracking-tight">{ext.name}</h1>
                                {ext.isOfficial && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                                        <RiVerifiedBadgeFill size={13} className="text-blue-400" />
                                        <span className="text-[10px] font-extrabold text-blue-400 tracking-widest">VERIFIED</span>
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                                <code className="text-[13px] text-gray-500 font-mono truncate max-w-[160px] sm:max-w-none">{ext.npmPackage}</code>
                                {ext.npm.latestVersion && (
                                    <span className="text-[12px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md font-mono font-bold">
                                        v{ext.npm.latestVersion}
                                    </span>
                                )}
                                {ext.npm.license && (
                                    <span className="text-[12px] px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-md font-semibold">
                                        {ext.npm.license}
                                    </span>
                                )}
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Link href={npmUrl} target="_blank" className="p-2 py-0.5 text-gray-400 flex items-center gap-1 rounded-lg bg-white/5 transition-colors" title="npm">
                                        <RiNpmjsFill size={18} className="text-[#CB3837] shrink-0" />
                                        <span className="text-[12px] font-semibold hidden sm:inline">
                                            {ext.npmPackage}
                                        </span>
                                    </Link>
                                    {ghUrl && (
                                        <Link href={ghUrl} target="_blank" className="p-2 py-0.5 text-gray-400 flex items-center gap-1 rounded-lg bg-white/5 transition-colors" title="GitHub">
                                            <RiGithubFill size={18} className="text-gray-400 shrink-0" />
                                            <span className="text-[12px] font-semibold hidden sm:inline">
                                                {ext.githubRepo}
                                            </span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                            <p className="text-[14px] text-gray-400 leading-relaxed max-w-2xl">{ext.description}</p>
                        </div>
                    </div>

                </div>
            </header>

            {/* ── Body: README + Sidebar ── */}
            <div className="ext-container py-8">
                <div className="ext-layout">
                    {/* Left: README */}
                    <main className="ext-main min-w-0">
                        <div className="flex items-center gap-2 mb-5">
                            <RiBookOpenLine size={16} className="text-gray-500" />
                            <span className="text-[12px] font-bold text-gray-500 tracking-wider uppercase">Readme</span>
                        </div>
                        <div className="ext-readme-card">
                            {ext.npm.readme ? (
                                <article className="ext-prose">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            code({ className, children, ...props }) {
                                                const match = /language-(\w+)/.exec(className || "");
                                                const rawCode = String(children).replace(/\n$/, "");
                                                // If it has a language- class, it's definitely a code block
                                                const isCodeBlock = !!match || (className && className.includes('language-'));
                                                const isInline = !isCodeBlock && !rawCode.includes('\n');

                                                if (!isInline) {
                                                    // Extract filename from first-line comment
                                                    const lines = rawCode.split("\n");
                                                    const firstLine = lines[0]?.trim() || "";
                                                    const fileMatch = firstLine.match(/^(?:\/\/|#|\/\*)\s*([\w.\/\-@]+\.\w+)\s*\*?\/?$/);
                                                    const fileName = fileMatch ? fileMatch[1] : null;
                                                    const displayCode = fileName ? lines.slice(1).join("\n").replace(/^\n/, "") : rawCode;
                                                    const lang = match ? match[1] : "txt";

                                                    return (
                                                        <div className="ext-codeblock group">
                                                            <div className="ext-codeblock-header">
                                                                <div className="flex items-center gap-2">
                                                                    <RiCodeLine size={13} className="text-gray-500" />
                                                                    {fileName ? (
                                                                        <span className="text-[11px] font-bold text-gray-400 tracking-wide">{fileName}</span>
                                                                    ) : (
                                                                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{lang}</span>
                                                                    )}
                                                                </div>
                                                                <InlineCopyBtn text={displayCode} />
                                                            </div>
                                                            <SyntaxHighlighter
                                                                style={oneDark}
                                                                language={lang}
                                                                PreTag="div"
                                                                codeTagProps={{ style: { background: "none" } }}
                                                                customStyle={{
                                                                    margin: 0,
                                                                    padding: "1rem 1.25rem",
                                                                    background: "#0d1117",
                                                                    fontSize: "0.8125rem",
                                                                    lineHeight: "1.75",
                                                                    borderRadius: "0 0 0.75rem 0.75rem",
                                                                }}
                                                            >
                                                                {displayCode}
                                                            </SyntaxHighlighter>
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <code className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[0.9em] font-medium mx-0.5" {...props}>
                                                        {children}
                                                    </code>
                                                );
                                            },
                                            blockquote({ children }) {
                                                // Helper to get text content from React children
                                                const getRawText = (node: any): string => {
                                                    if (typeof node === 'string') return node;
                                                    if (Array.isArray(node)) return node.map(getRawText).join('');
                                                    if (node?.props?.children) return getRawText(node.props.children);
                                                    return '';
                                                };

                                                const fullText = getRawText(children).trim();
                                                let type: 'note' | 'tip' | 'important' | 'warning' | 'deprecated' = 'note';


                                                if (fullText.startsWith('[!TIP]')) type = 'tip';
                                                else if (fullText.startsWith('[!IMPORTANT]')) type = 'important';
                                                else if (fullText.startsWith('[!WARNING]') || fullText.startsWith('[!CAUTION]')) type = 'warning';
                                                else if (fullText.startsWith('[!DEPRECATED]')) type = 'deprecated';
                                                else if (fullText.startsWith('[!NOTE]') || fullText.startsWith('[!INFO]')) type = 'note';

                                                // Determine styles and icon
                                                const configs = {
                                                    tip: {
                                                        icon: <RiLightbulbFill size={24} />,
                                                        color: "text-emerald-400",
                                                        bg: "bg-emerald-500/5",
                                                        border: "border-emerald-500/10",
                                                        shadow: "shadow-[0_0_50px_-20px_rgba(16,185,129,0.1)]"
                                                    },
                                                    important: {
                                                        icon: <RiAlertFill size={24} />,
                                                        color: "text-indigo-400",
                                                        bg: "bg-indigo-500/5",
                                                        border: "border-indigo-500/10",
                                                        shadow: "shadow-[0_0_50px_-20px_rgba(99,102,241,0.1)]"
                                                    },
                                                    warning: {
                                                        icon: <RiErrorWarningFill size={24} />,
                                                        color: "text-amber-400",
                                                        bg: "bg-amber-500/5",
                                                        border: "border-amber-500/10",
                                                        shadow: "shadow-[0_0_50px_-20px_rgba(245,158,11,0.1)]"
                                                    },
                                                    deprecated: {
                                                        icon: <RiFireFill size={24} />,
                                                        color: "text-red-400",
                                                        bg: "bg-red-500/5",
                                                        border: "border-red-500/10",
                                                        shadow: "shadow-[0_0_50px_-20px_rgba(239,68,68,0.1)]"
                                                    },
                                                    note: {
                                                        icon: <RiInformationFill size={24} />,
                                                        color: "text-blue-400",
                                                        bg: "bg-blue-500/5",
                                                        border: "border-blue-500/10",
                                                        shadow: "shadow-[0_0_50px_-20px_rgba(59,130,246,0.1)]"
                                                    }
                                                };

                                                const config = configs[type];

                                                // Clean up the text by removing the prefix from the children
                                                const cleanChildren = React.Children.map(children, (child: any) => {
                                                    if (React.isValidElement(child) && (child.props as any).children) {
                                                        const grandChildren = React.Children.map((child.props as any).children, (grandChild: any) => {
                                                            if (typeof grandChild === 'string') {
                                                                return grandChild.replace(/^\[!(TIP|IMPORTANT|WARNING|CAUTION|DEPRECATED|NOTE|INFO)\]\s*/i, '');
                                                            }
                                                            return grandChild;
                                                        });
                                                        return React.cloneElement(child as any, { children: grandChildren });
                                                    }
                                                    return child;
                                                });

                                                return (
                                                    <div className={`my-8 px-4 pt-3 rounded-xl border ${config.border} ${config.bg} flex gap-5 items-start transition-all hover:brightness-110 ${config.shadow}`}>
                                                        <div className={`${config.color} shrink-0`}>
                                                            {config.icon}
                                                        </div>
                                                        <div className="text-[15px] text-gray-300 leading-relaxed font-medium alert-content [&>p]:m-0">
                                                            {cleanChildren}
                                                        </div>
                                                    </div>
                                                );
                                            },
                                            a({ href, children, ...props }) {
                                                return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
                                            },
                                            table({ children }) {
                                                return (
                                                    <div className="overflow-x-auto rounded-lg border border-white/8 my-5">
                                                        <table>{children}</table>
                                                    </div>
                                                );
                                            },
                                        }}
                                    >
                                        {ext.npm.readme}
                                    </ReactMarkdown>
                                </article>
                            ) : (
                                <div className="py-16 text-center">
                                    <RiBookOpenLine size={32} className="text-gray-700 mx-auto mb-3" />
                                    <p className="text-sm text-gray-500 font-medium">No README available</p>
                                </div>
                            )}
                        </div>
                    </main>

                    {/* Right: Sidebar */}
                    <aside className="ext-sidebar">
                        {/* Install */}
                        <SidebarSection title="Install">
                            <button onClick={copyInstall} className="w-full flex items-center gap-2 bg-[#111113] border border-white/8 rounded-lg px-3 h-9 hover:border-white/15 transition-all group text-left">
                                <code className="text-[12px] font-mono text-gray-300 truncate flex-1">npm i {ext.npmPackage}</code>
                                {installCopied
                                    ? <RiCheckLine size={13} className="text-emerald-400 shrink-0" />
                                    : <RiFileCopyLine size={13} className="text-gray-700 group-hover:text-gray-400 shrink-0 transition-colors" />
                                }
                            </button>
                        </SidebarSection>

                        {/* Downloads */}
                        <SidebarSection title="Weekly Downloads">
                            <div className="flex items-baseline gap-2 mb-3">
                                <span className="text-2xl font-black tracking-tight">{fmtNum(ext.downloads.weekly)}</span>
                            </div>
                            {/* Mini bar chart visual */}
                            <div className="flex items-end gap-[3px] h-8 mb-2">
                                {Array.from({ length: 12 }).map((_, i) => {
                                    const ratio = ext.downloads.monthly > 0
                                        ? (ext.downloads.weekly / ext.downloads.monthly) * 4
                                        : 0.3;
                                    const h = Math.max(12, Math.min(100, (ratio + Math.random() * 0.4 - 0.2) * 100));
                                    return (
                                        <div key={i} className="flex-1 rounded-sm bg-blue-500/60" style={{ height: `${h}%` }} />
                                    );
                                })}
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-gray-600">
                                <span>Monthly: <span className="text-gray-400 font-bold">{fmtNum(ext.downloads.monthly)}</span></span>
                                <span>Weekly: <span className="text-gray-400 font-bold">{fmtNum(ext.downloads.weekly)}</span></span>
                            </div>
                        </SidebarSection>

                        {/* Version & Meta */}
                        <SidebarSection title="Package Details">
                            <div className="space-y-0">
                                <MetaRow icon={<RiPriceTag3Line size={14} className="text-blue-400" />} label="Version" value={ext.npm.latestVersion || "—"} />
                                <MetaRow icon={<RiScalesLine size={14} className="text-purple-400" />} label="License" value={ext.npm.license || "—"} />
                                <MetaRow icon={<RiStackLine size={14} className="text-orange-400" />} label="Dependencies" value={String(ext.npm.dependencies)} />
                                {ext.npm.lastPublish && (
                                    <MetaRow icon={<RiTimeLine size={14} className="text-emerald-400" />} label="Last Publish" value={relativeTime(ext.npm.lastPublish)} />
                                )}
                                {ext.npm.createdAt && (
                                    <MetaRow icon={<RiCalendarLine size={14} className="text-pink-400" />} label="Created" value={new Date(ext.npm.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} />
                                )}
                            </div>
                        </SidebarSection>

                        {/* Publisher */}
                        <SidebarSection title="Publisher">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 shrink-0 rounded-lg bg-linear-to-br from-white/8 to-white/2 border border-white/8 flex items-center justify-center overflow-hidden text-xs font-bold text-gray-500">
                                    {ext.publisher?.avatarUrl ? (
                                        <Image src={ext.publisher.avatarUrl} alt={ext.publisher.username} width={36} height={36} />
                                    ) : (
                                        ext.publisher?.username?.charAt(0)?.toUpperCase() || "T"
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[13px] font-bold truncate">{ext.publisher?.username || "Titan"}</span>
                                        {(ext.isOfficial || ext.publisher?.isAdmin) && <RiVerifiedBadgeFill size={13} className="text-blue-400 shrink-0" />}
                                    </div>
                                    <span className="text-[11px] text-gray-600">{ext.isOfficial ? "Official" : "Community"}</span>
                                </div>
                            </div>
                        </SidebarSection>

                        {/* Maintainers */}
                        {ext.npm.maintainers.length > 0 && (
                            <SidebarSection title="Maintainers">
                                <div className="flex flex-wrap gap-2">
                                    {ext.npm.maintainers.map((m, i) => (
                                        <Link key={i} href={`https://www.npmjs.com/~${m.name}`} target="_blank" title={m.name}
                                            className="px-2 h-8 rounded-lg bg-white/4 border border-white/8 flex items-center justify-center text-[11px] font-bold text-gray-500 hover:bg-white/8 hover:text-white transition-all max-w-full">
                                            <span className="truncate">{m.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </SidebarSection>
                        )}

                        {/* Links */}
                        <SidebarSection title="Links">
                            <div className="space-y-0.5">
                                <SidebarLink icon={<RiNpmjsFill size={14} className="text-[#CB3837]" />} label="npm" href={npmUrl} />
                                {ghUrl && <SidebarLink icon={<RiGithubFill size={14} className="text-white" />} label="Repository" href={ghUrl} />}
                                {ext.npm.homepage && <SidebarLink icon={<RiGlobalLine size={14} className="text-blue-400" />} label="Homepage" href={ext.npm.homepage} />}
                                {ext.docsLink && <SidebarLink icon={<RiBookOpenLine size={14} className="text-green-600" />} label="Docs" href={ext.docsLink} />}
                            </div>
                        </SidebarSection>

                        {/* Keywords */}
                        {ext.npm.keywords.length > 0 && (
                            <SidebarSection title="Keywords">
                                <div className="flex flex-wrap gap-1.5">
                                    {ext.npm.keywords.map((kw, i) => (
                                        <span key={i} className="px-2.5 py-1 bg-white/3 border border-white/6 rounded-md text-[11px] text-gray-400 font-medium hover:bg-white/6 hover:text-white transition-all cursor-default max-w-full truncate">
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </SidebarSection>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
}

/* ─── Sidebar Sub-Components ─── */

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="ext-sidebar-section">
            <h3 className="text-[10px] font-extrabold text-gray-500 tracking-[0.18em] uppercase mb-3">{title}</h3>
            {children}
        </div>
    );
}

function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-white/4 last:border-0 gap-3 min-w-0">
            <span className="flex items-center gap-2 text-[12px] text-gray-500 shrink-0">{icon}{label}</span>
            <span className="text-[12px] font-bold text-white font-mono truncate text-right">{value}</span>
        </div>
    );
}

function SidebarLink({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
    return (
        <Link href={href} target="_blank" className="flex items-center gap-2.5 px-2 py-1.5 -mx-2 rounded-lg hover:bg-white/4 transition-colors group min-w-0">
            <div className="shrink-0">{icon}</div>
            <span className="text-[12px] text-gray-400 group-hover:text-white transition-colors flex-1 font-medium truncate">{label}</span>
            <RiExternalLinkLine size={12} className="text-gray-700 group-hover:text-gray-400 transition-colors shrink-0" />
        </Link>
    );
}

function InlineCopyBtn({ text }: { text: string }) {
    const [done, setDone] = useState(false);
    return (
        <button onClick={() => { navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000); }}
            className="p-1 rounded hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100">
            {done ? <RiCheckLine size={16} className="text-emerald-400" /> : <RiFileCopyLine size={16} className="text-gray-400" />}
        </button>
    );
}