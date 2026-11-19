"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
    Plus,
    Pencil,
    Trash2,
    Clock,
    Power,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { apiAuthFetch } from "@/lib/api-client";
import type { ServiceItem } from "@/types/service";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { ServiceFormModal } from "@/components/technician/ServiceFormModal";

export function TechnicianServicesView() {
    const prefersReducedMotion = useReducedMotion();
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [formOpen, setFormOpen] = useState(false);
    const [editingService, setEditingService] = useState<ServiceItem | null>(
        null
    );

    const [deletingTarget, setDeletingTarget] = useState<ServiceItem | null>(
        null
    );
    const [deleting, setDeleting] = useState(false);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        async function loadMyServices() {
            try {
                setLoading(true);
                const res = await apiAuthFetch<ServiceItem[]>("/api/services/my");
                if (active) setServices(res.data || []);
            } catch (err) {
                toast.error(
                    err instanceof Error ? err.message : "Failed to load your services"
                );
            } finally {
                if (active) setLoading(false);
            }
        }

        loadMyServices();
        return () => {
            active = false;
        };
    }, []);

    const handleSaved = (saved: ServiceItem, isEdit: boolean) => {
        setServices((prev) =>
            isEdit ? prev.map((s) => (s._id === saved._id ? saved : s)) : [saved, ...prev]
        );
    };

    const handleToggleAvailability = async (service: ServiceItem) => {
        try {
            setTogglingId(service._id);
            const nextValue = !service.isAvailable;
            const res = await apiAuthFetch<ServiceItem>(
                `/api/services/${service._id}/availability`,
                {
                    method: "PATCH",
                    body: JSON.stringify({ isAvailable: nextValue }),
                }
            );
            setServices((prev) =>
                prev.map((s) => (s._id === service._id ? res.data : s))
            );
            toast.success(
                nextValue ? "Service is now available" : "Service paused (unavailable)"
            );
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Failed to update availability"
            );
        } finally {
            setTogglingId(null);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deletingTarget) return;

        try {
            setDeleting(true);
            await apiAuthFetch(`/api/services/${deletingTarget._id}`, {
                method: "DELETE",
            });
            setServices((prev) => prev.filter((s) => s._id !== deletingTarget._id));
            toast.success("Service deleted successfully");
            setDeletingTarget(null);
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Failed to delete service"
            );
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="fm-heading text-2xl">My Repair Services</h2>
                    <p className="text-sm text-[var(--fm-ink-soft)]">
                        Create listings, toggle availability without losing approval, or
                        update pricing.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setEditingService(null);
                        setFormOpen(true);
                    }}
                    className="fm-btn-primary shrink-0"
                >
                    <Plus className="h-4 w-4" />
                    Add New Service
                </button>
            </div>

            {/* Services Grid */}
            {loading ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="fm-card space-y-4 p-4">
                            <div className="fm-shimmer aspect-[16/10] rounded-2xl" />
                            <div className="fm-shimmer h-5 w-4/5 rounded-xl" />
                            <div className="fm-shimmer h-10 w-full rounded-full" />
                        </div>
                    ))}
                </div>
            ) : services.length === 0 ? (
                <EmptyState
                    variant="wrench"
                    title="You haven't listed any repair services yet"
                    description="Publish your first smartphone, laptop, AC, or appliance repair service with a clear starting price."
                    actionLabel="Add Your First Service"
                    onAction={() => {
                        setEditingService(null);
                        setFormOpen(true);
                    }}
                />
            ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {services.map((service, index) => (
                        <motion.div
                            key={service._id}
                            initial={
                                prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }
                            }
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.04 }}
                            className="fm-card flex h-full flex-col p-4"
                        >
                            {/* Image + Badges */}
                            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[var(--fm-primary-soft)]">
                                <Image
                                    src={service.image}
                                    alt={service.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover"
                                />
                                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                                    <StatusBadge status={service.approvalStatus} />
                                </div>
                                <span className="absolute right-3 top-3 rounded-full bg-[#0B1F3A]/85 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                                    {service.category}
                                </span>
                            </div>

                            {/* Body */}
                            <div className="flex flex-1 flex-col pt-4">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="fm-heading line-clamp-2 text-base leading-snug">
                                        {service.title}
                                    </h3>
                                    <span className="shrink-0 rounded-full bg-[var(--fm-amber-soft)] px-3 py-1 text-xs font-extrabold text-[var(--fm-amber-soft-text)]">
                                        ${service.basePrice}
                                    </span>
                                </div>

                                <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-[var(--fm-ink-muted)]">
                                    <span>{service.serviceMode}</span>
                                    <span>•</span>
                                    <span className="inline-flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5 text-[var(--fm-primary)]" />
                                        {service.estimatedDuration}
                                    </span>
                                </div>

                                {/* Availability & Action Footer */}
                                <div className="mt-auto space-y-3 border-t border-[var(--fm-divider)] pt-4">
                                    <div className="flex items-center justify-between gap-2 rounded-2xl bg-[var(--fm-canvas)] px-3.5 py-2.5">
                                        <span className="text-xs font-bold text-[var(--fm-ink)]">
                                            {service.isAvailable
                                                ? "Available for booking"
                                                : "Paused / Unavailable"}
                                        </span>
                                        <button
                                            type="button"
                                            disabled={togglingId === service._id}
                                            onClick={() => handleToggleAvailability(service)}
                                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition ${service.isAvailable
                                                    ? "bg-[var(--fm-mint-soft)] text-[var(--fm-mint-soft-text)]"
                                                    : "bg-slate-200/80 text-slate-700 dark:bg-white/10 dark:text-slate-300"
                                                }`}
                                        >
                                            {togglingId === service._id ? (
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                            ) : (
                                                <Power className="h-3.5 w-3.5" />
                                            )}
                                            {service.isAvailable ? "Active" : "Paused"}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2.5">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingService(service);
                                                setFormOpen(true);
                                            }}
                                            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-[var(--fm-surface-border)] bg-[var(--fm-surface)] text-xs font-bold text-[var(--fm-ink)] transition hover:border-[var(--fm-primary)]/40 hover:text-[var(--fm-primary)]"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setDeletingTarget(service)}
                                            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-red-500/25 bg-red-500/10 text-xs font-bold text-red-500 transition hover:bg-red-500 hover:text-white"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Add / Edit Service Modal */}
            <ServiceFormModal
                isOpen={formOpen}
                onClose={() => setFormOpen(false)}
                editingService={editingService}
                onSaved={handleSaved}
            />

            {/* Delete Confirm Dialog */}
            <ConfirmDialog
                isOpen={Boolean(deletingTarget)}
                onClose={() => setDeletingTarget(null)}
                onConfirm={handleConfirmDelete}
                title="Delete this repair service?"
                description={`"${deletingTarget?.title || ""}" will be permanently removed from your listings.`}
                confirmLabel="Delete Service"
                loading={deleting}
            />
        </div>
    );
}