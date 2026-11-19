import Link from "next/link";
import Image from "next/image";
import {
    Search,
    Smartphone,
    Laptop,
    Wind,
    Refrigerator,
    Tv,
    WashingMachine,
    Zap,
    ShieldCheck,
    Clock,
    CreditCard,
    ArrowRight,
    CheckCircle2,
    MapPin,
} from "lucide-react";

const CATEGORIES = [
    {
        name: "Smartphone",
        subtitle: "Screen, battery & port",
        icon: Smartphone,
        tint: "bg-[#E0F2F7] text-[#176B72]",
    },
    {
        name: "Laptop & PC",
        subtitle: "Hardware & OS servicing",
        icon: Laptop,
        tint: "bg-[#E3F5EE] text-[#176B72]",
    },
    {
        name: "AC",
        subtitle: "Cooling, gas & servicing",
        icon: Wind,
        tint: "bg-[#FEF3C7] text-amber-800",
    },
    {
        name: "Refrigerator",
        subtitle: "Compressor & thermostat",
        icon: Refrigerator,
        tint: "bg-[#E0F2F7] text-[#176B72]",
    },
    {
        name: "TV",
        subtitle: "Display panel & power",
        icon: Tv,
        tint: "bg-[#E3F5EE] text-[#176B72]",
    },
    {
        name: "Washing Machine",
        subtitle: "Drum, motor & drain",
        icon: WashingMachine,
        tint: "bg-[#FEF3C7] text-amber-800",
    },
    {
        name: "Electrical",
        subtitle: "Home wiring & circuit",
        icon: Zap,
        tint: "bg-[#E0F2F7] text-[#176B72]",
    },
];

