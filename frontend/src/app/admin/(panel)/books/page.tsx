import Link from "next/link"
import { adminGetBooks } from "@/lib/data/admin/books"
import { DeleteBookButton } from "@/components/admin/DeleteBookButton"

const statusLabels: Record<string, string> = {
  draft: "پیش‌نویس",
  published: "منتشر شده",
  out_of_stock: "ناموجود",
  discontinued: "متوقف شده",
}

export default async function AdminBooksPage() {
  const books = await adminGetBooks()

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">کتاب‌ها</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{books.length} کتاب</p>
        </div>
        <Link
          href="/admin/books/new"
          className="rounded-[var(--radius-control)] bg-[var(--foreground)] px-4 py-2 text-sm text-[var(--background)] hover:opacity-90"
        >
          افزودن کتاب
        </Link>
      </header>

      <div className="overflow-x-auto rounded-[var(--radius-control)] border border-[var(--hairline)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface-raised)] text-right">
            <tr>
              <th className="px-4 py-3 font-medium">عنوان</th>
              <th className="px-4 py-3 font-medium">نویسنده</th>
              <th className="px-4 py-3 font-medium">دسته</th>
              <th className="px-4 py-3 font-medium">قیمت (تومان)</th>
              <th className="px-4 py-3 font-medium">وضعیت</th>
              <th className="px-4 py-3 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--hairline)]">
            {books.map((book) => (
              <tr key={book.id}>
                <td className="px-4 py-3 font-medium">{book.title}</td>
                <td className="px-4 py-3 text-[var(--text-muted)]">{book.author.name}</td>
                <td className="px-4 py-3 text-[var(--text-muted)]">{book.category.name}</td>
                <td className="px-4 py-3 ltr-run">{book.priceToman.toLocaleString("fa-IR")}</td>
                <td className="px-4 py-3">
                  <span className="rounded border border-[var(--hairline)] bg-[var(--surface-raised)] px-2 py-0.5 text-xs">
                    {statusLabels[book.status] ?? book.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/books/${book.id}/edit`}
                      className="rounded border border-[var(--hairline)] px-3 py-1 text-xs hover:bg-[var(--surface-raised)]"
                    >
                      ویرایش
                    </Link>
                    <DeleteBookButton bookId={book.id} title={book.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}