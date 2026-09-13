import type { Metadata } from "next";
import Link from "next/link";
import { getUniqueAuthors, getBooksByAuthor } from "@/data/books";

export const metadata: Metadata = {
  title: "نویسندگان",
  description: "فهرست نویسندگان و مترجمان همکار با نشر نونگاران.",
};

export default function AuthorsPage() {
  const authors = getUniqueAuthors();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl mb-8">نویسندگان</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {authors.map((author) => {
          const bookCount = getBooksByAuthor(author.slug).length;
          return (
            <Link 
              key={author.slug} 
              href={`/nevisandegan/${author.slug}`}
              className="group p-6 border border-[var(--hairline)] rounded-[var(--radius-control)] hover:border-[var(--link)] transition-colors bg-[var(--surface-raised)]"
            >
              <h2 className="font-display text-2xl mb-2 group-hover:text-[var(--link)]">
                {author.name}
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                <span className="ltr-run">{bookCount}</span> کتاب
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}