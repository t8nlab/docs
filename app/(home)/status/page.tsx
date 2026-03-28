'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
    Activity,
    Globe,
    Cpu,
    Box,
    Layers,
    Puzzle,
    RefreshCw,
    Shield,
    CheckCircle2,
    Info,
    AlertTriangle,
    AlertOctagon,
    Construction,
    Monitor
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStatus, SystemStatus } from '@/context/StatusContext';
import { FaApple, FaLinux } from "react-icons/fa";
import { TbBrandWindowsFilled } from "react-icons/tb";





const StatusPage = () => {
    const { status, activeVulnerabilities, resolvedVulnerabilities, refreshStatus } = useStatus();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<string>('');

    useEffect(() => {
        setLastUpdated(new Date().toLocaleTimeString());
    }, []);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refreshStatus();
        setIsRefreshing(false);
        setLastUpdated(new Date().toLocaleTimeString());
    };

    const getStatusColor = (s: SystemStatus) => {
        switch (s) {
            case 'operational': return 'emerald';
            case 'degraded': return 'amber';
            case 'maintenance': return 'blue';
            default: return 'emerald';
        }
    };

    const statusColor = getStatusColor(status);

    // Dynamic background colors based on status
    const glowColors = {
        operational: { primary: "bg-emerald-600/20", secondary: "bg-cyan-500/10", tertiary: "bg-teal-600/10" },
        degraded: { primary: "bg-amber-600/20", secondary: "bg-orange-500/10", tertiary: "bg-yellow-600/10" },
        maintenance: { primary: "bg-blue-600/20", secondary: "bg-indigo-500/10", tertiary: "bg-violet-600/10" }
    }[status];

    // Helper to check if a system is affected by any active vulnerability
    const getSystemStatus = (componentName: string) => {
        const isAffected = activeVulnerabilities.some(v => v.component === componentName);
        return isAffected ? 'degraded' : 'operational';
    };

    const systemList = [
        { name: "Orbit System", icon: Layers, description: "Core routing & orchestration" },
        { name: "Gravity Runtime", icon: Cpu, description: "V8 execution engine" },
        { name: "TitanPL Core Extension", icon: Box, description: "Native development framework" }, // Matches DB component name
        { name: "Extensions Registry", icon: Puzzle, description: "Package distribution" },
        { name: "Documentation", icon: Globe, description: "Official TitanPL technical reference" },
        { name: "Auth Services", icon: Shield, description: "Authentication & Security" }
    ];

    // Build dynamic systems array
    const systems = systemList.map(sys => {
        const sysStatus = getSystemStatus(sys.name);
        return {
            ...sys,
            status: sysStatus,
            uptime: sysStatus === 'degraded' ? '98.50%' : '99.99%' // Dynamic uptime simulation
        };
    });

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden">
            {/* Background glow - Dynamic based on status */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className={`absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] opacity-80 mix-blend-screen dark:opacity-20 dark:blur-[120px] transition-colors duration-1000 ${glowColors.primary}`} />
                <div className={`absolute left-0 top-[40%] h-[500px] w-[500px] -translate-x-1/3 -translate-y-1/2 rounded-full blur-[120px] opacity-50 mix-blend-screen dark:opacity-10 transition-colors duration-1000 ${glowColors.secondary}`} />
                <div className={`absolute right-0 top-[60%] h-[500px] w-[500px] translate-x-1/3 -translate-y-1/2 rounded-full blur-[120px] opacity-50 mix-blend-screen dark:opacity-10 transition-colors duration-1000 ${glowColors.tertiary}`} />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-3 mb-4 px-3 py-1 rounded-full border bg-background/50 backdrop-blur-sm"
                        >
                            <div className="relative flex h-2.5 w-2.5">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${statusColor}-500 opacity-75`}></span>
                                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 bg-${statusColor}-500`}></span>
                            </div>
                            <span className={`text-${statusColor}-600 dark:text-${statusColor}-500 font-semibold tracking-wide text-xs uppercase`}>
                                {status === 'operational' ? 'All Systems Operational' :
                                    status === 'degraded' ? 'Performance Degraded' : 'Under Maintenance'}
                            </span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
                        >
                            System Status
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-muted-foreground max-w-xl leading-relaxed"
                        >
                            Real-time status updates for Titan Planet services, APIs, and infrastructure.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-end gap-2"
                    >
                        <button
                            onClick={handleRefresh}
                            className="group flex items-center gap-2 px-5 py-2 rounded-md bg-background border hover:bg-muted transition-all"
                        >
                            <RefreshCw size={14} className={cn("text-muted-foreground transition-transform duration-700", isRefreshing && "animate-spin")} />
                            <span className="text-sm font-medium">Refresh</span>
                        </button>
                        <span className="text-xs text-muted-foreground font-mono">
                            Last updated: {lastUpdated}
                        </span>
                    </motion.div>
                </div>

                {/* Overall Status Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={cn(
                        "mb-12 relative overflow-hidden rounded-xl border bg-background/50 backdrop-blur-md p-8 sm:p-10 transition-colors duration-500",
                        status === 'degraded' ? "border-amber-500/30 bg-amber-500/5" :
                            status === 'maintenance' ? "border-blue-500/30 bg-blue-500/5" : ""
                    )}
                >
                    <div className={cn(
                        "absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full pointer-events-none transition-colors duration-500",
                        `bg-${statusColor}-500/10`
                    )} />
                    <div className="flex flex-row items-center gap-4 lg:gap-6 relative z-10">
                        <div className={cn(
                            "shrink-0 lg:h-16 lg:w-16 h-12 w-12 rounded-full flex items-center justify-center border shadow-[0_0_15px_rgba(0,0,0,0.1)] transition-colors duration-500",
                            `bg-${statusColor}-500/10 border-${statusColor}-500/20 shadow-[0_0_15px_rgba(var(--${statusColor}-500-rgb),0.2)]`
                        )}>
                            {status === 'operational' ? <Activity className={`text-${statusColor}-500 w-6 h-6 lg:w-8 lg:h-8`} /> :
                                status === 'degraded' ? <AlertTriangle className={`text-${statusColor}-500 w-6 h-6 lg:w-8 lg:h-8`} /> :
                                    <RefreshCw className={`text-${statusColor}-500 w-6 h-6 lg:w-8 lg:h-8`} />}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="text-xl lg:text-2xl font-bold mb-1 lg:mb-2 capitalize truncate">{status}</h2>
                            <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">
                                {status === 'operational' ? "All Titan systems are operational." :
                                    status === 'degraded' ? "Some systems are degraded." :
                                        "Maintenance in progress."}
                                <span className="hidden sm:inline">
                                    {" "}{status === 'operational' ? "Running within normal parameters." :
                                        status === 'degraded' ? "Performance may be affected." :
                                            "Services will resume shortly."}
                                </span>
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Active Vulnerabilities Section */}
                {activeVulnerabilities && activeVulnerabilities.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-12"
                    >
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <AlertOctagon className="text-red-500" />
                            Active Vulnerabilities
                        </h3>
                        <div className="grid gap-4">
                            {activeVulnerabilities.map((vuln) => (
                                <div key={vuln.id} className="relative overflow-hidden rounded-xl border border-red-500/30 bg-red-500/5 p-6 backdrop-blur-sm">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <AlertOctagon size={100} />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                                                {vuln.severity.toUpperCase()}
                                            </span>
                                            <span className="text-xs font-mono text-muted-foreground">
                                                ID: {vuln.id}
                                            </span>
                                            <div className="flex gap-2">
                                                {vuln.affectedVersions.map(ver => (
                                                    <span key={ver} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                                                        v{ver}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <h4 className="text-lg font-semibold mb-2">Security Alert: {vuln.component}</h4>
                                        <p className="text-muted-foreground mb-4 max-w-3xl">
                                            {vuln.description}
                                        </p>
                                        {vuln.workaround && (
                                            <div className="bg-background/50 rounded-lg p-3 border text-sm">
                                                <span className="font-semibold text-foreground">Workaround: </span>
                                                <span className="text-muted-foreground">{vuln.workaround}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Systems Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-24"
                >
                    {systems.map((system, i) => (
                        <motion.div
                            key={i}
                            variants={item}
                            className={cn(
                                "group relative p-6 rounded-xl border bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300",
                                system.status === 'degraded' ? "border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10" : ""
                            )}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={cn(
                                    "p-2.5 rounded-lg transition-colors",
                                    system.status === 'degraded' ? "bg-amber-500/10 text-amber-500" : "bg-secondary/50 group-hover:bg-secondary text-foreground"
                                )}>
                                    <system.icon size={20} className="currentColor" />
                                </div>
                                <div className={cn(
                                    "flex items-center gap-1.5 px-2 py-0.5 rounded-full border",
                                    system.status === 'degraded' ? "bg-amber-500/10 border-amber-500/20" : "bg-emerald-500/10 border-emerald-500/20"
                                )}>
                                    <div className={cn("w-1.5 h-1.5 rounded-full", system.status === 'degraded' ? "bg-amber-500" : "bg-emerald-500")} />
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase tracking-wider",
                                        system.status === 'degraded' ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                                    )}>
                                        {system.status === 'degraded' ? 'Issues' : 'Active'}
                                    </span>
                                </div>
                            </div>

                            <h3 className="text-base font-semibold mb-1">{system.name}</h3>
                            <p className="text-sm text-muted-foreground mb-4">{system.description}</p>

                            <div className="flex items-center justify-between pt-3 border-t border-border/50">
                                <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Uptime</span>
                                <span className={cn(
                                    "text-sm font-semibold font-mono",
                                    system.status === 'degraded' ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                                )}>
                                    {system.uptime}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
                
                {/* Platforms Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Monitor className="text-primary" size={20} />
                        Native Platform Support
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { name: "Windows", icon: TbBrandWindowsFilled, status: "operational", desc: "x64 / ARM64 Stable" },
                            { name: "Linux", icon: FaLinux, status: "operational", desc: "Ubuntu / Fedora / Arch" },
                            { name: "macOS", icon: FaApple, status: "maintenance", desc: "In Development (Planned)" }
                        ].map((plat, idx) => (
                            <div key={idx} className="p-5 rounded-xl border bg-background/40 backdrop-blur-sm flex items-center gap-4 transition-all hover:bg-background/60">
                                <div className={cn(
                                    "p-2.5 rounded-lg",
                                    plat.status === 'operational' ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                                )}>
                                    <plat.icon size={20} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm">{plat.name}</span>
                                        <div className={cn(
                                            "w-1.5 h-1.5 rounded-full animate-pulse",
                                            plat.status === 'operational' ? "bg-emerald-500" : "bg-blue-500"
                                        )} />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight mt-0.5">
                                        {plat.status === 'operational' ? plat.desc : "Under Development"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Maintenance Note (Dynamic) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className={cn(
                        "flex items-start gap-4 p-6 mb-12 rounded-lg border",
                        activeVulnerabilities.length > 0
                            ? "border-amber-500/20 bg-amber-500/5"
                            : "border-blue-500/20 bg-blue-500/5"
                    )}
                >
                    {activeVulnerabilities.length > 0 ? (
                        <Construction className="text-amber-500 shrink-0 mt-0.5" size={18} />
                    ) : (
                        <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
                    )}

                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-foreground">
                            {activeVulnerabilities.length > 0 ? "Active Maintenance" : "No Active Maintenance"}
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {activeVulnerabilities.length > 0
                                ? "Our team is currently working on resolving the active vulnerabilities listed above. Updates will be posted as they become available."
                                : "Builds and deployments are functioning normally. No scheduled downtime for the next 7 days."}
                        </p>
                    </div>
                </motion.div>

                {/* Resolved History Section */}
                {resolvedVulnerabilities && resolvedVulnerabilities.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <CheckCircle2 className="text-emerald-500" />
                            Resolved Issues
                        </h3>
                        <div className="space-y-3">
                            {resolvedVulnerabilities.map(vuln => (
                                <div key={vuln.id} className="flex items-center justify-between p-4 rounded-lg border bg-background/30 hover:bg-background/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-500">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="font-semibold text-sm">{vuln.id}</span>
                                                <span className="text-xs text-muted-foreground">({vuln.component})</span>
                                                {vuln.devDetails && (
                                                    <span className="text-[9px] font-mono bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded border border-blue-500/20 max-w-[200px] truncate" title={vuln.devDetails}>
                                                        {vuln.devDetails}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground line-clamp-1">{vuln.description}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-mono text-muted-foreground px-2 py-1 rounded bg-secondary">
                                        Resolved
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

            </div>
        </div>
    );
};

export default StatusPage;
