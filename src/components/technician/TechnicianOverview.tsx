"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Wrench,
    Clock,
    CheckCircle2,
    ArrowRight,
    Plus,
    Calendar,
    MapPin,
} from "lucide-react";
import { apiAuthFetch } from "@/lib/api-client";
import type { ServiceItem } from "@/types/service";
import type { BookingItem } from "@/types/booking";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";

export function TechnicianOverview() {
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [bookings, setBookings] = useState<BookingItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        async function loadDashboard() {
            try {
                setLoading(true);
                const [servicesRes, bookingsRes] = await Promise.all([
                    apiAuthFetch<ServiceItem[]>("/api/services/my"),
                    apiAuthFetch<BookingItem[]>("/api/bookings/technician"),
                ]);

                if (active) {
                    setServices(servicesRes.data || []);
                    setBookings(bookingsRes.data || []);
                }
            } catch {
                // Handled gracefully with empty fallback
            } finally {
                if (active) setLoading(false);
            }
        }

        loadDashboard();
        return () => {
            active = false;
        };
    }, []);

    const approvedServices = services.filter(
        (s) => s.approvalStatus === "approved"
    ).length;
    const activeJobs = bookings.filter((b) =>
        ["requested", "accepted", "in-progress"].includes(b.status)
    );
    const completedJobs = bookings.filter((b) => b.status === "completed");
    const totalEarned = completedJobs
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
            {/* Main Content Area */}
            <div className="space-y-6 xl:col-span-8">
                {/* 3 Pastel Stat Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard
                        label="My Services"
                        value={services.length}
                        caption={`${approvedServices} approved & live`}
                        tone="sky"
                        icon={<Wrench className="h-6 w-6" />}
                        delay={0}
                    />
                    <StatCard
                        label="Active Jobs"
                        value={activeJobs.length}
                        caption="Requested to In Progress"
                        tone="amber"
                        icon={<Clock className="h-6 w-6" />}
                        delay={0.06}
                    />
                    <StatCard
                        label="Completed"
                        value={completedJobs.length}
                        caption={`$${totalEarned.toFixed(0)} paid out`}
                        tone="mint"
                        icon={<CheckCircle2 className="h-6 w-6" />}
                        delay={0.12}
                    />
                </div>

                {/* Recent Assigned Jobs Table Card */}
                <div className="fm-card p-5 sm:p-6">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="fm-heading text-lg sm:text-xl">
                                Recent Assigned Bookings
                            </h2>
                            <p className="text-xs text-[var(--fm-ink-muted)]">
                                Accept incoming requests and move jobs step-by-step
                            </p>
                        </div>

                        <Link
                            href="/dashboard/technician/bookings"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--fm-primary)] hover:underline"
                        >
                            See all
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    {bookings.length === 0 ? (
                        <EmptyState
                            variant="box"
                            title="No bookings assigned yet"
                            description="Publish and get your repair services approved so customers can book your expertise."
                            actionLabel="Manage My Services"
                            actionHref="/dashboard/technician/services"
                        />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[540px] border-separate border-spacing-y-1.5 text-left text-sm">
                                <thead>
                                    <tr className="rounded-2xl bg-[var(--fm-nav-track)] text-[11px] font-bold uppercase tracking-wider text-[var(--fm-ink-muted)]">
                                        <th className="rounded-l-2xl px-4 py-3">Service</th>
                                        <th className="px-4 py-3">Customer</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="rounded-r-2xl px-4 py-3 text-right">Amount</th>
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
                                                {booking.customerName}
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

            {/* Right Rail (Art Academy inspired Quick Action + Upcoming Jobs) */}
            <div className="space-y-6 xl:col-span-4">
                {/* Quick Add Service CTA */}
                <div className="fm-bento-navy !rounded-[28px] p-6">
                    <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-[#9CC2FF]">
                        Grow Your Listings
                    </span>
                    <h3 className="fm-heading mt-3 text-xl !text-white">
                        Add a New Repair Service
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                        Upload a real service photo, set your starting price, and submit for
                        admin approval.
                    </p>
                    <Link
                        href="/dashboard/technician/services"
                        className="fm-btn-amber mt-5 w-full"
                    >
                        <Plus className="h-4 w-4" />
                        Create / Manage Services
                    </Link>
                </div>

                {/* Upcoming Jobs Schedule Rail */}
                <div className="fm-card space-y-4 p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="fm-heading text-base">Upcoming Active Jobs</h3>
                        <span className="rounded-full bg-[var(--fm-primary-soft)] px-2.5 py-0.5 text-xs font-bold text-[var(--fm-primary-soft-text)]">
                            {activeJobs.length}
                        </span>
                    </div>

                    {activeJobs.length === 0 ? (
                        <p className="rounded-2xl bg-[var(--fm-canvas)] p-4 text-center text-xs text-[var(--fm-ink-muted)]">
                            No active repair jobs scheduled right now.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {activeJobs.slice(0, 4).map((job) => (
                                <Link
                                    key={job._id}
                                    href="/dashboard/technician/bookings"
                                    className="block rounded-2xl border-l-4 border-[var(--fm-active-pill)] bg-[var(--fm-canvas)] p-4 transition hover:translate-x-1"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="line-clamp-1 text-sm font-bold text-[var(--fm-ink)]">
                                            {job.serviceTitle}
                                        </p>
                                        <StatusBadge status={job.status} />
                                    </div>
                                    <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-[var(--fm-ink-soft)]">
                                        <span className="inline-flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5 text-[var(--fm-primary)]" />
                                            {job.preferredDate}
                                        </span>
                                        <span className="inline-flex items-center gap-1 truncate">
                                            <MapPin className="h-3.5 w-3.5 text-[#FFB020]" />
                                            {job.serviceMode}
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