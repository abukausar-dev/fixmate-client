import { z } from "zod";

export function getTodayLocalDateString(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export const requestRepairSchema = z.object({
    customerPhone: z
        .string()
        .trim()
        .min(7, "Please enter a valid phone number")
        .max(25, "Phone number is too long")
        .regex(/^[0-9+\-\s()]+$/, "Use digits, +, -, or spaces only"),
    address: z
        .string()
        .trim()
        .min(8, "Please provide a complete service address")
        .max(300, "Address cannot exceed 300 characters"),
    preferredDate: z
        .string()
        .trim()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Please pick a valid date")
        .refine(
            (value) => value >= getTodayLocalDateString(),
            "Preferred date cannot be in the past"
        ),
    problemDescription: z
        .string()
        .trim()
        .min(20, "Please describe the problem in at least 20 characters")
        .max(1500, "Description cannot exceed 1500 characters"),
});

export type RequestRepairFormValues = z.infer<typeof requestRepairSchema>;