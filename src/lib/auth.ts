import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { db } from "./mongodb";

const appUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";

const trustedOrigins = (process.env.BETTER_AUTH_TRUSTED_ORIGINS || appUrl)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

export const auth = betterAuth({
    database: mongodbAdapter(db),
    baseURL: appUrl,
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins,
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
    },
    user: {
        modelName: "users",
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "customer",
                input: true,
            },
            phone: {
                type: "string",
                required: false,
                defaultValue: "",
                input: true,
            },
            area: {
                type: "string",
                required: false,
                defaultValue: "",
                input: true,
            },
            bio: {
                type: "string",
                required: false,
                defaultValue: "",
                input: true,
            },
        },
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    const allowedSignupRoles = ["customer", "technician"];
                    const userRecord = user as typeof user & { role?: unknown };
                    const requestedRole =
                        typeof userRecord.role === "string"
                            ? userRecord.role.toLowerCase()
                            : "customer";

                    const safeRole = allowedSignupRoles.includes(requestedRole)
                        ? requestedRole
                        : "customer";

                    return {
                        data: {
                            ...user,
                            role: safeRole,
                        },
                    };
                },
            },
        },
    },
    plugins: [
        jwt({
            jwt: {
                issuer: appUrl,
                audience: appUrl,
                expirationTime: "15m",
            },
        }),
        nextCookies(),
    ],
});