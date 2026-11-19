"use client";

import { motion, useReducedMotion } from "motion/react";
import { Search, Send, Wrench, CreditCard } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";

const STEPS = [
    {
        number: "01",
        title: "Find a Service",
        description:
            "Compare admin-approved listings, service modes, and clear starting prices across 7 categories.",
        icon: Search,
        accent: "bg-[#2F6BFF] text-white",
    },
    {
        number: "02",
        title: "Send a Request",
        description:
            "Describe the issue, choose a preferred date, and submit your booking with zero upfront charge.",
        icon: Send,
        accent: "bg-[#FFB020] text-[#0B1F3A]",
    },
    {
        number: "03",
        title: "Technician Fixes It",
        description:
            "Track live server-enforced job updates from Accepted to In Progress and Completed.",
        icon: Wrench,
        accent: "bg-[#2BC9A0] text-[#0B1F3A]",
    },
    {
        number: "04",
        title: "Pay After Completion",
        description:
            "Pay securely via Stripe Checkout only after your technician completes the repair and sets the final bill.",
        icon: CreditCard,
        accent: "bg-white text-[#0B1F3A]",
    },
];

export function HowItWorksSection() {
    const prefersReducedMotion = useReducedMotion();

    return (
        <section className="fm-container py-6">
            <div className="fm-bento-navy relative overflow-hidden p-8 sm:p-12 lg:p-14">
                {/* Subtle decorative orb glows */}
                <div
                    aria-hidden="true"
                    className="fm-orb fm-orb-blue fm-float-slow hidden md:block absolute -right-14 -top-14 h-44 w-44 opacity-40"
                />
                <div
                    aria-hidden="true"
                    className="fm-orb fm-orb-amber fm-float-reverse hidden lg:block absolute -bottom-16 left-10 h-32 w-32 opacity-30"
                />

                <div className="relative z-10 space-y-10">
                    <SectionHeading
                        eyebrow="4-Stage Protected Flow"
                        title="How FixMate works from request to payment"
                        subtitle="Every job follows a strict status pipeline so customers never risk upfront payments."
                        actionLabel="Read Full Process"
                        actionHref="/about"
                        
                        tone="dark"
                    />

                    <div className="relative">
                        {/* Scroll-drawn dashed connector line on desktop */}
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 1000 12"
                            fill="none"
                            preserveAspectRatio="none"
                            className="pointer-events-none absolute left-[12%] right-[12%] top-11 hidden h-3 w-[76%] lg:block"
                        >
                            <motion.path
                                d="M0 6 H1000"
                                stroke="rgba(156, 194, 255, 0.45)"
                                strokeWidth="2"
                                strokeDasharray="8 8"
                                initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
                                whileInView={{ pathLength: 1 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ duration: 1.1, ease: "easeOut" }}
                            />
                        </svg>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {STEPS.map((step, index) => {
                                const Icon = step.icon;
                                return (
                                    <motion.div
                                        key={step.number}
                                        initial={
                                            prefersReducedMotion
                                                ? { opacity: 0 }
                                                : { opacity: 0, y: 24 }
                                        }
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.2 }}
                                        transition={{
                                            duration: 0.45,
                                            delay: index * 0.08,
                                            ease: "easeOut",
                                        }}
                                        className="relative flex flex-col justify-between rounded-[28px] border border-white/15 bg-white/[0.06] p-6 backdrop-blur-md"
                                        style={{
                                            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.28)",
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span
                                                className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full font-extrabold shadow-md ${step.accent}`}
                                            >
                                                <Icon className="h-5 w-5" />
                                            </span>
                                            <span className="font-mono text-xs font-bold tracking-widest text-[#9CC2FF]">
                                                STEP {step.number}
                                            </span>
                                        </div>

                                        <div className="mt-6 space-y-2">
                                            <h3 className="fm-heading text-lg !text-white">
                                                {step.title}
                                            </h3>
                                            <p className="text-sm leading-relaxed text-slate-300">
                                                {step.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}