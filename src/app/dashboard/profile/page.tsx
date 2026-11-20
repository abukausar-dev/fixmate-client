import type { Metadata } from "next";
import { ProfileSettingsView } from "@/components/profile/ProfileSettingsView";

export const metadata: Metadata = {
    title: "Update Profile | FixMate",
};

export default function ProfilePage() {
    return <ProfileSettingsView />;
}