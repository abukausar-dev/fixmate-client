"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    CreditCard,
    CheckCircle2,
    Clock,
    ArrowRight,
    Receipt,
} from "lucide-react";
import { toast } from "sonner";
import { apiAuthFetch } from "@/lib/api-client";
import type { BookingItem } from "@/types/booking";
import type { PaymentRecord } from "@/types/payment";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";

export function CustomerPaymentsView() {
    const [payments, setPayments] = useState<PaymentRecord[]>([]);
    const [dueBookings, setDueBookings] = useState<BookingItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        async function loadData() {
            try {
                setLoading(true);
                const [paymentsRes, bookingsRes] = await Promise.all([
                    apiAuthFetch<PaymentRecord[]>("/api/payments/my"),
                    apiAuthFetch<BookingItem[]>("/api/bookings/my"),
                ]);

                if (active) {
                    setPayments(paymentsRes.data || []);
                    const due = (bookingsRes.data || []).filter(
                        (b) => b.status === "completed" && b.paymentStatus === "unpaid"
                    );
                    setDueBookings(due);
                }
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

    const totalPaid = payments.reduce(
        (sum, item) => sum + Number(item.amount || 0),
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
                    Verified Stripe Checkout receipts recorded after repair completion.
                </p>
            </div>

            {/* 3 Summary Stat Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard
                    label="Total Paid"
                    value={`$${totalPaid.toFixed(2)}`}
                    caption={`${payments.length} verified ${payments.length === 1 ? "receipt" : "receipts"}`}
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
                    label="Checkout Security"
                    value="Stripe Verified"
                    caption="Pay only after completion"
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
                        Pay in My Bookings
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            )}

            {/* Verified Stripe Receipts Table */}
            <div className="fm-card p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-2">
                    <h3 className="fm-heading flex items-center gap-2 text-lg">
                        <Receipt className="h-5 w-5 text-[var(--fm-primary)]" />
                        Verified Payment Receipts
                    </h3>
                </div>

                {payments.length === 0 ? (
                    <EmptyState
                        variant="box"
                        title="No completed payments yet"
                        description="Once a technician marks your repair Completed and you finish Stripe Checkout, your verified receipts will appear here."
                        actionLabel="View My Bookings"
                        actionHref="/dashboard/customer/bookings"
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[620px] border-separate border-spacing-y-1.5 text-left text-sm">
                            <thead>
                                <tr className="rounded-2xl bg-[var(--fm-nav-track)] text-[11px] font-bold uppercase tracking-wider text-[var(--fm-ink-muted)]">
                                    <th className="rounded-l-2xl px-4 py-3">Service</th>
                                    <th className="px-4 py-3">Technician</th>
                                    <th className="px-4 py-3">Paid Date</th>
                                    <th className="px-4 py-3">Transaction Ref</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="rounded-r-2xl px-4 py-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((item) => {
                                    const refCode = (
                                        item.stripePaymentIntentId || item.stripeSessionId
                                    ).slice(-10);
                                    const dateText = new Date(item.paidAt).toLocaleDateString(
                                        undefined,
                                        { dateStyle: "medium" }
                                    );

                                    return (
                                        <tr
                                            key={item._id}
                                            className="rounded-2xl transition hover:bg-[var(--fm-nav-track)]/60"
                                        >
                                            <td className="rounded-l-2xl px-4 py-3.5 font-semibold text-[var(--fm-ink)]">
                                                <span className="line-clamp-1">
                                                    {item.serviceTitle}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-xs text-[var(--fm-ink-soft)]">
                                                {item.technicianName}
                                            </td>
                                            <td className="px-4 py-3.5 text-xs text-[var(--fm-ink-soft)]">
                                                {dateText}
                                            </td>
                                            <td className="px-4 py-3.5 font-mono text-xs">
                                                <Link
                                                    href={`/dashboard/customer/payments/success?session_id=${encodeURIComponent(item.stripeSessionId)}`}
                                                    className="font-semibold text-[var(--fm-primary)] hover:underline"
                                                >
                                                    ...{refCode} (Receipt)
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <StatusBadge status="paid" />
                                            </td>
                                            <td className="rounded-r-2xl px-4 py-3.5 text-right font-extrabold text-[var(--fm-ink)]">
                                                ${item.amount.toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}