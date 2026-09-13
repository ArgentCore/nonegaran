import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "وقتی (یادداشت‌ها)",
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl mb-8">وقتی (یادداشت‌ها)</h1>
      <div className="flex flex-col gap-6 text-lg leading-8">
        <p className="font-display text-3xl leading-[1.7] mb-8">
          گاهی درباره‌ی کتاب‌ها، گاهی درباره‌ی نان.
        </p>
        <p className="leading-8 text-[var(--foreground)] max-w-[65ch] mb-6">
          اینجا فضایی است برای یادداشت‌های ویراستاران و نویسندگان نونگاران. مجموعه‌ی مقالات و نقدهای ما به‌زودی در این بخش منتشر خواهد شد.
        </p>
      </div>
    </div>
  );
}
