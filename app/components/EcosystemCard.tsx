"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { IconType } from "react-icons"
import { RemixiconComponentType } from "@remixicon/react"
import StatusBadge from "./StatusBadge"
import { cn } from "@/lib/utils"

export interface TechBadge {
    text: string
    icon?: LucideIcon | IconType | RemixiconComponentType
    className?: string
}

export interface FooterIcon {
    icon: LucideIcon | IconType | RemixiconComponentType
    colorClass: string
}

interface EcosystemCardProps {
    icon: LucideIcon | IconType | RemixiconComponentType
    iconColorClass: string // e.g. "bg-blue-500/10 text-blue-600 dark:text-blue-400"
    category: string
    status?: "ALPHA" | "BETA" | "STABLE"
    techBadges?: TechBadge[]
    title: string
    description: string
    href: string
    linkText: string
    footerIcons?: FooterIcon[]
    className?: string
}

export function EcosystemCard({
    icon: Icon,
    iconColorClass,
    category,
    status,
    techBadges,
    title,
    description,
    href,
    linkText,
    footerIcons,
    className
}: EcosystemCardProps) {
    return (
        <div className={cn(
            "group relative z-10 flex flex-col overflow-hidden rounded-3xl border border-border bg-white dark:bg-zinc-900/40 backdrop-blur-sm transition-all hover:shadow-xl hover:-translate-y-1 duration-300 p-6",
            className
        )}>
            <div className="flex items-start justify-between mb-4">
                <div className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-2xl",
                    iconColorClass
                )}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="inline-flex items-center rounded-full border bg-zinc-500/5 border-zinc-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    {category}
                </div>
                {status && <StatusBadge status={status} />}
                {techBadges?.map((badge, idx) => (
                    <div key={idx} className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-medium",
                        badge.className || "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                    )}>
                        {badge.icon && <badge.icon size={badge.text ? 10 : 12} />}
                        {badge.text}
                    </div>
                ))}
            </div>

            <h3 className="text-xl font-bold tracking-tight mb-2 text-foreground">{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground mb-6 flex-1">
                {description}
            </p>

            <div className="flex items-center justify-between mt-auto">
                <Link
                    href={href}
                    className="inline-flex items-center text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
                >
                    {linkText}
                </Link>
                {footerIcons && footerIcons.length > 0 && (
                    <div className="flex -space-x-2">
                        {footerIcons.map((fIcon, idx) => (
                            <div key={idx} className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-sm">
                                <fIcon.icon size={12} className={fIcon.colorClass} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
