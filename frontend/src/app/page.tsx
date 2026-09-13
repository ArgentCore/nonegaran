import Link from "next/link";
import BookCover from "@/components/book/BookCover";
import { featuredBooks } from "@/data/books";

export default function HomePage() {
  const [lead, ...rest] = featuredBooks;

  return (
    <div className="flex flex-col gap-28 pb-28">
      {/* ---------- Hero ---------- */}
      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 pt-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:pt-24">
        <div className="flex flex-col gap-6">
          <h1 className="font-display text-4xl leading-[1.5] md:text-5xl">
            نانِ روز را از نانوایی می‌گیرید؛ نانِ ذهن را از نونگاران.
          </h1>
          <p className="max-w-[46ch] text-lg leading-8 text-[var(--text-muted)]">
            نونگاران خانه‌ی کتاب‌هایی است که خوانده می‌شوند تا چیزی در ذهن
            جا بماند — رمان، شعر و اندیشه، با ویرایشی که به متن احترام
            می‌گذارد.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/ketabha"
              className="bg-[var(--accent)] text-[var(--color-ink)] px-6 py-3 rounded-[var(--radius-control)] hover:bg-[var(--accent-strong)] transition-colors"
            >
              مرور کتاب‌ها
            </Link>
            <Link
              href="/darbare-ma"
              className="text-[var(--link)] hover:text-[var(--link-strong)] underline underline-offset-4"
            >
              درباره‌ی نونگاران
            </Link>
          </div>
        </div>

        <div
          className="relative mx-auto flex h-72 w-full max-w-sm items-end justify-center md:h-96"
          aria-hidden
        >
          <div className="absolute right-[8%] bottom-0 w-[46%] -rotate-3">
            <BookCover book={lead} emphasis="large" className="pointer-events-none" />
          </div>
          <div className="absolute left-[6%] bottom-4 w-[38%] rotate-2 opacity-90">
            <BookCover book={rest[0]} className="pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ---------- New releases ---------- */}
      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="font-display text-2xl">تازه‌های نشر</h2>
          <Link
            href="/ketabha"
            className="text-sm text-[var(--link)] hover:text-[var(--link-strong)]"
          >
            مشاهده‌ی همه
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          <div className="col-span-2">
            <BookCover book={lead} emphasis="large" />
          </div>
          {rest.map((book) => (
            <div key={book.slug} className="col-span-1">
              <BookCover book={book} />
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Brand story ---------- */}
      <section className="border-y border-[var(--hairline)] bg-[var(--surface-raised)]">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="font-display text-3xl leading-[1.7] md:text-4xl">
            «نونگاران» یعنی نان‌پزها. ما هم نان می‌پزیم — نانی که با چشم
            خورده می‌شود.
          </p>
          <p className="mt-6 text-[var(--text-muted)] leading-8">
            هر کتابی که منتشر می‌کنیم، از یک صافی عبور کرده: آیا چیزی برای
            گفتن دارد؟ نونگاران ناشری است که کیفیت متن را به تیراژ ترجیح
            می‌دهد.
          </p>
        </div>
      </section>

      {/* ---------- Manuscript submission teaser (honest) ---------- */}
      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="grid gap-8 rounded-[var(--radius-control)] bg-[var(--color-petrol)] p-10 text-[var(--color-paper)] md:grid-cols-[1fr_auto] md:items-center md:p-14">
          <div className="flex flex-col gap-3">
            <h2 className="font-display text-2xl md:text-3xl">
              نویسنده یا مترجم هستید؟
            </h2>
            <p className="max-w-[52ch] opacity-90 leading-7">
              نونگاران همواره پذیرای آثار تازه است.
              سامانه‌ی ارسال اثر به‌زودی در اختیار شما قرار می‌گیرد.
            </p>
          </div>
          <Link
            href="/pazireshe-asar"
            className="justify-self-start rounded-[var(--radius-control)] bg-[var(--color-paper)] px-6 py-3 text-[var(--color-ink)] transition-opacity hover:opacity-90 md:justify-self-end"
          >
            شرایط پذیرش اثر
          </Link>
        </div>
      </section>

      {/* ---------- Newsletter (honest — no fake form) ---------- */}
      <section className="mx-auto w-full max-w-2xl px-6 text-center">
        <h2 className="font-display text-2xl">از تازه‌های نشر باخبر شوید</h2>
        <p className="mt-2 text-[var(--text-muted)]">
          خبرنامه‌ی نونگاران در دست آماده‌سازی است.
        </p>
        <p className="mt-6 text-sm text-[var(--text-muted)]">
          به‌زودی راهی برای باخبر شدن از کتاب‌های تازه در اختیار شما قرار
          می‌گیرد.
        </p>
      </section>
    </div>
  );
}
