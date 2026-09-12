import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Body / UI typeface — modern, highly legible, full Persian + Latin digit
// support. Self-hosted (not next/font/google) because this variable font
// file is fetched from the upstream project's own repository.
const vazirmatn = localFont({
  src: "../fonts/Vazirmatn-Variable.woff2",
  variable: "--font-vazir",
  display: "swap",
  weight: "100 900",
});

// Display typeface — a naskh with print/letterpress character, used for
// headlines, book titles, and hero moments. Deliberately not a geometric
// sans, to avoid the generic "tech" register for a publishing brand.
const notoNaskh = localFont({
  src: "../fonts/NotoNaskhArabic-Variable.ttf",
  variable: "--font-naskh",
  display: "swap",
  weight: "400 700",
});

export const metadata: Metadata = {
  title: "نونگاران | خانه‌ی نشر",
  description:
    "نونگاران، ناشر کتاب‌های ادبیات و اندیشه — کتاب‌هایی که برای ذهن نان می‌شوند.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      data-theme="light"
      className={`${vazirmatn.variable} ${notoNaskh.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
