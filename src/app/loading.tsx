export default function GlobalLoading() {
    return (
        <div className="fm-container py-12 space-y-8">
            <div className="h-12 w-64 animate-pulse rounded-2xl bg-slate-200/80" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div
                        key={item}
                        className="fm-card p-5 space-y-4"
                    >
                        <div className="h-44 w-full animate-pulse rounded-2xl bg-slate-200/70" />
                        <div className="h-5 w-3/4 animate-pulse rounded-lg bg-slate-200/70" />
                        <div className="h-4 w-1/2 animate-pulse rounded-lg bg-slate-200/60" />
                        <div className="h-10 w-full animate-pulse rounded-full bg-slate-200/70" />
                    </div>
                ))}
            </div>
        </div>
    );
}