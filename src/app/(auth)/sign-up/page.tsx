"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, User, Wrench } from "lucide-react";
import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";
import { getDashboardPath } from "@/lib/role-routes";
import { signUpSchema, type SignUpInput } from "@/schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function SignUpPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<SignUpInput>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "customer",
        },
    });

    const selectedRole = watch("role");

    const onSubmit = async (values: SignUpInput) => {
        const { error } = await signUp.email({
            name: values.name,
            email: values.email,
            password: values.password,
            role: values.role,
        });

        if (error) {
            toast.error(error.message || "Could not create account. Please try again.");
            return;
        }

        toast.success("Account created successfully! Welcome to FixMate.");
        router.push(getDashboardPath(values.role));
        router.refresh();
    };

    return (
        <Card className="rounded-2xl border-slate-200/80 bg-white shadow-lg shadow-slate-200/60">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold text-[#102B3F]">
                    Create your account
                </CardTitle>
                <CardDescription className="text-slate-500">
                    Join FixMate to book repairs or offer your technician services
                </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-[#102B3F]">Register as</Label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setValue("role", "customer", { shouldValidate: true })}
                                className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3.5 text-sm font-medium transition-all ${selectedRole === "customer"
                                        ? "border-[#176B72] bg-[#176B72]/5 text-[#102B3F]"
                                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                    }`}
                            >
                                <User className="h-5 w-5 text-[#176B72]" />
                                <span>Customer</span>
                                <span className="text-xs font-normal text-slate-500">
                                    Book repairs
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setValue("role", "technician", { shouldValidate: true })}
                                className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3.5 text-sm font-medium transition-all ${selectedRole === "technician"
                                        ? "border-[#176B72] bg-[#176B72]/5 text-[#102B3F]"
                                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                    }`}
                            >
                                <Wrench className="h-5 w-5 text-[#176B72]" />
                                <span>Technician</span>
                                <span className="text-xs font-normal text-slate-500">
                                    Offer services
                                </span>
                            </button>
                        </div>
                        {errors.role && (
                            <p className="text-xs text-red-600">{errors.role.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-[#102B3F]">
                            Full Name
                        </Label>
                        <Input
                            id="name"
                            placeholder="e.g. Tariq Hasan"
                            {...register("name")}
                            className="rounded-xl"
                        />
                        {errors.name && (
                            <p className="text-xs text-red-600">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-[#102B3F]">
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            {...register("email")}
                            className="rounded-xl"
                        />
                        {errors.email && (
                            <p className="text-xs text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-[#102B3F]">
                            Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Min 6 chars, 1 uppercase & 1 lowercase"
                                {...register("password")}
                                className="rounded-xl pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-red-600">{errors.password.message}</p>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4 pt-2">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-xl bg-[#176B72] hover:bg-[#102B3F] text-white"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            "Sign Up"
                        )}
                    </Button>

                    <p className="text-center text-sm text-slate-600">
                        Already have an account?{" "}
                        <Link
                            href="/sign-in"
                            className="font-semibold text-[#176B72] hover:underline"
                        >
                            Sign In
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}