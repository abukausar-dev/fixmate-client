import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";

export interface ServiceCardItem {
    _id: string;
    title: string;
    category: string;
    serviceMode: string;
    basePrice: number;
    image: string;
    technicianName: string;
    technicianImage?: string;
    area?: string;
}

const CATEGORY_BACKDROPS: Record<string, string> = {
    Smartphone: "bg-[var(--fm-primary-soft)]",
    "Laptop & PC": "bg-[var(--fm-mint-soft)]",
    AC: "bg-[var(--fm-amber-soft)]",
    Refrigerator: "bg-pink-500/15",
    TV: "bg-[var(--fm-primary-soft)]",
    "Washing Machine": "bg-[var(--fm-mint-soft)]",
    Electrical: "bg-[var(--fm-amber-soft)]",
};

export function ServiceCard({ service }: { service: ServiceCardItem }) {
    const backdrop =
        CATEGORY_BACKDROPS[service.category] || "bg-[var(--fm-primary-soft)]";

    const techInitials = (service.technicianName || "T")
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <Link
            href={`/services/${service._id}`}
            className="fm-card fm-card-hover group flex h-full flex-col p-3.5 focus-visible:outline-none"
        >
            <div
                className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl p-2 ${backdrop}`}
            >
                <div className="relative h-full w-full overflow-hidden rounded-xl">
                    <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/40 via-transparent to-transparent" />
                </div>

                <span className="fm-glass-float absolute left-3.5 top-3.5 rounded-full px-3 py-1 text-[11px] font-bold text-[var(--fm-ink)]">
                    {service.category}
                </span>

                <span className="absolute right-3.5 top-3.5 rounded-full bg-[#0B1F3A]/90 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                    {service.serviceMode}
                </span>
            </div>

            <div className="flex flex-1 flex-col px-1.5 pt-4">
                <h3 className="fm-heading line-clamp-2 text-lg leading-snug transition-colors group-hover:text-[var(--fm-primary)]">
                    {service.title}
                </h3>

                <div className="mt-3 flex items-center gap-2.5">
                    {service.technicianImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={service.technicianImage}
                            alt={service.technicianName}
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-[var(--fm-surface)]"
                        />
                    ) : (
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--fm-primary-soft)] text-[11px] font-bold text-[var(--fm-primary-soft-text)]">
                            {techInitials}
                        </span>
                    )}

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-[var(--fm-ink)]">
                            {service.technicianName}
                        </p>
                        <p className="flex items-center gap-1 truncate text-[11px] text-[var(--fm-ink-muted)]">
                            <MapPin className="h-3 w-3 shrink-0 text-[var(--fm-primary)]" />
                            <span>{service.area || "Dhaka Metro"}</span>
                        </p>
                    </div>
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--fm-divider)] pt-4">
                    <span className="inline-flex items-baseline gap-1 rounded-full bg-[var(--fm-amber-soft)] px-3.5 py-1.5 text-xs font-bold text-[var(--fm-amber-soft-text)]">
                        <span className="text-[11px] font-medium opacity-80">From</span>
                        <span className="font-bold text-sm">${service.basePrice}</span>
                    </span>

                    <span
                        aria-hidden="true"
                        className="fm-circle-arrow group-hover:bg-[var(--fm-primary)] group-hover:text-white group-hover:scale-105"
                    >
                        <ArrowUpRight className="h-4 w-4" />
                    </span>
                </div>
            </div>
        </Link>
    );
}