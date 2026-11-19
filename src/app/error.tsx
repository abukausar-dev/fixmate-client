"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex min-h-[75vh] items-center justify-center px-4 py-12">
            <div className="fm-glass-float w-full max-w-md space-y-5 rounded-[32px] p-8 text-center sm:p-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/15 text-red-500">
                    <AlertTriangle className="h-8 w-8" />
                </div>

                <div className="space-y-2">
                    <h2 className="fm-heading text-2xl">Something went wrong!</h2>
                    <p className="text-sm leading-relaxed text-[var(--fm-ink-soft)]">
                        {error.message ||
                            "An unexpected error occurred while loading this page."}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => reset()}
                    className="fm-btn-primary"
                >
                    <RotateCcw className="h-4 w-4" />
                    Try Again
                </button>
            </div>
        </div>
    );
}