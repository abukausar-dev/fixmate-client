import type { Metadata } from "next";
import { AdminBookingsView } from "@/components/admin/AdminBookingsView";

export const metadata: Metadata = {
    title: "All Bookings | Admin Dashboard | FixMate",
};

export default function AdminBookingsPage() {
    return <AdminBookingsView />;
}