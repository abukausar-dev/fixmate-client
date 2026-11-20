import type { Metadata } from "next";
import { AdminUsersView } from "@/components/admin/AdminUsersView";

export const metadata: Metadata = {
    title: "Manage Users | Admin Dashboard | FixMate",
};

export default function AdminUsersPage() {
    return <AdminUsersView />;
}