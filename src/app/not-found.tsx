import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
            {/* Subtle Decorative Orbs */}
            <div
                aria-hidden="true"
                className="fm-orb fm-orb-blue fm-float-slow absolute right-[12%] top-[18%] h-28 w-28 opacity-65"
            />
            <div
                aria-hidden="true"
                className="fm-orb fm-orb-amber fm-float-reverse hidden sm:block absolute bottom-[18%] left-[14%] h-20 w-20 opacity-65"
            />

            <div className="fm-glass-float relative z-10 w-full max-w-lg space-y-6 rounded-[36px] p-8 text-center sm:p-12">
                {/* Inline Repair Wrench + Gear SVG Illustration */}
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-[var(--fm-primary-soft)] text-[var(--fm-primary)]">
                    <svg
                        viewBox="0 0 64 64"
                        fill="none"
                        className="h-14 w-14"
                        aria-hidden="true"
                    >
                        <circle
                            cx="32"
                            cy="32"
                            r="26"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeDasharray="6 6"
                            opacity="0.35"
                        />
                        <path
                            d="M42.2 21.8C38.9 18.5 34.1 17.8 30.2 19.8L35.8 25.4L32.8 28.4L27.2 22.8C25.2 26.7 25.9 31.5 29.2 34.8C32.1 37.7 36.2 38.6 39.8 37.2L47 44.4C48.3 45.7 50.4 45.7 51.7 44.4C53 43.1 53 41 51.7 39.7L44.5 32.5C45.9 28.9 45 24.8 42.2 21.8Z"
                            fill="currentColor"
                        />
                        <circle cx="20" cy="44" r="5" fill="#FFB020" />
                    </svg>
                </div>

                <div className="space-y-2.5">
                    <span className="inline-flex rounded-full bg-[var(--fm-amber-soft)] px-4 py-1 text-xs font-bold uppercase tracking-wider text-[var(--fm-amber-soft-text)]">
                        Error 404 • Route Needs Repair
                    </span>
                    <h1 className="fm-heading text-3xl sm:text-4xl">
                        We couldn&apos;t find that page
                    </h1>
                    <p className="text-sm leading-relaxed text-[var(--fm-ink-soft)]">
                        The service or route you are looking for might have been moved,
                        removed, or is currently unavailable.
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <Link href="/" className="fm-btn-primary">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Link>
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 rounded-full border border-[var(--fm-surface-border)] bg-[var(--fm-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--fm-ink)] shadow-sm transition hover:border-[var(--fm-primary)]/40"
                    >
                        <Search className="h-4 w-4 text-[var(--fm-primary)]" />
                        Browse Services
                    </Link>
                </div>
            </div>
        </div>
    );
}