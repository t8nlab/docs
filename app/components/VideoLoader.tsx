"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface VideoLoaderProps {
    text?: string
    duration?: number
    className?: string
}

export default function VideoLoader({
    text = "Titan Planet",
    duration = 2200,
    className = ""
}: VideoLoaderProps) {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Disable scrolling while loading
        document.body.style.overflow = "hidden"

        const timer = setTimeout(() => {
            setLoading(false)
            // Re-enable scrolling
            document.body.style.overflow = ""
        }, duration)

        return () => {
            clearTimeout(timer)
            document.body.style.overflow = ""
        }
    }, [duration])

    return (
        <AnimatePresence mode="wait">
            {loading && (
                <motion.div
                    key="loader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, filter: "blur(10px)" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className={`fixed inset-0 z-100 flex flex-col items-center justify-center bg-black ${className}`}
                >
                    <div className="relative h-full w-full overflow-hidden">
                        <video
                            src="/titan-anime.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 h-full w-full object-cover scale-[1.5] -translate-y-[10%] opacity-60"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />

                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            >
                                <h1 className="text-5xl font-extrabold tracking-[0.3em] text-white sm:text-8xl uppercase drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                                    {text}
                                </h1>
                                <div className="mt-8 h-1.5 w-32 mx-auto bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
