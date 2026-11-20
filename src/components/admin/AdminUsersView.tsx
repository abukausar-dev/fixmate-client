"use client";

import { useEffect, useState } from "react";
import {
    Search,
    X,
    ShieldCheck,
    MapPin,
    Phone,
    Lock,
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { apiAuthFetch } from "@/lib/api-client";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";

type UserRole = "customer" | "technician" | "admin";

interface AdminUserItem {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    image?: string | null;
    phone?: string;
    area?: string;
    createdAt?: string;
}

const ROLE_BADGE_STYLES: Record<UserRole, string> = {
    admin:
        "bg-[var(--fm-amber-soft)] text-[var(--fm-amber-soft-text)]",
    technician:
        "bg-[var(--fm-mint-soft)] text-[var(--fm-mint-soft-text)]",
    customer:
        "bg-[var(--fm-primary-soft)] text-[var(--fm-primary-soft-text)]",
};

export function AdminUsersView() {
    const { data: session } = useSession();
    const currentAdminEmail = session?.user?.email;

    const [users, setUsers] = useState<AdminUserItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [pendingRoleChange, setPendingRoleChange] = useState<{
        user: AdminUserItem;
        nextRole: UserRole;
    } | null>(null);
    const [updatingRole, setUpdatingRole] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchInput.trim());
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        let active = true;

        async function loadUsers() {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                if (roleFilter !== "all") params.set("role", roleFilter);
                if (debouncedSearch) params.set("search", debouncedSearch);

                const qs = params.toString();
                const res = await apiAuthFetch<AdminUserItem[]>(
                    qs ? `/api/admin/users?${qs}` : "/api/admin/users"
                );
                if (active) setUsers(res.data || []);
            } catch (err) {
                toast.error(
                    err instanceof Error ? err.message : "Failed to load users"
                );
            } finally {
                if (active) setLoading(false);
            }
        }

        loadUsers();
        return () => {
            active = false;
        };
    }, [roleFilter, debouncedSearch]);

    const confirmRoleChange = async () => {
        if (!pendingRoleChange) return;

        try {
            setUpdatingRole(true);
            const { user, nextRole } = pendingRoleChange;
            const res = await apiAuthFetch<AdminUserItem>(
                `/api/admin/users/${user._id}/role`,
                {
                    method: "PATCH",
                    body: JSON.stringify({ role: nextRole }),
                }
            );

            setUsers((prev) =>
                prev.map((item) => (item._id === user._id ? res.data : item))
            );
            toast.success(`Updated ${user.name} to ${nextRole}`);
            setPendingRoleChange(null);
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Could not update user role"
            );
        } finally {
            setUpdatingRole(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="fm-heading text-2xl">Manage Users</h2>
                    <p className="text-sm text-[var(--fm-ink-soft)]">
                        View registered accounts and manage Customer, Technician, and Admin
                        roles.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {(["all", "customer", "technician", "admin"] as const).map((r) => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => setRoleFilter(r)}
                            className={`rounded-full px-4 py-1.5 text-xs font-bold capitalize transition ${roleFilter === r
                                    ? "bg-[var(--fm-active-pill)] text-white shadow-sm"
                                    : "border border-[var(--fm-surface-border)] bg-[var(--fm-surface)] text-[var(--fm-ink-soft)] hover:text-[var(--fm-ink)]"
                                }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Bar */}
            <div className="fm-card p-4">
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fm-primary)]" />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search users by name or email..."
                        aria-label="Search users"
                        className="fm-input pl-10 pr-9"
                    />
                    {searchInput && (
                        <button
                            type="button"
                            onClick={() => setSearchInput("")}
                            aria-label="Clear search"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--fm-ink-muted)] hover:text-[var(--fm-ink)]"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Users List */}
            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="fm-shimmer h-24 rounded-[24px]" />
                    ))}
                </div>
            ) : users.length === 0 ? (
                <EmptyState
                    variant="search"
                    title="No users found"
                    description="Try adjusting your role filter or search query."
                    actionLabel="Show All Users"
                    onAction={() => {
                        setRoleFilter("all");
                        setSearchInput("");
                    }}
                />
            ) : (
                <div className="space-y-3">
                    {users.map((u) => {
                        const isSelf = currentAdminEmail === u.email;
                        const initials = (u.name || "U")
                            .split(" ")
                            .map((w) => w[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase();

                        return (
                            <div
                                key={u._id}
                                className="fm-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="flex min-w-0 items-center gap-3.5">
                                    {u.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={u.image}
                                            alt={u.name}
                                            className="h-12 w-12 shrink-0 rounded-2xl object-cover ring-2 ring-[var(--fm-primary-soft)]"
                                        />
                                    ) : (
                                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--fm-primary-soft)] text-sm font-extrabold text-[var(--fm-primary-soft-text)]">
                                            {initials}
                                        </span>
                                    )}

                                    <div className="min-w-0 space-y-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="truncate text-sm font-bold text-[var(--fm-ink)]">
                                                {u.name}
                                            </p>
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize ${ROLE_BADGE_STYLES[u.role]}`}
                                            >
                                                {u.role === "admin" && (
                                                    <ShieldCheck className="h-3 w-3" />
                                                )}
                                                {u.role}
                                            </span>
                                            {isSelf && (
                                                <span className="rounded-full bg-[var(--fm-nav-track)] px-2 py-0.5 text-[10px] font-bold text-[var(--fm-ink-muted)]">
                                                    You
                                                </span>
                                            )}
                                        </div>

                                        <p className="truncate text-xs text-[var(--fm-ink-muted)]">
                                            {u.email}
                                        </p>

                                        {(u.phone || u.area) && (
                                            <div className="flex flex-wrap gap-3 text-[11px] text-[var(--fm-ink-soft)]">
                                                {u.phone && (
                                                    <span className="inline-flex items-center gap-1">
                                                        <Phone className="h-3 w-3 text-[#2BC9A0]" />
                                                        {u.phone}
                                                    </span>
                                                )}
                                                {u.area && (
                                                    <span className="inline-flex items-center gap-1">
                                                        <MapPin className="h-3 w-3 text-[var(--fm-primary)]" />
                                                        {u.area}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Role Control */}
                                <div className="flex shrink-0 items-center gap-2 border-t border-[var(--fm-divider)] pt-3 sm:border-t-0 sm:pt-0">
                                    {isSelf ? (
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--fm-surface-border)] bg-[var(--fm-canvas)] px-3.5 py-2 text-xs font-bold text-[var(--fm-ink-muted)]">
                                            <Lock className="h-3.5 w-3.5" />
                                            Admin Locked
                                        </span>
                                    ) : (
                                        <select
                                            aria-label={`Change role for ${u.name}`}
                                            value={u.role}
                                            onChange={(e) => {
                                                const nextRole = e.target.value as UserRole;
                                                if (nextRole !== u.role) {
                                                    setPendingRoleChange({ user: u, nextRole });
                                                }
                                            }}
                                            className="fm-input !h-10 !w-36 cursor-pointer px-3 text-xs font-bold capitalize"
                                        >
                                            <option value="customer">Customer</option>
                                            <option value="technician">Technician</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Role Update Confirmation Dialog */}
            <ConfirmDialog
                isOpen={Boolean(pendingRoleChange)}
                onClose={() => setPendingRoleChange(null)}
                onConfirm={confirmRoleChange}
                title="Change user role?"
                description={`Change ${pendingRoleChange?.user.name || "this user"}'s role from "${pendingRoleChange?.user.role}" to "${pendingRoleChange?.nextRole}"? Their dashboard permissions will update immediately.`}
                confirmLabel="Update Role"
                variant="primary"
                loading={updatingRole}
            />
        </div>
    );
}