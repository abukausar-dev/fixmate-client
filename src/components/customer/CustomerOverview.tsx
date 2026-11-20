"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ClipboardList,
    Clock,
    CheckCircle2,
    ArrowRight,
    Search,
    Calendar,
    CreditCard,
    Wrench,
} from "lucide-react";
import { apiAuthFetch } from "@/lib/api-client";
import type { BookingItem } from "@/types/booking";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";

export function CustomerOverview() {
    const [bookings, setBookings] = useState<BookingItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        async function loadBookings() {
            try {
                setLoading(true);
                const res = await apiAuthFetch<BookingItem[]>("/api/bookings/my");
                if (active) setBookings(res.data || []);
            } catch {
                // Handled cleanly with empty state
            } finally {
                if (active) setLoading(false);
            }
        }

        loadBookings();
        return () => {
            active = false;
        };
    }, []);

    const activeBookings = bookings.filter((b) =>
        ["requested", "accepted", "in-progress"].includes(b.status)
    );
    const readyToPay = bookings.filter(
        (b) => b.status === "completed" && b.paymentStatus === "unpaid"
    );
    const completedCount = bookings.filter((b) => b.status === "completed").length;
    const totalSpent = bookings
        .filter((b) => b.paymentStatus === "paid")
        .reduce((sum, b) => sum + Number(b.finalAmount || 0), 0);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="fm-shimmer h-32 rounded-[28px]" />
                    ))}
                </div>
                <div className="fm-shimmer h-72 rounded-[28px]" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            {/* Main Column */}
            <div className="space-y-6 xl:col-span-8">
                {/* 3 Pastel Stat Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard
                        label="Total Bookings"
                        value={bookings.length}
                        caption="All repair requests"
                        tone="sky"
                        icon={<ClipboardList className="h-6 w-6" />}
                        delay={0}
                    />
                    <StatCard
                        label="Active Repairs"
                        value={activeBookings.length}
                        caption={
                            readyToPay.length > 0
                                ? `${readyToPay.length} ready for payment`
                                : "Tracked live step-by-step"
                        }
                        tone="amber"
                        icon={<Clock className="h-6 w-6" />}
                        delay={0.06}
                    />
                    <StatCard
                        label="Completed"
                        value={completedCount}
                        caption={`$${totalSpent.toFixed(0)} paid total`}
                        tone="mint"
                        icon={<CheckCircle2 className="h-6 w-6" />}
                        delay={0.12}
                    />
                </div>

                {/* Ready-to-Pay Alert Banner (only shown if a completed job awaits payment) */}
                {readyToPay.length > 0 && (
                    <div className="fm-bento-amber flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3.5">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--fm-surface)] text-[#FFB020] shadow-sm">
                                <CreditCard className="h-5 w-5" />
                            </span>
                            <div>
                                <h3 className="fm-heading text-base">
                                    {readyToPay.length}{" "}
                                    {readyToPay.length === 1 ? "repair is" : "repairs are"} ready
                                    for payment
                                </h3>
                                <p className="text-xs text-[var(--fm-ink-soft)]">
                                    Your technician has completed the work and confirmed the final
                                    amount.
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/dashboard/customer/bookings"
                            className="fm-btn-primary shrink-0 text-xs"
                        >
                            Review &amp; Pay
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                )}

                {/* Recent Bookings Table */}
                <div className="fm-card p-5 sm:p-6">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="fm-heading text-lg sm:text-xl">
                                Recent Repair Requests
                            </h2>
                            <p className="text-xs text-[var(--fm-ink-muted)]">
                                Follow live status updates and pay only after completion
                            </p>
                        </div>

                        <Link
                            href="/dashboard/customer/bookings"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--fm-primary)] hover:underline"
                        >
                            See all
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    {bookings.length === 0 ? (
                        <EmptyState
                            variant="wrench"
                            title="No repair bookings yet"
                            description="Browse verified technicians for smartphone, laptop, AC, fridge, TV, or electrical repairs with $0 upfront payment."
                            actionLabel="Browse Services"
                            actionHref="/services"
                        />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[540px] border-separate border-spacing-y-1.5 text-left text-sm">
                                <thead>
                                    <tr className="rounded-2xl bg-[var(--fm-nav-track)] text-[11px] font-bold uppercase tracking-wider text-[var(--fm-ink-muted)]">
                                        <th className="rounded-l-2xl px-4 py-3">Service</th>
                                        <th className="px-4 py-3">Technician</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="rounded-r-2xl px-4 py-3 text-right">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.slice(0, 5).map((booking) => (
                                        <tr
                                            key={booking._id}
                                            className="rounded-2xl transition hover:bg-[var(--fm-nav-track)]/60"
                                        >
                                            <td className="rounded-l-2xl px-4 py-3.5 font-semibold text-[var(--fm-ink)]">
                                                <span className="line-clamp-1">
                                                    {booking.serviceTitle}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-xs text-[var(--fm-ink-soft)]">
                                                {booking.technicianName}
                                            </td>
                                            <td className="px-4 py-3.5 text-xs text-[var(--fm-ink-soft)]">
                                                {booking.preferredDate}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <StatusBadge status={booking.status} />
                                            </td>
                                            <td className="rounded-r-2xl px-4 py-3.5 text-right font-bold text-[var(--fm-ink)]">
                                                ${booking.finalAmount}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Rail */}
            <div className="space-y-6 xl:col-span-4">
                {/* Book New Repair Navy CTA */}
                <div className="fm-bento-navy !rounded-[28px] p-6">
                    <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-[#9CC2FF]">
                        $0 Upfront Payment
                    </span>
                    <h3 className="fm-heading mt-3 text-xl !text-white">
                        Need Something Fixed?
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                        Find an admin-approved technician for home visits or shop drop-offs
                        and track every step live.
                    </p>
                    <Link href="/services" className="fm-btn-amber mt-5 w-full">
                        <Search className="h-4 w-4" />
                        Find a Repair Service
                    </Link>
                </div>

                {/* Live Active Repairs Rail */}
                <div className="fm-card space-y-4 p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="fm-heading text-base">Active Repair Tracker</h3>
                        <span className="rounded-full bg-[var(--fm-primary-soft)] px-2.5 py-0.5 text-xs font-bold text-[var(--fm-primary-soft-text)]">
                            {activeBookings.length}
                        </span>
                    </div>

                    {activeBookings.length === 0 ? (
                        <p className="rounded-2xl bg-[var(--fm-canvas)] p-4 text-center text-xs text-[var(--fm-ink-muted)]">
                            No active repairs in progress right now.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {activeBookings.slice(0, 4).map((job) => (
                                <Link
                                    key={job._id}
                                    href="/dashboard/customer/bookings"
                                    className="block rounded-2xl border-l-4 border-[var(--fm-primary)] bg-[var(--fm-canvas)] p-4 transition hover:translate-x-1"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="line-clamp-1 text-sm font-bold text-[var(--fm-ink)]">
                                            {job.serviceTitle}
                                        </p>
                                        <StatusBadge status={job.status} />
                                    </div>
                                    <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-[var(--fm-ink-soft)]">
                                        <span className="inline-flex items-center gap-1">
                                            <Wrench className="h-3.5 w-3.5 text-[var(--fm-primary)]" />
                                            {job.technicianName}
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5 text-[#FFB020]" />
                                            {job.preferredDate}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}