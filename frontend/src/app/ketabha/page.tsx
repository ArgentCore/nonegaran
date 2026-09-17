import type { Metadata } from "next";
import { getBooks } from "@/lib/data/books";
import { toOldBooks } from "@/lib/data/mapper";
import CatalogClient from "@/components/catalog/CatalogClient";

export const metadata: Metadata = {
  title: "کتاب‌ها",
  description: "مرور و جستجوی کتاب‌های نشر نونگاران بر اساس موضوع، نویسنده، قیمت و قطع.",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BookListingPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const q = typeof params.q === "string" ? params.q : "";
  const category = typeof params.category === "string" ? params.category : undefined;
  const author = typeof params.author === "string" ? params.author : undefined;
  const size = typeof params.size === "string" ? params.size : undefined;
  const sort = typeof params.sort === "string" ? params.sort : "newest";
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : 400000;

  const dbBooks = await getBooks({ status: "published" });
  const allBooks = toOldBooks(dbBooks);

  let filtered = [...allBooks];

  if (q) {
    filtered = filtered.filter(
      (b) => b.title.includes(q) || b.author.includes(q)
    );
  }
  if (category) {
    filtered = filtered.filter((b) => b.categorySlug === category);
  }
  if (author) {
    filtered = filtered.filter((b) => b.authorSlug === author);
  }
  if (size) {
    filtered = filtered.filter((b) => b.bookSize === size);
  }
  filtered = filtered.filter((b) => b.priceToman <= maxPrice);

  if (sort === "price-asc") {
    filtered.sort((a, b) => a.priceToman - b.priceToman);
  } else if (sort === "price-desc") {
    filtered.sort((a, b) => b.priceToman - a.priceToman);
  } else {
    filtered.sort((a, b) => b.year - a.year);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl mb-8">همه‌ی کتاب‌ها</h1>
      <CatalogClient
        books={filtered}
        totalBooks={allBooks.length}
        currentParams={{ q, category, author, size, maxPrice, sort }}
      />
    </div>
  );
}