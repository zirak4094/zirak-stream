import type { Metadata, Viewport } from "next";
import { Vazirmatn, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "زیرەک ستریم";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — فیلم و زنجیرە بە کوردی`,
    template: `%s · ${siteName}`,
  },
  description:
    "زیرەک ستریم پلاتفۆرمێکی بینینی فیلم و زنجیرەی کوردییە، بە بەرزترین کوالیتی و وەرگێڕانی سۆرانی.",
  applicationName: siteName,
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ckb" dir="rtl" className={`${vazirmatn.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-[var(--color-canvas)] antialiased">
        {children}
        <Toaster
          position="top-center"
          dir="rtl"
          richColors
          theme="dark"
          toastOptions={{
            style: {
              background: "var(--color-surface-raised)",
              border: "1px solid var(--color-border)",
              color: "var(--color-ink)",
            },
          }}
        />
      </body>
    </html>
  );
}
