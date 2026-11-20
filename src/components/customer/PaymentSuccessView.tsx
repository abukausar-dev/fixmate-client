"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import {
    ArrowRight,
    Loader2,
    AlertCircle,
    Wrench,
    Calendar,
    Hash,
    Receipt,
    CheckCircle2,
} from "lucide-react";
import { apiAuthFetch } from "@/lib/api-client";
import type { PaymentRecord } from "@/types/payment";

export function PaymentSuccessView() {
    const searchParams = useSearchParams();
    const prefersReducedMotion = useReducedMotion();
    const sessionId = searchParams.get("session_id");

    const [receipt, setReceipt] = useState<PaymentRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Share the in-flight promise across React StrictMode double-mounts without blocking state updates
    const inFlightRef = useRef<Map<string, Promise<PaymentRecord>>>(new Map());

    useEffect(() => {
        if (!sessionId) {
            setErrorMsg("No Stripe checkout session ID was found in the URL.");
            setLoading(false);
            return;
        }

        const verifiedSessionId = sessionId;
        let active = true;

        async function verifyPayment() {
            try {
                setLoading(true);
                setErrorMsg(null);

                let requestPromise = inFlightRef.current.get(verifiedSessionId);
                if (!requestPromise) {
                    requestPromise = apiAuthFetch<PaymentRecord>(
                        "/api/payments/verify-session",
                        {
                            method: "POST",
                            body: JSON.stringify({ sessionId: verifiedSessionId }),
                        }
                    ).then((res) => res.data);

                    inFlightRef.current.set(verifiedSessionId, requestPromise);
                }

                const data = await requestPromise;
                if (active) {
                    setReceipt(data);
                }
            } catch (err) {
                inFlightRef.current.delete(verifiedSessionId);
                if (active) {
                    setErrorMsg(
                        err instanceof Error
                            ? err.message
                            : "Could not verify your payment with Stripe."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        verifyPayment();
        return () => {
            active = false;
        };
    }, [sessionId]);

    if (loading) {
        return (
            <div className="mx-auto max-w-xl py-10">
                <div className="fm-glass-float flex flex-col items-center rounded-[36px] p-8 text-center sm:p-12">
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--fm-primary-soft)] text-[var(--fm-primary)]">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                    <h2 className="fm-heading text-2xl">Confirming Your Payment</h2>
                    <p className="mt-2 max-w-sm text-sm text-[var(--fm-ink-soft)]">
                        We are verifying your checkout session directly with Stripe and
                        generating your receipt...
                    </p>
                </div>
            </div>
        );
    }

    if (errorMsg || !receipt) {
        return (
            <div className="mx-auto max-w-xl py-10">
                <div className="fm-glass-float flex flex-col items-center rounded-[36px] p-8 text-center sm:p-12">
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-500/15 text-red-500">
                        <AlertCircle className="h-8 w-8" />
                    </div>
                    <h2 className="fm-heading text-2xl">Payment Verification Issue</h2>
                    <p className="mt-2 max-w-md text-sm text-[var(--fm-ink-soft)]">
                        {errorMsg || "Unable to load your payment receipt."}
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <Link
                            href="/dashboard/customer/bookings"
                            className="fm-btn-primary"
                        >
                            Back to My Bookings
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/dashboard/customer/payments"
                            className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--fm-surface-border)] bg-[var(--fm-surface)] px-5 text-sm font-semibold text-[var(--fm-ink)]"
                        >
                            View Payment History
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const paidDateLabel = new Date(receipt.paidAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });

    const referenceCode = (
        receipt.stripePaymentIntentId || receipt.stripeSessionId
    ).slice(-12);

    return (
        <div className="mx-auto max-w-2xl py-6 sm:py-10">
            <motion.div
                initial={
                    prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="fm-glass-float relative overflow-hidden rounded-[36px] p-6 sm:p-10"
            >
                {/* Decorative Glossy Orbs */}
                <div
                    aria-hidden="true"
                    className="fm-orb fm-orb-blue fm-float-slow absolute -right-10 -top-10 h-28 w-28 opacity-55"
                />
                <div
                    aria-hidden="true"
                    className="fm-orb fm-orb-amber fm-float-reverse absolute -bottom-10 -left-10 h-24 w-24 opacity-50"
                />

                <div className="relative z-10 space-y-6">
                    {/* Animated Inline SVG Checkmark */}
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--fm-mint-soft)] text-[#2BC9A0] shadow-sm">
                            <svg
                                viewBox="0 0 64 64"
                                fill="none"
                                className="h-12 w-12"
                                aria-hidden="true"
                            >
                                <motion.circle
                                    cx="32"
                                    cy="32"
                                    r="24"
                                    stroke="currentColor"
                                    strokeWidth="3.5"
                                    initial={prefersReducedMotion ? false : { pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                />
                                <motion.path
                                    d="M21 33L28.5 40.5L44 25"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    initial={prefersReducedMotion ? false : { pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
                                />
                            </svg>
                        </div>

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--fm-mint-soft)] px-3.5 py-1 text-xs font-bold text-[var(--fm-mint-soft-text)]">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Stripe Verified Receipt
                        </span>
                        <h1 className="fm-heading mt-3 text-2xl sm:text-3xl">
                            Payment Successful!
                        </h1>
                        <p className="mt-1.5 max-w-md text-sm text-[var(--fm-ink-soft)]">
                            Thank you for paying through FixMate. Your booking is now marked
                            as paid and archived in your payment history.
                        </p>
                    </div>

                    {/* Receipt Breakdown Box */}
                    <div className="rounded-3xl border border-[var(--fm-surface-border)] bg-[var(--fm-canvas)] p-5 sm:p-6">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--fm-divider)] pb-4">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--fm-ink-muted)]">
                                    Repair Service
                                </p>
                                <p className="fm-heading mt-0.5 text-lg">
                                    {receipt.serviceTitle}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-[var(--fm-mint-soft)] px-4 py-2 text-right">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--fm-mint-soft-text)]">
                                    Amount Paid
                                </p>
                                <p className="text-xl font-extrabold text-[var(--fm-mint-soft-text)]">
                                    ${receipt.amount.toFixed(2)} {receipt.currency}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-3.5 text-xs sm:grid-cols-2">
                            <div className="flex items-start gap-2.5">
                                <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-[var(--fm-primary)]" />
                                <div>
                                    <p className="font-bold text-[var(--fm-ink-muted)]">
                                        Technician
                                    </p>
                                    <p className="font-semibold text-[var(--fm-ink)]">
                                        {receipt.technicianName}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-[#FFB020]" />
                                <div>
                                    <p className="font-bold text-[var(--fm-ink-muted)]">
                                        Paid On
                                    </p>
                                    <p className="font-semibold text-[var(--fm-ink)]">
                                        {paidDateLabel}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <Receipt className="mt-0.5 h-4 w-4 shrink-0 text-[#2BC9A0]" />
                                <div>
                                    <p className="font-bold text-[var(--fm-ink-muted)]">
                                        Category
                                    </p>
                                    <p className="font-semibold text-[var(--fm-ink)]">
                                        {receipt.category}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <Hash className="mt-0.5 h-4 w-4 shrink-0 text-[var(--fm-primary)]" />
                                <div>
                                    <p className="font-bold text-[var(--fm-ink-muted)]">
                                        Transaction Ref
                                    </p>
                                    <p className="font-mono font-semibold text-[var(--fm-ink)]">
                                        ...{referenceCode}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Actions */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Link
                            href="/dashboard/customer/payments"
                            className="fm-btn-primary h-11"
                        >
                            View Payment History
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/dashboard/customer/bookings"
                            className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--fm-surface-border)] bg-[var(--fm-surface)] px-5 text-sm font-semibold text-[var(--fm-ink)] transition hover:border-[var(--fm-primary)]/40"
                        >
                            Back to My Bookings
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}