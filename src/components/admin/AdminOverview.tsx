"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ShieldAlert,
    Users,
    ClipboardList,
    DollarSign,
    ArrowRight,
    ShieldCheck,
    Wrench,
    UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { apiAuthFetch } from "@/lib/api-client";
import type { ServiceItem } from "@/types/service";
import type { BookingItem } from "@/types/booking";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";

interface AdminStatsData {
    users: {
        total: number;
        customers: number;
        technicians: number;
        admins: number;
    };
    services: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
    };
    bookings: {
        total: number;
        active: number;
        completed: number;
        paidCount: number;
        totalRevenue: number;
    };
    recentPendingServices: ServiceItem[];
    recentBookings: BookingItem[];
}

export function AdminOverview() {
    const [stats, setStats] = useState<AdminStatsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        async function loadStats() {
            try {
                setLoading(true);
                const res = await apiAuthFetch<AdminStatsData>("/api/admin/stats");
                if (active) setStats(res.data);
            } catch (err) {
                toast.error(
                    err instanceof Error ? err.message : "Failed to load admin overview"
                );
            } finally {
                if (active) setLoading(false);
            }
        }

        loadStats();
        return () => {
            active = false;
        };
    }, []);

    if (loading || !stats) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="fm-shimmer h-32 rounded-[28px]" />
                    ))}
                </div>
                <div className="fm-shimmer h-72 rounded-[28px]" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 4 Top Platform KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Pending Services"
                    value={stats.services.pending}
                    caption={`${stats.services.approved} approved • ${stats.services.total} total`}
                    tone="amber"
                    icon={<ShieldAlert className="h-6 w-6" />}
                    delay={0}
                />
                <StatCard
                    label="Total Users"
                    value={stats.users.total}
                    caption={`${stats.users.customers} customers • ${stats.users.technicians} techs`}
                    tone="sky"
                    icon={<Users className="h-6 w-6" />}
                    delay={0.05}
                />
                <StatCard
                    label="Total Bookings"
                    value={stats.bookings.total}
                    caption={`${stats.bookings.active} active • ${stats.bookings.completed} completed`}
                    tone="sky"
                    icon={<ClipboardList className="h-6 w-6" />}
                    delay={0.1}
                />
                <StatCard
                    label="Paid Revenue"
                    value={`$${stats.bookings.totalRevenue.toFixed(0)}`}
                    caption={`${stats.bookings.paidCount} paid checkouts`}
                    tone="mint"
                    icon={<DollarSign className="h-6 w-6" />}
                    delay={0.15}
                />
            </div>

            {/* Main Content + Right Rail */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                {/* Left Main Column */}
                <div className="space-y-6 xl:col-span-8">
                    {/* Pending Moderation Queue Preview */}
                    <div className="fm-card p-5 sm:p-6">
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="fm-heading text-lg sm:text-xl">
                                    Pending Service Approvals
                                </h2>
                                <p className="text-xs text-[var(--fm-ink-muted)]">
                                    Listings waiting for your review before going live publicly
                                </p>
                            </div>
                            <Link
                                href="/dashboard/admin/services"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--fm-primary)] hover:underline"
                            >
                                Review queue
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>

                        {stats.recentPendingServices.length === 0 ? (
                            <EmptyState
                                variant="box"
                                title="Moderation queue is clear!"
                                description="All submitted technician services have been reviewed."
                                actionLabel="View All Services"
                                actionHref="/dashboard/admin/services"
                            />
                        ) : (
                            <div className="space-y-3">
                                {stats.recentPendingServices.map((service) => (
                                    <Link
                                        key={service._id}
                                        href="/dashboard/admin/services"
                                        className="flex flex-col gap-3 rounded-2xl border border-[var(--fm-surface-border)] bg-[var(--fm-canvas)] p-3.5 transition hover:border-[var(--fm-primary)]/40 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="flex min-w-0 items-center gap-3.5">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={service.image}
                                                alt={service.title}
                                                className="h-14 w-16 shrink-0 rounded-xl object-cover"
                                            />
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-bold text-[var(--fm-ink)]">
                                                    {service.title}
                                                </p>
                                                <p className="truncate text-xs text-[var(--fm-ink-muted)]">
                                                    {service.technicianName} • {service.category} • $
                                                    {service.basePrice}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-2 sm:justify-end">
                                            <StatusBadge status={service.approvalStatus} />
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--fm-primary)]">
                                                Moderate
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Platform Bookings Table */}
                    <div className="fm-card p-5 sm:p-6">
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="fm-heading text-lg sm:text-xl">
                                    Recent Platform Bookings
                                </h2>
                                <p className="text-xs text-[var(--fm-ink-muted)]">
                                    Latest customer repair requests across all categories
                                </p>
                            </div>
                            <Link
                                href="/dashboard/admin/bookings"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--fm-primary)] hover:underline"
                            >
                                All bookings
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>

                        {stats.recentBookings.length === 0 ? (
                            <p className="rounded-2xl bg-[var(--fm-canvas)] p-6 text-center text-xs text-[var(--fm-ink-muted)]">
                                No bookings have been placed on the platform yet.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[560px] border-separate border-spacing-y-1.5 text-left text-sm">
                                    <thead>
                                        <tr className="rounded-2xl bg-[var(--fm-nav-track)] text-[11px] font-bold uppercase tracking-wider text-[var(--fm-ink-muted)]">
                                            <th className="rounded-l-2xl px-4 py-3">Service</th>
                                            <th className="px-4 py-3">Customer</th>
                                            <th className="px-4 py-3">Technician</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="rounded-r-2xl px-4 py-3 text-right">
                                                Amount
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.recentBookings.map((booking) => (
                                            <tr
                                                key={booking._id}
                                                className="rounded-2xl transition hover:bg-[var(--fm-nav-track)]/60"
                                            >
                                                <td className="rounded-l-2xl px-4 py-3 font-semibold text-[var(--fm-ink)]">
                                                    <span className="line-clamp-1">
                                                        {booking.serviceTitle}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-[var(--fm-ink-soft)]">
                                                    {booking.customerName}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-[var(--fm-ink-soft)]">
                                                    {booking.technicianName}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <StatusBadge status={booking.status} />
                                                </td>
                                                <td className="rounded-r-2xl px-4 py-3 text-right font-bold text-[var(--fm-ink)]">
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
                    {/* Moderation Action Navy Card */}
                    <div className="fm-bento-navy !rounded-[28px] p-6">
                        <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-[#9CC2FF]">
                            Quality Control
                        </span>
                        <h3 className="fm-heading mt-3 text-xl !text-white">
                            {stats.services.pending > 0
                                ? `${stats.services.pending} Listing${stats.services.pending === 1 ? "" : "s"} Awaiting Review`
                                : "Marketplace Up to Date"}
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                            Approve verified technician services so customers can discover and
                            book them immediately.
                        </p>
                        <Link
                            href="/dashboard/admin/services"
                            className="fm-btn-amber mt-5 w-full"
                        >
                            <ShieldCheck className="h-4 w-4" />
                            Open Service Moderation
                        </Link>
                    </div>

                    {/* User Role Breakdown Card */}
                    <div className="fm-card space-y-4 p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="fm-heading text-base">Role Distribution</h3>
                            <Link
                                href="/dashboard/admin/users"
                                className="text-xs font-bold text-[var(--fm-primary)] hover:underline"
                            >
                                Manage
                            </Link>
                        </div>

                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between rounded-2xl bg-[var(--fm-canvas)] px-4 py-3">
                                <span className="inline-flex items-center gap-2 text-xs font-bold text-[var(--fm-ink)]">
                                    <UserCheck className="h-4 w-4 text-[var(--fm-primary)]" />
                                    Customers
                                </span>
                                <span className="fm-heading text-base">
                                    {stats.users.customers}
                                </span>
                            </div>

                            <div className="flex items-center justify-between rounded-2xl bg-[var(--fm-canvas)] px-4 py-3">
                                <span className="inline-flex items-center gap-2 text-xs font-bold text-[var(--fm-ink)]">
                                    <Wrench className="h-4 w-4 text-[#2BC9A0]" />
                                    Technicians
                                </span>
                                <span className="fm-heading text-base">
                                    {stats.users.technicians}
                                </span>
                            </div>

                            <div className="flex items-center justify-between rounded-2xl bg-[var(--fm-canvas)] px-4 py-3">
                                <span className="inline-flex items-center gap-2 text-xs font-bold text-[var(--fm-ink)]">
                                    <ShieldCheck className="h-4 w-4 text-[#FFB020]" />
                                    Admins
                                </span>
                                <span className="fm-heading text-base">
                                    {stats.users.admins}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}