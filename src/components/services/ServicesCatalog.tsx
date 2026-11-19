"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import {
    Search,
    SlidersHorizontal,
    X,
    ArrowUpDown,
    MapPin,
    Sparkles,
} from "lucide-react";
import { apiPublicFetch } from "@/lib/api-client";
import {
    SERVICE_CATEGORIES,
    SERVICE_MODES,
    type ServiceItem,
    type ServiceSortOption,
} from "@/types/service";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { EmptyState } from "@/components/shared/EmptyState";

export function ServicesCatalog() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const prefersReducedMotion = useReducedMotion();

    // Source of truth: URL query parameters (preserved on reload & category links)
    const activeSearch = searchParams.get("search") || "";
    const activeCategory = searchParams.get("category") || "all";
    const activeMode = searchParams.get("serviceMode") || "all";
    const activeSort =
        (searchParams.get("sort") as ServiceSortOption) || "newest";

    const [searchInput, setSearchInput] = useState(activeSearch);
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Keep input synced if user navigates via Navbar/Home links
    useEffect(() => {
        setSearchInput(activeSearch);
    }, [activeSearch]);

    // Update URL query string cleanly without jumping scroll position
    const updateQuery = (updates: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (!value || value === "all" || (key === "sort" && value === "newest")) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        const queryString = params.toString();
        router.replace(queryString ? `/services?${queryString}` : "/services", {
            scroll: false,
        });
    };

    // Debounce search typing slightly so MongoDB isn't hit on every single keystroke
    useEffect(() => {
        const trimmed = searchInput.trim();
        if (trimmed === activeSearch) return;

        const timer = setTimeout(() => {
            updateQuery({ search: trimmed });
        }, 350);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput]);

    // Challenge 1: Fetch server-filtered & server-sorted services from Express/MongoDB
    useEffect(() => {
        let active = true;

        async function fetchCatalog() {
            try {
                setLoading(true);
                setErrorMsg(null);

                const query = new URLSearchParams();
                if (activeSearch) query.set("search", activeSearch);
                if (activeCategory && activeCategory !== "all") {
                    query.set("category", activeCategory);
                }
                if (activeMode && activeMode !== "all") {
                    query.set("serviceMode", activeMode);
                }
                if (activeSort) query.set("sort", activeSort);

                const qs = query.toString();
                const res = await apiPublicFetch<ServiceItem[]>(
                    qs ? `/api/services?${qs}` : "/api/services"
                );

                if (active) {
                    setServices(res.data || []);
                }
            } catch (err) {
                if (active) {
                    setErrorMsg(
                        err instanceof Error ? err.message : "Failed to load services"
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        fetchCatalog();
        return () => {
            active = false;
        };
    }, [activeSearch, activeCategory, activeMode, activeSort]);

    const hasActiveFilters =
        Boolean(activeSearch) ||
        activeCategory !== "all" ||
        activeMode !== "all" ||
        activeSort !== "newest";

    const resetAllFilters = () => {
        setSearchInput("");
        router.replace("/services", { scroll: false });
    };

    return (
        <div className="fm-container space-y-8 py-10 sm:py-12">
            {/* Top Aurora Header Banner */}
            <div className="fm-glass relative overflow-hidden rounded-[36px] p-6 sm:p-10">
                <div
                    aria-hidden="true"
                    className="fm-orb fm-orb-blue fm-float-slow absolute -right-12 -top-12 h-36 w-36 opacity-70"
                />
                <div
                    aria-hidden="true"
                    className="fm-orb fm-orb-amber fm-float-reverse hidden sm:block absolute -bottom-10 right-28 h-20 w-20 opacity-75"
                />

                <div className="relative z-10 max-w-2xl space-y-3 text-center sm:text-left">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[var(--fm-primary-soft)] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[var(--fm-primary-soft-text)]">
                        <Sparkles className="h-3.5 w-3.5" />
                        Verified Marketplace
                    </span>
                    <h1 className="fm-h2 text-3xl sm:text-4xl">
                        Browse Approved Repair Services
                    </h1>
                    <p className="text-sm leading-relaxed text-[var(--fm-ink-soft)] sm:text-base">
                        Search by issue or category, compare home visit and shop drop-off
                        options, and book with zero upfront payment.
                    </p>
                </div>

                {/* Frosted Filter Controls */}
                <div className="relative z-10 mt-7 space-y-4">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                        {/* Search Input */}
                        <div className="relative md:col-span-5">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fm-primary)]" />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search e.g. screen, AC gas, battery..."
                                aria-label="Search services"
                                className="fm-input pl-11 pr-10"
                            />
                            {searchInput && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchInput("");
                                        updateQuery({ search: "" });
                                    }}
                                    aria-label="Clear search"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[var(--fm-ink-muted)] hover:text-[var(--fm-ink)]"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Service Mode Select */}
                        <div className="relative md:col-span-3">
                            <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fm-ink-muted)]" />
                            <select
                                value={activeMode}
                                onChange={(e) => updateQuery({ serviceMode: e.target.value })}
                                aria-label="Filter by service mode"
                                className="fm-input cursor-pointer appearance-none pl-11 pr-4"
                            >
                                <option value="all">All Service Modes</option>
                                {SERVICE_MODES.map((mode) => (
                                    <option key={mode} value={mode}>
                                        {mode}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort Select */}
                        <div className="relative md:col-span-4">
                            <ArrowUpDown className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fm-ink-muted)]" />
                            <select
                                value={activeSort}
                                onChange={(e) => updateQuery({ sort: e.target.value })}
                                aria-label="Sort services"
                                className="fm-input cursor-pointer appearance-none pl-11 pr-4"
                            >
                                <option value="newest">Sort: Newest First</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Category Quick Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--fm-ink-muted)]">
                            <SlidersHorizontal className="h-3.5 w-3.5" />
                            Category:
                        </span>

                        <button
                            type="button"
                            onClick={() => updateQuery({ category: "all" })}
                            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${activeCategory === "all"
                                    ? "bg-[var(--fm-active-pill)] text-white shadow-sm"
                                    : "border border-[var(--fm-surface-border)] bg-[var(--fm-surface)] text-[var(--fm-ink-soft)] hover:text-[var(--fm-ink)]"
                                }`}
                        >
                            All
                        </button>

                        {SERVICE_CATEGORIES.map((category) => {
                            const selected = activeCategory === category;
                            return (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => updateQuery({ category })}
                                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${selected
                                            ? "bg-[var(--fm-active-pill)] text-white shadow-sm"
                                            : "border border-[var(--fm-surface-border)] bg-[var(--fm-surface)] text-[var(--fm-ink-soft)] hover:text-[var(--fm-ink)]"
                                        }`}
                                >
                                    {category}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Results Summary Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                <p className="text-sm font-medium text-[var(--fm-ink-soft)]">
                    {loading ? (
                        "Searching verified listings..."
                    ) : (
                        <>
                            Showing{" "}
                            <span className="font-bold text-[var(--fm-ink)]">
                                {services.length}
                            </span>{" "}
                            {services.length === 1 ? "service" : "services"}
                            {activeCategory !== "all" ? ` in ${activeCategory}` : ""}
                        </>
                    )}
                </p>

                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={resetAllFilters}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--fm-surface-border)] bg-[var(--fm-surface)] px-3.5 py-1.5 text-xs font-bold text-[var(--fm-primary)] shadow-sm transition hover:border-[var(--fm-primary)]/40"
                    >
                        <X className="h-3.5 w-3.5" />
                        Reset Filters
                    </button>
                )}
            </div>

            {/* Services Grid (4 / 3 / 2 / 1 Responsive Equal-Height Cards) */}
            {loading ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <div key={n} className="fm-card space-y-4 p-4">
                            <div className="fm-shimmer aspect-[4/3] w-full rounded-2xl" />
                            <div className="fm-shimmer h-5 w-4/5 rounded-xl" />
                            <div className="flex items-center gap-2.5">
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
            ) : errorMsg ? (
                <EmptyState
                    variant="wrench"
                    title="Unable to load services"
                    description={errorMsg}
                    actionLabel="Try Again"
                    onAction={() => router.refresh()}
                />
            ) : services.length === 0 ? (
                <EmptyState
                    variant="search"
                    title={
                        hasActiveFilters
                            ? "No matching services found"
                            : "No approved services available yet"
                    }
                    description={
                        hasActiveFilters
                            ? "Try clearing one of your filters or searching with a broader repair keyword."
                            : "Approved technician listings will appear here as soon as they are published."
                    }
                    actionLabel={hasActiveFilters ? "Reset All Filters" : "Back to Home"}
                    actionHref={hasActiveFilters ? undefined : "/"}
                    onAction={hasActiveFilters ? resetAllFilters : undefined}
                />
            ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {services.map((service, index) => (
                        <motion.div
                            key={service._id}
                            initial={
                                prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }
                            }
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.35,
                                delay: Math.min(index * 0.04, 0.25),
                                ease: "easeOut",
                            }}
                            className="h-full"
                        >
                            <ServiceCard service={service} />
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}