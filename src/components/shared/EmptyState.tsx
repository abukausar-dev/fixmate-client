import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface EmptyStateProps {
    variant?: "search" | "wrench" | "box";
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
}

export function EmptyState({
    variant = "search",
    title,
    description,
    actionLabel,
    actionHref,
    onAction,
}: EmptyStateProps) {
    return (
        <div className="fm-glass flex flex-col items-center justify-center rounded-[32px] px-6 py-12 text-center sm:px-10 sm:py-14">
            {/* Inline SVG Illustration */}
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--fm-primary-soft)] text-[var(--fm-primary)] shadow-sm">
                {variant === "wrench" && (
                    <svg
                        viewBox="0 0 64 64"
                        fill="none"
                        className="h-12 w-12"
                        aria-hidden="true"
                    >
                        <circle
                            cx="32"
                            cy="32"
                            r="25"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeDasharray="6 6"
                            opacity="0.35"
                        />
                        <path
                            d="M41.8 22.2C38.6 19 34 18.4 30.2 20.3L35.6 25.7L32.8 28.5L27.4 23.1C25.5 26.9 26.1 31.5 29.3 34.7C32.1 37.5 36.1 38.4 39.6 37L46.4 43.8C47.7 45.1 49.7 45.1 51 43.8C52.3 42.5 52.3 40.5 51 39.2L44.2 32.4C45.6 28.9 44.7 24.9 41.8 22.2Z"
                            fill="currentColor"
                        />
                        <circle cx="20.5" cy="43.5" r="4.5" fill="#FFB020" />
                    </svg>
                )}

                {variant === "search" && (
                    <svg
                        viewBox="0 0 64 64"
                        fill="none"
                        className="h-12 w-12"
                        aria-hidden="true"
                    >
                        <circle
                            cx="29"
                            cy="29"
                            r="14"
                            stroke="currentColor"
                            strokeWidth="3.5"
                        />
                        <path
                            d="M39.5 39.5L50 50"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                        />
                        <circle cx="24" cy="24" r="3" fill="#FFB020" />
                    </svg>
                )}

                {variant === "box" && (
                    <svg
                        viewBox="0 0 64 64"
                        fill="none"
                        className="h-12 w-12"
                        aria-hidden="true"
                    >
                        <path
                            d="M14 24L32 14L50 24V42L32 52L14 42V24Z"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M14 24L32 34L50 24M32 34V52"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinejoin="round"
                        />
                        <circle cx="48" cy="18" r="4.5" fill="#2BC9A0" />
                    </svg>
                )}
            </div>

            <h3 className="fm-heading text-xl sm:text-2xl">{title}</h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--fm-ink-soft)]">
                {description}
            </p>

            {actionLabel && actionHref && (
                <Link href={actionHref} className="fm-btn-primary mt-6">
                    {actionLabel}
                    <ArrowRight className="h-4 w-4" />
                </Link>
            )}

            {actionLabel && !actionHref && onAction && (
                <button
                    type="button"
                    onClick={onAction}
                    className="fm-btn-primary mt-6"
                >
                    {actionLabel}
                    <ArrowRight className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}