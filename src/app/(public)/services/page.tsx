import { Suspense } from "react";
import type { Metadata } from "next";
import { ServicesCatalog } from "@/components/services/ServicesCatalog";

export const metadata: Metadata = {
    title: "Browse Services | FixMate",
    description:
        "Search and filter admin-approved smartphone, laptop, AC, refrigerator, TV, washing machine, and electrical repair services.",
};

export default function ServicesPage() {
    return (
        <Suspense
            fallback={
                <div className="fm-container space-y-6 py-12">
                    <div className="fm-shimmer h-48 w-full rounded-[36px]" />
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="fm-card space-y-4 p-4">
                                <div className="fm-shimmer aspect-[4/3] w-full rounded-2xl" />
                                <div className="fm-shimmer h-5 w-4/5 rounded-xl" />
                                <div className="fm-shimmer h-8 w-1/2 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>
            }
        >
            <ServicesCatalog />
        </Suspense>
    );
}