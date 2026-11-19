"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
        <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-[#F4F7F8]/85 backdrop-blur-md">
            <div className="fm-container flex h-20 items-center justify-between gap-4">
                {/* Left: Brand Logo */}
                <FixMateLogo />

                {/* Center: Verve-style Floating Pill Navigation */}
                <nav
                    aria-label="Main Navigation"
                    className="fm-pill-nav hidden md:flex items-center gap-1"
                >
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${active
                                        ? "bg-[#102B3F] text-white shadow-sm"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-[#102B3F]"
                                    }`}
                            >
                                <Icon
                                    className={`h-4 w-4 ${active ? "text-[#65D8C4]" : "text-slate-400"
                                        }`}
                                />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Right: Auth Controls or User Profile Pill */}
                <div className="hidden md:flex items-center gap-3">
                    {isPending ? (
                        <div className="h-10 w-32 animate-pulse rounded-full bg-slate-200/70" />
                    ) : user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setDropdownOpen((prev) => !prev)}
                                className="flex items-center gap-3 rounded-full border border-slate-200/90 bg-white py-1.5 pl-1.5 pr-3.5 shadow-sm transition hover:border-[#176B72]/40"
                            >
                                {user.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={user.image}
                                        alt={user.name || "User avatar"}
                                        className="h-9 w-9 rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#176B72] text-xs font-bold text-white">
                                        {initials}
                                    </span>
                                )}
                                <div className="text-left leading-tight">
                                    <p className="max-w-[130px] truncate text-sm font-semibold text-[#102B3F]">
                                        {user.name}
                                    </p>
                                    <p className="text-[11px] font-medium capitalize text-[#176B72]">
                                        {userRole}
                                    </p>
                                </div>
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2.5 w-64 rounded-3xl border border-slate-200/90 bg-white p-2 shadow-xl shadow-slate-900/10">
                                    <div className="border-b border-slate-100 px-3.5 py-3">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="truncate text-sm font-bold text-[#102B3F]">
                                                {user.name}
                                            </p>
                                            <span className="rounded-full bg-[#E3F5EE] px-2.5 py-0.5 text-[11px] font-semibold capitalize text-[#176B72]">
                                                {userRole}
                                            </span>
                                        </div>
                                        <p className="mt-0.5 truncate text-xs text-slate-500">
                                            {user.email}
                                        </p>
                                    </div>

                                    <div className="py-1.5 space-y-0.5">
                                        <Link
                                            href={dashboardHref}
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:bg-[#F4F7F8] hover:text-[#102B3F]"
                                        >
                                            <LayoutDashboard className="h-4 w-4 text-[#176B72]" />
                                            <span>Dashboard</span>
                                        </Link>

                                        <Link
                                            href="/dashboard/profile"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:bg-[#F4F7F8] hover:text-[#102B3F]"
                                        >
                                            <UserCircle className="h-4 w-4 text-[#176B72]" />
                                            <span>Update Profile</span>
                                        </Link>
                                    </div>

                                    <div className="border-t border-slate-100 pt-1.5">
                                        <button
                                            type="button"
                                            onClick={handleSignOut}
                                            className="flex w-full items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/sign-in"
                                className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#102B3F] transition hover:bg-white"
                            >
                                Sign In
                            </Link>
                            <Link href="/sign-up" className="fm-btn-primary">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Hamburger Button */}
                <button
                    type="button"
                    onClick={() => setMobileOpen((prev) => !prev)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-[#102B3F] md:hidden"
                    aria-label="Toggle Menu"
                >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="border-t border-slate-200/80 bg-white px-4 pb-6 pt-4 md:hidden">
                    <div className="space-y-1.5">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${active
                                            ? "bg-[#102B3F] text-white"
                                            : "text-slate-700 hover:bg-slate-100"
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-4">
                        {user ? (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between rounded-2xl bg-[#F4F7F8] px-4 py-3">
                                    <div>
                                        <p className="text-sm font-bold text-[#102B3F]">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-slate-500">{user.email}</p>
                                    </div>
                                    <span className="rounded-full bg-[#E3F5EE] px-2.5 py-1 text-xs font-semibold capitalize text-[#176B72]">
                                        {userRole}
                                    </span>
                                </div>
                                <Link
                                    href={dashboardHref}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2.5 rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                                >
                                    <LayoutDashboard className="h-4 w-4 text-[#176B72]" />
                                    <span>Dashboard</span>
                                </Link>
                                <Link
                                    href="/dashboard/profile"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2.5 rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                                >
                                    <UserCircle className="h-4 w-4 text-[#176B72]" />
                                    <span>Update Profile</span>
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleSignOut}
                                    className="flex w-full items-center gap-2.5 rounded-2xl px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
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
                                    className="flex items-center justify-center rounded-full border border-slate-300 py-2.5 text-sm font-semibold text-[#102B3F]"
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
                </div>
            )}
        </header>
    );
}