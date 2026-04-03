'use client';

import { RiRam2Fill } from '@remixicon/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Timer, Activity, Cpu, Database, Server, HardDrive, Layout, Terminal, TestTube2 } from 'lucide-react';
import Link from 'next/link';
import { FaWindows } from 'react-icons/fa';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

const latencyDistribution = [
    { percentile: 'P50', titanpl: 27, fastify: 67 },
    { percentile: 'P97.5', titanpl: 46, fastify: 146 },
    { percentile: 'P99', titanpl: 56, fastify: 172 },
];

const MetricChip = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold">
        <Icon size={12} style={{ color }} />
        <span className="text-neutral-500 tracking-wider transition-colors group-hover:text-neutral-300">{label}:</span>
        <span className="text-white tracking-widest">{value}</span>
    </div>
);

const CircularProgress = ({ progress, size = 48, strokeWidth = 2, children, color = "#3b82f6" }: { progress: number, size?: number, strokeWidth?: number, children: React.ReactNode, color?: string }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="absolute -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                />
            </svg>
            {children}
        </div>
    );
};

const SegmentedBar = ({ label, value, max, color, description }: { label: string, value: number, max: number, color: string, description: string }) => {
    const segments = 24;
    const activeSegments = Math.round((value / max) * segments);

    return (
        <div className="py-6 border-b border-white/5 last:border-0 hover:bg-white/1 transition-colors px-2 rounded-xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                <div>
                    <h4 className="text-[10px] font-bold text-neutral-500 tracking-[0.2em] uppercase mb-1">{description}</h4>
                    <p className="text-sm font-semibold text-white/90">{label}</p>
                </div>
                <div className="text-5xl font-black tracking-tighter flex items-baseline gap-2">
                    {value.toLocaleString()} <span className="text-xs font-bold text-neutral-600 uppercase tracking-widest">req/s</span>
                </div>
            </div>
            <div className="flex gap-[3px] h-3">
                {Array.from({ length: segments }).map((_, i) => (
                    <div
                        key={i}
                        className="flex-1 rounded-[1px] transition-all duration-700"
                        style={{
                            backgroundColor: i < activeSegments ? color : 'rgba(255,255,255,0.03)',
                            boxShadow: i < activeSegments ? `0 0 12px ${color}30` : 'none'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

const BenchmarkPage = () => {
    return (
        <div className="min-h-screen bg-black text-white py-24 selection:bg-blue-500/30 font-sans tracking-tight">
            <div className="max-w-5xl mx-auto px-6">

                {/* Minimal Header */}
                <header className="mb-20">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div>
                            <h1 className="text-6xl font-black tracking-tighter mb-4 italic">Benchmarks.</h1>
                            <p className="text-neutral-400 max-w-md text-lg leading-snug">Auditing the raw efficiency of the Titan Planet against standard Node.js frameworks.</p>
                        </div>

                        {/* Chips Row */}
                        <div className="flex flex-wrap gap-2 pt-4">
                            <MetricChip icon={Cpu} label="CPU" value="16 Core" color="#3b82f6" />
                            <MetricChip icon={RiRam2Fill} label="RAM" value="16 GB" color="#a855f7" />
                            <MetricChip icon={FaWindows} label="OS" value="Windows" color="#10b981" />
                            <MetricChip icon={TestTube2} label="Tested with" value="Autocannon" color="#10b981" />
                        </div>
                    </div>
                </header>

                {/* Main Insight Hero */}
                <section className="mb-32">
                    <div className="p-px w-full rounded-4xl bg-linear-to-b from-white/10 to-transparent">
                        <div className="bg-[#050505] rounded-[calc(2.5rem-1px)] p-10 md:p-16 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

                            <div className="flex items-center gap-3 mb-16">
                                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                                    <Zap size={20} fill="currentColor" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight text-white leading-none">Throughput Velocity</h2>
                                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1.5 opacity-60">Total requests processed per second</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <SegmentedBar
                                    label="TitanPL (Built, Mulithreaded js runtime gravity)"
                                    value={32513}
                                    max={35000}
                                    color="#3b82f6"
                                    description="Rust Axum"
                                />
                                <SegmentedBar
                                    label="Fastify (Standard Node.js Framework)"
                                    value={13664}
                                    max={35000}
                                    color="#10b981"
                                    description="Node.js Dependent Stack"
                                />
                            </div>

                            <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 gap-12 pt-12 border-t border-white/5">
                                <div className="group">
                                    <p className="text-[11px] font-black text-neutral-500 tracking-[0.3em] uppercase mb-3">Efficiency Coefficient</p>
                                    <div className="text-5xl font-black tracking-tighter text-blue-400">2.4x <span className="text-sm font-bold text-neutral-500 tracking-normal italic ml-2">Higher Throughput</span></div>
                                </div>
                                <div className="group">
                                    <p className="text-[11px] font-black text-neutral-500 tracking-[0.3em] uppercase mb-3">Response Velocity</p>
                                    <div className="text-5xl font-black tracking-tighter text-emerald-400">-75% <span className="text-sm font-bold text-neutral-500 tracking-normal italic ml-2">Lower Latency</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Secondary Graphs Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32 items-start">
                    <section className="p-8 rounded-3xl bg-white/2 border border-white/5">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                                <Timer size={18} />
                            </div>
                            <h3 className="text-lg font-bold tracking-tight">Latency Distribution</h3>
                        </div>
                        <p className="text-sm text-neutral-400 mb-12 leading-relaxed">
                            Comparing percentile response times. TitanPL maintains a significantly tighter distribution under sustained load.
                        </p>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={latencyDistribution} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorT" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorF" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                    <XAxis
                                        dataKey="percentile"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#666', fontSize: 10, fontWeight: 800 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#666', fontSize: 10, fontWeight: 800 }}
                                        unit="ms"
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#000', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '10px', padding: '12px' }}
                                        cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="titanpl"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        fill="url(#colorT)"
                                        animationDuration={2000}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="fastify"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        strokeDasharray="4 4"
                                        fill="url(#colorF)"
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-8 flex gap-6 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                            <div className="flex items-center gap-2 px-3 py-1 bg-white/3 rounded-full border border-white/5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" /> TitanPL Native</div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-white/3 rounded-full border border-white/5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" /> Fastify Node.js</div>
                        </div>
                    </section>


                </div>

                {/* Perfected Upcoming Benchmark Section - Compact Circular Progress */}
                <section className="relative py-16 px-10 rounded-4xl bg-[#050505] border border-white/10 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-blue-500/20 to-transparent" />

                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="text-left max-w-sm">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black tracking-[0.3em] uppercase mb-6 text-neutral-500">
                                Titan Lab
                            </div>
                            <h3 className="text-3xl font-black tracking-tighter mb-4 text-white">Upcoming Benchmarks.</h3>
                            <p className="text-neutral-500 text-sm leading-relaxed">
                                Upcoming benchmarks for TitanPL.
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-6">
                            {[
                                { icon: HardDrive, label: "IO", progress: 80, status: "DEV" },
                                { icon: Database, label: "DB", progress: 65, status: "ALPHA" },
                                { icon: Terminal, label: "CLI", progress: 100, status: "READY" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center group">
                                    <CircularProgress progress={item.progress} size={64} color={item.progress === 100 ? "#10b981" : "#3b82f6"}>
                                        <item.icon size={20} className="text-neutral-500 group-hover:text-white transition-colors" />
                                    </CircularProgress>
                                    <div className="mt-4 text-[10px] font-black tracking-[0.2em] uppercase text-neutral-600 group-hover:text-neutral-400 transition-colors">{item.label}</div>
                                    <div className="mt-1 text-[9px] font-bold text-neutral-700 tracking-wider transition-colors">{item.status}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>


            </div>
        </div>
    );
};

export default BenchmarkPage;
