import type { Metadata } from "next";
import Link from "next/link";
import {
    HelpCircle,
    ShieldCheck,
    CreditCard,
    Wrench,
    Mail,
    Phone,
    ArrowRight,
    Lock,
} from "lucide-react";
import { HelpCenterFaq } from "@/components/help/HelpCenterFaq";

export const metadata: Metadata = {
    title: "Help Center & FAQ | FixMate",
    description:
        "Answers on FixMate bookings, technician approvals, Pay-After-Service protection, and verified Stripe Checkout payments.",
};

const GUARANTEES = [
    {
        title: "Pay-After-Service Guarantee",
        description:
            "Zero upfront charges. Stripe payment unlocks only after your technician completes the repair and confirms the final amount.",
        icon: CreditCard,
        tint: "fm-bento-sky",
    },
    {
        title: "Admin-Verified Marketplace",
        description:
            "Every new and edited technician service is reviewed by an admin before going live so you only browse vetted listings.",
        icon: ShieldCheck,
        tint: "fm-bento-mint",
    },
    {
        title: "Server-Protected Pipeline",
        description:
            "Strict one-step job status updates and unique Stripe session verification keep both customers and technicians protected.",
        icon: Lock,
        tint: "fm-bento-amber",
    },
];

export default function HelpPage() {
    return (
        <div className="fm-container space-y-14 py-10 sm:py-12">
            {/* Hero Header */}
            <section className="fm-card relative overflow-hidden p-7 sm:p-10 lg:p-12">
                <div className="max-w-3xl space-y-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[var(--fm-primary-soft)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--fm-primary-soft-text)]">
                        <HelpCircle className="h-3.5 w-3.5" />
                        Help Center &amp; Policy
                    </span>
                    <h1 className="fm-heading text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                        Answers for customers, technicians &amp; safe payments.
                    </h1>
                    <p className="text-base leading-relaxed text-[var(--fm-ink-soft)]">
                        Everything you need to know about sending repair requests,
                        tracking live job stages, technician moderation, and FixMate&apos;s
                        pay-after-completion Stripe checkout.
                    </p>
                </div>
            </section>

            {/* 3 Core Protection Cards */}
            <section
                aria-label="FixMate Service Protections"
                className="grid grid-cols-1 gap-6 md:grid-cols-3"
            >
                {GUARANTEES.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={item.title}
                            className={`${item.tint} flex flex-col justify-between space-y-4 p-6`}
                        >
                            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--fm-surface)] text-[var(--fm-primary)] shadow-sm">
                                <Icon className="h-5 w-5" />
                            </span>
                            <div className="space-y-1.5">
                                <h2 className="fm-heading text-lg font-bold">
                                    {item.title}
                                </h2>
                                <p className="text-sm leading-relaxed text-[var(--fm-ink-soft)]">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Interactive Searchable FAQ */}
            <div className="space-y-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--fm-primary)]">
                        Frequently Asked Questions
                    </p>
                    <h2
                        id="faq-heading"
                        className="fm-heading mt-1 text-2xl font-extrabold sm:text-3xl"
                    >
                        Find quick answers by topic
                    </h2>
                </div>
                <HelpCenterFaq />
            </div>

            {/* Still Need Help? Navy Support CTA */}
            <section className="fm-bento-navy relative overflow-hidden p-7 sm:p-10">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-25 blur-3xl"
                    style={{
                        background:
                            "radial-gradient(circle, #2F6BFF, transparent 70%)",
                    }}
                />
                <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                    <div className="max-w-xl space-y-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#65D8C4]">
                            <Wrench className="h-3.5 w-3.5" />
                            FixMate Support Desk
                        </span>
                        <h2 className="fm-heading text-2xl font-bold !text-white">
                            Still have a question about a booking or payment?
                        </h2>
                        <p className="text-sm leading-relaxed text-slate-300">
                            Reach our support team directly or browse verified repair
                            services to get started right away.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2 text-sm text-slate-200">
                            <a
                                href="mailto:support@fixmate.com"
                                className="inline-flex items-center gap-2 transition hover:text-[#9CC2FF]"
                            >
                                <Mail className="h-4 w-4 text-[#9CC2FF]" />
                                support@fixmate.com
                            </a>
                            <a
                                href="tel:+8801700123456"
                                className="inline-flex items-center gap-2 transition hover:text-[#9CC2FF]"
                            >
                                <Phone className="h-4 w-4 text-[#2BC9A0]" />
                                +880 1700-123456
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link href="/services" className="fm-btn-primary">
                            Browse Services
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/about"
                            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                        >
                            How It Works
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}