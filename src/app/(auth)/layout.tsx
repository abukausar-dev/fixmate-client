import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Wrench } from "lucide-react";
import { auth } from "@/lib/auth";
import { getDashboardPath } from "@/lib/role-routes";

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session?.user) {
        const role = (session.user as { role?: string }).role;
        redirect(getDashboardPath(role));
    }

    return (
        <div className="min-h-screen bg-[#F4F7F8] flex flex-col items-center justify-center px-4 py-10">
            <Link
                href="/"
                className="mb-6 flex items-center gap-2.5 text-[#102B3F] font-bold text-2xl tracking-tight"
            >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#176B72] text-white shadow-sm">
                    <Wrench className="h-5 w-5" />
                </span>
                <span>FixMate</span>
            </Link>

            <div className="w-full max-w-md">{children}</div>
        </div>
    );
}