import { Suspense } from "react";
import type { Metadata } from "next";
import { ServiceDetailView } from "@/components/services/ServiceDetailView";

export const metadata: Metadata = {
    title: "Service Details | FixMate",
    description:
        "View verified technician details, starting price, and service mode before requesting a repair.",
};

function ServiceDetailSkeleton() {
    return (
        <div className="fm-container space-y-6 py-10">
            <div className="fm-shimmer h-9 w-36 rounded-full" />
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-7">
                    <div className="fm-shimmer aspect-[16/10] w-full rounded-[32px]" />
                    <div className="fm-card space-y-3 p-6">
                        <div className="fm-shimmer h-6 w-1/3 rounded-xl" />
                        <div className="fm-shimmer h-4 w-full rounded-lg" />
                        <div className="fm-shimmer h-4 w-5/6 rounded-lg" />
                    </div>
                </div>
                <div className="space-y-6 lg:col-span-5">
                    <div className="fm-card space-y-4 p-7">
                        <div className="fm-shimmer h-8 w-3/4 rounded-xl" />
                        <div className="fm-shimmer h-12 w-1/2 rounded-full" />
                        <div className="fm-shimmer h-14 w-full rounded-3xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Async child reads `params` safely inside <Suspense> for Next.js 16 Instant Navigation
async function ServiceDetailContent({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <ServiceDetailView serviceId={id} />;
}

export default function ServiceDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    return (
        <Suspense fallback={<ServiceDetailSkeleton />}>
            <ServiceDetailContent params={params} />
        </Suspense>
    );
}