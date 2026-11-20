import { Suspense } from "react";
import type { Metadata } from "next";
import { PaymentSuccessView } from "@/components/customer/PaymentSuccessView";

export const metadata: Metadata = {
    title: "Payment Confirmed | FixMate",
};

export default function PaymentSuccessPage() {
    return (
        <Suspense
            fallback={
                <div className="mx-auto max-w-xl py-10">
                    <div className="fm-shimmer h-80 w-full rounded-[36px]" />
                </div>
            }
        >
            <PaymentSuccessView />
        </Suspense>
    );
}