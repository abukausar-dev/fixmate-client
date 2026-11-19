import { z } from "zod";
import { SERVICE_CATEGORIES, SERVICE_MODES } from "@/types/service";

export const serviceFormSchema = z.object({
    title: z
        .string()
        .trim()
        .min(5, "Service title must be at least 5 characters")
        .max(120, "Service title cannot exceed 120 characters"),
    category: z.enum(SERVICE_CATEGORIES, {
        message: "Please select a repair category",
    }),
    serviceMode: z.enum(SERVICE_MODES, {
        message: "Please select a service mode",
    }),
    basePrice: z.coerce
        .number()
        .positive("Starting price must be greater than 0")
        .max(100000, "Price is too high"),
    estimatedDuration: z
        .string()
        .trim()
        .min(2, "Enter estimated duration (e.g. 1-2 hours)")
        .max(60, "Duration is too long"),
    image: z
        .string()
        .trim()
        .url("Please upload a service image first"),
    description: z
        .string()
        .trim()
        .min(20, "Description must be at least 20 characters")
        .max(2000, "Description cannot exceed 2000 characters"),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;