export interface PaymentRecord {
    _id: string;
    bookingId: string;
    serviceId: string;
    serviceTitle: string;
    category: string;
    customerEmail: string;
    customerName: string;
    technicianEmail: string;
    technicianName: string;
    amount: number;
    currency: string;
    stripeSessionId: string;
    stripePaymentIntentId: string | null;
    status: "paid";
    paidAt: string;
    createdAt: string;
}