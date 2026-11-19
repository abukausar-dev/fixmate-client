import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "FixMate | Smart Device & Home Appliance Repair Platform",
  description:
    "Book verified technicians for smartphones, laptops, AC, refrigerator, TV, washing machine, and electrical repairs. Pay only after completion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#F4F7F8] text-[#102B3F] antialiased selection:bg-[#176B72] selection:text-white">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}