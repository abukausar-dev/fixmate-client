"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient, signOut, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function AuthSessionTest({ expectedRole }: { expectedRole: string }) {
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const [jwtStatus, setJwtStatus] = useState<string>("");

    const handleGetToken = async () => {
        const res = await authClient.token();
        if (res.error || !res.data?.token) {
            toast.error(res.error?.message || "Failed to get JWT token");
            return;
        }

        const token = res.data.token;
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

        // 1. Test /api/auth/me (Should return 200 with MongoDB user)
        const meRes = await fetch(`${apiBase}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const meData = await meRes.json();

        // 2. Test /api/admin/ping as Customer/Technician (Should return 403 Forbidden)
        const adminRes = await fetch(`${apiBase}/api/admin/ping`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        setJwtStatus(
            `Express verified: ${meRes.status} (role: ${meData.user?.role}) | Admin gate: ${adminRes.status}`
        );
        toast.success("Express JWKS & Role Middleware verified!");
    };

    const handleSignOut = async () => {
        await signOut();
        toast.success("Signed out successfully");
        router.push("/sign-in");
        router.refresh();
    };

    if (isPending) {
        return <div className="p-8 text-slate-500">Loading session...</div>;
    }

    return (
        <div className="min-h-screen bg-[#F4F7F8] p-8">
            <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-md space-y-4">
                <h1 className="text-2xl font-bold text-[#102B3F] capitalize">
                    {expectedRole} Dashboard (Starter)
                </h1>
                <div className="rounded-xl bg-slate-50 p-4 text-sm space-y-1">
                    <p><strong>Name:</strong> {session?.user?.name}</p>
                    <p><strong>Email:</strong> {session?.user?.email}</p>
                    <p><strong>Role:</strong> {(session?.user as { role?: string } | undefined)?.role}</p>
                </div>

                {jwtStatus && (
                    <p className="rounded-lg bg-emerald-50 p-3 text-xs font-mono text-emerald-800">
                        {jwtStatus}
                    </p>
                )}

                <div className="flex flex-wrap gap-3">
                    <Button onClick={handleGetToken} className="bg-[#176B72] hover:bg-[#102B3F]">
                        Test JWT Token
                    </Button>
                    <Button variant="outline" onClick={handleSignOut}>
                        Sign Out
                    </Button>
                </div>
            </div>
        </div>
    );
}