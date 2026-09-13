import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "پذیرش اثر",
};

export default function SubmissionPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl mb-8">پذیرش اثر</h1>
      <div className="flex flex-col gap-6 text-lg leading-8">
        <p className="font-display text-3xl leading-[1.7] mb-8">
          اگر کلمه‌ای دارید که باید شنیده شود.
        </p>
        <p className="leading-8 text-[var(--foreground)] max-w-[65ch] mb-6">
          ما همواره از خواندن آثار منتشرنشده و پیشنهادها استقبال می‌کنیم. در حال حاضر، فرآیند ثبت‌نام و ارسال آنلاین اثر در دست توسعه است.
        </p>
        <p className="leading-8 text-[var(--foreground)] max-w-[65ch] text-[var(--text-muted)]">
          تا زمان فعال‌سازی سامانه، لطفاً برای ارتباط با شورای نویسندگان، از بخش تماس با ما استفاده کنید.
        </p>
      </div>
    </div>
  );
}
