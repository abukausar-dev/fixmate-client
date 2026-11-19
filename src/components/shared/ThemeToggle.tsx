"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
    const toggleTheme = () => {
        const root = document.documentElement;
        const isNowDark = root.classList.toggle("dark");
        try {
            localStorage.setItem("fixmate-theme", isNowDark ? "dark" : "light");
        } catch {
            // Ignore storage restrictions
        }
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle light and dark mode"
            title="Switch Light / Dark Mode"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--fm-surface-border)] bg-[var(--fm-surface)] text-[var(--fm-ink)] shadow-sm transition-transform duration-150 hover:scale-105 active:scale-95"
        >
            {/* Shown in Dark Mode -> switches to Light */}
            <Sun className="fm-sun-icon h-4 w-4 text-[#FFB020]" />
            {/* Shown in Light Mode -> switches to Dark */}
            <Moon className="fm-moon-icon h-4 w-4 text-[#2F6BFF]" />
        </button>
    );
}