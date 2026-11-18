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
        if (res.error) {
            toast.error(res.error.message || "Failed to get JWT token");
            return;
        }
        setJwtStatus(`JWT received (${res.data.token.slice(0, 28)}...)`);
        toast.success("JWT token generated successfully!");
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