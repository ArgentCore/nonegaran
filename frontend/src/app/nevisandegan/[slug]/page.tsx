import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getBooksByAuthor, getUniqueAuthors } from "@/data/books";
import BookCover from "@/components/book/BookCover";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const authors = getUniqueAuthors();
  const author = authors.find(a => a.slug === slug);
  if (!author) return { title: "نویسنده یافت نشد" };

  return {
    title: `آثار ${author.name}`,
    description: `مجموعه آثار ${author.name} منتشر شده در نشر نونگاران.`,
  };
}

export function generateStaticParams() {
  return getUniqueAuthors().map((a) => ({ slug: a.slug }));
}

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params;
  const authors = getUniqueAuthors();
  const author = authors.find(a => a.slug === slug);

  if (!author) {
    notFound();
  }

  const books = getBooksByAuthor(slug);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <nav aria-label="مسیر راهنما" className="mb-8 flex items-center gap-2 text-sm text-[var(--text-muted)]">
        <Link href="/" className="hover:text-[var(--link)]">خانه</Link>
        <ChevronLeft size={14} aria-hidden className="opacity-50" />
        <Link href="/nevisandegan" className="hover:text-[var(--link)]">نویسندگان</Link>
        <ChevronLeft size={14} aria-hidden className="opacity-50" />
        <span aria-current="page" className="text-[var(--foreground)]">{author.name}</span>
      </nav>

      <header className="mb-12 border-b border-[var(--hairline)] pb-8">
        <h1 className="font-display text-4xl md:text-5xl mb-4">{author.name}</h1>
        <p className="text-[var(--text-muted)] max-w-[60ch] leading-8">
          مجموعه‌ای از آثار این نویسنده که در نشر نونگاران منتشر شده است.
        </p>
      </header>

      <section aria-labelledby="books-heading">
        <h2 id="books-heading" className="sr-only">کتاب‌های {author.name}</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4">
          {books.map((book) => (
            <BookCover key={book.slug} book={book} />
          ))}
        </div>
      </section>
    </div>
  );
}