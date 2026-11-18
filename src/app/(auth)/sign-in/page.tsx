"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient, signIn } from "@/lib/auth-client";
import { getSafeRedirectPath } from "@/lib/role-routes";
import { signInSchema, type SignInInput } from "@/schemas/auth.schema";
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

function SignInForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);

    const callbackUrl =
        searchParams.get("callbackUrl") || searchParams.get("redirect");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInInput>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: SignInInput) => {
        const { error } = await signIn.email({
            email: values.email,
            password: values.password,
        });

        if (error) {
            toast.error(error.message || "Invalid email or password.");
            return;
        }

        const sessionRes = await authClient.getSession();
        const role = (sessionRes.data?.user as { role?: string } | undefined)?.role;

        toast.success("Signed in successfully!");
        router.push(getSafeRedirectPath(callbackUrl, role));
        router.refresh();
    };

    return (
        <Card className="rounded-2xl border-slate-200/80 bg-white shadow-lg shadow-slate-200/60">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold text-[#102B3F]">
                    Welcome back
                </CardTitle>
                <CardDescription className="text-slate-500">
                    Sign in to manage your repairs and bookings
                </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <CardContent className="space-y-4">
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
                                placeholder="Enter your password"
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
                                Signing in...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </Button>

                    <p className="text-center text-sm text-slate-600">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/sign-up"
                            className="font-semibold text-[#176B72] hover:underline"
                        >
                            Sign Up
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}

export default function SignInPage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-64 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <Loader2 className="h-6 w-6 animate-spin text-[#176B72]" />
                </div>
            }
        >
            <SignInForm />
        </Suspense>
    );
}