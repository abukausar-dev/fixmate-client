import type { Metadata } from "next";
import Link from "next/link";
import {
    Search,
    Send,
    Wrench,
    CreditCard,
    ShieldCheck,
    Clock,
    CheckCircle2,
    ArrowRight,
    XCircle,
    User,
    UserCog,
    Receipt,
    Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
    title: "How It Works & About | FixMate",
    description:
        "Learn how FixMate connects customers with admin-verified repair technicians through step-by-step job tracking and post-completion Stripe payments.",
};

const STEPS = [
    {
        step: "01",
        badge: "Browse",
        title: "Find a Verified Service",
        description:
            "Browse admin-approved repair services across 7 categories with transparent starting prices, estimated durations, and service modes.",
        icon: Search,
        tint: "fm-bento-sky",
    },
    {
        step: "02",
        badge: "Requested",
        title: "Send a Repair Request",
        description:
            "Describe the device issue, choose a preferred date, and pick Home Visit or Shop Drop-off. Cancel anytime while still Requested.",
        icon: Send,
        tint: "fm-bento-mint",
    },
    {
        step: "03",
        badge: "In Progress",
        title: "Track Live Repair Progress",
        description:
            "Follow every server-enforced stage as your technician moves the job from Accepted to In Progress and marks it Completed.",
        icon: Wrench,
        tint: "fm-bento-amber",
    },
    {
        step: "04",
        badge: "Paid",
        title: "Pay Only After Completion",
        description:
            "Once your device is fixed and the final amount is set, Pay Now unlocks so you can pay safely via Stripe Checkout and keep a receipt.",
        icon: CreditCard,
        tint: "fm-card",
    },
];

const OLD_WAY_PAINS = [
    "Paying upfront before knowing whether the repair will actually succeed.",
    "Handing over a phone, laptop, or appliance with zero visibility on progress.",
    "Calling technicians repeatedly just to ask if the work has started.",
    "No structured price transparency or digital payment receipt for future reference.",
];

const FIXMATE_ADVANTAGES = [
    "Strict pay-after-completion model — Stripe checkout unlocks only when the job is done.",
    "One-step server-enforced status pipeline from Requested to Paid with zero skipped stages.",
    "Every service listing and edit is moderated by platform admins before going live.",
    "Verified Stripe payment history and transaction IDs stored directly in your dashboard.",
];

const ROLES = [
    {
        role: "For Customers",
        subtitle: "Zero-risk repairs with full visibility",
        icon: User,
        accent: "bg-[#2F6BFF]/10 text-[#2F6BFF]",
        points: [
            "Search, filter, and sort approved services across 7 categories",
            "Cancel requests freely while still in Requested status",
            "Pay securely via Stripe only after completion & view receipts",
        ],
    },
    {
        role: "For Technicians",
        subtitle: "A structured workspace to grow your craft",
        icon: Wrench,
        accent: "bg-[#FFB020]/15 text-[#B7791F] dark:text-[#FFB020]",
        points: [
            "Publish repair services with banner photos & service areas",
            "Accept or reject requests and update live job stages",
            "Set transparent final amounts upon completion & track payouts",
        ],
    },
    {
        role: "For Admins",
        subtitle: "Quality moderation & marketplace oversight",
        icon: UserCog,
        accent: "bg-[#2BC9A0]/15 text-[#148F72] dark:text-[#65D8C4]",
        points: [
            "Approve or reject new and edited technician listings",
            "Manage platform users and role permissions safely",
            "Monitor all active repair jobs and total Stripe revenue",
        ],
    },
];

const PIPELINE_STAGES = [
    { label: "Requested", dot: "bg-blue-400" },
    { label: "Accepted", dot: "bg-indigo-400" },
    { label: "In Progress", dot: "bg-amber-400" },
    { label: "Completed", dot: "bg-emerald-400" },
    { label: "Paid", dot: "bg-[#65D8C4]" },
];

