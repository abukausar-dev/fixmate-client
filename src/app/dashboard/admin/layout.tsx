import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getDashboardPath } from "@/lib/role-routes";

async function AdminGuard({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/sign-in");
    }

    const role = (session.user as { role?: string }).role;
    if (role !== "admin") {
        redirect(getDashboardPath(role));
    }

    return <>{children}</>;
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Suspense
            fallback={
                <div className="space-y-4">
                    <div className="fm-shimmer h-28 w-full rounded-3xl" />
                    <div className="fm-shimmer h-64 w-full rounded-3xl" />
                </div>
            }
        >
            <AdminGuard>{children}</AdminGuard>
        </Suspense>
    );
}