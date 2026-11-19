"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AlertTriangle, Loader2, X } from "lucide-react";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "danger" | "primary";
    loading?: boolean;
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "danger",
    loading = false,
}: ConfirmDialogProps) {
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !loading) onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isOpen, loading, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => !loading && onClose()}
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
                        className="fm-glass-float relative z-10 w-full max-w-md rounded-3xl p-6 sm:p-7"
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            aria-label="Close dialog"
                            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--fm-ink-muted)] hover:text-[var(--fm-ink)]"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="flex items-start gap-4">
                            <span
                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${variant === "danger"
                                        ? "bg-red-500/15 text-red-500"
                                        : "bg-[var(--fm-primary-soft)] text-[var(--fm-primary)]"
                                    }`}
                            >
                                <AlertTriangle className="h-6 w-6" />
                            </span>

                            <div className="space-y-1.5 pr-4">
                                <h3 className="fm-heading text-lg">{title}</h3>
                                <p className="text-sm leading-relaxed text-[var(--fm-ink-soft)]">
                                    {description}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--fm-surface-border)] bg-[var(--fm-surface)] px-5 text-sm font-semibold text-[var(--fm-ink)] transition hover:border-[var(--fm-primary)]/40"
                            >
                                {cancelLabel}
                            </button>

                            <button
                                type="button"
                                onClick={onConfirm}
                                disabled={loading}
                                className={`inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 ${variant === "danger"
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-[var(--fm-primary)] hover:bg-[var(--fm-primary-dark)]"
                                    }`}
                            >
                                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                {confirmLabel}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}