"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
    ShieldCheck,
    MapPin,
    CreditCard,
    ArrowRight,
    CheckCircle2,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";

export function WhyChooseUsSection() {
    const prefersReducedMotion = useReducedMotion();

    const reveal = (delay: number) => ({
        initial: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.45, delay, ease: "easeOut" as const },
    });

    return (
        <section className="fm-container space-y-8 py-14 lg:py-20">
            <SectionHeading
                eyebrow="Built for Trust"
                title="Why customers and technicians choose FixMate"
                subtitle="Designed around clear approvals, real-time status protection, and zero upfront risk."
            />

            {/* Asymmetric Bento Grid: 1 Large (7 cols) + 2 Stacked Small (5 cols) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Large Highlight Bento Card */}
                <motion.div
                    {...reveal(0)}
                    className="fm-bento-sky relative flex flex-col justify-between overflow-hidden p-8 sm:p-10 lg:col-span-7"
                >
                    <div className="space-y-4">
                        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--fm-surface)] text-[var(--fm-primary)] shadow-sm">
                            <ShieldCheck className="h-7 w-7" />
                        </span>

                        <h3 className="fm-heading text-2xl sm:text-3xl">
                            Admin-Moderated &amp; Verified Service Listings
                        </h3>

                        <p className="max-w-lg text-sm leading-relaxed text-[var(--fm-ink-soft)] sm:text-base">
                            Every service submitted or edited by a technician is held in
                            pending review until an administrator approves it. Customers only
                            see vetted, active services with transparent base pricing.
                        </p>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-2.5">
                        {[
                            "Role-Verified Access",
                            "No Duplicate Active Requests",
                            "Server-Enforced Status Rules",
                        ].map((point) => (
                            <span
                                key={point}
                                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--fm-surface-border)] bg-[var(--fm-surface)] px-3.5 py-1.5 text-xs font-semibold text-[var(--fm-ink)]"
                            >
                                <CheckCircle2 className="h-3.5 w-3.5 text-[#2BC9A0]" />
                                {point}
                            </span>
                        ))}
                    </div>
                </motion.div>

                {/* Right Stack: 2 Small Bento Cards */}
                <div className="flex flex-col gap-6 lg:col-span-5">
                    <motion.div
                        {...reveal(0.08)}
                        className="fm-bento-mint flex flex-1 flex-col justify-between p-7"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--fm-surface)] text-[#2BC9A0] shadow-sm">
                                <MapPin className="h-6 w-6" />
                            </span>
                            <span className="rounded-full bg-[var(--fm-surface)] px-3 py-1 text-[11px] font-bold text-[var(--fm-ink)]">
                                Flexible Modes
                            </span>
                        </div>

                        <div className="mt-5 space-y-1.5">
                            <h3 className="fm-heading text-xl">
                                Home Visit or Shop Drop-off
                            </h3>
                            <p className="text-sm leading-relaxed text-[var(--fm-ink-soft)]">
                                Filter services by your preferred mode—book doorstep repairs for
                                ACs and fridges, or drop off phones and laptops at a technician
                                shop.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        {...reveal(0.16)}
                        className="fm-bento-amber flex flex-1 flex-col justify-between p-7"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--fm-surface)] text-[#FFB020] shadow-sm">
                                <CreditCard className="h-6 w-6" />
                            </span>
                            <span className="rounded-full bg-[var(--fm-surface)] px-3 py-1 text-[11px] font-bold text-[var(--fm-ink)]">
                                Stripe Checkout
                            </span>
                        </div>

                        <div className="mt-5 space-y-1.5">
                            <h3 className="fm-heading text-xl">
                                Pay Only After Completion
                            </h3>
                            <p className="text-sm leading-relaxed text-[var(--fm-ink-soft)]">
                                Online checkout unlocks strictly when your technician marks the
                                job Completed and confirms the final amount—verified directly on
                                our server.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Signature Full-Width Navy CTA Bar with Round White Arrow Button */}
            <motion.div {...reveal(0.2)}>
                <Link href="/services" className="fm-navy-cta-bar group">
                    <div className="space-y-0.5">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#9CC2FF]">
                            Ready to get started?
                        </p>
                        <p className="fm-heading text-lg !text-white sm:text-xl">
                            Browse verified repair services near you
                        </p>
                    </div>

                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#0B1F3A] shadow-md transition-transform duration-200 group-hover:scale-110 group-hover:bg-[#FFB020]">
                        <ArrowRight className="h-5 w-5" />
                    </span>
                </Link>
            </motion.div>
        </section>
    );
}