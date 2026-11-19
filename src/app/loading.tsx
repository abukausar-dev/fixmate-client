export default function GlobalLoading() {
    return (
        <div className="fm-container space-y-8 py-12">
            {/* Page Title Shimmer */}
            <div className="space-y-3">
                <div className="fm-shimmer h-6 w-36 rounded-full" />
                <div className="fm-shimmer h-10 w-72 rounded-2xl" />
            </div>

            {/* Equal-Height Service Card Shimmer Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="fm-card space-y-4 p-4">
                        <div className="fm-shimmer aspect-[4/3] w-full rounded-2xl" />
                        <div className="fm-shimmer h-5 w-4/5 rounded-xl" />
                        <div className="flex items-center gap-3">
                            <div className="fm-shimmer h-8 w-8 rounded-full" />
                            <div className="fm-shimmer h-4 w-1/2 rounded-lg" />
                        </div>
                        <div className="flex items-center justify-between pt-2">
                            <div className="fm-shimmer h-8 w-24 rounded-full" />
                            <div className="fm-shimmer h-10 w-10 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}