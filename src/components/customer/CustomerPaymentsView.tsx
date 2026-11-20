"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { apiAuthFetch } from "@/lib/api-client";
import type { BookingItem } from "@/types/booking";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";

export function CustomerPaymentsView() {
    const [bookings, setBookings] = useState<BookingItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        async function loadData() {
            try {
                setLoading(true);
                const res = await apiAuthFetch<BookingItem[]>("/api/bookings/my");
                if (active) setBookings(res.data || []);
            } catch (err) {
                toast.error(
                    err instanceof Error ? err.message : "Failed to load payment history"
                );
            } finally {
                if (active) setLoading(false);
            }
        }

        loadData();
        return () => {
            active = false;
        };
    }, []);

    const paidBookings = bookings.filter((b) => b.paymentStatus === "paid");
    const dueBookings = bookings.filter(
        (b) => b.status === "completed" && b.paymentStatus === "unpaid"
    );
    const totalPaid = paidBookings.reduce(
        (sum, b) => sum + Number(b.finalAmount || 0),
        0
    );
    const totalDue = dueBookings.reduce(
        (sum, b) => sum + Number(b.finalAmount || 0),
        0
    );

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="fm-shimmer h-32 rounded-[28px]" />
                    ))}
                </div>
                <div className="fm-shimmer h-64 rounded-[28px]" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="fm-heading text-2xl">Payment History</h2>
                <p className="text-sm text-[var(--fm-ink-soft)]">
                    All online Stripe Checkout payments made after repair completion.
                </p>
            </div>

            {/* 3 Summary Stat Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard
                    label="Total Paid"
                    value={`$${totalPaid.toFixed(2)}`}
                    caption={`${paidBookings.length} completed payments`}
                    tone="mint"
                    icon={<CheckCircle2 className="h-6 w-6" />}
                    delay={0}
                />
                <StatCard
                    label="Due Now"
                    value={`$${totalDue.toFixed(2)}`}
                    caption={`${dueBookings.length} jobs awaiting payment`}
                    tone="amber"
                    icon={<Clock className="h-6 w-6" />}
                    delay={0.06}
                />
                <StatCard
                    label="Payment Policy"
                    value="$0 Upfront"
                    caption="Verified post-completion billing"
                    tone="sky"
                    icon={<CreditCard className="h-6 w-6" />}
                    delay={0.12}
                />
            </div>

            {/* Due Reminder Strip */}
            {dueBookings.length > 0 && (
                <div className="fm-bento-amber flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-semibold text-[var(--fm-ink)]">
                        You have {dueBookings.length} completed{" "}
                        {dueBookings.length === 1 ? "repair" : "repairs"} ready for checkout.
                    </p>
                    <Link
                        href="/dashboard/customer/bookings"
                        className="fm-btn-primary shrink-0 text-xs"
                    >
                        Go to My Bookings
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            )}

            {/* Paid Transactions Table */}
            <div className="fm-card p-5 sm:p-6">
                <h3 className="fm-heading mb-4 text-lg">Completed Transactions</h3>

                {paidBookings.length === 0 ? (
                    <EmptyState
                        variant="box"
                        title="No completed payments yet"
                        description="Once a technician marks your repair Completed and you finish Stripe Checkout, your receipts will appear here."
                        actionLabel="View My Bookings"
                        actionHref="/dashboard/customer/bookings"
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
                                    <th className="rounded-r-2xl px-4 py-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paidBookings.map((item) => (
                                    <tr
                                        key={item._id}
                                        className="rounded-2xl transition hover:bg-[var(--fm-nav-track)]/60"
                                    >
                                        <td className="rounded-l-2xl px-4 py-3.5 font-semibold text-[var(--fm-ink)]">
                                            {item.serviceTitle}
                                        </td>
                                        <td className="px-4 py-3.5 text-xs text-[var(--fm-ink-soft)]">
                                            {item.technicianName}
                                        </td>
                                        <td className="px-4 py-3.5 text-xs text-[var(--fm-ink-soft)]">
                                            {item.preferredDate}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <StatusBadge status="paid" />
                                        </td>
                                        <td className="rounded-r-2xl px-4 py-3.5 text-right font-extrabold text-[var(--fm-ink)]">
                                            ${item.finalAmount}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}