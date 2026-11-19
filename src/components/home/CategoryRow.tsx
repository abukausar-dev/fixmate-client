"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
    Smartphone,
    Laptop,
    Wind,
    Refrigerator,
    Tv,
    WashingMachine,
    Zap,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";

const CATEGORIES = [
    {
        name: "Smartphone",
        caption: "Screen, battery & port",
        icon: Smartphone,
        iconBg: "bg-[var(--fm-primary-soft)] text-[var(--fm-primary-soft-text)]",
    },
    {
        name: "Laptop & PC",
        caption: "Hardware & OS fix",
        icon: Laptop,
        iconBg: "bg-[var(--fm-mint-soft)] text-[var(--fm-mint-soft-text)]",
    },
    {
        name: "AC",
        caption: "Cooling, gas & service",
        icon: Wind,
        iconBg: "bg-[var(--fm-amber-soft)] text-[var(--fm-amber-soft-text)]",
    },
    {
        name: "Refrigerator",
        caption: "Compressor & cooling",
        icon: Refrigerator,
        iconBg: "bg-[var(--fm-primary-soft)] text-[var(--fm-primary-soft-text)]",
    },
    {
        name: "TV",
        caption: "Display & power board",
        icon: Tv,
        iconBg: "bg-[var(--fm-mint-soft)] text-[var(--fm-mint-soft-text)]",
    },
    {
        name: "Washing Machine",
        caption: "Drum, motor & drain",
        icon: WashingMachine,
        iconBg: "bg-[var(--fm-amber-soft)] text-[var(--fm-amber-soft-text)]",
    },
    {
        name: "Electrical",
        caption: "Wiring & home circuit",
        icon: Zap,
        iconBg: "bg-[var(--fm-primary-soft)] text-[var(--fm-primary-soft-text)]",
    },
];

export function CategoryRow() {
    const prefersReducedMotion = useReducedMotion();

    return (
        <section className="fm-container space-y-8 py-14 lg:py-20">
            <SectionHeading
                eyebrow="Browse by Category"
                title="What needs fixing today?"
                subtitle="Pick a device or home appliance category to explore approved services and transparent starting prices."
                actionLabel="All Services"
                actionHref="/services"
            />

            {/* Clean 2-column grid on mobile, 3-col on tablet, 7-col on desktop */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7 lg:gap-4">
                {CATEGORIES.map((cat, index) => {
                    const Icon = cat.icon;
                    const isLastOdd = index === CATEGORIES.length - 1;
                    return (
                        <motion.div
                            key={cat.name}
                            initial={
                                prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }
                            }
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{
                                duration: 0.4,
                                delay: index * 0.05,
                                ease: "easeOut",
                            }}
                            className={isLastOdd ? "col-span-2 sm:col-span-1" : ""}
                        >
                            <Link
                                href={`/services?category=${encodeURIComponent(cat.name)}`}
                                className="fm-card fm-card-hover group flex h-full flex-col justify-between p-4 hover:ring-2 hover:ring-[var(--fm-primary)]/25 sm:p-5"
                            >
                                <span
                                    className={`flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-[1.08] ${cat.iconBg}`}
                                >
                                    <Icon className="h-5 w-5" />
                                </span>

                                <div className="mt-5">
                                    <h3 className="fm-heading text-sm transition-colors group-hover:text-[var(--fm-primary)]">
                                        {cat.name}
                                    </h3>
                                    <p className="mt-1 text-xs leading-snug text-[var(--fm-ink-muted)]">
                                        {cat.caption}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}