import type { Metadata } from "next";
import { AdminServicesView } from "@/components/admin/AdminServicesView";

export const metadata: Metadata = {
    title: "Approve Services | Admin Dashboard | FixMate",
};

export default function AdminServicesPage() {
    return <AdminServicesView />;
}