import { notFound } from "next/navigation"
import BookForm from "@/components/admin/BookForm"
import { adminGetBookById, adminGetFormOptions } from "@/lib/data/admin/books"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditBookPage({ params }: PageProps) {
  const { id } = await params
  const book = await adminGetBookById(id)

  if (!book) {
    notFound()
  }

  const { authors, categories } = await adminGetFormOptions()

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl">ویرایش کتاب</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{book.title}</p>
      </header>

      <BookForm
        mode="edit"
        bookId={book.id}
        authors={authors}
        categories={categories}
        initial={{
          title: book.title,
          slug: book.slug,
          authorId: book.authorId,
          translatorId: book.translatorId ?? "",
          categoryId: book.categoryId,
          description: book.description ?? "",
          excerpt: book.excerpt ?? "",
          isbn: book.isbn ?? "",
          sku: book.sku,
          year: book.year?.toString() ?? "",
          yearFa: book.yearFa ?? "",
          pages: book.pages?.toString() ?? "",
          priceToman: book.priceToman.toString(),
          bookSize: book.bookSize,
          coverTone: book.coverTone,
          status: book.status,
          inStock: book.inStock ? "true" : "false",
          isPreorder: book.isPreorder ? "true" : "false",
        }}
      />
    </div>
  )
}