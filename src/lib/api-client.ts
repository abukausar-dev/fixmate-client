import { authClient } from "@/lib/auth-client";

const RAW_API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const API_BASE_URL = RAW_API_URL.replace(/\/+$/, "");

export class ApiClientError extends Error {
    status: number;
    details?: unknown;

    constructor(message: string, status: number, details?: unknown) {
        super(message);
        this.name = "ApiClientError";
        this.status = status;
        this.details = details;
    }
}

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    count?: number;
    data: T;
}

async function parseJsonResponse<T>(res: Response): Promise<ApiResponse<T>> {
    const payload = await res.json().catch(() => ({}));

    if (!res.ok) {
        const message =
            (payload as { message?: string }).message ||
            `Request failed with status ${res.status}`;
        throw new ApiClientError(
            message,
            res.status,
            (payload as { errors?: unknown }).errors
        );
    }

    return payload as ApiResponse<T>;
}

// Public API calls (no auth header needed)
export async function apiPublicFetch<T>(
    path: string,
    init?: RequestInit
): Promise<ApiResponse<T>> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers || {}),
        },
    });

    return parseJsonResponse<T>(res);
}

// Fetch a fresh BetterAuth JWT for Express backend verification
async function getBearerToken(): Promise<string> {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
        throw new ApiClientError(
            "Your session has expired. Please sign in again.",
            401
        );
    }

    return data.token;
}

// Protected API calls with automatic Bearer JWT header
export async function apiAuthFetch<T>(
    path: string,
    init?: RequestInit
): Promise<ApiResponse<T>> {
    const token = await getBearerToken();

    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...(init?.headers || {}),
        },
    });

    return parseJsonResponse<T>(res);
}

// Secure image upload via Express ImgBB proxy (never exposes IMGBB_API_KEY)
export async function uploadImageFile(file: File): Promise<string> {
    const token = await getBearerToken();
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${API_BASE_URL}/api/uploads/image`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    const payload = await parseJsonResponse<{ url: string }>(res);
    return payload.data.url;
}