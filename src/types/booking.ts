export type BookingStatus =
    | "requested"
    | "accepted"
    | "in-progress"
    | "completed"
    | "rejected"
    | "cancelled";

export type PaymentStatus = "unpaid" | "paid";

export interface BookingItem {
    _id: string;
    serviceId: string;
    serviceTitle: string;
    serviceImage: string;
    category: string;
    serviceMode: string;
    basePrice: number;
    finalAmount: number;
    technicianEmail: string;
    technicianName: string;
    customerEmail: string;
    customerName: string;
    customerPhone: string;
    address: string;
    preferredDate: string;
    problemDescription: string;
    status: BookingStatus;
    paymentStatus: PaymentStatus;
    technicianNote?: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
}