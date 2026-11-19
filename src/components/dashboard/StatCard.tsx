"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

interface StatCardProps {
    label: string;
    value: string | number;
    caption?: string;
    tone: "sky" | "mint" | "amber";
    icon: ReactNode;
    delay?: number;
}

const TONE_CLASS: Record<StatCardProps["tone"], string> = {
    sky: "fm-bento-sky",
    mint: "fm-bento-mint",
    amber: "fm-bento-amber",
};

const ICON_COLOR: Record<StatCardProps["tone"], string> = {
    sky: "text-[var(--fm-primary)]",
    mint: "text-[#2BC9A0]",
    amber: "text-[#FFB020]",
};

export function StatCard({
    label,
    value,
    caption,
    tone,
    icon,
    delay = 0,
}: StatCardProps) {
    const prefersReducedMotion = useReducedMotion();

    return (
        <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay, ease: "easeOut" }}
            className={`${TONE_CLASS[tone]} flex items-start justify-between gap-4 p-5 sm:p-6`}
        >
            <div className="min-w-0 space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--fm-ink-soft)]">
                    {label}
                </p>
                <p className="fm-heading text-2xl sm:text-3xl">{value}</p>
                {caption && (
                    <p className="text-xs font-medium text-[var(--fm-ink-muted)]">
                        {caption}
                    </p>
                )}
            </div>

            {/* Frosted Circle Icon */}
            <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--fm-surface-border)] bg-[var(--fm-surface)] shadow-sm ${ICON_COLOR[tone]}`}
            >
                {icon}
            </span>
        </motion.div>
    );
}