import { AuthSessionTest } from "@/components/auth/AuthSessionTest";
export default function AdminDashboardPage() {
    return <AuthSessionTest expectedRole="admin" />;
}