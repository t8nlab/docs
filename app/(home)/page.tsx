"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { Terminal, Zap, Cpu, Rocket, Binary, MessageSquareQuote, Monitor } from "lucide-react"
import { RiDiscordFill } from "@remixicon/react"
import VideoLoader from "@/app/components/VideoLoader"
import StatusBadge from "@/app/components/StatusBadge"
import WorkflowSection from "@/app/components/WorkflowSection"
import { RiJavascriptFill } from "@remixicon/react"
import { Feature } from "@/app/components/Feature"
import { FeedbackCard } from "@/app/components/FeedbackCard"
import { feedbacks } from "@/app/data/feedbacks"


export default function HomePage() {
  const videoContainerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: videoContainerRef,
    offset: ["start end", "center center"],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1])

  return (
    <>
      <VideoLoader text="Titan Planet" />

      <main className="relative flex min-h-[200vh] flex-col items-center overflow-x-hidden bg-background pt-24 pb-20">

        {/* Background glow - Persistent */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">

          {/* Hero Top Glow - Blue/Indigo */}
          <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-[100px] opacity-80 mix-blend-screen dark:opacity-20 dark:bg-blue-500/10 dark:blur-[120px]" />

          {/* Dynamic ambient orbs */}
          <div className="absolute left-0 top-[40%] h-[500px] w-[500px] -translate-x-1/3 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px] opacity-50 mix-blend-screen dark:opacity-10 dark:bg-cyan-400/5" />
          <div className="absolute right-0 top-[60%] h-[500px] w-[500px] translate-x-1/3 -translate-y-1/2 rounded-full bg-purple-600/10 blur-[120px] opacity-50 mix-blend-screen dark:opacity-10 dark:bg-purple-500/5" />
        </div>

        {/* Hero Content - Centered properly */}
        <div className="max-w-4xl text-center px-6 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.2 }}
            className="flex flex-col items-center"
          >
            <div className="group relative inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 pl-3 pr-4 py-1.5 text-xs font-medium text-primary backdrop-blur-md transition-colors hover:bg-primary/10 hover:border-primary/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <div className="flex items-center gap-2 tracking-wide text-[10px] font-semibold uppercase">
                <span className="font-medium bg-clip-text text-transparent bg-linear-to-r from-yellow-500 to-orange-200">
                  JavaScript
                </span>
                <span className="text-primary/40">•</span>
                <span className="flex items-center gap-1 font-medium bg-clip-text text-transparent bg-linear-to-r from-orange-600 to-red-600">
                  Rust
                </span>
              </div>
            </div>

            <h1 className="text-black dark:text-white mt-8 text-4xl font-extrabold tracking-[-0.02em] sm:text-6xl lg:text-7xl bg-clip-text bg-linear-to-b from-foreground via-foreground/90 to-foreground/50">
              Titan Planet
            </h1>

            <p className="mt-8 max-w-2xl mx-auto leading-relaxed text-muted-foreground/90 font-medium">
              The high-performance JavaScript framework for the modern backend.
              <br className="hidden sm:block" />
              Write pure JS/TS. Ship with a compiled native binary. Powered by V8.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.4 }}
            className="mt-12 grid gap-6 sm:grid-cols-3 text-left"
          >
            <Feature
              icon={<Cpu className="h-5 w-5" />}
              title="V8 Engine"
              description="Raw JavaScript performance with direct bindings."
            />
            <Feature
              icon={<Zap className="h-5 w-5" />}
              title="Native Binary"
              description="Compiles to a single, standalone executable."
            />
            <Feature
              icon={<Terminal className="h-5 w-5" />}
              title="Toolchain"
              description="Integrated CLI for bundling and deployment."
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2.6 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/docs"
              className="group inline-flex h-10 items-center justify-center gap-2 rounded-md px-8 text-sm font-medium text-primary-foreground border border-dashed border-black/70 dark:border-white/70 transition-all hover:scale-105 active:scale-95"
            >
              Quick Start
              <Rocket className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </Link>

            <Link
              href="https://discord.gg/cYpB9bSY"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-10 items-center justify-center gap-2 rounded-md border border-dashed border-indigo-500/30 bg-background px-8 text-sm font-medium text-indigo-600 shadow-sm transition-colors hover:bg-indigo-500/5 hover:border-indigo-500/60 hover:text-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
            >
              <RiDiscordFill className="h-4 w-4" />
              Join Discord
            </Link>
          </motion.div>
        </div>


        <div ref={videoContainerRef} className="relative w-full min-h-[40vh] flex items-center justify-center py-10">
          <motion.div
            style={{ scale, opacity, borderRadius: "1.5rem" }}
            className="relative w-full max-w-4xl aspect-video overflow-hidden shadow-2xl backdrop-blur border bg-background/40"
          >
            <video
              src="/titan-anime.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/20 to-transparent pointer-events-none" />
          </motion.div>
        </div>

        {/* Ecosystem Section */}
        <div className="mt-32 w-full max-w-6xl px-6">
          <div className="mb-12 text-center">
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the powerful ecosystem of tools and features that make Titan Planet the ultimate high-performance JavaScript framework.
            </p>
          </div>

          {/* Card Grid */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 isolate">
            {/* Background Glow Effect */}
            <div className="absolute inset-0 -z-10 bg-radial-[circle_at_center_center] from-primary/5 via-transparent to-transparent opacity-50 blur-3xl" />

            {/* Observatory Card */}
            <div className="group relative z-10 flex flex-col overflow-hidden rounded-3xl border border-border bg-white dark:bg-zinc-900/40 backdrop-blur-sm transition-all hover:shadow-xl hover:-translate-y-1 duration-300 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden">
                  <Image
                    src="/observatory_preview_active.png"
                    alt="Observatory"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="inline-flex items-center rounded-full border bg-blue-500/10 border-blue-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Native Dashboard
                </div>
                <StatusBadge status="STABLE" />
                <div className="inline-flex items-center gap-1 rounded-full border bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 px-2.5 py-0.5 text-[10px] font-medium text-zinc-700 dark:text-zinc-300">
                  Windows
                </div>
              </div>

              <h3 className="text-xl font-bold tracking-tight mb-2 text-foreground">TitanPl Observatory</h3>
              <p className="text-sm leading-relaxed text-muted-foreground mb-6 flex-1">
                Monitor your TitanPl orbits with zero-latency desktop integration. Auto-scan local processes and debug orbits.
              </p>

              <Link
                href="/observatory/download"
                className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Learn more →
              </Link>
            </div>

            {/* SDK Card */}
            <div className="group relative z-10 flex flex-col overflow-hidden rounded-3xl border border-border bg-white dark:bg-zinc-900/40 backdrop-blur-sm transition-all hover:shadow-xl hover:-translate-y-1 duration-300 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden">
                  <Image
                    src="/images/titanpl-sdk.png"
                    alt="SDK"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="inline-flex items-center rounded-full border bg-emerald-500/10 border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Core Toolkit
                </div>
                <StatusBadge status="STABLE" />
                <div className="inline-flex items-center gap-1 rounded-full border bg-yellow-400/10 border-yellow-400/20 px-2.5 py-0.5 text-[10px] font-medium text-yellow-600 dark:text-yellow-500">
                  <RiJavascriptFill className="h-3 w-3" /> JS
                </div>
              </div>

              <h3 className="text-xl font-bold tracking-tight mb-2 text-foreground">@titanpl/sdk</h3>
              <p className="text-sm leading-relaxed text-muted-foreground mb-6 flex-1">
                Scaffold, test, and publish extensions with a single workflow. Generate modules and ship npm packages.
              </p>

              <Link
                href="/docs/how-to-use/12-package-ecosystem"
                className="inline-flex items-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
              >
                Learn more →
              </Link>
            </div>

            {/* Extensions Card */}
            <div className="group relative z-10 flex flex-col overflow-hidden rounded-3xl border border-border bg-white dark:bg-zinc-900/40 backdrop-blur-sm transition-all hover:shadow-xl hover:-translate-y-1 duration-300 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden">
                  <Image
                    src="/images/titanpl-ext.png"
                    alt="Extensions"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="inline-flex items-center rounded-full border bg-purple-500/10 border-purple-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  Modular
                </div>
                <StatusBadge status="STABLE" />
                <div className="inline-flex items-center gap-1 rounded-full border bg-yellow-400/10 border-yellow-400/20 px-2.5 py-0.5 text-[10px] font-medium text-yellow-600 dark:text-yellow-500">
                  <RiJavascriptFill className="h-3 w-3" /> JS
                </div>
                <div className="inline-flex items-center gap-1 rounded-full border bg-blue-500/10 border-blue-500/20 px-2.5 py-0.5 text-[10px] font-medium text-blue-600 dark:text-blue-400">
                  TS
                </div>
              </div>

              <h3 className="text-xl font-bold tracking-tight mb-2 text-foreground">TitanPL Extensions</h3>
              <p className="text-sm leading-relaxed text-muted-foreground mb-6 flex-1">
                Add modular features to any Titan project. Build reusable plugins and integrate external services.
              </p>

              <Link
                href="/docs/knowledge/07-extensions"
                className="inline-flex items-center text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
              >
                Learn more →
              </Link>
            </div>

            {/* Rust Actions Card */}
            <div className="group relative z-10 flex flex-col overflow-hidden rounded-3xl border border-border bg-white dark:bg-zinc-900/40 backdrop-blur-sm transition-all hover:shadow-xl hover:-translate-y-1 duration-300 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden">
                  <Image
                    src="/images/rust-actions.png"
                    alt="Rust Actions"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="inline-flex items-center rounded-full border bg-orange-500/10 border-orange-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                  High Performance
                </div>
                <StatusBadge status="BETA" />
                <div className="inline-flex items-center gap-1 rounded-full border bg-yellow-400/10 border-yellow-400/20 px-2.5 py-0.5 text-[10px] font-medium text-yellow-600 dark:text-yellow-500">
                  <RiJavascriptFill className="h-3 w-3" /> JS
                </div>
                <div className="inline-flex items-center gap-1 rounded-full border bg-orange-500/10 border-orange-500/20 px-2.5 py-0.5 text-[10px] font-medium text-orange-600 dark:text-orange-400">
                  <Binary size={10} strokeWidth={2.5} /> Rust
                </div>
              </div>

              <h3 className="text-xl font-bold tracking-tight mb-2 text-foreground">Hybrid Rust Actions</h3>
              <p className="text-sm leading-relaxed text-muted-foreground mb-6 flex-1">
                Write performance-critical logic in Native Rust. Compiled directly into the server binary for maximum speed.
              </p>

              <Link
                href="/docs/how-to-use/02-actions#%EF%B8%8F-rust-actions-rs"
                className="inline-flex items-center text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
              >
                Learn more →
              </Link>
            </div>

            {/* Orbit System Card */}
            <div className="group relative z-10 flex flex-col overflow-hidden rounded-3xl border border-border bg-white dark:bg-zinc-900/40 backdrop-blur-sm transition-all hover:shadow-xl hover:-translate-y-1 duration-300 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden">
                  <Image
                    src="/images/orbit-system.png"
                    alt="Orbit System"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="inline-flex items-center rounded-full border bg-cyan-500/10 border-cyan-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                  Core Architecture
                </div>
                <StatusBadge status="STABLE" />
                <div className="inline-flex items-center gap-1 rounded-full border bg-orange-500/10 border-orange-500/20 px-2.5 py-0.5 text-[10px] font-medium text-orange-600 dark:text-orange-400">
                  <Binary size={10} strokeWidth={2.5} /> Rust
                </div>
              </div>

              <h3 className="text-xl font-bold tracking-tight mb-2 text-foreground">TitanPl Orbit System</h3>
              <p className="text-sm leading-relaxed text-muted-foreground mb-6 flex-1">
                High-performance routing engine with constant-time resolution (O(1)) and zero degradation at scale.
              </p>

              <Link
                href="/docs/knowledge/03-orbit-system"
                className="inline-flex items-center text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
              >
                Learn more →
              </Link>
            </div>

            {/* Gravity Runtime Card */}
            <div className="group relative z-10 flex flex-col overflow-hidden rounded-3xl border border-border bg-white dark:bg-zinc-900/40 backdrop-blur-sm transition-all hover:shadow-xl hover:-translate-y-1 duration-300 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden">
                  <Image
                    src="/images/gravity-runtime.png"
                    alt="Gravity Runtime"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="inline-flex items-center rounded-full border bg-indigo-500/10 border-indigo-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Runtime Engine
                </div>
                <StatusBadge status="STABLE" />
                <div className="inline-flex items-center gap-1 rounded-full border bg-yellow-400/10 border-yellow-400/20 px-2.5 py-0.5 text-[10px] font-medium text-yellow-600 dark:text-yellow-500">
                  <RiJavascriptFill className="h-3 w-3" /> V8
                </div>
              </div>

              <h3 className="text-xl font-bold tracking-tight mb-2 text-foreground">Gravity Runtime</h3>
              <p className="text-sm leading-relaxed text-muted-foreground mb-6 flex-1">
                Powerful JavaScript runtime built on V8. Execute your code with blazing-fast performance and native bindings.
              </p>

              <Link
                href="/docs/knowledge/02-runtime-architecture"
                className="inline-flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                Learn more →
              </Link>
            </div>
          </div>
        </div>

        {/* Community Feedback Section */}
        <div className="mt-32 w-full max-w-7xl px-6 text-center mb-32">
          <div className="mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-6 bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/70">
              Community Feedback
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join the conversation about the future of JavaScript and Rust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {feedbacks.map((feedback, index) => (
              <FeedbackCard
                key={index}
                {...feedback}
              />
            ))}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-background/40 p-8 backdrop-blur-sm transition-all hover:bg-background/60 hover:-translate-y-1 duration-300">
              <div className={`absolute -right-10 -top-10 h-40 w-40 rounded-full bg-linear-to-br from-green-500/20 to-transparent blur-3xl`} />
              <div>
                <div className="mb-4 flex items-center gap-2 text-green-500">
                  <MessageSquareQuote className="h-5 w-5" />
                  <span className="text-xs font-medium uppercase tracking-wider">Your Feedback</span>
                </div>
                <p className="text-xl font-medium leading-relaxed text-foreground/90">
                  "Have you tried Titan Planet? We'd love to hear your thoughts."
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-border/50">
                <Link href="https://discord.gg/cYpB9bSY" target="_blank" className="group inline-flex items-center gap-2 text-sm font-semibold text-indigo-500 hover:text-indigo-400 transition-colors">
                  <RiDiscordFill className="h-4 w-4" />
                  Join the Discord →
                </Link>
              </div>
            </div>
          </div>

          <div id="workflow" className="mt-32">
            <WorkflowSection />
          </div>

        </div>
      </main >
    </>
  )
}