import type { Metadata } from "next";
import { TechnicianOverview } from "@/components/technician/TechnicianOverview";

export const metadata: Metadata = {
  title: "Technician Dashboard | FixMate",
};

export default function TechnicianDashboardPage() {
  return <TechnicianOverview />;
}