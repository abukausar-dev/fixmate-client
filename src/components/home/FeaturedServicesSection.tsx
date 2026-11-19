"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { apiPublicFetch } from "@/lib/api-client";
import type { ServiceItem } from "@/types/service";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { EmptyState } from "@/components/shared/EmptyState";

export function FeaturedServicesSection() {
    const prefersReducedMotion = useReducedMotion();
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        let active = true;

        async function loadFeatured() {
            try {
                setLoading(true);
                setHasError(false);
                const res = await apiPublicFetch<ServiceItem[]>(
                    "/api/services?limit=6&sort=newest"
                );
                if (active) {
                    setServices(res.data || []);
                }
            } catch {
                if (active) {
                    setHasError(true);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadFeatured();
        return () => {
            active = false;
        };
    }, []);

    return (
        <section className="fm-container space-y-8 py-14 lg:py-20">
            <SectionHeading
                eyebrow="Featured Services"
                title="Verified repairs ready to book"
                subtitle="Explore our newest admin-approved services with clear starting prices and flexible service modes."
                actionLabel="View All Services"
                actionHref="/services"
            />

            {loading ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="fm-card space-y-4 p-4">
                            <div className="fm-shimmer aspect-[4/3] w-full rounded-2xl" />
                            <div className="fm-shimmer h-5 w-4/5 rounded-xl" />
                            <div className="flex items-center gap-3">
                                <div className="fm-shimmer h-8 w-8 rounded-full" />
                                <div className="fm-shimmer h-4 w-1/2 rounded-lg" />
                            </div>
                            <div className="flex items-center justify-between pt-2">
                                <div className="fm-shimmer h-8 w-24 rounded-full" />
                                <div className="fm-shimmer h-10 w-10 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : hasError ? (
                <EmptyState
                    variant="wrench"
                    title="Could not load services right now"
                    description="Our service catalog is temporarily unreachable. Please refresh or explore all services in a moment."
                    actionLabel="Explore Services"
                    actionHref="/services"
                />
            ) : services.length === 0 ? (
                <EmptyState
                    variant="box"
                    title="Verified services are coming soon"
                    description="Technicians can publish repair listings and admins approve them before they go live here."
                    actionLabel="Browse Services Page"
                    actionHref="/services"
                />
            ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => (
                        <motion.div
                            key={service._id}
                            initial={
                                prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }
                            }
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.15 }}
                            transition={{
                                duration: 0.4,
                                delay: index * 0.06,
                                ease: "easeOut",
                            }}
                            className="h-full"
                        >
                            <ServiceCard service={service} />
                        </motion.div>
                    ))}
                </div>
            )}
        </section>
    );
}