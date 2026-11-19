"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X, DollarSign, CheckCircle2, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { apiAuthFetch } from "@/lib/api-client";
import type { BookingItem } from "@/types/booking";

interface CompleteJobModalProps {
    booking: BookingItem | null;
    onClose: () => void;
    onCompleted: (updated: BookingItem) => void;
}

export function CompleteJobModal({
    booking,
    onClose,
    onCompleted,
}: CompleteJobModalProps) {
    const prefersReducedMotion = useReducedMotion();
    const [finalAmount, setFinalAmount] = useState("");
    const [technicianNote, setTechnicianNote] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (booking) {
            setFinalAmount(String(booking.basePrice));
            setTechnicianNote("");
        }
    }, [booking]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!booking) return;

        const amountNumber = Number(finalAmount);
        if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
            toast.error("Please enter a valid final amount greater than 0");
            return;
        }

        try {
            setSubmitting(true);
            const res = await apiAuthFetch<BookingItem>(
                `/api/bookings/${booking._id}/status`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        status: "completed",
                        finalAmount: amountNumber,
                        technicianNote: technicianNote.trim() || undefined,
                    }),
                }
            );
            toast.success("Job marked as completed! Customer can now pay online.");
            onCompleted(res.data);
            onClose();
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Could not complete job"
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {booking && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => !submitting && onClose()}
                        className="fixed inset-0 bg-[#060E1D]/60 backdrop-blur-md"
                    />

                    <motion.div
                        initial={
                            prefersReducedMotion
                                ? { opacity: 0 }
                                : { opacity: 0, scale: 0.96, y: 12 }
                        }
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={
                            prefersReducedMotion
                                ? { opacity: 0 }
                                : { opacity: 0, scale: 0.96, y: 8 }
                        }
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="fm-glass-float relative z-10 w-full max-w-md rounded-[32px] p-6 sm:p-7"
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            aria-label="Close modal"
                            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--fm-ink-muted)] hover:text-[var(--fm-ink)]"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="space-y-1.5 pr-6">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--fm-mint-soft)] px-3 py-1 text-xs font-bold text-[var(--fm-mint-soft-text)]">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Final Step
                            </span>
                            <h3 className="fm-heading text-xl">Complete Repair Job</h3>
                            <p className="text-xs text-[var(--fm-ink-soft)]">
                                Confirm the final payable amount for{" "}
                                <strong className="text-[var(--fm-ink)]">
                                    {booking.serviceTitle}
                                </strong>
                                . This unlocks Stripe Checkout for the customer.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                            <div className="space-y-1">
                                <label
                                    htmlFor="finalAmount"
                                    className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fm-ink-soft)]"
                                >
                                    Final Amount (USD) *
                                </label>
                                <div className="relative">
                                    <DollarSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fm-ink-muted)]" />
                                    <input
                                        id="finalAmount"
                                        type="number"
                                        step="0.01"
                                        min="1"
                                        required
                                        value={finalAmount}
                                        onChange={(e) => setFinalAmount(e.target.value)}
                                        className="fm-input pl-10 pr-4 font-bold"
                                    />
                                </div>
                                <p className="text-[11px] text-[var(--fm-ink-muted)]">
                                    Original starting estimate: ${booking.basePrice}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <label
                                    htmlFor="technicianNote"
                                    className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fm-ink-soft)]"
                                >
                                    Repair Summary Note (Optional)
                                </label>
                                <div className="relative">
                                    <FileText className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-[var(--fm-ink-muted)]" />
                                    <textarea
                                        id="technicianNote"
                                        rows={3}
                                        value={technicianNote}
                                        onChange={(e) => setTechnicianNote(e.target.value)}
                                        placeholder="e.g. Replaced damaged display flex cable and tested touch response."
                                        className="fm-input !h-auto py-3 pl-10 pr-3"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col-reverse gap-2.5 pt-2 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={submitting}
                                    className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--fm-surface-border)] bg-[var(--fm-surface)] px-5 text-sm font-semibold text-[var(--fm-ink)]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="fm-btn-primary h-11"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Completing...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="h-4 w-4" />
                                            Confirm &amp; Complete
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}