import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
    ShieldCheck,
    CheckCircle2,
    Sparkles,
    Wrench,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { getDashboardPath } from "@/lib/role-routes";
import { FixMateLogo } from "@/components/shared/FixMateLogo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

const PIPELINE = [
    { step: "1", label: "Requested", active: false, done: true },
    { step: "2", label: "Accepted", active: false, done: true },
    { step: "3", label: "In Progress", active: true, done: false },
    { step: "4", label: "Completed", active: false, done: false },
];

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session?.user) {
        const role = (session.user as { role?: string }).role;
        redirect(getDashboardPath(role));
    }

    return (
        <div className="flex min-h-screen flex-col justify-between p-4 sm:p-6 lg:p-8">
            {/* Top Bar */}
            <div className="fm-container flex items-center justify-between gap-4">
                <FixMateLogo />
                <div className="flex items-center gap-3">
                    <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[var(--fm-mint-soft)] px-3.5 py-1.5 text-xs font-bold text-[var(--fm-mint-soft-text)]">
                        <ShieldCheck className="h-4 w-4" />
                        Pay Only After Job Completion
                    </span>
                    <ThemeToggle />
                </div>
            </div>

            {/* Split-Screen Aurora Container */}
            <div className="fm-container my-auto py-8">
                <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                    {/* Left Navy Panel: Aurora Glow + Glossy Orbs + Floating Glass Pipeline */}
                    <div className="fm-bento-navy relative hidden min-h-[560px] overflow-hidden p-10 lg:col-span-6 lg:flex lg:flex-col lg:justify-between">
                        {/* Ambient Orbs inside Left Panel */}
                        <div
                            aria-hidden="true"
                            className="fm-orb fm-orb-blue fm-float-slow absolute -right-14 -top-14 h-44 w-44 opacity-55"
                        />
                        <div
                            aria-hidden="true"
                            className="fm-orb fm-orb-amber fm-float-reverse absolute -bottom-12 right-12 h-28 w-28 opacity-45"
                            style={{ animationDelay: "1.2s" }}
                        />

                        <div className="relative z-10 space-y-5">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold text-[#9CC2FF]">
                                <Sparkles className="h-3.5 w-3.5 text-[#FFB020]" />
                                Smart Device &amp; Appliance Care
                            </span>

                            <h1 className="fm-heading text-3xl leading-tight !text-white xl:text-4xl">
                                Transparent repairs by verified technicians.
                            </h1>

                            <p className="max-w-md text-sm leading-relaxed text-slate-300">
                                No upfront payment risks. Send a repair request, track live
                                status transitions from acceptance to completion, and pay
                                securely through Stripe only after the work is delivered.
                            </p>
                        </div>

                        {/* Floating Glass "Live Job Pipeline" Card */}
                        <div className="fm-bob-gentle relative z-10 my-6 rounded-[24px] border border-white/20 bg-white/10 p-5 backdrop-blur-md">
                            <div className="flex items-center justify-between gap-2">
                                <span className="flex items-center gap-2 text-xs font-bold text-white">
                                    <Wrench className="h-4 w-4 text-[#9CC2FF]" />
                                    Live Job Pipeline
                                </span>
                                <span className="rounded-full bg-[#FFB020] px-2.5 py-0.5 text-[11px] font-bold text-[#0B1F3A]">
                                    Stripe Protected
                                </span>
                            </div>

                            <div className="mt-4 grid grid-cols-4 gap-2">
                                {PIPELINE.map((item) => (
                                    <div
                                        key={item.step}
                                        className={`rounded-xl px-2 py-2 text-center text-[11px] font-bold ${item.active
                                                ? "bg-[#2F6BFF] text-white shadow-md"
                                                : item.done
                                                    ? "bg-[#2BC9A0]/25 text-[#6EE7B7]"
                                                    : "bg-white/10 text-slate-300"
                                            }`}
                                    >
                                        {item.step}. {item.label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Honest Trust Checks */}
                        <div className="relative z-10 flex flex-wrap items-center gap-5 border-t border-white/15 pt-5 text-xs text-slate-300">
                            <span className="inline-flex items-center gap-1.5">
                                <CheckCircle2 className="h-4 w-4 text-[#2BC9A0]" />
                                Admin-Approved Services
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <CheckCircle2 className="h-4 w-4 text-[#2BC9A0]" />
                                Home Visit &amp; Shop Drop-off
                            </span>
                        </div>
                    </div>

                    {/* Right Form Container */}
                    <div className="fm-auth-shell mx-auto w-full max-w-md lg:col-span-6">
                        {children}
                    </div>
                </div>
            </div>

            {/* Static Copyright Footer (No new Date() in static Server Component) */}
            <div className="fm-container text-center text-xs text-[var(--fm-ink-muted)]">
                © 2026 FixMate — Verified Device &amp; Appliance Repair Platform
            </div>
        </div>
    );
}