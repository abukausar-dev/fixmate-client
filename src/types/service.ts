export const SERVICE_CATEGORIES = [
    "Smartphone",
    "Laptop & PC",
    "AC",
    "Refrigerator",
    "TV",
    "Washing Machine",
    "Electrical",
] as const;

export const SERVICE_MODES = ["Home Visit", "Shop Drop-off"] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];
export type ServiceMode = (typeof SERVICE_MODES)[number];
export type ServiceSortOption = "newest" | "price-asc" | "price-desc";

export interface ServiceItem {
    _id: string;
    title: string;
    category: ServiceCategory;
    description: string;
    basePrice: number;
    serviceMode: ServiceMode;
    estimatedDuration: string;
    image: string;
    technicianEmail: string;
    technicianName: string;
    technicianImage?: string;
    area?: string;
    approvalStatus: "pending" | "approved" | "rejected";
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ServiceDetail extends ServiceItem {
    technician: {
        name: string;
        image: string | null;
        area: string;
        bio: string;
    };
}