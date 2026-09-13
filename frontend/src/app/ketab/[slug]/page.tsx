import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, BookOpen, Calendar, Ruler, Hash } from "lucide-react";
import { getBookBySlug, allBooks } from "@/data/books";
import { formatToman } from "@/lib/format";

const toneMap: Record<string, string> = {
  saffron: "var(--color-saffron)",
  petrol: "var(--color-petrol)",
  ink: "var(--color-ink)",
  moss: "var(--color-moss)",
  clay: "var(--color-clay)",
};

const toneTextMap: Record<string, string> = {
  saffron: "var(--color-ink)",
  petrol: "var(--color-paper)",
  ink: "var(--color-paper)",
  moss: "var(--color-paper)",
  clay: "var(--color-paper)",
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) return { title: "کتاب یافت نشد" };

  return {
    title: book.title,
    description: book.description || `کتاب ${book.title} اثر ${book.author} - نشر نونگاران`,
    openGraph: {
      title: book.title,
      description: book.description || `کتاب ${book.title} اثر ${book.author}`,
      type: "book",
      authors: [book.author],
    },
  };
}

export function generateStaticParams() {
  return allBooks.map((b) => ({ slug: b.slug }));
}

export default async function BookDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const book = getBookBySlug(slug);

  if (!book) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <nav aria-label="مسیر راهنما" className="mb-8 flex items-center gap-2 text-sm text-[var(--text-muted)]">
        <Link href="/" className="hover:text-[var(--link)]">خانه</Link>
        <ChevronLeft size={14} aria-hidden className="opacity-50" />
        <Link href="/ketabha" className="hover:text-[var(--link)]">کتاب‌ها</Link>
        <ChevronLeft size={14} aria-hidden className="opacity-50" />
        <span aria-current="page" className="text-[var(--foreground)]">{book.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.5fr]">
        <div className="flex flex-col items-center md:items-start">
          <div 
            className="w-full max-w-sm aspect-[3/4] rounded-[var(--radius-control)] flex flex-col justify-between p-8 shadow-lg"
            style={{ background: toneMap[book.coverTone], color: toneTextMap[book.coverTone] }}
          >
            <span className="text-sm opacity-80 font-display">{book.category}</span>
            <div className="flex flex-col gap-2">
              <h1 className="font-display text-4xl leading-tight">{book.title}</h1>
              <span className="text-lg opacity-90">{book.author}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <header className="flex flex-col gap-4 border-b border-[var(--hairline)] pb-8">
            <h1 className="font-display text-4xl md:text-5xl leading-[1.3]">{book.title}</h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-lg">
              {book.authorSlug ? (
                <Link href={`/nevisandegan/${book.authorSlug}`} className="text-[var(--link)] hover:text-[var(--link-strong)] font-medium">
                  {book.author}
                </Link>
              ) : (
                <span className="font-medium">{book.author}</span>
              )}
              {book.translator && (
                <span className="text-[var(--text-muted)]">
                  ترجمه‌ی <span className="text-[var(--foreground)]">{book.translator}</span>
                </span>
              )}
            </div>
          </header>

          <div className="flex flex-col gap-6 bg-[var(--surface-raised)] p-6 rounded-[var(--radius-control)] border border-[var(--hairline)]">
            <div className="flex items-baseline justify-between">
              <span className="text-[var(--text-muted)]">قیمت:</span>
              <span className="text-2xl font-medium ltr-run">{formatToman(book.priceToman)} <span className="text-sm text-[var(--text-muted)]">تومان</span></span>
            </div>
            
            <div className="flex items-center gap-3">
              {book.inStock ? (
                <span className="flex items-center gap-2 text-[var(--color-moss)] text-sm">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-moss)]" aria-hidden></span>
                  موجود در انبار
                </span>
              ) : (
                <span className="flex items-center gap-2 text-[var(--color-clay)] text-sm">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-clay)]" aria-hidden></span>
                  ناموجود
                </span>
              )}
              {book.isPreorder && (
                <span className="text-xs bg-[var(--color-saffron)] text-[var(--color-ink)] px-2 py-0.5 rounded">پیش‌فروش</span>
              )}
            </div>

            <button 
              disabled={!book.inStock}
              className="w-full bg-[var(--foreground)] text-[var(--background)] py-3 rounded-[var(--radius-control)] font-medium transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {book.inStock ? "افزودن به سبد خرید" : "ناموجود"}
            </button>
            <p className="text-xs text-center text-[var(--text-muted)]">
              امکان خرید آنلاین در فازهای بعدی فعال می‌شود.
            </p>
          </div>

          {book.description && (
            <section aria-labelledby="desc-heading" className="flex flex-col gap-4">
              <h2 id="desc-heading" className="font-display text-xl">درباره‌ی کتاب</h2>
              <p className="leading-8 text-[var(--foreground)] max-w-[65ch]">{book.description}</p>
            </section>
          )}

          <section aria-labelledby="specs-heading" className="flex flex-col gap-4 pt-8 border-t border-[var(--hairline)]">
            <h2 id="specs-heading" className="font-display text-xl">مشخصات</h2>
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-8 text-sm">
              {book.pages && (
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-[var(--text-muted)]" aria-hidden />
                  <dt className="text-[var(--text-muted)]">تعداد صفحات:</dt>
                  <dd className="ltr-run">{book.pages}</dd>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Ruler size={16} className="text-[var(--text-muted)]" aria-hidden />
                <dt className="text-[var(--text-muted)]">قطع:</dt>
                <dd>{book.bookSize}</dd>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[var(--text-muted)]" aria-hidden />
                <dt className="text-[var(--text-muted)]">سال انتشار:</dt>
                <dd className="ltr-run">{book.year}</dd>
              </div>
              {book.isbn && (
                <div className="flex items-center gap-2">
                  <Hash size={16} className="text-[var(--text-muted)]" aria-hidden />
                  <dt className="text-[var(--text-muted)]">شابک:</dt>
                  <dd className="ltr-run">{book.isbn}</dd>
                </div>
              )}
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}