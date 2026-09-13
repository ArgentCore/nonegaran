import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const vazirmatn = localFont({
  src: "../fonts/Vazirmatn-Variable.woff2",
  variable: "--font-vazir",
  display: "swap",
  weight: "100 900",
});

const notoNaskh = localFont({
  src: "../fonts/NotoNaskhArabic-Variable.ttf",
  variable: "--font-naskh",
  display: "swap",
  weight: "400 700",
});

export const metadata: Metadata = {
  title: {
    default: "نونگاران | خانه‌ی نشر",
    template: "%s | نونگاران",
  },
  description:
    "نونگاران، ناشر کتاب‌های ادبیات و اندیشه — کتاب‌هایی که برای ذهن نان می‌شوند.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fa"
      dir="rtl"
      data-theme="light"
      className={`${vazirmatn.variable} ${notoNaskh.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-link">
          پرش به محتوای اصلی
        </a>
        <Header />
        <main id="main-content" className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}