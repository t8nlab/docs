'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useVersion } from '@/context/VersionContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    Package,
    Plus,
    Trash2,
    RefreshCw,
    Loader2,
    Search,
    ChevronRight,
    Activity,
    Boxes,
    X,
    User,
    LogOut,
    Hexagon,
    ShieldAlert,
    CheckCircle,
    Cpu,
    Github,
    History,
    Zap,
    ChevronDown
} from 'lucide-react';
import { showToast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import { useStatus } from '@/context/StatusContext';

type Tab = 'status' | 'extensions';

export default function AdminDashboard() {
    const { user, loading: authLoading, logout } = useAuth();
    const { titanVersion } = useVersion();
    const { status: systemStatus } = useStatus();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('status');
    const [isMounted, setIsMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSyncingGithub, setIsSyncingGithub] = useState(false);

    // Pagination State
    const [extPage, setExtPage] = useState(0);
    const [hasMoreExt, setHasMoreExt] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    // Identifiers
    const CURRENT_YEAR = new Date().getFullYear();
    const MODULE_MAP: Record<string, string> = {
        "Gravity Runtime": "TGRV",
        "Extensions Registry": "EXT",
        "Orbit System": "ORBS",
        "TitanPL Core Extension": "CEXT"
    };

    // Status State
    const [vulns, setVulns] = useState<any[]>([]);
    const [isAddVulnOpen, setIsAddVulnOpen] = useState(false);
    const [vulnForm, setVulnForm] = useState({
        id: '',
        affectedVersions: titanVersion,
        component: 'TitanPL Core Extension',
        severity: 'medium' as 'high' | 'medium' | 'low',
        description: '',
        workaround: '',
        devDetails: '',
        status: 'active' as 'active' | 'resolved'
    });

    const generateId = (comp: string) => {
        const mod = MODULE_MAP[comp] || "EXT";
        const rand = Math.floor(Math.random() * 999).toString().padStart(3, '0');
        return `TPL-${mod}-${CURRENT_YEAR}-${titanVersion.replace('v', '')}-${rand}`;
    };

    useEffect(() => {
        if (isAddVulnOpen) {
            setVulnForm(prev => ({ ...prev, id: generateId(prev.component), affectedVersions: titanVersion }));
        }
    }, [isAddVulnOpen, vulnForm.component, titanVersion]);

    // Extensions State
    const [extensions, setExtensions] = useState<any[]>([]);
    const [extSearch, setExtSearch] = useState('');
    const [isAddExtOpen, setIsAddExtOpen] = useState(false);
    const [extForm, setExtForm] = useState({
        name: '',
        npmPackage: '',
        githubRepo: '',
        docsLink: '',
        description: '',
        isOfficial: true
    });

    useEffect(() => {
        setIsMounted(true);
        if (!authLoading && (!user || !user.isAdmin)) {
            showToast.error('Access Denied', 'Unauthorized personnel detected.');
            router.push('/');
        }
    }, [user, authLoading, router]);

    const fetchData = useCallback(async (isLoadMore = false) => {
        if (isLoadMore) setIsFetchingMore(true);
        else setLoading(true);

        try {
            const pageToFetch = isLoadMore ? extPage + 1 : 0;
            const [statusRes, extRes] = await Promise.all([
                fetch('/api/status'),
                fetch(`/api/admin/extensions?offset=${pageToFetch * 10}&limit=10&search=${extSearch}`)
            ]);
            
            const statusData = await statusRes.json();
            const extData = await extRes.json();

            setVulns([...(statusData.active || []), ...(statusData.resolved || [])]);
            
            if (isLoadMore) {
                setExtensions(prev => [...prev, ...(extData.extensions || [])]);
                setExtPage(pageToFetch);
            } else {
                setExtensions(extData.extensions || []);
                setExtPage(0);
            }
            
            setHasMoreExt(extData.hasMore);
        } catch (e) {
            showToast.error('Sync Error', 'Failed to bridge with Titan core.');
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    }, [extPage, extSearch]);

    useEffect(() => {
        if (user?.isAdmin) fetchData();
    }, [user, extSearch]); // Refresh when search changes

    const syncGitHubActions = async () => {
        setIsSyncingGithub(true);
        try {
            const res = await fetch('https://api.github.com/repos/t8nlab/titanpl/actions/runs?per_page=1');
            const data = await res.json();
            const lastRun = data.workflow_runs?.[0];

            if (!lastRun) return;

            const isFailure = lastRun.conclusion === 'failure' || lastRun.conclusion === 'timed_out';
            const isSuccess = lastRun.conclusion === 'success';
            const commitMsg = lastRun.head_commit?.message || "No commit message";
            const incidentId = `TPL-CEXT-${CURRENT_YEAR}-${titanVersion.replace('v', '')}-GHAuto`;

            const existingIncident = vulns.find(v => v.id === incidentId);

            if (isFailure && (!existingIncident || existingIncident.status === 'resolved')) {
                await fetch('/api/admin/status', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: incidentId,
                        component: 'TitanPL Core Extension',
                        severity: 'high',
                        affectedVersions: [titanVersion],
                        description: `Automated Incident: Build Failure on Titan Core.`,
                        devDetails: `Commit: ${commitMsg} | Workflow: ${lastRun.html_url}`,
                        status: 'active'
                    })
                });
                showToast.error("Incident Active", "GitHub Build Failed.");
                fetchData();
            } else if (isSuccess && existingIncident?.status === 'active') {
                await fetch('/api/admin/status', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: incidentId, status: 'resolved', devDetails: `Resolved via Success Build: ${commitMsg}` })
                });
                showToast.success("Incident Resolved", "Build Success detected.");
                fetchData();
            }
        } finally {
            setIsSyncingGithub(false);
        }
    };

    const handleAddVuln = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...vulnForm,
                    affectedVersions: vulnForm.affectedVersions.split(',').map(v => v.trim())
                })
            });
            if (res.ok) {
                showToast.success('Success', 'Security record deployed.');
                setIsAddVulnOpen(false);
                fetchData();
            }
        } catch (e) {
            showToast.error('Link Error', 'Failed to connect.');
        }
    };

    const handleResolveVuln = async (id: string, current: string) => {
        try {
            const res = await fetch('/api/admin/status', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: current === 'active' ? 'resolved' : 'active' })
            });
            if (res.ok) {
                showToast.success('Status Updated', 'Incident updated.');
                fetchData();
            }
        } catch (e) {
            showToast.error('Error', 'Failed to update.');
        }
    };

    const handleDeleteVuln = async (id: string) => {
        if (!confirm('Purge this incident?')) return;
        try {
            const res = await fetch('/api/admin/status', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (res.ok) {
                showToast.success('Purged', 'Record detached.');
                fetchData();
            }
        } catch (e) {
            showToast.error('Error', 'Failed to delete.');
        }
    };

    const handleAddExt = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/extensions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(extForm)
            });
            if (res.ok) {
                showToast.success('Success', `${extForm.name} added.`);
                setIsAddExtOpen(false);
                fetchData();
                setExtForm({ name: '', npmPackage: '', githubRepo: '', docsLink: '', description: '', isOfficial: true });
            }
        } catch (e) {
            showToast.error('Error', 'Failed to register.');
        }
    };

    const handleVerifyExt = async (id: string, isOfficial: boolean) => {
        try {
            const res = await fetch('/api/admin/extensions', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isOfficial: !isOfficial })
            });
            if (res.ok) {
                showToast.success('Status Updated', `Extension status toggled.`);
                fetchData();
            }
        } catch (e) {
            showToast.error('Error', 'Failed to verify.');
        }
    };

    const handleDeleteExt = async (id: string) => {
        if (!confirm('Decommission this extension?')) return;
        try {
            const res = await fetch('/api/admin/extensions', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (res.ok) {
                showToast.success('Removed', 'Extension detached.');
                fetchData();
            }
        } catch (e) {
            showToast.error('Error', 'Failed to delete.');
        }
    };

    if (authLoading || !user || !user.isAdmin || !isMounted) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="relative">
                    <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
                    <div className="absolute inset-0 blur-2xl bg-blue-500/20 animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-100 flex selection:bg-blue-500/30 font-sans">
            
            {/* Slim Icon Sidebar */}
            <aside className="w-20 border-r border-white/5 bg-[#0a0a0a] flex flex-col items-center py-8 sticky top-0 h-screen z-50">
                <div className="mb-12">
                     <div className="w-12 h-12 rounded-2xl bg-[#0d0d0d] border border-white/10 flex items-center justify-center relative group cursor-pointer overflow-hidden">
                        <Hexagon className="text-blue-500 relative z-10" size={24} strokeWidth={2.5} />
                        <div className="absolute inset-0 bg-blue-500 blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
                    </div>
                </div>

                <nav className="flex-1 flex flex-col gap-4">
                    <IconNavItem active={activeTab === 'status'} onClick={() => setActiveTab('status')} icon={<Activity size={22} />} label="System Pulse" />
                    <IconNavItem active={activeTab === 'extensions'} onClick={() => setActiveTab('extensions')} icon={<Package size={22} />} label="Market Entry" />
                </nav>

                <div className="mt-auto flex flex-col gap-4">
                     <button onClick={() => { logout(); router.push('/'); }} className="w-12 h-12 rounded-2xl flex items-center justify-center text-zinc-500 hover:bg-red-500/10 hover:text-red-500 transition-all group relative">
                        <LogOut size={22} />
                        <span className="absolute left-full ml-4 px-3 py-1.5 rounded-xl bg-black border border-white/10 text-[9px] font-black uppercase tracking-widest opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none whitespace-nowrap z-100 shadow-2xl">Log Out</span>
                    </button>
                    <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-zinc-800">
                        {user.avatarUrl ? <img src={user.avatarUrl} className="w-full h-full object-cover" /> : <User className="w-full h-full p-2" />}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto px-10 py-12">
                <div className="p-1 max-w-[1500px] mx-auto space-y-12">
                    
                    {/* Header View */}
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">
                                <span>Administrative</span>
                                <ChevronRight size={10} strokeWidth={4} />
                                <span className="text-blue-500">{activeTab === 'status' ? 'Pulse' : 'Registry'}</span>
                            </div>
                            <h1 className="text-6xl font-black tracking-tighter leading-none italic uppercase">
                                {activeTab === 'status' ? 'Core Status' : 'Market Orbit'}
                            </h1>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative group flex-1 md:w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={16} />
                                <input
                                    type="text"
                                    value={extSearch}
                                    onChange={(e) => setExtSearch(e.target.value)}
                                    placeholder={activeTab === 'status' ? "Search incidents..." : "Search registry..."}
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#09090b] border border-white/5 text-xs font-bold focus:bg-[#0c0c0e] focus:border-blue-500/30 transition-all outline-none"
                                />
                            </div>
                             <div className="flex gap-3">
                                {activeTab === 'status' && (
                                    <button 
                                        onClick={syncGitHubActions} 
                                        className={cn(
                                            "p-3 rounded-2xl border border-white/5 bg-white/5 text-zinc-400 hover:text-white transition-all flex items-center justify-center group relative",
                                            isSyncingGithub && "animate-pulse"
                                        )}
                                        disabled={isSyncingGithub}
                                    >
                                        <Github size={20} />
                                        <span className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-[8px] font-black uppercase tracking-widest border border-white/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Core Actions Sync</span>
                                    </button>
                                )}
                                <button 
                                    onClick={() => activeTab === 'status' ? setIsAddVulnOpen(true) : setIsAddExtOpen(true)}
                                    className="px-8 py-3 rounded-2xl bg-white text-black font-black uppercase italic tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-2xl flex items-center gap-3 active:scale-95"
                                >
                                    <Plus size={16} strokeWidth={4} />
                                    Deploy
                                </button>
                             </div>
                        </div>
                    </header>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <MiniStat label="Core Uptime" value={systemStatus === 'operational' ? '99.98%' : 'DEGRADED'} variant="primary" icon={<Activity size={18} />} />
                        <MiniStat label="Registry Nodes" value={extensions.length.toString()} icon={<Boxes size={18} />} />
                        <MiniStat label="System Health" value={systemStatus.toUpperCase()} variant={systemStatus === 'operational' ? 'success' : 'warning'} icon={<Cpu size={18} />} />
                        <MiniStat label="Active Alerts" value={vulns.filter(v => v.status === 'active').length.toString()} variant={vulns.filter(v => v.status === 'active').length > 0 ? 'danger' : 'neutral'} icon={<ShieldAlert size={18} />} />
                    </div>

                    {/* Content Section */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                             <div className="flex items-center gap-3">
                                  <div className="w-1 h-4 bg-blue-500 rounded-full" />
                                  <h2 className="text-xs font-black italic tracking-[0.2em] uppercase text-zinc-500">{activeTab === 'status' ? 'Incident Records' : 'Registry Entries'}</h2>
                             </div>
                             <div className="flex gap-4">
                                  <button onClick={() => fetchData(false)} className="text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-300 transition-colors flex items-center gap-2">
                                    <RefreshCw size={10} className={loading ? "animate-spin" : ""} />
                                    Synchronize
                                  </button>
                             </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                             <AnimatePresence mode="wait">
                                {loading && extensions.length === 0 ? (
                                    <div className="col-span-full py-24 flex flex-col items-center gap-4">
                                        <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">Titan Data Link Active...</p>
                                    </div>
                                ) : (
                                    activeTab === 'status' ? (
                                        vulns.length === 0 ? <EmptyNode icon={<ShieldCheck size={40} />} title="Pulse Nominal" /> :
                                        vulns.map((v) => (
                                            <TaskCard 
                                                key={v.id}
                                                icon={<ShieldAlert className={cn(v.status === 'active' ? (v.severity === 'high' ? "text-red-500" : "text-amber-500") : "text-zinc-600")} />}
                                                title={v.id}
                                                desc={v.description}
                                                tag={v.status}
                                                meta={v.component}
                                                severity={v.severity}
                                                critical={v.severity === 'high' && v.status === 'active'}
                                                isResolved={v.status === 'resolved'}
                                                affectedVersions={v.affectedVersions}
                                                onDelete={() => handleDeleteVuln(v.id)}
                                                onToggleVerify={() => handleResolveVuln(v.id, v.status)}
                                            />
                                        ))
                                    ) : (
                                        <>
                                            {extensions.length === 0 && !loading ? <EmptyNode icon={<Boxes size={40} />} title="Registry Empty" /> :
                                            extensions.map((e) => (
                                                <TaskCard 
                                                    key={e.id}
                                                    icon={<Package className={cn(e.isOfficial ? "text-blue-500" : "text-zinc-600")} />}
                                                    title={e.name}
                                                    desc={e.description || "Production capability record."}
                                                    tag={e.isOfficial ? "CORE" : "PL"}
                                                    meta={e.npmPackage}
                                                    isVerified={e.isOfficial}
                                                    onDelete={() => handleDeleteExt(e.id)}
                                                    onToggleVerify={() => handleVerifyExt(e.id, e.isOfficial)}
                                                />
                                            ))}
                                            {hasMoreExt && (
                                                <div className="col-span-full flex justify-center pt-8">
                                                    <button 
                                                        onClick={() => fetchData(true)}
                                                        disabled={isFetchingMore}
                                                        className="px-10 py-4 rounded-3xl border border-white/5 bg-[#09090b] text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white hover:border-white/10 transition-all flex items-center gap-3 group"
                                                    >
                                                        {isFetchingMore ? <Loader2 size={14} className="animate-spin" /> : <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />}
                                                        Fetch More Nodes
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )
                                )}
                             </AnimatePresence>
                        </div>
                    </section>
                </div>
            </main>

            {/* Incident Modal */}
            <AnimatePresence>
                {isAddVulnOpen && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddVulnOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-2xl bg-[#0a0a0c] rounded-[2.5rem] border border-white/10 p-10 overflow-hidden shadow-2xl">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[60px] pointer-events-none" />
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div>
                                    <h3 className="text-2xl font-black italic uppercase">Deploy Pulse</h3>
                                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest pt-1">Security Incident Record</p>
                                </div>
                                <button onClick={() => setIsAddVulnOpen(false)} className="p-2.5 rounded-xl hover:bg-white/5 text-zinc-500 transition-colors"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleAddVuln} className="space-y-4 relative z-10">
                                <div className="grid grid-cols-2 gap-4">
                                     <InputBox label="INCIDENT ID" value={vulnForm.id} readOnly />
                                     <InputBox label="SEVERITY" type="select" options={['high', 'medium', 'low']} value={vulnForm.severity} onChange={v => setVulnForm({...vulnForm, severity: v as any})} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                     <InputBox label={`AFFECTED VERSIONS (${titanVersion})`} value={vulnForm.affectedVersions} onChange={v => setVulnForm({...vulnForm, affectedVersions: v})} placeholder="v7.0.0, v6.9.1" />
                                     <InputBox label="AFFECTED COMPONENT" type="select" options={Object.keys(MODULE_MAP)} value={vulnForm.component} onChange={v => setVulnForm({...vulnForm, component: v})} />
                                </div>
                                <InputBox label="CORE DESCRIPTION" type="textarea" value={vulnForm.description} onChange={v => setVulnForm({...vulnForm, description: v})} />
                                <InputBox label="ACTIVE DEV DETAILS / LOGS" type="textarea" value={vulnForm.devDetails} onChange={v => setVulnForm({...vulnForm, devDetails: v})} placeholder="Trace details / Internal build failure notes..." />
                                <button className="w-full py-4 rounded-3xl bg-white text-black font-black uppercase italic tracking-widest hover:bg-amber-500 hover:text-white transition-all shadow-xl">Authorize Deployment</button>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* Extension Modal */}
                {isAddExtOpen && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddExtOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-2xl bg-[#0a0a0c] rounded-[2.5rem] border border-white/10 p-10 overflow-hidden shadow-2xl">
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div>
                                    <h3 className="text-2xl font-black italic uppercase">Register Entry</h3>
                                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest pt-1">Market Registry Orbit</p>
                                </div>
                                <button onClick={() => setIsAddExtOpen(false)} className="p-2.5 rounded-xl hover:bg-white/5 text-zinc-500 transition-colors"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleAddExt} className="space-y-4 relative z-10">
                                <div className="grid grid-cols-2 gap-4">
                                     <InputBox label="LITERAL NAME" value={extForm.name} onChange={v => setExtForm({...extForm, name: v})} />
                                     <InputBox label="NPM PACKAGE" value={extForm.npmPackage} onChange={v => setExtForm({...extForm, npmPackage: v})} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                     <InputBox label="GITHUB REPOSITORY" value={extForm.githubRepo} onChange={v => setExtForm({...extForm, githubRepo: v})} />
                                     <InputBox label="DOCUMENTATION LINK" value={extForm.docsLink} onChange={v => setExtForm({...extForm, docsLink: v})} />
                                </div>
                                <InputBox label="ORBIT DESCRIPTION" type="textarea" value={extForm.description} onChange={v => setExtForm({...extForm, description: v})} />
                                <div className="p-4 rounded-2xl bg-[#050505] border border-white/5 flex items-center justify-between">
                                     <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">Core Verification Status</span>
                                     <input type="checkbox" checked={extForm.isOfficial} onChange={e => setExtForm({...extForm, isOfficial: e.target.checked})} className="w-5 h-5 rounded-lg bg-black border-white/10 text-blue-500" />
                                </div>
                                <button className="w-full py-4 rounded-3xl bg-blue-600 text-white font-black uppercase italic tracking-widest hover:bg-blue-700 transition-all shadow-xl">Finalize Orbit</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ── UI Components ── */

function IconNavItem({ active, onClick, icon, label }: { active: boolean, onClick?: () => void, icon: any, label: string }) {
    return (
        <button onClick={onClick} className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all relative group", active ? "bg-white text-black shadow-2xl" : "text-zinc-600 hover:text-white hover:bg-white/5")}>
            {icon}
            {active && <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-full" />}
            <div className="absolute left-full ml-4 px-3 py-1.5 rounded-xl bg-black border border-white/10 text-[9px] font-black uppercase tracking-widest opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none whitespace-nowrap z-100 shadow-2xl">{label}</div>
        </button>
    );
}

function MiniStat({ label, value, icon, variant = 'neutral' }: { label: string, value: string, icon: any, variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' }) {
    const colorClass = { primary: 'text-blue-500', success: 'text-emerald-500', warning: 'text-amber-500', danger: 'text-red-500', neutral: 'text-zinc-600' }[variant];
    return (
        <div className="p-6 rounded-3xl bg-[#09090b] border border-white/5 space-y-4 hover:border-white/10 transition-colors group">
            <div className="flex justify-between items-center">
                <div className={cn("p-2 rounded-xl bg-white/5", colorClass)}>{icon}</div>
                <div className={cn("w-1.5 h-1.5 rounded-full", variant === 'neutral' ? 'bg-zinc-800' : `bg-current ${colorClass}`)} />
            </div>
            <div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 block mb-1">{label}</span>
                <h3 className="text-2xl font-black tracking-tighter uppercase italic truncate">{value}</h3>
            </div>
        </div>
    );
}

function TaskCard({ icon, title, desc, tag, meta, critical, isResolved, isVerified, affectedVersions, severity, onDelete, onToggleVerify }: { icon: any, title: string, desc: string, tag: string, meta: string, critical?: boolean, isResolved?: boolean, isVerified?: boolean, affectedVersions?: string[], severity?: string, onDelete?: () => void, onToggleVerify?: () => void }) {
    return (
        <motion.div whileHover={{ y: -4 }} className={cn("p-7 rounded-4xl bg-[#09090b] border border-white/5 flex flex-col justify-between group hover:bg-[#0c0c0e] transition-all relative overflow-hidden", critical && "border-red-500/10", isResolved && "opacity-60")}>
            {critical && <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/3 blur-2xl pointer-events-none" />}
            <div className="space-y-5 relative z-10">
                <div className="flex justify-between items-start">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border transition-all", critical ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-[#050505] border-white/5 text-zinc-600")}>
                        {icon}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        {onToggleVerify && (
                             <button onClick={onToggleVerify} className={cn("p-2.5 rounded-xl transition-all active:scale-90", isResolved || isVerified ? "hover:bg-blue-500/10 text-blue-500" : "hover:bg-emerald-500/10 text-emerald-500")} title={isResolved ? "Re-activate" : isVerified ? "D-verify" : "Verify / Resolve"}>
                                {isResolved ? <History size={16} /> : <CheckCircle size={16} />}
                            </button>
                        )}
                        {onDelete && <button onClick={onDelete} className="p-2.5 rounded-xl hover:bg-red-500/10 text-zinc-800 hover:text-red-500 transition-all active:scale-90" title="Purge Record"><Trash2 size={16} /></button>}
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h4 className={cn("text-xl font-black tracking-tighter italic uppercase truncate", isResolved && "line-through text-zinc-600")}>{title}</h4>
                        {isVerified && <CheckCircle size={14} className="text-blue-500 fill-blue-500/10" />}
                    </div>
                    <p className="text-zinc-600 text-xs font-bold pt-1.5 leading-relaxed line-clamp-2 uppercase tracking-wide">{desc}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {severity && (
                            <span className={cn(
                                "px-2 py-0.5 rounded text-[8px] font-black uppercase border",
                                severity === 'high' ? "bg-red-500/10 border-red-500/20 text-red-500" :
                                severity === 'medium' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                                "bg-blue-500/10 border-blue-500/20 text-blue-500"
                            )}>
                                {severity}
                            </span>
                        )}
                        {affectedVersions?.map(v => <span key={v} className="text-[8px] font-black px-1.5 py-0.5 rounded bg-white/5 text-zinc-500 border border-white/5 uppercase">v{v}</span>)}
                    </div>
                </div>
            </div>
            <div className="mt-8 pt-5 border-t border-white/5 flex items-center justify-between relative z-10">
                <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-700">Scope / Node</span>
                    <span className="text-[10px] font-bold text-zinc-400 truncate max-w-[120px]">{meta}</span>
                </div>
                <div className={cn("px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-colors", tag === 'CORE' || tag === 'active' ? "bg-blue-500/5 border-blue-500/20 text-blue-500" : "bg-white/5 border-white/5 text-zinc-700")}>{tag}</div>
            </div>
        </motion.div>
    );
}

function EmptyNode({ icon, title }: { icon: any, title: string }) {
    return (
        <div className="col-span-full py-20 rounded-[2.5rem] border border-dashed border-white/5 flex flex-col items-center gap-4">
             <div className="w-16 h-16 rounded-2xl bg-[#09090b] flex items-center justify-center text-zinc-800">{icon}</div>
             <h3 className="text-lg font-black italic uppercase tracking-widest text-zinc-700">{title}</h3>
        </div>
    );
}

function InputBox({ label, value, onChange, placeholder, type = 'text', options, readOnly }: { label: string, value: string, onChange?: (val: string) => void, placeholder?: string, type?: 'text' | 'textarea' | 'select', options?: string[], readOnly?: boolean }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-1">{label}</label>
            {type === 'textarea' ? (
                <textarea required value={value} onChange={e => onChange?.(e.target.value)} placeholder={placeholder} readOnly={readOnly} className="w-full px-5 py-4 rounded-2xl bg-[#050505] border border-white/5 outline-none focus:border-blue-500/20 font-bold text-xs min-h-[80px] focus:bg-[#070709]" />
            ) : type === 'select' ? (
                <div className="relative">
                    <select required value={value} onChange={e => onChange?.(e.target.value)} disabled={readOnly} className="w-full px-5 py-4 rounded-2xl bg-[#050505] border border-white/5 outline-none appearance-none font-bold text-xs uppercase cursor-pointer">
                        {options?.map(opt => <option key={opt} value={opt} className="bg-[#0c0c0e] uppercase">{opt}</option>)}
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-zinc-600 pointer-events-none" size={14} />
                </div>
            ) : <input required type="text" value={value} onChange={e => onChange?.(e.target.value)} placeholder={placeholder} readOnly={readOnly} className="w-full px-5 py-4 rounded-2xl bg-[#050505] border border-white/5 outline-none focus:border-blue-500/20 font-bold text-xs focus:bg-[#070709]" />}
        </div>
    );
}
