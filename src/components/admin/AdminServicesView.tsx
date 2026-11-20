"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
    CheckCircle2,
    XCircle,
    Clock,
    User,
    Loader2,
    MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { apiAuthFetch } from "@/lib/api-client";
import type { ServiceItem } from "@/types/service";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";

type ModerationTab = "all" | "pending" | "approved" | "rejected";

export function AdminServicesView() {
    const prefersReducedMotion = useReducedMotion();
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<ModerationTab>("all");

    const [busyId, setBusyId] = useState<string | null>(null);
    const [rejectTarget, setRejectTarget] = useState<ServiceItem | null>(null);

    useEffect(() => {
        let active = true;

        async function loadServices() {
            try {
                setLoading(true);
                const query = tab === "all" ? "" : `?status=${tab}`;
                const res = await apiAuthFetch<ServiceItem[]>(
                    `/api/admin/services${query}`
                );
                if (active) setServices(res.data || []);
            } catch (err) {
                toast.error(
                    err instanceof Error ? err.message : "Failed to load services"
                );
            } finally {
                if (active) setLoading(false);
            }
        }

        loadServices();
        return () => {
            active = false;
        };
    }, [tab]);

    const handleModerate = async (
        serviceId: string,
        approvalStatus: "approved" | "rejected"
    ) => {
        try {
            setBusyId(serviceId);
            const res = await apiAuthFetch<ServiceItem>(
                `/api/admin/services/${serviceId}/approval`,
                {
                    method: "PATCH",
                    body: JSON.stringify({ approvalStatus }),
                }
            );

            setServices((prev) => {
                if (tab !== "all" && tab !== approvalStatus) {
                    return prev.filter((item) => item._id !== serviceId);
                }
                return prev.map((item) => (item._id === serviceId ? res.data : item));
            });

            toast.success(
                approvalStatus === "approved"
                    ? "Service approved! It is now live on the marketplace."
                    : "Service rejected."
            );
            if (approvalStatus === "rejected") setRejectTarget(null);
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Could not update service status"
            );
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header + Filter Pills */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="fm-heading text-2xl">Approve Services</h2>
                    <p className="text-sm text-[var(--fm-ink-soft)]">
                        Review technician listings before they appear on the Home and
                        Services catalog.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {(
                        [
                            { id: "all", label: "All" },
                            { id: "pending", label: "Pending" },
                            { id: "approved", label: "Approved" },
                            { id: "rejected", label: "Rejected" },
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

            {/* Moderation List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="fm-shimmer h-44 rounded-[28px]" />
                    ))}
                </div>
            ) : services.length === 0 ? (
                <EmptyState
                    variant="box"
                    title={
                        tab === "pending"
                            ? "No pending services to moderate"
                            : `No ${tab === "all" ? "" : tab} services found`
                    }
                    description="Technician submissions will automatically appear here for admin approval."
                    actionLabel={tab !== "all" ? "View All Listings" : undefined}
                    onAction={tab !== "all" ? () => setTab("all") : undefined}
                />
            ) : (
                <div className="space-y-4">
                    {services.map((service, idx) => {
                        const isBusy = busyId === service._id;

                        return (
                            <motion.div
                                key={service._id}
                                initial={
                                    prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }
                                }
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.2) }}
                                className="fm-card flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between"
                            >
                                <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-start">
                                    {/* Thumbnail */}
                                    <div className="h-28 w-full shrink-0 overflow-hidden rounded-2xl border border-[var(--fm-surface-border)] bg-[var(--fm-primary-soft)] sm:h-28 sm:w-36">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={service.image}
                                            alt={service.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    {/* Metadata */}
                                    <div className="min-w-0 flex-1 space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <StatusBadge status={service.approvalStatus} />
                                            <span className="rounded-full bg-[var(--fm-primary-soft)] px-3 py-0.5 text-[11px] font-bold text-[var(--fm-primary-soft-text)]">
                                                {service.category}
                                            </span>
                                            <span className="rounded-full bg-[var(--fm-amber-soft)] px-3 py-0.5 text-xs font-extrabold text-[var(--fm-amber-soft-text)]">
                                                ${service.basePrice}
                                            </span>
                                            {!service.isAvailable && (
                                                <span className="rounded-full bg-[var(--fm-nav-track)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--fm-ink-muted)]">
                                                    Paused by Tech
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="fm-heading text-lg leading-snug">
                                            {service.title}
                                        </h3>

                                        <p className="line-clamp-2 text-xs leading-relaxed text-[var(--fm-ink-soft)] sm:text-sm">
                                            {service.description}
                                        </p>

                                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1 text-xs text-[var(--fm-ink-muted)]">
                                            <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--fm-ink)]">
                                                <User className="h-3.5 w-3.5 text-[var(--fm-primary)]" />
                                                {service.technicianName} ({service.technicianEmail})
                                            </span>
                                            <span className="inline-flex items-center gap-1.5">
                                                <MapPin className="h-3.5 w-3.5 text-[#2BC9A0]" />
                                                {service.serviceMode}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5">
                                                <Clock className="h-3.5 w-3.5 text-[#FFB020]" />
                                                {service.estimatedDuration}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Approve / Reject Controls */}
                                <div className="flex shrink-0 flex-wrap items-center gap-2.5 border-t border-[var(--fm-divider)] pt-4 lg:flex-col lg:items-stretch lg:border-t-0 lg:pt-0">
                                    {service.approvalStatus !== "approved" && (
                                        <button
                                            type="button"
                                            disabled={isBusy}
                                            onClick={() => handleModerate(service._id, "approved")}
                                            className="fm-btn-primary h-10 px-5 text-xs"
                                        >
                                            {isBusy ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <CheckCircle2 className="h-4 w-4" />
                                            )}
                                            Approve Listing
                                        </button>
                                    )}

                                    {service.approvalStatus !== "rejected" && (
                                        <button
                                            type="button"
                                            disabled={isBusy}
                                            onClick={() => setRejectTarget(service)}
                                            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-5 text-xs font-bold text-red-500 transition hover:bg-red-500 hover:text-white disabled:opacity-60"
                                        >
                                            <XCircle className="h-4 w-4" />
                                            Reject
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Reject Service Confirm Dialog */}
            <ConfirmDialog
                isOpen={Boolean(rejectTarget)}
                onClose={() => setRejectTarget(null)}
                onConfirm={() => {
                    if (rejectTarget) {
                        return handleModerate(rejectTarget._id, "rejected");
                    }
                }}
                title="Reject this service listing?"
                description={`"${rejectTarget?.title || ""}" will be hidden from the public catalog until the technician updates and resubmits it.`}
                confirmLabel="Reject Service"
                loading={Boolean(rejectTarget && busyId === rejectTarget._id)}
            />
        </div>
    );
}