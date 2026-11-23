import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { FixMateLogo } from "@/components/shared/FixMateLogo";

const CATEGORIES = [
    "Smartphone",
    "Laptop & PC",
    "AC",
    "Refrigerator",
    "TV",
    "Washing Machine",
    "Electrical",
];

export function Footer() {
    return (
        <footer className="relative mt-16 overflow-hidden rounded-t-[28px] bg-[#0B1F3A] text-slate-300 md:mt-20 md:rounded-t-[36px]">
            {/* Subtle ambient orb glows inside the deep navy footer */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-25 blur-3xl"
                style={{ background: "radial-gradient(circle, #2F6BFF, transparent 70%)" }}
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full opacity-20 blur-3xl"
                style={{ background: "radial-gradient(circle, #FFB020, transparent 70%)" }}
            />

            <div className="fm-container relative z-10 py-12 sm:py-16">
                <div className="grid grid-cols-2 gap-x-6 gap-y-8 text-left md:grid-cols-2 md:gap-x-10 md:gap-y-10 md:text-left lg:grid-cols-4">
                    {/* Column 1: Brand & Socials */}
                    <div className="col-span-2 flex flex-col items-start space-y-4 border-b border-white/10 pb-7 md:col-span-1 md:border-b-0 md:pb-0">
                        <FixMateLogo variant="light" />
                        <p className="text-sm leading-relaxed text-slate-300/90 md:max-w-none">
                            On-demand smart device and home appliance repair marketplace.
                            Track every repair step-by-step and pay online only after your
                            job is completed.
                        </p>
                        <div className="flex items-center justify-start gap-2.5 pt-1">
                            {/* New X Icon */}
                            <a
                                href="https://x.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Follow FixMate on X"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:scale-105 hover:bg-[#2F6BFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9CC2FF]"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="h-4 w-4 fill-current"
                                >
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="FixMate on LinkedIn"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-sm font-bold text-white transition hover:scale-105 hover:bg-[#2F6BFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9CC2FF]"
                            >
                                in
                            </a>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="FixMate on Facebook"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-sm font-bold text-white transition hover:scale-105 hover:bg-[#2F6BFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9CC2FF]"
                            >
                                f
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="col-span-1">
                        <h3 className="fm-heading text-xs uppercase tracking-wider !text-white md:text-sm">
                            Quick Links
                        </h3>
                        <ul className="mt-3.5 space-y-2.5 text-[13.5px] md:mt-4 md:text-sm">
                            <li>
                                <Link
                                    href="/"
                                    className="inline-block py-0.5 transition hover:text-[#9CC2FF] md:inline md:py-0"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/services"
                                    className="inline-block py-0.5 transition hover:text-[#9CC2FF] md:inline md:py-0"
                                >
                                    Browse Services
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="inline-block py-0.5 transition hover:text-[#9CC2FF] md:inline md:py-0"
                                >
                                    How It Works & About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/sign-up"
                                    className="inline-block py-0.5 transition hover:text-[#9CC2FF] md:inline md:py-0"
                                >
                                    Become a Technician
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Popular Categories */}
                    <div className="col-span-1">
                        <h3 className="fm-heading text-xs uppercase tracking-wider !text-white md:text-sm">
                            Repair Categories
                        </h3>
                        <ul className="mt-3.5 grid grid-cols-1 gap-2 text-[13.5px] md:mt-4 md:text-sm">
                            {CATEGORIES.map((category) => (
                                <li key={category}>
                                    <Link
                                        href={`/services?category=${encodeURIComponent(category)}`}
                                        className="inline-block py-0.5 transition hover:text-[#9CC2FF] md:inline md:py-0"
                                    >
                                        {category}
                                        <span className="hidden sm:inline"> Repair</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Contact Info */}
                    <div className="col-span-2 rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:col-span-1 md:rounded-none md:border-0 md:bg-transparent md:p-0">
                        <h3 className="fm-heading text-xs uppercase tracking-wider !text-white md:text-sm">
                            Contact & Support
                        </h3>
                        <ul className="mt-4 space-y-3 text-sm">
                            <li className="flex items-start justify-start gap-2.5">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#FFB020] md:mt-0" />
                                <span className="leading-relaxed md:leading-normal">
                                    Level 4, Gulshan Avenue, Dhaka 1212, Bangladesh
                                </span>
                            </li>
                            <li className="flex items-center justify-start gap-2.5">
                                <Phone className="h-4 w-4 shrink-0 text-[#2BC9A0]" />
                                <a
                                    href="tel:+8801700123456"
                                    className="transition hover:text-[#9CC2FF]"
                                >
                                    +880 1700-123456
                                </a>
                            </li>
                            <li className="flex items-center justify-start gap-2.5">
                                <Mail className="h-4 w-4 shrink-0 text-[#9CC2FF]" />
                                <a
                                    href="mailto:support@fixmate.com"
                                    className="transition hover:text-[#9CC2FF]"
                                >
                                    support@fixmate.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Thin Divider & Copyright */}
                <div className="mt-8 flex flex-col items-start justify-between gap-1.5 border-t border-white/10 pt-6 text-left text-xs text-slate-400 sm:mt-12 sm:flex-row sm:items-center sm:gap-4">
                    <p>© 2026 FixMate Inc. All rights reserved.</p>
                    <p>Pay-After-Completion Verified Repair Marketplace</p>
                </div>
            </div>
        </footer>
    );
}