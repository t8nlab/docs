'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Package, 
    Search, 
    Plus, 
    Trash2, 
    Loader2, 
    RefreshCw, 
    MoreHorizontal, 
    Globe, 
    ShieldCheck, 
    Zap, 
    AlertCircle,
    CheckCircle2,
    X
} from 'lucide-react';
import { showToast } from '@/lib/toast';
import { cn } from '@/lib/utils';

interface Extension {
    id: string;
    name: string;
    npmPackage: string;
    description: string;
    isOfficial: boolean;
    publisher?: {
        username: string;
        avatarUrl?: string;
    };
}

interface MarketStats {
    total: number;
    official: number;
    community: number;
    issues: number;
}

// Simple Cache
const CACHE_KEY = 'titan_market_cache';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export default function ExtensionMarket() {
    const [extensions, setExtensions] = useState<Extension[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [stats, setStats] = useState<MarketStats>({ total: 0, official: 0, community: 0, issues: 0 });
    
    // Add Form State
    const [newExt, setNewExt] = useState({ name: '', npmPackage: '', description: '', isOfficial: false });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const LIMIT = 10;
    const observer = useRef<IntersectionObserver | null>(null);

    const lastElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const fetchExtensions = useCallback(async (pageNum: number, search: string, isInitial: boolean) => {
        if (pageNum === 0 && isInitial) {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached && !search) {
                const { data, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < CACHE_EXPIRY) {
                    setExtensions(data.extensions);
                    setHasMore(data.hasMore);
                    setStats(data.stats);
                    // Don't return, still fetch in background to refresh
                }
            }
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/admin/extensions?limit=${LIMIT}&offset=${pageNum * LIMIT}&search=${search}`);
            const data = await res.json();
            
            if (isInitial) {
                setExtensions(data.extensions || []);
                if (!search && pageNum === 0) {
                    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
                }
            } else {
                setExtensions(prev => [...prev, ...(data.extensions || [])]);
            }
            setHasMore(data.hasMore);
            if (data.stats) setStats(data.stats);
        } catch (e) {
            showToast.error('Orbit Failure', 'Failed to synchronize extensions.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchExtensions(0, searchQuery, true);
            setPage(0);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, fetchExtensions]);

    useEffect(() => {
        if (page > 0) {
            fetchExtensions(page, searchQuery, false);
        }
    }, [page, searchQuery, fetchExtensions]);

    const handleAddExtension = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/admin/extensions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newExt)
            });
            if (res.ok) {
                const { extension } = await res.json();
                setExtensions(prev => [extension, ...prev]);
                showToast.success('Deployment Success', `${newExt.name} is now orbiting.`);
                setIsAddOpen(false);
                setNewExt({ name: '', npmPackage: '', description: '', isOfficial: false });
                localStorage.removeItem(CACHE_KEY);
            }
        } catch (e) {
            showToast.error('Docking Failed', 'Could not register new extension.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Decommission ${name}? This action cannot be reversed.`)) return;
        try {
            const res = await fetch('/api/admin/extensions', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (res.ok) {
                showToast.success('Decommissioned', `${name} has been detached.`);
                setExtensions(prev => prev.filter(e => e.id !== id));
                localStorage.removeItem(CACHE_KEY);
            }
        } catch (e) {
            showToast.error('Decommission Error', 'Failed to remove extension.');
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h2 className="text-4xl font-black tracking-tight flex items-center gap-3 bg-clip-text text-transparent bg-linear-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500">
                        Marketplace 
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 font-black uppercase tracking-widest align-middle">Live</span>
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Coordinate the TitanPL extension grid.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full sm:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Scan extensions..."
                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-black border border-zinc-200 dark:border-white/10 text-sm focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all outline-none font-bold"
                        />
                    </div>
                    <button 
                        onClick={() => setIsAddOpen(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-500/10"
                    >
                        <Plus size={18} />
                        Register New
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Grid', value: stats.total, icon: Package, color: 'text-zinc-500', bg: 'bg-zinc-500/5' },
                    { label: 'Official Core', value: stats.official, icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-500/5' },
                    { label: 'Community', value: stats.community, icon: Globe, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
                    { label: 'Perf Issues', value: stats.issues, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/5' },
                ].map((stat, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label}
                        className={cn("p-6 rounded-4xl border border-zinc-100 dark:border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors", stat.bg)}
                    >
                        <div className="relative z-10 flex flex-col gap-1">
                            <span className={cn("text-[10px] font-black uppercase tracking-[0.2em] opacity-40")}>{stat.label}</span>
                            <div className="flex items-end justify-between">
                                <span className="text-3xl font-black tracking-tighter">{stat.value}</span>
                                <stat.icon size={24} className={stat.color} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* List */}
            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                    {extensions.map((e, index) => (
                        <motion.div 
                            key={e.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            layout
                            ref={index === extensions.length - 1 ? lastElementRef : null}
                            className="group p-6 rounded-4xl bg-white dark:bg-[#09090b] border border-zinc-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900/40 hover:shadow-3xl hover:shadow-black/5 transition-all gap-4"
                        >
                            <div className="flex items-center gap-5 w-full">
                                <div className={cn(
                                    "w-16 h-16 rounded-3xl flex items-center justify-center border-2 transition-transform group-hover:rotate-6",
                                    e.isOfficial ? "bg-blue-500/10 border-blue-500/20 text-blue-500" : "bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-400"
                                )}>
                                    <Package size={28} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-black text-xl truncate tracking-tight">{e.name}</h4>
                                        {e.isOfficial && <span className="text-[8px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest -translate-y-px">Core</span>}
                                    </div>
                                    <p className="text-sm font-bold text-zinc-400 truncate opacity-60">@{e.npmPackage}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-zinc-100 dark:border-white/5">
                                <div className="flex flex-col items-start sm:items-end">
                                     <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest opacity-40">System Status</span>
                                     <div className="flex items-center gap-2">
                                         <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                         <span className="text-xs font-black text-emerald-500 uppercase tracking-wider">Stable</span>
                                     </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleDelete(e.id, e.name)}
                                        className="p-3.5 rounded-2xl hover:bg-red-500/10 text-zinc-300 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {loading && (
                    <div className="py-12 flex flex-col justify-center items-center gap-4">
                        <div className="relative">
                            <Loader2 className="animate-spin text-blue-500" size={32} />
                            <div className="absolute inset-0 blur-xl bg-blue-500/20 animate-pulse" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Synchronizing Orbit...</span>
                    </div>
                )}

                {!loading && extensions.length === 0 && (
                    <div className="py-32 text-center space-y-6">
                         <div className="w-24 h-24 rounded-4xl bg-zinc-50 dark:bg-white/5 mx-auto flex items-center justify-center text-zinc-300 dark:text-zinc-700 border border-zinc-100 dark:border-white/5">
                             <Package size={48} />
                         </div>
                         <div className="space-y-1">
                             <h3 className="text-xl font-black text-zinc-400 uppercase tracking-widest">Orbit Clear</h3>
                             <p className="text-zinc-500 text-sm font-medium">No extensions detected in this sector.</p>
                         </div>
                    </div>
                )}
            </div>

            {/* Add Modal */}
            <AnimatePresence>
                {isAddOpen && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-white dark:bg-[#0c0c0e] rounded-[3rem] border border-zinc-200 dark:border-white/10 p-10 overflow-hidden shadow-2xl"
                        >
                            {/* Bg Decoration */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 blur-[100px] pointer-events-none" />

                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div>
                                    <h3 className="text-3xl font-black tracking-tight mb-2 uppercase italic">Register Ext</h3>
                                    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Deploy a new capability to the ecosystem.</p>
                                </div>
                                <button onClick={() => setIsAddOpen(false)} className="p-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-400 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleAddExtension} className="space-y-6 relative z-10">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Extension Name</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g. Earth Shaper"
                                                value={newExt.name}
                                                onChange={e => setNewExt({...newExt, name: e.target.value})}
                                                className="w-full px-5 py-4 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none focus:border-blue-500/50 transition-all font-bold text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">NPM Package</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="@titanpl/plugin-geo"
                                                value={newExt.npmPackage}
                                                onChange={e => setNewExt({...newExt, npmPackage: e.target.value})}
                                                className="w-full px-5 py-4 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none focus:border-blue-500/50 transition-all font-bold text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Description</label>
                                        <textarea
                                            required
                                            placeholder="Briefly describe what this extension adds..."
                                            value={newExt.description}
                                            onChange={e => setNewExt({...newExt, description: e.target.value})}
                                            className="w-full px-5 py-4 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none focus:border-blue-500/50 transition-all font-bold text-sm min-h-[100px] resize-none"
                                        />
                                    </div>

                                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                                        <input
                                            type="checkbox"
                                            id="isOfficial"
                                            checked={newExt.isOfficial}
                                            onChange={e => setNewExt({...newExt, isOfficial: e.target.checked})}
                                            className="w-5 h-5 rounded-lg border-zinc-300 dark:border-white/10 bg-zinc-100 dark:bg-black text-blue-500 focus:ring-blue-500/20"
                                        />
                                        <label htmlFor="isOfficial" className="text-sm font-black uppercase tracking-wider cursor-pointer">Official Core Extension</label>
                                    </div>
                                </div>

                                <button 
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full py-5 rounded-4xl bg-zinc-900 dark:bg-white text-white dark:text-black font-black uppercase italic tracking-widest text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <Zap size={24} fill="currentColor" />}
                                    Deploy Extension
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
