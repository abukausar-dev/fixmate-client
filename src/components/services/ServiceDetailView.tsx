"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
    ArrowLeft,
    ArrowRight,
    Clock,
    MapPin,
    ShieldCheck,
    Wrench,
    CheckCircle2,
    Info,
    Lock,
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { apiPublicFetch, ApiClientError } from "@/lib/api-client";
import type { ServiceDetail } from "@/types/service";
import { EmptyState } from "@/components/shared/EmptyState";

export function ServiceDetailView({ serviceId }: { serviceId: string }) {
    const prefersReducedMotion = useReducedMotion();
    const { data: session, isPending: sessionLoading } = useSession();

    const [service, setService] = useState<ServiceDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFoundError, setNotFoundError] = useState(false);

    const user = session?.user as { role?: string; name?: string } | undefined;
    const userRole = user?.role;

    useEffect(() => {
        let active = true;

        async function loadDetail() {
            try {
                setLoading(true);
                setNotFoundError(false);
                const res = await apiPublicFetch<ServiceDetail>(
                    `/api/services/${encodeURIComponent(serviceId)}`
                );
                if (active) {
                    setService(res.data);
                }
            } catch (err) {
                if (active) {
                    if (err instanceof ApiClientError && err.status === 404) {
                        setNotFoundError(true);
                    } else {
                        setNotFoundError(true);
                    }
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadDetail();
        return () => {
            active = false;
        };
    }, [serviceId]);

    if (loading) {
        return (
            <div className="fm-container space-y-6 py-10">
                <div className="fm-shimmer h-9 w-36 rounded-full" />
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="space-y-6 lg:col-span-7">
                        <div className="fm-shimmer aspect-[16/10] w-full rounded-[32px]" />
                        <div className="fm-card space-y-3 p-6">
                            <div className="fm-shimmer h-6 w-1/3 rounded-xl" />
                            <div className="fm-shimmer h-4 w-full rounded-lg" />
                            <div className="fm-shimmer h-4 w-5/6 rounded-lg" />
                        </div>
                    </div>
                    <div className="space-y-6 lg:col-span-5">
                        <div className="fm-card space-y-4 p-7">
                            <div className="fm-shimmer h-8 w-3/4 rounded-xl" />
                            <div className="fm-shimmer h-12 w-1/2 rounded-full" />
                            <div className="fm-shimmer h-14 w-full rounded-3xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (notFoundError || !service) {
        return (
            <div className="fm-container py-16">
                <EmptyState
                    variant="wrench"
                    title="Service not found or unavailable"
                    description="This repair service may have been paused, removed, or is awaiting admin approval."
                    actionLabel="Browse Available Services"
                    actionHref="/services"
                />
            </div>
        );
    }

    const techInitials = (service.technician.name || "T")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="fm-container space-y-6 py-10 sm:py-12">
            {/* Back Navigation Pill */}
            <div>
                <Link
                    href="/services"
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--fm-surface-border)] bg-[var(--fm-surface)] px-4 py-2 text-xs font-bold text-[var(--fm-ink)] shadow-sm transition hover:border-[var(--fm-primary)]/40 hover:text-[var(--fm-primary)]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Services
                </Link>
            </div>

            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                {/* Left Column: Image + Description + Protection Highlights */}
                <motion.div
                    initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-6 lg:col-span-7"
                >
                    {/* Pastel-Framed Hero Image */}
                    <div className="fm-card overflow-hidden p-3 sm:p-4">
                        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[22px] bg-[var(--fm-primary-soft)]">
                            <Image
                                src={service.image}
                                alt={service.title}
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 58vw"
                                className="object-cover"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/60 via-transparent to-transparent" />

                            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                                <span className="fm-glass-float rounded-full px-3.5 py-1 text-xs font-bold text-[var(--fm-ink)]">
                                    {service.category}
                                </span>
                                <span className="rounded-full bg-[#0B1F3A]/90 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
                                    {service.serviceMode}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Description Card */}
                    <div className="fm-card space-y-4 p-6 sm:p-8">
                        <h2 className="fm-heading text-xl sm:text-2xl">
                            About This Repair Service
                        </h2>
                        <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--fm-ink-soft)] sm:text-base">
                            {service.description}
                        </p>

                        {/* Quick Service Specs */}
                        <div className="grid grid-cols-1 gap-3 pt-3 sm:grid-cols-2">
                            <div className="fm-bento-sky flex items-center gap-3.5 p-4">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--fm-surface)] text-[var(--fm-primary)] shadow-sm">
                                    <Clock className="h-5 w-5" />
                                </span>
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--fm-ink-muted)]">
                                        Estimated Duration
                                    </p>
                                    <p className="text-sm font-bold text-[var(--fm-ink)]">
                                        {service.estimatedDuration}
                                    </p>
                                </div>
                            </div>

                            <div className="fm-bento-mint flex items-center gap-3.5 p-4">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--fm-surface)] text-[#2BC9A0] shadow-sm">
                                    <Wrench className="h-5 w-5" />
                                </span>
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--fm-ink-muted)]">
                                        Service Mode
                                    </p>
                                    <p className="text-sm font-bold text-[var(--fm-ink)]">
                                        {service.serviceMode}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pay-After-Completion Guarantee Banner */}
                    <div className="fm-bento-amber flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--fm-surface)] text-[#FFB020] shadow-sm">
                            <ShieldCheck className="h-6 w-6" />
                        </span>
                        <div className="space-y-1">
                            <h3 className="fm-heading text-base">
                                Protected Pay-After-Completion Policy
                            </h3>
                            <p className="text-xs leading-relaxed text-[var(--fm-ink-soft)] sm:text-sm">
                                You pay $0 today. Submit your repair request, track status
                                updates live, and pay via Stripe Checkout only after your
                                technician completes the job and confirms the final amount.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: Sticky Booking Summary + Technician Card */}
                <motion.div
                    initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
                    className="space-y-6 lg:sticky lg:top-24 lg:col-span-5"
                >
                    {/* Booking Action Glass Card */}
                    <div className="fm-glass-float space-y-6 rounded-[32px] p-6 sm:p-8">
                        <div className="space-y-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--fm-mint-soft)] px-3 py-1 text-xs font-bold text-[var(--fm-mint-soft-text)]">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Available &amp; Admin Approved
                            </span>
                            <h1 className="fm-heading text-2xl leading-tight sm:text-3xl">
                                {service.title}
                            </h1>
                        </div>

                        {/* Price Chip Row */}
                        <div className="flex items-center justify-between rounded-2xl border border-[var(--fm-surface-border)] bg-[var(--fm-canvas)] px-5 py-4">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-[var(--fm-ink-muted)]">
                                    Starting Base Price
                                </p>
                                <p className="text-xs text-[var(--fm-ink-soft)]">
                                    Final bill confirmed upon completion
                                </p>
                            </div>
                            <span className="rounded-full bg-[var(--fm-amber-soft)] px-4 py-2 text-lg font-extrabold text-[var(--fm-amber-soft-text)]">
                                ${service.basePrice}
                            </span>
                        </div>

                        {/* Role-Restricted Request Repair CTA */}
                        {sessionLoading ? (
                            <div className="fm-shimmer h-14 w-full rounded-3xl" />
                        ) : !user ? (
                            <div className="space-y-3">
                                <Link
                                    href={`/sign-in?callbackUrl=${encodeURIComponent(`/services/${service._id}`)}`}
                                    className="fm-navy-cta-bar group"
                                >
                                    <div className="text-left">
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#9CC2FF]">
                                            Customer Account Required
                                        </p>
                                        <p className="fm-heading text-base !text-white">
                                            Sign In to Request Repair
                                        </p>
                                    </div>
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#0B1F3A] transition-transform group-hover:scale-110 group-hover:bg-[#FFB020]">
                                        <Lock className="h-4 w-4" />
                                    </span>
                                </Link>
                            </div>
                        ) : userRole === "customer" ? (
                            <button
                                type="button"
                                onClick={() =>
                                    toast.info(
                                        "Request Repair booking form will be connected in Milestone 5!"
                                    )
                                }
                                className="fm-navy-cta-bar group cursor-pointer text-left"
                            >
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#9CC2FF]">
                                        $0 Upfront Charge
                                    </p>
                                    <p className="fm-heading text-base !text-white sm:text-lg">
                                        Request Repair Now
                                    </p>
                                </div>
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#0B1F3A] transition-transform group-hover:scale-110 group-hover:bg-[#FFB020]">
                                    <ArrowRight className="h-5 w-5" />
                                </span>
                            </button>
                        ) : (
                            <div className="flex items-start gap-3 rounded-2xl border border-[var(--fm-surface-border)] bg-[var(--fm-primary-soft)] p-4 text-sm text-[var(--fm-primary-soft-text)]">
                                <Info className="mt-0.5 h-5 w-5 shrink-0" />
                                <p className="text-xs font-semibold leading-relaxed sm:text-sm">
                                    You are signed in as{" "}
                                    <span className="capitalize underline">{userRole}</span>.
                                    Repair bookings can only be placed using a Customer account.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Technician Profile Card */}
                    <div className="fm-card space-y-4 p-6">
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--fm-ink-muted)]">
                            Assigned Technician
                        </p>

                        <div className="flex items-center gap-3.5">
                            {service.technician.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={service.technician.image}
                                    alt={service.technician.name}
                                    className="h-14 w-14 rounded-2xl object-cover ring-2 ring-[var(--fm-primary)]/20"
                                />
                            ) : (
                                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--fm-primary-soft)] text-lg font-extrabold text-[var(--fm-primary-soft-text)]">
                                    {techInitials}
                                </span>
                            )}

                            <div className="min-w-0">
                                <h3 className="fm-heading truncate text-lg">
                                    {service.technician.name}
                                </h3>
                                <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-[var(--fm-ink-soft)]">
                                    <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--fm-primary)]" />
                                    <span>{service.technician.area}</span>
                                </p>
                            </div>
                        </div>

                        <p className="text-xs leading-relaxed text-[var(--fm-ink-soft)] sm:text-sm">
                            {service.technician.bio}
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}