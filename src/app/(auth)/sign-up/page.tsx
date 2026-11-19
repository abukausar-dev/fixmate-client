"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { toast } from "sonner";
import {
    User,
    Wrench,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Loader2,
    CheckCircle2,
    Sparkles,
} from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { signUpSchema } from "@/schemas/auth.schema";
import { getDashboardPath } from "@/lib/role-routes";

type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<SignUpValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "customer",
        },
    });

    const selectedRole = watch("role");

    const onSubmit = async (values: SignUpValues) => {
        const res = await signUp.email({
            name: values.name.trim(),
            email: values.email.trim().toLowerCase(),
            password: values.password,
            role: values.role,
        });

        if (res.error) {
            toast.error(res.error.message || "Could not create account");
            return;
        }

        toast.success("Account created! Welcome to FixMate.");
        router.push(getDashboardPath(values.role));
        router.refresh();
    };

    return (
        <div className="fm-glass-float rounded-[32px] p-6 sm:p-8">
            {/* Header */}
            <div className="space-y-2 text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--fm-primary-soft)] px-3.5 py-1 text-xs font-bold text-[var(--fm-primary-soft-text)]">
                    <Sparkles className="h-3.5 w-3.5" />
                    Get Started Free
                </span>
                <h2 className="fm-heading text-2xl sm:text-3xl">Create your account</h2>
                <p className="text-sm text-[var(--fm-ink-soft)]">
                    Join FixMate to book repairs or offer your technician services
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
                {/* Role Selector (Customer vs Technician) */}
                <div className="space-y-2">
                    <span className="block text-xs font-bold uppercase tracking-wider text-[var(--fm-ink-soft)]">
                        Register As
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            {
                                value: "customer" as const,
                                title: "Customer",
                                desc: "Book repairs",
                                icon: User,
                            },
                            {
                                value: "technician" as const,
                                title: "Technician",
                                desc: "Offer services",
                                icon: Wrench,
                            },
                        ].map((option) => {
                            const Icon = option.icon;
                            const isSelected = selectedRole === option.value;

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() =>
                                        setValue("role", option.value, { shouldValidate: true })
                                    }
                                    className={`relative flex flex-col items-center gap-1.5 rounded-2xl border p-3.5 text-center transition-all ${isSelected
                                            ? "border-[var(--fm-primary)] bg-[var(--fm-primary-soft)] shadow-sm"
                                            : "border-[var(--fm-surface-border)] bg-[var(--fm-canvas)] hover:border-[var(--fm-primary)]/40"
                                        }`}
                                >
                                    {isSelected && (
                                        <CheckCircle2 className="absolute right-2.5 top-2.5 h-4 w-4 text-[var(--fm-primary)]" />
                                    )}
                                    <span
                                        className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${isSelected
                                                ? "bg-[var(--fm-primary)] text-white"
                                                : "bg-[var(--fm-surface)] text-[var(--fm-ink-muted)]"
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </span>
                                    <span className="text-sm font-bold text-[var(--fm-ink)]">
                                        {option.title}
                                    </span>
                                    <span className="text-[11px] font-medium text-[var(--fm-ink-soft)]">
                                        {option.desc}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    {errors.role && (
                        <p className="text-xs font-medium text-red-500">
                            {errors.role.message}
                        </p>
                    )}
                </div>

                {/* Full Name */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="name"
                        className="block text-xs font-bold uppercase tracking-wider text-[var(--fm-ink-soft)]"
                    >
                        Full Name
                    </label>
                    <div className="relative">
                        <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fm-ink-muted)]" />
                        <input
                            id="name"
                            type="text"
                            autoComplete="name"
                            placeholder="e.g. Tariq Hasan"
                            className="fm-input pl-11 pr-4"
                            {...register("name")}
                        />
                    </div>
                    {errors.name && (
                        <p className="text-xs font-medium text-red-500">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                {/* Email Address */}
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

                {/* Password */}
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
                            autoComplete="new-password"
                            placeholder="Min 6 chars, 1 uppercase & 1 lowercase"
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
                    {errors.password ? (
                        <p className="text-xs font-medium text-red-500">
                            {errors.password.message}
                        </p>
                    ) : (
                        <p className="text-[11px] text-[var(--fm-ink-muted)]">
                            Must be at least 6 characters with 1 uppercase and 1 lowercase
                            letter.
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
                            Creating Account...
                        </>
                    ) : (
                        <>
                            Sign Up
                            <ArrowRight className="h-4 w-4" />
                        </>
                    )}
                </button>
            </form>

            {/* Bottom Switcher */}
            <div className="mt-6 border-t border-[var(--fm-divider)] pt-5 text-center text-sm text-[var(--fm-ink-soft)]">
                Already have an account?{" "}
                <Link
                    href="/sign-in"
                    className="font-bold text-[var(--fm-primary)] transition hover:underline"
                >
                    Sign In
                </Link>
            </div>
        </div>
    );
}