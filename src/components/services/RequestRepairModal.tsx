"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
    X,
    Phone,
    MapPin,
    Calendar,
    FileText,
    User,
    Mail,
    ShieldCheck,
    Loader2,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { apiAuthFetch, ApiClientError } from "@/lib/api-client";
import {
    getTodayLocalDateString,
    requestRepairSchema,
    type RequestRepairFormValues,
} from "@/schemas/booking.schema";
import type { ServiceDetail } from "@/types/service";
import type { BookingItem } from "@/types/booking";

interface RequestRepairModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: ServiceDetail;
    customer: {
        name: string;
        email: string;
        phone?: string;
    };
}

export function RequestRepairModal({
    isOpen,
    onClose,
    service,
    customer,
}: RequestRepairModalProps) {
    const prefersReducedMotion = useReducedMotion();
    const [createdBooking, setCreatedBooking] = useState<BookingItem | null>(
        null
    );
    const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

    const todayMin = getTodayLocalDateString();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RequestRepairFormValues>({
        resolver: zodResolver(requestRepairSchema),
        defaultValues: {
            customerPhone: customer.phone || "",
            address: "",
            preferredDate: todayMin,
            problemDescription: "",
        },
    });

    const descriptionLength = (watch("problemDescription") || "").trim().length;

    // Lock background scroll & close on Escape key while modal is open
    useEffect(() => {
        if (!isOpen) return;

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && !isSubmitting) {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, isSubmitting, onClose]);

    const handleClose = () => {
        if (isSubmitting) return;
        setCreatedBooking(null);
        setDuplicateWarning(null);
        reset({
            customerPhone: customer.phone || "",
            address: "",
            preferredDate: getTodayLocalDateString(),
            problemDescription: "",
        });
        onClose();
    };

    const onSubmit = async (values: RequestRepairFormValues) => {
        setDuplicateWarning(null);

        try {
            const res = await apiAuthFetch<BookingItem>("/api/bookings", {
                method: "POST",
                body: JSON.stringify({
                    serviceId: service._id,
                    ...values,
                }),
            });

            setCreatedBooking(res.data);
            toast.success("Repair request submitted! Track progress in your bookings.");
        } catch (err) {
            if (err instanceof ApiClientError && err.status === 409) {
                setDuplicateWarning(err.message);
                toast.error(err.message);
                return;
            }
            const message =
                err instanceof Error ? err.message : "Could not submit booking request";
            toast.error(message);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="request-repair-title"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
                >
                    {/* Frosted Backdrop Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-[#060E1D]/60 backdrop-blur-md"
                    />

                    {/* Dialog Panel */}
                    <motion.div
                        initial={
                            prefersReducedMotion
                                ? { opacity: 0 }
                                : { opacity: 0, scale: 0.96, y: 16 }
                        }
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={
                            prefersReducedMotion
                                ? { opacity: 0 }
                                : { opacity: 0, scale: 0.97, y: 10 }
                        }
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="fm-glass-float relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[32px] p-6 sm:p-8"
                    >
                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={handleClose}
                            aria-label="Close booking dialog"
                            className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--fm-surface-border)] bg-[var(--fm-surface)] text-[var(--fm-ink-muted)] transition hover:text-[var(--fm-ink)]"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        {createdBooking ? (
                            /* Success Confirmation State */
                            <div className="space-y-6 py-4 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--fm-mint-soft)] text-[var(--fm-mint-soft-text)]">
                                    <CheckCircle2 className="h-9 w-9" />
                                </div>

                                <div className="space-y-2">
                                    <span className="inline-flex rounded-full bg-[var(--fm-primary-soft)] px-3.5 py-1 text-xs font-bold text-[var(--fm-primary-soft-text)]">
                                        Status: Requested
                                    </span>
                                    <h2
                                        id="request-repair-title"
                                        className="fm-heading text-2xl sm:text-3xl"
                                    >
                                        Repair Request Sent!
                                    </h2>
                                    <p className="mx-auto max-w-md text-sm leading-relaxed text-[var(--fm-ink-soft)]">
                                        Your booking for{" "}
                                        <span className="font-bold text-[var(--fm-ink)]">
                                            {createdBooking.serviceTitle}
                                        </span>{" "}
                                        has been assigned to{" "}
                                        <span className="font-bold text-[var(--fm-ink)]">
                                            {createdBooking.technicianName}
                                        </span>
                                        . You will only pay after the repair is marked Completed.
                                    </p>
                                </div>

                                <div className="fm-bento-sky grid grid-cols-2 gap-3 p-4 text-left text-xs">
                                    <div>
                                        <p className="font-semibold text-[var(--fm-ink-muted)]">
                                            Preferred Date
                                        </p>
                                        <p className="mt-0.5 font-bold text-[var(--fm-ink)]">
                                            {createdBooking.preferredDate}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[var(--fm-ink-muted)]">
                                            Starting Estimate
                                        </p>
                                        <p className="mt-0.5 font-bold text-[var(--fm-ink)]">
                                            ${createdBooking.basePrice} (Pay After Completion)
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
                                    <Link
                                        href="/dashboard/customer/bookings"
                                        onClick={handleClose}
                                        className="fm-btn-primary"
                                    >
                                        View My Bookings
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="inline-flex items-center justify-center rounded-full border border-[var(--fm-surface-border)] bg-[var(--fm-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--fm-ink)] transition hover:border-[var(--fm-primary)]/40"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Request Form State */
                            <div className="space-y-5">
                                <div className="pr-8">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--fm-mint-soft)] px-3 py-1 text-xs font-bold text-[var(--fm-mint-soft-text)]">
                                        <ShieldCheck className="h-3.5 w-3.5" />
                                        $0 Upfront Payment
                                    </span>
                                    <h2
                                        id="request-repair-title"
                                        className="fm-heading mt-2 text-2xl"
                                    >
                                        Request Repair Service
                                    </h2>
                                </div>

                                {/* Compact Service Summary Strip */}
                                <div className="flex items-center gap-3.5 rounded-2xl border border-[var(--fm-surface-border)] bg-[var(--fm-canvas)] p-3">
                                    <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-xl bg-[var(--fm-primary-soft)]">
                                        <Image
                                            src={service.image}
                                            alt={service.title}
                                            fill
                                            sizes="64px"
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-bold text-[var(--fm-ink)]">
                                            {service.title}
                                        </p>
                                        <p className="text-xs text-[var(--fm-ink-soft)]">
                                            {service.technician.name} • {service.serviceMode}
                                        </p>
                                    </div>
                                    <span className="shrink-0 rounded-full bg-[var(--fm-amber-soft)] px-3 py-1 text-xs font-extrabold text-[var(--fm-amber-soft-text)]">
                                        From ${service.basePrice}
                                    </span>
                                </div>

                                {/* Duplicate Active Request Banner (409 Conflict) */}
                                {duplicateWarning && (
                                    <div className="flex items-start gap-2.5 rounded-2xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-600 dark:text-red-400">
                                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                        <div className="space-y-1">
                                            <p className="font-bold">{duplicateWarning}</p>
                                            <Link
                                                href="/dashboard/customer/bookings"
                                                onClick={handleClose}
                                                className="inline-flex items-center gap-1 font-bold underline"
                                            >
                                                Check My Bookings
                                                <ArrowRight className="h-3 w-3" />
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                <form
                                    onSubmit={handleSubmit(onSubmit)}
                                    className="space-y-4"
                                    noValidate
                                >
                                    {/* Read-only Customer Identity from Session */}
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div className="space-y-1">
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fm-ink-muted)]">
                                                Your Name
                                            </label>
                                            <div className="relative">
                                                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fm-ink-muted)]" />
                                                <input
                                                    type="text"
                                                    value={customer.name}
                                                    readOnly
                                                    className="fm-input cursor-not-allowed pl-10 pr-3 opacity-75"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fm-ink-muted)]">
                                                Your Email
                                            </label>
                                            <div className="relative">
                                                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fm-ink-muted)]" />
                                                <input
                                                    type="email"
                                                    value={customer.email}
                                                    readOnly
                                                    className="fm-input cursor-not-allowed pl-10 pr-3 opacity-75"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Phone + Preferred Date */}
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div className="space-y-1">
                                            <label
                                                htmlFor="customerPhone"
                                                className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fm-ink-soft)]"
                                            >
                                                Phone Number *
                                            </label>
                                            <div className="relative">
                                                <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fm-ink-muted)]" />
                                                <input
                                                    id="customerPhone"
                                                    type="tel"
                                                    placeholder="+880 1700-000000"
                                                    className="fm-input pl-10 pr-3"
                                                    {...register("customerPhone")}
                                                />
                                            </div>
                                            {errors.customerPhone && (
                                                <p className="text-xs font-medium text-red-500">
                                                    {errors.customerPhone.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <label
                                                htmlFor="preferredDate"
                                                className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fm-ink-soft)]"
                                            >
                                                Preferred Date *
                                            </label>
                                            <div className="relative">
                                                <Calendar className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fm-ink-muted)]" />
                                                <input
                                                    id="preferredDate"
                                                    type="date"
                                                    min={todayMin}
                                                    className="fm-input pl-10 pr-3"
                                                    {...register("preferredDate")}
                                                />
                                            </div>
                                            {errors.preferredDate && (
                                                <p className="text-xs font-medium text-red-500">
                                                    {errors.preferredDate.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Service Address */}
                                    <div className="space-y-1">
                                        <label
                                            htmlFor="address"
                                            className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fm-ink-soft)]"
                                        >
                                            Service Address *
                                        </label>
                                        <div className="relative">
                                            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fm-ink-muted)]" />
                                            <input
                                                id="address"
                                                type="text"
                                                placeholder="House, Road, Block, Area (e.g. House 12, Road 5, Dhanmondi)"
                                                className="fm-input pl-10 pr-3"
                                                {...register("address")}
                                            />
                                        </div>
                                        {errors.address && (
                                            <p className="text-xs font-medium text-red-500">
                                                {errors.address.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Problem Description */}
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <label
                                                htmlFor="problemDescription"
                                                className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fm-ink-soft)]"
                                            >
                                                Problem Description *
                                            </label>
                                            <span
                                                className={`text-[11px] font-semibold ${descriptionLength >= 20
                                                        ? "text-[#2BC9A0]"
                                                        : "text-[var(--fm-ink-muted)]"
                                                    }`}
                                            >
                                                {descriptionLength}/20 min chars
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <FileText className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-[var(--fm-ink-muted)]" />
                                            <textarea
                                                id="problemDescription"
                                                rows={4}
                                                placeholder="Explain the device model, symptoms, and any error signs so the technician brings the right tools..."
                                                className="fm-input !h-auto py-3 pl-10 pr-3 leading-relaxed"
                                                {...register("problemDescription")}
                                            />
                                        </div>
                                        {errors.problemDescription && (
                                            <p className="text-xs font-medium text-red-500">
                                                {errors.problemDescription.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            disabled={isSubmitting}
                                            className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--fm-surface-border)] bg-[var(--fm-surface)] px-5 text-sm font-semibold text-[var(--fm-ink)] transition hover:border-[var(--fm-primary)]/40"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="fm-btn-primary h-11"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Submitting Request...
                                                </>
                                            ) : (
                                                <>
                                                    Confirm Repair Request
                                                    <ArrowRight className="h-4 w-4" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}