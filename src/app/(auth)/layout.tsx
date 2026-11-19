import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ShieldCheck, CheckCircle2, Sparkles } from "lucide-react";
import { auth } from "@/lib/auth";
import { getDashboardPath } from "@/lib/role-routes";
import { FixMateLogo } from "@/components/shared/FixMateLogo";

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
        <div className="min-h-screen bg-[#F4F7F8] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
            {/* Top Bar */}
            <div className="fm-container flex items-center justify-between">
                <FixMateLogo />
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#E3F5EE] px-3.5 py-1.5 text-xs font-semibold text-[#176B72]">
                    <ShieldCheck className="h-4 w-4" />
                    Pay Only After Job Completion
                </span>
            </div>

            {/* Main Split Bento Container */}
            <div className="fm-container my-auto py-8">
                <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                    {/* Left Showcase Panel (Verve x Art Academy Bento Card) */}
                    <div className="fm-bento-navy relative hidden overflow-hidden p-10 lg:col-span-6 lg:flex lg:flex-col lg:justify-between min-h-[540px]">
                        <div className="space-y-6">
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-[#65D8C4]">
                                <Sparkles className="h-3.5 w-3.5" />
                                Smart Device & Appliance Care
                            </span>

                            <h1 className="fm-heading text-3xl font-extrabold leading-tight text-white xl:text-4xl">
                                Transparent repairs by verified technicians.
                            </h1>

                            <p className="text-sm leading-relaxed text-slate-300">
                                No upfront payment risks. Send a repair request, track live
                                status transitions from acceptance to completion, and pay
                                securely through Stripe only after the work is delivered.
                            </p>
                        </div>

                        {/* Bento Stat Pills inside Auth Panel */}
                        <div className="grid grid-cols-2 gap-4 pt-8">
                            <div className="rounded-2xl bg-[#E3F5EE] p-4 text-[#102B3F]">
                                <p className="text-xs font-semibold text-[#176B72]">
                                    Step-by-Step Pipeline
                                </p>
                                <p className="fm-heading mt-1 text-lg font-extrabold">
                                    100% Trackable
                                </p>
                            </div>
                            <div className="rounded-2xl bg-[#FEF3C7] p-4 text-[#102B3F]">
                                <p className="text-xs font-semibold text-amber-800">
                                    Stripe Protected
                                </p>
                                <p className="fm-heading mt-1 text-lg font-extrabold">
                                    Pay After Fix
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6 text-xs text-slate-300">
                            <span className="inline-flex items-center gap-1.5">
                                <CheckCircle2 className="h-4 w-4 text-[#65D8C4]" />
                                Admin-Approved Services
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <CheckCircle2 className="h-4 w-4 text-[#65D8C4]" />
                                Home Visit & Shop Drop-off
                            </span>
                        </div>
                    </div>

                    {/* Right Form Container */}
                    <div className="mx-auto w-full max-w-md lg:col-span-6">
                        {children}
                    </div>
                </div>
            </div>

            {/* Minimal Bottom Note */}
            <div className="fm-container text-center text-xs text-slate-400">
                © 2026 FixMate — Verified Device & Appliance Repair Platform
            </div>
        </div>
    );
}