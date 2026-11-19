"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
    X,
    UploadCloud,
    Loader2,
    CheckCircle2,
    AlertCircle,
    DollarSign,
    Clock,
} from "lucide-react";
import { toast } from "sonner";
import { apiAuthFetch, uploadImageFile } from "@/lib/api-client";
import {
    SERVICE_CATEGORIES,
    SERVICE_MODES,
    type ServiceItem,
} from "@/types/service";
import {
    serviceFormSchema,
    type ServiceFormValues,
} from "@/schemas/service.schema";

interface ServiceFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingService: ServiceItem | null;
    onSaved: (service: ServiceItem, isEdit: boolean) => void;
}

export function ServiceFormModal({
    isOpen,
    onClose,
    editingService,
    onSaved,
}: ServiceFormModalProps) {
    const prefersReducedMotion = useReducedMotion();
    const [uploadingImage, setUploadingImage] = useState(false);

    const isEdit = Boolean(editingService);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(serviceFormSchema),
        defaultValues: {
            title: "",
            category: "Smartphone",
            serviceMode: "Home Visit",
            basePrice: 25,
            estimatedDuration: "1-2 hours",
            image: "",
            description: "",
        },
    });

    const currentImage = watch("image");

    // Populate form when opening for Create vs Edit
    useEffect(() => {
        if (!isOpen) return;

        if (editingService) {
            reset({
                title: editingService.title,
                category: editingService.category,
                serviceMode: editingService.serviceMode,
                basePrice: editingService.basePrice,
                estimatedDuration: editingService.estimatedDuration,
                image: editingService.image,
                description: editingService.description,
            });
        } else {
            reset({
                title: "",
                category: "Smartphone",
                serviceMode: "Home Visit",
                basePrice: 25,
                estimatedDuration: "1-2 hours",
                image: "",
                description: "",
            });
        }
    }, [isOpen, editingService, reset]);

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be smaller than 5MB");
            return;
        }

        try {
            setUploadingImage(true);
            const uploadedUrl = await uploadImageFile(file);
            setValue("image", uploadedUrl, { shouldValidate: true });
            toast.success("Image uploaded to ImgBB!");
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Failed to upload image"
            );
        } finally {
            setUploadingImage(false);
            event.target.value = "";
        }
    };

    const onSubmit = async (values: ServiceFormValues) => {
        try {
            if (editingService) {
                const res = await apiAuthFetch<ServiceItem>(
                    `/api/services/${editingService._id}`,
                    {
                        method: "PATCH",
                        body: JSON.stringify(values),
                    }
                );
                toast.success("Service updated and sent for admin re-approval");
                onSaved(res.data, true);
            } else {
                const res = await apiAuthFetch<ServiceItem>("/api/services", {
                    method: "POST",
                    body: JSON.stringify(values),
                });
                toast.success("Service created and submitted for admin approval!");
                onSaved(res.data, false);
            }
            onClose();
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Could not save service"
            );
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => !isSubmitting && !uploadingImage && onClose()}
                        className="fixed inset-0 bg-[#060E1D]/60 backdrop-blur-md"
                    />

                    <motion.div
                        initial={
                            prefersReducedMotion
                                ? { opacity: 0 }
                                : { opacity: 0, scale: 0.96, y: 14 }
                        }
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={
                            prefersReducedMotion
                                ? { opacity: 0 }
                                : { opacity: 0, scale: 0.97, y: 10 }
                        }
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fm-glass-float relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[32px] p-6 sm:p-8"
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting || uploadingImage}
                            aria-label="Close service form"
                            className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--fm-surface-border)] bg-[var(--fm-surface)] text-[var(--fm-ink-muted)] hover:text-[var(--fm-ink)]"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="pr-8">
                            <span className="inline-flex rounded-full bg-[var(--fm-primary-soft)] px-3 py-1 text-xs font-bold text-[var(--fm-primary-soft-text)]">
                                {isEdit ? "Edit Listing" : "New Listing"}
                            </span>
                            <h2 className="fm-heading mt-2 text-2xl">
                                {isEdit ? "Update Repair Service" : "Publish a Repair Service"}
                            </h2>
                        </div>

                        {isEdit && (
                            <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-amber-400/30 bg-[var(--fm-amber-soft)] p-3.5 text-xs text-[var(--fm-amber-soft-text)]">
                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                <p className="font-medium">
                                    Editing a service resets its moderation status to{" "}
                                    <strong>Pending</strong> so an admin can review your updated
                                    details.
                                </p>
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="mt-6 space-y-4"
                            noValidate
                        >
                            {/* Title */}
                            <div className="space-y-1">
                                <label
                                    htmlFor="service-title"
                                    className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fm-ink-soft)]"
                                >
                                    Service Title *
                                </label>
                                <input
                                    id="service-title"
                                    type="text"
                                    placeholder="e.g. Split AC Full Gas Refill & Cooling Tune-up"
                                    className="fm-input px-4"
                                    {...register("title")}
                                />
                                {errors.title && (
                                    <p className="text-xs font-medium text-red-500">
                                        {errors.title.message}
                                    </p>
                                )}
                            </div>

                            {/* Category + Service Mode */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <label
                                        htmlFor="service-category"
                                        className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fm-ink-soft)]"
                                    >
                                        Category *
                                    </label>
                                    <select
                                        id="service-category"
                                        className="fm-input cursor-pointer px-4"
                                        {...register("category")}
                                    >
                                        {SERVICE_CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label
                                        htmlFor="service-mode"
                                        className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fm-ink-soft)]"
                                    >
                                        Service Mode *
                                    </label>
                                    <select
                                        id="service-mode"
                                        className="fm-input cursor-pointer px-4"
                                        {...register("serviceMode")}
                                    >
                                        {SERVICE_MODES.map((mode) => (
                                            <option key={mode} value={mode}>
                                                {mode}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Base Price + Estimated Duration */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <label
                                        htmlFor="service-price"
                                        className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fm-ink-soft)]"
                                    >
                                        Starting Base Price (USD) *
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fm-ink-muted)]" />
                                        <input
                                            id="service-price"
                                            type="number"
                                            step="1"
                                            min="1"
                                            className="fm-input pl-10 pr-4"
                                            {...register("basePrice")}
                                        />
                                    </div>
                                    {errors.basePrice && (
                                        <p className="text-xs font-medium text-red-500">
                                            {errors.basePrice.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label
                                        htmlFor="service-duration"
                                        className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fm-ink-soft)]"
                                    >
                                        Estimated Duration *
                                    </label>
                                    <div className="relative">
                                        <Clock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fm-ink-muted)]" />
                                        <input
                                            id="service-duration"
                                            type="text"
                                            placeholder="e.g. 1-2 hours"
                                            className="fm-input pl-10 pr-4"
                                            {...register("estimatedDuration")}
                                        />
                                    </div>
                                    {errors.estimatedDuration && (
                                        <p className="text-xs font-medium text-red-500">
                                            {errors.estimatedDuration.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* ImgBB Secure Image Uploader */}
                            <div className="space-y-2">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fm-ink-soft)]">
                                    Service Image (Uploaded via ImgBB) *
                                </label>

                                <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-[var(--fm-primary)]/40 bg-[var(--fm-canvas)] p-4 sm:flex-row sm:items-center">
                                    {currentImage ? (
                                        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl border border-[var(--fm-surface-border)] bg-[var(--fm-surface)]">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={currentImage}
                                                alt="Service preview"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex h-24 w-32 shrink-0 items-center justify-center rounded-xl bg-[var(--fm-primary-soft)] text-[var(--fm-primary)]">
                                            <UploadCloud className="h-8 w-8" />
                                        </div>
                                    )}

                                    <div className="flex-1 space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[var(--fm-primary)] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[var(--fm-primary-dark)]">
                                                {uploadingImage ? (
                                                    <>
                                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <UploadCloud className="h-3.5 w-3.5" />
                                                        {currentImage ? "Replace Image" : "Upload Photo"}
                                                    </>
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    onChange={handleFileChange}
                                                    disabled={uploadingImage}
                                                    className="hidden"
                                                />
                                            </label>

                                            {currentImage && (
                                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2BC9A0]">
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    Ready
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-[11px] text-[var(--fm-ink-muted)]">
                                            JPG, PNG, or WebP up to 5MB. Uploaded securely through our
                                            server.
                                        </p>
                                    </div>
                                </div>

                                {/* Hidden registered URL field */}
                                <input type="hidden" {...register("image")} />
                                {errors.image && (
                                    <p className="text-xs font-medium text-red-500">
                                        {errors.image.message}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-1">
                                <label
                                    htmlFor="service-description"
                                    className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fm-ink-soft)]"
                                >
                                    Service Description *
                                </label>
                                <textarea
                                    id="service-description"
                                    rows={4}
                                    placeholder="Describe what is included in the inspection, repair process, spare part policy, and warranty..."
                                    className="fm-input !h-auto py-3 px-4 leading-relaxed"
                                    {...register("description")}
                                />
                                {errors.description && (
                                    <p className="text-xs font-medium text-red-500">
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>

                            {/* Submit Actions */}
                            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isSubmitting || uploadingImage}
                                    className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--fm-surface-border)] bg-[var(--fm-surface)] px-5 text-sm font-semibold text-[var(--fm-ink)]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || uploadingImage}
                                    className="fm-btn-primary h-11"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : isEdit ? (
                                        "Save Changes"
                                    ) : (
                                        "Submit for Approval"
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}