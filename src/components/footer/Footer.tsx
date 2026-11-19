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
        <footer className="relative mt-20 overflow-hidden rounded-t-[36px] bg-[#0B1F3A] text-slate-300">
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

            <div className="fm-container relative z-10 py-14 sm:py-16">
                <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-2 md:text-left lg:grid-cols-4">
                    {/* Column 1: Brand & Socials */}
                    <div className="flex flex-col items-center space-y-4 md:items-start">
                        <FixMateLogo variant="light" />
                        <p className="max-w-xs text-sm leading-relaxed text-slate-300/90 md:max-w-none">
                            On-demand smart device and home appliance repair marketplace.
                            Track every repair step-by-step and pay online only after your
                            job is completed.
                        </p>
                        <div className="flex items-center justify-center gap-2.5 pt-1 md:justify-start">
                            {/* New X Icon */}
                            <a
                                href="https://x.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Follow FixMate on X"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:scale-105 hover:bg-[#2F6BFF]"
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
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-sm font-bold text-white transition hover:scale-105 hover:bg-[#2F6BFF]"
                            >
                                in
                            </a>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="FixMate on Facebook"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-sm font-bold text-white transition hover:scale-105 hover:bg-[#2F6BFF]"
                            >
                                f
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="fm-heading text-sm uppercase tracking-wider !text-white">
                            Quick Links
                        </h3>
                        <ul className="mt-4 space-y-2.5 text-sm">
                            <li>
                                <Link href="/" className="transition hover:text-[#9CC2FF]">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/services"
                                    className="transition hover:text-[#9CC2FF]"
                                >
                                    Browse Services
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="transition hover:text-[#9CC2FF]">
                                    How It Works & About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/sign-up"
                                    className="transition hover:text-[#9CC2FF]"
                                >
                                    Become a Technician
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Popular Categories */}
                    <div>
                        <h3 className="fm-heading text-sm uppercase tracking-wider !text-white">
                            Repair Categories
                        </h3>
                        <ul className="mt-4 grid grid-cols-1 gap-2 text-sm">
                            {CATEGORIES.map((category) => (
                                <li key={category}>
                                    <Link
                                        href={`/services?category=${encodeURIComponent(category)}`}
                                        className="transition hover:text-[#9CC2FF]"
                                    >
                                        {category} Repair
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Contact Info */}
                    <div>
                        <h3 className="fm-heading text-sm uppercase tracking-wider !text-white">
                            Contact & Support
                        </h3>
                        <ul className="mt-4 space-y-3 text-sm">
                            <li className="flex items-start justify-center gap-2.5 md:justify-start">
                                <MapPin className="h-4 w-4 shrink-0 text-[#FFB020]" />
                                <span>Level 4, Gulshan Avenue, Dhaka 1212, Bangladesh</span>
                            </li>
                            <li className="flex items-center justify-center gap-2.5 md:justify-start">
                                <Phone className="h-4 w-4 shrink-0 text-[#2BC9A0]" />
                                <span>+880 1700-123456</span>
                            </li>
                            <li className="flex items-center justify-center gap-2.5 md:justify-start">
                                <Mail className="h-4 w-4 shrink-0 text-[#9CC2FF]" />
                                <span>support@fixmate.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Thin Divider & Copyright */}
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row">
                    <p>© 2026 FixMate Inc. All rights reserved.</p>
                    <p>Pay-After-Completion Verified Repair Marketplace</p>
                </div>
            </div>
        </footer>
    );
}