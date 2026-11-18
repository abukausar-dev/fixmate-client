export type UserRole = "customer" | "technician" | "admin";

export function getDashboardPath(role?: string | null): string {
    switch (role) {
        case "admin":
            return "/dashboard/admin";
        case "technician":
            return "/dashboard/technician";
        case "customer":
        default:
            return "/dashboard/customer";
    }
}

export function getSafeRedirectPath(
    callbackUrl: string | null,
    role?: string | null
): string {
    if (
        callbackUrl &&
        callbackUrl.startsWith("/") &&
        !callbackUrl.startsWith("//") &&
        !callbackUrl.startsWith("/sign-in") &&
        !callbackUrl.startsWith("/sign-up")
    ) {
        return callbackUrl;
    }

    return getDashboardPath(role);
}