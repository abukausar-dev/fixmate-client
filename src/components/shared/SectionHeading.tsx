import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeadingProps {
    eyebrow: string;
    title: string;
    subtitle?: string;
    actionLabel?: string;
    actionHref?: string;
    align?: "left" | "center";
    tone?: "light" | "dark";
}

export function SectionHeading({
    eyebrow,
    title,
    subtitle,
    actionLabel,
    actionHref,
    align = "left",
    tone = "light",
}: SectionHeadingProps) {
    const isDark = tone === "dark";
    const isCenter = align === "center";

    return (
        <div
            className={`flex flex-col gap-4 ${isCenter
                    ? "items-center text-center"
                    : "sm:flex-row sm:items-end sm:justify-between"
                }`}
        >
            <div className={isCenter ? "max-w-2xl space-y-2.5" : "max-w-2xl space-y-2"}>
                <span
                    className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider ${isDark
                            ? "bg-white/10 text-[#9CC2FF]"
                            : "bg-[var(--fm-primary-soft)] text-[var(--fm-primary-soft-text)]"
                        }`}
                >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {eyebrow}
                </span>

                <h2 className={`fm-h2 ${isDark ? "!text-white" : ""}`}>{title}</h2>

                {subtitle && (
                    <p
                        className={`text-sm sm:text-base leading-relaxed ${isDark ? "text-slate-300" : "text-[var(--fm-ink-soft)]"
                            }`}
                    >
                        {subtitle}
                    </p>
                )}
            </div>

            {actionLabel && actionHref && !isCenter && (
                <Link
                    href={actionHref}
                    className={`group inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${isDark
                            ? "bg-white/10 text-white hover:bg-white/20"
                            : "border border-[var(--fm-surface-border)] bg-[var(--fm-surface)] text-[var(--fm-ink)] shadow-sm hover:text-[var(--fm-primary)]"
                        }`}
                >
                    <span>{actionLabel}</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
            )}
        </div>
    );
}