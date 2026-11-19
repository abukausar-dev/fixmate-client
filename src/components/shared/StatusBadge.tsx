const STATUS_STYLES: Record<string, string> = {
    requested: "bg-blue-50 text-blue-700 border-blue-200",
    accepted: "bg-indigo-50 text-indigo-700 border-indigo-200",
    "in-progress": "bg-amber-50 text-amber-800 border-amber-200",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    cancelled: "bg-slate-100 text-slate-600 border-slate-200",
    paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
    unpaid: "bg-orange-50 text-orange-700 border-orange-200",
    pending: "bg-amber-50 text-amber-800 border-amber-200",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export function StatusBadge({ status }: { status: string }) {
    const normalized = status.toLowerCase();
    const style =
        STATUS_STYLES[normalized] || "bg-slate-100 text-slate-700 border-slate-200";

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${style}`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {status.replace("-", " ")}
        </span>
    );
}