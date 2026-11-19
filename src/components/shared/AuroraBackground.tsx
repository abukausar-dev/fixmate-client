// Fixed subtle ambient aurora layer rendered behind the entire app
export function AuroraBackground() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        >
            {/* Top-right soft cobalt glow */}
            <div className="fm-aurora-blob-cobalt absolute -right-24 -top-24 h-[520px] w-[520px] rounded-full" />

            {/* Bottom-left warm amber glow */}
            <div className="fm-aurora-blob-amber absolute -bottom-32 -left-24 h-[480px] w-[480px] rounded-full" />

            {/* Center-left calm mint accent */}
            <div className="fm-aurora-blob-mint absolute left-1/3 top-1/3 h-[420px] w-[420px] rounded-full" />
        </div>
    );
}