export default function HomePage() {
    return (
        <div className="space-y-20 pb-10">
            {/* 1. Hero Section (Verve x Davici Split Bento Hero) */}
            <section className="fm-container pt-8">
                <div className="fm-card overflow-hidden p-6 sm:p-10 lg:p-12">
                    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
                        {/* Left Content */}
                        <div className="space-y-6 lg:col-span-7">
                            <div className="inline-flex items-center gap-2 rounded-full bg-[#E3F5EE] px-4 py-1.5 text-xs font-bold text-[#176B72]">
                                <span className="h-2 w-2 rounded-full bg-[#176B72]" />
                                On-Demand Smart Device & Appliance Repair
                            </div>

                            <h1 className="fm-heading text-4xl font-extrabold leading-[1.12] sm:text-5xl lg:text-[54px]">
                                Broken Device? Get It Fixed by{" "}
                                <span className="text-[#176B72]">Verified Technicians.</span>
                            </h1>

                            <p className="max-w-xl text-base leading-relaxed text-slate-600">
                                Book trusted technicians for home visits or shop drop-offs.
                                Track your repair status in real time and pay securely online
                                only after the job is completed.
                            </p>

                            {/* Search Form pointing directly to /services?search=... */}
                            <form
                                action="/services"
                                method="GET"
                                className="flex flex-col gap-3 rounded-3xl border border-slate-200/90 bg-[#F4F7F8] p-2 sm:flex-row sm:items-center sm:rounded-full"
                            >
                                <div className="flex flex-1 items-center gap-3 px-4 py-2">
                                    <Search className="h-5 w-5 shrink-0 text-[#176B72]" />
                                    <input
                                        type="text"
                                        name="search"
                                        placeholder="Search e.g. iPhone screen, AC servicing, laptop..."
                                        className="w-full bg-transparent text-sm text-[#102B3F] placeholder:text-slate-400 focus:outline-none"
                                    />
                                </div>
                                <button type="submit" className="fm-btn-primary shrink-0">
                                    Find Service
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </form>

                            {/* Verve-style Metric Bento Pills */}
                            <div className="grid grid-cols-3 gap-3 pt-2 sm:gap-4">
                                <div className="fm-bento-mint p-4">
                                    <p className="fm-heading text-xl font-extrabold sm:text-2xl">
                                        7+
                                    </p>
                                    <p className="text-xs font-medium text-slate-600">
                                        Repair Categories
                                    </p>
                                </div>
                                <div className="fm-bento-sky p-4">
                                    <p className="fm-heading text-xl font-extrabold sm:text-2xl">
                                        100%
                                    </p>
                                    <p className="text-xs font-medium text-slate-600">
                                        Admin Moderated
                                    </p>
                                </div>
                                <div className="fm-bento-amber p-4">
                                    <p className="fm-heading text-xl font-extrabold sm:text-2xl">
                                        $0
                                    </p>
                                    <p className="text-xs font-medium text-slate-600">
                                        Upfront Payment
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Visual Showcase with Real Unsplash Image */}
                        <div className="relative lg:col-span-5">
                            <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-[#102B3F] aspect-[4/4.2]">
                                <Image
                                    src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=85"
                                    alt="Technician repairing electronic hardware"
                                    fill
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 40vw"
                                    className="object-cover opacity-90"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#102B3F] via-transparent to-transparent" />

                                {/* Floating Live Pipeline Card */}
                                <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur-md">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-[#102B3F]">
                                            Live Job Pipeline
                                        </span>
                                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                                            Pay After Completion
                                        </span>
                                    </div>
                                    <div className="mt-2.5 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                                        <span className="text-[#176B72]">1. Requested</span>
                                        <span>→</span>
                                        <span className="text-[#176B72]">2. Accepted</span>
                                        <span>→</span>
                                        <span className="text-amber-600">3. In Progress</span>
                                        <span>→</span>
                                        <span className="text-emerald-700">4. Completed</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Popular Categories Section (Clickable -> /services?category=...) */}
            <section className="fm-container space-y-6">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#176B72]">
                            Browse by Category
                        </p>
                        <h2 className="fm-heading mt-1 text-2xl font-extrabold sm:text-3xl">
                            What needs fixing today?
                        </h2>
                    </div>
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#176B72] hover:underline"
                    >
                        View all services
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
                    {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        return (
                            <Link
                                key={cat.name}
                                href={`/services?category=${encodeURIComponent(cat.name)}`}
                                className="fm-card fm-card-hover group flex flex-col justify-between p-5"
                            >
                                <span
                                    className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-105 ${cat.tint}`}
                                >
                                    <Icon className="h-6 w-6" />
                                </span>
                                <div className="mt-5">
                                    <h3 className="fm-heading text-sm font-bold group-hover:text-[#176B72]">
                                        {cat.name}
                                    </h3>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        {cat.subtitle}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* 3. How FixMate Works (4-Step Visual Flow) */}
            <section className="fm-container">
                <div className="fm-bento-navy p-8 sm:p-12">
                    <div className="max-w-2xl space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#65D8C4]">
                            Simple 4-Step Process
                        </span>
                        <h2 className="fm-heading text-2xl font-extrabold text-white sm:text-3xl">
                            How FixMate protects every repair job
                        </h2>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                step: "01",
                                title: "Find a Service",
                                desc: "Compare verified technicians, service modes, and base prices.",
                            },
                            {
                                step: "02",
                                title: "Send a Request",
                                desc: "Provide your problem description, address, and preferred date.",
                            },
                            {
                                step: "03",
                                title: "Technician Fixes It",
                                desc: "Follow live status updates from Accepted to In Progress.",
                            },
                            {
                                step: "04",
                                title: "Pay After Completion",
                                desc: "Pay online with Stripe Checkout only after the job is done.",
                            },
                        ].map((item) => (
                            <div
                                key={item.step}
                                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                            >
                                <span className="inline-flex rounded-full bg-[#176B72] px-3 py-1 text-xs font-bold text-white">
                                    Step {item.step}
                                </span>
                                <h3 className="fm-heading mt-4 text-lg font-bold text-white">
                                    {item.title}
                                </h3>
                                <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Why Choose Us */}
            <section className="fm-container">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="fm-bento-mint p-7 space-y-3">
                        <ShieldCheck className="h-8 w-8 text-[#176B72]" />
                        <h3 className="fm-heading text-xl font-bold">
                            Verified & Approved Listings
                        </h3>
                        <p className="text-sm leading-relaxed text-slate-700">
                            Every service listing goes through admin moderation before becoming
                            visible to customers.
                        </p>
                    </div>

                    <div className="fm-bento-sky p-7 space-y-3">
                        <MapPin className="h-8 w-8 text-[#176B72]" />
                        <h3 className="fm-heading text-xl font-bold">
                            Home Visit or Shop Drop-off
                        </h3>
                        <p className="text-sm leading-relaxed text-slate-700">
                            Choose technicians who visit your home or drop your device at a
                            certified service point in your area.
                        </p>
                    </div>

                    <div className="fm-bento-amber p-7 space-y-3">
                        <CreditCard className="h-8 w-8 text-amber-800" />
                        <h3 className="fm-heading text-xl font-bold">
                            Stripe Protected Checkout
                        </h3>
                        <p className="text-sm leading-relaxed text-slate-700">
                            Your Pay Now button appears only after your technician completes
                            the repair and sets the final amount.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}