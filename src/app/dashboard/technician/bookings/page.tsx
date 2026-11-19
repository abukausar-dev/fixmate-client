import type { Metadata } from "next";
import { TechnicianBookingsView } from "@/components/technician/TechnicianBookingsView";

export const metadata: Metadata = {
    title: "Assigned Bookings | Technician Dashboard | FixMate",
};

export default function TechnicianBookingsPage() {
    return <TechnicianBookingsView />;
}