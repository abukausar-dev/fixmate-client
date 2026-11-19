"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
    Search,
    ArrowRight,
    ShieldCheck,
    CheckCircle2,
    Wrench,
} from "lucide-react";

const PIPELINE_STEPS = [
    { id: 1, label: "Requested" },
    { id: 2, label: "Accepted" },
    { id: 3, label: "In Progress" },
    { id: 4, label: "Completed" },
];

export function HeroSection() {
    const prefersReducedMotion = useReducedMotion();
    const [activeStep, setActiveStep] = useState(0);

    // Cycle through the 4 pipeline stages gently so the hero feels alive
    useEffect(() => {
        if (prefersReducedMotion) return;
        const timer = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % PIPELINE_STEPS.length);
        }, 1800);
        return () => clearInterval(timer);
    }, [prefersReducedMotion]);

    const fadeUp = (delay: number) => ({
        initial: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45, delay, ease: "easeOut" as const },
    });

    return (
        <section className="fm-container pt-10 sm:pt-12">
            {/* Main rounded-[36px] frosted glass hero wrapper */}
            <div className="fm-glass relative overflow-hidden rounded-[36px] p-5 sm:p-10 lg:p-14">
                {/* Decorative glossy orbs behind content (smallest hidden on mobile) */}
                <div
                    aria-hidden="true"
                    className="fm-orb fm-orb-blue fm-float-slow absolute -right-10 -top-12 h-36 w-36 opacity-80 sm:h-48 sm:w-48"
                />
                <div
                    aria-hidden="true"
                    className="fm-orb fm-orb-amber fm-float-reverse hidden sm:block absolute bottom-10 right-[42%] h-20 w-20 opacity-85"
                    style={{ animationDelay: "1.4s" }}
                />
                <div
                    aria-hidden="true"
                    className="fm-orb fm-orb-glass fm-float-slow hidden lg:block absolute -bottom-10 -left-8 h-28 w-28"
                    style={{ animationDelay: "0.7s" }}
                />

                <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
                    {/* Left Column: Staggered Text + Search Pill + Honest Fact Chips */}
                    <div className="space-y-6 lg:col-span-7">
                        <motion.div {...fadeUp(0)}>
                            <span className="inline-flex items-center gap-2.5 rounded-full border border-[var(--fm-surface-border)] bg-[var(--fm-surface)] px-4 py-1.5 text-xs font-bold text-[var(--fm-primary-soft-text)] shadow-sm">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2BC9A0] opacity-75" />
                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#2BC9A0]" />
                                </span>
                                On-Demand Smart Device &amp; Appliance Repair
                            </span>
                        </motion.div>

                        <motion.h1 {...fadeUp(0.08)} className="fm-h1">
                            Broken Device? Get It Fixed by{" "}
                            <span className="relative inline-block text-[var(--fm-primary)]">
                                Verified
                                {/* Signature underline-swoosh SVG */}
                                <svg
                                    viewBox="0 0 220 14"
                                    fill="none"
                                    aria-hidden="true"
                                    className="absolute -bottom-1.5 left-0 w-full"
                                >
                                    <path
                                        d="M3 10.5C58 2.5 148 1.5 217 9.5"
                                        stroke="#FFB020"
                                        strokeWidth="4.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </span>{" "}
                            Technicians.
                        </motion.h1>

                        <motion.p
                            {...fadeUp(0.16)}
                            className="max-w-xl text-base leading-relaxed text-[var(--fm-ink-soft)] sm:text-[17px]"
                        >
                            Book admin-approved technicians for home visits or shop drop-offs.
                            Track your repair step-by-step and pay securely online only after
                            the job is completed.
                        </motion.p>

                        {/* Search Pill routing to /services?search=... */}
                        <motion.form
                            {...fadeUp(0.24)}
                            action="/services"
                            method="GET"
                            className="flex flex-col gap-2.5 rounded-3xl border border-[var(--fm-surface-border)] bg-[var(--fm-surface)] p-2 shadow-sm sm:flex-row sm:items-center sm:rounded-full"
                        >
                            <div className="flex flex-1 items-center gap-3 px-4 py-2">
                                <Search className="h-5 w-5 shrink-0 text-[var(--fm-primary)]" />
                                <input
                                    type="text"
                                    name="search"
                                    aria-label="Search repair services"
                                    placeholder="Search e.g. iPhone screen, AC servicing, laptop..."
                                    className="w-full bg-transparent text-sm text-[var(--fm-ink)] placeholder:text-[var(--fm-ink-muted)] focus:outline-none"
                                />
                            </div>
                            <button type="submit" className="fm-btn-primary shrink-0">
                                Find Service
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </motion.form>

                        {/* 3 Honest Fact Pastel Stat Chips */}
                        <motion.div
                            {...fadeUp(0.32)}
                            className="grid grid-cols-3 gap-2 pt-1 sm:gap-4"
                        >
                            <div className="fm-bento-sky p-2.5 text-center sm:p-4 sm:text-left">
                                <p className="fm-heading text-lg sm:text-2xl">7</p>
                                <p className="mt-0.5 text-[11px] font-medium leading-tight text-[var(--fm-ink-soft)] sm:text-xs">
                                    Repair Categories
                                </p>
                            </div>
                            <div className="fm-bento-mint p-2.5 text-center sm:p-4 sm:text-left">
                                <p className="fm-heading text-lg sm:text-2xl">100%</p>
                                <p className="mt-0.5 text-[11px] font-medium leading-tight text-[var(--fm-ink-soft)] sm:text-xs">
                                    Admin Moderated
                                </p>
                            </div>
                            <div className="fm-bento-amber p-2.5 text-center sm:p-4 sm:text-left">
                                <p className="fm-heading text-lg sm:text-2xl">$0</p>
                                <p className="mt-0.5 text-[11px] font-medium leading-tight text-[var(--fm-ink-soft)] sm:text-xs">
                                    Upfront Payment
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Rounded Photo + 3 Floating Glass Cards */}
                    <motion.div
                        initial={
                            prefersReducedMotion
                                ? { opacity: 0 }
                                : { opacity: 0, scale: 0.96 }
                        }
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.55, delay: 0.15, ease: "easeOut" }}
                        className="relative lg:col-span-5"
                    >
                        {/* Photo Wrapper */}
                        <div className="relative aspect-[4/4.4] w-full overflow-hidden rounded-[32px] border border-white/40 bg-[#0B1F3A] shadow-[var(--shadow-float)]">
                            <Image
                                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=85"
                                alt="Verified technician diagnosing electronic hardware"
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 42vw"
                                className="object-cover"
                            />
                            {/* Bottom Navy Gradient Tint for readability */}
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/85 via-[#0B1F3A]/15 to-transparent" />
                        </div>

                        {/* Floating Card (c): Verified Shield Chip — Top Left */}
                        <div className="fm-glass-float fm-bob-gentle absolute -left-2 top-4 flex items-center gap-2.5 rounded-full px-3.5 py-2 sm:-left-6 sm:top-6">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--fm-mint-soft)] text-[var(--fm-mint-soft-text)]">
                                <ShieldCheck className="h-4 w-4" />
                            </span>
                            <div className="pr-1 leading-tight">
                                <p className="text-xs font-bold text-[var(--fm-ink)]">
                                    Admin-Verified
                                </p>
                                <p className="text-[10px] font-medium text-[var(--fm-ink-muted)]">
                                    Every listing checked
                                </p>
                            </div>
                        </div>

                        {/* Floating Card (b): Technician on the way — Top Right (Hidden on Mobile) */}
                        <div
                            className="fm-glass-float fm-bob-gentle hidden sm:flex absolute -right-5 top-28 items-center gap-3 rounded-2xl px-3.5 py-2.5"
                            style={{ animationDelay: "1.2s" }}
                        >
                            <div className="flex -space-x-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--fm-surface)] bg-[#2F6BFF] text-[10px] font-bold text-white">
                                    TH
                                </span>
                                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--fm-surface)] bg-[#FFB020] text-[10px] font-bold text-[#0B1F3A]">
                                    MR
                                </span>
                                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--fm-surface)] bg-[#2BC9A0] text-[10px] font-bold text-[#0B1F3A]">
                                    <Wrench className="h-3.5 w-3.5" />
                                </span>
                            </div>
                            <div className="leading-tight">
                                <p className="flex items-center gap-1.5 text-xs font-bold text-[var(--fm-ink)]">
                                    <span className="h-2 w-2 rounded-full bg-[#2BC9A0]" />
                                    Technician on the way
                                </p>
                                <p className="text-[11px] text-[var(--fm-ink-muted)]">
                                    Home Visit &amp; Shop Drop-off
                                </p>
                            </div>
                        </div>

                        {/* Floating Card (a): Animated Looping Live Job Pipeline — Bottom */}
                        <div className="fm-glass-float absolute bottom-4 left-3 right-3 rounded-2xl p-4 sm:bottom-5 sm:left-4 sm:right-4">
                            <div className="flex flex-wrap items-center justify-between gap-1.5">
                                <span className="flex items-center gap-1.5 text-xs font-bold text-[var(--fm-ink)]">
                                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--fm-primary)]" />
                                    Live Job Pipeline
                                </span>
                                <span className="whitespace-nowrap rounded-full bg-[var(--fm-amber-soft)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--fm-amber-soft-text)] sm:text-[11px]">
                                    Pay After Completion
                                </span>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                                {PIPELINE_STEPS.map((step, index) => {
                                    const isActive = index === activeStep;
                                    const isDone = index < activeStep;

                                    return (
                                        <div
                                            key={step.id}
                                            className={`rounded-xl px-2 py-1.5 text-center transition-all duration-300 ${isActive
                                                    ? "bg-[var(--fm-primary)] text-white shadow-sm scale-[1.03]"
                                                    : isDone
                                                        ? "bg-[var(--fm-mint-soft)] text-[var(--fm-mint-soft-text)]"
                                                        : "bg-[var(--fm-nav-track)] text-[var(--fm-ink-muted)]"
                                                }`}
                                        >
                                            <p className="text-[10px] font-bold leading-tight">
                                                {step.id}. {step.label}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}