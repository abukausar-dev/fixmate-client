"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
    Home,
    Wrench,
    Info,
    LayoutDashboard,
    UserCircle,
    LogOut,
    Menu,
    X,
    ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { signOut, useSession } from "@/lib/auth-client";
import { getDashboardPath } from "@/lib/role-routes";
import { FixMateLogo } from "@/components/shared/FixMateLogo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

const NAV_ITEMS = [
    { label: "Home", href: "/", icon: Home },
    { label: "Services", href: "/services", icon: Wrench },
    { label: "How It Works", href: "/about", icon: Info },
];

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, isPending } = useSession();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const user = session?.user as
        | {
            name?: string;
            email?: string;
            image?: string | null;
            role?: string;
        }
        | undefined;

    const userRole = user?.role || "customer";
    const dashboardHref = getDashboardPath(userRole);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    const handleSignOut = async () => {
        setDropdownOpen(false);
        setMobileOpen(false);
        await signOut();
        toast.success("Signed out successfully");
        router.push("/");
        router.refresh();
    };

    const initials = (user?.name || "U")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <header className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8">
            <div className="fm-pill-nav mx-auto flex h-[68px] w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-5">
                {/* Left: Brand Logo */}
                <FixMateLogo />

                {/* Center: Nav Links with Visible Sliding Active Pill (z-0 pill under z-10 text) */}
                <nav
                    aria-label="Main Navigation"
                    className="hidden md:flex items-center gap-1 rounded-full bg-[var(--fm-nav-track)] p-1"
                >
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${active
                                        ? "text-white"
                                        : "text-[var(--fm-ink-soft)] hover:text-[var(--fm-ink)]"
                                    }`}
                            >
                                {active && (
                                    <motion.span
                                        layoutId="fm-nav-active-pill"
                                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                                        className="absolute inset-0 z-0 rounded-full bg-[var(--fm-active-pill)] shadow-sm"
                                    />
                                )}
                                <Icon
                                    className={`relative z-10 h-4 w-4 ${active
                                            ? "text-[var(--fm-active-icon)]"
                                            : "text-[var(--fm-ink-muted)]"
                                        }`}
                                />
                                <span className="relative z-10">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Right: Theme Toggle + Auth Controls or User Profile Dropdown */}
                <div className="hidden md:flex items-center gap-2.5">
                    <ThemeToggle />

                    {isPending ? (
                        <div className="fm-shimmer h-10 w-36 rounded-full" />
                    ) : user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setDropdownOpen((prev) => !prev)}
                                className="flex items-center gap-2.5 rounded-full border border-[var(--fm-surface-border)] bg-[var(--fm-surface)] py-1 pl-1.5 pr-3.5 shadow-sm transition hover:border-[var(--fm-primary)]/40"
                            >
                                {user.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={user.image}
                                        alt={user.name || "User avatar"}
                                        className="h-9 w-9 rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2F6BFF] text-xs font-bold text-white">
                                        {initials}
                                    </span>
                                )}
                                <div className="text-left leading-tight">
                                    <p className="max-w-[125px] truncate text-sm font-semibold text-[var(--fm-ink)]">
                                        {user.name}
                                    </p>
                                    <p className="text-[11px] font-semibold capitalize text-[var(--fm-primary)]">
                                        {userRole}
                                    </p>
                                </div>
                                <ChevronDown
                                    className={`h-4 w-4 text-[var(--fm-ink-muted)] transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            <AnimatePresence>
                                {dropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                        transition={{ duration: 0.16, ease: "easeOut" }}
                                        className="fm-glass-float absolute right-0 mt-3 w-64 rounded-[24px] p-2"
                                    >
                                        <div className="border-b border-[var(--fm-divider)] px-3.5 py-3">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="truncate text-sm font-bold text-[var(--fm-ink)]">
                                                    {user.name}
                                                </p>
                                                <span className="rounded-full bg-[var(--fm-primary-soft)] px-2.5 py-0.5 text-[11px] font-bold capitalize text-[var(--fm-primary-soft-text)]">
                                                    {userRole}
                                                </span>
                                            </div>
                                            <p className="mt-0.5 truncate text-xs text-[var(--fm-ink-muted)]">
                                                {user.email}
                                            </p>
                                        </div>

                                        <div className="space-y-0.5 py-1.5">
                                            <Link
                                                href={dashboardHref}
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-sm font-medium text-[var(--fm-ink-soft)] transition hover:bg-[var(--fm-nav-track)] hover:text-[var(--fm-ink)]"
                                            >
                                                <LayoutDashboard className="h-4 w-4 text-[var(--fm-primary)]" />
                                                <span>Dashboard</span>
                                            </Link>

                                            <Link
                                                href="/dashboard/profile"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-sm font-medium text-[var(--fm-ink-soft)] transition hover:bg-[var(--fm-nav-track)] hover:text-[var(--fm-ink)]"
                                            >
                                                <UserCircle className="h-4 w-4 text-[var(--fm-primary)]" />
                                                <span>Update Profile</span>
                                            </Link>
                                        </div>

                                        <div className="border-t border-[var(--fm-divider)] pt-1.5">
                                            <button
                                                type="button"
                                                onClick={handleSignOut}
                                                className="flex w-full items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-500/10"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/sign-in"
                                className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--fm-ink)] transition hover:bg-[var(--fm-nav-track)]"
                            >
                                Sign In
                            </Link>
                            <Link href="/sign-up" className="fm-btn-primary">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Right Controls: Theme Toggle + Hamburger */}
                <div className="flex items-center gap-2 md:hidden">
                    <ThemeToggle />
                    <button
                        type="button"
                        onClick={() => setMobileOpen((prev) => !prev)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--fm-surface-border)] bg-[var(--fm-surface)] text-[var(--fm-ink)] shadow-sm"
                        aria-label="Toggle Menu"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Glass Sheet */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fm-glass-float mx-auto mt-3 max-w-7xl rounded-[28px] p-4 md:hidden"
                    >
                        <div className="space-y-1">
                            {NAV_ITEMS.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${active
                                                ? "bg-[var(--fm-active-pill)] text-white"
                                                : "text-[var(--fm-ink-soft)] hover:bg-[var(--fm-nav-track)] hover:text-[var(--fm-ink)]"
                                            }`}
                                    >
                                        <Icon
                                            className={`h-4 w-4 ${active
                                                    ? "text-[var(--fm-active-icon)]"
                                                    : "text-[var(--fm-ink-muted)]"
                                                }`}
                                        />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="mt-4 border-t border-[var(--fm-divider)] pt-4">
                            {user ? (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between rounded-2xl bg-[var(--fm-nav-track)] px-4 py-3">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-bold text-[var(--fm-ink)]">
                                                {user.name}
                                            </p>
                                            <p className="truncate text-xs text-[var(--fm-ink-muted)]">
                                                {user.email}
                                            </p>
                                        </div>
                                        <span className="rounded-full bg-[var(--fm-primary-soft)] px-2.5 py-1 text-xs font-bold capitalize text-[var(--fm-primary-soft-text)]">
                                            {userRole}
                                        </span>
                                    </div>

                                    <Link
                                        href={dashboardHref}
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center gap-2.5 rounded-2xl px-4 py-2.5 text-sm font-semibold text-[var(--fm-ink-soft)] hover:bg-[var(--fm-nav-track)]"
                                    >
                                        <LayoutDashboard className="h-4 w-4 text-[var(--fm-primary)]" />
                                        <span>Dashboard</span>
                                    </Link>

                                    <Link
                                        href="/dashboard/profile"
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center gap-2.5 rounded-2xl px-4 py-2.5 text-sm font-semibold text-[var(--fm-ink-soft)] hover:bg-[var(--fm-nav-track)]"
                                    >
                                        <UserCircle className="h-4 w-4 text-[var(--fm-primary)]" />
                                        <span>Update Profile</span>
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={handleSignOut}
                                        className="flex w-full items-center gap-2.5 rounded-2xl px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-500/10"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        href="/sign-in"
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center justify-center rounded-full border border-[var(--fm-surface-border)] bg-[var(--fm-surface)] py-2.5 text-sm font-semibold text-[var(--fm-ink)]"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/sign-up"
                                        onClick={() => setMobileOpen(false)}
                                        className="fm-btn-primary"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}