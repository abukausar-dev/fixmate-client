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
        <footer className="mt-20 border-t border-slate-200/80 bg-[#102B3F] text-slate-300">
            <div className="fm-container py-14">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
                    {/* Column 1: Brand */}
                    <div className="space-y-4">
                        <FixMateLogo variant="light" />
                        <p className="text-sm leading-relaxed text-slate-300/90">
                            On-demand smart device and home appliance repair marketplace.
                            Track every repair step-by-step and pay online only after your
                            job is completed.
                        </p>
                        {/* Social Links with new X logo */}
                        <div className="flex items-center gap-3 pt-1">
                            <a
                                href="https://x.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Follow FixMate on X"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#176B72]"
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
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white transition hover:bg-[#176B72]"
                            >
                                in
                            </a>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="FixMate on Facebook"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white transition hover:bg-[#176B72]"
                            >
                                f
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="fm-heading text-sm font-bold uppercase tracking-wider text-white">
                            Quick Links
                        </h3>
                        <ul className="mt-4 space-y-2.5 text-sm">
                            <li>
                                <Link href="/" className="transition hover:text-[#65D8C4]">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/services"
                                    className="transition hover:text-[#65D8C4]"
                                >
                                    Browse Services
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="transition hover:text-[#65D8C4]">
                                    How It Works & About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/sign-up"
                                    className="transition hover:text-[#65D8C4]"
                                >
                                    Become a Technician
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Popular Categories */}
                    <div>
                        <h3 className="fm-heading text-sm font-bold uppercase tracking-wider text-white">
                            Repair Categories
                        </h3>
                        <ul className="mt-4 grid grid-cols-1 gap-2 text-sm">
                            {CATEGORIES.map((category) => (
                                <li key={category}>
                                    <Link
                                        href={`/services?category=${encodeURIComponent(category)}`}
                                        className="transition hover:text-[#65D8C4]"
                                    >
                                        {category} Repair
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Contact Info */}
                    <div>
                        <h3 className="fm-heading text-sm font-bold uppercase tracking-wider text-white">
                            Contact & Support
                        </h3>
                        <ul className="mt-4 space-y-3 text-sm">
                            <li className="flex items-start gap-2.5">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#65D8C4]" />
                                <span>Level 4, Gulshan Avenue, Dhaka 1212, Bangladesh</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Phone className="h-4 w-4 shrink-0 text-[#65D8C4]" />
                                <span>+880 1700-123456</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Mail className="h-4 w-4 shrink-0 text-[#65D8C4]" />
                                <span>support@fixmate.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row">
                    <p>© 2026 FixMate Inc. All rights reserved.</p>
                    <p>Pay-After-Completion Verified Repair Marketplace</p>
                </div>
            </div>
        </footer>
    );
}