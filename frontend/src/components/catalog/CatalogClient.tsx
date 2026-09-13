"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useCallback, useTransition } from "react";
import type { Book } from "@/lib/types";
import { allBooks } from "@/data/books";
import BookCover from "@/components/book/BookCover";
import { formatToman } from "@/lib/format";

interface CatalogClientProps {
  books: Book[];
  totalBooks: number;
  currentParams: {
    q?: string;
    category?: string;
    author?: string;
    size?: string;
    maxPrice?: number;
    sort?: string;
  };
}

export default function CatalogClient({
  books,
  totalBooks,
  currentParams,
}: CatalogClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const categories = Array.from(
    new Set(
      allBooks
        .filter((b) => b.categorySlug)
        .map((b) => ({ slug: b.categorySlug!, name: b.category }))
    )
  ).filter((c, i, arr) => arr.findIndex((x) => x.slug === c.slug) === i);

  const authors = Array.from(
    new Set(
      allBooks
        .filter((b) => b.authorSlug)
        .map((b) => ({ slug: b.authorSlug!, name: b.author }))
    )
  ).filter((a, i, arr) => arr.findIndex((x) => x.slug === a.slug) === i);

  const sizes = Array.from(new Set(allBooks.map((b) => b.bookSize)));

  const createQueryString = useCallback(
    (name: string, value: string | number | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === "" || value === 400000) {
        params.delete(name);
      } else {
        params.set(name, String(value));
      }
      return params.toString();
    },
    [searchParams]
  );

  const updateFilter = (name: string, value: string | number | null) => {
    startTransition(() => {
      router.push(`/ketabha?${createQueryString(name, value)}`, {
        scroll: false,
      });
    });
  };

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-[240px_1fr]">
      <aside
        aria-label="فیلترها"
        className="flex flex-col gap-8 md:sticky md:top-24 md:self-start"
      >
        <div>
          <label htmlFor="catalog-search" className="sr-only">
            جستجوی کتاب
          </label>
          <div className="relative">
            <Search
              size={16}
              aria-hidden
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              id="catalog-search"
              type="search"
              defaultValue={currentParams.q}
              onBlur={(e) => updateFilter("q", e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                updateFilter("q", (e.target as HTMLInputElement).value)
              }
              placeholder="عنوان یا نویسنده..."
              className="w-full rounded-[var(--radius-control)] border border-[var(--hairline)] bg-transparent py-2 pr-9 pl-3 outline-none focus-visible:border-[var(--focus-ring)]"
            />
          </div>
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 text-sm text-[var(--text-muted)]">موضوع</legend>
          {categories.map((cat) => (
            <label
              key={cat.slug}
              className="flex items-center gap-2 text-sm cursor-pointer hover:text-[var(--link)]"
            >
              <input
                type="radio"
                name="category"
                checked={currentParams.category === cat.slug}
                onChange={() =>
                  updateFilter(
                    "category",
                    currentParams.category === cat.slug ? null : cat.slug
                  )
                }
                className="accent-[var(--accent)]"
              />
              {cat.name}
            </label>
          ))}
          {currentParams.category && (
            <button
              onClick={() => updateFilter("category", null)}
              className="text-xs text-[var(--link)] underline text-right mt-1"
            >
              حذف فیلتر موضوع
            </button>
          )}
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 text-sm text-[var(--text-muted)]">نویسنده</legend>
          <select
            value={currentParams.author || ""}
            onChange={(e) => updateFilter("author", e.target.value || null)}
            className="rounded-[var(--radius-control)] border border-[var(--hairline)] bg-transparent px-2 py-1.5 outline-none focus-visible:border-[var(--focus-ring)] text-sm"
          >
            <option value="">همه‌ی نویسندگان</option>
            {authors.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.name}
              </option>
            ))}
          </select>
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 text-sm text-[var(--text-muted)]">قطع</legend>
          {sizes.map((size) => (
            <label
              key={size}
              className="flex items-center gap-2 text-sm cursor-pointer hover:text-[var(--link)]"
            >
              <input
                type="radio"
                name="size"
                checked={currentParams.size === size}
                onChange={() =>
                  updateFilter("size", currentParams.size === size ? null : size)
                }
                className="accent-[var(--accent)]"
              />
              {size}
            </label>
          ))}
        </fieldset>

        <div className="flex flex-col gap-2">
          <label htmlFor="max-price" className="text-sm text-[var(--text-muted)]">
            حداکثر قیمت: <span className="ltr-run">{formatToman(currentParams.maxPrice || 400000)}</span> تومان
          </label>
          <input
            id="max-price"
            type="range"
            min={100000}
            max={400000}
            step={5000}
            defaultValue={currentParams.maxPrice || 400000}
            onChange={(e) => updateFilter("maxPrice", Number(e.target.value))}
            className="accent-[var(--accent)]"
          />
        </div>
      </aside>

      <div className={`flex flex-col gap-6 ${isPending ? "opacity-50 transition-opacity" : ""}`}>
        <div className="flex items-center justify-between gap-4 border-b border-[var(--hairline)] pb-4">
          <p className="text-sm text-[var(--text-muted)]" role="status">
            <span className="ltr-run">{books.length}</span> کتاب از <span className="ltr-run">{totalBooks}</span> عنوان
          </p>
          <label className="flex items-center gap-2 text-sm">
            مرتب‌سازی:
            <select
              value={currentParams.sort || "newest"}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="rounded-[var(--radius-control)] border border-[var(--hairline)] bg-transparent px-2 py-1 outline-none focus-visible:border-[var(--focus-ring)]"
            >
              <option value="newest">جدیدترین</option>
              <option value="price-asc">ارزان‌ترین</option>
              <option value="price-desc">گران‌ترین</option>
            </select>
          </label>
        </div>

        {books.length === 0 ? (
          <div className="py-16 text-center text-[var(--text-muted)] flex flex-col gap-4">
            <p className="font-display text-2xl">کتابی با این مشخصات پیدا نشد.</p>
            <p className="text-sm">لطفاً فیلترها را تغییر دهید یا جستجوی دیگری را امتحان کنید.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
            {books.map((book) => (
              <BookCover key={book.slug} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}