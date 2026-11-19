"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
    LayoutDashboard,
    Wrench,
    ClipboardList,
    CreditCard,
    ShieldCheck,
    Users,
    UserCircle,
    LogOut,
    Menu,
    X,
    HelpCircle,
    ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { signOut } from "@/lib/auth-client";
import { FixMateLogo } from "@/components/shared/FixMateLogo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export interface DashboardUser {
    id: string;
    name: string;
    email: string;
    role: "customer" | "technician" | "admin";
    image?: string | null;
}

interface NavLinkItem {
    label: string;
    href: string;
    icon: typeof LayoutDashboard;
    exact?: boolean;
}

const ROLE_MENUS: Record<DashboardUser["role"], NavLinkItem[]> = {
    customer: [
        {
            label: "Overview",
            href: "/dashboard/customer",
            icon: LayoutDashboard,
            exact: true,
        },
        {
            label: "My Bookings",
            href: "/dashboard/customer/bookings",
            icon: ClipboardList,
        },
        {
            label: "Payment History",
            href: "/dashboard/customer/payments",
            icon: CreditCard,
        },
        {
            label: "Update Profile",
            href: "/dashboard/profile",
            icon: UserCircle,
        },
    ],
    technician: [
        {
            label: "Overview",
            href: "/dashboard/technician",
            icon: LayoutDashboard,
            exact: true,
        },
        {
            label: "My Services",
            href: "/dashboard/technician/services",
            icon: Wrench,
        },
        {
            label: "Assigned Bookings",
            href: "/dashboard/technician/bookings",
            icon: ClipboardList,
        },
        {
            label: "Update Profile",
            href: "/dashboard/profile",
            icon: UserCircle,
        },
    ],
    admin: [
        {
            label: "Overview",
            href: "/dashboard/admin",
            icon: LayoutDashboard,
            exact: true,
        },
        {
            label: "Approve Services",
            href: "/dashboard/admin/services",
            icon: ShieldCheck,
        },
        {
            label: "All Bookings",
            href: "/dashboard/admin/bookings",
            icon: ClipboardList,
        },
        {
            label: "Manage Users",
            href: "/dashboard/admin/users",
            icon: Users,
        },
        {
            label: "Update Profile",
            href: "/dashboard/profile",
            icon: UserCircle,
        },
    ],
};

