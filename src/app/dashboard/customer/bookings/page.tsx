import type { Metadata } from "next";
import { CustomerBookingsView } from "@/components/customer/CustomerBookingsView";

export const metadata: Metadata = {
    title: "My Bookings | Customer Dashboard | FixMate",
};

export default function CustomerBookingsPage() {
    return <CustomerBookingsView />;
}