import Link from "next/link";
import {
    Search,
    Send,
    Wrench,
    CreditCard,
    ShieldCheck,
    Clock,
    CheckCircle2,
    ArrowRight,
} from "lucide-react";

const STEPS = [
    {
        step: "01",
        title: "Find a Verified Service",
        description:
            "Browse admin-approved repair services across 7 categories with transparent starting prices and service modes.",
        icon: Search,
        tint: "fm-bento-sky",
    },
    {
        step: "02",
        title: "Send a Repair Request",
        description:
            "Describe the issue, choose your preferred date, and request either a Home Visit or Shop Drop-off.",
        icon: Send,
        tint: "fm-bento-mint",
    },
    {
        step: "03",
        title: "Technician Fixes Your Device",
        description:
            "Track live progress as your technician moves the job from Accepted to In Progress and Completed.",
        icon: Wrench,
        tint: "fm-bento-amber",
    },
    {
        step: "04",
        title: "Pay Online After Completion",
        description:
            "Once the job is marked Completed with the final amount, pay securely via Stripe Checkout.",
        icon: CreditCard,
        tint: "fm-card",
    },
];

export default function AboutPage() {
    return (
        <div className="fm-container py-12 space-y-16">
            {/* Hero Banner */}
            <section className="fm-card p-8 sm:p-12 lg:p-14">
                <div className="max-w-3xl space-y-5">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[var(--fm-primary-soft)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--fm-primary-soft-text)]">
                        How FixMate Works
                    </span>
                    <h1 className="fm-heading text-3xl font-extrabold sm:text-5xl leading-tight">
                        Device & appliance repairs with zero upfront payment risk.
                    </h1>
                    <p className="text-base leading-relaxed text-[var(--fm-ink-soft)]">
                        In Bangladesh and worldwide, customers often hand over expensive
                        devices without knowing what is happening or paying before any work
                        is done. FixMate brings verified technicians, real-time job state
                        tracking, and post-completion Stripe payments under one platform.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                        <Link href="/services" className="fm-btn-primary">
                            Explore Repair Services
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/sign-up"
                            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-[var(--fm-surface)] px-6 py-2.5 text-sm font-semibold text-[#102B3F] hover:bg-slate-50"
                        >
                            Join as a Technician
                        </Link>
                    </div>
                </div>
            </section>

            {/* 4-Step Pipeline Grid */}
            <section className="space-y-6">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--fm-primary)]">
                            4-Stage Workflow
                        </p>
                        <h2 className="fm-heading mt-1 text-2xl font-extrabold sm:text-3xl">
                            From broken device to verified fix
                        </h2>
                    </div>
                    <p className="text-sm text-[var(--fm-ink-soft)]">
                        Every status transition is server-enforced for complete safety.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {STEPS.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.step}
                                className={`${item.tint} flex flex-col justify-between p-6 space-y-6`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--fm-surface)] text-[var(--fm-primary)] shadow-sm">
                                        <Icon className="h-6 w-6" />
                                    </span>
                                    <span className="fm-heading text-2xl font-extrabold opacity-40">
                                        {item.step}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="fm-heading text-lg font-bold">{item.title}</h3>
                                    <p className="text-sm leading-relaxed text-[var(--fm-ink-soft)]">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Trust Pillars */}
            <section className="fm-bento-navy p-8 sm:p-12">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
                    <div className="flex flex-col items-center text-center">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--fm-surface)]/10 text-[#65D8C4]">
                            <ShieldCheck className="h-6 w-6" />
                        </span>
                        <h3 className="fm-heading mt-4 text-lg !text-white">
                            Admin-Moderated Listings
                        </h3>
                        <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-300">
                            Every service created or edited by a technician is reviewed by an
                            admin before appearing publicly.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--fm-surface)]/10 text-[#FFB020]">
                            <Clock className="h-6 w-6" />
                        </span>
                        <h3 className="fm-heading mt-4 text-lg !text-white">
                            Strict Status Pipeline
                        </h3>
                        <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-300">
                            Jobs move forward one step at a time: Requested → Accepted → In
                            Progress → Completed → Paid.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--fm-surface)]/10 text-[#65D8C4]">
                            <CheckCircle2 className="h-6 w-6" />
                        </span>
                        <h3 className="fm-heading mt-4 text-lg !text-white">
                            Post-Completion Stripe Checkout
                        </h3>
                        <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-300">
                            The Pay Now button unlocks only when your technician completes the
                            repair and sets the final amount.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}