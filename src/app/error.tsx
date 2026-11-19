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
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="fm-card max-w-md w-full p-8 text-center space-y-5">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <AlertTriangle className="h-7 w-7" />
                </div>
                <h2 className="fm-heading text-2xl font-bold">
                    Something went wrong!
                </h2>
                <p className="text-sm text-slate-500">
                    {error.message || "An unexpected error occurred while loading this page."}
                </p>
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