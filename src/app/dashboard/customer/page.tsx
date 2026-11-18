import { AuthSessionTest } from "@/components/auth/AuthSessionTest";
export default function CustomerDashboardPage() {
    return <AuthSessionTest expectedRole="customer" />;
}