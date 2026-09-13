import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "درباره‌ی نونگاران",
  description: "نونگاران چیست و با چه معیاری کتاب منتشر می‌کند؛ معرفی رویکرد نشر.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl mb-8">درباره‌ی نونگاران</h1>
      <div className="flex flex-col gap-6 text-lg leading-8">
        <p className="font-display text-3xl leading-[1.7] mb-8">
          نونگاران خانه‌ی کتاب‌هایی است که برای ذهن نان می‌شوند.
        </p>
        <p className="leading-8 text-[var(--foreground)] max-w-[65ch] mb-6">
          ما در نونگاران باور داریم که کتاب کالایی برای مصرف آنی نیست؛ بلکه تجربه‌ای است که باید در ذهن خواننده ریشه بدواند. تمرکز ما بر انتشار آثاری است که از نظر ادبی و محتوایی، حرفی تازه برای گفتن داشته باشند.
        </p>
        <p className="leading-8 text-[var(--foreground)] max-w-[65ch] text-[var(--text-muted)]">
          این صفحه در فازهای بعدی با روایت کامل‌تری از تاریخچه و چشم‌انداز نشر به‌روزرسانی خواهد شد.
        </p>
      </div>
    </div>
  );
}