function RepairPipelineIllustration() {
    return (
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0B1F3A] p-4 shadow-xl sm:p-5">
            {/* Ambient background glow matching FixMate navy aesthetic */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full opacity-35 blur-3xl"
                style={{
                    background: "radial-gradient(circle, #2F6BFF, transparent 70%)",
                }}
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-12 -left-10 h-40 w-40 rounded-full opacity-25 blur-3xl"
                style={{
                    background: "radial-gradient(circle, #2BC9A0, transparent 70%)",
                }}
            />

            <svg
                viewBox="0 0 460 360"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Animated FixMate live repair workflow diagram showing Requested, In Progress, Completed, and Stripe Paid stages"
                className="relative z-10 h-auto w-full select-none"
            >
                <defs>
                    <linearGradient id="fmBlueGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#4B86FF" />
                        <stop offset="100%" stopColor="#2F6BFF" />
                    </linearGradient>
                    <linearGradient id="fmTrackGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#2F6BFF" />
                        <stop offset="50%" stopColor="#FFB020" />
                        <stop offset="100%" stopColor="#2BC9A0" />
                    </linearGradient>
                    <linearGradient id="fmCardGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#16335B" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#0F2647" stopOpacity="0.95" />
                    </linearGradient>
                </defs>

                <style>{`
                    .fm-about-spin {
                        transform-box: fill-box;
                        transform-origin: center;
                        animation: fmSpin 18s linear infinite;
                    }
                    .fm-about-spin-rev {
                        transform-box: fill-box;
                        transform-origin: center;
                        animation: fmSpinRev 14s linear infinite;
                    }
                    .fm-about-dash {
                        stroke-dasharray: 7 7;
                        animation: fmDashFlow 1.6s linear infinite;
                    }
                    .fm-about-pulse {
                        transform-box: fill-box;
                        transform-origin: center;
                        animation: fmRadarPulse 3.2s ease-out infinite;
                    }
                    .fm-about-pulse-delay {
                        transform-box: fill-box;
                        transform-origin: center;
                        animation: fmRadarPulse 3.2s ease-out 1.6s infinite;
                    }
                    .fm-about-float-a {
                        animation: fmFloatA 4.6s ease-in-out infinite;
                    }
                    .fm-about-float-b {
                        animation: fmFloatB 5.4s ease-in-out infinite;
                    }
                    .fm-about-float-c {
                        animation: fmFloatA 5s ease-in-out 0.8s infinite;
                    }
                    .fm-about-blink {
                        animation: fmBlink 2s ease-in-out infinite;
                    }
                    @keyframes fmSpin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    @keyframes fmSpinRev {
                        from { transform: rotate(360deg); }
                        to { transform: rotate(0deg); }
                    }
                    @keyframes fmDashFlow {
                        from { stroke-dashoffset: 28; }
                        to { stroke-dashoffset: 0; }
                    }
                    @keyframes fmRadarPulse {
                        0% { transform: scale(0.85); opacity: 0.55; }
                        100% { transform: scale(1.65); opacity: 0; }
                    }
                    @keyframes fmFloatA {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-7px); }
                    }
                    @keyframes fmFloatB {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(7px); }
                    }
                    @keyframes fmBlink {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.35; }
                    }
                    @media (prefers-reduced-motion: reduce) {
                        .fm-about-spin,
                        .fm-about-spin-rev,
                        .fm-about-dash,
                        .fm-about-pulse,
                        .fm-about-pulse-delay,
                        .fm-about-float-a,
                        .fm-about-float-b,
                        .fm-about-float-c,
                        .fm-about-blink {
                            animation: none !important;
                        }
                    }
                `}</style>

                {/* Subtle Blueprint Grid Dots */}
                <g opacity="0.16" fill="#9CC2FF">
                    {[40, 100, 160, 220, 280, 340, 400].map((x) =>
                        [36, 96, 156, 216, 276, 330].map((y) => (
                            <circle key={`${x}-${y}`} cx={x} cy={y} r="1.4" />
                        ))
                    )}
                </g>

                {/* Outer Rotating Dashed Orbit Ring */}
                <circle
                    cx="230"
                    cy="172"
                    r="112"
                    stroke="#2F6BFF"
                    strokeOpacity="0.24"
                    strokeWidth="1.5"
                    strokeDasharray="6 8"
                    className="fm-about-spin"
                />
                <circle
                    cx="230"
                    cy="172"
                    r="82"
                    stroke="#65D8C4"
                    strokeOpacity="0.2"
                    strokeWidth="1.2"
                    strokeDasharray="4 8"
                    className="fm-about-spin-rev"
                />

                {/* Animated Flowing Signal Paths to Corner Status Cards */}
                <path
                    d="M112 88 C 155 88, 170 135, 198 156"
                    stroke="#4B86FF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="fm-about-dash"
                />
                <path
                    d="M348 88 C 305 88, 290 135, 262 156"
                    stroke="#FFB020"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="fm-about-dash"
                />
                <path
                    d="M198 190 C 170 218, 155 256, 120 264"
                    stroke="#65D8C4"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="fm-about-dash"
                />
                <path
                    d="M262 190 C 292 218, 305 256, 340 264"
                    stroke="#2BC9A0"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="fm-about-dash"
                />

                {/* Center Radar Pulse Rings */}
                <circle
                    cx="230"
                    cy="172"
                    r="42"
                    stroke="#2F6BFF"
                    strokeWidth="2"
                    className="fm-about-pulse"
                />
                <circle
                    cx="230"
                    cy="172"
                    r="42"
                    stroke="#65D8C4"
                    strokeWidth="1.5"
                    className="fm-about-pulse-delay"
                />

                {/* Center Core: FixMate Verified Repair Hub */}
                <g>
                    <circle
                        cx="230"
                        cy="172"
                        r="44"
                        fill="url(#fmBlueGrad)"
                        fillOpacity="0.18"
                        stroke="#4B86FF"
                        strokeOpacity="0.55"
                        strokeWidth="1.5"
                    />
                    <circle cx="230" cy="172" r="32" fill="url(#fmBlueGrad)" />

                    {/* Rotating Gear Teeth Accent */}
                    <g
                        className="fm-about-spin"
                        stroke="#FFFFFF"
                        strokeOpacity="0.35"
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        <line x1="230" y1="134" x2="230" y2="140" />
                        <line x1="230" y1="204" x2="230" y2="210" />
                        <line x1="192" y1="172" x2="198" y2="172" />
                        <line x1="262" y1="172" x2="268" y2="172" />
                    </g>

                    {/* Wrench Emblem inside Core */}
                    <path
                        d="M240.5 162.5a6.5 6.5 0 0 1-8.7 8.7l-9.2 9.2a2.2 2.2 0 0 1-3.1-3.1l9.2-9.2a6.5 6.5 0 0 1 8.7-8.7l-3.2 3.2 3.1 3.1 3.2-3.2Z"
                        fill="#FFFFFF"
                    />
                    <circle cx="222" cy="164" r="3" fill="#FFB020" />
                </g>

                {/* Floating Card 1: Top-Left (Requested / $0 Upfront) */}
                <g className="fm-about-float-a">
                    <rect
                        x="18"
                        y="46"
                        width="136"
                        height="62"
                        rx="16"
                        fill="url(#fmCardGrad)"
                        stroke="#4B86FF"
                        strokeOpacity="0.45"
                        strokeWidth="1.2"
                    />
                    <circle
                        cx="36"
                        cy="68"
                        r="5"
                        fill="#4B86FF"
                        className="fm-about-blink"
                    />
                    <text
                        x="48"
                        y="72"
                        fill="#9CC2FF"
                        fontSize="10"
                        fontWeight="700"
                        letterSpacing="0.06em"
                    >
                        STEP 01 • BOOK
                    </text>
                    <text
                        x="32"
                        y="93"
                        fill="#FFFFFF"
                        fontSize="12.5"
                        fontWeight="700"
                    >
                        $0 Upfront Risk
                    </text>
                </g>

                {/* Floating Card 2: Top-Right (Technician Working) */}
                <g className="fm-about-float-b">
                    <rect
                        x="306"
                        y="46"
                        width="136"
                        height="62"
                        rx="16"
                        fill="url(#fmCardGrad)"
                        stroke="#FFB020"
                        strokeOpacity="0.45"
                        strokeWidth="1.2"
                    />
                    <circle
                        cx="324"
                        cy="68"
                        r="5"
                        fill="#FFB020"
                        className="fm-about-blink"
                    />
                    <text
                        x="336"
                        y="72"
                        fill="#FFD580"
                        fontSize="10"
                        fontWeight="700"
                        letterSpacing="0.06em"
                    >
                        STEP 02 • LIVE
                    </text>
                    <text
                        x="320"
                        y="93"
                        fill="#FFFFFF"
                        fontSize="12.5"
                        fontWeight="700"
                    >
                        Repair In Progress
                    </text>
                </g>

                {/* Floating Card 3: Bottom-Left (Admin Approved) */}
                <g className="fm-about-float-b">
                    <rect
                        x="18"
                        y="236"
                        width="144"
                        height="62"
                        rx="16"
                        fill="url(#fmCardGrad)"
                        stroke="#65D8C4"
                        strokeOpacity="0.4"
                        strokeWidth="1.2"
                    />
                    <circle cx="36" cy="258" r="5" fill="#65D8C4" />
                    <text
                        x="48"
                        y="262"
                        fill="#9CECE0"
                        fontSize="10"
                        fontWeight="700"
                        letterSpacing="0.06em"
                    >
                        VERIFIED PROS
                    </text>
                    <text
                        x="32"
                        y="283"
                        fill="#FFFFFF"
                        fontSize="12.5"
                        fontWeight="700"
                    >
                        Admin Moderated
                    </text>
                </g>

                {/* Floating Card 4: Bottom-Right (Completed -> Stripe Paid) */}
                <g className="fm-about-float-c">
                    <rect
                        x="298"
                        y="236"
                        width="144"
                        height="62"
                        rx="16"
                        fill="url(#fmCardGrad)"
                        stroke="#2BC9A0"
                        strokeOpacity="0.55"
                        strokeWidth="1.2"
                    />
                    <circle
                        cx="316"
                        cy="258"
                        r="5"
                        fill="#2BC9A0"
                        className="fm-about-blink"
                    />
                    <text
                        x="328"
                        y="262"
                        fill="#7BEAD0"
                        fontSize="10"
                        fontWeight="700"
                        letterSpacing="0.06em"
                    >
                        POST-COMPLETION
                    </text>
                    <text
                        x="312"
                        y="283"
                        fill="#FFFFFF"
                        fontSize="12.5"
                        fontWeight="700"
                    >
                        Paid via Stripe ✓
                    </text>
                </g>

                {/* Bottom Live Progress Bar */}
                <g>
                    <rect
                        x="34"
                        y="322"
                        width="392"
                        height="6"
                        rx="3"
                        fill="#FFFFFF"
                        fillOpacity="0.1"
                    />
                    <rect
                        x="34"
                        y="322"
                        width="392"
                        height="6"
                        rx="3"
                        fill="url(#fmTrackGrad)"
                        fillOpacity="0.85"
                    />
                    <text
                        x="230"
                        y="346"
                        textAnchor="middle"
                        fill="#94A3B8"
                        fontSize="10.5"
                        fontWeight="600"
                    >
                        Requested → Accepted → In Progress → Completed → Paid
                    </text>
                </g>
            </svg>
        </div>
    );
}

