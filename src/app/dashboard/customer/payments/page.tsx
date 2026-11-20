import type { Metadata } from "next";
import { CustomerPaymentsView } from "@/components/customer/CustomerPaymentsView";

export const metadata: Metadata = {
    title: "Payment History | Customer Dashboard | FixMate",
};

export default function CustomerPaymentsPage() {
    return <CustomerPaymentsView />;
}