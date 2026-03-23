"use client"

import { motion } from "framer-motion"
import { Shield, Lock, Cpu, Zap, Activity, AlertTriangle, CheckCircle2, Server, Globe, Package } from "lucide-react"
import Link from "next/link"
import { Feature } from "@/app/components/Feature"

export default function SecurityPage() {
    return (
        <main className="relative flex min-h-screen flex-col items-center overflow-x-hidden bg-background pt-32 pb-20">
            {/* Background glow effects */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px] mix-blend-screen opacity-50 dark:opacity-20" />
                <div className="absolute right-0 top-1/2 h-[500px] w-[500px] translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[120px] mix-blend-screen opacity-30 dark:opacity-10" />
            </div>

            {/* Hero Section */}
            <div className="max-w-4xl text-center px-6 mb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center"
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-semibold text-emerald-500 backdrop-blur-md mb-8">
                        <Shield className="h-3 w-3" />
                        <span>Hardened Security Infrastructure</span>
                    </div>

                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl bg-clip-text text-transparent bg-linear-to-b from-foreground via-foreground/90 to-foreground/50">
                        Is TitanPL Secure?
                    </h1>

                    <p className="mt-8 max-w-2xl mx-auto leading-relaxed text-muted-foreground text-lg">
                        More than just a framework. TitanPL is a high-performance, zero-trust execution environment that prioritizes your data safety without sacrificing speed.
                    </p>
                </motion.div>
            </div>

            {/* Comparison Table Section */}
            <div className="w-full max-w-5xl px-6 mb-32">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="rounded-3xl border border-border bg-card/40 backdrop-blur-xl overflow-hidden shadow-2xl"
                >
                    <div className="p-8 border-b border-white/5 bg-linear-to-br from-emerald-500/5 via-transparent to-transparent">
                        <h2 className="text-2xl font-bold mb-2">Security Benchmark</h2>
                        <p className="text-sm text-muted-foreground">How TitanPL redefines backend safety compared to standard runtimes.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border/50 bg-muted/30">
                                    <th className="p-6 text-sm font-semibold">Security Feature</th>
                                    <th className="p-6 text-sm font-semibold text-zinc-400">Node.js</th>
                                    <th className="p-6 text-sm font-semibold text-blue-500">Deno</th>
                                    <th className="p-6 text-sm font-semibold text-emerald-500 bg-emerald-500/5">TitanPL</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-border/50 transition-colors hover:bg-white/5">
                                    <td className="p-6 text-sm font-medium">Memory Safety (Core)</td>
                                    <td className="p-6 text-sm text-red-500/70 italic">Manual (C/C++)</td>
                                    <td className="p-6 text-sm text-emerald-500">Rust Core ✅</td>
                                    <td className="p-6 text-sm text-emerald-500 font-bold bg-emerald-500/5">Rust Core ✅</td>
                                </tr>
                                <tr className="border-b border-border/50 transition-colors hover:bg-white/5">
                                    <td className="p-6 text-sm font-medium">Native Sandbox</td>
                                    <td className="p-6 text-sm text-red-500/70 italic">None</td>
                                    <td className="p-6 text-sm text-zinc-400">Permissions ⚠️</td>
                                    <td className="p-6 text-sm text-emerald-500 font-bold bg-emerald-500/5">Process-Isolated ✅</td>
                                </tr>
                                <tr className="border-b border-border/50 transition-colors hover:bg-white/5">
                                    <td className="p-6 text-sm font-medium">Post-install Scripts</td>
                                    <td className="p-6 text-sm text-red-500/70 italic">Allowed (Risk)</td>
                                    <td className="p-6 text-sm text-emerald-500">None ✅</td>
                                    <td className="p-6 text-sm text-emerald-500 font-bold bg-emerald-500/5">Blocked (Gravity) ✅</td>
                                </tr>
                                <tr className="border-b border-border/50 transition-colors hover:bg-white/5">
                                    <td className="p-6 text-sm font-medium">Binary Verification</td>
                                    <td className="p-6 text-sm text-zinc-400">Partial</td>
                                    <td className="p-6 text-sm text-zinc-400">Partial</td>
                                    <td className="p-6 text-sm text-emerald-500 font-bold bg-emerald-500/5">Signed & Static ✅</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>

            {/* Core Security Pillars */}
            <div className="w-full max-w-6xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                <div className="group p-8 rounded-3xl border border-border bg-card/30 backdrop-blur-sm transition-all hover:border-emerald-500/50 hover:shadow-emerald-500/10 hover:shadow-2xl">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                        <Cpu className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">V8 Isolate Pools</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Every action runs in a dedicated V8 isolate. Memory is locked, garbage collection is scoped, and cross-action pollution is architecturally impossible.
                    </p>
                </div>

                <div className="group p-8 rounded-3xl border border-border bg-card/30 backdrop-blur-sm transition-all hover:border-blue-500/50 hover:shadow-blue-500/10 hover:shadow-2xl">
                    <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                        <Server className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Gravity Isolation</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Native extensions don't just run; they orbit. We spawn separate processes for native code, ensuring that an exploit in a bridge cannot reach the engine core.
                    </p>
                </div>

                <div className="group p-8 rounded-3xl border border-border bg-card/30 backdrop-blur-sm transition-all hover:border-purple-500/50 hover:shadow-purple-500/10 hover:shadow-2xl">
                    <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
                        <Lock className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Zero-Trust Config</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        TitanPL ignores all native modules by default. Only those explicitly authorized in your signed `tanfig.json` are granted execution rights.
                    </p>
                </div>
            </div>

            {/* Deep Dive Section */}
            <div className="w-full max-w-4xl px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center"
                >
                    <h2 className="text-3xl font-bold mb-8">Supply Chain Defense</h2>
                    <div className="relative w-full p-8 rounded-3xl border border-border bg-zinc-900/50 text-left overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <CheckCircle2 className="h-12 w-12 text-emerald-500/20" />
                        </div>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="h-6 w-6 shrink-0 text-emerald-500"><CheckCircle2 className="h-6 w-6" /></div>
                                <div>
                                    <p className="font-semibold">No Implicit FS Write</p>
                                    <p className="text-sm text-muted-foreground">TitanPL prevents JS actions from writing to sensitive system directories by default.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="h-6 w-6 shrink-0 text-emerald-500"><CheckCircle2 className="h-6 w-6" /></div>
                                <div>
                                    <p className="font-semibold">Signed Distributions</p>
                                    <p className="text-sm text-muted-foreground">All engine components are checksum-verified before the server boots.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="h-6 w-6 shrink-0 text-emerald-500"><CheckCircle2 className="h-6 w-6" /></div>
                                <div>
                                    <p className="font-semibold">Native IPC Lockdown</p>
                                    <p className="text-sm text-muted-foreground">Communication between the JS runtime and Rust core is strictly typed and audited.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 flex gap-4">
                        <Link
                            href="/docs/knowledge/08-security"
                            className="bg-foreground text-background px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity"
                        >
                            Read Full Security Whitepaper
                        </Link>
                        <Link
                            href="/docs"
                            className="border border-border px-8 py-3 rounded-full font-bold hover:bg-white/5 transition-colors"
                        >
                            Back to Docs
                        </Link>
                    </div>
                </motion.div>
            </div>
        </main>
    )
}
