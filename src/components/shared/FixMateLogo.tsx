import Link from "next/link";

interface FixMateLogoProps {
    variant?: "dark" | "light";
    className?: string;
}

export function FixMateLogo({
    variant = "dark",
    className = "",
}: FixMateLogoProps) {
    const textColor = variant === "light" ? "text-white" : "text-[#102B3F]";
    const accentColor = variant === "light" ? "text-[#65D8C4]" : "text-[#176B72]";

    return (
        <Link
            href="/"
            className={`group inline-flex items-center gap-2.5 focus:outline-none ${className}`}
        >
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#102B3F] shadow-sm transition-transform duration-200 group-hover:scale-105">
                {/* Verve-inspired dual geometric accent + precision wrench */}
                <svg
                    viewBox="0 0 36 36"
                    fill="none"
                    className="h-6 w-6"
                    aria-hidden="true"
                >
                    <path
                        d="M8 11.5C8 9.567 9.567 8 11.5 8H17V13.5C17 15.433 15.433 17 13.5 17H8V11.5Z"
                        fill="#65D8C4"
                    />
                    <path
                        d="M24.8 11.2C22.9 9.3 20.1 8.9 17.8 10.1L21.1 13.4L19.4 15.1L16.1 11.8C14.9 14.1 15.3 16.9 17.2 18.8C18.9 20.5 21.3 21 23.4 20.2L27.6 24.4C28.4 25.2 29.6 25.2 30.4 24.4C31.2 23.6 31.2 22.4 30.4 21.6L26.2 17.4C27 15.3 26.5 12.9 24.8 11.2Z"
                        fill="#FFFFFF"
                    />
                    <circle cx="11.5" cy="24.5" r="3.5" fill="#F59E0B" />
                </svg>
            </span>

            <div className="flex flex-col leading-none">
                <span
                    className={`fm-heading text-xl font-extrabold tracking-tight ${textColor}`}
                >
                    fix<span className={accentColor}>mate</span>
                </span>
                <span
                    className={`text-[10px] font-medium uppercase tracking-widest ${variant === "light" ? "text-slate-300" : "text-slate-400"
                        }`}
                >
                    Verified Repairs
                </span>
            </div>
        </Link>
    );
}