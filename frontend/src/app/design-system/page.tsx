import ThemeToggle from "@/components/ThemeToggle";

const palette = [
  { name: "Wheat / Paper", cssVar: "--color-paper", role: "پس‌زمینه‌ی اصلی" },
  { name: "Ink", cssVar: "--color-ink", role: "متن اصلی" },
  { name: "Saffron", cssVar: "--color-saffron", role: "تاکید اصلی / CTA" },
  { name: "Petrol", cssVar: "--color-petrol", role: "لینک / تاکید ثانویه" },
  { name: "Clay", cssVar: "--color-clay", role: "خطا (مصرف محدود)" },
  { name: "Moss", cssVar: "--color-moss", role: "موفقیت (مصرف محدود)" },
];

/**
 * Internal living style guide — not linked from the public site nav.
 * Kept as a reference/QA tool for the design system tokens defined in
 * globals.css. See docs/design-system.md for the full rationale.
 */
export default function DesignSystemPreview() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16 flex flex-col gap-16">
      <header className="flex items-start justify-between gap-6 border-b border-[var(--hairline)] pb-8">
        <div>
          <p className="text-sm text-[var(--text-muted)] mb-2">
            پیش‌نمایش داخلی — نسخه ۲ (پس از QA)
          </p>
          <h1 className="font-display text-4xl leading-relaxed">
            سیستم طراحی نونگاران
          </h1>
        </div>
        <ThemeToggle />
      </header>

      <section aria-labelledby="type-heading" className="flex flex-col gap-6">
        <h2 id="type-heading" className="text-sm text-[var(--text-muted)]">
          تایپوگرافی
        </h2>
        <p className="font-display text-5xl leading-[1.4]">نانی برای ذهن</p>
        <p className="max-w-[60ch] leading-8">
          این متن با فونت وزیرمتن نوشته شده تا خوانایی رابط کاربری و متن‌های
          بلند را در اندازه‌ی مناسب تضمین کند. طول خط عمداً کمتر از هشتاد
          نویسه نگه داشته شده است.{" "}
          <span className="ltr-run">Vazirmatn</span> برای بدنه و{" "}
          <span className="font-display">Noto Naskh Arabic</span> برای
          عنوان‌ها استفاده می‌شود.
        </p>
      </section>

      <section aria-labelledby="color-heading" className="flex flex-col gap-6">
        <h2 id="color-heading" className="text-sm text-[var(--text-muted)]">
          رنگ
        </h2>
        <ul className="flex flex-col gap-3">
          {palette.map((c) => (
            <li
              key={c.cssVar}
              className="flex items-center gap-4 border border-[var(--hairline)] p-3 rounded-[var(--radius-control)]"
            >
              <span
                aria-hidden
                className="h-10 w-10 shrink-0 rounded-[var(--radius-control)] border border-[var(--hairline)]"
                style={{ background: `var(${c.cssVar})` }}
              />
              <div className="flex flex-col">
                <span className="font-medium">{c.name}</span>
                <span className="text-sm text-[var(--text-muted)]">
                  {c.role}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="controls-heading" className="flex flex-col gap-6">
        <h2 id="controls-heading" className="text-sm text-[var(--text-muted)]">
          کنترل‌ها
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <button className="bg-[var(--accent)] text-[var(--color-ink)] px-5 py-2.5 rounded-[var(--radius-control)] hover:bg-[var(--accent-strong)] transition-colors">
            افزودن به سبد
          </button>
          <button className="border border-[var(--hairline)] px-5 py-2.5 rounded-[var(--radius-control)] hover:border-[var(--link)] transition-colors">
            مشاهده‌ی جزئیات
          </button>
          <a
            href="#"
            className="text-[var(--link)] hover:text-[var(--link-strong)] underline underline-offset-4"
          >
            یک پیوند نمونه
          </a>
        </div>
      </section>

      <section aria-labelledby="numeral-heading" className="flex flex-col gap-4">
        <h2 id="numeral-heading" className="text-sm text-[var(--text-muted)]">
          نمایش اعداد (فارسی و قیمت)
        </h2>
        <p className="flex flex-wrap items-baseline gap-2">
          <span>قیمت: ۱۸۵٬۰۰۰ تومان — موجودی: ۴ نسخه — چاپ سوم، سال</span>
          <span className="ltr-run">1403</span>
        </p>
        <p className="text-sm text-[var(--text-muted)]">
          سال چاپ و شماره‌ی چاپ به‌صورت رقم لاتین ایزوله (
          <span className="ltr-run">.ltr-run</span>) نمایش داده می‌شود تا در
          جریان راست‌به‌چپ جابه‌جا نشود؛ قیمت و شمارش با ارقام فارسی نوشته
          می‌شود چون بخشی از متن است.
        </p>
      </section>

      <section aria-labelledby="grid-heading" className="flex flex-col gap-4">
        <h2 id="grid-heading" className="text-sm text-[var(--text-muted)]">
          نمونه‌ی Grid نامتقارن
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 items-end">
          <div className="col-span-3 sm:col-span-3 aspect-[3/4] bg-[var(--surface-raised)] border border-[var(--hairline)] rounded-[var(--radius-control)]" />
          <div className="col-span-2 sm:col-span-2 aspect-[3/4] bg-[var(--surface-raised)] border border-[var(--hairline)] rounded-[var(--radius-control)] self-start mt-6" />
          <div className="col-span-1 sm:col-span-1 aspect-[3/4] bg-[var(--surface-raised)] border border-[var(--hairline)] rounded-[var(--radius-control)] self-end" />
        </div>
      </section>
    </main>
  );
}
