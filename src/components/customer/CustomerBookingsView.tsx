"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
    Calendar,
    MapPin,
    Wrench,
    XCircle,
    CreditCard,
    CheckCircle2,
    FileText,
    ExternalLink,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { apiAuthFetch } from "@/lib/api-client";
import type { BookingItem, BookingStatus } from "@/types/booking";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";

type FilterTab = "all" | "active" | "completed" | "closed";

const PIPELINE_STEPS: { key: BookingStatus; label: string }[] = [
    { key: "requested", label: "1. Requested" },
    { key: "accepted", label: "2. Accepted" },
    { key: "in-progress", label: "3. In Progress" },
    { key: "completed", label: "4. Completed" },
];

function getStepIndex(status: BookingStatus): number {
    const index = PIPELINE_STEPS.findIndex((s) => s.key === status);
    return index;
}

export function CustomerBookingsView() {
    const prefersReducedMotion = useReducedMotion();
    const [bookings, setBookings] = useState<BookingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<FilterTab>("all");

    const [cancelTarget, setCancelTarget] = useState<BookingItem | null>(null);
    const [cancelling, setCancelling] = useState(false);
    const [payingId, setPayingId] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        async function loadBookings() {
            try {
                setLoading(true);
                const res = await apiAuthFetch<BookingItem[]>("/api/bookings/my");
                if (active) setBookings(res.data || []);
            } catch (err) {
                toast.error(
                    err instanceof Error ? err.message : "Failed to load your bookings"
                );
            } finally {
                if (active) setLoading(false);
            }
        }

        loadBookings();
        return () => {
            active = false;
        };
    }, []);

    // Show a gentle notice if the customer backed out of Stripe Checkout
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("payment") === "cancelled") {
            toast.info("Payment was cancelled. You can try again anytime.");
            window.history.replaceState({}, "", window.location.pathname);
        }
    }, []);

    const handlePayNow = async (bookingId: string) => {
        try {
            setPayingId(bookingId);
            const res = await apiAuthFetch<{ sessionId: string; url: string }>(
                "/api/payments/create-checkout-session",
                {
                    method: "POST",
                    body: JSON.stringify({ bookingId }),
                }
            );

            if (!res.data?.url) {
                throw new Error("Could not launch Stripe Checkout");
            }

            // Redirect browser to Stripe's hosted secure payment page
            window.location.assign(res.data.url);
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Failed to start payment"
            );
            setPayingId(null);
        }
    };

    const handleConfirmCancel = async () => {
        if (!cancelTarget) return;

        try {
            setCancelling(true);
            const res = await apiAuthFetch<BookingItem>(
                `/api/bookings/${cancelTarget._id}/cancel`,
                { method: "PATCH" }
            );
            setBookings((prev) =>
                prev.map((item) => (item._id === res.data._id ? res.data : item))
            );
            toast.success("Booking request cancelled");
            setCancelTarget(null);
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Could not cancel booking"
            );
        } finally {
            setCancelling(false);
        }
    };

    const filteredBookings = bookings.filter((b) => {
        if (tab === "active") {
            return ["requested", "accepted", "in-progress"].includes(b.status);
        }
        if (tab === "completed") return b.status === "completed";
        if (tab === "closed") return ["rejected", "cancelled"].includes(b.status);
        return true;
    });

    return (
        <div className="space-y-6">
            {/* Header + Filter Pills */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="fm-heading text-2xl">My Repair Bookings</h2>
                    <p className="text-sm text-[var(--fm-ink-soft)]">
                        Track live repair progress, cancel pending requests, or pay once
                        completed.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {(
                        [
                            { id: "all", label: "All" },
                            { id: "active", label: "Active" },
                            { id: "completed", label: "Completed" },
                            { id: "closed", label: "Closed" },
                        ] as const
                    ).map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setTab(item.id)}
                            className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${tab === item.id
                                    ? "bg-[var(--fm-active-pill)] text-white shadow-sm"
                                    : "border border-[var(--fm-surface-border)] bg-[var(--fm-surface)] text-[var(--fm-ink-soft)] hover:text-[var(--fm-ink)]"
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bookings List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="fm-shimmer h-52 rounded-[28px]" />
                    ))}
                </div>
            ) : filteredBookings.length === 0 ? (
                <EmptyState
                    variant="wrench"
                    title={
                        tab === "all"
                            ? "You have no repair bookings yet"
                            : `No ${tab} bookings found`
                    }
                    description={
                        tab === "all"
                            ? "Find a verified technician and submit your first repair request with $0 upfront payment."
                            : "Switch tabs to view your other repair requests."
                    }
                    actionLabel={tab === "all" ? "Browse Services" : "Show All Bookings"}
                    actionHref={tab === "all" ? "/services" : undefined}
                    onAction={tab !== "all" ? () => setTab("all") : undefined}
                />
            ) : (
                <div className="space-y-5">
                    {filteredBookings.map((booking, idx) => {
                        const currentStep = getStepIndex(booking.status);
                        const isClosed =
                            booking.status === "cancelled" || booking.status === "rejected";

                        return (
                            <motion.div
                                key={booking._id}
                                initial={
                                    prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 14 }
                                }
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.2) }}
                                className="fm-card space-y-5 p-5 sm:p-6"
                            >
                                {/* Top Row: Thumbnail + Details + Actions */}
                                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                                        {/* Service Thumbnail */}
                                        <div className="h-24 w-full shrink-0 overflow-hidden rounded-2xl border border-[var(--fm-surface-border)] bg-[var(--fm-primary-soft)] sm:h-24 sm:w-32">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={booking.serviceImage}
                                                alt={booking.serviceTitle}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        <div className="min-w-0 space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <StatusBadge status={booking.status} />
                                                <StatusBadge status={booking.paymentStatus} />
                                                <span className="rounded-full bg-[var(--fm-amber-soft)] px-3 py-0.5 text-xs font-extrabold text-[var(--fm-amber-soft-text)]">
                                                    ${booking.finalAmount}
                                                </span>
                                            </div>

                                            <h3 className="fm-heading text-lg leading-snug">
                                                {booking.serviceTitle}
                                            </h3>

                                            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[var(--fm-ink-muted)]">
                                                <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--fm-ink)]">
                                                    <Wrench className="h-3.5 w-3.5 text-[var(--fm-primary)]" />
                                                    {booking.technicianName}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5">
                                                    <Calendar className="h-3.5 w-3.5 text-[#FFB020]" />
                                                    {booking.preferredDate}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5">
                                                    <MapPin className="h-3.5 w-3.5 text-[#2BC9A0]" />
                                                    {booking.serviceMode} • {booking.address}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Action Controls */}
                                    <div className="flex shrink-0 flex-wrap items-center gap-2.5 border-t border-[var(--fm-divider)] pt-4 lg:border-t-0 lg:pt-0">
                                        {booking.status === "requested" && (
                                            <button
                                                type="button"
                                                onClick={() => setCancelTarget(booking)}
                                                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-4 text-xs font-bold text-red-500 transition hover:bg-red-500 hover:text-white"
                                            >
                                                <XCircle className="h-4 w-4" />
                                                Cancel Request
                                            </button>
                                        )}

                                        {booking.status === "completed" &&
                                            booking.paymentStatus === "unpaid" && (
                                                <button
                                                    type="button"
                                                    disabled={payingId === booking._id}
                                                    onClick={() => handlePayNow(booking._id)}
                                                    className="fm-btn-amber h-10 px-5 text-xs disabled:opacity-60"
                                                >
                                                    {payingId === booking._id ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                            Redirecting...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CreditCard className="h-4 w-4" />
                                                            Pay Now (${booking.finalAmount})
                                                        </>
                                                    )}
                                                </button>
                                            )}

                                        {booking.status === "completed" &&
                                            booking.paymentStatus === "paid" && (
                                                <Link
                                                    href="/dashboard/customer/payments"
                                                    className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[var(--fm-mint-soft)] px-4 text-xs font-bold text-[var(--fm-mint-soft-text)] transition hover:opacity-90"
                                                >
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    Paid • View Receipt
                                                </Link>
                                            )}

                                        <Link
                                            href={`/services/${booking.serviceId}`}
                                            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[var(--fm-surface-border)] bg-[var(--fm-surface)] px-4 text-xs font-bold text-[var(--fm-ink)] transition hover:border-[var(--fm-primary)]/40 hover:text-[var(--fm-primary)]"
                                        >
                                            Service
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Live 4-Stage Visual Pipeline (only for active/completed jobs) */}
                                {!isClosed && (
                                    <div className="rounded-2xl bg-[var(--fm-canvas)] p-3.5 sm:p-4">
                                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                            {PIPELINE_STEPS.map((step, index) => {
                                                const isDone =
                                                    currentStep > index || booking.status === "completed";
                                                const isCurrent =
                                                    currentStep === index &&
                                                    booking.status !== "completed";

                                                return (
                                                    <div
                                                        key={step.key}
                                                        className={`flex items-center justify-center gap-1.5 rounded-xl px-2.5 py-2 text-center text-[11px] font-bold transition-all ${isCurrent
                                                                ? "bg-[var(--fm-primary)] text-white shadow-sm"
                                                                : isDone
                                                                    ? "bg-[var(--fm-mint-soft)] text-[var(--fm-mint-soft-text)]"
                                                                    : "bg-[var(--fm-surface)] text-[var(--fm-ink-muted)]"
                                                            }`}
                                                    >
                                                        {isCurrent && (
                                                            <span className="relative flex h-2 w-2 shrink-0">
                                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                                                                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                                                            </span>
                                                        )}
                                                        {isDone && (
                                                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                                                        )}
                                                        <span>{step.label}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Problem & Optional Technician Completion Note */}
                                <div className="grid grid-cols-1 gap-3 border-t border-[var(--fm-divider)] pt-4 md:grid-cols-2">
                                    <div className="rounded-2xl bg-[var(--fm-canvas)] p-3.5">
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--fm-ink-muted)]">
                                            Reported Issue
                                        </p>
                                        <p className="mt-1 text-xs leading-relaxed text-[var(--fm-ink-soft)]">
                                            {booking.problemDescription}
                                        </p>
                                    </div>

                                    {booking.technicianNote && (
                                        <div className="rounded-2xl bg-[var(--fm-mint-soft)]/50 p-3.5">
                                            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--fm-mint-soft-text)]">
                                                <FileText className="h-3.5 w-3.5" />
                                                Technician Summary Note
                                            </p>
                                            <p className="mt-1 text-xs leading-relaxed text-[var(--fm-ink)]">
                                                {booking.technicianNote}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Cancel Booking Confirm Dialog */}
            <ConfirmDialog
                isOpen={Boolean(cancelTarget)}
                onClose={() => setCancelTarget(null)}
                onConfirm={handleConfirmCancel}
                title="Cancel this repair request?"
                description={`You can only cancel while the request is still pending acceptance. Cancelling "${cancelTarget?.serviceTitle || ""}" will free you to book another technician.`}
                confirmLabel="Yes, Cancel Request"
                loading={cancelling}
            />
        </div>
    );
}