"use client";

import { useEffect, useState } from "react";
import {
    Phone,
    MapPin,
    Calendar,
    Check,
    X,
    Play,
    CheckCircle2,
    Loader2,
    User,
} from "lucide-react";
import { toast } from "sonner";
import { apiAuthFetch } from "@/lib/api-client";
import type { BookingItem } from "@/types/booking";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { CompleteJobModal } from "@/components/technician/CompleteJobModal";

type FilterTab = "all" | "active" | "completed" | "closed";

export function TechnicianBookingsView() {
    const [bookings, setBookings] = useState<BookingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<FilterTab>("all");

    const [busyId, setBusyId] = useState<string | null>(null);
    const [rejectTarget, setRejectTarget] = useState<BookingItem | null>(null);
    const [completeTarget, setCompleteTarget] = useState<BookingItem | null>(
        null
    );

    useEffect(() => {
        let active = true;

        async function loadBookings() {
            try {
                setLoading(true);
                const res = await apiAuthFetch<BookingItem[]>(
                    "/api/bookings/technician"
                );
                if (active) setBookings(res.data || []);
            } catch (err) {
                toast.error(
                    err instanceof Error ? err.message : "Failed to load assigned jobs"
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

    const updateLocalBooking = (updated: BookingItem) => {
        setBookings((prev) =>
            prev.map((item) => (item._id === updated._id ? updated : item))
        );
    };

    const transitionStatus = async (
        bookingId: string,
        status: "accepted" | "rejected" | "in-progress"
    ) => {
        try {
            setBusyId(bookingId);
            const res = await apiAuthFetch<BookingItem>(
                `/api/bookings/${bookingId}/status`,
                {
                    method: "PATCH",
                    body: JSON.stringify({ status }),
                }
            );
            updateLocalBooking(res.data);
            toast.success(`Job status updated to "${status.replace("-", " ")}"`);
            if (status === "rejected") setRejectTarget(null);
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Status update failed"
            );
        } finally {
            setBusyId(null);
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
                    <h2 className="fm-heading text-2xl">Assigned Repair Bookings</h2>
                    <p className="text-sm text-[var(--fm-ink-soft)]">
                        Move jobs sequentially: Requested → Accepted → In Progress →
                        Completed.
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

            {/* Booking Cards List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="fm-shimmer h-44 rounded-[28px]" />
                    ))}
                </div>
            ) : filteredBookings.length === 0 ? (
                <EmptyState
                    variant="box"
                    title={
                        tab === "all"
                            ? "No repair bookings assigned yet"
                            : `No ${tab} bookings found`
                    }
                    description="Incoming customer repair requests for your approved services will appear here."
                    actionLabel={tab !== "all" ? "Show All Bookings" : "View My Services"}
                    actionHref={tab === "all" ? "/dashboard/technician/services" : undefined}
                    onAction={tab !== "all" ? () => setTab("all") : undefined}
                />
            ) : (
                <div className="space-y-4">
                    {filteredBookings.map((booking) => {
                        const isBusy = busyId === booking._id;

                        return (
                            <div
                                key={booking._id}
                                className="fm-card flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between"
                            >
                                {/* Left Details */}
                                <div className="min-w-0 flex-1 space-y-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <StatusBadge status={booking.status} />
                                        <StatusBadge status={booking.paymentStatus} />
                                        <span className="rounded-full bg-[var(--fm-amber-soft)] px-3 py-0.5 text-xs font-extrabold text-[var(--fm-amber-soft-text)]">
                                            ${booking.finalAmount}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="fm-heading text-lg">
                                            {booking.serviceTitle}
                                        </h3>
                                        <p className="mt-1 text-xs leading-relaxed text-[var(--fm-ink-soft)] sm:text-sm">
                                            {booking.problemDescription}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-xs text-[var(--fm-ink-muted)]">
                                        <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--fm-ink)]">
                                            <User className="h-3.5 w-3.5 text-[var(--fm-primary)]" />
                                            {booking.customerName}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <Phone className="h-3.5 w-3.5 text-[#2BC9A0]" />
                                            {booking.customerPhone}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5 text-[#FFB020]" />
                                            {booking.preferredDate}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <MapPin className="h-3.5 w-3.5 text-[var(--fm-primary)]" />
                                            {booking.address}
                                        </span>
                                    </div>
                                </div>

                                {/* Right Challenge 3 State Machine Controls */}
                                <div className="flex shrink-0 flex-wrap items-center gap-2.5 border-t border-[var(--fm-divider)] pt-4 lg:border-t-0 lg:pt-0">
                                    {booking.status === "requested" && (
                                        <>
                                            <button
                                                type="button"
                                                disabled={isBusy}
                                                onClick={() =>
                                                    transitionStatus(booking._id, "accepted")
                                                }
                                                className="fm-btn-primary h-10 px-4 text-xs"
                                            >
                                                {isBusy ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Check className="h-4 w-4" />
                                                )}
                                                Accept Job
                                            </button>
                                            <button
                                                type="button"
                                                disabled={isBusy}
                                                onClick={() => setRejectTarget(booking)}
                                                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-4 text-xs font-bold text-red-500 transition hover:bg-red-500 hover:text-white"
                                            >
                                                <X className="h-4 w-4" />
                                                Reject
                                            </button>
                                        </>
                                    )}

                                    {booking.status === "accepted" && (
                                        <button
                                            type="button"
                                            disabled={isBusy}
                                            onClick={() =>
                                                transitionStatus(booking._id, "in-progress")
                                            }
                                            className="fm-btn-amber h-10 px-5 text-xs"
                                        >
                                            {isBusy ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Play className="h-4 w-4" />
                                            )}
                                            Start Repair
                                        </button>
                                    )}

                                    {booking.status === "in-progress" && (
                                        <button
                                            type="button"
                                            disabled={isBusy}
                                            onClick={() => setCompleteTarget(booking)}
                                            className="fm-btn-primary h-10 px-5 text-xs"
                                        >
                                            <CheckCircle2 className="h-4 w-4" />
                                            Mark Completed
                                        </button>
                                    )}

                                    {booking.status === "completed" && (
                                        <span className="rounded-full bg-[var(--fm-mint-soft)] px-4 py-2 text-xs font-bold text-[var(--fm-mint-soft-text)]">
                                            {booking.paymentStatus === "paid"
                                                ? "Completed & Paid"
                                                : "Awaiting Customer Payment"}
                                        </span>
                                    )}

                                    {(booking.status === "rejected" ||
                                        booking.status === "cancelled") && (
                                            <span className="rounded-full bg-[var(--fm-nav-track)] px-4 py-2 text-xs font-bold text-[var(--fm-ink-muted)]">
                                                Job Closed
                                            </span>
                                        )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Reject Confirmation Dialog */}
            <ConfirmDialog
                isOpen={Boolean(rejectTarget)}
                onClose={() => setRejectTarget(null)}
                onConfirm={() => {
                    if (rejectTarget) {
                        return transitionStatus(rejectTarget._id, "rejected");
                    }
                }}
                title="Reject this repair request?"
                description="Once rejected, this booking is locked and cannot be reopened. The customer will be able to book another service."
                confirmLabel="Reject Request"
                loading={Boolean(rejectTarget && busyId === rejectTarget._id)}
            />

            {/* Mark Completed Final Amount Modal */}
            <CompleteJobModal
                booking={completeTarget}
                onClose={() => setCompleteTarget(null)}
                onCompleted={updateLocalBooking}
            />
        </div>
    );
}