export default function AboutPage() {
    return (
        <div className="fm-container space-y-16 py-10 sm:py-12">
            {/* 1. Split Hero Banner with Infinite SVG Animation */}
            <section className="fm-card relative overflow-hidden p-6 sm:p-10 lg:p-12">
                <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
                    <div className="space-y-5 lg:col-span-7">
                        <span className="inline-flex items-center gap-2 rounded-full bg-[var(--fm-primary-soft)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--fm-primary-soft-text)]">
                            <Sparkles className="h-3.5 w-3.5" />
                            How FixMate Works
                        </span>

                        <h1 className="fm-heading text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                            Device &amp; appliance repairs with zero upfront payment risk.
                        </h1>

                        <p className="max-w-2xl text-base leading-relaxed text-[var(--fm-ink-soft)]">
                            In Bangladesh and worldwide, people hand over expensive phones,
                            laptops, and home appliances without knowing what is happening or
                            paying before work is delivered. FixMate replaces guesswork with
                            admin-approved technicians, live step-by-step job tracking, and
                            Stripe checkout that unlocks only after completion.
                        </p>

                        {/* Real Platform Highlights (No fabricated stats) */}
                        <div className="flex flex-wrap gap-2.5 pt-1 text-xs font-semibold">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300/60 bg-[var(--fm-surface)] px-3.5 py-1.5 text-[var(--fm-ink-soft)] dark:border-white/15">
                                <CheckCircle2 className="h-3.5 w-3.5 text-[#2BC9A0]" />
                                $0 Paid Upfront
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300/60 bg-[var(--fm-surface)] px-3.5 py-1.5 text-[var(--fm-ink-soft)] dark:border-white/15">
                                <ShieldCheck className="h-3.5 w-3.5 text-[var(--fm-primary)]" />
                                Admin-Approved Listings
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300/60 bg-[var(--fm-surface)] px-3.5 py-1.5 text-[var(--fm-ink-soft)] dark:border-white/15">
                                <Receipt className="h-3.5 w-3.5 text-[#FFB020]" />
                                7 Repair Categories
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                            <Link href="/services" className="fm-btn-primary">
                                Explore Repair Services
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/sign-up"
                                className="fm-heading inline-flex items-center justify-center rounded-full border border-slate-300/80 bg-[var(--fm-surface)] px-6 py-2.5 text-sm font-semibold transition hover:border-[var(--fm-primary)] hover:text-[var(--fm-primary)] dark:border-white/20"
                            >
                                Join as a Technician
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Live Infinite SVG Animation */}
                    <div className="lg:col-span-5">
                        <RepairPipelineIllustration />
                    </div>
                </div>
            </section>

            {/* 2. Relatable Comparison: Why FixMate Exists */}
            <section className="space-y-6">
                <div className="max-w-2xl space-y-1.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--fm-primary)]">
                        Why We Built FixMate
                    </p>
                    <h2 className="fm-heading text-2xl font-extrabold sm:text-3xl">
                        Fixing what is broken about repair services
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Traditional Experience */}
                    <div className="fm-card p-6 sm:p-8">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
                                <XCircle className="h-5 w-5" />
                            </span>
                            <div>
                                <h3 className="fm-heading text-lg font-bold">
                                    Traditional Repair Experience
                                </h3>
                                <p className="text-xs text-[var(--fm-ink-soft)]">
                                    Uncertain timelines, upfront risk &amp; no accountability
                                </p>
                            </div>
                        </div>

                        <ul className="mt-6 space-y-3.5 text-sm text-[var(--fm-ink-soft)]">
                            {OLD_WAY_PAINS.map((point) => (
                                <li key={point} className="flex items-start gap-3">
                                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                                    <span className="leading-relaxed">{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* The FixMate Way */}
                    <div className="fm-bento-sky p-6 sm:p-8">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--fm-surface)] text-[var(--fm-primary)] shadow-sm">
                                <ShieldCheck className="h-5 w-5" />
                            </span>
                            <div>
                                <h3 className="fm-heading text-lg font-bold">
                                    The FixMate Standard
                                </h3>
                                <p className="text-xs text-[var(--fm-ink-soft)]">
                                    Verified listings, live milestones &amp; safe Stripe payments
                                </p>
                            </div>
                        </div>

                        <ul className="mt-6 space-y-3.5 text-sm text-[var(--fm-ink-soft)]">
                            {FIXMATE_ADVANTAGES.map((point) => (
                                <li key={point} className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2BC9A0]" />
                                    <span className="leading-relaxed">{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* 3. 4-Step Pipeline Grid */}
            <section className="space-y-6">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--fm-primary)]">
                            4-Stage Workflow
                        </p>
                        <h2 className="fm-heading mt-1 text-2xl font-extrabold sm:text-3xl">
                            From broken device to verified fix
                        </h2>
                    </div>
                    <p className="text-sm text-[var(--fm-ink-soft)]">
                        Every status transition is server-enforced for complete safety.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {STEPS.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.step}
                                className={`${item.tint} flex flex-col justify-between space-y-6 p-6 transition-transform duration-300 hover:-translate-y-1`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--fm-surface)] text-[var(--fm-primary)] shadow-sm">
                                        <Icon className="h-6 w-6" />
                                    </span>
                                    <span className="fm-heading text-2xl font-extrabold opacity-35">
                                        {item.step}
                                    </span>
                                </div>
                                <div className="space-y-2.5">
                                    <span className="inline-block rounded-full bg-[var(--fm-surface)]/80 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[var(--fm-primary)]">
                                        {item.badge}
                                    </span>
                                    <h3 className="fm-heading text-lg font-bold">{item.title}</h3>
                                    <p className="text-sm leading-relaxed text-[var(--fm-ink-soft)]">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 4. Built for Every Role */}
            <section className="space-y-6">
                <div className="max-w-2xl space-y-1.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--fm-primary)]">
                        Role-Based Ecosystem
                    </p>
                    <h2 className="fm-heading text-2xl font-extrabold sm:text-3xl">
                        Dedicated dashboards for every stakeholder
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {ROLES.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.role}
                                className="fm-card flex flex-col justify-between p-6 transition-transform duration-300 hover:-translate-y-1"
                            >
                                <div>
                                    <span
                                        className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${item.accent}`}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <h3 className="fm-heading mt-4 text-lg font-bold">
                                        {item.role}
                                    </h3>
                                    <p className="mt-1 text-xs text-[var(--fm-ink-soft)]">
                                        {item.subtitle}
                                    </p>

                                    <ul className="mt-5 space-y-2.5 text-sm text-[var(--fm-ink-soft)]">
                                        {item.points.map((point) => (
                                            <li key={point} className="flex items-start gap-2.5">
                                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--fm-primary)]" />
                                                <span className="leading-relaxed">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 5. Trust Pillars + Live Pipeline Strip + Closing CTA */}
            <section className="fm-bento-navy relative overflow-hidden p-8 sm:p-12">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-25 blur-3xl"
                    style={{
                        background: "radial-gradient(circle, #2F6BFF, transparent 70%)",
                    }}
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full opacity-20 blur-3xl"
                    style={{
                        background: "radial-gradient(circle, #FFB020, transparent 70%)",
                    }}
                />

                <div className="relative z-10 space-y-10">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="flex flex-col items-start text-left sm:items-center sm:text-center">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#65D8C4]">
                                <ShieldCheck className="h-6 w-6" />
                            </span>
                            <h3 className="fm-heading mt-4 text-lg !text-white">
                                Admin-Moderated Listings
                            </h3>
                            <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-300">
                                Every service created or edited by a technician is reviewed by an
                                admin before appearing publicly.
                            </p>
                        </div>

                        <div className="flex flex-col items-start text-left sm:items-center sm:text-center">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#FFB020]">
                                <Clock className="h-6 w-6" />
                            </span>
                            <h3 className="fm-heading mt-4 text-lg !text-white">
                                Strict Status Pipeline
                            </h3>
                            <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-300">
                                Jobs move forward one step at a time with server-side validation
                                so no stage can be skipped or altered illegally.
                            </p>
                        </div>

                        <div className="flex flex-col items-start text-left sm:items-center sm:text-center">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#65D8C4]">
                                <CheckCircle2 className="h-6 w-6" />
                            </span>
                            <h3 className="fm-heading mt-4 text-lg !text-white">
                                Post-Completion Stripe Checkout
                            </h3>
                            <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-300">
                                The Pay Now button unlocks only when your technician completes the
                                repair and confirms the final amount.
                            </p>
                        </div>
                    </div>

                    {/* Visual Status Pipeline Bar */}
                    <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-xs font-semibold text-slate-200">
                        {PIPELINE_STAGES.map((stage, index) => (
                            <div key={stage.label} className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1">
                                    <span
                                        className={`h-2 w-2 rounded-full ${stage.dot}`}
                                        aria-hidden="true"
                                    />
                                    {stage.label}
                                </span>
                                {index < PIPELINE_STAGES.length - 1 && (
                                    <ArrowRight
                                        className="h-3.5 w-3.5 text-slate-400"
                                        aria-hidden="true"
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Bottom CTA Strip */}
                    <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
                        <div>
                            <h3 className="fm-heading text-xl font-bold !text-white">
                                Ready to get your device back in shape?
                            </h3>
                            <p className="mt-1 text-sm text-slate-300">
                                Browse verified local repair services or create a technician
                                account in under a minute.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/services" className="fm-btn-primary">
                                Browse Services
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/sign-up"
                                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}