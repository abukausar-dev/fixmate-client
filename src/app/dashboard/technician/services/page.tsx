import type { Metadata } from "next";
import { TechnicianServicesView } from "@/components/technician/TechnicianServicesView";

export const metadata: Metadata = {
    title: "My Services | Technician Dashboard | FixMate",
};

export default function TechnicianServicesPage() {
    return <TechnicianServicesView />;
}