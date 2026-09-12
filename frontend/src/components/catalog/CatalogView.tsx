"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Book, BookSize } from "@/lib/types";
import BookCover from "@/components/book/BookCover";

interface CatalogViewProps {
  books: Book[];
}

type SortKey = "newest" | "price-asc" | "price-desc";

function uniqueSorted<T>(values: T[]): T[] {
  return Array.from(new Set(values)).sort();
}

export default function CatalogView({ books }: CatalogViewProps) {
  const [query, setQuery] = useState("");
  const [authors, setAuthors] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [sizes, setSizes] = useState<BookSize[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(400000);
  const [sort, setSort] = useState<SortKey>("newest");

  const allAuthors = useMemo(() => uniqueSorted(books.map((b) => b.author)), [books]);
  const allCategories = useMemo(() => uniqueSorted(books.map((b) => b.category)), [books]);
  const allSizes = useMemo(() => uniqueSorted(books.map((b) => b.bookSize)), [books]);

  function toggle<T>(list: T[], value: T, setter: (v: T[]) => void) {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  const filtered = useMemo(() => {
    let result = books.filter((b) => {
      if (query && !`${b.title} ${b.author}`.includes(query)) return false;
      if (authors.length && !authors.includes(b.author)) return false;
      if (categories.length && !categories.includes(b.category)) return false;
      if (sizes.length && !sizes.includes(b.bookSize)) return false;
      if (inStockOnly && !b.inStock) return false;
      if (b.priceToman > maxPrice) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      if (sort === "price-asc") return a.priceToman - b.priceToman;
      if (sort === "price-desc") return b.priceToman - a.priceToman;
      return b.year - a.year;
    });

    return result;
  }, [books, query, authors, categories, sizes, inStockOnly, maxPrice, sort]);

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-[240px_1fr]">
      {/* ---------- Filters ---------- */}
      <aside aria-label="فیلترها" className="flex flex-col gap-8">
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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="عنوان یا نویسنده..."
              className="w-full rounded-[var(--radius-control)] border border-[var(--hairline)] bg-transparent py-2 pr-9 pl-3 outline-none focus-visible:border-[var(--focus-ring)]"
            />
          </div>
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 text-sm text-[var(--text-muted)]">موضوع</legend>
          {allCategories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={categories.includes(cat)}
                onChange={() => toggle(categories, cat, setCategories)}
                className="accent-[var(--accent)]"
              />
              {cat}
            </label>
          ))}
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 text-sm text-[var(--text-muted)]">نویسنده</legend>
          {allAuthors.map((author) => (
            <label key={author} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={authors.includes(author)}
                onChange={() => toggle(authors, author, setAuthors)}
                className="accent-[var(--accent)]"
              />
              {author}
            </label>
          ))}
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 text-sm text-[var(--text-muted)]">قطع</legend>
          {allSizes.map((size) => (
            <label key={size} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={sizes.includes(size)}
                onChange={() => toggle(sizes, size, setSizes)}
                className="accent-[var(--accent)]"
              />
              {size}
            </label>
          ))}
        </fieldset>

        <div className="flex flex-col gap-2">
          <label htmlFor="max-price" className="text-sm text-[var(--text-muted)]">
            حداکثر قیمت:{" "}
            <span className="ltr-run">{new Intl.NumberFormat("fa-IR").format(maxPrice)}</span>{" "}
            تومان
          </label>
          <input
            id="max-price"
            type="range"
            min={100000}
            max={400000}
            step={5000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="accent-[var(--accent)]"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="accent-[var(--accent)]"
          />
          فقط کتاب‌های موجود
        </label>
      </aside>

      {/* ---------- Results ---------- */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-[var(--text-muted)]" role="status">
            <span className="ltr-run">{filtered.length}</span> کتاب پیدا شد
          </p>
          <label className="flex items-center gap-2 text-sm">
            مرتب‌سازی:
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-[var(--radius-control)] border border-[var(--hairline)] bg-transparent px-2 py-1 outline-none focus-visible:border-[var(--focus-ring)]"
            >
              <option value="newest">جدیدترین</option>
              <option value="price-asc">ارزان‌ترین</option>
              <option value="price-desc">گران‌ترین</option>
            </select>
          </label>
        </div>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-[var(--text-muted)]">
            کتابی با این فیلترها پیدا نشد. فیلترها را کمتر کنید.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
            {filtered.map((book) => (
              <BookCover key={book.slug} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
