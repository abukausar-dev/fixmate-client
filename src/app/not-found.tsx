import Link from "next/link";
import { Wrench, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#F4F7F8] flex items-center justify-center px-4">
            <div className="fm-card max-w-lg w-full p-10 text-center space-y-6">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#E0F2F7] text-[#176B72]">
                    <Wrench className="h-10 w-10 -rotate-12" />
                </div>

                <div className="space-y-2">
                    <span className="rounded-full bg-[#FEF3C7] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-800">
                        Error 404 • Page Needs Repair
                    </span>
                    <h1 className="fm-heading text-3xl font-extrabold">
                        We couldn&apos;t find that page
                    </h1>
                    <p className="text-sm text-slate-500">
                        The service or route you are looking for might have been moved,
                        removed, or is currently unavailable.
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <Link href="/" className="fm-btn-primary">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Link>
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-[#102B3F] hover:bg-slate-50"
                    >
                        <Search className="h-4 w-4 text-[#176B72]" />
                        Browse Services
                    </Link>
                </div>
            </div>
        </div>
    );
}