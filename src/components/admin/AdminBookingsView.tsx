"use client";

import { useEffect, useState } from "react";
import {
    Search,
    X,
    Calendar,
    MapPin,
    User,
    Wrench,
    Phone,
} from "lucide-react";
import { toast } from "sonner";
import { apiAuthFetch } from "@/lib/api-client";
import type { BookingItem } from "@/types/booking";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";

export function AdminBookingsView() {
    const [bookings, setBookings] = useState<BookingItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [paymentFilter, setPaymentFilter] = useState("all");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchInput.trim());
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        let active = true;

        async function loadBookings() {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                if (statusFilter !== "all") params.set("status", statusFilter);
                if (paymentFilter !== "all") params.set("paymentStatus", paymentFilter);
                if (debouncedSearch) params.set("search", debouncedSearch);

                const qs = params.toString();
                const res = await apiAuthFetch<BookingItem[]>(
                    qs ? `/api/admin/bookings?${qs}` : "/api/admin/bookings"
                );
                if (active) setBookings(res.data || []);
            } catch (err) {
                toast.error(
                    err instanceof Error ? err.message : "Failed to load bookings"
                );
            } finally {
                if (active) setLoading(false);
            }
        }

        loadBookings();
        return () => {
            active = false;
        };
    }, [statusFilter, paymentFilter, debouncedSearch]);

    const hasFilters =
        Boolean(debouncedSearch) ||
        statusFilter !== "all" ||
        paymentFilter !== "all";

    const resetFilters = () => {
        setSearchInput("");
        setDebouncedSearch("");
        setStatusFilter("all");
        setPaymentFilter("all");
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="fm-heading text-2xl">All Platform Bookings</h2>
                <p className="text-sm text-[var(--fm-ink-soft)]">
                    Monitor every customer repair request, technician assignment, and
                    payment status.
                </p>
            </div>

            {/* Filter Bar */}
            <div className="fm-card grid grid-cols-1 gap-3 p-4 md:grid-cols-12">
                <div className="relative md:col-span-5">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fm-primary)]" />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search service, customer, or technician..."
                        aria-label="Search bookings"
                        className="fm-input pl-10 pr-9"
                    />
                    {searchInput && (
                        <button
                            type="button"
                            onClick={() => setSearchInput("")}
                            aria-label="Clear search"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--fm-ink-muted)] hover:text-[var(--fm-ink)]"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="md:col-span-4">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        aria-label="Filter by booking status"
                        className="fm-input cursor-pointer px-4"
                    >
                        <option value="all">All Statuses</option>
                        <option value="requested">Requested</option>
                        <option value="accepted">Accepted</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <div className="md:col-span-3">
                    <select
                        value={paymentFilter}
                        onChange={(e) => setPaymentFilter(e.target.value)}
                        aria-label="Filter by payment status"
                        className="fm-input cursor-pointer px-4"
                    >
                        <option value="all">All Payments</option>
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                    </select>
                </div>
            </div>

            {/* Results Count */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                <p className="text-xs font-semibold text-[var(--fm-ink-muted)]">
                    {loading
                        ? "Loading bookings..."
                        : `Showing ${bookings.length} ${bookings.length === 1 ? "booking" : "bookings"}`}
                </p>
                {hasFilters && (
                    <button
                        type="button"
                        onClick={resetFilters}
                        className="text-xs font-bold text-[var(--fm-primary)] hover:underline"
                    >
                        Reset Filters
                    </button>
                )}
            </div>

            {/* Bookings Cards */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="fm-shimmer h-40 rounded-[28px]" />
                    ))}
                </div>
            ) : bookings.length === 0 ? (
                <EmptyState
                    variant="search"
                    title={
                        hasFilters
                            ? "No bookings match your filters"
                            : "No bookings on the platform yet"
                    }
                    description="Try clearing a filter or check back once customers submit repair requests."
                    actionLabel={hasFilters ? "Reset Filters" : undefined}
                    onAction={hasFilters ? resetFilters : undefined}
                />
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div
                            key={booking._id}
                            className="fm-card flex flex-col gap-4 p-5 sm:p-6"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="space-y-1.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <StatusBadge status={booking.status} />
                                        <StatusBadge status={booking.paymentStatus} />
                                        <span className="rounded-full bg-[var(--fm-primary-soft)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--fm-primary-soft-text)]">
                                            {booking.category}
                                        </span>
                                    </div>
                                    <h3 className="fm-heading text-lg">{booking.serviceTitle}</h3>
                                </div>

                                <div className="rounded-2xl bg-[var(--fm-amber-soft)] px-4 py-2 text-right">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--fm-amber-soft-text)] opacity-80">
                                        Amount
                                    </p>
                                    <p className="text-base font-extrabold text-[var(--fm-amber-soft-text)]">
                                        ${booking.finalAmount}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 rounded-2xl bg-[var(--fm-canvas)] p-4 text-xs sm:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-0.5">
                                    <p className="font-bold text-[var(--fm-ink-muted)]">
                                        Customer
                                    </p>
                                    <p className="inline-flex items-center gap-1.5 font-semibold text-[var(--fm-ink)]">
                                        <User className="h-3.5 w-3.5 text-[var(--fm-primary)]" />
                                        {booking.customerName}
                                    </p>
                                    <p className="inline-flex items-center gap-1 text-[var(--fm-ink-muted)]">
                                        <Phone className="h-3 w-3" />
                                        {booking.customerPhone}
                                    </p>
                                </div>

                                <div className="space-y-0.5">
                                    <p className="font-bold text-[var(--fm-ink-muted)]">
                                        Technician
                                    </p>
                                    <p className="inline-flex items-center gap-1.5 font-semibold text-[var(--fm-ink)]">
                                        <Wrench className="h-3.5 w-3.5 text-[#2BC9A0]" />
                                        {booking.technicianName}
                                    </p>
                                    <p className="truncate text-[var(--fm-ink-muted)]">
                                        {booking.technicianEmail}
                                    </p>
                                </div>

                                <div className="space-y-0.5">
                                    <p className="font-bold text-[var(--fm-ink-muted)]">
                                        Schedule &amp; Mode
                                    </p>
                                    <p className="inline-flex items-center gap-1.5 font-semibold text-[var(--fm-ink)]">
                                        <Calendar className="h-3.5 w-3.5 text-[#FFB020]" />
                                        {booking.preferredDate}
                                    </p>
                                    <p className="text-[var(--fm-ink-muted)]">
                                        {booking.serviceMode}
                                    </p>
                                </div>

                                <div className="space-y-0.5">
                                    <p className="font-bold text-[var(--fm-ink-muted)]">
                                        Address
                                    </p>
                                    <p className="inline-flex items-start gap-1.5 text-[var(--fm-ink-soft)]">
                                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--fm-primary)]" />
                                        <span>{booking.address}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}