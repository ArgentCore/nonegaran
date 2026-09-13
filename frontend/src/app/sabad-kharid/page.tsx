import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سبد خرید",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl mb-8">سبد خرید</h1>
      <div className="flex flex-col gap-6 text-lg leading-8">
        <p className="font-display text-3xl leading-[1.7] mb-8">
          سبد خرید شما در حال حاضر خالی است.
        </p>
        <p className="leading-8 text-[var(--foreground)] max-w-[65ch] mb-6">
          سامانه‌ی خرید آنلاین و درگاه پرداخت در فاز سوم پروژه راه‌اندازی خواهد شد. تا آن زمان، می‌توانید فهرست کتاب‌های مورد علاقه‌ی خود را از بخش «کتاب‌ها» مرور کنید.
        </p>
      </div>
    </div>
  );
}
