import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "وقتی — یادداشت‌های نونگاران",
  description: "یادداشت‌های نونگاران درباره‌ی کتاب‌ها و نوشتن؛ این بخش به‌زودی منتشر می‌شود.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl mb-8">وقتی</h1>
      <div className="flex flex-col gap-6 text-lg leading-8">
        <p className="font-display text-3xl leading-[1.7] mb-8">
          گاهی درباره‌ی کتاب‌ها، گاهی درباره‌ی نان.
        </p>
        <p className="leading-8 text-[var(--foreground)] max-w-[65ch] mb-6">
          «وقتی» جای یادداشت‌های ویراستاران و نویسندگان نونگاران است. این بخش به‌زودی با نخستین یادداشت‌ها باز می‌شود.
        </p>
      </div>
    </div>
  );
}
