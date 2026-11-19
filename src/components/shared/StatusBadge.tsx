// Unchanged semantic colors: requested=blue, accepted=indigo, in-progress=amber,
// completed=green, rejected=red, cancelled=gray, paid=green, unpaid=orange, pending=amber, approved=green
const STATUS_STYLES: Record<string, string> = {
    requested: "bg-blue-50/90 text-blue-700 border-blue-200/80",
    accepted: "bg-indigo-50/90 text-indigo-700 border-indigo-200/80",
    "in-progress": "bg-[#FFF1CC] text-[#0B1F3A] border-amber-300/80",
    completed: "bg-[#DDF6EE] text-emerald-800 border-emerald-200/80",
    rejected: "bg-red-50/90 text-red-700 border-red-200/80",
    cancelled: "bg-slate-100/90 text-slate-600 border-slate-200/80",
    paid: "bg-[#DDF6EE] text-emerald-800 border-emerald-200/80",
    unpaid: "bg-orange-50/90 text-orange-700 border-orange-200/80",
    pending: "bg-[#FFF1CC] text-[#0B1F3A] border-amber-300/80",
    approved: "bg-[#DDF6EE] text-emerald-800 border-emerald-200/80",
};

export function StatusBadge({ status }: { status: string }) {
    const normalized = status.toLowerCase();
    const style =
        STATUS_STYLES[normalized] ||
        "bg-slate-100/90 text-slate-700 border-slate-200/80";

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize backdrop-blur-sm ${style}`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {status.replace("-", " ")}
        </span>
    );
}