export function DashboardShell({
    user,
    children,
}: {
    user: DashboardUser;
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [greeting, setGreeting] = useState("Welcome back");

    // Compute time-of-day greeting strictly on the client (hydration-safe)
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning");
        else if (hour < 18) setGreeting("Good afternoon");
        else setGreeting("Good evening");
    }, []);

    const menuItems = ROLE_MENUS[user.role] || ROLE_MENUS.customer;
    const firstName = (user.name || "User").split(" ")[0];
    const initials = (user.name || "U")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const isActive = (item: NavLinkItem) => {
        if (item.exact) return pathname === item.href;
        return pathname === item.href || pathname.startsWith(`${item.href}/`);
    };

    const handleSignOut = async () => {
        setDrawerOpen(false);
        await signOut();
        toast.success("Signed out successfully");
        router.push("/");
        router.refresh();
    };

    const renderSidebarContent = (onNavigate?: () => void) => (
        <div className="flex min-h-full flex-col justify-between gap-6">
            <div className="space-y-7">
                {/* Brand Logo (Exact same 40x40 mark everywhere) */}
                <div className="px-1">
                    <FixMateLogo />
                </div>

                {/* Role Menu */}
                <nav aria-label="Dashboard Navigation" className="space-y-1.5">
                    <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-[var(--fm-ink-muted)]">
                        {user.role} Workspace
                    </p>

                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onNavigate}
                                className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${active
                                        ? "bg-[var(--fm-amber-soft)] text-[var(--fm-amber-soft-text)] shadow-sm"
                                        : "text-[var(--fm-ink-soft)] hover:bg-[var(--fm-nav-track)] hover:text-[var(--fm-ink)]"
                                    }`}
                            >
                                {/* Signature short dark navy / cobalt accent bar on left edge of active amber pill */}
                                {active && (
                                    <span
                                        aria-hidden="true"
                                        className="absolute left-1.5 top-1/2 h-6 w-1.5 -translate-y-1/2 rounded-full bg-[var(--fm-active-pill)]"
                                    />
                                )}
                                <Icon
                                    className={`h-4 w-4 shrink-0 ${active
                                            ? "text-[var(--fm-amber-soft-text)]"
                                            : "text-[var(--fm-ink-muted)] group-hover:text-[var(--fm-primary)]"
                                        }`}
                                />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Help & Sign Out Stack */}
            <div className="space-y-3">
                {/* Signature Dark Navy "Need Help?" Card */}
                <div className="fm-bento-navy !rounded-[24px] p-5">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFB020] text-[#0B1F3A] shadow-sm">
                            <HelpCircle className="h-5 w-5" />
                        </span>
                        <div>
                            <p className="fm-heading text-sm !text-white">Need help?</p>
                            <p className="text-[11px] text-slate-300">
                                Review our 4-step policy
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/about"
                        onClick={onNavigate}
                        className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#0B1F3A] transition hover:bg-[#FFB020]"
                    >
                        How FixMate Works
                        <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                </div>

                <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--fm-surface-border)] bg-[var(--fm-canvas)] px-4 py-2.5 text-xs font-bold text-red-500 transition hover:bg-red-500/10"
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen w-full lg:p-5 xl:p-6">
            {/* Art Academy inspired single rounded-[36px] dashboard shell */}
            <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col overflow-hidden bg-[var(--fm-surface)] shadow-[var(--shadow-float)] lg:min-h-[calc(100vh-3rem)] lg:flex-row lg:rounded-[36px] lg:border lg:border-[var(--fm-surface-border)]">
                {/* Desktop Left Sidebar */}
                <aside className="hidden w-[272px] shrink-0 border-r border-[var(--fm-divider)] bg-[var(--fm-surface)] p-6 lg:block">
                    {renderSidebarContent()}
                </aside>

                {/* Mobile Slide-in Sidebar Drawer */}
                <AnimatePresence>
                    {drawerOpen && (
                        <div className="fixed inset-0 z-50 flex lg:hidden">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setDrawerOpen(false)}
                                className="fixed inset-0 bg-[#060E1D]/60 backdrop-blur-sm"
                            />
                            <motion.aside
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                                transition={{ duration: 0.22, ease: "easeOut" }}
                                className="relative z-10 flex h-dvh w-[280px] max-w-[85vw] flex-col overflow-y-auto bg-[var(--fm-surface)] p-5 pb-8 shadow-2xl"
                            >
                                <button
                                    type="button"
                                    onClick={() => setDrawerOpen(false)}
                                    aria-label="Close sidebar menu"
                                    className="absolute right-4 top-5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--fm-surface-border)] bg-[var(--fm-canvas)] text-[var(--fm-ink)]"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                                {renderSidebarContent(() => setDrawerOpen(false))}
                            </motion.aside>
                        </div>
                    )}
                </AnimatePresence>

                {/* Main Column */}
                <div className="flex min-w-0 flex-1 flex-col bg-[var(--fm-canvas)]/45">
                    {/* Top Bar */}
                    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[var(--fm-divider)] bg-[var(--fm-nav-bg)] px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
                        <div className="flex min-w-0 items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setDrawerOpen(true)}
                                aria-label="Open navigation menu"
                                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--fm-surface-border)] bg-[var(--fm-surface)] text-[var(--fm-ink)] shadow-sm lg:hidden"
                            >
                                <Menu className="h-5 w-5" />
                            </button>

                            <div className="min-w-0">
                                <h1 className="fm-heading truncate text-lg sm:text-xl">
                                    {greeting}, {firstName}
                                </h1>
                                <p className="hidden text-xs text-[var(--fm-ink-muted)] sm:block">
                                    Manage your FixMate {user.role} workspace in real time
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 sm:gap-3">
                            <Link
                                href="/services"
                                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[var(--fm-surface-border)] bg-[var(--fm-surface)] px-4 py-2 text-xs font-bold text-[var(--fm-ink)] shadow-sm transition hover:border-[var(--fm-primary)]/40 hover:text-[var(--fm-primary)]"
                            >
                                Browse Marketplace
                                <ExternalLink className="h-3.5 w-3.5" />
                            </Link>

                            <ThemeToggle />

                            {/* Compact Profile Chip */}
                            <Link
                                href="/dashboard/profile"
                                className="flex items-center gap-2.5 rounded-full border border-[var(--fm-surface-border)] bg-[var(--fm-surface)] py-1 pl-1.5 pr-3 shadow-sm transition hover:border-[var(--fm-primary)]/40"
                            >
                                {user.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={user.image}
                                        alt={user.name}
                                        className="h-8 w-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--fm-primary)] text-xs font-bold text-white">
                                        {initials}
                                    </span>
                                )}
                                <div className="hidden text-left leading-tight sm:block">
                                    <p className="max-w-[110px] truncate text-xs font-bold text-[var(--fm-ink)]">
                                        {user.name}
                                    </p>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--fm-primary)]">
                                        {user.role}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </header>

                    {/* Dynamic Workspace Content */}
                    <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
                </div>
            </div>
        </div>
    );
}