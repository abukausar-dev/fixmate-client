"use client";

import { useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";

type FaqCategory = "all" | "customers" | "technicians" | "payments";

interface FaqItem {
    id: string;
    category: Exclude<FaqCategory, "all">;
    question: string;
    answer: string;
}

const CATEGORIES: { id: FaqCategory; label: string }[] = [
    { id: "all", label: "All Topics" },
    { id: "customers", label: "Customers" },
    { id: "technicians", label: "Technicians" },
    { id: "payments", label: "Payments & Security" },
];

const FAQ_ITEMS: FaqItem[] = [
    {
        id: "pay-after-completion",
        category: "payments",
        question: "Do I have to pay anything before my device is repaired?",
        answer:
            "No. FixMate follows a strict pay-after-completion model. You pay $0 upfront when sending a repair request. The Pay Now button only unlocks after your technician finishes the job, marks it Completed, and confirms the final amount.",
    },
    {
        id: "cancel-booking",
        category: "customers",
        question: "When can I cancel a repair request?",
        answer:
            "You can cancel a booking directly from My Bookings while its status is still Requested. Once a technician accepts the request and moves it to Accepted or In Progress, cancellation is locked to protect scheduled work.",
    },
    {
        id: "duplicate-request",
        category: "customers",
        question: "Why can't I book the same service twice at the same time?",
        answer:
            "To prevent accidental duplicate orders, customers cannot hold two active requests (Requested, Accepted, or In Progress) for the same service simultaneously. Once the current booking is completed, rejected, or cancelled, you can book it again anytime.",
    },
    {
        id: "status-pipeline",
        category: "customers",
        question: "How does FixMate track my repair progress?",
        answer:
            "Every job follows a strict, server-enforced one-step pipeline: Requested → Accepted → In Progress → Completed → Paid. Technicians cannot skip stages, so you always see accurate real-time progress in your Customer Dashboard.",
    },
    {
        id: "service-modes",
        category: "customers",
        question: "What is the difference between Home Visit and Shop Drop-off?",
        answer:
            "Home Visit means the technician comes to your provided service address (ideal for AC, Refrigerator, TV, Washing Machine, and Electrical work). Shop Drop-off means you deliver the device to the technician's workshop (common for Smartphone and Laptop repairs).",
    },
    {
        id: "tech-approval",
        category: "technicians",
        question: "Why is my newly added service not visible on the public Services page yet?",
        answer:
            "All services submitted by technicians start with an approval status of Pending. A FixMate Admin reviews the listing to ensure quality and accuracy before approving it. Only Approved and Available services appear publicly.",
    },
    {
        id: "tech-edit-pending",
        category: "technicians",
        question: "What happens if a technician edits an already approved service?",
        answer:
            "Whenever a technician updates a service's details or pricing, its approval status automatically returns to Pending for admin re-review. If you only want to pause bookings temporarily, use the Availability toggle instead.",
    },
    {
        id: "tech-final-amount",
        category: "technicians",
        question: "How is the final repair price decided?",
        answer:
            "Each service card shows a transparent starting base price. When marking an In Progress job as Completed, the technician enters the confirmed final amount (pre-filled with the base price), which is then billed to the customer via Stripe.",
    },
    {
        id: "tech-book-own",
        category: "technicians",
        question: "Can technicians or admins submit repair requests?",
        answer:
            "No. Repair requests are restricted strictly to Customer accounts. Technicians cannot request their own or other services, and Admins focus exclusively on moderation, user management, and platform oversight.",
    },
    {
        id: "stripe-security",
        category: "payments",
        question: "How are online payments and receipts handled?",
        answer:
            "All online payments are processed securely through Stripe Checkout using server-verified booking amounts—never client-submitted prices. Once completed, your payment is recorded via signed Stripe webhooks and appears with its Transaction ID in Payment History.",
    },
    {
        id: "cancelled-checkout",
        category: "payments",
        question: "What happens if I leave or cancel the Stripe payment page?",
        answer:
            "Nothing is charged and your booking simply stays Completed and Unpaid. You can return to My Bookings and click Pay Now whenever you are ready to finish payment.",
    },
    {
        id: "duplicate-payment-protection",
        category: "payments",
        question: "Can I accidentally be charged twice if I refresh the payment page?",
        answer:
            "No. Each Stripe Checkout session ID is enforced as unique on the server, and once a booking is marked Paid, the Pay Now button is permanently replaced by a Paid badge.",
    },
];

export function HelpCenterFaq() {
    const [activeCategory, setActiveCategory] = useState<FaqCategory>("all");
    const [query, setQuery] = useState("");
    const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

    const normalizedQuery = query.trim().toLowerCase();

    const filteredFaqs = FAQ_ITEMS.filter((item) => {
        const matchesCategory =
            activeCategory === "all" || item.category === activeCategory;
        const matchesSearch =
            !normalizedQuery ||
            item.question.toLowerCase().includes(normalizedQuery) ||
            item.answer.toLowerCase().includes(normalizedQuery);
        return matchesCategory && matchesSearch;
    });

    const handleReset = () => {
        setQuery("");
        setActiveCategory("all");
    };

    return (
        <section className="space-y-6" aria-labelledby="faq-heading">
            {/* Search & Category Controls */}
            <div className="fm-card space-y-5 p-5 sm:p-6">
                <div className="relative">
                    <label htmlFor="help-search" className="sr-only">
                        Search frequently asked questions
                    </label>
                    <Search
                        aria-hidden="true"
                        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fm-ink-soft)]"
                    />
                    <input
                        id="help-search"
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by keyword (e.g. Stripe, cancel, pending, Home Visit)..."
                        className="w-full rounded-full border border-slate-300/80 bg-[var(--fm-surface)] py-3 pl-11 pr-11 text-sm text-inherit outline-none transition placeholder:text-[var(--fm-ink-soft)]/70 focus:border-[var(--fm-primary)] focus:ring-2 focus:ring-[var(--fm-primary)]/20 dark:border-white/15"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery("")}
                            aria-label="Clear search query"
                            className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[var(--fm-ink-soft)] transition hover:bg-slate-200/60 dark:hover:bg-white/10"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Category Filter Pills */}
                <div
                    role="tablist"
                    aria-label="FAQ categories"
                    className="flex flex-wrap items-center gap-2"
                >
                    {CATEGORIES.map((tab) => {
                        const isActive = activeCategory === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                onClick={() => setActiveCategory(tab.id)}
                                className={`rounded-full px-4 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fm-primary)] sm:text-sm ${isActive
                                        ? "bg-[var(--fm-primary)] text-white shadow-sm"
                                        : "border border-slate-300/70 bg-[var(--fm-surface)] text-[var(--fm-ink-soft)] hover:border-[var(--fm-primary)] hover:text-[var(--fm-primary)] dark:border-white/15"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                    <span className="ml-auto text-xs font-medium text-[var(--fm-ink-soft)]">
                        {filteredFaqs.length}{" "}
                        {filteredFaqs.length === 1 ? "answer" : "answers"}
                    </span>
                </div>
            </div>

            {/* Accordion List or Empty State */}
            {filteredFaqs.length === 0 ? (
                <div className="fm-card flex flex-col items-center justify-center px-6 py-12 text-center">
                    <p className="fm-heading text-lg font-bold">
                        No matching answers found
                    </p>
                    <p className="mt-1.5 max-w-md text-sm text-[var(--fm-ink-soft)]">
                        Try searching with simpler terms like &ldquo;Stripe&rdquo;,
                        &ldquo;cancel&rdquo;, or &ldquo;approval&rdquo;, or browse all
                        topics.
                    </p>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="fm-btn-primary mt-5"
                    >
                        Reset Filters
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredFaqs.map((item) => {
                        const isOpen = openId === item.id;
                        const panelId = `faq-panel-${item.id}`;
                        const buttonId = `faq-button-${item.id}`;

                        return (
                            <div
                                key={item.id}
                                className="fm-card overflow-hidden transition hover:border-[var(--fm-primary)]/40"
                            >
                                <h3>
                                    <button
                                        id={buttonId}
                                        type="button"
                                        aria-expanded={isOpen}
                                        aria-controls={panelId}
                                        onClick={() =>
                                            setOpenId(isOpen ? null : item.id)
                                        }
                                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--fm-primary)] sm:px-6 sm:py-5"
                                    >
                                        <span className="fm-heading text-sm font-bold leading-snug sm:text-base">
                                            {item.question}
                                        </span>
                                        <ChevronDown
                                            aria-hidden="true"
                                            className={`h-5 w-5 shrink-0 text-[var(--fm-primary)] transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                                                }`}
                                        />
                                    </button>
                                </h3>

                                {isOpen && (
                                    <div
                                        id={panelId}
                                        role="region"
                                        aria-labelledby={buttonId}
                                        className="border-t border-slate-200/70 px-5 pb-5 pt-4 text-sm leading-relaxed text-[var(--fm-ink-soft)] dark:border-white/10 sm:px-6"
                                    >
                                        {item.answer}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}