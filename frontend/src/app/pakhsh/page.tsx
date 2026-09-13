import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "پخش و همکاری",
  description: "اطلاع‌یه‌ی پخش و همکاری نونگاران؛ جزئیات شرایط همکاری به‌زودی منتشر می‌شود.",
};

export default function DistributionPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl mb-8">پخش و همکاری</h1>
      <div className="flex flex-col gap-6 text-lg leading-8">
        <p className="font-display text-3xl leading-[1.7] mb-8">
          شرایط پخش و همکاری با کتاب‌فروشی‌ها و مراکز پخش، به‌زودی اینجا منتشر می‌شود.
        </p>
        <p className="leading-8 text-[var(--foreground)] max-w-[65ch] mb-6">
          تا آن زمان، برای گفت‌وگو درباره‌ی همکاری، می‌توانید از صفحه‌ی «تماس با ما» استفاده کنید.
        </p>
      </div>
    </div>
  );
}
