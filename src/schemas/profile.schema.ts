import { z } from "zod";

export const updateProfileFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(80, "Name cannot exceed 80 characters"),
    phone: z.union([
        z
            .string()
            .trim()
            .min(7, "Please enter a valid phone number")
            .max(25, "Phone number is too long")
            .regex(/^[0-9+\-\s()]+$/, "Use digits, +, -, or spaces only"),
        z.literal(""),
    ]),
    area: z.string().trim().max(100, "Area cannot exceed 100 characters"),
    bio: z.string().trim().max(500, "Bio cannot exceed 500 characters"),
    image: z.union([
        z.string().trim().url("Avatar must be a valid image URL"),
        z.literal(""),
    ]),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileFormSchema>;