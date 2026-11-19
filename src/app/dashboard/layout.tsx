import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
    DashboardShell,
    type DashboardUser,
} from "@/components/dashboard/DashboardShell";

function DashboardSkeleton() {
    return (
        <div className="min-h-screen p-4 lg:p-6">
            <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1440px] gap-6 rounded-[36px] bg-[var(--fm-surface)] p-6 shadow-[var(--shadow-float)]">
                <div className="fm-shimmer hidden w-[240px] rounded-3xl lg:block" />
                <div className="flex-1 space-y-6">
                    <div className="fm-shimmer h-14 w-full rounded-2xl" />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="fm-shimmer h-28 rounded-3xl" />
                        <div className="fm-shimmer h-28 rounded-3xl" />
                        <div className="fm-shimmer h-28 rounded-3xl" />
                    </div>
                    <div className="fm-shimmer h-72 w-full rounded-3xl" />
                </div>
            </div>
        </div>
    );
}

async function AuthenticatedDashboard({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/sign-in");
    }

    const rawUser = session.user as {
        id: string;
        name?: string | null;
        email?: string | null;
        role?: string | null;
        image?: string | null;
    };

    const normalizedRole =
        rawUser.role === "admin" || rawUser.role === "technician"
            ? rawUser.role
            : "customer";

    const user: DashboardUser = {
        id: rawUser.id,
        name: rawUser.name || "User",
        email: rawUser.email || "",
        role: normalizedRole,
        image: rawUser.image,
    };

    return <DashboardShell user={user}>{children}</DashboardShell>;
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <AuthenticatedDashboard>{children}</AuthenticatedDashboard>
        </Suspense>
    );
}