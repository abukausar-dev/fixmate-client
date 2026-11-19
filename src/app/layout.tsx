import type { Metadata } from "next";
import { Toaster } from "sonner";
import { AuroraBackground } from "@/components/shared/AuroraBackground";
import "./globals.css";

export const metadata: Metadata = {
  title: "FixMate | Smart Device & Home Appliance Repair Platform",
  description:
    "Book verified technicians for smartphones, laptops, AC, refrigerator, TV, washing machine, and electrical repairs. Pay only after completion.",
};

// Prevents flash of wrong theme on page reload before React hydrates
const themeInitScript = `
  (function() {
    try {
      var saved = localStorage.getItem('fixmate-theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (saved === 'dark' || (!saved && prefersDark)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="relative min-h-screen bg-[var(--fm-canvas)] text-[var(--fm-ink)] antialiased selection:bg-[#2F6BFF] selection:text-white">
        <AuroraBackground />
        <div className="relative z-10">{children}</div>
        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            className:
              "!rounded-2xl !border !border-[var(--fm-nav-border)] !bg-[var(--fm-glass-strong)] !backdrop-blur-md !text-[var(--fm-ink)]",
          }}
        />
      </body>
    </html>
  );
}