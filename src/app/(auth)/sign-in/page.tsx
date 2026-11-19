"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { toast } from "sonner";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Loader2,
    Sparkles,
} from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { signInSchema } from "@/schemas/auth.schema";
import { getDashboardPath, getSafeRedirectPath } from "@/lib/role-routes";

type SignInValues = z.infer<typeof signInSchema>;

function SignInForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: SignInValues) => {
        const res = await signIn.email({
            email: values.email.trim().toLowerCase(),
            password: values.password,
        });

        if (res.error) {
            toast.error(res.error.message || "Invalid email or password");
            return;
        }

        const userRole = (res.data?.user as { role?: string } | undefined)?.role;
        const callbackUrl = getSafeRedirectPath(searchParams.get("callbackUrl"));
        const destination = callbackUrl || getDashboardPath(userRole);

        toast.success("Welcome back to FixMate!");
        router.push(destination);
        router.refresh();
    };

    return (
        <div className="fm-glass-float rounded-[32px] p-6 sm:p-8">
            {/* Header */}
            <div className="space-y-2 text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--fm-primary-soft)] px-3.5 py-1 text-xs font-bold text-[var(--fm-primary-soft-text)]">
                    <Sparkles className="h-3.5 w-3.5" />
                    Account Access
                </span>
                <h2 className="fm-heading text-2xl sm:text-3xl">Welcome back</h2>
                <p className="text-sm text-[var(--fm-ink-soft)]">
                    Sign in to manage your repairs and bookings
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5" noValidate>
                {/* Email Field */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="email"
                        className="block text-xs font-bold uppercase tracking-wider text-[var(--fm-ink-soft)]"
                    >
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fm-ink-muted)]" />
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            className="fm-input pl-11 pr-4"
                            {...register("email")}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-xs font-medium text-red-500">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="password"
                        className="block text-xs font-bold uppercase tracking-wider text-[var(--fm-ink-soft)]"
                    >
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fm-ink-muted)]" />
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            className="fm-input pl-11 pr-11"
                            {...register("password")}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[var(--fm-ink-muted)] transition hover:text-[var(--fm-ink)]"
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-xs font-medium text-red-500">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="fm-btn-primary mt-2 h-12 w-full text-sm"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Signing In...
                        </>
                    ) : (
                        <>
                            Sign In
                            <ArrowRight className="h-4 w-4" />
                        </>
                    )}
                </button>
            </form>

            {/* Bottom Switcher */}
            <div className="mt-6 border-t border-[var(--fm-divider)] pt-5 text-center text-sm text-[var(--fm-ink-soft)]">
                Don&apos;t have an account?{" "}
                <Link
                    href="/sign-up"
                    className="font-bold text-[var(--fm-primary)] transition hover:underline"
                >
                    Sign Up
                </Link>
            </div>
        </div>
    );
}

export default function SignInPage() {
    return (
        <Suspense
            fallback={
                <div className="fm-glass-float h-[420px] rounded-[32px] p-8">
                    <div className="fm-shimmer h-full w-full rounded-2xl" />
                </div>
            }
        >
            <SignInForm />
        </Suspense>
    );
}