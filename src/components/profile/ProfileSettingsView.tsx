"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    User,
    Mail,
    Phone,
    MapPin,
    FileText,
    UploadCloud,
    Loader2,
    ShieldCheck,
    Save,
    Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { apiAuthFetch, uploadImageFile } from "@/lib/api-client";
import {
    updateProfileFormSchema,
    type UpdateProfileFormValues,
} from "@/schemas/profile.schema";

interface UserProfileResponse {
    _id: string;
    name: string;
    email: string;
    role: "customer" | "technician" | "admin";
    image?: string | null;
    phone?: string;
    area?: string;
    bio?: string;
}

export function ProfileSettingsView() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfileResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<UpdateProfileFormValues>({
        resolver: zodResolver(updateProfileFormSchema),
        defaultValues: {
            name: "",
            phone: "",
            area: "",
            bio: "",
            image: "",
        },
    });

    const currentImage = watch("image");
    const currentName = watch("name") || profile?.name || "U";

    useEffect(() => {
        let active = true;

        async function loadProfile() {
            try {
                setLoading(true);
                const res = await apiAuthFetch<UserProfileResponse>("/api/users/me");
                if (active) {
                    setProfile(res.data);
                    reset({
                        name: res.data.name || "",
                        phone: res.data.phone || "",
                        area: res.data.area || "",
                        bio: res.data.bio || "",
                        image: res.data.image || "",
                    });
                }
            } catch (err) {
                toast.error(
                    err instanceof Error ? err.message : "Failed to load profile"
                );
            } finally {
                if (active) setLoading(false);
            }
        }

        loadProfile();
        return () => {
            active = false;
        };
    }, [reset]);

    const handleAvatarUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Avatar image must be smaller than 5MB");
            return;
        }

        try {
            setUploadingAvatar(true);
            const uploadedUrl = await uploadImageFile(file);
            setValue("image", uploadedUrl, {
                shouldValidate: true,
                shouldDirty: true,
            });
            toast.success("Avatar uploaded! Click Save Changes to apply.");
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Failed to upload avatar"
            );
        } finally {
            setUploadingAvatar(false);
            event.target.value = "";
        }
    };

    const onSubmit = async (values: UpdateProfileFormValues) => {
        try {
            const res = await apiAuthFetch<UserProfileResponse>(
                "/api/users/profile",
                {
                    method: "PATCH",
                    body: JSON.stringify(values),
                }
            );

            setProfile(res.data);
            reset({
                name: res.data.name || "",
                phone: res.data.phone || "",
                area: res.data.area || "",
                bio: res.data.bio || "",
                image: res.data.image || "",
            });

            toast.success("Profile updated successfully!");
            router.refresh();
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Could not update profile"
            );
        }
    };

    const initials = currentName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    if (loading) {
        return (
            <div className="mx-auto max-w-3xl space-y-6">
                <div className="fm-shimmer h-36 rounded-[28px]" />
                <div className="fm-shimmer h-96 rounded-[28px]" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <h2 className="fm-heading text-2xl">Profile Settings</h2>
                <p className="text-sm text-[var(--fm-ink-soft)]">
                    Keep your contact details, service area, and profile photo up to date.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                {/* Avatar & Identity Header Card */}
                <div className="fm-card flex flex-col items-center gap-5 p-6 text-center sm:flex-row sm:items-center sm:text-left">
                    {currentImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={currentImage}
                            alt={currentName}
                            className="h-24 w-24 shrink-0 rounded-3xl object-cover ring-4 ring-[var(--fm-primary-soft)]"
                        />
                    ) : (
                        <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-[var(--fm-primary)] text-2xl font-extrabold text-white shadow-md">
                            {initials}
                        </span>
                    )}

                    <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                            <h3 className="fm-heading text-xl">{currentName}</h3>
                            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--fm-primary-soft)] px-3 py-0.5 text-xs font-bold capitalize text-[var(--fm-primary-soft-text)]">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                {profile?.role || "customer"}
                            </span>
                        </div>
                        <p className="text-xs text-[var(--fm-ink-muted)]">
                            {profile?.email}
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1 sm:justify-start">
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[var(--fm-primary)] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[var(--fm-primary-dark)]">
                                {uploadingAvatar ? (
                                    <>
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <UploadCloud className="h-3.5 w-3.5" />
                                        {currentImage ? "Change Photo" : "Upload Photo"}
                                    </>
                                )}
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleAvatarUpload}
                                    disabled={uploadingAvatar}
                                    className="hidden"
                                />
                            </label>

                            {currentImage && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setValue("image", "", {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                        })
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-full border border-red-500/25 bg-red-500/10 px-3.5 py-2 text-xs font-bold text-red-500 transition hover:bg-red-500 hover:text-white"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>
                    <input type="hidden" {...register("image")} />
                </div>

                {/* Editable Details Card */}
                <div className="fm-card space-y-5 p-6 sm:p-8">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Full Name */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="profile-name"
                                className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fm-ink-soft)]"
                            >
                                Full Name *
                            </label>
                            <div className="relative">
                                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fm-ink-muted)]" />
                                <input
                                    id="profile-name"
                                    type="text"
                                    className="fm-input pl-10 pr-4"
                                    {...register("name")}
                                />
                            </div>
                            {errors.name && (
                                <p className="text-xs font-medium text-red-500">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Locked Email */}
                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fm-ink-muted)]">
                                Email Address (Locked)
                            </label>
                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fm-ink-muted)]" />
                                <input
                                    type="email"
                                    value={profile?.email || ""}
                                    readOnly
                                    className="fm-input cursor-not-allowed pl-10 pr-4 opacity-70"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="profile-phone"
                                className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fm-ink-soft)]"
                            >
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fm-ink-muted)]" />
                                <input
                                    id="profile-phone"
                                    type="tel"
                                    placeholder="+880 1700-000000"
                                    className="fm-input pl-10 pr-4"
                                    {...register("phone")}
                                />
                            </div>
                            {errors.phone && (
                                <p className="text-xs font-medium text-red-500">
                                    {errors.phone.message}
                                </p>
                            )}
                        </div>

                        {/* Area / City */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="profile-area"
                                className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fm-ink-soft)]"
                            >
                                Area / Location
                            </label>
                            <div className="relative">
                                <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fm-ink-muted)]" />
                                <input
                                    id="profile-area"
                                    type="text"
                                    placeholder="e.g. Dhanmondi, Dhaka"
                                    className="fm-input pl-10 pr-4"
                                    {...register("area")}
                                />
                            </div>
                            {errors.area && (
                                <p className="text-xs font-medium text-red-500">
                                    {errors.area.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="profile-bio"
                            className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fm-ink-soft)]"
                        >
                            Short Bio / Expertise
                        </label>
                        <div className="relative">
                            <FileText className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-[var(--fm-ink-muted)]" />
                            <textarea
                                id="profile-bio"
                                rows={4}
                                placeholder={
                                    profile?.role === "technician"
                                        ? "Share your repair specialties, certifications, and years of experience..."
                                        : "Optional note or preferred contact instructions..."
                                }
                                className="fm-input !h-auto py-3 pl-10 pr-4 leading-relaxed"
                                {...register("bio")}
                            />
                        </div>
                        {errors.bio && (
                            <p className="text-xs font-medium text-red-500">
                                {errors.bio.message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-[var(--fm-divider)] pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-[var(--fm-ink-muted)]">
                            Account role and login email cannot be changed from profile
                            settings.
                        </p>
                        <button
                            type="submit"
                            disabled={isSubmitting || uploadingAvatar || !isDirty}
                            className="fm-btn-primary h-11 shrink-0"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}